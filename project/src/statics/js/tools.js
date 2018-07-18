//公共模块
var net = {
	baseurl: "http://47.95.13.55:8080",
	ObjectServlet: "StructureMonitoring/ObjectServlet",
	SystemServlet: "StructureMonitoring/SystemServlet",
	LoginServlet: "StructureMonitoring/LoginServlet",
	MessageServlet:"StructureMonitoring/MessageServlet",
	DataServlet:"StructureMonitoring/DataServlet",
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
				var str = "";
				for(var i = 0; i < data.length; i++) {
					str += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
				}
				$(div).append(str);
				if(typeof callback == 'function'){					
					callback();
				}
			},
			//根据name覆盖老数据修改、详情使用(不适合多选、单选)
			setOlddataToform: function(div, data,callback){
				console.log(data)
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
						form.render;
					});
				}
				if(typeof callback == 'function'){					
					callback();
				}
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
			//查询铁路局
			getAllstation:function(div){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "bureau";
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						} else {
							layer.msg("请先新增铁路局数据");
						};
					}
				})
			},
			//查询所有的铁路线路
			getAllLine:function(div){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "railway_line";
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						} else {
							layer.msg("请先新增铁路线路数据");
						};
					}
				})
			},
			//查询所有的监测类型
			getAllWatchtype:function(div){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "object_type";
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						} else {
							layer.msg("请先新增检测类型");
						};
					}
				})
			},
			//查询当前用户所有的构筑域
			getThatstructure:function(div,id){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "object";
				param.userId = id;
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						}
					}
				})
			},
			//查询所有的监测维度
			getWatchdimension:function(div){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "dimension";
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						}
					}
				})
			},
//			//查询构筑域类型
			getAllfileType:function(div){
				var param = {};
				param.action_flag = "w_show_option";
				param.sub_flag = "domain_type";
				tools.sendRequest(net.ObjectServlet, param, function(res) {
					if(res.result == 1) {
						var data = res.data;
						if(data.length > 0) {
							tools.initOptionitem(div,data,function(){
								form.render('select');
							});					
						}
					}
				})
			},
			
			
		};
	exports("tools", Tools);
});