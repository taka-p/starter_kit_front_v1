import gulp    from 'gulp';
import webpack from 'gulp-webpack';
// import gulpif  from 'gulp-if';
// import uglify  from 'gulp-uglify';
import {conf, setting}  from '../configs/dev.babel';

gulp.task('build', () => {
    gulp.src(setting.src)
        .pipe(webpack(setting.webpack))
        // dev環境ではuglifyしない
        // .pipe(gulpif(setting.js.uglify, uglify()))
        .pipe(gulp.dest(setting.js.dest));
});

gulp.task('watch', () => {
  gulp.watch(conf.srcDir + conf.srcFormat, ['build'])
});

gulp.task('dev', ['watch']);
