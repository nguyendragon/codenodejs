import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoutes from './route/web';
import socketIoController from './controllers/socketIoController';
import cronJonController from './controllers/cronJonController';

var cookieParser = require('cookie-parser');
var cron = require('node-cron');

require('dotenv').config();

const port = process.env.PORT || 3001;
const app = express();

// tạo 1 sever socketio
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// config web
configViewEngine(app);

// cron 3p 1 lần theo giờ VN 1 ngày 480 lần
cronJonController.automomo(cron);
cronJonController.parityCron(cron, io);

// init route
initWebRoutes(app);

// Check xem ai connect vào sever
socketIoController.sendMessageAdmin(io);

server.listen(port, () => {
    console.log("Connected success port: " + port);
});