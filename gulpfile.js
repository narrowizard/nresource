'use strict';

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');

gulp.task('default', function () {
    gulp.src(['content/js/libs/json2.js', 'content/js/libs/dhtmlxcalendar.js'])
        .pipe(uglify())
        .pipe(concat('7e4dea7ffb4602bda93fca8c9a879834' + ".min.js"))
        .pipe(gulp.dest('content/cached'));
});