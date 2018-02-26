var express = require('express');
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var router = express.Router();
router.get('/', function (req, res, next) {
    console.log('测试服务器正常运行');
    //token 是weixin
    //timestamp nonce token 按照字典排序
    //
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var token = 'weixin';
    var echostr = req.query.echostr;
    var signature = req.query.signature;
    var testArray = [timestamp, nonce, token];
    testArray.sort();
    var temp = testArray.join('');
    shasum.update(temp);
    var sha1test = shasum.digest('hex');
    is(sha1test == signature) {
        res.send(echostr);
    }
    else {
        console.log('验证出问题了');
        res.send(echostr);
    }

});

module.exports = router;