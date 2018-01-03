import './socket.io';

const listenUrl = 'http://localhost:8082/web';
const config = {
    userId:'******',
    userName:'******',
    onCallStatu:0,
    callType:'',
    productId:'******',
    itemId:'******',
    onCallId:'******'
}

initSocket(listenUrl);

function initSocket(listenUrl) {
    const msgSocket = io(listenUrl, {
        'reconnectionAttempts': 10, // 限制对于 socket 服务器的重连次数为10次
    });
    window.msgSocket = msgSocket;

    //自动连接
    msgSocket.on('connect', () => {
        msgSocket.emit('user_login', {
            userId: config.userId,
            socketId: msgSocket.id,
            userName: config.userName,
        });
        console.log('websocket_user_login');
    });

    //判断用户是否登录app端,事件触发
    msgSocket.emit('check_app_status', {
        userId: config.userId,
        socketId: msgSocket.id,
    })

    msgSocket.on('check_app_status', (info) => {
        if(info.status) {
            //do something...
        }else {
            //do something...
        }
    });

    //语音拨出,事件触发
    msgSocket.emit('call_up',{
        userId: config.userId,
        socketId: msgSocket.id,
        userName: config.userName,
        productId:config.productId,
        itemId:config.itemId,
        onCallId:config.onCallId
    });

    //语音呼入
    msgSocket.on('call_in', (info) => {
        console.log(info);
        config.callType = 'call_in';
        config.onCallStatu = info.onCallStatu;
        if(info.onCallStatu == 1){
            //do something......watch监听吧
        }
    });

    msgSocket.on('error_message', (info) => {
        shortTips(info.message);
    });

    msgSocket.on('reconnect_error', (error) => {
        console.log('ws通信服务器连接失败');
    });

    msgSocket.on('connect_timeout', (error) => {
        shortTips('ws通信连接超时');
    });
}
