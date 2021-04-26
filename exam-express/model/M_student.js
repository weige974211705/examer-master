/** 
 * 学生model
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var studentSchema = new schema({
    msg:{type:String,default:'student'},
    username:{type:String},
    password:{type:String},
    email:{type:String,default:''},
    phone:{type:String,default:''},
    headPortrait:{type:String,default:''},//头像
    realName: {type: String},
    lasTime :{type:String}
})

module.exports = mongoose.model('student', studentSchema)