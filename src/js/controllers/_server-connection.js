import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import { eventDispatcher } from '../_singletons';

const serverUrls = {
  dev: 'localhost:8080',
  dist: 'example.com'
}

const socket = io(serverUrls[IS_DEV ? 'dev' : 'dist']);

// Create uuid and register with this id
localStorage.setItem('socketUUID', uuidv4());
socket.emit('userRegister', localStorage.getItem('socketUUID'));

socket.on('connect', () => eventDispatcher.emit('socketConnect'));
socket.on('disconnect', () => eventDispatcher.emit('socketDisconnect'));
socket.on('reconnectAttempt', () => {
  socket.io.opts.transports = ['polling', 'websocket'];
  console.log('Trying to reconnect to server.');
});

socket.on('ttnMessage', data => {  
  const decodedData = Buffer.from(data.payload_raw, 'hex')[0];
  
  eventDispatcher.emit('graphUpdate', decodedData);
});

/**
 * Ping to the server.
 * @returns {Promise} Promise containing latency as a DOMHighResTimeStamp. 
 */
const ping = async () => {
  const startTime = performance.now();
  let latency = 0;

  socket.emit('ping');
  socket.on('pong', () => latency = performance.now() - startTime);

  return latency;
};

export { ping };