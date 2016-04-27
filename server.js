var http = require('http');
var fs = require('fs');
var mime = require('mime');
var crypto = require('crypto');
var fileconcat = require('./fileconcat.js');

// @param url: /folder1/file1&file2&file3-filetype
http.createServer(function (req, res) {
    var url = req.url;
    //得到path
    //计算md5
    var md5sum = crypto.createHash('md5');
    var filename = md5sum.update(url).digest('hex');
    //去除root
    url = url.substr(1);
    var path = url.split("-");
    if (path.length !== 2) {
        //请求url格式错误
        res.writeHead(400);
        res.write('Bad request 400\n');
        res.end();
        return;
    }
    //文件类型
    var filetype = path[1];
    //content-type
    var type = mime.lookup(filetype);
    res.setHeader('Content-Type', type);

    //文件名
    var files = path[0].split("&");

    fileconcat.generate(files, filetype, filename, res);
}).listen(8124);

console.log('server running at 8124');