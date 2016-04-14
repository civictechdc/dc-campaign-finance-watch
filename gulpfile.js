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
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var shell = require('gulp-shell');



var watchifyOpts = {
    poll: true
};
var bundler = browserify({
    entries: ['./client/index.jsx'],
    debug: true
});

bundler.plugin(watchify, {
        delay: 100,
        ignoreWatch: ['**/node_modules/**'],
        poll: true
    })
    .transform(babelify);

bundler.on('update', function () {
    gutil.log('file changed, browserify it');
    bundle();
});

function bundle() {

    gutil.log('bundling up the js goodness');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify('Browserify Error!');
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./client/js/dist'))
        .pipe(browserSync.stream());
}

gulp.task('create-config', function (done) {
    fs.writeFile('client/config.json', JSON.stringify({
        env: gutil.env.env
    }), done);
});

gulp.task('bundle', ['create-config'], function () {
    bundle();
});

gulp.task('nodemon', function () {
    nodemon({
            script: './app.js',
            ext: 'js',
            ignore: ['client/**/*.*', 'node_modules', 'gulpFile.js']
        })
        .on('restart', function () {
            gutil.log('restarting the process');
        });
});

gulp.task('redis-start', function() {
    if(gutil.env.env === 'local' && shell.task(['ps cax | grep redis']).length === 0){
        console.log('meow');
        child_process.exec('redis-server', function(err, stdout, stderr) {
            console.log(stdout);
            if (err !== null) {
                console.log('exec error: ' + err);
            }
        });
    }
});

gulp.task('serve', ['redis-start', 'browsersync']);

gulp.task('css-inject', function(){
   browserSync.reload('*.css');
});
gulp.task('browsersync', ['bundle', 'nodemon','css-inject'], function () {
    browserSync.init({
        files: ["client/css/*.css", 'client/**/*.jsx', 'client/**/*.js'],
        open: 'local',
        server: 'client',
        ui: {
            port: '4000'
        },
        port: '3001'
    });
});
