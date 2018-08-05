layui.config({
    base : "../../js/"
}).extend({
    "tools" : "tools"
})
layui.use(['form','layer','laydate','table','laytpl','tools'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laydate = layui.laydate,
        laytpl = layui.laytpl,
        table = layui.table;
        tools = layui.tools;
    //添加验证规则
    form.verify({
        oldPwd : function(value, item){
            if(value != sessionStorage.getItem('spPsw')){
                return "旧密码错误，请重新输入！";
            }
        },
        newPwd : function(value, item){
            if(value.length < 6){
                return "密码长度不能小于6位";
            }
        },
        confirmPwd : function(value, item){
            if(!new RegExp($("#oldPwd").val()).test(value)){
                return "两次输入密码不一致，请重新输入！";
            }
        }
    })

    form.on("submit(changePwd)",function(data){
        var data = data.field;
        var index = top.layer.msg('数据提交中，请稍候',{icon: 16,time:false,shade:0.8});
        changePwdData(data,index)
        return false;
    })

     // 修改密码
     function changePwdData(data,index){
        var param ={};
        param.action_flag ="w_change_password";
        param.id =tools.getUsermessage("id");
        param.oldPassword=data.oldPassword;
        param.newPassword=data.newPassword;
        tools.sendRequest(net.LoginServlet,param,function(res){
           if(res.result == 1){
                    top.layer.close(index);
                    top.layer.msg("修改密码成功");
                    layer.closeAll("iframe");
                    setTimeout(function(){
                       parent.window.location.href="../../page/login/login.html"
                    },500);
                   
            }else{
                top.layer.close(index);
                top.layer.msg("修改密码失败");
            }
        })
    }


})