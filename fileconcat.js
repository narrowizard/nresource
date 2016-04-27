'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var fs = require('fs');
var respond = require('gulp-respond');

/**
 * generate 生成并返回文件
 * @param files 文件数组列表
 * @param filetype 文件类型,暂时只支持js,css
 * @param filename 文件名
 * @param res 输出流
 */
exports.generate = function (files, filetype, filename, res) {
    var dest = 'content/cached/' + filename + ".min." + filetype;
    var params = {
        res: res,
        files: files,
        dest: dest,
        filetype: filetype,
        filename: filename
    };
    findAndWriteFile(dest, res, generateFile, params);
}

/**
 * findAndWriteFile 查找文件,并且将文件pipe到res中
 * @param filename 文件路径
 * @param res 输出流
 * @param callback 错误回调
 * @param params 错误回调的参数
 */
function findAndWriteFile(dest, res, callback, params) {
    fs.stat(dest, function (err, stats) {
        if (err) {

        }
        else if (stats.isFile()) {
            //设置状态
            res.statusCode = 200;
            //文件已存在,直接返回
            var file = fs.createReadStream(dest);
            file.on("open", function () {
                file.pipe(res);
            });
            file.on('error', function (err) {
                console.log(err);
            });
            return;
        }
        if (callback) {
            callback(params);
        } else {
            //未定义出错,并且出错

        }

    });
}

/**
 * generateFile 生成文件,生成成功后调用输出流
 * @param params 
 * params.files 文件名数组
 * params.dest 文件路径
 * params.res 输出流
 * params.filetype 文件类型
 */
function generateFile(params) {
    var files = params.files;
    var dest = params.dest;
    var res = params.res;
    var filetype = params.filetype;
    var filename = params.filename;
    //压缩合并生成文件
    for (var i = 0; i < files.length; i++) {
        files[i] = "content" + "/" + filetype + "/" + files[i] + "." + filetype;
    }
    switch (filetype) {
        case 'js': {
            gulp.task('default', function () {
                console.log("gulp task running default:", files);
                gulp.src(files)
                    .pipe(uglify())
                    .pipe(concat(filename + ".min.js"))
                    .pipe(gulp.dest('content/cached'))
                    .pipe(respond(res));
            });

            break;
        }
        case 'css': {
            gulp.task('default', function () {
                console.log("gulp task running default:", files);
                gulp.src(files)
                    .pipe(minifycss())
                    .pipe(concat(filename + ".min.css"))
                    .pipe(gulp.dest('content/cached'))
                    .pipe(respond(res));
            });
            break;
        }
        default: {

        }
    }
    //运行任务
    gulp.start("default");
}

/**
 * internalError 内部错误
 * @param res 输出流
 */
function internalError(params) {
    var res = params.res;
    //文件不存在
    res.writeHead(500);
    res.write('Internal Error 500\n');
    res.end();
}
