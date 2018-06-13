var pageSize=30;
var map
var  findcustomer={};
var addrasConfig={
	"lat":0,
    "lng":0,
    "level":10,
}
$(function(){
	//添加动态导航
    addNavMenu('#NavMensSelect',1);
	addrasLngLat($.cookie("yfhCityName"));
	$(window).bind("load resize scroll", function() {
		baseitmsset();
	});	
	findPriceSelect();
	$(".map_btn").click(function(){
		var val = $(".map_input").val();
		findcustomer['search'] = val;
		findMapHoustList(1,findcustomer);
	})
	$("#back_homes").click(function(){
		location.href='index.html?cityCode='+$.cookie("yfhCityCode")+''
	})
	var cityNamep = $.cookie('yfhCityName');
	$("title").html(""+cityNamep+"地图找二手房_"+cityNamep+"房产网-"+cityNamep+"优房汇-中国房地产的天猫");
//	findCollectionData();
})

function baseitmsset(){
	winHeight=$(window).height();
	$('.list_contai_box').height(winHeight - 183)
}
//地址解析
function addrasLngLat(addras){
	var myGeo = new BMap.Geocoder();
	myGeo.getPoint(addras, function(point){
		if(point){
			addrasConfig.lng=point.lng;
		    addrasConfig.lat=point.lat;
		    mapInt(addrasConfig);
		    findMapHoustList(1,findcustomer);
		}
	})
}

//地图初始化
function mapInt(){
	map = new BMap.Map("yfh_map",{minZoom:10,maxZoom:18,enableMapClick: false});// 创建Map实例
	var point = new BMap.Point(addrasConfig.lng, addrasConfig.lat);    // 创建点坐标
	map.centerAndZoom(point,10);                     // 初始化地图,设置中心点坐标和地图级别。
	map.enableScrollWheelZoom();   //启用滚轮放大缩小
	map.disableDoubleClickZoom() 
	//map.panTo(new BMap.Point(108.75000,34.36667));       //做项目时点击的区域地图要移动时的中心坐标点
	//右下角添加控件和比例尺
	var bottom_right_control=new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT});
	var bottom_right_navigation=new BMap.NavigationControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,type:BMAP_NAVIGATION_CONTROL_ZOOM});
	//添加控件和比例尺
	map.addControl(bottom_right_control);
	map.addControl(bottom_right_navigation);
	
	/*鼠标缩放事件*/
	 map.addEventListener("zoomend", function(){
	 	addrasConfig.level=this.getZoom()
	    if(this.getZoom()>=16){
	    	map.clearOverlays();
			findMapHoustList(1,findcustomer);
		}else if(this.getZoom()>=14){
			map.clearOverlays();
			findMapHoustList(1,findcustomer);
		}else if(this.getZoom()<=12){
			map.clearOverlays();	
			findMapHoustList(1,findcustomer);
		}

	});
	
	/** 地图移动事件 */
	map.addEventListener("dragend", function(){
	 	findMapHoustList(1,findcustomer);
	});

}

//1、定义构造函数并继承Overlay
//定义自定义覆盖物的构造函数  
	function SquareOverlay(center,length,html,lng,lat){
			this._center=center;
			this._length=length;
			this._html=html;
			this._lng=lng;
			this._lat=lat;
	}

 // 继承API的BMap.Overlay  
    SquareOverlay.prototype = new BMap.Overlay();

