var fs = require('fs');


/**
 * exists 文件是否存在
 * @param filename 文件名
 * @param callback (exist:boolean)=>void
 */
exports.exists = function (filename, callback) {
    var path = global.CACHEPATH + filename;
    fs.stat(path, function (err, stats) {
        if (err) {
            callback(false);
        } else if (stats.isFile()) {
            callback(true);
        } else {
            callback(false);
        }
    });
};

/**
 * get 从缓存中读取文件
 * @param filename 文件名
 * @param callback (err,filestream)=>void
 */
exports.get = function (filename, callback) {
    var path = global.CACHEPATH + filename;
    fs.stat(path, function (err, stats) {
        if (err) {
            //文件不存在
            callback(err);
        } else if (stats.isFile()) {
            var file = fs.createReadStream(path);
            callback(null, file, stats);
        } else {
            //不是文件
            callback(new Error("dest is not file."));
        }
    });
}