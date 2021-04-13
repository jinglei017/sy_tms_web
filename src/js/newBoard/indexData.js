var logininf = JSON.parse(localStorage.getItem("logininf"));
$(".myfont").html(logininf.tenantName+"中国综合数据服务中心");

$(function(){
    /*$(".startTimeSpan").val(getQueryTime(1));
    $(".endTimeSpan").val(getQueryTime(0));*/
    getSuyeDataCenter();
});
function getSuyeDataCenter(){
	getRequest(chartUrl + "/query/suyeDataCenter?token="+logininf.token,function(data){
		//看板订单数量和仓库数量统计
		getKbStatistics(data.result)
		//车次数图表
		if(data.result.carCrequencyVoList != null){
			getCarCrequencyVoList(data.result.carCrequencyVoList);
		}
		//今日客户订单
		if(data.result.customerOrderVoList != null){
			getCustomerOrderVoList(data.result.customerOrderVoList);
		}
		//今日运营车辆
		if(data.result.transportMonitorList != null){
			getTransportMonitorList(data.result.transportMonitorList);
		}
		//各大区域仓库统计
//		if(data.result.warehouseRegionVoList != null){
//			getWarehouseRegionVoList(data.result.warehouseRegionVoList);
//		}
		//每月客户订单数
		if(data.result.monthlyOrderCountList != null){
			getMonthlyOrderCount(data.result.monthlyOrderCountList);
		}
		//可用仓库资源
		if(data.result.warehouseVoList != null){
			getWarehouseVoList(data.result.warehouseVoList);
		}
		//车辆区域分布
		if(data.result.carRegionVoList != null){
			getCarRegionVoList(data.result.carRegionVoList);
		}
		if(data.result.salesVoList != null){
			getSalesVoList(data.result.salesVoList);
		}else{
            $(".dailySalesCharts").empty();
        }

	},1);
    $.ajax({
        url: chartUrl + "/query/orderCountListByGroup?token="+logininf.token,
        type: "get",
        contentType : 'application/json',
        success: function (data) {
            //订单列表
            if(data.result != null){
                getOrderInfoVoList1(data.result);
            }
        }
    });
}

/*$(".dateQuery .startTimeSpan").click(function(){
    $("#startTime").show();
    var mySchedule = new Schedule({
        el: '#startTime',
        clickCb: function (y,m,d) {
            $(".startTimeSpan").val(formartDate(y,m,d));
            $("#startTime").hide();
        }
    });
});
$(".dateQuery .endTimeSpan").click(function(){
    $("#endTime").show();
    var mySchedule = new Schedule({
        el: '#endTime',
        clickCb: function (y,m,d) {
            $(".endTimeSpan").val(formartDate(y,m,d));
            $("#endTime").hide();
        }
    });
});
$("#startTime").mouseleave(function(){
    $(this).fadeOut();
});
$("#endTime").mouseleave(function(){
    $(this).fadeOut();
});
$(".dateQuery .dateChangeBtn").click(function(){

});*/

