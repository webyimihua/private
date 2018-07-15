layui.config({
    base : "../../../js/"
}).extend({
    "tools" : "tools"
})
var $ ;
layui.use(['element','layer','jquery','tools'],function(){
	$ = layui.$;
	 tools = layui.tools;
	var winWidth = $(window).width();
	var b_nums = $(".canvas-contai .bradge-items").length;
	if( b_nums*160 > winWidth){
         $(".canvas-contai").width(160*b_nums + "px");
	}else{
		 $(".canvas-contai").width(winWidth);
	}
	
	$(".close_btn").click(function(){
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index)
	})

	$(function(){
		findBridgeList()
	})


	function findBridgeList(){
        var param ={};
        param.action_flag="w_get_object_detail";
        param.dimensionId="null";
        param.userId=1;
        param.id=$(".brageIds").val();
        tools.sendRequest(net.DataServlet,param,function(res){
            if(res.result){
            	console.log(res.data)
             }
        })
	}

})