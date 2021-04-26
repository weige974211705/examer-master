const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const jToken = require('./../config/jwt_token')
const Exam = require('../model/M_examList')
const Paper = require('../model/M_paper')
const Questions = require('../model/M_questions')
const Rec = require('../model/M_quesRec')
const Class = require('../model/M_class')
const Student = require('../model/M_student')
const Teacher = require('../model/M_teacher')

// 加入考试
router.post('/joinexam', (req, res, next) => {
    const token = req.body.token;
    let teacherid = req.body.teacherid;
    const studentid = req.body.studentid;
    const paperid = req.body.paperid;
    const fangwenma = req.body.fangwenma;
    jToken.VerifyToken(token, async (err, tokendata) => {
        if (err) {
            res.json({status:0,msg:'token错误'})
        } else if (tokendata.identity === 'student') {
            // 加入班级
            const rs = await Class.update({paperid},{
                $push:{
                    studentlist:{
                        studentid:tokendata.userid,
                        username:tokendata.username,
                        headPortrait: tokendata.headPortrait,
                    }
                }
            })
            // 这里是成功的地方
            Exam.find({studentid, paperid}, (err,datas) => {
                if (datas.length !== 0) {
                    res.json({status:0, msg:'已加入考试'})
                }else {
                    Teacher.find({username: teacherid}, (err, teacherData)=>{
                        if (teacherData.length > 0) {
                            teacherid = teacherData[0]._id;
                        }
                        // console.log(teacherData);
                        let insertData = {};
                        insertData.studentid = studentid;
                        insertData.teacherid = teacherid;
                        insertData.paperid = paperid;
                        Paper.findById(paperid, (err, paperdata) => {
                            if (err) {
                                res.json({status:0, msg: '数据库错误'})
                            } else {
                                console.log(paperdata);
                                if (paperdata.so === '1') { // 直接加入
                                    insertData.imgurl = paperdata.imgurl;
                                    insertData.papertitle = paperdata.title;
                                    insertData.paperstend = paperdata.timestend;
                                    insertData.timeLong = paperdata.timeLong;
                                    insertData.timeOption = paperdata.timeOption;
                                    Exam.insertMany(insertData, (err, examdata)=>{
                                        if (err) {
                                            res.json({status:0, msg:'数据库发生错误'})
                                        } else {
                                            res.json({status:1, msg:'插入成功'})
                                        }
                                    })
                                } else if (paperdata.so === '2') { // 访问码加入
                                    if (paperdata.fangwenma === fangwenma) {
                                        insertData.imgurl = paperdata.imgurl;
                                        insertData.papertitle = paperdata.title;
                                        Exam.insertMany(insertData, (err, examdata)=>{
                                            if (err) {
                                                res.json({status:0,msg:'数据库发生错误'})
                                            } else {
                                                res.json({status:1, msg:'插入成功'})
                                            }
                                        })
                                    } else {
                                        res.json({status:0,msg:'访问码错误'})
                                    }
                                } else { // 不可用
                                    res.json({status:0,msg:'试卷不可用'})
                                }
                            }
                        })
                    });

                }
            })
        } else {
            res.json({status:0,msg:'权限错误'})
        }
    })
})

//学生获取考试列表
router.get('/getexamlist', (req,res)=>{
    const token = req.query.token;
    const search = req.query.search;
    jToken.VerifyToken(token, (err, tokendata) =>{
        if (err) {
            res.json({status:0,msg:'访问码错误'})
        } else{
            wherestr = {};
            if (tokendata.identity === 'teacher') {
                wherestr.teacherid = tokendata.userid;
            } else if (tokendata.identity === 'student') {
                wherestr.studentid = tokendata.userid;
            }
            if (search) {
                wherestr.papertitle = new RegExp(search);
            }
            Exam.find(wherestr, (err, data) => {
                if (err) {
                    res.json({status:0,msg:'数据库错误'})
                } else {
                    res.json({status:1,msg:'获取列表成功', data})
                }
            })
        }
    })
})

// 根据id找考试
router.get('/getexambyid', (req,res) => {
    const token = req.query.token;
    const id = req.query.id;
    console.log(id);
    jToken.VerifyToken(token, (err,tokendata) => {
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        } else {
            Exam.findById(id, (err, examdata) => {
                if (err) {
                    res.json({status:0,msg:'考试查询失败'})
                }
                Paper.findById(examdata.paperid, async (err,paperdata) => {
                    if (err) {
                        res.json({status:0,msg:'试卷查询失败'})
                    }
                    const resdata = {
                        title: paperdata.title,
                        timeLong: paperdata.timeLong,
                        paperInfo: paperdata.paperInfo,
                        score: paperdata.score,
                        paperPassScore: paperdata.paperPassScore,
                        publisher: paperdata.publisher,
                    };
                    res.json({status: 0, msg:'获取考试信息成功', data:resdata})
                })
            })
        }
    })
})

