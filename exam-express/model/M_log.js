/** 
 * 日志信息
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var logSchema = new schema({
    msg:{type:String,default:'log'},
    desc:{type:String,default:''},
    date:{type:String,default:''}
})

module.exports = mongoose.model('log', logSchema)