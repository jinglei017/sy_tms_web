var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        currentPage1:1,
        totalOrderResultNum:1,
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isShow:false,
        isDisable:false,
        tfoOrderInfoDetail:false,
        isNewClasses:false,
        isFinishSchedule:true,
        showDriverList:false,
        showPlateList:false,
        isShowDriverList:true,
        isShowPlateList:true,
        allChecked:false,
        getDriverListTimer:null,
        getEpdListTimer:null,
        clearShow:true,
        abnormalPage:1,
        orderList:[],
        resTfoOrder:{
            int2: 0,
            totalQtyAll:0,
            totalWeightAll:0,
            totalVolumeAll:0
        },
        OrderCarrierContact:{
            contactName:"",
            contactTel:"",
            contactEmail:"",
            contactAddress:""
        },
        OrderCarrierDriver:{},
        OrderCarrierEqp:{},
        newCarrierDriver:{},
        newCarrierEqp:{},
        searchInf:[],
        oneCarrierInfo:{},
        currentClasses:{},
        waitScheduleOrder:{},
        finishScheduleOrder:{},
        orderResultInfoList:{},
        currentOrderInfo:{},
        pageList:[],
        pageList1:[],
        totalPagesNum:"",
        totalPagesNum1:"",
        orderDetail:{},
        driverList:[],
        plateList:[],
        logininf:{},
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"新增联系人",
        currentOrderIndex:"-1",
        queryPageSize:12,
        multipleNum:12,
        schemaInfo:"",
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
        defaultDeliveryDate:getQueryTime(-1),
        deliveryDate:getQueryTime(-1),
        startCompleteDate:"",
        orderStatistics:{
            totalNum:0,
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0
        },
        queryParam:{},
        queryParam1:{},
        resPartyList:[],
        shortShowType:"0",
        currentStoAbbrInf:"",
        splitCount:"",
        splitType: 'master',
        showCurrentOrderAbbrInf: false,
        showTotalSingleList: false,
        showDetailList: false,
        dtmListInfoList:[{}],
        packageGoodsDetails:"",
        isShowSplitList:"0",
        orderSplitList:[{
            orderItemList:[{}]
        }],


        reportMessagesSearch:{
            totalNums:"",
            totalNumsUnit:""
        },
        endAddressStr:'',
        reportMessagesRes:{
            endAddress:"",
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0,
            totalNumQtyAll:0,
            totalNumWeightAll:0,
            totalNumVolumeAll:0
        },
        reportMessagesBtnShow1:'0',
        reportMessagesOrderList:[],
        reportMessagesOrderStart:{},
        currentOrderNumInf:"",
        showCurrentOrderNumInf: false,
        tableSelOrderList:{},


        checkedOperaOrder:[],
        checkedOperaOrderLen:'',
        allCheckboxChecked:false,

        checkSearchRepeatVal:false,
        popupType:"",
        tableSelOneOrderList:{},
        oneSplitCount:"",
        oneSplitType: 'master',
        isShowOneSplitList:'0',
        isShowOneSplitListType:"0",
        orderOneSplitList:[{
            orderItemList:[{}]
        }],
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
            startCompleteTime: getQueryTime(1),
            endCompleteTime: getQueryTime(-1)
        },
        dpDistrictList: [],
        queryParam11:{
            str1: "",
            tzoOrderIds: ""
        },
        patternArea: "1",
        boxToChoose: false,
        boxToClear: false,
        boxToDelete: false,
        boxToDeleteDistrict: false,
        drawAreaType: '1',
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
        originalI: "",
        presentI: "",
        polygonAgain: {},
        restorePolygon: {},
        restoreDisPolygon: {},
        mapChangeColor: true,
        computeString: true,
        mouseTool: {},
        saveDisTimes: '0',
        markerArray: [],
        currentClassesArr: [],
        classesTotallist: [],
        besicInfosList: [],
        sortTemShowList: [],
        sortTransDataList: [],
        totalQwv: [],
        timeHorizon:"", //创建时间范围
        timeHorizon1:""//完成时间范围
    },
    methods:{
        rowDrop(orderList) {	//已分配订单拖拽
            var tbody = document.querySelector('.allocatedMessages tbody')
            var  that = this;
            Sortable.create(tbody, {
                onEnd: function (evt) {  //拖拽结束发生该事件
                    that.orderResultInfoList.splice(evt.newIndex, 0, that.orderResultInfoList.splice(evt.oldIndex, 1)[0]);
                    var newArray = that.orderResultInfoList.slice(0);
                    that.orderResultInfoList = [];
                    that.$nextTick(function () {
                        that.orderResultInfoList = newArray;
                    });
                }
            })
        },
        saveNewSorting(){	//已分配订单保存排序
            var that = this;
            var fromOrderId = that.currentClasses.omOrderId;
            var newSortParams = [];
            for(var i = 0; i < this.orderResultInfoList.length;i++){
                newSortParams.push({
                    fromOrderId:fromOrderId,
                    seq:i+1,
                    toOrderId:this.orderResultInfoList[i].omOrderId
                })
            }
            postRequest(tmsUrl + "/update/tfoOrderLnkSeq.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newSortParams,function(data){
                var searchFormArr = {
                    refId: that.currentClasses.omOrderId,
                    refNo: that.currentClasses.orderNo
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.orderResultInfoList  = data.result.orderLnkList;
                })
            })
        },
        chooseTheFileType() {
            $('#excelFile').addClass('uploadType1');
            $('#excelFile').click();
        },
        chooseTheFile(){	//上传文件
            var that = this;
            that.clearShow0 = false;
            if ($('#excelFile').hasClass('uploadType1')) {
                that.filesUpload();
            }
        },
        filesUpload(){	//文件上传
            var that = this;
            $.ajaxFileUpload({
                url: tmsUrl + '/tfoOrderInfo/uploadExcelFile.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                        imitatePopup(data.result.resultMsg,"alert");
                        that.queryParam1 = {};
                        that.deliveryDate = getQueryTime(-1);
                        var searchFormArr1 = {
                            pageInfo:{
                                pageNum: 1,
                                pageSize: 5
                            },
                            isAsign: true,
                            startCompleteTime: getQueryTime(-1),
                            endCompleteTime: getQueryTime(-1)
                        }
                        //获取现有班次
                        postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                            that.finishScheduleOrder = data.result;
                            that.totalPagesNum1 = data.pageInfo.total;
                            that.pageList1 = [];
                            that.currentPage1 = 1;
                            $(".finishScheduleList .paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            for(var i = 0 ; i < data.pageInfo.pages;i++){
                                that.pageList1[i] = i + 1;
                            }
                        })
                    },100)

                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    imitatePopup(上传文件失败,"alert");
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    //    console.error(e);
                }
            });
        },
        changeDriverInf(){
            this.driverList = [];
            this.plateList = [];
            this.showDriverList = false;
            this.showPlateList = false;
            this.newCarrierDriver = {};
            this.newCarrierEqp = {
                eqpType:"",
                eqpNature:""
            };
            $(".maskLayer1").show();
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        closeMaskLayerOrderSplit(){
            var that = this;
            that.popupType = '1';
            that.oneSplitCount = '';
            that.isShowOneSplitList = '0';
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
        jumpNewClasses(){
            var that = this;
            this.driverList = [];
            this.plateList = [];
            this.showDriverList = false;
            this.showPlateList = false;
            this.tfoOrderInfoDetail = false;
            this.currentOrderIndex = -1;
            this.OrderCarrierDriver = {};
            this.OrderCarrierEqp = {
                eqpType:"",
                eqpNature:""
            };
            this.isShowDriverList = false;
            this.publicChangeBtnStatus();
            that.isNewClasses = true;
            that.isFinishSchedule = false;
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
        showItemDetails(){
            var that = this;
            that.shortShowType = '1';
        },
        hideItemDetails(){
            var that = this;
            that.shortShowType = '0';
        },
        jumpFinishSchedule(){
            this.isNewClasses = false;
            this.isFinishSchedule = true;
            this.publicChangeBtnStatus();
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
        getCompletionTime1(){
            $("#completionTime").show();
            var mySchedule = new Schedule({
                el: '#completionTime',
                clickCb: function (y,m,d) {
                    $(".completionTime1").html(formartDate(y,m,d));
                    $("#completionTime").hide();
                }
            });
        },
        getDriverInfo(val){ // 新建班次--司机姓名联想
            this.publicGetDriverInfo(val);
        },
        getDriverInfo1(val){ // 修改司机信息--司机姓名联想
            this.publicGetDriverInfo(val);
        },
        publicGetDriverInfo(val){ // cd -- 设备模板（传 设备-司机 模板，司机姓名）
            var that = this;
            clearTimeout(that.getDriverListTimer);
            that.getDriverListTimer = null;
            that.getDriverListTimer = setTimeout(function(){
                var driverinfo = {
                    contactName:val,
                    refType:"CONTACT"
                };
                $.ajax({
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                    type: "post",
                    contentType : 'application/json',
                    data: JSON.stringify(driverinfo),
                    success: function (data) {
                        that.driverList = [];
                        that.showDriverList = true;
                        if(data.result.length > 0){
                            that.driverList = data.result;
                        }
                    }
                });
            },200);
        },
        chooseDriver(driveritem){ // 新建班次--选择联想的司机姓名
            console.log(driveritem);
            this.OrderCarrierDriver.contactName = driveritem.contactName;
            $(".newClassesCon #carrierDriverName").val(driveritem.contactName);
            this.OrderCarrierDriver.contactName = $(".newClassesCon #carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = driveritem.contactTel;
            this.OrderCarrierEqp.eqpNo = driveritem.eqpNo;
            $(".newClassesCon #carrierEqpNo").val(driveritem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $(".newClassesCon #carrierEqpNo").val();
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
            this.showDriverList = false;
        },
        chooseDriver1(driveritem){ // 修改司机信息--选择联想的司机姓名
            console.log(driveritem);
            this.newCarrierDriver.contactName = driveritem.contactName;
            $(".popupCon .newClassesCon #newCarrierDriverName").val(driveritem.contactName);
            this.newCarrierDriver.contactName = $(".popupCon .newClassesCon #newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = driveritem.contactTel;
            this.newCarrierEqp.eqpNo = driveritem.eqpNo;
            $(".popupCon .newClassesCon #newCarrierEqpNo").val(driveritem.eqpNo);
            this.newCarrierEqp.eqpNo = $(".popupCon .newClassesCon #newCarrierEqpNo").val();
            this.newCarrierEqp.eqpName = driveritem.eqpName;
            this.newCarrierEqp.eqpBrand = driveritem.eqpBrand;
            this.newCarrierEqp.eqpType = driveritem.eqpType;
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
            this.showDriverList = false;
        },
        getPlateInfo(val){ // 新建班次--车牌号联想
            this.publicGetPlateInfo(val);
        },
        getPlateInfo1(val){ // 修改司机信息--车牌号联想
            this.publicGetPlateInfo(val);
        },
        publicGetPlateInfo(val){ // cd -- 设备模板（传 设备-司机 模板，车牌号）
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
                    url: cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                    type: "post",
                    contentType : 'application/json',
                    data: JSON.stringify(plateinfo),
                    success: function (data) {
                        that.plateList  = data.result;
                        if(that.plateList.length > 0){
                            that.showPlateList = true;
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
            $(".newClassesCon #carrierDriverName").val(plateitem.contactName);
            this.OrderCarrierDriver.contactName = $(".newClassesCon #carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = plateitem.contactTel;
            this.OrderCarrierEqp.eqpNo = plateitem.eqpNo;
            $(".newClassesCon #carrierEqpNo").val(plateitem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $(".newClassesCon #carrierEqpNo").val();
            this.OrderCarrierEqp.eqpName = plateitem.eqpName;
            this.OrderCarrierEqp.eqpBrand = plateitem.eqpBrand;
            this.OrderCarrierEqp.eqpType = plateitem.eqpType;
            if(plateitem.eqpNature==null){
                plateitem.eqpNature = "";
            }
            this.OrderCarrierEqp.eqpNature = plateitem.eqpNature;
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
            this.showPlateList = false;*/

            console.log(plateitem);
            this.newCarrierDriver.contactName = plateitem.contactName;
            $(".popupCon .newClassesCon #newCarrierDriverName").val(plateitem.contactName);
            this.newCarrierDriver.contactName = $(".popupCon .newClassesCon #newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = plateitem.contactTel;
            this.newCarrierEqp.eqpNo = plateitem.eqpNo;
            $(".popupCon .newClassesCon #newCarrierEqpNo").val(plateitem.eqpNo);
            this.newCarrierEqp.eqpNo = $(".popupCon .newClassesCon #newCarrierEqpNo").val();
            this.newCarrierEqp.eqpName = plateitem.eqpName;
            this.newCarrierEqp.eqpBrand = plateitem.eqpBrand;
            this.newCarrierEqp.eqpType = plateitem.eqpType;
            if(plateitem.eqpNature==null){
                plateitem.eqpNature = "";
            }
            this.newCarrierEqp.eqpNature = plateitem.eqpNature;
            this.newCarrierEqp.eqpSpec = plateitem.eqpSpec;
            this.newCarrierEqp.eqpLength = plateitem.eqpLength;
            this.newCarrierEqp.eqpWidth = plateitem.eqpWidth;
            this.newCarrierEqp.eqpHeight = plateitem.eqpHeight;
            this.newCarrierEqp.eqpStr1 = plateitem.eqpStr1;
            this.newCarrierEqp.eqpStr2 = plateitem.eqpStr2;
            this.showPlateList = false;
        },
        publicGetOrderList(){
            var that = this;
            that.orderList = [];
            that.allChecked = false;
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            var searchFormArr = that.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
            var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
            if(startTimeVal == "创建时间--开始时间"){

            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == "创建时间--结束时间"){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            if(crcdStartTimeVal == getQueryTime(1)){
                searchFormArr.startCompleteTime = getQueryTime(1);
            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == "要求完成时间--结束时间"){

            }else{
                searchFormArr.endCompleteTime = crcdEndTimeVal;
            }
            searchFormArr.isAsign = true;
            searchFormArr.pageInfo ={
                pageNum: that.currentPage,
                pageSize: that.queryPageSize
            }
            var searchFormArr1 = this.queryParam1;
            //that.tfoOrderInfoDetail = false;
            searchFormArr1.isAsign = true;
            searchFormArr1.pageInfo = {
                pageNum: that.currentPage1,
                pageSize: 5
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr1.startCompleteTime = getQueryTime(-1);
                searchFormArr1.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr1.startCompleteTime = deliveryTimeVal;
                searchFormArr1.endCompleteTime = deliveryTimeVal;
            }
            $(".reportMessages table tr td .checkInp").attr("checked",false);
            $(".scheduleSection .reportMessages input").removeAttr('checked');
            $(".waitScheduleList .reportMessages tr").removeClass("active");

            //获取待派车班次
            delete(searchFormArr["pageInfo"]);    //   /query/selectTaskOrderInfoPage
            postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.deliveryDate = deliveryTimeVal;
                that.startCompleteDate = crcdStartTimeVal;
                that.waitScheduleOrder = data.result;
                that.publicChangeBtnStatus();
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                    that.finishScheduleOrder = data.result;
                    that.pageList1 = [];
                    that.totalPagesNum1 = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                    var searchFormArr2 = {
                        refId: that.currentClasses.omOrderId,
                        refNo: that.currentClasses.orderNo
                    }
                    //获取订单列表
                    postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                        //that.orderDetails = data.result.order;  // 订单信息
                        if(data.result.orderLnkList != null){
                            that.orderResultInfoList = data.result.orderLnkList;
                            that.totalOrderResultNum = data.result.orderLnkList.length;
                        }
                        if(data.result.order != null){
                            that.resTfoOrder = data.result.order;
                            that.resTfoOrder.dtmTime = data.result.dtmTime;
                            var totalQtyAll = 0,totalWeightAll = 0,totalVolumeAll = 0;
                            $.each(that.orderResultInfoList,function (index,item) {
                                totalQtyAll += item.totalQty;
                                totalWeightAll += item.totalWeight;
                                totalVolumeAll += item.totalVolume;
                            });
                            if(data.result.order.int2 == null || data.result.order.int2 == ""){
                                that.resTfoOrder.int2 = 0;
                            }
                            that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                            that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                            that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                        }
                    })
                })
            })
        },
        saveNewDriverInf(){ // 保存 修改司机信息
            var that = this;
            if($(".popupCon .newClassesCon .newCarrierEqpName").val().trim() == "" && $(".popupCon .newClassesCon #newCarrierEqpNo").val().trim() == "" && $(".popupCon .newClassesCon .newCarrierDriverTel").val().trim() == "" && $(".popupCon .newClassesCon #newCarrierDriverName").val().trim() == ""){
                alert("请先输入司机信息再保存");
                return false;
            }
            this.OrderCarrierEqp.eqpNo = this.newCarrierEqp.eqpNo;
            this.OrderCarrierEqp.eqpName = this.newCarrierEqp.eqpName;
            this.OrderCarrierEqp.eqpBrand = this.newCarrierEqp.eqpBrand;
            this.OrderCarrierEqp.eqpType = this.newCarrierEqp.eqpType;
            this.OrderCarrierEqp.eqpNature  = this.newCarrierEqp.eqpNature;
            this.OrderCarrierEqp.eqpSpec = this.newCarrierEqp.eqpSpec;
            this.OrderCarrierEqp.eqpLength = this.newCarrierEqp.eqpLength;
            this.OrderCarrierEqp.eqpWidth = this.newCarrierEqp.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = this.newCarrierEqp.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = this.newCarrierEqp.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = this.newCarrierEqp.eqpStr2;

            this.OrderCarrierDriver.contactName = this.newCarrierDriver.contactName;
            this.OrderCarrierDriver.contactTel = this.newCarrierDriver.contactTel;


            var newDriverInfo = {
                carrierPartyInfo:{
                    contact: this.OrderCarrierDriver,
                    eqp: this.OrderCarrierEqp,
                    imgContact: this.currentOrderInfo.imgContact,
                    party: this.currentOrderInfo.party
                },
                order:this.resTfoOrder
            }
            postRequest(tmsUrl + "/save/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newDriverInfo,function(data){

                var searchFormArr = that.queryParam1;
                searchFormArr.isAsign = true;
                searchFormArr.pageInfo = {
                    pageNum:that.currentPage1,
                    pageSize:5
                }
                var deliveryTimeVal = that.deliveryDate;
                if(deliveryTimeVal == getQueryTime(-1)){
                    searchFormArr.startCompleteTime = getQueryTime(-1);
                    searchFormArr.endCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.startCompleteTime = deliveryTimeVal;
                    searchFormArr.endCompleteTime = deliveryTimeVal;
                }
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.finishScheduleOrder = data.result;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                })
                setTimeout(function(){
                    $(".maskLayer1").hide();
                },300)

            })
        },
        massDistribution(){
            //批量分配
            var that = this;
            if(this.isNewClasses){

            }else{
                if(!that.tfoOrderInfoDetail){
                    alert("请先选择线路再分配");
                    return false;
                }
                if(that.orderList.length == 0){
                    alert("请至少勾选一条数据行");
                    return false;
                }
                var allotOrderArr = [];
                for(var i = 0; i < that.orderList.length;i++){
                    allotOrderArr.push({
                        fromOrderId: that.currentClasses.omOrderId,
                        fromOrderNo: that.currentClasses.orderNo,
                        toOrderId: that.orderList[i].omOrderId,
                        toOrderNo: that.orderList[i].orderNo
                    })
                }
                //分配
                postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                    that.orderList = [];
                    $(".waitScheduleList .reportMessages tr").removeClass("active");
                    $(".reportMessages table tr td .checkInp").attr("checked",false);
                    that.publicGetOrderList();
                })
            }
        },
        revocationFun(orderinfo){
            //撤回已分配订单
            var that = this;
            var revocationOrder = [];
            if (orderinfo.assignStatus == 1) {
                var r = confirm("订单已派发是否确认撤销？");
                if(!r){
                    return false;
                }
            }
            var searchArr = {
                fromOrderId:that.currentClasses.omOrderId,
                fromOrderNo:that.currentClasses.orderNo,
                toOrderId:orderinfo.omOrderId,
                toOrderNo:orderinfo.orderNo
            }
            revocationOrder.push(searchArr);
            postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                that.publicGetOrderList()
                // 查询列表 ，地图标点
                that.getSearchVal();
            })
        },
        textboxAllSelectionFun(allChecked){
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
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
                $.each(that.orderList,function (index,item) {
                    if(item.totalQty != null){
                        that.orderStatistics.totalNumQty = accAdd(that.orderStatistics.totalNumQty,item.totalQty);
                    }
                    if(item.totalWeight != null){
                        that.orderStatistics.totalNumWeight = accAdd(that.orderStatistics.totalNumWeight,item.totalWeight);
                    }
                    if(item.totalVolume != null){
                        that.orderStatistics.totalNumVolume = accAdd(that.orderStatistics.totalNumVolume,item.totalVolume);
                    }
                });
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
        textboxSelectionFun(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                $(el).parents(".see").addClass("active");
                that.orderList.push(orderItem);
                that.orderStatistics.totalNumQty = accAdd(that.orderStatistics.totalNumQty,orderItem.totalQty);
                that.orderStatistics.totalNumWeight = accAdd(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
                that.orderStatistics.totalNumVolume = accAdd(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }else{
                $(el).parents(".see").removeClass("active");
                that.orderList.splice($.inArray(orderItem,that.orderList),1);
                that.orderStatistics.totalNumQty = accSub(that.orderStatistics.totalNumQty,orderItem.totalQty);
                that.orderStatistics.totalNumWeight = accSub(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
                that.orderStatistics.totalNumVolume = accSub(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }
            that.orderStatistics.totalNum = that.orderList.length;
            if(that.orderStatistics.totalNum == $("#tableId tbody>tr").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        newDistributeOrder(){  // 新增该班次
            if($(".newClassesCon #carrierDriverName").val().trim() == "" && $(".newClassesCon .carrierDriverTel").val().trim() == "" && $(".newClassesCon #carrierEqpNo").val().trim() == "" && $(".newClassesCon .carrierEqpName").val().trim() == ""){
                alert("请先输入司机信息再保存");
                return false;
            }
            //新增订单的派发
            var that = this;
            var completionTime = "";
            var shipTimeVal = $("#shipTime").val();
            if($(".data .completionTime").html() == getQueryTime(0)){
                completionTime = $(".data .completionTime").html() + " "+ shipTimeVal
            }else{
                completionTime = $(".data .completionTime").html() + " "+ shipTimeVal
            }
//				if(that.orderList.length == 0){
//					alert("请选择分配订单");
//					return false;
//				}
//				var orderLnkModelList = [];
//				for(var i = 0; i < that.orderList.length; i++){
//					orderLnkModelList.push({
//						toOrderId:that.orderList[i].omOrderId,
//						toOrderNo:that.orderList[i].orderNo
//					})
//				}
            var newClassesObj = {
                carrierPartyInfo:{
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party: that.OrderCarrier
                },
                dtmTime:completionTime
            };
            console.log(newClassesObj);
            postRequest(tmsUrl + "/insert/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newClassesObj,function(data){
                that.deliveryDate = getQueryTime(-1);
                alert('班次新增成功！');
                var searchFormArr1 = {
                    pageInfo:{
                        pageNum: that.currentPage1,
                        pageSize: 5
                    },
                    isAsign: true,
                    startCompleteTime: getQueryTime(-1),
                    endCompleteTime: getQueryTime(-1)
                }
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                    that.finishScheduleOrder = data.result;
                    that.totalPagesNum1 = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                })
            });
        },
        distributeOrder(){
            //订单派发
            var that = this;
            var searchFormArr = [];
            searchFormArr.push({
                state:1,
                refId: that.currentClasses.omOrderId,
                refNo: that.currentClasses.orderNo
            })
            var searchFormArr1 = {
                pageInfo:{
                    pageNum: that.currentPage,
                    pageSize: 5
                },
                isAsign: true
            }
            postRequest(tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                alert('订单派发成功！');
                var searchFormArr = {
                    refId: that.currentClasses.omOrderId,
                    refNo: that.currentClasses.orderNo
                }
                //获取订单列表
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.orderResultInfoList  = data.result.orderLnkList;
                })

            })
        },
        orderDistribution(orderItem){
            //订单分配
            var that = this;
            if(!that.tfoOrderInfoDetail){
                alert("请先选择线路再分配");
                return false;
            }
            var searchFormArr = [];
            searchFormArr.push({
                fromOrderId:that.currentClasses.omOrderId,
                fromOrderNo:that.currentClasses.orderNo,
                toOrderId:orderItem.omOrderId,
                toOrderNo:orderItem.orderNo
            })
            postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                $(".reportMessages table tr td .checkInp").attr("checked",false);
                that.orderList = [];
                that.publicGetOrderList()
            })
        },
        orderResultInfo(orderItem,index){
            var that = this;
            that.currentOrderIndex = index;
            var searchFormArr = {
                refId: orderItem.omOrderId,
                refNo: orderItem.orderNo
            }
            that.tfoOrderInfoDetail = true;
            that.currentClasses = orderItem;
            //获取订单列表
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                //that.orderDetails = data.result.order;  // 订单信息
                that.currentOrderInfo  = data.result.carrierPartyInfo;

                if(data.result.carrierPartyInfo != null){
                    if(data.result.carrierPartyInfo.imgContact != null){
                        that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    }else{
                        that.OrderCarrierContact = {};
                    }

                    if(data.result.carrierPartyInfo.contact != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.contact;
                    }else{
                        that.OrderCarrierDriver = {};
                    }

                    if(data.result.carrierPartyInfo.eqp != null){
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.eqp;
                    }else{
                        that.OrderCarrierEqp = {};
                    }

                }else{
                    that.OrderCarrierContact = {};
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {};
                }

                if(data.result.orderLnkList != null){
                    that.rowDrop(data.result.orderLnkList);
                    that.orderResultInfoList = data.result.orderLnkList;
                    that.totalOrderResultNum = data.result.orderLnkList.length;
                }

                if(data.result.order != null){
                    that.resTfoOrder = data.result.order;
                    that.resTfoOrder.dtmTime = data.result.dtmTime;
                    var totalQtyAll = 0,totalWeightAll = 0,totalVolumeAll = 0;
                    $.each(that.orderResultInfoList,function (index,item) {
                        totalQtyAll += item.totalQty;
                        totalWeightAll += item.totalWeight;
                        totalVolumeAll += item.totalVolume;
                    });
                    if(data.result.order.int2 == null || data.result.order.int2 == ""){
                        that.resTfoOrder.int2 = 0;
                    }
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }

                // 重置总计
                that.reportMessagesRes.endAddress = '';
                for(var i = that.orderResultInfoList.length-1 ; i >= 0;i--){
                    var itemList = that.orderResultInfoList[i];
                    if(that.reportMessagesRes.endAddress == ''){
                        if(itemList.stoAddress != null){
                            that.reportMessagesRes.endAddress = itemList.stoAddress;
                        }
                    }
                }
                that.endAddressStr = that.reportMessagesRes.endAddress;
                that.reportMessagesRes.int2All = accAdd(that.reportMessagesRes.int2,that.resTfoOrder.int2);
                that.reportMessagesRes.totalNumQtyAll = accAdd(that.reportMessagesRes.totalNumQty,that.resTfoOrder.totalQtyAll);
                that.reportMessagesRes.totalNumWeightAll = accAdd(that.reportMessagesRes.totalNumWeight,that.resTfoOrder.totalWeightAll);
                that.reportMessagesRes.totalNumVolumeAll = accAdd(that.reportMessagesRes.totalNumVolume,that.resTfoOrder.totalVolumeAll);

            })
        },
        /*changePage(pageNum,clickStatus){
            //翻页
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".waitScheduleList .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage > pageNum){
                    $(".waitScheduleList .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage = pageNum;
                }else{
                    $(".waitScheduleList .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage = pageNum;
                }
            }else{
                this.currentPage = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
            var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
            if(startTimeVal == "创建时间--开始时间"){

            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == "创建时间--结束时间"){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            if(crcdStartTimeVal == getQueryTime(1)){
                searchFormArr.startCompleteTime = getQueryTime(1);
            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == "要求完成时间--结束时间"){

            }else{
                searchFormArr.endCompleteTime = crcdEndTimeVal;
            }
            searchFormArr.isAsign = true;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".waitScheduleList .checkInp").attr("checked",false);
            that.orderList = [];
            $(".waitScheduleList .reportMessages tr").removeClass("active");
            that.allChecked = false;
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.startCompleteDate = crcdStartTimeVal;
                that.waitScheduleOrder = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },*/
        changePage1(pageNum,clickStatus){
            //翻页
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".finishScheduleList .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage1 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage1 > pageNum){
                    $(".finishScheduleList .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }else{
                    $(".finishScheduleList .paging .pagingCon .pagination").animate({
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
            that.tfoOrderInfoDetail = false;
            searchFormArr.isAsign = true;
            searchFormArr.pageInfo = {
                pageNum:pageNum,
                pageSize:5
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime = deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
            }
            $("#classTableId tr.see").removeClass('active');
            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.finishScheduleOrder = data.result;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        // 地图订单分配  批量分配
        orderDistributionFun(){
            var that = this;
            if(this.isNewClasses){

            }else{
                if(!that.tfoOrderInfoDetail || that.OrderCarrierDriver.contactName == '' || that.OrderCarrierEqp.eqpNo == ''){
                    alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
                    $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
                    return false;
                }
                if(markerInfoResArrayAll.length == 0){
                    alert("请至少选中一个订单");
                    return false;
                }
                var allotOrderArr = [];
                for(var i = 0; i < markerInfoResArrayAll.length;i++){
                    allotOrderArr.push({
                        fromOrderId: that.currentClasses.omOrderId,
                        fromOrderNo: that.currentClasses.orderNo,
                        toOrderId: markerInfoResArrayAll[i].omOrderId,
                        toOrderNo: markerInfoResArrayAll[i].orderNo
                    })
                }
                //分配
                postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                    alert('订单分配完成！');
                    that.orderDistributionNextFun();
                })
            }
        },
        // 地图订单分配  批量分配 --- 之后，获取待派车班次、、获取现有班次、、获取订单列表
        orderDistributionNextFun(){
            var that = this;
            that.orderList = [];
            that.allChecked = false;
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            var searchFormArr = that.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
            var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
            if(startTimeVal == "创建时间--开始时间"){

            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == "创建时间--结束时间"){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            if(crcdStartTimeVal == getQueryTime(1)){
                searchFormArr.startCompleteTime = getQueryTime(1);
            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == "要求完成时间--结束时间"){

            }else{
                searchFormArr.endCompleteTime = crcdEndTimeVal;
            }
            searchFormArr.isAsign = true;
            searchFormArr.pageInfo ={
                pageNum: that.currentPage,
                pageSize: that.queryPageSize
            }
            var searchFormArr1 = this.queryParam1;
            //that.tfoOrderInfoDetail = false;
            searchFormArr1.isAsign = true;
            searchFormArr1.pageInfo = {
                pageNum: that.currentPage1,
                pageSize: 5
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr1.startCompleteTime = getQueryTime(-1);
                searchFormArr1.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr1.startCompleteTime = deliveryTimeVal;
                searchFormArr1.endCompleteTime = deliveryTimeVal;
            }
            $(".reportMessages table tr td .checkInp").attr("checked",false);
            $(".scheduleSection .reportMessages input").removeAttr('checked');
            $(".waitScheduleList .reportMessages tr").removeClass("active");

            //获取待派车班次
            delete(searchFormArr["pageInfo"]);  //   /query/selectTaskOrderInfoPage
            postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.deliveryDate = deliveryTimeVal;
                that.startCompleteDate = crcdStartTimeVal;
                that.waitScheduleOrder = data.result;
                /*that.pageList = [];
                that.totalPagesNum = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }*/
                that.publicChangeBtnStatus();
            })
            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                that.finishScheduleOrder = data.result;
                that.pageList1 = [];
                that.totalPagesNum1 = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })

            // 查询列表 ，地图标点
            that.getSearchVal();

            var searchFormArr2 = {
                refId: that.currentClasses.omOrderId,
                refNo: that.currentClasses.orderNo
            }
            //获取订单列表
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                //that.orderDetails = data.result.order;  // 订单信息
                if(data.result.orderLnkList != null){
                    that.rowDrop(data.result.orderLnkList);
                    that.orderResultInfoList = data.result.orderLnkList;
                    that.totalOrderResultNum = data.result.orderLnkList.length;
                }
                if(data.result.order != null){
                    that.resTfoOrder = data.result.order;
                    that.resTfoOrder.dtmTime = data.result.dtmTime;
                    var totalQtyAll = 0,totalWeightAll = 0,totalVolumeAll = 0;
                    $.each(that.orderResultInfoList,function (index,item) {
                        totalQtyAll += item.totalQty;
                        totalWeightAll += item.totalWeight;
                        totalVolumeAll += item.totalVolume;
                    });
                    if(data.result.order.int2 == null || data.result.order.int2 == ""){
                        that.resTfoOrder.int2 = 0;
                    }
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }

                // 重置总计
                that.reportMessagesRes = {
                    endAddress:"",
                    totalNumQty:0,
                    totalNumWeight:0,
                    totalNumVolume:0,
                    int2: 0,
                    int2All: 0
                };
                for(var i = that.orderResultInfoList.length-1 ; i >= 0;i--){
                    var itemList = that.orderResultInfoList[i];
                    if(that.reportMessagesRes.endAddress == ''){
                        if(itemList.stoAddress != null){
                            that.reportMessagesRes.endAddress = itemList.stoAddress;
                        }
                    }
                }
                that.endAddressStr = that.reportMessagesRes.endAddress;
                //    console.log(that.endAddressStr);
                that.reportMessagesRes.int2All = accAdd(that.reportMessagesRes.int2,that.resTfoOrder.int2);
                that.reportMessagesRes.totalNumQtyAll = accAdd(that.reportMessagesRes.totalNumQty,that.resTfoOrder.totalQtyAll);
                that.reportMessagesRes.totalNumWeightAll = accAdd(that.reportMessagesRes.totalNumWeight,that.resTfoOrder.totalWeightAll);
                that.reportMessagesRes.totalNumVolumeAll = accAdd(that.reportMessagesRes.totalNumVolume,that.resTfoOrder.totalVolumeAll);

                that.reportMessagesOrderList = [];
                that.reportMessagesOrderStart = {};

                that.reportMessagesBtnShow1 = '1';
            })

        },
        // 输入“大件”搜索
        selectSpecialFun(totalNums,totalNumsUnit){
            var that = this;
            $(".orderMapPoint").css("background-color","#00C2B1");
            if(!totalNums || !totalNumsUnit){
                return false;
            }
            for (var i = 0; i < markerInfoArray.length; i++) {
                if(totalNumsUnit == "1" && markerInfoArray[i].totalQty >= totalNums){
                    $('#order'+markerInfoArray[i].omOrderId).css("background-color","red");
                }
                if(totalNumsUnit == "2" && markerInfoArray[i].totalWeight >= totalNums){
                    $('#order'+markerInfoArray[i].omOrderId).css("background-color","red");
                }
                if(totalNumsUnit == "3" && markerInfoArray[i].totalVolume >= totalNums){
                    $('#order'+markerInfoArray[i].omOrderId).css("background-color","red");
                }
            }
        },
        // 查看地址重合运单
        getSearchRepeatVal(allChecked){
            var that = this;
            if(allChecked == false){
                that.checkSearchRepeatVal = true;

                drawClearFun1();
                if(!that.tfoOrderInfoDetail || that.OrderCarrierDriver.contactName == '' || that.OrderCarrierEqp.eqpNo == ''){
                    alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
                    $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
                    return false;
                }
                // 关闭班次信息
                $('.scheduleSectionRightBtn').removeClass("scheduleSectionRightShow");
                $('.scheduleSectionRightBtn').html('班次信息-详情');
                $(".scheduleSection .scheduleSectionRight").hide();

            //    that.reportMessagesRes.endAddress = that.endAddressStr;

                var splitCountNum = parseInt(that.queryPageSize);
                var ex = /^\d+$/;
                if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                    that.multipleNum = that.queryPageSize;
                    var searchFormArr = this.queryParam;
                    searchFormArr.isAsign = true;
                    searchFormArr.pageInfo = {
                        pageNum:1,
                        pageSize:that.queryPageSize
                    }
                    var startTimeVal =that.timeHorizon.split(" - ")[0];
                    var endTimeVal =that.timeHorizon.split(" - ")[1];
                    var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                    var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                    if(startTimeVal == "创建时间--开始时间"){

                    }else{
                        searchFormArr.startCreateTime = startTimeVal;
                    }
                    if(endTimeVal == "创建时间--结束时间"){

                    }else{
                        searchFormArr.endCreateTime = endTimeVal;
                    }
                    if(crcdStartTimeVal == getQueryTime(1)){
                        searchFormArr.startCompleteTime = getQueryTime(1);
                    }else{
                        searchFormArr.startCompleteTime = crcdStartTimeVal;
                    }
                    if(crcdEndTimeVal == "要求完成时间--结束时间"){

                    }else{
                        searchFormArr.endCompleteTime = crcdEndTimeVal;
                    }

                //    $(".waitScheduleList .checkInp").attr("checked",false);
                    that.orderList = [];
                //    $(".waitScheduleList .reportMessages tr").removeClass("active");
                //    that.allChecked = false;
                    that.orderStatistics.totalNum = 0;
                    that.orderStatistics.totalNumQty = 0;
                    that.orderStatistics.totalNumWeight = 0;
                    that.orderStatistics.totalNumVolume = 0;

                    //获取订单列表
                    delete(searchFormArr["pageInfo"]);   //   /query/selectTaskOrderInfoPage
                    delete(searchFormArr["stoLatLng"]);
                    searchFormArr.latLngNumber = 1;
                    postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                        that.startCompleteDate = crcdStartTimeVal;
                        that.waitScheduleOrder = data.result;
                        that.currentPage = 1;
                        $(".waitScheduleList .paging .pagingCon .pagination").animate({
                            "left": "0px"
                        },300);
                        /*that.pageList = [];
                        that.totalPagesNum = data.pageInfo.total;
                        for(var i = 0 ; i < data.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }*/

                        that.reportMessagesBtnShow1 = '1';

                        markerInfoArray = that.waitScheduleOrder;
                        that.markerArrayFun(markerInfoArray);

                    })
                }else{
                    alert("请输入大于1的正整数");
                    return false;
                }

            }else{
                that.checkSearchRepeatVal = false;

                that.getSearchVal();
            }
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = {
                completeStatus:"",
                actCode:"",
                assignStatus:"",
                exceptionStatus:""
            }
        },
        // 查询列表 ，地图标点
        getSearchVal(){
            drawClearFun1();
            var that = this;
            if(!that.tfoOrderInfoDetail || that.OrderCarrierDriver.contactName == '' || that.OrderCarrierEqp.eqpNo == ''){
                alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
                $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
                return false;
            }
            // 关闭班次信息
            $('.scheduleSectionRightBtn').removeClass("scheduleSectionRightShow");
            $('.scheduleSectionRightBtn').html('班次信息-详情');
            $(".scheduleSection .scheduleSectionRight").hide();

            that.reportMessagesRes.endAddress = that.endAddressStr;

            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                searchFormArr.isAsign = true;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize
                }
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == "" && crcdEndTimeVal == "" && startTimeVal == "" && endTimeVal == ""){
                    startTimeVal = getQueryTime(1);
                    crcdStartTimeVal = getQueryTime(1);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
                if(startTimeVal == "创建时间--开始时间"){

                }else{
                    searchFormArr.startCreateTime = startTimeVal;
                }
                if(endTimeVal == "创建时间--结束时间"){

                }else{
                    searchFormArr.endCreateTime = endTimeVal;
                }
                if(crcdStartTimeVal == getQueryTime(1)){
                    searchFormArr.startCompleteTime = getQueryTime(1);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == "要求完成时间--结束时间"){

                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }

                $(".waitScheduleList .checkInp").attr("checked",false);
                that.orderList = [];
                $(".waitScheduleList .reportMessages tr").removeClass("active");
                that.allChecked = false;
                that.orderStatistics.totalNum = 0;
                that.orderStatistics.totalNumQty = 0;
                that.orderStatistics.totalNumWeight = 0;
                that.orderStatistics.totalNumVolume = 0;

                //获取订单列表
                delete(searchFormArr["pageInfo"]);    //   /query/selectTaskOrderInfoPage
                delete(searchFormArr["latLngNumber"]);
                delete(searchFormArr["stoLatLng"]);
                // searchFormArr.latLngNumber = 1;
                postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.startCompleteDate = crcdStartTimeVal;
                    that.waitScheduleOrder = data.result;
                    that.currentPage = 1;
                    $(".waitScheduleList .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    /*that.pageList = [];
                    that.totalPagesNum = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }*/

                    that.reportMessagesBtnShow1 = '1';

                    markerInfoArray = that.waitScheduleOrder;
                    that.markerArrayFun(markerInfoArray);

                })
            }else{
                alert("请输入大于1的正整数");
                return false;
            }
        },
        markerArrayFun(markerInfoArray){
            map.clearMap();  // 清除地图上所有添加的覆盖物
            markerArray = [];
            var defaultLatLng = '121.473658,31.230378';
            for(var n = 0; n < markerInfoArray.length; n++){
                var newDiv = document.createElement("div");
                var item = markerInfoArray[n],markerLocation = [],marker,stoLatLngStr = '';

                if(item.stoLatLng != null && item.stoLatLng != ''){
                    stoLatLngStr = item.stoLatLng;
                    var string0 = item.stoLatLng.split(',');
                    markerLocation.push(string0[0]);
                    markerLocation.push(string0[1]);
                    newDiv.className  = 'orderMapPoint';
                }else {
                    stoLatLngStr = '';
                    var string1 = defaultLatLng.split(',');
                    markerLocation.push(string1[0]);
                    markerLocation.push(string1[1]);
                    newDiv.className  = 'orderMapPointDef';
                }

                newDiv.setAttribute("stoLatLngStr",stoLatLngStr);
                newDiv.setAttribute("id",'order'+item.omOrderId);     //  newDiv.id = 'order'+item.omOrderId;

                //    newDiv.innerHTML = '<strong>'+item.omOrderId+'</strong>';

                marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);  //更新点标记内容

                marker.on('mouseover', openSignalOrderInfo);
                marker.on('mouseout', closeSignalOrderInfo);
                marker.on('click', clickSignalOrderInfo);
             //   marker.emit('click', {target: marker});   //注释后打开地图时默认关闭信息窗体

                markerArray.push(marker);
            }
        },
        // 取消这个选中订单
        cancelLiFun(omOrderId,index,type){
            var that = this,isArrayLast = '0';
            // if(index == that.reportMessagesOrderList.length - 1){
            //     isArrayLast = '1';
            // }
            var r = confirm("是否取消选中该订单");
            if(r == true){
                that.reportMessagesOrderList.splice(index, 1);
                // 重置 标记点的颜色
                // if(isArrayLast == '1'){
                //     var newOmOrderId = that.reportMessagesOrderList[that.reportMessagesOrderList.length-1].omOrderId;
                //     var strHtml = '<div style="width: 100%;height: 100%;border-radius: 50%;background-color: #ee9200;"></div>'
                //     $('#order'+newOmOrderId).html(strHtml);
                // }else{
                //     $('#order'+omOrderId).html('');
                // }
                closeSignalOrderInfo();
                $('#order'+omOrderId).css({"width":"8px","height":"8px"});
                $('#order'+omOrderId).html('');
                // $('#order'+tableOrderItem.omOrderId).find("div").css("background","#ee9200");
                // $('#order'+omOrderId).html('');
                // 重置 总计
                that.reportMessagesRes = {
                    endAddress:"",
                    totalNumQty:0,
                    totalNumWeight:0,
                    totalNumVolume:0,
                    int2: 0,
                    int2All: 0
                };
                for(var i = that.reportMessagesOrderList.length-1 ; i >= 0;i--){
                    var itemList = that.reportMessagesOrderList[i];
                    if(that.reportMessagesRes.endAddress == ''){
                        if(itemList.stoAddress != null){
                            that.reportMessagesRes.endAddress = itemList.stoAddress;
                        }
                    }
                }
                if(that.reportMessagesRes.endAddress == ''){
                    that.reportMessagesRes.endAddress = that.endAddressStr;
                }
                that.reportMessagesRes.int2 = that.reportMessagesOrderList.length;
                $.each(that.reportMessagesOrderList, function (index, item) {
                    if(item.totalQty != null){
                        that.reportMessagesRes.totalNumQty = accAdd(that.reportMessagesRes.totalNumQty,item.totalQty);
                    }
                    if(item.totalWeight != null){
                        that.reportMessagesRes.totalNumWeight = accAdd(that.reportMessagesRes.totalNumWeight,item.totalWeight);
                    }
                    if(item.totalVolume != null){
                        that.reportMessagesRes.totalNumVolume = accAdd(that.reportMessagesRes.totalNumVolume,item.totalVolume);
                    }
                });
                that.reportMessagesRes.int2All = accAdd(that.reportMessagesRes.int2,that.resTfoOrder.int2);
                that.reportMessagesRes.totalNumQtyAll = accAdd(that.reportMessagesRes.totalNumQty,that.resTfoOrder.totalQtyAll);
                that.reportMessagesRes.totalNumWeightAll = accAdd(that.reportMessagesRes.totalNumWeight,that.resTfoOrder.totalWeightAll);
                that.reportMessagesRes.totalNumVolumeAll = accAdd(that.reportMessagesRes.totalNumVolume,that.resTfoOrder.totalVolumeAll);

                // type = 1  点弹窗 —— 取消选中
                if(type == '1'){
                    that.closeMaskLayer();
                }

            }
        },
        removeArrayObjFun(_arr, _obj){   //   删除数组中的某一个对象：返回删除后剩余的数组  :::  _arr:数组 , _obj:需删除的对象
            var length = _arr.length;
            for (var i = 0; i < length; i++) {
                if (_arr[i] == _obj) {
                    if (i == 0) {
                        _arr.shift(); //删除并返回数组的第一个元素
                        return _arr;
                    }
                    else if (i == length - 1) {
                        _arr.pop();  //删除并返回数组的最后一个元素
                        return _arr;
                    }
                    else {
                        _arr.splice(i, 1); //删除下标为i的元素
                        return _arr;
                    }
                }
            }
        },
        // 取消多个选中订单
        cancelLisFun(){
            var that = this;
            var r = confirm("是否批量取消选中的订单");
            if(r == true){
                if(that.checkedOperaOrder.length == 0){
                    alert('请先勾选至少一个订单');
                }else{
                    $.each(that.checkedOperaOrder, function (index, item) {
                        that.reportMessagesOrderList = that.removeArrayObjFun(that.reportMessagesOrderList,item);
                        // 重置 标记点的颜色
                        var omOrderIdVal = item.omOrderId;
                        $('#order'+omOrderIdVal).html('');
                    });
                    that.allCheckboxChecked = false;
                    $(".orderDistributionMapBtn input[type='checkbox']").prop('checked',false);
                    $(".reportMessagesOrderUls input[type='checkbox']").prop('checked', $(".orderDistributionMapBtn input[type='checkbox']").prop('checked'));
                    that.checkedOperaOrder = [];
                    // 重置 总计
                    that.reportMessagesRes = {
                        endAddress:"",
                        totalNumQty:0,
                        totalNumWeight:0,
                        totalNumVolume:0,
                        int2: 0,
                        int2All: 0
                    };
                    for(var i = that.reportMessagesOrderList.length-1 ; i >= 0;i--){
                        var itemList = that.reportMessagesOrderList[i];
                        if(that.reportMessagesRes.endAddress == ''){
                            if(itemList.stoAddress != null){
                                that.reportMessagesRes.endAddress = itemList.stoAddress;
                            }
                        }
                    }
                    if(that.reportMessagesRes.endAddress == ''){
                        that.reportMessagesRes.endAddress = that.endAddressStr;
                    }
                    that.reportMessagesRes.int2 = that.reportMessagesOrderList.length;
                    $.each(that.reportMessagesOrderList, function (index, item) {
                        if(item.totalQty != null){
                            that.reportMessagesRes.totalNumQty = accAdd(that.reportMessagesRes.totalNumQty,item.totalQty);
                        }
                        if(item.totalWeight != null){
                            that.reportMessagesRes.totalNumWeight = accAdd(that.reportMessagesRes.totalNumWeight,item.totalWeight);
                        }
                        if(item.totalVolume != null){
                            that.reportMessagesRes.totalNumVolume = accAdd(that.reportMessagesRes.totalNumVolume,item.totalVolume);
                        }
                    });
                    that.reportMessagesRes.int2All = accAdd(that.reportMessagesRes.int2,that.resTfoOrder.int2);
                    that.reportMessagesRes.totalNumQtyAll = accAdd(that.reportMessagesRes.totalNumQty,that.resTfoOrder.totalQtyAll);
                    that.reportMessagesRes.totalNumWeightAll = accAdd(that.reportMessagesRes.totalNumWeight,that.resTfoOrder.totalWeightAll);
                    that.reportMessagesRes.totalNumVolumeAll = accAdd(that.reportMessagesRes.totalNumVolume,that.resTfoOrder.totalVolumeAll);
                }
            }
        },
        // 全选订单
        checkboxAllSelectionFun(allChecked){
            $(".reportMessagesOrderUls input[type='checkbox']").prop('checked', $(".orderDistributionMapBtn input[type='checkbox']").prop('checked'));
            var that = this;
            if(allChecked == false){
                that.checkedOperaOrder = [];
                for(var i = 0; i < that.reportMessagesOrderList.length;i++){
                    that.checkedOperaOrder.push(that.reportMessagesOrderList[i]);
                }
                that.allCheckboxChecked = true;
                that.checkedOperaOrderLen = that.checkedOperaOrder.length;
            }else{
                for(var ii = 0; ii < that.reportMessagesOrderList.length;ii++){
                    that.checkedOperaOrder.splice($.inArray(that.reportMessagesOrderList[ii],that.checkedOperaOrder),1)
                }
                that.allCheckboxChecked = false;
                that.checkedOperaOrderLen = that.checkedOperaOrder.length;
            }
        },
        // 单选订单
        checkboxSelectionFun(event,orderItem,index){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedOperaOrder.push(orderItem);
            }else{
                that.checkedOperaOrder.splice($.inArray(orderItem,that.checkedOperaOrder),1)
            }
            that.checkedOperaOrderLen = that.checkedOperaOrder.length;
            if(that.checkedOperaOrderLen == $(".reportMessagesOrderUls .reportMessagesOrderUlNum").length){  // 单选个数 = 该页条数，全选选中
                that.allCheckboxChecked = true;
                $(".orderDistributionMapBtn input[type='checkbox']").prop('checked',true);
            }else{
                that.allCheckboxChecked = false;
                $(".orderDistributionMapBtn input[type='checkbox']").prop('checked',false);
            }
        },

        getSearchVal1(){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam1;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:5
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == ""){
                deliveryTimeVal = getQueryTime(-1);
                imitatePopup("查询时间不能置为空，已填入默认时间！");
            }
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime = deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
            }
            $("#classTableId tr.see").removeClass('active');

            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.deliveryDate = deliveryTimeVal;
                that.finishScheduleOrder = data.result;
                that.currentPage1 = 1;
                that.currentOrderIndex = -1;
                that.tfoOrderInfoDetail = false;
                $(".finishScheduleList .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.currentClassesArr = [];
                $("#classesOrderTable table input").attr("checked",false);
                that.pageList1 = [];
                that.totalPagesNum1 = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        textboxAllSelectionFun2(){
            var that = this;
            that.currentClassesArr = [];
            $("#classesOrderTable tbody input[type='checkbox']").prop('checked', $("#classesOrderTable thead input[type='checkbox']").prop('checked'));
            if($("#classesOrderTable thead input").prop("checked")){
                for(var i = 0; i < that.finishScheduleOrder.length; i++){
                    that.currentClassesArr.push(that.finishScheduleOrder[i]);
                }
            }else{
                for(var i = 0; i < that.finishScheduleOrder.length; i++){
                    that.currentClassesArr = that.currentClassesArr.filter(function (ele){return ele != that.finishScheduleOrder[i];});
                }
            }
        },
        textboxSelectionFun2(event,orderItem){
            event.stopPropagation();
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.currentClassesArr.push(orderItem);
            }else{
                that.currentClassesArr.splice($.inArray(orderItem,that.currentClassesArr),1);
            }
            if(that.currentClassesArr.length == that.finishScheduleOrder.length){  // 单选个数 = 该页条数，全选选中
                $("#classesOrderTable thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#classesOrderTable thead input[type='checkbox']").prop('checked',false);
            }
        },
        // 班次合并
        classesMerge(){
            var that = this;
            if (that.currentClassesArr.length == 0) {
                imitatePopup("请先勾选班次", 'alert');
                return false;
            }
            var r = confirm("是否确认合并班次？");
            if(!r){
                return false;
            }
            var combineArr = [];
            for(var i=0;i<that.currentClassesArr.length;i++){
                combineArr.push({
                    fromOrderId:that.currentClassesArr[i].omOrderId,
                    fromOrderNo:that.currentClassesArr[i].customerOriginalNo
                })
            }
            postRequest(tmsUrl + "/merge/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,combineArr,function(data){
                if(data.result){
                    if(data.msg == 'success' || data.msg == 'SUCCESS'){
                        imitatePopup("班次合并成功！", 'alert');
                        that.getSearchVal1();
                    }else{
                        imitatePopup(data.msg,"alert");
                    }
                } else{
                    imitatePopup("班次合并失败，请重试！", 'alert');
                }
            })
        },
        // 班次调整
        classesAdjust(){
            var that = this;
            $("#classTableId tr.see").removeClass('active');
            $("#classTableId tr.see .btn").hide();
            if(that.currentClassesArr.length == 0){
                imitatePopup("请先勾选班次",'alert');
                return false;
            }
            that.classesTotallist = [];
            that.besicInfosList = [];
            that.sortTemShowList = [];
            that.sortTransDataList = [];
            that.totalQwv = [];
            var infos = that.currentClassesArr;
            that.pageWayFun(infos);
            $(".maskLayer7").show();
        },
        // 得到调整班次数据
        pageWayFun(tableOrderItem){
            var that = this;
            for(var i=0;i<tableOrderItem.length;i++){
                var searchFormArr = {
                    refId: tableOrderItem[i].omOrderId,
                    refNo: tableOrderItem[i].orderNo
                };
                //获取订单列表
                postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    if(data.result != null){
                        if(data.result.carrierPartyInfo != null){
                            that.classesTotallist.push(data.result.carrierPartyInfo);
                        }
                        if(data.result.order != null){
                            that.besicInfosList.push(data.result.order)
                        }
                        if(data.result.orderLnkList != null && data.result.orderLnkList.length != 0){
                            var orderLnkList = data.result.orderLnkList;
                            that.sortTemShowList.push(orderLnkList);
                            that.sortTransDataList.push(orderLnkList);
                            for(var j=0;j<orderLnkList.length;j++){
                                var totalQwvItem = orderLnkList[j].totalQty + '件 ' + orderLnkList[j].totalWeight + 'kg ' + orderLnkList[j].totalVolume + 'm³';
                                that.totalQwv.push(totalQwvItem);
                            }
                        }else{
                            var orderLnkList = [];
                            that.sortTemShowList.push(orderLnkList);
                            that.sortTransDataList.push(orderLnkList);
                            var totalQwvItem = '';
                            that.totalQwv.push(totalQwvItem);
                        }
                    }
                })
            }
            setTimeout(function(){
                that.rowDrop1();
            },800)
        },
        // 订单拖拽排序
        rowDrop1(orderList){
            var that = this;
            var arr = {};
            for(let i=0;i<that.classesTotallist.length;i++){
                if(that.sortTransDataList[i]){
                    var drop = this.$refs.drop[i];
                    Sortable.create(drop, {
                        group: "words",
                        animation: 150,
                        onStart: function (evt) {  //拖拽开始发生该事件
                            var array = that.sortTransDataList[i].slice(0);
                            arr = array.splice(evt.oldIndex,1)[0];
                        },
                        onRemove: function (evt){ //删除拖拽节点的时候促发该事件
                            var newArray1 = that.sortTransDataList[i].slice(0);
                            newArray1.splice(evt.oldIndex,1)[0];
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray1;
                            that.besicInfosList[i].totalQty = ((that.besicInfosList[i].totalQty * 1-arr.totalQty * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalWeight = ((that.besicInfosList[i].totalWeight * 1-arr.totalWeight * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalVolume = ((that.besicInfosList[i].totalVolume * 1-arr.totalVolume * 1).toFixed(2))*1;
                        },
                        onAdd: function (evt){ //拖拽时候添加有新的节点的时候发生该事件
                            var newArray2 = that.sortTransDataList[i].slice(0);
                            newArray2.splice(evt.newIndex,0,arr);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray2;

                            that.besicInfosList[i].totalQty = ((that.besicInfosList[i].totalQty * 1+arr.totalQty * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalWeight = ((that.besicInfosList[i].totalWeight * 1+arr.totalWeight * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalVolume = ((that.besicInfosList[i].totalVolume * 1+arr.totalVolume * 1).toFixed(2))*1;
                        },
                        onUpdate: function (evt) {  //拖拽更新节点位置发生该事件
                            var newArray = that.sortTransDataList[i].slice(0);
                            newArray.splice(evt.newIndex, 0,newArray.splice(evt.oldIndex,1)[0]);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray;
                        }
                    });
                }
            }
        },
        // 保存调整完的班次
        saveClassesSortingFun(){
            var that = this;
            var newSortArray = [];
            for(let a=0;a<that.sortTransDataList.length;a++){
                var refInfoModelList = [];
                var temporaryDrawItem = that.sortTransDataList[a];
                for(var i=0; i<temporaryDrawItem.length;i++){
                    refInfoModelList.push({refId:temporaryDrawItem[i].omOrderId});
                }
                newSortArray.push({
                    fromOrderId:that.besicInfosList[a].omOrderId,
                    refInfoModelList:refInfoModelList
                });
            }
            postRequest(tmsUrl+'/update/tfoOrderTfoLnk.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,newSortArray,function(res){
                if(res.msg == 'success' || res.msg == 'SUCCESS'){
                    setTimeout(function(){
                        imitatePopup("班次调整成功！","alert");
                    },300);
                    that.getSearchVal1();
                    $(".maskLayer").hide();
                }else{
                    imitatePopup(res.msg,"alert");
                }
            });
        },
        // 关闭班次调整
        closeMaskLayer4(){
            var that = this;
            $(".maskLayer").hide();
            that.currentClassesArr = [];
            $("#classesOrderTable table input").attr("checked",false);
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
                })
            },100)
        },

        // 点击“拆单”
        showOrderSplit(tableSelOrder){
            var that = this,newArray00 = [];
            that.popupType = '2';
            that.oneSplitCount = '';
            that.isShowOneSplitList = '0';
            newArray00.push(tableSelOrder);
            that.tableSelOneOrderList = newArray00;
        },
        createOneOrderSplit(){
            var that = this;
            var splitCountNum = parseInt(that.oneSplitCount);
            var splitType = that.oneSplitType;
            var splitTypeTxt = "";
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                if(splitType == 'master'){
                    that.isShowOneSplitListType = '1';
                }else{
                    that.isShowOneSplitListType = '2';
                }
                var params = {
                    masterOrderId:that.tableSelOneOrderList[0].omOrderId,
                    splitCount:that.oneSplitCount,
                    splitType: that.oneSplitType
                }
                postRequest(tmsUrl + "/split/houseOrderList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                    that.isShowOneSplitList = "1";
                    that.orderOneSplitList = res.result;
                })
            }else{
                alert("请输入大于1的正整数");
                that.isShowOneSplitList = "0";
                return false;
            }
        },
        orderOneSplitFun(){
            var that = this;
            var params = {
                masterOrderId:that.tableSelOneOrderList[0].omOrderId,
                houseOrderList:that.orderOneSplitList,
                splitType:that.oneSplitType
            }
            postRequest(tmsUrl + "/split/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                if(res.msg == 'success' || res.msg == 'SUCCESS'){
                    if(res.msg.success == false){
                        alert(res.msg.message);
                        return false;
                    }
                };
                that.closeMaskLayer();
                that.getSearchVal();
            })
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
                alert("请输入大于1的正整数");
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
                        alert(res.msg.message);
                        return false;
                    }
                };
                that.getSearchVal(1);
                closeSideslip();
            })
        },
        getOrderDetails(template,order,isAbnormalPage){
            this.abnormalPage = isAbnormalPage;
            this.templateTitle = template;
            this.currentOrderId = order.omOrderId;
            this.isShowSplitList = "0";
            var that = this;
            getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.order.orderType == "DO"){
                    that.isShippingOrder = true;
                }else{
                    that.isShippingOrder = false;
                }
                if(data.result.shipperPartyInfo != null){
                    if(data.result.shipperPartyInfo.party != null){
                        that.shipperParty = data.result.shipperPartyInfo.party;
                    }else{
                        that.shipperParty = {};
                    }

                    if(data.result.shipperPartyInfo.imgContact != null){
                        that.shipperPartyContact = data.result.shipperPartyInfo.imgContact;
                    }else{
                        that.shipperPartyContact = {};
                    }

                    if(data.result.shipperPartyInfo.location != null){
                        that.shipperPartyLocation = data.result.shipperPartyInfo.location;
                    }else{
                        that.shipperPartyLocation = {};
                        that.shipperPartyLocationContact = {};
                    }

                    if(data.result.shipperPartyInfo.contact != null){
                        that.shipperPartyLocationContact = data.result.shipperPartyInfo.contact;
                    }else{
                        that.shipperPartyLocationContact = {};
                    }

                }else{
                    that.shipperParty = {};
                    that.shipperPartyContact = {};
                    that.shipperPartyLocation = {};
                    that.shipperPartyLocationContact = {};
                }
                // 收货商
                if(data.result.receiptPartyInfo != null){
                    if(data.result.receiptPartyInfo.party != null){
                        that.receiptParty = data.result.receiptPartyInfo.party;
                    }else{
                        that.receiptParty = {};
                    }

                    if(data.result.receiptPartyInfo.imgContact != null){
                        that.receiptPartyContact = data.result.receiptPartyInfo.imgContact;
                    }else{
                        that.receiptPartyContact = {};
                    }

                    if(data.result.receiptPartyInfo.location != null){
                        that.receiptPartyLocation = data.result.receiptPartyInfo.location;

                    }else{
                        that.receiptPartyLocation = {};
                    }

                    if(data.result.receiptPartyInfo.contact != null){
                        that.receiptPartyLocationContact = data.result.receiptPartyInfo.contact;
                    }else{
                        that.receiptPartyLocationContact = {};
                    }

                }else{
                    that.receiptParty = {};
                    that.receiptPartyContact = {};
                    that.receiptPartyLocation = {};
                    that.receiptPartyLocationContact = {};
                }

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
                // 包裹商品
                if (data.result.orderItemInfoList != null){
                    that.packageGoodsDetails = data.result.orderItemInfoList;
                }else {
                    that.packageGoodsDetails = [];
                }
                // 承运商
                if(data.result.carrierPartyInfo != null){
                    if(data.result.carrierPartyInfo.party != null){
                        that.OrderCarrier = data.result.carrierPartyInfo.party;
                    }else{
                        that.OrderCarrier = {};
                    }

                    if(data.result.carrierPartyInfo.contact != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.contact;
                    }else{
                        that.OrderCarrierDriver = {};
                    }

                    if(data.result.carrierPartyInfo.eqp != null){
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.eqp;
                    }else{
                        that.OrderCarrierEqp = {};
                    }

                    if(data.result.carrierPartyInfo.location != null){
                        that.OrderCarrierLocation = data.result.carrierPartyInfo.location;
                    }else{
                        that.OrderCarrierLocation = {};
                    }
                }else{
                    that.OrderCarrier = {};
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {};
                    that.OrderCarrierLocation = {};
                }
                // 时间属性
                if(data.result.dtmList != null){
                    that.dtmListInfoList = data.result.dtmList;
                }else{
                    that.dtmListInfoList = [];
                }

            })
        },
        resetOrderList(){
            window.location.reload();
        },
        requestWmsFun(){
            var that = this,times = 5*60*1000; // 5分钟
            if(localStorage.getItem('orderSynTime') == null){
                that.requestWmsRequest();
            }else{
                var lastTimes = localStorage.getItem('orderSynTime');
                if ((new Date()).getTime() - lastTimes > times) {
                    that.requestWmsRequest();
                }else{
                    alert('距离上次订单同步间隔不到5分钟，请稍后重试！');
                }
            }
        },
        requestWmsRequest(){
            var that = this;
            var r = confirm("该操作间隔5分钟，是否继续操作？");
            if (r == true){
                getRequest(tmsUrl + "/get/tmWmsOutOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,function(data){
                    localStorage.setItem('orderSynTime', (new Date()).getTime());
                });
            }
        },
        showStoPartyAbbrInf(event,stoPartyAbbrInf){
            var elOffsetTop = "";
            var elOffsetLeft = "";
            var partname = window.location.pathname;
            $('body').mousemove(function(e) {
                var e = e || window.event;
                elOffsetLeft = e.pageX || e.clientX + document.body.scroolLeft;
                elOffsetTop = e.pageY || e.clientY + document.body.scrollTop;
//	            console.log(elOffsetTop);
                if(partname == "/html/tms/orderAllocation1.html"){
                    elOffsetLeft = elOffsetLeft + 12;
                    elOffsetTop = elOffsetTop + 12;
                }else{
                    elOffsetLeft = elOffsetLeft - 165;
                    elOffsetTop = elOffsetTop - 45;
                }
                $(".showStoPartyAbbrInfDiv").css({
                    top: elOffsetTop + "px",
                    left: elOffsetLeft + "px"
                })
            });


            var el = event.target;
            var that = this;
            if(stoPartyAbbrInf == null){
                that.currentStoAbbrInf = "暂无收货商地址名称信息"
            }else{
                that.currentStoAbbrInf = "收货地址名称:" + stoPartyAbbrInf;
            }
            that.showCurrentOrderAbbrInf = true;
        },
        hideStoPartyAbbrInf(event){
            //console.log(123);
            var that = this;
            that.showCurrentOrderAbbrInf = false;
        },

        showOrderNumInf(event,tableOrderItem){
            likeOpenSignalOrderInfo(tableOrderItem);
            $('#order'+tableOrderItem.omOrderId).css({"width":"13px","height":"13px"});
            $('#order'+tableOrderItem.omOrderId).find("div").css("background","#f1fb2f");
            var elOffsetTop = "";
            var elOffsetLeft = "";
            var partname = window.location.pathname;
        },
        hideOrderNumInf(event,tableOrderItem){
            var that = this;
            closeSignalOrderInfo();
            $('#order'+tableOrderItem.omOrderId).css({"width":"8px","height":"8px"});
            $('#order'+tableOrderItem.omOrderId).find("div").css("background","#ee9200");
        },


        tableSelOrderQz(tableSelOrder,omOrderId){
            /*$.each(markerInfoArray, function (index0, item0){
                if(item0.omOrderId == omOrderId){
                    markerInfoResArrayAll.push(tableSelOrder);
                }
            })*/
        },
        tableSelOrderQxQz(tableSelOrder,omOrderId){
            var that = this,QxQzIndex = '',QxQzOmOrderId = '';
            $.each(that.reportMessagesOrderList, function (index, item) {
                if (item.omOrderId == omOrderId) {
                    QxQzIndex = index;
                    QxQzOmOrderId = omOrderId;
                }
            });
            that.cancelLiFun(QxQzOmOrderId,QxQzIndex,'1');
        },

        // 获取运单信息
        getTransSearchVal(info){
            var that = this;
            if(that.markerArray.length > 0){
                for(var a=0;a<that.markerArray.length;a++){
                    map.remove(that.markerArray[a]);
                }
            }
            map.remove(infoWindow);
            that.queryParam11 = {
                str1: "",
                tzoOrderIds: info.omOrderId
            };
            var searchFormArr = that.queryParam11;
            var startCompleteTime =that.timeHorizon1.split(" - ")[0];
            var endCompleteTime =that.timeHorizon1.split(" - ")[1];
            searchFormArr.startCompleteTime = startCompleteTime;
            searchFormArr.endCompleteTime = endCompleteTime;
            searchFormArr.assignStatus = '0';
            that.taskOrderTotalInfo = {
                str1: info.str1,
                count: 0,
                totalQty: 0,
                totalWeight: 0,
                totalVolume: 0,
                startCompleteTime: startCompleteTime,
                endCompleteTime: endCompleteTime
            };
            postRequest(tmsUrl + "/query/tjoTzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.taskOrderInfoList = data.result.tjoOrderList;
                that.taskOrderTotalInfo.count = data.result.tjoOrderList.length;
                that.taskOrderTotalInfo.totalQty = data.result.totalQty;
                that.taskOrderTotalInfo.totalWeight = data.result.totalWeight;
                that.taskOrderTotalInfo.totalVolume = data.result.totalVolume;
                that.markerAreaArrayFun(that.taskOrderInfoList);
            })
        },
        markerAreaArrayFun(markerInfoArray){
            var that = this;
            that.markerArray = [];
            for(var n = 0; n < markerInfoArray.length; n++){
                var newDiv = document.createElement("div");
                var item = markerInfoArray[n],markerLocation = [],stoLatLngStr = '';

                if(item.stoLatLng != null && item.stoLatLng != ''){

                    stoLatLngStr = item.stoLatLng;
                    var string0 = item.stoLatLng.split(',');
                    markerLocation.push(string0[0]);
                    markerLocation.push(string0[1]);
                    newDiv.className  = 'orderMapPoint';
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
        clickSignalOrderInfo(e){
            var that = this;
            var stoLatLngStrVal = e.target.ue.content.attributes.stoLatLngStr.value;
            var omOrderId = e.target.ue.content.attributes.omOrderId.value;
            $('.amap-info-contentContainer').show();
            var temp = [],info;
            for(var n=0;n<that.taskOrderInfoList.length;n++){
                if(that.taskOrderInfoList[n].stoLatLng == stoLatLngStrVal){
                    temp.push(n);
                }
            }
            for (var i=0;i<that.taskOrderInfoList.length;i++) {
                if(that.taskOrderInfoList[i].omOrderId == omOrderId) {
                    var totalDiv = '';
                    for (var a=0; a<temp.length;a++) {
                        var tem = temp[a];
                        totalDiv += '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">单号：</span><span class="pointInfoColor2">' + that.taskOrderInfoList[tem].trackingNo + '</span></p>' +
                            '<p><span class="pointInfoColor1">件/毛/体：</span><span class="pointInfoColor2">' + that.taskOrderInfoList[tem].totalQty+'件 '+ that.taskOrderInfoList[tem].totalWeight+'kg '+ that.taskOrderInfoList[tem].totalVolume+'m³</span></p>' +
                            '<p><span class="pointInfoColor1">状态：</span><span class="pointInfoColor2">' + that.completeStatusChange(that.taskOrderInfoList[tem].completeStatus) + '</span></p>' +
                            '<p><span class="pointInfoColor1">发货商 | 地址：</span><span class="pointInfoColor2">' + that.taskOrderInfoList[tem].sfrPartyName +' | '+ that.taskOrderInfoList[tem].sfrAddress + '</span></p>' +
                            '<p><span class="pointInfoColor1">收货商 | 地址：</span><span class="pointInfoColor2">' + that.taskOrderInfoList[tem].stoPartyName +' | '+ that.taskOrderInfoList[tem].stoAddress + '</span></p>';
                    }
                    info = '<div>' +totalDiv + '</div>';
                }
            }
            infoWindow.setContent(info);
            infoWindow.open(map, e.target.getPosition());
        },
        /*// 获取片区信息
        getWaybillInfoList(){
            var that = this;
            that.areaDistrictList = [];
            that.areaDistrictGroups = [];
            that.districtPolygonGroups = [];
            that.overlaysGroups = [];
            that.pathList = [];
            that.manualPolygonGroups = [];
            that.waybillInfoList = [];
            that.handWaybillInfoList = [];
            that.autoWaybillInfoList = [];
            that.boxToClear = false;
            var params = {};
            postRequest(tmsUrl + "/query/tzoOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
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
            });
        },

        // 新增片区
        addTaskArea(){
            var that = this;
            that.boxToChoose = !that.boxToChoose;
            that.drawAreaType = '1';
        },
        addTaskArea1(){
            var that = this;
            that.boxToChoose = false;
            if(that.drawAreaType == '2'){
                $(".maskLayer4").show();
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
            } else if(that.drawAreaType == '1'){
                that.drawPolygon('2')
            }
        },
        closeMaskLayer1(){
            $(".maskLayer4").hide();
        },
        // 点击清空片区
        clearAllTaskArea(){
            var that = this;
            that.boxToClear = !that.boxToClear;
        },
        sureClearAllArea(){
            var that = this;
            var omOrderId = [];
            for(var i=0;i<that.waybillInfoList.length;i++){
                omOrderId.push(that.waybillInfoList[i].omOrderId)
            }
            postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    map.clearMap();
                    that.areaDistrictList = [];
                    that.areaDistrictGroups = [];
                    that.districtPolygonGroups = [];
                    that.overlaysGroups = [];
                    that.pathList = [];
                    that.manualPolygonGroups = [];
                    that.waybillInfoList = [];
                    that.handWaybillInfoList = [];
                    that.autoWaybillInfoList = [];
                    that.boxToClear = false;
                }
            })
        },

        // 手动绘制片区
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
                fillOpacity: 0.4,
                fillColor: '#fff',
                strokeColor: '#fff'
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
        // 取消手动绘制片区
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
        // 保存手动绘制片区
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
            $(".maskLayer5").show();
            that.handPartyLocation = {
                omOrderId: "",
                customAreaName: "",
                customAreaNo: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: ""
            }
        },
        closeMaskLayer2(){
            var that = this;
            that.routine = '4';
            $(".maskLayer5").hide();
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
            var params = {
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
                    imitatePopup("新增或调整片区成功！","alert");
                    that.patternArea = '1';
                    $(".maskLayer5").hide();
                    map.clearMap();
                    that.getWaybillInfoList();
                }
            });
        },
        // 调整手动绘制片区
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
        // 手动绘制片区转换、显示
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
                    fillOpacity: 0.4,
                    fillColor: '#fff',
                    strokeColor: '#fff'
                });
                that.manualPolygonGroups.push(that.certainPolygon);
            } else if(num == '2'){
                map.remove(that.manualPolygonGroups[that.originalI]);
                that.certainPolygon = new AMap.Polygon({
                    path: that.restorePolygon,
                    strokeWeight: 2,
                    fillOpacity: 0.4,
                    strokeStyle: "dashed",
                    fillColor: '#008cff',
                    strokeColor: '#008cff'
                });
                that.manualPolygonGroups[that.originalI] = that.certainPolygon;
            } else if(num == '3'){
                map.remove(that.overlaysGroups[that.overlaysGroups.length-1]);
                that.overlaysGroups.splice(that.overlaysGroups.length-1,1);
                that.certainPolygon = new AMap.Polygon({
                    path: that.pathList,
                    strokeWeight: 2,
                    fillOpacity: 0.4,
                    strokeStyle: "dashed",
                    fillColor: '#008cff',
                    strokeColor: '#008cff'
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
                            that.getTransSearchVal(that.handWaybillInfoList[i]);
                            that.manualPolygonGroups[i].setOptions({
                                strokeStyle: "dashed",
                                fillColor: '#008cff',
                                strokeColor: '#008cff'
                            });
                        }else{
                            that.manualPolygonGroups[i].setOptions({
                                strokeStyle: "solid",
                                fillColor: '#fff',
                                strokeColor: '#fff'
                            });
                        }
                    }
                    for(var m=0;m<that.districtPolygonGroups.length;m++){
                        for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                            that.districtPolygonGroups[m][n].setOptions({
                                strokeStyle: "solid",
                                fillColor: '#fff',
                                strokeColor: '#fff'
                            })
                        }
                    }
                }
            });
            that.mapClick();
        },
        // 点击片区以外
        mapClick(){
            var that = this;
            map.on('click', function(e){
                if(that.markerArray.length > 0){
                    for(var a=0;a<that.markerArray.length;a++){
                        map.remove(that.markerArray[a]);
                    }
                }
                map.remove(infoWindow);
                that.taskOrderTotalInfo.str1 = "";
                if(!that.computeString || that.overlaysGroups.length > 0 || that.patternArea == '2'){
                    return false
                }
                if(that.mapChangeColor){
                    that.patternArea = '1';
                    for(var m=0;m<that.districtPolygonGroups.length;m++){
                        for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                            that.districtPolygonGroups[m][n].setOptions({
                                strokeStyle: "solid",
                                fillColor: '#fff',
                                strokeColor: '#fff'
                            })
                        }
                    }
                    for(var i=0;i<that.manualPolygonGroups.length;i++){
                        that.manualPolygonGroups[i].setOptions({
                            strokeStyle: "solid",
                            fillColor: '#fff',
                            strokeColor: '#fff'
                        });
                    }
                } else{
                    imitatePopup("未保存或取消调整片区！","alert")
                }
            });
        },
        // 重新绘制
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
        // 再次调整手动绘制片区
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
            that.polyEditor.close();
            that.manualPolygonGroups[that.originalI] = that.polygonAgain;
            that.adminManualAreaAgain(that.polygonAgain.getPath());
        },
        // 重新绘制或调整之后保存片区
        adminManualAreaAgain(path){
            var that = this;
            var path = path;
            var addressPath = "";
            for(var i=0;i<path.length;i++){
                var pathItem = "["+path[i].lng+","+path[i].lat+"],";
                if(i == path.length-1){
                    pathItem = "["+path[i].lng+","+path[i].lat+"]";
                }
                addressPath+=pathItem
            }
            var params = {
                order:{
                    omOrderId: that.handWaybillInfoList[that.originalI].omOrderId,
                    orderNature:"自定义",
                    customerOriginalNo: that.handWaybillInfoList[that.originalI].customerOriginalNo,
                    str1: that.handWaybillInfoList[that.originalI].str1
                },
                stationLocationInfoList:[{
                    provinceCode: that.handWaybillInfoList[that.originalI].stoProvinceCode,
                    cityCode: that.handWaybillInfoList[that.originalI].stoCityCode,
                    districtCode: "",
                    address: "["+addressPath+"]"
                }]
            };
            postRequest(tmsUrl + "/save/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    that.handWaybillInfoList[that.originalI].stoAddress = "["+addressPath+"]";
                    imitatePopup("新增或调整片区成功！","alert");
                    that.patternArea = '3';
                    that.mapChangeColor = true;
                }
            });
        },
        // 删除选中手动绘制片区
        deletePolygon(){
            var that = this;
            that.boxToDelete = !that.boxToDelete;
        },
        sureDeleteSelectPolygon(){
            var that = this;
            var omOrderId = [that.handWaybillInfoList[that.originalI].omOrderId];
            postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    map.remove(that.manualPolygonGroups[that.originalI]);
                    that.manualPolygonGroups.splice(that.originalI,1);
                    that.boxToDelete = false;
                    that.patternArea = '1';
                }
            });
        },
        // 查看自定义片区运单
        handWaybillInfoItem(){
            var that = this;
            $(".maskLayer3").show();
        },
        closeMaskLayer3(){
            $(".maskLayer3").hide()
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
                var areaName = that.areaDistrictList[j].chineseName;
                district.search(areaName, function(status, result) {
                    var bounds = result.districtList[0].boundaries;
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            var polygon = new AMap.Polygon({  //生成行政区划polygon
                                strokeWeight: 2,
                                path: bounds[i],
                                fillOpacity: 0.4,
                                fillColor: '#fff',
                                strokeColor: '#fff'
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
            that.mapClick();
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
                        imitatePopup("新增或调整片区成功！","alert");
                        that.patternArea = '1';
                        $(".maskLayer4").hide();
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
                        imitatePopup("新增或调整片区成功！","alert");
                        that.patternArea = '1';
                        $(".maskLayer4").hide();
                    }
                });
            }
        },
        // 行政区域片区点击变色
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
                    fillColor: '#fff',
                    strokeColor: '#fff'
                });
            }
            for(var m=0;m<that.districtPolygonGroups.length;m++){
                for(var n=0;n<that.districtPolygonGroups[m].length;n++){
                    that.districtPolygonGroups[m][n].setOptions({
                        strokeStyle: "solid",
                        fillColor: '#fff',
                        strokeColor: '#fff'
                    })
                }
            }
            for(var a=0;a<that.areaDistrictGroups.length;a++){
                var list = that.areaDistrictGroups[a];
                for(var b=0;b<list.length;b++){
                    if(list[b].chineseName == areaName){
                        that.presentI = a;
                        that.getTransSearchVal(that.autoWaybillInfoList[a]);
                        var poList = that.districtPolygonGroups[a];
                        that.restoreDisPolygon = that.districtPolygonGroups[a];
                        for(var c=0;c<poList.length;c++){
                            poList[c].setOptions({
                                strokeStyle: "dashed",
                                fillColor: '#ed7d31',
                                strokeColor: '#ed7d31'
                            })
                        }
                    }
                }
            }
        },
        // 删除行政区域片区
        deleteDistrictPolygon(){
            var that = this;
            that.boxToDeleteDistrict = !that.boxToDeleteDistrict;
        },
        sureDeleteSelectDistrictPolygon(){
            var that = this;
            var omOrderId = [that.autoWaybillInfoList[that.presentI].omOrderId];
            postRequest(tmsUrl + "/delete/tzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderId,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    map.remove(that.districtPolygonGroups[that.presentI]);
                    that.districtPolygonGroups.splice(that.presentI,1);
                    that.areaDistrictGroups.splice(that.presentI,1);
                    that.boxToDeleteDistrict = false;
                    that.patternArea = '1';
                }
            });
        },
        // 调整选中行政区域片区
        adjustSelectDistrictPolygon(){
            var that = this;
            $(".maskLayer4").show();
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
                                    $(".maskLayer4").show();
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

        // 片区排单
        areaScheduleOrder(){
            var that = this;
            if(!that.taskOrderTotalInfo.str1){
                imitatePopup("请先选择片区！","alert");
                return false;
            }
            $(".maskLayer6").show();
        },
        sureAreaScheduleOrder(){
            var that = this;
            var shipTimeVal1 = $("#shipTime1").val();
            var completionTime1 = $(".completionTime1").html() + " "+ shipTimeVal1;
            var searchFormArr = {
                tzoOrderIds: that.queryParam11.tzoOrderIds,
                startCompleteTime: that.timeHorizon1.split(" - ")[0],
                endCompleteTime: that.timeHorizon1.split(" - ")[1],
                assignStatus: '0',
                dtmTime: completionTime1
            };
            postRequest(tmsUrl + "/save/tjoTzoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    imitatePopup("片区派单成功！","alert");
                    $(".maskLayer6").hide();
                } else{
                    imitatePopup(data.msg,"alert");
                }
            })
        }*/
    },
    created:function(){
        var that = this;
        initSelectData(this);
        that.queryParam = {};
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.timeHorizon1 = getQueryTime(1)+" - "+ getQueryTime(-10);
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
        // 获取现有班次
        var searchFormArr1 = {
            pageInfo:{
                pageNum: 1,
                pageSize: 5
            },
            isAsign: true,
            startCompleteTime: getQueryTime(-1),
            endCompleteTime: getQueryTime(-1)
        };
        postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
            that.finishScheduleOrder = data.result;
            that.totalPagesNum1 = data.pageInfo.total;
            for(var i = 0 ; i < data.pageInfo.pages;i++){
                that.pageList1[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })
        // that.getWaybillInfoList();
    },
    mounted: function(){
        this.timeHorizon1 = getQueryTime(-1)+" - "+ getQueryTime(-1);
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
        },
        timestampToTime2(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                //  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
                var currentTime = timestamp - offsetMs;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() < 10 ? '0'+ date.getDate() + ' ' : date.getDate();
                return Y+M+D;
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
        }
    }
})

