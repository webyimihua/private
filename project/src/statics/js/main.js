layui.use(['form','element','layer','jquery'],function(){
    var form = layui.form,
    layer = parent.layer === undefined ? layui.layer : top.layer,
    element = layui.element;
    $ = layui.jquery;
    var loginInfo = JSON.parse(localStorage.getItem('login'));
    if(!loginInfo){
        parent.window.location.href="../page/login/login.html"
    }
})
