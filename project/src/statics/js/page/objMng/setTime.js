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
		var param = {};
		param.action_flag = "w_show_schedule";
		param.sub_flag = "schedule";
		param.id = id;
		//		param.userId = userid;
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
	function addSettimeData() {
		var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
		var param = {};
		var sensorId = $("#sensorId").val();
		var times= getAllitemData().join(",");
		param.times = times;
		if(param.times) {
			param.action_flag = "w_update";
			param.sub_flag = "schedule";
			param.sensorId = sensorId;
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
	}
	//获取页面时间
	function getAllitemData() {
		var times = [];
		var timeItem = $("#setTimeList").find(".timeset");
		var leng = timeItem.size();
		for(var i = 0; i < leng; i++) {
			if(timeItem.eq(i).val()) {
				times.push(timeItem.eq(i).val());
			}
		}
		return times;
	}
	//处理时间页面
	function readerTabledata(data) {
		$("#setTimeList").html("");
		if(data) {
			var str = '<tr class="listtop"><th class="tritem" width="120">序号</th><th class="tritem" width="500">测量时刻（小时：分钟）</th><th class="tritem" width="200">操作</th></tr>';
			for(var i = 0; i < data.length; i++) {
				var index = Number(i + 1);
				str += '<tr class="listitem" tabindex="' + index +'">';
				str += '<td class="tritem num">' + index +'</td>';
				str += '<td class="tritem"><input class ="timeset" type="text" value = "'+ data[i] + '" maxlength=5/></td>';
				str += '<td class="tritem delitem"><span class="delbtn addbtn layui-btn layui-btn">增行</span><span class="delbtn delbtnitem layui-btn layui-btn">删除</span></td>';
				str += '</tr>';
			}
			$("#setTimeList").html(str);
			form.render();
		}
	}
	//删除时间提示
	function delThatitem(el) {		
		if($(el).parents(".listitem").index() != 1) {
			layui.use('layer', function() {
				var layer = layui.layer;
				layer.confirm('是否要删除当前测量时刻?', function(index) {
					$(el).parents(".listitem").remove();
					reSetafterIndex(el, 2);
					layer.close(index);
				});
			});
		} else {
			layer.msg('最后一行不能删除');
		}
	}
	//增行操作
	function addThatitem(el) {
		var index = Number($(el).parents(".listitem").attr('tabindex'));
		var str = '';
		str += '<tr class="listitem" tabindex="' + index + '">';
		str += '<td class="tritem num">' + index + '</td>';
		str += '<td class="tritem"><input class ="timeset" type="text" maxlength=5/></td>';
		str += '<td class="tritem delitem"><span class="delbtn addbtn layui-btn layui-btn">增行</span><span class="delbtn delbtnitem layui-btn layui-btn">删除</span></td>';
		str += '</tr>';
		$(el).parents(".listitem").after(str);
		reSetafterIndex(el, 1);
	}
	// 插入一行 或者 删除一行 之后元素step 变化 type 1 增行 type 2 减行
	function reSetafterIndex(el, type) {
		var siblingafter = $(el).parents(".listitem").nextAll();
		for(var i = 0; i < siblingafter.length; i++) {
			if(type == "1") {
				var texts = Number($(siblingafter[i]).attr('tabindex')) + 1;
			} else if(type == "2") {
				var texts = Number($(siblingafter[i]).attr('tabindex')) - 1;
			}
			$(siblingafter[i]).attr('tabindex', texts);
			$(siblingafter[i]).find('.num').text(texts);
		}
	}

	$(document).on("click", ".delbtnitem", function() {
		var odiv = $(this);
		delThatitem(odiv);
	})
	$(document).on("click", ".addbtn", function() {
		var odiv = $(this);
		addThatitem(odiv);
	})
	$(".saveTimebtn").click(function() {
		addSettimeData();
	})
	
	$(".cancel").click(function(){
       layer.closeAll("iframe");
       //刷新父页面
       parent.location.reload();
        return false;
    })
})