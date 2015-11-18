'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var browserSync  = require('browser-sync');
var nodemon = require('gulp-nodemon');
var path = require('path');
var fs = require('fs');


var watchifyOpts = { poll: true };
var bundler = watchify(browserify('./client/app.jsx', watchify.args), watchifyOpts);

bundler.transform(babelify);

bundler.on('update', function(){
  gutil.log('file changed, browserify it');
  bundle();
});

function bundle() {

  gutil.log('bundling up the js goodness');

  return bundler.bundle()
    .on('error', function(err){
      gutil.log(err.message);
      browserSync.notify('Browserify Error!');
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./client/js/dist'))
    .pipe(browserSync.stream());
}

gulp.task('create-config', function(done){
  fs.writeFile('client/config.json', JSON.stringify({
    env: gutil.env.env
  }), done);
});

gulp.task('bundle', ['create-config'], function() {
  bundle();
});

gulp.task('nodemon', function(){
  nodemon({
    script: './app.js',
    ext: 'js',
    ignore: ['client/**/*.*']
  })
  .on('restart', function(){
    gutil.log('restarting the process');
  });
});

gulp.task('serve', ['browsersync']);

gulp.task('browsersync', ['bundle', 'nodemon'], function() {
  browserSync({
    files: ['client/**/*.jsx'],
    open: 'local',
    server: 'client',
    ui: {
      port: '4000'
    },
    port: '3001'
  });
});
