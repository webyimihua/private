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
          // $("#pointData2").val(getHisSelTime(value,15))
       }
	});
  laydate.render({
     elem: '#pointData2'
      ,max: 0
      ,done: function(value, date){
          // $("#pointData2").val(getHisSelTime(value,15))
       }
  });
    
	
})

$(function(){
    $("#pointData2").val(getNowFormatDate());
    $("#pointData1").val(getHistoryData(30));
    setTimeout(function(){
        if($("#pointTypes").val()){
              $(".search_btns").attr("id","searchTemData");
              getTemperatureData(getNowFormatDate(),getHistoryData(30))
        }else{
            $("#temperature_box").html("暂时没有数据！！！")
        }
    },200)
    
    $("#searchTemData").click(function(){
         var endTime = $("#pointData2").val();
         var startTime = $("#pointData1").val();
         if(startTime != '' && endTime != ''){
            if(startTime <= endTime){
              getTemperatureData(endTime,startTime);
            }else{
              layer.msg('开始日期不能大于结束日期');
            }
         }else{
            layer.msg('请选择开始日期！');
         }
         
    })
})

 var indexclose = null;
function getTemperatureData(endTime,startTime){
	var endDate = endTime;
	var startDate = startTime;
	var sub_flag = "temperature";
	 if($("#pointTyp").val() == 1){
      	sub_flag = "temperature";
      }else if($("#pointTyp").val() == 2){
      	sub_flag = "humidity";
      }else if($("#pointTyp").val() == 3){
      	sub_flag = "pressure";
      }else if($("#pointTyp").val() == 4){
      	sub_flag = "settlement";
      }else if($("#pointTyp").val() == 5){
      	sub_flag = "horizontalShift";
      }else if($("#pointTyp").val() == 6){
      	sub_flag = "relative";
      }else if($("#pointTyp").val() == 7){
      	sub_flag = "gesture";
      }else if($("#pointTyp").val() == 8){
      	sub_flag = "wind";
      }
      indexclose = layer.load(2, {time:10*1000});
	$.post('http://47.95.13.55:8080/StructureMonitoring/DataServlet',{
      action_flag:"w_get_data",
      sub_flag:sub_flag,
      unitId:$("#pointIds").val(),
      startDate:startDate,
      endDate:endDate,
   },function(res,indexclose){
   	  var data = JSON.parse(res);
   	 if(!data.data[0].data){
   	 	 $("#temperature_box").html("没有数据！！！")
   	 	 return ;
   	 }
   	 var tar = data.data;
   	 for(var i=0; i<tar.length; i++){
   	 	  var obj = tar[i].data;
	   	  var temperature = new Array;
	   	  var temperatureForDay = new Array;
	   	  var temperatureForWeek = new Array;
	   	  var temperatureForMonth = new Array;
	   	  var tit = new Array;
	   	  var time = new Array;
	   	  tit.push(tar[i].chartName)
	   	  tit.push(tar[i].forDayName)
	   	  tit.push(tar[i].forWeekName)
	   	  tit.push(tar[i].forMonthName)
	   	  for(var j in obj){
	   	  	time.push(obj[j].time);
	   	  	temperature.push(obj[j].base);
	   	  	temperatureForDay.push(obj[j].forDay);
	   	  	temperatureForWeek.push(obj[j].forWeek);
	   	  	temperatureForMonth.push(obj[j].forMonth)
	   	  }
	   	  drawTemperaturLine(time,temperature,temperatureForDay,temperatureForWeek,temperatureForMonth,tit,i)
   	 }
   	  
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
function drawTemperaturLine(time,temperature,temperatureForDay,temperatureForWeek,temperatureForMonth,tit,nums){
	layer.close(indexclose);  
	var dom = document.getElementById("temperature_box"+nums+"");
	$(dom).show();
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        title: {
            text: '',
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data:[tit[0],tit[1],tit[2],tit[3]]
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
                       var axisData = opt.xAxis[0].data; //坐标数据
                       var series = opt.series; //折线图数据
                       var tdHeads = '<td  style="padding: 0 10px">时间</td>'; //表头第一列
                        var tdBodys = ''; //表数据
                        //组装表头
                        var nameData = new Array(tit[0], tit[1], tit[2], tit[3]);
                        for (var i = 0; i < nameData.length; i++) {
                            tdHeads += '<td style="padding: 0 10px">' + nameData[i] + '</td>';
                        }
                        var table = '<table id="tableExcel_Day" border="1" class="table-bordered table-striped" style="width:100%;text-align:center" ><tbody><tr>' + tdHeads + ' </tr>';
                        //组装表数据
                        for (var i = 0; i < axisData.length; i++) {
                            for (var j = 0; j < series.length ; j++) {                          
                                var temp = series[j].data[i];
                                if (temp != null && temp != undefined) {
                                    tdBodys += '<td>' + temp.toFixed(10) + '</td>';      
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
                name:tit[0],
                type:'line',
                data:temperature
            },
            {
                name:tit[1],
                type:'line',
                data:temperatureForDay
            },
            {
                name:tit[2],
                type:'line',
                data:temperatureForWeek
            },
             {
                name:tit[3],
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
        filename: "表" + new Date().toISOString().replace(/[\-\:\.]/g, ""),
        exclude_img: true,
        exclude_links: true,
        exclude_inputs: true
    });
}