'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const tsc = require('gulp-typescript');

gulp.task('update', () => {
  const update = require('gulp-update')();

  return gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('compile', () => {
  const tsProject = tsc.createProject('tsconfig.json');
  gulp.src([
    'web/src/**/*.ts',
    '!web/src/main.prod.ts',
  ])
    .pipe(tsc(tsProject))
    .pipe(gulp.dest('web/dist'));
});


gulp.task('test', ['compile'], () =>
   gulp.src(['tests/all.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
    }))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit(0);
    })
);

gulp.task('default', ['compile', 'test']);
