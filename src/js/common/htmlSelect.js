$(function() {
	var myClass = [];
	var activeWinWid;
	var num = 0;
    $(".activityDshBoard").addClass("active");

	// 新增
	$(".adsRight .template .commandbarList").on("click",".add",function(){
		myFunction($(this));
	})
    $(".adsRight .template .commandbarList").on("click",".see",function(){
        myFunction($(this));
    })
    $(".adsRight .pageHeader .pageHeaderR").on("click",".visible",function(){
        myFunction($(this));
    })
	// 详情、修改、识别码、
	$(".reportMessages tbody").on("click","tr .visible",function(){
		myFunction($(this));
	})
	// 坐标
	$(".adsRightCon .textBoxTitle").on("click","li .see",function(){
		myFunction($(this));
	})
	// 订单新增之后，上传附件
	$(".addNewOrderBot").on("click","#uploadImgFilesBtn0,#uploadImgFilesBtn1",function(){
        myFunction($(this));
    })

	function myFunction(parameter) {
        var prevStr = $(".template.active").attr("class").split(" ")[0];
        // var prevTitle = "";
        // if($(".pageHeaderC span").html() != "" || $(".pageHeaderC span").html() != null){
        //     prevTitle = $(".pageHeaderC span").html().split(" ")[1];
        // }
		var str = parameter.attr("btn");
		if(str == undefined ||str == "undefined"){
			return false;
		}
		var newStr = str.split('Btn')[0];
		if ($(".adsRight .template").hasClass(newStr)) {

            $(".adsRight .pageHeader .pageHeaderR").hide();
            $(".adsRight .pageHeader .pageHeaderBack").show();

            $(".template").removeClass("active");
            $(".template." + newStr).addClass("active");
            // $(".template." + newStr).attr({"prevs":prevStr,"prevt":prevTitle});
            $(".template." + newStr).attr({"prevs":prevStr});
            $(".template.active .adsRightConMatter").scrollTop(0);
		}
	}

    $(".adsRight .pageHeaderBack").on("click",".visible",function(){
        var name = $(".template.active").attr("prevs");
        $(".template").removeClass("active");
        $(".template." + name).addClass("active");

        if(name == "activityDshBoard" || name == null){
            $(".adsRight .pageHeader .pageHeaderBack").hide();
            $(".adsRight .pageHeader .pageHeaderR").show();
        }
    })

    $(".adsRight .textBoxTitle").on("click",".collSwitch",function(){
        $(".searchBtn .collUnfold").toggle();
    });
    $(".adsRight .textBoxTitle").on("click",".closeCollUnfold",function(){
        $(".searchBtn .collUnfold").hide();
    });


    // 多选
    $(document).click(function(){
        $(".a_selectOption").hide();
    });
    $(".adsRightConItem").on("click",".adsRightConInp .a_select",function (e) {
        e.stopPropagation();
        $(this).siblings(".a_selectOption").toggle();
    });
    $(".adsRightConItem").on("click",".adsRightConInp .a_select.active",function (e) {
        e.stopPropagation();
        $(this).siblings(".a_selectOption").hide();
    });
    $(".adsRightConItem").on("click",".adsRightConInp .a_selectOption",function (e) {
        e.stopPropagation();
        $(this).show();
    });


	// 地图排单 —— 班次信息
    $(".scheduleSection .textBoxTitle").on("click",".scheduleSectionRightBtn",function(){
        var wid = $('.scheduleSection').width() * 0.4;
        var hei = $('.scheduleSection').height();
        if ($(this).hasClass("scheduleSectionRightShow")) {
            $(this).removeClass("scheduleSectionRightShow");
            $(this).html('班次信息-详情');
            $(".scheduleSection .scheduleSectionRight").hide();
        }else{
            $(this).addClass("scheduleSectionRightShow");
            $(this).html('班次信息-收起');
            $(".scheduleSection .scheduleSectionRight").css({
                "width": wid + "px",
                "height": hei + "px"
            });
            $(".scheduleSection .scheduleSectionRight").show();
        }
    })
    $(".scheduleSection .reportMessagesMapBtn,.adsRightConItem .reportMessagesMapBtn").on("click",".reportMessagesOrderBtn",function(){
        if ($(this).hasClass("reportMessagesOrderBtnRight")) {
            $(this).removeClass("reportMessagesOrderBtnRight").addClass('reportMessagesOrderBtnLeft');
            $(".scheduleSection .reportMessagesMapBtn .reportMessagesOrder").hide();
            $(".reportMessagesMapBtn .reportMessagesMap").css('width','98%');
        }else{
            $(this).removeClass("reportMessagesOrderBtnLeft").addClass('reportMessagesOrderBtnRight');
            $(".scheduleSection .reportMessagesMapBtn .reportMessagesOrder").show();
            $(".reportMessagesMapBtn .reportMessagesMap").css('width','70%');
        }
    })

	$('.startTimeSpan').on('click',function(){
		initStartDate("startTime","startTimeSpan");
	});
	$('.endTimeSpan').on('click',function(){
		initEndDate("endTime","endTimeSpan");
	});
	//日期控件初始化--起始时间
	var initStartDate = function(startTime,startDateSpan){
		var elId="#"+startTime;
		var dateSpan="."+startDateSpan;
		var mySchedule = new Schedule({
			el: elId,
			clickCb: function (y,m,d) {
				$(dateSpan).val(formartDate(y,m,d));
				$(elId).hide();
			}
		});
	};
		//日期控件初始化--结束时间
	var initEndDate = function(endTime,endDateSpan){
		var elId = "#" + endTime;
		var dateSpan = "." + endDateSpan;
		var mySchedule = new Schedule({
			el: elId,
			clickCb: function (y,m,d) {
				$(dateSpan).val(formartDate(y,m,d));
				$(elId).hide();
			}
		});
	};
	$(".textBoxTitle .startTimeSpan").click(function(){
		$("#startTime").show();
		var mySchedule = new Schedule({
			el: '#startTime',
			clickCb: function (y,m,d) {
				$(".startTimeSpan").val(formartDate(y,m,d));
				$("#startTime").hide();
			}
		});
	})
	$(".textBoxTitle .endTimeSpan").click(function(){
		$("#endTime").show();
		var mySchedule = new Schedule({
			el: '#endTime',
			clickCb: function (y,m,d) {
				$(".endTimeSpan").val(formartDate(y,m,d));
				$("#endTime").hide();
			}
		});
	})


	$(".textBoxTitle .startTimeSpan1").click(function(){
		$("#startTime1").show();
		var mySchedule = new Schedule({
			el: '#startTime1',
			clickCb: function (y,m,d) {
				$(".startTimeSpan1").val(formartDate(y,m,d));
				$("#startTime1").hide();
			}
		});
	})
	$(".textBoxTitle .endTimeSpan1").click(function(){
		$("#endTime1").show();
		var mySchedule = new Schedule({
			el: '#endTime1',
			clickCb: function (y,m,d) {
				$(".endTimeSpan1").val(formartDate(y,m,d));
				$("#endTime1").hide();
			}
		});
	})

	$(".textBoxTitle .crcdStartTimeSpan").click(function(){
		$("#crcdStartTime").show();
		var mySchedule = new Schedule({
			el: '#crcdStartTime',
			clickCb: function (y,m,d) {
				$(".crcdStartTimeSpan").val(formartDate(y,m,d));
				$("#crcdStartTime").hide();
			}
		});
	})
	$(".textBoxTitle .deliveryTimeSpan").click(function(){
		$("#deliveryTime").show();
		var mySchedule = new Schedule({
			el: '#deliveryTime',
			clickCb: function (y,m,d) {
				$(".deliveryTimeSpan").val(formartDate(y,m,d));
				$("#deliveryTime").hide();
			}
		});
	})


	$(".textBoxTitle .crcdEndTimeSpan").click(function(){
		$("#crcdEndTime").show();
		var mySchedule = new Schedule({
			el: '#crcdEndTime',
			clickCb: function (y,m,d) {
				$(".crcdEndTimeSpan").val(formartDate(y,m,d));
				$("#crcdEndTime").hide();
			}
		})
	})

	$(".data .completionTime").click(function(){
		$("#completionTime").show();
		var mySchedule = new Schedule({
			el: '#completionTime',
			clickCb: function (y,m,d) {
				$(".completionTime").val(formartDate(y,m,d));
				$("#completionTime").hide();
			}
		});
	})

	$(".data .overdueTime").click(function(){
		$("#overdueTime").show();
		var mySchedule = new Schedule({
			el: '#overdueTime',
			clickCb: function (y,m,d) {
				$(".overdueTime").val(formartDate(y,m,d));
				$("#overdueTime").hide();
			}
		});
	})

	$("#startTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#endTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#crcdStartTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#deliveryTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#crcdEndTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#completionTime").mouseleave(function(){
		$(this).fadeOut();
	})

	$("#overdueTime").mouseleave(function(){
		$(this).fadeOut();
	})

    $("#effectDate").mouseleave(function(){
        $(this).fadeOut();
    })

    $("#expiredDate").mouseleave(function(){
        $(this).fadeOut();
    })
	//日期格式化
	function formartDate (y,m,d,symbol) {
		symbol = symbol || '-';
		m = (m.toString())[1] ? m : '0'+m;
		d = (d.toString())[1] ? d : '0'+d;
		return y+symbol+m+symbol+d
	}


	// 防止操作按钮溢出容器
    $(".reportMessages table").on("mouseenter",".foldBotton",function(){
        $(this).find("p").show();

        var wrapperBoxHeight = $(this).parents(".reportMessages").height() ; // 获取父容器高度
        var reBoxTop = $(this).parents(".reportMessages").offset().top; // 获取reportMessages弹框距离body顶部高度
        var pBoxTop = $(this).find("p").offset().top; // 获取p弹框距离body顶部高度
        var gapBoxTop = pBoxTop-reBoxTop; //p距离reportMessages顶部距离
        var pBoxHeight = $(this).find("p").height(); // 获取弹框高度


        if(pBoxHeight+gapBoxTop > wrapperBoxHeight){ //如果弹框高度+距离顶部高度大于外部元素的高度，则底部溢出
            $(this).find("p").addClass("active");
        }
    });
    $(".reportMessages table").on("mouseleave",".foldBotton",function(){
        $(this).find("p").removeClass("active");
        $(this).find("p").hide();
    })
})
