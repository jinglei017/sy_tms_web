var app = new Vue({
    el: '#overall',
    data: {
        clearShow:true,
        currentPage:1,
        currentPage1:1,
        currentPage2:1,
        currentOrderIndex:"-1",
        currentOrderIndex1:"-1",
        totalOrderResultNum:1,
        isDisable:false,
        tableOrderList:{},
        pageList:[],
        pageList1:[],
        pageList2:[],
        totalPagesNum:"",
        totalPagesNum1:"",
        totalPagesNum2:"",
        logininf:{},
        currentStataionIndex:"",
        stationAddress:[],
        stationAddress1:[],
        orderDetails:{},
        dpDistrictList:{},
        dpCityList:{},
        dpProvinceList:{},
        dpLocationCode:"",
        OrderCarrier:{
            cdPartyId:""
        },
        driverList:[],
        orderList:[],
        resTfoOrder:{},
        OrderCarrierContact:{},
        OrderCarrierDriver:{},
        OrderCarrierEqp:{},
        currentOrderCarrierDriver:{},
        currentOrderCarrierEqp:{},
        selectListData:{},
        showDriverList:false,
        showPlateList:false,
        isShowDriverList:true,
        isShowPlateList:true,
        tfoOrderInfoDetail:false,
        waitingList:false,
        allChecked:false,
        showDriverList1:false,
        showPlateList1:false,
        disabledAddress:false,
        showPath:true,
        orderStatistics:{
            totalNum:0,
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0
        },
        queryPageSize: 100000,
        multipleNum:12,
        defaultDeliveryDate:getQueryTime(-1),
        startCompleteDate:getQueryTime(1),
        deliveryDate:getQueryTime(-1),
        waitScheduleOrder:{},
        reportMessagesBtnShow1:'0',
        pathScheduleOrder:{},
        finishScheduleOrder:{},
        orderResultInfoList:{},
        RelatedToLineOrderList:[],
        newCarrierDriver:{},
        newCarrierEqp:{},
        newCarrierDriver1:{},
        newCarrierEqp1:{},
        currentRelatedArr:[],
        selectLocationInf:{
            provinceCode:"",
            districtCode:"",
            cityCode:""
        },
        currentRelatedId: "",
        stationLocationList:[{}],
        OrderCarrier1:{
            partyName:"",
            partyCode:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        queryParam:{},
        queryParam1:{},
        queryParam2:{},
        routeInfo:{},
        resPartyList:[],
        shortShowType:"0",
        shortShowType1:"0",
        pathAllotProgressInf:{},
        reportMessagesOrderStart:{},
        reportMessagesOrderList:{},
        customer:"",
        reportMessagesRes:{
            endAddress:""
        },
        isShowScheduleBox: false,
        getPlaceListTimer:null,
        showPlaceList:false,
        newCarrierResPartyInfo: {
            contact: {
                contactName: "",
                contactTel: ""
            },
            eqp: {
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
            },
            party: {
                partyName: "",
                partyCode: "",
                isBuyer: false,
                isVendor: false,
                isTruck: false,
                isWarehouse: false,
                is3pl: false
            },
            imgContact: {}
        },
        currentClasses: {},
        currentClassesEq: null,
        linkNames: ["路线排单", "路线管理", "任务排班"],
        linkHrefs: [],
        dragStr1: false,
        dragStr2: false,
        sortAble1: null,
        sortAble2: null,
        alive1: true,
        alive2: true,
        stationLocationList0: [],
        reportMessagesOrderList0: [],
        currStationItem: {
            locationName: '',
            address: ''
        },
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}),
        lineColorList: ['#b52cfc', '#f08f0e', '#009DEF', '#64BD3D', '#E89589', '#16A085', '#4A235A', '#C39BD3', '#F9E79F', '#BA4A00', '#ECF0F1', '#4A235A'],
        currLineInfo: {
            str1: "",
            omOrderId: ""
        }
    },
    methods:{
        // 详情、收起
        isShowItemDetails(num) {
            var that = this;
            if (num == '0') {
                that.shortShowType = !that.shortShowType;
            } else if (num == '1') {
                that.shortShowType1 = !that.shortShowType1;
            }
        },
        chooseTheFileType() {
            $('#excelFile').addClass('uploadType1');
            $('#excelFile').click();
        },
        chooseTheFile() {
            var that = this;
            if ($('#excelFile').hasClass('uploadType1')) {
                that.filesUpload();
            }
        },
        filesUpload(){
            var that = this;
            var num = 5;
            var timer1 = setInterval(function(){
                if(num == 90){
                    clearInterval(timer1);
                }else{
                    num++;
                    $(".progressCon").css({
                        "width":num+"%"
                    })
                }
            },3000)
            $.ajaxFileUpload({
                url: tmsUrl + '/tloOrderInfo/uploadExcelFile.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    $(".progressCon").css({
                        "width": "100%"
                    })
                    $(".scheduleLoadPopup .scheduleTitle span").html("路线上传完成");
                    setTimeout(function(){
                        num = 5;
                        clearInterval(timer1);
                        $(".scheduleLoadPopup").hide();
                        $(".progressCon").css({
                            "width": "5%"
                        })
                    },1000)
                    alert(data.result.resultMsg);

                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    var searchFormArr = {};
                    //获取路线列表
                    postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                        that.pathScheduleOrder = data.result;
                        that.publicChangeBtnStatus();
                    })

                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    alert("上传文件失败");

                    setTimeout(function(){
                        num = 5;
                        clearInterval(timer1);
                        $(".scheduleLoadPopup").hide();
                        $(".progressCon").css({
                            "width": "5%"
                        })
                    },1000);
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    //	console.error(e);
                }
            });
        },
        addOrderDetails(){
            var that = this;
            that.customer = "";
            that.disabledAddress = false;
            drawClearFun1();
            markerInfoArray = [];
            that.isDisable = false;
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:""
            };
            that.showDriverList = false;
            that.showPlateList = false;
            that.shortShowType = '0';
            that.shortShowType1 = '0';
            that.OrderCarrier = {
                cdPartyId:""
            };
            that.routeInfo = {};
            that.OrderCarrier1 = {
                partyName:"",
                partyCode:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.OrderCarrierContact = {
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:""
            };
            that.stationLocationList = [{}];
            var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:1
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.result != null){
                    if(data.result.length > 0){
                        that.OrderCarrier = data.result[0];
                        that.OrderCarrier1.partyName = data.result[0].partyName;// 承运商 名称
                        that.OrderCarrier1.partyCode = data.result[0].partyCode; // 承运商 编码
                        that.OrderCarrier1.isBuyer = data.result[0].isBuyer; // 承运商 是否买家
                        that.OrderCarrier1.isVendor = data.result[0].isVendor; // 承运商 是否卖家
                        that.OrderCarrier1.isTruck = data.result[0].isTruck; // 承运商 是否卡车公司
                        that.OrderCarrier1.isWarehouse = data.result[0].isWarehouse; // 承运商 是否仓库
                        that.OrderCarrier1.is3pl = data.result[0].is3pl; // 承运商 是否第三方物流
                        that.OrderCarrierContact.contactName = data.result[0].imgContactName; // 承运商联系人
                        that.OrderCarrierContact.contactTel = data.result[0].imgContactTel; // 承运商电话
                        that.OrderCarrierContact.contactEmail = data.result[0].imgContactEmail; // 承运商邮箱
                        that.OrderCarrierContact.contactAddress = data.result[0].imgContactAddress; // 承运商地址
                    }
                }
            });
        },
        //合作商
        queryPlaceInfo(value){
            var val = value.trim();
            if(val != '' && val != ' '){
                var that = this;
                that.showPlaceList = false;
                clearTimeout(that.getPlaceListTimer);
                that.getPlaceListTimer = null;
                that.getPlaceListTimer = setTimeout(function(){
                    var partyName = val;
                    var searchFormArr02 = {
                        partyType: "CLI",
                        partyName: partyName
                    };
                    $.ajax({
                        url: cmdUrl + "/get/customerInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                        type: "post",
                        contentType : 'application/json',
                        data: JSON.stringify(searchFormArr02),
                        success: function (data) {
                            that.placeList = [];
                            if(data.result.length > 0){
                                that.placeList = data.result;
                                that.showPlaceList = true;
                            }
                        }
                    });
                },300);
            }
        },
        choosePlace(placeItem){
            var that = this;
            that.customer = placeItem.partyName;
            that.showPlaceList = false;
        },
        //查询标记点列表
        getSearchMarker(){
            markerInfoArray = [];
            var that = this;
            that.showPlaceList = false;
            var partyName = that.customer.trim();
            var searchFormArr02 = {
                partyType: "CLI",
                partyName: partyName
            };
            postRequest(cmdUrl + "/get/customerInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr02,function(data){
                that.waitScheduleOrder = data.result;
                markerInfoArray = that.waitScheduleOrder;
                that.reportMessagesBtnShow1 = '1';
            })
        },
        // 关闭信息窗口
        closeMaskLayer(num){
            $(".maskLayer").hide();
            var that = this;
        },

        //显示路径
        drawThePath(item, index) {
            var that = this;
            map.clearMap();
            var startPoint = [];
            var endPoint = [];
            var opts = {waypoints: []};
            var startBool = false,endBool = false;

            if (item.length != 0) { // 起点、终点、途径点、
                for(var a=0;a<item.length;a++){
                    if(!startBool && item[a].latLng != null){
                        startPoint = [item[a].latLng.split(',')[0], item[a].latLng.split(',')[1]];
                        startBool = true;
                    }
                }
                for(var b=item.length-1;b>0;b--){
                    if(!endBool && item[b].latLng != null){
                        endPoint = [item[b].latLng.split(',')[0], item[b].latLng.split(',')[1]];
                        endBool = true;
                    }
                }

                if (item.length > 1) {
                    for (var i = 0; i < item.length - 1; i++) {
                        if (item[i].latLng == null || item[i].latLng == undefined || item[i].latLng == "") {
                            continue;
                        }
                        var point = item[i].latLng.split(',');
                        var pointLatLng = [point[0] / 1, point[1] / 1];
                        opts.waypoints.push(pointLatLng);
                    }
                }
            }

            map.plugin('AMap.Driving', function () {
                var driving = new AMap.Driving({
                    policy: AMap.DrivingPolicy.LEAST_TIME,
                    showTraffic: false,
                    isOutline: false,
                    hideMarkers: true
                });
                driving.search(startPoint, endPoint, opts, function (status, result) {
                    that.lineMarkerArrayFun(item, that.lineColorList[index]); // 点
                    that.lineDrawRoute(result.routes[0], that.lineColorList[index]); // 线
                });
            })
        },
        // 路线标记点
        lineMarkerArrayFun(markerInfoArray, color) {
            var that = this;
            var marker;
            for (var n = 0; n < markerInfoArray.length; n++) {
                var item = markerInfoArray[n], latLng2 = [];
                var mapNumP = document.createElement("p");
                var mapNumDiv = document.createElement("div");
                mapNumDiv.className = 'mapEqDiv';
                mapNumDiv.innerHTML = n + 1;
                mapNumDiv.style.background = color;
                mapNumP.style.background = color;

                if (item.latLng != null) {
                    var newDiv = document.createElement("div");
                    newDiv.className = 'mapPoints1';
                    mapNumP.innerHTML = "站";
                    newDiv.append(mapNumP);
                    newDiv.append(mapNumDiv);
                    newDiv.setAttribute("latLngStr", item.latLng);
                    newDiv.setAttribute("omOrderId", item.omLocationId);
                    newDiv.id = 'order' + item.omLocationId;
                    latLng2 = item.latLng.split(',');
                }else{
                    continue;
                }


                marker = new AMap.Marker({
                    map: map,
                    position: latLng2,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);  //更新点标记内容

                marker.on('click', function (e) {
                    that.openSignalOrderInfo(e, markerInfoArray);
                });
            }
        },
        // 绘制路线
        lineDrawRoute(route, color) {
            var that = this;
            var path = [];

            for (var i = 0, l = route.steps.length; i < l; i++) {
                var step = route.steps[i];
                for (var j = 0, n = step.path.length; j < n; j++) {
                    path.push(step.path[j])
                }
            }

            var routeLine = new AMap.Polyline({
                map: map,
                path: path,
                isOutline: false,
                strokeOpacity: 1,
                strokeColor: color,
                strokeWeight: 5,
                lineJoin: 'bevel',
                showDir: true
            });
            map.setFitView([routeLine]);
        },
        // 点击订单标记点--停靠站点
        openSignalOrderInfo(e, currentPointList) {
            var that = this;
            var latLngStrVal = e.target.ue.content.attributes.latLngStr.value;
            var omOrderId = e.target.ue.content.attributes.omOrderId.value;
            $('.amap-info-contentContainer').show();
            var temp = [], info;
            for (var n = 0; n < currentPointList.length; n++) {
                if (currentPointList[n].latLng == latLngStrVal) {
                    temp.push(n);
                }
            }
            for (var i = 0; i < currentPointList.length; i++) {
                var currOmOrderId = currentPointList[i].omLocationId;
                if (currOmOrderId == omOrderId) {
                    var totalDiv = '';
                    for (var a = 0; a < temp.length; a++) {
                        var tem = temp[a];
                        totalDiv += '<div class="pointInfoDiv1">' +
                            '<p><span class="pointInfoColor1">站点序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">地址简称：</span><span class="pointInfoColor2">' + currentPointList[tem].locationName + '</span></p>' +
                            '<p><span class="pointInfoColor1">详细地址：</span><span class="pointInfoColor2">' + currentPointList[tem].address + '</span></p>' +
                            '</div>';

                        if(a == temp.length - 1){
                            for (var b = 0; b < that.reportMessagesOrderList.length; b++){
                                var itemb = that.reportMessagesOrderList[b];
                                if(itemb.location.latLng == latLngStrVal){
                                    totalDiv += '<div class="pointInfoDiv1" style="border-top: 1px solid #bbb;padding-top: 8px;">' +
                                        '<p><span class="pointInfoColor1">商户名称：</span><span class="pointInfoColor2">' + itemb.party.partyName + '</span></p>' +
                                        '</div>';
                                }
                            }
                        }
                    }

                    info = '<div>' + totalDiv + '</div>';
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        // 新增路线
        jumpNewLine() {
            var that = this;
            $(".maskLayer3").show();
            that.customer = "";
            that.disabledAddress = false;
            that.isShowScheduleBox = false;
            markerInfoArray = [];
            that.isDisable = false;
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:""
            };
            that.showDriverList = false;
            that.showPlateList = false;
            that.shortShowType = 0;
            that.shortShowType1 = 0;
            that.OrderCarrier = {
                cdPartyId:""
            };
            that.routeInfo = {};
            that.OrderCarrier1 = {
                partyName:"",
                partyCode:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.OrderCarrierContact = {
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:""
            };
            that.stationLocationList = [{}];
            var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:1
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.result != null){
                    if(data.result.length > 0){
                        that.OrderCarrier = data.result[0];
                        that.OrderCarrier1.partyName = data.result[0].partyName;// 承运商 名称
                        that.OrderCarrier1.partyCode = data.result[0].partyCode; // 承运商 编码
                        that.OrderCarrier1.isBuyer = data.result[0].isBuyer; // 承运商 是否买家
                        that.OrderCarrier1.isVendor = data.result[0].isVendor; // 承运商 是否卖家
                        that.OrderCarrier1.isTruck = data.result[0].isTruck; // 承运商 是否卡车公司
                        that.OrderCarrier1.isWarehouse = data.result[0].isWarehouse; // 承运商 是否仓库
                        that.OrderCarrier1.is3pl = data.result[0].is3pl; // 承运商 是否第三方物流
                        that.OrderCarrierContact.contactName = data.result[0].imgContactName; // 承运商联系人
                        that.OrderCarrierContact.contactTel = data.result[0].imgContactTel; // 承运商电话
                        that.OrderCarrierContact.contactEmail = data.result[0].imgContactEmail; // 承运商邮箱
                        that.OrderCarrierContact.contactAddress = data.result[0].imgContactAddress; // 承运商地址
                    }
                }
            });
        },

        // 点击“修改司机”
        changeDriverInf() {
            var that = this;
            $(".maskLayer4").show();

            that.currLineInfo = {
                str1: that.routeInfo.str1,
                omOrderId: that.orderDetails.omOrderId
            };
            that.newCarrierDriver = {
                contactName: that.OrderCarrierDriver.contactName,
                contactTel: that.OrderCarrierDriver.contactTel
            };
            that.newCarrierEqp = {
                eqpNo: that.OrderCarrierEqp.eqpNo,
                eqpName: that.OrderCarrierEqp.eqpName,
                eqpBrand: that.OrderCarrierEqp.eqpBrand,
                eqpType: that.OrderCarrierEqp.eqpType,
                eqpNature: that.OrderCarrierEqp.eqpNature,
                eqpSpec: that.OrderCarrierEqp.eqpSpec,
                eqpLength: that.OrderCarrierEqp.eqpLength,
                eqpWidth: that.OrderCarrierEqp.eqpWidth,
                eqpHeight: that.OrderCarrierEqp.eqpHeight,
                eqpStr1: that.OrderCarrierEqp.eqpStr1,
                eqpStr2: that.OrderCarrierEqp.eqpStr2
            };
        },
        chooseStationFun(index){
            var that = this;
            that.currentStataionIndex = index;
            $(".maskLayer0").show();
        },
        changeCarrierInfo(id){
            var that = this;
            if(id != ''){
                var param = {};
                $.each(that.resPartyList, function (indexs, val) {
                    if (val.cdPartyId == id) {
                        param = val;
                    }
                });
                that.OrderCarrier1.partyName = param.partyName;// 承运商 名称
                that.OrderCarrier1.partyCode = param.partyCode; // 承运商 编码
                that.OrderCarrier1.isBuyer = param.isBuyer; // 承运商 是否买家
                that.OrderCarrier1.isVendor = param.isVendor; // 承运商 是否卖家
                that.OrderCarrier1.isTruck = param.isTruck; // 承运商 是否卡车公司
                that.OrderCarrier1.isWarehouse = param.isWarehouse; // 承运商 是否仓库
                that.OrderCarrier1.is3pl = param.is3pl; // 承运商 是否第三方物流
                that.OrderCarrierContact.contactName = param.imgContactName; // 承运商联系人
                that.OrderCarrierContact.contactTel = param.imgContactTel; // 承运商电话
                that.OrderCarrierContact.contactEmail = param.imgContactEmail; // 承运商邮箱
                that.OrderCarrierContact.contactAddress = param.imgContactAddress; // 承运商地址
            }
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam2;
                searchFormArr.pageInfo ={
                    pageNum: 1,
                    pageSize: that.queryPageSize
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.pageList = [];
                    that.currentPage = 1;
                    that.currentOrderIndex1 = -1;
                    that.waitingList = false;
                    $(".waitScheduleCon .pathOrderListCon .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.pathScheduleOrder = data.result;
                    that.totalPagesNum = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                })
            }else{
                imitatePopup("请输入大于1的正整数",'alert');
                return false;
            }
        },
        chooseDriver(driveritem){ // 新建班次--选择联想的司机姓名
            var that = this;
            that.OrderCarrierDriver.contactName = driveritem.contactName;
            $("#carrierDriverName").val(driveritem.contactName);
            that.OrderCarrierDriver.contactName = $("#carrierDriverName").val();
            that.OrderCarrierDriver.contactTel = driveritem.contactTel;
            that.OrderCarrierEqp.eqpNo = driveritem.eqpNo;
            that.OrderCarrierEqp.eqpName = driveritem.eqpName;
            that.OrderCarrierEqp.eqpBrand = driveritem.eqpBrand;
            that.OrderCarrierEqp.eqpType = driveritem.eqpType;
            that.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            that.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            that.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            that.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            that.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            that.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            that.showDriverList = false;
        },
        chooseDriver1(driveritem){ // 修改司机信息--选择联想的司机姓名
            this.newCarrierDriver.contactName = driveritem.contactName;
            $("#newCarrierDriverName").val(driveritem.contactName);
            this.newCarrierDriver.contactName = $("#newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = driveritem.contactTel;
            this.newCarrierEqp.eqpNo = driveritem.eqpNo;
            this.newCarrierEqp.eqpName = driveritem.eqpName;
            this.newCarrierEqp.eqpBrand = driveritem.eqpBrand;
            this.newCarrierEqp.eqpType = driveritem.eqpType;
            this.newCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.newCarrierEqp.eqpLength = driveritem.eqpLength;
            this.newCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.newCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.newCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.newCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.showDriverList1 = false;
        },
        getDriverInfo(val){
            this.publicGetDriverInfo(val,1);
        },
        getDriverInfo1(val){
            this.publicGetDriverInfo(val,2);
        },
        publicGetDriverInfo(val,params){
            var that = this;
            clearTimeout(that.getDriverListTimer);
            that.getDriverListTimer = null;
            that.getDriverListTimer = setTimeout(function(){
                var driverinfo = {
                    contactName:val,
                    refType:"CONTACT"
                };
                $.ajax({
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp, //  cdContact/queryContactInfoList
                    type: "post",
                    contentType : 'application/json',
                    data: JSON.stringify(driverinfo),
                    success: function (data) {
                        that.driverList = data.result;
                        if(that.driverList.length > 0){
                            if(params == 1){
                                that.showDriverList = true;
                            }else{
                                that.showDriverList1 = true;
                            }
                        }
                    }
                });
            },300);
        },
        getPlateInfo(val){ // 新建班次--车牌号联想
            this.publicGetPlateInfo(val,1);
        },
        getPlateInfo1(val){ // 修改司机信息--车牌号联想
            this.publicGetPlateInfo(val,2);
        },
        publicGetPlateInfo(val,params){ // cd -- 设备模板（传 设备-司机 模板，车牌号）
            var that = this;
            clearTimeout(that.getEpdListTimer);
            that.getEpdListTimer = null;
            that.getEpdListTimer = setTimeout(function(){
                that.plateList = {};
                var plateinfo = {
                    eqpName:val,
                    refType:"CONTACT"
                };
                $.ajax({
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp, // cdEqp/queryDrvContactInfo
                    type: "post",
                    contentType : 'application/json',
                    data: JSON.stringify(plateinfo),
                    success: function (data) {
                        that.plateList  = data.result;
                        if(that.plateList.length > 0){
                            if(params == 1){
                                that.showPlateList = true;
                            }else{
                                that.showPlateList1 = true;
                            }
                        }
                    }
                });
            },300);
        },
        choosePlate(plateitem){ // 新建班次--选择联想的车牌号
            /*this.OrderCarrierEqp = plateitem;
            this.showPlateList = false;*/

            console.log(plateitem);
            this.OrderCarrierDriver.contactName = plateitem.contactName;
            $("#carrierDriverName").val(plateitem.contactName);
            this.OrderCarrierDriver.contactName = $("#carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = plateitem.contactTel;
            this.OrderCarrierEqp.eqpNo = plateitem.eqpNo;
            $("#carrierEqpNo").val(plateitem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $("#carrierEqpNo").val();
            this.OrderCarrierEqp.eqpName = plateitem.eqpName;
            this.OrderCarrierEqp.eqpBrand = plateitem.eqpBrand;
            this.OrderCarrierEqp.eqpType = plateitem.eqpType;
            this.OrderCarrierEqp.eqpSpec = plateitem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = plateitem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = plateitem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = plateitem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = plateitem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = plateitem.eqpStr2;
            this.showPlateList = false;

        },
        choosePlate1(plateitem){ // 修改司机信息--选择联想的车牌号
            /*this.newCarrierEqp = plateitem;
            this.showPlateList1 = false;*/

            console.log(plateitem);
            this.newCarrierDriver.contactName = plateitem.contactName;
            $("#newCarrierDriverName").val(plateitem.contactName);
            this.newCarrierDriver.contactName = $("#newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = plateitem.contactTel;
            this.newCarrierEqp.eqpNo = plateitem.eqpNo;
            $("#newCarrierEqpNo").val(plateitem.eqpNo);
            this.newCarrierEqp.eqpNo = $("#newCarrierEqpNo").val();
            this.newCarrierEqp.eqpName = plateitem.eqpName;
            this.newCarrierEqp.eqpBrand = plateitem.eqpBrand;
            this.newCarrierEqp.eqpType = plateitem.eqpType;
            this.newCarrierEqp.eqpSpec = plateitem.eqpSpec;
            this.newCarrierEqp.eqpLength = plateitem.eqpLength;
            this.newCarrierEqp.eqpWidth = plateitem.eqpWidth;
            this.newCarrierEqp.eqpHeight = plateitem.eqpHeight;
            this.newCarrierEqp.eqpStr1 = plateitem.eqpStr1;
            this.newCarrierEqp.eqpStr2 = plateitem.eqpStr2;
            this.showPlateList1 = false;
        },
        stopsStation(){
            $(".maskLayer5").show();
        },
        //添加停靠站点
        addStationLocation(){
            var that = this;
            if(that.currStationItem.locationName == "" || that.currStationItem.locationName == undefined ||
                that.currStationItem.address == undefined || that.currStationItem.address == undefined){
                layer.msg("请填写完整站点信息！");
                return false;
            }
            var info = that.currStationItem;
            info.refId = that.orderDetails.omOrderId;
            postRequest(tmsUrl + "/insert/tloLocation.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.currStationItem,function(data){
                that.getOrderDetails(that.currentClassesEq,1);
                that.currStationItem = {
                    locationName: '',
                    address: ''
                };
                layer.msg("客户添加成功");
            })
        },
        // 删除停靠站点
        deleteCurrentStation(omLocationId,index){
            var that = this;
            var deleteStation = confirm("确定删除当前停靠站点");
            if(deleteStation == true){
                getRequest(tmsUrl + "/delete/tloLocation.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&omLocationId="+omLocationId,function(data){
                    that.stationLocationList.splice(index, 1);
                })
            }
        },
        saveStationLocation(){
           var that = this;
            if(that.routeInfo.str1 == null || that.routeInfo.str1 == ""){
                imitatePopup("路线名称不能为空",'alert');
                return false;
            }
            if(that.OrderCarrierDriver.contactName == null || that.OrderCarrierDriver.contactName == ""){
                imitatePopup("司机信息不能为空",'alert');
                return false;
            }
            var params = {
                carrierPartyInfo:{
                    contact:{
                        contactName:that.OrderCarrierDriver.contactName,
                        contactTel:that.OrderCarrierDriver.contactTel
                    },
                    eqp:{
                        eqpName: that.OrderCarrierEqp.eqpName,
                        eqpNo: that.OrderCarrierEqp.eqpNo,
                        eqpBrand:that.OrderCarrierEqp.eqpBrand,
                        eqpType:that.OrderCarrierEqp.eqpType,
                        eqpSpec:that.OrderCarrierEqp.eqpSpec,
                        eqpLength: that.OrderCarrierEqp.eqpLength,
                        eqpWidth: that.OrderCarrierEqp.eqpWidth,
                        eqpHeight: that.OrderCarrierEqp.eqpHeight,
                        eqpStr1: that.OrderCarrierEqp.eqpStr1,
                        eqpStr2: that.OrderCarrierEqp.eqpStr2
                    },
                    imgContact:that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                order:{
                    str1: that.routeInfo.str1
                }
            };
            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";

            postRequest(tmsUrl + "/insert/tloOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                $(".maskLayer3").hide();
                var searchFormArr = {
                    pageInfo:{
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    }
                }
            })
        },
        getOrderDetails(index,txt){
            $(".mapRightBoxIn .boxInConcentLine1 .see").removeClass("active");
            $(".mapRightBoxIn .boxInConcentLine1 .see").eq(index).addClass("active");
            var that = this;
            if(!txt){
                that.reportMessagesOrderList = [];
                that.reportMessagesOrderStart = [];
                that.stationLocationList = [{}];
            }
            markerInfoResArrayAll = [];
            that.currentClasses = that.pathScheduleOrder[index];
            that.currentClassesEq = index;
            that.OrderCarrier1 = {};
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:""
            };
            that.OrderCarrierContact = {};
            that.showDriverList = false;
            that.showPlateList = false;
            that.newCarrierDriver = {
                eqpType:""
            };
            that.newCarrierEqp = {};
            that.showDriverList1= false;
            that.showPlateList1= false;
            that.routeInfo = {};
            var params = {
                refId: that.currentClasses.omOrderId,
                refNo: that.currentClasses.orderNo
            };
            that.isDisable = true;
            postRequest(tmsUrl + "/query/tloOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                that.orderDetails = data.result.order;  // 订单信息
                // 承运商
                if(data.result.carrierPartyInfo != null){
                    if(data.result.carrierPartyInfo.party != null){
                        that.OrderCarrier1 = data.result.carrierPartyInfo.party;
                    }else{
                        that.OrderCarrier1 = {};
                    }

                    if(data.result.carrierPartyInfo.contact != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.contact;
                    }else{
                        that.OrderCarrierDriver = {};

                    }

                    if(data.result.carrierPartyInfo.eqp != null){
                    	that.OrderCarrierEqp = data.result.carrierPartyInfo.eqp;
                    }else{
                    	that.OrderCarrierEqp = {
                            eqpType:""
                        };
                    }

                    if(data.result.carrierPartyInfo.imgContact != null){
                    	that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    }else{
                        that.OrderCarrierContact = {};
                    }

                }else{
                    that.OrderCarrier1 = {};
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {
                        eqpType:""
                    };
                    that.OrderCarrierContact = {};
                }

                if(data.result.order.str1 != null){
                    that.routeInfo.str1 = data.result.order.str1
                }

                if(data.result.stationLocationInfoList != null){     // 停靠站点
                    that.stationLocationList = data.result.stationLocationInfoList;
                    that.drawThePath(that.stationLocationList, '0');
                }else{
                    that.stationLocationList = [];
                }
                if(data.result.receiptPartyInfoList != null ){
                    that.reportMessagesOrderList = data.result.receiptPartyInfoList;
                    for(var i=0;i<data.result.receiptPartyInfoList.length;i++){
                        markerInfoResArrayAll.push(data.result.receiptPartyInfoList[i]);
                        if(that.reportMessagesOrderStart.length == 0){
                            that.reportMessagesOrderStart.push(data.result.receiptPartyInfoList[i]);
                        }
                    }
                }
            })
        },
        // 查看班次订单列表
        showResultInfo(index) {
            var that = this;
            if (that.currentClassesEq != index) {
                that.getOrderDetails(index);
            }
            stateW = false;
            $(".header .hLeft .hlMeau").click();
            that.isShowScheduleBox = true;
        },

        // 关闭班次订单列表
        closeScheduleBox() {
            var that = this;
            that.isShowScheduleBox = false;
        },

        // 拖拽排序停靠站点
        dragStation(){
            var that = this;
            if(that.stationLocationList.length == 0){
                return false;
            }
            that.dragStr1 = true;
            that.stationLocationList0 = [];
            $.each(that.stationLocationList,function(index,item){
                that.stationLocationList0.push(item)
            });
            var fool = this.$refs.foolish1;
            that.sortAble1 = Sortable.create(fool, {
                animation: 150,
                onEnd: function (evt) {
                    that.stationLocationList0.splice(evt.newIndex, 0, that.stationLocationList0.splice(evt.oldIndex, 1)[0]);
                }
            })
        },
        //保存或取消停靠站点排序
        isSaveDragStation(num){
            var that = this;
            if(num == '0'){
                that.sortAble1.destroy();
                that.reload(1);
                that.dragStr1 = false;
                return false;
            }
            that.reSaveDrawList(1);
        },
        // 拖拽排序客户
        dragClient(){
            var that = this;
            if(that.reportMessagesOrderList.length == 0){
                return false;
            }
            that.dragStr2 = true;
            that.reportMessagesOrderList0 = [];
            $.each(that.reportMessagesOrderList,function(index,item){
                that.reportMessagesOrderList0.push(item)
            });
            var fool = this.$refs.foolish2;
            that.sortAble2 = Sortable.create(fool, {
                animation: 150,
                onEnd: function (evt) {
                    that.reportMessagesOrderList0.splice(evt.newIndex, 0, that.reportMessagesOrderList0.splice(evt.oldIndex, 1)[0]);
                }
            })
        },
        //保存或取消停靠配送客户
        isSaveDragClient(num){
            var that = this;
            if(num == '0'){
                that.sortAble2.destroy();
                that.reload(2);
                that.dragStr2 = false;
                return false;
            }
            that.reSaveDrawList(2);
        },
        //实现局部刷新
        reload(num){
            var that = this;
            if(num == 1){
                that.alive1= false;
                this.$nextTick(() => {
                    that.alive1 = true;
                })
            } else if(num == 2){
                that.alive2= false;
                this.$nextTick(() => {
                    that.alive2 = true;
                })
            }
        },
        // 保存拖拽后列表
        reSaveDrawList(num){
            var that = this;
            var orderHeadModel = {};
            var editOrderInfo = that.orderDetails;
            editOrderInfo.str1 = that.routeInfo.str1;

            if(num == 1){
                var stationLocation = [];
                for(var j=0;j<that.stationLocationList0.length;j++){
                    var station = {
                        omLocationId: that.stationLocationList0[j].omLocationId,
                        seq: j + 1
                    };
                    stationLocation.push(station);
                }
                orderHeadModel = {
                    order: editOrderInfo,
                    stationLocationInfoList: stationLocation,
                    receiptPartyInfoList: null
                }
            }

            if(num == 2){
                var receiptList = [];
                for(var i=0;i<that.reportMessagesOrderList0.length;i++){
                    var receipt = {
                            party:{
                                partyCode:that.reportMessagesOrderList0[i].party.partyCode,
                                partyName:that.reportMessagesOrderList0[i].party.partyName
                            },
                            location:{
                                address:that.reportMessagesOrderList0[i].location.address,
                                cityCode:that.reportMessagesOrderList0[i].location.cityCode,
                                districtCode:that.reportMessagesOrderList0[i].location.districtCode,
                                lat:that.reportMessagesOrderList0[i].location.lat,
                                latLng:that.reportMessagesOrderList0[i].location.latLng,
                                lng:that.reportMessagesOrderList0[i].location.lng,
                                locationCode:that.reportMessagesOrderList0[i].location.locationCode,
                                locationName:that.reportMessagesOrderList0[i].location.locationName,
                                postCode:that.reportMessagesOrderList0[i].location.postCode,
                                provinceCode:that.reportMessagesOrderList0[i].location.provinceCode,
                                street:that.reportMessagesOrderList0[i].location.street
                            }
                        };
                    receiptList.push(receipt);
                }
                orderHeadModel = {
                    order: editOrderInfo,
                    stationLocationInfoList: null,
                    receiptPartyInfoList: receiptList
                }
            }

            postRequest(tmsUrl + "/update/tloOrderSeq.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderHeadModel,function(data){
                if(num) {
                    that.dragStr1 = false;
                    that.dragStr2 = false;
                    if (that.sortAble1 != null) {
                        that.sortAble1.destroy();
                    }
                    if (that.sortAble2 != null) {
                        that.sortAble2.destroy();
                    }
                }
                that.getOrderDetails(that.currentClassesEq);
            })
        },

        editDriverInfo(){
            var that = this;
            if($("#newCarrierDriverName").val().trim() == ""){
                imitatePopup("请先输入司机信息再保存",'alert');
                return false;
            }
            if(that.newCarrierDriver.contactName != '' && that.newCarrierDriver.contactName != undefined){
                that.OrderCarrierDriver.contactName = that.newCarrierDriver.contactName;
            }
            if(that.newCarrierDriver.contactTel != '' && that.newCarrierDriver.contactTel != undefined){
                that.OrderCarrierDriver.contactTel = that.newCarrierDriver.contactTel;
            }
            if(that.newCarrierEqp.eqpName != '' && that.newCarrierEqp.eqpName != undefined){
                that.OrderCarrierEqp.eqpName = that.newCarrierEqp.eqpName;
            }
            if(that.newCarrierEqp.eqpNo != '' && that.newCarrierEqp.eqpNo != undefined){
                that.OrderCarrierEqp.eqpNo = that.newCarrierEqp.eqpNo;
            }

            that.OrderCarrierEqp.eqpBrand = that.newCarrierEqp.eqpBrand;
            that.OrderCarrierEqp.eqpType = that.newCarrierEqp.eqpType;
            that.OrderCarrierEqp.eqpSpec = that.newCarrierEqp.eqpSpec;
            that.OrderCarrierEqp.eqpLength = that.newCarrierEqp.eqpLength;
            that.OrderCarrierEqp.eqpWidth = that.newCarrierEqp.eqpWidth;
            that.OrderCarrierEqp.eqpHeight = that.newCarrierEqp.eqpHeight;
            that.OrderCarrierEqp.eqpStr1 = that.newCarrierEqp.eqpStr1;
            that.OrderCarrierEqp.eqpStr2 = that.newCarrierEqp.eqpStr2;

            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";

            var orderHeadModel = {
            	carrierPartyInfo:{
                	contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                order: that.currLineInfo,
                stationLocationInfoList: that.stationLocationList
            };
            postRequest(tmsUrl + "/save/tloOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderHeadModel,function(data){
                $(".maskLayer4").hide();
                that.getOrderDetails(that.currentClassesEq);

                that.pathScheduleOrder[that.currentClassesEq].str1 = that.currLineInfo.str1;
                that.pathScheduleOrder[that.currentClassesEq].carDrvContactName = orderHeadModel.carrierPartyInfo.contact.contactName;
                that.pathScheduleOrder[that.currentClassesEq].carDrvContactTel = orderHeadModel.carrierPartyInfo.contact.contactTel;
                that.pathScheduleOrder[that.currentClassesEq].carDrvEqpNo = orderHeadModel.carrierPartyInfo.eqp.eqpNo;
            })
        },
        showCustomer(){
            $(".maskLayer6").show();
            this.customer = "";
        },
        // 添加客户商
        addReportCustomer(){
            var that = this;
            if(that.customer == "" || that.customer == undefined){
                layer.msg("客户商不能为空！");
                return false;
            }

            for(let i=0;i<that.waitScheduleOrder.length;i++){
                var orderCustomer = {
                    party:{
                        partyCode:that.waitScheduleOrder[i].partyCode,
                        partyName:that.waitScheduleOrder[i].partyName,
                        refId: that.orderDetails.omOrderId
                    },
                    location:{
                        address:that.waitScheduleOrder[i].address,
                        cityCode:that.waitScheduleOrder[i].cityCode,
                        districtCode:that.waitScheduleOrder[i].districtCode,
                        lat:that.waitScheduleOrder[i].lat,
                        latLng:that.waitScheduleOrder[i].latLng,
                        lng:that.waitScheduleOrder[i].lng,
                        locationCode:that.waitScheduleOrder[i].locationCode,
                        locationName:that.waitScheduleOrder[i].locationName,
                        postCode:that.waitScheduleOrder[i].postCode,
                        provinceCode:that.waitScheduleOrder[i].provinceCode,
                        street:that.waitScheduleOrder[i].street
                    }
                };
                postRequest(tmsUrl + "/insert/tloPartyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderCustomer,function(data){
                    that.getOrderDetails(that.currentClassesEq,1);
                    layer.msg("客户添加成功");
                    that.customer = ""
                })
            }
        },
        //取消这个选中客户
        cancelLiFun(tableOrderItem,index){
            var that = this;
            var r = confirm("是否取消选中该订单");
            if(r == true){
                var omPartyId = tableOrderItem.party.omPartyId;
                getRequest(tmsUrl + "/delete/tloPartyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&omPartyId="+omPartyId,function(data){
                    that.reportMessagesOrderList.splice(index, 1);
                })
            }
        },
        publicChangeBtnStatus(){
			var that = this;
			setTimeout(function(){
				var permissionListObj  = "";
			  	var pageid = GetQueryString("objectId");
			  	var buttonObj = $(".butOperatePermission");
			  	$.ajax({
			  		type:"get",
			  		url:umsUrl+'/query/objectByUser.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&userId="+that.logininf.umUserId+"&parentUmObjectId="+pageid,
			  		success:function(res){
			  			permissionListObj  = res.result;
						//console.log(buttonObj.length);
						for(var i = 0; i < permissionListObj.length; i++){
					  		for(var j = 0; j < buttonObj.length; j++){
					  			if(permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")){
					  				for(var m = 0; m < permissionListObj[i].permissionList.length;m++){
					  					if(permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show"){
					  						//console.log(j);
					  						if(permissionListObj[i].objectCode == "UPLOAD"){
					  							$(".fileUploadHint").css({"display":"inline-block"});
					  						}
					  						$(".butOperatePermission").eq(j).css({"display":"inline-block"})
					  						$(".butOperatePermission").eq(j).show();
					  					}else{
					  						$(".butOperatePermission").eq(j).parents(".commandbarItem").hide();
					  						$(".butOperatePermission").eq(j).hide();

					  					}
					  				}
					  			}
					  		}
					  	}
			  		}
			  	});
			},100)
		},
        resetOrderList(){
            window.location.reload();
        }
    },
    created:function(){
        var that = this;
        initSelectData(this);
        this.dpDistrictList = getProvinceData("100000");
        that.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        var partyListData = that.selectListData.partyList;
        var newPartyListData = [];
        if (null != partyListData) {
            for(var i = 0; i < partyListData.length; i++ ){
                if(partyListData[i].partyType == "CAR"){
                    newPartyListData.push(partyListData[i])
                }
            }
        }
        that.selectListData.partyList = newPartyListData;
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        var searchFormArr0 = {
            refType:"PARTYLNK"
        };
        postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr0,function(data){
            if(data.result != null){
                if(data.result.length > 0){
                    that.resPartyList = data.result;
                }else{
                    that.resPartyList = [];
                }
            }else{
                that.resPartyList = [];
            }
        });

        //获取订单列表
        var searchFormArr = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.queryPageSize
            }
        }
        //获取路线列表
        postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
            that.pathScheduleOrder = data.result;
            that.publicChangeBtnStatus();
        })
    },
    filters:{
        timestampToTime(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
                var currentTime = timestamp - offsetMs;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate() + ' ';
                h = date.getHours() < 10 ? '0'+ date.getHours() + ":" : date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0'+ date.getMinutes() : date.getMinutes();
                s = date.getSeconds() < 10 ? '0'+ date.getSeconds() : date.getSeconds();
                return Y+M+D+h+m;
            }
        }
    }
})

