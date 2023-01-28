
const jwt = require('jsonwebtoken');
module.exports = app=>{
    return async function verify(ctx,next){
        if(!ctx.request.header.token){
            return ctx.body = {
                msg:'用户没有登录',
                code:401
            }
        }
        //有token
        const token = ctx.request.header.token;
        try {
            const ret = await jwt.verify(token,app.config.jwt.security);
            ctx.state.userId = ret.id
            await next()
        } catch (error) {
            console.log(error,'error')
            if(error.name=='TokenExpiredError'){
                ctx.body = {
                    code:401,
                    msg:'用户信息过期'
                }
            }else{
                ctx.body = {
                    code:500,
                    msg:'用户信息出错'
                }
            }
        }
    }
}