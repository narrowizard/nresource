var fs = require('fs');


/**
 * exists 文件是否存在
 * @param filename 文件名
 * @param callback (exist:boolean)=>any
 */
exports.exists = function (filename, callback) {
    var path = CACHEPATH + filename;
    fs.stat(path, function (err, stats) {
        if (err) {
            callback(false);
            return;
        } else if (stats.isFile()) {
            callback(true);
            return;
        } else {
            callback(false);
            return;
        }
    });
};