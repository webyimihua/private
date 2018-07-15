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
	getAllStationname("#allStation");
	getAllLinename("#addLine");
	getAllWatchtype("#watchtype");	
	form.on("submit(addStructure)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var param = tools.getFormallData("#addStructure");
		addStructureData(param, index);
		return false;
	})
	//新增构筑物
	function addStructureData(param, index) {
		param.action_flag = "w_add";
		param.sub_flag = "object";
		tools.sendRequest(net.SystemServlet, param, function(res) {
			if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("添加构筑物成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("添加构筑物失败");
			}
		})
	}
	
	//初始化查询铁路局下拉菜单
	function getAllStationname(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "bureau";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;
		tools.sendRequest(net.SystemServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div,data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增铁路局数据");
				};
			}
		})
	}
	
	//初始化查询铁路局下拉菜单
	function getAllLinename(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "railway_line";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;
		tools.sendRequest(net.SystemServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div, data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增铁路线路数据");
				};
			}
		})
	}	
	
	//初始化查询检测类型下拉菜单
	function getAllWatchtype(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "object_type";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;
		tools.sendRequest(net.SystemServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div, data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增检测类型");
				};
			}
		})
	}
	
	
})