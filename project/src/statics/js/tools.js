//公共模块
var net = {
	baseurl: "http://47.95.13.55:8080/",
	SystemServlet: "StructureMonitoring/SystemServlet",
};
layui.define(["form", "element", "layer", "jquery"], function(exports) {
	var form = layui.form,
		element = layui.element;
	layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		Tools = {
			//处理数据发送
			sendRequest: function(_service, body, callback, loadType) {
				var actionStr = net.baseurl + "/" + _service;
				$.ajax({
					url: actionStr,
					type: 'post',
					data: body,
					success: function(data) {
						//返回包判断
						if(data != null && data != undefined) {
							callback(data)
						} else {
							return;
						}
					},
					error: function(data) {
						console.log(data)
					},
					statusCode: {
						500: function() {
							removeLoading(loadType);
							layer.msg('服务器连接失败');
						}
					},
					beforeSend: function() {
						if(loadType) {
							addLoading(loadType);
						}
					},
					complete: function() {
						if(loadType) {
							removeLoading(loadType);
						}
					},
				});

			},
			addLoading: function(loadType) {
				if(loadType) {
					layer.load(2);
				}
			},
			removeLoading: function(loadType) {
				if(loadType) {
					layer.closeAll('loading');
				}
			},
			//根据id获取form表单数据返回json

		};
	exports("tools", Tools);
});