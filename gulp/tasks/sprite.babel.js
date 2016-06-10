// 参考記事
// http://bunlog.d-s-b.jp/2014/12/19/optimize-gulpfile-for-gulp-spritesmith/

import gulp from 'gulp';
import spritesmith from 'gulp.spritesmith';
import fs from 'fs';
import path from 'path';

/* config */
const dir  = {
    src   : './develop/src',
    dest  : './develop/build',
    scss  : 'scss',
    img   : 'img',
    sprite: 'sprite'
};

/**
 * helper関数
 * 再帰的にフォルダーを検索して、フォルダ群を格納した配列を返す
**/
const getFolders = dir => {
    return fs.readdirSync(dir)
        .filter(file => {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

// todo: べた書き部分をconfigに定義
gulp.task('sprite', function () {
    // set target folders
    const folders = getFolders(dir.dest + '/' + dir.img + '/sprite/');

    // generate image & sass files
    folders.map(folder => {
        const spriteData = gulp.src('sprite/' + folder + '/*.png', { cwd: dir.dest + '/' + dir.img })
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
