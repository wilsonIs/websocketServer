Nodejs Websocket服务端


## 构建项目

    npm install             # 安装依赖文件
    npm run dev             # 开发环境运行
    npm run start           # 线上环境运行
    npm run pm2-dev         # pm2执行开发环境
    mpm run pm2             # pm2执行线上环境

## 项目说明

	需求设计：
	- web端与App端通信
	- App端与App端通信
	- App端与.net后台数据传递
	- web端与.net后台数据传递
	- nodejs+socketio 实现的消息服务器

websocket服务端作为独立的中间服务，承担web端与app端的实时通信功能。将web端用户的界面交互和app端的实时数据相联通。

并可通过api.js实现的router模块，实现承担起部分后台数据接口的能力。还可以通过http模块，实现主动向业务后台获取数据的功能。

这里已经将实际开发中的项目进行了抽离，去掉了主要的业务逻辑，通过socketio+nodejs来实现的一个Demo。

客户端只提供了js，界面交互有需要的请自行设计。

## 服务端代码（部分）
	
	//存储所有登录用户的信息
	global.users = [];
	global.io = io;
	
	//不同登录端，设置不同的命名空间
	const webSpace = io.of('/web');//pc-web端
	const appSpace = io.of('/app');//app端

	//app端命名空间
	appSpace.on('connection', function(socket) {
		//do something......
	})

	//pc-web端命名空间
	webSpace.on('connection', function(socket) {
		//do something......
	})

## 客户端代码（部分）

	import './socket.io';

	//不同环境的服务端地址可在后台配置
	const listenUrl = 'http://localhost:8082/web';

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
		......
		......
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
	

## 功能逻辑
如下图所示:
![功能逻辑示意图](https://i.imgur.com/wEF1Otm.png)

## 参考资料

1. [socket.io官方文档中文版](https://zhuanlan.zhihu.com/p/29148869 "socket.io官方文档中文版")
2. [socket.io仓库](https://github.com/socketio/socket.io "socket.io")
3. [websocket探索其与语音、图片的能力](http://www.alloyteam.com/2015/12/websockets-ability-to-explore-it-with-voice-pictures/ "websocket探索其与语音、图片的能力")
4. [利用 socket.io 实现消息实时推送](http://www.wukai.me/2017/08/27/push-message-with-socketio/ "利用 socket.io 实现消息实时推送")
    
