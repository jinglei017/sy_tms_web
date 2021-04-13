
//创建地图
var map = new AMap.Map('container', {
    zoom:11
});
//信息窗体
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5,1)});

var initialize = function () {
    $('#userName').html(userInfo.tenantName);
    refreshMaptTheme('grey');

    ajaxRequest('/icdp-chart-app-1.0.0/query/customerOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','customerOrderData','获取客户订单信息');

    /*var pagenNum = 1,pageSize = 80,pages = 0,loadMoreHeight = 20;  // 分页信息：第几页，一页的条数，总共几页，滚动加载的临界值
    var queryOrderList = {
        endCreateTime : serviceOrderDate,
        startCreateTime : serviceOrderDate,
        pageInfo: {
            pageNum: pagenNum,
            pageSize: pageSize
        }
    };
    ajaxRequest('/icdp-oms-app-1.0.0/query/selectHaulOrderInfoPage?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp, 'post',queryOrderList,'customerOrderList','获取订单列表');*/

    /* 滚动加载 */
    /*$("#orderList").scroll(function(){
        var h = $(this).height();  //div可视区域的高度
        var sh = $(this)[0].scrollHeight;  //滚动的高度，$(this)[0] dom节点
        var st =$(this)[0].scrollTop;  //滚动条的高度，即滚动条的当前位置到div顶部的距离

        if((sh-h-st)<loadMoreHeight){
            if(pagenNum < pages || pagenNum == pages){
                var queryOrderList = {
                    endCreateTime : serviceOrderDate,
                    startCreateTime : serviceOrderDate,
                    pageInfo: {
                        pageNum: pagenNum,
                        pageSize: pageSize
                    }
                };
                ajaxRequest('/icdp-oms-app-1.0.0/query/selectHaulOrderInfoPage?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'post',queryOrderList,'customerOrderList','获取订单列表');
            }
        }

    });*/

    /* 伸缩订单 */
    $(document).on("click","#scalingTip",function(){
        if($(this).hasClass("orderContainerHide")){  // 显
            $(this).removeClass("orderContainerHide");
            $("#panel").show();
            $(this).find('.img_i').removeClass("ic_scalingTip_r").addClass("ic_scalingTip_l");
            $(".boardContainer-left1").css('width','3.3rem');
            $(".boardContainer-left2").css('width','calc(75vw - 3.3rem)');
        }else{  // 隐
            $(this).addClass("orderContainerHide");
            $("#panel").hide();
            $(this).find('.img_i').removeClass("ic_scalingTip_l").addClass("ic_scalingTip_r");
            $(".boardContainer-left1").css('width','0');
            $(".boardContainer-left2").css('width','100%');
        }

    });
    /* 点击右上角X关闭弹出框 */
    $(".maskLayer .popupTitle a").click(function(){
        $(".maskLayer").hide();
    });
    /* 查看订单详情 */
    $(document).on("click","#orderList .orderItem",function(){
        var param = {orderId: $(this).attr('orderId')};
        ajaxRequest('/icdp-tms-app-1.0.0/query/OrderTjoInfoDetail?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&orderId='+$(this).attr('orderId'), 'get','','customerOrderDetail','获取订单详情');
    });

    setInterval(refreshInfo,600000); // 10分钟刷新

    function refreshInfo() {
        ajaxRequest('/icdp-chart-app-1.0.0/query/customerOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','customerOrderData','获取客户订单信息');
    }
};

initialize();

