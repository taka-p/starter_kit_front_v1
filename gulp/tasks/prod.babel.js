/* js plugin */
import gulp    from 'gulp';
import webpack from 'gulp-webpack';
import uglify  from 'gulp-uglify';

/* css plugin */
import sass         from 'gulp-sass';
import postcss      from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano      from 'cssnano';

/* img plugin */
import imagemin from 'gulp-imagemin';

/* common plugin */
import rename  from 'gulp-rename';
import plumber from 'gulp-plumber';
import notify  from 'gulp-notify';
import gulpif  from 'gulp-if';
import del     from 'del';

/* config */
import {conf, setting} from '../configs/prod.babel';

gulp.task('js', () => {
    gulp.src(conf.jsSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(webpack(setting.webpack))
        // uglifyしたくない場合はconfigでfalseに変更
        .pipe(gulpif(conf.jsUglify, uglify()))
        .pipe(gulpif(conf.jsUglify, rename(path => {
            path.extname = '.min.js';
        })))
        .pipe(gulp.dest(conf.jsDestDir));
});

gulp.task('css', () => {
    const processors = [
              autoprefixer({ browsers: conf.browsers })
          ];

    // cssnanoしたくない場合はconfigでfalseに変更
    if (conf.cssNano) {
        processors.push(cssnano({ autoprefixer: false }));
    }

    return gulp.src(conf.cssSrc)
        .pipe(plumber({
            errorHandler: notify.onError(`<%= error.plugin %>\n<%= error.message %>`)
        }))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(rename(path => {
            if (conf.cssNano) {
                path.extname = '.min.css';
            } else {
                path.extname = '.css';
            }
        }))
        .pipe(gulp.dest(conf.cssDestDir));
});

gulp.task('img', function(){
    const srcGlob = conf.imgSrcDir + '/**/*.+(jpg|jpeg|png|gif|svg)',
          dstGlob = conf.imgDestDir,
          imageminOptions = {
            optimizationLevel: 7
          };

    gulp.src(srcGlob)
        .pipe(imagemin(imageminOptions))
        .pipe(gulp.dest(dstGlob));
});

gulp.task('clean', del.bind(null, [
    './product/img/**',
    './product/js/**',
    './product/css/**'
]));

gulp.task('prod', ['clean', 'js', 'css', 'img']);
