var mime = require('mime');
var gulpfile = require('../utils/gulpfile');
var EXTNAME = "sass";

exports.handler = function (req, res, compress, filename) {
    var filepath = global.CONTENTPATH + EXTNAME + "/" + filename + "/main." + global.SASS;
    //content type
    res.setHeader("Content-Type", mime.lookup("css") + ";charset=utf-8");

    var lastModified = (new Date()).toUTCString();
    res.setHeader("Last-Modified", lastModified);

    gulpfile.handleSass(filename, filepath, compress, res);
}