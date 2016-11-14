'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('npmUpdate', () => {
  const update = require('gulp-update')();

  gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('test', () => {
  return gulp.src(['tests/all.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }));
});

gulp.task('default', ['npmUpdate', 'test']);
