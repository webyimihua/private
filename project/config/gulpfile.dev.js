/**
 * @file file description here
 * @author fanjifei
 */
var gulp = require('gulp');
var git = require('gulp-git');
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
	}
}

function dev(){

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
        return gulp.src('./src/statics/css/**/*.css')
      //  .pipe(rev())    //项目上线所用加版本
      //  .pipe(minifycss())
          .pipe(gulp.dest('dist/css'))
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

      /*************************@@公共部分***********************************/
      // 启动前清理dist项目
      gulp.task('clean', function() {  
      return gulp.src(['./dist'], {read: false})
          .pipe(clean());
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
      /*************************@@公共部分***********************************/

      // 监测所有的HTML改变
      gulp.task('watch',function () {
        gulp.watch(['./src/view/**/*.html'], ['html']);
        gulp.watch(['./src/**/*.css'], ['styles']);
        gulp.watch(['./src/**/*.scss'], ['sass']);
        gulp.watch(['./src/**/*.js'], ['scripts']);
        gulp.watch(['./src/**/*.json'], ['json']);
        gulp.watch(['./src/statics/images/*'], ['images']);
      });

      //调试环境
      gulp.task("controll",function(cb){
        condition = false;
           runSequence(
          'clean', 
          ['styles', 'sass','scripts','images','layui','json'],  //模板处理
          'html',  //开发中HTML模板
          cb
          );
      });

      //创建本地服务器
      gulp.task('webserver',['controll'], function () {
          connect.server({
            port:3001,
            livereload:false,            
            // host:"192.168.0.14",
            root:['dist/', 'dist/']
          });
      });

      gulp.task('default', ['webserver','watch']);
}

module.exports = dev;
