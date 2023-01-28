'use strict';

// had enabled by egg
// exports.static = true;
exports.mysql = {
  enable:true,
  package:'egg-mysql'
}
exports.routerGroup = {
  enable:true,
  package:'egg-router-group'
}
//egg-socket.io
exports.io = {
  enable:true,
  package:'egg-socket.io'
}