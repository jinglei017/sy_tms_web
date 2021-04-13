var stateW = false;
$(function(){
    var menuItemIndex = 999;
	$(".header").load("/html/template/header.html",function(){
		var pathname = window.location.pathname;
		var logininf = JSON.parse(localStorage.getItem("logininf"));
		$(".hRight .user_name").html(logininf.tenantName);
		$(".header .hLeft .hlMeau").click(function(){
            if(stateW){
                stateW = !stateW;
                $(".header .hlMeau img").css("transform","rotate(0deg)");
                $(".adsLeft").css({"width":"220px","min-width":"170px"});

                setTimeout(()=>{
                    $(".adsLeftItem>a .dirIcon").fadeIn();
                    $(".subMenu").eq(menuItemIndex).fadeIn(100);
                    $(".adsLeftItem a .text").show();
                },130)
            }else{
                $(".header .hlMeau img").css("transform","rotate(180deg)");
                $(".adsLeft").css({"width":"60px","min-width":"60px"});
                $(".subMenu").hide();
                $(".adsLeftItem>a .text").hide();
                $(".adsLeftItem>a .dirIcon").hide();
                stateW = !stateW;
            }
		});

        $(".header .hLeft .refresh").click(function(){
            window.location.reload();
        });

		$(".header .hRight .userLogout").click(function(){
			userLogout();
		});
		function userLogout(){
			var loginInf = JSON.parse(localStorage.getItem("logininf"));
			$.ajax({
				url: umsUrl + "/user/logout?token="+loginInf.token,
				type:"get",
				success:function(data){
					location.href = "/login.html"
				}
			})
		}
        $(".header .hRight .userModify").click(function(){
            $("#maskLayer-userModify").show();
            $('.oldPsd').val('');
            $('.newPsd').val('');
            $('.sameNewPsd').val('');
            $('.inputPhone').val('TEL: '+JSON.parse(localStorage.getItem("logininf")).mobilePhone);
            $('.inputYzm').val();
            $('.amendYzm').html('验证码');
			clearInterval(getTelCodeTimer);
			getTelCodeInt = 60;
			gotTelCode = '0';
			$(".passwordMethods p").html("短信验证方式修改");
			$(".userModifyUl.userModifyUlPassword li:nth-child(2),.userModifyUl.userModifyUlPassword li:nth-child(3),.modifySpan2").hide();
			$(".userModifyUl.userModifyUlPassword li:nth-child(1),.userModifyUl.userModifyUlPassword li:nth-child(5),.modifySpan1").show();

        })
        $(".header .hRight .userInfoModify").click(function(){
            $("#maskLayer-userInfoModify").show();
            $('.userPhone').val(JSON.parse(localStorage.getItem("logininf")).mobilePhone);
            $('.userName').val(JSON.parse(localStorage.getItem("logininf")).userName);
            clearInterval(getTelCodeTimer);
            getTelCodeInt = 60;
            gotTelCode = '0';

        })

		//  获取验证码
		var getTelCodeTimer;       //定时器
		var getTelCodeInt = 60;      //初始时间
		var gotTelCode = '0';
		$(".amendYzm").click(function() {
			if(gotTelCode == "0"){
				getRequest(umsUrl+'/getUpdatePwdValidation.json?mobileNo='+JSON.parse(localStorage.getItem("logininf")).mobilePhone,function(res){
					gotTelCode = "1";
					$('.amendYzm').html(getTelCodeInt+' s'); // 倒计时初始值
					startTimer();
				})
			}else{
				imitatePopup("操作频繁，请稍后重试",'alert');
			}
		})
        $(".obtainYzm").click(function() {
            var userPhone = $('.userPhone').val().trim();
            var regular = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
            if(userPhone == "" || userPhone == null || userPhone ==undefined ){
                imitatePopup("请输入手机号！",'alert');
                return false;
            }
            if(!regular.test(userPhone)){
                imitatePopup("请输入正确的手机号！",'alert');
                return false;
            }
            if(gotTelCode == "0"){
                getRequest(umsUrl+'/updateUserInfoValidation.json?mobileNo='+userPhone,function(res){
                    gotTelCode = "1";
                    $('.obtainYzm').html(getTelCodeInt+' s'); // 倒计时初始值
                    startTimer1();
                })
            }else{
                imitatePopup("操作频繁，请稍后重试",'alert');
            }
        })
		function startTimer() {
			getTelCodeTimer = setInterval(function(){
				getTelCodeInt--; // 时间递减
				$('.amendYzm').html(getTelCodeInt+' s');
			}, 1000);
			setTimeout(function() {
				clearTimer();
			},1*60*1000);
		}
        function startTimer1() {
            getTelCodeTimer = setInterval(function(){
                getTelCodeInt--; // 时间递减
                $('.obtainYzm').html(getTelCodeInt+' s');
            }, 1000);
            setTimeout(function() {
                clearTimer1();
            },1*60*1000);
        }
		function clearTimer() {
			gotTelCode = "0";
			clearInterval(getTelCodeTimer);
			$('.amendYzm').html("验证码");
			getTelCodeInt = 60;
		}
        function clearTimer1() {
            gotTelCode = "0";
            clearInterval(getTelCodeTimer);
            $('.obtainYzm').html("验证码");
            getTelCodeInt = 60;
        }

		$(".passwordMethods p").click(function(){
			if($(".passwordMethods p").html() == "短信验证方式修改"){
				$(".passwordMethods p").html("输入原密码方式修改");
				$('.newPsd').val("");
				$(".userModifyUl.userModifyUlPassword li:nth-child(2),.userModifyUl.userModifyUlPassword li:nth-child(3)").show();
				$(".modifySpan2").css("display","block");
				$(".userModifyUl.userModifyUlPassword li:nth-child(1),.userModifyUl.userModifyUlPassword li:nth-child(5),.modifySpan1").hide();
			}else{
				$(".passwordMethods p").html("短信验证方式修改");
				$('.newPsd').val("");
				$(".userModifyUl.userModifyUlPassword li:nth-child(2),.userModifyUl.userModifyUlPassword li:nth-child(3),.modifySpan2").hide();
				$(".userModifyUl.userModifyUlPassword li:nth-child(1),.userModifyUl.userModifyUlPassword li:nth-child(5),.modifySpan1").show();
			}
		})

        $("#maskLayer-userModify .userModifyBtn .modifySpan1").click(function(){
            var oldPsd = $('.oldPsd').val(),newPsd = $('.newPsd').val(),sameNewPsd = $('.sameNewPsd').val();
            if(oldPsd == ''){
                imitatePopup("请输入原密码！",'alert');
                return false;
			}
            if(newPsd == ''){
                imitatePopup("请输入非空的新密码！",'alert');
                return false;
            }
            if(sameNewPsd == ''){
                imitatePopup("请输入非空的确认新密码！",'alert');
                return false;
            }
            if(newPsd != sameNewPsd){
                imitatePopup("请输入相同的非空新密码！",'alert');
                return false;
            }
			var psdReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,50}$/;  // 字母、数字、下划线，至少包含任意两种（6-50个字符）

			if(psdReg.test(newPsd)){
				var paramObj = {
                    "tenantCode":JSON.parse(localStorage.getItem("logininf")).tenantCode,
                    "userName":JSON.parse(localStorage.getItem("logininf")).userName,
                    "password":oldPsd,
                    "newPassword":newPsd,
					"mobilePhone":JSON.parse(localStorage.getItem("logininf")).mobilePhone,
					"umUserId":JSON.parse(localStorage.getItem("logininf")).umUserId,
					"userCode":JSON.parse(localStorage.getItem("logininf")).userCode,
					"choiceWay":"0"
                };
                postRequest(umsUrl+'/user/updatePwd.json?token='+JSON.parse(localStorage.getItem("logininf")).token+'&timeStamp='+JSON.parse(localStorage.getItem("logininf")).timeStamp+'&choiceWay=0',paramObj,function(data){
                    if(data.msg == "SUCCESS" || data.msg == "success"){
						imitatePopup('密码修改成功,请重新登陆！','alert');
						userLogout();
					}else{
                    	imitatePopup(data.msg,'alert');
					}
                	$("#maskLayer-userModify").hide();
                })
            }else{
                imitatePopup("请输入符合格式的新密码！",'alert');
            }
        })
		$("#maskLayer-userModify .userModifyBtn .modifySpan2").click(function(){
			var newPsd = $('.newPsd').val(),inputYzm = $('.inputYzm').val();
			if(newPsd == ''){
				imitatePopup("请输入非空的新密码！",'alert');
				return false;
			}
			if(inputYzm == ""){
				imitatePopup("请输入验证码！",'alert');
				return false;
			}
			var psdReg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[])+$)([^(0-9a-zA-Z)]|[]|[a-z]|[A-Z]|[0-9]){6,50}$/;  // 字母、数字、下划线，至少包含任意两种（6-50个字符）

			if(psdReg.test(newPsd)){
				var paramObj = {
					"tenantCode":JSON.parse(localStorage.getItem("logininf")).tenantCode,
					"userName":JSON.parse(localStorage.getItem("logininf")).userName,
					"mobilePhone":JSON.parse(localStorage.getItem("logininf")).mobilePhone,
					"umUserId":JSON.parse(localStorage.getItem("logininf")).umUserId,
					"userCode":JSON.parse(localStorage.getItem("logininf")).userCode,
					"newPassword":newPsd,
					"validaToken":inputYzm,
					"choiceWay":"1"
				};
				postRequest(umsUrl+'/user/updatePwd.json?token='+JSON.parse(localStorage.getItem("logininf")).token+'&timeStamp='+JSON.parse(localStorage.getItem("logininf")).timeStamp,paramObj,function(data){
					if(data.msg == "SUCCESS" || data.msg == "success"){
						imitatePopup('密码修改成功,请重新登陆！','alert');
						userLogout();
					}else{
						imitatePopup(data.msg,'alert');
					}
					$("#maskLayer-userModify").hide();
				})
			}else{
				imitatePopup("请输入符合格式的新密码！",'alert');
			}
		})
        $("#maskLayer-userInfoModify .userModifyBtn .modifySpan3").click(function(){
            var userName = $('.userName').val().trim();
            var userPhone = $('.userPhone').val().trim();
			var phoneYzm = $('.phoneYzm').val().trim();
            if(userName == "" || userName == null || userName ==undefined ){
                imitatePopup("请输入用户名！",'alert');
                return false;
            }
            if(userPhone == "" || userPhone == null || userPhone ==undefined ){
                imitatePopup("请输入手机号！",'alert');
                return false;
            }
            if(phoneYzm == "" || phoneYzm == null || phoneYzm ==undefined){
                imitatePopup("请输入验证码！",'alert');
                return false;
            }
            var regular= /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;
            if(regular.test(userPhone)){
                var paramObj = {
                    "userName":userName,
                    "mobilePhone":userPhone,
                    "umUserId":JSON.parse(localStorage.getItem("logininf")).umUserId,
                    "phoneYzm":phoneYzm
                };
                postRequest(umsUrl+'/update/userInfoByCode.json?token='+JSON.parse(localStorage.getItem("logininf")).token+'&timeStamp='+JSON.parse(localStorage.getItem("logininf")).timeStamp,paramObj,function(data){
                    if(data.msg == "SUCCESS" || data.msg == "success"){
                        imitatePopup('修改成功,请重新登陆！');
                        userLogout();
                    }else{
                        imitatePopup(data.msg,'alert');
                    }
                    $("#maskLayer-userInfoModify").hide();
                })
            }else{
                imitatePopup("请输入正确的手机号！",'alert');
            }
        })

        $("#maskLayer-userModify #closeUserModify").click(function(){
            $("#maskLayer-userModify").hide();
        })
        $("#maskLayer-userInfoModify #closeUserInfoModify").click(function(){
            $("#maskLayer-userInfoModify").hide();
        })
	});

	$(".adsLeft").load("/html/template/left.html",function(){
		var logininf = JSON.parse(localStorage.getItem("logininf"));
		$.ajax({
	        url: umsUrl+'/query/objectByUser.json?token='+logininf.token+'&timeStamp='+logininf.timeStamp+"&userId="+logininf.umUserId+"&objectType=menu",
	        type: "get",
	        success: function (data) {
	        	var data = data.result;
	            var letfHtml = "";
	            var newDataArr = [];
	            var secondLevelHtml = [];
	            var jumpLinkList = [];
	            var mergeMenus = [];
	            for(var i = 0 ; i < data.length;i++){
	            	if(data[i].parentObjectId == 3){
	            		newDataArr.push(data[i]);
	            		letfHtml += '<li class="adsLeftItem">'+
										'<a href="javascript:;" class="titleItem" title="'+data[i].objectName+'" objectid="'+data[i].umObjectId+'">'+
                                            '<p>' +
                                                '<span class="icon"><img src="/img/aside/navigation-_icon_'+data[i].objectCode+'.png" alt="" /></span>'+
                                                '<span class="text">'+data[i].objectName+'</span>'+
                                            '</p>' +
                                            '<span class="dirIcon"><img src="/img/open_1.png"><img src="/img/close_1.png"></span>' +
										'</a>'+
                                        '<ul class="subMenu"></ul>'+
									'</li>';

						secondLevelHtml += "<li><dl></dl></li>"
	            	}
	            }
	            $(".adsLeftList").html(letfHtml);
	            for(var i = 0; i < newDataArr.length; i++){
                    var secondLevelLi = "";
                    var jumpLinkInfo = {
                        parentObjectId: newDataArr[i].umObjectId,
                        linkItemFun: []
                    };
	            	for(var j = 0; j < data.length; j++){
	            		if(newDataArr[i].umObjectId == data[j].parentObjectId){

                            jumpLinkInfo.linkItemFun.push(data[j].objectName+":"+data[j].objectCode+"?objectId="+data[j].umObjectId);

                            if(data[j].objectName == '智配服务看板' || data[j].objectName == '客户服务看板' || data[j].objectName == '平台服务看板' ||
                                data[j].objectName == '共享业务看板' || data[j].objectName == '地图排单'){
	                            secondLevelLi += '<li><a target="_blank" href="'+data[j].objectCode+'?objectId='+data[j].umObjectId+'">'+data[j].objectName+'</a></li>'
							}else{
                                var menuNameItem = data[j].objectName;

                                /* ---------------- 菜单整理 ------ end --------- */
                                if(data[j].parentObjectId == "6"  && menuNameItem == "派送任务"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'queryOrderInfo.html'});
                                    continue;
                                }
                                if(menuNameItem == "共享订单" || menuNameItem == "共享业务看板"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'shareVehicleOrder.html'});
                                    continue;
                                }
                                if(menuNameItem == "车辆模板管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'eqpInfo.html'});
                                    continue;
                                }
                                if(menuNameItem == "客户模板管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'partyInfo.html'});
                                    continue;
                                }
                                if(menuNameItem == "地址模板管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'locationInfo.html'});
                                    continue;
                                }
                                if(menuNameItem == "账单管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'chargeManage.html'});
                                    continue;
                                }
                                if(menuNameItem == "片区管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'transMapAllocation.html'});
                                    continue;
                                }
                                if(menuNameItem == "路线管理"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'wayManageAllOction.html'});
                                    continue;
                                }
                                if(menuNameItem == "班次地图"){
                                    mergeMenus.push({menuName: menuNameItem,equiHtml: 'classesList.html'});
                                    continue;
                                }
                                /* ---------------- 菜单整理 ------ end --------- */

	                            secondLevelLi += '<li><a href="'+data[j].objectCode+'?objectId='+data[j].umObjectId+'">'+menuNameItem+'</a></li>'
							}
	            		}
	            	}
                    jumpLinkList.push(jumpLinkInfo);

                    if(secondLevelLi != ""){
                        $(".subMenu").eq(i).append(secondLevelLi)
                    }
	            }

	            for(var a = 0; a < $(".subMenu li").length; a++){
                    var objectHref = window.location.href;
                    var hrefStr = $(".subMenu li").eq(a).find("a").attr("href");

                    if($(".pageHeaderL li span.active a").html()){
                        for(var b=0;b<mergeMenus.length;b++){
                            if($(".pageHeaderL li span.active a").html() == mergeMenus[b].menuName && hrefStr.indexOf(mergeMenus[b].equiHtml) != -1){
                                objectHref = mergeMenus[b].equiHtml;
                                hrefStr = mergeMenus[b].equiHtml;
                            }
                        }
                    }

                    if(objectHref.indexOf(hrefStr) != -1){
                        $(".subMenu li").eq(a).parents(".subMenu").show();
                        $(".subMenu li").eq(a).find("a").addClass("active");
                        $(".subMenu li").eq(a).siblings("li").find("a").removeClass("active");
                        $(".subMenu li").eq(a).parents(".adsLeftItem").find("a .dirIcon img:first-child").hide();
                        $(".subMenu li").eq(a).parents(".adsLeftItem").find("a .dirIcon img:last-child").show();
                        menuItemIndex = $(".subMenu li").eq(a).parents(".adsLeftItem").index();
                        break;
                    }
                }
	            setTimeout(function () {
                    localStorage.setItem("jumpLinkList", JSON.stringify(jumpLinkList));
                },500)

	        }
	   });

		// 左侧菜单点击事件
        $(".adsLeftList").on("click",".adsLeftItem>a",function(){
            $(".header ul li:first-child img").css("transform","rotate(0deg)");
            $(".adsLeft").css({"width":"220px","min-width":"220px"});
            $(".adsLeftItem>a .text").show();
            $(".adsLeftItem>a .dirIcon").show();

            $(this).find(".dirIcon img:first-child").toggle();
            $(this).find(".dirIcon img:last-child").toggle();
            $(this).parents(".adsLeftItem").siblings().find(".dirIcon img:last-child").hide();
            $(this).parents(".adsLeftItem").siblings().find(".dirIcon img:first-child").show();
            $(".adsLeftItem>a").removeClass('white');
            var index = $(this).parents(".adsLeftItem").index();
            $(".subMenu").eq(index).toggle();
            $(".subMenu").eq(index).parents(".adsLeftItem").siblings().find(".subMenu").hide();

            if($(".subMenu").eq(index).is(":visible")){
                menuItemIndex = index;
                $(this).addClass('white');
                stateW = !stateW;
            }else{
                menuItemIndex = 999;
            }
        })


	});

    /* --- 可关闭异常弹窗 ---- start ----- */
    $(document).click(function(){
        if ($('.hasExceptionMsg').length < 1) {

        }else{
            if ($('.closeTip').is(':visible')) {
                $(".closeTip").click(function(){
                    $('.hasExceptionMsg').remove();
                });
            }
		}
    });
    /* --- 可关闭异常弹窗 ---- end ----- */

    /* --- cd Tab ---- start ----- */
    $(document).on('click','#adsRightConItemTab #adsRightConItemTabTit>li',function(){
        $(this).addClass('active').siblings().removeClass('active');
        var index = $(this).index();
        $('#adsRightConItemTab #adsRightConItemTabCon .adsRightConItem:eq(' + index + ')').show().siblings('.adsRightConItem').hide();
    });
    // 新增、详情、修改 - 恢复tab
    $(".adsRight .template").on("click",".commandbarList .add,.reportMessages tbody tr .see,.reportMessages tbody tr .edit",function(){
        if ($('#adsRightConItemTab').length < 1) {

        }else{
            $('#adsRightConItemTab #adsRightConItemTabTit>li:eq(0)').addClass('active').siblings().removeClass('active');
            $('#adsRightConItemTab #adsRightConItemTabCon .adsRightConItem:eq(0)').show().siblings('.adsRightConItem').hide();
        }
    });
    /* --- cd Tab ---- end ----- */
});

function strLens(str) {
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}
var closeCurrWindow = function () {
	$("#newAdsActivityManage").hide();
	var adsRightWid = $(".adsRight").width();
	$(".activityDshBoard").css({
		"width": adsRightWid + "px"
	}, "fast");
	$(".activityDshBoard").removeClass("templateMin");
}
