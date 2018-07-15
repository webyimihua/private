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
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("修改构筑域成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("修改构筑域失败");
			}
        })
    }
})