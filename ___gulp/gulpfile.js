var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rigger = require('gulp-rigger'),
    browserSync = require('browser-sync'),
    prefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    reload = browserSync.reload,
    concat = require('gulp-concat'),
    fs = require('fs'),
    prettify = require('gulp-prettify'),
    clarify = require('clarify'),
    pathR =  require('path');

if (!fs.existsSync('../web/')){
    fs.mkdirSync('../web/');
}

var showErr = function(err) {
    console.log("\n\n======================================================\n\n	" + err + "\n\n======================================================\n\n");
    return this.emit('end');
};

var path = {
    web: {
        html: '../web/',
        js: '../web/scripts/',
        css: '../web/css/',
        img: '../web/images/',
        fonts: '../web/fonts/'
    },
    src : {
        jade: '../__dev/views/*.jade',
        jsProduction : '../__dev/scripts/production/*.js',
        jsBase:  '../__dev/scripts/base/*.js',
        jsVendors:  '../__dev/scripts/vendors/*.js',

        styleProduction : [
            '../__dev/styles/stylus/**/*.styl',
            '!../__dev/styles/stylus/base/*.styl',
            '!../__dev/styles/stylus/global/*.styl'
        ],
        styleBase : [
            '../__dev/styles/stylus/base/*.styl',
            '../__dev/styles/stylus/global/*.styl'
        ],
        styleVendors:  '../__dev/styles/vendors/*.css',

        img: '../__dev/images/**/*.*',
        fonts: '../__dev/fonts/**/*.*'
    },
    watch: {
        html: '../__dev/views/**/*.jade',
        jsProduction : '../__dev/scripts/production/**/*.js',
        jsBase:  '../__dev/scripts/base/*.js',
        jsVendors:  '../__dev/scripts/vendors/*.js',

        styleProduction : [
            '../__dev/styles/stylus/**/*.styl',
            '!../__dev/styles/stylus/base/*.styl'
        ],

        styleBase : [
            '../__dev/styles/stylus/base/*.styl',
            '../__dev/styles/stylus/global/*.styl'
        ],
        styleVendors:  '../__dev/styles/vendors/*.css',

        img: '../__dev/images/**/**/*.*',

        fonts: '../__dev/fonts/**/*.*'
    },
    clean: '../web'
};


var config = {
    server: {
        baseDir: "../web"
    },
   // tunnel: true,
    host: 'localhost',
    port: 3000,
    logPrefix: "frontend"
};


gulp.task('html:dev', function () {
    gulp.src(path.src.jade)
        .pipe(jade({pretty: true }))
        .on('error', showErr)
        .pipe(prettify({indent_size: 1, indent_char: '\t'}))
        .pipe(gulp.dest(path.web.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:devProduction', function () {
    gulp.src(path.src.jsProduction)
        .pipe(rigger())
        .on('error', showErr)
        .pipe(sourcemaps.init())
        .pipe(uglify({
            preserveComments: 'some'
        })) //Сожмем наш js
        .on('error', showErr)
        .pipe(sourcemaps.write())
        .on('error', showErr)
        .pipe(gulp.dest(path.web.js))
        .pipe(reload({stream: true}));
});
gulp.task('js:devBase', function () {
    gulp.src(path.src.jsBase)
        .pipe(gulp.dest(path.web.js))
        .on('error', showErr)
        .pipe(reload({stream: true}));
});
gulp.task('js:devVendors', function () {
    gulp.src(path.src.jsVendors)
        .pipe(concat('vendors.js'))
        .on('error', showErr)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest(path.web.js))
        .pipe(reload({stream: true}));
});


gulp.task('css:styleProduction', function () {
    gulp.src(path.src.styleProduction)
        .pipe(concat('00_production.styl'))
        .on('error', showErr)
        .pipe(sourcemaps.init())
        .pipe(stylus({
            compress: true
        }))
        .on('error', showErr)
        .pipe(sourcemaps.write())
        .pipe(prefixer({
            browsers: ['last 20 version']
        }))
        .pipe(rename('production.css'))
        .on('error', showErr)
        .pipe(gulp.dest(path.web.css))
        .pipe(reload({stream: true}));
});

gulp.task('css:styleBase', function () {
    gulp.src(path.src.styleBase)
        .pipe(concat('00_base.styl'))
        .pipe(stylus({
            compress: true
        }))
        .on('error', showErr)
        .pipe(prefixer({
            browsers: ['last 20 version']
        }))
        .pipe(rename('00_base.css'))
        .pipe(gulp.dest('../__dev/styles/vendors/'));
});
gulp.task('css:styleVendors', function () {
    gulp.src(path.src.styleVendors)
        .pipe(concat('vendors.css'))
        .pipe(prefixer({
            browsers: ['last 20 version']
        }))
        .on('error', showErr)
        .pipe(minifyCSS({keepSpecialComments: 0}))
        .on('error', showErr)
        .pipe(gulp.dest(path.web.css))
        .pipe(reload({stream: true}));
});

gulp.task('img:dev', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.web.img))
        .pipe(reload({stream: true}));
});

gulp.task('dev', [
    'html:dev',
    'js:devProduction',
    'js:devBase',
    'js:devVendors',
    'css:styleProduction',
    'css:styleBase',
    'css:styleVendors',
    'img:dev'
  //  'fonts:dev'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:dev');
    });
    watch([path.watch.jsProduction], function(event, cb) {
        gulp.start('js:devProduction');
    });
    watch([path.watch.jsVendors], function(event, cb) {
        gulp.start('js:devVendors');
    });
    watch(path.watch.styleProduction, function(event, cb) {
        gulp.start('css:styleProduction');
    });
    watch(path.watch.styleBase, function(event, cb) {
        gulp.start('css:styleBase');
    });
    watch(path.watch.styleVendors, function(event, cb) {
        gulp.start('css:styleVendors');
    });
    watch(path.watch.img, function(event, cb) {
        gulp.start('img:dev');
    });


});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['dev', 'webserver', 'watch']);