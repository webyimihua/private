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
	tools.getThatstructure("#Allobject",userid);
	form.on("select(Allobject)",function(data){
        var strid = data.value;
        tools.getThatstructureFile("#Allfiles",strid);
	})	
	form.on("select(Allfiles)",function(data){
        var strid = data.value;
        tools.getThatFilepoint("#Allunit",strid);        
	})
	getAllstructure("#addSensor");
	form.render();	
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
	//新增关系管理
	function addStructureData(param, index) {
		param.action_flag = "w_add";
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
	
	$(".cancel").click(function() {
		layer.closeAll("iframe");
		//刷新父页面
		parent.location.reload();
		return false;
	})
	
})