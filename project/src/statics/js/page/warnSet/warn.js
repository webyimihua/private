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
            userId:1,
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
            {field: 'index', title: '序号', width:80, align:"center"},
            {field: 'id', title: '序号', width:1, align:"center"},
            {field: 'itemNum', title: '监测点编号', minWidth:200, align:'center'},
            {field: 'itemStructure', title: '所属构筑物', align:'center'},
            {field: 'itemType', title: '检测物维度', align:'center'},
            {field: 'itemName', title: '监测点名称', align:'center'},
            {field: 'warnMin', title: '初级预警值', align:'center'},
            {field: 'warnMax', title: '高级预警值', align:'center'},
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
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        }
    });
    
    $(function(){
         findMonitorDimension()
         findMonitorBody()
    })
     
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

})