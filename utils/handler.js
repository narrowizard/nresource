var router = require('./router').router;
var cache = require("../utils/cache");
var log = require('./log');
var url = require('url');
var qs = require('querystring');
var mime = require('mime');

exports.handle = function (req, res) {
    var originUrl = req.url;
    //router.dispatch
    if (originUrl.indexOf("..") > -1) {
        log.warning((new Date()).toLocaleString(), "[Req]", originUrl);
        res.writeHead(404, "file not found!");
        res.end();
        return;
    } else {
        log.info((new Date()).toLocaleString(), "[Req]", originUrl);
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

    // 不使用缓存 直接交给路由
    if (!global.USECACHE) {
        router.parse(originUrl, [req, res, compress]);
        return;
    }
    //去除originUrl中的参数部分
    var urlObject = url.parse(originUrl);
    var cachePath = urlObject.pathname;
    cachePath = encodeURIComponent(decodeURIComponent(cachePath));
    //替换/
    cachePath = cachePath.replace(/%2F/g,'\/');
    //解析参数
    var params = qs.parse(urlObject.query);
    if (params.cache == "false" && global.DEBUG) {
        //不使用缓存(仅debug模式)
        router.parse(originUrl, [req, res, compress]);
        return;
    }
    //处理缓存
    cache.stats(cachePath, function (stats) {
        if (!stats || !stats.isFile()) {
            //缓存不存在,交给路由处理
            router.parse(originUrl, [req, res, compress]);
        } else {
            log.info("hit cache:", cachePath);
            //解析content type
            res.setHeader("Content-Type", mime.lookup(cachePath) + ";charset=utf-8");

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