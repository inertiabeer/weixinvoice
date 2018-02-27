var request = require('request');
//promise
function get_user_info(access_token, openid) {

    let url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + access_token + "&openid=" + openid;
    return new Promise(function (resolve, reject) {
        request
            .get(url)
            .on('error', function (err) {
                reject(err);
            })
            .on('response', function (res) {
                resolve(res.body);
            })

    })
}
module.exports={
    get_user_info:get_user_info
}