var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		isDisable:true,
		clearShow:true,
		abnormalPage:0,
		splitType: 'master',
		isOpOrCloDetail: '0',
        recordd:'',
        popupType:'',
        checkItem:{},
        checkedValue:[],
        actRemark:[],
        checkedActCode:'',
        exceptionStatus: '',
        splitAddress: 0,
        temporarySplitItem: {},
        tableOrderList: {},
        formLeft: {},
        dpDistrictList: {},
        packageGoodsInf: {},
        selectListData: {},
        queryParam: {},
        searchInf: [],
        pageList: [],
        totalPagesNum: "",
        orderDetail: {},
        sfrCountryList: {},
        sfrDistrictList: {},
        sfrCityList: {},
        sfrProvinceList: {},
        shipperParty: {},
        shipperPartyContact: {},
        shipperPartyLocation: {},
        shipperPartyLocationContact: {},
        shipperPartyLocationContactList: {},
        shipperPartyContactList: {},
        shipperPartyLocationList: {},
        receiptParty: {},
        receiptPartyContact: {},
        receiptPartyLocation: {},
        receiptPartyLocationContact: {},
        OrderCarrier: {},
        OrderCarrierParty: {},
        OrderCarrierContact: {},
        OrderCarrierDriver: {
            cdContactId: ""
        },
        OrderCarrierEqp: {
            eqpType: ""
        },
        dtmListInfoList: [{}],
        eqpListInfoList: [{}],
        orderItemDetail: {orderItem: {}},
        uploadImgList: [],
        uploadImgListYes: [],
        orderCodeItem: {},
        orderReceiptItem: {},
        orderLogisticsInfo: {},
        srcFileList: [],
        begin: "",
        magnifyImgSrc: "",
        magnifyImgType: "",
        indexImg: 0,
        receiptImgList: [],
        receiptFilesList: [],
        actCurrentInfo: {
            actCode: '',
            createTime: null,
            remark: ''
        },
        actListInfo: {},
        logininf: {},
        searchsStartTime: "",
        checkedOperaOrder: [],
        splitCount: "",
        currentOrderId: "",
        isShowSplitList: "0",
        checkedNum: 0,
        vehicleTypeList: [],
        queryPageSize: 20,
        multipleNum: 12,
        packageGoodsDetails: "",
        packageGoodsList: [{
            orderItem: {
                itemName: "",
                currency: "",
                qtyUnit: "",
                volumeUnit: ""
            }
        }],
        orderCarrierList: [{
            shipperPartyHave: {},
            receiptPartyHave: {},
            orderDetailHave: {},
            OrderCarrierContactHave: {
                contactName: '',
                contactTel: ''
            },
            OrderCarrierEqpHave: {},
            OrderCarrierHave: {},
            OrderCarrierDriverHave: {}
        }],
        OrderCarrier1: {
            partyName: "",
            partyCode: "",
            isBuyer: "",
            isVendor: "",
            isTruck: "",
            isWarehouse: "",
            is3pl: ""
        },
        shortShowType: "0",
        resPartyList: [],
        showDriverList: [],
        driverList: [],
        showPlateList: false,
        omOrderList: [],
        timeHorizon1: getQueryTime(0) + " " + "00:00",
        timeHorizon: "" //创建时间范围
	},
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal();
        },
    },
	methods:{
        showItemDetails() {
            var that = this;
            that.shortShowType = '1';
        },
        hideItemDetails() {
            var that = this;
            that.shortShowType = '0';
        },
        textboxAllSelectionFun(event){
            var that = this;
            that.checkedOperaOrder= [];
            var el = event.target;
            if($(el).prop("checked")){
                $(".reportMessages table td .checkInp").prop("checked",true);
                for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.checkedNum = that.checkedOperaOrder.length;
            } else {
                $(".reportMessages table td .checkInp").prop("checked", false);
                for (var ii = 0; ii < that.tableOrderList.length; ii++) {
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii], that.checkedOperaOrder), 1)
                }
                that.checkedNum = that.checkedOperaOrder.length;
            }
        },
        textboxSelectionFun(event, orderItem) {
            var that = this;
            var el = event.target;
            if ($(el).prop("checked")) {
                that.checkedOperaOrder.push(orderItem);
            } else {
                that.checkedOperaOrder.splice($.inArray(orderItem, that.checkedOperaOrder), 1)
            }
            that.checkedNum = that.checkedOperaOrder.length;
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                customerOriginalNo: "",
                orderNo: "",
                carDrvContactName: "",
                carDrvContactTel: "",
                carDrvEqpNo: "",
                stoPartyName: "",
                orderNature: "",
                origin: ""
            };
        },
        bacthAccept() {
            var that = this;
            var orderList = [];
            if (that.checkedOperaOrder.length == 0) {
                imitatePopup("请至少勾选一条数据行", "alert");
                return false;
            }
            var r = confirm("你确定要批量验收吗？");
            if (r) {
                for (var i = 0; i < that.checkedOperaOrder.length; i++) {
                    orderList.push({
                        orderId: that.checkedOperaOrder[i].omOrderId,
                        actCode: 'ACPT',
                        orderNo: that.checkedOperaOrder[i].orderNo
                    })
                }
                $.ajax({
                    url: tmsUrl + '/driver/save/submitOrderActInfo',
                    type: "post",
                    contentType: 'application/json',
                    data: JSON.stringify(orderList),
                    success: function (data) {
                        if (data.result.success == true) {
                            location.reload(true);
                        }
                    }
                })
            }
        },
        stateDispose(type, item) {
            var that = this;
            $(".maskLayer3").show();
            that.popupType = type;
            that.checkItem = item;
            that.checkedActCode = '';
            that.uploadImgListYes = [];
            that.checkedActCode = '';
        },
        fillAbnormal(type) {
            var that = this;
            if (that.checkedActCode == '' || that.checkedActCode == undefined) {
                imitatePopup("请选择当前动作！", 'alert');
                return false;
            }
            that.popupType = type;
        },
        closeMaskLayer() {
            var that = this;
            $(".maskLayer").hide();
            that.checkItem = {};
        },
        // 签收时图片上传、删除
        uploadImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    that.uploadImgListYes.push(evt.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('上传失败，请重新上传！');
            }
        },
        clickUploadImgYes() {
            $('#uploadImgYes').click();
        },
        deluploadImgYes(index) {
            var that = this;
            that.uploadImgListYes.splice(index, 1)
        },
        // 异常时图片上传、删除
        uploadImgFun() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadImg").prop("files")[0];  //获取文件
            var that = this;
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    that.uploadImgList.push(evt.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('上传失败，请重新上传！');
            }
        },
        clickUploadImg() {
            $('#uploadImg').click();
        },
        deluploadImg(index) {
            var that = this;
            that.uploadImgList.splice(index, 1)
        },
        //确认签收
        sureSignFor(item) {
            var that = this;
            var list = [];
            if (that.uploadImgListYes.length > 0) {
                for (var i = 0; i < that.uploadImgListYes.length; i++) {
                    that.uploadImgListYes[i] = that.uploadImgListYes[i].split(',')[1];
                }
            }
            list.push({
                orderId: item.omOrderId,
                actCode: that.checkedActCode,
                orderNo: item.orderNo,
                imgBase64: that.uploadImgListYes
            });
            if (that.checkedActCode == '' || that.checkedActCode == undefined) {
                imitatePopup("请选择当前动作！", 'alert');
                return false;
            }
            postRequest(tmsUrl + "/driver/save/submitOrderActInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, list, function (res) {
                $(".maskLayer").hide();
                if (res.result.success == true) {
                    location.reload(true);
                }
            })
        },
        //确认异常
        sureAbnormal(item) {
            var that = this;
            var list = [];
            var actRemark = that.actRemark[1] + ',' + that.actRemark[2] + ',' + that.actRemark[3] + ',' + that.actRemark[4];
            if (that.uploadImgList.length > 0) {
                for (var i = 0; i < that.uploadImgList.length; i++) {
                    that.uploadImgList[i] = that.uploadImgList[i].split(',')[1];
                }
            }
            list.push({
                orderId: item.omOrderId,
                actCode: that.checkedActCode,
                orderNo: item.orderNo,
                exceptionRemark: actRemark,
                imgBase64: that.uploadImgList,
                exceptionStatus: that.exceptionStatus,
            })
            if (that.actRemark[0] == '' || that.actRemark[0] == undefined) {
                imitatePopup("请填写异常描述！", 'alert');
                return false;
            }
            if (that.actRemark[1] == '' || that.actRemark[1] == undefined) {
                imitatePopup("请填写处理意见！", 'alert');
                return false;
            }
            if (that.actRemark[2] == '' || that.actRemark[2] == undefined) {
                imitatePopup("请填写客户姓名！", 'alert');
                return false;
            }
            if (that.actRemark[3] == '' || that.actRemark[3] == undefined) {
                imitatePopup("请填写联系方式！", 'alert');
                return false;
            }
            if (that.exceptionStatus == '' || that.exceptionStatus == undefined) {
                imitatePopup("请选择异常是否可执行！", 'alert');
                return false;
            }
            postRequest(tmsUrl + "/driver/save/submitOrderActInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, list, function (res) {
                $(".maskLayer").hide();
                if (res.result.success == true) {
                    location.reload(true);
                }
            })
        },
        //翻页
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
            var searchFormArr = this.queryParam;
           /* var crcdStartTimeVal = $(".crcdStartTimeSpan").val();
            var crcdEndTimeVal = $(".crcdEndTimeSpan").val();
            if (crcdStartTimeVal == "" && crcdEndTimeVal == "") {
                $(".crcdStartTimeSpan").val(getQueryTime(2));
                $(".crcdEndTimeSpan").val(getQueryTime(-1));
                crcdStartTimeVal = getQueryTime(2);
                crcdEndTimeVal = getQueryTime(-1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }*/
           var that = this;
            searchFormArr.startCompleteTime = that.timeHorizon.split(" - ")[0];
            searchFormArr.endCompleteTime = that.timeHorizon.split(" - ")[1];
            searchFormArr.isNoException = true;
            searchFormArr.isTransit = true;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            }
            $(".reportMessages table tr .checkInp").attr("checked", false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(showPageNum) {
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                var startTimeVal = that.timeHorizon.split(" - ")[0];
                var endTimeVal = that.timeHorizon.split(" - ")[1];
                searchFormArr.startCompleteTime = startTimeVal;
                searchFormArr.endCompleteTime = endTimeVal;
                searchFormArr.isNoException = true;
                searchFormArr.isTransit = true;
                if (showPageNum == 1) {
                    searchFormArr.pageInfo = {
                        pageNum: that.currentPage,
                        pageSize: that.queryPageSize
                    }
                } else {
                    searchFormArr.pageInfo = {
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    }
                }
                $(".reportMessages table tr .checkInp").attr("checked", false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    if (showPageNum == 1) {

                    } else {
                        that.currentPage = 1;
                    }
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    }, 300);
                    that.pageList = [];
                    that.totalPagesNum = res.pageInfo.total;
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                    $(".collUnfold").hide();
                })
            } else {
                imitatePopup("请输入大于1的正整数", 'alert');
                return false;
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
                                        if (permissionListObj[i].objectCode == "UPLOAD") {
                                            $(".fileUploadHint").css({"display": "inline-block"});
                                        }
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
        },

        getDriverInfo(val) { // 新建班次--司机姓名联想
            this.publicGetDriverInfo(val, 1);
        },
        getDriverInfo1(val) { // 修改司机信息--司机姓名联想
            this.publicGetDriverInfo(val, 2);
        },
        publicGetPlateInfo(val, params) { // cd -- 设备模板（传 设备-司机 模板，车牌号）
            var that = this;
            clearTimeout(that.getEpdListTimer);
            that.getEpdListTimer = null;
            that.getEpdListTimer = setTimeout(function () {
                that.plateList = {};
                var plateinfo = {
                    eqpName: val,
                    refType: "CONTACT"
                };
                $.ajax({
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, // cdEqp/queryDrvContactInfo
                    type: "post",
                    contentType: 'application/json',
                    data: JSON.stringify(plateinfo),
                    success: function (data) {
                        that.plateList = data.result;
                        if (that.plateList.length > 0) {
                            if (params == 1) {
                                that.showPlateList = true;
                            } else {
                                that.showPlateList1 = true;
                            }
                        }
                    }
                });
            }, 300);
        },
        choosePlate(plateitem) { // 新建班次--选择联想的车牌号
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
        chooseDriver(driveritem) { // 新建班次--选择联想的司机姓名
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
            this.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.showDriverList = false;
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
        addOrderCarrierFun() {
            var that = this;
            that.OrderCarrierDriver = {
                cdContactId: ""
            };
            that.OrderCarrierEqp = {
                eqpType: ""
            };
            that.isDisable = false;
            that.shortShowType = '0';
            that.showDriverList = false;
            that.showPlateList = false;
            that.OrderCarrierContact.cdContactId = '';
            that.orderList = [];
            $('.reportMessages tbody .checkInp:checkbox').each(function () {
                if ($(this).prop('checked') == true) {
                    that.orderList.push({
                        omOrderId: $(this).val()
                    })
                }
            });
            if (that.orderList.length == 0) {
                imitatePopup("请勾选对应数据行", 'alert');
                return false;
            }
            that.orderCarrierList = [];
            for (var i = 0; i < that.orderList.length; i++) {
                var params = {};
                params.omOrderId = that.orderList[i].omOrderId;
                that.omOrderList.push(params);
                //获取订单列表
                getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&orderId=" + that.orderList[i].omOrderId, function (data) {
                    var parms1 = {};
                    // 发货商
                    if (data.result.shipperPartyInfo != null) {
                        if (data.result.shipperPartyInfo.party != null) {
                            parms1.shipperPartyHave = data.result.shipperPartyInfo.party;
                        } else {
                            parms1.shipperPartyHave = {};
                        }
                    } else {
                        parms1.shipperPartyHave = {};
                    }
                    // 收货商
                    if (data.result.receiptPartyInfo != null) {
                        if (data.result.receiptPartyInfo.party != null) {
                            parms1.receiptPartyHave = data.result.receiptPartyInfo.party;
                        } else {
                            parms1.receiptPartyHave = {};
                        }
                    } else {
                        parms1.receiptPartyHave = {};
                    }
                    // 订单详情
                    if (data.result.order != null) {
                        parms1.orderDetailHave = data.result.order;
                    } else {
                        parms1.orderDetailHave = {};
                    }
                    // 承运商
                    if (data.result.carrierPartyInfo != null) {
                        if (data.result.carrierPartyInfo.party != null) {
                            parms1.OrderCarrierHave = data.result.carrierPartyInfo.party;  // 承运商
                        } else {
                            parms1.OrderCarrierHave = {};
                        }
                        if (data.result.carrierPartyInfo.imgContactInfo != null) {
                            parms1.OrderCarrierContactHave = data.result.carrierPartyInfo.imgContactInfo;  // 承运商联系人
                        } else {
                            parms1.OrderCarrierContactHave = {
                                contactName: '',
                                contactTel: ''
                            };
                        }
                        if (data.result.carrierPartyInfo.contact != null) {
                            parms1.OrderCarrierDriverHave = data.result.carrierPartyInfo.contact;  // 司机
                        } else {
                            parms1.OrderCarrierDriverHave = {};
                        }
                        if (data.result.carrierPartyInfo.eqp != null) {
                            parms1.OrderCarrierEqpHave = data.result.carrierPartyInfo.eqp;  // 设备
                        } else {
                            parms1.OrderCarrierEqpHave = {};
                        }
                    } else {
                        parms1.OrderCarrierHave = {};
                        parms1.OrderCarrierContactHave = {
                            contactName: '',
                            contactTel: ''
                        };
                        parms1.OrderCarrierDriverHave = {};
                        parms1.OrderCarrierEqpHave = {};
                    }

                    that.orderCarrierList.push(parms1);
                })
            }
            ;
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
                }
            })
        },
        addCarrierFun() {
            var that = this;
            if (that.OrderCarrier.cdPartyId === "") {
                imitatePopup("请选择承运商", "alert");
                return false;
            }
            if (that.OrderCarrier1.partyName == "") {
                imitatePopup("承运商名称不能为空", "alert");
                return false;
            }

            if ($("#carrierDriverName").val().trim() == "") {
                imitatePopup("司机名字不能为空", "alert");
                return false;
            }
            if ($(".carrierDriverTel").val().trim() == "") {
                imitatePopup("司机手机号不能为空", "alert");
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

            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            var orderLnkList = [];
            for (var i = 0; i < that.checkedOperaOrder.length; i++) {
                var tjoOrder = {};
                tjoOrder.omOrderId = that.checkedOperaOrder[i].omOrderId;
                orderLnkList.push(tjoOrder);
            }

            var params = {
                carrierPartyInfo: {
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party: that.OrderCarrier1
                },
                remark: that.OrderCarrierRemark,
                dtmTime: that.timeHorizon1,
                orderLnkList: orderLnkList
            };
            postRequest(tmsUrl + "/save/newTfoOrderAuditStatus2?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.result) {
                    // 关闭侧滑 ------ start
                    closeSideslip();
                    // 关闭侧滑 ------ end
                    that.getSearchVal();
                } else {
                    imitatePopup('保存有误，请稍后重试！', 'alert');
                }
            })
        }
    },
    created() {
        var that = this;
        that.queryParam = {
            actCode:"",
            orderNature: "",
            origin: ""
        };
        that.timeHorizon = getQueryTime(2)+" - "+ getQueryTime(-1);
        var searchFormArr = {
            startCompleteTime: getQueryTime(2),
            endCompleteTime: getQueryTime(-1),
            isNoException:true,
            isTransit:true,
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        }
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        this.selectListData = getBasicData();    //获取下拉数据
        that.searchsStartTime = getQueryTime(1);
        //获取订单列表
        postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.totalPagesNum = res.pageInfo.total;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })
        var that = this;
        var searchFormArr0 = {
            refType: "PARTYLNK"
        };
        postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr0, function (data) {
            if (data.result != null) {
                if (data.result.length > 0) {
                    that.resPartyList = data.result;
                }
            }
        });
    },
    filters: {
        timestampToTime(timestamp) {
            if (timestamp == null) {
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

// 日期控件
$(document).ready(function () {
    $('#timeRange').daterangepicker(null, function (start, end, label) {
        app.timeHorizon = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.timeHorizon1 = start.format('YYYY-MM-DD HH:mm');
    });
});
