var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isDisable:false,
        showDriverList:false,
        showPlateList:false,
        showDriverList1:false,
        showPlateList1:false,
        getDriverListTimer:null,
        getEpdListTimer:null,
        clearShow:true,
        searchInf:[],
        pageList:[],
        driverList:[],
        plateList:[],
        totalPagesNum:"",
        orderDetail:{},
        logininf:{},
        currentDqIndex:"",
        contactList:{},
        currentStataionIndex:"",
        templateTitle:"新增联系人",
        sendGoodsDtm:"",
        allotOrderLnkList:[{}],
        drawWayPathList:[{}],
        OrderCarrier:{
            cdPartyId:""
        },
        OrderCarrier1:{
            partyName:"",
            partyCode:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        shipperPartyLocation:{
            provinceCode:"",
            districtCode:"",
            cityCode:""
        },
        receiptPartyLocation:{
            provinceCode:"",
            districtCode:"",
            cityCode:""
        },
        selectLocationInf:{
            provinceCode:"",
            districtCode:"",
            cityCode:""
        },
        newCarrierDriver:{
            eqpType:"",
            eqpNature:""
        },
        newCarrierEqp:{},
        newCarrierRemark:'',
        stationAddress:[],
        orderDetails:{},
        dpDistrictList:{},
        currentAssignOrder:{},
        dpCityList:{},
        dpProvinceList:{},
        dpDistrictList1:{},
        dpCityList1:{},
        dpProvinceList1:{},
        dpCityList2:{},
        dpProvinceList2:{},
        currentClasses:{},
        dpLocationCode:"",
        OrderCarrierParty:{},
        OrderCarrierContact:{
            contactName:"",
            contactTel:"",
            contactEmail:"",
            contactAddress:""
        },
        OrderCarrierDriver:{},
        OrderCarrierRemark: "",
        OrderCarrierEqp:{
            eqpType:"",
            eqpNature:""
        },
        checkedOperaOrder: [],
        deliveryTime:getCurrentDate(),
        queryPageSize:20,
        multipleNum:12,
        stationLocationList:[{
            location:{
                provinceCode:"",
                districtCode:"",
                cityCode:""
            }
        }],
        queryParam:{
            completeStatus:"",
            auditStatus:"",
            billStatus: "",
            isDistribute:"",
            str1:"",
            carDrvContactName:"",
            carDrvContactTel:"",
            carDrvEqpNo:""
        },
        resPartyList:[],
        shortShowType:"0",
        allPosArray:[],  // 所有的点（已分配订单列表） stoLatLng 数组
        endpointArrayKong:'0',
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
        showSaveBtn:'0',
        selectOneBcItem:{},
        selectOneBcList:[],
        temporaryDrawList:[],
        orderNolist: [],
        allPosArraylist: [],
        chargeInfoTable: {}, //费用列表
        transportOrder: {},

        showShareCarrierType: "0",
        showShareCarType: "0",
        shareInfoList:[],
        timeHorizon:"", //创建时间范围
        timeHorizon1:"",//完成时间范围
        linkNames: ["班次管理","班次地图"],
        linkHrefs: []
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
        printCustomer(){
            var that = this;
            that.orderList = [];
            var searchInfo = "";
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请至少选择一条数据行","alert");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/print/customerEAOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;

            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },

        printCustomer_AB(type){
            var that = this;
            that.orderList = [];
            var searchInfo = "",printFormat = "";
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请至少选择一条数据行","alert");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val();
                }
            });
            switch(type)
            {
                case 'A':
                    printFormat = "&printFormatType=FORMATA";
                    break;
                case 'B':
                    printFormat = "&printFormatType=FORMATB";
                    break;
            }
            window.location.href = tmsUrl + "/print/tfoOrderJobDetails?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+printFormat+searchInfo;
            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },

        batchSettlement(){ // 批量结算
            var that = this;
            if (that.checkedOperaOrder.length == 0) {
                imitatePopup("请至少选择一条数据行", "alert");
                return false;
            }
            var settlementArr = [];
            for (var i = 0; i < that.checkedOperaOrder.length; i++) {
                settlementArr.push(that.checkedOperaOrder[i].omOrderId);
            }
            postRequest(tmsUrl + "/batchComputeContractCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, settlementArr, function (data) {
                imitatePopup("结算完成！","alert");
            })
        },

        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:"",
                eqpNature:"",
                eqpSpec:""
            };
            that.showDriverList = false;
            that.showPlateList = false;
            that.shortShowType = '0';
            that.OrderCarrier = {
                cdPartyId:""
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
            that.OrderCarrierContact = {
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:""
            };
            /*var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:"1"
            };*/
            var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:1
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.result != null){
                    if(data.result.length > 0){
                        that.OrderCarrier = data.result[0];
                        const { partyName, partyCode, isBuyer, isVendor, isTruck, isWarehouse, is3pl, imgContactName, imgContactTel, imgContactEmail, imgContactAddress } = that.OrderCarrier
                        that.OrderCarrier1 = {
                            partyName,// 承运商 名称
                            partyCode,// 承运商 编码
                            isBuyer,// 承运商 是否买家
                            isVendor,// 承运商 是否卖家
                            isTruck,// 承运商 是否卡车公司
                            isWarehouse, // 承运商 是否仓库
                            is3pl// 承运商 是否第三方物流
                        }
                        that.OrderCarrierContact = {
                            contactName: imgContactName, // 承运商联系人
                            contactTel: imgContactTel,// 承运商电话
                            contactEmail: imgContactEmail,// 承运商邮箱
                            contactAddress: imgContactAddress,// 承运商地址
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
                        console.log(data);
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
            if(driveritem.eqpNature==null){
                driveritem.eqpNature = "";
            }
            this.OrderCarrierEqp.eqpNature = driveritem.eqpNature;
            this.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
            this.OrderCarrierEqp.loadVolume = driveritem.loadVolume;
            this.OrderCarrierEqp.loadWeight = driveritem.loadWeight;
            this.showDriverList = false;
        },
        chooseDriver1(driveritem){ // 修改司机信息--选择联想的司机姓名
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
            if(driveritem.eqpNature==null){
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
            this.OrderCarrierEqp.loadVolume = plateitem.loadVolume;
            this.OrderCarrierEqp.loadWeight = plateitem.loadWeight;
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
            $.ajaxFileUpload({
                url: tmsUrl + '/tfoOrderInfo/uploadExcelFile.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    imitatePopup(data.result.resultMsg,"alert");
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    that.queryParam = {
                        completeStatus:"",
                        auditStatus:"",
                        billStatus: "",
                        isDistribute:""
                    }
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:1,
                            pageSize:that.queryPageSize
                        },
                        orderType:"TFO",
                        startCompleteTime: getTodayTime(),
                        endCompleteTime: getTodayTime()
                    }

                    //获取订单列表
                    postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.totalPagesNum = res.pageInfo.total;
                        that.pageList = [];
                        that.currentPage = 1;
                        $(".paging .pagingCon .pagination").animate({
                            "left": "0px"
                        },300);
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    imitatePopup(上传文件失败,"alert");
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    //  console.error(e);
                }
            });
        },
        exportShiftReport(){  //导出班次报表
            var that = this;
            var searchInfo = "";
            var queryParam;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                queryParam = that.publicGetQueryParam('1');
            }else{
                queryParam = that.publicGetQueryParam('0');

            }
            for(key in queryParam){
                searchInfo += "&"+key+"="+queryParam[key]
            }
            $(".ajax-load-pupup1").show();
            window.location.href = tmsUrl + "/export/tfoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportShiftReport1(){  //导出班次表-2
            var that = this;
            var searchInfo = "";
            var queryParam;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                queryParam = that.publicGetQueryParam('1');
            }else{
                queryParam = that.publicGetQueryParam('0');

            }
            for(key in queryParam){
                searchInfo += "&"+key+"="+queryParam[key]
            }
            $(".ajax-load-pupup1").show();
            window.location.href = tmsUrl + "/export/tfoOrder2?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportTfoCost(){  //导出班次报表
            var that = this;
            var searchInfo = "";
            var queryParam;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                queryParam = that.publicGetQueryParam('1');
            }else{
                queryParam = that.publicGetQueryParam('0');

            }
            for(key in queryParam){
                searchInfo += "&"+key+"="+queryParam[key]
            }
            $(".ajax-load-pupup1").show();
            window.location.href = tmsUrl + "/export/tfoCostReport?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        publicGetQueryParam(type){
            var searchFormArr = {};
            switch(type)
            {
                case '0':

                    break;
                case '1':
                    searchFormArr = this.queryParam;
                    var startTimeVal =this.timeHorizon.split(" - ")[0];
                    var endTimeVal =this.timeHorizon.split(" - ")[1];
                    var crcdStartTimeVal =this.timeHorizon1.split(" - ")[0];
                    var crcdEndTimeVal =this.timeHorizon1.split(" - ")[1];
                    searchFormArr.startCompleteTime = startTimeVal;
                    searchFormArr.endCompleteTime = endTimeVal;
                    searchFormArr.startCreateTime = crcdStartTimeVal;
                    searchFormArr.endCreateTime = crcdEndTimeVal;
                    break;
            }
            return searchFormArr;
        },
        exportShiftReportDetail(){  //导出班次详情报表
            var that = this;
            var searchInfo = "";
            var queryParam;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                queryParam = that.publicGetQueryParam('1');
            }else{
                queryParam = that.publicGetQueryParam('0');

            }
            for(key in queryParam){
                searchInfo += "&"+key+"="+queryParam[key]
            }
            $(".ajax-load-pupup1").show();
            window.location.href = tmsUrl + "/export/tfoOrderDetail?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportTruckingReport(){
            var that = this;
            that.orderList = [];
            var searchInfo = "";
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请至少选择一条数据行","alert");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/print/tfoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;

            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
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
        },
        saveAddress(){
            var that = this;
            var provinceName = $(".stationCon .provinceName option:selected").text();
            var cityName = $(".stationCon .cityName option:selected").text();
            var districtName = $(".stationCon .districtName option:selected").text();
            var provinceVal = $(".stationCon .provinceName option:selected").val();
            var cityVal = $(".stationCon .cityName option:selected").val();
            var districtVal = $(".stationCon .districtName option:selected").val();
            var stationAddress = provinceName + cityName + districtName;
            that.$set(that.stationAddress,that.currentStataionIndex,stationAddress);
            that.stationLocationList[that.currentStataionIndex].location = {
                cityCode:cityVal,
                districtCode:districtVal,
                provinceCode:provinceVal
            }
            $(".maskLayer").hide();
        },
        saveStationLocation(){
            var that = this;
            if(that.OrderCarrier.cdPartyId === "" ){
                imitatePopup("请选择承运商","alert");
                return false;
            }
            if(that.OrderCarrier1.partyName == "" ){
                imitatePopup("承运商名称不能为空","alert");
                return false;
            }
            var deliveryDate = "",shipTimeVal = $("#shipTime").val();
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
            if($("#carrierEqpNo").val().trim() == "" ){
                imitatePopup("车牌号不能为空","alert");
                return false;
            }
            if(that.OrderCarrierEqp.eqpNature == ""){
                imitatePopup("请选择设备性质","alert");
                return false;
            }
            deliveryDate = that.deliveryTime;
            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            var params = {
                carrierPartyInfo:{
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                remark: that.OrderCarrierRemark,
                dtmTime:deliveryDate
            };
            postRequest(tmsUrl + "/insert/tfoOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                imitatePopup("新增班次成功","alert");
                // 关闭侧滑 ------ start
                closeSideslip();
                that.currentPage = 1;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                var searchFormArr = {
                    pageInfo:{
                        pageNum:1,
                        pageSize:that.queryPageSize
                    },
                    orderType:"TFO",
                    startCompleteTime: getTodayTime(),
                    endCompleteTime: getTodayTime()
                };
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.tableOrderList = res.result;
                    that.totalPagesNum = res.pageInfo.total;
                    that.pageList = [];
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            })
        },
        editDriverInfo(){
            var that = this;
            if($("#newCarrierDriverName").val().trim() == "" && $(".newCarrierDriverTel").val().trim() == "" && $("#newCarrierEqpNo").val().trim() == "" && $(".newCarrierEqpName").val().trim() == ""){
                imitatePopup("请先输入司机信息再保存","alert");
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
            if(that.newCarrierEqp.eqpNature == ""){
                imitatePopup("请选择设备性质","alert");
                return false;
            }

            that.OrderCarrierEqp.eqpBrand = that.newCarrierEqp.eqpBrand;
            that.OrderCarrierEqp.eqpType = that.newCarrierEqp.eqpType;
            that.OrderCarrierEqp.eqpNature = that.newCarrierEqp.eqpNature;
            that.OrderCarrierEqp.eqpSpec = that.newCarrierEqp.eqpSpec;
            that.OrderCarrierEqp.eqpLength = that.newCarrierEqp.eqpLength;
            that.OrderCarrierEqp.eqpWidth = that.newCarrierEqp.eqpWidth;
            that.OrderCarrierEqp.eqpHeight = that.newCarrierEqp.eqpHeight;
            that.OrderCarrierEqp.eqpStr1 = that.newCarrierEqp.eqpStr1;
            that.OrderCarrierEqp.eqpStr2 = that.newCarrierEqp.eqpStr2;
            that.OrderCarrierEqp.loadVolume = that.newCarrierEqp.loadVolume;
            that.OrderCarrierEqp.loadWeight = that.newCarrierEqp.loadWeight;

            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            var orderHeadModel = {
                carrierPartyInfo:{
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                remark: that.editDriverInfo,
                order:that.orderDetails
            };
            postRequest(tmsUrl + "/save/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderHeadModel,function(data){

                that.newCarrierDriver = {
                    eqpType:""
                };
                that.newCarrierEqp = {};
                that.newCarrierRemark = "";
                var searchFormArr = that.queryParam;
                if(searchFormArr.completeStatus == ""){
                    delete searchFormArr.completeStatus;
                }
                if(searchFormArr.auditStatus == ""){
                    delete searchFormArr.auditStatus;
                }
                if(searchFormArr.billStatus == ""){
                    delete searchFormArr.billStatus;
                }
                if(searchFormArr.isDistribute == ""){
                    delete searchFormArr.isDistribute;
                }
                searchFormArr.orderType = "TFO";
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                searchFormArr.startCompleteTime = startTimeVal;
                searchFormArr.endCompleteTime = endTimeVal;
                searchFormArr.pageInfo ={
                    pageNum:that.currentPage,
                    pageSize:that.queryPageSize
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.billStatus == undefined){
                        that.queryParam.billStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.publicChangeBtnStatus();

                })

            })
        },
        batchDeleteOrder(){
            var that = this;
            var toDeleteArr = [];
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请先勾选一条数据行","alert");
                return false;
            }
            for(var i = 0 ; i < that.checkedOperaOrder.length;i++){
                toDeleteArr.push(that.checkedOperaOrder[i].omOrderId);
            }
            postRequest(tmsUrl + "/delete/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,toDeleteArr,function(data){

                var searchFormArr = that.queryParam;
                searchFormArr.orderType = "TFO";
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                searchFormArr.startCompleteTime = startTimeVal;
                searchFormArr.endCompleteTime = endTimeVal;
                searchFormArr.pageInfo = {
                    pageNum: that.currentPage,
                    pageSize:that.queryPageSize
                }
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.billStatus == undefined){
                        that.queryParam.billStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.totalPagesNum = res.pageInfo.total
                    that.pageList = [];
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();

                })

            })
        },
        addStationLocation(){
            this.stationLocationList.push({
                location:{
                    provinceCode:"",
                    districtCode:"",
                    cityCode:""
                }
            })
        },
        selectCity(proviececode){
            this.dpCityList = getCityData(proviececode);
            this.shipperPartyLocation.districtCode = "";
            this.shipperPartyLocation.cityCode = "";
            return this.dpCityList;
        },
        selectDistrict(citycode){
            this.dpProvinceList = getDistrictData(citycode);
            this.shipperPartyLocation.districtCode = "";
            return this.dpProvinceList;
        },
        selectCity1(proviececode){
            this.dpCityList1 = getCityData(proviececode);
            this.receiptPartyLocation.districtCode = "";
            this.receiptPartyLocation.cityCode = "";
            return this.dpCityList1;
        },
        selectDistrict1(citycode){
            this.dpProvinceList1 = getDistrictData(citycode);
            this.receiptPartyLocation.districtCode = "";
            return this.dpProvinceList1;
        },
        selectCity2(proviececode){
            this.dpCityList2 = getCityData(proviececode);
            this.selectLocationInf.districtCode = "";
            this.selectLocationInf.cityCode = "";
            return this.dpCityList2;
        },
        selectDistrict2(citycode){
            this.dpProvinceList2 = getDistrictData(citycode);
            this.selectLocationInf.districtCode = "";
            return this.dpProvinceList2;
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
            $(".maskLayer1").hide();
        },
        addConactFun(){
            this.locationContactList.push({
                contactType:"",
                isDefault:""
            });
        },
        againSchedule(orderItem){
            $(".maskLayer1").show();
            $("#scheduleRemark").val("");
            this.currentAssignOrder = orderItem;
        },
        againScheduleBtn(){
            var that = this;
            if($("#scheduleRemark").val().trim() == ""){
                imitatePopup("请输入再次排单原因","alert");
                return false;
            }
            var params = [];
            params.push({
                orderId: that.currentAssignOrder.omOrderId,
                orderInd:that.currentAssignOrder.orderInd,
                remark: $("#scheduleRemark").val()
            });
            postRequest(tmsUrl + "/again/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                $(".maskLayer1").hide();
                if(data.result.success == true){
                    imitatePopup("再次排单成功",'alert');
                    var params1 = {
                        refId: that.currentClasses.omOrderId,
                        refNo: that.currentClasses.orderNo
                    }
                    postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(data){
                        if(data.result.orderLnkList != null){    // 已分配订单列表
                            that.allotOrderLnkList = data.result.orderLnkList;
                        }else{
                            that.allotOrderLnkList = [];
                        }
                    })
                }else{
                    imitatePopup(data.result.message,'alert');
                }
            })
        },
		deleteOrderDetails(orderItem){
			var that = this;
			var revocationOrder = [];
			var params = {
				fromOrderId: that.currentClasses.omOrderId,
				fromOrderNo: that.currentClasses.orderNo,
				toOrderId: orderItem.omOrderId,
				toOrderNo: orderItem.orderNo
			};
			revocationOrder.push(params);
			//撤回已分配订单
			postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){

                var params1 = {
                    refId: that.currentClasses.omOrderId,
                    refNo: that.currentClasses.orderNo
                }
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(data){
                    if(data.result.orderLnkList != null){    // 已分配订单列表
                        that.allotOrderLnkList = data.result.orderLnkList;
                    }else{
                        that.allotOrderLnkList = [];
                    }
                })
            })
        },
        getOrderDetails(title,clicktype,dpItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = clicktype;
            this.currentClasses = dpItem;

            that.OrderCarrier1 = {};
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:"",
                eqpNature:""
            };
            that.OrderCarrierRemark = "";
            that.OrderCarrierContact = {};
            that.showDriverList = false;
            that.showPlateList = false;
            that.newCarrierEqp = {
                eqpType:"",
                eqpNature:""
            };
            that.newCarrierRemark = "";
            that.showDriverList1= false;
            that.showPlateList1= false;

            var params = {
                refId: dpItem.omOrderId,
                refNo: dpItem.orderNo
            };
            that.isDisable = true;
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                that.orderDetails = data.result.order;  // 订单信息
                // 承运商
                if(data.result.carrierPartyInfo != null){
                    that.OrderCarrierRemark = data.result.carrierPartyInfo.remark;
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
                            eqpType:"",
                            eqpNature:""
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
                        eqpType:"",
                        eqpNature:""
                    };
                    that.OrderCarrierContact = {};
                }

                if(data.result.stationLocationInfoList != null){     // 停靠站点
                    that.stationLocationList = data.result.stationLocationInfoList;
                }else{
                    that.stationLocationList = [];
                }
                if(data.result.orderLnkList != null){    // 已分配订单列表
                    that.allotOrderLnkList = data.result.orderLnkList;
                }else{
                    that.allotOrderLnkList = [];
                }

                if(data.result.dtmTime != null){  // 发货时间
                    that.deliveryTime = data.result.dtmTime
                }else{
                    that.deliveryTime = "";
                }
            })
        },
        chooseStationFun(index){
            var that = this;
            that.currentStataionIndex = index;
            $(".maskLayer").show();
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
            var searchFormArr = this.queryParam;
            if(searchFormArr.completeStatus == ""){
                delete searchFormArr.completeStatus;
            }
            if(searchFormArr.auditStatus == ""){
                delete searchFormArr.auditStatus;
            }
            if(searchFormArr.billStatus == ""){
                delete searchFormArr.billStatus;
            }
            if(searchFormArr.isDistribute == ""){
                delete searchFormArr.isDistribute;
            }
            searchFormArr.orderType = "TFO";
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            var that = this;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                if(that.queryParam.completeStatus == undefined){
                    that.queryParam.completeStatus = "";
                }
                if(that.queryParam.auditStatus == undefined){
                    that.queryParam.auditStatus = "";
                }
                if(that.queryParam.billStatus == undefined){
                    that.queryParam.billStatus = "";
                }
                if(that.queryParam.isDistribute == undefined){
                    that.queryParam.isDistribute = "";
                }
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            that.tableOrderList = {};
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                if(searchFormArr.completeStatus == ""){
                    delete searchFormArr.completeStatus;
                }
                if(searchFormArr.auditStatus == ""){
                    delete searchFormArr.auditStatus;
                }
                if(searchFormArr.billStatus == ""){
                    delete searchFormArr.billStatus;
                }
                if(searchFormArr.isDistribute == ""){
                    delete searchFormArr.isDistribute;
                }

                searchFormArr.orderType = "TFO";
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
                if(startTimeVal == "" && endTimeVal == "" && crcdStartTimeVal == "" && crcdEndTimeVal == ""){
                    $(".crcdStartTimeSpan").val(getQueryTime(1));
                    crcdStartTimeVal = getQueryTime(1);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
	            searchFormArr.startCompleteTime = startTimeVal;
	            searchFormArr.endCompleteTime = endTimeVal;
                searchFormArr.startCreateTime = crcdStartTimeVal;
                searchFormArr.endCreateTime = crcdEndTimeVal;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize
                }
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.billStatus == undefined){
                        that.queryParam.billStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.currentPage = 1;
                    that.totalPagesNum = res.pageInfo.total;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            }else{
                imitatePopup("请输入大于1且小于2000的正整数",'alert');
                return false;
            }
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
        queryCharge(that) {
            var params = {
                refHash: that.charge.refHash,
                activeStatus: 1
            };
            postRequest(bmsUrl + "/get/chargeVoListByChargeVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            });
        },
        computeContractCharge () { // 新增收费信息
            var that = this;
            let params = that.charge;
            postRequest(tmsUrl + "/computeContractCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&orderId=" + params.refId, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.resetChargeInfo();//重置数据
                    that.queryCharge(that);
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
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
        },
        /*共享车辆 start*/
        shareCar(orderItem){
            let that = this;
            that.OrderCarrierDriver={};
            that.OrderCarrier1 = {};
            that.OrderCarrierEqp = {};
            that.OrderCarrierContact = {};
            that.shareInfoList = [];
            let shareTime = {
                dtmTime: timestampToTime2(orderItem.shpDtmTime)+" 00:00",
                dtmTime1: timestampToTime2(orderItem.shpDtmTime)+" 23:59"
            }
            that.shareInfoList.push(shareTime);
            let params = {
                refId: orderItem.omOrderId,
                refNo: orderItem.orderNo
            };
            that.isDisable = true;
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data) {
                that.orderDetails = data.result.order;  // 订单信息
                // 承运商
                if (data.result.carrierPartyInfo != null) {
                    that.OrderCarrierRemark = data.result.carrierPartyInfo.remark;
                    if (data.result.carrierPartyInfo.party != null) {
                        that.OrderCarrier1 = data.result.carrierPartyInfo.party;
                    } else {
                        that.OrderCarrier1 = {};
                    }

                    if (data.result.carrierPartyInfo.contact != null) {
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.contact;
                    } else {
                        that.OrderCarrierDriver = {};
                    }

                    if (data.result.carrierPartyInfo.eqp != null) {
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.eqp;
                    } else {
                        that.OrderCarrierEqp = {
                            eqpType: "",
                            eqpNature: ""
                        };
                    }

                    if (data.result.carrierPartyInfo.imgContact != null) {
                        that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    } else {
                        that.OrderCarrierContact = {};
                    }

                } else {
                    that.OrderCarrier1 = {};
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {
                        eqpType: "",
                        eqpNature: ""
                    };
                    that.OrderCarrierContact = {};
                }
            })
            $(".maskLayer2").show();
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

        //删除时间
        removeShareInfo(index){
            let that = this;
            this.shareInfoList.splice(index,1);
        },
        //修改时间
        updateShareInfo(index,shareInfo){
            let that = this;
            $("#shareStartTime").val(shareInfo.dtmTime);
            $("#shareEndTime").val(shareInfo.dtmTime1);
            this.shareInfoList.splice(index,1);
        },
        //共享车辆
        saveShareVehicleOrder() {
            let that = this;
            if (that.OrderCarrier1.partyName =="" || that.OrderCarrier1.partyName == undefined ) {
                imitatePopup("承运商名称不能为空", "alert");
                return false;
            }

            if (that.OrderCarrierEqp.eqpName  == "" || that.OrderCarrierEqp.eqpName  == undefined) {
                imitatePopup("设备名称不能为空", "alert");
                return false;
            }

            if (that.OrderCarrierDriver.contactName =="" || that.OrderCarrierDriver.contactName == undefined ) {
                imitatePopup("司机姓名不能为空", "alert");
                return false;
            }

            if (that.OrderCarrierDriver.contactTel  == "" || that.OrderCarrierDriver.contactTel  == undefined) {
                imitatePopup("司机电话不能为空", "alert");
                return false;
            }

            if (that.OrderCarrierEqp.eqpNo  == "" || that.OrderCarrierEqp.eqpNo  == undefined) {
                imitatePopup("车牌号不能为空", "alert");
                return false;
            }
            if (that.OrderCarrierEqp.eqpNature == "" || that.OrderCarrierEqp.eqpNature == undefined) {
                imitatePopup("请选择设备性质", "alert");
                return false;
            }
            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
            //共享时间
            let dtmModelList = [];
            //共享地址
            let locationModelList = [];
            if (that.shareInfoList==0){
                imitatePopup("请填写共享时间", "alert");
                return false;
            }
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
                /*var startLocationModel = {
                    address:that.shareInfoList[i].startAddress,
                    locationType:"STO"
                }
                locationModelList.push(startLocationModel);
                var endLocationModel = {
                    address:that.shareInfoList[i].endAddress,
                    locationType:"STO"

                }
                locationModelList.push(endLocationModel);*/
            }
            //共享设备
            let eqpInfoList = [];
            let eqpInfo = {
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
                order: {
                    orderType: 'SFO',
                    orderFrom: that.logininf.tenantNo,
                },
                partyContactInfo: {
                    party: that.OrderCarrier1,
                    imgContact: that.OrderCarrierContact,
                },
                eqpInfoList: eqpInfoList,
                dtmModelList: dtmModelList
            };
            postRequest(tmsUrl + "/busShared/insertAndPullSfoOrderInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    imitatePopup("共享车辆成功", "alert");
                    $(".maskLayer2").hide();
                } else {
                    imitatePopup(res.msg,"alert");
                    return false;
                }
            })
        },
        showShareDetails(type) {
            let that = this;
            if (type==0) {
                that.showShareCarrierType = '1';
            }else{
                that.showShareCarType = '1';
            }
        },
        hideShareDetails(type) {
            let that = this;
            if (type == 0) {
                that.showShareCarrierType = '0';
            }else{
                that.showShareCarType = '0';
            }
        },
        /*共享车辆 end*/

    },
    created:function(){
        var that = this;
        that.timeHorizon1 = getQueryTime(1)+" - "+ getTodayTime(-30);
        this.dpDistrictList = getProvinceData("100000");
        this.dpDistrictList1 = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
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
        that.timeHorizon = getTodayTime()+" - "+ getTodayTime();

	  	//获取订单列表
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            },
            orderType:"TFO",
            startCompleteTime: getTodayTime(),
            endCompleteTime: getTodayTime()
        };
        postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.totalPagesNum = res.pageInfo.total;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })
    },
    filters:{
        timestampToTime(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
                //	var currentTime = timestamp - offsetMs;
                var currentTime = timestamp;
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

function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}

// ================= 百度
// 百度地图API功能
/*
var map = new BMap.Map("container");
map.centerAndZoom(new BMap.Point(121.473658,31.230378), 11);
map.enableScrollWheelZoom(true);*/

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker(null, function(start, end, label) {
        app.timeHorizon1 = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('input[name="deliveryTime"]').daterangepicker({
        "singleDatePicker": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "timePickerIncrement": 1,
    }, function(start, end, label) {
        app.deliveryTime= start.format('YYYY-MM-DD HH:mm');
    });
});
