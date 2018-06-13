var $ ;
layui.use(['element','layer','jquery'],function(){
	$ = layui.$;
	var b_nums = $(".canvas-contai .bradge-items").length;
	$(".canvas-contai").width(160*b_nums + "px");
    $.get("../../json/detail.json",function(data){
         console.log(data)
	})
})