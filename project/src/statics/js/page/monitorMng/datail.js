var $ ;
layui.use(['element','layer','jquery'],function(){
	$ = layui.$;
	var b_nums = $(".canvas-contai .bradge-items").length;
	$(".canvas-contai").width(160*b_nums + "px");
	// $(".bradge-box").width(160*b_nums + "px");
    $.get("../../json/detail.json",function(data){
         console.log(data)
	})

	$(".close_btn").click(function(){
    	var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    })
})