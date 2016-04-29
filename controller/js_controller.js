var mime = require('mime');
var gulpfile = require('../utils/gulpfile');

exports.handler = function (req, res, compress, filename) {
    //解码filename
    decodeName = decodeURIComponent(filename);
    //content type
    res.setHeader("Content-Type", mime.lookup("js") + ";charset=utf-8");
    //得到文件名
    var files = decodeName.split("&");
    for (var i = 0; i < files.length; i++) {
        files[i] = global.CONTENTPATH + "js/" + files[i].replace(/\|/g, "/") + ".js";
    }
    var lastModified = (new Date()).toUTCString();
    res.setHeader("Last-Modified", lastModified);

    var fileorder = [];
    for (var i = 0; i < files.length; i++) {
        fileorder[i] = files[i].substr(files[i].lastIndexOf("/") + 1);
    }
    gulpfile.handleJavascript(files, fileorder, filename, compress, res);
};