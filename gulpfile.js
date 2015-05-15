// https://github.com/gulpjs/gulp/tree/master/docs
var gulp = require('gulp');

// https://www.npmjs.com/package/gulp-webpack/
var webpack = require("gulp-webpack");

// https://github.com/webpack/webpack-with-common-libs/blob/master/webpack.config.js
// 开发`Tingle component`时使用的配置
var developConfig = require('./webpack.develop.js');

// 发布`Tingle Component`时使用的配置
var publishConfig = require('./webpack.publish.js');

// https://www.npmjs.com/package/gulp-rename/
var rename = require('gulp-rename');

// https://github.com/terinjokes/gulp-uglify
var uglify = require('gulp-uglify');

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/server-with-livereload-and-css-injection.md
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// https://github.com/floridoo/gulp-sourcemaps
var sourcemaps = require('gulp-sourcemaps');

// https://github.com/stevelacy/gulp-stylus
var stylus = require('gulp-stylus');

// https://www.npmjs.com/package/del/
var del = require('del');

gulp.task('clear', function () {
    del(['dist/*'], function (err, deletedFiles) {
        console.log('###### clear dist done ######');
    });
});

gulp.task('pack_demo', function() {
    gulp.src('')
        .pipe(webpack(developConfig))
        .pipe(gulp.dest('./dist'));
    console.info('###### pack_component done ######');
});

gulp.task('pack_component', function() {
    gulp.src('')
        .pipe(webpack(publishConfig))
        .pipe(gulp.dest('./dist'));
    console.info('###### pack_component done ######');
});

gulp.task('uglify_component', ['pack_component'], function () {
    gulp.src('./dist/**/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            // path = {
            //     "dirname": ".",
            //     "basename": "Hello",
            //     "extname": ".js"
            // }
            path.basename += '.min';
        }))
        .pipe(gulp.dest('./dist'));
    console.info('###### uglify_component done ######');
});

gulp.task('stylus', function() {
    gulp.src(['./src/**/*.styl'])
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./src'));
    console.info('###### stylus done ######');
});

// 开发`Tingle component`时，执行`gulp develop` or `gulp d`
gulp.task('develop', ['pack_demo', 'pack_component', 'stylus'], function() {
    browserSync({
        server: {
            baseDir: './'
        }
    });

    gulp.watch('src/**/*.js', ['pack_demo', 'pack_component', function () {
        setTimeout(function () {
            reload();
        }, 1000);
    }]);

    gulp.watch('demo/**/*.js', ['pack_demo', function () {
        setTimeout(function () {
            reload();
        }, 1000);
    }]);


    gulp.watch('src/**/*.styl', ['stylus', function () {
        setTimeout(function () {
            reload();
        }, 600);
    }]);
});

// 快捷方式
gulp.task('d', ['develop']);

// 发布`Tingle component`时，执行`gulp publish` or `gulp p`
gulp.task('publish', ['clear', 'pack_demo', 'pack_component', 'uglify_component']);

// 快捷方式
gulp.task('p', ['publish']);