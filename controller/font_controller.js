var gulpfile = require('../utils/gulpfile');
var fs = require('fs');
var log = require('../utils/log');
var responseFile = require('../utils/file').responseFile;
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
            if (extName == "ttf") {
                res.writeHead(404, 'File Not Found!');
            } else if (extName == "eot") {
                //查找相应的ttf文件
                var ttfPath = global.CONTENTPATH + "/fonts/ttf/" + fontName + ".ttf";
                fs.stat(ttfPath, function (err2, stats2) {
                    if (err2) {
                        //ttf也不存在
                        res.writeHead(404, 'File Not Found!');
                    } else if (stats2.isFile()) {
                        //尝试转换
                        gulpfile.translateFonts(ttfPath, global.CONTENTPATH + "/fonts/eot/", filename, compress, res);
                    }
                });
                return;
            }
        } else if (stats.isFile()) {
            // 直接返回文件
            responseFile(req, res, filepath, stats, compress, filename);
            return;
        }
        res.writeHead(404, 'File Not Found!');
    });

}