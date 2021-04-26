const express = require('express')
const router = express.Router();

var fs = require('fs')
var multer  = require('multer');//这是一个处理上传文件的模块，将其引入;
var upload = multer({ dest: './upload/img/' })

router.post('/img', upload.any(), function(req, res, next) {
    console.log(req.files[0]);  // 上传的文件信息
    var des_file = req.files[0].path + '.jpg';
    fs.rename( req.files[0].path, des_file , function (err, data) {
        if( err ){
            console.log( err );
        }else{  
            response = {
                 message:'File uploaded successfully',
                filepath:des_file.replace('upload\\img\\','/static/img/')
            };
            console.log( response );
            res.end( JSON.stringify( response ) );
        }
     })
})



module.exports = router