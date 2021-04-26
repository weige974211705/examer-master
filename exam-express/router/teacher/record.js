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

router.post('/getrecordinfo',(req, res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err,tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        }else{
            let paperNum;// 试卷数量
            let quesNum; // 试题数量
            let examNum; // 考试次数
            let avgsocre; // 平均分数
            let passNum; //及格次数
            let noPassNum; //不及格次数
            const r1 = await Paper.find({publisher:tokendata.username});
            paperNum = r1.length;
            const r2 = await Ques.find({publisher:tokendata.username});
            quesNum = r2.length;
            const r3 = await Exam.aggregate([
                {$match:{haveEassay:false}},
                {$group : {_id : "$isexam",avg : {$avg : "$score"}}},
                {$match:{_id:true}},
            ]);
            avgsocre = r3[0].avg;
            const r4 = await Exam.find({
                teacherid:tokendata.userid,
                isexam:true,
                haveEassay:false,
                ispass: true,
            })
            passNum = r4.length;
            const r5 = await Exam.find({
                teacherid:tokendata.userid,
                isexam:true,
                haveEassay:false,
                ispass: false,
            })
            noPassNum = r5.length;
            const r6 = await Exam.find({
                teacherid:tokendata.userid,
                isexam:true,
            })
            examNum = r6.length;
            res.json({status:1,msg:'获取数据成功',data:{
                paperNum,
                quesNum,
                examNum,
                avgsocre,
                passNum,
                noPassNum
            }})
        }
    })
})

router.post('/getrecordline',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            let nowDate = Math.floor(((new Date()).getTime())/1000/60/60/24) ; // 现在日期
            let dateList = [];
            let numList = [];
            let avList = [];
            let publishNum = []; 
            let quesNum = [];
            let n = 30;
            while(n){
                dateList.push(nowDate* 1000 *60 *60*24);
                const r1 = await Exam.find({
                    endTime:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    isexam: true,
                    haveEassay: false,
                    teacherid: tokendata.userid
                })
                const r2 = await Paper.find({
                    createDate:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    publisher: tokendata.username,
                })
                nowDate --;
                n--;
                numList.push(r1.length);
                publishNum.push(r2.length);
                let av = 0;
                r1.forEach(e=>{
                    av+=e.score;
                })
                av=Math.floor(av/r1.length) || 0;
                avList.push(av);
            }
            quesNum.push(await Ques.find({type:'单选题'}).count())
            quesNum.push(await Ques.find({type:'多选题'}).count())
            quesNum.push(await Ques.find({type:'填空题'}).count())
            quesNum.push(await Ques.find({type:'判断题'}).count())
            quesNum.push(await Ques.find({type:'问答题'}).count())
            res.json({status:1,msg:'数据获取成功',data:{
                dateList,
                avList,
                numList,
                publishNum,
                quesNum,
            }})
        }
    })
})

router.post('/getrecordtable',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err,tokendata)=>{
        const examdata = await Exam.find({teacherid:tokendata.userid}).populate(
            {
                path: 'studentid',
                select:'_id username realName',
                model: Student,
            }
        );
        res.json({status:1,msg:'获取数据成功',data:examdata})
    })
})

router.get('/getranking', async (req, res)=>{
    //平均分加最高分加用户名（根据平均分排行）
    const examdata = await Exam.aggregate([
        {$match:{isexam:true, haveEassay: false}},
        {$group : {_id : "$studentid",avg : {$avg : "$score"}, max: {$max: "$score"}}},
        // {$match:{_id:true}},
        {$lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
        }}
    ]).sort({avg: -1}).limit(20);
    //根据次数排行
    const examdata2 = await Exam.aggregate([
        {$match:{isexam:true, haveEassay: false}},
        {$group : {_id : "$studentid",avg : {$avg : "$score"}, num: {$sum: 1}}},
        // {$match:{_id:true}},
        {$lookup: {
            from: 'students',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
        }}
    ]).sort({num: -1}).limit(20);
    res.json({status:1,msg:'获取数据成功',data:{
        ranking1: examdata,
        ranking2: examdata2,
    }})
})

module.exports = router