////////////////////////////////////////////////////// 绘制矢量图形 ////////////////////////////////////////////////////////////////////////////
var map = new AMap.Map("container", {
    zoom: 6,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}); //信息窗体

var markerInfoArray = [];  // 总订单列表692385c0456b39aa7ddc41e56c88596f

var markerInfoResArrayAll = [];  // 选中的订单数组（总数组）（还要 push 本次选中的数组）

var markerArray = [],pathArray = [];  // 批量的标记点 ，所绘制的几何图形的点数组

var mouseTool = new AMap.MouseTool(map);  //在地图中添加MouseTool插件
var drawType = '';    // 绘制图形的类型

AMap.event.addListener(mouseTool, 'draw', function(type,obj) {
    pathArray = [];
    var polygonItem = type.obj;
    var path = polygonItem.getPath(); // 取得绘制的多边形
    $.each(path, function (index, item) {
        var param1 = [item.lng,item.lat];
        pathArray.push(param1);  // 取得绘制的多边形的每一个点坐标
    });

 //   console.log(pathArray);

    if(pathArray.length>0 && markerInfoArray.length>0){
        var markerInfoResArray = [],markerIdInfoResArray = [];   // 选中的订单数组（本次选中的数组），选中订单的omOrderId

        // ————————————————————————————复刻刚刚绘制的图形
        /*var polygon;
        switch(drawType){
            case 'polygon':{           // ---------- 多边形
                polygon = new AMap.Polygon({
                    map: map,
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff',
                    path: pathArray
                });
                break;
            }
            case 'rectangle':{          // ---------- 矩形
                polygon = new AMap.Rectangle({
                    map: map,
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff',
                    path: pathArray
                });
                break;
            }
            case 'circle':{          // ---------- 圆形
                polygon = new AMap.Circle({
                    map: map,
                    fillColor:'#00b0ff',
                    strokeColor:'#80d8ff',
                    path: pathArray
                });
                break;
            }
            default:
                return false;
        }*/

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
                    if(item0.omOrderId == id){
                        markerInfoResArray.push(item0);
                        markerIdInfoResArray.push(item0.omOrderId);
                    }
                })
            }
        });
     //   console.log(markerIdInfoResArray);

     //   map.setFitView();

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
    //    console.log(markerInfoResArrayAll);

        drawClearFun2();  // 清除已绘制图形，关闭信息窗体

        // 标记选中的点
        $.each(markerInfoResArrayAll, function (index, item) {
          //  console.log('order'+item.omOrderId)
            var strHtml = '<div style="width: 100%;height: 100%;border-radius: 50%;background-color: #ee9200;"></div>'
            $('#order'+item.omOrderId).html(strHtml);
        });

        // 勾选订单    // 根据 markerInfoResArrayAll 计算 : 选中总计 、 列表
        var reportMessagesOrderStart = [];  // 起点
        app.reportMessagesRes = {
            endAddress:"",
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0,
            int2: 0,
            int2All: 0
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
                if(item.sfrAddress != null){
                    reportMessagesOrderStart.push(item);
                }
            }
            if(item.totalQty != null){
                app.reportMessagesRes.totalNumQty = accAdd(app.reportMessagesRes.totalNumQty,item.totalQty);
            }
            if(item.totalWeight != null){
                app.reportMessagesRes.totalNumWeight = accAdd(app.reportMessagesRes.totalNumWeight,item.totalWeight);
            }
            if(item.totalVolume != null){
                app.reportMessagesRes.totalNumVolume = accAdd(app.reportMessagesRes.totalNumVolume,item.totalVolume);
            }
        });
        app.reportMessagesRes.int2 = markerInfoResArrayAll.length;
        app.reportMessagesRes.int2All = accAdd(app.reportMessagesRes.int2,app.resTfoOrder.int2);
        app.reportMessagesRes.totalNumQtyAll = accAdd(app.reportMessagesRes.totalNumQty,app.resTfoOrder.totalQtyAll);
        app.reportMessagesRes.totalNumWeightAll = accAdd(app.reportMessagesRes.totalNumWeight,app.resTfoOrder.totalWeightAll);
        app.reportMessagesRes.totalNumVolumeAll = accAdd(app.reportMessagesRes.totalNumVolume,app.resTfoOrder.totalVolumeAll);

        app.reportMessagesOrderStart = reportMessagesOrderStart;
        app.reportMessagesOrderList = markerInfoResArrayAll;

        // drawCloseFun();   // 关闭绘图

    }

});

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
    // 重置总计
    app.reportMessagesRes = {
        totalNumQty:0,
        totalNumWeight:0,
        totalNumVolume:0,
        int2: 0,
        int2All: 0
    };
    app.reportMessagesRes.int2All = accAdd(app.reportMessagesRes.int2,app.resTfoOrder.int2);
    app.reportMessagesRes.totalNumQtyAll = accAdd(app.reportMessagesRes.totalNumQty,app.resTfoOrder.totalQtyAll);
    app.reportMessagesRes.totalNumWeightAll = accAdd(app.reportMessagesRes.totalNumWeight,app.resTfoOrder.totalWeightAll);
    app.reportMessagesRes.totalNumVolumeAll = accAdd(app.reportMessagesRes.totalNumVolume,app.resTfoOrder.totalVolumeAll);
    // 终点
    app.reportMessagesRes.endAddress = app.endAddressStr;

    // 重置 选中的订单数组（总数组）
    markerInfoResArrayAll = [];
    app.reportMessagesOrderList = [];
    app.reportMessagesOrderStart = {};
    // 重置 标记点的颜色
    $('.orderMapPoint').html('');
    $('.orderMapPointDef').html('');
    // 关闭信息窗体
    closeSignalOrderInfo();
    // 关闭绘图
    drawCloseFun();
}
// 清除已绘制图形，关闭信息窗体
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
    closeSignalOrderInfo();
}

