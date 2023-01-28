
module.exports = app => {
    return async (ctx, next) => {
        console.log(ctx.packet);
        ctx.socket.emit('res', 'packet!' + '你好filter');
        await next();
        console.log('packet response!');
    };
}