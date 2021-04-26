/** 
 * 教师信息
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var teacherSchema = new schema({
    msg:{type:String,default:'teacher'},
    username:{type:String},
    password:{type:String},
    email:{type:String,default:''},
    phone:{type:String,default:''},
    headPortrait:{type:String,default:''},//头像
    classes:{type:Array,default:[]},//试题分类
    paperclasses:{type:Array,default:[]},//考试分类
    realName: {type:String},
})

module.exports = mongoose.model('teacher', teacherSchema)