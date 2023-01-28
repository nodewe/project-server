const BaseController = require('../../controller/base.js');

const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');
const roomMap = new Map()
class WebRTCController extends BaseController {
    // 添加WebRTC
    async addWebRTC() {
        const { ctx } = this;
        // this.ctx.socket.emit('connect','连接成功')
        // const query = this.ctx.sokcet.handshake.query
        // console.log('query=>',query)
        console.log(this.ctx.args, '消息')
        const message = this.ctx.args[0];
        console.log('chat :', message + ' : ' + process.pid);
        // const say = await this.ctx.service.user.say();
        this.ctx.socket.emit('res', '你好');
    }

    //客户端消息事件
    message() {
        const { ctx, app } = this;
        const roomId = this.ctx.args[0];
        const socket = app.io.of('/webrtc');
        // console.log(socket,'socket')
        const myRoom = socket.adapter.rooms[roomId]
        if (myRoom.length > 1) {
            app.io.in(roomId).emit('message', message)
            // ctx.socket.broadcast.emit()
        } else {
            ctx.socket.emit('message', message)
        }

    }
    //客户端加入事件
    join() {
        const { ctx, app } = this;
        const { roomId, uid } = this.ctx.args[0]
        let room = roomMap.get(roomId)
        //如果房间不存在
        if (!room) {
            //创建一个房间key的存在
            roomMap.set(roomId, [])
        }
        //获取房间的成员
        room = roomMap.get(roomId)
        if (room.length == 2) {
            room.pop();
            return console.log('房间人数已满')
        }
        room.push({
            roomId,
            uid
        })
        this.ctx.socket.join(roomId)

        console.log(`${uid}加入房间=>${roomId}`)

        const socket = app.io.of('/webrtc');
        // console.log(socket,'socket')
        // const roomUsers = socket.adapter.rooms[roomId]


        if (room.length > 1) {
            //超过一个人 就通知对方
            const user = room.find(user => user.uid != uid)
            //通知对方 把自己的id 告诉对方
            socket.to(roomId)
                .emit('peer-join', {
                    "cmd": "peer-join",
                    "remoteUid": uid
                })
            //把对方的id 告诉自己 
            socket.emit('resp-join', {
                'cmd': 'resp-join',
                "remoteUid": user.uid
            })
            console.log('userId=>', user.uid)
        }
        return
        if (roomUsers.length <= 2) {

            //还没满
            app.io.in(roomId).emit('other-join', roomId, ctx.socket.id)
            // ctx.socket.broadcast.emit('joined',)
        } else {

            ctx.socket.emit('joined', roomId, ctx.socket.id)
        }
        // 除自己之外所有人
        // ctx.socket.to(roomId).emit('joined',roomId,socket.id)
        // app.io.in(roomId).emit('joined',roomId,socket.id);
        // console.log(ctx.socket.broadcast.emit)
        // ctx.socket.broadcast.emit('joined',roomId,ctx.socket.id)
        // console.log(this.ctx.args,'加入')
        // const message = this.ctx.args[0];
        // console.log('chat :', message + ' : ' + process.pid);
        // // const say = await this.ctx.service.user.say();
        // this.ctx.socket.emit('joined', '加入');
    }
    //客户离开事件
    leave() {
        const { ctx, app } = this;
        const { roomId, uid } = this.ctx.args[0]
        console.log(`${uid}离开房间=>${roomId}`)
        const socket = app.io.of('/webrtc');
        const myRoom = socket.adapter.rooms[roomId]
        if (!myRoom.length) {
            return console.log('不能找到房间了')
        }
        const room = roomMap.get(roomId)
        ctx.socket.leave(roomId)
        const index = room.findIndex(user => user.uid == uid)
        room.splice(index, 1)
        // const myRoom = socket.adapter.rooms[roomId]
        // let users = Object.keys(myRoom.sockets).length;
        //房间还有其他的人
        if (room.length) {
            // in 给房间内所有人
            // to 就是除了本次连接外给所有人发消息
            ctx.socket.to(roomId).emit('peer-leave', {
                "cmd": 'peer-leave',
                "remoteUid": uid
            })
            console.log(`notify peer ${room[0].uid} peer ${uid}离开了`)
        }
        // ctx.socket.leave(roomId)
        // ctx.socket.emit('joined',roomId,socket.id)
        // 除自己之外所有人
        // app.io.in(roomId).emit('leaved', msg)
        // ctx.socket.to(roomId).emit('joined',roomId,socket.id)
        // app.io.in(roomId).emit('joined',roomId,socket.id);
        // ctx.socket.broadcast.emit('leaved',roomId,ctx.socket.id)
    }
    close() {
        console.log('连接关闭')
    }
    //处理offer
    offer() {
        const { roomId, uid, remoteUid } = this.ctx.args[0]
        console.log(`将${uid}的offer => 发送给${remoteUid}`)
        // const socket = app.io.of('/webrtc');
        const room = roomMap.get(roomId)
        if (!room) return console.log('房间不存在')

        //如果
        const user = room.find(ele => ele.uid == uid);
        if (!user) return console.log('不能找到uid')

        //发给除自己以外的 其他人
        this.ctx.socket.to(roomId)
            .emit('offer', this.ctx.args[0])
    }
    //处理anwer
    answer() {
        const { roomId, uid, remoteUid } = this.ctx.args[0]
        console.log(`将${uid}的aswer回应 => 发送给${remoteUid}`)
        // const socket = app.io.of('/webrtc');
        const room = roomMap.get(roomId)
        if (!room) return console.log('房间不存在')

        //如果
        const user = room.find(ele => ele.uid == uid);
        if (!user) return console.log('不能找到uid')

        //发给除自己以外的 其他人
        this.ctx.socket.to(roomId)
            .emit('answer', this.ctx.args[0])
    }
    candidate() {
        // console.log(this.ctx.args[0])
        const { roomId, uid, remoteUid } = this.ctx.args[0]
        console.log(`将${uid}的candidate回应 => 发送给${remoteUid}`)
        // const socket = app.io.of('/webrtc');
        const room = roomMap.get(roomId)
        if (!room) return console.log('房间不存在')

        //如果
        const user = room.find(ele => ele.uid == uid);
        if (!user) return console.log('不能找到uid')

        //发给除自己以外的 其他人
        this.ctx.socket.to(roomId)
            .emit('candidate', this.ctx.args[0])
    }
}

module.exports = WebRTCController;