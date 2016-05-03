var mime = require('mime');
var gulpfile = require('../utils/gulpfile');
var fs = require('fs');
var EXTNAME = "sass";

exports.handler = function (req, res, compress, filename) {
    var filepath = global.CONTENTPATH + EXTNAME + "/" + filename + "/main." + global.SASS;
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
        res.writeHead(404, "file not found!");
        res.end();
    });

}