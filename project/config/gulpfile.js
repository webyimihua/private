/**
 * @file file description here
 * @author fanjifei
 */
var gulp = require('gulp');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
//var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var fileinclude = require('gulp-file-include');
var concat = require('gulp-concat');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');  /*控制执行顺序*/

//项目路径配置
var configUrl={
	html:{
		src:'./src/view/**/*.html',
		dest:'dist/'
	},
	css:{
		src:'./src/statics/style/**/*.css',
		dest:'dist/style'
	},
	scss:{
		src:'src/statics/style/**/*.scss',
		dest:'dist/style'
	},
	js:{
		src:'src/statics/script/**/*.js',
		dest:'dist/script'
	},
	img:{
		src:'src/statics/images/**/*',
		dest:'dist/images'
	}
}

/**************************@@生产调试部分********************************************/
gulp.task('html', function () {
  return gulp.src('./src/view/**/*.html')
    .pipe(fileinclude({
         prefix: '@@',
             basepath: '@file'
    }))
    .pipe(gulp.dest('dist/'))
//  .pipe(notify({ message: 'html task complete' }))
    .pipe(connect.reload());
});
// css样式刷新，压缩
gulp.task('styles', function() {  
  return gulp.src('./src/statics/style/**/*.css')
//  .pipe(rev())    //项目上线所用加版本
//  .pipe(minifycss())
    .pipe(gulp.dest('dist/style'))
//  .pipe(rename({ suffix: '.min' }))
//  .pipe(notify({ message: 'Styles task complete' }))
    .pipe(connect.reload())
});
// sass样式刷新，压缩
gulp.task('sass', function() {  
  return gulp.src(configUrl.scss.src)
    .pipe(sass().on('error', sass.logError))
//  .pipe(rev())    //项目上线所用加版本
//  .pipe(minifycss())
    .pipe(gulp.dest(configUrl.scss.dest))
//  .pipe(notify({ message: 'sass task complete' }))
    .pipe(connect.reload())
});
// js刷新，压缩
gulp.task('scripts', function() {  
  return gulp.src(configUrl.js.src)
//  .pipe(rev())  //项目上线所用加版本
//  .pipe(uglify())
    .pipe(gulp.dest(configUrl.js.dest))
    .pipe(rename({suffix: '.min'}))
//  .pipe(notify({ message: 'Scripts task complete' }))
    .pipe(connect.reload())
});
// 图片压缩
gulp.task('images', function() {  
  return gulp.src(configUrl.img.src)
    // .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(configUrl.img.dest))
//  .pipe(notify({ message: 'Images task complete' }))
    .pipe(connect.reload())
});
/**************************@@生产调试部分********************************************/

/*************************@@公共部分***********************************/
// 启动前清理dist项目
gulp.task('clean', function() {  
return gulp.src(['./dist'], {read: false})
    .pipe(clean());
});
// jscss插件
gulp.task('jsplugins', function() {  
  return gulp.src('src/statics/script/**/*.css')
    .pipe(gulp.dest('dist/script'))
    .pipe(rename({suffix: '.min'}))
    .pipe(connect.reload())
});
//打包APP
gulp.task('APP', function() {  
  return gulp.src('src/view/resource/*.apk')
    .pipe(gulp.dest('dist/resource'))
});

//打包APP
gulp.task('ffr', function() {  
  return gulp.src('src/view/dists/*')
    .pipe(gulp.dest('dist/dists'))
});
/*************************@@公共部分***********************************/

/************************@@生产上线部分*********************************/
		// css添加版本号
		gulp.task('revsty', function() {  
		  return gulp.src(configUrl.css.src)
		    .pipe(rev())
		    .pipe(rev.manifest()) 
		    .pipe(gulp.dest('src/rev/css'))
		    .pipe(connect.reload())
		});
		// js添加版本号
		gulp.task('revjs', function() {  
		  return gulp.src(configUrl.js.src)
		    .pipe(rev())
		    .pipe(rev.manifest()) 
		    .pipe(gulp.dest('src/rev/js'))
		    .pipe(connect.reload())
		});
		// sass添加版本号
		gulp.task('revsass', function() {  
		  return gulp.src(configUrl.scss.src)
		    .pipe(sass().on('error', sass.logError))
		    .pipe(rev())
		    .pipe(rev.manifest()) 
		    .pipe(gulp.dest('src/rev/sass'))
		    .pipe(connect.reload())
		});
		/*添加HTML中的css版本号上线所用*/ 
		gulp.task('revHtml', function () {
		    return gulp.src(['src/rev/**/*.json', './src/view/**/*.html'])
		       .pipe(fileinclude({
		         prefix: '@@',
		             basepath: '@file'
		        }))
		        .pipe(revCollector())
		        .pipe(gulp.dest('dist/'))
		});
		// css样式刷新，压缩
		gulp.task('buildstyles', function() {  
		  return gulp.src('./src/statics/style/**/*.css')
		  .pipe(rev())    
		  .pipe(minifycss())
		  .pipe(gulp.dest('dist/style'))
		});
		// sass样式刷新，压缩
		gulp.task('buildsass', function() {  
		  return gulp.src(configUrl.scss.src)
		    .pipe(sass().on('error', sass.logError))
		    .pipe(rev())    
		    .pipe(minifycss())
		    .pipe(gulp.dest(configUrl.scss.dest))
		});
		// js刷新，压缩
		gulp.task('buildscripts', function() {  
		  return gulp.src(configUrl.js.src)
		    .pipe(rev())  
		    .pipe(uglify())
		    .pipe(gulp.dest(configUrl.js.dest))
		    .pipe(rename({suffix: '.min'}))
		});
		// 图片压缩
		gulp.task('buildimages', function() {  
		  return gulp.src(configUrl.img.src)
		    // .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
		    .pipe(gulp.dest(configUrl.img.dest))
		//  .pipe(notify({ message: 'Images task complete' }))
		    .pipe(connect.reload())
		});
/************************@@生产上线部分*********************************/
// 监测所有的HTML改变
gulp.task('watch',function () {
  gulp.watch(['./src/view/**/*.html'], ['html']);
  gulp.watch(['./src/**/*.css'], ['styles']);
  gulp.watch(['./src/**/*.scss'], ['sass']);
  gulp.watch(['./src/**/*.js'], ['scripts']);
  gulp.watch(['./src/statics/images/*'], ['images']);
});

//调试环境
gulp.task("controll",function(cb){
	condition = false;
     runSequence(
    'clean', 
    ['styles', 'sass','scripts','images','jsplugins','APP','ffr'],  //模板处理
    'html',  //开发中HTML模板
    cb
    );
});

//上产上线环境
gulp.task("build",function(cb){
	condition = false;
     runSequence(
    'clean', 
    ['revsty','revsass','revjs'],  
    ['buildstyles', 'buildsass','buildscripts','buildimages','jsplugins','APP'],
    'revHtml', 
    cb
    );
});

//创建本地服务器
gulp.task('webserver',['controll'], function () {
    connect.server({
      port:3000,
      livereload:false,
      root:['dist/', 'dist/']
    });
});

gulp.task('default', ['webserver','watch']);