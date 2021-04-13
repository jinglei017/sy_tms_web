var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:20,
        isDisable:true,
        abnormalPage:0,
        tableOrderList:{},
        formLeft:{},
        dpDistrictList:{},
        packageGoodsInf:{},
        selectListData:{},
        carrierPartyContactNameList:{},
        carrierPartyDriverNameList:{},
        carrierPartyEqpNameList:{},
        queryParam:{},
        searchInf:[],
        pageList:[],
        orderDetail:{},
        sfrCountryList:{},
        sfrDistrictList:{},
        sfrCityList:{},
        sfrProvinceList:{},
        shipperParty:{},
        shipperPartyContact:{},
        shipperPartyLocation:{},
        shipperPartyLocationContact:{},
        shipperPartyLocationContactList:{},
        shipperPartyContactList:{},
        shipperPartyLocationList:{},
        receiptParty:{},
        receiptPartyContact:{},
        receiptPartyLocation:{},
        receiptPartyLocationContact:{},
        OrderCarrier:{},
        OrderCarrierParty:{},
        OrderCarrierContact:{
            cdContactId:''
        },
        OrderCarrierDriver:{
            cdContactId:''
        },
        OrderCarrierEqp:{
            cdEqpId:''
        },
        dtmListInfoList:[{}],
        eqpListInfoList:[{}],
        orderItemDetail:{orderItem:{}},
        uploadImgList:[],
        orderCodeItem:{},
        orderReceiptItem:{},
        orderLogisticsInfo:{},
        receiptImgList:[],
        actCurrentInfo:{},
        actListInfo:{},
        logininf:{},
        totalPagesNum:"",
        orderCarrierList:[{
            shipperPartyHave:{},
            receiptPartyHave:{},
            orderDetailHave:{},
            OrderCarrierContactHave:{
                contactName:'',
                contactTel:''
            },
            OrderCarrierEqpHave:{},
            OrderCarrierHave:{},
            OrderCarrierDriverHave:{}
        }],
        omOrderList:[],
        orderList:[],
        splitCount:"",
        currentOrderId:"",
        isShowSplitList:"0",
        orderSplitList:[{
            orderItemList:[{}]
        }],
        templateTitle:"新增订单",
        templateInfoTitle:"",
        orderInfoDetail:"",
        packageGoodsDetails:"",
        packageGoodsList:[{
            orderItem:{
                itemName:"",
                currency:"",
                qtyUnit:"",
                volumeUnit:""
            }
        }],
        checkedOperaOrder:[],
        checkedNum:0,
        splitType: 'master',
        shortShowType:"0",
        resPartyList:[],
        showDriverList:[],
        driverList:[],
        actInfo:{
            actCode: "RDC",
            actName: "",
            remark:"",
            actTime:""
        },
        deliveryDateTime:getQueryTime(-1),
        showPlateList:false,
        OrderCarrierRemark: "",
        OrderCarrier1:{
            partyName:"",
            partyCode:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        charge: { // 费用信息
            bmChargeId: "",
            refTo: "",
            refSource: "",
            customerRefNo: "",
            refId: "",
            refHash: "",
            chargeFrom: "",
            chargeTo: "",
            chargeFromName: "",
            chargeToName: "",
            rpType: "",
            chargeInfoList: []
        },
        chargeInfo: {  //费用组信息
            chargeType: "",
            chargeGroup: "",
            chargeRate: "",
            qty: "",
            qtyUnit: "",
            discountRate: "",
            discount: "",
            taxRate: "",
            tax: "",
            amount: "",
            currency: "",
            exchangeRate: "",
            remark: ""
        },
        chargeInfoTable: {}, //费用列表
        transportOrder: {},
        yearList:['2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030'],
        monthList: ['01','02','03','04','05','06','07','08','09','10','11','12'],
        yearSure: "2019",
        orderTime: "2019-10",
        timeHorizon: "", //创建时间范围
        timeHorizon1: getQueryTime(0) + " " + "00:00"
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
    methods:{
        showItemDetails(){
            var that = this;
            that.shortShowType = '1';
        },
        hideItemDetails(){
            var that = this;
            that.shortShowType = '0';
        },
        addPackageGoods(){
            //添加包裹商品
            this.packageGoodsList.push({
                orderItem:{
                    itemName:"",
                    currency:"",
                    qtyUnit:"",
                    volumeUnit:""
                }
            });
        },
        addOrderCarrierHint(){
            var that = this;
            if(that.checkedNum == 0){
                alert("请先勾选至少一条订单行！");
                return '0';
            }else{
                return '1'
            }
        },
        addOrderDetails(template){
            this.templateTitle = template;
        },
        textboxAllSelectionFun(event){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                $(".reportMessages table td .checkInp").prop("checked",true);
                for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.checkedNum = that.checkedOperaOrder.length;
            }else{
                $(".reportMessages table td .checkInp").prop("checked",false);
                for(var ii = 0; ii < that.tableOrderList.length;ii++){
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii],that.checkedOperaOrder),1)
                }
                that.checkedNum = that.checkedOperaOrder.length;
            }
        },
        textboxSelectionFun(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedOperaOrder.push(orderItem);
            }else{
                that.checkedOperaOrder.splice($.inArray(orderItem,that.orderList),1)
            }
            that.checkedNum = that.checkedOperaOrder.length;
            if(that.checkedOperaOrder.length == ($(".reportMessages input[type='checkbox']").length-1)){  // 单选个数 = 该页条数，全选选中
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
            console.log(that.checkedNum)
        },
        carrierPartyList(params,id){
            var that = this;
            postRequest(cmdUrl + "/cdParty/selectCdPartySingle.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,id,function(res){
                that.receiptParty = res.result;
                var param = {},params = {};
                param.refId = that.receiptParty.cdPartyId;
                param.refTo = "cd_party";
                that.carrierPartyContactList(param);
                getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+id+"&isDefault=1&locationType=OTHER",function(res){
                    if(res.result.imgContactList != null){
                        that.OrderCarrierContact = res.result.imgContactList[0];  // 合作方默认联系人
                    }else{
                        that.OrderCarrierContact = {};
                        that.OrderCarrierContact.cdContactId = '';
                    }
                    if(res.result.eqpList != null){
                        that.OrderCarrierEqp = res.result.eqpList[0];  // 默认设备
                    }else{
                        that.OrderCarrierEqp = {};
                        that.OrderCarrierEqp.cdEqpId = '';
                    }

                    that.OrderCarrierDriver = {};  // 司机信息 （合作商——联系人、地址、设备。。。没有司机信息）
                    that.OrderCarrierDriver.cdContactId = '';
                });
                that.carrierPartyDriverList(param);
                that.carrierPartyEqpList(params);
            });

        },
        carrierPartyContactList(param){  // 合作方联系人 select 列表
            var that = this;
            postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                if(res.result != null){
                    that.carrierPartyContactNameList = res.result;
                    that.OrderCarrierContact = res.result[0];
                }else{
                    that.carrierPartyContactNameList = {};
                    that.OrderCarrierContact = {};
                }
            });
        },
        carrierPartyDriverList(param){  // 司机 select 列表
            var that = this;
            postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                if(res.result != null){
                    that.carrierPartyDriverNameList = res.result;
                    that.OrderCarrierDriver = res.result[0];
                }else{
                    that.carrierPartyDriverNameList = {};
                    that.OrderCarrierDriver = {};
                }
            });
        },
        carrierPartyEqpList(params){  // 设备 select 列表
            var that = this;
            postRequest(cmdUrl + "/cdEqp/selectEqp.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                if(res.result != null){
                    that.carrierPartyEqpNameList = res.result;
                }else{
                    that.carrierPartyEqpNameList = {};
                }
            });
        },
        selectThisCarrierContact(cdContactId){  // 根据联系人select 列表所选联系人 获取 联系人信息
            var that = this;
            if(cdContactId == '' || cdContactId == undefined){
                that.OrderCarrierContact = {};
                that.OrderCarrierContact.cdContactId = '';
                return false;
            }
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+cdContactId,function(res){
                if(res.result != null){
                    that.OrderCarrierContact = res.result;
                }else{
                    that.OrderCarrierContact = {};
                    that.OrderCarrierContact.cdContactId = '';
                }
            });
        },
        selectThisCarrierDriver(cdContactId){ // 根据司机select 列表所选司机 获取 司机信息
            var that = this;
            if(cdContactId == '' || cdContactId == undefined){
                that.OrderCarrierDriver = {};
                that.OrderCarrierDriver.cdContactId = '';
                return false;
            }
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+cdContactId,function(res){
                if(res.result != null){
                    that.OrderCarrierDriver = res.result;
                }else{
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierDriver.cdContactId = '';
                }
            });
        },
        selectThisCarrierEqp(cdEqpId){  // 根据车辆类型select 列表所选车辆类型 获取 车信息
            var that = this;
            if(cdEqpId != ''){
                var param = {};
                param.cdEqpId = cdEqpId;
                postRequest(cmdUrl + "/cdEqp/selectOneEqp.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                    if(res.result != null){
                        that.OrderCarrierEqp = res.result;
                    }else{
                        that.OrderCarrierEqp = {};
                        that.OrderCarrierEqp.cdEqpId = '';
                    }
                });
            }else{
                that.OrderCarrierEqp = {};
                that.OrderCarrierEqp.cdEqpId = '';
            }
        },
        addCarrierFun(){
            var that = this;
            if(that.OrderCarrier.cdPartyId === "" ){
                imitatePopup("请选择承运商","alert");
                return false;
            }
            if(that.OrderCarrier1.partyName == "" ){
                imitatePopup("承运商名称不能为空","alert");
                return false;
            }

            if($("#carrierDriverName").val().trim() == ""){
                imitatePopup("司机名字不能为空","alert");
                return false;
            }
            if($(".carrierDriverTel").val().trim() == ""){
                imitatePopup("司机手机号不能为空","alert");
                return false;
            }
            if($(".carrierEqpName").val().trim() == ""){
                imitatePopup("设备不能为空","alert");
                return false;
            }
            if($("#carrierEqpNo").val().trim() == ""){
                imitatePopup("车牌号不能为空","alert");
                return false;
            }

            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            var orderLnkList = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++) {
                var tjoOrder = {};
                tjoOrder.omOrderId = that.checkedOperaOrder[i].omOrderId;
                orderLnkList.push(tjoOrder);
            }

            var params = {
                carrierPartyInfo:{
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                remark: that.OrderCarrierRemark,
                dtmTime: that.timeHorizon1,
                orderLnkList:orderLnkList
            };
            postRequest(tmsUrl + "/save/newTfoOrderAuditStatus2?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                if(res.result){
                    // 关闭侧滑 ------ start
                    closeSideslip();
                    // 关闭侧滑 ------ end
                    that.getSearchVal();
                }else{
                    imitatePopup('保存有误，请稍后重试！','alert');
                }
            })
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
        getDriverInfo(val){ // 新建班次--司机姓名联想
            this.publicGetDriverInfo(val,1);
        },
        getDriverInfo1(val){ // 修改司机信息--司机姓名联想
            this.publicGetDriverInfo(val,2);
        },
        publicGetDriverInfo(val,params){ // cd -- 设备模板（传 设备-司机 模板，司机姓名）
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
                        that.driverList = [];
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
        chooseDriver(driveritem){ // 新建班次--选择联想的司机姓名
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
            this.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.showDriverList = false;
        },
        getPlateInfo(val){ // 新建班次--车牌号联想
            this.publicGetPlateInfo(val,1);
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
        getCompletionTime(){
            $("#completionTime").show();
            var mySchedule = new Schedule({
                el: '#completionTime',
                clickCb: function (y,m,d) {
                    $(".completionTime").html(formartDate(y,m,d));
                    $("#completionTime").hide();
                }
            });
        },
        getOrderDetails(template,order,isAbnormalPage){
            this.templateTitle = template;
            this.currentOrderId = order.omOrderId;
            var that = this;
            getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                // 订单详情
                if(data.result.order != null){
                    that.orderDetail = data.result.order;
                    that.orderDetail.completeTime = timestampToTime(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime(null);
                    that.orderDetail.expireTime = timestampToTime(null);
                }

                // 发货商
                if(data.result.shipperPartyInfo != null){
                    // 发货商 - 发货商
                    if(data.result.shipperPartyInfo.party != null){
                        that.shipperParty = data.result.shipperPartyInfo.party;
                    }else{
                        that.shipperParty = {
                            partyName:"",
                            partyCode:"",
                            isBuyer:null,
                            isVendor:null,
                            isTruck:null,
                            isWarehouse:null,
                            is3pl:null
                        };
                    }
                    // 发货商 - 联系人
                    if(data.result.shipperPartyInfo.imgContact != null){
                        that.shipperPartyContact = data.result.shipperPartyInfo.imgContact;
                    }else{
                        that.shipperPartyContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:""
                        };
                    }
                    // 发货商 - 地址
                    if(data.result.shipperPartyInfo.location != null){
                        that.shipperPartyLocation = data.result.shipperPartyInfo.location;
                    }else{
                        that.shipperPartyLocation = {
                            locationName:"",
                            //    locationType:null,
                            locationCode:"",
                            countryCode:"100000",
                            provinceCode:"",
                            cityCode:"",
                            districtCode:"",
                            street:"",
                            postCode:"",
                            address:""
                        };
                    }
                    // 发货商 - 地址联系人
                    if(data.result.shipperPartyInfo.contact != null){
                        that.shipperPartyLocationContact = data.result.shipperPartyInfo.contact;
                    }else{
                        that.shipperPartyLocationContact = {
                            contactName:"",
                            contactTel:""
                        };
                    }
                }else{
                    that.shipperParty = {
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                    that.shipperPartyContact = {
                        contactName:"",
                        contactTel:"",
                        contactEmail:""
                    };
                    that.shipperPartyLocation = {
                        locationName:"",
                        //    locationType:null,
                        locationCode:"",
                        countryCode:"100000",
                        provinceCode:"",
                        cityCode:"",
                        districtCode:"",
                        street:"",
                        postCode:"",
                        address:""
                    };
                    that.shipperPartyLocationContact = {
                        contactName:"",
                        contactTel:""
                    };
                }
                // 收货商
                if(data.result.receiptPartyInfo != null){
                    // 收货商 - 收货商
                    if(data.result.receiptPartyInfo.party != null){
                        that.receiptParty = data.result.receiptPartyInfo.party;
                    }else{
                        that.receiptParty = {
                            partyName:"",
                            partyCode:"",
                            isBuyer:null,
                            isVendor:null,
                            isTruck:null,
                            isWarehouse:null,
                            is3pl:null
                        };
                    }
                    // 收货商 - 联系人
                    if(data.result.receiptPartyInfo.imgContact != null){
                        that.receiptPartyContact = data.result.receiptPartyInfo.imgContact;
                    }else{
                        that.receiptPartyContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:""
                        };
                    }
                    // 收货商 - 地址
                    if(data.result.receiptPartyInfo.location != null){
                        that.receiptPartyLocation = data.result.receiptPartyInfo.location;
                    }else{
                        that.receiptPartyLocation = {
                            locationName:"",
                            //           locationType:null,
                            locationCode:"",
                            countryCode:"100000",
                            provinceCode:"",
                            cityCode:"",
                            districtCode:"",
                            street:"",
                            postCode:"",
                            address:""
                        };
                    }
                    // 收货商 - 地址联系人
                    if(data.result.receiptPartyInfo.contact != null){
                        that.receiptPartyLocationContact = data.result.receiptPartyInfo.contact;
                    }else{
                        that.receiptPartyLocationContact = {
                            contactName:"",
                            contactTel:""
                        };
                    }

                }else{
                    that.receiptParty = {
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                    that.receiptPartyContact = {
                        contactName:"",
                        contactTel:"",
                        contactEmail:""
                    };
                    that.receiptPartyLocation = {
                        locationName:"",
                        //    locationType:null,
                        locationCode:"",
                        countryCode:"100000",
                        provinceCode:"",
                        cityCode:"",
                        districtCode:"",
                        street:"",
                        postCode:"",
                        address:""
                    };
                    that.receiptPartyLocationContact = {
                        contactName:"",
                        contactTel:""
                    };
                }
                // 承运商
                if(data.result.carrierPartyInfo != null){
                    if(data.result.carrierPartyInfo.party != null){
                        that.OrderCarrier = data.result.carrierPartyInfo.party;
                    }else{
                        that.OrderCarrier = {
                            partyName:"",
                            partyCode:"",
                            partyType:"",
                            isBuyer:null,
                            isVendor:null,
                            isTruck:null,
                            isWarehouse:null,
                            is3pl:null
                        };
                    }
                    if(data.result.carrierPartyInfo.imgContact != null){
                        that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    }else{
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:""
                        };
                    }
                    if(data.result.carrierPartyInfo.contact != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.contact;
                    }else{
                        that.OrderCarrierDriver = {
                            contactName:"",
                            contactTel:""
                        };
                    }
                    if(data.result.carrierPartyInfo.eqp != null){
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.eqp;
                    }else{
                        that.OrderCarrierEqp = {
                            eqpNo:"",
                            eqpName:"",
                            eqpLength:"",
                            eqpWidth:"",
                            eqpHeight:"",
                            eqpStr1:"",
                            eqpStr2:"",
                            eqpBrand:"",
                            eqpSpec:"",
                            eqpType:""
                        };
                    }
                    if(data.result.carrierPartyInfo.location != null){
                        that.OrderCarrierLocation = data.result.carrierPartyInfo.location;
                    }else{
                        that.OrderCarrierLocation = {};
                    }
                }else{
                    that.OrderCarrier = {
                        partyName:"",
                        partyCode:"",
                        partyType:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:""
                    };
                    that.OrderCarrierDriver = {
                        contactName:"",
                        contactTel:""
                    };
                    that.OrderCarrierEqp = {
                        eqpNo:"",
                        eqpName:"",
                        eqpLength:"",
                        eqpWidth:"",
                        eqpHeight:"",
                        eqpStr1:"",
                        eqpStr2:"",
                        eqpBrand:"",
                        eqpSpec:"",
                        eqpType:""
                    };
                    that.OrderCarrierLocation = {};
                }

                // 包裹商品
                if (data.result.orderItemInfoList != null){
                    that.packageGoodsDetails = data.result.orderItemInfoList;
                }else {
                    that.packageGoodsDetails = [];
                }

                // 物流信息
                if(data.result.actInfo){
                    that.actCurrentInfo = data.result.actInfo.actCurrent;
                    that.actListInfo = data.result.actInfo.actList;
                }
               
                // 时间属性
                if(data.result.dtmList != null){
                    that.dtmListInfoList = data.result.dtmList;
                }else{
                    that.dtmListInfoList = [];
                }
                //that.eqpListInfoList = data.result.
                // 图片信息
                if (data.result.imgList != null) {
                    if (data.result.imgList.length != 0) {
                        var newList = [];
                        for(var i = 0 ; i < data.result.imgList.length; i++){
                            newList.push(ImgWebsite + data.result.imgList[i].extValue);
                        }
                        that.receiptImgList = newList;
                    } else {
                        that.receiptImgList = [];
                    }
                } else {
                    that.receiptImgList = [];
                }
            })
        },
        splitOrders(template,order,isAbnormalPage){
            var that = this;
            that.splitCount = "";
            that.abnormalPage = isAbnormalPage;
            that.isShowSplitList = "0";
            that.currentOrderId = order.omOrderId;
        },
        orderTracking(template,orderInfo){
            this.templateTitle = template;
            this.actInfo.refId = orderInfo.omOrderId;
            $(".actTime").val(getQueryTime(0) );
            var that = this;
            that.actInfo.actCode = "RDC";
            that.actInfo.actName = "";
            that.actInfo.remark = "";
            that.actInfo.actTime = "";
        },
        addActInfo(){
            var that = this;
            var actTime = $("#actTime").val().trim();
            if(actTime == ""){
                imitatePopup("请选择动态日期","alert");
                return false;
            }
            if(that.actInfo.remark.trim()==""){
                imitatePopup("请输入详细地址","alert");
                return false;
            }
            var date = new Date(actTime);
            that.actInfo.actTime = date;
            if(that.actInfo.actCode != "OTHER"){
                that.actInfo.actName = $("#selectName  option:selected").text();
            }else{
                if(that.actInfo.actName == ""){
                    imitatePopup("请输入路线类型","alert");
                    return false;
                }
                that.actInfo.actCode = that.actInfo.actName;
            }
            postRequest(tmsUrl + "/save/actInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.actInfo,function(res){
                if(res.result){
                    imitatePopup("添加成功",'alert');
                    // 关闭侧滑 ------ start
                    closeSideslip();
                }else{
                    imitatePopup('保存有误，请稍后重试！','alert');
                }
            })
        },
        changeOrderDetails(template){
            this.templateTitle = template;
        },
        createOrderSplit(){
            var that = this;
            var splitCountNum = parseInt(that.splitCount);
            var splitType = that.splitType;
            var splitTypeTxt = "";
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                if(splitType == 'master'){
                    that.showDetailList = false;
                    that.showTotalSingleList = true;
                }else{
                    that.showTotalSingleList = false;
                    that.showDetailList = true;

                }
                var params = {
                    masterOrderId:that.currentOrderId,
                    splitCount:that.splitCount,
                    splitType: that.splitType
                }
                postRequest(tmsUrl + "/split/houseOrderList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                    that.isShowSplitList = "1";
                    that.orderSplitList = res.result;
                })
            }else{
                imitatePopup("请输入大于1的正整数",'alert');
                that.isShowSplitList = "0";
                return false;
            }
        },
        orderSplitFun(){
            var that = this;
            var params = {
                masterOrderId:that.currentOrderId,
                houseOrderList:that.orderSplitList,
                splitType:that.splitType
            }
            postRequest(tmsUrl + "/split/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                if(res.msg == 'success' || res.msg == 'SUCCESS'){
                    if(res.msg.success == false){
                        imitatePopup(res.msg.message,'alert');
                        return false;
                    }
                };
                that.getSearchVal(1);
                closeSideslip();

            })
        },
        printDeliveryNote(){
            $(".ajax-load-pupup1").show();
            var that = this;
            that.OrderCarrierContact.cdContactId = '';
            that.orderList = [];
            var searchInfo = "";
            $('.reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/print/deliveryOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        openSelectYearAndMonthDiv(){
            $(".selectYearAndMonthDiv").toggle();
        },
        changeOrderTime(year,month){
            var that = this;
            that.orderTime = year+'-'+month;
        },
        getOrdersDaily(){
            var that = this;
            window.location.href = tmsUrl + "/export/tjoOrderCharge.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&date="+that.orderTime
            setTimeout(function(){
                $(".selectYearAndMonthDiv").hide();
            },1000)
        },
        addOrderCarrierFun(){
            var that = this;
            that.isDisable = false;
            that.shortShowType = '0';
            that.showDriverList = false;
            that.showPlateList = false;
            that.OrderCarrierContact.cdContactId = '';
            that.orderList = [];
            $('.reportMessages tbody .checkInp:checkbox').each(function() {
                if($(this).prop('checked') == true) {
                    that.orderList.push({
                        omOrderId:$(this).val()
                    })
                }
            });
            if(that.orderList.length == 0){
                imitatePopup("请勾选对应数据行",'alert');
                return false;
            }
            that.orderCarrierList = [];
            for(var i = 0; i < that.orderList.length; i++){
                var params = {};
                params.omOrderId = that.orderList[i].omOrderId;
                that.omOrderList.push(params);
                //获取订单列表
                getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+that.orderList[i].omOrderId,function(data){
                    var parms1 = {};
                    // 发货商
                    if(data.result.shipperPartyInfo != null){
                        if(data.result.shipperPartyInfo.party != null){
                            parms1.shipperPartyHave = data.result.shipperPartyInfo.party;
                        }else{
                            parms1.shipperPartyHave = {};
                        }
                    }else{
                        parms1.shipperPartyHave = {};
                    }
                    // 收货商
                    if(data.result.receiptPartyInfo != null){
                        if(data.result.receiptPartyInfo.party != null){
                            parms1.receiptPartyHave = data.result.receiptPartyInfo.party;
                        }else{
                            parms1.receiptPartyHave = {};
                        }
                    }else{
                        parms1.receiptPartyHave = {};
                    }
                    // 订单详情
                    if(data.result.order != null){
                        parms1.orderDetailHave = data.result.order;
                    }else{
                        parms1.orderDetailHave = {};
                    }
                    // 承运商
                    if(data.result.carrierPartyInfo != null){
                        if(data.result.carrierPartyInfo.party != null){
                            parms1.OrderCarrierHave = data.result.carrierPartyInfo.party;  // 承运商
                        }else{
                            parms1.OrderCarrierHave = {};
                        }
                        if (data.result.carrierPartyInfo.imgContactInfo != null) {
                            parms1.OrderCarrierContactHave = data.result.carrierPartyInfo.imgContactInfo;  // 承运商联系人
                        } else {
                            parms1.OrderCarrierContactHave = {
                                contactName:'',
                                contactTel:''
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
                    }else{
                        parms1.OrderCarrierHave = {};
                        parms1.OrderCarrierContactHave = {
                            contactName:'',
                            contactTel:''
                        };
                        parms1.OrderCarrierDriverHave = {};
                        parms1.OrderCarrierEqpHave = {};
                    }

                    that.orderCarrierList.push(parms1);
                })
            };
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
                    }else{
                        that.OrderCarrier = {
                            cdPartyId:""
                        };
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:"",
                            contactAddress:""
                        };
                        that.OrderCarrier1 = {
                            partyName:"",
                            partyCode:"",
                            isBuyer:"",
                            isVendor:"",
                            isTruck:"",
                            isWarehouse:"",
                            is3pl:""
                        };
                    }
                }else{
                    that.OrderCarrier = {
                        cdPartyId:""
                    };
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:"",
                        contactEmail:"",
                        contactAddress:""
                    };
                    that.OrderCarrier1 = {
                        partyName:"",
                        partyCode:"",
                        isBuyer:"",
                        isVendor:"",
                        isTruck:"",
                        isWarehouse:"",
                        is3pl:""
                    };
                }
            })
        },
        changePage(pageNum,clickStatus){
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage > pageNum){
                    $(".paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage = pageNum;
                }else{
                    $(".paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage = pageNum;
                }
            }else{
                this.currentPage = pageNum;
            }
            //翻页
            var that = this;
            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.isOrderInd= 'false';
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            }
            //获取订单列表
            postRequest(omsUrl + "/busTmQuery/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.totalPagesNum = res.pageInfo.total;
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(showPageNum){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.isOrderInd= 'false';
            if(showPageNum == 1){
                searchFormArr.pageInfo = {
                    pageNum:that.currentPage,
                    pageSize:that.queryPageSize
                }
            }else{
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize
                }
            }
            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(omsUrl + "/busTmQuery/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                if(showPageNum == 1){

                }else{
                    that.currentPage = 1;
                }
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.pageList = [];
                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        selectProvice(countycode){
            this.sfrProvinceList = getProvinceData(countycode);
            return this.sfrProvinceList;
        },
        selectCity(proviececode){
            this.sfrCityList = getCityData(proviececode);
            return this.sfrCityList;
        },
        selectDistrict(citycode){
            this.sfrDistrictList = getDistrictData(citycode);
            return this.sfrDistrictList;
        },
        getContactInfo(id){
            var that = this;
            postRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+id,function(data){
                that.shipperPartyLocationContact = data.result;
            })
        },
        getChargeInfo(orderItem) {
            var that = this;
            that.transportOrder = {
                actCode: orderItem.actCode,
                expireStatus: orderItem.expireStatus,
                completeStatus: orderItem.completeStatus,
                sendStatus: orderItem.sendStatus,
                exceptionStatus: orderItem.exceptionStatus,
                activeStatus: orderItem.activeStatus,
                auditStatus: orderItem.auditStatus,
                totalQty: orderItem.totalQty,
                qtyUnit: orderItem.qtyUnit,
                totalWeight: orderItem.totalWeight,
                totalVolume: orderItem.totalVolume,
                volumeUnit: orderItem.volumeUnit,
                weightUnit: orderItem.weightUnit
            };
            that.chargeInfo.qtyUnit = that.selectListData.qtyUnitList[0].code;
            that.chargeInfo.currency = that.selectListData.currencyList[0].code;
            that.charge.customerRefNo = orderItem.customerRefNo;
            that.charge.refId = orderItem.omOrderId;
            that.charge.refHash = orderItem.orderNo;
            that.charge.chargeFrom = that.logininf.tenantPartyNo;
            that.charge.chargeTo = orderItem.carPartyCode;
            that.charge.chargeFromName = that.logininf.tenantName;
            that.charge.chargeToName = orderItem.carPartyName;
            that.charge.rpType = "AP";
            var params = {
                refHash: orderItem.orderNo,
                activeStatus: 1
            };
            postRequest(bmsUrl + "/get/chargeVoListByChargeVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        saveChargeInfo: function () { // 新增收费信息
            var that = this;
            if (that.charge.chargeTo == "" || that.charge.chargeTo == undefined) {
                imitatePopup("应付费用请在订单排单后添加！",'alert');
                return false;
            }
            if (that.chargeInfo.chargeGroup == "" || that.chargeInfo.chargeGroup == undefined) {
                imitatePopup("请选择费用组类型！",'alert');
                return false;
            }
            if (that.chargeInfo.chargeType == "" || that.chargeInfo.chargeType == undefined) {
                imitatePopup("请选择费用类型",'alert');
                return false;
            }
            if (that.chargeInfo.qty == "" || that.chargeInfo.qty == undefined) {
                imitatePopup("请填写数量",'alert');
                return false;
            } else {
                //验证必须是数字
                var reg = new RegExp("^[1-9]+[0-9]*$")
                if (!reg.test(that.chargeInfo.qty)) {
                    alert("数量请填写正整数");
                    return false;
                }
            }
            if (that.chargeInfo.amount == "" || that.chargeInfo.amount == undefined) {
                imitatePopup("费用金额",'alert');
                return false;
            } else {
                var num = new RegExp("^(([1-9][0-9]*)|(([0]\\.\\d{1,2}|[1-9][0-9]*\\.\\d{1,2})))$")
                if (!num.test(that.chargeInfo.amount)) {
                    imitatePopup("费用金额任意正整数，正小数（小数位不超过2位）",'alert');
                    return false;
                }
            }
            if (that.chargeInfo.discountRate != "") {
                //验证必须是数字：/^[0-9]*$/
                var reg = new RegExp("^-?(0\\.\\d*[1-9]+\\d*)$")
                if (!reg.test(that.chargeInfo.discountRate)) {
                    alert("折扣请填写0-1之间的小数");
                    return false;
                }
            }
            that.charge.refSource = "tms";
            that.charge.refTo = "ORDER";
            that.charge.chargeInfoList = [];
            that.charge.chargeInfoList.push(that.chargeInfo);
            let params = that.charge;
            postRequest(bmsUrl + "/save/bmCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                    that.resetChargeInfo();//重置数据
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        updateChargeInfo(chargeInf) { // 修改收费信息
            var that = this;
            that.charge.bmChargeId = chargeInf.bmChargeId;
            that.chargeInfo.chargeGroup = chargeInf.chargeGroup;
            that.chargeInfo.chargeType = chargeInf.chargeType;
            that.chargeInfo.qty = chargeInf.qty;
            that.chargeInfo.qtyUnit = chargeInf.qtyUnit;
            that.chargeInfo.amount = chargeInf.amount;
            that.chargeInfo.currency = chargeInf.currency;
            that.chargeInfo.discountRate = chargeInf.discountRate;
            that.chargeInfo.remark = chargeInf.remark;
        },
        deleteChargeInfo(chargeInf) { // 删除收费信息
            var that = this;
            var params = {
                bmChargeId: chargeInf.bmChargeId,
                refHash: that.charge.refHash,
                activeStatus: 0
            }
            postRequest(bmsUrl + "/delete/bmCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        resetChargeInfo() { // 重置收费信息
            var that = this;
            that.charge.bmChargeId = "";
            that.chargeInfo.chargeGroup = "";
            that.chargeInfo.chargeType = "";
            that.chargeInfo.qty = "";
            that.chargeInfo.qtyUnit = "";
            that.chargeInfo.amount = "";
            that.chargeInfo.currency = "";
            that.chargeInfo.discountRate = "";
            that.chargeInfo.remark = "";
            that.chargeInfo.qtyUnit = that.selectListData.qtyUnitList[0].code;
            that.chargeInfo.currency = that.selectListData.currencyList[0].code;
        },
        publicChangeBtnStatus(){
            var that = this;
            setTimeout(function(){
                var permissionListObj  = "";
                var pageid = GetQueryString("objectId");
                var buttonObj = $(".butOperatePermission");
                getRequest(umsUrl+'/query/objectByUser.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&userId="+that.logininf.umUserId+"&parentUmObjectId="+pageid,function(res){
                    permissionListObj  = res.result;
                    //console.log(buttonObj.length);
                    for(var i = 0; i < permissionListObj.length; i++){
                        for(var j = 0; j < buttonObj.length; j++){
                            if(permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")){
                                for(var m = 0; m < permissionListObj[i].permissionList.length;m++){
                                    if(permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show"){
                                        //console.log(j);
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
                })
            },100)
        },
        resetOrderList(){
            window.location.reload();
        }
    },
    created:function(){
        var searchFormArr = {
            activeStatus: "1",
            startCreateTime: getQueryTime(1),
            isOrderInd:'false',
            pageInfo:{
                pageNum:1,
                pageSize:this.queryPageSize
            }
        };
        this.OrderCarrier = {};
        this.OrderCarrierContact = {};
        this.OrderCarrierDriver = {};
        this.OrderCarrierEqp = {};
        var that = this;
        that.sfrCountryList = getCountryData();
        that.dpDistrictList = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.timeHorizon = getQueryTime(1)+" - "+ getTodayTime();
        initSelectData(that);
        this.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(omsUrl + "/busTmQuery/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.pageInfo = res.pageInfo;
            that.totalPagesNum = res.pageInfo.total;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }

            that.publicChangeBtnStatus();
        });
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

function initSelectData(that){
    that.orderDetail = {
        orderFrom:"",
        orderTo:"",
        orderType:"",
        qtyUnit:"",
        weightUnit:"",
        volumeUnit:"",
        currency:""
    }
    that.receiptPartyLocationContact = {
        cdContactId:""
    }
    that.shipperPartyContact = {
        cdContactId:""
    }

    that.shipperParty = {
        cdPartyId:"",
        cdContactId:""
    }
    that.receiptPartyLocation = {
        countryCode:"",
        provinceCode:"",
        cityCode:"",
        districtCode:"",
        cdLocationId:""
    }
    that.shipperPartyLocation = {
        countryCode:"",
        provinceCode:"",
        cityCode:"",
        districtCode:""
    }

    that.shipperPartyLocationContact = {
        cdContactId:""
    }

    that.receiptParty = {
        cdPartyId:""
    }

    that.receiptPartyContact = {
        cdContactId:""
    }

    that.OrderCarrier ={
        cdPartyId:""
    }

    that.OrderCarrierDriver = {
        cdContactId:""
    }

    that.OrderCarrierEqp = {
        cdEqpId:""
    }

    that.orderItemDetail = {
        orderItem:{
            currency:"",
            qtyUnit:"",
            volumeUnit:""
        }
    }

    that.queryParam = {
        orderFrom:"",
        orderTo:"",
        completeStatus:"",
        sendStatus:"",
        expireStatus:"",
        exceptionStatus:"",
        activeStatus: "1",
        payStatus:"",
        auditStatus:"",
        actCode:"",
        orderType:""
    }
}
// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.timeHorizon1 = start.format('YYYY-MM-DD HH:mm');
    });
});

