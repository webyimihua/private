layui.config({
	base: "../../../js/"
}).extend({
	"tools": "tools"
})
layui.use(['form','layer','table','laytpl','tools'],function(){
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        laytpl = layui.laytpl,
        table = layui.table;
        tools = layui.tools;
        
    tools.getWatchdimension("#dimensionOption"); 
	var userid = tools.getUsermessage("id");
	tools.getThatstructure("#structureOption",userid);
   //查找构筑物列表	
   	var userid = tools.getUsermessage("id");
	var tableIns = table.render({
		elem: '#itemListtable',
		url: net.baseurl + "/" + net.ObjectServlet,
		//		cellMinWidth: 95,
		page: true,
		height: "full-125",
		limits: [10, 15, 20, 25],
		limit: 10,
		id: "itemListtable",
		method: 'post',
		where: {
			action_flag: "w_query",
			sub_flag: "unit",
			isFlur: false,
			isReserve: false,
			isDivide: true,
			userId:userid,
		},
		request: {
			pageName: 'pageNum', //页码的参数名称，默认：page
			limitName: 'pageSize' //每页数据量的参数名，默认：limit
		},
		response: {
			statusName: 'result' //数据状态的字段名称，默认：code
				,
			statusCode: 1 //成功的状态码，默认：0
				,
			msgName: 'message' //状态信息的字段名称，默认：msg
				,
			countName: 'count' //数据总数的字段名称，默认：count
				,
			dataName: 'data' //数据列表的字段名称，默认：data	
		},
		done: function(res, curr, count) {
			$("[data-field='id']").css('display', 'none');
			$("[data-field='objectId']").css('display', 'none');
			$("[data-field='domainId']").css('display', 'none');
			$("[data-field='dimensionId']").css('display', 'none');
			$("[data-field='sUnitId']").css('display', 'none');
		},
        cols : [[
//          {type: "checkbox", fixed:"left", width:50},
            {field: 'index', title: '序号', width:80, align:"center",type: "numbers"},
            {field: 'id', align:'center'},
            {field: 'name', title: '监测点名称', minWidth:200, align:'center'},
            {field: 'objectId', title: '所属构筑物', align:'center'},
            {field: 'objectname', title: '所属构筑物', align:'center'},
            {field: 'height', title: '高度', align:'center'},
            {field: 'domainId', title: '所属监测域', align:'center'},
            {field: 'domainname', title: '所属监测域', align:'center'},
            {field: 'sensorname', title: '对应传感器', align:'center'},
            {field: 'sUnitId', title: '对应传感器', align:'center'},
            {field: 'mileage', title: '里程', align:'center'},
            {field: 'dimensionId', title: '监测维度', align:'center',minWidth:150},
            {field: 'dimensionname', title: '监测维度', align:'center',minWidth:150},
            {title: '操作', minWidth:175, templet:'#handleListBar',fixed:"right",align:"center"}
        ]]
    });

   form.on('select(findstructure)', function(data) {
		table.reload("itemListtable", {
			url : net.baseurl + "/" + net.ObjectServlet,
			page: {
				curr: 1 
			},
			where: {
				objectId: data.value,
			}
		})
	});
   form.on('select(finddimension)', function(data) {
		table.reload("itemListtable", {
			url : net.baseurl + "/" + net.ObjectServlet,
			page: {
				curr: 1 
			},
			where: {
				dimensionId: data.value,
			}
		})
	});

    //添加监测点
    function addItem(){
        var index = layui.layer.open({
            title : "添加监测点",
            type : 2,
            content : "addPoint.html",
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
    //修改监测点
    function editItem(id){
        var index = layui.layer.open({
            title : "编辑监测点",
            type : 2,
            content : "editPoint.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find("#editId").val(id);
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
    //查看监测点详情
    function showItem(data){
        var index = layui.layer.open({
            title : "监测点详情",
            type : 2,
            content : "detailPoint.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                if(data){
                	var showForm = body.find("#showDataform");
                	tools.setOlddataToform(showForm,data);
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
            editItem(data.id);
        }else if(layEvent === 'detail'){ //详情
            showItem(data);
        }else if(layEvent === 'del'){ //删除
           layer.confirm('确定删除此信息？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				delFiledata(data.id, index);
			});
        }
    });
    
    //删除监测域
	function delFiledata(id, index) {
		var param = {};
		param.action_flag = "w_delete";
		param.sub_flag = "unit";
		param.id = id;
		param.userId= tools.getUsermessage("id");
		tools.sendRequest(net.ObjectServlet, param, function(res) {
			if(res.result == 1) {
				if(res.message) {
					layer.msg(res.message);
				}
				tableIns.reload();
				layer.close(index);
			} else {
				if(res.message) {
					layer.msg(res.message);
				}
			}
		})
	}   

})