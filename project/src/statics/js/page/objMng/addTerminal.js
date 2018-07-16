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
		getAllstructuretype("#allStructure");
    form.on("submit(addTerminal)",function(data){
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        var param = tools.getFormallData("#addTerminal");
		addTerminalData(param, index);
        return false;
    })
	//新增终端
	function addTerminalData(param,index){
        param.action_flag ="w_add";
        param.sub_flag ="gateway";
        tools.sendRequest(net.ObjectServlet,param,function(res){
           if(res.result == 1) {
				setTimeout(function() {
					top.layer.close(index);
					top.layer.msg("添加终端成功");
					layer.closeAll("iframe");
					//刷新父页面
					parent.location.reload();
				}, 2000);
			} else {
				top.layer.close(index);
				top.layer.msg("添加终端失败");
			}
        })
    }
	//初始化查询构筑物下拉菜单
	function getAllstructuretype(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "object";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;		
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			console.log(res)
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div, data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增构筑物");
				};
			}
		})
	}
})