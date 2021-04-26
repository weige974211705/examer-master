/*** 
 * 教师用户登录注册验证
*/
const express = require('express')
const router = express.Router();

const Student = require('../../model/M_student')//学生数据库模板
const Dynamic = require('../../model/M_dynamic')
const jToken = require('../../config/jwt_token')


router.post('/save', (req, res)=>{
    const token = req.body.token;
    const title = req.body.title;
    const content = req.body.content;
    jToken.VerifyToken(token,(err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            Dynamic.insertMany({
                studentid: tokendata.userid,
                title,
                content,
                createDate:(new Date()).getTime(),
            })
            res.json({status:1,msg:'发布成功'})
        }
    })
})

router.get('/getdynamic', async (req,res)=>{
    const data = await Dynamic.aggregate([
        {$lookup: {
        from: 'students',
        localField: 'studentid',
        foreignField: '_id',
        as: 'user',
        }}
    ]).sort({createDate: -1})
    res.json({status:1,msg:'获取成功',data})
})

router.post('/evaluate', (req, res)=>{
    const token = req.body.token;
    const content = req.body.content;
    const did = req.body.did;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        } else{
            let now = (new Date()).getTime();
            await Dynamic.update({
                _id: did,
            },{
                $push:{
                    evaluate:{
                        username:tokendata.username,
                        content,
                        date: now
                    }
                }
            })
            res.json({status:1,msg:'发布成功'})
        }
    })
})

module.exports = router