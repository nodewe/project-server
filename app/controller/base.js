
const Controller = require('egg').Controller;
//在基类中定义方法
const sqlMap = require('../model/sqlMap')
//
const path = require('path');
const fse = require("fs-extra");
class BaseController extends Controller {
    sqlMap = sqlMap
    //实现toInt
    toInt(str) {
        return Math.floor(str);
    }
    /**
     * 合并文件的逻辑
     * @param {String} filePath 文件的合并的路径
     * @param {String} fileHash chunk所在的目录名称
     * @param {Number} size 文件的大小
     */
    async mergeFile(filePath, fileHash, size) {
        //得到chunk所在的目录
        const chunkDir = path.resolve(this.config.UPLOAD_DIR, fileHash);
        // 读取目录下所有的chunk
        let chunks = await fse.readdir(chunkDir);
        // 将chunk 文件按照索引值来排序
        chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
        //构成一个完整的文件路径
        chunks = chunks.map(cp => path.resolve(chunkDir, cp))
        // 执行合并chunk的操作
        await this.mergeChunks(chunks, filePath, size);
    }
    async mergeChunks(files, dest, size) {
        const pipStream = (filePath, wirteStream) => new Promise(resolve => {
            const readStream = fse.createReadStream(filePath);
            readStream.on('end', () => {
                fse.unlinkSync(filePath)
                resolve()
            })
            readStream.pipe(wirteStream)
        })
        await Promise.all(
            files.map((file, index) => {
                const start = index * size,
                    end = (index + 1) * size;
                return pipStream(file, fse.createWriteStream(dest, {
                    start,
                    end
                }))
            })
        )
        
    }
    //成功的响应示例
    success(data) {
        this.ctx.body = {
            code: 200,
            msg: '操作成功',
            ...data
        }
    }
    //错误的响应示例
    error(data) {
        this.ctx.body = Object.assign({
            msg: '操作失败',
            code: 500,
        }, data)
    }
}
module.exports = BaseController;