//根据id找考试记录
router.post('/getexamlistbyid', (req, res) => {
    const token = req.body.token;
    const id = req.body.id;
    jToken.VerifyToken(token, (err, tokendata)=>{
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        } else {
            Exam.findById(id, (err, data)=>{
                if (err) {
                    res.json({status:0,msg:'查询数据库错误'})
                } else {
                    res.json({status:1, msg:'查询成功', data:data})
                }
            })
        }
    })
})

//根据考试id生成考卷
router.get('/generateExam', (req, res) => {
    const token = req.query.token;
    const examid = req.query.id;
    jToken.VerifyToken(token, (err, tokendata) => {
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        } else {
            Exam.findById(examid, (err, examdata)=>{
                const paperid = examdata.paperid
                Paper.findById(paperid, (err, paperdata)=> {
                    const examAnswer = {}; //考题模板
                  console.log(paperdata.questionModel)
                    if (paperdata.questionModel === 'custom') {
                        paperdata.questionsList.forEach(element => {
                            examAnswer[element] = [];
                        });
                        Exam.findByIdAndUpdate(examid, {
                            answer: examAnswer,
                            examing: true,
                            startTime: (new Date()).getTime(),
                        },(err, edata)=>{
                            if(err) res.json({status:0,msg:'生成试卷失败'})
                            res.json({status:1,data:edata,msg:'生成考试成功'})
                        });
                    } else {
                        Questions.find({ _id: {$in: paperdata.questionsList}}, (err, qdata) => {
                            if (err) {
                                res.json({status:0,msg:'查询数据库错误'});
                            }
                            let allscore = 0;
                            let lsid; //临时id
                            let lsscore; //临时分数
                            // 随机遍历，然后push， 计算分数
                            while(allscore <= paperdata.score && qdata.length > 0) {
                                const len = qdata.length;
                                const radom = randomNum(0, len - 1);
                                examAnswer[qdata[radom]._id] = [];
                                lsid = qdata[radom]._id;
                                allscore += qdata[radom].default_score;
                                lsscore = qdata[radom].default_score;
                                qdata.splice(radom, 1); // 添加了就去掉这一项
                            }
                            if (allscore > paperdata.score) {
                                delete examAnswer[lsid]; // 删除多余的id
                                allscore = allscore - lsscore;
                            }
                            Exam.findOneAndUpdate({_id: examid}, {
                                answer: examAnswer,
                                examing: true,
                                startTime: (new Date()).getTime(),
                            },(err, edata)=>{
                                if(err) res.json({status:0,msg:'生成试卷失败'})
                                console.log(edata);
                                res.json({status:1,data:Object.assign(edata,{score: allscore}),msg:'生成考试成功'})
                            });
                        })
                    }
                })
            })
        }
    })
})

// 考试生成后会通过试题id查找试题
router.post('/getQuestionsByIds', (req, res) => {
    const token = req.body.token;
    const ids = req.body.ids;
    jToken.VerifyToken(token, (err, data) => {
        if (err) {
            res.json({status:0, msg:'token解析错误'})
        } else {
            Questions.find({_id: { $in: ids }}, (err, quesData) => {
                if (err) {
                    res.json({status:0,msg:'数据库访问错误'})
                }
                res.json({status:1,data:quesData,msg:'获取试题列表成功'});
            })
        }
    })
})

