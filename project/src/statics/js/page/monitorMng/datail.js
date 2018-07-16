layui.config({
    base : "../../../js/"
}).extend({
    "tools" : "tools"
})
var $ ;
layui.use(['element','layer','jquery','tools'],function(){
	$ = layui.$;
	 tools = layui.tools;
	$(".close_btn").click(function(){
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index)
	})

	$(function(){
		findBridgeLists()
	})


	function findBridgeLists(){
		    var str = '';
        	var res = JSON.parse($(".brageIds").val());
        	var data = res.data;
        	for(var i in data){
        		str+='<li class="bradge-items">';
	                str+='<div class="mark-num">'+data[i].name+'</div>';
	                str+='<ul class="splot-box">';
	                   str+='<li class="top sel_red circle"></li>';
	                   str+='<li class="middle sel_orange circle"></li>';
	                   str+='<li class="bottom sel_red circle"></li>';
	                str+='</ul>';
                str+='</li>';
        	}
        	$(".canvas-contai").html(str);
        	var winWidth = $(window).width();
			var b_nums = data.length;
			if( b_nums*160 > winWidth){
		         $(".canvas-contai").width(140*b_nums + "px");
			}else{
				 $(".canvas-contai").width(winWidth);
			}
	}

})