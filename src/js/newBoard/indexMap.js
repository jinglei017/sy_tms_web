//板块颜色
var colors = ["#1c67b0"];

var currentAdcode = 100000;
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

    if(currentAdcode != 100000){
        getSuyeDataCenterByAdcode(currentAdcode)
    }

    var loginInf = JSON.parse(localStorage.getItem("logininf"));
    function getSuyeDataCenterByAdcode(adcode,codeGather){
        var url = chartUrl + "/query/suyeDataCenterByAdcode?token="+loginInf.token;
        if(codeGather){
            url = chartUrl + "/query/suyeDataCenterByAdcode?token="+loginInf.token+"&provinceCode="+codeGather.provinceCode+"&cityCode="+codeGather.cityCode;
        }
        getRequest(url,function(data){
            //看板订单数量和仓库数量统计
            getKbStatistics(data.result)

            //七日订单数量
            if(data.result.weekOrderCountList != null){
                getWeekOrderCountList(data.result.weekOrderCountList);
            }

            //今日客户订单数
            if(data.result.customerOrderCountVoList != null){
                getCustomerOrderVoList(data.result.customerOrderCountVoList);
            }

            //今日订单完成率
            if(data.result.orderCountInfoVo != null){
                getOrderCountInfoVo(data.result.orderCountInfoVo);
            }
            //车辆满载率
            if(data.result.fullLoadRateList != null){
                getFullLoadRateList(data.result.fullLoadRateList);
            }
            //可用仓库资源
            if(data.result.warehouseVoList != null){
                getWarehouseVoList(data.result.warehouseVoList);
            }
            //车辆区域分布
            if(data.result.carRegionVoList != null){
                getCarRegionVoList(data.result.carRegionVoList);
            }
            // 一周销售额
            if(data.result.salesVoList != null){
                getSalesVoList(data.result.salesVoList);
            }else{
                $(".dailySalesCharts").empty();
            }
        },1);
        var latLngUrl = chartUrl + "/query/orderCountListByGroup?token="+loginInf.token;
        if(codeGather){
            if(codeGather.provinceCode){
                if(codeGather.cityCode){
                    latLngUrl = chartUrl + "/query/orderDetailsInfoList?token="+loginInf.token+"&provinceCode="+codeGather.provinceCode+"&cityCode="+codeGather.cityCode;
                } else{
                    if(codeGather.provinceCode == "310000" || codeGather.provinceCode == "110000" || codeGather.provinceCode == "120000" || codeGather.provinceCode == "500000"){
                        latLngUrl = chartUrl + "/query/orderDetailsInfoList?token="+loginInf.token+"&provinceCode="+codeGather.provinceCode+"&cityCode="+codeGather.cityCode;
                    } else{
                        latLngUrl = chartUrl + "/query/orderCountListByGroup?token="+loginInf.token+"&provinceCode="+codeGather.provinceCode+"&cityCode="+codeGather.cityCode;
                    }
                }
            }
        } else{
            latLngUrl = chartUrl + "/query/orderCountListByGroup?token="+loginInf.token;
        }
        $.ajax({
            url: latLngUrl,
            type: "get",
            contentType : 'application/json',
            success: function (data) {
                //订单列表
                if(data.result != null ){
                    if(codeGather){
                        if(codeGather.provinceCode){
                            if(codeGather.cityCode){
                                getOrderInfoVoList(data.result);
                            } else{
                                if(codeGather.provinceCode == "310000" || codeGather.provinceCode == "110000" || codeGather.provinceCode == "120000" || codeGather.provinceCode == "500000"){
                                    getOrderInfoVoList(data.result);
                                }else{
                                    getOrderInfoVoList1(data.result);
                                }
                            }
                        }
                    }else{
                        getOrderInfoVoList1(data.result);
                    }
                }
            }
        });
	}
	//订单列表
	function getOrderInfoVoList(data,adcode){
        removeMarkers();
	    var testData = data;
	    setTimeout(function(){
	        for(var i = 0; i < testData.length; i++){
            	if(testData[i].stoLatLng != null && testData[i].stoLatLng != undefined && testData[i].stoLatLng !=""){
	                var item = testData[i].stoLatLng.split(",");
	                var itemArr = [item[0],item[1]];
                    var isComplete = "",carDrvContactName = "-",carDrvContactTel = "-",newDiv = document.createElement("div");
                    if(testData[i].carDrvContactName != null){
                        carDrvContactName = testData[i].carDrvContactName;
                    }
                    if(testData[i].carDrvContactTel != null){
                        carDrvContactTel = testData[i].carDrvContactTel;
                    }
                    if(testData[i].completeStatus == "1"){
                        isComplete = '<span style="color: #f9962d;">已完成</span>';
                        newDiv.innerHTML = '<img src="../../img/mark_or.png" title="'+testData[i].stoPartyName+'" style="width: 7px;height: 11px;"/>';
                    } else if(testData[i].completeStatus == "INIT"){
                        isComplete = '<span style="color: #f53642;">未开始</span>';
                        newDiv.innerHTML = '<img src="../../img/mark_r.png" title="'+testData[i].stoPartyName+'" style="width: 7px;height: 11px;"/>';
                    } else{
                        isComplete = '<span style="color: #64BD3D;">在途中</span>';
                        newDiv.innerHTML = '<img src="../../img/mark_gr.png" title="'+testData[i].stoPartyName+'" style="width: 7px;height: 11px;"/>';
                    }
                    marker = new AMap.Marker({
                        position: itemArr,
                        map: map,
                        offset: new AMap.Pixel(0, 0)
                    });
                    marker.content = '<p class="font_14"><span>发货商：</span><span>'+testData[i].sfrPartyName+'</span></p>'+
                        '<p class="font_14"><span>收货商：</span><span>'+testData[i].stoPartyName+'</span></p>'+
                        '<p class="font_14"><span>收货地址：</span><span>'+testData[i].stoAddress+'</span></p>'+
                        '<p class="font_14"><span>司机信息：</span><span>'+carDrvContactName +'-'+ carDrvContactTel+'</span></p>'+
                        '<p class="font_14"><span>完成状态：</span>'+isComplete+'</p>';

                    marker.setContent(newDiv);
	                marker.on('click', markerClick);
	                markersArray.push(marker);
	            }
	        }
	    },300)
	}

    //根据Hover状态设置相关样式
    function toggleHoverFeature(feature, isHover, position) {

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
		removeMarkers();
        if(props.childrenNum > 0) {  //如果存在子节点
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
                var codeGather = {
                    provinceCode: routeFeatures[1].properties.adcode,
                    cityCode: ""
                };
                switch2AreaNode(routeFeatures[1].properties.adcode,codeGather);  //切换到省级区域
            } else {
                switch2AreaNode(100000);  //切换到全国
                map.setZoomAndCenter(3.5, [104.112493,40.955112]);
                map.remove(markersArray);
                markersArray = [];
                $(".header .myfont").html(logininf.tenantName+"中国综合数据服务中心");
                $(".rangeStatistics").css({
                	'height':'0',
                	'opacity':'0'
                })
                $(".mcBottom").css({
                	'height':'auto',
                	'opacity':'1'
                })
                $(".todayVehicle").show(); $(".todayVehicle1").show();
                $(".todayOrder").hide(); $(".todayOrder1").hide();
                getSuyeDataCenterByAdcode('100000')
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
        	map.setZoomAndCenter(3.5, [104.112493,40.955112]);
        	//map.setZoomAndCenter(3.5, areaNode._data.geoData.lngLatParent.properties.centroid);
        }else{
        	map.setZoomAndCenter(8, areaNode._data.geoData.lngLatParent.properties.center);
        }
    }

    //切换区域后刷新显示内容
    function refreshAreaNode(areaNode) {
        districtExplorer.setHoverFeature(null);
        renderAreaPolygons(areaNode);
    }

    //切换区域
    function switch2AreaNode(adcode,codeGather, callback) {
        for(var i = 0; i < testData.length; i++){
            if(testData[i].adcode == adcode){
                $('.header .myfont').html(logininf.tenantName + testData[i].name + '综合数据服务中心');
                $(".mcBottom").css({
                	'height':'0',
                	'opacity':'0'
                })
                $(".rangeStatistics").css({
                	'height':'auto',
                	'opacity':'1'
                })
                $(".todayVehicle").hide(); $(".todayVehicle1").hide();
                $(".todayOrder").show(); $(".todayOrder1").show();
            }
        }
        if(adcode == 100000){
        	currentAdcode = adcode;
        }else{
        	currentAdcode = adcode;
        	getSuyeDataCenterByAdcode(adcode,codeGather);
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
                //console.error(error);
                return;
            }
            renderAreaPanel(areaNode);
            if (callback) {
                callback(null, areaNode);
            }
        });
    }


    //全国
    var partname = window.location.pathname;
  //  console.log(partname);
    if(partname == '/html/newBoard/index.html'){
    	switch2AreaNode(100000);
    }else{
    	switch2AreaNode(310000);
    }

});
