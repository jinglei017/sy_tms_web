//看板订单数量统计
function getKbStatistics(data){
	//当前完成
	if(data.dailyCompleteOrderCount == null){
		data.dailyCompleteOrderCount = 0;
	}
	//本月订单累计
	if(data.monthlySales == null){
		data.monthlySales = 0;
	}
	//今日订单总数
	if(data.dailyOrderCount == null){
		data.dailyOrderCount = 0;
	}
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

	var todayStatisticsHtml =  '<li>'+
									'<p class="txt">今日订单总数</p>'+
									'<p class="num">'+
										'<span>'+data.dailyOrderCount+'</span>'+
										'<em>单</em>'+
									'</p>'+
								'</li>'+
								'<li>'+
									'<p class="txt">当前完成</p>'+
									'<p class="num">'+
										'<span style="color:#00b050;">'+data.dailyCompleteOrderCount+'</span>'+
										'<em>单</em>'+
									'</p>'+
								'</li>'

	//本月订单累计
	var monthStatisticsHtml = '<li>'+
									'<p class="txt">本月订单累计</p>'+
									'<p class="num"> '+orderCountHtml+' 单</p>'+
								'</li>'+
								'<li>'+
									'<p class="txt">本月车次累计</p>'+
									'<p class="num"> '+carCrequencyHtml+' 次</p>'+
								'</li>'

	$(".mcTitle .todayStatistics").html(todayStatisticsHtml);
	$(".mcTitle .monthStatistics").html(monthStatisticsHtml);


}

//行政区订单统计图
function getAdOrderCountList(data){
	var adNameArr = [];
	var adOrderCountArr = [];
	for(var i = 0; i < data.length; i++){
		if(data[i].name == "上海市市辖区"){
			data[i].name = "市辖区"
		}
		adNameArr[adNameArr.length] = data[i].name;
		adOrderCountArr[adOrderCountArr.length] = data[i].orderCount;
	}
	getAdOrderCountListCharts(adNameArr,adOrderCountArr);
}

//行政区订单数量列表 —— 滚动
function getAdOrderCountList2(data) {
    var item = "";
    for(var i = 0; i < data.length; i++){
        if(data[i].name == "上海市市辖区"){
            data[i].name = "市辖区"
        }
        item += '<ul>'+
            '<li>'+data[i].name+'</li>'+
            '<li>'+data[i].orderCount+'</li>'+
            '</ul>'
    }
    $(".regionalOrderCharts").empty();
    $(".regionalOrderCharts").append("<div class='list'>"+item+"</li>");
    if(data.length > 12){
        var adOrderCountScroll = new scrollFun('regionalOrderCharts', 50, 0);
    }
}

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
        "top": rectHei+"px"
    })
    this.container.append(divNodeCopy);
    var scrollView = function(){
        var oldTop = (divChild.css("top") == "") ? 0 : parseInt(divChild.css("top"));
        if(oldTop < -rectHei){
            oldTop = 0;
        }

        divNode.css({
            "top": (oldTop - 1) + "px"
        })
        divNodeCopy.css({
            "top": (oldTop + rectHei - 1)+"px"
        })
        that.timer = setTimeout(scrollView, that.showTime);
    }
    this.timer = setTimeout(scrollView, that.showTime);
    this.container.hover(function(){
        clearTimeout(that.timer);
    },function(){
        that.timer = setTimeout(scrollView, that.showTime);
    })
}

//每月订单数
function getMonthOrderCountList(data){
	var dateArr = [];
	var totalCountArr = [];
	for(var i = 0; i < data.length; i++){
		var currentDate = data[i].shpDate.split("-");
		dateArr[dateArr.length] = currentDate[1] +'-'+ currentDate[2];
		totalCountArr[totalCountArr.length] = data[i].totalCount;
	}
	getMonthOrderCountCharts(dateArr,totalCountArr);
}

//订单区域统计
function getOrderSpreadRegionVo(data){
	var areaArr = [];
	var storeOrderCountArr = [];
	var coldChainOrderCountArr = [];
	var otherOrderCountArr = [];
	for(key in data){
		areaArr[areaArr.length] = key;
		storeOrderCountArr[storeOrderCountArr.length] = data[key].storeOrderCount;
		coldChainOrderCountArr[coldChainOrderCountArr.length] = data[key].coldChainOrderCount;
		otherOrderCountArr[otherOrderCountArr.length] = data[key].otherOrderCount;

	}
	getOrderSpreadRegionVoCharts(areaArr,storeOrderCountArr,coldChainOrderCountArr,otherOrderCountArr);
}

//订单分布统计
function getOrderSpreadVo(data){
	var distributionHtml = '<li>'+
								'<p class="left">订单总数</p>'+
								'<p class="line"><i style="width: 100%;">100%</i></p>'+
								'<p class="num">'+data.totalOrderCount+'</p>'+
							'</li>'+
							'<li>'+
								'<p class="left">卖场订单</p>'+
								'<p class="line"><i style="width: '+data.storeOrderRate+'%;">'+data.storeOrderRate+'%</i></p>'+
								'<p class="num">'+data.storeOrderCount+'</p>'+
							'</li>'+
							'<li>'+
								'<p class="left">冷链订单</p>'+
								'<p class="line"><i style="width: '+data.coldChainOrderRate+'%;">'+data.coldChainOrderRate+'%</i></p>'+
								'<p class="num">'+data.coldChainOrderCount+'</p>'+
							'</li>'+
							'<li>'+
								'<p class="left">其它订单</p>'+
								'<p class="line"><i style="width: '+data.otherOrderRate+'%;">'+data.otherOrderRate+'%</i></p>'+
								'<p class="num">'+data.otherOrderCount+'</p>'+
							'</li>'
	$(".distributionCon ul").html(distributionHtml);
}

