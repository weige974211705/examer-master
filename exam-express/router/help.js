/*** 
 * 教师用户登录注册验证
*/
const express = require('express')
const router = express.Router();

const Help = require('./../model/M_help')
const jToken = require('./../config/jwt_token')


router.post('/studentSave', (req, res)=>{
    const token = req.body.token;
    const title = req.body.title;
    const content = req.body.content;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            await Help.insertMany({
                studentid: tokendata.userid,
                title,
                content,
                createDate:(new Date()).getTime(),
            })
            res.json({status:1,msg:'发布成功'})
        }
    })
})

router.post('/teacherSave', (req, res)=>{
    const token = req.body.token;
    const title = req.body.title;
    const content = req.body.content;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            await Help.insertMany({
                teacherid: tokendata.userid,
                title,
                content,
                createDate:(new Date()).getTime(),
            })
            res.json({status:1,msg:'发布成功'})
        }
    })
})

router.post('/superSave', (req, res)=>{
    const token = req.body.token;
    const hid = req.body.hid;
    const content = req.body.content;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            await Help.update({
                _id:hid,
            },{
                resContent: content,
                resDate: (new Date()).getTime(),
            })
            res.json({status:1,msg:'发布成功'})
        }
    })
})

router.post('/studentget', (req, res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            const helpData = await Help.find({
                studentid: tokendata.userid,
            }).sort({createDate: -1}).limit(100)
            res.json({status:1,msg:'获取成功', data: helpData})
        }
    })
})

router.post('/teacherget', (req, res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            const helpData = await Help.find({
                teacherid: tokendata.userid,
            }).sort({createDate: -1}).limit(100)
            res.json({status:1,msg:'获取成功', data: helpData})
        }
    })
})

router.post('/superget', (req, res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            const helpData = await Help.find({}).sort({createDate: -1}).limit(100)
            res.json({status:1,msg:'获取成功', data: helpData})
        }
    })
})




module.exports = router