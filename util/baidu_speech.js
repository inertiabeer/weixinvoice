var AipSpeechClient = require('baidu-aip-sdk').speech;
var path=require('path');
// 设置APPID/AK/SK
var config={
    app_id: '10129641',
    api_key: 'lWvG4pFnQsjZTV83yFTiZaKN',
    secret_key:'hv9Tbmq65rgI59y4mNpOVwG54hzheWPp'
};
function recognize(mediaid)
{
    // 新建一个对象，建议只保存一个对象调用服务接口
    var client = new AipSpeechClient(config.app_id, config.api_key, config.secret_key);
    let fs = require('fs');
    let voice = fs.readFileSync(path.resolve(__dirname, '../voice/'+mediaid+'.amr'));

    let voiceBuffer = new Buffer(voice);

    // 识别本地文件
    return client.recognize(voiceBuffer, 'amr', 8000);
    //百度返回的就是promise了
    // .then(function (result) {
    //     console.log('<recognize>: ' + JSON.stringify(result));
    // }, function (err) {
    //     console.log(err);
    // });
}
module.exports={
    recognize:recognize
};
