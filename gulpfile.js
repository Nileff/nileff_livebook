/**
 * Created by Alender on 14.12.2015.
 */
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var webpackStream = require('webpack-stream');
var webpack = webpackStream.webpack;
var named = require('vinyl-named');
var browserSync = require('browser-sync').create();
var runSequence = require('gulp-run-sequence');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', ['less','webpack', 'sync', 'watch']);

gulp.task('watch', ['less','webpack'], function () {
    gulp.watch('./less/**/*.less', ['less']);
});

gulp.task('watch_less', ['less'], function () {
    gulp.watch('./less/**/*.less', ['less']);
});

gulp.task('webpack', function (callback) {
    var firstBuild = true;

    return webpackStream( require('./webpack.config.js') )
        .pipe(gulp.dest('build'))
        .on('data', function () {
            if(firstBuild)
            {
                firstBuild = false;
                callback();
            }
        });
});

gulp.task('less', function () {
    return gulp.src('./less/style*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 1%', 'IE 9'],
            cascade: false
        }))
        .pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('sync', ['less','webpack'], function(){
    browserSync.init({
        server: './build'
    })
    gulp.watch('./build/**/*.*').on('change', browserSync.reload);
});