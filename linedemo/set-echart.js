//定制折线图
function setLinechart() {
	var chartname = "";
};
setLinechart.prototype = {
	_initEchart: function(div) {
		chartname = echarts.init(document.getElementById(div));
		return chartname;
	},
	_setOption: function(data) {
		var defaults = {
			//标题副标题
			title: {
				text: '',
				subtext: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				//横坐标数据
				data: ''
			}],
			yAxis: [{
				type: 'value',
				axisLabel: {
					formatter: '{value}'
				}
			}],
			series: []
		};
		//data 参数 titiles：标题对象，namearr：X数据数组
		//处理data数据，并修改defaults 数据
		defaults.title.text = data.titiles.text;
		defaults.title.subtext = data.titiles.subtext;
		defaults.xAxis[0].data = data.namearr;

		function nption() {
			return {
				name: '',
				type: 'line',
				data: '',
				//					markPoint: {
				//					data: [{
				//							type: 'max',
				//							name: '最大值'
				//						},
				//						{
				//							type: 'min',
				//							name: '最小值'
				//						}
				//						]
				//					},
				//					markLine: {
				//						data: [{
				//							type: 'average',
				//							name: '平均值'
				//						}]
				//					}
			};
		}
		console.log(data.valuearr.length)
		for(var i = 0; i < data.valuearr.length; i++) {
			var item = new nption;
			//根据返回数据新增数据对象
			defaults.series.push(item);
			defaults.series[i].name = data.titiles.name[i];
			defaults.series[i].data = data.valuearr[i];
		}
		chartname.setOption(defaults);
	}
}
/*给div绑定图表,加载数据
 *参数 div obj 
 *参数 titile = {text: '测试标题',subtext: '纯属虚构',name: '访问来源'} 如果返回数据多条 name为多个
 *参数 result json [{value: 335,name:'直接访问'},{value: 310,name:'邮件营销'}] 
 * 只适合多条数据
 * */
function setDatalineEchart(div, title, result) {
	var oprate = new setLinechart();
	oprate._initEchart(div);
	var data = {};
	data.titiles = title;
	var leng = Object.keys(result).length;
	var names = [];
	var values = [];
	var value1 = [];
	var value2 = [];
	var value3 = [];
	var value4 = [];
	//处理数据		
	for(var i = 0; i < leng; i++) {
		names.push(result[i].name);
		value1.push(result[i].value1);
		value2.push(result[i].value2);
		value3.push(result[i].value3);
		value4.push(result[i].value4);
	}
	values.push(value1, value2, value3, value4);
	data.namearr = names;
	data.valuearr = values;
	oprate._setOption(data);
}
//测试传递参数使用
$(function() {
	var titile = {
		text: '1111145444',
		subtext: '123222212',
		name: ['斜角1', '斜角2', '斜角3', '斜角4'],
	};
	var data3 = [{
			value1: 135,
			value2: 225,
			value3: 265,
			value4: 365,
			name: '7-01'
		},
		{
			value1: 110,
			value2: 210,
			value3: 310,
			value4: 210,
			name: '7-02'
		},
		{
			value1: 123,
			value2: 225,
			value3: 235,
			value4: 124,
			name: '7-03'
		},
		{
			value1: 110,
			value2: 139,
			value3: 158,
			value4: 269,
			name: '7-04'
		},
		{
			value1: 134,
			value2: 234,
			value3: 226,
			value4: 284,
			name: '7-05'
		}
	];
	setDatalineEchart('main2', titile, data3)
})