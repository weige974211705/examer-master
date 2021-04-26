/** 
 * 学生动态
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var dynamic = new schema({
    studentid: {type:schema.Types.ObjectId},
    title: {type:String},
    content: {type:String},
    createDate: {type: Number},
    evaluate: {type:Array},//{username,content,date}
})

module.exports = mongoose.model('dynamic', dynamic)