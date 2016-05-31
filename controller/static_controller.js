var fs = require('fs');
var mime = require('mime');
var log = require('../utils/log');
var zlib = require('zlib');

exports.handler = function (req, res, compress, filename) {
    if (!global.USECACHE) {
        var filepath = global.CACHEPATH + "static/" + filename;
        fs.stat(filepath, function (err, stats) {
            if (err) {
                log.error(err);
            } else if (stats.isFile()) {
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
                return;
            }
            log.info("[NotFound]");
            res.writeHead(404, "file not found!");
            res.end();
        });
    } else {
        log.info("[NotFound]");
        res.writeHead(404, "file not found!");
        res.end();
    }
}