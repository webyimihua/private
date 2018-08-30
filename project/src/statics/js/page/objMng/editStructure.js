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
				    	form.render();
				    	//处理监测维度多选
				    	 setDbselectData(data.dimensionIds)
					} else {
						if(res.message) {
							layer.msg(res.message);
						}
					}
				})
		}
	var owatchtype = [];
	form.on("submit(editStructure)", function(data) {
		//弹出loading
		var index = top.layer.msg('数据提交中，请稍候', {
			icon: 16,
			time: false,
			shade: 0.8
		});
		var param = tools.getFormallData("#editDataform");
		param.dimensionIds = owatchtype;
		addStructureData(param, index);
		return false;
	})
	//新增构筑物
	function addStructureData(param, index) {
		param.action_flag = "w_update";
		param.sub_flag = "object";
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
	//处理监测维度多选
	function setDbselectData(data){
		var texts = [];
		var idsbox = $("input:checkbox[name='dimensionIds']");
		var idsnum = idsbox.size();		
		for(var i=0; i<data.length;i++){		
			for(var j = 0; j < idsnum; j++) {
				if(data[i] == idsbox.eq(j).val()){
					texts.push(idsbox.eq(j).attr("title")); 
					idsbox.eq(j).parent("dd").find(".layui-form-checkbox").addClass("layui-form-checked");
				}
				
			}
		}
	var textsstr = texts.join(',')	
	$("#editdimensionIds").val(textsstr);	
	if(data){
			owatchtype = data;
		}
	}
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
		$("#editdimensionIds").val(textsstr);
	}
	
})