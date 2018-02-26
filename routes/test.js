var express = require('express');
var confirm=require('../util/confirm.js');
var router = express.Router();
var xml2js=require('xml2js');//微信推送消息是用的xml格式
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
    var parser=new xml2js.Parser();
    console.log(req.body);
    console.log(req.rawBody);
    // if(message.MsgType==="text")
    // {
    //     var content=message.Content;
    //     var reply='你也好';
    // }

    // parser.parseString(data,function(err,result){

    // })
    res.send('你好啊');
})

module.exports = router;