import express from 'express';
import configViewEngine from './configs/viewEngine';
import initWebRoutes from './route/web';
import socketIoController from './controllers/socketIoController';
import cronJonController from './controllers/cronJonController';
import rateLimit from 'express-rate-limit';

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


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5000,
    message: 'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
})


// Apply the rate limiting middleware to all requests
app.use(limiter)

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