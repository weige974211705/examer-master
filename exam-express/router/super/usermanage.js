/*** 
 * 教师用户登录注册验证
*/
const express = require('express')
const router = express.Router();

const Teacher = require('../../model/M_teacher')//教师数据库模板
const jToken = require('../../config/jwt_token')
const log = require('../../config/log')
const vf = require('./../../config/verify')
const Class = require('../../model/M_class') //班级信息
const Exam = require('../../model/M_examList')
const QuesRec = require('../../model/M_quesRec')
const Paper = require('../../model/M_paper')
const Ques = require('../../model/M_questions')
const Student = require('../../model/M_student')
const Super = require('../../model/M_config')


router.post('/getstudentlist',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            const studentList = await Student.find({});
            res.json({status:1,msg:'查询成功', data:studentList})
        }
    })
})

router.post('/delstudent',(req,res)=>{
    const token = req.body.token;
    const userid = req.body.userid;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            const studentList = await Student.remove({_id: userid});
            res.json({status:1,msg:'删除成功'})
        }
    })
})

router.post('/getteacherlist',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            const teacherList = await Teacher.find({});
            res.json({status:1,msg:'查询成功', data:teacherList})
        }
    })
})

router.post('/delteacher',(req,res)=>{
    const token = req.body.token;
    const userid = req.body.userid;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            await Teacher.remove({_id: userid});
            res.json({status:1,msg:'删除成功'})
        }
    })
})


module.exports = router