//绘制矢量图形
var map = new AMap.Map("container", {
    zoom: 9,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});
var mouseTool = new AMap.MouseTool(map);  //在地图中添加MouseTool插件
var markerInfoArray = [];  // 总订单列表692385c0456b39aa7ddc41e56c88596f
var markerInfoArrayAdditive = "";
var markerInfoResArrayAll = [];  // 选中的订单数组（总数组）（还要 push 本次选中的数组）
var featureClickStr = '0',featureClickAdcode;
var receiptPartyInfoList = [{}]; //  选中的订单数组传参
var colors = [
    "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
    "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
    "#651067", "#329262", "#5574a6", "#3b3eac"
];

/*AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function(DistrictExplorer, $) {

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

        if(props.childrenNum == 0){
            //  console.log('最小级别区域了，可以请求订单数');
        }

        if (isHover) {
            //更新提示内容
            //   $tipMarkerContent.html(props.adcode + ': ' + props.name);
            $tipMarkerContent.html(props.name);
            //更新位置
            tipMarker.setPosition(position || props.center);
        }

        //    $('#area-tree').find('h2[data-adcode="' + props.adcode + '"]').toggleClass('hover', isHover);

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
        console.log('featureClick');

        var props = feature.properties;
        //   console.log(props);

        featureClickAdcode = props.adcode;
        if(featureClickStr == '1'){

        }

        //如果存在子节点
        if (props.childrenNum > 0) {
            //切换聚焦区域
            switch2AreaNode(props.adcode);
        }
        map.setZoomAndCenter(10, [props.center[0],props.center[1]]);
    });

    //外部区域被点击
    districtExplorer.on('outsideClick', function(e) {
        console.log('outsideClick');
        if(featureClickStr == '1'){

        }

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
        /!* for (var i = 0, len = subFeatures.length; i < len; i++) {
             renderAreaPanelNode($subBox, areaNode.getPropsOfFeature(subFeatures[i]), colors[i % colors.length]);
         }*!/
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
                strokeColor: '#b0b0b0', //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: null, //填充色
                fillOpacity: 0.35, //填充透明度
            };
        });

        //绘制父区域
        districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: '#b3b3b3', //线颜色
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

        /!*!//更新选中节点的class
        var $nodeEles = $('#area-tree').find('h2');

        $nodeEles.removeClass('selected');

        var $selectedNode = $nodeEles.filter('h2[data-adcode=' + areaNode.getAdcode() + ']').addClass('selected');

        //展开下层节点
        $selectedNode.closest('li').removeClass('hide-sub');

        //折叠下层的子节点
        $selectedNode.siblings('ul.sublist').children().addClass('hide-sub');*!/
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

    /!*$('#area-tree').on('mouseenter mouseleave', 'h2[data-adcode]', function(e) {

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
    });*!/

    //全国
    // switch2AreaNode(100000);
});*/
var markerInfoResArray = [];
/*AMap.event.addListener(mouseTool, 'draw', function(type,obj) {
    pathArray = [];
    var polygonItem = type.obj;
    var path = polygonItem.getPath(); // 取得绘制的多边形
    $.each(path, function (index, item) {
        var param1 = [item.lng,item.lat];
        pathArray.push(param1);  // 取得绘制的多边形的每一个点坐标
    });

    //   console.log(pathArray);

    if(pathArray.length>0 && markerInfoArray.length>0){
        var markerIdInfoResArray = [];   // 选中的订单数组（本次选中的数组），选中订单的omOrderId

        var polygon = new AMap.Polygon({
            map: map,
            fillColor:'#00b0ff',
            strokeColor:'#80d8ff',
            path: pathArray
        });

        $.each(markerArray, function (index, item) {
            var markerInPolygon  = polygon.contains(item.getPosition());  // 点是否在几何图形内，true / false
            if(markerInPolygon == true){  // 点在几何图形内才push
                var idString = item.ue.content.id;
                var pointIdArray = idString.split('order');
                var id = pointIdArray[1];
                $.each(markerInfoArray, function (index0, item0){
                    if(item0.cdPartyId == id){
                        markerInfoResArray.push(item0);
                        markerIdInfoResArray.push(item0.cdPartyId);
                    }
                })
            }
        });

        //———————————— 把 markerInfoResArray 选中的订单数组（本次选中的数组） 放到 markerInfoResArrayAll 选中的订单数组（总数组） 中，再对 markerInfoResArrayAll 去重
        var newArrayOrder = [];
        $.each(markerInfoResArray, function (index, item) {
            markerInfoResArrayAll.push(item);
        });
        for(var r=0;r<markerInfoResArrayAll.length;r++){
            if(newArrayOrder.indexOf(markerInfoResArrayAll[r])<0){
                newArrayOrder.push(markerInfoResArrayAll[r]);
            }
        }
        markerInfoResArrayAll = newArrayOrder;
        for(var i=0;i<markerInfoResArrayAll.length;i++){
            receiptPartyInfoList.push(markerInfoResArrayAll[i])
        }
        receiptPartyInfoList = receiptPartyInfoList.slice(1);
        drawClearFun2();  // 清除已绘制图形，关闭信息窗体

        // 标记选中的点
        $.each(markerInfoResArrayAll, function (index, item) {
            var strHtml = '<div class="orderMapPoint1"></div>';
            $('#order'+item.cdPartyId).html(strHtml);
        });

        // 勾选订单    // 根据 markerInfoResArrayAll 计算 : 选中总计 、 列表
        var reportMessagesOrderStart = [];  // 起点
        app.reportMessagesRes = {
            endAddress:""
        };
        for(var i = markerInfoResArrayAll.length-1 ; i >= 0;i--){
            var itemList = markerInfoResArrayAll[i];
            if(app.reportMessagesRes.endAddress == ''){
                if(itemList.stoAddress != null){
                    app.reportMessagesRes.endAddress = itemList.stoAddress;
                }
            }
        }
        if(app.reportMessagesRes.endAddress == ''){
            app.reportMessagesRes.endAddress = app.endAddressStr;
        }
        $.each(markerInfoResArrayAll, function (index, item) {
            if(reportMessagesOrderStart.length == 0){
                if(item.partyName != null){
                    reportMessagesOrderStart.push(item);
                }
            }
        });
        app.reportMessagesOrderStart = reportMessagesOrderStart;
        // app.reportMessagesOrderList = markerInfoResArrayAll;

        drawCloseFun();   // 关闭绘图

        featureClickStr = '1';
    }
});*/

