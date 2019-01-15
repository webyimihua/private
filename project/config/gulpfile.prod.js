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
		src:'./src/statics/css/**/*.css',
		dest:'dist/css'
	},
	scss:{
		src:'src/statics/css/**/*.scss',
		dest:'dist/css'
	},
	js:{
		src:'src/statics/js/**/*.js',
		dest:'dist/js'
	},
	img:{
		src:'src/statics/images/**/*',
		dest:'dist/images'
	},
	resource:{
		src:'./src/view/**/*.apk',
		dest:'dist/'
	}
}
/*************************@@公共部分***********************************/
function prod(){
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
		 gulp.task('resource', function() {  
	        return gulp.src(configUrl.resource.src)
	          // .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
	          .pipe(gulp.dest(configUrl.resource.dest))
	      //  .pipe(notify({ message: 'Images task complete' }))
	          .pipe(connect.reload())
	     });

		//打包APP
		gulp.task('ffr', function() {  
		  return gulp.src('src/view/dists/*')
		    .pipe(gulp.dest('dist/dists'))
		});
		/*************************@@公共部分***********************************/

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
		  return gulp.src('./src/statics/css/**/*.css')
		  .pipe(rev())    
		  .pipe(minifycss())
		  .pipe(gulp.dest('dist/css'))
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

		 // layui插件
	      gulp.task('layui', function() {  
	        return gulp.src('src/statics/layui/**/*')
	          .pipe(gulp.dest('dist/layui'))
	          .pipe(rename({suffix: '.min'}))
	          .pipe(connect.reload())
	      });

	       // json插件
	      gulp.task('json', function() {  
	        return gulp.src('src/statics/json/**/*.json')
	          .pipe(gulp.dest('dist/json'))
	      });

		  //创建本地服务器
	      gulp.task('webserver',function () {
	          connect.server({
	            port:3001,
	            livereload:false,            
	            // host:"192.168.0.14",
	            root:['dist/', 'dist/']
	          });
	      });

		//上产上线环境
		gulp.task("build",function(cb){
			condition = false;
		     runSequence(
		    'clean', 
		    ['revsty','revsass','revjs'],  
		    ['buildstyles', 'buildsass','buildscripts','buildimages','jsplugins','layui'],
		    'revHtml', 
		    'json',
		    'resource',
		    'webserver',
		    cb
		    );
		});
}

module.exports = prod;
