'use strict';

const BaseController = require('./base.js')
//验证码的库
const svgCaptcha = require('svg-captcha');
class UtilController extends BaseController {
    
    //验证码的实现
  async captcha() {
    const captcha = svgCaptcha.createMathExpr({
        width:115,
        height:35,
        noise:5,
        background:'#c6c8c6'
    });
    this.ctx.session.captcha = captcha.text;
    this.ctx.body =  {
        code:200,
        captchaEnabled:true,
        img:captcha.data,
        msg:'操作成功'
    }
  }
  //单文件的上传
  async fileUpload(){
   
  }
}

module.exports = UtilController;
