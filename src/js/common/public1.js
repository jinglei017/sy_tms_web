$(function(){
	var adsrWid = $(window).width() 
	var winHeight = $(window).height();
	var adsrHeight = $(window).height() - 116;
	$(".adsContent .adsRight").css({"width":adsrWid + "px","height": winHeight + "px"});
	var adsrcHeight = winHeight - 136;
	$(".adsContent .adsRight .adsRightCon").css({"height":adsrcHeight + "px","overflow":"auto"});
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
})
