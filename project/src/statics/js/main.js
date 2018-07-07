layui.use(['form','element','layer','jquery'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        element = layui.element;
        $ = layui.jquery;
        
if(!window.localStorage.getItem('userId')){
    // window.parent.location.href='../../page/login/login.html';
}
       login()
    function login(){
    	$.ajax({
            url :'http://47.95.13.55:8080/StructureMonitoring/LoginServlet',
//          dataType: 'json',
//		    contentType: 'application/json',
            type: 'post',
            data: {action_flag:"w_login",username:"admin",password:"111"},
//          dataType: 'jsonp',
//          crossDomain: true,
            success : function(data){
                console.log(data)
            }
        })
    }
   


})
