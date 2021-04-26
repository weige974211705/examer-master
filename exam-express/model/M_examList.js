/** 
 * 试题
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var examSchema = new schema({
    studentid:{type:schema.Types.ObjectId, ref: 'students'}, //学生id
    teacherid:{type:schema.Types.ObjectId, ref: 'exams'}, //教师id
    paperid:{type:String}, //试卷id
    isexam:{type:Boolean,default:false}, //是否已考试
    score:{type:Number,default:0}, //考试分数
    ispass:{type:Boolean,default:false}, //是否及格
    imgurl:{type:String}, //封面url，从试卷中获取
    papertitle:{type:String}, //试卷名称
    timeOption: {type:String, default:'1'},
    paperstend:{type:Array}, // 试卷规定时间
    answer:{type:Object}, // 考试回答
    after_answer: {type:Object}, //交卷后存入正确答案
    examing: {type:Boolean,default:false},//考试中
    evaluate: {type:String,default:''},//考试评价

    timeLong: {type:Number,default:60}, //考试时长
    startTime: {type:Number}, //开始考试时间
    endTime: {type:Number}, //结束考试时间

    haveEassay:{type:Boolean,default:false}, // 是否需要教师修改
    essayQuestionsId: {type: Array,default:[]}, // 问答题需要老师改卷，将填写在这里
})

module.exports = mongoose.model('exams', examSchema)