var loginInf = JSON.parse(localStorage.getItem("logininf"));
$(".myfont").html(loginInf.tenantName+"中国客户服务数据中心");

//创建地图
var map = new AMap.Map('container', {
    mapStyle: 'amap://styles/' + AmapQdStyle_white,
    resizeEnable: true,
    zoom: 5,
    center: [105.4976,37.1697],
});

var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)});
var colors = ["#1e89dc"];
var markersArray = [];
var currentAdcode = 100000;
var markers = [];
function removeMarkers(){
    map.remove(markersArray);
    markersArray = [];
    $(".amap-info-contentContainer").html("");
}

$(function(){
    $(".startTimeSpan").val(getQueryTime(0));
});
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

AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {
    //创建一个实例
    var districtExplorer = window.districtExplorer = new DistrictExplorer({
        eventSupport: true, //打开事件支持
        map: map
    });
    //当前聚焦的区域
    var currentAreaNode = null;
    //鼠标hover提示内容
    var $tipMarkerContent = $('<div class="tipMarker top"></div>');
    var tipMarker = new AMap.Marker({
        content: $tipMarkerContent.get(0),
        offset: new AMap.Pixel(0, 0),
        bubble: true
    });

    // 获取订单列表
    function getCustomerOrderByAdcode(adcode,codeGather){
        var customerOrderUrl = '/icdp-chart-app-1.0.0/query/customerOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate;
        if(codeGather){
            customerOrderUrl = '/icdp-chart-app-1.0.0/query/customerOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate+"&provinceCode="+codeGather.provinceCode+"&cityCode="+codeGather.cityCode;
        }
        getRequest(customerOrderUrl,function(data){
            customerOrderData(data)
        },1)
    }
    if(currentAdcode != 100000){
        getCustomerOrderByAdcode(currentAdcode)
    }else{
        getCustomerOrderByAdcode(100000)
    }

    //监听鼠标在feature上滑动
    districtExplorer.on('featureMousemove', function(e, feature) {
        //更新提示位置
        tipMarker.setPosition(e.originalEvent.lnglat);
    });
    //feature被点击
    districtExplorer.on('featureClick', function(e, feature) {
        var props = feature.properties;
        removeMarkers();
        //如果存在子节点
        if (props.childrenNum > 0) {
            //切换聚焦区域
            var codeGather = {},acroutes1 = "";
            if(props.acroutes[1]){
                acroutes1 = props.acroutes[1];
                codeGather = {
                    provinceCode: acroutes1,
                    cityCode: props.adcode
                };
            }else{
                codeGather = {
                    provinceCode: props.adcode,
                    cityCode: ""
                };
            }
            switch2AreaNode(props.adcode,codeGather);
            map.setZoomAndCenter(11, [props.center[0],props.center[1]]);
        }
        if (props.childrenNum == 0) {
            if(props.name != '台湾省'){  //如果不存在子节点，即最小区域（台湾省不是最小区域）
                currentAdcode = props.adcode;
            }else{
                localStorage.setItem("forgetCity","tws");
                map.setZoomAndCenter(7.45, [props.center[0],props.center[1]]);  // 点击“台湾省”
            }
        }
    });
    //外部区域被点击
    districtExplorer.on('outsideClick', function(e) {
        removeMarkers();
        districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
            if (routeFeatures && routeFeatures.length > 1) {
                //切换到省级区域
                var codeGather = {
                    provinceCode: routeFeatures[1].properties.adcode,
                    cityCode: ""
                };
                switch2AreaNode(routeFeatures[1].properties.adcode,codeGather);
            } else {
                //切换到全国
                switch2AreaNode(100000);
                map.setZoomAndCenter(5, [105.4976,37.1697]);
                $(".header .myfont").html(loginInf.tenantName+"中国客户服务数据中心");
                getCustomerOrderByAdcode('100000')
            }
        }, {
            levelLimit: 2
        });
    });

    //绘制区域面板的节点
    function renderAreaPanelNode(ele, props, color) {
        var $box = $('<li/>').addClass('lv_' + props.level);
        var $h2 = $('<h2/>').addClass('lv_' + props.level).attr({
            'data-adcode': props.adcode,
            'data-level': props.level,
            'data-children-num': props.childrenNum || void(0),
            'data-center': props.center.join(',')
        }).html(props.name).appendTo($box);
        if (color) {
            $h2.css('borderColor', color);
        }
        //如果存在子节点
        if (props.childrenNum > 0) {
            //显示隐藏
            $('<div class="showHideBtn"></div>').appendTo($box);
            //子区域列表
            $('<ul/>').addClass('sublist lv_' + props.level).appendTo($box);
            $('<div class="clear"></div>').appendTo($box);
            if (props.level !== 'country') {
                $box.addClass('hide-sub');
            }
        }
        $box.appendTo(ele);
    }
    //填充某个节点的子区域列表
    function renderAreaPanel(areaNode) {
        var props = areaNode.getProps();
        var $subBox = $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').siblings('ul.sublist');
        if (!$subBox.length) {
            //父节点不存在，先创建
            renderAreaPanelNode($('#area-tree'), props);
            $subBox = $('#area-tree').find('ul.sublist');
        }
        if ($subBox.attr('data-loaded') === 'rendered') {
            return;
        }
        $subBox.attr('data-loaded', 'rendered');
        var subFeatures = areaNode.getSubFeatures();
        //填充子区域
        for (var i = 0, len = subFeatures.length; i < len; i++) {
            renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length]);
        }
    }
    //绘制某个区域的边界
    function renderAreaPolygons(areaNode) {
        //更新地图视野
        map.setBounds(areaNode.getBounds(), null, null, true);
        //清除已有的绘制内容
        districtExplorer.clearFeaturePolygons();
        //绘制子区域
        districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
            var fillColor = colors[i % colors.length];
            var strokeColor = colors[colors.length - 1 - i % colors.length];
            return {
                cursor: 'default',
                bubble: true,
                strokeColor: strokeColor, //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: fillColor, //填充色
                fillOpacity: 0.35, //填充透明度
            };
        });
        //绘制父区域
        districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: 'black', //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: null, //填充色
            fillOpacity: 0.35, //填充透明度
        });
        if(areaNode._data.geoData.parent.properties.name == "全国"){
            map.setZoomAndCenter(5, [105.4976,37.1697]);
        }else{
            map.setZoomAndCenter(8, areaNode._data.geoData.lngLatParent.properties.center);
        }
    }
    //切换区域后刷新显示内容
    function refreshAreaNode(areaNode) {
        districtExplorer.setHoverFeature(null);
        renderAreaPolygons(areaNode);
        //更新选中节点的class
        var $nodeEles = $('#area-tree').find('h2');
        $nodeEles.removeClass('selected');
        var $selectedNode = $nodeEles.filter('h2[data-adcode=' + areaNode.getAdcode() + ']').addClass('selected');
        //展开下层节点
        $selectedNode.closest('li').removeClass('hide-sub');
        //折叠下层的子节点
        $selectedNode.siblings('ul.sublist').children().addClass('hide-sub');
    }
    //切换区域
    function switch2AreaNode(adcode,codeGather, callback) {
        for(var i = 0; i < testData.length; i++){
            if(testData[i].adcode == adcode) {
                $('.header .myfont').html(loginInf.tenantName + testData[i].name + '客户服务数据中心');
            }
        }
        if(adcode == 100000){
            currentAdcode = adcode;
        }else{
            currentAdcode = adcode;
            getCustomerOrderByAdcode(adcode,codeGather);
        }
        if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
            return;
        }
        loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
                if (callback) {
                    callback(error);
                }
                return;
            }
            currentAreaNode = window.currentAreaNode = areaNode;
            //设置当前使用的定位用节点
            districtExplorer.setAreaNodesForLocating([currentAreaNode]);
            refreshAreaNode(areaNode);
            if (callback) {
                callback(null, areaNode);
            }
        });
    }
    //加载区域
    function loadAreaNode(adcode, callback) {
        districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
            if (error) {
                if (callback) {
                    callback(error);
                }
                console.error(error);
                return;
            }
            renderAreaPanel(areaNode);
            if (callback) {
                callback(null, areaNode);
            }
        });
    }
    $('#area-tree').on('mouseenter mouseleave', 'h2[data-adcode]', function(e) {
        if (e.type === 'mouseleave') {
            districtExplorer.setHoverFeature(null);
            return;
        }
        var adcode = $(this).attr('data-adcode');
        districtExplorer.setHoverFeature(currentAreaNode.getSubFeatureByAdcode(adcode));
    });
    $('#area-tree').on('click', 'h2[data-children-num]', function() {
        var adcode = $(this).attr('data-adcode');
        switch2AreaNode(adcode);
    });
    $('#area-tree').on('click', '.showHideBtn', function() {
        var $li = $(this).closest('li');
        $li.toggleClass('hide-sub');
        if (!$li.hasClass('hide-sub')) {
            //子节点列表被展开
            var $subList = $li.children('ul.sublist');
            //尚未加载
            if (!$subList.attr('data-loaded')) {
                $subList.attr('data-loaded', 'loading');
                $li.addClass('loading');
                //加载
                loadAreaNode($li.children('h2').attr('data-adcode'), function() {
                    $li.removeClass('loading');
                });
            }
        }
    });
    //全国
    switch2AreaNode(100000);
});