//看板订单数量和仓库数量统计
function getKbStatistics(data){
	if(data.warehouseCount == null){
		data.warehouseCount = 0;
	}
	if(data.usableArea == null){
		data.usableArea = 0;
	}
	if(data.totalArea == null){
		data.totalArea = 0;
	}
	if(data.monthlySales == null){
		data.monthlySales = 0;
	}
	if(data.dailyOrderCount == null){
		data.dailyOrderCount = 0;
	}
	if(data.totalOrderCount == null){
		data.totalOrderCount = 0;
	}
	if(data.totalCarCount == null){
		data.totalCarCount = 0;
	}

	$(".warehousesItem .mliTitle .num").html('<b>'+data.warehouseCount+'</b> 个');
	$(".warehousesItem .warehousesCon .txt1").html('<b>'+data.usableArea+'</b>平米 <b>/</b> <b>'+data.totalArea+'</b>平米');
	//$(".usableWarehouseItem .mliTitle .num").html('<b>'+data.usableArea+'</b> 平米');
	$(".dailySales .mriTitle .num").html('<b>'+data.monthlySales+'</b> 元');
    $(".dailySales .rsTitle .num").html('<b>'+data.monthlySales+'</b> 元');
	$(".todayOrder .mriTitle .num").html('<b>'+data.dailyOrderCount+'</b> 单');
	//平台信息统计
    var totalArea = '0',totalOrderCount = '0',totalCarCount = '0',totalSales = '0';
    if(data.totalArea){
        totalArea = data.totalArea;
    }
    if(data.totalOrderCount){
        totalOrderCount = data.totalOrderCount
    }
    if(data.totalCarCount){
        totalCarCount = data.totalCarCount
    }
    if(data.totalSales){
        totalSales = data.totalSales
    }
	var totalStatisticsHtml = '<li>'+
									'<p class="num"><b>'+totalArea+'</b>平方米</p>'+
									'<p class="txt">仓库面积</p>'+
								'</li>'+
								'<li>'+
									'<p class="num"><b>'+totalOrderCount+'</b>单</p>'+
									'<p class="txt">配送订单累计</p>'+
								'</li>'+
								'<li>'+
									'<p class="num"><b>'+totalCarCount+'</b>辆</p>'+
									'<p class="txt">车辆总数</p>'+
								'</li>'+
								'<li>'+
									'<p class="num"><b>'+totalSales+'</b>元</p>'+
									'<p class="txt">销售金额累计</p>'+
								'</li>';
	//本月车次累计
	var carCrequencyHtml = "";
	if(data.monthlyCarCrequency != null){
		var carCrequencyArr = data.monthlyCarCrequency.toString().split("");
		for(var i = 0; i < carCrequencyArr.length; i++){
			carCrequencyHtml += '<span>'+carCrequencyArr[i]+'</span>'
		}
	}else{
		carCrequencyHtml = '<span>0</span>';
	}

	//本月订单累计
	var orderCountHtml = "";
	if(data.monthlyOrderCount != null){
		var orderCountArr = data.monthlyOrderCount.toString().split("");
		for(var i = 0; i < orderCountArr.length; i++){
			orderCountHtml += '<span>'+orderCountArr[i]+'</span>'
		}
	}else{
		orderCountHtml = '<span>0</span>';
	}

	//今日订单总数
	var todayStatisticsHtml =  '<p class="txt">今日订单总数</p>'+
								'<p class="num">'+
									'<span>'+data.dailyOrderCount+'</span>'+
									'<em>单</em>'+
								'</p>'

	var monthStatisticsHtml = '<li>'+
									'<p class="txt">本月订单累计</p>'+
									'<p class="num"> '+orderCountHtml+' 单</p>'+
								'</li>'+
								'<li>'+
									'<p class="txt">本月车次累计</p>'+
									'<p class="num"> '+carCrequencyHtml+' 次</p>'+
								'</li>'

	$(".mcTitle .totalStatistics").html(totalStatisticsHtml);
	$(".mcTitle .monthStatistics").html(monthStatisticsHtml);
	$(".mcTitle .todayStatistics").html(todayStatisticsHtml);

}

//可用仓库资源
function getWarehouseVoList(data){
	var usableWareItem = "",name = "";
    for(var i = 0; i < data.length; i++){
        if(data[i].depotType=='COLD'){
            name = "(冷)"+data[i].name;
        }else if(data[i].depotType=='NORM'){
            name = "(常)"+data[i].name;
        }else if(data[i].depotType=='MIXI'){
            name = "(双)"+data[i].name;
        }else{
            name = "--"
        }
        usableWareItem += '<ul>'+
            '<a>'+
            '<li>'+name+'</li>'+
            '<li>'+data[i].usableArea+'|'+data[i].totalArea+'</li>'+
            '</a>'+
            '</ul>'
    }
	if(data.length > 8){
        $(".usableWareList .list").html(usableWareItem);
		var usableWareListScroll = new scrollFun('usableWareListcon', 50, 0);
	}else{
        $(".usableWareList .usableWareListcon").empty();
        $(".usableWareList .usableWareListcon").append("<div class='list'>"+usableWareItem+"</li>");
    }
}

//车次数图表数据
function getCarCrequencyVoList(data){
	var dateArr = [];
	var totalCountArr = [];
	for(var i = 0; i < data.length; i++){
		var currentDate = data[i].shpDate.split("-");
		dateArr[dateArr.length] = currentDate[1] +'-'+ currentDate[2];
		totalCountArr[totalCountArr.length] = data[i].totalCount;
	}
	getCarCrequencyVoCharts(dateArr,totalCountArr);
}

