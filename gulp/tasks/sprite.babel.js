// 参考記事
// http://bunlog.d-s-b.jp/2014/12/19/optimize-gulpfile-for-gulp-spritesmith/

// ---------------------------------
// config
// ---------------------------------
// load gulp.js & plugins
var gulp = require('gulp'),
    spritesmith = require('gulp.spritesmith');

// load Node.js API
var fs   = require('fs'),
    path = require('path');

// directory
var dir  = {
    src   : './develop/src',
    dest  : './develop/build',
    scss  : 'scss',
    img   : 'img',
    sprite: 'sprite'
};

// ---------------------------------
// Functions
// ---------------------------------
// function.getFolders
var getFolders = function (dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

// ---------------------------------
// Tasks
// ---------------------------------
// task.sprites
gulp.task('sprite', function () {
    // set target folders
    var folders = getFolders(dir.dest + '/' + dir.img + '/sprite/');

    // generate image & sass files
    folders.map(function (folder) {
        var spriteData = gulp.src('sprite/' + folder + '/*.png', { cwd: dir.dest + '/' + dir.img })
            .pipe(spritesmith({
                imgName  : folder + '.png',
                imgPath  : '../' + dir.img + '/' + dir.sprite + '/' + folder + '.png',
                cssName  : '_' + folder + '.scss',
                algorithm: 'binary-tree',
                padding  : 4,
                cssFormat: 'scss',
                cssOpts: {
                    functions: false
                }
            }));

        spriteData.img.pipe(gulp.dest(dir.dest + '/' + dir.img + '/' + dir.sprite));
        spriteData.css.pipe(gulp.dest(dir.src + '/' + dir.scss + '/' + 'foundation/variables' + '/' + dir.sprite));
    });
});
