'use strict';

var gulp = require('gulp');
var projectConfig = require(process.cwd() + '/project.config.js')();
var $ = require('gulp-load-plugins')({lazy: true});
var path = require('path');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var chalk = require('chalk');

/**
 * LESS
 * Generates a new css file from our less files
 */
gulp.task('less', function () {

  var mainLessFile = path.join(projectConfig.path.srcDir, projectConfig.path.assets.lessMain);
  var mainCssDir = path.join(projectConfig.path.srcDir, projectConfig.path.assets.cssDir);

  var cssFile = projectConfig.pkg.name + '.css';

  return gulp
    .src(mainLessFile)
    .pipe($.less({
      paths: [path.join(__dirname, 'less', 'includes')]
    })
      .on('error', function (err) {
        console.log('');
        console.log(chalk.red('X ') + 'LESS - ' + err.message);
        console.log('');
        this.emit('end');
      }))
    .pipe($.rename(cssFile))
    .pipe(gulp.dest(mainCssDir))
    .pipe(reload({stream: true}));

});
