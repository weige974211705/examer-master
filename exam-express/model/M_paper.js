/** 
 * 试题
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var paperSchema = new schema({
    title:{type:String},//标题
    desc:{type:String}, //描述
    imgurl: {type:String}, //封面地址
    paperCla: {type:String}, //试卷分类
    privateChecked: {type:Boolean,default:true}, //是否私有
    questionModel:{type:String, default:'custom'}, //试题模式，自定义和随机
    questionsList: {type:Array}, //试题列表
    timeOption: {type:String, default:'1'}, //时间模式设定， 1自定义时间， 2永久有效，3不可用
    timestend:{type:Array}, //如果时间自定义，这就是时间戳开始到结束
    so: {type:String,default:'1'}, //试卷开放模式，1为对所有人可见，2为访问码加入
    fangwenma: {type:String}, //如果试卷加入模式为访问码则有效
    timeLong: {type:Number,default:60}, //考试时长，默认60分钟
    paperInfo: {type:String}, //试卷说明信息
    paperPassScore: {type:Number,default:60}, //试卷及格分数time
    score:{type:Number, default: 0},
    publisher:{type:String}, //发布者
    createDate: {type:String}, //创建时间
})

module.exports = mongoose.model('papers', paperSchema)