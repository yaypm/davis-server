'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('default', () => {
  return gulp.src(['tests/all.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));
});
