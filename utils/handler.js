var router = require('./router').router;
var cache = require("../utils/cache");
var log = require('./log');
var mime = require('mime');

exports.handle = function (req, res) {
    //router.dispatch
    log.info("[Req]" + req.url);
    //压缩方式
    var compress = "";
    //expires
    var now = new Date();
    now.setTime(now.getTime() + global.MAXAGE * 1000)
    res.setHeader('Expires', now.toUTCString());
    res.setHeader('Cache-Control', 'max-age=' + global.MAXAGE);
    //compress
    var gzip = req.headers['accept-encoding'].indexOf('gzip') > -1;
    var deflate = req.headers['accept-encoding'].indexOf('deflate') > -1;
    if (gzip) {
        res.setHeader('Content-Encoding', 'gzip');
        compress = "gzip";
    } else if (deflate) {
        res.setHeader('Content-Encoding', 'deflate');
        compress = "deflate";
    }
    var cachePath = req.url;
    //处理缓存
    cache.stats(cachePath, function (stats) {
        if (!stats || !stats.isFile()) {
            //缓存不存在,交给路由处理
            router.parse(req.url, [req, res, compress]);
        } else {
            log.info("hit cache:", cachePath);
            //解析content type
            var aa = /\/(\w+)\//;
            var type = aa.exec(req.url);
            res.setHeader("Content-Type", mime.lookup(type[1]) + ";charset=utf-8");

            var lastModified = stats.mtime.toUTCString();
            //如果没有修改，则返回304
            if (req.headers["if-modified-since"] && lastModified == req.headers["if-modified-since"]) {
                res.writeHead(304, "Not Modified");
                res.end();
                return;
            }
            res.setHeader("Last-Modified", lastModified);
            //将文件写入response
            res.statusCode = 200;
            cache.read(cachePath, compress, res);
        }
    });

}