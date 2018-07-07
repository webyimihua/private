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
		getStationlist();
	function getStationlist() {
		var param = {};
		param.action_flag = "w_query";
		param.sub_flag = "bureau";
		param.isFlur = false;
		param.isReserve = false;
		param.isDivide = false;
		param.hasForeign = false;
		tools.sendRequest(net.SystemServlet, param, function(data) {
//			var  data = JSON.stringify(data);
//			console.log(data)
			console.log(data)
//			var  newdata = {"bureau":[{"id": "1", "name": "西安铁路局"}]};
//			
//			console.log(newdata)
//			console.log(newdata.bureau)
//			console.log(data.bureau);
			//列表
			var tableIns = table.render({
				elem: '#itemListtable',
				url: '..',
				data: data,
				cellMinWidth: 95,
				page: true,
				height: "full-125",
				limits: [10, 15, 20, 25],
				limit: 5,
				id: "itemListtable",
//				cols: [
//					[{
//							type: "checkbox",
//							fixed: "left",
//							width: 50
//						},
//						{
//							field: 'userName',
//							title: '铁路局',
//							minWidth: 280,
//							align: "center"
//						},
//						{
//							title: '操作',
//							minWidth: 175,
//							templet: '#handleListBar',
//							fixed: "right",
//							align: "center"
//						}
//					]
//				]
				cols: [
					[{
							type: "checkbox",
							fixed: "left",
							width: 50
						},
						{
							field: 'id',
							title: '铁路局',
							minWidth: 280,
							align: "center"
						},
						{
							field: 'name',
							title: '铁路局',
							minWidth: 280,
							align: "center"
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
		});
	};
	//搜索【此功能需要后台配合，所以暂时没有动态效果演示】
	$(".search_btn").on("click", function() {
		if($(".searchVal").val() != '') {
			table.reload("newsListTable", {
				page: {
					curr: 1 //重新从第 1 页开始
				},
				where: {
					key: $(".searchVal").val() //搜索的关键字
				}
			})
		} else {
			layer.msg("请输入搜索的内容");
		}
	});
	//添加构筑物
	function addItem() {
		var index = layui.layer.open({
			title: "新增铁路局",
			type: 2,
			content: "add.html",
			success: function(layero, index) {
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
	function editItem(data) {
		var index = layui.layer.open({
			title: "编辑铁路局",
			type: 2,
			content: "edit.html",
			success: function(layero, index) {
				var body = layui.layer.getChildFrame('body', index);
				if(data) {
					body.find(".userEmail").val(data.userEmail); //邮箱
					body.find(".userSex input[value=" + data.userSex + "]").prop("checked", "checked"); //性别                    
					form.render();
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
			editItem(data);
		} else if(layEvent === 'detail') { //详情
			showItem(data);
		} else if(layEvent === 'del') { //删除
			layer.confirm('确定删除此信息？', {
				icon: 3,
				title: '提示信息'
			}, function(index) {
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