//计算考试分数
router.post('/computePaper', (req, res) => {
    const token = req.body.token;
    const paperData = req.body.paperData;
    const answerList = paperData.answer;
    const examId = req.body.examId;
    jToken.VerifyToken(token, (err, tokendata) => {
        if (err) {
            res.json({status:0, msg: 'token解析错误'})
        } else {
            Questions.find({_id:{$in:Object.keys(answerList)}},(err, quesData)=>{
                if (err) {
                    res.json({status:0, msg: '查询数据库出错'})
                } else {
                    // 遍历quesdata
                    let haveEassay = false;
                    let essayQuestionsId = [];
                    let score = 0; //总分
                    const after_answer = Object.assign({}, answerList);
                    quesData.forEach(item=>{ // 这里是每一题都判断，问答题标注
                        after_answer[item._id] = item.right_answer;
                        let is_right=true;
                        if (item.type === '问答题') { // 问答题当作对的，之后老师修改后扣分
                            haveEassay = true; // 代表需要老师修改
                            essayQuestionsId.push(item._id);
                        } else {
                            for (let i=0; i<item.right_answer.length;i++) {
                                if (item.right_answer[i] !== answerList[item._id][i]) {
                                    is_right = false;
                                    break;
                                }
                            }
                        }
                        if (is_right === true) { // 如果是对的
                            score += item.default_score; //如果对将分数加上
                        } else { // 如果是错的

                        }
                        console.log('对的答案', item.right_answer);
                        console.log('我的答案', answerList[item._id]);
                        console.log('加的分数', item.default_score, '总分', score);
                        // 题目记录
                        const insertData = {
                            studentid: tokendata.userid,
                            questionid: item._id,
                            answer: answerList[item._id],
                            right_answer: item.right_answer,
                            is_right,
                            date: (new Date()).getTime(),
                            publisher: item.publisher,
                        }
                        Rec.insertMany(insertData, (err, datas)=>{
                            if(err) {
                                res.json({status:0,msg:'数据库错误'})
                            }
                        });
                    });
                    Paper.findById(paperData.paperid, (err, paperdata)=>{
                        if (err) {
                            res.json({status:0, msg: '查询数据库出错'})
                        } else {
                            let ispass = false;
                            if (paperdata.paperPassScore <= score) {
                                ispass = true;
                            }
                            console.log(answerList,'====')
                            Exam.updateOne({_id: examId}, {
                                examing: false,
                                answer: answerList,
                                isexam: true,
                                score: score,
                                ispass,
                                after_answer,
                                endTime: (new Date()).getTime(),
                                haveEassay,
                                essayQuestionsId
                            }, (err, examdata) => {
                                if (err) {
                                    res.json({status:0, msg: '查询数据库出错'})
                                } else {
                                    res.json({status:1, msg: '提交试卷成功', data:examdata})
                                }
                            })
                        }
                    });

                }
            });
        }
    });
})

//创建错题练习并加入
router.post('/createWrongPaper',(req, res) => {
    const token = req.body.token;
    const quesIds = req.body.quesIds;
    let paperData = {
        title: '错题练习',
        desc: '欢迎参加错题训练',
        questionModel: 'random',
        questionsList: quesIds,
        timeOption: '2',
        timeLong: 60,
        paperPassScore: 0,
        score: 100,
        paperCla:'wrong',
        paperInfo: '这是试卷说明',
        privateChecked: true,
    };
    jToken.VerifyToken(token, async (err,tokendata) => {
        if(err){
            res.json({status:0,msg:'token解析错误'})
            return
        } else {
            const r1 = await Paper.find({publisher: tokendata.username, paperCla: 'wrong'});
            if (r1.length === 0) {
                await Paper.insertMany(Object.assign({},paperData,{publisher: tokendata.username, createDate: (new Date).getTime() }))
            } else {
                await Paper.update({publisher: tokendata.username, paperCla: 'wrong'}, Object.assign({},paperData,{publisher: tokendata.username, createDate: (new Date).getTime() }))
            }
            const r2 = await Paper.find({publisher: tokendata.username, paperCla: 'wrong'});
            let insertData = {
                studentid: tokendata.userid,
                paperid: r2[0]._id,
                imgurl: '/api/static/img/head.jpg',
                papertitle: r2[0].title,
                timeOption: r2[0].timeOption,
                timeLong: r2[0].timeLong,
            };
            Exam.insertMany(insertData, (err, examdata)=>{
                if (err) {
                    res.json({status:0, msg:'数据库发生错误'})
                } else {
                    res.json({status:1, msg:'插入成功',data:examdata})
                }
            })
        }
    })
})

router.post('/getHaveEassay', (req, res) =>{
    const token = req.body.token;
    jToken.VerifyToken(token, async (err, tokendata)=>{
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        } else {
            const examdata = await Exam.find({
                teacherid: tokendata.userid,
                haveEassay: true,
            })
            res.json({status:1,msg:'获取成功',data:examdata})
        }
    })
})

router.post('/postscroe', (req, res) =>{
    const token = req.body.token;
    const examid = req.body.examid;
    const score = req.body.score;
    jToken.VerifyToken(token, async (err, tokendata)=>{
        if (err) {
            res.json({status:0,msg:'token解析错误'})
        } else {
            const examdata = await Exam.update({
                teacherid: tokendata.userid,
                _id: examid,
            },{
                haveEassay: false,
                score: score
            })
            res.json({status:1,msg:'修改成功'})
        }
    })
})

module.exports = router


// 取两个数中间的随机数
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
        break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
        break;
            default:
                return 0;
            break;
    }
}
