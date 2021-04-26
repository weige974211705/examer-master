/** 
 * 试题
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var quesSchema = new schema({
    type:{type:String}, //题目类型(single)
    question:{type:String},//问题
    answer_options:{type:Array},//答案选项
    right_answer:{type:Array},//正确答案
    analysis:{type:String},//题目解析
    classes:{type:String},//分类
    default_score:{type:Number,default:1},//默认分数
    label:{type :Array},//标签
    publisher:{type:String},//发布者
})

module.exports = mongoose.model('questions', quesSchema)