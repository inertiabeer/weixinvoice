var request = require('request');
var fs = require('fs');
var recognize = require('./baidu_speech').recognize;
var robot = require('./robot');
var options = {
    hostname: 'file.api.weixin.qq.com', //path需要用绝对路径，必须加上/不然会报错。
    method: 'GET',
};

function get_voice(access_token, message) {
    return new Promise(function(resolve,reject){
        let mediaid = message.mediaid;
        let openid = message.openid;
        options.path = '/cgi-bin/media/get?&access_token=' + access_token + '&media_id=' + mediaid;
        var voice_url = 'http://' + options.hostname + options.path;
        //陷入回调地狱
        request
            .get(voice_url)
            .on('error', function (err) {
                reject(err);
            })
            .pipe(fs.createWriteStream('./voice/' + mediaid + '.amr', {
                flags: 'w',
                encoding: 'utf8',
                fd: null,
                mode: 0o666,
                autoClose: true
            })
                .on('close', function () {
                    recognize(mediaid)
                        .then(function (result) {
                            result.result[0]; //这是第一句话
                            robot(message.content, openid).then(function(text){
                                resolve(text);
                            }).catch(function(err){
                                reject(err);
                            });
                        });

                }));


    });


}
module.exports = {
    get_voice: get_voice
};