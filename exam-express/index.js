const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')

/**
 * 引入本地文件
 */
const config = require('./config/config')
const superUser = require('./router/super/superUser')
const teacherUser = require('./router/teacher/teacherUser')
const studentUser = require('./router/student/studentUser')
const Global = require('./router/global')
const Questions = require('./router/questions')

//连接数据库
require('./db')

/** 
 * 中间件
*/
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit:'50mb'}))  
//添加header
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.setHeader('Content-Type','text/plain; charset=utf-8')
    console.log(`请求  ${req.url}`)
    next()
})


app.use('/static',express.static(path.join(__dirname, 'upload')));


/**
 * 配置router
 */
app.use('/super',superUser)
app.use('/teacher',teacherUser)
app.use('/student',studentUser)
app.use('/global',Global)
app.use('/questions',Questions)
app.use('/papers',require('./router/papers'))
app.use('/upload',require('./router/upload'))
app.use('/exam',require('./router/exam'))
app.use('/help',require('./router/help'))
app.use('/wrong',require('./router/student/wrongAnswer'))
app.use('/threcord',require('./router/teacher/record'))
app.use('/dynamic',require('./router/student/dynamic'))
app.use('/ask',require('./router/student/ask'))
app.use('/surecord',require('./router/super/record'))
app.use('/usermanage',require('./router/super/usermanage'))

app.get('/',(req,res) => {
    res.end('index test')
})

app.listen(config.port,() =>{
    console.log(`服务器运行在${config.port}端口上。。。`)
})


