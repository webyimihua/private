var $ ;
layui.use(['element','layer','jquery','laydate'],function(){
	$ = layui.$;
	var laydate = layui.laydate;
	$(".close_point_btn").click(function(){
    	var index = parent.layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layui.layer.close(index);
    })

    $(function(){
    	laydate.render({
		  elem: '#pointData'
		  ,range: true
		});
    })
    
	
})

$(function(){
	$(".detail-line-box").height($(window).height() - 60);
	getTemperatureData()
	    
})


function getTemperatureData(){
	$.post('http://47.95.13.55:8080/StructureMonitoring/DataServlet',{
      action_flag:"w_get_data",
      sub_flag:"temperature",
      unitId:"001-00001-02-16",
      startDate:"2018-4-21",
      endDate:"2018-5-21",
    },function(res){
   	  var data = JSON.parse(res);
   	  var obj = data.data[0].data;
   	  var temperature = new Array;
   	  var temperatureForDay = new Array;
   	  var temperatureForWeek = new Array;
   	  var temperatureForMonth = new Array;
   	  var time = new Array;
   	  for(var i in obj){
   	  	time.push(obj[i].time);
   	  	temperature.push(obj[i].temperature);
   	  	temperatureForDay.push(obj[i].temperatureForDay);
   	  	temperatureForWeek.push(obj[i].temperatureForWeek);
   	  	temperatureForMonth.push(obj[i].temperatureForMonth)
   	  }
   	  drawTemperaturLine(time,temperature,temperatureForDay,temperatureForWeek,temperatureForMonth)
    })
}


// 绘制折线图
function drawTemperaturLine(time,temperature,temperatureForDay,temperatureForWeek,temperatureForMonth){
	var dom = document.getElementById("container");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: '温度监测',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:['温度','日均温度','周均温度','月均温度']
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
            }
        },
        xAxis:  {
            type: 'category',
            boundaryGap: false,
            data: time
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [
            {
                name:'温度',
                type:'line',
                data:temperature,
                itemStyle : {  
                    normal : {  
                        lineStyle:{  
                            color:'#ff6600'  
                        }  
                    }  
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'日均温度',
                type:'line',
                data:temperatureForDay,
                itemStyle : {  
                    normal : {  
                        lineStyle:{  
                            color:'#333333'  
                        }  
                    }  
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'周均温度',
                type:'line',
                data:temperatureForWeek,
                itemStyle : {  
                    normal : {  
                        lineStyle:{  
                            color:'green'  
                        }  
                    }  
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
             {
                name:'月均温度',
                type:'line',
                data:temperatureForMonth,
                itemStyle : {  
                    normal : {  
                        lineStyle:{  
                            color:'blue'  
                        }  
                    }  
                },
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}