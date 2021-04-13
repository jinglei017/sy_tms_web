var app = new Vue({
    el: '#overall',
    data: {
        markerType: 1,
        areaTfoOrderInfo: [],
        taskOrderInfoList: [],
        waybillInfoList: [],
        handWaybillInfoList: [],
        autoWaybillInfoList: [],
        taskOrderTotalInfo: {
            str1: "",
            count: 0,
            totalQty: 0,
            totalWeight: 0,
            totalVolume: 0,
            startCompleteTime: getQueryTime(7),
            endCompleteTime: getQueryTime(0)
        },
        logininf: {},
        selectListData:[],
        dpDistrictList: [],
        patternArea: "1",
        boxToChoose: false,
        autoPartyLocation: {
            omOrderId: "",
            customAreaName: "",
            customAreaNo: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: ""
        },
        handPartyLocation: {
            omOrderId: "",
            customAreaName: "",
            customAreaNo: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: ""
        },
        areaDistrictList:[],
        areaDistrictGroups: [],
        districtPolygonGroups: [],
        overlaysGroups: [],
        pathList: [],
        manualPolygonGroups: [],
        certainPolygon: {},
        polyEditor: {},
        routine: "1",
        originalI: null,
        presentI: null,
        polygonAgain: {},
        restorePolygon: {},
        mapChangeColor: true,
        computeString: true,
        mouseTool: {},
        saveDisTimes: '0',
        markerArray: [],
        disabled: true,
        driverList: [],
        getDriverListTimer:null,
        waitScheduleOrder: [],
        initDriverList: [],
        resPartyList: [],
        carrierDriver: {},
        carrierEqp: {},
        OrderCarrier: {},
        OrderCarrierParty: {},
        resTfoOrder: {},
        shortShowType: false,
        currentAreaNum: 0,
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}),
        timeHorizon:"", //创建时间范围
        linkNames: ["片区排单","片区管理"],
        linkHrefs: [],
        shipperPartyLocation: {
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: ""
        },
        showCutMapCard: true,
        areaTemplateList: [],
        tsoOrderId: "",
        newAreaType: {
            str1: "",
            customerOriginalNo: "",
            int1: false
        },
        currPolygonGetPath: ""
    },
    methods:{
        // 获取全部订单
        getSearchOrderList(){
            var that = this;
            that.defaultMapShow();
            var startCompleteTime =that.timeHorizon.split(" - ")[0];
            var endCompleteTime =that.timeHorizon.split(" - ")[1];
            var searchFormArr = {
                startCompleteTime: startCompleteTime,
                endCompleteTime: endCompleteTime,
                isAsign: true
            };
            postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.waitScheduleOrder = data.result;
                that.markerArrayFun(that.waitScheduleOrder);
                that.markerType = 1;
            })
        },
        // 获取片区信息
        getSearchVal(info){
            var that = this;
            var startCompleteTime =that.timeHorizon.split(" - ")[0];
            var endCompleteTime =that.timeHorizon.split(" - ")[1];
            var searchFormArr = {
                startCompleteTime: startCompleteTime,
                endCompleteTime: endCompleteTime,
                tzoOrderIds: info.omOrderId,
                assignStatus: '0'
            };
            postRequest(tmsUrl + "/query/tjoTzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.areaTfoOrderInfo = data.result;
                that.taskOrderInfoList = data.result.tjoOrderList;
                that.markerArrayFun(that.taskOrderInfoList);
                that.markerType = 2;
            })
        },
        // 地图批量标记订单
        markerArrayFun(markerInfoArray){
            var that = this;
            if(that.markerArray.length > 0){ //清除所有标记点
                for(var a=0;a<that.markerArray.length;a++){
                    map.remove(that.markerArray[a]);
                }
            }
            map.remove(that.infoWindow);
            that.markerArray = [];
            if(markerInfoArray == null){
                return false;
            }

            for(var n = 0; n < markerInfoArray.length; n++){
                var newDiv = document.createElement("div");
                var item = markerInfoArray[n],markerLocation = [],stoLatLngStr = '';

                if(item.stoLatLng != null && item.stoLatLng != ''){
                    stoLatLngStr = item.stoLatLng;
                    var stoLatLngArr = item.stoLatLng.split(',');
                    markerLocation.push(stoLatLngArr[0]);
                    markerLocation.push(stoLatLngArr[1]);
                    newDiv.className  = 'orderMapPoint1';
                }else{
                    continue;
                }

                newDiv.setAttribute("stoLatLngStr",stoLatLngStr);
                newDiv.setAttribute("omOrderId",item.omOrderId);

                var marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });

                marker.setContent(newDiv);
                that.markerArray.push(marker);
                marker.on('click',that.clickSignalOrderInfo);
            }
        },
        // 点击订单标记点
        clickSignalOrderInfo(e){
            var that = this;
            var stoLatLngStrVal = e.target.ue.content.attributes.stoLatLngStr.value;
            var omOrderId = e.target.ue.content.attributes.omOrderId.value;
            $('.amap-info-contentContainer').show();
            var currentPointList = [],temp = [],info;
            if(that.markerType == 1){
                currentPointList = that.waitScheduleOrder;
            }else if(that.markerType == 2){
                currentPointList = that.taskOrderInfoList;
            }
            for(var n=0;n<currentPointList.length;n++){
                if(currentPointList[n].stoLatLng == stoLatLngStrVal){
                    temp.push(n);
                }
            }
            for (var i=0;i<currentPointList.length;i++) {
                if(currentPointList[i].omOrderId == omOrderId) {
                    var totalDiv = '';
                    for (var a=0; a<temp.length;a++) {
                        var tem = temp[a];
                        totalDiv += '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">单号：</span><span class="pointInfoColor2">' + currentPointList[tem].trackingNo + '</span></p>' +
                            '<p><span class="pointInfoColor1">件/毛/体：</span><span class="pointInfoColor2">' + currentPointList[tem].totalQty+'件 '+ currentPointList[tem].totalWeight+'kg '+ currentPointList[tem].totalVolume+'m³</span></p>' +
                            '<p><span class="pointInfoColor1">状态：</span><span class="pointInfoColor2">' + that.completeStatusChange(currentPointList[tem].completeStatus) + '</span></p>' +
                            '<p><span class="pointInfoColor1">发货商 | 地址：</span><span class="pointInfoColor2">' + currentPointList[tem].sfrPartyName +' | '+ currentPointList[tem].sfrAddress + '</span></p>' +
                            '<p><span class="pointInfoColor1">收货商 | 地址：</span><span class="pointInfoColor2">' + currentPointList[tem].stoPartyName +' | '+ currentPointList[tem].stoAddress + '</span></p>';
                    }
                    info = '<div>' +totalDiv + '</div>';
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        // 获取全部片区
        getWaybillInfoList(omId){
            var that = this;
            if(omId){
                for(var j=0;j<that.districtPolygonGroups.length;j++){
                    map.remove(that.districtPolygonGroups[j]);
                }
                for(var k=0;k<that.manualPolygonGroups.length;k++){
                    map.remove(that.manualPolygonGroups[k]);
                }
            }

            that.areaDistrictList = [];
            that.areaDistrictGroups = [];
            that.districtPolygonGroups = [];
            that.overlaysGroups = [];
            that.pathList = [];
            that.manualPolygonGroups = [];
            that.waybillInfoList = [];
            that.handWaybillInfoList = [];
            that.autoWaybillInfoList = [];
            var params = {
                tsoOrderId: that.tsoOrderId
            };
            postRequest(tmsUrl + "/query/tsoTzoOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                that.waybillInfoList = data.result;
                for(let i=0;i<data.result.length;i++){
                    if(data.result[i].orderNature == "自定义"){
                        that.handWaybillInfoList.push(data.result[i]);
                        that.pathList = eval(data.result[i].stoAddress);
                        that.reShowPolygon("1");
                    } else if(data.result[i].orderNature == "行政区"){
                        that.areaDistrictList = [];
                        that.saveDisTimes = '0';
                        that.autoWaybillInfoList.push(data.result[i]);
                        var stoAddressArray = data.result[i].stoAddress.split(',');
                        for(var j=0;j<stoAddressArray.length;j++){
                            that.areaDistrictList.push({
                                provinceCode: data.result[i].stoProvinceCode,
                                cityCode: data.result[i].stoCityCode,
                                districtCode: stoAddressArray[j],
                                chineseName: that.getDistrictName(stoAddressArray[j])
                            })
                        }
                        that.administrativeArea('1');
                    }
                }
                if(omId){
                    setTimeout(function () {
                        for(var i=0;i<that.waybillInfoList.length;i++){
                            if(that.waybillInfoList[i].omOrderId == omId){
                                that.setAreaInfoClick(that.waybillInfoList[i],i);
                                break;
                            }
                        }
                    },100);
                    return false;
                }
                that.mapClick();
                that.getSearchOrderList();
            })
        },
        // 获取片区模板
        getAreaTemplate(){
            var that = this;
            getRequest(tmsUrl + "/query/tsoOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,function(data){
                that.areaTemplateList = data.result;
                $.each(that.areaTemplateList,function(index,item){
                    if(item.int1 == 1){
                        that.tsoOrderId = item.omOrderId;
                        that.getWaybillInfoList();
                        return false;
                    }
                });
            })
        },

        // 切换片区模板
        changeWaybillInfoList(){
            var that = this;
            for(var j=0;j<that.districtPolygonGroups.length;j++){
                map.remove(that.districtPolygonGroups[j]);
            }
            for(var k=0;k<that.manualPolygonGroups.length;k++){
                map.remove(that.manualPolygonGroups[k]);
            }
            that.getWaybillInfoList();
        },
        //点击新增模板
        addAreaTemplate(){
            var that = this;
            that.newAreaType = {
                str1: "",
                customerOriginalNo: "",
                int1: false
            };
            $(".maskLayer5").show();
        },
        //保存新增片区模板
        sureAddAreaTemplate(){
            var that = this;
            if(that.newAreaType.str1 == ""){
                imitatePopup("请先填写模板名称！","alert");
                return false;
            }
            if(that.newAreaType.customerOriginalNo == ""){
                that.newAreaType.customerOriginalNo = that.newAreaType.str1;
            }
            if(that.newAreaType.int1 == false){
                that.newAreaType.int1 = '0';
            }else if(that.newAreaType.int1 == true){
                that.newAreaType.int1 = '1';
            }
            var param = {
                order: that.newAreaType
            };
            postRequest(tmsUrl + "/insert/tsoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                imitatePopup("片区模板新增成功！","alert");
                $(".maskLayer5").hide();
                that.getAreaTemplate();
            })
        },

        // 点击新增片区
        addTaskArea(){
            var that = this;
            if(that.tsoOrderId == null || that.tsoOrderId == undefined){
                imitatePopup("请先选择片区模板！","alert");
                return false;
            }
            that.boxToChoose = !that.boxToChoose;
        },
        addTaskArea1(index){
            var that = this;
            that.boxToChoose = false;
            if(index == '2'){
                $(".maskLayer1").show();
                that.saveDisTimes = '0';
                that.autoPartyLocation = {
                    customAreaName: "",
                    customAreaNo: "",
                    countryCode: "100000",
                    provinceCode: "",
                    cityCode: "",
                    districtCode: ""
                };
                that.areaDistrictList = [];
            } else if(index == '1'){
                that.drawPolygon('2')
            }
        },
        // 点击清空片区
        clearAllTaskArea(){
            var that = this;
            imitatePopup("确定清空片区？","confirm",function(res){
                if(res == 1){
                    var omOrderId = [];
                    for(var i=0;i<that.waybillInfoList.length;i++){
                        omOrderId.push(that.waybillInfoList[i].omOrderId)
                    }
                    postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                        if(data.msg == "success" || data.msg == "SUCCESS"){
                            for(var j=0;j<that.districtPolygonGroups.length;j++){
                                map.remove(that.districtPolygonGroups[j]);
                            }
                            for(var k=0;k<that.manualPolygonGroups.length;k++){
                                map.remove(that.manualPolygonGroups[k]);
                            }
                            that.areaDistrictList = [];
                            that.areaDistrictGroups = [];
                            that.districtPolygonGroups = [];
                            that.overlaysGroups = [];
                            that.pathList = [];
                            that.manualPolygonGroups = [];
                            that.waybillInfoList = [];
                            that.handWaybillInfoList = [];
                            that.autoWaybillInfoList = [];
                        }
                    })
                }
            })
        },

        // 自定义绘制片区
        drawPolygon(num){
            var that = this;
            that.areasCompute();
            if(!that.computeString){
                return false
            }
            $(".btnBoxGroup").hide();
            var overlays = [];
            that.pathList = [];
            that.routine = '3';
            that.mouseTool = new AMap.MouseTool(map);
            that.mouseTool.on('draw',function(e){
                overlays.push(e.obj);
            });
            that.mouseTool.polygon({
                strokeWeight: 2,
                fillOpacity: 0.26,
                fillColor: '#22bcee',
                strokeColor: '#22bcee'
            });
            that.overlaysGroups.push(overlays);
            AMap.event.addListener(that.mouseTool,'draw',function(e){
                $(".btnBoxGroup").show();
                that.routine = '1';
                that.patternArea = num;
                that.pathList = e.obj.ue.path;
                that.mouseTool.close();
                that.mouseTool = {};
            });
        },
        // 取消自定义绘制片区
        cancelDrawPolygon(){
            var that = this;
            if(that.routine == '1'){
                if(!that.computeString){
                    map.remove(that.manualPolygonGroups[that.manualPolygonGroups.length-1]);
                    that.manualPolygonGroups.splice(that.manualPolygonGroups.length-1,1);
                }else{
                    map.remove(that.overlaysGroups[that.overlaysGroups.length-1]);
                    that.overlaysGroups.splice(that.overlaysGroups.length-1,1);
                }
            } else if(that.routine == '2'){
                that.polyEditor.close();
                map.remove(that.manualPolygonGroups[that.manualPolygonGroups.length-1]);
                that.manualPolygonGroups.splice(that.manualPolygonGroups.length-1,1);
                that.routine = "1";
            } else if(that.routine == '4'){
                map.remove(that.manualPolygonGroups[that.manualPolygonGroups.length-1]);
                that.manualPolygonGroups.splice(that.manualPolygonGroups.length-1,1);
            }
            that.patternArea = '1';
        },

        // 保存自定义绘制片区
        saveDrawPolygon(){
            var that = this;
            if(that.routine == '1'){
                that.reShowPolygon('1');
                that.areasCompute();
                if(!that.computeString){
                    return false
                }
            } else if(that.routine == '2'){
                that.areasCompute();
                if(!that.computeString){
                    return false
                }
                that.polyEditor.close();
                that.routine = '1';
            }
            $(".maskLayer2").show();
            that.handPartyLocation = {
                omOrderId: "",
                customAreaName: "",
                customAreaNo: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: ""
            }
        },
        adminManualArea(){
            var that = this;
            if(that.handPartyLocation.customAreaName == "" || that.handPartyLocation.customAreaName == undefined){
                imitatePopup("请填写自定义片区名称！","alert");
                return false;
            }
            var addressPath = "";
            for(var i=0;i<that.pathList.length;i++){
                var pathItem = "["+that.pathList[i].lng+","+that.pathList[i].lat+"],";
                if(i == that.pathList.length-1){
                    pathItem = "["+that.pathList[i].lng+","+that.pathList[i].lat+"]";
                }
                addressPath+=pathItem
            }

            if(that.originalI != null){
                that.adminManualAreaAgain(that.currPolygonGetPath);
            } else{
                var params = {
                    tsoOrderId: that.tsoOrderId,
                    order:{
                        orderNature:"自定义",
                        customerOriginalNo: that.handPartyLocation.customAreaNo,
                        str1: that.handPartyLocation.customAreaName
                    },
                    stationLocationInfoList:[{
                        provinceCode: that.handPartyLocation.provinceCode,
                        cityCode: that.handPartyLocation.cityCode,
                        districtCode: "",
                        address: "["+addressPath+"]"
                    }]
                };
                postRequest(tmsUrl + "/insert/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    if(data.msg == "success" || data.msg == "SUCCESS"){
                        that.patternArea = '1';
                        $(".maskLayer2").hide();
                        map.clearMap();
                        that.getWaybillInfoList();
                    }
                });
            }
        },

        // 调整自定义绘制片区
        adjustDrawPolygon(){
            var that = this;
            if(that.routine == '1'){
                if(that.overlaysGroups.length > 0){
                    that.reShowPolygon('1');
                }
            }
            that.routine = '2';
            that.polyEditor = new AMap.PolyEditor(map,that.manualPolygonGroups[that.manualPolygonGroups.length-1]); // 实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
            that.polyEditor.open(); // 开启编辑模式
            that.polyEditor.on('adjust', function(e) {
                that.pathList = e.target.ue.path;
            })
        },
        // 自定义绘制片区转换、显示、点击
        reShowPolygon(num){
            var that = this;
            if(num == '1'){
                if(that.overlaysGroups.length > 0){
                    map.remove(that.overlaysGroups[that.overlaysGroups.length-1]);
                    that.overlaysGroups.splice(that.overlaysGroups.length-1,1);
                }
                that.certainPolygon = new AMap.Polygon({
                    path: that.pathList,
                    strokeWeight: 2,
                    fillOpacity: 0.26,
                    fillColor: '#22bcee',
                    strokeColor: '#22bcee'
                });
                that.manualPolygonGroups.push(that.certainPolygon);
            } else if(num == '2'){
                map.remove(that.manualPolygonGroups[that.originalI]);
                that.certainPolygon = new AMap.Polygon({
                    path: that.restorePolygon,
                    strokeWeight: 2,
                    fillOpacity: 0.26,
                    strokeStyle: "dashed",
                    fillColor: '#00D500',
                    strokeColor: '#00D500'
                });
                that.manualPolygonGroups[that.originalI] = that.certainPolygon;
            } else if(num == '3'){
                map.remove(that.overlaysGroups[that.overlaysGroups.length-1]);
                that.overlaysGroups.splice(that.overlaysGroups.length-1,1);
                that.certainPolygon = new AMap.Polygon({
                    path: that.pathList,
                    strokeWeight: 2,
                    fillOpacity: 0.26,
                    strokeStyle: "dashed",
                    fillColor: '#00D500',
                    strokeColor: '#00D500'
                });
                that.manualPolygonGroups[that.originalI] = that.certainPolygon;
            }
            map.add(that.certainPolygon);
            that.certainPolygon.on("click",function(e){
                if(that.patternArea == '2' || that.routine == '3'){
                    return false;
                } else if(that.routine == '2'){
                    imitatePopup("未保存或取消新增的片区！","alert");
                } else{
                    that.patternArea = '3';
                    for(var i=0;i<that.manualPolygonGroups.length;i++){
                        if(that.manualPolygonGroups[i].getPath() == e.target.ue.path){
                            that.originalI = i;
                            that.handPartyLocation = {
                                omOrderId: that.handWaybillInfoList[that.originalI].omOrderId,
                                customAreaName: that.handWaybillInfoList[that.originalI].str1,
                                customAreaNo: that.handWaybillInfoList[that.originalI].customerOriginalNo,
                                countryCode: "100000",
                                provinceCode: that.handWaybillInfoList[that.originalI].stoProvinceCode,
                                cityCode: that.handWaybillInfoList[that.originalI].stoCityCode
                            };
                            that.getSearchVal(that.handWaybillInfoList[i]);
                            that.manualPolygonGroups[i].setOptions({
                                strokeStyle: "dashed",
                                fillColor: '#00D500',
                                strokeColor: '#00D500'
                            });
                            for(var j=0;j<that.waybillInfoList.length;j++){
                                if(that.waybillInfoList[j].omOrderId == that.handWaybillInfoList[i].omOrderId){
                                    $(".boxInConcent li.long").removeClass("active");
                                    $(".boxInConcent li.long").eq(j).addClass("active");
                                    break;
                                }
                            }
                        }else{
                            that.manualPolygonGroups[i].setOptions({
                                strokeStyle: "solid",
                                fillColor: '#22bcee',
                                strokeColor: '#22bcee'
                            });
                        }
                    }
                    for(var m=0;m<that.districtPolygonGroups.length;m++){
                        for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                            that.districtPolygonGroups[m][n].setOptions({
                                strokeStyle: "solid",
                                fillColor: '#22bcee',
                                strokeColor: '#22bcee'
                            })
                        }
                    }
                }
            });
        },
        // 点击地图空白区域
        mapClick(){
            var that = this;
            map.on('click', function(e){
                if(!that.computeString || that.overlaysGroups.length > 0 || that.patternArea == '2'){
                    return false;
                }
                if(that.markerArray.length > 0){
                    for(var a=0;a<that.markerArray.length;a++){
                        map.remove(that.markerArray[a]);
                    }
                }
                map.remove(that.infoWindow);
                that.originalI = null;
                that.presentI = null;
                that.taskOrderTotalInfo.str1 = "";
                if(that.mapChangeColor){
                    that.defaultMapShow();
                    that.markerArrayFun(that.waitScheduleOrder);
                    that.markerType = 1;
                } else{
                    imitatePopup("未保存调整片区！","alert")
                }
            });
        },
        // 片区、标记点默认展示样式
        defaultMapShow(){
            var that = this;
            that.patternArea = '1';
            for(var m=0;m<that.districtPolygonGroups.length;m++){
                for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                    that.districtPolygonGroups[m][n].setOptions({
                        strokeStyle: "solid",
                        fillColor: '#22bcee',
                        strokeColor: '#22bcee'
                    })
                }
            }
            for(var i=0;i<that.manualPolygonGroups.length;i++){
                that.manualPolygonGroups[i].setOptions({
                    strokeStyle: "solid",
                    fillColor: '#22bcee',
                    strokeColor: '#22bcee'
                });
            }
            $(".boxInConcent li.long").removeClass("active");
        },

        // 重新绘制自定义片区
        drawPolygonAgain(){
            var that = this;
            that.restorePolygon = that.manualPolygonGroups[that.originalI].getPath().slice(0);
            map.remove(that.manualPolygonGroups[that.originalI]);
            that.drawPolygon('6');
            that.mapChangeColor = true;
        },
        adjustDrawPolygonAgain(){
            var that = this;
            if(that.routine == '1') {
                that.routine = '2';
                if (that.overlaysGroups.length > 0) {
                    that.reShowPolygon('3');
                }
                that.polyEditor = new AMap.PolyEditor(map, that.manualPolygonGroups[that.originalI]);
                that.polyEditor.open();
                that.polyEditor.on('adjust', function (e) {
                    that.polygonAgain = e.target;
                });
            }
            that.mapChangeColor = false;
        },
        // 重新绘制后保存自定义片区
        saveDrawPolygonAgain(){
            var that = this;
            if(that.routine == '1'){
                that.reShowPolygon('3');
                that.areasCompute();
                if(!that.computeString){
                    return false
                }
            } else if(that.routine == '2'){
                that.areasCompute();
                if(!that.computeString){
                    return false
                }
                that.polyEditor.close();
                that.routine = '1';
            }
            that.adminManualAreaAgain(that.manualPolygonGroups[that.originalI].getPath());
        },
        cancelDrawPolygonAgain(){
            var that = this;
            if(that.routine == '1'){
                map.remove(that.overlaysGroups[that.overlaysGroups.length-1]);
                that.overlaysGroups.splice(that.overlaysGroups.length-1,1);
                map.add(that.manualPolygonGroups[that.originalI]);
            } else if(that.routine == '2'){
                that.polyEditor.close();
                that.reShowPolygon(2);
                that.routine = "1";
            }
            that.patternArea = '3';
            that.mapChangeColor = true;
        },

        // 再次调整自定义绘制片区
        adjustPolygonAgain(){
            var that = this;
            that.patternArea = '5';
            that.polyEditor = {};
            that.restorePolygon = that.manualPolygonGroups[that.originalI].getPath().slice(0);
            that.polyEditor = new AMap.PolyEditor(map,that.manualPolygonGroups[that.originalI]);
            that.polyEditor.open();
            that.polyEditor.on('adjust', function(e) {
                that.polygonAgain = e.target;
            });
            that.mapChangeColor = false;
        },
        cancelAdjustPolygonAgain(){
            var that = this;
            that.polyEditor.close();
            that.patternArea = '3';
            that.reShowPolygon(2);
            that.mapChangeColor = true;
        },
        saveAdjustPolygonAgain(){
            var that = this;
            that.areasCompute();
            if(!that.computeString){
                return false
            }
            // that.polyEditor.close();
            // that.manualPolygonGroups[that.originalI] = that.polygonAgain;
            if(that.polygonAgain.CLASS_NAME == undefined){
                that.currPolygonGetPath = that.areaTfoOrderInfo.stoAddress;
            } else{
                that.currPolygonGetPath = that.polygonAgain.getPath();
            }
            $(".maskLayer2").show();
        },

        // 重新绘制或调整自定义片区之后保存片区
        adminManualAreaAgain(path){
            var that = this;
            var path = path;
            var addressStr = "";
            if(that.polygonAgain.CLASS_NAME == undefined){
                addressStr = path;
            } else{
                var addressPath = [];
                for(var i=0;i<path.length;i++){
                    var pathItem = "["+path[i].lng+","+path[i].lat+"]";
                    addressPath .push(pathItem)
                }
                addressStr ="["+addressPath.toString()+"]";
            }
            var params = {
                order:{
                    omOrderId: that.handPartyLocation.omOrderId,
                    orderNature:"自定义",
                    customerOriginalNo: that.handPartyLocation.customAreaNo,
                    str1: that.handPartyLocation.customAreaName
                },
                stationLocationInfoList:[{
                    provinceCode: that.handPartyLocation.provinceCode,
                    cityCode: that.handPartyLocation.cityCode,
                    districtCode: "",
                    address: addressStr
                }]
            };
            postRequest(tmsUrl + "/save/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    that.polyEditor.close();
                    that.manualPolygonGroups[that.originalI] = that.polygonAgain;
                    $(".maskLayer2").hide();
                    map.clearMap();

                    that.handWaybillInfoList[that.originalI].stoAddress = "["+addressPath+"]";
                    that.mapChangeColor = true;
                    that.getSearchOrderList();
                    that.getWaybillInfoList();
                }
            });
        },

        // 删除选中自定义绘制片区
        deletePolygon(){
            var that = this;
            imitatePopup("确定删除该片区？","confirm",function(res){
                if(res == 1){
                    var omOrderId = [that.handWaybillInfoList[that.originalI].omOrderId];
                    postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                        if(data.msg == "success" || data.msg == "SUCCESS"){
                            for(var j=0;j<that.waybillInfoList.length;j++){
                                if(that.waybillInfoList[j].omOrderId == that.handWaybillInfoList[that.originalI].omOrderId){
                                    that.waybillInfoList.splice(j,1);
                                    break;
                                }
                            }
                            $(".boxInConcent li.long").removeClass("active");
                            map.remove(that.manualPolygonGroups[that.originalI]);
                            that.manualPolygonGroups.splice(that.originalI,1);
                            that.patternArea = '1';
                        }
                    });
                }
            })
        },

        // 查看自定义片区运单
        handWaybillInfoItem(){
            var that = this;
            $(".maskLayer3").show();
        },

        // 选择行政区域片区（区、县）
        addToDistrict(){
            var that = this;
            $(".toolBodyDiv").toggle();
        },
        deleteToDistrict(index){
            var that = this;
            that.areaDistrictList.splice(index,1);
        },
        // 绘制选中行政区域片区
        administrativeArea(num){
            var that = this;
            if(that.saveDisTimes == '1'){
                map.remove(that.districtPolygonGroups[that.presentI]);
            }
            var polygons = [];
            var district = null;
            if(!district){
                var opts = {
                    subdistrict: 0,   //获取边界不需要返回下级行政区
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: 'district'  //查询行政级别为 市
                };
                district = new AMap.DistrictSearch(opts);  //实例化DistrictSearch
            }
            district.setLevel("district");  //行政区查询
            for(var j=0;j<that.areaDistrictList.length;j++){
                var areaName = that.areaDistrictList[j].chineseName.trim();
                district.search(areaName, function(status, result) {
                    var bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            var polygon = new AMap.Polygon({  //生成行政区划polygon
                                strokeWeight: 2,
                                path: bounds[i],
                                fillOpacity: 0.26,
                                fillColor: '#22bcee',
                                strokeColor: '#22bcee'
                            });
                            polygon.areaName = areaName;
                            polygons.push(polygon);
                            polygon.on("click",that.setOptionsClick);
                        }
                    }
                    map.add(polygons);
                });
            }
            if(that.saveDisTimes == '0'){
                that.areaDistrictGroups.push(that.areaDistrictList);
                that.districtPolygonGroups.push(polygons);
            } else if(that.saveDisTimes == '1'){
                that.areaDistrictGroups[that.presentI] = that.areaDistrictList;
                that.districtPolygonGroups[that.presentI] = polygons;
            }
            if(num != '1'){
                setTimeout(function () {
                    that.areasCompute('1');
                },200);
            }
        },
        saveAdministrativeArea(){
            var that = this;
            if(that.autoPartyLocation.customAreaName == "" || that.autoPartyLocation.customAreaName == undefined){
                imitatePopup("请填写行政区域片区名称！","alert");
                return false;
            }
            if(that.saveDisTimes == '0'){
                var addressPath = "";
                for(var i=0;i<that.areaDistrictGroups[that.areaDistrictGroups.length-1].length;i++){
                    var pathItem = that.areaDistrictGroups[that.areaDistrictGroups.length-1][i].districtCode+",";
                    if(i == that.areaDistrictGroups[that.areaDistrictGroups.length-1].length-1){
                        pathItem = that.areaDistrictGroups[that.areaDistrictGroups.length-1][i].districtCode;
                    }
                    addressPath += pathItem;
                }
                var params = {
                    tsoOrderId: that.tsoOrderId,
                    order:{
                        orderNature:"行政区",
                        customerOriginalNo: that.autoPartyLocation.customAreaNo,
                        str1: that.autoPartyLocation.customAreaName
                    },
                    stationLocationInfoList: [{
                        provinceCode: that.autoPartyLocation.provinceCode,
                        cityCode: that.autoPartyLocation.cityCode,
                        districtCode: "",
                        address: addressPath
                    }]
                };
                postRequest(tmsUrl + "/insert/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    if(data.msg == "success" || data.msg == "SUCCESS"){
                        that.patternArea = '1';
                        $(".maskLayer1").hide();
                        map.clearMap();
                        that.getWaybillInfoList();
                    }
                });
            } else if(that.saveDisTimes == '1'){
                var addressPath = "";
                for(var j=0;j<that.areaDistrictGroups[that.presentI].length;j++){
                    var pathItem = that.areaDistrictGroups[that.presentI][j].districtCode+",";
                    if(j == that.areaDistrictGroups[that.presentI].length-1){
                        pathItem = that.areaDistrictGroups[that.presentI][j].districtCode;
                    }
                    addressPath += pathItem;
                }
                var params = {
                    order:{
                        omOrderId: that.autoPartyLocation.omOrderId,
                        orderNature:"行政区",
                        customerOriginalNo: that.autoPartyLocation.customAreaNo,
                        str1: that.autoPartyLocation.customAreaName
                    },
                    stationLocationInfoList: [{
                        provinceCode: that.autoPartyLocation.provinceCode,
                        cityCode: that.autoPartyLocation.cityCode,
                        districtCode: "",
                        address: addressPath
                    }]
                };
                postRequest(tmsUrl + "/save/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    if(data.msg == "success" || data.msg == "SUCCESS"){
                        that.autoWaybillInfoList[that.presentI].str1 = that.autoPartyLocation.customAreaName;
                        that.autoWaybillInfoList[that.presentI].customerOriginalNo = that.autoPartyLocation.customAreaNo;
                        that.autoWaybillInfoList[that.presentI].stoProvinceCode = that.autoPartyLocation.provinceCode;
                        that.autoWaybillInfoList[that.presentI].stoCityCode = that.autoPartyLocation.cityCode;
                        that.autoWaybillInfoList[that.presentI].stoAddress = addressPath;
                        that.patternArea = '1';
                        $(".maskLayer1").hide();
                        that.getSearchOrderList();
                    }
                });
            }
        },

        // 点击行政区域片区
        setOptionsClick(e){
            var that = this;
            if(that.patternArea == '2' || that.routine == '3'){
                return false;
            }
            that.patternArea = '4';
            var areaName = e.target.areaName;
            for(var i=0;i<that.manualPolygonGroups.length;i++){
                that.manualPolygonGroups[i].setOptions({
                    strokeStyle: "solid",
                    fillColor: '#22bcee',
                    strokeColor: '#22bcee'
                });
            }
            for(var m=0;m<that.districtPolygonGroups.length;m++){
                for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                    that.districtPolygonGroups[m][n].setOptions({
                        strokeStyle: "solid",
                        fillColor: '#22bcee',
                        strokeColor: '#22bcee'
                    })
                }
            }
            for(var a=0;a<that.areaDistrictGroups.length;a++){
                var list = that.areaDistrictGroups[a];
                for(var b=0;b<list.length;b++){
                    if(list[b].chineseName == areaName){
                        that.presentI = a;
                        that.getSearchVal(that.autoWaybillInfoList[a]);
                        var poList = that.districtPolygonGroups[a];
                        for(var c=0;c<poList.length;c++){
                            poList[c].setOptions({
                                strokeStyle: "dashed",
                                fillColor: '#ed7d31',
                                strokeColor: '#ed7d31'
                            })
                        }
                        for(var j=0;j<that.waybillInfoList.length;j++){
                            if(that.waybillInfoList[j].omOrderId == that.autoWaybillInfoList[a].omOrderId){
                                $(".boxInConcent li.long").removeClass("active");
                                $(".boxInConcent li.long").eq(j).addClass("active");
                                break;
                            }
                        }
                    }
                }
            }
        },
        // 删除行政区域片区
        deleteDistrictPolygon(){
            var that = this;
            imitatePopup("确定删除该片区？","confirm",function(res){
                if(res == 1){
                    var omOrderId = [that.autoWaybillInfoList[that.presentI].omOrderId];
                    postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                        if(data.msg == "success" || data.msg == "SUCCESS"){
                            for(var j=0;j<that.waybillInfoList.length;j++){
                                if(that.waybillInfoList[j].omOrderId == that.autoWaybillInfoList[that.presentI].omOrderId){
                                    that.waybillInfoList.splice(j,1);
                                    break;
                                }
                            }
                            $(".boxInConcent li.long").removeClass("active");
                            map.remove(that.districtPolygonGroups[that.presentI]);
                            that.districtPolygonGroups.splice(that.presentI,1);
                            that.areaDistrictGroups.splice(that.presentI,1);
                            that.patternArea = '1';
                        }
                    })
                }
            })
        },

        // 调整选中行政区域片区
        adjustSelectDistrictPolygon(){
            var that = this;
            $(".maskLayer1").show();
            that.saveDisTimes = '1';
            that.autoPartyLocation = {
                omOrderId: that.autoWaybillInfoList[that.presentI].omOrderId,
                customAreaName: that.autoWaybillInfoList[that.presentI].str1,
                customAreaNo: that.autoWaybillInfoList[that.presentI].customerOriginalNo,
                countryCode: "100000",
                provinceCode: that.autoWaybillInfoList[that.presentI].stoProvinceCode,
                cityCode: that.autoWaybillInfoList[that.presentI].stoCityCode,
                districtCode: ""
            };
            that.areaDistrictList = that.areaDistrictGroups[that.presentI];
        },
        // 查看行政区片区运单
        autoWaybillInfoItem(){
            var that = this;
            $(".maskLayer3").show();
        },

        // 片区之间关系判断
        areasCompute(type){
            var that = this;
            that.computeString = true;
            if(type != '1'){
                for(var i=0;i<that.manualPolygonGroups.length;i++){
                    var polygonItemPath1 = that.manualPolygonGroups[i].getPath();
                    for(var j=0;j<that.manualPolygonGroups.length;j++){
                        var polygonItemPath2 = that.manualPolygonGroups[j].getPath();
                        if(polygonItemPath2 != polygonItemPath1){
                            var areaRing1 = AMap.GeometryUtil.isRingInRing(polygonItemPath2,polygonItemPath1);
                            var areaRing2 = AMap.GeometryUtil.isRingInRing(polygonItemPath2,polygonItemPath1);
                            var areaRingIntersect2 = AMap.GeometryUtil.doesRingRingIntersect(polygonItemPath2,polygonItemPath1);
                            if(areaRing1 || areaRing2 || areaRingIntersect2){
                                imitatePopup("片区之间不可以相交或覆盖！","alert");
                                that.computeString = false;
                                return false;
                            }
                        }
                    }
                }
            }
            for (var a=0; a<that.districtPolygonGroups.length;a++) {
                for (var b=0; b<that.districtPolygonGroups[a].length;b++) {
                    var polygonItemPath3 = that.districtPolygonGroups[a][b].getPath();
                    if(that.manualPolygonGroups.length == 0){
                        if(type == '1'){
                            that.saveAdministrativeArea();
                        }
                        return false;
                    } else{
                        for(var c=0;c<that.manualPolygonGroups.length;c++){
                            var polygonItemPath4 = that.manualPolygonGroups[c].getPath();
                            var areaRing3 = AMap.GeometryUtil.isRingInRing(polygonItemPath4,polygonItemPath3);
                            var areaRing4 = AMap.GeometryUtil.isRingInRing(polygonItemPath3,polygonItemPath4);
                            var areaRingIntersect1 = AMap.GeometryUtil.doesRingRingIntersect(polygonItemPath4,polygonItemPath3);
                            if(areaRing3 || areaRing4 || areaRingIntersect1){
                                imitatePopup("片区之间不可以相交或覆盖！","alert");
                                that.computeString = false;
                                if(type == '1'){
                                    map.remove(that.districtPolygonGroups[a]);
                                    that.districtPolygonGroups.splice(a,1);
                                    that.areaDistrictGroups.splice(that.areaDistrictGroups.length-1,1);
                                    $(".maskLayer1").show();
                                    return false;
                                }
                                return false;
                            }
                            if(type == '1'){
                                if(a == that.districtPolygonGroups.length-1 &&
                                    b == that.districtPolygonGroups[that.districtPolygonGroups.length-1].length-1 &&
                                    c == that.manualPolygonGroups.length-1){
                                    if(that.computeString == true){
                                        that.saveAdministrativeArea();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },

        // 点击右侧片区列表
        setAreaInfoClick(item,index){
            var that = this;
            that.areaDistrictList = [];
            that.currentAreaNum = index;
            if(that.patternArea == '2' || that.routine == '3'){
                return false;
            } else if(that.routine == '2'){
                imitatePopup("未保存或取消新增的片区！","alert");
                return false;
            }

            that.defaultMapShow();
            $(".boxInConcent li.long").eq(index).addClass("active");

            if(item.orderNature == "自定义"){
                for(var i=0;i<that.handWaybillInfoList.length;i++){
                    if(that.handWaybillInfoList[i].omOrderId == item.omOrderId){
                        that.originalI = i;
                        that.getSearchVal(that.handWaybillInfoList[i]);
                        that.manualPolygonGroups[i].setOptions({
                            strokeStyle: "dashed",
                            fillColor: '#00D500',
                            strokeColor: '#00D500'
                        });
                        that.patternArea = '3';
                    }
                }
            } else if(item.orderNature == "行政区"){
                for(var j=0;j<that.autoWaybillInfoList.length;j++){
                    if(that.autoWaybillInfoList[j].omOrderId == item.omOrderId){
                        that.presentI = j;
                        that.getSearchVal(that.autoWaybillInfoList[j]);
                        for(var d=0;d<that.districtPolygonGroups[j].length;d++){
                            var disItem = that.districtPolygonGroups[j][d];
                            disItem.setOptions({
                                strokeStyle: "dashed",
                                fillColor: '#ed7d31',
                                strokeColor: '#ed7d31'
                            });
                            that.patternArea = '4';
                        }
                    }
                }
            }
        },

        // 点击“指派司机”按钮
        designateInfo(item,index){
            var that = this;
            if($(".boxInConcent li.long").eq(index).hasClass("active")){}else{
                that.setAreaInfoClick(item,index);
                $(".boxInConcent li.long").eq(index).addClass("active");
            }
            $(".maskLayer4").show();
            that.driverList = that.initDriverList;
            that.carrierDriver = {
                contactName: "",
                contactTel: ""
            };
            that.carrierEqp = {
                eqpNo: "",
                eqpName: "",
                eqpBrand: "",
                eqpType: "",
                eqpNature: "",
                eqpSpec: "",
                eqpLength: "",
                eqpWidth: "",
                eqpHeight: "",
                eqpStr1: "",
                eqpStr2: ""
            };
            that.OrderCarrier = {
                cdPartyId: "",
                contactTel: "",
                contactName: "",
                contactAddress: ""
            };
            that.OrderCarrierParty = {
                partyCode: "",
                isBuyer: false,
                isVendor: false,
                isTruck: false,
                isWarehouse: false,
                is3pl: false
            };
            that.OrderCarrier.cdPartyId = that.resPartyList[that.resPartyList.length-1].cdPartyId;
            that.changeCarrierInfo(that.OrderCarrier.cdPartyId);

            setTimeout(function () {
                if(that.areaTfoOrderInfo.carPartyId){
                    var plateinfo = {
                        refId: that.areaTfoOrderInfo.omOrderId,
                        refType:"CAR"
                    };
                    postRequest(tmsUrl + "/get/partyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,plateinfo,function(res){
                        var data = res.result;
                        that.carrierDriver = {
                            contactName: data.contact.contactName,
                            contactTel: data.contact.contactTel
                        };
                        that.carrierEqp = {
                            eqpNo: data.eqp.eqpNo,
                            eqpName: data.eqp.eqpName,
                            eqpBrand: data.eqp.eqpBrand,
                            eqpType: data.eqp.eqpType,
                            eqpNature: data.eqp.eqpNature,
                            eqpSpec: data.eqp.eqpSpec,
                            eqpLength: data.eqp.eqpLength,
                            eqpWidth: data.eqp.eqpWidth,
                            eqpHeight: data.eqp.eqpHeight,
                            eqpStr1: data.eqp.eqpStr1,
                            eqpStr2: data.eqp.eqpStr2
                        };
                        that.OrderCarrier = {
                            cdPartyId: "",
                            contactTel: data.imgContact.contactTel,
                            contactName: data.imgContact.contactName,
                            contactAddress: data.imgContact.contactAddress
                        };
                        that.OrderCarrierParty = {
                            partyCode: data.party.partyCode,
                            isBuyer: data.party.isBuyer,
                            isVendor: data.party.isVendor,
                            isTruck: data.party.isTruck,
                            isWarehouse: data.party.isWarehouse,
                            is3pl: data.party.is3pl
                        };
                        that.driverList = [];

                        for(var a=0;a<that.resPartyList.length;a++){
                            if(that.resPartyList[a].partyName == that.OrderCarrier.contactName) {
                                that.OrderCarrier.cdPartyId = that.resPartyList[a].cdPartyId;
                                break;
                            }
                        }
                    })
                }

                that.resTfoOrder = {
                    powerDto: that.areaTfoOrderInfo.powerDto,
                    authority: that.areaTfoOrderInfo.authority,
                    rowStatus: that.areaTfoOrderInfo.rowStatus,
                    pageInfo: that.areaTfoOrderInfo.pageInfo,
                    omOrderId: that.areaTfoOrderInfo.omOrderId,
                    orderNo: that.areaTfoOrderInfo.orderNo,
                    orderType: that.areaTfoOrderInfo.orderType,
                    orderNature: that.areaTfoOrderInfo.orderNature,
                    orderFrom: that.areaTfoOrderInfo.orderFrom,
                    orderTo: that.areaTfoOrderInfo.orderTo,
                    customerRefNo: that.areaTfoOrderInfo.customerRefNo,
                    customerOriginalNo: that.areaTfoOrderInfo.customerOriginalNo,
                    trackingNo: that.areaTfoOrderInfo.trackingNo,
                    orderTime: that.areaTfoOrderInfo.orderTime,
                    completeTime: that.areaTfoOrderInfo.completeTime,
                    expireTime: that.areaTfoOrderInfo.expireTime,
                    lot: that.areaTfoOrderInfo.lot,
                    totalQty: that.areaTfoOrderInfo.totalQty,
                    qtyUnit: that.areaTfoOrderInfo.qtyUnit,
                    totalWeight: that.areaTfoOrderInfo.totalWeight,
                    weightUnit: that.areaTfoOrderInfo.weightUnit,
                    totalVolume: that.areaTfoOrderInfo.totalVolume,
                    volumeUnit: that.areaTfoOrderInfo.volumeUnit,
                    totalAmount: that.areaTfoOrderInfo.totalAmount,
                    currency: that.areaTfoOrderInfo.currency,
                    orderInd: that.areaTfoOrderInfo.orderInd,
                    origin: that.areaTfoOrderInfo.origin,
                    remark: that.areaTfoOrderInfo.remark,
                    str1: that.areaTfoOrderInfo.str1,
                    str2: that.areaTfoOrderInfo.str2,
                    str3: that.areaTfoOrderInfo.str3,
                    int1: that.areaTfoOrderInfo.int1,
                    int2: that.areaTfoOrderInfo.int2,
                    int3: that.areaTfoOrderInfo.int3,
                    num1: that.areaTfoOrderInfo.num1,
                    num2: that.areaTfoOrderInfo.num2,
                    num3: that.areaTfoOrderInfo.num3,
                    umUserId: that.areaTfoOrderInfo.umUserId,
                    umTenantId: that.areaTfoOrderInfo.umTenantId,
                    createTime: that.areaTfoOrderInfo.createTime,
                    updateTime: that.areaTfoOrderInfo.updateTime,
                    ext: that.areaTfoOrderInfo.ext,
                    extList: that.areaTfoOrderInfo.extList,
                    initilRow: that.areaTfoOrderInfo.initilRow,
                    modifyRow: that.areaTfoOrderInfo.modifyRow,
                    deletedRow: that.areaTfoOrderInfo.deletedRow,
                    addRow: that.areaTfoOrderInfo.addRow
                };
            },2000)
        },

        // 切换承运商
        changeCarrierInfo(id){
            var that = this;
            if(id != ''){
                $.each(that.resPartyList, function (index, item) {
                    if (item.cdPartyId == id) {
                        that.OrderCarrier = {
                            cdPartyId: item.cdPartyId,
                            powerDto: item.powerDto,
                            authority: item.authority,
                            rowStatus: item.rowStatus,
                            pageInfo: item.pageInfo,
                            omContactId: item.cdContactId,
                            refId: item.refId,
                            refTo: "om_party",
                            contactType: item.imgContactType,
                            contactName: item.imgContactName,
                            contactTel: item.imgContactTel,
                            contactEmail: item.imgContactEmail,
                            contactAddress: item.imgContactAddress,
                            remark: null,
                            isDefault: item.isDefault,
                            umUserId: item.umUserId,
                            umTenantId: item.umTenantId,
                            createTime: item.createTime,
                            updateTime: item.updateTime,
                            ext: null,
                            extList: [],
                            initilRow: item.initilRow,
                            modifyRow: item.modifyRow,
                            deletedRow: item.deletedRow,
                            addRow: item.addRow
                        };
                        that.OrderCarrierParty = {
                            powerDto: item.powerDto,
                            authority: item.authority,
                            rowStatus: item.rowStatus,
                            pageInfo: item.pageInfo,
                            omPartyId: item.omPartyId,
                            refId: item.refId,
                            refTo: item.refTo,
                            partyType: item.partyType,
                            partyName: item.partyName,
                            partyCode: item.partyCode,
                            partyNo: null,
                            partyAbbr: item.partyAbbr,
                            isBuyer: item.isBuyer,
                            isVendor: item.isVendor,
                            isTruck: item.isTruck,
                            isWarehouse: item.isWarehouse,
                            is3pl: item.is3pl,
                            str1: '0',
                            str2: '0',
                            str3: null,
                            isDefault: item.isDefault,
                            umUserId: item.umUserId,
                            umTenantId: item.umTenantId,
                            createTime: item.createTime,
                            updateTime: item.updateTime,
                            ext: null,
                            extList: [],
                            initilRow: item.initilRow,
                            modifyRow: item.modifyRow,
                            deletedRow: item.deletedRow,
                            addRow: item.addRow
                        }
                    }
                });
            }
        },
        // 获取司机列表
        getDriverList(val){
            var that = this;
            that.driverList = [];
            if(val == "" || val == undefined){
                that.driverList = that.initDriverList;
            } else{
                var param = {
                    contactName:val,
                    refType:"CONTACT"
                };
                clearTimeout(that.getDriverListTimer);
                that.getDriverListTimer = null;
                that.getDriverListTimer = setTimeout(function(){
                    $.ajax({
                        url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                        type: "post",
                        contentType: 'application/json',
                        data: JSON.stringify(param),
                        success: function (data) {
                            if(data.result.length > 0){
                                that.driverList = data.result;
                            }
                        }
                    })
                },200)
            }
        },
        // 选中司机
        chooseDriver(item){
            var that = this;
            that.driverList = [];
            that.carrierDriver = {
                contactName: item.contactName,
                contactTel: item.contactTel
            };
            that.carrierEqp = {
                eqpNo: item.eqpNo,
                eqpName: item.eqpName,
                eqpBrand: item.eqpBrand,
                eqpType: item.eqpType,
                eqpNature: item.eqpNature,
                eqpSpec: item.eqpSpec,
                eqpLength: item.eqpLength,
                eqpWidth: item.eqpWidth,
                eqpHeight: item.eqpHeight,
                eqpStr1: item.eqpStr1,
                eqpStr2: item.eqpStr2
            };
        },
        // 确认指派司机
        saveAssignedDriver(){
            var that = this;
            if(that.carrierDriver.contactName.trim() == "" || that.carrierEqp.eqpNo.trim() == "" || that.OrderCarrier.contactName == ""){
                layer.msg("请填写完整信息再指派！");
                return false;
            }
            var driverInfo = {
                carrierPartyInfo:{
                    contact: that.carrierDriver,
                    eqp: that.carrierEqp,
                    imgContact: that.OrderCarrier,
                    party: that.OrderCarrierParty
                },
                order: that.resTfoOrder
            };
            if(that.areaTfoOrderInfo.carPartyId){
                driverInfo.carrierPartyInfo.party.omPartyId = that.areaTfoOrderInfo.carPartyId;
                driverInfo.carrierPartyInfo.eqp.omEqpId = that.areaTfoOrderInfo.carDrvEqpId;
                driverInfo.carrierPartyInfo.contact.omContactId = that.areaTfoOrderInfo.carDrvContactId;
            }
            postRequest(tmsUrl + "/save/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,driverInfo,function(data){
                layer.msg("指派成功！");
                that.closeMaskLayer(4);
                that.getWaybillInfoList(that.waybillInfoList[that.currentAreaNum].omOrderId);
                // that.setAreaInfoClick(that.waybillInfoList[that.currentAreaNum],that.currentAreaNum);

                // 局部刷新片区信息
                // that.waybillInfoList[that.currentAreaNum].carDrvContactName = that.carrierDriver.contactName;
                // that.waybillInfoList[that.currentAreaNum].carDrvContactTel = that.carrierDriver.contactTel;
                // that.waybillInfoList[that.currentAreaNum].carDrvEqpNo = that.carrierEqp.eqpNo;
            })
        },

        // 获取承运商列表
        getCarrierAllList(){
            var that = this;
            var searchFormArr = {refType:"PARTYLNK"};
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data) {
                that.resPartyList = data.result;
            })
        },
        // 获取司机列表
        getDriverAllList(){
            var that = this;
            var searchFormArr = {refType:"CONTACT"};
            postRequest(cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.initDriverList = data.result;
            });
        },
        //  承运商详情、收起
        isShowItemDetails() {
            var that = this;
            that.shortShowType = !that.shortShowType;
        },


        // 省市区选择
        selectLocLevelFun1(level, paramObj, code){
            var that = this;
            switch (level) {
                case 'countryCode':
                    paramObj.provinceCode = "";
                    paramObj.cityCode = "";
                    paramObj.districtCode = "";
                    break;
                case 'provinceCode':
                    paramObj.cityCode = "";
                    paramObj.districtCode = "";
                    break;
                case 'cityCode':
                    paramObj.districtCode = "";
                    break;
            }
        },
        selectLocLevelFun(level, paramObj, code) { // 选中国省市区触发事件，入参：地址级别，对象，当前 国、省、市、区 编码 [ 便于扩展实时改变 详细地址address ]
            var that = this;
            switch (level) {
                case 'countryCode':
                    paramObj.provinceCode = "";
                    paramObj.cityCode = "";
                    paramObj.districtCode = "";
                    break;
                case 'provinceCode':
                    paramObj.cityCode = "";
                    paramObj.districtCode = "";
                    that.areaDistrictList = [];
                    $(".toolBodyDiv").hide();
                    break;
                case 'cityCode':
                    paramObj.districtCode = "";
                    that.areaDistrictList = [];
                    $(".toolBodyDiv").hide();
                    break;
                case 'districtCode':
                    for(var i=0;i<that.areaDistrictGroups.length;i++){
                        for(var l=0;l<that.areaDistrictGroups[i].length;l++){
                            if(code == that.areaDistrictGroups[i][l].districtCode){
                                imitatePopup("其它片区已包含此地区！","alert");
                                $(".toolBodyDiv").hide();
                                paramObj.districtCode = "";
                                return false;
                            }
                        }
                    }
                    for(var j=0;j<that.areaDistrictList.length;j++){
                        if(code == that.areaDistrictList[j].districtCode){
                            imitatePopup("已添加过此地区！","alert");
                            $(".toolBodyDiv").hide();
                            paramObj.districtCode = "";
                            return false;
                        }
                    }
                    var districtInfo = {
                        provinceCode: paramObj.provinceCode,
                        cityCode: paramObj.cityCode,
                        districtCode: code,
                        chineseName: $(".districtCodeTool").find("option:selected").text(),
                    };
                    that.areaDistrictList.push(districtInfo);
                    $(".toolBodyDiv").hide();
                    paramObj.districtCode = "";
                    break;
            }
        },
        getAllProviceList(countryCode) { // 根据所选的 countryCode 获取对应 省列表
            return getProvinceData(countryCode);
        },
        getAllCityList(provinceCode) { // 根据所选的 provinceCode 获取对应 市列表
            return getCityData(provinceCode);
        },
        getAllDistrictList(cityCode) { // 根据所选的 cityCode 获取对应 区列表
            return getDistrictData(cityCode);
        },

        // 切换行政区div显示
        moveCutMapCard(){
            var that = this;
            that.showCutMapCard = !that.showCutMapCard;
        },
        // 去指定城市
        cutCurrentDistrict() {
            var that = this;
            var name = $(".cutMapCard .addressLi .inp select:last-child").find("option:selected").text().trim();
            if (name == "区/县") {
                name = $(".cutMapCard .addressLi .inp select:nth-child(2)").find("option:selected").text().trim();
                if(name == "城市"){
                    name = $(".cutMapCard .addressLi .inp select:nth-child(1)").find("option:selected").text().trim();
                    if(name == "省份"){
                        name = "中国"
                    }
                }
            }
            map.setCity(name);
            var searchFormArr = {
                startCompleteTime: that.timeHorizon.split(" - ")[0],
                endCompleteTime: that.timeHorizon.split(" - ")[1],
                isAsign: true,
                stoProvinceCode: that.shipperPartyLocation.provinceCode,
                stoCityCode: that.shipperPartyLocation.cityCode,
                stoDistrictCode: that.shipperPartyLocation.districtCode,
            };
            postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                that.waitScheduleOrder = data.result;
                that.markerArrayFun(that.waitScheduleOrder);
            });
        },

        // 按区code获取区name
        getDistrictName(adcode){
            var that = this;
            for(var i=0;i<that.selectListData.districtList.length;i++){
                if(adcode == that.selectListData.districtList[i].adcode){
                    return that.selectListData.districtList[i].chineseName;
                }
            }
        },
        completeStatusChange(info){
            var that = this;
            that.selectListData = getBasicData();
            for(var i=0;i<that.selectListData.completeStatusList.length;i++){
                if(info == that.selectListData.completeStatusList[i].code){
                    return that.selectListData.completeStatusList[i].text;
                } else{
                    return '- -'
                }
            }
        },

        // 关闭maskLayer
        closeMaskLayer(num){
            $(".maskLayer"+num).hide();
            if(num == '2'){
                var that = this;
                that.routine = '4';
            }
        }
    },
    created:function(){
        var that = this;
        this.dpDistrictList = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        that.getCarrierAllList(); // 获取承运商列表
        that.getDriverAllList(); // 获取司机列表
        that.getAreaTemplate(); // 获取片区模板

        // 获取承运商列表
        getRequest(cmdUrl + "/get/partyDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&partyCode=" + that.logininf.userPartyNo + "&isDefault=1", function (res) {
            if (res.result.locationList != null && res.result.locationList != '') {
                that.shipperPartyLocation = res.result.locationList[0];
                setTimeout(function () {
                    that.cutCurrentDistrict();
                }, 300);
            }
        });
    },
    mounted: function(){
        var that = this;
        this.timeHorizon = getQueryTime(7)+" - "+ getQueryTime(0);
    },
    filters:{
        completeStatusChange(info){
            var that = this;
            that.selectListData = getBasicData();
            for(var i=0;i<that.selectListData.completeStatusList.length;i++){
                if(info == that.selectListData.completeStatusList[i].code){
                    return that.selectListData.completeStatusList[i].text;
                } else{
                    return '- -'
                }
            }
        },
        timestampToTime2(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                var currentTime = timestamp - offsetMs;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate();
                return Y+M+D;
            }
        }
    }
});


//绘制矢量图形
var map = new AMap.Map("container", {
    zoom: 9,
    resizeEnable: true,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    })
});

// 引入layui
var layer ;
layui.use(['layer'], function(){
    layer = layui.layer;
});
