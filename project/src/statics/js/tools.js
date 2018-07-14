//公共模块
var net = {
	baseurl: "http://47.95.13.55:8080/",
	SystemServlet: "StructureMonitoring/SystemServlet",
	LoginServlet: "StructureMonitoring/LoginServlet",
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
							callback(JSON.parse(data))
						} else {
							return;
						}
					},
					error: function(data) {
						console.log(data)
					},
					statusCode: {
						500: function() {
							layer.msg('服务器连接失败');
						}
					}
				});
			},
			//初始化下拉数据
			initOptionitem: function(div, data) {

			},
			//根据name覆盖老数据修改、详情使用(不适合多选、单选)
			setOlddataToform: function(div, data) {
				var key, value, tagName, type;
				for(x in data) {
					key = x;
					value = data[x];
					$(div).find("[name='" + key + "'],[name='" + key + "[]']").each(function() {
						tagName = $(this)[0].tagName;
						type = $(this).attr('type');
						if(tagName == 'INPUT' && type == 'text') {
							$(this).val(value);
						} else if(tagName == 'SELECT' || tagName == 'TEXTAREA') {
							$(this).val(value);
						}
					});
				}
			},
			//
		};
	exports("tools", Tools);
});