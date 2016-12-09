'use strict';

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const update = require('gulp-update')();
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('update', () => {
  return gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('compile', () => {
  const tsProject = tsc.createProject('tsconfig.json');
  const destinationFolder = 'web/dist';

  const compiledTs = gulp.src([
    'web/src/**/*.ts',
    '!web/src/main.prod.ts',
    ])
    .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(uglify())
      //.pipe(gulp.dest(destinationFolder))
      //.pipe(concat('all.min.js'))
    .pipe(sourcemaps.write('/maps'))
    //.pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(destinationFolder));

  const copy = gulp.src([
    'web/src/systemjs.config.js',
    'web/src/**/*.html',
    ])
    .pipe(gulp.dest(destinationFolder));


  const assets = gulp.src([
    'web/src/assets/**/*',
    ])
    .pipe(gulp.dest(destinationFolder + '/assets'));

  return merge(compiledTs, copy, assets);
});

gulp.task('test', ['update'], () =>
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

gulp.task('watch', ['compile'], function() {
    gulp.watch('web/src/**/*.ts', ['compile']);
    gulp.watch('web/src/**/*.html', ['compile']);
});

gulp.task('default', ['compile', 'test']);
