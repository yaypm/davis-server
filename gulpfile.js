'use strict';

const gulp = require('gulp');
const fs = require('fs');
const runSequence = require('run-sequence');
const mocha = require('gulp-spawn-mocha');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const merge = require('merge-stream');
const update = require('gulp-update')();
const uglify = require('gulp-uglify');
const rimraf = require('rimraf');
const bump = require('gulp-bump');
const conventionalChangelog = require('gulp-conventional-changelog');
const minimist = require('minimist');
const tar = require('gulp-tar');
const untar = require('gulp-untar');
const git = require('gulp-git');
//const github = require('gulp-github-release');
const spawn = require('child_process').spawn;
const source = require('vinyl-source-stream');
const request = require('request');


const options = minimist(process.argv.slice(2), {
  string: 'semver',
  default: { semver: 'patch' },
});

gulp.task('github-release');

gulp.task('changelog', () => {
  return gulp.src('CHANGELOG.md', {
    buffer: false
  })
    .pipe(conventionalChangelog({
      preset: 'angular',
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('bump-version', () => {
  return gulp.src(['package.json'])
    .pipe(bump({ type: options.semver }))
    .pipe(gulp.dest('./'));
});

gulp.task('update', () => {
  return gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('pack', (done) => {
  const pack = spawn('npm', ['pack', '.']);
  pack.on('close', () => {
    done();
  });
});

gulp.task('make-release', ['compile:prod', 'pack'], () => {
  const version = JSON.parse(fs.readFileSync('package.json')).version;
  const dist = `dynatrace-davis-dist-${version}.tar`;
  return gulp.src('web/dist/**')
    .pipe(tar(dist))
    .pipe(gulp.dest('./'));
});

gulp.task('clean', function (cb) {
    rimraf('./web/dist', cb);
});

gulp.task('compile:dev', ['clean'], () => {
  const tsProject = tsc.createProject('tsconfig.json');
  const destinationFolder = 'web/dist';

  const compiledTs = gulp.src([
    'web/src/**/*.ts',
    '!web/src/main.prod.ts',
    ])
    .pipe(sourcemaps.init())
      .pipe(tsProject())
    .pipe(sourcemaps.write('/'))
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

gulp.task('compile:prod', ['clean'], () => {
  const tsProject = tsc.createProject('tsconfig.json');
  const destinationFolder = 'web/dist';

  const compiledTs = gulp.src([
    'web/src/**/*.ts',
    '!web/src/main.prod.ts',
    ])
    .pipe(tsProject())
    .pipe(uglify())
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


gulp.task('test', () =>
   gulp.src(['tests/all.js'], { read: false })
    .pipe(mocha({
      reporter: 'spec',
      timeout: 20000,
    }))
);

gulp.task('watch', ['compile:dev'], function() {
    gulp.watch('web/src/**/*.ts', ['compile:dev']);
    gulp.watch('web/src/**/*.html', ['compile:dev']);
});

gulp.task('commit', () => {
  const version = JSON.parse(fs.readFileSync('package.json')).version;
  gulp.src('.')
    .pipe(git.add())
    .pipe(git.commit(`[Prerelease] bump ${version}`))
});

//gulp.task('checkout-master');
//gulp.task('merge-dev');
//gulp.task('push');
//gulp.task('github-release');

gulp.task('release', (cb) => {
  runSequence('bump-version', 'changelog', 'make-release', cb);
});
