
//webrtc有关
module.exports = app => {
    const { router, controller, io } = app;
    // console.log('io=>',io)
    const {
        message,
        join,
        leave,
        close,
        offer,
        answer,
        candidate
    } = io.controller.socket
    // const jwt = app.middleware.jwt(app)
    // app.io.of('/')
  
    /**
     *   of()代表 客户端连接的是http://127.0.0.1:8080/
     *  route后面是 客户端发送的事件名称
     */

    io.of('/webrtc').route('message', message);
    io.of('/webrtc').route('join', join);
    io.of('/webrtc').route('leave', leave);
    io.of('/webrtc').route('close', close);
    //处理offer
    io.of('/webrtc').route('offer', offer);
    //处理answer
    io.of('/webrtc').route('answer', answer);
    //处理candidate
    io.of('/webrtc').route('candidate', candidate);
    // app.io.of('/chat')
    // io.of('/chat').route('chat', addWebRTC);
}