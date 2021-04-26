/*** 
 * 教师用户登录注册验证
*/
const express = require('express')
const router = express.Router();

const Student = require('../../model/M_student')//学生数据库模板
const Exam = require('../../model/M_examList')
const Class = require('../../model/M_class')
const jToken = require('../../config/jwt_token')
const vf = require('./../../config/verify')

const log = require('../../config/log')

/** 
 * Post /student/register
 * 注册学生用户（插入）
*/
router.post('/register',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const insertObj = {
        username,
        password,
        msg:'student',//身份、教师用户
        headPortrait:'/static/img/head.jpg',
    }
    Student.find({username},(err,data)=>{
        if(err){
            res.status(404).json({status:0,msg:'数据库错误'})
        }else{
            if(!data[0]){//data为空则没有重名
                Student.insertMany(insertObj,(err,data)=>{
                    if(err){
                        res.status(404).end(JSON.stringify({status:0,msg:'注册失败'}))
                    }else{
                        res.json({status:1,msg:'注册成功'})
                    }
                })
            }else{
                res.status(404).json({status:0,msg:'用户已经注册'})
            }
        }
        return
    })
})

/** 
 * Post /student/login
 * 学生登录
 * 登录成功返回token，包含username
*/
router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const verify = req.body.verify
    if(vf.judgeVerify(verify)){
        Student.find({username,password},(err,data)=>{
            if(err){
                res.status(404).json({status:0,msg:'数据库出错'})
            }{
                if(data[0]){
                    payload={
                        username,
                        identity:'student',
                        userid: data[0]._id,
                        headPortrait: data[0].headPortrait,
                    }
                    const token = jToken.generateToken(payload)
                    res.json({status:1,token,msg:'登录成功'})
                }else{
                    res.status(404).json({status:0,msg:'用户名或密码错误'})
                }
            }
        })
    }else{
        res.json({status:0,msg:'验证码错误'})
    }
    
})


router.get('/getuser',(req,res)=>{
    const token = req.query.token
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token解析出错'})
        }else{
            Student.findById(tokendata.userid,(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据库错误'})
                }
                else{
                    res.json({status:1,msg:'查询成功',data})
                }
            })
        }
    })
})

/** 
 * 修改密码
*/
router.post('/changepass',(req,res)=>{
    const oldPass = req.body.oldPass;
    const newPass = req.body.newPass;
    const token = req.body.token
    //验证token，super或teacher可用
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token失败'})
        }else if(tokendata.identity==='student'||tokendata.identity==='super'){//教师用户必须是对应用户才行，超级用户都行
            //验证通过可以更新
            const updateObj = {
                password: newPass
            }
            Student.updateOne({username:tokendata.username, password:oldPass},updateObj,(err,data)=>{
                if(err || data.n ===0){
                    res.json({status:0,msg:'密码修改失败'})
                }else{
                    res.json({status:1,msg:'密码修改成功'})
                }
            })
        }else{
            res.json({status:0,msg:'没有权限'})
        }
    })
})

/** 
 * Post /student/update
 * 修改学生基本信息
*/
router.post('/update',(req,res)=>{
    const username = req.body.username
    // const password = req.body.password
    const email = req.body.email
    const phone = req.body.phone
    const headPortrait = req.body.headPortrait
    const token = req.body.token
    const realName = req.body.realName;

    //验证token，super或student可用
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.status(404).json({status:0,msg:'解析token失败'})
        }else if((tokendata.identity==='student'&&username===tokendata.username)||tokendata.identity==='super'){//教师用户必须是对应用户才行，超级用户都行
            //验证通过可以更新
            const updateObj = {
                email,phone,headPortrait,realName
            }
            console.log(updateObj);
            Student.updateOne({username},updateObj,(err,data)=>{
                if(err){
                    res.status(404).json({status:0,msg:'数据修改失败'})
                }else{
                    res.json({status:1,msg:'数据修改成功'})
                }
            })
        }else{
            res.status(404).json({status:0,msg:'没有权限'})
        }
    })
})

/** 
 * POST /student/delete
 * 注销用户,只有超级管理有这个功能
*/
router.post('/delete',(req,res)=>{
    const username = req.body.username
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.status(404).json({status:0,msg:'解析token失败'})
        }else if(tokendata.identity==='super'){
            Student.deleteOne({username},(err,data)=>{
                if(err){
                    res.status(404).json({status:0,msg:'注销用户失败'})
                }else{
                    log.insertLog(`${username}学生用户注销成功`)
                    res.json({status:1,msg:'注销用户成功'})
                }
            })
        }
    })
})

/** 
 * 我的记录模块获取数据
*/
router.post('/getrecordlist', (req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token解析错误'})
        }else{
            Exam.find({studentid:tokendata.userid}).sort({endTime:1}).exec((err,examlist)=>{
                if(err){
                    res.json({status:0,msg:'数据库查询错误'})
                }else{
                    res.json({status:1,msg:'数据查询成功', data:examlist})
                }
            })
        }
    })
})

/** 
 * 获取折线图数据
 * 获取考试信息
*/
router.post('/getline',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            let nowDate = Math.floor(((new Date()).getTime())/1000/60/60/24) ; // 现在日期
            let dateList = []; //最近7天日期
            let numList = []; //最近七天的考试次数
            let avList = []; //最近七天的平均成绩
            let n = 7;
            while(n){
                dateList.push(nowDate* 1000 *60 *60*24);
                const r1 = await Exam.find({
                    endTime:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    isexam: true,
                    studentid: tokendata.userid
                })
                nowDate --;
                n--;
                numList.push(r1.length);
                let av = 0;
                r1.forEach(e=>{
                    av+=e.score;
                })
                av=Math.floor(av/r1.length) || 0;
                avList.push(av);
            }
            //查询及格数量
            const r2 = await Exam.find({
                isexam: true,
                ispass: true,
                studentid: tokendata.userid
            });
            const r3 = await Exam.find({
                isexam: true,
                studentid: tokendata.userid
            });
            const r4 = await Exam.find({
                isexam: false,
                studentid: tokendata.userid
            });
            res.json({status:1,msg:'数据获取成功',data:{
                dateList,
                avList,
                numList,
                passNum: r2.length,
                examNum: r3.length,
                noExamNum: r4.length,
            }})
        }
    })
})

//获取班级信息
router.post('/getclass',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token解析错误'})
        }else{
            Class.find({studentlist:{$elemMatch:{studentid:tokendata.userid}}},(err,classData)=>{
                if(err){
                    res.json({status:0,msg:'数据库查询失败'})
                }else{
                    let resData = [];
                    resData = classData;
                    // resData.chatlist = resData.chatlist.slice(-20,-1);
                    // resData.forEach((e,i) => {
                    //     resData[i].chatlist.splice(-20,0);
                    // });
                    for(let i = 0;i<resData.length;i++){
                        resData[i].chatlist.splice(0,resData[i].chatlist.length-20);
                    }
                    res.json({status:1,msg:'查询成功',data:resData})
                }
            })
        }
    })
})

//发送消息
router.post('/sendmessage',(req,res)=>{
    const token = req.body.token;
    const msg = req.body.msg;
    const paperid = req.body.paperid;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token错误'})
        }else {
            const insertData = {
                username: tokendata.username,
                headPortrait: tokendata.headPortrait,
                time:(new Date()).getTime(),
                msg
            }
            Class.update({paperid:paperid},{
                $push:{chatlist:insertData},
            },(err,classdata)=>{
                if(err){
                    res.json({status:0,msg:'发送失败'})
                }else{
                    res.json({status:0,msg:'发送成功'})
                }
            })
        }
    })
})



module.exports = router