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
        allChecked: false,
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
        startDeliveryDate: getTodayTime(),
        endDeliveryDate: getTodayTime(),
        newCarrierDriver:{
            eqpType:""
        },
        newCarrierEqp:{},
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
        OrderCarrierEqp:{
            eqpType:""
        },
        checkedOperaOrder:[],
        deliveryTime:"",
        queryPageSize:12,
        multipleNum:12,
        queryPageSize1:12,
        multipleNum1:12,
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
            isDistribute:""
        },
        deliveryDateTime:getQueryTime(-1),
        resPartyList:[],
        shortShowType:"0",
        pathQueryParams:{},
        pathScheduleOrder:[],
        startCompleteDate: getQueryTime(0),
        orderStatistics:{},
        waitScheduleOrder:[],
        currentPage1:1,
        pageList1:[],
        totalPagesNum1:'',
        queryParam1:{},
        orderList:[],
        allocatedOrderArr:[]

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
                alert("请至少选择一条数据行");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.classesListCon .reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/print/customerEAOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;

            $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportCustomerEAOrderItem(){
            var that = this;
            that.orderList = [];
            var searchInfo = "";
            if(that.checkedOperaOrder.length == 0){
                alert("请至少选择一条数据行");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.classesListCon .reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/export/customerEAOrderItem?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;

            $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.OrderCarrierDriver = {};
            that.OrderCarrierEqp = {
                eqpType:""
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
            this.OrderCarrierEqp.eqpSpec = driveritem.eqpSpec;
            this.OrderCarrierEqp.eqpLength = driveritem.eqpLength;
            this.OrderCarrierEqp.eqpWidth = driveritem.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = driveritem.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = driveritem.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = driveritem.eqpStr2;
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
        chooseTheFile(){
            this.filesUpload();
            this.clearShow = false;
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

                    that.startDeliveryDate = getTodayTime();
                    that.endDeliveryDate = getTodayTime();
                    //获取订单列表
                    postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        getStartDeliveryTime(){
        	var that = this;
        	$("#startTime").show();
			var mySchedule = new Schedule({
				el: '#startTime',
				clickCb: function (y,m,d) {
					$(".startTimeSpan").val(formartDate(y,m,d));
					that.startDeliveryDate = formartDate(y,m,d);
					$("#startTime").hide();
				}
			});
        },
        getStartDeliveryTimeVal(){
        	var startTimeSpan = $("#startTimeSpanVal").val();
			if(startTimeSpan == ""){
				this.startDeliveryDate = "";
			}
        },
        getEndDeliveryTime(){
        	var that = this;
        	$("#endTime").show();
			var mySchedule = new Schedule({
				el: '#endTime',
				clickCb: function (y,m,d) {
					$(".endTimeSpan").val(formartDate(y,m,d));
					that.deliveryDate = formartDate(y,m,d);
					$("#endTime").hide();
				}
			});
        },
        getEndDeliveryTimeVal(){
        	var endTimeSpan = $("#endTimeSpanVal").val();
			if(endTimeSpan == ""){
				this.endDeliveryDate = "";
			}
        },
        exportShiftReport(){  // 导出班次表
            var that = this;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                $(".ajax-load-pupup1").show();
                var queryParam = this.queryParam;
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                queryParam.startCompleteTime = getTodayTime();
                queryParam.endCompleteTime = endTimeVal;
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/tfoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },1000)
            }else{
                $(".ajax-load-pupup1").show();
                var queryParam = {};
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/tfoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },3000)
            }
        },
        exportShiftReport1(){  // 导出班次表-2
            var that = this;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                $(".ajax-load-pupup1").show();
                var queryParam = this.queryParam;
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                queryParam.startCompleteTime = getTodayTime();
                queryParam.endCompleteTime = endTimeVal;
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl +"/export/tfoOrder2?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },1000)
            }else{
                $(".ajax-load-pupup1").show();
                var queryParam = {};
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl +"/export/tfoOrder2?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },3000)
            }
        },
        exportCommodity(){  // 导出商品汇总
        	var that = this;
            that.orderList = [];
            var searchInfo = "";
            if(that.checkedOperaOrder.length == 0){
                alert("请至少选择一条数据行");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.classesListCon .reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/export/customerEAOrderItem?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
			console.log(tmsUrl + "/export/customerEAOrderItem?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo)
            $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportTruckingReport(){
            var that = this;
            that.orderList = [];
            var searchInfo = "";
            if(that.checkedOperaOrder.length == 0){
                alert("请至少选择一条数据行");
                return false;
            }
            $(".ajax-load-pupup1").show();
            $('.classesListCon .reportMessages tbody .checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    searchInfo += "&orderIdList="+$(this).val()
                }
            });
            window.location.href = tmsUrl + "/print/tfoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;

            $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
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
                $(".classesListCon .reportMessages table td .checkInp").prop("checked",true);
                for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.checkedNum = that.checkedOperaOrder.length;
            }else{
                $(".classesListCon .reportMessages table td .checkInp").prop("checked",false);
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
            if(that.checkedOperaOrder.length == ($(".classesListCon .reportMessages input[type='checkbox']").length-1)){  // 单选个数 = 该页条数，全选选中
                $(".classesListCon .reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                $(".classesListCon .reportMessages thead input[type='checkbox']").prop('checked',false);
            }
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
        boxshawMouseLeave(){
            $("#completionTime").fadeOut();
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
            var deliveryDate = "",shipTimeVal = $("#shipTime").val();
            if($("#carrierDriverName").val().trim() == ""){
                alert("司机名字不能为空");
                return false;
            }
            if($(".carrierDriverTel").val().trim() == ""){
                alert("司机手机号不能为空");
                return false;
            }
            if($(".carrierEqpName").val().trim() == ""){
                alert("设备不能为空");
                return false;
            }
            if($("#carrierEqpNo").val().trim() == ""){
                alert("车牌号不能为空");
                return false;
            }
            if(that.OrderCarrier1.partyName == "" ){
                alert("承运商名称不能为空");
                return false;
            }
            deliveryDate = $(".data .completionTime").html().trim() + " "+ shipTimeVal;
            that.OrderCarrier1.refTo = "om_order";
            that.OrderCarrier1.partyType = "CAR";
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
                    imgContact: that.OrderCarrierContact,
                    party:that.OrderCarrier1
                },
                dtmTime:deliveryDate
            };
            postRequest(tmsUrl + "/insert/tfoOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                alert("新增班次成功");
                that.startDeliveryDate = getTodayTime();
                that.endDeliveryDate = getTodayTime();
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
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                alert("请先输入司机信息再保存");
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
                order:that.orderDetails
            };
            postRequest(tmsUrl + "/save/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderHeadModel,function(data){

                that.newCarrierDriver = {
                    eqpType:""
                };
                that.newCarrierEqp = {};
                var searchFormArr = that.queryParam;
                if(searchFormArr.completeStatus == ""){
                    delete searchFormArr.completeStatus;
                }
                if(searchFormArr.auditStatus == ""){
                    delete searchFormArr.auditStatus;
                }
                if(searchFormArr.isDistribute == ""){
                    delete searchFormArr.isDistribute;
                }
                searchFormArr.orderType = "TFO";
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                if(startTimeVal == getTodayTime()){
                    searchFormArr.startCompleteTime = getTodayTime();
                }else{
                    searchFormArr.startCompleteTime = startTimeVal;
                }
                if(endTimeVal == getTodayTime()){
                    searchFormArr.endCompleteTime = getTodayTime();
                }else{
                    searchFormArr.endCompleteTime = endTimeVal;
                }
                searchFormArr.pageInfo ={
                    pageNum:that.currentPage,
                    pageSize:that.queryPageSize
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
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
                alert("请先勾选一条数据行");
                return false;
            }
            for(var i = 0 ; i < that.checkedOperaOrder.length;i++){
                toDeleteArr.push(that.checkedOperaOrder[i].omOrderId);
            }
            postRequest(tmsUrl + "/delete/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,toDeleteArr,function(data){

                var searchFormArr = that.queryParam;
                searchFormArr.orderType = "TFO";
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                if(startTimeVal == getTodayTime()){
                    searchFormArr.startCompleteTime = getTodayTime();
                }else{
                    searchFormArr.startCompleteTime = startTimeVal;
                }
                if(endTimeVal == getTodayTime()){
                    searchFormArr.endCompleteTime = getTodayTime();
                }else{
                    searchFormArr.endCompleteTime = endTimeVal;
                }
                searchFormArr.pageInfo = {
                    pageNum: that.currentPage,
                    pageSize:that.queryPageSize
                }
                $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.endDeliveryDate = endTimeVal;
                    that.startDeliveryDate = startTimeVal;
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
        textboxAllSelectionFun3(){
            var that = this;
            $("#allotOrderList tbody input[type='checkbox']").prop('checked', $("#allotOrderList thead input[type='checkbox']").prop('checked'));
            if($("#allotOrderList thead input").prop("checked")){
                for(var i = 0; i < that.allotOrderLnkList.length; i++){
                    that.allocatedOrderArr.push(that.allotOrderLnkList[i]);
                }
            }else{
                for(var i = 0; i < that.allotOrderLnkList.length; i++){
                    that.allocatedOrderArr = that.allocatedOrderArr.filter(function (ele){return ele != that.allotOrderLnkList[i];});
                }
            }
        },
        textboxSelectionFun3(event,orderItem){
            event.stopPropagation();
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.allocatedOrderArr.push(orderItem);
            }else{
                that.allocatedOrderArr.splice($.inArray(orderItem,that.allocatedOrderArr),1);
            }
            if(that.allocatedOrderArr.length == that.allotOrderLnkList.length){  // 单选个数 = 该页条数，全选选中
                $("#allotOrderList thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#allotOrderList thead input[type='checkbox']").prop('checked',false);
            }
        },
        batchRevocationFun(){
            var that = this;
            var revocationOrder = [];
            if(that.allocatedOrderArr.length == 0){
                alert("请至少勾选一条数据行");
                return false;
            }
            for(var i = 0; i < that.allocatedOrderArr.length;i++){
                revocationOrder.push({
                    fromOrderId: that.currentClasses.omOrderId,
                    fromOrderNo: that.currentClasses.orderNo,
                    toOrderId: that.allocatedOrderArr[i].omOrderId,
                    toOrderNo: that.allocatedOrderArr[i].orderNo
                })
            }
            postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                that.allocatedOrderArr = [];
                $("#allotOrderList table input[type='checkbox']").prop('checked',false);
                var searchFormArr2 = {
                    refId: that.currentClasses.omOrderId,
                    refNo: that.currentClasses.orderNo
                }

                //获取订单列表
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                    //that.orderDetails = data.result.order;  // 订单信息
                    if(data.result.orderLnkList != null){
                        that.allotOrderLnkList = data.result.orderLnkList;
                    }
                })

                var searchFormArr = that.queryParam;
                searchFormArr.orderType = "TFO";
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                if(startTimeVal == getTodayTime()){
                    searchFormArr.startCompleteTime = getTodayTime();
                }else{
                    searchFormArr.startCompleteTime = startTimeVal;
                }
                if(endTimeVal == getTodayTime()){
                    searchFormArr.endCompleteTime = getTodayTime();
                }else{
                    searchFormArr.endCompleteTime = endTimeVal;
                }
                searchFormArr.pageInfo = {
                    pageNum:that.currentPage,
                    pageSize:that.queryPageSize
                }
                $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
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
            $(".maskLayer3 .reportMessages table tr .checkInp").attr("checked",false);
            this.orderList = [];
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
                alert("请输入再次排单原因");
                return false;
            }
            var params = [];
            params.push({
                orderId: that.currentAssignOrder.omOrderId,
                remark: $("#scheduleRemark").val()
            });
            postRequest(tmsUrl + "/again/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                $(".maskLayer1").hide();
                if(data.result.success == true){
                    alert("再次排单成功");
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
                    alert(data.result.message);
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
        getOrderDetails(title,clicktype,dpItem,event){
            this.templateTitle = title;
            var that = this;
            var el = event.target;
            this.clickBtnType = clicktype;
            this.currentClasses = dpItem;
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

            that.checkedOperaOrder = [];
            $(".classesListCon .reportMessages td .checkInp").prop("checked",false);
            $(el).parents("tr").find(".checkInp").prop("checked",true);
            that.checkedOperaOrder.push(dpItem);

            var params = {
                refId: dpItem.omOrderId,
                refNo: dpItem.orderNo
            };
            that.isDisable = true;
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
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

                if(data.result.stationLocationInfoList != null){     // 停靠站点
                    that.stationLocationList = data.result.stationLocationInfoList;
                }else{
                    $scope.stationLocationList = [];
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
            if(searchFormArr.isDistribute == ""){
                delete searchFormArr.isDistribute;
            }
            searchFormArr.orderType = "TFO";
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
            if(startTimeVal == getTodayTime()){
                searchFormArr.startCompleteTime = getTodayTime();
            }else{
                searchFormArr.startCompleteTime = startTimeVal;
            }
            if(endTimeVal == getTodayTime()){
                searchFormArr.endCompleteTime = getTodayTime();
            }else{
                searchFormArr.endCompleteTime = endTimeVal;
            }
            var that = this;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                if(that.queryParam.completeStatus == undefined){
                    that.queryParam.completeStatus = "";
                }
                if(that.queryParam.auditStatus == undefined){
                    that.queryParam.auditStatus = "";
                }
                if(that.queryParam.isDistribute == undefined){
                    that.queryParam.isDistribute = "";
                }
                that.endDeliveryDate = endTimeVal;
                that.startDeliveryDate = startTimeVal;
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
                if(searchFormArr.isDistribute == ""){
                    delete searchFormArr.isDistribute;
                }

                searchFormArr.orderType = "TFO";
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                if(startTimeVal == "" && endTimeVal == ""){
                    $(".startTimeSpan").val(getQueryTime(0));
                    startTimeVal = getQueryTime(0);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
                if(startTimeVal == getTodayTime()){
                    searchFormArr.startCompleteTime = getTodayTime();
                }else{
                    searchFormArr.startCompleteTime = startTimeVal;
                }
                if(endTimeVal == getTodayTime()){
                    searchFormArr.endCompleteTime = getTodayTime();
                }else{
                    searchFormArr.endCompleteTime = endTimeVal;
                }
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize
                }
                $(".classesListCon .reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(that.queryParam.completeStatus == undefined){
                        that.queryParam.completeStatus = "";
                    }
                    if(that.queryParam.auditStatus == undefined){
                        that.queryParam.auditStatus = "";
                    }
                    if(that.queryParam.isDistribute == undefined){
                        that.queryParam.isDistribute = "";
                    }
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.currentPage = 1;
                    that.endDeliveryDate = endTimeVal;
                    that.startDeliveryDate = startTimeVal;
                    that.totalPagesNum = res.pageInfo.total;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                    $(".collUnfold").hide();
                })
            }else{
                alert("请输入大于1且小于2000的正整数");
                return false;
            }
        },
        batchDistributed(){   //批量派发
            var that = this;
            if(that.checkedOperaOrder.length == 0){
                alert("请先勾选班次");
                return false;
            }
            that.currentOrderIndex = -1;
            that.tfoOrderInfoDetail = false;
            $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>批量派发中，请稍后......</span></div></div>');
            var stayOutClasses = [];
            for(var i = 0; i < that.checkedOperaOrder.length; i++){
                stayOutClasses.push({
                    state:1,
                    refId: that.checkedOperaOrder[i].omOrderId,
                    refNo: that.checkedOperaOrder[i].orderNo
                })
            }
            $.ajax({
                type: "post",
                url: tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                contentType : 'application/json',
                data: JSON.stringify(stayOutClasses),
                success:function(res){
                    $(".ajax-load-pupup .ajax-load-hint span").html("批量派发成功");
                    that.checkedOperaOrder = [];
                    $("#classesOrderTable table input").attr("checked",false);
                    setTimeout(function(){
                        $(".ajax-load-pupup").remove();
                    },600)
                }
            })
        },
        allDistributed(){   //全部派发
            var that = this;
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 120
            }
            searchFormArr.orderType = "TFO";
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
            if(startTimeVal == getTodayTime()){
                searchFormArr.startCompleteTime = getTodayTime();
            }else{
                searchFormArr.startCompleteTime = startTimeVal;
            }
            if(endTimeVal == getTodayTime()){
                searchFormArr.endCompleteTime = getTodayTime();
            }else{
                searchFormArr.endCompleteTime = endTimeVal;
            }
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            }
            var allOutClasses = [];
            $.ajax({
                type: "post",
                url: tmsUrl + "/query/selectTfoOrderIdInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                contentType : 'application/json',
                data: JSON.stringify(searchFormArr),
                beforeSend:function(){
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>全部派发中，请稍后......</span></div></div>');
                },
                success:function(data){
                    for(var i = 0; i < data.result.length; i++){
                        allOutClasses.push({
                            state: 1,
                            refId: data.result[i].refId,
                            refNo: data.result[i].refNo
                        })
                    }
                    $.ajax({
                        type: "post",
                        url: tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                        contentType : 'application/json',
                        data: JSON.stringify(allOutClasses),
                        success:function(res){
                            $(".ajax-load-pupup .ajax-load-hint span").html("全部派发成功");
                            that.checkedOperaOrder = [];
                            $("#classesOrderTable table input").attr("checked",false);
                            setTimeout(function(){
                                $(".ajax-load-pupup").remove();
                            },600)

                        }
                    })
                }
            })
        },
        getSearchVal1(){
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize1);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.multipleNum1 = that.queryPageSize1;
                var searchFormArr = this.queryParam;
                searchFormArr.isAsign = true;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize1
                }
                var startTimeVal = $(".startTimeSpan1").val().trim();
                var endTimeVal = $(".endTimeSpan1").val().trim();
                var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
                var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();

                if(startTimeVal == "" && endTimeVal == "" && crcdStartTimeVal == "" && crcdEndTimeVal == ""){
                    $(".crcdStartTimeSpan").val(getTodayTime());
                    crcdStartTimeVal = getTodayTime();
                    imitatePopup("查询条件中时间不能全置为空，已填入默认时间！");
                }
                if(startTimeVal == ""){

                }else{
                    searchFormArr.startCreateTime = startTimeVal;
                }
                if(endTimeVal == ""){

                }else{
                    searchFormArr.endCreateTime = endTimeVal;
                }
                if(crcdStartTimeVal == getQueryTime(0)){
                    searchFormArr.startCompleteTime = getQueryTime(0);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == ""){

                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }
				console.log(searchFormArr);
                $(".TheExistingRoute .checkInp").attr("checked",false);
                that.orderList = [];
                $(".TheExistingRoute .reportMessages tr").removeClass("active");
                that.orderStatistics.totalNum = 0;
                that.orderStatistics.totalNumQty = 0;
                that.orderStatistics.totalNumWeight = 0;
                that.orderStatistics.totalNumVolume = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.startCompleteDate = crcdStartTimeVal;
                    that.waitScheduleOrder = data.result;
                    that.currentPage1 = 1;
                    $(".TheExistingRoute .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.pageList1 = [];
                    that.totalPagesNum1 = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                    $(".collUnfold").hide();
                })
            }else{
                alert("请输入大于1的正整数");
                return false;
            }
        },
        changePage1(pageNum,clickStatus){
            //翻页
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".TheExistingRoute .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage1 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage > pageNum){
                    $(".TheExistingRoute .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }else{
                    $(".TheExistingRoute .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }
            }else{
                this.currentPage1 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = this.queryParam1;
            var startTimeVal = $(".startTimeSpan1").val().trim();
            var endTimeVal = $(".endTimeSpan1").val().trim();
            var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
            var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();
            if(startTimeVal == ""){

            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == ""){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            if(crcdStartTimeVal == ""){

            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == ""){

            }else{
                searchFormArr.endCompleteTime = crcdEndTimeVal;
            }
            searchFormArr.isAsign = true;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize1
            }
            $(".TheExistingRoute .checkInp").attr("checked",false);
            that.orderList = [];
            $(".TheExistingRoute .reportMessages tr").removeClass("active");
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.startCompleteDate = crcdStartTimeVal;
                that.waitScheduleOrder = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        massDistribution(){
            //批量分配
            var that = this;
            if(that.orderList.length == 0){
                alert("请至少勾选一条数据行");
                return false;
            }
            var allotOrderArr = [];
            for(var i = 0; i < that.orderList.length;i++){
                allotOrderArr.push({
                    fromOrderId: that.checkedOperaOrder[0].omOrderId,
                    fromOrderNo: that.checkedOperaOrder[0].orderNo,
                    toOrderId: that.orderList[i].omOrderId,
                    toOrderNo: that.orderList[i].orderNo
                })
            }
            //分配
            postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                that.orderList = [];
                var searchFormArr2 = {
                    refId: that.checkedOperaOrder[0].omOrderId,
                    refNo: that.checkedOperaOrder[0].orderNo
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
					//获取订单列表
					$(".maskLayer3").hide();
					$(".maskLayer3 .reportMessages table tr .checkInp").attr("checked",false);
					if(data.result.orderLnkList != null){
                        that.allotOrderLnkList = data.result.orderLnkList;
                    }else{
                    	that.allotOrderLnkList = [];
                    }

                })

                var searchFormArr = that.queryParam;
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                searchFormArr.orderType = "TFO";
                if(startTimeVal == getTodayTime()){
                    searchFormArr.startCompleteTime = getTodayTime();
                }else{
                    searchFormArr.startCompleteTime = startTimeVal;
                }
                if(endTimeVal == getTodayTime()){
                    searchFormArr.endCompleteTime = getTodayTime();
                }else{
                    searchFormArr.endCompleteTime = endTimeVal;
                }
                searchFormArr.pageInfo = {
                    pageNum: that.currentPage,
                    pageSize: that.queryPageSize
                }
		        postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
		            that.tableOrderList = res.result;
		            that.totalPagesNum = res.pageInfo.total;
		            for(var i = 0 ; i < res.pageInfo.pages;i++){
		                that.pageList[i] = i + 1;
		            }
		            that.publicChangeBtnStatus();
		        })
            })

        },
        textboxAllSelectionFun1(allChecked){
            $(".TheExistingRoute .reportMessages tbody input[type='checkbox']").prop('checked', $(".TheExistingRoute .reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            if(allChecked == false){
                that.orderList = [];
                $("#tableId tbody tr").addClass("active");
                for(var i = 0; i < that.waitScheduleOrder.length;i++){
                    that.orderList.push(that.waitScheduleOrder[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.orderList.length;
                // 处理勾选总计
//              $.each(that.orderList,function (index,item) {
//                  if(item.totalQty != null){
//                      that.orderStatistics.totalNumQty = accAdd(that.orderStatistics.totalNumQty,item.totalQty);
//                  }
//                  if(item.totalWeight != null){
//                      that.orderStatistics.totalNumWeight = accAdd(that.orderStatistics.totalNumWeight,item.totalWeight);
//                  }
//                  if(item.totalVolume != null){
//                      that.orderStatistics.totalNumVolume = accAdd(that.orderStatistics.totalNumVolume,item.totalVolume);
//                  }
//              });
            }else{
                $("#tableId tbody tr").removeClass("active");
                for(var ii = 0; ii < that.waitScheduleOrder.length;ii++){
                    that.orderList.splice($.inArray(that.waitScheduleOrder[ii],that.orderList),1)
                }
                that.allChecked = false;
                that.checkedNum = that.orderList.length;
            }
            that.orderStatistics.totalNum = that.checkedNum;
        },
        textboxSelectionFun1(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                $(el).parents(".see").addClass("active");
                that.orderList.push(orderItem);
//              that.orderStatistics.totalNumQty = accAdd(that.orderStatistics.totalNumQty,orderItem.totalQty);
//              that.orderStatistics.totalNumWeight = accAdd(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
//              that.orderStatistics.totalNumVolume = accAdd(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }else{
                $(el).parents(".see").removeClass("active");
                that.orderList.splice($.inArray(orderItem,that.orderList),1);
//              that.orderStatistics.totalNumQty = accSub(that.orderStatistics.totalNumQty,orderItem.totalQty);
//              that.orderStatistics.totalNumWeight = accSub(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
//              that.orderStatistics.totalNumVolume = accSub(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }
            that.orderStatistics.totalNum = that.orderList.length;
            if(that.orderStatistics.totalNum == $("#tableId tbody>tr").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".TheExistingRoute .reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".TheExistingRoute .reportMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        getCrcdStartTime(){
            var that = this;
            $("#crcdStartTime").show();
            var mySchedule = new Schedule({
                el: '#crcdStartTime',
                clickCb: function (y,m,d) {
                    $(".crcdStartTimeSpan").val(formartDate(y,m,d));
                    that.startCompleteDate = formartDate(y,m,d);
                    $("#crcdStartTime").hide();
                }
            });
        },
        getCrcdStartTimeVal(){
        	var crcdStartTimeSpan = $("#crcdStartTimeSpanVal").val();
			if(crcdStartTimeSpan == ""){
				this.startCompleteDate = "";
			}
        },
        getOrderList(){
        	var that = this;
        	if(that.checkedOperaOrder.length == 0){
                alert("请先选择班次再分配");
                return false;
            }else if(that.checkedOperaOrder.length > 1){
            	alert("只能选择一个班次")
            	return false;
            }
        	$(".maskLayer3").show();
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
        this.dpDistrictList = getProvinceData("100000");
        this.dpDistrictList1 = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        // 获取承运商select列表
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
                pageNum:1,
                pageSize:that.queryPageSize
            },
            orderType:"TFO",
            startCompleteTime: getTodayTime(),
            endCompleteTime: getTodayTime()
        };
        postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.totalPagesNum = res.pageInfo.total;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })

        var searchFormArr1 = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.queryPageSize1
            },
            isAsign: true,
            startCompleteTime: getQueryTime(0)
        }
        //获取待派车班次    /query/selectTaskOrderInfoPage
        postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
            that.waitScheduleOrder = data.result;
            that.totalPagesNum1 = data.pageInfo.total;
            for(var i = 0 ; i < data.pageInfo.pages;i++){
                that.pageList1[i] = i + 1;
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
