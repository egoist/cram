var
  gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  stylus = require('gulp-stylus'),
  swig = require('gulp-swig'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  serve = require('gulp-serve'),
  gcson = require('gulp-cson')


gulp.task('serve', serve({
  root: ['./'],
  port: 3000
}))

gulp.task('json', function() {
  gulp.src('./qna/cson/*.cson')
    .pipe(gcson())
    .pipe(gulp.dest('./qna/json'))
})

gulp.task('js', function() {
  gulp.src(['./src/js/jquery.js', './src/js/q.js', './src/js/handlebars.js', './src/js/hbs.js', './src/js/marked.js', './src/js/qwest.js', './src/js/app.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/js'))
})

gulp.task('html', function() {
  var opts = {
    defaults: { cache: false, locals: { buildTime: new Date().getTime() } }
  };
  gulp.src('./src/html/index.html')
    .pipe(swig(opts))
    .pipe(gulp.dest('./'))
})

gulp.task('css', function() {
  gulp.src('./src/styl/main.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./build/css'))
})

gulp.task('watch', function() {
  gulp.watch('./src/html/index.html', ['html'])
  gulp.watch('./src/styl/*.styl', ['css'])
  gulp.watch('./src/js/*.js', ['js'])
  gulp.watch('./qna/cson/*.cson', ['json'])
})

gulp.task('build', ['js', 'css', 'html', 'json'])

gulp.task('default', ['build', 'watch', 'serve'])