//今日运营车辆
function getTransportMonitorList(data){
	var todayVehicleItem = "";
	for(var i = 0; i < data.length; i++){
		todayVehicleItem += '<ul>'+
							'<li>'+data[i].eqpNo+'</li>'+
            				'<li title="'+data[i].partyName+'">'+data[i].partyName+'</li>'+
							'<li>'+data[i].completeCount+'/'+data[i].totalCount+'</li>'+
						'</ul>'
	}
	if(data.length > 12){
        $(".todayVehicleList .list").html(todayVehicleItem);
		var todayOrderScroll = new scrollFun('todayVehicleList', 50, 0);
	}else{
        $(".todayVehicleList").empty();
        $(".todayVehicleList").append("<div class='list'>"+todayVehicleItem+"</li>");
    }

}

//车辆区域分布
function getCarRegionVoList(data){
	var carLocationItem = "";
	for(var i = 0; i < data.length; i++){
		carLocationItem += '<ul>'+
            				'<a>'+
								'<li>'+data[i].name+'('+data[i].eqpNature+')'+'</li>'+
								'<li>'+data[i].count+'</li>'+
								'<li>'+data[i].operateCount+'</li>'+
							'</a>'+
						 '</ul>'
	}
    if(data.length > 6){
        $(".carLocationList .list").html(carLocationItem);
        var carLocationScroll = new scrollFun('carList', 50, 0);
    }else{
        $(".carLocationList .carList").empty();
        $(".carLocationList .carList").append("<div class='list'>"+carLocationItem+"</li>");
    }
}

function getMonthlyOrderCount(data){
	var dateArr = [];
	var monthlyOrderArr = [];
	for(var i = 0; i < data.length; i++){
		if(data[i].shpDate != null){
			var currentDate = data[i].shpDate.split("-");
			dateArr[dateArr.length] = currentDate[1];
		}else{
			dateArr[dateArr.length] = "-";
		}
		monthlyOrderArr[monthlyOrderArr.length] = data[i].totalCount;
	}
	getMonthlyOrderCountCharts(dateArr,monthlyOrderArr);
}

//每月销售额
function getSalesVoList(data){
	var dateArr = [];
	var salesArr = [];
	for(var i = 0; i < data.length; i++){
		var currentDate = data[i].date.split("年");
		dateArr[dateArr.length] = currentDate[1]
		salesArr[salesArr.length] = data[i].sales;
	}
	getSalesVoListCharts(dateArr,salesArr);
    getSalesVoListCharts1(dateArr,salesArr);

}

//今日客户订单
function getCustomerOrderVoList(data){
	var todayOrderItem = "";
	for(var i = 0; i < data.length; i++){
		todayOrderItem += '<ul>'+
							'<li>'+data[i].partyName+'</li>'+
							'<li>'+data[i].totalCount+'</li>'+
						'</ul>'
	}
    $(".todayOrderList").empty();
    $(".todayOrderList").append("<div class='list'>"+todayOrderItem+"</li>");
	if(data.length > 12){
		var todayOrderScroll = new scrollFun('todayOrderList', 50, 0);
	}
}

//各大区域仓库统计
//function getWarehouseRegionVoList(data){
//	var regionData = [];
//	var coolWhData = [];
//	var normalWhData = [];
//	var cWhData = [];
//	for(var i = 0; i < data.length; i++){
//		regionData[regionData.length] = data[i].regionName;
//		coolWhData[coolWhData.length] = data[i].coolWarehouseCount;
//		normalWhData[normalWhData.length] = data[i].normalWarehouseCount;
//		cWhData[cWhData.length] = data[i].cWarehouseCount;
//	}
//	getWarehouseRegionVoCharts(regionData,coolWhData,normalWhData,cWhData);
//}
//创建地图
var map = new AMap.Map('platformStatsMap', {
    zoom: 4,
    center: [105.838526,31.838013],
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});
//订单列表
var markersArray1 = [],markersArray = [];
function removeMarkers(){
    $(".amap-info-contentContainer").html("");
    map.remove(markersArray1);markersArray1 = [];
    map.remove(markersArray);markersArray = [];
}
function getOrderInfoVoList1(data){
    removeMarkers();
    var testData = data;
    setTimeout(function(){
        for(var i = 0; i < testData.length; i++){
            if(testData[i].stoLatLng != null && testData[i].stoLatLng != undefined && testData[i].stoLatLng !=""){
                var item = testData[i].stoLatLng.split(",");
                var itemArr = [item[0],item[1]];
                var newDiv = document.createElement("div");
                newDiv.innerHTML = '<img src="../../img/mark_g.png" style="width: 13px;height: 23px;"/>' +
                '<div class="mapNumDiv">'+testData[i].orderCount+'单</div>';
                marker = new AMap.Marker({
                    position: itemArr,
                    map: map,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);
                markersArray1.push(marker);
            }
        }
    },300)
}
//信息窗体
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)});
//标记点marker的点击事件
function markerClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}