//2、初始化自定义覆盖物
   //实现初始化方法
	SquareOverlay.prototype.initialize=function(map){
		this._map=map;
		var div=document.createElement("div");
		div.className="labelBubble";
		div.style.position="absolute";
		div.innerHTML=this._html;
		map.getPanes().markerPane.appendChild(div);
		this._div=div;
		return div;
	}
	

    //3、绘制覆盖物
    // 实现绘制方法  
    SquareOverlay.prototype.draw = function () {
        // 根据地理坐标转换为像素坐标，并设置给容器 
          var position = this._map.pointToOverlayPixel(this._center);
          this._div.style.left = position.x - this._length / 2 + "px";
          this._div.style.top = position.y - this._length / 2 + "px";       
    }

    //4、显示和隐藏覆盖物
    // 实现显示方法  
    SquareOverlay.prototype.show = function () {
        if (this._div) {
            this._div.style.display = "";
        }
    }
    // 实现隐藏方法  
    SquareOverlay.prototype.hide = function () {
        if (this._div) {
            this._div.style.display = "none";
        }
    }

    //6、自定义覆盖物添加事件方法
    SquareOverlay.prototype.addEventListener = function (event, fun) {
        this._div['on' + event] = fun;
    }

	//添加覆盖物
	function firstMap(arry){
		map.clearOverlays();		
		var arr=arry || [];
		//添加覆盖物
		for(var i=0;i<arr.length;i++){
			var arrdate=arr[i];
			if(arr[i].count){
				(function(){
					var name=arrdate.countryName;
					var total=arrdate.count;
					var lng=arrdate.longitude;
					var lat=arrdate.latitude;
					var html="<div class='overlays1 bubble' lng='"+arrdate.longitude+"' lat='"+arrdate.latitude+"' countryCode='"+arrdate.countryCode+"'><p class='pName'>"+name+"</p><p class='pTotal'><span>"+total+"</span>套</p></div>";
					var point=new BMap.Point(lng,lat);
					var mySquare=new SquareOverlay(point,90,html,lng,lat);
					map.addOverlay(mySquare);
					mySquare.addEventListener("click",function(){
						var lng = $(this).find(".bubble").attr("lng");
						var lat = $(this).find(".bubble").attr("lat");
						//点击改变缩放级别
						map.panTo(new BMap.Point(lng,lat));  
						map.setZoom(16);
					});
				})();
			}
		}
	};
	function secondMap(arry){
		map.clearOverlays();		
		var arr=arry || [];
		for(var i=0;i<arr.length;i++){
			var arrdate=arr[i];
			if(arr[i].count){
				(function(){
					var name=arrdate.buildingName;
					var buildingId=arrdate.buildingId;
					var total=arrdate.count;
					var lng=arrdate.longitude;
					var lat=arrdate.latitude;
					var html="<div class='overlays3 bubble' buildingId='"+arrdate.buildingId+"' lng='"+arrdate.longitude+"' lat='"+arrdate.latitude+"' countryCode='"+arrdate.countryCode+"'><p class='pName'>"+name+"</p><p class='pTotal'><span>"+total+"</span>套</p></div>";
					var point=new BMap.Point(lng,lat);
					var mySquare=new SquareOverlay(point,90,html,lng,lat);
					map.addOverlay(mySquare);
					mySquare.addEventListener("click",function(){
//						var lng = $(this).find(".bubble").attr("lng");
//						var lat = $(this).find(".bubble").attr("lat");
//						map.panTo(new BMap.Point(lng,lat))
                         var buildingName = $(this).find('.pName').text();
                         var buildingId = $(this).find(".bubble").attr("buildingId");
                        findBuildingHoude(1,buildingId,buildingName);
					});
				})();
			}
		}
	}

function houseLists(data){
	var str='';
	for(var i  in data){
		str+='<div class="list cf">';
		    str+='<ul class="base_mess_box">';
		    	str+='<li class="img_box">';
		    	   str+='<a target="_blank" href="secondHouse/agent_detail.html?id='+data[i].houseId+'&companyId='+data[i].companyId+'" alt="图片"><img src='+data[i].image+' alt="" /></a>';
		    	str+='</li>';
		    	str+='<li class="base_text">';
		    		str+='<div class="title">'+data[i].title+'</div>';
		    		str+='<div class="list_items">'+data[i].houseType+'<span class="diver">/</span>'+data[i].buildingArea+'平米<span class="diver">/</span>'+data[i].toward+'</div>';
		    		str+='<div class="list_items">'+data[i].countyCode+'<span class="diver">/</span>'+data[i].buildingName+'</div>';
		    	str+='</li>';
		    	str+='<span class="prices_box">'+data[i].totalPrice+'&nbsp;万</span>'
		    str+='</ul>';
		str+='</div>';
	};
	$("#list_contai").html(str);
}
function buildinghouseLists(data,buildingName){
	var str='';
	    str+='<div class="building_title">'+buildingName+'</div>'
	for(var i  in data){
		str+='<div class="list cf">';
		    str+='<ul class="base_mess_box">';
		    	str+='<li class="img_box">';
		    	   str+='<a target="_blank" href="secondHouse/agent_detail.html?id='+data[i].houseId+'&companyId='+data[i].companyId+'" alt="图片"><img src='+data[i].image+' alt="" /></a>';
		    	str+='</li>';
		    	str+='<li class="base_text">';
		    		str+='<div class="title">'+data[i].title+'</div>';
		    		str+='<div class="list_items">'+data[i].houseType+'<span class="diver">/</span>'+data[i].buildingArea+'平米<span class="diver">/</span>'+data[i].toward+'</div>';
		    		str+='<div class="list_items">'+data[i].countyCode+'<span class="diver">/</span>'+data[i].buildingName+'</div>';
		    	str+='</li>';
		    	str+='<span class="prices_box">'+data[i].totalPrice+'&nbsp;万</span>'
		    str+='</ul>';
		str+='</div>';
	};
	$("#list_contai").html(str);
}

/****************获取价格筛选**************/
function findPriceSelect(){
	var params = {};
	params.cityCode = $.cookie('yfhCityCode');
	net.sendRequest(92003, net.servicesBusiness, params, function(data,flag){
		if(flag){
		   var data = data.price;
		   var str='<li onclick="selParm._prices(this)" data-price=" , " class="item clicked">不限</li>';
		   for(var i in data){
				str+='<li onclick="selParm._prices(this)" class="item" data-price="'+i+'">'+data[i]+'</li>';
			}
		   $("#areaPrices").html(str);
		}
	}, false,1,false);
}

