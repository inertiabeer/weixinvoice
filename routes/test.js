var express=require('express');
var router = express.Router();
router.post('/', function (req, res, next) {
    console.log('测试服务器正常运行');
    res.send('yes');
});

module.exports = router;
