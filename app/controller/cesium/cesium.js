const BaseController = require('../base.js');

const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');
//水务的数据
class CesiumController extends BaseController{
    // 添加
     async addCesium(){
        const {ctx,app} = this
    }
    // 获取详情
     async getCesiumInfo(){
        const {ctx,app} = this
    }
    // 获取分页列表
     async getCesiumList(){
        const {ctx,app} = this
    }
    // 修改信息
     async updateCesiumInfo(){
        const {ctx,app} = this
    }
    // 删除信息
     async deleteCesium(){
        const {ctx,app} = this
    }
    //查询所有小区列表
    async getEstateList(){
        const {ctx,app} = this;
        
        const list = await app.mysql.select('estate');
        // console.log(list,'list')
        this.success({list})
    }
}

module.exports = CesiumController;