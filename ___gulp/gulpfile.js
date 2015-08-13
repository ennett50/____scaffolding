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


var spritesmith = require("gulp.spritesmith");
var jsdoc = require("gulp-jsdoc");




if (!fs.existsSync('../web/')){
    fs.mkdirSync('../web/');
}

var showErr = function(err) {
    console.log("\n\n======================================================\n\n	" + err + "\n\n======================================================\n\n");
    return this.emit('end');
};

var getDesc = function(txt) {
    var dict, key, value;
    dict = fs.readFileSync('./dictionary.json', 'utf-8');
    dict = JSON.parse(dict);
    for (key in dict) {
        value = dict[key];
        if (key === txt) {
            return value;
        }
    }
    return txt;
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
            '!../__dev/styles/stylus/base/*.styl'

        ],
        styleBase : [
            '../__dev/styles/stylus/base/*.styl',
            '../__dev/styles/stylus/global/*.styl'
        ],
        styleVendors:  '../__dev/styles/vendors/*.css',

        img: '../__dev/images/**/*.*',
        fonts: '../__dev/fonts/**/*.*',
        index : '../__dev/_index/index.jade',
        spriteRetina: '../__dev/sprite/',
        stylSprite : '../__dev/styles/stylus/global/'
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

        fonts: '../__dev/fonts/**/*.*',

        index : '../__dev/_index/index.jade',
        sprite : '../__dev/sprite/**/*.*'
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
    gulp.start('html:index');
});

gulp.task('html:index', function () {
    dirs = fs.readdirSync('../web/');
    files = [];
    for (i = 0, len = dirs.length; i < len; i++){
        var file = dirs[i];
        if (file.indexOf('.html') + 1 && !(file.indexOf('index') + 1)) {
            files.push({
                file: file.replace('.html', ''),
                name: getDesc(file)
            });

        }
    }

    gulp.src(path.src.index)
        .pipe(jade({pretty: true, locals: {'pages': files}}))
        .on('error', showErr)
        .pipe(gulp.dest(path.web.html))
        .pipe(reload({stream: true}));

    gulp.src('../__dev/_index/*')
        .pipe(gulp.dest('../web/_index/'));


});
gulp.task('js:Doc', function () {
    gulp.src(path.src.jsProduction)
        .pipe(jsdoc('../web/___documentation-jsDOC'));
});


gulp.task('js:devProduction', function () {
    gulp.src(path.src.jsProduction)
        .on('error', showErr)
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
    //gulp.start('js:Doc');
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
        .pipe(uglify())
        .pipe(gulp.dest(path.web.js))
        .pipe(reload({stream: true}));
});
gulp.task('css:styleBase', function () {
    gulp.src(path.src.styleBase)
        .pipe(concat('vendor_base.styl'))
        .pipe(gulp.dest('../__dev/styles/__tmp/'))
        .on('error', showErr)
        .pipe(stylus({
            compress: true
        }))
        .on('error', showErr)
        .pipe(prefixer({
            browsers: ['last 20 version']
        }))
        .on('error', showErr)
        .pipe(rename('vendor_base.css'))
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

gulp.task('css:styleProduction', function () {
    gulp.src(path.src.styleProduction)
        .pipe(concat('00_production.styl'))
        .on('error', showErr)
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('../__dev/styles/__tmp/'))
        .on('error', showErr)
        .pipe(stylus({
            compress: true
        }))
        .on('error', showErr)
        .pipe(sourcemaps.write())
        .pipe(prefixer({
            browsers: ['last 20 version']
        }))
        .on('error', showErr)
        .pipe(rename('production.css'))
        .on('error', showErr)
        .pipe(gulp.dest(path.web.css))
        .pipe(reload({stream: true}));
});



gulp.task('img:dev', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.web.img))
        .pipe(reload({stream: true}));
});
gulp.task('fonts:dev', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.web.fonts))
});
gulp.task('sprite:dev', function() {
    var spriteData =
        gulp.src('../__dev/sprite/*.*') // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.styl',
                cssFormat: 'stylus',
                imgPath: 'sprite.png',

                //retinaSrcFilter: [path.src.spriteRetina + '*-2x.png'],
                //retinaImgName: 'sprite-2x.png',
                //retinaImgPath: 'sprite-2x.png',

                algorithm: 'binary-tree',
                padding: 5,
                cssTemplate: 'stylus.template.mustache',
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }))
            .on('error', showErr);

    spriteData.img.pipe(gulp.dest(path.web.img)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest(path.src.stylSprite)); // путь, куда сохраняем стили
    spriteData.pipe(reload({stream: true}));
});

gulp.task('dev', [
    'html:dev',
    'js:devProduction',
    'js:devBase',
    'js:devVendors',
    'css:styleBase',
    'css:styleVendors',
    'css:styleProduction',
    'img:dev',
    'html:index',
    'fonts:dev',
    'sprite:dev'
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
    watch(path.watch.styleBase, function(event, cb) {
        gulp.start('css:styleBase');
    });
    watch(path.watch.styleVendors, function(event, cb) {
        gulp.start('css:styleVendors');
    });
    watch(path.watch.styleProduction, function(event, cb) {
        gulp.start('css:styleProduction');
    });

    watch(path.watch.img, function(event, cb) {
        gulp.start('img:dev');
    });
    watch(path.watch.index, function(event, cb) {
        gulp.start('html:index');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:dev');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite:dev');
    });


});

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});


gulp.task('default', ['dev', 'webserver', 'watch']);
