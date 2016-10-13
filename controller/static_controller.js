var fs = require('fs');
var mime = require('mime');
var log = require('../utils/log');
var zlib = require('zlib');
var responseFile = require('../utils/file').responseFile;

exports.handler = function (req, res, compress, filename) {
    // 不使用缓存时,静态路由需要单独处理
    // 文件名支持unicode
    filename = decodeURIComponent(filename);
    var filepath = global.CACHEPATH + "static/" + filename;
    fs.stat(filepath, function (err, stats) {
        if (err) {
            log.error(err);
        } else if (stats.isFile()) {
            responseFile(req, res, filepath, stats, compress, filename);
            return;
        }
        log.info("[NotFound]");
        res.writeHead(404, "file not found!");
        res.end();
    });

}