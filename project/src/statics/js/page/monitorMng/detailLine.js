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
	
	function openDetails(){
	    var index = layui.layer.open({
	        title : false,
	        type : 2,
	        closeBtn: 0,
	        content : "detail.html",
	        success : function(layero, index){
	            var body = layui.layer.getChildFrame('body', index);
	            Timeout(function(){
	                layui.layer.tips('点击此处返回', '.layui-layer-setwin .layui-layer-close', {
	                    tips: 3
	                });
	            },500)
	        }
	    })
	    layui.layer.full(index);
	    //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
	    $(window).on("resize",function(){
	        layui.layer.full(index);
	    })
	}
	$(".circle").dblclick(function(){
        openDetails();
    })
})