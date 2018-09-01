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
        setOlddataShow();
    function setOlddataShow(){
			var id = $("#sensorId").val();
        	var editForm = $("#stationSet");
        	var userid = tools.getUsermessage("id");
            var param = {};
				param.action_flag = "w_show_threshold";
				param.sub_flag = "threshold";
				param.id = id;
//				param.userId= userid;
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data =res.data;
						if(data.id){
							$("#setId").val(data.id);
							tools.setOlddataToform(editForm,data);
				    		form.render('select');
						}
					} else {
						if(res.message) {
							layer.msg(res.message);
						}
					}
				})
		}    
        
        
    form.on("submit(stationSet)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var param = tools.getFormallData("#stationSet");
	    if($("#setId").val()){
	       	param.id = $("#setId").val();
	    }
	    param.sensorId = $("#sensorId").val();
		stationSetData(param, index);
        return false;
    })
    //新增参数配置
	function stationSetData(param,index){
		var userid = tools.getUsermessage("id");
		//修改参数
		if(param.id){
			param.action_flag ="w_update";
        	param.sub_flag ="threshold";
		}else{
			param.action_flag ="w_add";
        	param.sub_flag ="threshold";
		} 
//		param.userId= userid;
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