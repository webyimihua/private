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
        param.sub_flag ="bureau";
        param.name=data.name;
        param.id=data.id;
        tools.sendRequest(net.SystemServlet,param,function(res){
            console.log(res.result)
           if(res.result == 1){
                top.layer.close(index);
                top.layer.msg("修改铁路局成功");
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("修改改铁路局失败");
            }
        })
    }


})