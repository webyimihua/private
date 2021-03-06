layui.config({
	base: "../../../js/"
}).extend({
	"tools": "tools"
})
layui.use(['form', 'layer', 'table', 'laytpl', 'tools'], function() {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		laytpl = layui.laytpl,
		table = layui.table;
		tools = layui.tools;
	//查找关系列表
	tools.getAllstation("#stationOPtion");
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
			sub_flag: "sensor_unit",
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
			$("[data-field='sensorId']").css('display', 'none');
			$("[data-field='unitId']").css('display', 'none');
		},
		cols: [
			[
				{
					field: 'index',
					title: '序号',
					width: 80,
					align: "center",
					type: "numbers"
				},
				{
					field: 'id',
					title: '关系ID',
					width: "",
					align: "center",
				},
				{
					field: 'sensorId',
					title: '传感器ID',
					minWidth: 180,
					align: "center"
				},
				{
					field: 'sensorname',
					title: '传感器名称',
					minWidth: 180,
					align: "center"
				},
				{
					field: 'unitId',
					title: '监测点ID',
					width: "",
					align: 'center'
				},	
				{
					field: 'unitname',
					title: '监测点名称',
					width: "",
					align: 'center'
				},			
				{
					title: '操作',
					minWidth: 175,
					templet: '#handleListBar',
					fixed: "right",
					align: "center"
				}
			]
		]
	});
	form.on('select(findstation)', function(data) {
		table.reload("itemListtable", {
			url : net.baseurl + "/" + net.ObjectServlet,
			page: {
				curr: 1 
			},
			where: {
				bureauId: data.value
			}
		})
	});
	//添加构筑物
	function addItem() {
		var index = layui.layer.open({
			title: "添加关系管理",
			type: 2,
			content: "addRelation.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				setTimeout(function() {
					layui.layer.tips('点击此处返回关系管理列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
		layui.layer.full(index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(index);
		})
	}
	$(".addItem_btn").click(function() {
		addItem();
	})
	//修改关系
	function editItem(id) {
		var index = layui.layer.open({
			title: "编辑关系管理",
			type: 2,
			content: "editRelation.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				body.find("#editId").val(id);
				setTimeout(function() {						
				layui.layer.tips('点击此处返回关系管理列表', '.layui-layer-setwin .layui-layer-close', {
					tips: 3
				});
				}, 500)
			}
		})
		layui.layer.full(index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(index);
		})
	}
	//查看关系详情
	function showItem(data) {
		var index = layui.layer.open({
			title: "关系管理详情",
			type: 2,
			content: "detailRelation.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				var showForm = body.find("#showDataform");
				if(data) {
					tools.setOlddataToform(showForm, data);
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回关系管理列表', '.layui-layer-setwin .layui-layer-close', {
						tips: 3
					});
				}, 500)
			}
		})
		layui.layer.full(index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(index);
		})
	}
	//列表操作
	table.on('tool(itemList)', function(obj) {
		var layEvent = obj.event,
			data = obj.data;
		if(layEvent === 'edit') { //编辑
			editItem(data.id);
		} else if(layEvent === 'detail') { //详情
			showItem(data);
		} else if(layEvent === 'del') { //删除
			layer.confirm('确定删除此信息？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
				delStructuredata(data.id, index);
			});
		}
	});
	
	//删除关系
	function delStructuredata(id, index) {
		var param = {};
		param.action_flag = "w_delete";
		param.sub_flag = "object";
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