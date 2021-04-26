/** 
 * 班级
 * 当创建考试的时候创建
 * 当加入考试的时候加入学生
 * 教师可以删除列表中的学生，同时将会删除学生的考试
*/
/** 
 * 试题
*/
const mongoose = require('../db')
const schema = mongoose.Schema

var classSchema = new schema({
    paperid:{type:String},
    publisher:{type:String}, //教师id
    studentlist:{type:Array,default:[]}, //学生列表
    chatlist:{type:Array,default:[]}, //聊天记录
    imgurl:{type:String}, //封面地址
    title:{type:String}, //班级名称,默认试卷名称
    desc: {type:String}, //班级描述,从试卷中获取
})

module.exports = mongoose.model('class', classSchema)

/** 
 * studentlist:[
 *  { studentid:'', username:'',
 *  headPortrait:'' }
 * ],
 * chatlist:[
 *  { username:'',
 *  headPortrait:'', time:number, 
 * msg:'聊天内容', }
 * ]
*/