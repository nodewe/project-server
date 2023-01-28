
//用户相关
module.exports = app => {
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app)
    router.group({ name: 'user', prefix: '/user' }, router => {
        const { login,
            getInfo,
            buys,
            register,
            deleteUser,
            updateInfo,
            getUserList } = controller.user.user
        router.post('/login', login)
        router.post('/register', register)
        router.post('/buys', buys)
        //获取用户信息
        router.get('/getInfo', jwt, getInfo)
        //获取用户list
        router.get('/getList', jwt, getUserList)
        // 删除用户
        router.delete('/delete', jwt, deleteUser);
        //修改用户
        router.put('/updateInfo', jwt, updateInfo)
    })
}