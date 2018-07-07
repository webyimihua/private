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
    form.on("submit(addBody)",function(data){
        var data = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addBodyData(data,index);
        return false;
    })
    // xinzeng
    function addBodyData(data,index){
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="object_type";
        param.name=data.name;
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res == '1'){
                console.log(res)
                // setTimeout(function(){
                //     top.layer.close(index);
                //     top.layer.msg("添加监测体成功");
                //     layer.closeAll("iframe");
                //     //刷新父页面
                //     parent.location.reload();
                // },2000);
            }else{
                top.layer.close(index);
                top.layer.msg("添加监测体失败");
            }
        })
    }

})