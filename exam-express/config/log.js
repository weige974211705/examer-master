/** 
 * 超级用户记录日志
*/
const Log = require('../model/M_log')

exports.insertLog = (desc) => {
    //登录时间插入
    const date=new Date()
    const loginDate = date.getFullYear()+'年'+date.getMonth()+1+'月'
    +date.getDate()+'日  '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
    // console.log(loginDate)
    Log.insertMany({date:loginDate,desc},(err,data)=>{
        if(err){
            console.log('插入日志出错')
        }
    })
}