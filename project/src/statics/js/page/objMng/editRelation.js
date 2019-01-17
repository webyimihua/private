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
	var userid = tools.getUsermessage("id");
	tools.getThatstructure("#Allobject", userid, setOlddataShow);

	function setThatstructureFile() {
		form.on("select(Allobject)", function(data) {
			var strid = data.value;
			tools.getThatstructureFile("#Alldomain", strid);
		})
	}
	form.on("select(Alldomain)",function(data){
	        var strid = data.value;
	        tools.getThatFilepoint("#Allunit",strid);
    	})	
	getAllstructure("#addSensor");
	form.render();	
	function setOlddataShow() {
		var id = $("#editId").val();
		var editForm = $("#editDataform");
		var userid = tools.getUsermessage("id");
		var param = {};
		param.action_flag = "w_show_edit";
		param.sub_flag = "sensor_unit";
		param.id = id;
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				tools.setOlddataToform(editForm, data, setThatstructureFile);
				form.render();
			} else {
				if(res.message) {
					layer.msg(res.message);
				}
			}
		})
	}
	form.on("submit(editStructure)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var param = tools.getFormallData("#editDataform");
		addStructureData(param, index);
		return false;
	})
	//编辑关系
	function addStructureData(param, index) {
		param.action_flag = "w_update";
		param.sub_flag = "sensor_unit";
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg(res.message);
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg(res.message);
			}
		})
	}
	$(".cancel").click(function() {
		layer.closeAll("iframe");
		//刷新父页面
		parent.location.reload();
		return false;
	})
	
	//查找所有传感器
	function getAllstructure (div){
	var param = {};
	param.action_flag = "w_query";
	param.sub_flag = "sensor";
	param.isFlur = false;
	param.isReserve = false;
	param.isDivide = true;
	param.userId = userid;
	tools.sendRequest(net.ObjectServlet, param, function(res) {
		if(res.result == 1) {
			var data = res.data;
			if(data.length > 0) {
				tools.initOptionitem(div,data,function(){
					form.render('select');					
				});					
			}
		}
	})
}
})