function customerOrderData(response) {
    var resultData = response.result;
    // 订单列表，标记所有单个的订单
    $('#orderListt').empty();
    $('#todayOrderAll').html("");
    var customerOrderList = '';
    if(resultData.orderInfoList.length != 0){
        for(var partOrder = 0; partOrder < resultData.orderInfoList.length; partOrder++){  // 订单列表
            var partOrderItem = resultData.orderInfoList[partOrder];
            var state = '';
            if(partOrderItem.completeStatus == '1'){
                state = '<li style="color: #f9962d;">已完成</li>'
            } else if(partOrderItem.completeStatus == 'INIT'){
                state = '<li style="color: #f53642;">未开始</li>'
            } else{
                state = '<li style="color: #64BD3D;">在途中</li>'
            }
            customerOrderList += '<ul class="orderItem" title="点击查看订单详情" orderId="'+partOrderItem.omOrderId+'">' +
                                    '<li>' +
                                        '<p class="inp">'+partOrderItem.orderNo+'</p>' +
                                        '<p>'+partOrderItem.stoPartyName+'</p>' +
                                    '</li>' + state +
                                '</ul>'
        }
        $('#orderListt').html(customerOrderList);
        $('#todayOrderAll').html(resultData.orderInfoList.length);

        marksignalOrder(resultData.orderInfoList);   // 标记所有单个的订单
    }else{
        $('#orderList').html(contentISBlank);
        $('#todayOrderAll').html('0');
    }

    // 图表
    if(resultData.todayOrderCount != null){
        todayCustomerOrderBar(resultData.todayOrderCount.totalCount,resultData.todayOrderCount.completeCount,resultData.todayOrderCount.dispatchCount,resultData.todayOrderCount.exceCount);
    }
    if(resultData.monthOrderCount != null){
        monthCustomerOrderBar(resultData.monthOrderCount.totalCount,resultData.monthOrderCount.completeCount,resultData.monthOrderCount.dispatchCount,resultData.monthOrderCount.exceCount);
    }
    if(resultData.stoOrderList != 0){
        ditchCustomerOrderBar(resultData.stoOrderList);
    }else{
        $('#inventoryChart').html('');
    }
}

