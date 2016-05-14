var router = require('./router').router;
var cache = require("../utils/cache");
var log = require('./log');
var mime = require('mime');

exports.handle = function (req, res) {
    var url = req.url;
    //router.dispatch
    if (url.indexOf("..") > -1) {
        log.warning((new Date()).toLocaleString(), "[Req]", url);
        res.writeHead(404, "file not found!");
        res.end();
        return;
    } else {
        log.info((new Date()).toLocaleString(), "[Req]", url);
    }
    //压缩方式
    var compress = "";
    var requestHeaders = req.headers;
    //expires
    var now = new Date();
    now.setTime(now.getTime() + global.MAXAGE * 1000);
    res.setHeader('Expires', now.toUTCString());
    res.setHeader('Cache-Control', 'max-age=' + global.MAXAGE);
    //compress
    var gzip = false
        , deflate = false;
    if (requestHeaders['accept-encoding']) {
        gzip = requestHeaders['accept-encoding'].indexOf('gzip') > -1;
        deflate = requestHeaders['accept-encoding'].indexOf('deflate') > -1;
    }
    if (gzip) {
        res.setHeader('Content-Encoding', 'gzip');
        compress = "gzip";
    } else if (deflate) {
        res.setHeader('Content-Encoding', 'deflate');
        compress = "deflate";
    }
    var cachePath = url;
    if (!global.USECACHE) {
        // 不使用缓存
        router.parse(url, [req, res, compress]);
        return;
    }
    //处理缓存
    cache.stats(cachePath, function (stats) {
        if (!stats || !stats.isFile()) {
            //缓存不存在,交给路由处理
            router.parse(url, [req, res, compress]);
        } else {
            log.info("hit cache:", cachePath);
            //解析content type
            res.setHeader("Content-Type", mime.lookup(url) + ";charset=utf-8");
            // if (url.indexOf("/static") > -1) {
            //     //静态路由
            //     res.setHeader("Content-Type", mime.lookup(url) + ";charset=utf-8");
            // } else if (url.indexOf("/sass") > -1) {
            //     //设置sass路由的contenttype为css
            //     res.setHeader("Content-Type", mime.lookup('css') + ";charset=utf-8");
            // } else {
            //     var aa = /\/(\w+)\//;
            //     var type = aa.exec(url);
            //     if (type) {
            //         res.setHeader("Content-Type", mime.lookup(type[1]) + ";charset=utf-8");
            //     } else {
            //         res.setHeader("Content-Type", mime.lookup(url) + ";charset=utf-8");
            //     }
            // }
            var lastModified = stats.mtime.toUTCString();
            //如果没有修改，则返回304
            if (requestHeaders["if-modified-since"] && lastModified == requestHeaders["if-modified-since"]) {
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