/** 
 * 学生问答
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var help = new schema({
    studentid: {type:schema.Types.ObjectId},
    teacherid: {type:schema.Types.ObjectId},
    title: {type:String},
    content: {type:String},
    createDate: {type: Number},
    resContent: {type:String},
    resDate: {type: String},
})

module.exports = mongoose.model('help', help)