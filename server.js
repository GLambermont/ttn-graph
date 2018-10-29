import yargs from 'yargs';
import express from 'express'; 
import compression from 'compression';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import createWebpackConfig from './webpack.config.babel.js';
import http from 'http';
import { data as ttnData } from 'ttn';
import SocketIO from 'socket.io';

const argv = yargs.argv;
const webpackConfig = createWebpackConfig(process.env, argv); 
const app = express();
const server = http.Server(app);
const io = new SocketIO(server);
const port = argv.port || process.env.PORT || 8080;
const users = [];
const connectedUsers = [];

const initServer = () => {
  app.use(compression());
  
  // Setup webpack middleware if in development mode
  if (argv.mode === 'development') {
    app.use(webpackMiddleware(webpack(webpackConfig)));
  } else {
    app.use(express.static(__dirname + '/dist'));
  }

  server.listen(port, '0.0.0.0', err => {
    if (err) console.error(err);
    console.info('[INFO] Serving on http://0.0.0.0:%s/', port);
  });
};

const initTTN = async () => {
  const appID = 'iot_lab_grasso';
  const accessKey = 'ttn-account-v2.GBvB9sfgmmdiF1S3jwwlnCp1cYBZ9b06TisIrmtb2-Q';
  const client = await ttnData(appID, accessKey);

  client.on('uplink', (devId, payload) => {
    io.emit('ttnMessage', payload);
    console.log('[INFO] TTN uplink');
  });
};

const initSocket = () => {
  io.on('connection', socket => {
    let connectionUid = null;

    socket.on('userRegister', uuid => {
      if (!connectedUsers.includes(uuid)) connectedUsers.push(uuid);
      
      if (!users.includes(uuid)) {
        console.log('[INFO] New user connected:', uuid);
        users.push(uuid);
  
        // notify other clients that a new user has joined
        socket.emit('userJoined', {
          uid: uuid,
          userCount: connectedUsers.length
        });
      }
  
      connectionUid = uuid;
    });
  
    socket.on('userDisconnect', () => {
      connectedUsers.splice(connectedUsers.indexOf(connectionUid), 1);
  
      setTimeout(() => {
        if (!connectedUsers.includes(connectionUid)) {
          socket.emit('userLeft', { name: connectionUid });
          users.splice(users.indexOf(connectionUid), 1);
        }
      }, 3000);
    });

    socket.on('ping', () => io.emit('pong'));
  });
};

const init = () => {
  initTTN().catch(err => console.error(err));
  initSocket();
  initServer();
};

init();

