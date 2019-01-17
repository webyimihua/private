layui.config({
    base : "../js/"
}).extend({
    "tools" : "tools"
})

layui.use(['form','layer','table','laytpl','tools'],function(){
	var $ = layui.jquery,
	    tools = layui.tools
	var userid = tools.getUsermessage("id");
	findMonitorBody()
	function findMonitorBody(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="object";
        param.id=userid;
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                 var data = res.data;
                 var str = '';
                 for (var i in data) {
                 	str+='<li class="item">';
					    str+='<input type="checkbox" name="" id="" value="'+data[i].id+'" />'
					    str+='<span>'+data[i].name+'</span>'
				    str+='</li>'
                 }
                 $("#body-contai").html(str);
            }
        })
    }
	
	//一键提交
	$(".submit-btn").click(function(){
		var tar = $("#body-contai").find("input:checked");
		if(tar.length == 0){
			layer.msg('请选择监测体！！！');
			return;
		}
		for(var i=0; i<tar.length; i++){
		   if($(tar[i]).is(':checked')){
		   	    var param ={};
		        param.action_flag="w_sync_database";
		        param.id=$(tar[i]).val();
		        tools.sendRequest(net.ObjectServlet,param,function(res){
		        	if(i == tar.length){
		        		layer.mag('同步成功')
		        		layer.closeAll("page");
		        	}
		        })
		   }
		}
		
	})
})