var cache = require("../utils/cache");
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var respond = require('gulp-respond');
var mime = require('mime');
var log = require('../utils/log');
var zlib = require('zlib');

exports.handler = function (req, res, filename) {
    var originName = filename;
    //解码filename
    filename = decodeURIComponent(filename);
    //设置httphead
    res.statusCode = 200;
    res.setHeader("Content-Type", mime.lookup("js"));
    var now = new Date();
    now.setTime(now.getTime() + global.MAXAGE * 1000)
    res.setHeader('Expires', now.toUTCString());
    res.setHeader('Cache-Control', 'max-age=' + global.MAXAGE);
    var gzip = req.headers['accept-encoding'].indexOf('gzip') > -1;
    var deflate = req.headers['accept-encoding'].indexOf('deflate') > -1;
    if (gzip) {
        res.setHeader('Content-Encoding', 'gzip');
    } else if (deflate) {
        res.setHeader('Content-Encoding', 'deflate');
    }
    //处理缓存
    cache.get(originName + ".min.js", function (err, file, stats) {
        if (err) {
            //缓存不存在
            //console.error(err);
            //解码文件名
            var files = filename.split("&");
            for (var i = 0; i < files.length; i++) {
                files[i] = global.CONTENTPATH + "js/" + files[i].replace("|", "/") + ".js";
            }
            var lastModified = (new Date()).toUTCString();
            res.setHeader("Last-Modified", lastModified);
            gulp.task('default', function () {
                log.info("gulp task running default:", files);
                gulp.src(files)
                    .pipe(uglify())
                    .pipe(concat(originName + ".min.js"))
                    .pipe(respond(res))
                    .pipe(gulp.dest('content/cached'));
            });
            gulp.start("default");
        } else {
            var lastModified = stats.mtime.toUTCString();
            //如果没有修改，则返回304
            if (req.headers["if-modified-since"] && lastModified == req.headers["if-modified-since"]) {
                log.info("304");
                res.writeHead(304, "Not Modified");
                res.end();
                return;
            }
            res.setHeader("Last-Modified", lastModified);
            //返回缓存文件
            // res.statusCode = 200;
            file.on("open", function () {
                if (gzip) {
                    file.pipe(zlib.createGzip()).pipe(res);
                } else if (deflate) {
                    file.pipe(zlib.createDeflate()).pipe(res);
                } else {
                    file.pipe(res);
                }

            });
            file.on('error', function (err) {
                log.error(err);
            });
        }
    });
};