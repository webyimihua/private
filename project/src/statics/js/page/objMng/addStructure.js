layui.config({
	base: "../../../js/"
}).extend({
	"tools": "tools"
})
var owatchtype = [];
layui.use(['form', 'layer', 'tools'], function() {
	var form = layui.form
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery;
	tools = layui.tools;
	tools.getAllstation("#allStation");
	tools.getAllLine("#addLine");
	tools.getAllWatchtype("#watchtype");
	//	tools.getWatchdimension("#dimension");	
	form.render();
	form.on("submit(addStructure)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var param = tools.getFormallData("#addStructure");
		param.dimensionIds = owatchtype;
		addStructureData(param, index);
		return false;
	})
	//新增构筑物
	function addStructureData(param, index) {
		param.action_flag = "w_add";
		param.sub_flag = "object";
		tools.sendRequest(net.ObjectServlet, param, function(res) {
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
	$(".cancel").click(function() {
		layer.closeAll("iframe");
		//刷新父页面
		parent.location.reload();
		return false;
	})
	//处理监测维度多选
	$(".downpanel").on("click", ".layui-select-title", function(e) {
		var otext = [];
		var $select = $(this).parents(".layui-form-select");
		$(".layui-form-select").not($select).removeClass("layui-form-selected");
		$select.addClass("layui-form-selected");
		e.stopPropagation();
	}).on("click", ".layui-form-checkbox", function(e) {		
		getSelectdata();
		e.stopPropagation();
	});

	function getSelectdata() {
		var ids = [];
		var texts = [];
		var idsbox = $("input:checkbox[name='dimensionIds']:checked");
		var idsnum = idsbox.size();
		for(var i = 0; i < idsnum; i++) {
			ids.push(idsbox.eq(i).val()); 
			texts.push(idsbox.eq(i).attr("title")); 
		}
		var idstr = ids.join(',')
		var textsstr = texts.join(',')
		if(idstr){
			owatchtype = idstr;
		}else{
			layer.msg('监测维度不能为空')
		}
		$("#dimensionIds").val(textsstr);
	}

})