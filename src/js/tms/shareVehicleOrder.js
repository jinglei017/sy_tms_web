var app = new Vue({
    el: '#overall',
    data: {
        currentPage: 1,
        queryPageSize: 20,
        multipleNum: 12,
        selectListData: {},
        pageList: [],
        totalPagesNum: "",
        tableOrderList: {},
        queryParam: {},
        allChecked: false,
        checkedNum: 0,
        clearShow: true,
        checkedOperaOrder: [],
        templateTitle: "",
        clickBtnType: "",
        isDisable: false,
        shortShowType: "0",
        OrderCarrier: {
            cdPartyId: ""
        },
        OrderCarrier1: {
            partyName: "",
            partyCode: "",
            isBuyer: "",
            isVendor: "",
            isTruck: "",
            isWarehouse: "",
            is3pl: ""
        },
        OrderCarrierContact: {
            contactName: "",
            contactTel: "",
            contactEmail: "",
            contactAddress: ""
        },
        OrderCarrierEqp: {
            eqpType: "",
            eqpNature: ""
        },
        shareInfo: {
            dtmTime: "",
            dtmTime1: "",
            startAddress: "",
            endAddress: ""
        },
        shareInfoList: [],
        resPartyList: [],
        getDriverListTimer: null,
        driverList: [],
        showDriverList: false,
        showDriverList1: false,
        showPlateList: false,
        showPlateList1: false,
        OrderCarrierDriver: {
            contactName: ""
        },
        eqpInfoList: [{}],
        orderDetails: {},
        order: {},
        newCarrierDriver: {
            eqpType: "",
            eqpNature: ""
        },
        newCarrierEqp: {},
        newCarrierRemark: '',
        sfoDtmInfoList:[],
        checkDtmInfoList:[],
        checkOrder:{},
        timeHorizon:"", //创建时间范围
        linkNames: ["共享车辆","共享订单","共享业务看板"],
        linkHrefs: []
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
    methods: {
        showItemDetails() {
            var that = this;
            that.shortShowType = '1';
        },
        hideItemDetails() {
            var that = this;
            that.shortShowType = '0';
        },
        changePage(pageNum, clickStatus) {
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage > pageNum) {
                    $(".paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage = pageNum;
                } else {
                    $(".paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage = pageNum;
                }
            } else {
                this.currentPage = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = this.queryParam;
            searchFormArr.orderType = "SFO";
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            }
            $(".reportMessages table tr .checkInp").attr("checked", false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            that.allChecked = false;
            that.multipleNum = that.queryPageSize;
            //获取订单列表
            postRequest(tmsUrl + "/busShared/selectSfoOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                orderNo: "",
                carDrvContactName: "",
                carDrvContactTel: "",
                carDrvEqpNo: "",
                isDistribute: "",
                activeStatus:"1",
                completeStatus: "",
                auditStatus: "",
                crcdStartTimeSpan: "",
                crcdEndTimeSpan: ""
            };
        },
        getSearchVal() {
            //订单搜索
            var that = this;
            that.tableOrderList = {};
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 && splitCountNum < 2000) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                if (searchFormArr.completeStatus == "") {
                    delete searchFormArr.completeStatus;
                }
                if (searchFormArr.auditStatus == "") {
                    delete searchFormArr.auditStatus;
                }
                if (searchFormArr.isDistribute == "") {
                    delete searchFormArr.isDistribute;
                }

                searchFormArr.orderType = "SFO";
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                searchFormArr.startCreateTime = startTimeVal;
                searchFormArr.endCreateTime = endTimeVal;
                searchFormArr.pageInfo = {
                    pageNum: 1,
                    pageSize: that.queryPageSize
                }
                $(".reportMessages table tr .checkInp").attr("checked", false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/busShared/selectSfoOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    if (that.queryParam.completeStatus == undefined) {
                        that.queryParam.completeStatus = "";
                    }
                    if (that.queryParam.auditStatus == undefined) {
                        that.queryParam.auditStatus = "";
                    }
                    if (that.queryParam.isDistribute == undefined) {
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.currentPage = 1;
                    that.totalPagesNum = res.pageInfo.total;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    }, 300);
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            } else {
                imitatePopup("请输入大于1且小于2000的正整数", 'alert');
                return false;
            }
        },
        addOrderDetails(title) {
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.OrderCarrier = {
                cdPartyId: ""
            };
            that.OrderCarrierContact = {
                contactName: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: ""
            };
            that.shortShowType = '0';
            that.OrderCarrier1 = {
                partyName: "",
                partyCode: "",
                isBuyer: "",
                isVendor: "",
                isTruck: "",
                isWarehouse: "",
                is3pl: ""
            };
            that.OrderCarrierEqp = {
                eqpType: "",
                eqpNature: ""
            };
            that.showDriverList = false;
            that.showPlateList = false;
            that.OrderCarrierDriver = {};
            that.shareInfo = {};
            that.shareInfoList = [];
            var searchFormArr = {
                refType: "PARTYLNK",
                isDefault: 1
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                if (data.result != null) {
                    if (data.result.length > 0) {
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
                    } else {
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
                            isBuyer: "",
                            isVendor: "",
                            isTruck: "",
                            isWarehouse: "",
                            is3pl: ""
                        };
                    }
                } else {
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
                        isBuyer: "",
                        isVendor: "",
                        isTruck: "",
                        isWarehouse: "",
                        is3pl: ""
                    };
                };
            })
        },
        chooseDriver(driveritem) { // 新建班次--选择联想的司机姓名
            console.log(driveritem);
            this.OrderCarrierDriver.contactName = driveritem.contactName;
            $("#carrierDriverName").val(driveritem.contactName);
            this.OrderCarrierDriver.contactName = $("#carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = driveritem.contactTel;
            this.OrderCarrierEqp.eqpNo = driveritem.eqpNo;
            $("#carrierEqpNo").val(driveritem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $("#carrierEqpNo").val();
            this.OrderCarrierEqp.eqpName = driveritem.eqpName;
            this.OrderCarrierEqp.eqpBrand = driveritem.eqpBrand;
            this.OrderCarrierEqp.eqpType = driveritem.eqpType;
            if (driveritem.eqpNature == null) {
                driveritem.eqpNature = "";
            }
            this.OrderCarrierEqp.eqpNature = driveritem.eqpNature;
            this.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.showDriverList = false;
        },
        chooseDriver1(driveritem) { // 修改司机信息--选择联想的司机姓名
            console.log(driveritem);
            this.newCarrierDriver.contactName = driveritem.contactName;
            $("#newCarrierDriverName").val(driveritem.contactName);
            this.newCarrierDriver.contactName = $("#newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = driveritem.contactTel;
            this.newCarrierEqp.eqpNo = driveritem.eqpNo;
            $("#newCarrierEqpNo").val(driveritem.eqpNo);
            this.newCarrierEqp.eqpNo = $("#newCarrierEqpNo").val();
            this.newCarrierEqp.eqpName = driveritem.eqpName;
            this.newCarrierEqp.eqpBrand = driveritem.eqpBrand;
            this.newCarrierEqp.eqpType = driveritem.eqpType;
            console.log(driveritem.eqpNature)
            if (driveritem.eqpNature == null) {
                driveritem.eqpNature = "";
            }
            this.newCarrierEqp.eqpNature = driveritem.eqpNature;
            this.newCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.newCarrierEqp.eqpLength = driveritem.eqpLength;
            this.newCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.newCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.newCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.newCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.showDriverList1 = false;
        },
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
        getDriverInfo(val) { // 新建班次--司机姓名联想
            this.publicGetDriverInfo(val, 1);
        },
        getDriverInfo1(val) { // 修改司机信息--司机姓名联想
            this.publicGetDriverInfo(val, 2);
        },
        publicGetDriverInfo(val, params) { // cd -- 设备模板（传 设备-司机 模板，司机姓名）
            var that = this;
            clearTimeout(that.getDriverListTimer);
            that.getDriverListTimer = null;
            that.getDriverListTimer = setTimeout(function () {
                var driverinfo = {
                    contactName: val,
                    refType: "CONTACT"
                };
                $.ajax({
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, //  cdContact/queryContactInfoList
                    type: "post",
                    contentType: 'application/json',
                    data: JSON.stringify(driverinfo),
                    success: function (data) {
                        console.log(data);
                        that.driverList = [];
                        that.driverList = data.result;
                        if (that.driverList.length > 0) {
                            if (params == 1) {
                                that.showDriverList = true;
                            } else {
                                that.showDriverList1 = true;
                            }
                        }
                    }
                });
            }, 300);
        },
        saveShareVehicleOrder() {
            var that = this;
            if (that.OrderCarrier.cdPartyId === "") {
                imitatePopup("请选择承运商", "alert");
                return false;
            }
            if (that.OrderCarrier1.partyName == "") {
                imitatePopup("承运商名称不能为空", "alert");
                return false;
            }

            if ($(".carrierEqpName").val().trim() == "") {
                imitatePopup("设备不能为空", "alert");
                return false;
            }
            if ($("#carrierEqpNo").val().trim() == "") {
                imitatePopup("车牌号不能为空", "alert");
                return false;
            }
            if (that.OrderCarrierEqp.eqpNature == "") {
                imitatePopup("请选择设备性质", "alert");
                return false;
            }
            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            //订单
            that.order.orderType = 'SFO';
            that.order.orderFrom = that.logininf.tenantNo;
            //共享时间
            var dtmModelList = [];
            //共享地址
            var locationModelList = [];
            for (var i = 0; i < that.shareInfoList.length; i++) {
                var shareStartTime = that.shareInfoList[i].dtmTime;
                var shareEndTime = that.shareInfoList[i].dtmTime1;
                if (shareStartTime == "" || shareEndTime == "") {
                    imitatePopup("请填写开始时间和结束时间", "alert");
                    return false;
                }
                var dtmModel = {
                    dtmTime: new Date(shareStartTime),
                    dtmTime1: new Date(shareEndTime),

                }
                dtmModelList.push(dtmModel);
            }
            //共享设备
            var eqpInfoList = [];
            var eqpInfo = {
                eqp: that.OrderCarrierEqp,
                contact: {
                    contactName: that.OrderCarrierDriver.contactName,
                    contactTel: that.OrderCarrierDriver.contactTel,
                    contactType: "DRV"
                },
                refType: that.OrderCarrierEqp.eqpType
            }
            eqpInfoList.push(eqpInfo);
            var params = {
                order: that.order,
                partyContactInfo: {
                    party: that.OrderCarrier1,
                    imgContact: that.OrderCarrierContact
                },
                eqpInfoList: eqpInfoList,
                dtmModelList: dtmModelList,
                locationModelList: locationModelList
            };
            postRequest(tmsUrl + "/busShared/insertSfoOrderInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                imitatePopup("新增共享订单成功", "alert");
                // 关闭侧滑 ------ start
                closeSideslip();
                that.currentPage = 1;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);


                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                var searchFormArr = {
                    pageInfo: {
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    },
                    orderType: "SFO",
                    startCreateTime: startTimeVal,
                    endCreateTime: endTimeVal
                };
                //获取订单列表
                postRequest(tmsUrl + "/busShared/selectSfoOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.totalPagesNum = res.pageInfo.total;
                    that.pageList = [];
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            })
        },


        getOrderDetails(template, clicktype, tableOrderItem) {
            var that = this;
            that.clickBtnType = clicktype;
            this.templateTitle = template;
            this.resetShareInfo();
            var params = {
                refId: tableOrderItem.omOrderId
            };
            postRequest(tmsUrl + "/busShared/querySfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                //订单详情
                var orderInfoDetail = data.result;
                that.orderDetails = orderInfoDetail.order;  // 订单信息
                if (null != orderInfoDetail.partyContactInfo) {
                    if (null != orderInfoDetail.partyContactInfo.party) {
                        that.OrderCarrier1 = orderInfoDetail.partyContactInfo.party;
                    }
                    if (null != orderInfoDetail.partyContactInfo.imgContact) {
                        that.OrderCarrierContact = orderInfoDetail.partyContactInfo.imgContact;
                    }
                }
                if (null != orderInfoDetail.eqpInfoList) {
                    for (var i = 0; i < orderInfoDetail.eqpInfoList.length; i++) {
                        if (null != orderInfoDetail.eqpInfoList[i].eqp) {
                            that.OrderCarrierEqp = orderInfoDetail.eqpInfoList[i].eqp;
                        }
                        if (null != orderInfoDetail.eqpInfoList[i].contact) {
                            that.OrderCarrierDriver = orderInfoDetail.eqpInfoList[i].contact;
                        }
                    }
                }
                if (null != orderInfoDetail.dtmModelList) {
                    that.shareInfoList = [];
                    orderInfoDetail.dtmModelList.forEach(dtm => {
                        var shareInfo = {
                            omDtmId : dtm.omDtmId,
                            dtmTime : timestampToTime1(dtm.dtmTime),
                            dtmTime1 : timestampToTime1(dtm.dtmTime1)
                        };
                        that.shareInfoList.push(shareInfo);
                    })

                }
            })
        },
        editDriverInfo() {
            var that = this;
            if ($("#newCarrierDriverName").val().trim() == "" && $(".newCarrierDriverTel").val().trim() == "" && $("#newCarrierEqpNo").val().trim() == "" && $(".newCarrierEqpName").val().trim() == "") {
                imitatePopup("请先输入司机信息再保存", "alert");
                return false;
            }
            if (that.newCarrierDriver.contactName != '' && that.newCarrierDriver.contactName != undefined) {
                that.OrderCarrierDriver.contactName = that.newCarrierDriver.contactName;
            }
            if (that.newCarrierDriver.contactTel != '' && that.newCarrierDriver.contactTel != undefined) {
                that.OrderCarrierDriver.contactTel = that.newCarrierDriver.contactTel;
            }
            if (that.newCarrierEqp.eqpName != '' && that.newCarrierEqp.eqpName != undefined) {
                that.OrderCarrierEqp.eqpName = that.newCarrierEqp.eqpName;
            }
            if (that.newCarrierEqp.eqpNo != '' && that.newCarrierEqp.eqpNo != undefined) {
                that.OrderCarrierEqp.eqpNo = that.newCarrierEqp.eqpNo;
            }
            if (that.newCarrierEqp.eqpNature == "") {
                imitatePopup("请选择设备性质", "alert");
                return false;
            }else{
                that.OrderCarrierEqp.eqpNature = that.newCarrierEqp.eqpNature;
            }
            //共享设备
            var eqpInfoList = [];
            var eqpInfo = {
                eqp: that.OrderCarrierEqp,
                contact: that.OrderCarrierDriver,
                refType: that.OrderCarrierEqp.eqpType
            }
            eqpInfoList.push(eqpInfo);
            //共享时间
            var dtmModelList = [];
            //共享地址
            var locationModelList = [];
            for (var i = 0; i < that.shareInfoList.length; i++) {
                var shareStartTime = that.shareInfoList[i].dtmTime;
                var shareEndTime = that.shareInfoList[i].dtmTime1;
                if (shareStartTime == "" || shareEndTime == "") {
                    imitatePopup("请填写开始时间和结束时间", "alert");
                    return false;
                }
                var dtmModel = {
                    omDtmId: that.shareInfoList[i].omDtmId,
                    dtmTime: new Date(shareStartTime),
                    dtmTime1: new Date(shareEndTime),

                }
                dtmModelList.push(dtmModel);
            }

            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            var sfoOrderModel = {
                partyContactInfo: {
                    party: that.OrderCarrier1,
                    imgContact: that.OrderCarrierContact
                },
                eqpInfoList: eqpInfoList,
                order: that.orderDetails
            };
            postRequest(tmsUrl + "/busShared/updateSfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, sfoOrderModel, function (data) {

                that.newCarrierDriver = {
                    eqpType: ""
                };
                that.newCarrierEqp = {};
                that.newCarrierRemark = "";
                var searchFormArr = that.queryParam;
                if (searchFormArr.completeStatus == "") {
                    delete searchFormArr.completeStatus;
                }
                if (searchFormArr.auditStatus == "") {
                    delete searchFormArr.auditStatus;
                }
                if (searchFormArr.isDistribute == "") {
                    delete searchFormArr.isDistribute;
                }
                searchFormArr.orderType = "SFO";
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                searchFormArr.startCreateTime = startTimeVal;
                searchFormArr.endCreateTime = endTimeVal;
                searchFormArr.pageInfo = {
                    pageNum: that.currentPage,
                    pageSize: that.queryPageSize
                }
                //获取订单列表
                postRequest(tmsUrl + "/busShared/selectSfoOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    if (that.queryParam.completeStatus == undefined) {
                        that.queryParam.completeStatus = "";
                    }
                    if (that.queryParam.auditStatus == undefined) {
                        that.queryParam.auditStatus = "";
                    }
                    if (that.queryParam.isDistribute == undefined) {
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.publicChangeBtnStatus();

                })

            })
        },
        editDtmInfo() {
            var that = this;
            //共享时间
            var dtmModelList = [];
            for (var i = 0; i < that.shareInfoList.length; i++) {
                var shareStartTime = $("#shareStartTime1").val();
                var shareEndTime = $("#shareEndTime1").val();
                if (shareStartTime == "" || shareEndTime == "") {
                    imitatePopup("请填写开始时间和结束时间", "alert");
                    return false;
                }
                var dtmModel = {
                    omDtmId: that.shareInfoList[i].omDtmId,
                    dtmTime: new Date(shareStartTime),
                    dtmTime1: new Date(shareEndTime),

                }
                dtmModelList.push(dtmModel);
            }
            var sfoDtmOrder = dtmModelList;
            postRequest(tmsUrl + "/busShared/updateSfoDtmOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, sfoDtmOrder, function (data) {
                if (data.result != null) {
                }
            })
        },
        //添加时间
        addShareInfo(){
            let that = this;
            let shareStartTime = $("#shareStartTime").val();
            let shareEndTime = $("#shareEndTime").val();
            if (shareStartTime == "" || shareEndTime == "") {
                imitatePopup("请填写开始时间和结束时间", "alert");
                return false;
            }
            let shareInfo = {
                dtmTime: shareStartTime,
                dtmTime1: shareEndTime,
            };
            that.shareInfoList.push(shareInfo);
            this.resetShareInfo();
        },
        //重置时间
        resetShareInfo(){
            let that = this;
            $("#shareStartTime").val("");
            $("#shareEndTime").val("");
        },

        //重置时间
        resetShareInfo1(){
            let that = this;
            that.shareInfo.omDtmId="";
            $("#shareStartTime").val("");
            $("#shareEndTime").val("");
            that.selectShareDtmInfoList();
        },

        //删除时间
        removeShareInfo(index){
            let that = this;
            this.shareInfoList.splice(index,1);
        },
        //修改时间
        updateShareInfo(index,shareInfo){
            let that = this;
            that.shareInfo.omDtmId = shareInfo.omDtmId;
            $("#shareStartTime").val(shareInfo.dtmTime);
            $("#shareEndTime").val(shareInfo.dtmTime1);
            this.shareInfoList.splice(index,1);
        },

        //删除共享时间
        deleteShareInfo(shareInfo) {
            var that = this;
            var deleteStation = confirm("确定删除当前共享时间点");
            if (deleteStation == true) {
                var params = {
                    omDtmId: shareInfo.omDtmId
                }
                postRequest(tmsUrl + "/busShared/deleteShareDtmInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                    if (data.msg === "SUCCESS" || data.msg === "success") {
                        imitatePopup("删除成功", "alert");
                        that.resetShareInfo1();
                    }else {
                        imitatePopup(res.msg,'alert');
                        return false;
                    }
                })
            }
        },
        //保存共享时间
        saveShareInfo(){
            let that = this;
            let shareStartTime = $("#shareStartTime").val();
            let shareEndTime = $("#shareEndTime").val();
            if (shareStartTime == "" || shareEndTime == "") {
                imitatePopup("请填写开始时间和结束时间", "alert");
                return false;
            }
            var params = {
                omDtmId: that.shareInfo.omDtmId,
                refId:that.orderDetails.omOrderId,
                refTo:"om_order",
                dtmType:"SHA",
                dtmTime: new Date(shareStartTime),
                dtmTime1: new Date(shareEndTime),
            }
            postRequest(tmsUrl + "/busShared/saveShareDtmInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if (data.msg === "SUCCESS" || data.msg === "success") {
                    imitatePopup("保存成功", "alert");
                    that.resetShareInfo1();
                }else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        //查询共享时间
        selectShareDtmInfoList(){
            let that = this;
            var params = {
                refId: that.orderDetails.omOrderId,
                refTo: "om_order",
                refType: "SHA"
            }
            postRequest(tmsUrl + "/busShared/selectShareDtmInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if (data.msg === "SUCCESS" || data.msg === "success") {
                    that.shareInfoList = data.result;
                }else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },

        activeStatusFun1(item) {
            let that = this;
            //共享车辆取消
            that.checkOrder = item;
            if (item.orderInd == "normal") {
                //未共享车辆
                if (item.completeStatus =='INIT') {
                    let r = confirm("确定取消该共享车辆么？");
                    if (r == true) {
                        let params = {
                            refId: item.omOrderId,
                            refNo: item.orderNo,
                            refType:1
                        };
                        postRequest(tmsUrl + "/busShared/saveCancelSfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                            that.getSearchVal();
                            alert("共享车辆取消成功");
                        })
                    }
                }else {
                    //已共享车辆，未预订取消，已预订无法取消
                    that.checkOrder.orderType="2";
                    that.popupOrderTimeCheck();
                }
            }
            //已预订车辆取消
            if (item.orderInd == "house") {
                //未审核
                if (item.completeStatus =='INIT') {
                    that.checkOrder.orderType="3";
                    that.popupOrderTimeCheck();
                }else {
                    //已审核预订车辆无法取消
                    imitatePopup("预订车辆配送中无法取消！",'alert');
                }
            }
        },
        //推送订单到平台
        pushOrder(item){
            var that = this;
            var r = confirm("确定共享车辆到平台吗？");
            if (r == true) {
                var params = {
                    refId: item.omOrderId,
                    refNo: item.orderNo,
                    refTo: "INTERNAL",
                    refCode: "88888888",
                    refType: "SFO",
                };
                postRequest(tmsUrl + "/busShared/saveSfoPullOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                    if(data.result){
                        imitatePopup("订单共享成功",'alert');
                    }else{
                        imitatePopup('订单共享失败，请稍后重试！','alert');
                    }
                    // 关闭侧滑 ------ start
                    closeSideslip();
                    that.getSearchVal();
                })
            }
        },


        //取消预订车辆选择时间弹出框
        popupOrderTimeCheck(){
            let that = this;
            that.checkDtmInfoList = [];
            var params = {
                refId: that.checkOrder.omOrderId,
                refTo: "om_order",
                refType: "SHA"
            }
            postRequest(tmsUrl + "/busShared/selectShareDtmInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if (data.msg === "SUCCESS" || data.msg === "success") {
                    $(".orderTimeCheckLayer").css("transform", "translate(-50%,-50%) scale(1)");
                    that.sfoDtmInfoList = data.result;
                }else {
                    imitatePopup(res.msg,'alert');
                    return false;
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
            let that = this;
            if(that.checkDtmInfoList.length < that.sfoDtmInfoList.length){
                that.checkDtmInfoList = [];
                that.sfoDtmInfoList.forEach(function (dtmInfo) {
                    that.checkDtmInfoList.push(dtmInfo)
                });
            } else {
                that.checkDtmInfoList = [];
            }
        },
        //取消预订
        reverseOrder(){
            let that = this;
            this.closeOrder();
            clearTimeout(that.timer);
            if (null == that.checkDtmInfoList || that.checkDtmInfoList.length==0){
                imitatePopup('请选择取消时间！','alert')
                return false;
            }
            let dtmModelList = [];
            that.checkDtmInfoList.forEach((dtm) => {
                dtmModelList.push(dtm)
            })
            if (that.checkOrder.orderType == "3") {
                let arr = that.checkOrder.customerRefNo.split("-");
                that.checkOrder.orderNo=arr[0];
            }
            let params = {
                dtmModelList:dtmModelList,
                order:{
                    omOrderId: that.checkOrder.omOrderId,
                    orderNo: that.checkOrder.orderNo,
                    orderType:that.checkOrder.orderType
                }
            };
            postRequest(tmsUrl + "/busShared/saveCancelSfoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if (true) {
                    that.getSearchVal();
                    imitatePopup("取消共享车辆成功！",'alert');
                }else {
                    imitatePopup("该共享车辆配送中无法取消！",'alert');
                }
            })
        },
        // 取消
        closeOrder(){
            $(".orderTimeCheckLayer").css("transform", "translate(-50%,-50%) scale(0)");
        },

        orderAudit(tableOrderItem) { // 订单审核生成班次
            let that = this;
            let params ={
                refCode: that.logininf.tenantNo,
                refId: tableOrderItem.omOrderId,
                refType: tableOrderItem.orderType,
                refNo: tableOrderItem.orderNo,
                state: "0",
                refTo: 'INTERNAL'
            };
            postRequest(tmsUrl + "/busShared/createTfoOrderBySfoOrder.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                imitatePopup("审核成功", 'alert');
                that.getSearchVal();
            })
        },
        textboxAllSelectionFun(allChecked) {
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            if (allChecked == false) {
                that.checkedOperaOrder = [];
                for (var i = 0; i < that.tableOrderList.length; i++) {
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.checkedOperaOrder.length;
            } else {
                for (var ii = 0; ii < that.tableOrderList.length; ii++) {
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii], that.checkedOperaOrder), 1)
                }
                that.allChecked = false;
                that.checkedNum = that.checkedOperaOrder.length;
            }
        },
        textboxSelectionFun(event, tableBill) {
            var that = this;
            var el = event.target;
            if ($(el).prop("checked")) {
                that.checkedOperaOrder.push(tableBill);
            } else {
                that.checkedOperaOrder.splice($.inArray(tableBill, that.checkedOperaOrder), 1)
            }
            that.checkedNum = that.tableOrderList.length;
            if (that.checkedNum == $(".reportMessages table tr.see").length) {  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".reportMessages thead input[type='checkbox']").prop('checked', true);
            } else {
                that.allChecked = false;
                $(".reportMessages thead input[type='checkbox']").prop('checked', false);
            }
        },
        publicChangeBtnStatus() {
            var that = this;
            setTimeout(function () {
                var permissionListObj = "";
                var pageid = GetQueryString("objectId");
                var buttonObj = $(".butOperatePermission");
                getRequest(umsUrl + '/query/objectByUser.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp + "&userId=" + that.logininf.umUserId + "&parentUmObjectId=" + pageid, function (res) {
                    permissionListObj = res.result;
                    //console.log(buttonObj.length);
                    for (var i = 0; i < permissionListObj.length; i++) {
                        for (var j = 0; j < buttonObj.length; j++) {
                            if (permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")) {
                                for (var m = 0; m < permissionListObj[i].permissionList.length; m++) {
                                    if (permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show") {
                                        //console.log(j);
                                        $(".butOperatePermission").eq(j).css({"display": "inline-block"})
                                        $(".butOperatePermission").eq(j).show();
                                    } else {
                                        $(".butOperatePermission").eq(j).parents(".commandbarItem").hide();
                                        $(".butOperatePermission").eq(j).hide();

                                    }
                                }
                            }
                        }
                    }
                })
            }, 100)
        },
        resetOrderList() {
            window.location.reload();
        }
    },
    created: function () {
        var that = this;
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        initSelectData(that);
        this.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        var searchFormArr0 = {
            refType: "PARTYLNK"
        };
        postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr0, function (data) {
            if (data.result != null) {
                if (data.result.length > 0) {
                    that.resPartyList = data.result;
                } else {
                    that.resPartyList = [];
                }
            } else {
                that.resPartyList = [];
            }
        });
        that.timeHorizon = getQueryTime(1)+" - "+ getTodayTime();
        var startTimeVal =that.timeHorizon.split(" - ")[0];
        var endTimeVal =that.timeHorizon.split(" - ")[1];
        var searchFormArr = {
            activeStatus: "1",
            startCreateTime: startTimeVal,
            endCreateTime: endTimeVal,
            pageInfo: {
                pageNum: 1,
                pageSize: that.queryPageSize
            },
            orderType: "SFO",
        };
        //获取订单列表
        postRequest(tmsUrl + "/busShared/selectSfoOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
            that.tableOrderList = res.result;
            that.pageInfo = res.pageInfo;
            that.totalPagesNum = res.pageInfo.total;
            for (var i = 0; i < res.pageInfo.pages; i++) {
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })
    },
    filters: {
        timestampToTime(timestamp) {
            if (timestamp == null) {
                return '--';
            } else {
                var date;
                if (timestamp.length == 13) {
                    var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
                    var currentTime = timestamp - offsetMs;
                    date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                }else{
                    date=  new Date(timestamp);
                }

                Y = date.getFullYear() + '-';
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m;
            }
        }
    }
})

function initSelectData(that) {

    that.queryParam = { // 搜索条件
        orderNo: "",
        carDrvContactName: "",
        carDrvContactTel: "",
        carDrvEqpNo: "",
        isDistribute: "",
        activeStatus:"1",
        completeStatus: "",
        auditStatus: "",
        crcdStartTimeSpan: "",
        crcdEndTimeSpan: ""
    };
}


// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});
