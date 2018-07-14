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
    //列表
    var tableIns = table.render({
        elem: '#itemListtable',
        url : 'http://47.95.13.55:8080//StructureMonitoring/SystemServlet',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "itemListtable",
        method: 'post',
        where: {
            action_flag:"w_query",
            sub_flag:"object_type",
            isFlur:false,
            isReserve:false,
            isDivide:true,
            hasForeign:false,
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
            {field: 'index', title: '序号', width:80, align:"center",type:"numbers"},
            {field: 'id', title: '序号', width:1, align:"center"},
            {field: 'name', title: '监测体类型名称', minWidth:280, align:"center"},
            {title: '操作', minWidth:175, templet:'#handleListBar',fixed:"right",align:"center"}
        ]]
    });
    //搜索
    $(".search_btn").on("click",function(){
        if($(".searchVal").val() != ''){
            table.reload("itemListtable",{
                url : 'http://47.95.13.55:8080//StructureMonitoring/SystemServlet',
                page: {
                    pageName: 1 //重新从第 1 页开始
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
            title : "新增监测体",
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
            title : "编辑监测体",
            type : 2,
            content : "edit.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){   
                    body.find(".bodyName").val(data.name);                 
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
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此信息？',{icon:3, title:'提示信息'},function(index){
                tableIns.reload();
                layer.close(index);
                deleterailwayBodyData(data)
            });
        }
    });
    
     function deleterailwayBodyData(data){
        var param ={};
        param.action_flag="w_delete";
        param.sub_flag="object_type";
        param.id=data.id;
        tools.sendRequest(net.SystemServlet,param,function(res){
            if(res.result){
                tableIns.reload();
                layer.close(index);
                 layer.msg('删除成功')
             }else{
                 layer.msg('删除失败')
             }
        })
    }


})