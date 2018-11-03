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
        tools.getAllallboodys("#allBodyss",userid);
    form.on("submit(editUser)",function(data){
         var data = data.field;
        //弹出loading
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        editAccountData(data,index)
       
    })

    $(".cancel").click(function(){
        return false;
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
    getAllBodyname()
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
    
     //初始化查询构筑物下拉菜单
    function getAllBodyname() {
        var param = {};
        param.action_flag = "w_show_option";
        param.sub_flag = "object";
        param.id = userid;
        tools.sendRequest(net.ObjectServlet, param, function(res) {
            if(res.result == 1) {
              var data = res.data;
              var str = '<option value="">请选择白名单</option>';
              for(var i in data){
                 str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
              }
              $("#editBodyname").html(str);
              $("#editBodyname").val($(".bureauIds").val());
              form.render('select');
            }
        })
    }
    
    //处理监测维度多选
	$(document).on("click", ".downpanel .layui-select-title", function(e) {
		var otext = [];
		var $select = $(this).parents(".layui-form-select");
		$(".layui-form-select").not($select).removeClass("layui-form-selected");
		$select.addClass("layui-form-selected");
		e.stopPropagation();
	}).on("click", ".downpanel .layui-form-checkbox", function(e) {	
		getSelectdata();
		e.stopPropagation();
	});

    

})