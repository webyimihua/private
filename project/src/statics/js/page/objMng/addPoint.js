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
		getAllfile("#allFile");
		getAllsensor("#Allsensor");
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
        param.userId= tools.getUsermessage("id");
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
	//初始化查询监测域下拉菜单
	function getAllfile(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "domain";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;		
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div, data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增监测域");
				};
			}
		})
	}
	//初始化查询监测域下拉菜单
	function getAllsensor(div) {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "sensor";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = true;
		param.hasForeign = false;		
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				var data = res.data;
				if(data.length > 0) {
					tools.initOptionitem(div, data,function(){
						form.render('select');
					});					
				} else {
					layer.msg("请先新增传感器");
				};
			}
		})
	}
})