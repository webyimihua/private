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
        if(tools.getUsermessage("roleId") == 3){
        	$("#remove_notice_btn").remove();
        }
        
    //列表
    var tableIns = table.render({
        elem: '#itemListtable',
        url : 'http://47.95.13.55:8080//StructureMonitoring/MessageServlet',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit :10,
        id : "itemListtable",
        method: 'post',
        where: {
        	action_flag:"w_query",
            sub_flag:"notice",
            isFlur:true,
            isReserve:true,
            isDivide:true,
            hasForeign:false,
            userId:userid,
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
            // {type: "checkbox", fixed:"left", width:50},
            {field: 'index', title: '序号', width:60, align:"center",type:"numbers"},
            {field: 'id', title: 'id', width:1, align:"center"},
            {field: 'content', title: '发布内容', minWidth:100, align:"center"},
            {field: 'username', title: '发布者', width:150, align:"center"},
            {field: 'time', title: '发布日期', width:200, align:"center"},
            {title: '操作', width:120, templet:'#handleListBar',fixed:"right",align:"center"}
        ]]
    });

    form.on('select(stations)',function(data){
        table.reload("itemListtable",{
            url : 'http://47.95.13.55:8080//StructureMonitoring/MessageServlet',
            page: {
                pageName: 1 //重新从第 1 页开始
            },
            where: {
                key: data.value //搜索的关键字
            }
        })
    });
    
    //添加构筑物
    function addItem(){
        var index = layui.layer.open({
            title : "发布新公告",
            type : 2,
            content : "add.html",
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
    //修改构筑物
    function editItem(data){
        var index = layui.layer.open({
            title : "编辑铁路线",
            type : 2,
            content : "edit.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){           
                    body.find(".lineName").val(data.name);  
                    body.find(".ids").val(data.id);                  
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
    
    //列表操作
    table.on('tool(itemList)', function(obj){
        var layEvent = obj.event,
            data = obj.data;
        if(layEvent === 'edit'){ //编辑
            editItem(data);
        }else if(layEvent === 'detail'){ //详情
            showItem(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
                    deleterailwayLineData(data)
                    tableIns.reload();
                    layer.close(index);
            });
        }
    });
    
    
    function deleterailwayLineData(data){
        var param ={};
        param.action_flag="w_delete";
        param.sub_flag="notice";
        param.id=data.id;
        tools.sendRequest(net.SystemServlet,param,function(res){
            if(res.result){
                 tableIns.reload();
                 layer.msg('删除成功');
             }else{
                 layer.msg(res.message);
             }
        })
    }

    findMonitorBody()
     function findMonitorBody(){
        var param ={};
        param.action_flag="w_show_option";
        param.sub_flag="bureau";
        param.id=userid;
        tools.sendRequest(net.ObjectServlet,param,function(res){
            if(res.result){
                  var data = res.data;
                  var str = '<option value="">请选择铁路局</option>';
                  for(var i in data){
                     str+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                  }
                  $("#monitorBody").html(str);
                  form.render('select');
             }
        })
    }

})