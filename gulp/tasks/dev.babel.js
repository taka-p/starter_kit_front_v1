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
import stylelintrc  from '../../stylelintrc.js'
import reporter     from 'postcss-reporter'; // ログ整形
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

// todo: eslintの調整
gulp.task('js', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(eslint({ useEslintrc: true }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(webpack(setting.webpack))
        .pipe(sourcemaps.init({ loadMaps: true }))
        // テストでuglifyする場合はconfを変更
        .pipe(gulpif(conf.jsUglify, uglify()))
        .pipe(gulpif(conf.jsUglify, rename(path => {
            path.extname = '.min.js';
        })))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.jsDestDir));
});

// todo: stylelintの調整
// todo: SVGからiconFont生成
gulp.task('css', () => {
    const processors = [
              stylelint(stylelintrc),
              doiuse({ browsers: conf.browsers, ignore: conf.ignores }),
              autoprefixer({ browsers: conf.browsers }),
              reporter()
          ];

    // テストでcssnanoする場合はconfを変更
    if (conf.cssNano) {
        processors.push(cssnano({ autoprefixer: false }));
    }

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
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
    gulp.watch(conf.jsSrc,  ['js']);
    gulp.watch(conf.cssSrc, ['css']);
});

gulp.task('dev', ['watch']);
