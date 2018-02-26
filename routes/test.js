var express = require('express');
var confirm=require('./confirm.js');
var router = express.Router();
router.get('/', function (req, res, next) {
    console.log('测试服务器正常运行');
    var result=confirm.init(req);
    var echostr = req.query.echostr;
    if (result) {
        res.send(echostr);
    } else {
        console.log('验证出问题了');
        res.send(echostr);
    }
    
  

});
router.post('/',function(req,res,next){
    //这是对推送消息进行处理。
    res.send('你好啊');
})

module.exports = router;