exports.handler = function (res, filename) {
    //解码filename
    filename = decodeURIComponent(filename);
    //处理缓存
    
    var files = filename.split("&");
    for (var i = 0; i < files.length; i++) {
        files[i] = files[i].replace("|", "/");
    }
    
    
    
}