// -------------------------------------- 绘制  多边形、矩形、圆形
function draw(type){
    drawType = type;
    switch(type){
        case 'polygon':{           // ---------- 多边形
            mouseTool.polygon({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Polygon的Option设置
            });
            break;
        }
        case 'rectangle':{          // ---------- 矩形
            mouseTool.rectangle({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Polygon的Option设置
            });
            break;
        }
        case 'circle':{          // ---------- 圆形
            mouseTool.circle({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Circle的Option设置
            });
            break;
        }
    }
}
// -------------------------------------- 关闭绘图
function drawCloseFun() {
    mouseTool.close(true)//关闭，并清除覆盖物
}
// 清除已绘制图形，重置总计，重置 选中的订单数组（总数组），重置 标记点的颜色，关闭信息窗体
function drawClearFun1() {
    // 清除已绘制图形
    var polylineArr = map.getAllOverlays('polyline');
    if(polylineArr.length != 0){
        map.remove(polylineArr);
    }
    var polygonArr = map.getAllOverlays('polygon');
    if(polygonArr.length != 0){
        map.remove(polygonArr);
    }
    var rectangleArr = map.getAllOverlays('rectangle');
    if(rectangleArr.length != 0){
        map.remove(rectangleArr);
    }
    var circleArr = map.getAllOverlays('circle');
    if(circleArr.length != 0){
        map.remove(circleArr);
    }

    // 重置 选中的订单数组（总数组）
    markerInfoResArrayAll = [];
    markerInfoResArray = [];
    // app.reportMessagesOrderList = {};
    app.reportMessagesOrderStart = {};
    // 重置 标记点的颜色
    // 关闭信息窗体
    closeSignalOrderClick();
}
// --------------------------------------清除已绘制图形，关闭信息窗体
function drawClearFun2() {
    // 清除已绘制图形
    var polylineArr = map.getAllOverlays('polyline');
    if(polylineArr.length != 0){
        map.remove(polylineArr);
    }
    var polygonArr = map.getAllOverlays('polygon');
    if(polygonArr.length != 0){
        map.remove(polygonArr);
    }
    var rectangleArr = map.getAllOverlays('rectangle');
    if(rectangleArr.length != 0){
        map.remove(rectangleArr);
    }
    var circleArr = map.getAllOverlays('circle');
    if(circleArr.length != 0){
        map.remove(circleArr);
    }
    // 关闭信息窗体
    closeSignalOrderClick();
}


