var gulp = require('gulp');
var jshint = require('gulp-jshint');
var coveralls = require('gulp-coveralls');
var del = require('del');

gulp.task('clean', function() {
    "use strict";
    del(['node_modules', 'coverage'], function(err, delfiles) {
        if (err) {
            return err;
        }
        return delfiles;
    });
});

gulp.task('jshint', function() {
    "use strict";
    return gulp.src([
            './test/**/*.js',
            './lib/**/*.js',
            'index.js',
            'gulpfile.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-reporter-jscs'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('coveralls', function() {
    "use strict";
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['jshint'], function() {});
