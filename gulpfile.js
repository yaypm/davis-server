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
  string: 'branch',
  default: { branch: '' },
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
    .pipe(bump({ type: 'minor' }))
    .pipe(gulp.dest('./'));
});

gulp.task('patch-version', () => {
  return gulp.src(['package.json'])
    .pipe(bump({ type: 'patch' }))
    .pipe(gulp.dest('./'));
});

gulp.task('update', () => {
  return gulp.watch('./package.json').on('change', (file) => {
    update.write(file);
  });
});

gulp.task('pack', ['compile:prod'], (done) => {
  spawn('npm', ['pack', '.'])
    .on('close', done);
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

gulp.task('commit', (done) => {
  const version = JSON.parse(fs.readFileSync('package.json')).version;
  spawn('git', ['add', '.'])
    .on('close', () => {
      spawn('git', ['commit', '-m', `[Prerelease] bump ${version}`])
        .on('close', done);
    });
});

gulp.task('checkout-master', (done) => {
  spawn('git', ['checkout', 'master'])
    .on('close', done);
});

gulp.task('checkout-dev', (done) => {
  spawn('git', ['checkout', 'dev'])
    .on('close', done);
});

gulp.task('merge-master', (done) => {
  spawn('git', ['merge', 'master'])
    .on('close', done);
});

gulp.task('merge-dev', (done) => {
  spawn('git', ['merge', 'dev'])
    .on('close', done);
});

gulp.task('merge-branch', (done) => {
  if (!options.branch) cb('must specify a branch');
  spawn('git', ['merge', options.branch])
    .on('close', done);
});
//gulp.task('push');
//gulp.task('github-release');

gulp.task('release-minor', (cb) => {
  runSequence('checkout-master', 'merge-dev', 'bump-version', 'changelog', 'commit',  'make-release', 'checkout-dev', 'merge-master', cb);
});

gulp.task('release-patch', (cb) => {
  if (!options.branch) cb('must specify a branch');
  runSequence('checkout-master', 'merge-branch', 'patch-version', 'changelog', 'commit',  'make-release', 'checkout-dev', 'merge-branch', cb);
});
