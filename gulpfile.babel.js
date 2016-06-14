/**
 * tasks - dev, prod, sprite
 * 詳しくはREADME.mdを参照
 */
// todo: SVGからiconFont生成するタスク作成
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
import imagemin from 'gulp-imagemin';
import spritesmith from 'gulp.spritesmith';
import fs from 'fs';
import path from 'path';

/* common plugin */
import rename     from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import plumber    from 'gulp-plumber';
import notify     from 'gulp-notify';
import gulpif     from 'gulp-if';
import del        from 'del';

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
    .pipe(sourcemaps.init({ loadMaps: true }))
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
    doiuse({browsers: conf.browsers, ignore: conf.ignores}),
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
    .pipe(gulpif(conf.jsUglifyProd, rename(path => {
      path.extname = '.min.js';
    })))
    .pipe(gulp.dest(conf.jsDestDirProd))
    .pipe(notify('Js Finished'));
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
    .pipe(rename(path => {
      if (conf.cssNanoProd) {
        path.extname = '.min.css';
      } else {
        path.extname = '.css';
      }
    }))
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

gulp.task('cleanProd', del.bind(null,
  [
    './product/img/**',
    './product/js/**',
    './product/css/**'
  ])
);

gulp.task('prod', ['cleanProd', 'jsProd', 'cssProd', 'imgProd']);

/**
 * Sprite Tasks
 **/
const getFolders = dir => {
  return fs.readdirSync(dir)
    .filter(file => {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

gulp.task('sprite', function () {
  // set target folders
  const folders = getFolders(conf.spriteDest + '/' + conf.spriteImg + '/sprite/');

  // generate image & sass files
  folders.map(folder => {
    const spriteData = gulp.src('sprite/' + folder + '/*.png', { cwd: conf.spriteDest + '/' + conf.spriteImg })
      .pipe(spritesmith({
        imgName  : folder + '.png',
        imgPath  : '../' + conf.spriteImg + '/' + conf.spriteName + '/' + folder + '.png',
        cssName  : '_' + folder + '.scss',
        algorithm: 'binary-tree',
        padding  : 4,
        cssFormat: 'scss',
        cssOpts: {
          functions: false
        }
      }));

    spriteData.img.pipe(gulp.dest(conf.spriteDest + '/' + conf.spriteImg + '/' + conf.spriteName));
    spriteData.css.pipe(gulp.dest(conf.spriteSrc + '/' + conf.spriteScss + '/' + 'foundation/variables' + '/' + conf.spriteName));
  });
});
