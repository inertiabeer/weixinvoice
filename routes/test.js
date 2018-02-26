var express = require('express');
var confirm=require('./confirm.js');
var router = express.Router();
router.get('/', function (req, res, next) {
    console.log('测试服务器正常运行');
    var result=confirm.init(req);
    if (result) {
        res.send(echostr);
    } else {
        console.log('验证出问题了');
        res.send(echostr);
    }
    
  

});
router.post('/',function(req,res,next){
    res.send('你好啊');
})

module.exports = router;