$(function(){
	localStorage.removeItem("logininf");
	localStorage.removeItem("basicData");
	localStorage.removeItem("allData");
    localStorage.removeItem("nowTimes1");
    localStorage.removeItem("orderSynTime");

    localStorage.removeItem('uuid');
    localStorage.removeItem('moveEnd_X');
    localStorage.removeItem('jumpLinkList');
    localStorage.removeItem('parentObjectId');

    $(".tenantcode").val('');
    $(".username").val('');
    $(".password").val('');
    $(".userInputTel").val('');
    $(".userInputTelCode").val('');

    var day2 = new Date();
	day2.setTime(day2.getTime());
	var s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate();

	$(".loginBtn").click(function(){
		var tenantcode = $(".tenantcode").val().trim();
        var username = $(".username").val().trim();
        var pwdVal = $(".password").val().trim();
        var uuid = localStorage.getItem('uuid');
        var moveEnd_X = localStorage.getItem('moveEnd_X');
        if(tenantcode == ""){
            imitatePopup("请输入租户名","alert");
            return false;
        }else if(username == ""){
            imitatePopup("请输入用户名","alert");
            return false;
        }else if(pwdVal == ""){
            imitatePopup("请输入密码","alert");
            return false;
        }else if(uuid == null || moveEnd_X == null){
            imitatePopup("请通过拼图验证","alert");
            return false;
        }else{
            var userInfo = {
                loginType: 1,
                uuid:uuid,
                moveEnd_X:moveEnd_X,
            	tenantCode:tenantcode,
                userName:username,
                passWord:pwdVal
            };
            postRequest(umsUrl + '/user/login.json',userInfo,function(data){
            	localStorage.setItem("logininf",JSON.stringify(data.result));
            	localStorage.setItem("getCurrentData",s2);
              	location.href = "index.html";
            })
        }
	});

	/*$(document).keyup(function(event){
		if(event.keyCode ==13){
		    $(".loginBtn").trigger("click");
		}
	});*/

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

    $(".loginKuai .span1").click(function(){
        $('.loginType1').show().siblings('.loginType2').hide();
        $('.loginKuai .span1').hide().siblings('.loginKuai .span2').show();
    });

    $(".loginKuai .span2").click(function(){
        $('.loginType2').show().siblings('.loginType1').hide();
        $('.loginKuai .span2').hide().siblings('.loginKuai .span1').show();
    });

    $(".loginType2-login").click(function(){
        var userInputTel = $(".userInputTel").val().trim();
        var userInputTelCode = $(".userInputTelCode").val().trim();
        if(userInputTel == ""){
            imitatePopup("请输入手机号",'alert');
            return false;
        }else if(userInputTelCode == ""){
            imitatePopup("请输入验证码",'alert');
            return false;
        }else{
            var userInfo = {
                loginType: 3,
                userName:userInputTel,
                passWord:userInputTelCode
            };
            postRequest(umsUrl + '/user/login.json',userInfo,function(data){
                localStorage.setItem("logininf",JSON.stringify(data.result));
                localStorage.setItem("getCurrentData",s2);
                location.href = "index.html";
            })
        }
    });

    /* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
    function postRequest(url,data,callback,txt){
        $.ajax({
            url: url,
            type: "post",
            contentType : 'application/json',
            data: JSON.stringify(data),
            beforeSend:function(){
                if ($('.hasExceptionMsg').length < 1) {
                    if ($('.ajax-load-pupup').length < 1) {
                        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                    }
                }
            },
            success: function (response) {
                if(response != null){
                    if(response.msg == 'success' || response.msg == 'SUCCESS'){
                        setTimeout(function(){
                            if($('.hasExceptionMsg').length < 1){
                                $(".ajax-load-pupup").remove();
                            }
                        },300);
                        callback(response);
                    }else{
                        if(response.exceptionMsg != null){
                            getYZImageFun();
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top','5%');
                            $(".ajax-load-pupup span").html(response.exceptionMsg);
                            $(".ajax-load-hint img.closeTip").show();
                        }
                    }
                }
            },
            error: function () {
                if ($('.hasExceptionMsg').length < 1) {
                    if ($('.ajax-load-pupup').length < 1) {
                    }else{
                        $(".ajax-load-pupup").hide();
                    }
                    if ($('.ajax-load-pupup3').length < 1) {
                        $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                    }else{
                        $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                    }
                }else{
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
                $(".ajax-load-hint img.closeTip").show();
            }
        });
    }

    /* ---------------- 滑块 ----- start ---------- */
    getYZImageFun();

    var wSize = 350;   // 原 450
    var PlSize = 100;    //缺失拼图的大小
    var paddingSize = 0;    //缺失拼图与边框的距离
    var moveStart = '';//定义一个鼠标按下的X轴值
    //鼠标按下
    $("#YZImageSlider").mousedown(function(e){
        e = e || window.event;
        // 鼠标在滑块按下切换滑块背景
        /*$(this).css({
            "background-position":"0 -216px"
        });*/
        moveStart = e.pageX;//记录鼠标按下时的坐标 X轴值
        //    console.log(moveStart);
    });
    //鼠标拖动（这里使用全局监听鼠标移动的事件）
    onmousemove = function(e) {
        e = e || window.event;
        if(moveStart == '') {
            // console.log('未拖动滑块');
        } else {
            var moveX = e.pageX;//监听鼠标的位置
            var d = moveX-moveStart;    //鼠标按住后在X轴上移动的距离
            if(d<0 || d>(wSize-paddingSize-PlSize)) {
                // console.log('超过范围');
            } else {
                var OtherD = d+20;
                $("#YZImageSlider").css({
                    "left":d + 'px',
                    "transition":"inherit"
                });
                $("#partImage").css({
                    "left":OtherD + 'px',
                    "transition":"inherit"
                });
            }
        }
    };
    //鼠标松开 （这里使用全局监听鼠标松开的事件）
    onmouseup = function (e) {
        e = e || window.event;
        //    console.log(e.pageX);
        var moveEnd_X = e.pageX - moveStart;//松开鼠标后滑块移动的距离
        moveEnd_X = parseInt( ((moveEnd_X + 20) / 2) );
        if(moveStart == '') {
            // console.log('未拖动滑块');
        } else {
            var uuid = $("#uuidVal").val();
            localStorage.setItem('uuid',uuid);
            localStorage.setItem('moveEnd_X',moveEnd_X);
            getRequest(umsUrl + "/slidingVerification.json?uuid="+uuid+'&moveEnd_X='+moveEnd_X,function(res){
                var data = JSON.parse(res.result);
                if(data.YZ=="yes"){
                    $('#YZImageSliDivP').html('按住左边滑块，拖动完成拼图 - 通过');
                    $(".loginBtn").trigger("click");
                }else{
                    $('#YZImageSliDivP').html('按住左边滑块，拖动完成拼图 - 失败');
                    localStorage.removeItem('uuid');
                    localStorage.removeItem('moveEnd_X');
                    getYZImageFun();
                }
            })
        }
        setTimeout(function () {
            $("#YZImageSlider").css({
                "left":'0',
                "transition":"left 0.5s"
            });
            $("#partImage").css({
                "left":'0px',
                "transition":"left 0.5s"
            });
        },1000);
        /*$("#YZImageSlider").css({
            "background-position":"0 -84px"
        });*/
        moveStart = '';//  清空上一次鼠标按下时的坐标X轴值;
    }
    /* ---------------- 滑块 ------ end --------- */

});

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function postRequest2(url,data,callback,txt){
    $.ajax({
        url: url,
        type: "post",
        contentType : 'application/json',
        data: JSON.stringify(data),
        beforeSend:function(){
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                }
            }
        },
        success: function (response) {
            if(response != null){
                if(response.msg == 'success' || response.msg == 'SUCCESS'){
                    setTimeout(function(){
                        if($('.hasExceptionMsg').length < 1){
                            $(".ajax-load-pupup").remove();
                        }
                    },300);
                    callback(response);
                }else{
                    if(response.exceptionMsg != null){
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".hasExceptionMsg .ajax-load-hint span").css('margin-top','5%');
                        $(".ajax-load-pupup span").html(response.exceptionMsg);
                        $(".ajax-load-hint img.closeTip").show();
                    }
                }
            }
        },
        error: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                }else{
                    $(".ajax-load-pupup").hide();
                }
                if ($('.ajax-load-pupup3').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                }else{
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
            }else{
                $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

function getRequest(url,callback,txt){
    $.ajax({
        url: url,
        type: "get",
        beforeSend:function(){
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                }
            }
        },
        success: function (response) {
            if(response != null){
                if(response.msg == 'success' || response.msg == 'SUCCESS'){
                    setTimeout(function(){
                        if($('.hasExceptionMsg').length < 1){
                            $(".ajax-load-pupup").remove();
                        }
                    },300);
                    callback(response);
                }else{
                    if(response.exceptionMsg != null){
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".hasExceptionMsg .ajax-load-hint span").css('margin-top','3%');
                        $(".ajax-load-pupup span").html(response.exceptionMsg);
                        $(".ajax-load-hint img.closeTip").show();
                    }
                }
            }
        },
        error: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                }else{
                    $(".ajax-load-pupup").hide();
                }
                if ($('.ajax-load-pupup3').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                }else{
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
            }else{
                $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

/* ---------------- 获取验证图片 --------------- */
function getYZImageFun() {
    getRequest(umsUrl + "/goUploadImg.json",function(res){
        var data = JSON.parse(res.result);
        /*console.log('x:'+data.CJX);
        console.log('y:'+data.CJY);*/
        $("#uuidVal").val(data.uuid);
        $("#basImage").html("<img src=\"data:image/jpeg;base64,"+data.YYPng_base64+"\"/>");
        $("#partImage").html("<img src=\"data:image/jpeg;base64,"+data.CutPng_base64+"\"/>");
        var MarTop = data.CJY+"px";
        $("#partImage").css('margin-top',MarTop); //移动上下位置

        $('.yzDivCont').css('visibility','visible');
        $('#YZImageSliDivP').html('按住左边滑块，拖动完成拼图登录');
    });
}

/* ---------------- 获取验证码 ----- start ---------- */
var getTelCodeTimer;       //定时器
var getTelCodeInt = 60;      //初始时间
var gotTelCode = '0';
function getYZCodeFun() {
    var userInputTel = $(".userInputTel").val().trim();
    if(userInputTel == "" || (!checkInputPhone(userInputTel))){
        imitatePopup("请输入格式正确的手机号",'alert');
    }else{
        if(gotTelCode == "0"){
            getRequest(umsUrl + "/getMobileLoginAuthToken.json?mobileNo="+userInputTel,function(res){
                gotTelCode = "1";
                $('#getTelCodeBtn').html(getTelCodeInt+' s'); // 倒计时初始值
                startTimer();
            });
        }else {
            $('#popupDpLoginCodeRes').html("操作频繁，请稍后重试");
            $('#popupDpLoginCodeRes').show();
            hideCodeRes();
        }
    }
}

function hideCodeRes() {
    setTimeout(function () {
        $('#popupDpLoginCodeRes').html("");
        $('#popupDpLoginCodeRes').hide();
    },2000);
}

function startTimer() {
    getTelCodeTimer = setInterval(function(){
        getTelCodeInt--; // 时间递减
        $('#getTelCodeBtn').html(getTelCodeInt+' s');
    }, 1000);
    setTimeout(function() {
        clearTimer();
    },1*60*1000);
}

function clearTimer() {
    gotTelCode = "0";
    clearInterval(getTelCodeTimer);
    $('#getTelCodeBtn').html("验证码");
    getTelCodeInt = 60;
    $('#popupDpLoginCodeRes').html("");
    $('#popupDpLoginCodeRes').hide();
}

// 校验手机号
function checkInputPhone(tel){
    if(!(/^1[34578]\d{9}$/.test(tel))){
        return false;
    }else{
        return true;
    }
}

/* ---------------- 获取验证码 ----- end ---------- */
