'use strict';

const {gulp, series, parallel, src, dest} = require('gulp'); //Require Gulp
const sass = require('gulp-sass'); //Require Gulp-Sass
const browserSync = require('browser-sync').create(); //Require and create browsersync
const useref = require('gulp-useref'); //Require Useref
const uglify = require('gulp-uglify'); //Require uglify
const gulpIf = require('gulp-if'); //Require gulpif
const cssnano = require('gulp-cssnano'); //Require cssnaano
const imagemin = require('gulp-imagemin'); //Require imagemin
const del = require('del') //Require del
//compile scss into something usefull
function style() {
    return src('app/scss/**/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream());
};

function watch() {
    browserSync.init({
        server: {
           baseDir: "./app",
           index: "/index.html"
        }
    });
    browserSync.watch('app/scss/**/*.scss', style)
    browserSync.watch('app/*.html').on('change',browserSync.reload);
    browserSync.watch('./js/**/*.js').on('change', browserSync.reload);
;}

function userefStuff() {
    return src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify())) //if it's JS minify
        .pipe(gulpIf('*.css', cssnano())) //if it's CSS minify
        .pipe(dest('dist'))
};

function images() {
    return src('app/img/**/*.+(png|jpg|jpeg|gif|svg')
        .pipe(imagemin({
            interlaced:true
        }))
        .pipe(dest('dist/img'))
};

function moveFonts() {
    return src('app/fonts/**/*')
        .pipe(dest('dist/fonts'))

};

function moveData() {
    return src('app/data/**/*')
        .pipe(dest('dist/data'))

};

async function deleteDist() {
    return del.sync('dist');

};


exports.watch = watch;

exports.style = style;

exports.userefStuff = userefStuff;

exports.images = images;

exports.moveFonts = moveFonts;

exports.moveData = moveData;

exports.deleteDist = deleteDist;

exports.build = series(
    deleteDist,
    parallel (
        style, userefStuff, images, moveFonts, moveData
    )
    );