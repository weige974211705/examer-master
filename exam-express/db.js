const mongoose =require('mongoose')
const Dburl = require('./config/config').Db_url

mongoose.connect(Dburl,{useNewUrlParser:true})

mongoose.connection.on('connected', ()=>{
    console.log(`数据库已经连接成功。。。`)
})

mongoose.connection.on('error', ()=>{
    console.log('数据库连接出错。。。')
})

mongoose.connection.on('disconnected',()=>{
    console.log('数据库连接已断开')
})

module.exports = mongoose
