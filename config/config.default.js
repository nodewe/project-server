'use strict';
const path = require('path'),
process = require('process')
module.exports = appInfo => {
  const config = exports = {};
  //关闭安全验证 解决 invalid csrf token
  config.security = {
    csrf: {
      enable: false
    }
  }
  //修改端口
  config.cluster = {
    listen: {
      path: '',
      port: 8080,
      hostname: '0.0.0.0'
    }
  }
  // //配置数据库
  config.mysql = {
    client: {
      host: '127.0.0.1',
      //端口号
      port: '3306',
      //用户名
      user: 'root',
      //密码
      password: '123456',
      //数据库名
      database: 'admin'
    },
    //是否加载到app上
    app: true,
    // 是否加载到agent上 默认关闭
    agent: false
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515120760967_4795';
  // add your config here
  config.middleware = [];
  //
  config.jwt = {
    security: '@Kaikeba@111'
  }
  //配置静态字眼托管
  config.static = {
    prefix: '/public',
    dir: path.join(appInfo.baseDir, 'app/public'),
    // dirs: [ dir1, dir2 ] or [ dir1, { prefix: '/static2', dir: dir2 } ],
    // support lazy load
    dynamic: true,
    preload: false,
    buffer: false,
    maxFiles: 1000,
  };
  //配置文件上传
  config.multipart = {
    mode: 'file',
    whitelist: () => true
  };
  //配置上传目录
  config.UPLOAD_DIR = path.join(appInfo.baseDir, 'app/public/file')
  // config.view = {
  //   defaultViewEngine: 'nunjucks',
  //   mapping: {
  //     '.html': 'nunjucks',
  //   },
  // };
  // config.io = {
  //   namespace: {
  //     '/': {
  //       connectionMiddleware: ['auth'],
  //       packetMiddleware: ['filter'],
  //     },
  //   },
  // }
  config.io = {
    init: {},
    namespace: {
      '/': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/webrtc': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
      '/chat': {
        connectionMiddleware: [],
        packetMiddleware: [],
      },
    },
  }
  config.rundir = process.cwd() + '/run'
  return config;
};
