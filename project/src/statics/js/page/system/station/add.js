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
    form.on("submit(addStation)",function(data){
        var data = data.field;
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addStationData(data,index)
    })

    // 新增数据
     function addStationData(data,index){
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="bureau";
        param.name=data.name;
        tools.sendRequest(net.SystemServlet,param,function(res){
            console.log(res)
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg("添加铁路局成功");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("添加铁路局成功");
            }
        })
    }

})