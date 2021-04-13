
/*——————————————————————公共参数，方法——————————————————————*/
/*————————————————参数————————————————*/
localStorage.removeItem("forgetCity");    // 页面初始化，清除之前点击的tws

localStorage.removeItem("provinceAdcode");
localStorage.removeItem("provinceName");
localStorage.removeItem("cityAdcode");
localStorage.removeItem("cityName");
localStorage.removeItem("districtAdcode");
localStorage.removeItem("districtName");

localStorage.removeItem("districtCode");
localStorage.removeItem("cuurrentHasChild");
localStorage.removeItem("cuurrentName");
localStorage.removeItem("propsCenter0");
localStorage.removeItem("propsCenter1");
localStorage.removeItem("cuurrentLevel");
localStorage.removeItem("cuurrentAdcode");

var userInfo = JSON.parse(localStorage.getItem("logininf"));

if(userInfo == null){
    window.location.href = "../../login.html";
}
// 接口查询时间，标记车集合,标记订单数量集合,标记收货商集合,标记订单点集合 ，，，，， “监控所有订单”界面的点的订单点，点击“监控所有订单”的次数
var serviceOrderDate = GetNowdate(),markersArray = [],orderMarkerArray = [],orderReceiptMarkerArray = [],pointsArray = [],pointsArray2 = [],switchDivBtnTimes = 0;

var loadFirst = 'true',contentISBlank = '<span class="color_white">---未查询到相关内容---</span>';  // 加载数据第一次显示（加载缓冲提示），查询结果为空时的页面提示内容

document.documentElement.style.fontSize = document.documentElement.clientWidth / 20 + 'px';
window.addEventListener("resize",function(){
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 20 + 'px';
});

// 服务商，地区级别（切换区域）
var adOrderCountArray = [];

/*————————————————公共函数方法————————————————*/

/* 判断字符串str是否包含子串substr */
function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

/*图表配置*/
// 柱形图 —— 竖
function PageChartBarOption(chart,chartTitle,yAxisList,seriesList){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        color: ['#f45b5b'],
        title: {
            text: chartTitle,
            x: 'center',
            align: 'right',
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:16
            }
        },
        /*tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            position: ['1%', '5%']
        },*/
        tooltip: {                         // 修改点击图表的弹出框
            trigger: 'item',
            position: ['1%', '5%'],
            formatter: function(params) {
                var res ='';
                var myseries = seriesList;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name+'</br>'+myseries[i].value +'&nbsp;'+ myseries[i].minUnit;
                    }

                }
                return res;
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
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
                data : yAxisList,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel : {//坐标轴刻度标签的相关设置。
                    interval:0,
                    rotate:"90"
                }
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:chartTitle,
                type:'bar',
                barWidth: '65%', //柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                data:seriesList
            }
        ]
    });
    chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
}

// 柱形图 —— 横
function PageChartBarOption2(chart,chartTitle,yAxisList,seriesList){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        color: ['#fff'],
        title: {
            text: chartTitle,
            x: 'center',
            align: 'right',
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:16
            }
        },
        tooltip: {                         // 修改点击图表的弹出框
            trigger: 'item',
            position: ['1%', '5%'],
            formatter: function(params) {
                var res ='';
                var myseries = seriesList;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name+'</br>'+myseries[i].value +'&nbsp;'+ myseries[i].minUnit;
                    }

                }
                return res;
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        grid: {
            top: '14%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel : {//坐标轴刻度标签的相关设置。
                color:'#fff'
            }
        },
        yAxis: {
            type: 'category',
            data: yAxisList,
            axisLabel : {//坐标轴刻度标签的相关设置。
                color:'#fff'
            }
        },
        series : [
            {
                name:chartTitle,
                type:'bar',
                barWidth: '80%',  //柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                itemStyle: {
                    normal: {
                        color: function(params) {  // 定制显示颜色（按顺序）
                            var colorList = ['#f53642','#64BD3D','#f9962d','#558ed5','#29AAE3', '#B74AE5','#0AAF9F','#E89589','#16A085','#4A235A','#C39BD3 ','#F9E79F','#BA4A00','#ECF0F1','#616A6B','#EAF2F8','#4A235A','#3498DB' ];
                            return colorList[params.dataIndex]
                        }
                    }
                },
                data:seriesList
            }
        ]
    });
    chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
}

// 多折线图
function PageChartLineOption(chart,chartTitle,seriesList,date){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        title: {
            text: chartTitle,
            x: 'center',
            align: 'right',
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:16
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        color:['#f25e81','#91ed7c','#f7a35c','#8185e9','#7db6ed'],
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel : {//坐标轴刻度标签的相关设置。
                interval:0,
                rotate:"30",
                color:'#fff'
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {show: true}, // 控制网格线是否显示
            splitLine: {
                show: false  // 去除y轴上的刻度线
            },
            axisTick: {
                show: false
            },
            axisLabel : {//坐标轴刻度标签的相关设置。
                color:'#fff'
            }
        },
        series: seriesList
    });
    chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
}

