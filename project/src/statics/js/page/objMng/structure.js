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
	//查找构筑物列表
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
			sub_flag: "object",
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
			$("[data-field='bureauId']").css('display', 'none');
			$("[data-field='railway_lineId']").css('display', 'none');
			$("[data-field='object_typeId']").css('display', 'none');
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
					title: '序号',
					width: "",
					align: "center",
				},
				{
					field: 'name',
					title: '构筑物名称',
					minWidth: 180,
					align: "center"
				},
				{
					field: 'bureauId',
					title: '所属铁路局',
					width: "",
					align: 'center'
				},
				{
					field: 'bureauname',
					title: '所属铁路局',
					minWidth: 200,
					align: 'center'
				},
				{
					field: 'railway_lineId',
					title: '所属铁路局线路',
					width: "",
					align: 'center'
				},
				{
					field: 'railway_linename',
					title: '所属铁路局线路',
					align: 'center'
				},
				{
					field: 'startMileage',
					title: '起始里程',
					minWidth: 120,
					align: 'center'
				},
				{
					field: 'endMileage',
					title: '结束里程',
					minWidth: 120,
					align: 'center'
				},
				{
					field: 'direction',
					title: '行别',
					align: 'center'
				},
				{
					field: 'object_typeId',
					title: '监测体类型',
					align: 'center',					
				},
				{
					field: 'object_typename',
					title: '监测体类型',
					align: 'center',
					minWidth: 150
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
			title: "添加构筑物",
			type: 2,
			content: "addStructure.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				setTimeout(function() {
					layui.layer.tips('点击此处返回构筑物列表', '.layui-layer-setwin .layui-layer-close', {
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
	//修改构筑物
	function editItem(id) {
		var index = layui.layer.open({
			title: "编辑构筑物",
			type: 2,
			content: "editStructure.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				body.find("#editId").val(id);
				setTimeout(function() {						
				layui.layer.tips('点击此处返回构筑物列表', '.layui-layer-setwin .layui-layer-close', {
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
	//查看构筑物详情
	function showItem(data) {
		var index = layui.layer.open({
			title: "构筑物详情",
			type: 2,
			content: "detailStructure.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				var showForm = body.find("#showDataform");
				if(data) {
					tools.setOlddataToform(showForm, data);
				}
				setTimeout(function() {
					layui.layer.tips('点击此处返回构筑物列表', '.layui-layer-setwin .layui-layer-close', {
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
	
	//删除构筑物
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