//7日订单数量
function getWeekOrderCountList(data){
	var dateArr = [];
	var totalCountArr = [];
	for(var i = 0; i < data.length; i++){
		var currentDate = data[i].shpDate.split("-");
		dateArr[dateArr.length] = currentDate[1] +'-'+ currentDate[2];
		totalCountArr[totalCountArr.length] = data[i].totalCount;
	}
	getWeekOrderCountCharts(dateArr,totalCountArr);
}

//今日订单完成率
function getOrderCountInfoVo(data){
	var data = [{value:data.completeCount, name:'完成'},{value:data.dispatchCount, name:'在途'},{value:data.exceCount,name:'异常'}];
	var newData = [];
	var titleData = [];
	for(var i = 0 ; i < data.length; i++){
		newData.push({
			value: data[i].value,
			name: data[i].name + data[i].value
		})
		titleData[titleData.length] = data[i].name + data[i].value;
	}
	getOrderCountInfoVoCharts(newData,titleData);
}

//7日车辆满载率
function getFullLoadRateList(data){
	var dateArr = [];
	var highLoadArr = [];
	var currentLoadArr = [];
	var loadRateArr = [];
	for(var i = 0; i < data.length; i++){
		var currentDate = data[i].shpDate.split("-");
		dateArr[dateArr.length] = currentDate[1] +'-'+ currentDate[2];
		highLoadArr[highLoadArr.length] = data[i].totalCount;
		currentLoadArr[currentLoadArr.length] = data[i].fullLoadCount;
		loadRateArr[loadRateArr.length] = data[i].fullLoadRate;
	}
	getFullLoadRateCharts(dateArr,highLoadArr,currentLoadArr,loadRateArr);
}

//7日订单图表
function getWeekOrderCountCharts(dateArr,totalCountArr){
	publicColhCharts("orderNumCharts",dateArr,totalCountArr)
}

//车次图表
function getCarCrequencyVoCharts(dateArr,totalCountArr){
	publicColhCharts("classNumberCharts",dateArr,totalCountArr)
}

//公用柱状图表
function publicColhCharts(id,dateArr,totalCountArr){
	var myChart = echarts.init(document.getElementById(id));
	var option = {
	    color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	    	top: '5%',
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : dateArr,
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    series : [
	    	{ // For shadow
	            type: 'bar',
	            itemStyle: {
	                normal: {color: 'rgba(0,0,0,0.05)'}
	            },
	            barGap:'-100%',
	            barCategoryGap:'40%',
	            animation: false
	        },
	        {
	            type: 'bar',
	            itemStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(
	                        0, 0, 0, 1,
	                        [
	                            {offset: 0, color: '#48a9ff'},
	                            {offset: 0.5, color: '#2196ff'},
	                            {offset: 1, color: '#098bff'}
	                        ]
	                    )
	                },
	                emphasis: {
	                    color: new echarts.graphic.LinearGradient(
	                        0, 0, 0, 1,
	                        [
	                            {offset: 0, color: '#098bff'},
	                            {offset: 0.7, color: '#2196ff'},
	                            {offset: 1, color: '#48a9ff'}
	                        ]
	                    )
	                }
	            },
	            label: {
	                normal: {
	                    show: true,
	                    color: '#fff',
	                    fontSize: "16",
	                    position: 'inside'
	                }
	            },
	            data: totalCountArr
	        }
	    ]
	};
	myChart.setOption(option);
}
//每月销售额图表
function getSalesVoListCharts(dateArr,salesArr){
	var myChart = echarts.init(document.getElementById('dailySalesCharts'));
	var option = {
	    color: ['#3398DB'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : dateArr,
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel:{
	            	interval: 0,
		            rotate: 90,
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    series : [
	    	{ // For shadow
	            type: 'bar',
	            barGap:'-100%',
	            barCategoryGap:'40%',
	            animation: false
	        },
	        {
	            type: 'bar',
	            itemStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(
	                        0, 0, 0, 1,
	                        [
	                            {offset: 0, color: '#48a9ff'},
	                            {offset: 0.5, color: '#2196ff'},
	                            {offset: 1, color: '#098bff'}
	                        ]
	                    )
	                },
	                emphasis: {
	                    color: new echarts.graphic.LinearGradient(
	                        0, 0, 0, 1,
	                        [
	                            {offset: 0, color: '#098bff'},
	                            {offset: 0.7, color: '#2196ff'},
	                            {offset: 1, color: '#48a9ff'}
	                        ]
	                    )
	                }
	            },
	            label: {
	                normal: {
	                    show: true,
	                    color: '#fff',
	                    fontSize: "16",
	                    position: 'inside'
	                }
	            },
	            data: salesArr
	        }
	    ]
	};
	myChart.setOption(option);
}
function getSalesVoListCharts1(dateArr,salesArr){
    var myChart = echarts.init(document.getElementById('dailySalesCharts1'));
    var option = {
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            top: '5%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : dateArr,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel:{
                    interval: 0,
                    rotate: 30,
                    show: true,
                    textStyle:{
                        fontSize: "15",//字体大小
                        color: '#ffffff'//字体颜色
                    }
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel:{
                    show: true,
                    textStyle:{
                        fontSize: "15",//字体大小
                        color: '#ffffff'//字体颜色
                    }
                }
            }
        ],
        series : [
            { // For shadow
                type: 'bar',
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#48a9ff'},
                                {offset: 0.5, color: '#2196ff'},
                                {offset: 1, color: '#098bff'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#098bff'},
                                {offset: 0.7, color: '#2196ff'},
                                {offset: 1, color: '#48a9ff'}
                            ]
                        )
                    }
                },
                label: {
                    normal: {
                        show: true,
                        color: '#fff',
                        fontSize: "16",
                        position: 'inside'
                    }
                },
                data: salesArr
            }
        ]
    };
    myChart.setOption(option);
}

