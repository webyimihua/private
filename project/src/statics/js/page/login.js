layui.config({
    base: "../../js/"
}).extend({
    "tools": "tools"
})
layui.use(['form','layer','jquery','tools'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer
        $ = layui.jquery;
        tools = layui.tools;
    //登录按钮
    form.on("submit(login)",function(data){
        userLogin(data.field)
        return false;
    })
    

     function userLogin(data){
        var param ={};
        param.action_flag="w_login";
        param.username=data.userName;
        param.password=data.password;
        tools.sendRequest(net.LoginServlet,param,function(res){
            if(res.result){
               var mesInfo = JSON.stringify(res.data)
               localStorage.setItem('login',mesInfo)
               layer.msg(res.message)
               setTimeout(function(){
                  window.location.href="../../index.html";
                },1500)
             }else{
                layer.msg(res.message)
             }
        })
    }

})
