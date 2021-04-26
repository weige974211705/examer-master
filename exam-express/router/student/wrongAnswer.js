/*** 
 * 教师用户登录注册验证
*/
const express = require('express')
const router = express.Router();

const Student = require('../../model/M_student')//学生数据库模板
const Exam = require('../../model/M_examList')
const jToken = require('../../config/jwt_token')
const Qrec = require('../../model/M_quesRec')
const Ques = require('./../../model/M_questions')

/** 
 * 获取错题信息折线图部分
*/
router.post('/getline',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            let nowDate = Math.floor(((new Date()).getTime())/1000/60/60/24) ; // 现在日期
            let dateList = []; //最近7天日期
            let rightList = []; //最近七天的考试次数
            let wrongList = []; //最近七天的平均成绩
            let allNum = 0;
            let n = 7;
            while(n){
                dateList.push(nowDate* 1000 *60 *60*24);
                const r1 = await Qrec.find({
                    date:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    is_right: true,
                    studentid: tokendata.userid
                })
                const r2 = await Qrec.find({
                    date:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    is_right: false,
                    studentid: tokendata.userid
                })
                rightList.push(r1.length);
                wrongList.push(r2.length);
                nowDate --;
                n--;
            }
            const r3 = await Qrec.find({
                studentid: tokendata.userid
            })
            allNum = r3.length;
            res.json({status:1,msg:'数据获取成功',data:{
                allNum,
                rightList,
                wrongList,
                dateList,
            }})
        }
    })
})

router.post('/getcircle',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata) =>{
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        }
        else {
            const r1 = await Qrec.find({
                is_right: true,
                studentid: tokendata.userid
            })
            const r2 = await Qrec.find({
                is_right: false,
                studentid: tokendata.userid
            })
            res.json({status:1,msg:'获取数据成功',data: {
                rightNum: r1.length,
                wrongNum: r2.length,
            }})
        }
    })
})

router.post('/getwronglist',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if (err){
            res.json({status:0,msg:'token解析错误'})
        }else {
            Qrec.distinct('questionid',{
                studentid:tokendata.userid,
                is_right:false,
            },async (err,data)=>{
                // console.log(data)
                if(err) {
                    res.json({status:0,msg:'获取数据失败'})
                }else {
                    const qrec = await Qrec.find({
                        studentid:tokendata.userid,
                        is_right:false,
                    });
                    let qs = [];
                    let n =  data.length;
                    for (let i=0;i<n;i++) {
                        const q = await Ques.find({_id:data[i]});
                        qs.push(q[0]);
                    }
                    res.json({status:1,msg:'获取数据成功',data:{
                        data:qrec,
                        qs,
                        ids:data,
                    }})
                }
            })
        }
    })
})

module.exports = router