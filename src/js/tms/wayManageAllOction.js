var app = new Vue({
    el: '#overall',
    data: {
        waybillInfoList: [],
        handWaybillInfoList: [],
        autoWaybillInfoList: [],
        logininf: {},
        selectListData: [],
        dpDistrictList: [],
        queryParam: {
            orderNature: "",
            origin: "",
            customerOriginalNo: "",
            sfrPartyName: "",
            stoPartyName: "",
            assignStatus: "",
            sfrPartyNos: ""
        },
        areaDistrictList: [],
        areaDistrictGroups: [],
        districtPolygonGroups: [],
        overlaysGroups: [],
        pathList: [],
        manualPolygonGroups: [],
        certainPolygon: {},
        markerArray: [],
        disabled: true,
        waitScheduleOrder: [],
        timeHorizon: "",
        timeHorizon1: "",
        mouseTool: {},
        listModelink: "",
        isDrawing: false,
        finishScheduleOrder: [],
        hasTfoOrderInfo: true,
        currentClassNum: null,
        currentClassInfo: {},
        currentClassesArr: [],
        allC1: false,
        allC2: false,
        isShowScheduleBox: false,
        orderResultInfoList: [],
        orderResultOmOrderId: [],
        allocatedOrderArr: [],
        isRowOfSingle: 1,
        isProcessSingle: false,
        pathArray: [],
        markerInfoResArrayAll: [],
        markerInfoResArray: [],
        markerIdInfoResArray: [],
        markerIdInfoResArrayAll: [],
        toolPolygonLists: [],
        reportMessagesRes: {
            totalNumQtyAll: 0,
            totalNumWeightAll: 0,
            totalNumVolumeAll: 0,
            int2: 0,
            int2All: 0
        },
        temMessagesRes: {
            totalNumQty: 0,
            totalNumWeight: 0,
            totalNumVolume: 0,
            int2: 0,
            int2All: 0
        },
        carrierResPartyInfo: {
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
            }
        },
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
        lineColorList: ['#b52cfc', '#f08f0e', '#009DEF', '#64BD3D', '#E89589', '#16A085', '#4A235A', '#C39BD3', '#F9E79F', '#BA4A00', '#ECF0F1', '#4A235A'],
        lineStoLatLngList: [],
        routeLineList: [],
        lineMarkerList: [],
        isShowLinePath: false,
        resPartyList: [],
        OrderCarrier: {},
        OrderCarrierContact: {},
        OrderCarrier1: {},
        shortShowType: false,
        shortShowType1: false,
        carrierDriver: {},
        carrierEqp: {},
        driverList: [],
        initDriverList: [],
        getDriverListTimer: null,
        deliveryDate: getQueryTime(0),
        deliveryDate3: getQueryTime(0) + " " + "00:00",
        adjust0: false,
        isAreaSelected: false,
        adClassTotallist: [],
        adBesicInfosList: [],
        sortTemShowList: [],
        sortTransDataList: [],
        sortFromOrderIdList: [],
        adMarkerAcceptList: [],
        pageIndex: 0,
        arr1: {},
        allC3: false,
        selectedWaybillArr: [],
        darkblueWaybillArr: [],
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}),
        linkNames: ["路线排单", "路线管理", "任务排班"],
        linkHrefs: [],
        shipperPartyLocation: {
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: ""
        },
        driIndex: 0,
        currStoreTexts: [],
        reportMessagesSearch: {
            totalNums:"",
            totalNumsUnit:""
        },
        currentRelatedArr: [],
        pathScheduleOrder: [],
        pathQueryParams:{},
        sortAble: null,
        alive: true,
        reportMessagesOrderList: [],
        stationLocationList: [],
        coincident: false,
        showCutMapCard: true
    },
    methods: {
        // 获取班次列表
        getClassesList(txt,ommmId) {
            var that = this;
            that.finishScheduleOrder = [];
            that.currentClassesArr = [];
            that.allC1 = false;
            that.allC2 = false;
            $(".mapRightBoxIn1 .boxInConcent2 input[type='checkbox']").prop('checked', false);
            $(".mapRightBoxIn1 .boxInConcent .see").removeClass("active");
            that.isShowScheduleBox = false;
            var searchFormArr = {
                pageInfo: {
                    pageNum: 1,
                    pageSize: 100000
                },
                isAsign: true,
                startCompleteTime: that.timeHorizon1,
                endCompleteTime: that.timeHorizon1
            };
            postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                if (data.result != null && data.result.length > 0) {
                    that.finishScheduleOrder = data.result;
                }
                if (txt == '1') {
                    for (var i = 0; i < that.finishScheduleOrder.length; i++) {
                        if (that.finishScheduleOrder[i].omOrderId == that.currentClassInfo.omOrderId) {
                            that.classResultInfo(that.currentClassNum);
                            that.isShowScheduleBox = true;
                            break;
                        }
                    }
                }else if(txt == '2'){
                    for (var j = 0; j < that.finishScheduleOrder.length; j++) {
                        if (that.finishScheduleOrder[j].omOrderId == ommmId) {
                            setTimeout(function () {
                                $(".mapRightBoxIn1 .boxInConcent .see").eq(j).addClass("active");
                                that.currentClassInfo = that.finishScheduleOrder[j];
                                that.showClassPath();
                            },300);
                            break;
                        }
                    }
                }
            })
        },

        // 选择店铺
        chooseStore(index, text) {
            var that = this;
            if ($(".searchBtn .likeOption .hang dd").eq(index).hasClass("active")) {
                that.currStoreTexts.splice($.inArray(text, that.currStoreTexts), 1);
            } else {
                that.currStoreTexts.push(text);
            }
            that.queryParam.sfrPartyNos = that.currStoreTexts.toString();
            $(".searchBtn .likeOption .hang dd").eq(index).toggleClass("active");
        },
        // 展开店铺列表
        isShowHang() {
            var that = this;
            $(".searchBtn .likeOption .hang").toggle();
            $(".searchBtn .likeOption .hang").css("top",$(".searchBtn .likeOption").offset().top + $(".searchBtn .likeOption").height())
            $(".searchBtn .likeOption .hang").css("left",$(".searchBtn .likeOption>input").offset().left)
        },
        // 重置
        clearSearchInfo() {
            var that = this;
            that.queryParam = { // 搜索条件
                customerOriginalNo: "",
                orderNature: "",
                origin: "",
                sfrPartyName: "",
                stoPartyName: "",
                assignStatus: "",
                sfrPartyNos: ""
            };
            that.currStoreTexts = [];
            $(".searchBtn .likeOption .hang dd.active").removeClass("active");
        },
        // 获取全部订单
        getSearchOrderList(txt) {
            var that = this;
            var searchFormArr = that.queryParam;
            searchFormArr.startCompleteTime = that.timeHorizon.split(" - ")[0];
            searchFormArr.endCompleteTime = that.timeHorizon.split(" - ")[1];
            searchFormArr.isAsign = true;
            if (txt == 1) {
                searchFormArr.latLngNumber = 1;
            }else{
                searchFormArr.latLngNumber = "";
            }

            postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                that.waitScheduleOrder = data.result;
                that.markerArrayFun(that.waitScheduleOrder);
            })
        },
        // 地图批量标记订单
        markerArrayFun(markerInfoArray) {
            var that = this;
            if (that.markerArray.length > 0) { //清除所有标记点
                for (var a = 0; a < that.markerArray.length; a++) {
                    map.remove(that.markerArray[a]);
                }
            }
            map.remove(that.infoWindow);
            that.markerArray = [];

            for (var n = 0; n < markerInfoArray.length; n++) {
                var newDiv = document.createElement("div");
                var item = markerInfoArray[n], markerLocation = [], stoLatLngStr = '';

                if (item.stoLatLng != null && item.stoLatLng != '' && item.stoLatLng != undefined) {
                    stoLatLngStr = item.stoLatLng;
                    markerLocation = item.stoLatLng.split(',');
                    newDiv.className = 'orderMapPoint1';
                } else {
                    continue;
                }

                newDiv.setAttribute("stoLatLngStr", stoLatLngStr);
                newDiv.setAttribute("omOrderId", item.omOrderId);

                var marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });

                marker.setContent(newDiv);
                that.markerArray.push(marker);
                marker.on('click', function (e) {
                    that.openSignalOrderInfo(e, markerInfoArray);
                });
                if (that.isRowOfSingle == 4) {
                    newDiv.className += " " + "orderMapPoint11";
                }
            }
        },
        // 点击订单标记点
        openSignalOrderInfo(e, markerList) {
            var that = this;
            var stoLatLngStrVal = e.target.ue.content.attributes.stoLatLngStr.value;
            var omOrderId = e.target.ue.content.attributes.omOrderId.value;
            $('.amap-info-contentContainer').show();
            var temp = [], info;
            var currentPointList = markerList;

            for (var n = 0; n < currentPointList.length; n++) {
                if (currentPointList[n].stoLatLng == stoLatLngStrVal) {
                    temp.push(n);
                }
            }
            for (var i = 0; i < currentPointList.length; i++) {
                if (currentPointList[i].omOrderId == omOrderId) {
                    var totalDiv = '';
                    for (var a = 0; a < temp.length; a++) {
                        var tem = temp[a];
                        totalDiv += '<div class="pointInfoDiv1">' +
                            '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">单号：</span><span class="pointInfoColor2">' + currentPointList[tem].trackingNo + '</span></p>' +
                            '<p><span class="pointInfoColor1">数量：</span><span class="pointInfoColor2">' + currentPointList[tem].totalQty + '</span> <span class="pointInfoColor1">件</span></p>' +
                            '<p><span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + currentPointList[tem].totalWeight + '</span> <span class="pointInfoColor1">千克</span></p>' +
                            '<p><span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + currentPointList[tem].totalVolume + '</span> <span class="pointInfoColor1">立方米</span></p>' +
                            '<p><span class="pointInfoColor1">状态：</span><span class="pointInfoColor2">' + that.completeStatusChange(currentPointList[tem].completeStatus) + '</span></p>' +
                            '<p><span class="pointInfoColor1">发货商：</span><span class="pointInfoColor2">' + currentPointList[tem].sfrPartyName + '</span></p>' +
                            '<p><span class="pointInfoColor1">收货商：</span><span class="pointInfoColor2">' + currentPointList[tem].stoPartyName + '</span></p>' +
                            '<p><span class="pointInfoColor1">收货地址：</span><span class="pointInfoColor2">' + currentPointList[tem].stoAddress + '</span></p>' +
                            '</div>';
                    }
                    info = '<div>' + totalDiv + '</div>';
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },

        // 新增班次
        jumpNewClasses() {
            var that = this;
            $(".maskLayer2").show();
            that.resPartyList = [];
            that.carrierDriver = [];
            that.carrierEqp = [];
            that.deliveryDate = getQueryTime(0) + " " + "01:00";
            that.OrderCarrier = {
                cdPartyId: ""
            };
            that.OrderCarrierContact = {
                contactName: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: ""
            };
            that.OrderCarrier1 = {
                partyName: "",
                partyCode: "",
                isBuyer: false,
                isVendor: false,
                isTruck: false,
                isWarehouse: false,
                is3pl: false
            };
            var searchFormArr0 = {
                refType: "PARTYLNK"
            };
            //获取新建班次承运商列表
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr0, function (data) {
                if (data.result != null) {
                    if (data.result.length > 0) {
                        that.resPartyList = data.result;

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
        // 切换承运商
        changeCarrierInfo(id) {
            var that = this;
            if (id != '') {
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
        // 获取司机列表
        getDriverList(val) {
            var that = this;
            that.driverList = [];
            if (val == "" || val == undefined) {
                that.driverList = that.initDriverList;
            } else {
                var param = {
                    contactName: val,
                    refType: "CONTACT"
                };
                clearTimeout(that.getDriverListTimer);
                that.getDriverListTimer = null;
                that.getDriverListTimer = setTimeout(function () {
                    $.ajax({
                        url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,
                        type: "post",
                        contentType: 'application/json',
                        data: JSON.stringify(param),
                        success: function (data) {
                            if (data.result.length > 0) {
                                that.driverList = data.result;
                            }
                        }
                    })
                }, 80)
            }
        },
        // 选中、取消司机
        chooseDriverInfo(index) {
            var that = this;
            $(".carouselItem").eq(index).toggleClass("active");
        },
        // 详情、收起
        isShowItemDetails(num, index) {
            var that = this;
            if (num == '0') {
                that.shortShowType = !that.shortShowType;
            } else if (num == '1') {
                $(".carouselItem").eq(index).find(".singleSwitch span").toggle();
                $(".carouselItem").eq(index).find(".adsRightConInp:last-child").toggleClass("active");
            }
        },
        // 保存新增班次
        newDistributeOrder() {
            var that = this;
            if (that.OrderCarrier.cdPartyId === "") {
                imitatePopup("请选择承运商", 'alert');
                return false;
            }
            var carrierPartyList = [];
            $.each($(".carouselItem"), function (index, item) {
                if (item.getAttribute("class").indexOf("active") != -1) {
                    carrierPartyList.push(that.initDriverList[index]);
                }
            });

            var newClassesObjList = [];
            for(var i=0;i<carrierPartyList.length;i++){
                that.carrierDriver = {
                    contactName: carrierPartyList[i].contactName,
                    contactTel: carrierPartyList[i].contactTel
                };
                that.carrierEqp = {
                    eqpNo: carrierPartyList[i].eqpNo,
                    eqpName: carrierPartyList[i].eqpName,
                    eqpBrand: carrierPartyList[i].eqpBrand,
                    eqpType: carrierPartyList[i].eqpType,
                    eqpNature: carrierPartyList[i].eqpNature,
                    eqpSpec: carrierPartyList[i].eqpSpec,
                    eqpLength: carrierPartyList[i].eqpLength,
                    eqpWidth: carrierPartyList[i].eqpWidth,
                    eqpHeight: carrierPartyList[i].eqpHeight,
                    eqpStr1: carrierPartyList[i].eqpStr1,
                    eqpStr2: carrierPartyList[i].eqpStr2
                };
                var newClassesObj = {
                    carrierPartyInfo: {
                        contact: that.carrierDriver,
                        eqp: that.carrierEqp,
                        imgContact: that.OrderCarrierContact,
                        party: that.OrderCarrier1
                    },
                    dtmTime: that.deliveryDate
                };
                newClassesObjList.push(newClassesObj);
            }
            postRequest(tmsUrl + "/insert/tfoOrders.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, newClassesObjList, function (data) {
                that.closeMaskLayer();
                layer.alert('新增' + carrierPartyList.length + '个班次成功！');
                if (that.deliveryDate.split(" ")[0] == that.timeHorizon1) {
                    that.getClassesList(1);
                    that.isShowScheduleBox = false;
                }
            });
        },

        // 点击班次
        classResultInfo(index, txt) {
            var that = this;
            that.orderResultInfoList = [];
            that.orderResultOmOrderId = [];
            that.carrierResPartyInfo = {
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
            };
            that.reportMessagesRes = {
                totalNumQtyAll: 0,
                totalNumWeightAll: 0,
                totalNumVolumeAll: 0,
                int2: 0,
                int2All: 0
            };
            that.temMessagesRes = {
                totalNumQty: 0,
                totalNumWeight: 0,
                totalNumVolume: 0,
                int2: 0,
                int2All: 0
            };
            var currInt2 = 0;
            $(".mapRightBoxIn1 .boxInConcent .see").removeClass("active");
            $(".mapRightBoxIn1 .boxInConcent .see").eq(index).addClass("active");
            that.currentClassNum = index;
            that.currentClassInfo = that.finishScheduleOrder[index];

            var searchFormArr = {
                refId: that.currentClassInfo.omOrderId,
                refNo: that.currentClassInfo.orderNo
            };
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                // 订单列表
                if (data.result.orderLnkList != null) {
                    that.orderResultInfoList = data.result.orderLnkList;
                    if (data.result.orderLnkList.length > 0) {
                        for (var a = 0; a < data.result.orderLnkList.length; a++) {
                            that.orderResultOmOrderId.push(data.result.orderLnkList[a].omOrderId)
                        }
                    }

                    // 班次件毛体统计
                    var totalQtyAll = 0, totalWeightAll = 0, totalVolumeAll = 0;
                    $.each(that.orderResultInfoList, function (index, item) {
                        totalQtyAll += item.totalQty;
                        totalWeightAll += item.totalWeight;
                        totalVolumeAll += item.totalVolume;
                    });
                    that.temMessagesRes.totalNumQty = totalQtyAll.toFixed(2);
                    that.temMessagesRes.totalNumWeight = totalWeightAll.toFixed(2);
                    that.temMessagesRes.totalNumVolume = totalVolumeAll.toFixed(2);

                    // 切换显示路线
                    if (that.isShowLinePath) {
                        that.showClassPath();
                    }
                }

                // 点位数
                if (data.result.order != null) {
                    that.resTfoOrder = data.result.order;
                    that.resTfoOrder.dtmTime = data.result.dtmTime;
                    if (data.result.order.int2 != null && data.result.order.int2 != "") {
                        that.temMessagesRes.int2 = data.result.order.int2;
                    }
                }

                // 司机、车辆基本信息
                if (data.result.carrierPartyInfo != null) {
                    if (data.result.carrierPartyInfo.contact != null) {
                        that.carrierResPartyInfo.contact = data.result.carrierPartyInfo.contact;
                    }
                    if (data.result.carrierPartyInfo.eqp != null) {
                        that.carrierResPartyInfo.eqp = data.result.carrierPartyInfo.eqp;
                    }
                    if (data.result.carrierPartyInfo.party != null) {
                        that.carrierResPartyInfo.party = data.result.carrierPartyInfo.party;
                    }
                    if (data.result.carrierPartyInfo.imgContact != null) {
                        that.carrierResPartyInfo.imgContact = data.result.carrierPartyInfo.imgContact;
                    }
                }

                // 总计
                that.reportMessagesRes.int2All = accAdd(that.reportMessagesRes.int2, currInt2);
                that.reportMessagesRes.int2 = accAdd(that.reportMessagesRes.int2, currInt2);
                that.reportMessagesRes.totalNumQtyAll = accAdd(that.reportMessagesRes.totalNumQtyAll, that.temMessagesRes.totalNumQty);
                that.reportMessagesRes.totalNumWeightAll = accAdd(that.reportMessagesRes.totalNumWeightAll, that.temMessagesRes.totalNumWeight);
                that.reportMessagesRes.totalNumVolumeAll = accAdd(that.reportMessagesRes.totalNumVolumeAll, that.temMessagesRes.totalNumVolume);

                if (txt) {
                    that.resCalculation();
                }
            })
        },
        // 查看班次订单列表
        showResultInfo(index) {
            var that = this;
            if (that.currentClassNum != index) {
                that.classResultInfo(index);
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

        // 批量选择班次
        textboxAllSelectionFun() {
            var that = this;
            that.currentClassesArr = [];
            $(".mapRightBoxIn1 .boxInConcent2 input[type='checkbox']").prop('checked', !that.allC1);

            if (!that.allC1) {
                for (var i = 0; i < that.finishScheduleOrder.length; i++) {
                    that.currentClassesArr.push(that.finishScheduleOrder[i]);
                }
            } else {
                that.currentClassesArr = [];
            }
        },
        // 单选班次
        textboxSelectionFun(event, index) {
            var that = this;
            var el = event.target;
            if ($(el).prop("checked")) {
                that.currentClassesArr.push(that.finishScheduleOrder[index]);
            } else {
                that.currentClassesArr.splice($.inArray(that.finishScheduleOrder[index], that.currentClassesArr), 1);
            }

            if (that.currentClassesArr.length == that.finishScheduleOrder.length) {  // 单选个数 = 该页条数，全选选中
                that.allC1 = true;
            } else {
                that.allC1 = false;
            }
        },
        // 删除班次
        batchDeleteOrder() {
            var that = this;
            if (that.currentClassesArr.length == 0) {
                layer.msg("请先勾选班次！");
                return false;
            }
            var toDeleteArr = [];
            for (var i = 0; i < that.currentClassesArr.length; i++) {
                toDeleteArr.push(that.currentClassesArr[i].omOrderId);
            }
            postRequest(tmsUrl + "/delete/tfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, toDeleteArr, function (data) {
                layer.msg("班次删除成功！");
                that.getClassesList();
            })
        },
        // 班次合并
        classesMerge() {
            var that = this;
            if (that.currentClassesArr.length == 0) {
                layer.msg("请先勾选班次！");
                return false;
            }
            var combineClassesArr = [];
            for (var i = 0; i < that.currentClassesArr.length; i++) {
                combineClassesArr.push({
                    fromOrderId: that.currentClassesArr[i].omOrderId,
                    fromOrderNo: that.currentClassesArr[i].customerOriginalNo
                })
            }
            postRequest(tmsUrl + "/merge/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, combineClassesArr, function (data) {
                if (data.result) {
                    if (data.msg == 'success' || data.msg == 'SUCCESS') {
                        imitatePopup("合并成功！", 'alert');
                        that.getClassesList();
                    } else {
                        imitatePopup(data.msg, "alert");
                    }
                } else {
                    imitatePopup("合并失败，请重试！", 'alert');
                }
            })
        },
        // 批量派发
        batchDistributed() {
            var that = this;
            if (that.currentClassesArr.length == 0) {
                layer.msg("请先勾选班次");
                return false;
            }
            for (var a = 0; a < that.currentClassesArr.length; a++) {
                if (that.currentClassesArr[a].carDrvContactName == null || that.currentClassesArr[a].carDrvEqpNo == null) {
                    imitatePopup('班次：' + that.currentClassesArr[a].str1 + '，派发前请先指派司机！', "alert");
                    return false;
                }
            }
            var stayOutClasses = [];
            for (var i = 0; i < that.currentClassesArr.length; i++) {
                stayOutClasses.push({
                    state: 1,
                    refId: that.currentClassesArr[i].omOrderId,
                    refNo: that.currentClassesArr[i].orderNo
                })
            }
            postRequest(tmsUrl + "/save/tfoOrderAuditStatus.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, stayOutClasses, function (data) {
                if (data.msg == 'success' || data.msg == 'SUCCESS') {
                    imitatePopup("派发成功！", 'alert');
                    that.currentClassesArr = [];
                    that.allC1 = false;
                    $(".mapRightBoxIn1 .boxInConcent2 input[type='checkbox']").prop('checked', false);
                    that.isShowScheduleBox = false;
                }
            })
        },
        // 班次导入
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
        filesUpload() {	//文件上传
            var that = this;
            $.ajaxFileUpload({
                url: tmsUrl + '/tfoOrderInfo/uploadExcelFile.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    setTimeout(function () {
                        $(".fileUploadLi .inputBox").css({"display": "inline-block"});
                        imitatePopup(data.result.resultMsg, "alert");
                        that.timeHorizon1 = getQueryTime(-1);
                        that.getClassesList(); //获取现有班次
                    }, 100)
                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    imitatePopup("上传文件失败", 'alert');
                    setTimeout(function () {
                        $(".fileUploadLi .inputBox").css({"display": "inline-block"});
                    }, 100)
                }
            });
        },

        // 路线调整
        adjustClassLine() {
            var that = this;
            if (that.currentClassesArr.length == 0) {
                layer.msg("请勾选待调整班次！");
                return false;
            }
            if (that.currentClassesArr.length > 8) {
                layer.msg("一次最多只能调整8个班次！");
                return false;
            }
            that.isRowOfSingle = 3;
            that.hideClassPath();
            that.adClassTotallist = [];
            that.adBesicInfosList = [];
            that.sortTemShowList = [];
            that.sortTransDataList = [];
            that.sortFromOrderIdList = [];
            that.adMarkerAcceptList = [];
            that.pageIndex = 0;
            that.pageWayFun();
        },
        // 得到调整线路数据
        pageWayFun() {
            var that = this;
            if (that.pageIndex >= that.currentClassesArr.length) {
                return false;
            }

            var driverParam = {
                orderNo: that.currentClassesArr[that.pageIndex].orderNo,
                contactTel: that.currentClassesArr[that.pageIndex].contactTel,
                eqpNo: that.currentClassesArr[that.pageIndex].eqpNo,
                startCompleteTime: that.timeHorizon1,
                endCompleteTime: that.timeHorizon1
            };
            postRequest(tmsUrl + "/wx/query/transportOrderPlanInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, driverParam, function (data) {
                that.pageIndex++;
                that.pageWayFun();
                if (data.result != null) {
                    // 班次统计信息
                    if (data.result.transportMonitorModel != null) {
                        that.adClassTotallist.push(data.result.transportMonitorModel);
                        that.adBesicInfosList.push({
                            totalQty: data.result.transportMonitorModel.totalQty,
                            totalWeight: data.result.transportMonitorModel.totalWeight,
                            totalVolume: data.result.transportMonitorModel.totalVolume
                        })
                    }

                    // 班次订单列表
                    if (data.result.orderInfoResVoList != null && data.result.orderInfoResVoList.length > 0) {
                        that.sortTemShowList.push(data.result.orderInfoResVoList);
                        that.sortTransDataList.push(data.result.orderInfoResVoList);
                        that.sortFromOrderIdList.push(data.result.orderInfoResVoList[0].fromOrderId);

                        that.drawThePath(data.result.orderInfoResVoList, that.pageIndex, true);
                        that.adMarkerAcceptList.push(data.result.orderInfoResVoList)
                    }
                }
            });

            setTimeout(function () {
                that.rowDrapAdjust();
            }, 1000)
        },
        // 拖拽调整排序
        rowDrapAdjust() {
            var that = this;
            var arr = {}, arr1 = {};
            for (let i = 0; i < that.adClassTotallist.length; i++) {
                if (that.sortTransDataList[i]) {
                    var drap = this.$refs.drap[i];
                    Sortable.create(drap, {
                        group: "words",
                        animation: 150,
                        onStart: function (evt) {  //拖拽开始发生该事件
                            var array = that.sortTransDataList[i].slice(0);
                            arr = array.splice(evt.oldIndex, 1)[0];
                            that.arr1 = arr;
                        },
                        onRemove: function (evt) { //删除拖拽节点的时候促发该事件
                            var newArray1 = that.sortTransDataList[i].slice(0);
                            newArray1.splice(evt.oldIndex, 1)[0];
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray1;

                            that.adBesicInfosList[i].totalQty = ((that.adBesicInfosList[i].totalQty * 1 - arr.totalQty * 1).toFixed(2)) * 1;
                            that.adBesicInfosList[i].totalWeight = ((that.adBesicInfosList[i].totalWeight * 1 - arr.totalWeight * 1).toFixed(2)) * 1;
                            that.adBesicInfosList[i].totalVolume = ((that.adBesicInfosList[i].totalVolume * 1 - arr.totalVolume * 1).toFixed(2)) * 1;
                        },
                        onAdd: function (evt) { //拖拽时候添加有新的节点的时候发生该事件
                            var newArray2 = that.sortTransDataList[i].slice(0);
                            var arrAdd = that.arr1;
                            arrAdd.fromOrderId = that.sortFromOrderIdList[i];
                            newArray2.splice(evt.newIndex, 0, arrAdd);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray2;

                            that.adBesicInfosList[i].totalQty = ((that.adBesicInfosList[i].totalQty * 1 + arrAdd.totalQty * 1).toFixed(2)) * 1;
                            that.adBesicInfosList[i].totalWeight = ((that.adBesicInfosList[i].totalWeight * 1 + arrAdd.totalWeight * 1).toFixed(2)) * 1;
                            that.adBesicInfosList[i].totalVolume = ((that.adBesicInfosList[i].totalVolume * 1 + arrAdd.totalVolume * 1).toFixed(2)) * 1;
                        },
                        onUpdate: function (evt) {  //拖拽更新节点位置发生该事件
                            var newArray = that.sortTransDataList[i].slice(0);
                            newArray.splice(evt.newIndex, 0, newArray.splice(evt.oldIndex, 1)[0]);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray;
                        },
                        onEnd: function (evt) {
                            that.hideClassPath();
                            for (var a = 0; a < that.sortTransDataList.length; a++) {
                                that.drawThePath(that.sortTransDataList[a], a, true);
                            }
                        }
                    });
                }
            }
        },
        // 点击订单事件
        hintLineOrder(event, num, ids) {
            var that = this;
            var el = event.target;
            $(".dragLi").removeClass("chooseDragActive");
            $(el).parents(".dragLi").addClass("chooseDragActive");

            var orderItem = that.sortTemShowList[num][ids];

            $(".mapPoints1").find(".yellow").remove();
            $(".mapPointEnd1").find(".yellow").remove();
            $.each($(".mapPoints1"), function (index, item) {
                if (item.getAttribute('omOrderId') == orderItem.omOrderId) {
                    $(".mapPoints1").eq(index).append("<p class='yellow'></p>");
                }
            });
            $.each($(".mapPointEnd1"), function (index, item) {
                if (item.getAttribute('omOrderId') == orderItem.omOrderId) {
                    $(".mapPointEnd1").eq(index).find("p").addClass("active");
                }
            });

            var info = '<div class="pointInfoDiv1">' +
                '<p><span class="pointInfoColor1">数量：</span><span class="pointInfoColor2">' + orderItem.totalQty + '</span> <span class="pointInfoColor1">件</span></p>' +
                '<p><span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + orderItem.totalWeight + '</span> <span class="pointInfoColor1">千克</span></p>' +
                '<p><span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + orderItem.totalVolume + '</span> <span class="pointInfoColor1">立方米</span></p>' +
                '<p><span class="pointInfoColor1">状态：</span><span class="pointInfoColor2">' + that.completeStatusChange(orderItem.completeStatus) + '</span></p>' +
                '<p><span class="pointInfoColor1">发货商：</span><span class="pointInfoColor2">' + orderItem.sfrPartyName + '</span></p>' +
                '<p><span class="pointInfoColor1">收货商：</span><span class="pointInfoColor2">' + orderItem.stoPartyName + '</span></p>' +
                '<p><span class="pointInfoColor1">收货地址：</span><span class="pointInfoColor2">' + orderItem.stoAddress + '</span></p>' +
                '</div>';

            that.infoWindow.setContent(info);
            $('.amap-info-contentContainer').show();
            var position = {
                N: orderItem.stoLatLng.split(",")[1],
                O: orderItem.stoLatLng.split(",")[0],
                lng: orderItem.stoLatLng.split(",")[0],
                lat: orderItem.stoLatLng.split(",")[1]
            };
            that.infoWindow.open(map, position);
        },
        // 取消路线调整
        cancelAdjustClass() {
            var that = this;
            that.isRowOfSingle = 1;
            that.hideClassPath();
            that.currentRelatedArr = [];
            $(".mapRightBoxIn2 .boxInConcent2 input[type='checkbox']").prop('checked', false);
            $(".mapRightBoxIn2 .boxInConcent .see").removeClass("active");
            that.isRowOfSingle = 4;
            that.allC2 = false;
        },
        // 保存排序
        saveOrderSortingFun() {
            var that = this;
            var newSortArray = [];
            for (let a = 0; a < that.sortTransDataList.length; a++) {
                var refInfoModelList = [];
                var temporaryDrawItem = that.sortTransDataList[a];
                for (var i = 0; i < temporaryDrawItem.length; i++) {
                    refInfoModelList.push({refId: temporaryDrawItem[i].omOrderId});
                }
                newSortArray.push({
                    fromOrderId: that.sortFromOrderIdList[a],
                    refInfoModelList: refInfoModelList
                });
            }
            postRequest(tmsUrl + '/update/tfoOrderTfoLnk.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, newSortArray, function (res) {
                layer.msg("班次路线调整成功！");
            });
        },

        // 撤销订单
        batchRevocationFun(orderItem) {
            var that = this;
            var revocationOrder = [];
            revocationOrder.push({
                fromOrderId: that.currentClassInfo.omOrderId,
                fromOrderNo: that.currentClassInfo.orderNo,
                toOrderId: orderItem.omOrderId,
                toOrderNo: orderItem.orderNo
            });
            imitatePopup("订单已装车或签收,确定撤销吗？", "confirm", (res) => {
                if (res) {
                    postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, revocationOrder, function (data) {
                        layer.msg("撤销成功！");

                        that.classResultInfo(that.currentClassNum, 1);
                        that.finishScheduleOrder[that.currentClassNum].lnkCount--;
                        that.finishScheduleOrder[that.currentClassNum].totalQty -= orderItem.totalQty;
                        that.finishScheduleOrder[that.currentClassNum].totalWeight -= orderItem.totalWeight;
                        that.finishScheduleOrder[that.currentClassNum].totalVolume -= orderItem.totalVolume;

                        // 地图上添加该撤销点
                        if (compareTime(that.timeHorizon.split(" - ")[0], that.timeHorizon.split(" - ")[1], orderItem.completeTime)
                            && (that.queryParam.customerOriginalNo == "" || that.queryParam.customerOriginalNo == orderItem.customerOriginalNo)
                            && (that.queryParam.sfrPartyName == "" || that.queryParam.sfrPartyName == orderItem.sfrPartyName)
                            && (that.queryParam.stoPartyName == "" || that.queryParam.stoPartyName == orderItem.stoPartyName)
                            && (that.queryParam.assignStatus == "" || that.queryParam.assignStatus == orderItem.assignStatus)
                            && (that.queryParam.orderNature == "" || that.queryParam.orderNature == orderItem.orderNature)
                            && (that.queryParam.origin == "" || that.queryParam.origin == orderItem.origin)
                            && (that.queryParam.sfrPartyNos == "" || that.queryParam.sfrPartyNos == orderItem.sfrPartyNos)) {
                            that.waitScheduleOrder.push(orderItem);
                            that.markerArrayFun(that.waitScheduleOrder);
                        }
                    })
                }
            })
        },
        // 订单派发
        distributeOrder() {
            var that = this;
            if (that.orderResultInfoList.length == 0) {
                return false;
            }
            var searchFormArr = [{
                state: 1,
                refId: that.currentClassInfo.omOrderId,
                refNo: that.currentClassInfo.orderNo
            }];
            postRequest(tmsUrl + "/save/tfoOrderAuditStatus.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                alert('订单派发成功！');
            })
        },
        // 点击“修改司机”
        changeDriverInf() {
            var that = this;
            $(".maskLayer4").show();

            that.newCarrierResPartyInfo = {
                contact: {
                    contactName: that.carrierResPartyInfo.contact.contactName,
                    contactTel: that.carrierResPartyInfo.contact.contactTel
                },
                eqp: {
                    eqpNo: that.carrierResPartyInfo.eqp.eqpNo,
                    eqpName: that.carrierResPartyInfo.eqp.eqpName,
                    eqpBrand: that.carrierResPartyInfo.eqp.eqpBrand,
                    eqpType: that.carrierResPartyInfo.eqp.eqpType,
                    eqpNature: that.carrierResPartyInfo.eqp.eqpNature,
                    eqpSpec: that.carrierResPartyInfo.eqp.eqpSpec,
                    eqpLength: that.carrierResPartyInfo.eqp.eqpLength,
                    eqpWidth: that.carrierResPartyInfo.eqp.eqpWidth,
                    eqpHeight: that.carrierResPartyInfo.eqp.eqpHeight,
                    eqpStr1: that.carrierResPartyInfo.eqp.eqpStr1,
                    eqpStr2: that.carrierResPartyInfo.eqp.eqpStr2
                },
                party: {
                    partyName: that.carrierResPartyInfo.party.partyName,
                    partyCode: that.carrierResPartyInfo.party.partyCode,
                    isBuyer: false,
                    isVendor: false,
                    isTruck: false,
                    isWarehouse: false,
                    is3pl: false
                },
                imgContact: that.carrierResPartyInfo.imgContact
            };
        },
        // 修改司机选中司机
        chooseDriver1(item) {
            var that = this;
            that.driverList = [];
            that.newCarrierResPartyInfo.contact.contactName = item.contactName;
            that.newCarrierResPartyInfo.contact.contactTel = item.contactTel;

            that.newCarrierResPartyInfo.eqp.eqpNo = item.eqpNo;
            that.newCarrierResPartyInfo.eqp.eqpName = item.eqpName;
            that.newCarrierResPartyInfo.eqp.eqpBrand = item.eqpBrand;
            that.newCarrierResPartyInfo.eqp.eqpType = item.eqpType;
            that.newCarrierResPartyInfo.eqp.eqpNature = item.eqpNature;
            that.newCarrierResPartyInfo.eqp.eqpSpec = item.eqpSpec;
            that.newCarrierResPartyInfo.eqp.eqpLength = item.eqpLength;
            that.newCarrierResPartyInfo.eqp.eqpWidth = item.eqpWidth;
            that.newCarrierResPartyInfo.eqp.eqpHeight = item.eqpHeight;
            that.newCarrierResPartyInfo.eqp.eqpStr1 = item.eqpStr1;
            that.newCarrierResPartyInfo.eqp.eqpStr2 = item.eqpStr2;
        },
        // 保存修改司机信息
        saveAdjustCarInfo() {
            var that = this;
            if (that.newCarrierResPartyInfo.contact.contactName.trim() == "" || that.newCarrierResPartyInfo.contact.contactTel.trim() == "" || that.newCarrierResPartyInfo.eqp.eqpNo.trim() == "" || that.newCarrierResPartyInfo.eqp.eqpName == "") {
                layer.msg("请填写完整信息再保存！");
                return false;
            }
            var newDriverInfo = {
                carrierPartyInfo: {
                    contact: that.newCarrierResPartyInfo.contact,
                    eqp: that.newCarrierResPartyInfo.eqp,
                    imgContact: that.newCarrierResPartyInfo.imgContact,
                    party: that.newCarrierResPartyInfo.party
                },
                order: that.resTfoOrder
            };
            postRequest(tmsUrl + "/save/tfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, newDriverInfo, function (data) {
                layer.msg("修改成功！");
                that.closeMaskLayer();

                that.finishScheduleOrder[that.currentClassNum].carDrvContactName = that.newCarrierResPartyInfo.contact.contactName;
                that.finishScheduleOrder[that.currentClassNum].carDrvEqpNo = that.newCarrierResPartyInfo.eqp.eqpNo;
                that.classResultInfo(that.currentClassNum);
            })
        },
        // 点击“调整顺序”
        openAdjustOrderEq() {
            var that = this;
            that.adjust0 = true;
            var fool = this.$refs.foolish0;
            that.sortAble = Sortable.create(fool, {
                animation: 150,
                onEnd: function (evt) {
                    that.orderResultOmOrderId.splice(evt.newIndex, 0, that.orderResultOmOrderId.splice(evt.oldIndex, 1)[0]);
                }
            })
        },
        //保存调整后排序
        saveNewSorting(num) {
            var that = this;
            if(num == '0'){
                that.sortAble.destroy(); //that.sortAble.option('disabled', true) //禁止拖拽
                that.reload();
                that.adjust0 = false;
                return false;
            }
            that.orderResultInfoList = [];
            var orderId = that.currentClassInfo.omOrderId;
            var newSortParams = [];
            for (var i = 0; i < that.orderResultOmOrderId.length; i++) {
                newSortParams.push({
                    fromOrderId: orderId,
                    seq: i + 1,
                    toOrderId: that.orderResultOmOrderId[i]
                })
            }
            postRequest(tmsUrl + "/update/tfoOrderLnkSeq.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, newSortParams, function (data) {
                layer.msg("顺序调整成功！");
                that.adjust0 = false;
                that.sortAble.destroy();
                that.classResultInfo(that.currentClassNum);
            })
        },
        //实现局部刷新
        reload(){
            var that = this;
            that.alive= false;
            this.$nextTick(() => {
                that.alive = true;
            })
        },

        // 查看路径
        showClassPath() {
            var that = this;
            if (that.currentClassNum == null) {
                layer.msg("请先单击右侧班次列表选择待排班次！");
                return false;
            }
            if(that.isRowOfSingle == 3){
                layer.msg("请先保存路线调整！");
                return false;
            }
            that.hideClassPath();
            that.isShowLinePath = true;
            that.lineStoLatLngList = [];
            that.routeLineList = [];
            that.lineMarkerList = [];
            that.drawThePath(that.orderResultInfoList, '0');
        },
        drawThePath(item, index, adjust) {
            var that = this;
            var startPoint = [];
            var endPoint = [];
            var opts = {waypoints: []};

            if (item.length != 0) { // 起点、终点、途径点、
                var startLat = item[0].sfrLatLng, endLat = item[item.length - 1].stoLatLng;
                if (startLat == null || startLat == '' || startLat == undefined) {
                    startLat = "121.48789949,31.24916171";
                }
                if (endLat == null || endLat == '' || endLat == undefined) {
                    endLat = "121.48789949,31.24916171";
                }
                startPoint.push(startLat.split(',')[0], startLat.split(',')[1]);
                endPoint.push(endLat.split(',')[0], endLat.split(',')[1]);

                if (item.length > 1) {
                    for (var i = 0; i < item.length - 1; i++) {
                        if (item[i].stoLatLng == null || item[i].stoLatLng == undefined || item[i].stoLatLng == "") {
                            item[i].stoLatLng = "121.48789949,31.24916171";
                        }
                        var point = item[i].stoLatLng.split(',');
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
                    if (!adjust) {
                        that.isShowLinePath = true;
                    }
                });
            })
        },
        // 路线标记点
        lineMarkerArrayFun(markerInfoArray, color) {
            var that = this;
            var marker;
            if (markerInfoArray[0].sfrLatLng) {
                var latLng = markerInfoArray[0].sfrLatLng.split(',');
                marker = new AMap.Marker({
                    map: map,
                    position: latLng,
                    offset: new AMap.Pixel(0, 0)
                });
                var newDiv1 = '<div class="mapPointStart1"><p>起</p></div>';
                marker.setContent(newDiv1);
                marker.on('click', function (e) {
                    $('.amap-info-contentContainer').show();
                    that.infoWindow.setContent('<div class="pointInfoDiv1"><p><span class="pointInfoColor1">起点：</span><span class="pointInfoColor2">' + markerInfoArray[0].sfrAddress + '</span></p></div>');
                    that.infoWindow.open(map, e.target.getPosition());
                });
                that.lineMarkerList.push(marker);
            }

            for (var n = 0; n < markerInfoArray.length; n++) {
                var item = markerInfoArray[n], latLng2 = [];

                var mapNumP = document.createElement("p");
                var mapNumDiv = document.createElement("div");
                mapNumDiv.className = 'mapEqDiv';
                mapNumDiv.innerHTML = n + 1;
                mapNumDiv.style.background = color;
                mapNumP.style.background = color;

                if (item.stoLatLng) {
                    var newDiv = document.createElement("div");
                    newDiv.className = 'mapPoints1';
                    if (n < markerInfoArray.length - 1) {
                        newDiv.className = 'mapPoints1';
                        mapNumP.innerHTML = "经";
                    } else if (n == markerInfoArray.length - 1) {
                        newDiv.className = 'mapPointEnd1';
                        mapNumP.innerHTML = "终";
                    }
                    newDiv.append(mapNumP);
                    newDiv.append(mapNumDiv);
                    newDiv.setAttribute("stoLatLngStr", item.stoLatLng);
                    newDiv.setAttribute("omOrderId", item.omOrderId);
                    latLng2 = item.stoLatLng.split(',');
                }

                that.lineStoLatLngList.push(item.stoLatLng);
                marker = new AMap.Marker({
                    map: map,
                    position: latLng2,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);  //更新点标记内容
                that.lineMarkerList.push(marker);

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
            that.routeLineList.push(routeLine);
        },
        // 关闭路径
        hideClassPath() {
            var that = this;
            that.isShowLinePath = false;
            $('.amap-info-contentContainer').hide();
            if (that.lineMarkerList.length > 0) { //清除路线标记点
                for (var i = 0; i < that.lineMarkerList.length; i++) {
                    map.remove(that.lineMarkerList[i]);
                }
            }
            if (that.routeLineList.length > 0) { //清除路线
                for (var j = 0; j < that.routeLineList.length; j++) {
                    map.remove(that.routeLineList[j]);
                }
            }

        },


        // 框选订单
        drawRectangle() {
            var that = this;
            $('.amap-info-contentContainer').hide();
            that.hideClassPath();
            if (that.currentClassNum == null) {
                layer.msg("请先单击右侧班次列表选择待排班次！");
                return false;
            }
            that.pathArray = [];
            that.isDrawing = true;
            that.mouseTool = new AMap.MouseTool(map);
            that.mouseTool.on('draw', function (e) {
            });
            that.mouseTool.rectangle({
                strokeWeight: 2,
                fillOpacity: 0.26,
                strokeStyle: 'dashed',
                fillColor: '#00D500',
                strokeColor: '#00D500'
            });

            AMap.event.addListener(that.mouseTool, 'draw', function (e) {
                var pathList = e.obj.ue.path;
                $.each(pathList, function (index, item) {
                    var param1 = [item.lng, item.lat];
                    that.pathArray.push(param1);
                });

                if (that.pathArray.length > 0) {
                    var polygon = new AMap.Polygon({
                        map: map,
                        path: that.pathArray,
                        strokeWeight: 2,
                        fillOpacity: 0.26,
                        strokeStyle: 'dashed',
                        fillColor: '#00D500',
                        strokeColor: '#00D500'
                    });
                    that.toolPolygonLists.push(polygon);
                    $.each(that.markerArray, function (index, item) {
                        var markerInPolygon = polygon.contains(item.getPosition());  // 点是否在几何图形内，true / false
                        if (markerInPolygon == true) {
                            var id = item.ue.content.attributes.omOrderId.value;
                            $.each($(".orderMapPoint1"), function (index0, item0) {
                                if (item0.getAttribute('omOrderId') == id) {
                                    $(".orderMapPoint1").eq(index0).addClass("orderMapPoint11");
                                }
                            });

                            var bool = true;
                            $.each(that.markerIdInfoResArrayAll, function (index2, item2) {
                                if (item2 == id) {
                                    bool = false;
                                }
                            });
                            if (bool) {
                                $.each(that.waitScheduleOrder, function (index0, item0) {
                                    if (item0.omOrderId == id) {
                                        that.markerInfoResArray.push(item0);
                                        that.markerIdInfoResArray.push(item0.omOrderId);
                                    }
                                })
                            }
                        }
                    });

                    that.mouseTool.close(true);
                    that.mouseTool = {};
                    that.drawRectangle();
                }
            });
        },
        // 点击“取消”框选
        drawCloseFun(txt) {
            var that = this;
            if (txt) {
                $.each(that.markerIdInfoResArray, function (index, item) {
                    $.each($(".orderMapPoint1"), function (index0, item0) {
                        if (item0.getAttribute('omOrderId') == item) {
                            $(".orderMapPoint1").eq(index0).removeClass("orderMapPoint11");
                        }
                    })
                })
            }
            if (that.isDrawing) {
                that.mouseTool.close(true);
                that.mouseTool = {};
            }
            that.isDrawing = false;
            that.markerInfoResArray = [];
            that.markerIdInfoResArray = [];
            $.each(that.toolPolygonLists, function (index, item) {
                map.remove(item);
            });
            that.toolPolygonLists = [];
        },
        // 点击“确定”框选
        drawSureFun() {
            var that = this;
            that.isRowOfSingle = 2;

            // 框选订单数组
            $.each(that.markerInfoResArray, function (index, item) {
                that.markerInfoResArrayAll.push(item);
            });
            $.each(that.markerIdInfoResArray, function (index, item) {
                that.markerIdInfoResArrayAll.push(item);
            });

            that.resCalculation();
            that.drawCloseFun();
        },
        // 件毛体计算
        resCalculation() {
            var that = this;
            var temStolatlngList = [];
            var messageTotal = {
                int2: 0,
                totalQtyAll: 0,
                totalWeightAll: 0,
                totalVolumeAll: 0
            };

            // 不重复坐标点数组
            $.each($(".orderMapPoint11"), function (index, item) {
                var stolatlngstr = item.getAttribute('stolatlngstr'), bool = true;
                $.each(temStolatlngList, function (index1, item1) {
                    if (item1 == stolatlngstr) {
                        bool = false;
                        return false;
                    }
                });
                if (bool) {
                    temStolatlngList.push(item.getAttribute('stolatlngstr'));
                }
            });
            // 件毛体叠加
            $.each(that.markerInfoResArrayAll, function (index, item) {
                if (item.totalQty != null) {
                    messageTotal.totalQtyAll = accAdd(messageTotal.totalQtyAll, item.totalQty);
                }
                if (item.totalWeight != null) {
                    messageTotal.totalWeightAll = accAdd(messageTotal.totalWeightAll, item.totalWeight);
                }
                if (item.totalVolume != null) {
                    messageTotal.totalVolumeAll = accAdd(messageTotal.totalVolumeAll, item.totalVolume);
                }
            });

            that.reportMessagesRes.int2All = accAdd(that.temMessagesRes.int2, temStolatlngList.length);
            that.reportMessagesRes.totalNumQtyAll = accAdd(that.temMessagesRes.totalNumQty, messageTotal.totalQtyAll);
            that.reportMessagesRes.totalNumWeightAll = accAdd(that.temMessagesRes.totalNumWeight, messageTotal.totalWeightAll);
            that.reportMessagesRes.totalNumVolumeAll = accAdd(that.temMessagesRes.totalNumVolume, messageTotal.totalVolumeAll);
        },
        // 滑过框选订单
        showOrderNumInf(orderItem) {
            var that = this;
            var tem = 0;
            $.each($(".orderMapPoint11"), function (index, item) {
                if (item.getAttribute('omOrderId') == orderItem.omOrderId) {
                    $(".orderMapPoint11").eq(index).addClass("active");
                }
            });
            $.each(that.waitScheduleOrder, function (index, item) {
                if (item.omOrderId == orderItem.omOrderId) {
                    tem = (index + 1) * 1;
                }
            });

            var info = '<div class="pointInfoDiv1">' +
                '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + tem + '</span></p>' +
                '<p><span class="pointInfoColor1">单号：</span><span class="pointInfoColor2">' + orderItem.trackingNo + '</span></p>' +
                '<p><span class="pointInfoColor1">数量：</span><span class="pointInfoColor2">' + orderItem.totalQty + '</span> <span class="pointInfoColor1">件</span></p>' +
                '<p><span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + orderItem.totalWeight + '</span> <span class="pointInfoColor1">千克</span></p>' +
                '<p><span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + orderItem.totalVolume + '</span> <span class="pointInfoColor1">立方米</span></p>' +
                '<p><span class="pointInfoColor1">状态：</span><span class="pointInfoColor2">' + that.completeStatusChange(orderItem.completeStatus) + '</span></p>' +
                '<p><span class="pointInfoColor1">发货商：</span><span class="pointInfoColor2">' + orderItem.sfrPartyName + '</span></p>' +
                '<p><span class="pointInfoColor1">收货商：</span><span class="pointInfoColor2">' + orderItem.stoPartyName + '</span></p>' +
                '<p><span class="pointInfoColor1">收货地址：</span><span class="pointInfoColor2">' + orderItem.stoAddress + '</span></p>' +
                '</div>';

            that.infoWindow.setContent(info);
            $('.amap-info-contentContainer').show();
            var position = {
                N: orderItem.stoLatLng.split(",")[1],
                O: orderItem.stoLatLng.split(",")[0],
                lng: orderItem.stoLatLng.split(",")[0],
                lat: orderItem.stoLatLng.split(",")[1]
            };
            that.infoWindow.open(map, position);
        },
        // 移出框选订单
        hideStoPartyAbbrInf(orderItem) {
            var that = this;
            $(".orderMapPoint11").removeClass("active");
            $('.amap-info-contentContainer').hide();
        },
        // 切换班次
        cutCurrentClass() {
            var that = this;
            that.isRowOfSingle = 1;
            that.isProcessSingle = true;
            $(".reportMessagesMap .boxInConcent li .boxCRight").addClass("active");
        },

        // 撤销选中订单
        cancelLiFun(item, index) {
            var that = this;
            $.each($(".orderMapPoint11"), function (index0, item0) {
                if (item0.getAttribute('omOrderId') == item.omOrderId) {
                    $(".orderMapPoint11").eq(index0).removeClass("orderMapPoint11");
                }
            });
            that.markerInfoResArrayAll.splice(index, 1);
            that.markerIdInfoResArrayAll.splice(index, 1);
            that.resCalculation();
            $('.amap-info-contentContainer').hide();
        },
        // 取消排单
        cancelDistributionFun(txt) {
            var that = this;
            if (txt) {
                layer.closeAll('dialog');
                that.isRowOfSingle = 1;
                that.isProcessSingle = false;
                $(".boxCRight").removeClass("active");
                $(".orderMapPoint1").removeClass("active");
                $(".orderMapPoint1").removeClass("orderMapPoint11");
                that.markerIdInfoResArrayAll = [];
                that.markerInfoResArrayAll = [];
                that.drawCloseFun();
            } else {
                layer.confirm("确定放弃当前排单？", {btn: ['确定', '取消'], title: "提示"}, function () {
                    layer.closeAll('dialog');
                    that.isRowOfSingle = 1;
                    that.isProcessSingle = false;
                    $(".boxCRight").removeClass("active");
                    $(".orderMapPoint1").removeClass("active");
                    $(".orderMapPoint1").removeClass("orderMapPoint11");
                    that.markerIdInfoResArrayAll = [];
                    that.markerInfoResArrayAll = [];
                    that.drawCloseFun();
                });
            }
        },
        // 确认排单
        orderDistributionFun() {
            var that = this;
            if (that.markerIdInfoResArrayAll.length == 0) {
                return false;
            }
            var allotOrderArr = [];
            for (var i = 0; i < that.markerInfoResArrayAll.length; i++) {
                allotOrderArr.push({
                    fromOrderId: that.currentClassInfo.omOrderId,
                    fromOrderNo: that.currentClassInfo.orderNo,
                    toOrderId: that.markerInfoResArrayAll[i].omOrderId,
                    toOrderNo: that.markerInfoResArrayAll[i].orderNo
                })
            }
            postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, allotOrderArr, function (data) {
                layer.alert("订单排单完成！");
                that.getClassesList(1);
                that.getSearchOrderList();
                that.cancelDistributionFun(1);
            });
        },
        // 继续排单
        continueDistributionFun() {
            var that = this;
            that.isRowOfSingle = 2;
            that.isProcessSingle = false;
            $(".boxCRight").removeClass("active");
            that.resCalculation();
        },


        // 获取路线排单列表
        showPathPopup(){
            var that = this;
            that.hideClassPath();
            that.currentRelatedArr = [];
            that.isShowScheduleBox = false;
            $(".mapRightBoxIn2 .boxInConcent2 input[type='checkbox']").prop('checked', false);
            $(".mapRightBoxIn2 .boxInConcent .see").removeClass("active");
            that.isRowOfSingle = 4;
            that.allC2 = false;
            var searchFormArr2 = {
                startDistCreateTime: that.timeHorizon.split(" - ")[0],
                endDistCreateTime: that.timeHorizon.split(" - ")[1],
                pageInfo:{
                    pageNum: 1,
                    pageSize: 2000
                }
            };
            //获取路线列表  /query/selectTloOrderInfoList
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                that.pathScheduleOrder = data.result;
            })
        },
        // 点击路线列表
        setCurrLineShow(item, index){
            var that = this;
            that.hideClassPath();
            $(".boxInConcent li.lineSee").removeClass("active");
            $(".boxInConcent li.lineSee").eq(index).addClass("active");
            that.reportMessagesOrderList = [];
            that.stationLocationList = [{}];

            var params = {
                refId: item.omOrderId,
                refNo: item.orderNo
            };

            postRequest(tmsUrl + "/query/tloOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.result.receiptPartyInfoList != null ){      //客户
                    that.reportMessagesOrderList = data.result.receiptPartyInfoList;
                }

                if(data.result.stationLocationInfoList != null){     // 停靠站点
                    that.stationLocationList = data.result.stationLocationInfoList;
                    that.drawThePath1(that.stationLocationList, '0');
                }
            })
        },
        // 显示路线
        drawThePath1(item, index){
            var that = this;
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
                    that.lineMarkerArrayFun1(item, that.lineColorList[index]); // 点
                    that.lineDrawRoute(result.routes[0], that.lineColorList[index]); // 线
                });
            })
        },
        // 路线标记点
        lineMarkerArrayFun1(markerInfoArray, color) {
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
                that.lineMarkerList.push(marker);

                marker.on('click', function (e) {
                    that.openSignalOrderInfo1(e, markerInfoArray);
                });
            }
        },
        // 点击订单标记点--停靠站点
        openSignalOrderInfo1(e, currentPointList){
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
        // 路线筛选
        getSearchPathList(){
            var that = this;
            var searchFormArr = that.pathQueryParams;
            searchFormArr.startDistCreateTime = that.timeHorizon1.split(" - ")[0];
            searchFormArr.endDistCreateTime = that.timeHorizon1.split(" - ")[1];
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 2000
            };
            //获取路线列表  /query/selectTloOrderInfoList
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.pathScheduleOrder = data.result;
            })
        },
        // 关闭路线列表
        cancelAreaListFun() {
            var that = this;
            that.isRowOfSingle = 1;
            that.hideClassPath();
        },
        // 查看路线点
        lookPointOrder(){
            var that = this;
            if(that.currentRelatedArr.length == 0){
                layer.msg("请先选择路线");
            }else{
                var tloOrderIds = '';
                for(var a=0;a<that.currentRelatedArr.length;a++){
                    if(a<that.currentRelatedArr.length-1){
                        tloOrderIds += that.currentRelatedArr[a]+','
                    }else{
                        tloOrderIds += that.currentRelatedArr[a]
                    }
                }
                var searchFormArr = that.queryParam;
                searchFormArr.tloOrderIds = tloOrderIds;
                searchFormArr.isAsign = false;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:100000
                };

                searchFormArr.startCompleteTime = that.timeHorizon.split(" - ")[0];
                searchFormArr.endCompleteTime = that.timeHorizon.split(" - ")[1];
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    if(data.result != null && data.result.length > 0){
                        var result = data.result;
                        that.markerArrayFun(result);
                    }
                })
            }
        },

        // 确定路线排单
        allotOrder(){
            var that = this;
            if(that.currentClassInfo == "" || that.currentClassInfo == null || that.currentClassInfo == undefined){
                imitatePopup("请先单击选择班次！",'alert');
                return false;
            }
            if(that.currentRelatedArr.length == 0){
                imitatePopup("至少选择一条路线！",'alert');
                return false;
            }
            var omOrderId = that.currentClassInfo.omOrderId;
            var searchFormArr = {
                assignStatus:"0",
                tloOrderIdList: that.currentRelatedArr,
                selectFromOrderId: omOrderId
            };
            postRequest(tmsUrl + "/save/newTfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    that.isRowOfSingle = 1;
                    that.hideClassPath();
                    that.allC2 = false;
                    that.getClassesList(2,omOrderId);
                    that.getSearchOrderList();
                }
            })
        },
        // 创建班次并排单
        openCreatedClassesAllotOrder(){
            var that = this;
            if (that.currentRelatedArr.length == 0) {
                layer.msg("请先选择路线！");
                return false;
            }
            $(".maskLayer1").show();
        },
        createdClassesAllotOrder() {
            var that = this;
            var tzoOrderIdStr = "";
            for (var i = 0; i < that.currentRelatedArr.length; i++) {
                if (i < that.currentRelatedArr.length - 1) {
                    tzoOrderIdStr += that.currentRelatedArr[i].omOrderId + ',';
                } else {
                    tzoOrderIdStr += that.currentRelatedArr[i].omOrderId;
                }
            }
            var searchFormArr = {
                tzoOrderIds: tzoOrderIdStr,
                startCompleteTime: that.timeHorizon.split(" - ")[0],
                endCompleteTime: that.timeHorizon.split(" - ")[1],
                assignStatus: '0',
                dtmTime: that.deliveryDate3
            };
            postRequest(tmsUrl + "/save/tjoTzoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                layer.msg("创建班次并排单成功！");
                $(".maskLayer1").hide();
                that.allC2 = false;
                that.getClassesList();
                that.getSearchOrderList();
            })
        },
        // 勾选路线
        textboxSelectionFun1(event,orderItem){ //单选
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.currentRelatedArr.push(orderItem.omOrderId);
            }else{
                that.currentRelatedArr.splice($.inArray(orderItem.omOrderId,that.currentRelatedArr),1);
            }
            if(that.currentRelatedArr.length == that.pathScheduleOrder.length){  // 单选个数 = 该页条数，全选选中
                that.allC2 = true;
            }else{
                that.allC2 = false;
            }

            console.log(that.currentRelatedArr)
        },
        textboxAllSelectionFun1(){ //全选
            var that = this;
            that.currentRelatedArr = [];
            $(".mapRightBoxIn2 .boxInConcent2 input[type='checkbox']").prop('checked', !that.allC2);

            if(!that.allC2){
                for(var i = 0; i < that.pathScheduleOrder.length; i++){
                    that.currentRelatedArr.push(that.pathScheduleOrder[i].omOrderId);
                }
            }else{
                that.currentRelatedArr = [];
            }
        },

        // 切换行政区、大件筛选、重叠点显示
        moveCutMapCard(){
            var that = this;
            that.showCutMapCard = !that.showCutMapCard;
        },

        // 大件筛选
        selectSpecialFun(totalNums,totalNumsUnit){
            var that = this;
            $(".orderMapPoint1.orderMapPoint13").removeClass("orderMapPoint13");
            if(!totalNums || !totalNumsUnit){
                return false;
            }
            for (var i = 0; i < that.waitScheduleOrder.length; i++) {
                if(totalNumsUnit == "1" && that.waitScheduleOrder[i].totalQty >= totalNums){
                    that.selectttt(that.waitScheduleOrder[i].omOrderId);
                }
                if(totalNumsUnit == "2" && that.waitScheduleOrder[i].totalWeight >= totalNums){
                    that.selectttt(that.waitScheduleOrder[i].omOrderId);
                }
                if(totalNumsUnit == "3" && that.waitScheduleOrder[i].totalVolume >= totalNums){
                    that.selectttt(that.waitScheduleOrder[i].omOrderId);
                }
            }
        },
        selectttt(id){
            var that = this;
            $.each($(".orderMapPoint1"), function (index, item) {
                if (item.getAttribute('omOrderId') == id) {
                    $(".orderMapPoint1").eq(index).addClass("orderMapPoint13");
                }
            });
        },
        //重合地址运单显示
        showRepeatVal(bool){
            var that = this;
            if(bool){
                that.getSearchOrderList(1);
            }else{
                that.getSearchOrderList();
            }
            that.coincident = !that.coincident;
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

        // 省市区选择
        selectLocLevelFun(level, paramObj, code, name) { // 选中国省市区触发事件，入参：地址级别，对象，当前 国、省、市、区 编码 [ 便于扩展实时改变 详细地址address ]
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
                case 'districtCode':
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


        completeStatusChange(info) {
            var that = this;
            that.selectListData = getBasicData();
            for(var i = 0; i < that.selectListData.completeStatusList.length; i++) {
                if (info == that.selectListData.completeStatusList[i].code) {
                    return that.selectListData.completeStatusList[i].text;
                } else {
                    return '- -'
                }
            }
        },
        // 关闭maskLayer
        closeMaskLayer() {
            $(".maskLayer").hide();
        }
    },
    created: function () {
        var that = this;
        this.dpDistrictList = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        //司机列表
        postRequest(cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, {refType: "CONTACT"}, function (data) {
            that.initDriverList = data.result;
        });
    },
    mounted: function () {
        var that = this;
        this.timeHorizon = getQueryTime(7) + " - " + getQueryTime(0);
        that.timeHorizon1 = getQueryTime(0);
        that.getClassesList();
    },
    filters: {
        timestampToTime2(timestamp) {
            if (timestamp == null) {
                return '--';
            } else {
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                var currentTime = timestamp - offsetMs;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
                return Y + M + D;
            }
        },
        changeField(txt) {
            if (txt == null || txt == undefined || txt == "") {
                return "--";
            } else {
                return txt;
            }
        },
        // 设备类型扎转换
        changeEqpType(code) {
            var that = this;
            if (code) {
                that.selectListData = getBasicData();
                for (var i = 0; i < that.selectListData.eqpTypeList.length; i++) {
                    if (that.selectListData.eqpTypeList[i].code == code) {
                        return that.selectListData.eqpTypeList[i].text;
                        break;
                    }
                }
            } else {
                return "--"
            }
        },
    }
});

//绘制矢量图形
var map = new AMap.Map("container", {
    zoom: 9,
    resizeEnable: true,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});

//解决sortable.js拖拽打开新页面
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
};

// 日期控件
$(document).ready(function () {
    $('#timeRange').daterangepicker(null, function (start, end) {
        app.timeHorizon = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker({singleDatePicker: true}, function (start) {
        app.timeHorizon1 = start.format('YYYY-MM-DD');
    });
    $('#timeRange2').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.deliveryDate = start.format('YYYY-MM-DD HH:mm');
    });
    $('#timeRange3').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.deliveryDate3 = start.format('YYYY-MM-DD HH:mm');
    });


    $(document).click(function(){
        $(".searchBtn .likeOption .hang").hide();
    });
    $(document).on("click",".searchBtn .likeOption > input",function(e){
        e.stopPropagation();
    })
    $(document).on("click",".searchBtn .likeOption .hang",function(e){
        e.stopPropagation();
    })
});

// 引入layui
var layer;
layui.use(['layer'], function () {
    layer = layui.layer;
});
