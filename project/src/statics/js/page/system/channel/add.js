layui.config({
    base : "../../../../js/"
}).extend({
    "tools" : "tools"
})
layui.use(['form','layer','tools'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
        tools = layui.tools;
         var userid = tools.getUsermessage("id");
    form.on("submit(addStation)",function(data){
        var data = data.field;
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addStationData(data,index)
    })

    // 新增数据
     function addStationData(data,index){
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="channel";
        param.sensor_typeId=data.sensor_typeId;
        param.gateway_typeId=data.gateway_typeId;
        param.remark=data.remark;
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg(res.message);
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg(res.message);
            }
        })
    }
    getAllStationname("#thatFile")
    getAllPointname("#thatPoints")
     //初始化数据
    function getAllStationname(div) {
        var param = {};
        param.action_flag = "w_show_option";
        param.sub_flag = "gateway_type";
        tools.sendRequest(net.ObjectServlet, param, function(res) {
            if(res.result == 1) {
                var data = res.data;
                if(data.length > 0) {
                    tools.initOptionitem(div,data,function(){
                        form.render('select');
                    });                 
                } else {
                    layer.msg("请先新增铁路局数据");
                };
            }
        })
    }
     //初始化数据
    function getAllPointname(div) {
        var param = {};
        param.action_flag = "w_show_option";
        param.sub_flag = "sensor_type";
        tools.sendRequest(net.ObjectServlet, param, function(res) {
            if(res.result == 1) {
                var data = res.data;
                tools.initOptionitem(div,data,function(){
                    form.render('select');
                });
            }
        })
    }

})