
/*————————————————地图————————————————*/
//创建地图
var map = new AMap.Map('container', {
    zoom: 4
});

var serviceMap = new AMap.Map('serviceMap', {
    zoom:11,
    center:[121.473658,31.230378]
});

var userName = '';

//板块颜色
var colors = [
    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

//信息窗体
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5,1)}),infoWindow2 = new AMap.InfoWindow({offset: new AMap.Pixel(5,1)});

//加载DistrictExplorer
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

        if (isHover) {
            //  $('#infoTip').html(props.name);
            //更新提示内容
            //  $tipMarkerContent.html(props.adcode + ': ' + props.name);
            $tipMarkerContent.html(props.name);
            //更新位置
            tipMarker.setPosition(position || props.center);

            if(props.childrenNum == 0){
                //  $tipMarkerContent.html(props.name+'(可点击查看车辆)');
                $tipMarkerContent.html(props.name);
            }
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

    setInterval(refreshInfo,600000);  // 10分钟
    function refreshInfo() {
        var provinceAdcode = localStorage.getItem("provinceAdcode");
        var provinceName = localStorage.getItem("provinceName");
        var cityAdcode = localStorage.getItem("cityAdcode");
        var cityName = localStorage.getItem("cityName");
        var districtAdcode = localStorage.getItem("districtAdcode");
        var districtName = localStorage.getItem("districtName");
        var cuurrentAdcode = localStorage.getItem("cuurrentAdcode");

        var cuurrentAdcode2 = localStorage.getItem("districtCode");  // 省 以外的
        var cuurrentHasChild = localStorage.getItem("cuurrentHasChild");
        var cuurrentName = localStorage.getItem("cuurrentName");
        var propsCenter0 = localStorage.getItem("propsCenter0");
        var propsCenter1 = localStorage.getItem("propsCenter1");
        var cuurrentLevel = localStorage.getItem("cuurrentLevel");
        // 无论当前处于全国状态还是区域状态，都要获取“订单列表，司机委托人信息，图表
        ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','orderStaDataSuc2','刷新看板信息');
        // 标记全国订单点
        ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode=100000', 'get','','partsOrderList22','标记全国订单点');

        if(provinceAdcode == null && provinceName == null && cityAdcode == null && cityName == null && districtAdcode == null && districtName == null && cuurrentAdcode == null && cuurrentAdcode2 == null && cuurrentHasChild == null && cuurrentName == null  && propsCenter0 == null && propsCenter1 == null && cuurrentLevel == null ){
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode=""', 'get','','partsOrderList','获取地区订单列表');
            // 处于 全国 状态下，标记 全国各省 订单数
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','orderStaDataSuc3','标记全国各省订单数');
            return false;
        }else{
            // 标记订单数
            if(cuurrentLevel == null){ // 处于 全国 状态下，标记 全国各省 订单数
                ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','orderStaDataSuc3','标记全国各省订单数');
            }else{ // 处于 省 或 市 状态下，标记 省下各市 或者市内各区 订单数 < 最小区区域不用标记 >
                if(cuurrentLevel == 'province'){
                    $.ajax({
                        url:'/icdp-chart-app-1.0.0/query/orderCountByAdType?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&padcode='+provinceAdcode+'&date='+serviceOrderDate,
                        type: 'get',
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

                            if(response.result.length != 0){
                                markOrderNum(response.result,cuurrentLevel,provinceAdcode,provinceName);  // 地图标记订单数量
                            }else{
                                loadData('show',provinceName+'无订单',true);
                            }
                        },
                        error: function () {
                            loadData('show','获取'+provinceName+'订单数量信息出错！');
                        }
                    });
                }else{
                    if(cuurrentLevel == 'city'){
                        $.ajax({
                            url:'/icdp-chart-app-1.0.0/query/orderCountByAdType?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&padcode='+cityAdcode+'&date='+serviceOrderDate,
                            type: 'get',
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

                                if(response.result.length != 0){
                                    markOrderNum(response.result,cuurrentLevel,cityAdcode,cityName);  // 地图标记订单数量
                                }else{
                                    loadData('show',cityName+'无订单',true);
                                }
                            },
                            error: function () {
                                loadData('show','获取'+cityName+'订单数量信息出错！');
                            }
                        });
                    }
                }
            }

            /*//标记省订单点
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+provinceAdcode, 'get','','partsOrderList2','标记省订单点');*/

            if(cuurrentHasChild != null){
                if(cuurrentHasChild == '1'){  // 标记最小区域内的车，获取该区域内的订单列表
                    if(propsCenter0 == null || propsCenter1 == null){
                        return false;
                    }else{
                        $.ajax({
                            url:'/icdp-chart-app-1.0.0/query/serviceOrderTransInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&districtCode='+cuurrentAdcode2+'&date='+serviceOrderDate,
                            type: 'get',
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
                                showCarInfo(response,propsCenter0,propsCenter1,cuurrentName);
                            },
                            error: function () {
                                loadData('show','获取车辆信息出错！');
                            }
                        });
                    }
                }else{
                    // 获取地区订单列表
                    ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+cuurrentAdcode, 'get','','partsOrderList','获取地区订单列表');
                }
            }
        }

    }

    //feature被点击
    districtExplorer.on('featureClick', function(e, feature) {
        var props = feature.properties;
        infoWindow.close();
        if(props.adcode != 100000){
            localStorage.setItem("cuurrentLevel",props.level);
            localStorage.setItem("cuurrentAdcode",props.adcode);
            localStorage.setItem("cuurrentName",props.name);
            switch(props.level)
            {
                case 'province':
                    localStorage.setItem("provinceAdcode",props.adcode);
                    localStorage.setItem("provinceName",props.name);
                    break;
                case 'city':
                    localStorage.setItem("cityAdcode",props.adcode);
                    localStorage.setItem("cityName",props.name);
                    break;
                case 'district':
                    localStorage.setItem("districtAdcode",props.adcode);
                    localStorage.setItem("districtName",props.name);
                    break;
            }
        }
        /*if (props.level == 'province') {  //标记省订单点
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+props.adcode, 'get','','partsOrderList2','标记省订单点');
        }*/

        if (props.childrenNum > 0) {  //如果存在子节点
            //切换聚焦区域
            switch2AreaNode(props.adcode,'',props.level,props.name);
            map.setZoomAndCenter(11, [props.center[0],props.center[1]]);
        }

        if (props.childrenNum == 0) {  // 标记最小区域内的车，获取该区域内的订单列表
            localStorage.setItem("cuurrentHasChild",'1');
            if(props.name != '台湾省'){  //如果不存在子节点，即最小区域（台湾省不是最小区域）
                localStorage.setItem('districtCode',props.adcode);
                $.ajax({
                    url:'/icdp-chart-app-1.0.0/query/serviceOrderTransInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&districtCode='+props.adcode+'&date='+serviceOrderDate,
                    type: 'get',
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
                        //  console.log(props.center[0]);
                        localStorage.setItem("propsCenter0",props.center[0]);
                        localStorage.setItem("propsCenter1",props.center[1]);
                        showCarInfo(response,props.center[0],props.center[1],props.name);
                    },
                    error: function () {
                        loadData('show','获取车辆信息出错！');
                    }
                });
            }else{
                //  switch2AreaNode(props.adcode,'',props.level,'台湾省');  // bug —— 点击“台湾省”不能进入该省
                localStorage.setItem("forgetCity","tws");
                map.setZoomAndCenter(7.45, [props.center[0],props.center[1]],props.name);  // 点击“台湾省”
            }
        }else{
            localStorage.setItem("cuurrentHasChild",'0');
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+props.adcode, 'get','','partsOrderList','获取地区订单列表');
            // 标记“省市区”订单数量 < 最小区区域不用标记 >
            $.ajax({
                url:'/icdp-chart-app-1.0.0/query/orderCountByAdType?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&padcode='+props.adcode+'&date='+serviceOrderDate,
                type: 'get',
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

                    if(response.result.length != 0){
                        markOrderNum(response.result,props.level,props.adcode,props.name);  // 地图标记订单数量
                    }else{
                        loadData('show',props.name+'无订单',true);
                    }
                },
                error: function () {
                    loadData('show','获取'+props.name+'订单数量信息出错！');
                }
            });
        }

    });

    function showCarInfo(response,propsCenter0,propsCenter1,propsName) {
        //  console.log('car:'+propsCenter0+'/'+propsCenter1+'/'+propsName);
        var driverInfoArray = response.result.orderCountInfoList;
        var orderInfoArray = response.result.orderInfoList;
        map.remove(markersArray);  // 清除上次点击的标记点
        map.remove(orderMarkerArray);
        map.setZoomAndCenter(10, [propsCenter0,propsCenter1]);
        markersArray = []; //清空数组
        orderMarkerArray = [];

        var partOrderInfoList = '',partOrderNum = 0;
        if(orderInfoArray.length != 0){ // 标记最小区域内的车，获取该区域内的订单列表
            partOrderNum = orderInfoArray.length;
            // 获取该区域内的订单列表
            for(var partOrder = 0; partOrder < orderInfoArray.length; partOrder++){
                var partOrderItem = orderInfoArray[partOrder];
                if(partOrderItem.completeStatus == '1'){
                    partOrderInfoList += '<ul class="orderItem padding_l_5" title="'+partOrderItem.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+partOrderItem.sfrPartyName+'</span></li>'+
                        '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'">'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'</span><span class="font_15 float_l done">完成</span></li></ul>';
                }else{
                    partOrderInfoList += '<ul class="orderItem padding_l_5" title="'+partOrderItem.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+partOrderItem.sfrPartyName+'</span></li>'+
                        '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'">'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'</span><span class="font_15 float_l no_done">未完成</span></li></ul>';
                }
            }
            document.getElementById('orderList').style.display = 'block';
            document.getElementById('orderList').innerHTML = partOrderInfoList;
            //   document.getElementById('panel').style.display = 'block';
            // 标记最小区域内的车
            if(driverInfoArray.length != 0){
                var markerLocationArray = [];
                for(var carl = 0; carl < driverInfoArray.length; carl++){
                    var carlItem = driverInfoArray[carl],markerLocation = [],marker;
                    var string = carlItem.latLng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                    markerLocationArray.push(markerLocation);

                    if(carlItem.completeCount == carlItem.totalCount){  // 全部完成
                        marker = new AMap.Marker({
                            map: map,
                            offset: new AMap.Pixel(0, 0),
                            position: markerLocation
                        });
                        var newDiv = document.createElement("div");
                        newDiv.style.width = '150px';                                                                 // display: inline-block;width: 100px;height: 30px;background-color: #fff;
                        newDiv.innerHTML = '<img src="../../img/mapCar_blue.png"/>'+'<br><strong class="font_18 color_jindu">'+carlItem.eqpNo+'：'+carlItem.completeCount+'/'+carlItem.totalCount+'</strong>';
                        marker.setContent(newDiv);  //更新点标记内容
                    }else{
                        marker = new AMap.Marker({
                            map: map,
                            offset: new AMap.Pixel(0, 0),
                            position: markerLocation
                        });
                        var newDiv = document.createElement("div");
                        newDiv.style.width = '150px';
                        newDiv.innerHTML = '<img src="../../img/mapCar_red.png"/>'+'<br><strong class="font_18 color_jindu">'+carlItem.eqpNo+'：'+carlItem.completeCount+'/'+carlItem.totalCount+'</strong>';
                        marker.setContent(newDiv);  //更新点标记内容
                    }

                    marker.content = '<p><span>司机：</span><span>'+carlItem.contactName+
                        '</span></p><p><span>手机号：</span><span>'+carlItem.contactTel+
                        '</span></p><p><span>车牌号：</span><span>' +carlItem.eqpNo+'</span></p>';

                    marker.on('click', markerClick);
                    marker.emit('click', {target: marker});
                    markersArray.push(marker);
                }
                map.setZoomAndCenter(13, markerLocationArray[0]);
            }
            $('#infoTip').html('<strong>'+userName+'</strong>-'+propsName + ': 总' + partOrderNum +'单');
        }else{
            $('#infoTip').html('<strong>'+userName+'</strong>-'+propsName + ': 总' + partOrderNum +'单');
            document.getElementById('orderList').innerHTML = '<div class="color_white text_c"><span>---无订单---</span></div>';
            infoWindow.close();
        }

    }

    //标记点marker的点击事件
    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());

        if(e.lnglat){  // e ::: 点击“块”：target、type ； 点击“点”：lnglat、pixel、target、type
            var clickDriver = (e.target.content).split('</span></p><p><span>');
            var thisDriver = clickDriver[0].split('<p><span>司机：</span><span>')[1];              // 当前点击的“点”的司机名
            var thisTel = clickDriver[1].split('手机号：</span><span>')[1];                         // 当前点击的“点”的手机号
            var thisEqpNo = clickDriver[2].split('车牌号：</span><span>')[1].split('</span>')[0];   // 当前点击的“点”的车牌号
            $('#infoTip').html('<strong>'+userName+'</strong>-'+thisEqpNo);
            //  loadData('show',props.name +'无订单',true);

            var districtCode = localStorage.getItem('districtCode');
            $.ajax({
                url:'/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&districtCode='+districtCode+'&date='+serviceOrderDate+'&contactTel='+thisTel+'&eqpNo='+thisEqpNo,  //
                type: 'get',
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
                    showthisCarOrderInfo(response);
                },
                error: function () {
                    loadData('show','获取车辆信息出错，请稍后重试！');
                }
            });

            function showthisCarOrderInfo(response) {
                var orderInfoList = '',orderInfoArray = response.result;
                if(orderInfoArray.length != 0){
                    for(var partOrder = 0; partOrder < orderInfoArray.length; partOrder++){
                        var partOrderItem = orderInfoArray[partOrder];
                        if(partOrderItem.completeStatus == '1'){
                            orderInfoList += '<ul class="orderItem padding_l_5" title="'+partOrderItem.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+partOrderItem.sfrPartyName+'</span></li>'+
                                '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'">'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'</span><span class="font_15 float_l done">完成</span></li></ul>';
                        }else{
                            orderInfoList += '<ul class="orderItem padding_l_5" title="'+partOrderItem.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+partOrderItem.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+partOrderItem.sfrPartyName+'</span></li>'+
                                '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'">'+partOrderItem.totalQty+'&nbsp;*&nbsp;'+partOrderItem.totalWeight+'&nbsp;*&nbsp;'+partOrderItem.totalVolume+'</span><span class="font_15 float_l no_done">未完成</span></li></ul>';
                        }
                    }
                    document.getElementById('orderList').innerHTML = orderInfoList;
                    //   document.getElementById('panel').style.display = 'block';
                }

            }
        }
    }

    //外部区域被点击
    districtExplorer.on('outsideClick', function(e) {

        districtExplorer.locatePosition(e.originalEvent.lnglat, function(error, routeFeatures) {
            if (routeFeatures && routeFeatures.length > 1) {
                switch2AreaNode(routeFeatures[1].properties.adcode,'','province',routeFeatures[1].properties.name);  //切换到省级区域
            } else {
                switch2AreaNode(100000,'','country','');  //切换到全国
                if(localStorage.getItem("forgetCity")=='tws'){  // 如果之前有点击过“台湾省”，则退回初始化
                    localStorage.removeItem("forgetCity");    // 页面初始化，清除之前点击的tws
                }
                map.setZoomAndCenter(4, [105.838526,31.838013]);
                //   map.remove(markersArray);
                //  $('#infoTip').html( '全国');  // 顶部提示框
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
                if(areaNode.adcode == 310000){
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
    function switch2AreaNode(adcode, callback, levels,names) {
        $('#switchDivBtn').show();
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

        if(adcode != 100000){
            localStorage.setItem("cuurrentAdcode",adcode);
            localStorage.setItem("cuurrentLevel",levels);
            localStorage.setItem("cuurrentName",names);
            switch(levels)
            {
                case 'province':
                    localStorage.setItem("provinceAdcode",adcode);
                    localStorage.setItem("provinceName",names);
                    break;
                case 'city':
                    localStorage.setItem("cityAdcode",adcode);
                    localStorage.setItem("cityName",names);
                    break;
                case 'district':
                    localStorage.setItem("districtAdcode",adcode);
                    localStorage.setItem("districtName",names);
                    break;
            }
        }

        // 切换区域，清除之前标记的车，隐去订单
        map.remove(markersArray);  // 清除上次点击的标记点
        markersArray = []; //清空数组
        infoWindow.close();

        // 标记“省市区”订单数量
        $.ajax({
            url:'/icdp-chart-app-1.0.0/query/orderCountByAdType?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&padcode='+adcode+'&date='+serviceOrderDate,
            type: 'get',
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

                if(response.result.length != 0){
                    if(adOrderCountArray.length != 0){
                        var level = '',name='';
                        $.each(adOrderCountArray, function (index, item) {  // 匹配地区级别
                            if(item.adcode == adcode){
                                level = item.level;
                                name = item.name;
                            }
                        });
                        markOrderNum(response.result,level,adcode,name);  // 地图标记订单数量
                    }else{
                        loadData('show','未获取到行政区编号：'+adcode+'的订单数量信息，请刷新页面重试！');
                    }

                }else{
                    loadData('show','当前地区无订单',true);
                }
            },
            error: function () {
                loadData('show','获取订单数量信息出错！');
            }
        });

        if(adcode == 100000){   // 恢复初始化 —— 清除地区车标记以及订单层，关闭信息窗体
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode=""', 'get','','partsOrderList','获取地区订单列表');
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderInfo?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&date='+serviceOrderDate, 'get','','orderStaDataSuc','获取看板信息'); // 标记34地区订单数
        }else{
            /*if(levels == 'province'){  // 省 才加载
                map.remove(pointsArray);pointsArray = [];
                ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+adcode, 'get','','partsOrderList2','标记省订单点');
            }*/
            ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode='+adcode, 'get','','partsOrderList','获取地区订单列表');
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
    switch2AreaNode(100000,'','country','');
});

/*————————————————项目————————————————*/

var initialize = function () {
    userName = userInfo.tenantName;
    refreshMaptTheme2('grey');
    /* 伸缩订单 */
    $(document).on("click","#scalingTip",function(){
        if($(this).hasClass("orderContainerHide")){  // 显
            $(this).removeClass("orderContainerHide");
            $(".infoTip").show();
            $("#panel").show();
            $(this).find('.img_i').removeClass("ic_scalingTip_r").addClass("ic_scalingTip_l");
            $(".boardContainer-left1").css('width','4.3rem');
            $(".boardContainer-left2").css('width','calc(75vw - 4.3rem)');
            $(".boardContainer-left21").css('width','calc(75vw - 4.7rem)');
        }else{  // 隐
            $(this).addClass("orderContainerHide");
            $(".infoTip").hide();
            $("#panel").hide();
            $(this).find('.img_i').removeClass("ic_scalingTip_l").addClass("ic_scalingTip_r");
            $(".boardContainer-left1").css('width','0');
            $(".boardContainer-left2").css('width','100%');
            $(".boardContainer-left21").css('width','calc(100vw - 4.7rem)');
        }

    });
};

initialize();

function orderStaDataSuc(response) {
    $('#text11').html('');
    $('#text22').html('');
    $('#text1').html('');
    $('#text2').html('');
    clearInterval(mytimer);
    clearInterval(mytimer2);
    var resultData = response.result,totalCounts = 0;
    // 司机，委托人 列表
    if(resultData.driverOrderList != null){  // 司机
        if(resultData.driverOrderList.length != 0){
            var driverOrderList = '';
            for(var d = 0; d < resultData.driverOrderList.length; d++){
                var item = resultData.driverOrderList[d];
                driverOrderList += '<li>&nbsp;<strong>'+item.contactName+'：</strong>今日总订单<span class="color_all">&nbsp;'+item.totalCount+'单</span>，已完成<span class="done">&nbsp;'+item.completeCount+'</span>，在途<span class="color_tu">&nbsp;'+item.dispatchCount+'</span>，异常<span class="no_done">&nbsp;'+item.exceCount+'</span></li>';
            }
            $('#text11').html(driverOrderList);
            if(resultData.driverOrderList.length > 5){
                var area2 = document.getElementById('scrollBox2');
                var text11 = document.getElementById('text11');
                var text22 = document.getElementById('text22');
                scrollBox2(area2,text11,text22);
            }
        }else{
            $('#text11').html('');
            $('#text22').html('');
            $('#scrollBox2').hide();
        }
    }else{
        $('#text11').html('');
        $('#text22').html('');
        $('#scrollBox2').hide();
    }

    if(resultData.sfrPartyOrderList != null){  // 委托人
        if(resultData.sfrPartyOrderList.length != 0){
            var sfrPartyOrderList = '';
            for(var s = 0; s < resultData.sfrPartyOrderList.length; s++){
                var items = resultData.sfrPartyOrderList[s];
                sfrPartyOrderList += '<li><strong>'+items.partyName+'：</strong>今日总订单<span class="color_all">&nbsp;'+items.totalCount+'单</span>，已完成<span class="done">&nbsp;'+items.completeCount+'</span>，在途<span class="color_tu">&nbsp;'+items.dispatchCount+'</span>，异常<span class="no_done">&nbsp;'+items.exceCount+'</span></li>';
            }
            $('#text1').html(sfrPartyOrderList);
            if(resultData.sfrPartyOrderList.length > 5){
                var area = document.getElementById('scrollBox');
                var text1 = document.getElementById('text1');
                var text2 = document.getElementById('text2');
                scrollBox(area,text1,text2);
            }
        }else{
            $('#text1').html('');
            $('#text2').html('');
            $('#scrollBox').hide();
        }
    }else{
        $('#text1').html('');
        $('#text2').html('');
        $('#scrollBox').hide();
    }

    // 图表
    if(resultData.todayOrderCount != null){
        totalCounts = resultData.todayOrderCount.totalCount;
        todayOrderBar(resultData.todayOrderCount.totalCount,resultData.todayOrderCount.completeCount,resultData.todayOrderCount.dispatchCount,resultData.todayOrderCount.exceCount);
    }
    if(resultData.monthOrderCount != null){
        monthOrderBar(resultData.monthOrderCount.totalCount,resultData.monthOrderCount.completeCount,resultData.monthOrderCount.dispatchCount,resultData.monthOrderCount.exceCount);
    }
    if(resultData.partyWeekOrderCountList != null){
        partyWeekOrderLine(resultData.partyWeekOrderCountList,resultData.weekDate);
    }

    // 地图标记订单数量   地区订单数量
    if(resultData.adOrderCountList != null){
        markOrderNum(resultData.adOrderCountList,'country','100000','全国',totalCounts);
        adOrderCountArray = resultData.adOrderCountList;
    }else{
        loadData('show','未获取到各省订单数量信息，请稍后重试！',true);
    }

}

function orderStaDataSuc2(response) {
    $('#text11').html('');
    $('#text22').html('');
    $('#text1').html('');
    $('#text2').html('');
    clearInterval(mytimer);
    clearInterval(mytimer2);
    var resultData = response.result;
    // 司机，委托人 列表
    if(resultData.driverOrderList != null){  // 司机
        if(resultData.driverOrderList.length != 0){
            var driverOrderList = '';
            for(var d = 0; d < resultData.driverOrderList.length; d++){
                var item = resultData.driverOrderList[d];
                driverOrderList += '<li>&nbsp;<strong>'+item.contactName+'：</strong>今日总订单<span class="color_all">&nbsp;'+item.totalCount+'单</span>，已完成<span class="done">&nbsp;'+item.completeCount+'</span>，在途<span class="color_tu">&nbsp;'+item.dispatchCount+'</span>，异常<span class="no_done">&nbsp;'+item.exceCount+'</span></li>';
            }
            $('#text11').html(driverOrderList);
            if(resultData.driverOrderList.length > 5){
                var area2 = document.getElementById('scrollBox2');
                var text11 = document.getElementById('text11');
                var text22 = document.getElementById('text22');
                scrollBox2(area2,text11,text22);
            }
        }else{
            $('#text11').html('');
            $('#text22').html('');
            $('#scrollBox2').hide();
        }
    }else{
        $('#text11').html('');
        $('#text22').html('');
        $('#scrollBox2').hide();
    }

    if(resultData.sfrPartyOrderList != null){  // 委托人
        if(resultData.sfrPartyOrderList.length != 0){
            var sfrPartyOrderList = '';
            for(var s = 0; s < resultData.sfrPartyOrderList.length; s++){
                var items = resultData.sfrPartyOrderList[s];
                sfrPartyOrderList += '<li><strong>'+items.partyName+'：</strong>今日总订单<span class="color_all">&nbsp;'+items.totalCount+'单</span>，已完成<span class="done">&nbsp;'+items.completeCount+'</span>，在途<span class="color_tu">&nbsp;'+items.dispatchCount+'</span>，异常<span class="no_done">&nbsp;'+items.exceCount+'</span></li>';
            }
            $('#text1').html(sfrPartyOrderList);
            if(resultData.sfrPartyOrderList.length > 5){
                var area = document.getElementById('scrollBox');
                var text1 = document.getElementById('text1');
                var text2 = document.getElementById('text2');
                scrollBox(area,text1,text2);
            }
        }else{
            $('#text1').html('');
            $('#text2').html('');
            $('#scrollBox').hide();
        }
    }else{
        $('#text1').html('');
        $('#text2').html('');
        $('#scrollBox').hide();
    }

    // 图表
    if(resultData.todayOrderCount != null){
        todayOrderBar(resultData.todayOrderCount.totalCount,resultData.todayOrderCount.completeCount,resultData.todayOrderCount.dispatchCount,resultData.todayOrderCount.exceCount);
    }
    if(resultData.monthOrderCount != null){
        monthOrderBar(resultData.monthOrderCount.totalCount,resultData.monthOrderCount.completeCount,resultData.monthOrderCount.dispatchCount,resultData.monthOrderCount.exceCount);
    }
    if(resultData.partyWeekOrderCountList != null){
        partyWeekOrderLine(resultData.partyWeekOrderCountList,resultData.weekDate);
    }

}

function orderStaDataSuc3(response) {
    var resultData = response.result,totalCounts = 0;
    if(resultData.todayOrderCount != null){
        totalCounts = resultData.todayOrderCount.totalCount;
    }
    // 地图标记订单数量   地区订单数量
    if(resultData.adOrderCountList != null){
        markOrderNum(resultData.adOrderCountList,'country','100000','全国',totalCounts);
        adOrderCountArray = resultData.adOrderCountList;
    }else{
        loadData('show','未获取到各省订单数量信息，请稍后重试！',true);
    }

}

function partsOrderList(response) {
    var partsOrderList = '',totalCounts = 0;
    $.each(response.result, function (index, item) {
        if(item.completeStatus == '1'){
            partsOrderList += '<ul class="orderItem padding_l_5" title="'+item.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+item.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+item.sfrPartyName+'</span></li>'+
                '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+item.totalQty+'&nbsp;*&nbsp;'+item.totalWeight+'&nbsp;*&nbsp;'+item.totalVolume+'">'+item.totalQty+'&nbsp;*&nbsp;'+item.totalWeight+'&nbsp;*&nbsp;'+item.totalVolume+'</span><span class="font_15 float_l done">完成</span></li></ul>';
        }else{
            partsOrderList += '<ul class="orderItem padding_l_5 color_white" title="'+item.sfrPartyName+'"><li class="float_l width_60"><span class="font_14 color_white2">'+item.orderNo+'</span><br><span class="font_15 color_white text_l textPoints">'+item.sfrPartyName+'</span></li>'+
                '<li class="float_l width_40 text_c"><span class="font_14 color_white2 textPoints2" title="'+item.totalQty+'&nbsp;*&nbsp;'+item.totalWeight+'&nbsp;*&nbsp;'+item.totalVolume+'">'+item.totalQty+'&nbsp;*&nbsp;'+item.totalWeight+'&nbsp;*&nbsp;'+item.totalVolume+'</span><span class="font_15 float_l no_done">未完成</span></li></ul>';
        }
    });
    if(partsOrderList == ''){
        $('#orderList').html('<div class="color_white text_c"><span>---无订单---</span></div>');
    }else{
        $('#orderList').html(partsOrderList);
    }

    var provinceAdcode = localStorage.getItem("provinceAdcode");
    var provinceName = localStorage.getItem("provinceName");
    var cityAdcode = localStorage.getItem("cityAdcode");
    var cityName = localStorage.getItem("cityName");
    var districtAdcode = localStorage.getItem("districtAdcode");
    var districtName = localStorage.getItem("districtName");
    var cuurrentAdcode = localStorage.getItem("cuurrentAdcode");

    var cuurrentAdcode2 = localStorage.getItem("districtCode");  // 省 以外的
    var cuurrentHasChild = localStorage.getItem("cuurrentHasChild");
    var cuurrentName = localStorage.getItem("cuurrentName");
    var propsCenter0 = localStorage.getItem("propsCenter0");
    var propsCenter1 = localStorage.getItem("propsCenter1");
    var cuurrentLevel = localStorage.getItem("cuurrentLevel");
    if(provinceAdcode == null && provinceName == null && cityAdcode == null && cityName == null && districtAdcode == null && districtName == null && cuurrentAdcode == null && cuurrentAdcode2 == null && cuurrentHasChild == null && cuurrentName == null  && propsCenter0 == null && propsCenter1 == null && cuurrentLevel == null ){
        // 处于 全国 状态下
        $('#infoTip').html('<strong>'+userName+'</strong>-'+'全国'+'：总' + totalCounts +'单');
    }else{
        $('#infoTip').html('<strong>'+userName+'</strong>-'+cuurrentName+'：总' + totalCounts +'单');
    }
    //   document.getElementById('panel').style.display = 'block';
}

function partsOrderList2(response) {
    map.remove(pointsArray);pointsArray = [];
    var markerLocationArray = [];
    for(var carl = 0; carl < response.result.length; carl++){
        var carlItem = response.result[carl],markerLocation = [],marker,newDiv = document.createElement("div");
        if(carlItem.stoLatLng != null) {
            if (isContains(carlItem.stoLatLng, ',')) {
                var string = carlItem.stoLatLng.split(',');
                markerLocation.push(string[0]);
                markerLocation.push(string[1]);
                markerLocationArray.push(markerLocation);

                marker = new AMap.Marker({
                    map: map,
                    offset: new AMap.Pixel(0, 0),
                    position: markerLocation
                });
              //  newDiv.style.width = '150px';
                if(carlItem.completeStatus == '1'){  // 完成
                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" style="width: 13px;height: 21px;"/>'+'<br><strong class="font_16 color_text">'+carlItem.sfrPartyName+'</strong>'; // 15px-24px ; 13px-21px
                }else{
                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" style="width: 13px;height: 21px;"/>'+'<br><strong class="font_16 color_text">'+carlItem.sfrPartyName+'</strong>'; // 15px-24px ; 13px-21px
                }
                marker.setContent(newDiv);  //更新点标记内容
                pointsArray.push(marker);
            }
        }
    }
}

// partsOrderList22 同 partsOrderList2 标记省订单点
function partsOrderList22(response) {
    serviceMap.remove(pointsArray2);pointsArray2 = [];
    var markerLocationArray = [];
    for(var carl = 0; carl < response.result.length; carl++){
        var carlItem = response.result[carl],markerLocation = [],marker,carDrvContactName = '--',carDrvEqpNo = '--',newDiv = document.createElement("div");
        if(carlItem.stoLatLng != null){
            if(isContains(carlItem.stoLatLng, ',')){
                var string = carlItem.stoLatLng.split(',');
                markerLocation.push(string[0]);
                markerLocation.push(string[1]);
                markerLocationArray.push(markerLocation);

                if(carlItem.carDrvContactName != null){
                    carDrvContactName = carlItem.carDrvContactName;
                    console.log(carDrvContactName);
                }
                if(carlItem.carDrvEqpNo != null){
                    carDrvEqpNo = carlItem.carDrvEqpNo;
                    console.log(carDrvEqpNo);
                }

                marker = new AMap.Marker({
                    map: serviceMap,
                    offset: new AMap.Pixel(0, 0),
                    position: markerLocation
                });
             //   newDiv.style.width = '150px';
                if(carlItem.completeStatus == '1'){  // 完成
                    //   newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" style="width: 13px;height: 21px;"/>'+'<br><strong class="font_16 color_text">'+carlItem.sfrPartyName+'</strong>'; // 15px-24px ; 13px-21px
                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png" style="width: 13px;height: 21px;"/>'; // 15px-24px ; 13px-21px
                    marker.content = '<p class="font_14"><span>委托人：</span><span>'+carlItem.sfrPartyName+'</span></p>'+
                        '<p class="font_14"><span>司机：</span><span>'+carDrvContactName+'</span></p>'+
                        '<p class="font_14"><span>车牌：</span><span>'+carDrvEqpNo+'</span></p>'+
                        '<p class="font_14"><span>完成状态：</span><span class="done2">完成</span></p>';
                }else{
                    //   newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" style="width: 13px;height: 21px;"/>'+'<br><strong class="font_16 color_text">'+carlItem.sfrPartyName+'</strong>'; // 15px-24px ; 13px-21px
                    newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" style="width: 13px;height: 21px;"/>'; // 15px-24px ; 13px-21px
                    marker.content = '<p class="font_14"><span>委托人：</span><span>'+carlItem.sfrPartyName+'</span></p>'+
                        '<p class="font_14"><span>司机：</span><span>'+carDrvContactName+'</span></p>'+
                        '<p class="font_14"><span>车牌：</span><span>'+carDrvEqpNo+'</span></p>'+
                        '<p class="font_14"><span>完成状态：</span><span class="no_done">未完成</span></p>';
                }
                marker.setContent(newDiv);  //更新点标记内容
                marker.on('click', signalOrderClick);
                marker.emit('click', {target: marker});
                pointsArray2.push(marker);
            }
        }
    }
    serviceMap.setZoomAndCenter(11, [121.473658,31.230378]);
}

function signalOrderClick(e) {
    infoWindow2.setContent(e.target.content);
    infoWindow2.open(serviceMap, e.target.getPosition());
}

function markOrderNum(adOrderCountList,level,padcode,partName,totalCounts) {   // level（国省市区）
    switch(level)
    {
        case 'country':
            map.remove(orderMarkerArray);orderMarkerArray = [];
            $.each(adOrderCountList, function (index, item) {
                if(item.padcode == padcode && item.orderCount != 0){
                    var defualtPosition = [];
                    var string = item.defualtPosition.split(',');
                    var string1 = string[0],string2 = string[1];
                    var string1_1 = string1.split('[');
                    var defualtPosition1 = string1_1[1];
                    var string2_1 = string2.split(']');
                    var defualtPosition2 = string2_1[0];
                    defualtPosition.push(defualtPosition1);
                    defualtPosition.push(defualtPosition2);

                    var orderMarker = new AMap.Marker({
                        map: map,
                        position: defualtPosition,
                        offset: new AMap.Pixel(0, 0),
                        content: '<div class="provincePosDiv"><span class="provincePosDiv_l">'+item.name+'</span><span class="provincePosDiv_r">'+item.orderCount+'单</span></div>'
                    });
                    orderMarkerArray.push(orderMarker);
                }
            });
            $('#infoTip').html('<strong>'+userName+'</strong>-'+partName+'：总' + totalCounts +'单');
            break;
        case 'province':
            map.remove(orderMarkerArray);orderMarkerArray = [];
            var provinceOrderNum = 0;
            $.each(adOrderCountList, function (index, item) {
                provinceOrderNum += item.orderCount;
                if(item.padcode == padcode && item.orderCount != 0){
                    var defualtPosition = [];
                    var string = item.defualtPosition.split(',');
                    var string1 = string[0],string2 = string[1];
                    var string1_1 = string1.split('[');
                    var defualtPosition1 = string1_1[1];
                    var string2_1 = string2.split(']');
                    var defualtPosition2 = string2_1[0];
                    defualtPosition.push(defualtPosition1);
                    defualtPosition.push(defualtPosition2);

                    var orderMarker = new AMap.Marker({
                        map: map,
                        offset: new AMap.Pixel(0, 0),
                        position: defualtPosition,
                        content: '<div class="provincePosDiv"><span class="provincePosDiv_l">'+item.name+'</span><span class="provincePosDiv_r">'+item.orderCount+'单</span></div>'
                    });
                    orderMarkerArray.push(orderMarker);
                }
            });
            $('#infoTip').html('<strong>'+userName+'</strong>-'+partName+'：总' + provinceOrderNum +'单');
            break;
        case 'city':
            map.remove(orderMarkerArray);orderMarkerArray = [];
            var cityOrderNum = 0;
            $.each(adOrderCountList, function (index, item) {
                cityOrderNum += item.orderCount;
                if(item.padcode == padcode && item.orderCount != 0){
                    var defualtPosition = [];
                    var string = item.defualtPosition.split(',');
                    var string1 = string[0],string2 = string[1];
                    var string1_1 = string1.split('[');
                    var defualtPosition1 = string1_1[1];
                    var string2_1 = string2.split(']');
                    var defualtPosition2 = string2_1[0];
                    defualtPosition.push(defualtPosition1);
                    defualtPosition.push(defualtPosition2);

                    var orderMarker = new AMap.Marker({
                        map: map,
                        offset: new AMap.Pixel(0, 0),
                        position: defualtPosition,
                        content: '<div class="provincePosDiv"><span class="provincePosDiv_l">'+item.name+'</span><span class="provincePosDiv_r">'+item.orderCount+'单</span></div>'
                    });
                    orderMarkerArray.push(orderMarker);
                }
            });
            $('#infoTip').html('<strong>'+userName+'</strong>-'+partName+'：总' + cityOrderNum +'单');
            break;
        /*case 'district':
         map.remove(orderMarkerArray);orderMarkerArray = [];
         $.each(adOrderCountList, function (index, item) {
         if(item.padcode == padcode && item.orderCount != 0){
         var defualtPosition = [];
         var string = item.defualtPosition.split(',');
         var string1 = string[0],string2 = string[1];
         var string1_1 = string1.split('[');
         var defualtPosition1 = string1_1[1];
         var string2_1 = string2.split(']');
         var defualtPosition2 = string2_1[0];
         defualtPosition.push(defualtPosition1);
         defualtPosition.push(defualtPosition2);

         var orderMarker = new AMap.Marker({
         map: map,
         position: defualtPosition,
         content: '<div class="provincePosDiv"><span class="provincePosDiv_l">'+item.name+'</span><span class="provincePosDiv_r">'+item.orderCount+'单</span></div>'
         });
         orderMarkerArray.push(orderMarker);
         }
         });
         break;*/
    }
}

function todayOrderBar(totalCount,completeCount,dispatchCount,exceCount){
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
        var chartTitle_t = '今日订单(单位：单)';
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

function monthOrderBar(totalCount,completeCount,dispatchCount,exceCount){
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
        var chartTitle_t = '本月订单(单位：单)';
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

function partyWeekOrderLine(partyWeekOrderCountList,date){
    var LineChartSeriesListDate = date;
    var LineChart = echarts.init(document.getElementById('serviceLineChart'));
    var LineChartTitle = '委托人近一周订单数量统计(单位：单)';
    var LineChartSeriesList = [];
    $.each(partyWeekOrderCountList, function (index, item) {
        var items = {};
        items.name = item.partyName;
        items.type = 'line';
        items.stack = '总量';
        items.data = item.orderCounts;
        LineChartSeriesList.push(items);
    });
    PageChartLineOption(LineChart,LineChartTitle,LineChartSeriesList,LineChartSeriesListDate);
    LineChart.hideLoading();
    if($(window).height() > 974 || $(window).height() == 974){
        LineChart.setOption({
            tooltip: {
                position: ['-55%','-60%'],
            }
        });
    }
}

function Pie(){
    var PieChart = echarts.init(document.getElementById('inventoryChart_top'));
    var PieChartTitle = '近一周订单类型占比';
    var PieChartLegendData = '近一周订单类型占比';
    var PieChartSeriesList = [
        {value:30,name:'正常订单'},
        {value:26,name:'已完成订单'},
        {value:4,name:'异常订单'},
        {value:8,name:'在途订单'}
    ];

    PageChartPieOption(PieChart,PieChartTitle,PieChartLegendData,PieChartSeriesList);
    PieChart.hideLoading();
}

$(function () {
    $(document).on('click','#switchDivBtn',function(){
        switchDivBtnTimes += 1;
        if($(this).hasClass('show0')){
            $('.boardContainer-left22').eq(0).hide();
            $('.boardContainer-left22').eq(1).show();
            $(this).removeClass('show0');
            $(this).html('<< 返回地图操作');
            if(switchDivBtnTimes == 1){
                ajaxRequest('/icdp-chart-app-1.0.0/query/serviceOrderTransList?token='+userInfo.token+'&timeStamp='+userInfo.timeStamp+'&stoDistrictCode=100000', 'get','','partsOrderList22','标记全国订单点');
            }
        }else{
            $('.boardContainer-left22').eq(0).show();
            $('.boardContainer-left22').eq(1).hide();
            $(this).addClass('show0');
            $(this).html('监控所有订单 >>');
        }
    });
});

