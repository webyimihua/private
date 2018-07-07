layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#itemListtable',
        url : '../../../json/sensorList.json',
//      cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "itemListtable",
        cols : [[
//          {type: "checkbox", fixed:"left", width:50},
            {field: 'index', title: '序号', width:80, align:"center"},
            {field: 'sensorNo', title: '传感器编号', minWidth:120, align:"center"},
            {field: 'sensorName', title: '传感器名称', minWidth:100, align:'center'},
            {field: 'sensorType', title: '传感器类型', align:'center'},
            {field: 'ower', title: '所属终端', align:'center'},
            {field: 'number', title: '分站号', align:'center'},
            {field: 'distance', title: '里程', align:'center'},
            {field: 'stause', title: '状态', align:'center'},
            {field: 'mark', title: '备注', align:'center',minWidth:150},
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

   //添加传感器
    function addItem(){
        var index = layui.layer.open({
            title : "添加传感器",
            type : 2,
            content : "addSensor.html",
            success : function(layero, index){
//              if(edit){
//                  body.find(".userName").val(edit.userName);  //登录名
//                  body.find(".userEmail").val(edit.userEmail);  //邮箱
//                  body.find(".userSex input[value="+edit.userSex+"]").prop("checked","checked");  //性别
//                  body.find(".userGrade").val(edit.userGrade);  //会员等级
//                  body.find(".userStatus").val(edit.userStatus);    //用户状态
//                  body.find(".userDesc").text(edit.userDesc);    //用户简介
//                  form.render();
//              }
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
    //修改传感器
    function editItem(data){
        var index = layui.layer.open({
            title : "编辑传感器",
            type : 2,
            content : "editSensor.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){                   
                    body.find(".userEmail").val(data.userEmail);  //邮箱
                    body.find(".userSex input[value="+data.userSex+"]").prop("checked","checked");  //性别                    
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
    //查看传感器详情
    function showItem(data){
        var index = layui.layer.open({
            title : "传感器详情",
            type : 2,
            content : "detailSensor.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){                   
                    body.find(".userEmail").val(data.userEmail);  //邮箱
                    body.find(".userSex input[value="+data.userSex+"]").prop("checked","checked");  //性别                    
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
                // $.get("删除文章接口",{
                //     newsId : data.newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                    tableIns.reload();
                    layer.close(index);
                // })
            });
        }
    });

})