var fs = require('fs');
var zlib = require('zlib');

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
};

/**
 * stats 获取文件状态
 * @param filename 文件名
 * @param callback (stats)=>void
 */
exports.stats = function (filename, callback) {
    var path = global.CACHEPATH + filename;
    fs.stat(path, function (err, stats) {
        if (err) {
            callback();
        } else {
            callback(stats);
        }
    });
};

/**
 * read 查找缓存文件,若存在,则写入stream
 * @param filename 文件名
 * @param compress 压缩方式
 * @param stream 输出流
 */
exports.read = function (filename, compress, stream) {
    var path = global.CACHEPATH + filename;
    fs.stat(path, function (err, stats) {
        if (err) {

        } else if (stats.isFile()) {
            var file = fs.createReadStream(path);
            file.on("open", function () {
                if (compress === "gzip") {
                    file.pipe(zlib.createGzip()).pipe(stream);
                } else if (compress === "deflate") {
                    file.pipe(zlib.createDeflate()).pipe(stream);
                } else {
                    file.pipe(stream);
                }

            });
            file.on('error', function (err) {
                log.error(err);
            });
            return;
        }
    });
};
