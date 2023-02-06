const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const del = require('del');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const postcss = require ('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const sortCSSmq = require('sort-css-media-queries'); 
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const notify = require("gulp-notify");
const smartgrid = require('smart-grid');

gulp.task('sass', () => {
	let plugins = [
		autoprefixer({
			overrideBrowserslist: ["last 2 versions", "> 5%", "ie >= 9"]
		}),
		mqpacker({
			sort: sortCSSmq.desktopFirst
		})
	];
	return gulp.src('app/sass/**/*.sass')
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sass({outputStyle: 'expanded'}))
	.on('error', notify.onError())
	.pipe(postcss(plugins))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('grid', () => {
	smartgrid('app/sass/utils', {
		outputStyle: 'sass', /* less || scss || sass || styl */
		columns: 12, /* number of grid columns */
		offset: '30px', /* gutter width px || % */
		mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
		container: {
			maxWidth: '1200px', /* max-width оn very large screen */
			fields: '15' /* side fields */
		},
		breakPoints: {
			lg: {
				width: '1199px', /* -> @media (max-width: 1200px) */
				fields: '15px'
			},
			md: {
				width: '991px'
			},
			sm: {
				width: '767px',
				/* fields: '15px'  set fields only if you want to change container.fields */
			},
			xs: {
				width: '575px'
			}
			/* 
			We can create any quantity of break points.

			some_name: {
					width: 'Npx',
					fields: 'N(px|%|rem)',
					offset: 'N(px|%|rem)'
			}
			*/
		}
	});
});

gulp.task('scripts', () => {
	return gulp.src([
		'app/libs/jquery-3.3.1/dist/jquery.min.js',
		'app/libs/owl.carousel/dist/owl.carousel.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
		'app/libs/jquery-spincrement/jquery.spincrement.min.js',
		'app/libs/slidorion-master/dist/jquery.slidorion.min.js',
		'app/libs/jquery.nicescroll/dist/jquery.nicescroll.min.js',
		'app/libs/paralaxbg/paralaxbg.min.js',
		'app/libs/introloader/dist/jquery.introLoader.pack.min.js',
		'app/libs/jquery-validation/dist/jquery.validate.js',
		'app/libs/wow/dist/wow.min.js',
		'app/libs/jquery-easing/jquery.easing.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('css-libs', () => {
	return gulp.src([
		'app/libs/owl.carousel/dist/assets/owl.carousel.css',
		'app/libs/magnific-popup/dist/magnific-popup.css',
		'app/libs/introloader/dist/css/introLoader.css',
		'app/libs/animate.css/source/fading_entrances/fadeInUp.css',
		'app/libs/animate.css/source/fading_entrances/fadeInLeft.css',
		'app/libs/animate.css/source/fading_entrances/fadeInRight.css',
		'app/libs/animate.css/source/fading_entrances/fadeInDown.css',
		'app/libs/animate.css/source/fading_exits/fadeOut.css',
		'app/libs/animate.css/source/zooming_entrances/zoomInUp.css',
		'app/libs/animate.css/source/attention_seekers/pulse.css',
		'app/libs/animate.css/source/_base.css',
	])
	.pipe(concat('libs.css'))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('img', () => {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({
					plugins: [
							{removeViewBox: false},
							{cleanupIDs: false}
					]
			})
	])))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('clean', async () => {
	return del.sync('dist');
});

gulp.task('clear', () => {
	return cache.clearAll();
});

gulp.task('htmlCode', () => {
	return gulp.src('app/*.html')
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', () => {
	gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
	gulp.watch('app/*.html', gulp.parallel('htmlCode'));
	gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});

gulp.task('prebuild', async () => {
	let buildCss = gulp.src([
		'app/css/main.css',
		'app/css/libs.min.css'
	])
	.pipe(gulpIf('main.css', cssnano()))
	.pipe(gulpIf('main.css', rename({suffix: '.min'})))
	.pipe(gulp.dest('dist/css'));

	let buildFonts = gulp.src(['app/fonts/**/*'])
	.pipe(gulp.dest('dist/fonts'));

	let buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	let buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
});

gulp.task('default', gulp.parallel('css-libs', 'sass',  'scripts', 'browser-sync', 'watch'));

gulp.task('build', gulp.series('clean', gulp.parallel('prebuild', 'img', 'sass', 'scripts')));