var mime = require('mime');
var gulpfile = require('../utils/gulpfile');
var fs = require('fs');
var log = require('../utils/log');
var EXTNAME = "sass";

var compass = require('compass');

exports.handler = function (req, res, compress, filename) {
    var filepath = global.CONTENTPATH + EXTNAME + "/" + filename.substr(0, filename.lastIndexOf(".")) + "/main." + global.SASS;
    fs.stat(filepath, function (err, stats) {
        if (err) {

        } else if (stats.isFile()) {
            //content type
            res.setHeader("Content-Type", mime.lookup("css") + ";charset=utf-8");

            var lastModified = (new Date()).toUTCString();
            res.setHeader("Last-Modified", lastModified);

            gulpfile.handleSass(filename, filepath, compress, res);
            return;
        }
        log.info("[NotFound]");
        res.writeHead(404, "file not found!");
        res.end();
    });

}

exports.compass = function (req, res, compress, filename) {
    var filepath = global.CONTENTPATH + "compass/" + filename.substr(0, filename.lastIndexOf(".")) + "/";
    var filename = global.CONTENTPATH + "compass/" + filename.substr(0, filename.lastIndexOf(".")) + '/sass/main.' + global.SASS;
    var configpath = filepath + "config.rb";
    fs.stat(configpath, function (err, stats) {
        if (err) {

        } else if (stats.isFile()) {
            //content type
            res.setHeader("Content-Type", mime.lookup("css") + ";charset=utf-8");

            var lastModified = (new Date()).toUTCString();
            res.setHeader("Last-Modified", lastModified);
            compass.compile({ cwd: filepath }, function (err, stdout, stderr) {
                if (err) {
                    log.error(err);
                    res.writeHead(500, "compile failed");
                } else {
                    //编译成功
                    res.writeHead(200, "succ");
                }
                res.end();
            });
            return;
        }
        log.info("[NotFound]");
        res.writeHead(404, "file not found!");
        res.end();
    });
}