function customerOrderData(response) {
    var resultData = response.result;
    // 订单列表，标记所有单个的订单
    var customerOrderList = '';
    if(resultData.orderInfoList.length != 0){
        for(var partOrder = 0; partOrder < resultData.orderInfoList.length; partOrder++){  // 订单列表
            var partOrderItem = resultData.orderInfoList[partOrder];
            if(partOrderItem.completeStatus == '1'){
                customerOrderList += '<ul class="orderItem padding_l_5 cursor_p" title="点击查看订单详情" orderId="'+partOrderItem.omOrderId+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br>'+
                    '<span class="font_15 color_white text_l textPoints">'+partOrderItem.stoPartyName+'</span></li><li class="float_l width_40 text_c"><span class="font_15 done">完成</span></li></ul>';
            }else{
                customerOrderList += '<ul class="orderItem padding_l_5 cursor_p" title="点击查看订单详情" orderId="'+partOrderItem.omOrderId+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br>'+
                    '<span class="font_15 color_white text_l textPoints">'+partOrderItem.stoPartyName+'</span></li><li class="float_l width_40 text_c"><span class="font_15 no_done">未完成</span></li></ul>';
            }
        }
        $('#orderList').html(customerOrderList);
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
    //  itemCustomerOrderBar(resultData.itemList);
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

function itemCustomerOrderBar(itemList){

    if(itemList.length == 0){
        $('#inventoryChart').html(contentISBlank);
    }else{
        var curInventoryChart_t = echarts.init(document.getElementById('inventoryChart'));
        var chartTitle_t = '大类库存';
        var namesList_t = [];    //类别数组（用于存放饼图的类别）
        var seriesList_t = []; //数据数组（用于存放饼图的数据）
        $.each(itemList, function (index, item) {
            namesList_t.push(item.itemName);
            if(item.unit2 != null){
                seriesList_t.push({
                    minUnit: item.unit2,
                    name: item.itemName,
                    value: Math.round(item.qty2)
                });
            }else{
                seriesList_t.push({
                    minUnit: '',
                    name: item.itemName,
                    value: Math.round(item.qty2)
                });
            }

        });
        PageChartBarOption(curInventoryChart_t,chartTitle_t,namesList_t,seriesList_t);
        curInventoryChart_t.hideLoading();
    }
}

function ditchCustomerOrderBar(stoOrderList){

    var myChart_t = echarts.init(document.getElementById('inventoryChart'));

    var seriesList_t = [];
    $.each(stoOrderList, function (index, item) {
        var param = {"value":item.totalCount,"name":item.partyName+'('+item.totalCount+'单)'};
        seriesList_t.push(param);
    });

    PageChartPieOption2(myChart_t,'','');  // 点击图形查看详情
   /* myChart_t.hideLoading();
    myChart_t.setOption({    //加载数据图表
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                var res ='';
                var myseries = seriesList_t;
                for (var i = 0; i < myseries.length; i++) {
                    if(myseries[i].name==params.name){
                        res+=myseries[i].name;
                    }

                }
                return res;
            },
            position: ['0','10%']
        },
        legend: {
        },
        graphic: {
            left: '40%',
            style: {
                text: '客户订单量Top5',
                fill: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        series: [{
            data: seriesList_t
        }]
    });*/
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
                offset: new AMap.Pixel(0, 0),
                position: stoPosition
            });

            if(item.completeStatus == '1'){  // 完成
              //  newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'+'<br><strong class="font_16 color_text">'+item.stoPartyName+'</strong>'; // 15px-24px ; 13px-21px ; 14px-22px
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                    '<p class="font_14"><span>司机信息：</span><span>'+carDrvContactName+'-'+carDrvContactTel+'</span></p>'+
                    '<p class="font_14"><span>完成状态：</span><span class="done2">完成</span></p>';
            }else{
              //  newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'+'<br><strong class="font_16 color_text">'+item.stoPartyName+'</strong>'; // 15px-24px ; 13px-21px ; 14px-22px
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                    '<p class="font_14"><span>司机信息：</span><span>'+carDrvContactName+'-'+carDrvContactTel+'</span></p>'+
                    '<p class="font_14"><span>完成状态：</span><span class="no_done">未完成</span></p>';
            }

            orderReceiptMarker.setContent(newDiv);  //更新点标记内容

            orderReceiptMarker.on('click', signalOrderClick);
            orderReceiptMarker.emit('click', {target: orderReceiptMarker});
            orderReceiptMarkerArray.push(orderReceiptMarker);
        }
    }
    map.setZoomAndCenter(11, [121.473658,31.230378]);
}

function signalOrderClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}

function customerOrderList(response) {
    var customerOrderList = '',orderInfoArray = response.result;
    for(var partOrder = 0; partOrder < orderInfoArray.length; partOrder++){
        var partOrderItem = orderInfoArray[partOrder];
        if(partOrderItem.completeStatus == '1'){
            customerOrderList += '<ul class="orderItem padding_l_5 cursor_p" title="点击查看订单详情" orderId="'+partOrderItem.omOrderId+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br>'+
                '<span class="font_15 color_white text_l">'+partOrderItem.customerOriginalNo+'</span></li><li class="float_l width_40 text_c"><span class="font_15 done">完成</span></li></ul>';
        }else{
            customerOrderList += '<ul class="orderItem padding_l_5 cursor_p" title="点击查看订单详情" orderId="'+partOrderItem.omOrderId+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br>'+
                '<span class="font_15 color_white text_l">'+partOrderItem.customerOriginalNo+'</span></li><li class="float_l width_40 text_c"><span class="font_15 no_done">未完成</span></li></ul>';
        }
    }
    $('#orderList').html(customerOrderList);
}

