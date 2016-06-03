var fs = require('fs');
var mime = require('mime');
var log = require('../utils/log');
var zlib = require('zlib');
var responseFile = require('../utils/file').responseFile;

exports.handler = function (req, res, compress, filename) {
    if (!global.USECACHE) {
        var filepath = global.CACHEPATH + "static/" + filename;
        fs.stat(filepath, function (err, stats) {
            if (err) {
                log.error(err);
            } else if (stats.isFile()) {
                responseFile(req, res, filepath, stats, compress, filename);
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