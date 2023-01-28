//文件上传
const BaseController = require('../base.js')

const fse = require('fs-extra')
const path = require('path');
const pump = require('mz-modules/pump');
const dayjs = require('../../model/day.js');
class FileController extends BaseController {
    // 文件上传
    async uploadFile() {
        const { ctx, app } = this;
        // 上传文件的列表
        const files = ctx.request.files;
        if (files.length) {
            files.forEach(async (file) => {
                const ext = path.extname(file.filename)
                const name = file.filename.replace(ext, '')
                file.fileName = name + Math.floor(Math.random() * 1000) + ext
                await fse.move(file.filepath, this.config.UPLOAD_DIR + `/${file.fileName}`);
            })
            const create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const list = files.map(file => {
                return [`/public/file/${file.fileName}`, create_time]
            })
            const result = await app.mysql.query('INSERT INTO file (fileUrl,create_time) values ?', [list])
            if (result.affectedRows == files.length) {
                return this.success()
            }
        } else {
            this.error({
                msg: '文件上传为空'
            })
        }
    }
    //大文件切片上传  建议文件大小 至少 10M起步
    async uploadChunk() {
        // /public/hash/hash+name
        const { ctx } = this;
        //模拟报错 80% 的几率会报错
        // if(Math.random()>0.2){
        //     return ctx.status = 500;
        // }
        const [file] = ctx.request.files;
        const { name, hash } = ctx.request.body;
        const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash)
        // const filePath = path.resolve()//文件最终存储的位置
        //如果这个目录不存在 则新建一个目录
        if (!fse.existsSync(chunkPath)) {
            await fse.mkdir(chunkPath)
        }
        //将chunk 移动到 该hash 目录下
        await fse.move(file.filepath, `${chunkPath}/${name}`);
        this.success({ msg: '切片上传成功' })
    }
    //切片合并
    async mergeChunk() {
        const { ctx, app } = this;
        const { ext, hash, size } = ctx.request.body;
        const filePath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`);
        await this.mergeFile(filePath, hash, size)
        //如果目录存在 将目录删除
        const dir = path.resolve(this.config.UPLOAD_DIR, hash)
        try {
            if (fse.existsSync(dir)) {
                await fse.rmdir(dir)
            }
        } catch (error) {
            console.log('mergeChunk=>error',error)
        }
        //插入数据
        const create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const result = await app.mysql.insert("file", {
            fileUrl: '/public/file/' + hash + '.' + ext,
            create_time
        })
        // 插入成功
        if (result.affectedRows == 1) {
            this.success()
        }
    }
    //断点续传 返回chunk 列表
    async chunkList() {
        const { ctx, app } = this;
        const { hash } = ctx.request.query;
        // console.log('hash=>',hash,'upload_dir=>',this.config.UPLOAD_DIR)
        const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
        let uploaded = false,
            uploadedList = [];
        // 如果文件存在
        if (fse.existsSync(chunkPath)) {
            uploaded = true;
            //将这目录下的 切片返回给前段
            uploadedList = await fse.readdir(chunkPath);
        }
        this.success({
            uploaded,
            uploadedList
        })

    }
    //获取文件列表
    async getList() {
        const { ctx, app } = this;
        //获取分页参数
        const { pageSize, pageNum } = ctx.request.query;
        //整合参数
        const pages = {
            pageNum,
            pageSize
        };
        const result = await this.sqlMap.queryLimit(pages, {}, 'file', app)
        // console.log(this.ctx.protocol)
        const { host } = this.ctx.header;
        const protocol = this.ctx.protocol;
        const baseUrl = protocol + '://' + host;
        // console.log(this.app.baseDir)
        result.list.forEach(file => file.fileLocation = baseUrl + file.fileUrl)
        this.success(result)
    }
    // 删除文件
    async delFile() {
        const { ctx, app } = this
        const { ids } = ctx.request.body;
        const conn = await app.mysql.beginTransaction();
        try {
            //查询事务
            const ret = await conn.query(
                `SELECT * FROM file WHERE id in (${ids})`
            );
            //删除事务
            const dels = await conn.query(
                `DELETE FROM file WHERE id in (${ids})`
            );
            await conn.commit();  //提交事务
            //如果删除成功的话就 把对应的文件也删除 
            if (dels.affectedRows == ids.split(',').length) {
                ret.forEach(async (file) => {
                    const file_url = path.join(this.app.baseDir, '/app', file.fileUrl);
                    if (fs.existsSync(file_url)) {
                        await fse.remove(file_url)
                    }

                });
                this.success()
            }
        } catch (err) {
            await conn.rollback();//回滚事务
            throw err;
        }

    }
}

module.exports = FileController;