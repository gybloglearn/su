var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var inject = require('gulp-inject-string');

var jetpack = require('fs-jetpack');
var fs = require('fs');

var minimist = require('minimist');

var projectDir = jetpack;
var srcDir = projectDir.cwd('.');

gulp.task('default', function () {
  console.log("NO problem");
});

var knownOptions = {
  string: 'name',
  string: 'service',
  string: 'serviceUrl',
  string: 'controller',
  default: { name: 'new_project' + new Date().getTime(), service: 'service', serviceUrl: './components/PHP/file.php', controller: 'Controller'}
}

var options = minimist(process.argv.slice(2), knownOptions);
var destDir = projectDir.cwd(options.name);

gulp.task('clean', function () {
  return destDir.dirAsync('.', { empty: true });
});
gulp.task('copy', ['clean'], function () {
  return projectDir.copyAsync('.', destDir.path(), {
    overwrite: true,
    matching: [
      '*.html',
      './components/**/*.html',
      '!./node_modules/**',
      '!./bower_components/**'
    ]
  });
});

gulp.task('publish', ['copy'], function () {
  return gulp.src('./index.html')
    .pipe(usemin({ app: [uglify()], css: [cssmin()] }))
    .pipe(gulp.dest(options.name + '/'));
});

gulp.task('addroute', [], function () {

  console.log('ADD to index');
  gulp.src('./index.html', { base: process.cwd() })
    .pipe(inject.before('<!--endbuild--><!--adds-->', '<script src="components/home/' + options.controller + '/' + options.controller + '.ctrl.js"></script>\r\n\t'))
    .pipe(gulp.dest('.'));

  console.log('ADD to menu');
  gulp.src('./components/home/home.html', { base: process.cwd() })
    .pipe(inject.after('<md-menu-content width="4">', '\n<md-menu-item ui-sref="home.' + options.controller + '">\n' +
      '\t<md-button>\n' +
      '\t\t<div layout="row" flex>\n' +
      '\t\t\t<p flex>' + options.controller[0].toUpperCase() + options.controller.slice(1) + '</p>\n' +
      '\t\t\t<md-icon md-menu-align-target class="materia-icons">dashboard</md-icon>\n' +
      '\t\t</div>\n' +
      '\t</md-button>\n' +
      '</md-menu-item>'
    ))
    .pipe(gulp.dest('.'));

  gulp.src('./config.js', { base: process.cwd() })
    .pipe(inject.before('}).state(\'login\', {', '' +
      '}).state(\'home.' + options.controller + '\', {\n' +
        '\t\t\turl: \'' + options.controller + '\',\n' +
        '\t\t\ttemplateUrl: \'./components/home/' + options.controller + '/' + options.controller + '.html\',\n' +
        '\t\t\tcontroller: \'Home' + options.controller[0].toUpperCase() + options.controller.slice(1) + 'Controller\',\n' +
        '\t\t\tcontrollerAs: \'vm\',\n' +
        '\t\t\tparent: \'home\'\n\t\t'
    ))
    .pipe(gulp.dest('.'));

  console.log('ADD controller file');
  gulp.src('../su_components/templates/controller.ctrl.js', { base: process.cwd() })
    .pipe(inject.replace('Controller', 'Home' + options.controller[0].toUpperCase() + options.controller.slice(1) + 'Controller'))
    .pipe(rename({
      dirname: './components/home/' + options.controller,
      basename: options.controller,
      suffix: '.ctrl',
      extname: '.js'
    }))
    .pipe(gulp.dest('.'));

  console.log('ADD html file');
  gulp.src('../su_components/templates/file.html', { base: process.cwd() })
    .pipe(inject.replace('Vezérlőpult', options.controller[0].toUpperCase() + options.controller.slice(1)))
    .pipe(rename({
      dirname: './components/home/' + options.controller,
      basename: options.controller,
      extname: '.html'
    }))
    .pipe(gulp.dest('.'));

});

gulp.task('addservice', [], function () {

  console.log('ADD to index');
  gulp.src('./index.html', { base: process.cwd() })
    .pipe(inject.before('<!--endbuild--><!--adds-->', '<script src="./components/services/' + options.service + '.service.js"></script>\r\n\t'))
    .pipe(gulp.dest('.'));

  console.log('ADD service file');
  gulp.src('../su_components/templates/factory.service.js', { base: process.cwd() })
    .pipe(inject.replace('Service', options.service[0].toUpperCase() + options.service.slice(1) + 'Service'))
    .pipe(inject.replace('/url/', options.serviceUrl))
    .pipe(rename({
      dirname: './components/services',
      basename: options.service,
      suffix: '.service',
      extname: '.js'
    }))
    .pipe(gulp.dest('.'));

});