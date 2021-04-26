/*** 
 * 超级用户登录验证
 * 超级管理用户信息在config.user里面
*/
const express = require('express')
const router = express.Router();

const Config = require('../../model/M_config')//config数据库
const log = require('../../config/log')
const jToken = require('../../config/jwt_token')
const vf = require('./../../config/verify')
/** 
 * POST /super/login
 * 超级管理员登录
*/
router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const verify = req.body.verify
    // console.log(req.body)
    if(!vf.judgeVerify(verify)){
        res.json({status:0,msg:'验证码错误'})
    }else{
        Config.find({msg:'config'},(err,data)=>{
            if(username===data[0].username&&password===data[0].password){
                log.insertLog('用户登录')
                let content = {
                    username:username,
                    identity:'super',//身份、超级用户
                    userid: 0,
                    headPortrait: data[0].headPortrait,
                }
                let token = jToken.generateToken(content)
                res.end(JSON.stringify({status:1,msg:'super login',token}))
            }
            else{
                log.insertLog('登录失败')
                res.status(404).json({status:0,msg:'用户名或密码错误'})
            }
        })
    }
})

/** 
 * 更新配置
*/
router.post('/updateoption',(req,res)=>{
    const token = req.body.token;
    const configData = req.body.config;
    jToken.VerifyToken(token, async (err, tokendata)=>{
        if (err) {
            res.json({status:0,msg: 'token解析错误'})
        } else {
            await Config.update({}, configData)
            res.json({status:1,msg: '修改成功'})
        }
    })
})

router.post('/changepassword',(req,res)=>{
    const token = req.body.token;
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    jToken.VerifyToken(token, async (err, tokendata)=>{
        if (err) {
            res.json({status:0,msg: 'token解析错误'})
        } else {
            const passdata = await Config.find({password: oldPass})
            if (passdata.length === 0){
                res.json({status:0,msg: '原密码错误'})
            }
            await Config.update({},{password: newPass});
            res.json({status:1,msg: '修改成功'})
        }
    })
})

//获取配置
router.post('/getconfig', (req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token, async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'token解析错误'})
        }else {
            const config = await Config.find({})
            res.json({status:1,msg:'查询正确',data:config[0]})
        }
    })
})

router.get('/allgetconfig',async (req,res)=>{
    const config = await Config.find({})
    res.json({status:1,msg:'查询正确',data:{
        theme: config[0].theme,
        ad: config[0].ad,
        friend_chain: config[0].friend_chain,
        desc: config[0].desc,
        announcement: config[0].announcement,
    }})
})


module.exports = router

