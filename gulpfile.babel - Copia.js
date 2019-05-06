import autoprefixer from 'gulp-autoprefixer'
import browserSync from 'browser-sync'
import connect from 'gulp-connect'
import del from 'del'
import gulp from 'gulp'
import html from 'gulp-htmlmin'
import gulpLoad from 'gulp-load-plugins'
import plumber from 'gulp-plumber'
import sass from 'gulp-sass'
import sourcemaps from 'gulp-sourcemaps'
import runSequence from 'run-sequence'

const inputCSS = './src/assets/scss/**/*.scss'
const outputCSS = './dist/assets/css'

const inputJS = './src/assets/js/**/*.js'
const outputJS = './dist/assets/js'

const date = new Date()
const signature = `/**
* Carlos Lima <karlus@live.com>
* @date ${date}
* /\n\n`


//CONFIG
const $ = gulpLoad()

function onError(error) {
  console.log(error)
  this.emit('end')
}

//CONNECT
gulp.task('connect', () => {
  connect.server({
    port: 80,
    debug: false,
    livereload: true
  })

  const openOptions = {
    uri: `http://localhost:80/dist`,
    app: 'chrome'
  }

  return gulp.src('./')
    .pipe($.open(openOptions));
})

//CLEAN
gulp.task('clean', () => {
	return del('dist/')
})

//ICONS
gulp.task('icons', () => {
  return gulp.src('./src/assets/icons/**/*.svg')
    .pipe(gulp.dest('./dist/assets/icons'))
})

//HTML
gulp.task('html', () => {
	return gulp.src('./src/index.html')
		.pipe(html({collapseWhitespace:true}))
		.pipe(gulp.dest('./dist/'))
    .pipe(connect.reload())

})

//JS
gulp.task('js', () => {
  return gulp.src(inputJS)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe($.babel().on('error', onError))
    .pipe($.concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputJS))
    .pipe(connect.reload())
})

// SASS
gulp.task('sass', () => {
	return gulp.src(inputCSS)
    .pipe(plumber())
  	.pipe(sourcemaps.init())
  	.pipe(sass({outputStyle: 'compressed'})).on('error', onError)
  	.pipe(autoprefixer({browsers: ['last 2 versions', '> 5%', 'Firefox ESR']}))
  	.pipe(sourcemaps.write())
  	.pipe(gulp.dest(outputCSS))
  	.pipe(connect.reload())
})


//WATCH
gulp.task('watch', () => {
  gulp.watch(['src/index.html'], ['html'])
  gulp.watch(['src/assets/js/*.js'], ['js'])
  gulp.watch(['src/assets/scss/*.css'], ['css'])
  gulp.watch(['src/assets/scss/**/*.scss'], ['sass'])
})


//BUILD
gulp.task('build', done => {
  return runSequence('html', ['js', 'sass', 'icons'], done)
})

//DEPLOY
gulp.task('deploy', done => {
  return runSequence('clean', 'build', ['js:deploy', 'sass:deploy'], done)
})

//DEFAULT
gulp.task('default', done => {
  return runSequence('clean', ['connect', 'build', 'watch'], done)
})