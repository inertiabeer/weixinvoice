var express = require('express');
var xml2js = require('xml2js');
var confirm = require('../util/confirm.js');
var get_access_token = require('../util/wx_request').get_access_token; //promise
var get_voice=require('../util/get_voice').get_voice;
var robot = require('../util/robot');
var router = express.Router();
var builder = new xml2js.Builder({
    rootName: 'xml'
});


var access_token, expires_in;
//settimeout 获取token
function loop_get() {
    get_access_token()
        .then(chunk => {
            return JSON.parse(chunk);
        })
        .then(chunk => {
            access_token = chunk.access_token;
            expires_in = chunk.expires_in;
            console.log(access_token);
            setTimeout(() => {
                loop_get();
            }, expires_in * 1000);
        }, error => console.log(error));
}

loop_get();
//config 
var testid = '_JB619EjK3jI3TqGF1RFulkb2hA7mhQLV9WCbO6V7rE2YQzimqzRKt6IWOu-hYZY';

//对微信接口发一个请求获取。
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
    var message = req.body.xml; //这里全部变成小写了
    let openid = message.fromusername[0];
    let msg = {
        ToUserName: '',
        FromUserName: '',
        CreateTime: '',
        MsgType: '',
        Content: ''

    };
    if (message.msgtype == 'voice') {
        get_voice(access_token,message)
            .then(function(text){
                [msg.ToUserName, msg.FromUserName] = [message.fromusername, message.tousername];
                msg.CreateTime = new Date().getTime();
                msg.Content = text.text; //这里需要一个机器人
                msg.MsgType = 'text';
                var xml = builder.buildObject(msg);
                console.log(xml);
                res.send(xml);
            })
        ;

    }
    if (message.msgtype == 'text') {
        robot(message.content, openid)
            .then(function (text) {
                [msg.ToUserName, msg.FromUserName] = [message.fromusername, message.tousername];
                msg.CreateTime = new Date().getTime();
                msg.Content = text.text; //这里需要一个机器人
                msg.MsgType = 'text';
                var xml = builder.buildObject(msg);
                console.log(xml);
                res.send(xml);
            })
            .catch(function (error) {
                console.log(error);
            });



    }

});

module.exports = router;