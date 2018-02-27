var http = require('http');
let config = {
    url: "http://www.tuling123.com/openapi/api",
    appkey: "bcc8fb1c07f249958696116df73f0156"
}

function robot(content,id) {
    return new Promise(function (resolve, reject) {
        const postData = JSON.stringify({
            key: config.appkey,
            userid: id,
            info: content
        });

        const options = {
            hostname: 'www.tuling123.com',
            port: 80,
            path: '/openapi/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                resolve(JSON.parse(chunk));
            });
            res.on('end', () => {

            });
        });

        req.on('error', (e) => {
            console.error(`problem with request: ${e.message}`);
            reject(e.message);
        });

        // write data to request body
        req.write(postData);
        req.end();

    })

}

module.exports = robot;