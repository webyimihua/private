layui.config({
    base : "../../../js/"
}).extend({
    "tools" : "tools"
})
layui.use(['form','layer','table','laytpl','tools'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
        tools = layui.tools;
        var userid = tools.getUsermessage("id");
    //用户列表
    var tableIns = table.render({
       elem: '#itemListtable',
        url : 'http://47.95.13.55:8080//StructureMonitoring/AlarmServlet',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit :10,
        id : "itemListtable",
        method: 'post',
        where: {
            action_flag:"w_query",
            sub_flag:"alarm",
            userId:userid,
            isDivide:true,
        },
        request: {
          pageName: 'pageNum', //页码的参数名称，默认：page
          limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        response: {
           statusName: 'result' //数据状态的字段名称，默认：code
          ,statusCode: 1 //成功的状态码，默认：0
          ,msgName: 'message' //状态信息的字段名称，默认：msg
          ,countName: 'count' //数据总数的字段名称，默认：count
          ,dataName: 'data' //数据列表的字段名称，默认：data 
        },
        done: function(res, curr, count){
          $("[data-field='id']").css('display','none');
        },
        cols : [[
            {field: 'index', title: '序号', width:40, align:"center",type:"numbers"},
            {field: 'id', title: 'id', width:1, align:"center"},
            {field: 'param', title: '预警值名称', minWidth:100, align:'center'},
            {field: 'objectName', title: '所属构筑物', align:'center'},
            {field: 'dimensionName', title: '监测维度', align:'center'},
            {field: 'dimensionName', title: '监测点名称', align:'center'},
            {field: 'lowLevel', title: '初级预警值',width:100, align:'center'},
            {field: 'highLevel', title: '高级预警值',width:100, align:'center'},
            {title: '操作', minWidth:175, templet:'#handleListBar',fixed:"right",align:"center"}
        ]]
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("newsListTable",{
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    key: $(".searchVal").val()  //搜索的关键字
                }
            })
        }else{
            layer.msg("请输入搜索的内容");
        }
    });

     //添加构筑物
    function addItem(){
        var index = layui.layer.open({
            title : "新增预警参数配置",
            type : 2,
            content : "addWarn.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
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
    
    $(".addItem_btn").click(function(){
        addItem();
    })

    //列表操作
    table.on('tool(itemList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            editItem(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
               deleteWarnData(data)
                tableIns.reload();
                layer.close(index); 
            });
        }
    });
    
     function editItem(data){
        var index = layui.layer.open({
            title : "编辑传感器类型",
            type : 2,
            content : "editWarn.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){                   
                    body.find("#alarmIds").val(data.id);  
                    body.find(".param").val(data.param);  
                    body.find(".lowLevelss").val(data.lowLevel);                 
                    body.find(".highLevel").val(data.highLevel); 
                    editfindMonitorBody(data.objectId,body);
                    editMonitorDimension(data.dimensionId,body);
                    editMonitorPoint(data.objectId,data.dimensionId,data.unitId,body);
                    form.render();
                }
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


    function deleteWarnData(data){
        var param ={};
        param.action_flag="w_delete";
        param.sub_flag="alarm";
        param.id=data.id;
        tools.sendRequest(net.SystemServlet,param,function(res){
            if(res.result){
                 tableIns.reload();
                 layer.msg('删除成功')
             }else{
                 layer.msg(res.message)
             }
        })
    }
    
    $(function(){
         findMonitorDimension()
         findMonitorBody()
    })
    
    function editMonitorPoint(objectId,dimensionId,ids,body){
        var param ={};
        param.action_flag="w_query_for_dropbox";
        param.sub_flag="alarm";
        param.objectId=objectId;
        param.dimensionId=dimensionId;
        tools.sendRequest(net.AlarmServlet,param,function(res){
            if(res.result){
              var data = res.data;
              var str = '<option value="">请选择监测点</option>';
              for(var i in data){
                 str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
              }
               body.find("#editMonitorPoint").html(str);
               body.find(".editMonitorPoint").val(ids);
             }
        })
    }
     
    function findMonitorBody(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="object";
        param.id=1;
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                 tools.initOptionitem("#monitorBody", res.data,function(){
                    form.render('select');
                });
             }
        })
    }
    
    function editfindMonitorBody(ids,body){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="object";
        param.id=1;
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                 var str = '';
                 var data = res.data;
				for(var i = 0; i < data.length; i++) {
					str += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
				}
				body.find("#editMonitorBody").html(str); 
				body.find(".editobjectIds").val(ids); 
				form.render('select');
             }
        })
    }
    
    function editMonitorDimension(ids,body){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="dimension";
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                var str = '';
                var data = res.data;
				for(var i = 0; i < data.length; i++) {
					if(data[i].id == 1 || data[i].id == 2 || data[i].id == 5 || data[i].id == 6){
						str += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
					}
				}
				body.find("#editDimension").html(str); 
				body.find(".editDimensions").val(ids); 
				form.render('select');
             }
        })
    }
   
    function findMonitorDimension(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="dimension";
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                tools.initOptionitem("#dimensionBox", res.data,function(){
                    form.render('select');
                });
             }
        })
    }

    form.on('select(dimensionVal)',function(data){
        table.reload("itemListtable",{
            url : 'http://47.95.13.55:8080//StructureMonitoring/AlarmServlet',
            page: {
                pageName: 1 //重新从第 1 页开始
            },
            where: {
                dimensionId: data.value //搜索的关键字
            }
        })
    });

    form.on('select(monitorBody)',function(data){
        table.reload("itemListtable",{
            url : 'http://47.95.13.55:8080//StructureMonitoring/AlarmServlet',
            page: {
                pageName: 1 //重新从第 1 页开始
            },
            where: {
                objectId: data.value //搜索的关键字
            }
        })
    });

})