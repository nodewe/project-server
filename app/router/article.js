
//文章相关
module.exports = app => {
   
    const { router, controller } = app;

    const jwt = app.middleware.jwt(app)
   
    router.group({ name: 'article', prefix: '/article' }, router => {
        const {
            addArticle,
            getArticleInfo,
            getArticleList,
            updateArticleInfo,
            deleteArticle
        } = controller.article.article
        //添加文章信息
        router.post('/addArticle', jwt, addArticle)
        // //获取文章信息
        router.get('/getArticleInfo', jwt, getArticleInfo)
        // //获取文章list
        router.get('/getArticleList', jwt, getArticleList)
        // // 删除文章
        router.delete('/deleteArticle', jwt, deleteArticle);
        // //修改文章
        router.put('/updateArticleInfo', jwt, updateArticleInfo)
    })
}