layui.config({
    base : "../../../js/"
}).extend({
    "tools" : "tools"
})
var $ ;
layui.use(['element','layer','jquery','tools'],function(){
	$ = layui.$;
	 tools = layui.tools;
	$(".close_bre_btn").click(function(){
		var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index)
	})

	$(function(){
		// findBridgeLists(JSON.parse($(".brageIds").val()))
        // $(".bradge-box").height($(".childrenBody").height() - 180);
		$("#selectAreas").change(function(){
			var dimensionId = $(this).val();
            $(".selbrageidss").val(dimensionId);
			var ids = $(".selbrageIds").val();
			findBridgeSelectList(ids,dimensionId)
		})

		setTimeout(function(){
            findBridgeSelectList($(".selbrageIds").val(),$(".selbrageidss").val());
        },200)

		findMonitorPointMes();
	})


	function findBridgeSelectList(ids,dimensionId){
		if(!dimensionId){
			var dimensionId = 1;
		}
         $.post('http://47.95.13.55:8080/StructureMonitoring/DataServlet',{
            action_flag:"get_drawing_data",
            objectId:ids,
            dimensionId:dimensionId,
         },function(res){
             var ress = JSON.parse(res);
             if(ress.result == 1){
               findBridgeLists(ress,dimensionId)
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
                // console.log(res.data)
             }
        })
    }


	function findBridgeLists(data,dimensionId){
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
	                    			str+='<li class="top sel_green circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="top sel_orange circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="top sel_red circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}
	                    	}else if(point[j].position == "中"){
	                    		if(point[j].alarmLevel == 1){
	                    			str+='<li class="middle sel_green circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="middle sel_orange circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="middle sel_red circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}
	                    	}else if(point[j].position == "下"){
	                    		if(point[j].alarmLevel == 1){
	                    			str+='<li class="bottom sel_green circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else if(point[j].alarmLevel == 2){
                                    str+='<li class="bottom sel_orange circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}else{
                                    str+='<li class="bottom sel_red circle" ids="'+point[j].id+'" type="'+dimensionId+'" title="'+point[j].name+'"></li>';
	                    		}
	                    	}
	                    }
	                str+='</ul>';
                str+='</li>';
        	}
        	$(".canvas-contai").html(str);
        	var winWidth = $(window).width();
        	var winheight = $(window).height();
			var b_nums = data.length;
			 $(".canvas-contai").height(winheight - 220);
			if( b_nums*140 > winWidth){
		         $(".canvas-contai").width(140*b_nums + "px");
			}else{
				 $(".canvas-contai").width(winWidth - 40);
			}
	}


	function pointMes(ids,types){
        var index = layui.layer.open({
            title : false,
            type : 2,
           closeBtn: 0,
            content : "detailLine.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find("#pointTypes").val($(".selbrageidss").val());
                body.find("#pointIds").val(ids);
                body.find("#pointTyp").val(types);
                setTimeout(function(){
                    layui.layer.tips('点击此处返回构筑物列表', '.layui-layer-setwin .layui-layer-close', {
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
    $(document).on("click",".splot-box>.circle",function(){
        var ids = $(this).attr("ids");
        var types = $(this).attr("type");
        pointMes(ids,types);
        $(this).unbind();
    })

})