//订单分布区域
function getOrderRegionVo(data){
	var orderRegionData = [{
			value: data.outerRingCount,
			name:'外环' + data.outerRingCount + '单'
		},{
			value: data.innerRingCount,
			name:'内环' + data.innerRingCount + '单'
		},{
			value: data.middleRingCount,
			name:'中环' +data.middleRingCount + '单'
		}];
	getOrderRegionVoCharts(orderRegionData)
}

//行政区订单统计图表
function getAdOrderCountListCharts(adNameArr,adOrderCountArr){
	var myChart = echarts.init(document.getElementById('regionalOrderCharts'));
	var option = {
	    color: ['#00b050'],
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
	    	top: '6%',
	        left: '6%',
	        right: '6%',
	        bottom: '6%',
	        containLabel: true
	    },
	    xAxis : [
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
	    yAxis : [
	        {
	            type : 'category',
	            data : adNameArr,
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
	    series : [
	    	{ // For shadow
	            type: 'bar',
	            data: adOrderCountArr
	        }
	    ]
	};
	myChart.setOption(option);
}


//每月订单数图表
function getMonthOrderCountCharts(dateArr,totalCountArr){
	var myChart = echarts.init(document.getElementById("orderNumberCharts"));
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
	                    color: "#fff",
	                    position: 'inside'
	                }
	            },
	            data: totalCountArr
	        }
	    ]
	};
	myChart.setOption(option);
}


//区域统计图表
function getOrderSpreadRegionVoCharts(areaArr,storeOrderCountArr,coldChainOrderCountArr,otherOrderCountArr){
	var myChart = echarts.init(document.getElementById('orderStatisticsChatrs'));

	var option = {
		color: ['#00b050','#37a2da','#ed7d31'],
		tooltip: {
	        trigger: 'axis',
	        axisPointer: {
	            type: 'cross',
	            crossStyle: {
	                color: '#999'
	            }
	        }
	   	},
	   	grid: {
	        left: '3%',
	        right: '5%',
	        top: '20%',
	        bottom: '5%',
	        containLabel: true
	    },
	    legend: {
	    	textStyle:{
                fontSize: "15",//字体大小
                color: '#ffffff'//字体颜色
            },
	        data:['卖场','冷链','其它']
	    },
	    xAxis: [
	        {
	            type: 'category',
	            data: ['内环','外环','中环'],
	            axisPointer: {
	                type: 'shadow'
	            },
	            axisLabel: {
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
	            axisLabel: {
	                formatter: '{value}'
	            },
	            axisLabel: {
	                textStyle:{
		                fontSize: "15",//字体大小
		                color: '#ffffff'//字体颜色
		            }
	            }
	        },
	    ],
	    series: [
	        {
	            name: '卖场',
	            type: 'bar',
	            stack: '总量',
	            barWidth: '50%',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'inside'
	                }
	            },
	            data: storeOrderCountArr
	        },
	        {
	            name: '冷链',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'inside'
	                }
	            },
	            data: coldChainOrderCountArr
	        },
	        {
	            name: '其它',
	            type: 'bar',
	            stack: '总量',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'inside'
	                }
	            },
	            data: otherOrderCountArr
	        }
	    ]
	};


//	var option = {
//		color: ['#00b050','#ffff00','#ed7d31'],
//		tooltip: {
//	        trigger: 'axis',
//	        axisPointer: {
//	            type: 'cross',
//	            crossStyle: {
//	                color: '#999'
//	            }
//	        }
//	   	},
//	   	grid: {
//	        left: '3%',
//	        right: '5%',
//	        top: '20%',
//	        bottom: '5%',
//	        containLabel: true
//	    },
//	    legend: {
//	    	textStyle:{
//              fontSize: "14",//字体大小
//              color: '#ffffff'//字体颜色
//          },
//	        data:['卖场','冷链','其他']
//	    },
//	    xAxis: [
//	        {
//	            type: 'category',
//	            data: areaArr,
//	            axisPointer: {
//	                type: 'shadow'
//	            },
//	            axisLabel: {
//	                textStyle:{
//		                fontSize: "14",//字体大小
//		                color: '#ffffff'//字体颜色
//		            }
//	            }
//	        }
//	    ],
//	    yAxis: [
//	        {
//	            type: 'value',
//	            axisLabel: {
//	                formatter: '{value}'
//	            },
//	            axisLabel: {
//	                textStyle:{
//		                fontSize: "14",//字体大小
//		                color: '#ffffff'//字体颜色
//		            }
//	            }
//	        },
//	    ],
//	    series: [
//	        {
//	            name:'卖场',
//	            type:'bar',
//	            data: storeOrderCountArr
//	        },
//	        {
//	            name:'冷链',
//	            type:'bar',
//	            data: coldChainOrderCountArr
//	        },
//	        {
//	            name:'其他',
//	            type:'bar',
//	            data: otherOrderCountArr
//	        }
//	    ]
//	};
	myChart.setOption(option);
}


//订单分布区域图表
function getOrderRegionVoCharts(orderRegionData){
	var myChart = echarts.init(document.getElementById('arealDistributeCharts'));
	var option = {
		color: ['#489bff','#ff403b','#b7ed48'],
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    series: [
	        {
	            name:'订单区域分布',
	            type:'pie',
	            radius: ['35%', '90%'],
	            center:['50%','50%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: true,
	                    color: "#fff",
	                    fontSize: "15",
	                    position: 'inner'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '26',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },

	            data: orderRegionData
	        }
	    ]
	};
	myChart.setOption(option);
}

// 页面自动刷新
function myrefresh(){
    window.location.reload();
}
setTimeout('myrefresh()',1800000);
