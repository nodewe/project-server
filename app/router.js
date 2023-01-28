      'use strict';
//用户相关的路由
const userRouter = require('./router/user.js');
//文件相关的路由
const fileRouter = require('./router/file.js')
//文章相关的路由
const articleRouter = require('./router/article.js')
//视频相关的路由
const videoRouter = require('./router/video.js')
//webRTC相关
const webrtcRouter = require('./router/webrtc.js')
// 聊天相关的
const chatRouter = require("./router/chat.js")
//Cesium 相关的逻辑
const cesiumRouter = require("./router/cesium.js")
// 
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller ,io} = app;
 //验证码
  router.get('/captchaImage', controller.util.captcha)
  // 用户的路由
  userRouter(app)
  //文件相关的操作
  fileRouter(app)
  //文章相关的
  articleRouter(app)
  //视频相关的
  videoRouter(app)
  //webrtc相关
  webrtcRouter(app)
  //聊天相关的
  chatRouter(app)
  // io.of.route('chat',app.io.controller.socket.addWebRTC)
  // cesium 相关的
  cesiumRouter(app)

};
