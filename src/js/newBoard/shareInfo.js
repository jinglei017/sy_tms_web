var app = new Vue({
    el: '#overall',
    data: {
        stoOrderInfoList: [],
        stoOrderDetail: {},
        sfoOrderInfoList: [],
        sfoOrderDetail: {},
        selectListData:{},
        orderMarkerType: 'fromLatLng',
        sfrLatLngList: [],
        stoLatLngList: [],
        sfoDtmInfoList:[],
        checkDtmInfoList:[],
        omOrderId:"",
        omOrderNo:"",
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(12, 5)}),//信息窗体
        logininf: JSON.parse(localStorage.getItem("logininf"))
    },
    methods: {
        getSuyeDataCenter(){
            var that = this;
            getRequest(chartUrl + "/query/sharedBusinessKanBan.json?token="+that.logininf.token,function(data){
                // 订单列表
                if(data.result.stoOrderInfoList != null && data.result.stoOrderInfoList.length > 0){
                    that.stoOrderInfoList = data.result.stoOrderInfoList;
                    for(var i=0;i<that.stoOrderInfoList.length;i++){
                        that.sfrLatLngList.push(that.stoOrderInfoList[i].sfrLatLng);
                        that.stoLatLngList.push(that.stoOrderInfoList[i].stoLatLng);
                    }
                    that.markerArrayFun(that.stoOrderInfoList);
                    if(that.stoOrderInfoList.length > 8){
                        var orderScroll1 = new scrollFun('includeList1', 50, 0);
                    }
                }
                // 班次列表
                if(data.result.sfoOrderInfoList != null && data.result.sfoOrderInfoList.length > 0){
                    that.sfoOrderInfoList = data.result.sfoOrderInfoList;
                    that.sfoOrderInfoList.forEach((sfoOrderInfo,index) => {
                        if (sfoOrderInfo.carDrvEqpNo.indexOf('沪BH') != -1) {
                            setTimeout(function () {
                                $(".includeListUl").eq(index).css({'background':'#009688'});
                            },300)
                        }
                    })
                    if(that.sfoOrderInfoList.length > 15){
                        var orderScroll2 = new scrollFun('includeList2', 50, 0);
                    }
                }
            },1)
        },
        dateChange(){
            var that = this;
        },
        // 标记点类型
        showPositionType(type){
            var that = this;
            that.orderMarkerType = type;
            that.markerArrayFun(that.stoOrderInfoList);
            if(that.orderMarkerType == 'fromLatLng'){
                $(".input-item button:first-child").css({'background':'#25A5F7','color':'#fff'});
                $(".input-item button:last-child").css({'background':'transparent','color':'#25A5F7'})
            } else if(that.orderMarkerType == 'toLatLng'){
                $(".input-item button:last-child").css({'background':'#25A5F7','color':'#fff'});
                $(".input-item button:first-child").css({'background':'transparent','color':'#25A5F7'})
            }
        },
        // 批量标记点
        markerArrayFun(markerInfoArray) {
            map.clearMap();
            var that = this;
            var defaultLatLng = '121.473658,31.230378';
            var newDiv = '';
            for(var n = 0; n < markerInfoArray.length; n++){
                newDiv = document.createElement("div");
                var item = markerInfoArray[n],markerLocation = [],itemLatLng;
                if(that.orderMarkerType == 'fromLatLng'){
                    itemLatLng = item.sfrLatLng;
                }else if(that.orderMarkerType == 'toLatLng'){
                    itemLatLng = item.stoLatLng;
                }
                if(itemLatLng != null && itemLatLng != ''){
                    var string = itemLatLng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                }else{
                    var string1 = defaultLatLng.split(',');
                    markerLocation.push(string1[0]);
                    markerLocation.push(string1[1]);
                }
                newDiv.className  = 'mapPoints';
                newDiv.style.backgroundImage  = 'url("../../../img/car-2.png")';
                newDiv.setAttribute("orderNo",item.orderNo);
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
            $('.amap-info-contentContainer').show();
            var orderNo = e.target.Le.content.attributes.orderNo.value;
            var info = "";
            if(orderNo){
                for(var i=0;i<that.stoOrderInfoList.length;i++){
                    if(that.stoOrderInfoList[i].orderNo == orderNo){
                        info = '<div> '+
                                    '<p><span class="pointInfoColor1">订单号：</span><span class="pointInfoColor3">'+that.stoOrderInfoList[i].orderNo+'</span></p> '+
                                    '<p><span class="pointInfoColor1">发货商/地址：</span><span class="pointInfoColor3">'+that.stoOrderInfoList[i].sfrPartyName+' / '+that.stoOrderInfoList[i].sfrAddress+'</span></p> '+
                                    '<p><span class="pointInfoColor1">收货商/地址：</span><span class="pointInfoColor3">'+that.stoOrderInfoList[i].stoPartyName+' / '+that.stoOrderInfoList[i].stoAddress+'</span></p> '+
                                    '<p><a onclick="showOrderInfo('+i+')">查看订单详情</a></p> '+
                                '</div>';
                    }
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        // 打开列表窗口
        openCoverDiv(txt){
            if(txt == 'left'){
                $(".left").css('left','20px');
                $(".showLeftPoint").css('left','100%');
            }else{
                $(".right").css('right','20px');
                $(".showRightPoint").css('right','100%');
            }
            $(".markerGuide").hide();
        },
        // 闭合列表窗口
        closeCoverDiv(txt){
            if(txt == 'left'){
                $(".left").css('left','100%');
                $(".showLeftPoint").css('left','0');
            }else{
                $(".right").css('right','100%');
                $(".showRightPoint").css('right','0');
            }
            $(".markerGuide").show();
        },
        // 打开订单详情
        showOrderInfo(index){
            var that = this;
            $(".detailOrderDiv").css("transform","translate(-50%,-50%) scale(1)");
            that.stoOrderDetail = that.stoOrderInfoList[index];
        },
        // 关闭订单详情
        closeDetailOrder(){
            $(".detailOrderDiv").css("transform","translate(-50%,-50%) scale(0)");
        },
        // 打开班次详情
        showClassInfo(index){
            var that = this;
            $(".detailClassDiv").css("transform","translate(-50%,-50%) scale(1)");
            that.sfoOrderDetail = that.sfoOrderInfoList[index];
        },
        // 关闭班次详情
        closeDetailClass(){
            $(".detailClassDiv").css("transform","translate(-50%,-50%) scale(0)");
        },
        //抢单
        grabOrder(stoInfo){
            var that = this;
            clearTimeout(that.timer);
            imitatePopup('确认抢单？','confirm',(num)=>{
                if(num){
                    var params = {
                        refId: stoInfo.omOrderId,
                        refNo: stoInfo.orderNo,
                        refTo: "INTERNAL",
                        refCode: "88888888",
                        refType: "STO",
                    };
                    postRequest(tmsUrl + "/busShared/appointOrderPullOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                        if(data.msg == "success" || data.msg == "SUCCESS"){
                            imitatePopup('抢单成功！','alert')
                            getRequest(chartUrl + "/query/sharedBusinessOrderKanBan.json?token="+that.logininf.token,function(data){
                                // 订单列表
                                if (data.msg === "SUCCESS" || data.msg === "success") {
                                    that.stoOrderInfoList = data.result;
                                    for(var i=0;i<that.stoOrderInfoList.length;i++){
                                        that.sfrLatLngList.push(that.stoOrderInfoList[i].sfrLatLng);
                                        that.stoLatLngList.push(that.stoOrderInfoList[i].stoLatLng);
                                    }
                                    that.markerArrayFun(that.stoOrderInfoList);
                                    if(that.stoOrderInfoList.length > 8){
                                        var orderScroll1 = new scrollFun('includeList1', 50, 0);
                                    }
                                }else {
                                    imitatePopup(data.msg,'alert')
                                }
                            },1)
                        }else{
                            imitatePopup(data.msg,'alert')
                        }
                    })
                }
            })
        },
        //预订车辆选择时间弹出框
        popupOrderTimeCheck(sfoInfo){
            let that = this;
            that.omOrderId = sfoInfo.omOrderId;
            that.orderNo =sfoInfo.orderNo;
            that.checkDtmInfoList = [];
            var params = {
                refId: sfoInfo.omOrderId,
                refTo: "om_order",
                refType: "SHA",
                refCode: "88888888"
            };
            postRequest(tmsUrl + "/busShared/getSfoDtmInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if(data.result) {
                    $(".orderTimeCheckLayer").css("transform", "translate(-50%,-50%) scale(1)");
                    that.sfoDtmInfoList = data.result;
                }
            })
        },

        //选中和取消
        checkedOne:function (value) {
            let idIndex = this.checkDtmInfoList.indexOf(value);
            if (idIndex >= 0) {
                this.checkDtmInfoList.splice(idIndex, 1)
            } else {
                this.checkDtmInfoList.push(value)
            }
        },
        //全选
        checkedAll:function () {
            let _this = this;
            if(this.checkDtmInfoList.length < this.sfoDtmInfoList.length){
                _this.checkDtmInfoList = [];
                this.sfoDtmInfoList.forEach(function (dtmInfo) {
                    if (1 != dtmInfo.isDefault) {
                        _this.checkDtmInfoList.push(dtmInfo.omDtmId)
                    }
                });
            } else {
                _this.checkDtmInfoList = [];
            }
        },
        //预订
        reverseOrder(){
            let that = this;
            this.closeOrder();
            clearTimeout(that.timer);
            if (null == that.checkDtmInfoList || that.checkDtmInfoList.length==0){
                imitatePopup('请选择预定时间！','alert')
                return false;
            }
            let params = {
                omOrderId: that.omOrderId,
                orderNo: that.orderNo,
                orderTo: "88888888",
                orderType: "SFO",
                omDtmIdList:that.checkDtmInfoList
            };
            postRequest(tmsUrl + "/busShared/appointCarPullOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    imitatePopup('预订成功！','alert')
                    getRequest(chartUrl + "/query/sharedBusinessCarKanBan.json?token="+that.logininf.token,function(data){
                        // 共享车辆列表
                        if(data.result != null && data.result.length > 0){
                            that.sfoOrderInfoList = data.result;
                            that.sfoOrderInfoList.forEach((sfoOrderInfo,index) => {
                                if (sfoOrderInfo.carDrvEqpNo.indexOf('沪BH') != -1) {
                                    setTimeout(function () {
                                        $(".includeListUl").eq(index).css({'background':'#009688'});
                                    },300)
                                }
                            })
                            if(that.sfoOrderInfoList.length > 15){
                                var orderScroll2 = new scrollFun('includeList2', 50, 0);
                            }
                        }
                    },1)
                }else{
                    imitatePopup(data.msg,'alert')
                }
            })
        },
        // 取消预定
        closeOrder(){
            $(".orderTimeCheckLayer").css("transform", "translate(-50%,-50%) scale(0)");
        }
    },
    created:function(){
        var that = this;
        window.showOrderInfo = that.showOrderInfo;
        $(".myfont").html("共享业务看板");
        that.selectListData = getBasicData();    //获取下拉数据
        that.getSuyeDataCenter();
    },
    mounted: function(){
        $(".startTimeSpan").val(getQueryTime(0));
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

        timestampToTime1(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                var currentTime = timestamp;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
                h = date.getHours() < 10 ? '0'+ date.getHours() + ":" : date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
                return M+D+h+m;
            }
        },
        transOrderNature(text){
            if(text == "GEN"){
                return "普货";
            } else if(text == "DAN"){
                return "危货";
            } else{
                return text;
            }
        },
        transClassNature(text){
            if(text == "COLD"){
                return "冷链";
            } else if(text == "NORM"){
                return "常温";
            }else if(text == "MIXI"){
                return "混合";
            }else if(text == "NORM"){
                return text;
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
            });
            divNodeCopy.css({
                "top": (oldTop + rectHei - 1)+"px"
            });
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










$(".dateQuery .startTimeSpan").click(function(){
    $("#startTime").show();
    var mySchedule = new Schedule({
        el: '#startTime',
        clickCb: function (y,m,d) {
            $(".startTimeSpan").val(formartDate(y,m,d));
            $("#startTime").hide();
        }
    });
});
$("#startTime").mouseleave(function(){
    $(this).fadeOut();
});
$(".dateQuery .dateChangeBtn").click(function(){

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
