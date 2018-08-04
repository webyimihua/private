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
		// findBridgeLists(JSON.parse($(".brageIds").val()))
		$("#selectAreas").change(function(){
			var dimensionId = $(this).val();
			var ids = $(".selbrageIds").val();
			findBridgeSelectList(ids,dimensionId)
		})
		findBridgeSelectList($(".selbrageIds").val(),$(".selbrageidss").val());
		findMonitorPointMes();
	})


	function findBridgeSelectList(ids,dimensionId){
         $.post('http://47.95.13.55:8080/StructureMonitoring/DataServlet',{
            action_flag:"get_drawing_data",
            objectId:ids,
            dimensionId:dimensionId,
         },function(res){
             var ress = JSON.parse(res);
             if(ress.result == 1){
               findBridgeLists(ress)
             }
         })
    }


    function findMonitorPointMes(){
        var param ={};
        param.action_flag="m_get_units";
        param.objectId=$(".selbrageIds").val();
        param.dimensionId=$(".selbrageidss").val();
        tools.sendRequest(net.DataServlet,param,function(res){
            if(res.result){
                console.log(res.data)
             }
        })
    }


	function findBridgeLists(data){
		    $(".canvas-contai").html('');
		    var str = '';
        	var res = data;
        	var data = res.data;
        	for(var i in data){
        		str+='<li class="bradge-items">';
	                str+='<div class="mark-num">'+data[i].name+'</div>';
	                str+='<ul class="splot-box">';
	                    var point = data[i].unit;
	                    for(var j in point){
	                    	if(point[j].position == "上"){
	                    		if(point[j].alarmLevel == 1){
	                    			str+='<li class="top sel_green circle" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="top sel_orange circle" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="top sel_red circle" title="'+point[j].name+'"></li>';
	                    		}
	                    	}else if(point[j].position == "中"){
	                    		if(point[j].alarmLevel == 1){
	                    			str+='<li class="middle sel_green circle" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="middle sel_orange circle" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="middle sel_red circle" title="'+point[j].name+'"></li>';
	                    		}
	                    	}else if(point[j].position == "下"){
	                    		if(point[j].alarmLevel == 1){
	                    			str+='<li class="bottom sel_green circle" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="bottom sel_orange circle" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="bottom sel_red circle" title="'+point[j].name+'"></li>';
	                    		}
	                    	}
	                    }
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