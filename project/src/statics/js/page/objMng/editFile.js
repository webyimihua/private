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
        tools.getAllfileType("#fileType",getThatstructure);
        function getThatstructure(){
        	tools.getThatstructure("#allStructure",userid,setOlddataShow);
        }
        function setOlddataShow(){
        	var id = $("#editId").val();
        	var editForm = $("#editDataform");
        	var userid = tools.getUsermessage("id");
            var param = {};
				param.action_flag = "w_show_edit";
				param.sub_flag = "domain";
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
		
    form.on("submit(editFile)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
       var param = tools.getFormallData("#editDataform");
		editFileData(param, index);
        return false;
    })
    //新增监测域
	function editFileData(param,index){
        param.action_flag ="w_update";
        param.sub_flag ="domain";
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