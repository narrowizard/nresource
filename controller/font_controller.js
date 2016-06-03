var gulpfile = require('../utils/gulpfile');
var fs = require('fs');
var mime = require('mime');
var zlib = require('zlib');
var log = require('../utils/log');
var rename = require('gulp-rename');
var Fontmin = require('fontmin');

/**
 * compress 字体压缩
 * @params params.src 需要解析的url地址
 */
exports.compress = function (req, res, compress, filename, params) {
    var fontfile = global.CONTENTPATH + "/fonts/" + filename;
    var src = params && params.src;
    if (!src) {
        //不带参数,直接返回字体文件

    }
    gulpfile.handleFonts(fontfile, src, compress, res);

}

/**
 * translate 字体转换
 */
exports.translate = function (req, res, compress, filename) {
    //判断字体文件类型
    var extName = filename.substr(filename.lastIndexOf(".") + 1).toLowerCase();
    var fontName = filename.substr(0, filename.lastIndexOf("."));
    var filepath = global.CONTENTPATH + "/fonts/" + extName + "/" + filename;
    //首先查看是否已存在
    fs.stat(filepath, function (err, stats) {
        if (err) {
            //文件不存在
            translate(fontName, "ttf", "svg", res);
        } else if (stats.isFile()) {
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
            return;
        }
    });

}
var TRANSDICTIONARY = {
    "ttf": {
        "eot": 0,
        "woff": 1,
        "svg": 2
    },
    "otf": {
        "ttf": 3
    },
    "svg": {
        "ttf": 4
    }
};

function translate(font, origin, dest, res) {
    var originpath = global.CONTENTPATH + "/fonts/" + origin + "/" + font + "." + origin;
    var destpath = global.CONTENTPATH + "/fonts/" + dest + "/";
    var destname = font + "." + dest;
    var transtype = TRANSDICTIONARY[origin][dest];
    switch (transtype) {
        case 0: {
            var fontmin = new Fontmin()
                .src(originpath)
                .use(Fontmin.ttf2eot())
                .use(rename(destname))
                .dest(destpath)
                .run(function (err, files, stream) {
                    
                });
            break;
        }
        case 2: {
            var fontmin = new Fontmin()
                .src(originpath)
                .use(Fontmin.ttf2svg())
                .use(rename(destname))
                .dest(destpath)
                .run(function (err, files, stream) {
                    
                });
            break;
        }
    }
}