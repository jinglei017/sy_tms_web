document.documentElement.style.fontSize = document.documentElement.clientWidth / 19.2 + 'px';
window.addEventListener("resize",function(){
	document.documentElement.style.fontSize = document.documentElement.clientWidth / 19.2 + 'px';
})

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function postRequest(url,data,callback,txt){
    $.ajax({
        url: url,
        type: "post",
        contentType : 'application/json',
        data: JSON.stringify(data),
        beforeSend:function(){
            $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
        },
        success: function (response) {
        	$(".ajax-load-pupup").remove()
            callback(response);
        }
    })
}



function getRequest(url,callback,txt){
	$.ajax({
        url: url,
        type: "get",
        beforeSend:function(){
        	if(txt == 1){
        		$(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');	
        	}
        },
        success: function (response) {
        	$(".ajax-load-pupup").remove()
            callback(response);
        }
    });
}


$(function () {

    /* 页面中心数据展示 伸缩 */
    $(".platformStatsCon").on("click",".mcTitleShowHide",function(){
        if($(this).hasClass("orderContainerHide")){  // 显
            var width = $('.platformStatsCon').width();
            $(this).removeClass("orderContainerHide");
            $(".platformStatsCon .mcTitle").show();
            /*$(".platformStatsCon .mcTitle").animate({
                "width": width + "px"
            }, "fast");
            $(".platformStatsCon .mcTitle").css({
                "display": "block"
            });*/
            $(this).removeClass("mcTitleShowHideImg_r").addClass("mcTitleShowHideImg_l");
        }else{  // 隐
            $(this).addClass("orderContainerHide");
            $(".platformStatsCon .mcTitle").hide();
            /*$(".platformStatsCon .mcTitle").animate({
                "width": "0px"
            });
            $(".platformStatsCon .mcTitle").css({
                "display": "none"
            });*/
            $(this).removeClass("mcTitleShowHideImg_l").addClass("mcTitleShowHideImg_r");
        }
    })
});

//alert
function imitatePopup(text,state,options){
    $('.ajax-load-pupup').remove();
    if ($('.hasExceptionMsg').length < 1) {
        if ($('.ajax-load-pupup-alert').length < 1) {
            var ajaxLoadPupup = '<div class="ajax-load-pupup-alert">' +
                '<div class="ajax-load-hint">' +
                '<span class="alert"><pre>'+text+'</pre></span>' +
                '<div class="ajax-load-button ajax-load-button1">' +
                '<button class="sure sure1">确定</button>' +
                '<button class="cancel">取消</button>' +
                '</div>' +
                '<div class="ajax-load-button ajax-load-button2">' +
                '<button class="sure sure2">确定</button>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(".overall").append(ajaxLoadPupup);
        }
    }
    if(state == 'alert' || state == '' || state == undefined || state == null){
        $(".ajax-load-button1").css("display","none");
        $('.ajax-load-pupup-alert').fadeIn(800);
        $(".sure2").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
        })
    }else{
        $(".ajax-load-button2").css("display","none");
        $('.ajax-load-pupup-alert').fadeIn(400);
        $(".sure1").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
            options(1)
        })
        $(".cancel").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
            options(0)
        })
    }
}
