const BaseController = require('../base.js');

const fse = require('fs-extra')
const path = require('path');
const dayjs = require('../../model/day.js');

class WebRTCController extends BaseController{
    // 添加WebRTC
     async addWebRTC(){
        const {ctx,app,io} = this
        // this.io
    }
    // 获取WebRTC详情
     async getWebRTCInfo(){
        const {ctx,app} = this
    }
    // 获取WebRTC分页列表
     async getWebRTCList(){
        const {ctx,app} = this
    }
    // 修改WebRTC信息
     async updateWebRTCInfo(){
        const {ctx,app} = this
    }
    // 删除WebRTC信息
     async deleteWebRTC(){
        const {ctx,app} = this
    }
}

module.exports = WebRTCController;