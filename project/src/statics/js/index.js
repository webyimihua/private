var $,tab,dataStr,layer;

layui.config({
	base : "js/"
}).extend({
	"bodyTab" : "bodyTab"
})

layui.use(['bodyTab','form','element','layer','jquery'],function(){
	var form = layui.form,
		element = layui.element;
		$ = layui.$;
    	layer = parent.layer === undefined ? layui.layer : top.layer;
		tab = layui.bodyTab({
			openTabNum : "30",  //最大可打开窗口数量
			url : "json/topnav.json" //获取菜单json地址
		});

	 $("#signOut").click(function(){
         localStorage.removeItem('login');
         parent.window.location.href="../page/login/login.html"
     })

    var loginInfo = JSON.parse(sessionStorage.getItem('login'));
    if(!loginInfo){
        parent.window.location.href="../page/login/login.html"
    }else{
        $(".adminName").html(loginInfo.username);
        $(".userName").html(loginInfo.username);
    	var users = [
    	{name:"监测中心",oname:"监测中心",url:"page/main.html",target:"contentManagement",icon:"&#xe629"},
    	{name:"消息中心",oname:"预警消息",url:"page/news/alarm.html",target:"news",icon:"&#xe667;"}
    	]
    	var sbs = [
    	{name:"监测中心",oname:"监测中心",url:"page/main.html",target:"contentManagement",icon:"&#xe629"},
    	{name:"对象管理中心",oname:"构筑物管理",url:"page/objMng/structure/structureList.html",target:"memberCenter",icon:"&#xe653;"},
    	{name:"预警配置中心",oname:"配置预警参数",url:"page/warnSet/warnList.html",target:"memberyujing",icon:"&#xe702;"},
    	{name:"消息中心",oname:"预警消息",url:"page/news/alarm.html",target:"news",icon:"&#xe667;"}
    	]             
    	var sys = [
    	{name:"监测中心",oname:"监测中心",url:"page/main.html",target:"contentManagement",icon:"&#xe629"},
    	{name:"对象管理中心",oname:"构筑物管理",url:"page/objMng/structure/structureList.html",target:"memberCenter",icon:"&#xe653;"},
    	{name:"预警配置中心",oname:"配置预警参数",url:"page/warnSet/warnList.html",target:"memberyujing",icon:"&#xe702;"},
    	{name:"消息中心",oname:"预警消息",url:"page/news/alarm.html",target:"news",icon:"&#xe667;"},
    	{name:"系统设置中心",oname:"账户管理",url:"page/systemSetting/account/memberAccount.html",target:"systemeSttings",icon:"&#xe614;"}
    	]
    	var str = '';
    	if(loginInfo.roleId == 3){
    		for(var i in users){
                    if(i == 0){
                        str+='<li class="layui-nav-item layui-this" data-menu="'+users[i].target+'">';
                    }else{
                        str+='<li class="layui-nav-item" data-menu="'+users[i].target+'">';
                    }
					str+='<a href="javascript:;" data-url="'+users[i].url+'">';
					  str+='<i class="layui-icon" data-icon="'+users[i].icon+'">'+users[i].icon+'</i>';
                      str+='<span>'+users[i].name+'</span>';
					  str+='<cite style="display:none;">'+users[i].oname+'</cite>';
					str+='</a>';
				str+='</li>';
    		}
    		$("#topLevelMenus").html(str);
    	}else if(loginInfo.roleId == 2){
            for(var i in sbs){
    			    if(i == 0){
                        str+='<li class="layui-nav-item layui-this" data-menu="'+sbs[i].target+'">';
                    }else{
                        str+='<li class="layui-nav-item" data-menu="'+sbs[i].target+'">';
                    }
					str+='<a href="javascript:;" data-url="'+sbs[i].url+'">';
					  str+='<i class="layui-icon" data-icon="'+sbs[i].icon+'">'+sbs[i].icon+'</i>';
					  str+='<span>'+sbs[i].name+'</span>';
                      str+='<cite style="display:none;">'+sbs[i].oname+'</cite>';
					str+='</a>';
				str+='</li>';
    		}
    		$("#topLevelMenus").html(str);
    	}else if(loginInfo.roleId == 1){
            for(var i in sys){
    			   if(i == 0){
                        str+='<li class="layui-nav-item layui-this" data-menu="'+sys[i].target+'">';
                    }else{
                        str+='<li class="layui-nav-item" data-menu="'+sys[i].target+'">';
                    }
					str+='<a href="javascript:;" data-url="'+sys[i].url+'">';
					  str+='<i class="layui-icon" data-icon="'+sys[i].icon+'">'+sys[i].icon+'</i>';
					  str+='<span>'+sys[i].name+'</span>';
                      str+='<cite style="display:none;">'+sys[i].oname+'</cite>';
					str+='</a>';
				str+='</li>';
    		}
    		$("#topLevelMenus").html(str);
    	}
    }

	//通过顶部菜单获取左侧二三级菜单 
	function getData(json){
		$.get("../../json/topnav.json",function(data){
			if(json == "contentManagement"){
				dataStr = data.contentManagement;
				//重新渲染左侧菜单
				tab.render();
			}else if(json == "memberCenter"){
				dataStr = data.memberCenter;
				//重新渲染左侧菜单
				tab.render();
			}else if(json == "systemeSttings"){
				dataStr = data.systemeSttings;
				//重新渲染左侧菜单
				tab.render();
			}else if(json == "memberyujing"){
                dataStr = data.memberyujing;
                //重新渲染左侧菜单
                tab.render();
            }else if(json == "news"){
                 dataStr = data.news;
                //重新渲染左侧菜单
                tab.render();
            }
		})
	}
	//页面加载时判断左侧菜单是否显示
	//通过顶部菜单获取左侧菜单
	$(".topLevelMenus li,.mobileTopLevelMenus dd").click(function(){
		if($(this).parents(".mobileTopLevelMenus").length != "0"){
			$(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		}else{
			$(".mobileTopLevelMenus dd").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
		}
//		$(".layui-layout-admin").removeClass("showMenu");
		$("body").addClass("site-mobile");
		getData($(this).data("menu"));
		//渲染顶部窗口
		tab.tabMove();
	})

	//隐藏左侧导航
	$(".hideMenu").click(function(){
		// if($(".topLevelMenus li.layui-this a").data("url")){
		// 	layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
		// 	return false;
		// }
		$(".layui-layout-admin").toggleClass("showMenu");
		//渲染顶部窗口
		tab.tabMove();
	})

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	getData("contentManagement");

	//手机设备的简单适配
 //    $('.site-tree-mobile').on('click', function(){
	// 	$('body').addClass('site-mobile');
	// });
 //    $('.site-mobile-shade').on('click', function(){
	// 	$('body').removeClass('site-mobile');
	// });

	// 添加新窗口
	$("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
		//如果不存在子级
		if($(this).siblings().length == 0){
			addTab($(this));
			$('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})

	//清除缓存
	$(".clearCache").click(function(){
		window.sessionStorage.clear();
        window.localStorage.clear();
        var index = layer.msg('清除缓存中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("缓存清除成功！");
        },1000);
    })

	//刷新后还原打开的窗口
    if(cacheStr == "true") {
        if (window.sessionStorage.getItem("menu") != null) {
            menu = JSON.parse(window.sessionStorage.getItem("menu"));
            curmenu = window.sessionStorage.getItem("curmenu");
            var openTitle = '';
            for (var i = 0; i < menu.length; i++) {
                openTitle = '';
                if (menu[i].icon) {
                    if (menu[i].icon.split("-")[0] == 'icon') {
                        openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
                    } else {
                        openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
                    }
                }
                openTitle += '<cite>' + menu[i].title + '</cite>';
                openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
                element.tabAdd("bodyTab", {
                    title: openTitle,
                    content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
                    id: menu[i].layId
                })
                //定位到刷新前的窗口
                if (curmenu != "undefined") {
                    if (curmenu == '' || curmenu == "null") {  //定位到后台首页
                        element.tabChange("bodyTab", '');
                    } else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
                        element.tabChange("bodyTab", menu[i].layId);
                    }
                } else {
                    element.tabChange("bodyTab", menu[menu.length - 1].layId);
                }
            }
            //渲染顶部窗口
            tab.tabMove();
        }
    }else{
		window.sessionStorage.removeItem("menu");
		window.sessionStorage.removeItem("curmenu");
	}
})

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}

