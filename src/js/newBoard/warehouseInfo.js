var app = new Vue({
    el: '#overall',
    data: {
        logininf: JSON.parse(localStorage.getItem("logininf")),
        labelOption: {
            normal: {
                show: true,
                position: 'insideBottom',
                distance: 15,
                align: 'left',
                verticalAlign: 'middle',
                rotate: 90,
                formatter: '{c}',
                fontSize: 16,
                rich: {
                    name: {
                        textBorderColor: '#fff'
                    }
                }
            }
        },
        totalAreas: [],
        usableAreas: [],
        warehouseVoList: []
    },
    methods: {
        // 获取数据
        getWareHouseInfo(){
            var that = this;
            that.normCountList =[];
            getRequest(chartUrl + "/query/depotInfoList.json?token="+that.logininf.token,function(data){
                // 总面积、可用面积
                if(data.result.totalArea != null){
                    that.totalAreas = data.result.totalArea.toString().split("")
                }
                if(data.result.usableArea != null){
                    that. usableAreas = data.result.usableArea.toString().split("")
                }

                // 仓库列表
                if(data.result.warehouseVoList != null && data.result.warehouseVoList.length > 0) {
                    that.warehouseVoList = data.result.warehouseVoList;
                    if(data.result.warehouseVoList.length > 5){
                        setTimeout(function () {
                            var warehouseDeListScroll = new scrollFun('warehouseDeList', 50, 0);
                        },200)
                    }
                }


                that.getOrderDisposeCharts();
                that.getAreaDisposeCharts();
            },1)
        },

        // 单库月处理单量对照图
        getOrderDisposeCharts(){
            var that = this;
            var myChart = echarts.init(document.getElementById('orderDisposeCharts'));
            var option = {
                color: ['#003366', '#006699', '#4cabce', '#e5323e'],
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
                    textStyle:{
                        fontSize: "14",//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data:['宝山库','闵行库','奉贤库','浦东库']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {show: false},
                        data: ['9月', '10月', '11月', '12月', '1月','2月'],
                        axisLabel: {
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        }
                    }
                ],
                series: [
                    {
                        name:'宝山库',
                        type:'bar',
                        barGap: 0,
                        label: that.labelOption,
                        data:[9600, 11000, 8100, 12100, 12000, 7800]
                    },
                    {
                        name:'闵行库',
                        type:'bar',
                        label: that.labelOption,
                        data:[15600, 13800, 13200, 14100, 18200, 12020]
                    },
                    {
                        name:'奉贤库',
                        type:'bar',
                        label: that.labelOption,
                        data:[5600, 7200, 6100, 6600, 9200, 5900]
                    },
                    {
                        name:'浦东库',
                        type:'bar',
                        label: that.labelOption,
                        data:[5600, 4900, 4760, 5120, 6300, 4220]
                    }
                ]
            };
            myChart.setOption(option);
        },

        // 月仓库面积及处理单量
        getAreaDisposeCharts(){
            var that = this;
            var myChart1 = echarts.init(document.getElementById('areaDisposeCharts'));
            var option1 = {
                color: ['#4cabce','#e5323e','#006699'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    left: '3%',
                    right: '10%',
                    top: '20%',
                    bottom: '1%',
                    containLabel: true
                },
                legend: {
                    textStyle:{
                        fontSize: "14",//字体大小
                        color: '#ffffff'//字体颜色
                    },
                    data:['月处理单量','月仓库面积','单量/面积']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        },
                        data: ['9月', '10月', '11月', '12月', '1月','2月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '月处理单量',
                        position: 'left',
                        axisLine: {
                            lineStyle: {
                                color: "#4cabce"
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '月仓库面积',
                        position: 'right',
                        offset: 80,
                        axisLine: {
                            lineStyle: {
                                color: "#e5323e"
                            }
                        },
                        axisLabel: {
                            formatter: '{value}m³',
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        }
                    },
                    {
                        type: 'value',
                        name: '单量/面积',
                        position: 'right',
                        axisLine: {
                            lineStyle: {
                                color: "#006699"
                            }
                        },
                        axisLabel: {
                            formatter: '{value}',
                            textStyle:{
                                fontSize: "14",//字体大小
                                color: '#ffffff'//字体颜色
                            }
                        }
                    }


                ],
                series: [
                    {
                        name:'月处理单量',
                        type:'bar',
                        barGap: 0,
                        data:[15600, 13800, 13200, 14100, 18200, 12020]
                    },
                    {
                        name:'月仓库面积',
                        type:'bar',
                        yAxisIndex: 1,
                        data:[5600, 4900, 4760, 5120, 6300, 4220]
                    },
                    {
                        name:'单量/面积',
                        type:'line',
                        yAxisIndex: 2,
                        data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2]
                    }

                ]
            };
            myChart1.setOption(option1);
        }
    },
    created: function() {
        var that = this;
        $(".myfont").html(that.logininf.tenantName + "仓库资源中心");
        that.getWareHouseInfo();
    },
    filters: {
        changeDepotType(depotType){
            if(depotType == "NORM"){
                return "常温库"
            } else if(depotType == "COLD"){
                return "冷库"
            } else if(depotType == "MIXI"){
                return "双温库"
            } else{
                return "--"
            }
        },
        changeDepotLable(depotLable){
            if(depotLable == "GEN"){
                return "普货"
            } else if(depotLable == "DAN"){
                return "危货"
            } else{
                return "--"
            }
        }
    }
});

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

// 页面自动刷新
function myrefresh(){
    window.location.reload();
}
setTimeout('myrefresh()',1800000);
