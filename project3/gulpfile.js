'use strict';
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'autoprefixer', 'del']
});
let isDevelopment = true;
const path = require('path');
const browserSync = require('browser-sync').create();
const settings = require('./gulp-settings.js');
const postcssPlagins = [
    plugins.autoprefixer({
        browsers: ['last 2 version']
    })
];
const php = require('gulp-connect-php');

const reloadPage = (cb) => {
    browserSync.reload();
    cb();
}

// compile from sass to css
gulp.task('allSass', () => {
    const entryDir = settings.scssDir.entry;

    return gulp.src(
            path.resolve(__dirname, entryDir + '/**/*.scss'), {
                base: entryDir
            }
        )
        .pipe(plugins.cached('allSass'))
        .pipe(plugins.sassMultiInheritance({ dir: entryDir + '/' }))
        .pipe(plugins.plumber(function(error) {
            plugins.util.log(plugins.util.colors.bold.red(error.message));
            plugins.util.beep();
            this.emit('end');
        }))
        .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.postcss(postcssPlagins))
        .pipe(plugins.if(isDevelopment, plugins.sourcemaps.write('./')))
        .pipe(plugins.plumber.stop())
        .pipe(gulp.dest(function(file) {
            return file.stem === settings.scssDir.mainFileName || file.stem === settings.scssDir.mainFileName + '.css' ?
                path.resolve(__dirname, settings.scssDir.mainFileOutput) :
                path.resolve(__dirname, settings.scssDir.output);
        }))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

gulp.task('copyHtml', function() {
    return gulp
        .src(settings.devDir + '/*.html')
        .pipe(gulp.dest(settings.publicDir))
});

gulp.task('copyScripts', () => {
    return gulp.src(
            [
                path.resolve(__dirname, settings.jsDir.entry + '/**/*.js')
            ], {
                base: path.resolve(__dirname, settings.jsDir.entry)
            }
        )
        .pipe(plugins.cached('copyScripts'))
        .pipe(gulp.dest(settings.jsDir.output))
});

gulp.task('copyAssets', function() {
    return gulp
        .src(settings.devDir + '/assets/**/*')
        .pipe(gulp.dest(settings.publicDir + '/assets'))
});

// server
gulp.task('server', cb => {
    browserSync.init({
        server: {
            baseDir: settings.publicDir,
            port: 3010,
            directory: true,
            notify: false
        },
        browser: 'google chrome',
    }, cb);
});

// image optimization
gulp.task('imagesOptimize', () => {
    const output = path.resolve(__dirname, settings.imagesDir.output);

    return gulp
        .src(output + '/**/*.+(png|jpg|gif|svg)')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(output))
        .pipe(plugins.count('## images was optimize', { logFiles: true }));
});

// css beautify
gulp.task('beautify', () => {
    return gulp.src(settings.publicDir + '/css/*.css')
        .pipe(plugins.cssbeautify())
        .pipe(gulp.dest(settings.publicDir + '/css'));
});

// css beautify
gulp.task('beautify-min', () => {
    return gulp.src(settings.publicDir + '/css/*.css')
        .pipe(plugins.clean - css({ compatibility: 'ie8' }))
        .pipe(plugins.concat('main.min.css'))
        .pipe(gulp.dest(settings.publicDir + '/css'));
});

gulp.task('watch', function(cb) {
    gulp.watch(
        path.resolve(__dirname, settings.devDir + '/*.html'),
        gulp.series('copyHtml')
    );

    gulp.watch(
        path.resolve(__dirname, settings.devDir + '/assets/**/*'),
        gulp.series('copyAssets')
    );

    gulp.watch(
        path.resolve(__dirname, settings.scssDir.entry + '/**/*.scss'),
        gulp.series('allSass')
    ).on('unlink', function(filePath) {
        delete plugins.cached.caches.allSass[path.resolve(filePath)];
    });

    gulp.watch(
        [
            path.resolve(__dirname, settings.jsDir.entry + '/*')
        ],
        gulp.series('copyScripts')
    ).on('unlink', function(filePath) {
        delete plugins.cached.caches.copyScripts[path.resolve(filePath)];
    });

    gulp.watch(
        [
            path.resolve(__dirname, settings.jsDir.output + '/*.js'),
            path.resolve(__dirname, settings.publicDir + '/*.html')
        ],
        gulp.series(reloadPage)
    );
    cb();
});

gulp.task('clear', (cb) => {
    plugins.del(path.resolve(__dirname, settings.publicDir), { read: false }).then(paths => {
        cb();
    });
});

gulp.task('build', gulp.parallel(
    'copyAssets',
    'copyHtml',
    'copyScripts',
    'allSass'
));

gulp.task('dist', gulp.series(
    (cb) => {
        isDevelopment = false;
        cb();
    },
    'clear',
    'build',
    'imagesOptimize',
    'beautify'
));

gulp.task('dist-min', gulp.series(
    (cb) => {
        isDevelopment = false;
        cb();
    },
    'clear',
    'build',
    'imagesOptimize',
    'beautify-min'
));

gulp.task('default', gulp.series('build', 'server', 'watch'));