function todayCustomerOrderBar(totalCount,completeCount,dispatchCount,exceCount){
    var data = [
        {'itemName':'异常订单','qty2':exceCount,'unit2':'单'},
        {'itemName':'在途订单','qty2':dispatchCount,'unit2':'单'},
        {'itemName':'完成订单','qty2':completeCount,'unit2':'单'},
        {'itemName':'订单总数','qty2':totalCount,'unit2':'单'}
    ];

    if(data.length == 0){
        $('#thisDayOrder').html(contentISBlank);
    }else{
        var curInventoryChart_t = echarts.init(document.getElementById('thisDayOrder'));
        var chartTitle_t = '今日订单';
        var namesList_t = [];    //类别数组（用于存放饼图的类别）
        var seriesList_t = []; //数据数组（用于存放饼图的数据）
        $.each(data, function (index, item) {
            namesList_t.push(item.itemName);
            seriesList_t.push({
                minUnit: item.unit2,
                name: item.itemName,
                value: Math.round(item.qty2)
            });
        });
        PageChartBarOption2(curInventoryChart_t,chartTitle_t,namesList_t,seriesList_t);
        curInventoryChart_t.hideLoading();
    }
}

function monthCustomerOrderBar(totalCount,completeCount,dispatchCount,exceCount){
    var data = [
        {'itemName':'异常订单','qty2':exceCount,'unit2':'单'},
        {'itemName':'在途订单','qty2':dispatchCount,'unit2':'单'},
        {'itemName':'完成订单','qty2':completeCount,'unit2':'单'},
        {'itemName':'订单总数','qty2':totalCount,'unit2':'单'}
    ];

    if(data.length == 0){
        $('#thisMonthOrder').html(contentISBlank);
    }else{
        var curInventoryChart_t = echarts.init(document.getElementById('thisMonthOrder'));
        var chartTitle_t = '本月订单';
        var namesList_t = [];    //类别数组（用于存放饼图的类别）
        var seriesList_t = []; //数据数组（用于存放饼图的数据）
        $.each(data, function (index, item) {
            namesList_t.push(item.itemName);
            seriesList_t.push({
                minUnit: item.unit2,
                name: item.itemName,
                value: Math.round(item.qty2)
            });
        });
        PageChartBarOption2(curInventoryChart_t,chartTitle_t,namesList_t,seriesList_t);
        curInventoryChart_t.hideLoading();
    }
}

