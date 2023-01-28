const BaseController = require('../base.js');

const { spawn } = require('child_process');
const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');

function run_cmd(cmd, arg, callback) {
    return new Promise(resolve => {
        const ls = spawn(cmd, arg)
        let resp = ''
        ls.stdout.on('data', data => {
            // console.log('data=>', data)
            resp += data.toString()
            console.log(resp)
        })
        ls.stderr.on('data', err => {
            console.log(err.toString(), 'err')
        })
        ls.stdout.on('end', () => {
            console.log(111)
            resolve(resp)
        })
    })

}
/**
 * 相关文档
 * fluent-ffmpeg 中文 https://cloud.tencent.com/developer/article/1524052
 * ffmpeg 转m3u8 博客 https://www.cnblogs.com/fieldtianye/p/13427303.html
 * m3u8文件格式详解 https://www.jianshu.com/p/e97f6555a070
 * fluent-ffmpeg github地址 https://github.com/fluent-ffmpeg/node-fluent-ffmpeg
 */
// const ffmpeg = require('fluent-ffmpeg');
// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// ffmpeg.setFfmpegPath(ffmpegPath);
//nodejs将视频文件 变成m3u8返回给前端
class VideoController extends BaseController {
    // 添加视频
    addVideo() {
        const { ctx, app } = this
    }
    // 获取视频详情
    getVideoInfo() {
        const { ctx, app } = this
    }
    // 获取视频分页列表
    getVideoList() {
        const { ctx, app } = this
    }
    // 修改视频信息
    updateVideoInfo() {
        const { ctx, app } = this
    }
    // 删除视频信息
    deleteVideo() {
        const { ctx, app } = this
    }
    /**
     * 将视频切片成m3u8的格式
     * @param {String} filePath 视频的绝对路径
     * @param {String} outputPath 生成的m3u8文件的 绝对路径
     * @returns 
     */
    m3u8File(filePath, outputPath) {
        return new Promise(resolve => {
            ffmpeg(filePath)
                .videoCodec('libx264')
                .format('hls')
                .outputOptions('-hls_list_size 0')
                .outputOption('-hls_time 60')
                .output(outputPath)
                .on("progress", progress => {
                    // {
                    //     frames: 3896,
                    //     currentFps: 1297,
                    //     currentKbps: NaN,
                    //     targetSize: NaN,
                    //     timemark: '00:02:10.75'
                    //   } 
                    console.log('progress')
                    // console.log('progress=>', progress.percent + '%');
                })
                .on('end', () => {
                    console.log('完成')
                    resolve()
                })
                .run()
        })
    }
    //对视频进行切片 返回给前端
    async chunkVideo() {
        const { ctx } = this;
        const { fileName } = ctx.request.query
        if (!fileName) {
            return this.error({ msg: '文件名是必须的' })
        }
        const filePath = path.join(this.config.UPLOAD_DIR, `/${fileName}.mp4`);
        // 如果文件的路径不存在就返回错误
        if (!fse.existsSync(filePath)) {
            return this.error({ msg: fileName + '文件路径不存在' })
        }
        const dir = `/${fileName}_m3u8`
        const outputDir = path.join(this.config.UPLOAD_DIR, dir);
        const visitPath = `/public/file${dir}/${fileName}.m3u8`;
        //如果不存在就新建一个目录
        if (!fse.existsSync(outputDir)) {
            await fse.mkdir(outputDir)
        } else {
            //存在这个目录 则直接返回路径
            return this.success({ visitPath })
        }
        const outputPath = path.join(this.config.UPLOAD_DIR, `${dir}/${fileName}.m3u8`)
        try {
            await this.m3u8File(filePath, outputPath)
            this.success({ visitPath })
        } catch (error) {
            console.log('error=>', error)
            this.error({ msg: '视频切片处理错误' })
        }

    }
    //使用 ffmpeg
    async ffmpegM3u8(filePath,outputPath) {
        let cmd = `-i ${filePath} -vcodec copy -acodec copy -hls_time 60 -hls_list_size 0 ${outputPath}`
        // 本地
        await run_cmd('F://ffmpeg/bin/ffmpeg.exe',cmd.split(' '))
        // 线上
        // await run_cmd('ffmpeg',cmd.split(' '))
    }
    //直接使用ffmpeg 命令来执行切割
    async ffmpegChunk() {
        const { ctx } = this;
        const { fileName } = ctx.request.query
        if (!fileName) {
            return this.error({ msg: '文件名是必须的' })
        }
        const filePath = path.join(this.config.UPLOAD_DIR, `/${fileName}.mp4`);
        // 如果文件的路径不存在就返回错误
        if (!fse.existsSync(filePath)) {
            return this.error({ msg: fileName + '文件路径不存在' })
        }
        const dir = `/${fileName}_m3u8`
        const outputDir = path.join(this.config.UPLOAD_DIR, dir);
        const visitPath = `/public/file${dir}/${fileName}.m3u8`;
        //如果不存在就新建一个目录
        if (!fse.existsSync(outputDir)) {
            await fse.mkdir(outputDir)
        } else {
            //存在这个目录 则直接返回路径
            return this.success({ visitPath })
        }
        const outputPath = path.join(this.config.UPLOAD_DIR, `${dir}/${fileName}.m3u8`)
        try {
            await this.ffmpegM3u8(filePath, outputPath)
            this.success({ visitPath })
        } catch (error) {
            console.log('error=>', error)
            this.error({ msg: '视频切片处理错误' })
        }
    }
}

module.exports = VideoController;