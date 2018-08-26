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
       	tools.getAllSensorype("#allSensor",getAllfile);
		function getAllfile(){
			var userId = tools.getUsermessage("id");
			getAllTerminal("#AllTerminal",userId,setOlddataShow);
		}
		function setOlddataShow(){
			var id = $("#editId").val();
        	var editForm = $("#editDataform");
        	var userid = tools.getUsermessage("id");
            var param = {};
				param.action_flag = "w_show_edit";
				param.sub_flag = "sensor";
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
    form.on("submit(editStation)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var param = tools.getFormallData("#editDataform");
		addTerminalData(param, index);
        return false;
    })
	//修改终端
	function addTerminalData(param,index){
        param.action_flag ="w_update";
        param.sub_flag ="sensor";
		param.id = $("#editId").val();
        tools.sendRequest(net.ObjectServlet,param,function(res){
           if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("编辑传感器成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("编辑传感器失败");
			}
        })
    }
	$(".cancel").click(function(){
       layer.closeAll("iframe");
       //刷新父页面
       parent.location.reload();
        return false;
    })
	//查询终端
	function getAllTerminal(div, userid,callback) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "gateway";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.userId = userid;
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					initTerminaloption(div, data, function() {
						form.render('select');
						if(typeof callback == 'function'){					
							callback();
						}
					});
				} else {
					layer.msg("请先新增终端数据");
				};
			}
		})
	}
	function initTerminaloption(div, data,callback){
		var str = '';
		for(var i = 0; i < data.length; i++) {
			str += '<option value="' + data[i].id + '">' + data[i].id + '</option>'
		}
		$(div).append(str);
		if(typeof callback == 'function'){					
			callback();
		}
	}
})