function ditchCustomerOrderBar(stoOrderList){

    var myChart_t = echarts.init(document.getElementById('inventoryChart'));

    var seriesList_t = [];
    $.each(stoOrderList, function (index, item) {
        var param = {
            "value":item.totalCount,
            "name":item.partyName+'('+item.totalCount+'单)'
        };
        seriesList_t.push(param);
    });

    PageChartPieOption2(myChart_t,'客户订单量Top5','',seriesList_t);  // 点击图形查看详情
}

function marksignalOrder(orderInfoList) {
    for(var j = 0,orderReceiptMarker; j < orderInfoList.length; j++){   // 标记单个订单
        var item = orderInfoList[j],stoPosition = [];
        if(item.stoLatLng){
            var string = item.stoLatLng.split(','),carDrvContactName = '-',carDrvContactTel = '-',newDiv = document.createElement("div");
            stoPosition.push(string[0]);
            stoPosition.push(string[1]);

            if(item.carDrvContactName != null){
                carDrvContactName = item.carDrvContactName;
            }
            if(item.carDrvContactTel != null){
                carDrvContactTel = item.carDrvContactTel;
            }

            orderReceiptMarker = new AMap.Marker({
                map: map,
                position: stoPosition,
                offset: new AMap.Pixel(0, 0)
            });

            var state1 = '';
            if(item.completeStatus == 'INIT'){
                state1 = '<span style="color: #f53642;">未开始</span>';
                newDiv.innerHTML = '<img src="../../img/mark_r.png" title="'+item.stoPartyName+'" style="width: 7px;height: 11px;"/>';
            } else if(item.completeStatus == '1'){
                state1 = '<span style="color: #f9962d;">已完成</span>';
                newDiv.innerHTML = '<img src="../../img/mark_or.png" title="'+item.stoPartyName+'" style="width: 7px;height: 11px;"/>';
            } else{
                state1 = '<span style="color: #64BD3D;">在途中</span>';
                newDiv.innerHTML = '<img src="../../img/mark_gr.png" title="'+item.stoPartyName+'" style="width: 7px;height: 11px;"/>';
            }
            orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                '<p class="font_14"><span>收货地址：</span><span>'+item.stoAddress+'</span></p>'+
                '<p class="font_14"><span>司机信息：</span><span>'+carDrvContactName+'-'+carDrvContactTel+'</span></p>'+
                '<p class="font_14"><span>完成状态：</span>'+state1+'</p>';

            orderReceiptMarker.setContent(newDiv);  //更新点标记内容

            orderReceiptMarker.on('click', signalOrderClick);
            markersArray.push(orderReceiptMarker);
        }
    }
}

function signalOrderClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}


