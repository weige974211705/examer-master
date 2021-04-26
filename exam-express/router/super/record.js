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


router.post('/getrecord',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            let quesNumList = [];
            let teacherNum = await Teacher.find({}).count();
            let studentNum = await Student.find({}).count();
            let paperNum = await Paper.find({}).count();
            let questionsNum = await Ques.find({}).count();
            let isExamNum = await Exam.find({
                isexam: true,
            }).count();
            let noExamNum = await Exam.find({
                isexam: false,
            }).count();
            quesNumList.push(await Ques.find({type:'单选题'}).count())
            quesNumList.push(await Ques.find({type:'多选题'}).count())
            quesNumList.push(await Ques.find({type:'填空题'}).count())
            quesNumList.push(await Ques.find({type:'判断题'}).count())
            quesNumList.push(await Ques.find({type:'问答题'}).count())
            res.json({status:1,msg:'数据获取成功',data:{
                quesNumList,
                teacherNum,
                studentNum,
                paperNum,
                questionsNum,
                isExamNum,
                noExamNum
            }})
        }
    })
})


module.exports = router