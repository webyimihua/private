layui.config({
	base: "../../../js/"
}).extend({
	"tools": "tools"
})
layui.use(['form', 'layer', 'tools'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;
	tools = layui.tools;
	setOlddataShow();

	function setOlddataShow() {
		var id = $("#sensorId").val();
		var userid = tools.getUsermessage("id");
		var param = {};
		param.action_flag = "w_show_schedule";
		param.sub_flag = "schedule";
		param.id = id;
		param.userId = userid;
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.times.length > 0) {
					readerTabledata(data.times);
					var timeInfo = JSON.stringify(data.times);
					sessionStorage.setItem('timeInfo', timeInfo);
				}
			} else {
				if(res.message) {
					layer.msg(res.message);
				}
			}
		})
	}
	//新增时间配置
	function addSettimeData(param, index) {
		var userid = tools.getUsermessage("id");
		if(sessionStorage.getItem('timeInfo')){
			var olddata = JSON.parse(sessionStorage.getItem('timeInfo'));
		}
		if(!olddata){
			olddata ={};
		}
		param.times = param.times.concat(olddata);
		param.action_flag = "w_update";
		param.sub_flag = "schedule";
		param.userId = userid;
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("参数配置成功");
					setOlddataShow();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("参数配置失败");
			}
		})
	}
	
	//处理时间页面
	function readerTabledata(data) {
		$("#setTimeList").html("");
		if(data) {
			var str = '<tr class="listtop"><th class="tritem" width="120">序号</th><th class="tritem" width="500">测量时刻（小时：分钟）</th><th class="tritem" width="200">操作</th></tr>';
			for(var i = 0; i < data.length; i++) {
				str += '<tr class="listitem" tabindex="' + i + '">';
				str += '<td class="tritem">' + i + 1 + '</td>';
				str += '<td class="tritem">' + data[i] + '</td>';
				str += '<td class="tritem delitem"><span class="delbtn layui-btn layui-btn">删除</span></td>';
				str += '</tr>';
			}
			$("#setTimeList").html(str);
			form.render();
		}
	}
	//删除时间提示
	function delThatitem(el) {
		layui.use('layer', function() {
			var layer = layui.layer;
			layer.confirm('是否要删除当前测量时刻?', function(index) {
				var item = $(el).parents(".listitem").attr("tabindex");
				var olddata = JSON.parse(sessionStorage.getItem('timeInfo'));
				param = olddata.splice(item, 1);
				addSettimeData(param);
				layer.close(index);
			});
		});
	}
	$(".delbtn").on("click",function(){
       var odiv = $(this);
       delThatitem(odiv);
   })
	$(".addItem_btn").click(function(){
       $(".addtimebox").fadeIn();
   })
	
	$(".addTimebtn").click(function(){
		var oval = $("#timedate").val();
		if(oval){
			var param ={};
			var olddata = [];
			olddata.push(oval);
			param.times = olddata;
			addSettimeData(param);
			$(".addtimebox").fadeOut();
		}else{
			layer.msg('请选择时间')
		}
    })
	$(".cancelBtn").click(function(){
      $(".addtimebox").fadeOut();
   })
})