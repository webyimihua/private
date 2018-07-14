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
    form.on("submit(addNotice)",function(data){
        var data = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addAreaData(data,index);
        return false;
    })

     // 新增数据
     function addAreaData(data,index){
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="notice";
        param.content=data.name;
        param.userId = '1';
        tools.sendRequest(net.MessageServlet,param,function(res){
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg("添加公告成功");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("添加公告失败");
            }
        })
    }

})