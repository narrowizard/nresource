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
var insert = require('gulp-insert');

var remoteSrc = require('gulp-remote-src');
var fontmin = require('gulp-fontmin');

var ttf2eot = require('gulp-ttf2eot');

var log = require('../utils/log');

/**
 * translateFonts 字体转换,ttf => eot
 * ttf兼容所有的主流浏览器
 * eot支持ie6+
 * @param originpath ttf字体路径
 * @param destpath eot字体目录
 * @oaram destname eot字体名称
 */
exports.translateFonts = function (originpath, destpath, destname, compress, res) {
    gulp.task('transFonts', function () {
        gulp.src(originpath)
            .pipe(ttf2eot())
            .pipe(rename(destname))
            .pipe(gulp.dest(destpath))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start('transFonts');
}


exports.handleFonts = function (font, src, compress, res) {
    gulp.task('fontmin', function () {
        var buffers = [];

        remoteSrc([""], { base: src })
            .on('data', function (file) {
                buffers.push(file.contents);
            })
            .on('end', function () {
                var text = Buffer.concat(buffers).toString('utf-8');
                gulp.src(font)
                    .pipe(fontmin({
                        text: text,
                        onlyChinese: true
                    }))
                    .pipe(gulp.dest(global.CACHEPATH + "/fonts/"))
                    // .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
                    .pipe(respond(res));
            });
    });
    gulp.start('fontmin');
}

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

exports.tinytsCompiler = function (project, viewmodel, filenames, compress, res) {
    var filename = project + "/" + viewmodel;
    var tsconfig = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        target: "ES5",
        module: "amd",
        emitError: false,
        out: filename
    };
    var vmName = viewmodel.substr(0, viewmodel.lastIndexOf("."));
    var className = vmName[0].toUpperCase() + vmName.substr(1);
    var projectInit = 'require(["project/' + project + '/viewmodels/' + vmName + '"],function(vm){var model = new vm.' + className + 'Model();});';

    gulp.task('tinytsCore', function () {
        gulp.src(filenames)
            .pipe(typescript(tsconfig))
            .pipe(insert.append(projectInit))
            .pipe(uglify({ mangle: false }))
            .pipe(gulp.dest(global.CACHEPATH + "/tinyts/"))
            .pipe(gulpif(compress == "gzip", pako.gzip(), gulpif(compress == "deflate", pako.deflate())))
            .pipe(respond(res));
    });
    gulp.start('tinytsCore');

}