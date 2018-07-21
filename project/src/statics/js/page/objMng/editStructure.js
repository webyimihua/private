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
	tools.getAllstation("#allStation",getAllLine);
	function getAllLine(){
		tools.getAllLine("#addLine",getAllWatchtype);
	}
	function getAllWatchtype(){
		tools.getAllWatchtype("#watchtype",getWatchdimension);
	}
	function getWatchdimension(){
		tools.getWatchdimension("#dimension",setOlddataShow);
	}
	function setOlddataShow(){
			var id = $("#editId").val();
        	var editForm = $("#editDataform");
        	var userid = tools.getUsermessage("id");
            var param = {};
				param.action_flag = "w_show_edit";
				param.sub_flag = "object";
				param.id = id;
				param.userId= userid;
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data =res.data;							
				    	tools.setOlddataToform(editForm,data);
				    	form.render('select');
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
	//新增构筑物
	function addStructureData(param, index) {
		var dimension =[1];
		dimension.push(param.dimensionIds);		
		param.action_flag = "w_update";
		param.sub_flag = "object";
		param.dimensionIds = dimension;
//		param.userId= tools.getUsermessage("id");
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("编辑构筑物成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("编辑构筑物失败");
			}
		})
	}
	$(".cancel").click(function(){
       layer.closeAll("iframe");
       //刷新父页面
       parent.location.reload();
        return false;
    })
	
})