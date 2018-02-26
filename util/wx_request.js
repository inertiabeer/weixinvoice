var https = require('https');
var config = require('./config.js');

var options = {
    hostname: 'api.weixin.qq.com', //path需要用决定路径，必须加上/不然会报错。
    path: '/cgi-bin/token?grant_type=client_credential&appid=' + config.wechat.appid + '&secret=' + config.wechat.secret,
    method: 'GET',
};

function get_access_token() {
    return new Promise(get_token);
}

function get_token(resolve, reject) {
    var req = https.request(options, (res) => {
        res.setEncoding('utf8');
        console.log('STATUS:' + res.statusCode);
        res.on('data', function (chunk) {
            resolve(chunk);
            
        })

    })
    req.on('error', (e) => {
        reject(e.message);
    });
    req.end();
}
module.exports={
    get_access_token:get_access_token
}