// 饼图
function PageChartPieOption(chart,chartTitle,legendData,seriesList){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        title: {
            x:'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            position: ['1%', '7%']
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        color:['#91ed7c','#8185e9','#f55a5a','#f7a35c'],
        legend: {
            orient: 'vertical',
            x: 'left',
            data: legendData
        },
        series:  [
            {
                name: '近一周订单类型占比',
                type: 'pie',
                radius : '55%',
                center: ['50%', '50%'],
                data:seriesList,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });
    chart.showLoading();    //数据加载完之前先显示一段简单的loading动画
}

/* 圆环图——图表（初始化后），图表标题（主标题） */
function PageChartPieOption2(chart,chartTitle,subtext,seriesList){
    chart.setOption({  // 显示标题，图例和空的坐标轴
        title: {
            text: chartTitle,
            x:'center',
            textStyle:{
                color:'#fff',
                fontSize:16
            },
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color: ['#f25e81','#91ed7c','#f7a35c','#8185e9','#7db6ed'],
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '75%',
                center: ['50%', '53%'],
                data:seriesList,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    });
}

/*文字滚动*/
var mytimer,mytimer2;
function scrollBox(area,text1,text2){
    text2.innerHTML = text1.innerHTML;
    function scrollUp(){
        if(area.scrollTop>=text1.offsetHeight){
            area.scrollTop=0;
        }else{
            area.scrollTop++
        }
    }
    var time = 70;
    mytimer = setInterval(scrollUp,time);
}

function scrollBox2(area,text1,text2){
    text2.innerHTML = text1.innerHTML;
    function scrollUp2(){
        if(area.scrollTop>=text1.offsetHeight){
            area.scrollTop=0;
        }else{
            area.scrollTop++
        }
    }
    var time = 70;
    mytimer2 = setInterval(scrollUp2,time);
}

/*生成范围随机数*/
function getRandom(min, max){
    var r = Math.random() * (max - min);
    var re = Math.round(r + min);
    re = Math.max(Math.min(re, max), min)

    return re;
}

/*ajax请求（地址，方式，传参，成功回调函数，失败提示）*/
function ajaxRequest(url,method,data,suc,tip){
    if(!data){
        $.ajax({
            url: url,
            type: method,
            contentType : 'application/json',
            data: '',
            dataType: "json",
            async: false,
            beforeSend: function () {
                if(loadFirst=='true') {
                    loadData('show');
                    loadFirst = 'false';
                }
            },
            success: function (response) {
                if (loadFirst=='false') {
                    loadData('hide');
                    loadFirst = 'true';
                }
                if (suc != "") {
                    eval(suc + "(" + JSON.stringify(response) + ")");
                }
            },
            error: function () {
                loadData('show',tip+'出错，请稍后重试！',true);
                $(".maskLayer").hide();
            }
        });
    }else{
        $.ajax({
            url: url,
            type: method,
            contentType : 'application/json',
            data: JSON.stringify(data),
            dataType: "json",
            async: false,
            beforeSend: function () {
                if(loadFirst=='true') {
                    loadData('show');
                    loadFirst = 'false';
                }
            },
            success: function (response) {
                if (loadFirst=='false') {
                    loadData('hide');
                    loadFirst = 'true';
                }
                if (suc != "") {
                    eval(suc + "(" + JSON.stringify(response) + ")");
                }
            },
            error: function () {
                loadData('show',tip+'出错，请稍后重试！',true);
                $(".maskLayer").hide();
            }
        });
    }
}

/*提示语：delayed 延时自动消失；text 提示语；state 状态 显示show消失任意*/
function loadData(state, text, delayed, callback) {
    var t = text ? text : '努力查询中...';
    if ($('.loading').length < 1) {
        var html = '<div class="loading"><div class="fixed_content"></div></div>';
        $('body').append(html);
    }
    $('.loading .fixed_content').text(t);
    if (state == 'show') {
        $('.loading').fadeIn(300);
        if (delayed) {
            setTimeout(function () {
                $('.loading').fadeOut(700, function () {
                    if (callback) {
                        callback()
                    }
                });
            }, 800)
        }
    }
    else {
        $('.loading').fadeOut(400);
    }
}

/*取得当天日期(yyyy-MM-dd)*/
function GetNowdate() {
    var nowDate = new Date();
    var str = nowDate.getFullYear() + "-" + NumToString(nowDate.getMonth() + 1) + "-" + NumToString(nowDate.getDate());
    return str;
}

function NumToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}

Date.prototype.pattern = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};


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
