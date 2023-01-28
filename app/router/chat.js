//聊天的相关的
module.exports = app => {
    const {  io } = app;
    // console.log('io=>',io)
    const {
        message,
        join,
        leave
    } = io.controller.chat
    // const jwt = app.middleware.jwt(app)
    // app.io.of('/')
  
    /**
     *   of()代表 客户端连接的是http://127.0.0.1:8080/
     *  route后面是 客户端发送的事件名称
     */

    io.of('/chat').route('message', message);
    io.of('/chat').route('join', join);
    io.of('/chat').route('leave', leave);

    // app.io.of('/chat')
    // io.of('/chat').route('chat', addWebRTC);
}