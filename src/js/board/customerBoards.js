
//创建地图
var map = new AMap.Map('container', {
    zoom:4
});
//信息窗体
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5,1)});

var colors = [
    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

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

    //根据Hover状态设置相关样式
    function toggleHoverFeature(feature, isHover, position) {

        tipMarker.setMap(isHover ? map : null);

        if (!feature) {
            return;
        }

        var props = feature.properties;
        //  console.log('props');console.log(props);

        if (isHover) {

            //更新提示内容
            //  $tipMarkerContent.html(props.adcode + ': ' + props.name);
            $tipMarkerContent.html(props.name);
            //更新位置
            tipMarker.setPosition(position || props.center);
        }

        $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

        //更新相关多边形的样式
        var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
        for (var i = 0, len = polys.length; i < len; i++) {

            polys[i].setOptions({
                fillOpacity: isHover ? 0.5 : 0.2
            });
        }
    }

    //监听feature的hover事件
    districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
        toggleHoverFeature(feature, e.type === 'featureMouseover',
            e.originalEvent ? e.originalEvent.lnglat : null);
    });

    //监听鼠标在feature上滑动
    districtExplorer.on('featureMousemove', function(e, feature) {
        //更新提示位置
        tipMarker.setPosition(e.originalEvent.lnglat);
    });

    //feature被点击
    districtExplorer.on('featureClick', function(e, feature) {

        var props = feature.properties;

        //如果存在子节点
        if (props.childrenNum > 0) {
            //切换聚焦区域
            switch2AreaNode(props.adcode);
        }
    });

    //外部区域被点击
    districtExplorer.on('outsideClick', function(e) {

        districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {

            if (routeFeatures && routeFeatures.length > 1) {
                //切换到省级区域
                switch2AreaNode(routeFeatures[1].properties.adcode);
            } else {
                //切换到全国
                switch2AreaNode(100000);
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
      //  console.log(areaNode);
        var areaLevel = '';
        if(areaNode.adcode != 100000){ // 全国
            if(areaNode._data.geoData.lngLatParent != undefined){
                areaLevel = areaNode._data.geoData.lngLatParent.properties.level;
            }else{
                if(areaNode._data.geoData.parent != undefined){
                    areaLevel = areaNode._data.geoData.parent.properties.level;
                }
            }
            if(areaLevel != '' && areaLevel == 'province'){
                if(areaNode.adcode == 310000){ // 上海
                    if(areaNode._data.geoData.lngLatParent != undefined){
                        map.setZoomAndCenter(10, areaNode._data.geoData.lngLatParent.properties.center);
                    }else{
                        if(areaNode._data.geoData.parent != undefined){
                            map.setZoomAndCenter(10, areaNode._data.geoData.parent.properties.center);
                        }else{
                            map.setZoomAndCenter(10, [121.472644, 31.231706]); // 上海
                        }
                    }
                }else{
                    if(areaNode._data.geoData.lngLatParent != undefined){
                        map.setZoomAndCenter(8, areaNode._data.geoData.lngLatParent.properties.center);
                    }else{
                        if(areaNode._data.geoData.parent != undefined){
                            map.setZoomAndCenter(8, areaNode._data.geoData.parent.properties.center);
                        }
                    }
                }
            }
        }

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
    function switch2AreaNode(adcode, callback) {

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

  //  switch2AreaNode(100000); //全国
    switch2AreaNode(310000); //上海

});

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
    myChart_t.hideLoading();
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
    });
}

function marksignalOrder(orderInfoList) {
    for(var j = 0,orderReceiptMarker; j < orderInfoList.length; j++){   // 标记单个订单
        var item = orderInfoList[j],stoPosition = [];
        if(item.stoLatLng){
            var string = item.stoLatLng.split(',');
            stoPosition.push(string[0]);
            stoPosition.push(string[1]);

            /*orderReceiptMarker = new AMap.Marker({
                map: map,
                position: stoPosition,
                icon: new AMap.Icon({
                    size: new AMap.Size(13, 21),  //图标大小
                    image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",  // 图片路径
                    imageSize: new AMap.Size(13, 21)
                    //   imageOffset: new AMap.Pixel(0, -60)
                })
            });*/
            orderReceiptMarker = new AMap.Marker({
                map: map,
                position: stoPosition,
                offset: new AMap.Pixel(0, 0)
            });

            /*// 全展示
            var newDiv = document.createElement("div");
            newDiv.style.position = "relative";
            var infos = '<div style="position: absolute; bottom: 30px; left: 0px;"><div><div class="amap-info-content amap-info-outer">' +
                '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>' +
                '<p class="font_14"><span>完成状态：</span><span class="no_done">完成状态</span></p>' +
                '</div><a class="amap-info-close" href="javascript: void(0)" style="right: 5px;">×</a><div class="amap-info-sharp" style="height: 23px;"></div></div></div>';
            if(item.completeStatus == '1'){  // 完成
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'+infos; // 15px-24px ; 13px-21px ; 14px-22px
            }else{
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'+infos; // 15px-24px ; 13px-21px ; 14px-22px
            }*/
            // 单个点击展示
            var newDiv = document.createElement("div");

            if(item.completeStatus == '1'){  // 完成
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+'<p class="font_14"><span>完成状态：</span><span class="done2">完成</span></p>';
            }else{
                newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" title="'+item.stoPartyName+'" style="width: 14px;height: 22px;"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+'<p class="font_14"><span>完成状态：</span><span class="no_done">未完成</span></p>';
            }

            orderReceiptMarker.setContent(newDiv);  //更新点标记内容
            orderReceiptMarker.on('click', signalOrderClick);
            orderReceiptMarker.emit('click', {target: orderReceiptMarker});
            orderReceiptMarkerArray.push(orderReceiptMarker);
        }
    }
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



