'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const typescript = require('gulp-tsc');

gulp.task('update', () => {
  const update = require('gulp-update')();

  return gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('compile', () => {
  return gulp.src([
      'web/src/**/*.ts',
      '!web/src/main.prod.ts',
  ])
    .pipe(typescript({ experimentalDecorators: true }))
    .pipe(gulp.dest('web/dist'));
});

gulp.task('dev', ['compile'], () => {
  console.log('dev');
});

gulp.task('test', ['compile'], () => {
  return gulp.src(['tests/all.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit(0);
    });
});

gulp.task('default', ['compile', 'test']);
