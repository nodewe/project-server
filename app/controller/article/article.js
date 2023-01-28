const BaseController = require('../base.js');

const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');

class ArticleController extends BaseController {
    //添加文章
    async addArticle() {
        const { ctx, app } = this
        const {title,content,userId} = ctx.request.body;
        if(!userId){
            return this.error({msg:'用户userId必传'})
        }
        if(!title){
            return this.error({msg:'文章标题必传'})
        }
        if(!content){
            return this.error({msg:'文章内容必传'})
        }
        const conn = await app.mysql.beginTransaction();
        const create_time = dayjs().format('YYYY-MM-DD HH:mm:ss')
        try {
            const result = await conn.insert('article',{
                title,
                content,
                user_id:userId,
                create_time,
                update_time:create_time

            })
            await conn.commit();
            console.log(result,'result')
            if(result.affectedRows==1){
                this.success()
            }
            
        } catch (e) {
            await conn.rollback();
            console.log('addArticle=>',e)
        }
    }
    // 获取文章详情
    async getArticleInfo() {
        const { ctx, app } = this
        const {aid} = ctx.request.query;
        if(!aid){
            return this.error({msg:'文章id错误'})
        }
        const conn = await app.mysql.beginTransaction();

        try {
            const info = await conn.get('article',{
                aid
            });
            await conn.commit();
            if(info.aid){
                this.success({info})
            }
        } catch (e) {
            await conn.rollback();
            console.log('getAticleInfo=>',e)
        }
    }
    // 获取文章分页列表
    async getArticleList() {
        const { ctx, app } = this
        let { pageSize, pageNum, title } = ctx.request.query;
        !pageSize && (pageSize = 10);
        !pageNum && (pageNum = 1);
        !title && (title = '');
        let where = ` where title LIKE '%${title}%'`;
        const conn = await app.mysql.beginTransaction();
        try {
            // 分页查出所有的文章数据来
            const list = await conn.query(
                `select * from article${where} limit ${(pageNum - 1) * pageSize},${pageSize}`
            )
            //第二个事务就是查询多少条
            const count = await conn.query(
                `select COUNT(aid) from article${where}`
            );
            //总数
            const total = count[0]['COUNT(aid)'];
            //总页数
            const pages = Math.ceil(total / pageSize);
            //当前页数
            const currentPage = pageNum;
            await conn.commit();
            this.success({
                list,
                total,
                pages,
                currentPage
            })
        } catch (e) {
            await conn.rollback();
            console.log('getArticleList=>', e)
        }
    }
    // 修改文章信息
    async updateArticleInfo() {
        const { ctx, app } = this;
        const {aid,title,content} = ctx.request.body;
        if(!aid){
            return this.error({msg:'文章id必传'})
        }
        if(!title){
            return this.error({msg:'文章标题必传'})
        }
        if(!content){
            return this.error({msg:'文章内容必传'})
        }
        const update_time =  dayjs().format('YYYY-MM-DD HH:mm:ss');
        const conn = await app.mysql.beginTransaction();
        try {
            const result = await conn.update('article',{
                title,
                content,
                update_time
            },{
                where:{
                    aid
                }
            })
            await conn.commit();
            if(result.affectedRows==1){
                this.success()
            }
        } catch (e) {
            await conn.rollback();
            console.log('updateArticleInfo=>',e)
        }
    }
    // 删除文章信息
    async deleteArticle() {
        const { ctx, app } = this
        const {ids} = ctx.request.body;
        if(!ids){
            return this.error({msg:'id必传'})
        }
        const conn = await app.mysql.beginTransaction();

        try {
            const res = await conn.query(
                `delete from article where aid in (${ids})`
            )
            await conn.commit();
            if(res.affectedRows>0){
                this.success()
            }
        } catch (e) {
            await conn.rollback();
            console.log('deleteArticle=>',e)
        }
    }
}

module.exports = ArticleController;