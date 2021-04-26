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


/** 
 * Post /teacher/register
 * 注册教师用户（插入）
*/
router.post('/register',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const verify = req.body.verify
    if(vf.judgeVerify(verify)){
        const insertObj = {
            username,
            password,
            msg:'teacher',//身份、教师用户
            headPortrait:'/static/img/head.jpg',
        }
        Teacher.find({username},(err,data)=>{
            if(err){
                res.json({status:0,msg:'数据库错误'})
            }else{
                if(!data[0]){//data为空则没有重名
                    Teacher.insertMany(insertObj,(err,data)=>{
                        if(err){
                            res.end(JSON.stringify({status:0,msg:'注册失败'}))
                        }else{
                            res.json({status:1,msg:'注册成功'})
                        }
                    })
                }else{
                    res.json({status:0,msg:'用户已经注册'})
                }
            }
            return
        })
    }else{
        res.json({status:0,msg:'验证码错误'})
    }
})

/** 
 * Post /teacher/login
 * 教师登录
 * 登录成功返回token，包含username
*/
router.post('/login',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const verify = req.body.verify
    if(vf.judgeVerify(verify)){
        Teacher.find({username,password},(err,data)=>{
            if(err){
                res.status(404).json({status:0,msg:'数据库出错'})
            }{
                if(data[0]){
                    payload={
                        username,
                        identity:'teacher',
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
            Teacher.findById(tokendata.userid,(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据库错误'})
                }
                else{
                    console.log(data);
                    res.json({status:1,msg:'查询成功',data: {
                        email: data.email,
                        phone: data.phone,
                        headPortrait: data.headPortrait,
                        username: data.username,
                        realName: data.realName,
                    }})
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
        }else if(tokendata.identity==='teacher'||tokendata.identity==='super'){//教师用户必须是对应用户才行，超级用户都行
            //验证通过可以更新
            const updateObj = {
                password: newPass
            }
            Teacher.updateOne({username:tokendata.username, password:oldPass},updateObj,(err,data)=>{
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
 * Post /teacher/update
 * 修改教师基本信息,不包含修改密码
*/
router.post('/update',(req,res)=>{
    const username = req.body.username
    const password = req.body.password
    const email = req.body.email
    const phone = req.body.phone
    const headPortrait = req.body.headPortrait
    const token = req.body.token
    const realName = req.body.realName;
    
    //验证token，super或teacher可用
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token失败'})
        }else if((tokendata.identity==='teacher'&&username===tokendata.username)||tokendata.identity==='super'){//教师用户必须是对应用户才行，超级用户都行
            //验证通过可以更新
            const updateObj = {
                email,phone,headPortrait,realName
            }
            Teacher.updateOne({username},updateObj,(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据修改失败'})
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
 * POST /teacher/delete
 * 注销用户,只有超级管理有这个功能
*/
router.post('/delete',(req,res)=>{
    const username = req.body.username
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.status(404).json({status:0,msg:'解析token失败'})
        }else if(tokendata.identity==='super'){
            Teacher.deleteOne({username},(err,data)=>{
                if(err){
                    res.status(404).json({status:0,msg:'注销用户失败'})
                }else{
                    log.insertLog(`${username}教师用户注销成功`)
                    res.json({status:1,msg:'注销用户成功'})
                }
            })
        }
    })
})


router.post('/addcla',(req,res)=>{
    const token = req.body.token;
    const cla= req.body.cla;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token失败'})
        }else if(tokendata.identity==='teacher'){

            //先查询所有分类
            Teacher.find({username:tokendata.username},(err,data)=>{
                if(err){
                    res.json({status:0,msg:"数据库查询错误"})
                }else{
                    var classeslist = data[0].classes
                    classeslist.push(cla)
                    Teacher.updateOne({username:tokendata.username},{classes:classeslist},(err,data)=>{
                        if(err){
                            res.json({status:0,msg:'数据库错误'})
                        }else{
                            res.json({status:1,msg:'分类添加成功'})
                        }
                    })
                }
            })
        }
    })
})

router.get('/getcla',(req,res)=>{
    const user=req.query.user;
    // console.log(user)
    Teacher.findOne({username:user},(err,data)=>{
        if(err){
            res.json({status:0,msg:'查询数据库错误'})
        }else{
            // console.log(data)
            res.json({status:1,classes:data.classes})
        }
    })
})

router.post('/delcla',(req,res)=>{
    const token=req.body.token;
    const cla= req.body.cla;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token发生错误'})
        }else if(tokendata.identity==='teacher'){
            Teacher.findOne({username:tokendata.username},(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据库发生错误'})
                }else{
                    var classeslist=[];
                    classeslist=data.classes
                    // console.log(classeslist)
                    for(var i=0;i<classeslist.length;i++){
                        if(classeslist[i]==cla){
                            classeslist.splice(i,1);
                            break;
                        }
                    }
                    Teacher.updateOne({username:tokendata.username},{classes:classeslist},(err,data)=>{
                        if(err){
                            res.json({status:0,msg:'数据库发生错误'})
                        }else{
                            res.json({status:1,classes:classeslist,msg:"类别删除成功"})
                        }
                    })
                }
            })
        }
    })
})

//添加试卷分类
router.post('/addpapercla',(req,res)=>{
    const token = req.body.token;
    const cla= req.body.cla;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token失败'})
        }else if(tokendata.identity==='teacher'){

            //先查询所有分类
            Teacher.find({username:tokendata.username},(err,data)=>{
                if(err){
                    res.json({status:0,msg:"数据库查询错误"})
                }else{
                    var classeslist = data[0].paperclasses
                    classeslist.push(cla)
                    Teacher.updateOne({username:tokendata.username},{paperclasses:classeslist},(err,data)=>{
                        if(err){
                            res.json({status:0,msg:'数据库错误'})
                        }else{
                            res.json({status:1,msg:'分类添加成功'})
                        }
                    })
                }
            })
        }
    })
})

//获取试卷分类
router.get('/getpapercla',(req,res)=>{
    const user=req.query.user;
    // console.log(user)
    Teacher.findOne({username:user},(err,data)=>{
        if(err){
            res.json({status:0,msg:'查询数据库错误'})
        }else{
            // console.log(data)
            res.json({status:1,paperclasses:data.paperclasses})
        }
    })
})

//删除试卷分类
router.post('/delpapercla',(req,res)=>{
    const token=req.body.token;
    const cla= req.body.cla;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'解析token发生错误'})
        }else if(tokendata.identity==='teacher'){
            Teacher.findOne({username:tokendata.username},(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据库发生错误'})
                }else{
                    var classeslist=[];
                    classeslist=data.paperclasses
                    // console.log(classeslist)
                    for(var i=0;i<classeslist.length;i++){
                        if(classeslist[i]==cla){
                            classeslist.splice(i,1);
                            break;
                        }
                    }
                    Teacher.updateOne({username:tokendata.username},{paperclasses:classeslist},(err,data)=>{
                        if(err){
                            res.json({status:0,msg:'数据库发生错误'})
                        }else{
                            res.json({status:1,classes:classeslist,msg:"类别删除成功"})
                        }
                    })
                }
            })
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
            Class.find({publisher:tokendata.username},(err,classData)=>{
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

router.post('/getcenterline',(req, res)=>{
    const token=req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'tokan解析错误'})
        }else{
            let nowDate = Math.floor(((new Date()).getTime())/1000/60/60/24) ; // 现在日期
            let dateList = []; //最近7天日期
            let examNumList = []; //最近7天考试数量
            let examingNum = 0; //正在考试的数量
            let waitNum = 0; //等待批改试卷的数量
            let n = 7;
            while(n){
                dateList.push(nowDate* 1000 *60 *60*24);
                const r1 = await Exam.find({
                    endTime:{$lte:(nowDate +1)* 1000 *60 *60*24, $gt:nowDate* 1000 *60 *60*24},
                    isexam: true,
                    teacherid: tokendata.userid,
                })
                examNumList.push(r1.length);
                nowDate --;
                n--;
            }
            const r2 = await Exam.find({
                teacherid: tokendata.userid,
                examing: true,
            })
            examingNum = r2.length;
            const r3 = await Exam.find({
                teacherid: tokendata.userid,
                haveEassay: true,
            })
            waitNum = r3.length;
            res.json({status:1,msg:'数据获取成功',data:{
                examNumList,
                examingNum,
                waitNum,
                dateList,
            }})
        }
    })
})
//
//获取已经使用试题的数量
router.post('/getquestionsusednum',(req, res) =>{
    const token = req.body.token;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析失败'})
        } else{
            QuesRec.distinct('_id',{
                publisher: tokendata.username,
            },(err, data)=>{
                if (err) {
                    res.json({status:0,msg:'查询失败'})
                }else{
                    res.json({status:1,msg:'查询成功',data:data.length})
                }
            })
        }
    })
})

router.post('/getpaperusednum',(req,res)=>{
    const token = req.body.token;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err){
            res.json({status:0,msg:'token解析错误'})
        } else {
            Exam.find({teacherid:tokendata.userid},(err,data)=>{
                if(err){
                    res.json({status:0,msg:'查询试卷使用次数失败'})
                } else {
                    res.json({status:1,msg:'查询试卷使用次数成功',data:data.length})
                }
            })
        }
    })
})



module.exports = router