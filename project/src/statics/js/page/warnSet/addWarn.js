layui.config({
    base : "../../../js/"
}).extend({
    "tools" : "tools"
})
layui.use(['form','layer','tools'],function(){
    var form = layui.form
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
        tools = layui.tools;

    form.on("submit(addAlarm)",function(data){
        var data = data.field;
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addAlarmData(data,index)
        return false;
    })

    // 新增数据
     function addAlarmData(data,index){
        console.log(data)
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="alarm";
        param.unitId=data.unitId;
        param.param=data.param;
        param.lowLevel=data.lowlevel;
        param.highLevel=data.highLevel;
        tools.sendRequest(net.AlarmServlet,param,function(res){
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg("添加预警配置参数成功");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("添加预警配置参数失败");
            }
        })
    }
    
    findMonitorBody()
    findMonitorDimension()
    findMonitorPoint()

     function findMonitorBody(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="object";
        param.id=1;
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
              var data = res.data;
              var str = '<option value="">请选择监测体</option>';
              for(var i in data){
                 str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
              }
              $("#addMonitorBody").html(str);
               form.render('select');
             }
        })
    }

      function findMonitorDimension(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="dimension";
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
               var data = res.data;
              var str = '<option value="">请选择监测维度</option>';
              for(var i in data){
                 str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
              }
              $("#addMonitorDes").html(str);
               form.render('select');
             }
        })
    }

     function findMonitorPoint(){
        var param ={};
        param.action_flag="w_query_for_dropbox";
        tools.sendRequest(net.AlarmServlet,param,function(res){
            if(res.result){
              var data = res.data;
              var str = '<option value="">请选择监测点</option>';
              for(var i in data){
                 str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
              }
              $("#addMonitorPoint").html(str);
               form.render('select');
             }
        })
    }
    

})