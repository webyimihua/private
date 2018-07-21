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
    form.on("submit(editUser)",function(data){
         var data = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        editAccountData(data,index)
       
    })
   
    //修改数据
    function editAccountData(data,index){
        console.log(data)
        var param ={};
        param.action_flag="w_update";
        param.sub_flag="user";
        param.id=data.id;
        param.username=data.username;
        param.password=data.password;
        param.roleId=data.roleId;
        param.bureauId=data.bureauId;
        param.phoneNum=data.phoneNum;
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res.result == 1){
                top.layer.close(index);
                top.layer.msg("修改账户成功");
                layer.closeAll("iframe");
                //刷新父页面
                parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("修改账户失败");
            }
        })
    }


    findMonitorStation()
    function findMonitorStation(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="bureau";
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                  var data = res.data;
                  var str = '<option value="">请选择铁路局</option>';
                  for(var i in data){
                     str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                  }
                  $("#editMonitorStation").html(str);
                  $("#editMonitorStation").val($(".bureauIds").val());
                   form.render('select');
             }
        })
    }

    

})