/* js plugin */
import gulp    from 'gulp';
import webpack from 'gulp-webpack';
import eslint  from 'gulp-eslint';
import uglify  from 'gulp-uglify';

/* css plugin */
import postcss      from 'gulp-postcss';
import precss       from 'precss'; // scss変換
import autoprefixer from 'autoprefixer';
import stylelint    from 'stylelint'; // 構文チェック
import stylelintrc  from '../../stylelintrc.js'
import reporter     from 'postcss-reporter'; // stylelinkのログ整形
import doiuse       from 'doiuse'; // クロスブラウザチェック
import cssnano      from 'cssnano';

/* 共用 plugin */
import rename     from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import plumber    from 'gulp-plumber';
import notify     from 'gulp-notify';
import gulpif     from 'gulp-if';

/* config */
import {conf, setting} from '../configs/dev.babel';

gulp.task('js', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError("JS Error: <%= error.message %>")
        }))
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(webpack(setting.webpack))
        .pipe(sourcemaps.init({loadMaps: true}))
        // テストでuglifyする場合はconfを変更
        .pipe(gulpif(conf.jsUglify, uglify()))
        .pipe(gulpif(conf.jsUglify, rename(path => {
            path.extname = '.min.js';
        })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.jsDestDir));
});

// todo: add sprite-smith
gulp.task('css', () => {
    const processors = [
              stylelint(stylelintrc),
              precss({}),
              doiuse({ browsers: conf.browsers, ignore: conf.ignores }),
              autoprefixer({ browsers: conf.browsers }),
              reporter(),
              // テストでcssnanoする場合はconfを変更
              gulpif(conf.cssNano, cssnano({ autoprefixer: false }))
          ];

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError("CSS Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(rename(path => {
            if (conf.cssNano) {
                path.extname = '.min.css';
            } else {
                path.extname = '.css';
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.cssDestDir));
});

gulp.task('watch', () => {
    gulp.watch(conf.cssSrc, ['css']);
    gulp.watch(conf.jsSrc,  ['js']);
});

gulp.task('dev', ['watch']);
