const BaseController = require('../../controller/base');

const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');
//聊天相关的
class ChatController extends BaseController {
    //客户端消息事件
    message() {
        const { ctx, app } = this
        // console.log(this.ctx.args, '消息')
        //房间的id  发送的信息 发送 userid
        const data = this.ctx.args[0];
        // const message = this.ctx.args[1];
        //使用改命名空间
        const socket = app.io.of('/chat');
        // console.log(socket,'socket')
        const myRoom = socket.adapter.rooms[data.roomId]
        // console.log('myRoom+>',myRoom)
        // const myRoom = socket.adapter.rooms[roomId]
        socket.in(data.roomId).emit('message', data)

    }
    //客户端加入事件
    join() {
        const { ctx, app } = this;
        const {roomId} = this.ctx.args[0]
        this.ctx.socket.join(roomId)
        const socket = app.io.of('/chat');
        // console.log(socket,'socket')
        // const myRoom = socket.adapter.rooms[roomId]
        socket.in(roomId).emit('joined', roomId, ctx.socket.id)
    }
    //客户离开事件
    leave() {
        const { ctx, app } = this;
        const roomId = this.ctx.args[0]
        const msg = this.ctx.args[1]
        const socket = app.io.of('/chat');
        console.log(socket, 'socket')
        const myRoom = socket.adapter.rooms[roomId]
        // let users = Object.keys(myRoom.sockets).length;

        ctx.socket.leave(roomId)
        // ctx.socket.emit('joined',roomId,socket.id)
        // 除自己之外所有人
        socket.in(roomId).emit('leaved', msg)
        // ctx.socket.to(roomId).emit('joined',roomId,socket.id)
        // app.io.in(roomId).emit('joined',roomId,socket.id);
        // ctx.socket.broadcast.emit('leaved',roomId,ctx.socket.id)
    }
}

module.exports = ChatController;