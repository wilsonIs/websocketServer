const express = require('express');
const router = express.Router();
const { rpRequest } = require('./../http');
const { getSocketId } = require('./../utils');

router.use(function timeLog(req, res, next) {
    const m = new Date();
    const dateString = `${m.getFullYear()}/${m.getMonth() +
        1}/${m.getDate()}  ${m.getHours()}:${m.getMinutes()}:${m.getSeconds()}`;
    console.log('Time: ', dateString);
    next();
});

router.post('/api', function(req, res) {
    if (process.env.NODE_ENV === 'development') {
        console.log("----------------- this is req's body -----------------");
        console.log(req.body);
        console.log('------------------------------------------------------\n');
    }

    const { users = [], entityType = '', data = {} } = req.body;
    users.forEach(userId => {
        const socketIds = getSocketId(users, userId);

        // 当后端post了一个消息时，通知client进行处理
        socketIds.forEach(function(socketId) {
            io.sockets.to(socketId).emit('receive_message', {
                entityType,
                data
            });
        });
    });

    res.send({
        responseCode: 200,
        message: null,
        data: 'OK!'
    });
});

router.post('/login',function(req,res) {
    console.log(req.body);
})



module.exports = router;
