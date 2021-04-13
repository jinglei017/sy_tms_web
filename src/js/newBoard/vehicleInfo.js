var app = new Vue({
    el: '#overall',
    data: {
        logininf: JSON.parse(localStorage.getItem("logininf")),
        eqpInfo: [],
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(12, 5)}), //信息窗体
        carMarkerType: 'clLatLng',
        tenantName: '',
        eqpStatusCountVo: {},
        monthCarCount: '',
        monthEqpNatureCountList: {
            cold: {},
            norm: {},
            mixi: {},
            else: {}
        },
        allOrderNatureCount: {},
        allEqpNatureCount: {},
        allOrderTotalCounts: [],
        operateOrderNatureCountToday: {},
        operateOrderTotalCounts: [],
        monthCarCountByDateGroup: {
            normCountList: [],
            mixiCountList: [],
            coldCountList: [],
            otherCountList: [],
            totalCountList: []
        },
        colorList: ['#00b050','#ffff00','#8160cb','#ed7d31'],
        monthCarGroupDateList: [],
        coorLatLngList: [],
        markerAcceptArraySeq: [],
        arrows: 'right'
    },
    methods: {
        //获取数据
        getEqpDataCenter(){
            var that = this;
            that.normCountList =[];
            getRequest(chartUrl + "/query/eqpDataCenter.json?token="+that.logininf.token,function(data){
                //车辆总数
                if(data.result.eqpStatusCountVo != null){
                    that.eqpStatusCountVo = data.result.eqpStatusCountVo;
                    if(that.eqpStatusCountVo.carTotal == null){
                        that.eqpStatusCountVo.carTotal = "";
                    }
                    if(that.eqpStatusCountVo.freeCarCount == null){
                        that.eqpStatusCountVo.freeCarCount = "";
                    }
                    if(that.eqpStatusCountVo.operateCarCount == null){
                        that.eqpStatusCountVo.operateCarCount = "";
                    }
                }else{
                    that.eqpStatusCountVo = {
                        carTotal: "",
                        freeCarCount: "",
                        operateCarCount: ""
                    };
                }

                //本月车次统计
                if(data.result.monthCarCount != null){
                    that.monthCarCount = data.result.monthCarCount;
                }
                if(data.result.monthEqpNatureCountList.length){
                    for(var i=0;i<data.result.monthEqpNatureCountList.length;i++){
                        if(data.result.monthEqpNatureCountList[i].eqpNature == "COLD"){
                            that.monthEqpNatureCountList.cold = data.result.monthEqpNatureCountList[i];
                        } else if(data.result.monthEqpNatureCountList[i].eqpNature == "NORM"){
                            that.monthEqpNatureCountList.norm = data.result.monthEqpNatureCountList[i];
                        } else if(data.result.monthEqpNatureCountList[i].eqpNature == "MIXI"){
                            that.monthEqpNatureCountList.mixi = data.result.monthEqpNatureCountList[i];
                        } else{
                            that.monthEqpNatureCountList.else = data.result.monthEqpNatureCountList[i];
                        }
                    }
                }

                //总运营班次
                if(data.result.allOrderNatureCount != null){
                    that.allOrderNatureCount = data.result.allOrderNatureCount;
                    that.allEqpNatureCount = data.result.allEqpNatureCount;
                    that.allOrderTotalCounts = that.allOrderNatureCount.totalCount.toString().split("");
                }
                //今日运营班次
                if(data.result.operateOrderNatureCountToday != null){
                    that.operateOrderNatureCountToday = data.result.operateOrderNatureCountToday;
                    that.operateOrderTotalCounts = that.operateOrderNatureCountToday.totalCount.toString().split("");
                }

                // 月平均车次统计
                if(data.result.monthCarCountByDateGroup != null || data.result.monthCarCountByDateGroup != ''){
                    for(var j=0;j<data.result.monthCarCountByDateGroup.length;j++){
                        that.monthCarCountByDateGroup.normCountList.push(data.result.monthCarCountByDateGroup[j].normCount);
                        that.monthCarCountByDateGroup.mixiCountList.push(data.result.monthCarCountByDateGroup[j].mixiCount);
                        that.monthCarCountByDateGroup.coldCountList.push(data.result.monthCarCountByDateGroup[j].coldCount);
                        that.monthCarCountByDateGroup.otherCountList.push(data.result.monthCarCountByDateGroup[j].otherCount);
                        that.monthCarCountByDateGroup.totalCountList.push(data.result.monthCarCountByDateGroup[j].totalCount);
                        var date = data.result.monthCarCountByDateGroup[j].date.split('-');
                        var datee = date[1]+'-'+date[2];
                        that.monthCarGroupDateList.push(datee);
                    }
                    that.classNumberCharts(that.monthCarCountByDateGroup);
                    that.capacityGrowthCharts(that.monthCarCountByDateGroup);
                    that.vehiclesCarryConCharts(that.monthCarCountByDateGroup.totalCountList);
                }

                // 车辆标记点
                if(data.result.eqpInfo != null || data.result.eqpInfo != ''){
                    that.eqpInfo = data.result.eqpInfo;
                    that.markerArrayFun(that.eqpInfo);
                }
            },1)
        },
        // 月平均车次统计折线图
        classNumberCharts(carGroupData){
            var that = this;
            var myChart2 = echarts.init(document.getElementById('classNumberCharts'));
            var option2 = {
                color: that.colorList,
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    textStyle: {
                        fontSize: "14",//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data:['常温','双温','冷链','其他']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: that.monthCarGroupDateList,
                    axisLabel: {
                        textStyle: {
                            fontSize: "14",//字体大小
                            color: '#ffffff'//字体颜色
                        },
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            fontSize: "14",//字体大小
                            color: '#ffffff'//字体颜色
                        },
                    }
                },
                series: [
                    {
                        name:'常温',
                        type:'line',
                        data: carGroupData.normCountList
                    },
                    {
                        name:'双温',
                        type:'line',
                        data: carGroupData.mixiCountList
                    },
                    {
                        name:'冷链',
                        type:'line',
                        data: carGroupData.coldCountList
                    },
                    {
                        name: '其他',
                        type: 'line',
                        data: carGroupData.otherCountList
                    }
                ]
            };
            myChart2.setOption(option2);
        },
        // 运力增长图
        capacityGrowthCharts(carGroupData){
            var that = this;
            var myChart5 = echarts.init(document.getElementById('capacityGrowthCharts'));
            var option5 = {
                color: that.colorList,
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
                    top: '12%',
                    bottom: '3%',
                    containLabel: true
                },
                legend: {
                    textStyle: {
                        fontSize: "14",//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data:['常温','双温','冷链','其他']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: that.monthCarGroupDateList,
                        axisPointer: {
                            type: 'shadow'
                        },
                        axisLabel: {
                            rotate: '45',
                            textStyle: {
                                fontSize: "14",//字体大小
                                color: '#ffffff',//字体颜色
                            },
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
                            textStyle: {
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            },
                        }
                    },
                ],
                series: [
                    {
                        name:'常温',
                        type:'bar',
                        stack: '总量',
                        data: carGroupData.normCountList
                    },
                    {
                        name:'双温',
                        type:'bar',
                        stack: '总量',
                        data: carGroupData.mixiCountList
                    },
                    {
                        name:'冷链',
                        stack: '总量',
                        type:'bar',
                        data: carGroupData.coldCountList
                    },
                    {
                        name:'其他',
                        type:'bar',
                        stack: '总量',
                        data: carGroupData.otherCountList
                    }
                ]
            };
            myChart5.setOption(option5);
        },
        // 月车次统计与日车次总数
        vehiclesCarryConCharts(totalCountList){
            var that = this;
            var myChart3 = echarts.init(document.getElementById('vehiclesCarryConCharts'));
            var option3 = {
                color: ['#558ed5'],
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
                        fontSize: "14",//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data: ['日车次总数']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: that.monthCarGroupDateList,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel:{
                            show: true,
                            textStyle: {
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            },
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: "#558ed5"
                            }
                        },
                        axisLabel:{
                            show: true,
                            textStyle: {
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            },
                        }
                    }
                ],
                series: [
                    {
                        name:'日车次总数',
                        type:'bar',
                        barGap: 0,
                        label: {
                            normal: {
                                show: true,
                                position: 'inside'
                            }
                        },
                        data: totalCountList
                    }
                ]
            };
            myChart3.setOption(option3);
        },

        // 开闭覆盖层
        isShowMain(){
            var that = this;
            if(that.arrows == 'right'){
                that.arrows = 'left';
                $(".main").css('left','100%');
                $(".showDivPoint").css({'background': 'url(../../../img/windowicon/jtLeft.png) center center no-repeat','background-color': '#00528b'});
                $(".markerGuide").show();
            }else{
                that.arrows = 'right';
                $(".main").css({'left':'0%'});
                $(".showDivPoint").css({'background': 'url(../../../img/windowicon/jtRight.png) center center no-repeat','background-color': '#00528b'});
                $(".markerGuide").hide();
            }
        },
        // 批量标记点
        markerArrayFun(markerInfoArray) {
            map.clearMap();
            var that = this;
            that.coorLatLngList = [];
            var defaultLatLng = '121.473658,31.230378';
            var newDiv = '',mapNumDiv = '';
            for(var n = 0; n < markerInfoArray.length; n++){
                that.markerAcceptArraySeq.push(n);
                newDiv = document.createElement("div");
                mapNumDiv = document.createElement("div");
                mapNumDiv.className = 'mapNumDiv';
                var item = markerInfoArray[n],markerLocation = [],itemLatLng;
                if(item.eqpNature == 'NORM'){
                    newDiv.style.backgroundImage  = 'url("../../../img/car-4.png")';
                } else if(item.eqpNature == 'MIXI'){
                    newDiv.style.backgroundImage  = 'url("../../../img/car-3.png")';
                } else if(item.eqpNature == 'COLD'){
                    newDiv.style.backgroundImage  = 'url("../../../img/car-5.png")';
                }else{
                    newDiv.style.backgroundImage  = 'url("../../../img/car-6.png")';
                }
                if(item.eqpStatus!=null){
                    newDiv.append(mapNumDiv);
                    if(item.eqpStatus == '0'){
                        mapNumDiv.innerHTML = '空';
                    } else if(item.eqpStatus == '1'){
                        mapNumDiv.innerHTML = '占';
                    } else if(item.eqpStatus == '2'){
                        mapNumDiv.innerHTML = '预';
                    }
                }
                if(that.carMarkerType == 'clLatLng'){
                    itemLatLng = item.clLatLng;
                }else if(that.carMarkerType == 'loaLatLng'){
                    itemLatLng = item.loaLatLng;
                }
                if(itemLatLng != null && itemLatLng != ''){
                    var string = itemLatLng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                    that.coorLatLngList.push(itemLatLng);
                    newDiv.setAttribute("coorLatLng",itemLatLng);
                }else{
                    continue;
                }
                newDiv.className  = 'mapPoints';
                newDiv.setAttribute("cdEqpId",item.cdEqpId);
                marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);
                marker.on('click', that.signalOrderClick);
            }
        },
        // 打开信息窗体
        signalOrderClick(e){
            var that = this;
            var cdEqpId = e.target.Le.content.attributes.cdEqpId.value;
            var coorLatLng = e.target.Le.content.attributes.coorLatLng.value;
            $('.amap-info-contentContainer').show();
            var temp = [],coordinate = [];
            for(var n=0;n<that.coorLatLngList.length;n++){
                if(that.coorLatLngList[n] == coorLatLng){
                    temp.push(n);
                }
            }
            var info;
            if(cdEqpId){
                for (var i = 0; i < that.eqpInfo.length; i++) {
                    if(temp.length>1){
                        var totalDiv = '';
                        for(var a=0;a<temp.length;a++) {
                            var tem = temp[a];
                            if (a == 0) {
                                clAddress = that.eqpInfo[tem].clAddress;
                                loaAddress = that.eqpInfo[tem].loaAddress;
                                partyName = that.eqpInfo[tem].partyName;
                            }
                            var eqpNo = that.eqpInfo[tem].eqpNo;
                            var eqpStr1 = that.eqpInfo[tem].eqpStr1;
                            totalDiv += '<p><span class="pointInfoColor1">车辆顺序：</span><span class="pointInfoColor4">' + (tem + 1) * 1 + '</span></p>' +
                                '<p><span class="pointInfoColor1">车牌号：</span><span class="pointInfoColor3">' + eqpNo + '</span></p>' +
                                '<p><span class="pointInfoColor1">承运量：</span><span class="pointInfoColor3">' + eqpStr1 + '件</span></p>';

                        }
                        info = '<div>' +
                                    '<p><span class="pointInfoColor1">当前地址：</span><span class="pointInfoColor3">' + clAddress + '</span></p>' +
                                    '<p><span class="pointInfoColor1">归属地址：</span><span class="pointInfoColor3">' + loaAddress + '</span></p>' +
                                    '<p style="margin-bottom: 10px;"><span class="pointInfoColor1">归属承运商：</span><span class="pointInfoColor3">' + partyName + '</span></p>' +
                                    totalDiv +
                                '</div>';
                    } else if(that.eqpInfo[i].cdEqpId == cdEqpId) {
                        info = '<div> '+
                                    '<p><span class="pointInfoColor1">车辆顺序：</span><span class="pointInfoColor4">' + (that.markerAcceptArraySeq[i]+1)*1 + '</span></p>' +
                                    '<p><span class="pointInfoColor1">当前地址：</span><span class="pointInfoColor3">'+that.eqpInfo[i].clAddress+'</span></p> '+
                                    '<p><span class="pointInfoColor1">归属地址：</span><span class="pointInfoColor3">'+that.eqpInfo[i].loaAddress+'</span></p> '+
                                    '<p><span class="pointInfoColor1">归属承运商：</span><span class="pointInfoColor3">'+that.eqpInfo[i].partyName+'</span></p> '+
                                    '<p><span class="pointInfoColor1">车牌号：</span><span class="pointInfoColor3">'+that.eqpInfo[i].eqpNo+'</span></p> '+
                                    '<p><span class="pointInfoColor1">承运量：</span><span class="pointInfoColor3">'+that.eqpInfo[i].eqpStr1+' 件</span></p> '+
                                '</div>';
                    }
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        // 标记点类型
        showPositionType(type){
            var that = this;
            that.carMarkerType = type;
            that.markerArrayFun(that.eqpInfo);
            if(that.carMarkerType == 'clLatLng'){
                $(".input-item button:first-child").css({'background':'#25A5F7','color':'#fff'});
                $(".input-item button:last-child").css({'background':'transparent','color':'#25A5F7'})
            }else{
                $(".input-item button:last-child").css({'background':'#25A5F7','color':'#fff'});
                $(".input-item button:first-child").css({'background':'transparent','color':'#25A5F7'})
            }
        }
    },
    created: function() {
        var that = this;
        $(".myfont").html(that.logininf.tenantName + "数据中心")
        that.getEqpDataCenter();
    }
});


//创建地图
var map = new AMap.Map('container', {
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