/*查看订单详情*/
$(document).on("click","#orderListt .orderItem",function(){
    var param = {orderId: $(this).attr('orderId')};
    $(".maskLayer").show();
    ajaxRequest('/icdp-tms-app-1.0.0/query/OrderTjoInfoDetail?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&orderId='+$(this).attr('orderId'), 'get','','customerOrderDetail','获取订单详情');
});
/*点击右上角X关闭弹出框*/
$(".maskLayer .popupTitle a").click(function(){
    $(".maskLayer").hide();
});

function customerOrderDetail(response) {
    $('.orderDetailHeader').empty();
    $('#orderDetailItem').empty();
    var result = response.result,orderDetailHeader = '',orderDetailItem = '',completeTime = '',expireTime = '',carrierPartyUl = '';
    if(result.order.completeTime != null){
        completeTime = new Date(result.order.completeTime).pattern("yyyy-MM-dd");
    }
    if(result.order.expireTime != null){
        expireTime = new Date(result.order.expireTime).pattern("yyyy-MM-dd");
    }
    if(result.carrierPartyInfo != null){
        carrierPartyUl = '<ul>' +
            '<li><p>承运商：<span>'+result.carrierPartyInfo.party.partyName+'</span></p></li>' +
            '<li><p>联系人：<span>'+result.carrierPartyInfo.imgContact.contactName+'</span></p></li>' +
            '<li><p>电话：<span>'+result.carrierPartyInfo.imgContact.contactTel+'</span></p></li>' +
            '</ul>'
    }else{
        carrierPartyUl = '<ul>' +
            '<li><p>承运商：<span>--</span></p></li>' +
            '<li><p>联系人：<span>--</span></p></li>' +
            '<li><p>电话：<span>--</span></p></li>' +
            '</ul>'
    }
    orderDetailHeader = '<ul>' +
        '<li><p>要求完成时间：<span>'+completeTime+'</span></p></li>' +
        '<li><p>订单过期时间：<span>'+expireTime+'</span></p></li>' +
        '</ul>' +
        '<ul>' +
        '<li><p>总数量：<span>'+result.order.totalQty+'件</span></p></li>' +
        '<li><p>总重量：<span>'+result.order.totalWeight+'kg</span></p></li>' +
        '<li><p>总体积：<span>'+result.order.totalVolume+'m³</span></p></li>' +
        '<li><p>总金额：<span>'+result.order.totalAmount+'元</span></p></li>' +
        '</ul>' +
        '<ul>' +
        '<li><p>发货商：<span>'+result.shipperPartyInfo.party.partyName+'</span></p></li>' +
        '<li><p>联系人：<span>'+result.shipperPartyInfo.imgContact.contactName+'</span></p></li>' +
        '<li><p>电话：<span>'+result.shipperPartyInfo.imgContact.contactTel+'</span></p></li>' +
        '</ul>' +
        '<ul>' +
        '<li><p>收货商：<span>'+result.receiptPartyInfo.party.partyName+'</span></p></li>' +
        '<li><p>联系人：<span>'+result.receiptPartyInfo.imgContact.contactName+'</span></p></li>' +
        '<li><p>电话：<span>'+result.receiptPartyInfo.imgContact.contactTel+'</span></p></li>' +
        '</ul>' + carrierPartyUl;
    $('.orderDetailHeader').html(orderDetailHeader);

    if(result.orderItemInfoList != null && result.orderItemInfoList.length > 0){
        $.each(result.orderItemInfoList, function (index, item) {
        var lotNo = '';
        if(item.orderItem.lotNo != null){
            lotNo = item.orderItem.lotNo;
        }else{
            lotNo = '--'
        }
        orderDetailItem += '<tr>' +
                            '<td>'+item.orderItem.itemName+'</td>' +
                            '<td>'+lotNo+'</td>' +
                            '<td>'+item.orderItem.unitPrice+'</td>' +
                            '<td>'+item.orderItem.amount+'</td>' +
                            '<td>'+item.orderItem.currency+'</td>' +
                            '<td>'+item.orderItem.qty+item.orderItem.qtyUnit+'</td>' +
                            '<td>'+item.orderItem.volume+item.orderItem.volumeUnit+'</td>' +
                            '<td>'+item.orderItem.weight+item.orderItem.weightUnit+'</td>' +
                            '<td>'+item.orderItem.itemDesc+'</td>' +
                            '</tr>';
        });
    }
    $('#orderDetailItem').html(orderDetailItem);
    $(".maskLayer").show();
}

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
