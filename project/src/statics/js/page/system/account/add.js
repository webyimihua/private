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
    form.on("submit(addUser)",function(data){
        var data = data.field;
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        addUserData(data,index)
        //弹出loading
        
        return false;
    })
    
    $(".cancel").click(function(){
       layer.closeAll("iframe");
       //刷新父页面
       parent.location.reload();
        return false;
    })

     // 新增数据
     function addUserData(data,index){
        var param ={};
        param.action_flag ="w_add";
        param.sub_flag ="user";
        param.username=data.username;
        param.password=data.password;
        param.roleId=data.roleId;
        param.bureauId=data.bureauId;
        param.phoneNum=data.phoneNum;
        tools.sendRequest(net.SystemServlet,param,function(res){
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg("添加用户成功");
                    layer.closeAll("iframe");
                    //刷新父页面
                    parent.location.reload();
            }else{
                top.layer.close(index);
                top.layer.msg("添加用户失败");
            }
        })
    }

    getAllStationname("#allStation");
   //初始化查询铁路局下拉菜单
    function getAllStationname(div) {
        var param = {};
        param.action_flag = "w_query";
        param.sub_flag = "bureau";
        param.isFlur = false;
        param.isReserve = false;
        param.isDivide = true;
        param.hasForeign = false;
        tools.sendRequest(net.SystemServlet, param, function(res) {
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

})