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
    form.on("submit(editStation)",function(data){
         var data = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        updataLineData(data,index)
       
    })
   
    //修改数据
     function updataLineData(data,index){
        var param ={};
        param.action_flag ="w_update";
        param.sub_flag ="gateway_type";
        param.name=data.name;
        param.channelNum=data.channelNum;
        param.id=data.id;
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res.result == 1){
                top.layer.close(index);
                top.layer.msg(res.message);
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
           }else{
                top.layer.msg(res.message);
            }
        })
    }


})