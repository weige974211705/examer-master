/** 
 * 学生问答
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var ask = new schema({
    studentid: {type:schema.Types.ObjectId},
    title: {type:String},
    content: {type:String},
    createDate: {type: Number},
    evaluate: {type:Array},//{username,content,date}
})

module.exports = mongoose.model('ask', ask)