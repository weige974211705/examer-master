const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const Papers = require('./../model/M_paper')
const jToken = require('./../config/jwt_token')
const Class = require('../model/M_class')

// 添加试卷
router.post('/addpaper',(req, res) => {
    const token = req.body.token
    let paperData = req.body.paperData;
    console.log(paperData)
    jToken.VerifyToken(token,(err,tokendata) => {
        if(err){
            res.json({status:0,msg:'token解析错误'})
            return
        } else {
            Papers.insertMany(Object.assign({},paperData,{publisher: tokendata.username, createDate: (new Date).getTime() }), (err, data) => {
                if(err){
                    res.json({status:0,msg:'数据库发生错误'})
                }
                else {
                    res.json({status:1,msg:'数据插入成功'})
                    console.log(data,'=+++++++++++++++++++')
                    Class.insertMany({
                        imgurl:data[0].imgurl,
                        title:data[0].title,
                        desc:data[0].desc,
                        publisher:data[0].publisher,
                        paperid:data[0]._id,
                    },(err,classdata)=>{
                        if(err){
                            console.log('班级创建失败')
                        }
                    });
                }
            })
        }
    })
})

// 获得所有试卷
router.get('/getallpaper',(req,res) => {
    //从get中可以添加条件
    let whereStr = {};
    const publisher = req.query.publisher;
    const paperCla = req.query.paperCla;
    if (publisher) {
        Object.assign(whereStr, {publisher})
    }
    if (paperCla) {
        Object.assign(whereStr, {paperCla})
    }
    
    Papers.find(whereStr,(err,data) => {
        res.json({status:1,msg:'获取试卷成功',data:data})
    })
})

//根据id获取试卷
router.get('/getpaperbyid',(req,res)=>{
    const objId = req.query.id
    console.log(objId)
    Papers.findById(objId, (err,data) => {
        if (err) {
            res.json({status:0,msg:'获取失败'})
        } else{
            res.json({status:1,msg:'获取成功',data})
        }
    })
})

//删除试卷 id 和token
router.get('/delpaper', (req, res) => {
    const token = req.query.token;
    const _id = req.query.id;
    jToken.VerifyToken(token, (err,tokendata) => {
        if (err) {
            res.json({status:0, msg:'token错误'})
        }
        else {
            Papers.deleteOne({_id:_id, publisher: tokendata.username}, (err, data) =>{
                if (err) {
                    res.json({status:0, msg:'数据库错误'})
                }
                else {
                    res.json({status:1, msg: '删除成功'})
                }
            })
        }
    })
})

//获取公开试卷
router.get('/getopenpaper',async (req, res) =>{
    const paperList = await Papers.find({
        privateChecked: false
    }).sort({createDate: -1})
    res.json({status:1,msg:'获取成功',data:paperList})
})

module.exports = router