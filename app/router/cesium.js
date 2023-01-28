
//Cesium 相关的
module.exports = app => {
   
    const { router, controller } = app;

    const jwt = app.middleware.jwt(app)
   
    router.group({ name: 'cesium', prefix: '/cesium' }, router => {
        const {
            getEstateList
        } = controller.cesium.cesium
        // //添加文章信息
        // router.post('/addArticle', jwt, addArticle)
        // // //获取文章信息
        // router.get('/getArticleInfo', jwt, getArticleInfo)
        // // //获取文章list
        // router.get('/getArticleList', jwt, getArticleList)
        // // // 删除文章
        // router.delete('/deleteArticle', jwt, deleteArticle);
        // // //修改文章
        // router.put('/updateArticleInfo', jwt, updateArticleInfo)
        // 获取小区的信息
        router.get('/getEstateList',getEstateList)
    })
}