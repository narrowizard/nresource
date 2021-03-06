var mime = require('mime');
var gulpfile = require('../utils/gulpfile');
var filedecoder = require('../utils/filedecoder');
var EXTNAME = "css";

exports.handler = function (req, res, compress, filename) {
    filename = encodeURIComponent(decodeURIComponent(filename));
    //content type
    res.setHeader("Content-Type", mime.lookup(EXTNAME) + ";charset=utf-8");
    //得到文件名
    var files = filedecoder.decodeFileName(filename, EXTNAME);

    var lastModified = (new Date()).toUTCString();
    res.setHeader("Last-Modified", lastModified);

    var fileorder = filedecoder.orderFile(files);
    gulpfile.handleCss(files, fileorder, filename, compress, res);
}