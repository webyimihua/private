layui.use(['form','layer','table','laytpl'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;

    //用户列表
    var tableIns = table.render({
        elem: '#itemListtable',
        url : '../../../json/terminalList.json',
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 20,
        id : "itemListtable",
        cols : [[           
            {field: 'index', title: '序号', width:80, align:"center"},
            {field: 'itemNum', title: '终端编号', minWidth:200, align:'center'},
            {field: 'itemTime', title: '采样间隔', align:'center'},
            {field: 'itemStructure', title: '所属监测体', align:'center'},
            {field: 'itemIp', title: 'IP地址', align:'center'},
            {field: 'itemNo', title: '端口号(全站仪)', align:'center'},
            {field: 'itemOther', title: '端口号(其他)', align:'center'},
            {field: 'stause', title: '状态', align:'center',minWidth:150},
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

    //添加终端
    function addItem(){
        var index = layui.layer.open({
            title : "添加终端",
            type : 2,
            content : "addTerminal.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
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
    //修改构筑物
    function editItem(data){
        var index = layui.layer.open({
            title : "编辑终端",
            type : 2,
            content : "editTerminal.html",
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
    //查看构筑物详情
    function showItem(data){
        var index = layui.layer.open({
            title : "终端",
            type : 2,
            content : "detailTerminal.html",
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