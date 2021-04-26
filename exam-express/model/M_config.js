/** 
 * 网站配置信息
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var ConfigSchema = new schema({
    msg:{type:String,default:'config'},
    username:{type:String},
    password:{type:String},
    email:{type:String,default:''},
    phone:{type:String,default:''},
    headPortrait:{type:String,default:''},//头像
    theme:{type:String,default:'blue'},
    ad:{type:String}, //广告
    title:{type:String}, //网站名字
    desc:{type:String},//页脚描述
    friend_chain:{type:Array},//友情链接 lable 、href
    announcement: {type: Array}, //公告
})

module.exports = mongoose.model('Config', ConfigSchema, 'config')