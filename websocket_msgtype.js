//1、websocket协议类型:jsonrpc

//2、消息类型：msg_type
//2.1. 连接：connection
//2.2. 连接断开：disconnect
//2.3. 登录：user_login
//2.4. 发送消息：message
//2.5. 接收消息：receive_message
//2.6. 语音拨出: call_up
//2.7. 语音拨入：call_in
//2.8. 登录成功：login_info {succeed:true}
//示例：
websocket.on('connect',(msg)=>{
	websocket.emit('user_login',{
		userId:"***********",           //用户唯一识别码
		socketId:"***********",         //socket自动生成,多个页面则产生多个id
		productId:"***********",        //关联的业务id
		itemId:"***********",           //关联的业务id，如果有
		onCallStatu:"",                 //通话状态
		onCallId:"****",                //通话id
	})
})


//3、语音消息传递相关状态
onCallStatu:[
	0,   //静默状态
	1,   //呼叫中
	2,   //通话中
	3,   //通话结束
	4,   //未接通
	5,   //通话记录已生成
]

