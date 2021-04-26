/** 
 * 用于操作题库
*/

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const Questions = require('./../model/M_questions')
const jToken = require('./../config/jwt_token')
/** 
 * 添加试题
*/
router.post('/add',(req,res,next)=>{
    const token = req.body.token

    const type = req.body.type
    const question =  req.body.question
    const answer_options = req.body.answer_options
    const right_answer = req.body.right_answer
    const analysis = req.body.analysis
    const classes = req.body.classes
    const default_score = req.body.default_score
    const label = req.body.label
    const isorder = req.body.isorder
    const iscustomscore = req.body.iscustomscore
    const isallrightscore = req.body.isallrightscore
    const isopen = req.body.isopen
    const rightnum = req.body.rightnum
    const wrongnum = req.body.rightnum
    // const publisher = req.body.publisher

    //检验token
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token错误'})
        }else{
            //判断是否有权限
            if(tokendata.identity==='teacher'||tokendata.identity==='super'){
                Questions.insertMany({
                    //这里是需要添加的内容
                    type,question,answer_options,right_answer,analysis,classes,default_score
                    ,label,isorder,iscustomscore,isallrightscore
                    ,isopen,rightnum,wrongnum,publisher:tokendata.username
                },(err,data)=>{
                    if(err){
                        res.json({status:0,msg:'插入数据库出错'})
                    }else{
                        res.json({status:1,msg:'添加成功'})
                    }
                })
            }else{
                res.json({status:0,msg:'权限错误错误'})
            }
        }
    })
    // res.end('add')
})

/** 
 * 修改试题
*/
router.post('/update',(req,res,next)=>{
    const token = req.body.token

    const _id = req.body._id;
    const type = req.body.type
    const question =  req.body.question
    const answer_options = req.body.answer_options
    const right_answer = req.body.right_answer
    const analysis = req.body.analysis
    const classes = req.body.classes
    const default_score = req.body.default_score
    const label = req.body.label
    const isopen = req.body.isopen === '否'? false:true
    const rightnum = req.body.rightnum
    const wrongnum = req.body.rightnum
    // const publisher = req.body.publisher
    console.log(req.body)
    //检验token
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token错误'})
        }else{
            //判断是否有权限
            if(tokendata.identity==='teacher'||tokendata.identity==='super'){
                Questions.findByIdAndUpdate(_id, {
                    //这里是需要修改的内容
                    type,question,answer_options,right_answer,analysis,classes,default_score
                    ,label,isopen,rightnum,wrongnum
                },(err,data)=>{
                    if(err){
                        res.json({status:0,msg:'修改数据库出错'})
                    }else{
                        res.json({status:1,msg:'修改成功'})
                    }
                })
                // Questions.update({_id: mongoose.Types.ObjectId(_id) },{$set:{
                //     //这里是需要修改的内容
                //     type,question,answer_options,right_answer,analysis,classes,default_score
                //     ,label,isopen,rightnum,wrongnum
                // }},(err,data)=>{
                //     if(err){
                //         console.log('修改失败')
                //         res.json({status:0,msg:'修改数据库出错'})
                //     }else{
                //         res.json({status:1,msg:'修改成功'})
                //     }
                // })
            }else{
                res.json({status:0,msg:'权限错误'})
            }
        }
    })
})

/** 
 * 根据试题id列表获取试题
*/
router.get('/getquestion',(req,res,next)=>{
    const id = req.query.id
    Questions.findById(id,(err,data)=>{
        if (err){
            res.json({status:0,msg:'获取失败'})
            return
        }
        res.json({status:1,msg:'获取成功',data})
    })
})

/** 
 * 删除试题
*/
router.post('/delete',(req,res,next)=>{
    const token = req.body.token;
    const ids = req.body.ids;
    jToken.VerifyToken(token,(err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token错误'})
        }else{
            Questions.remove({_id:{$in:ids}},(err,data)=>{
                if(err){
                    res.json({status:0,msg:'删除失败'})
                }else{
                    res.json({status:1,msg:'删除成功'})
                }
            })
        }
    })
})

/** 
 * 获取题列表
 * GET /questions/getlist
*/
router.get('/getlist',(req,res)=>{
    const token = req.query.token;
    jToken.VerifyToken(token, (err,tokendata)=>{
        if(err){
            res.json({status:0,msg:'token错误'})
        }else{
            Questions.find({publisher:tokendata.username},(err,data)=>{
                if(err){
                    res.json({status:0,msg:'数据库发生错误'})
                }else{
                    res.json({status:1,data:data})
                }
            })
        }
    })
})


router.post('/import', (req, res)=>{
    const token = req.body.token;
    const ques = req.body.ques;
    jToken.VerifyToken(token,async (err, tokendata)=>{
        if(err) {
            res.json({status:0,msg:'token解析错误'})
        }else {
            await Questions.insertMany(ques)
            res.json({status:1,msg:'插入成功'})
        }
    })
})

module.exports = router 