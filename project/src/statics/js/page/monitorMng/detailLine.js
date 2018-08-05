var $ ;
layui.use(['element','layer','jquery','laydate'],function(){
	$ = layui.$;
	var laydate = layui.laydate;
	$(".close_point_btn").click(function(){
    	var index = parent.layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layui.layer.close(index);
    })

	laydate.render({
	   elem: '#pointData1'
      ,max: 0
      ,done: function(value, date){
          $("#pointData2").val(getHisSelTime(value,15))
       }
	});
    
	
})

$(function(){
	$(".detail-line-box").height($(window).height() - 60);
	getTemperatureData(getNowFormatDate(),getHistoryData(15))
    $("#searchTemData").click(function(){
         var endTime = $("#pointData2").val();
         var startTime = $("#pointData1").val();
         if(startTime != ''){
            getTemperatureData(endTime,startTime);
         }else{
            layer.msg('请选择开始日期！');
         }
         
    })
})


function getTemperatureData(endTime,startTime){
	var endDate = endTime;
	var startDate = startTime;
	$.post('http://47.95.13.55:8080/StructureMonitoring/DataServlet',{
      action_flag:"w_get_data",
      sub_flag:"temperature",
      unitId:"001-00001-02-16",
      startDate:startDate,
      endDate:endDate,
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

// 判断时间选择器
function getHisSelTime(time,days){
    var nowdata = new Date();
    var date = new Date(time);
    date.setDate(date.getDate() + days);
    if(date  >= nowdata){
        date = nowdata;
    }
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var getHisTime = year + seperator1 + month + seperator1 + strDate;
    return getHisTime; 
}

// 获取当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

// 日期往前推30天
function getHistoryData(days){
	var date = new Date();
	date.setDate(date.getDate()- days);  
	var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var historudate = year + seperator1 + month + seperator1 + strDate;
    return historudate;
}


// 绘制折线图
function drawTemperaturLine(time,temperature,temperatureForDay,temperatureForWeek,temperatureForMonth){
	var dom = document.getElementById("tem_container");
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
            // show: true,
            feature: {
                // dataZoom: {
                //     yAxisIndex: 'none'
                // },
                dataView: {
                    show: true,
                    title: '数据视图',
                    // readOnly:true,
                    lang: ['数据视图', '关闭', '导出Excel'],
                    contentToOption: function (opts) {
                        drawExcelData()
                        return false;
                    },
                    optionToContent: function (opt) {
                       // console.log(opt);
                       var axisData = opt.xAxis[0].data; //坐标数据
                       var series = opt.series; //折线图数据
                       var tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头第一列
                        var tdBodys = ''; //表数据
                        //组装表头
                        var nameData = new Array('温度', '日均温度', '周均温度', '月均温度');
                        for (var i = 0; i < nameData.length; i++) {
                            tdHeads += '<td style="padding: 0 10px">' + nameData[i] + '</td>';
                        }
                        var table = '<table id="tableExcel_Day" border="1" class="table-bordered table-striped" style="width:100%;text-align:center" ><tbody><tr>' + tdHeads + ' </tr>';
                        //组装表数据
                        for (var i = 0; i < axisData.length; i++) {
                            for (var j = 0; j < series.length ; j++) {                          
                                var temp = series[j].data[i];
                                if (temp != null && temp != undefined) {                                     
                                    tdBodys += '<td>' + temp.toFixed(2) + '</td>';      
                                } else {
                                    tdBodys += '<td></td>';
                                }
                            }
                            table += '<tr><td style="padding: 0 10px">' + axisData[i] + '</td>' + tdBodys + '</tr>';
                            tdBodys = '';
                        }
                        table += '</tbody></table>';  
                        return table;
                    }
                },
                // magicType: {type: ['line', 'bar']},
                // dataZoom: { show: true, title: { zoom: '区域缩放', back: '区域缩放还原' } },
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
                data:temperature
            },
            {
                name:'日均温度',
                type:'line',
                data:temperatureForDay
            },
            {
                name:'周均温度',
                type:'line',
                data:temperatureForWeek
            },
             {
                name:'月均温度',
                type:'line',
                data:temperatureForMonth
            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}


function drawExcelData(){
    $("#tableExcel_Day").table2excel({
        exclude: ".noExl",
        name: "Excel Document Name",
        filename: "温度表" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
}