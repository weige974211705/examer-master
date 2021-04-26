/** 
 * 公共接口
*/
const express = require('express')
const router = express.Router()
const jToken = require('./../config/jwt_token')
const verify = require('./../config/verify')
const Config  = require('./../model/M_config')

/** 
 * POST /global/loginStatus
 * 验证是否登录
*/
router.post('/loginStatus',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,(err,data)=>{
        if(err){
            res.json({status:0,msg:err})
        }else{
            res.json({status:1,data})
        }
    })
})

/** 
 * GET /global/verifysvg
 * 验证码生成
*/
router.get('/verifysvg',(req,res)=>{
    const captcha=verify.generateVerify()
    res.end(captcha.data)
})

/** 
 * GET /global/getclass
 * 获取默认所有分类
*/
router.get('/getclass',(req,res,next)=>{
    Config.findOne({msg:'config'},(err,data)=>{
        if(err){
            res.json({status:0,msg:'获取分类失败'})
        }else{
            res.json({status:1,msg:'获取分类成功',data:data.question_class})
        }
    })
})


module.exports = router