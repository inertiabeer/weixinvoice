var express = require('express');
var http = require('http');
var url=require('url');
var request=require('request');
var fs=require('fs');
var confirm = require('../util/confirm.js');
var get_access_token = require('../util/wx_request').get_access_token; //promise
var router = express.Router();

var access_token, expires_in;
//settimeout 获取token
function loop_get(){
    get_access_token()
        .then(chunk => { return JSON.parse(chunk) })
        .then(chunk => {
            access_token = chunk.access_token;
            expires_in = chunk.expires_in;
            console.log(access_token);
            setTimeout(() => {
                loop_get();
            }, expires_in*1000);
        }, error => console.log(error));
}

loop_get();
//config 
var options = {
    hostname: 'file.api.weixin.qq.com', //path需要用决定路径，必须加上/不然会报错。
    path: '/cgi-bin/media/get?&access_token=' + access_token + '&media_id=',
    method: 'GET',
};
function get_voice(media_id){
    options.path = '/cgi-bin/media/get?&access_token=' + access_token + '&media_id='+media_id;
   var voice_url='http://'+options.hostname+options.path;
    request
        .get(voice_url)
        .on('error', function (err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream('./voice/'+media_id+'.amr'))

}
var testid ='_JB619EjK3jI3TqGF1RFulkb2hA7mhQLV9WCbO6V7rE2YQzimqzRKt6IWOu-hYZY';

//对微信接口发一个请求获取。
var xml2js = require('xml2js'); //微信推送消息是用的xml格式
router.get('/', function (req, res, next) {
    console.log('测试服务器正常运行');
    var result = confirm.init(req);
    var echostr = req.query.echostr;
    if (result) {
        res.send(echostr);
    } else {
        console.log('验证出问题了');
        res.send(echostr);
    }



});
router.post('/', function (req, res, next) {
    //这是对推送消息进行处理。
    var parser = new xml2js.Parser();
    var message = req.body.xml;
    if (message.msgtype == 'voice') {
        var mediaid = message.mediaid; //amr格式\
        get_voice(mediaid);

    }

    res.send('你好啊');
})

module.exports = router;