// 打开信息窗体
/*function signalOrderClick(e) {
    var idString = e.target.ue.content.id;
    var pointIdArray = idString.split('order');
    var id = pointIdArray[1];
    var info = '',partyName = '-',partyCode = '-';
    var markerInfoPopover = markerInfoArray;
    if(markerInfoArrayAdditive == true){
        markerInfoPopover = markerInfoResArrayAll;
    }
    if(id != '') {
        for (var i = 0; i < markerInfoPopover.length; i++) {
            if (markerInfoPopover[i].cdPartyId == id) {
                if (markerInfoPopover[i].partyName != null) {
                    partyName = markerInfoPopover[i].partyName;
                }
                if (markerInfoPopover[i].partyCode != null) {
                    partyCode = markerInfoPopover[i].partyCode;
                }
                info = '<div><p><span class="pointInfoColor1">合作商名称：</span><span class="pointInfoColor2">' + partyName + '</span></p>' +
                    '<p><span class="pointInfoColor1">合作方代码：</span><span class="pointInfoColor2">' + partyCode + '</span></p>'
            }
        }
    }
    infoWindow.setContent(info);  // e.target.content
    infoWindow.open(map, e.target.getPosition());
}*/
// 关闭信息窗体
function closeSignalOrderClick() {
    $('.amap-info-contentContainer').hide();
}

///////////////////////////////////////////////////////////////////////////////////////////
function initSelectData(that){
    that.reportMessagesBtnShow1 = '0';
    that.reportMessagesOrderList = {};
    that.reportMessagesOrderStart = {};
}


// 引入layui
var layer;
layui.use(['layer'], function () {
    layer = layui.layer;
});

//解决sortable.js拖拽打开新页面
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
};
