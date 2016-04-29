
exports.decodeFileName = function (filename, extName) {
    //解码filename
    decodeName = decodeURIComponent(filename);
    var files = decodeName.split("&");
    for (var i = 0; i < files.length; i++) {
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