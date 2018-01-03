const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
//其它端向websocket服务端发请求工具
const apiRoute = require('./src/routes/api');
const port = 8082;
const { addSocketId, getSocketId, getAppSocketId, deleteSocketId } = require('./src/utils');
//websocket服务端向后台发请求工具
const { rpRequest } = require('./src/http');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });


//设置允许访问域的值
io.origins(['*:*','*:17984']);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

//Log error responses
app.use(morgan('combined', { stream: accessLogStream }));

//站点静态页面.可以做个简单的后台信息记录，如当前在线用户
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api', function(req, res) {
    res.send('.');
});

// 后端向 '/api' 路径post相应消息
app.post('/api', apiRoute);


//存储所有登录用户的信息
global.users = [];
global.io = io;

//不同登录端，设置不同的命名空间
const webSpace = io.of('/web');//pc-web端
const appSpace = io.of('/app');//app端

//app端命名空间
appSpace.on('connection', function(socket) {
    socket.on('disconnect', function() {
        deleteSocketId(users, socket.id);

        if (process.env.NODE_ENV === 'development') {
            console.log('app user disconnected:', socket.id);
            displayUserInfo();
        }
    });

    socket.on('user_login', function(info) {
        info = JSON.parse(info.replace(/\\/g,''));
        socket.join('room' + info.userId,()=>{
            addSocketId(users, info);
            appSpace.to(socket.id).emit('login_info',{succeeded:true});

            if (process.env.NODE_ENV === 'development') {
                console.log('app user login:', info);
                displayUserInfo();
            }
        });
    });

    socket.on('call_up', function(info) {
        info = JSON.parse(info.replace(/\\/g,''));
        webSpace.to('room'+info.userId).emit('call_up', info);

        if (process.env.NODE_ENV === 'development') {
            console.log('app call up:', info);
            displayUserInfo();
        }
    });

    socket.on('call_in', function(info) {
        info = JSON.parse(info.replace(/\\/g,''));
        webSpace.to('room'+info.userId).emit('call_in', info);

        if (process.env.NODE_ENV === 'development') {
            console.log('app call in:', info);
            displayUserInfo();
        }
    });
});

//pc-web端命名空间
webSpace.on('connection', function(socket) {

    socket.on('disconnect', function() {
        deleteSocketId(users, socket.id);

        console.log('user disconnected:', socket.id);
        if (process.env.NODE_ENV === 'development') {
            displayUserInfo();
        }
    });

    socket.on('user_login', function(info) {
        //将同一个用户打开的多个页面加入到同一个房间，方便广播通知
        socket.join('room' + info.userId,()=>{
            addSocketId(users, info);

            if (process.env.NODE_ENV === 'development') {
                console.log('user login:', socket.id);
                displayUserInfo();
            }
        });
    });

    socket.on('call_up', function(info) {
        console.log('call_up:' + info.toCallId + ':' + info.productId);

        let appSocketId = getAppSocketId(users, info.userId);
        if(appSocketId){
            appSpace.to(appSocketId).emit('call_up',info);
        }else{
            webSpace.to(info.socketId).emit('error_message',{
                message:'未登录'
            })
        }
    });

    //通信前，判断app端是否登录
    socket.on('check_app_status', function(info) {
        console.log('check_app_status:' + info.userId);

        let appSocketId = getAppSocketId(users, info.userId);

        webSpace.to(info.socketId).emit('check_app_status',{
            status:appSocketId?1:0
        })
    })
});

http.listen(port, function() {
    console.log(`listening on port:${port}`);
});

function displayUserInfo() {
    console.log('当前登录用户信息：');
    console.log(users);
}
