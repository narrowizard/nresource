var cache = require("../utils/cache");
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var respond = require('gulp-respond');

exports.handler = function (res, filename) {
    var originName = filename;
    //解码filename
    filename = decodeURIComponent(filename);
    //设置httphead
    res.writeHead(200, {
        "Cache-Control": "max-age=0"
    });
    //处理缓存
    cache.get(originName + ".min.js", function (err, file) {
        if (err) {
            //缓存不存在
            //console.error(err);
            //解码文件名
            var files = filename.split("&");
            for (var i = 0; i < files.length; i++) {
                files[i] = global.CONTENTPATH + "js/" + files[i].replace("|", "/") + ".js";
            }
            gulp.task('default', function () {
                console.log("gulp task running default:", files);
                gulp.src(files)
                    .pipe(uglify())
                    .pipe(concat(originName + ".min.js"))
                    .pipe(gulp.dest('content/cached'))
                    .pipe(respond(res));
            });
            gulp.start("default");
        } else {
            //返回缓存文件
            // res.statusCode = 200;
            file.on("open", function () {
                file.pipe(res);
            });
            file.on('error', function (err) {
                console.log(err);
            });
        }
    });
}