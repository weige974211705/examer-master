/**
 * 用于验证码生成和验证
 */
const svgCaptcha = require('svg-captcha')

let verifys = [ //验证码存储
                //{str:'1565',n:0,time:0}//临时存储验证码，验证码只能用一次，之后删除，还有过期时间，过期删除

]
let codeConfig = {  //验证码配置
  size: 5,// 验证码长度
  ignoreChars: '0o1iqgjlIL', // 验证码字符中排除 0o1i
  noise: 2, // 干扰线条的数量
  height: 39
}

//刷新验证码表，使用次数大于0删除，时间超过60*10秒删除
const refreshVerifys = () => {
  for (var i = 0; i < verifys.length; i++) {
    if (verifys[i].n > 0 || Date.now() - verifys[i].time > 1000 * 60 * 5) {//验证码过期时间为5分钟
      verifys.splice(i, 1)
    }
  }
}

//验证码生成
exports.generateVerify = () => {
  refreshVerifys()//刷新
  var captcha = svgCaptcha.create(codeConfig);//生成验证码
  verifys.push({str: captcha.text.toLowerCase(), n: 0, time: Date.now()})//存储验证码
  // console.log(verifys)
  return captcha
}

//判断验证码
exports.judgeVerify = (str) => {
  refreshVerifys()//刷新
  var result = false
  if (!str) return false
  str = str.toLowerCase()
  for (var i = 0; i < verifys.length; i++) {
    if (verifys[i].str === str) {
      verifys[i].n = 1
      result = true
      break
    }
  }
  return result
}
