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
			sub_flag: "sensor",
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
		},
        cols : [[
            {field: 'index', title: '序号', width:80, align:"center",type: "numbers"},
            {field: 'id', title: '传感器编号', width:120, align:"center"},
            {field: 'name', title: '传感器名称', width:250, align:'center'},
            {field: 'sensor_typename', title: '传感器类型',width:180, align:'center'},
            {field: 'gatewayname', title: '所属终端',width:180, align:'center'},
            {field: 'subId', title: '分站号',width:100, align:'center'},
            {field: 'mileage', title: '里程',width:100, align:'center'},
            {field: 'status', title: '状态',width:90, align:'center'},
            {field: 'remark', title: '备注', align:'center',width:150},
            {title: '操作', minWidth:360, templet:'#handleListBar',fixed:"right",align:"center"}
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
    	var sensorType = data.sensor_typeId;
    	var contentUrl = "";
    	if(sensorType != 12){
    		contentUrl = 'editSensor.html';
    	}else{
    		contentUrl = 'editStation.html';
    	}
        var index = layui.layer.open({
            title : "编辑传感器",
            type : 2,
            content : contentUrl,
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find("editId").val(data.id);
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
    //设置全站仪传感器参数
    function setData(data){
    	var sensorId = data.id;
    	var sensorName = data.name;
    	var otitle = "全站仪测量参数配置     -   "+sensorName;
        var index = layui.layer.open({
            title : otitle,
            type : 2,
            content : "setStation.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find("#sensorId").val(sensorId);
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
    //设置全站仪时间参数
    function setTime(data){
    	var sensorId = data.id;
    	var sensorName = data.name;
    	var otitle = "时间参数配置     -   "+sensorName;
        var index = layui.layer.open({
            title : otitle,
            type : 2,
            content : "setTime.html",
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                body.find("#sensorId").val(sensorId);
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
    	var sensorType = data.sensor_typeId;
    	var contentUrl = "";
    	if(sensorType != 12){
    		contentUrl = 'detailSensor.html';
    	}else{
    		contentUrl = 'detailStation.html';
    	}
        var index = layui.layer.open({
            title : "传感器详情",
            type : 2,
            content : contentUrl,
            success : function(layero, index){
                var body = layui.layer.getChildFrame('body', index);
                var showForm = body.find("#showDataform");
                if(data){
                	tools.setOlddataToform(showForm, data);
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
        }else if(layEvent === 'setData'){ //详情
            setData(data);
        }else if(layEvent === 'setTime'){ //详情
            setTime(data);
        }else if(layEvent === 'openItem'){ //详情
            openItem(data);
        }else if(layEvent === 'del'){ //删除
            layer.confirm('确定删除此信息？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				delSensordata(data.id, index);
			});
        }
    });
    
     //删除终端
	function delSensordata(id, index) {
		var param = {};
		param.action_flag = "w_delete";
		param.sub_flag = "sensor";
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