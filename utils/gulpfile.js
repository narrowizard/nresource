var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var respond = require('gulp-respond');
var pako = require('gulp-pako');
var gulpif = require('gulp-if');
var order = require("gulp-order");
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var typescript = require('gulp-tsc');

var log = require('../utils/log');

/**
 * handleJavascript 处理js文件
 * @param filenames 文件名数组(带path)
 * @param fileorder 文件顺序
 * @param filename 缓存文件名
 * @param res 数据流
 */
exports.handleJavascript = function (filenames, fileorder, filename, compress, res) {
    gulp.task('js', function () {
        gulp.src(filenames)
            .pipe(uglify())
            .pipe(order(fileorder))
            .pipe(concat(filename))
            .pipe(gulp.dest(global.CACHEPATH + "/js/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start("js");
}

exports.handleCss = function (filenames, fileorder, filename, compress, res) {
    gulp.task('css', function () {
        gulp.src(filenames)
            .pipe(minifycss())
            .pipe(order(fileorder))
            .pipe(concat(filename))
            .pipe(gulp.dest(global.CACHEPATH + "/css/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start("css");
}

/**
 * handleSass 处理sass文件
 * @param filename 缓存文件名
 * @param filepath 文件路径
 * @param compress 压缩方式 
 * @param res 输出流
 */
exports.handleSass = function (filename, filepath, compress, res) {
    gulp.task('sass', function () {
        gulp.src(filepath)
            .pipe(sass().on('error', function (err) { log.error(err) }))
            .pipe(rename(filename))
            .pipe(minifycss())
            .pipe(gulp.dest(global.CACHEPATH + "/sass/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start("sass");
}

/**
 * tsCompiler 编译ts文件并返回
 * @param filename 缓存文件名
 * @param filenames 需要编译的文件,支持多个(数组)
 * @param compress 压缩方式
 * @param res 输出流
 */
exports.tsCompiler = function (filename, filenames, compress, res) {
    var tsconfig = {
        experimentalDecorators: true,
        target: "ES5",
        emitDecoratorMetadata: true,
        module: "amd",
        emitError: false
    };
    gulp.task('tsCompiler', function () {
        gulp.src(filenames)
            .pipe(typescript(tsconfig))
            .pipe(concat(filename))
            .pipe(uglify())
            .pipe(gulp.dest(global.CACHEPATH + "/ts/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start('tsCompiler');

}

exports.tinytsCompiler = function (filename, filenames, compress, res) {
    var tsconfig = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        target: "ES5",
        module: "amd",
        emitError: false,
        out: filename
    };
    gulp.task('tinytsCore', function () {
        gulp.src(filenames)
            .pipe(typescript(tsconfig))
            .pipe(uglify({ mangle: false }))
            .pipe(gulp.dest(global.CACHEPATH + "/tinyts/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start('tinytsCore');

}