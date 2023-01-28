
//视频相关
module.exports = app => {
    const { router, controller } = app;
    const jwt = app.middleware.jwt(app)
    router.group({ name: 'video', prefix: '/video' }, router => {
        const {
            addVideo,
            getVideoInfo,
            getVideoList,
            updateVideoInfo,
            deleteVideo,
            chunkVideo,
            ffmpegChunk
        } = controller.video.video
        //添加视频信息
        router.post('/addVideo', jwt, addVideo)
        //获取视频信息
        router.get('/getVideoInfo', jwt, getVideoInfo)
        //获取视频list
        router.get('/getVideoList', jwt, getVideoList)
        // 删除视频
        router.delete('/deleteVideo', jwt, deleteVideo);
        //修改视频
        router.put('/updateVideoInfo', jwt, updateVideoInfo);
        //选择视频切割
        router.get('/chunkVideo',chunkVideo)
        //使用ffmpeg 命令来切割
        router.get('/ffmpegChunk',ffmpegChunk)
    })
}