var mime = require('mime');
var zlib = require('zlib');
var fs = require('fs');
var log = require('../utils/log');

exports.responseFile = function (req, res, filepath, stats, compress, filename) {
    //直接返回
    var requestHeaders = req.headers;
    res.setHeader("Content-Type", mime.lookup(filename) + ";charset=utf-8");
    var lastModified = stats.mtime.toUTCString();
    //如果没有修改，则返回304
    if (requestHeaders["if-modified-since"] && lastModified == requestHeaders["if-modified-since"]) {
        log.info("[NotModified]");
        res.writeHead(304, "Not Modified");
        res.end();
        return;
    }
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("Access-Control-Allow-Origin", "*");
    //将文件写入response
    res.statusCode = 200;
    var file = fs.createReadStream(filepath);
    file.on("open", function () {
        if (compress === "gzip") {
            file.pipe(zlib.createGzip()).pipe(res);
        } else if (compress === "deflate") {
            file.pipe(zlib.createDeflate()).pipe(res);
        } else {
            file.pipe(res);
        }
    });
    file.on('error', function (err) {
        log.error(err);
    });
}