/**
 * tasks - dev, prod, sprite
 * 詳しくはREADME.mdを参照
 */
// todo: svg、iconfontタスクのパスをconigに移植
// todo: eslintの調整
// todo: stylelintの調整

/* js plugin */
import gulp    from 'gulp';
import webpack from 'gulp-webpack';
import eslint  from 'gulp-eslint';
import uglify  from 'gulp-uglify';

/* css plugin */
import sass         from 'gulp-sass';
import postcss      from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import stylelint    from 'stylelint'; // CSS構文チェック
import stylelintrc  from './stylelintrc'
import reporter     from 'postcss-reporter'; // ログ整形
import doiuse       from 'doiuse'; // クロスブラウザチェック
import cssnano      from 'cssnano';

/* img plugin */
import imagemin    from 'gulp-imagemin';
import spritesmith from 'gulp.spritesmith';
import svgmin      from 'gulp-svgmin';
import svgstore    from 'gulp-svgstore';
import svgSprite    from 'gulp-svg-sprite';
import cheerio     from 'gulp-cheerio';
import iconfont    from 'gulp-iconfont';
import iconfontCss from 'gulp-iconfont-css';
import fs          from 'fs';
import path        from 'path';
import template    from 'gulp-template';
import consolidate from 'gulp-consolidate';

/* common plugin */
import rename     from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import plumber    from 'gulp-plumber';
import notify     from 'gulp-notify';
import gulpif     from 'gulp-if';
import del        from 'del';
import gzip       from 'gulp-gzip';

/* config */
import conf    from './gulp/config.babel';

/* webpack setting */
import setting from './gulp/webpack_setting.babel';

/**
 * Development Tasks
 **/
gulp.task('jsDev', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        // .pipe(eslint({useEslintrc: true}))
        // .pipe(eslint.format())
        // .pipe(eslint.failAfterError())
        .pipe(webpack(setting.webpack))
        .pipe(sourcemaps.init({loadMaps: true}))
        // テストでuglifyする場合はconfを変更
        .pipe(gulpif(conf.jsUglifyDev, uglify()))
        .pipe(gulpif(conf.jsUglifyDev, rename(path => {
            path.extname = '.min.js';
        })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.jsDestDirDev))
        .pipe(notify('Js Finished'));
});

gulp.task('cssDev', () => {
    const processors = [
        // stylelint(stylelintrc),
        // doiuse({browsers: conf.browsers, ignore: conf.ignores}),
        autoprefixer({browsers: conf.browsers}),
        reporter()
    ];

    // テストでcssnanoする場合はconfを変更
    if (conf.cssNano) {
        processors.push(cssnano({autoprefixer: false}));
    }

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(rename(path => {
            if (conf.cssNanoDev) {
                path.extname = '.min.css';
            } else {
                path.extname = '.css';
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.cssDestDirDev))
        .pipe(notify('Scss Finished'));
});

gulp.task('watchDev', () => {
    gulp.watch(conf.jsSrc, ['jsDev']);
    gulp.watch(conf.cssSrc, ['cssDev']);
});

gulp.task('dev', ['watchDev']);

/**
 * Production Tasks
 **/
gulp.task('jsProd', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(webpack(setting.webpack))
        // uglifyしたくない場合はconfigでfalseに変更
        .pipe(gulpif(conf.jsUglifyProd, uglify()))
        // .pipe(gulpif(conf.jsUglifyProd, rename(path => {
        //   path.extname = '.min.js';
        // })))
        .pipe(gulp.dest(conf.jsDestDirProd))
        .pipe(notify('Js Finished'));
});

gulp.task('jsProdGzip', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(webpack(setting.webpack))
        // uglifyしたくない場合はconfigでfalseに変更
        .pipe(gulpif(conf.jsGzipProd, gzip()))
        .pipe(gulp.dest(conf.jsDestDirProd))
        .pipe(notify('JsGzip Finished'));
});

gulp.task('cssProd', () => {
    const processors = [
        autoprefixer({browsers: conf.browsers})
    ];

    // cssnanoしたくない場合はconfigでfalseに変更
    if (conf.cssNanoProd) {
        processors.push(cssnano({autoprefixer: false}));
    }

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest(conf.cssDestDirProd))
        .pipe(notify('Scss Finished'));
});

gulp.task('cssProdGzip', () => {
    const processors = [
        autoprefixer({browsers: conf.browsers})
    ];

    // cssnanoしたくない場合はconfigでfalseに変更
    if (conf.cssNanoProd) {
        processors.push(cssnano({autoprefixer: false}));
    }

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulpif(conf.jsGzipProd, gzip()))
        .pipe(gulp.dest(conf.cssDestDirProd))
        .pipe(notify('Scss Finished'));
});

