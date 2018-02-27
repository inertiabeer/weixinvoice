var express = require('express');
var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var xml2js=require('xml2js');
var confirm = require('../util/confirm.js');
var get_access_token = require('../util/wx_request').get_access_token; //promise
var get_user_info = require('../util/user_info').get_user_info;
var router = express.Router();
var builder=new xml2js.Builder();


var access_token, expires_in;
//settimeout 获取token
function loop_get() {
    get_access_token()
        .then(chunk => {
            return JSON.parse(chunk)
        })
        .then(chunk => {
            access_token = chunk.access_token;
            expires_in = chunk.expires_in;
            get_voice(testid);
            console.log(access_token);
            setTimeout(() => {
                loop_get();
            }, expires_in * 1000);
        }, error => console.log(error));
}

loop_get();
//config 
var options = {
    hostname: 'file.api.weixin.qq.com', //path需要用决定路径，必须加上/不然会报错。
    path: '/cgi-bin/media/get?&access_token=' + access_token + '&media_id=',
    method: 'GET',
};

function get_voice(media_id) {
    options.path = '/cgi-bin/media/get?&access_token=' + access_token + '&media_id=' + media_id;
    var voice_url = 'http://' + options.hostname + options.path;
    request
        .get(voice_url)
        .on('error', function (err) {
            console.log(err)
        })
        .pipe(fs.createWriteStream('./voice/' + media_id + '.amr'))

}
var testid = '_JB619EjK3jI3TqGF1RFulkb2hA7mhQLV9WCbO6V7rE2YQzimqzRKt6IWOu-hYZY';

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
    let openid = message.fromusername[0];
        //需要认证之后才可以用这个接口
    // get_user_info(access_token, openid)
    //     .then(function (body) {
    //         console.log(body);
    //     }, function (err) {
    //         console.error(err);

    //     });
    if (message.msgtype == 'voice') {
        var mediaid = message.mediaid; //amr格式\
        get_voice(mediaid);

    }
    if(message.msgtype=='text')
    {
        let m=message;//只是一个指针变量
        [m.tousername,m.fromusername]=[m.fromusername,m.tousername];
        m.createtime=new Date().getTime;

        
    }
    var xml=builder.buildObject(message);
    res.send(xml);
})

module.exports = router;