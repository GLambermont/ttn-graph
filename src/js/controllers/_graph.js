import { select, createEl } from '../_helpers';
import { eventDispatcher } from '../_singletons';
import { canvasDrawCurve } from '../_helpers';

const canvasEl = select('.js-graph-canvas');
const ctx = canvasEl.getContext('2d');
const graphScale = {
  x: 75,
  y: 4
};  

const graphGradient = ctx.createLinearGradient(0, 0, 0, 400);
graphGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
graphGradient.addColorStop(1, 'transparent');

let graphPoints = [];

const resizeCanvas = (width, height) => {
  canvasEl.width = width;
  canvasEl.height = height;
};

class GraphPoint {
  constructor(dataPoint) {  
    console.log('[GRAPH] new point', dataPoint);
    
    this.position = {
      x: canvasEl.offsetWidth,
      y: dataPoint * graphScale.y
    }
    this.targetPosition = { ...this.position }  
    this.radius = 8;
    this.moveSpeed = 0.1;
  }

  move(x, y) {
    this.targetPosition.x += x;
    this.targetPosition.y += y;    
  }

  update() {    
    this.position.x += (this.targetPosition.x - this.position.x) * this.moveSpeed;
    this.position.y += (this.targetPosition.y - this.position.y) * this.moveSpeed;

    if (this.position.x < -graphScale.x) graphPoints.shift();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }
}

const updateGraph = data => {
  graphPoints.forEach(point => point.move(-graphScale.x, 0));
  graphPoints.push(new GraphPoint(data));
};

const drawCurve = (ctx, points, tension = 1) => {
  ctx.beginPath();
  ctx.moveTo(points[0].position.x, points[0].position.y);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = (i > 0) ? points[i - 1] : points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = (i != points.length - 2) ? points[i + 2] : p2;
    const cp1 = {
      x: p1.position.x + (p2.position.x - p0.position.x) / 6 * tension,
      y: p1.position.y + (p2.position.y - p0.position.y) / 6 * tension
    }
    const cp2 = {
      x: p2.position.x - (p3.position.x - p1.position.x) / 6 * tension,
      y: p2.position.y - (p3.position.y - p1.position.y) / 6 * tension
    }

    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p2.position.x, p2.position.y);
  }
  ctx.stroke();
}

const draw = () => {
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

  graphPoints.forEach(point => {
    point.update();
    point.draw();
  });

  if (graphPoints.length > 0) {
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    drawCurve(ctx, graphPoints);
    
    ctx.lineTo(canvasEl.width, canvasEl.height);
    ctx.lineTo(graphPoints[0].position.x, canvasEl.height);
    ctx.strokeStyle = '';
    ctx.fillStyle = graphGradient;
    ctx.fill(); 
  }
  
  requestAnimationFrame(draw);
};

const printConsoleMessage = message => {
  const consoleEl = select('.js-graph-console');
  
  const messageEl = createEl('pre');
  const textNode = document.createTextNode(message);

  messageEl.classList.add('graph__console-message');

  messageEl.append(textNode)
  consoleEl.append(messageEl);
};

const addEventListener = () => {
  eventDispatcher.on('socketConnect', () => printConsoleMessage('Connection with server established'));
  eventDispatcher.on('socketDisconnect', () => printConsoleMessage('Lost connection with server'));
  eventDispatcher.on('graphUpdate', data => {
    printConsoleMessage(`TTN Message received. Payload: ${data}`);
    updateGraph(data);
  });
};

const init = () => {
  printConsoleMessage('Initializing graph');

  resizeCanvas(864, 480);
  draw();
  addEventListener();
};

window.addEventListener('resize', e => resizeCanvas(e.width, e.height));

export { init };