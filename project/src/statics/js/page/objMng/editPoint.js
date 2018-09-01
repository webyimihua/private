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
       	var userId = tools.getUsermessage("id");
		tools.getThatstructure("#allStructure",userId,getWatchdimension);
		function getWatchdimension(){
			tools.getWatchdimension("#dimension",setOlddataShow);
		}
		function setOlddataShow(){
			var id = $("#editId").val();
        	var editForm = $("#editDataform");
        	var userid = tools.getUsermessage("id");
            var param = {};
				param.action_flag = "w_show_edit";
				param.sub_flag = "unit";
				param.id = id;
				param.userId= userid;
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data =res.data;							
				    	tools.setOlddataToform(editForm,data,function(){
				    		var strid = data.objectId;
					        tools.getThatstructureFile("#thatFile",strid,function(){
					        	tools.setOPtiondataCheck("#thatFile",data.domainId);
					        });
							tools.getThatpointSensor("#thatsensor",strid,function(){
								tools.setOPtiondataCheck("#thatsensor",data.sensorId);
							});
				    	});
				    	form.render('select');
					} else {
						if(res.message) {
							layer.msg(res.message);
						}
					}
				})
		}
		form.on("select(allStructure)",function(data){
	        var strid = data.value;
	        tools.getThatstructureFile("#thatFile",strid,getThatpointSensor);
	        function getThatpointSensor(){
				tools.getThatpointSensor("#thatsensor",strid,setOlddataShow);
			}
    	})	
		
    form.on("submit(editPoint)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var param = tools.getFormallData("#editDataform");
		addTerminalData(param, index);
        return false;
    })
	//修改终端
	function addTerminalData(param,index){
        param.action_flag ="w_update";
        param.sub_flag ="unit";
//      param.userId= tools.getUsermessage("id");
        tools.sendRequest(net.ObjectServlet,param,function(res){
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
	$(".cancel").click(function(){
       layer.closeAll("iframe");
       //刷新父页面
       parent.location.reload();
        return false;
    })
	
})