/*************房源列表与服务器数据交互*********/
function findMapHoustList(currentPage,findcustomer,isnum,istrue){
	$('body').append('<span class="map_loading"><img src="images/common/loading41.gif">努力加载中...</span>')
	$(".top_box").html('<span class="list_loading"><img src="images/common/loading41.gif">加载中...</span>');
	$("#pages").html('');
	var viewBounds=map.getBounds();
 	var bssw=viewBounds.getSouthWest();
 	var bsne=viewBounds.getNorthEast();
 	var longitude1=bssw.lng;
 	var latitude1=bssw.lat;
 	var longitude2=bsne.lng;
 	var latitude2=bsne.lat;
	var params={}
	params.pageSize = pageSize;
	params.currentPage = currentPage;
	params.cityCode = $.cookie("yfhCityCode");
	params.transactionType = 100701;
	params.ascription = 100502;
	params.level = addrasConfig.level;
	params.latitude1 = latitude1;
	params.latitude2 = latitude2;
	params.longitude1 = longitude1;
	params.longitude2 = longitude2;
	params.minArea = findcustomer.minArea;
	params.maxArea = findcustomer.maxArea;
	params.houseType = findcustomer.houseType;
	params.minPrice = findcustomer.minPrice;
	params.maxPrice = findcustomer.maxPrice;
	params.search = findcustomer.search;
	yfh.net.sendRequest(92002,yfh.net.servicesBusiness,params,function(data,flag){
		if(flag){
			$(".map_loading").remove();
			var total=data.total;
			$(".top_box").html('共为您找到<span class="house_num">'+total+'</span>套房源');
			if(total){
				var maplist = data.mapdata;
				houseLists(data.housedata);
	            $("#pages").html(page.Get(data.total,data.currentPage,pageSize));
	            //百度地图的层级变化
	            if(addrasConfig.level >= 14){
	            	secondMap(maplist)
	            }else if(addrasConfig.level < 14){
	            	firstMap(maplist);
	            }
			}else{
				$(".top_box").html('<span class="list_loading">暂无数据</span>');
				$("#list_contai").html('<div class="zwdata">呣..没有找到相关内容~</div>');
				map.clearOverlays();
			}
			
		}
	 },false,isnum,istrue);
}

function findBuildingHoude(currentPage,buildingId,buildingName){
	$(".top_box").html('<span class="list_loading"><img src="images/common/loading41.gif">加载中...</span>');
	$("#pages").html('');
	var params={}
	params.pageSize = pageSize;
	params.currentPage = currentPage;
	params.cityCode = 620600;
	params.transactionType = 100701;
	params.ascription = 100502;
	params.level = addrasConfig.level;
	params.buildingId = buildingId;
	yfh.net.sendRequest(92002,yfh.net.servicesBusiness,params,function(data,flag){
		if(flag){
			var total=data.total;
			$(".top_box").html('共为您找到<span class="house_num">'+total+'</span>套房源');
			buildinghouseLists(data.housedata,buildingName);
		}
	 });
}

//查询部分筛选
function searchParms(){};
searchParms.prototype = {
	_space: function (el){
		var priceSting = $(el).attr("dataArea");
		var priceArr = priceSting.split(",");
		var minArea = priceArr[0];
		var maxArea = priceArr[1];
		findcustomer['minArea'] = minArea;
		findcustomer['maxArea'] = maxArea;
		$(el).addClass("clicked").siblings().removeClass("clicked");
		if($(el).text()!="不限"){
			$(el).parent().siblings("span").html($(el).text());
		}else{
			$(el).parent().siblings("span").html('面积');
		};
		findMapHoustList(1,findcustomer)
	},
	_houseType: function(el){
		findcustomer['houseType'] = $(el).attr("houseType");
		$(el).addClass("clicked").siblings().removeClass("clicked");
		if($(el).text()!="不限"){
			$(el).parent().siblings("span").html($(el).text());
		}else{
			$(el).parent().siblings("span").html('户型');
		};
		findMapHoustList(1,findcustomer)
	},
	_prices: function(el){
		var priceSting = $(el).attr("data-price");
		var priceArr = priceSting.split(",");
		var minPrice = priceArr[0];
		var maxPrice = priceArr[1];
		findcustomer['minPrice'] = minPrice;
		findcustomer['maxPrice'] = maxPrice;
		$(el).addClass("clicked").siblings().removeClass("clicked");
		if($(el).text()!="不限"){
			$(el).parent().siblings("span").html($(el).text());
		}else{
			$(el).parent().siblings("span").html('售价');
		};
		findMapHoustList(1,findcustomer)
	}
	
}
var selParm=new searchParms();
