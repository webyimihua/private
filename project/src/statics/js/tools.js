//公共模块
var net = {
	baseurl: "http://47.95.13.55:8080",
	SystemServlet: "StructureMonitoring/SystemServlet",
	LoginServlet: "StructureMonitoring/LoginServlet",
	MessageServlet: "StructureMonitoring/MessageServlet"
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
						if(data != null && data != undefined && data) {
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
			initOptionitem: function(div,data,callback) {
//				$(div).empty();
				var str = "";
				for(var i = 0; i < data.length; i++) {
					str += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
				}
				$(div).append(str);
				callback();
			},
			//根据name覆盖老数据修改、详情使用(不适合多选、单选)
			setOlddataToform: function(div, data,callback) {
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
				callback();
			},
			//根据formid,name处理对应数据为json
			getFormallData: function(div) {
				var that = $(div);
				var obj = new Object();
				$.each(that.serializeArray(), function(index, param) {
					if(!(param.name in obj)) {
						if(param.value) {
							obj[param.name] = param.value;
						}
					}
				});
				return obj;
			},
			//根据localStorage查找用户信息
			getUsermessage:function(name){
				var messStr = localStorage.getItem('login');
				if(messStr){
					var mess = JSON.parse(messStr);
					var oval="";
					for(k in mess){
						if(k == name){
							oval=mess[k];
						}
					}
					return oval;
				}
			},
			//
		};
	exports("tools", Tools);
});