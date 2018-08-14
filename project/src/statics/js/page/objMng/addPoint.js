layui.config({
	base: "../../../js/"
}).extend({
	"tools": "tools"
})
layui.use(['form','layer', 'tools'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
		tools = layui.tools;
		var userid = tools.getUsermessage("id");
		tools.getThatstructure("#fileOption,#allStructure",userid);
		tools.getWatchdimension("#dimension");
		form.on("select(allStructure)",function(data){
	        var strid = data.value;
	        tools.getThatstructureFile("#thatFile",strid);
			tools.getThatpointSensor("#thatsensor",strid);
    	})		
    form.on("submit(addpoint)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
         var param = tools.getFormallData("#addpoint");
		addPointData(param, index);
        return false;
    })
	//新增监测点
	function addPointData(param,index){
        param.action_flag ="w_add";
        param.sub_flag ="unit";
        tools.sendRequest(net.ObjectServlet,param,function(res){
           if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("添加监测点成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("添加监测点失败");
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