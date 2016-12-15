'use strict';

const gulp = require('gulp');
const version = require('./package.json').version;
const rimraf = require('rimraf');
const untar = require('gulp-untar');
const source = require('vinyl-source-stream');
const request = require('request');

const dist = `dynatrace-davis-dist-${version}.tar`;

gulp.task('get-dist', ['clean'], () =>
  request(`https://dyladan.me/${dist}`)
    .pipe(source(dist))
    .pipe(untar())
    .pipe(gulp.dest('./web/dist')));

gulp.task('clean', function (cb) {
    rimraf('./web/dist', cb);
});

