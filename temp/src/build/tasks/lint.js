var gulp = require('gulp')
var shell = require('gulp-shell')

// runs eslint on all .js files
gulp.task('lint', shell.task('standard'))