gulp.task('imgProd', () => {
    const srcGlob = conf.imgSrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)',
        dstGlob = conf.imgDestDirProd,
        imageminOptions = {
            optimizationLevel: 7
        };

    gulp.src(srcGlob)
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(dstGlob))
        .pipe(notify('Img Finished'));
});

gulp.task('htmlProdGzip', () => {
    gulp.src('./develop/build/index.html')
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(gulpif(true, gzip()))
        .pipe(gulp.dest('./product'))
        .pipe(notify('HtmlGzip Finished'));
});

gulp.task('cleanProd', del.bind(null,
    [
        './product/img/**',
        './product/js/**',
        './product/css/**'
    ])
);

gulp.task('prod', [
    'cleanProd',
    'jsProd',
    'cssProd',
    'imgProd',
    'jsProdGzip',
    'cssProdGzip',
    'htmlProdGzip'
]);


/**
 * Sprite Tasks
 **/
// 指定ディレクトリ内に存在するディレクトリ名を再帰的に取得
const getFolders = dir => {
    return fs.readdirSync(dir)
        .filter(file => {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

gulp.task('sprite', function () {
    // spriteディレクトリ配下のディレクトリ名を再帰的に取得
    const folders = getFolders(conf.spriteDest + '/' + conf.spriteImg + '/sprite/');

    // generate image & sass files
    folders.map(folder => {
        const spriteData = gulp.src('sprite/' + folder + '/*.png', {cwd: conf.spriteDest + '/' + conf.spriteImg})
            .pipe(spritesmith({
                imgName: folder + '.png',
                imgPath: '../' + conf.spriteImg + '/' + conf.spriteDirName + '/' + folder + '.png',
                cssName: '_' + folder + '.scss',
                algorithm: 'binary-tree',
                padding: 4,
                cssFormat: 'scss',
                cssOpts: {
                    functions: false
                }
            }));

        spriteData.img.pipe(gulp.dest(conf.spriteDest + '/' + conf.spriteImg + '/' + conf.spriteDirName));
        spriteData.css.pipe(gulp.dest(conf.spriteSrc + '/' + conf.spriteScss + '/' + 'foundation/variables' + '/' + conf.spriteDirName));
    });
});

/**
 * Svg Sprite Tasks (ver background-position, use svg-sprite)
 * 参考サイト - https://www.liquidlight.co.uk/blog/article/creating-svg-sprites-using-gulp-and-sass/
 **/
gulp.task('svg_sprite', function () {
    const folders = getFolders(conf.svgBaseDir);

    folders.map(folder => {

        const srcSvg      = `${conf.svgBaseDir}/${folder}/*.svg`,
            srcScssTmp  = `${conf.tmpSrcDir}/_svg_sprite.scss`,
            destScssTmp = `../../../../develop/src/scss/foundation/variables/svg_sprite/_${folder}.scss`,
            srcHtmlTmp  = `${conf.tmpSrcDir}/_svg_sprite.html`,
            destHtmlTmp = `../../../../develop/build/img/svg_sprite/${folder}/svg_sample.html`;

        return gulp.src(srcSvg)
            .pipe(svgmin())
            .pipe(svgSprite({
                shape: {
                    dimension: {
                        maxWidth : 32,
                        maxHeight: 32
                    },
                    spacing: {
                        padding: 0
                    }
                },
                mode: {
                    css: {
                        dest  : "./",
                        layout: "diagonal",
                        sprite: `${folder}.svg`,
                        bust  : false,
                        render: {
                            scss: {
                                template: srcScssTmp,
                                dest    : destScssTmp
                            },
                            html: {
                                template: srcHtmlTmp,
                                dest    : destHtmlTmp
                            }
                        }
                    }
                },
                variables: {
                    dirname: folder
                }
            }))
            .pipe(gulp.dest(conf.svgBaseDir));
    })
});

/**
 * Svg Sprite Tasks (ver fragmentIdentifier, use svg-store)
 **/
gulp.task('svg_sprite_flag', () => {
    const baseDir = conf.svgFlagBaseDir;
    // baseDir配下のディレクトリ名を再帰的に取得
    const folders = getFolders(baseDir);

    folders.map(folder => {
        // svgスプライトの素材対象
        const srcGlob = conf.svgFlagBaseDir + '/' + folder + '/*.svg',
        // サンプルガイドの格納先ディレクトリ
              templateSrcGlob = conf.tmpSrcDir + '/_svg_sprite_flag.html',
              templateDestGlob = baseDir + '/' + folder;

        gulp.src(srcGlob, {base: baseDir})
            .pipe(svgmin())
            .pipe(svgstore({inlineSvg: true}))
            .pipe(cheerio({
                run: ($, file) => {
                    const $svgTag = $('svg');

                    // svg画像の属性を抽出($.mapは引数指定が逆)
                    const symbols = $svgTag.find('symbol').map((idx, item) => {
                        // viewBox内の値を抽出・配列に分割
                        const viewBoxArr = $(item).attr('viewBox').match(/\d+/g);
                        const symbolObj = {
                            'id': $(item).attr('id'),
                            'posX': viewBoxArr[0],
                            'posY': viewBoxArr[1],
                            'width': viewBoxArr[2],
                            'height': viewBoxArr[3]
                        };
                        return symbolObj;
                    }).get();

                    // 指定したタグと属性オブジェクトを元にタグのグループ(配列)を生成
                    const tagGroupMaker = (tag, callback) => {
                        const tagArr = symbols.map((item, idx) => {
                            let heightArr = [];
                            let reduceHeight = 0;
                            if (idx > 0) {
                                let $i = 0;
                                for (; $i < idx; $i++) {
                                    heightArr.push(symbols[idx - 1].height);
                                }
                                reduceHeight = heightArr.reduce((prev, current)=> {
                                    return parseInt(prev, 10) + parseInt(current, 10);
                                });
                            }

                            const buildTag = $(tag).attr(callback(item, reduceHeight));
                            return buildTag;
                        });

                        return tagArr;
                    };

                    // useタグの組み立て
                    const useTagGroup = tagGroupMaker(
                        '<use/>',
                        (item, posY) => {
                            return {
                                'xlink:href': `#${item.id}`,
                                'width': item.width,
                                'height': item.height,
                                'x': item.posX,
                                // y座標位置の調整(重ならないようにする、余白の設定)
                                'y': posY
                            };
                        }
                    );

                    // viewタグの組み立て
                    const viewTagGroup = tagGroupMaker(
                        '<view/>',
                        (item, posY) => {
                            return {
                                'id': `${item.id}_flag`,
                                'viewBox': `0 ${posY} ${item.width} ${item.height}`
                            };
                        }
                    );

                    // svg配下に組み立てたタグを追加
                    $svgTag.append(useTagGroup).append(viewTagGroup);

                    $svgTag.attr({
                        // デフォルトは非表示
                        'display': 'none',
                        // cssからのハッシュリンク読み取りを有効にする設定
                        'xmlns:xlink': 'http://www.w3.org/1999/xlink'
                    });
                    // fill属性をリセット
                    $('[fill]').removeAttr('fill');

                    // _template.htmlを基に、_sample_list.htmlを生成
                    gulp.src(templateSrcGlob)
                        .pipe(template({
                            inlineSvg: $svgTag,
                            symbols: symbols,
                            spriteName: folder
                        }))
                        .pipe(rename('svg_sample.html'))
                        .pipe(gulp.dest(templateDestGlob));
                },
                parserOptions: {xmlMode: true}
            }))
            .pipe(rename(path => {
                path.basename = folder;
            }))
            .pipe(gulp.dest(baseDir));
    });
});

/**
 * Font Tasks
 * 参考サイト - http://deepblue-will.hatenablog.com/entry/2015/08/24/Gulp%E3%81%A7%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E3%83%95%E3%82%A9%E3%83%B3%E3%83%88%E3%81%A8CSS%E3%81%A8HTML%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95
 **/
gulp.task('font', () => {
    const baseDir = './develop/build/img/font';
    const folders = getFolders(baseDir);

    folders.map(folder => {
        gulp.src('./develop/build/img/font' + '/' + folder + '/' + '*.svg')
            .pipe(svgmin())
            // アイコンフォント生成
            .pipe(iconfont({
                fontName: folder,
                formats: ['ttf', 'eot', 'woff', 'svg']
            }))
            .on('glyphs', function (glyphs, options) {
                // シンボルフォント用のcssを作成
                gulp.src('./develop/src/template/_iconfont.scss')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: folder,
                        // フォントパスをCSSからの相対パスで指定
                        fontPath: '../img/font/',
                        // CSSのフォントのクラス名を指定
                        className: folder
                    }))
                    .pipe(rename({
                        basename: '_' + folder
                    }))
                    // CSSの吐き出し先を指定
                    .pipe(gulp.dest('./develop/src/scss/foundation/variables/font/'));
                // シンボルフォント一覧のサンプルHTMLを作成
                gulp.src('./develop/src/template/_iconfont.html')
                    .pipe(consolidate('lodash', {
                        glyphs: glyphs,
                        fontName: folder,
                        // フォントパスをCSSからの相対パスで指定
                        fontPath: '../',
                        // CSSのフォントのクラス名を指定
                        className: folder
                    }))
                    .pipe(rename({
                        basename: 'sample_list'
                    }))
                    // サンプルHTMLの吐き出し先を指定
                    .pipe(gulp.dest('./develop/build/img/font/' + folder));
            })
            .pipe(gulp.dest('./develop/build/img/font'));
    });
});