function customerOrderDetail(response) {
    var result = response.result,orderDetailHeader = '',orderDetailItem = '',completeTime = '',expireTime = '';
    if(result.order.completeTime != null){
        completeTime = new Date(result.order.completeTime).pattern("yyyy-MM-dd");
    }
    if(result.order.expireTime != null){
        expireTime = new Date(result.order.expireTime).pattern("yyyy-MM-dd");
    }
    if(result.carrierPartyInfo != null){
        if(result.carrierPartyInfo.imgContactInfo.contact != null){
            orderDetailHeader = '<tr class="marginB_15 height30">'+
                '<td>要求完成时间：<strong>'+completeTime+'</strong></td><td>订单过期时间：<strong>'+expireTime+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>总数量：<strong>'+result.order.totalQty+result.order.qtyUnit+'</strong></td><td>总重量：<strong>'+result.order.totalWeight+result.order.weightUnit+'</strong></td>'+
                '<td>总体积：<strong>'+result.order.totalVolume+result.order.volumeUnit+'</strong></td><td>总金额：<strong>'+result.order.totalAmount+result.order.currency+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>发货商：<strong>'+result.shipperPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactTel+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>收货商：<strong>'+result.receiptPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactTel+'</strong></td>/tr>'+
                '<tr class="marginB_15 height30"><td>承运商：<strong>'+result.carrierPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.carrierPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.carrierPartyInfo.imgContactInfo.contact.contactTel+'</strong></td></tr>';

        }else{
            orderDetailHeader = '<tr class="marginB_15 height30">'+
                '<td>要求完成时间：<strong>'+completeTime+'</strong></td><td>订单过期时间：<strong>'+expireTime+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>总数量：<strong>'+result.order.totalQty+result.order.qtyUnit+'</strong></td><td>总重量：<strong>'+result.order.totalWeight+result.order.weightUnit+'</strong></td>'+
                '<td>总体积：<strong>'+result.order.totalVolume+result.order.volumeUnit+'</strong></td><td>总金额：<strong>'+result.order.totalAmount+result.order.currency+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>发货商：<strong>'+result.shipperPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactTel+'</strong></td></tr>'+
                '<tr class="marginB_15 height30"><td>收货商：<strong>'+result.receiptPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactTel+'</strong></td>/tr>'+
                '<tr class="marginB_15 height30"><td>承运商：<strong>'+result.carrierPartyInfo.party.partyName+'</strong></td><td>联系人：<strong></strong></td><td>电话：<strong></strong></td></tr>';
        }
    }else{
        orderDetailHeader = '<tr class="marginB_15 height30">'+
            '<td>要求完成时间：<strong>'+completeTime+'</strong></td><td>订单过期时间：<strong>'+expireTime+'</strong></td></tr>'+
            '<tr class="marginB_15 height30"><td>总数量：<strong>'+result.order.totalQty+result.order.qtyUnit+'</strong></td><td>总重量：<strong>'+result.order.totalWeight+result.order.weightUnit+'</strong></td>'+
            '<td>总体积：<strong>'+result.order.totalVolume+result.order.volumeUnit+'</strong></td><td>总金额：<strong>'+result.order.totalAmount+result.order.currency+'</strong></td></tr>'+
            '<tr class="marginB_15 height30"><td>发货商：<strong>'+result.shipperPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.shipperPartyInfo.imgContactInfo.contact.contactTel+'</strong></td></tr>'+
            '<tr class="marginB_15 height30"><td>收货商：<strong>'+result.receiptPartyInfo.party.partyName+'</strong></td><td>联系人：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactName+'</strong></td><td>电话：<strong>'+result.receiptPartyInfo.imgContactInfo.contact.contactTel+'</strong></td>/tr>'+
            '<tr class="marginB_15 height30"><td>承运商：<strong></strong></td><td>联系人：<strong></strong></td><td>电话：<strong></strong></td></tr>';
    }
    $('#orderDetailHeader').html(orderDetailHeader);

    if(result.orderItemInfoList != null && result.orderItemInfoList.length > 0){
        $.each(result.orderItemInfoList, function (index, item) {
            if(item.orderItem.lotNo != null){
                orderDetailItem += '<tr class="height30"><td><span>'+item.orderItem.itemName+'</span></td><td><span>'+item.orderItem.lotNo+'</span></td><td><span>'+item.orderItem.unitPrice+
                    '</span></td><td><span>'+item.orderItem.amount+'</span></td><td><span>'+item.orderItem.currency+'</span></td><td><span>'+item.orderItem.qty+item.orderItem.qtyUnit+
                    '</span></td><td><span>'+item.orderItem.volume+item.orderItem.volumeUnit+'</span></td><td><span>'+item.orderItem.weight+item.orderItem.weightUnit+'</span></td><td><span>'+item.orderItem.itemDesc+'</span></td></tr>';
            }else{
                orderDetailItem += '<tr class="height30"><td><span>'+item.orderItem.itemName+'</span></td><td><span></span></td><td><span>'+item.orderItem.unitPrice+
                    '</span></td><td><span>'+item.orderItem.amount+'</span></td><td><span>'+item.orderItem.currency+'</span></td><td><span>'+item.orderItem.qty+item.orderItem.qtyUnit+
                    '</span></td><td><span>'+item.orderItem.volume+item.orderItem.volumeUnit+'</span></td><td><span>'+item.orderItem.weight+item.orderItem.weightUnit+'</span></td><td><span>'+item.orderItem.itemDesc+'</span></td></tr>';
            }

        });
    }
    $('#orderDetailItem').html(orderDetailItem);
    $(".maskLayer").show();
}



