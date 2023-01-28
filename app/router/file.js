
//文件路由
module.exports = app=>{
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app)
    router.group({name:'file',prefix:'/file'},router=>{
        const {
          uploadFile,
          uploadChunk,
          chunkList,
          mergeChunk,
          getList,
          delFile
        } = controller.file.file;
        //文件上传
        router.post('/uploadFile',jwt,uploadFile);
        //大文件切片上传
        router.post('/uploadChunk',jwt,uploadChunk)
        //切片合并
        router.post('/mergeChunk',jwt,mergeChunk)
        //断点续传  返回chunk 列表
        router.get('/chunkList',jwt,chunkList)
        //获取文件列表
        router.get('/getList',jwt,getList)
        //删除文件
        router.delete('/delFile',jwt,delFile)
      })
}