// -------------------------------------- 绘制  多边形、矩形、圆形
function draw(type){
    drawType = type;
    // 关闭信息窗体
    closeSignalOrderInfo();
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

// 绘制线段
function drawPolyline () {
    if(!app.tfoOrderInfoDetail || app.OrderCarrierDriver.contactName == '' || app.OrderCarrierEqp.eqpNo == ''){
        alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
        $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
        return false;
    }
    // 关闭信息窗体
    closeSignalOrderInfo();
    mouseTool.polyline({
        /*strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 6,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],*/

        strokeColor: "#80d8ff",
        strokeWeight: 3,
        strokeOpacity: 0.3,
        fillColor: '#00b0ff',
        fillOpacity: 0.3,
        strokeStyle: 'solid',
    })
}
// 绘制多边形
function drawPolygon () {
    if(!app.tfoOrderInfoDetail || app.OrderCarrierDriver.contactName == '' || app.OrderCarrierEqp.eqpNo == ''){
        alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
        $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
        return false;
    }
    // 关闭信息窗体
    closeSignalOrderInfo();
    mouseTool.polygon({
        /*strokeColor: "#FF33FF",
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: "solid",
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],*/

        strokeColor: "#80d8ff",
        strokeWeight: 3,
        strokeOpacity: 0.3,
        fillColor: '#00b0ff',
        fillOpacity: 0.3,
        strokeStyle: 'solid',
    })
}
// 绘制矩形
function drawRectangle () {
    if(!app.tfoOrderInfoDetail || app.OrderCarrierDriver.contactName == '' || app.OrderCarrierEqp.eqpNo == ''){
        alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
        $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
        return false;
    }
    // 关闭信息窗体
    closeSignalOrderInfo();
    mouseTool.rectangle({
        /*strokeColor:'red',
        strokeOpacity:0.5,
        strokeWeight: 6,
        fillColor:'blue',
        fillOpacity:0.5,
        // strokeStyle还支持 solid
        strokeStyle: 'solid',
        // strokeDasharray: [30,10],*/

        strokeColor: "#80d8ff",
        strokeWeight: 3,
        strokeOpacity: 0.3,
        fillColor: '#00b0ff',
        fillOpacity: 0.3,
        strokeStyle: 'solid',
    })
}
// 绘制圆形
function drawCircle () {
    if(!app.tfoOrderInfoDetail || app.OrderCarrierDriver.contactName == '' || app.OrderCarrierEqp.eqpNo == ''){
        alert("请先点击班次信息选择现有班次或者选择新建的班次后，再分配订单");
        $(".scheduleSection .textBoxTitle .scheduleSectionRightBtn").trigger("click");
        return false;
    }
    // 关闭信息窗体
    closeSignalOrderInfo();
    mouseTool.circle({
        strokeColor: "#80d8ff",
        strokeWeight: 3,
        strokeOpacity: 0.3,
        fillColor: '#00b0ff',
        fillOpacity: 0.3,
        strokeStyle: 'solid',
        // 线样式还支持 'dashed'
        // strokeDasharray: [30,10],
    })
}


// 点击订单点 --- 展示订单详情
function clickSignalOrderInfo(e) {
    var stoLatLngStrVal = e.target.ue.content.attributes.stoLatLngStr.value;

    drawClearFun2();
    // 关闭班次信息
    $('.scheduleSectionRightBtn').removeClass("scheduleSectionRightShow");
    $('.scheduleSectionRightBtn').html('班次信息-详情');
    $(".scheduleSection .scheduleSectionRight").hide();

    app.tableSelOrderList = [];
    var searchFormArr = app.queryParam;
    searchFormArr.isAsign = true;
    searchFormArr.pageInfo = {
        pageNum:1,
        pageSize:app.queryPageSize
    }
    var startTimeVal =that.timeHorizon.split(" - ")[0];
    var endTimeVal =that.timeHorizon.split(" - ")[1];
    var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
    var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
    if(startTimeVal == "创建时间--开始时间"){

    }else{
        searchFormArr.startCreateTime = startTimeVal;
    }
    if(endTimeVal == "创建时间--结束时间"){

    }else{
        searchFormArr.endCreateTime = endTimeVal;
    }
    if(crcdStartTimeVal == getQueryTime(1)){
        searchFormArr.startCompleteTime = getQueryTime(1);
    }else{
        searchFormArr.startCompleteTime = crcdStartTimeVal;
    }
    if(crcdEndTimeVal == "要求完成时间--结束时间"){

    }else{
        searchFormArr.endCompleteTime = crcdEndTimeVal;
    }
    //获取订单列表
    delete(searchFormArr["pageInfo"]);   //   /query/selectTaskOrderInfoPage
    delete(searchFormArr["latLngNumber"]);
    searchFormArr.stoLatLng = stoLatLngStrVal;
    postRequest(tmsUrl + "/query/selectTaskOrderInfoList.json?token="+app.logininf.token+"&timeStamp="+app.logininf.timeStamp,searchFormArr,function(data){
        app.startCompleteDate = crcdStartTimeVal;
        app.tableSelOrderList = data.result;
        app.popupType = '1';

        // 和已选中订单数组reportMessagesOrderList比较，标记已选中订单
        if(app.reportMessagesOrderList.length != 0){
            $.each(app.reportMessagesOrderList, function (index0, item0) {
                $.each(app.tableSelOrderList, function (index1, item1) {
                    if (item1.omOrderId == item0.omOrderId) {
                        item1.hasQxQz = '1';
                    }
                });
            });
        }

        $(".maskLayer2").show();
    })

}
// 信息窗体 打开
function openSignalOrderInfo(e) {
    var idString = e.target.ue.content.id;
    var pointIdArray = idString.split('order');
    var id = pointIdArray[1];
    var info = '',totalQty = '-',totalWeight = '-',totalVolume = '-',stoAddress = '-',sfrPartyName = '-',stoPartyName = '-',completeTime = '-',remark = '-',stoContactTel = '-',orderCreateTime = '-';
    if(id != '') {
        for (var i = 0; i < markerInfoArray.length; i++) {
            if (markerInfoArray[i].omOrderId == id) {
                if (markerInfoArray[i].sfrPartyName != null) {
                    sfrPartyName = markerInfoArray[i].sfrPartyName;
                }
                if (markerInfoArray[i].stoPartyName != null) {
                    stoPartyName = markerInfoArray[i].stoPartyName;
                }
                if (markerInfoArray[i].completeTime != null) {
                    completeTime = timestampToTime2(markerInfoArray[i].completeTime);
                }
                if (markerInfoArray[i].totalQty != null) {
                    totalQty = markerInfoArray[i].totalQty;
                }
                if (markerInfoArray[i].totalWeight != null) {
                    totalWeight = markerInfoArray[i].totalWeight;
                }
                if (markerInfoArray[i].totalVolume != null) {
                    totalVolume = markerInfoArray[i].totalVolume;
                }
                if (markerInfoArray[i].remark != null) {
                    remark = markerInfoArray[i].remark;
                }
                if (markerInfoArray[i].stoAddress != null) {
                    stoAddress = markerInfoArray[i].stoAddress;
                }
                if (markerInfoArray[i].stoContactTel != null) {
                    stoContactTel = markerInfoArray[i].stoContactTel;
                }
                if (markerInfoArray[i].createTime != null) {
                    orderCreateTime = timestampToTime2(markerInfoArray[i].createTime);
                }
                info = '<div><p><span class="pointInfoColor1">委托商：</span><span class="pointInfoColor2">' + sfrPartyName + '</span></p>' +
                    '<p><span class="pointInfoColor1">收货商：</span><span class="pointInfoColor2">' + stoPartyName + '</span></p>' +
                    '<p><span class="pointInfoColor1">数量：</span><span class="pointInfoColor2">' + totalQty + '</span></p>' +
                    '<p><span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + totalWeight + '</span> <span class="pointInfoColor1">kg</span></p>' +
                    '<p><span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + totalVolume + '</span> <span class="pointInfoColor1">M<sup>3</sup></span></p>' +
                    '<p><span class="pointInfoColor1">备注：</span><span class="pointInfoColor2">' + remark + '</span></p>' +
                    '<p><span class="pointInfoColor1">收货地址：</span><span class="pointInfoColor2">' + stoAddress + '</span></p>'+
                    '<p><span class="pointInfoColor1">收货电话：</span><span class="pointInfoColor2">' + stoContactTel + '</span></p>'+
                    '<p><span class="pointInfoColor1">创建日期：</span><span class="pointInfoColor2">' + orderCreateTime + '</span></p>'+
                    '<p><span class="pointInfoColor1">要求完成时间：</span><span class="pointInfoColor2">' + completeTime + '</span></p>' +'</div>';

            }
        }
    }
    showSignalOrderInfo();
    infoWindow.setContent(info);  // e.target.content
    infoWindow.open(map, e.target.getPosition());
}
// 滑过订单信息窗体 打开
function likeOpenSignalOrderInfo(tableOrderItem) {
    var id = tableOrderItem.omOrderId;
    var info = '',totalQty = '-',totalWeight = '-',totalVolume = '-',stoAddress = '-',sfrPartyName = '-',stoPartyName = '-',completeTime = '-',remark = '-',stoContactTel = '-',orderCreateTime = '-';
    if(id != '') {
        for (var i = 0; i < markerInfoArray.length; i++) {
            if (markerInfoArray[i].omOrderId == id) {
                if (markerInfoArray[i].sfrPartyName != null) {
                    sfrPartyName = markerInfoArray[i].sfrPartyName;
                }
                if (markerInfoArray[i].stoPartyName != null) {
                    stoPartyName = markerInfoArray[i].stoPartyName;
                }
                if (markerInfoArray[i].completeTime != null) {
                    completeTime = timestampToTime2(markerInfoArray[i].completeTime);
                }
                if (markerInfoArray[i].totalQty != null) {
                    totalQty = markerInfoArray[i].totalQty;
                }
                if (markerInfoArray[i].totalWeight != null) {
                    totalWeight = markerInfoArray[i].totalWeight;
                }
                if (markerInfoArray[i].totalVolume != null) {
                    totalVolume = markerInfoArray[i].totalVolume;
                }
                if (markerInfoArray[i].remark != null) {
                    remark = markerInfoArray[i].remark;
                }
                if (markerInfoArray[i].stoAddress != null) {
                    stoAddress = markerInfoArray[i].stoAddress;
                }
                if (markerInfoArray[i].stoContactTel != null) {
                    stoContactTel = markerInfoArray[i].stoContactTel;
                }
                if (markerInfoArray[i].createTime != null) {
                    orderCreateTime = timestampToTime2(markerInfoArray[i].createTime);
                }
                info = '<div><p><span class="pointInfoColor1">委托商：</span><span class="pointInfoColor2">' + sfrPartyName + '</span></p>' +
                    '<p><span class="pointInfoColor1">收货商：</span><span class="pointInfoColor2">' + stoPartyName + '</span></p>' +
                    '<p><span class="pointInfoColor1">数量：</span><span class="pointInfoColor2">' + totalQty + '</span></p>' +
                    '<p><span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + totalWeight + '</span> <span class="pointInfoColor1">kg</span></p>' +
                    '<p><span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + totalVolume + '</span> <span class="pointInfoColor1">M<sup>3</sup></span></p>' +
                    '<p><span class="pointInfoColor1">备注：</span><span class="pointInfoColor2">' + remark + '</span></p>' +
                    '<p><span class="pointInfoColor1">收货地址：</span><span class="pointInfoColor2">' + stoAddress + '</span></p>'+
                    '<p><span class="pointInfoColor1">收货电话：</span><span class="pointInfoColor2">' + stoContactTel + '</span></p>'+
                    '<p><span class="pointInfoColor1">创建日期：</span><span class="pointInfoColor2">' + orderCreateTime + '</span></p>'+
                    '<p><span class="pointInfoColor1">要求完成时间：</span><span class="pointInfoColor2">' + completeTime + '</span></p>' +'</div>';

            }
        }
    }
    showSignalOrderInfo();
    infoWindow.setContent(info);  // e.target.content
    var position = {
        N: tableOrderItem.stoLatLng.split(",")[1],
        O: tableOrderItem.stoLatLng.split(",")[0],
        lng:tableOrderItem.stoLatLng.split(",")[0],
        lat:tableOrderItem.stoLatLng.split(",")[1]
    };
    infoWindow.open(map, position);
}
// 信息窗体 hide
function closeSignalOrderInfo() {
    $('.amap-info-contentContainer').hide();
}
// 信息窗体 show
function showSignalOrderInfo() {
    $('.amap-info-contentContainer').show();
}

////////////////////////////////////////////////  点聚合 //////////////////////////////////////////////////////////////////////////////////
/*var cluster;
function addClusterDefault() {
    if (cluster) {
        cluster.setMap(null);
    }
    cluster = new AMap.MarkerClusterer(map, markerArray, {gridSize: 80});
}*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        completeStatus:"",
        actCode:"",
        assignStatus:"",
        exceptionStatus:""
    }

    that.reportMessagesSearch = {
        totalNums:"",
        totalNumsUnit:""
    };
    that.resTfoOrder = {
        int2: 0,
        totalQtyAll:0,
        totalWeightAll:0,
        totalVolumeAll:0
    };
    that.reportMessagesRes = {
        endAddress:"",
        totalNumQty:0,
        totalNumWeight:0,
        totalNumVolume:0,
        totalNumQtyAll:0,
        totalNumWeightAll:0,
        totalNumVolumeAll:0,
        int2: 0,
        int2All: 0
    };
    that.reportMessagesBtnShow1 = '0';
    that.reportMessagesOrderList = [];
    that.reportMessagesOrderStart = {};
    that.tableSelOrderList = {};
    that.tableSelOneOrderList = {};
}
function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker(null, function(start, end, label) {
        app.timeHorizon1 = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('input[name="deliveryDate"]').daterangepicker({ singleDatePicker: true }, function(start, end, label) {
        app.deliveryDate= start.format('YYYY-MM-DD');
    });
});
