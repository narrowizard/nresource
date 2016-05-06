var log = require('./log');

exports.decodeFileName = function (filename, extName) {
    //解码filename
    decodeName = decodeURIComponent(filename);
    var files = decodeName.split("&");
    for (var i = 0; i < files.length; i++) {
        if (i == files.length - 1) {
            //最后一个自带了扩展名
            files[i] = files[i].substr(0, files[i].lastIndexOf("."));
        }
        files[i] = global.CONTENTPATH + extName + "/" + files[i].replace(/\|/g, "/") + "." + extName;
    }
    return files;
}

exports.orderFile = function (files) {
    var fileorder = [];
    for (var i = 0; i < files.length; i++) {
        fileorder[i] = files[i].substr(files[i].lastIndexOf("/") + 1);
    }
    return fileorder;
}