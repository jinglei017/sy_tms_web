var app = new Vue({
    el: '#overall',
    data: {
        logininf: JSON.parse(localStorage.getItem("logininf")),
        vehicleList: [],
        orderMessageList: [],
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(8, 0)})//信息窗体
    },
    methods: {
        getSuyeDataCenter(){
            var that = this;
            that.latLngList = [];
            getRequest(chartUrl + "/query/operationOrderTodayList.json?token="+that.logininf.token,function(data){
                //车次列表
                if(data.result != null){
                    that.vehicleList = data.result;
                    if(that.vehicleList.length > 30){
                        var orderScroll = new scrollFun('includeList1', 50, 0);
                    }
                    that.markerArrayFun(that.vehicleList)
                }
            },1)
        },
        // 批量标记点
        markerArrayFun(markerInfoArray) {
            var that = this;
            var defaultLatLng = '121.473658,31.230378';
            var newDiv = '';
            for(var n = 0; n < markerInfoArray.length; n++){
                newDiv = document.createElement("div");
                var item = markerInfoArray[n],markerLocation = [];
                if(item.latLng != null && item.latLng != ''){
                    var string = item.latLng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                }else{
                    continue;
                }
                newDiv.className  = 'mapPoints';
                newDiv.setAttribute("omOrderId",item.omOrderId);
                marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);  //更新点标记内容
                marker.on('click', that.signalOrderClick);
            }
        },
        // 打开信息窗体
        signalOrderClick(e){
            var that = this;
            var omOrderId = e.target.Le.content.attributes.omOrderId.value;
            $('.amap-info-contentContainer').show();
            if(omOrderId){
                for (var i = 0; i < that.vehicleList.length; i++) {
                    if (that.vehicleList[i].omOrderId == omOrderId) {
                        var completeStatus = that.fullCompleteStatus(that.vehicleList[i].completeStatus);
                        info = '<div> '+
                                    '<p><span class="pointInfoColor1">订单号：</span><span class="pointInfoColor3">'+that.vehicleList[i].orderNo+'</span></p> '+
                                    '<p><span class="pointInfoColor1">司机：</span><span class="pointInfoColor3">'+that.vehicleList[i].contactName+'</span></p> '+
                                    '<p><span class="pointInfoColor1">车牌号：</span><span class="pointInfoColor3">'+that.vehicleList[i].eqpNo+'</span></p> '+
                                    '<p><span class="pointInfoColor1">当前状态：</span><span class="pointInfoColor3">'+completeStatus+'</span></p> '+
                                    '<p><a onclick="showOrderInfo('+i+')">查看订单详情</a></p> '+
                                '</div>';
                    }
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        // 闭合
        closeCoverDiv(txt){
            if(txt == 'left'){
                $(".left").css('left','100%');
                $(".showLeftPoint").css('left','0');
            }else{
                $(".right").css('right','100%');
                $(".showRightPoint").css('right','0');
            }
        },
        // 打开
        openCoverDiv(txt){
            if(txt == 'left'){
                $(".left").css('left','2%');
                $(".showLeftPoint").css('left','100%');
            }else{
                $(".right").css('right','2%');
                $(".showRightPoint").css('right','100%');
            }
        },
        // 打开详情
        showOrderInfo(index){
            var that = this;
            $(".detailOrderDiv").css("transform","scale(1)");
            that.orderMessageList = that.vehicleList[index].tfoBelowOrderInfoVoList;
        },
        // 关闭详情
        closeDetailOrder(){
            var that = this;
            $(".detailOrderDiv").css("transform","scale(0)");
            that.orderMessageList = [];
        },
        fullCompleteStatus(info){
            if(info == '1'){
                return '已完成'
            } else if(info =='2'){
                return '执行中'
            } else if(info =='3'){
                return '配送中'
            } else if(info =='4'){
                return '部分完成'
            } else if(info =='INIT'){
                return '未开始'
            }else{
                return '未确定'
            }
        }
    },
    created:function(){
        var that = this;
        window.showOrderInfo = that.showOrderInfo;
        var logininf = JSON.parse(localStorage.getItem("logininf"));
        $(".myfont").html(logininf.tenantName+"今日运营车辆");
        that.getSuyeDataCenter();
    },
    filters:{
        timestampToTime(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                //	var currentTime = timestamp - offsetMs;
                var currentTime = timestamp;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
                h = date.getHours() < 10 ? '0'+ date.getHours() + ":" : date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
                s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
                return Y+M+D+h+m;
            }
        },
        fullInt1(info){
            if(info == null){
                return '未满载'
            }else if(info == 0){
                return '否'
            }else{
                return '是'
            }
        },
        fullCompleteStatus(info){
            if(info == '1'){
                return '已完成'
            } else if(info =='2'){
                return '执行中'
            } else if(info =='3'){
                return '配送中'
            } else if(info =='4'){
                return '部分完成'
            } else if(info =='INIT'){
                return '未开始'
            }else{
                return '未确定'
            }
        }
    }
});


//滚动
var scrollFun = function(container,showTime,scrollTime){
    this.timer = null;
    this.showTime = showTime;
    this.container = $("."+container);
    var divChild = $("."+container).find(".list");
    var divNode = divChild.eq(0);
    var that = this;
    // console.log(rectHei);
    setTimeout(function(){
        var rectHei = divNode.height();
        var divNodeCopy = divNode.clone(true);
        divNodeCopy.css({
            "top": rectHei+"px"
        });
        that.container.append(divNodeCopy);
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
        };
        that.timer = setTimeout(scrollView, that.showTime);
        that.container.hover(function(){
            clearTimeout(that.timer);
        },function(){
            that.timer = setTimeout(scrollView, that.showTime);
        })
    },200);
};




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
