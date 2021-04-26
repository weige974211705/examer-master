/** 
 * 这是专门提供token创建和token验证的文件
*/
const jwt = require('jsonwebtoken')
const cfg = require('../config/config')//配置
//生成token
exports.generateToken=(content)=>{
    return jwt.sign(content,cfg.secretOrPrivateKey,{expiresIn:60*60*24})//过期时间是24小时
}
//验证token
exports.VerifyToken=(token,callback)=>{
    jwt.verify(token,cfg.secretOrPrivateKey,(err,data)=>{
        if(err){
            callback(err)
        }else{
            // console.log(data)
            callback(null,data)
        }
    })
}