//今日订单完成率图表
function getOrderCountInfoVoCharts(data,titleData){
	var myChart = echarts.init(document.getElementById('orderFillRateCharts'));
	var option = {
		color: ['#f9962d','#64BD3D','#f53642'],
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)",
	        color: '#fff'
	    },
	    series: [
	        {
	        	name:'订单完成率',
	            type:'pie',
	            radius: ['40%', '90%'],
	            center:['50%','50%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
                        position: 'inner',
                        fontSize: "16"
                    }
	            },
	            data: data
	        }
	    ]
	};
	myChart.setOption(option);
}

//7日车辆满载率
function getFullLoadRateCharts(dateArr,highLoadArr,currentLoadArr,loadRateArr){
	var myChart = echarts.init(document.getElementById('vehiclesCarryConCharts'));
	var option = {
		color: ['#32c5e9','#ffd339','#37a2da'],
	    grid: {
			left: "3%",
			right: "5%",
			top: "20%",
			bottom: "3%",
			containLabel: !0
		},
		tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross'
	        }
	    },
		legend: {
			textStyle: {
				fontSize: "15",
				color: "#ffffff"
			},
			data: ['运营车次','满载车次','满载率']
		},
	    xAxis: [
	        {
	            type: 'category',
	            data: dateArr,
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    yAxis: [
	        {
	            type: 'value',
	            position: 'left',
	            axisLine: {
	                lineStyle: {
	                    color: colors[0]
	                }
	            },
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        },
	        {
	            type: 'value',
	            position: 'right',
	            min: 0,
            	max: 100,
	            axisLine: {
	                lineStyle: {
	                    color: colors[2]
	                }
	            },
	            axisLabel:{
		        	show: true,
		        	formatter: '{value} %',
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    series: [
	        {
	            name:'运营车次',
	            type:'bar',
	            barGap: 0,
	            data: highLoadArr
	        },
	        {
	            name:'满载车次',
	            type:'bar',
	            data: currentLoadArr
	        },
	        {
	            name:'满载率',
	            type:'line',
	            yAxisIndex: 1,
	            data: loadRateArr
	        }
	    ]
	};
	myChart.setOption(option);
};

function getMonthlyOrderCountCharts(dateArr,monthArr){
	var myChart = echarts.init(document.getElementById('rangeStatisticsCharts'));
	var option = {
	    color: ['#32d4fb'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	        left: '3%',
	        right: '4%',
	        bottom: '3%',
	        top: '5%',
	        containLabel: true
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : dateArr,
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel:{
	            	interval: 0,
		            rotate: 0,
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            axisLabel:{
		        	show: true,
		        	textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
		        }
	        }
	    ],
	    series : [
	    	{ // For shadow
	            type: 'bar',
	            itemStyle: {
	                normal: {color: 'rgba(0,0,0,0.05)'}
	            },
	            barGap:'-100%',
	            barCategoryGap:'40%',
	            animation: false
	        },
	        {
	            type: 'bar',
	            label: {
	                normal: {
	                    show: true,
                        color: '#fff',
                        rotate: 90,
	                    fontSize: "14",
	                    position: 'inside'
	                }
	            },
	            data: monthArr
	        }
	    ]
	};
	myChart.setOption(option);
}


//仓库图表
//function getWarehouseRegionVoCharts(regionData,coolWhData,normalWhData,cWhData){
//	var myChart = echarts.init(document.getElementById('rangeStatisticsCharts'));
//	var option = {
//		color: ['#489bff','#ff403b','#b7ed48'],
//	    tooltip : {
//	        trigger: 'axis',
//	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//	        }
//	    },
//	    legend: {
//	    	textStyle:{
//              fontSize: "14",//字体大小
//              color: '#ffffff'//字体颜色
//          },
//	        data: ['冷库','常温','C仓']
//	    },
//	    grid: {
//	        left: '3%',
//	        right: '5%',
//	        top: '20%',
//	        bottom: '3%',
//	        containLabel: true
//	    },
//	    xAxis: {
//	        type: 'value',
//	        data: [],
//          axisLabel: {
//              show: true,
//              textStyle:{
//	                fontSize: "13",//字体大小
//	                color: '#ffffff'//字体颜色
//	            },
//          }
//	    },
//	    yAxis: {
//	        type: 'category',
//	        data: regionData,
//	        axisLabel:{
//	        	show: true,
//	        	textStyle:{
//	                fontSize: "14",//字体大小
//	                color: '#ffffff'//字体颜色
//	            }
//	        }
//
//	    },
//	    series: [
//	        {
//	            name: '冷库',
//	            type: 'bar',
//	            stack: '总量',
//	            label: {
//	                normal: {
//	                    show: true,
//	                    position: ''
//	                }
//	            },
//	            data: coolWhData
//	        },
//	        {
//	            name: '常温',
//	            type: 'bar',
//	            stack: '总量',
//	            label: {
//	                normal: {
//	                    show: true,
//	                    position: ''
//	                }
//	            },
//	            data: normalWhData
//	        },
//	        {
//	            name: 'C仓',
//	            type: 'bar',
//	            stack: '总量',
//	            label: {
//	                normal: {
//	                    show: true,
//	                    position: ''
//	                }
//	            },
//	            data: cWhData
//	        }
//	    ]
//	};
//	myChart.setOption(option);
//}

//滚动
var scrollFun = function(container,showTime,scrollTime){
    this.timer = null;
    this.showTime = showTime;
    this.container = $("."+container);
    $("."+container).find(".listClone").remove();
    var divChild = $("."+container).find(".list");
    var divNode = divChild.eq(0);
    var that = this;
    divNode.css("top","0");
    var rectHei = divNode.height();
    var divNodeCopy = divNode.clone(true);
    divNodeCopy.addClass("listClone");
    divNodeCopy.css({
        "top": rectHei + "px"
    });
    this.container.append(divNodeCopy);
    var scrollView = function () {
        var oldTop = (divChild.css("top") == "") ? 0 : parseInt(divChild.css("top"));
        if (oldTop < -rectHei) {
            oldTop = 0;
        }
        divNode.css({
            "top": (oldTop - 1) + "px"
        });
        divNodeCopy.css({
            "top": (oldTop + rectHei - 1) + "px"
        });
        that.timer = setTimeout(scrollView, that.showTime);
    };
    this.timer = setTimeout(scrollView, that.showTime);
    this.container.hover(function(){
        clearTimeout(that.timer);
    },function(){
        that.timer = setTimeout(scrollView, that.showTime);
    });
};

//创建背景地图
var map1 = new AMap.Map('container', {
    mapStyle: 'amap://styles/' + AmapQdStyle_dark,
    resizeEnable: true,
    zoom: 5,
    center: [105.4976,37.1697],
});

// 页面自动刷新
function myrefresh(){
    window.location.reload();
}
setTimeout('myrefresh()',1800000);


function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}
function getQueryTime(dateParmes) {
    var date = new Date();
    var year, month, day;
    date.setDate(date.getDate() - dateParmes);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    return s;
}
