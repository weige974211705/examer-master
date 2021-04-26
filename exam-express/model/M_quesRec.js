/** 
 * 错题集
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var quesRecSchema = new schema({
    studentid: {type:String},
    questionid: {type:String},
    answer: {type:Array}, // 试题回答
    right_answer:{type:Array}, //答案
    is_right:{type:Boolean}, //是否回答正确
    date: {type:String},
    publisher: {type:String},
})

module.exports = mongoose.model('quesrecs', quesRecSchema)