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
        showDriverList:false,
        showPlateList:false,
        isShowDriverList:true,
        isShowPlateList:true,
        allChecked:false,
        getDriverListTimer:null,
        getEpdListTimer:null,
        clearShow:true,
        isNewClasses:false,
        orderList:[],
        currentRelatedArr:[],
        currentClassesArr:[],
        resTfoOrder:{},
        OrderAmtList:{},
        OrderMeaList:{},
        OrderCarrierContact:{},
        OrderCarrierDriver:{},
        pathScheduleOrder:{},
        OrderCarrierEqp:{},
        newCarrierDriver:{},
        newCarrierEqp:{},
        newCarrier1: {},
        newOrderCarrier1: {},
        newOrderCarrier: {},
        newOrderCarrierContact: {},
        isShowCarrier: true,
        searchInf:[],
        oneCarrierInfo:{},
        currentClasses:{},
        pathAllotProgressInf:{},
        waitScheduleOrder:{},
        finishScheduleOrder:{},
        orderResultInfoList:{},
        orderResultOmOrderId:[],
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
        allocatedOrderArr:[],
        currentCotactIndex:"",
        templateTitle:"新增联系人",
        currentOrderIndex:"-1",
        queryPageSize:100,
        multipleNum:100,
        bcQueryPageSize:100,
        bcMultipleNum:100,
        schemaInfo:"",
        OrderCarrier:{},
        diffTloOrderIds: 0,
        startCompleteDate: "",
        endCompleteDate: "",
        changeCompleteTime: "",
        defaultDeliveryDate:getQueryTime(-1),
        deliveryDate:getQueryTime(-1),
        newDeliveryDate: getQueryTime(0),
        orderStatistics:{
            totalNum:0,
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0
        },
        theTotalShifts: [],
        queryParam:{},
        queryParam1:{},
        pathQueryParams:{},
        resPartyList:[],
        shortShowType:"0",
        shortShowType1:"0",
        omOrderIdArray:[],
        splitType: 'master',
        splitCount:"",
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
        OrderCarrierParty:{},
        dtmListInfoList:[{}],
        packageGoodsDetails:"",
        currentOrderId:"",
        classesTotallist: [],
        besicInfosList: [],
        sortTemShowList: [],
        sortTransDataList: [],
        totalQwv: [],
        showTotalSingleList:false,
        showDetailList:false,
        abnormalPage:1,
        temOrderId: '',
        isShowSplitList:"0",
        orderSplitList:[{
            orderItemList:[{}]
        }],
        amendOrderInfo: [],
        typeCreateClass: "3",
        waybillInfoList: [],
        currTableOrderStr1: "--",
        currentSelectedAreaArr: [],
        deliveryDate3: getQueryTime(0) + " " + "00:00",
        timeHorizon:"", //创建时间范围
        timeHorizon1:""//完成时间范围
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
        'bcQueryPageSize': function(newVal, oldVal) {
            this.bcQueryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal1()
        },
        
    },
    methods:{
        rowDrop(fooList){
            var that = this;
            var arr = {};
            var foo = this.$refs.foo;
            Sortable.create(foo, {
                animation: 150,
                onEnd: function (evt) {
                    that.orderResultOmOrderId.splice(evt.newIndex, 0, that.orderResultOmOrderId.splice(evt.oldIndex, 1)[0]);
                }
            })
        },
        saveNewSorting(){	//已分配订单保存排序
            var that = this;
            var fromOrderId = that.currentClasses.omOrderId;
            var newSortParams = [];
            for(var i = 0; i < that.orderResultOmOrderId.length;i++){
                newSortParams.push({
                    fromOrderId:fromOrderId,
                    seq:i+1,
                    toOrderId:that.orderResultOmOrderId[i]
                })
            }
            that.orderResultInfoList = [];
            postRequest(tmsUrl + "/update/tfoOrderLnkSeq.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newSortParams,function(data){
                imitatePopup("保存排序成功！",'alert');
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
        chooseTheFile() {
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
                                pageSize: that.bcQueryPageSize
                            },
                            isAsign: true,
                            startCompleteTime: getQueryTime(-1),
                            endCompleteTime: getQueryTime(-1)
                        }
                        //获取现有班次
                        postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                            for(var i = 0 ; i < data.result.length; i++ ){
                                if(data.result[i].num1 < data.result[i].totalVolume){
                                    data.result[i].bearingCapacity = 0
                                }else{
                                    data.result[i].bearingCapacity = 1
                                }
                                data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                            }
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
                    imitatePopup("上传文件失败",'alert');
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
            var that = this;
            that.newCarrierDriver = that.OrderCarrierDriver;
            that.newCarrierEqp = that.OrderCarrierEqp;
            if(that.OrderCarrier1.partyName){
                that.isShowCarrier = true;
                that.newOrderCarrier1 = that.OrderCarrier1;
                that.newOrderCarrierContact = that.OrderCarrierContact;
            }else{
                that.isShowCarrier = false;
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
                that.newOrderCarrier = {
                    cdPartyId:""
                };
                that.newOrderCarrierContact = {
                    contactName:"",
                    contactTel:"",
                    contactEmail:"",
                    contactAddress:""
                };
                that.newOrderCarrier1 = {
                    partyName:"",
                    partyCode:"",
                    isBuyer:"",
                    isVendor:"",
                    isTruck:"",
                    isWarehouse:"",
                    is3pl:""
                };
            }
            $(".maskLayer1").show();
            $(".maskLayer6").hide();
        },
        closeMaskLayer(num){
            $(".maskLayer1").hide();
            $(".maskLayer3").hide();
            $(".maskLayer7").hide();
            $(".maskLayer8").hide();
            if(num){
                $(".maskLayer"+num).show();
            }
        },
        closeMaskLayer1(){
            $(".maskLayer1").hide();
            $(".maskLayer2").hide();
            $(".maskLayer3").show();
        },
        closeMaskLayer5(){
            $(".maskLayer5").hide();
        },
        closeMaskLayer6(){
            $(".maskLayer6").hide();
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
        getDriverInfo(val){
            this.publicGetDriverInfo(val);
        },
        getDriverInfo1(val){
            this.publicGetDriverInfo(val);
        },
        publicGetDriverInfo(val){
            var that = this;
            //that.driverList = [];
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
            this.OrderCarrierDriver.contactName = driveritem.contactName;
            $(".shareCarInfosDiv #carrierDriverName").val(driveritem.contactName);
            this.OrderCarrierDriver.contactName = $(".shareCarInfosDiv #carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = driveritem.contactTel;
            this.OrderCarrierEqp.eqpNo = driveritem.eqpNo;
            $(".shareCarInfosDiv #carrierEqpNo").val(driveritem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $(".shareCarInfosDiv #carrierEqpNo").val();
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
            this.newCarrierDriver.contactName = driveritem.contactName;
            $(".popupCon .shareCarInfosDiv #newCarrierDriverName").val(driveritem.contactName);
            this.newCarrierDriver.contactName = $(".popupCon .shareCarInfosDiv #newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = driveritem.contactTel;
            this.newCarrierEqp.eqpNo = driveritem.eqpNo;
            $(".popupCon .shareCarInfosDiv #newCarrierEqpNo").val(driveritem.eqpNo);
            this.newCarrierEqp.eqpNo = $(".popupCon .shareCarInfosDiv #newCarrierEqpNo").val();
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

            this.OrderCarrierDriver.contactName = plateitem.contactName;
            $(".shareCarInfosDiv #carrierDriverName").val(plateitem.contactName);
            this.OrderCarrierDriver.contactName = $(".shareCarInfosDiv #carrierDriverName").val();
            this.OrderCarrierDriver.contactTel = plateitem.contactTel;
            this.OrderCarrierEqp.eqpNo = plateitem.eqpNo;
            $(".shareCarInfosDiv #carrierEqpNo").val(plateitem.eqpNo);
            this.OrderCarrierEqp.eqpNo = $(".shareCarInfosDiv #carrierEqpNo").val();
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

            this.newCarrierDriver.contactName = plateitem.contactName;
            $(".popupCon .shareCarInfosDiv #newCarrierDriverName").val(plateitem.contactName);
            this.newCarrierDriver.contactName = $(".popupCon .shareCarInfosDiv #newCarrierDriverName").val();
            this.newCarrierDriver.contactTel = plateitem.contactTel;
            this.newCarrierEqp.eqpNo = plateitem.eqpNo;
            $(".popupCon .shareCarInfosDiv #newCarrierEqpNo").val(plateitem.eqpNo);
            this.newCarrierEqp.eqpNo = $(".popupCon .shareCarInfosDiv #newCarrierEqpNo").val();
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
        newDistributeOrder(){  // 新增该班次
            var that = this;
            if(that.OrderCarrier.cdPartyId === ""){
                imitatePopup("请选择承运商",'alert');
                return false;
            }
            if(that.OrderCarrier1.partyName == ""){
                imitatePopup("承运商名称不能为空",'alert');
                return false;
            }
            if($(".shareCarInfosDiv #carrierDriverName").val() == "" || $(".shareCarInfosDiv .carrierDriverTel").val() == "" || $(".shareCarInfosDiv #carrierEqpNo").val() == "" || $(".shareCarInfosDiv .carrierEqpName").val() == ""){
                imitatePopup("请先输入司机信息再保存",'alert');
                return false;
            }

            var newClassesObj = {
                carrierPartyInfo:{
                    contact: that.OrderCarrierDriver,
                    eqp: that.OrderCarrierEqp,
                    imgContact: that.OrderCarrierContact,
                    party: that.OrderCarrier1
                },
                dtmTime: that.newDeliveryDate
            };
            postRequest(tmsUrl + "/insert/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newClassesObj,function(data){
                imitatePopup('班次新增成功！','alert');
                $(".maskLayer7").hide();
                var searchFormArr1 = {
                    pageInfo:{
                        pageNum: that.currentPage1,
                        pageSize: that.bcQueryPageSize
                    },
                    isAsign: true,
                    startCompleteTime: that.deliveryDate,
                    endCompleteTime: that.deliveryDate
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
        publicGetOrderList(){
            var that = this;
            that.orderList = [];
            that.allChecked = false;
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            var searchFormArr = that.queryParam;
            var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
            var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

            if(crcdStartTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == getQueryTime(-1)){
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.endCompleteTime = crcdEndTimeVal;
            }
            searchFormArr.isAsign = false;
            searchFormArr.pageInfo ={
                pageNum: that.currentPage,
                pageSize: that.queryPageSize
            }
            var searchFormArr1 = this.queryParam1;
            //that.tfoOrderInfoDetail = false;
            searchFormArr1.isAsign = true;
            searchFormArr1.pageInfo = {
                pageNum: that.currentPage1,
                pageSize: that.bcQueryPageSize
            }
            var deliveryTimeVal = this.deliveryDate;
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
            postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.deliveryDate = deliveryTimeVal;
                that.startCompleteDate = crcdStartTimeVal;
                that.endCompleteDate = crcdEndTimeVal;
                that.waitScheduleOrder = data.result;
                that.pageList = [];
                that.totalPagesNum = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                    for(var i = 0 ; i < data.result.length; i++ ){
                        if(data.result[i].num1 < data.result[i].totalVolume){
                            data.result[i].bearingCapacity = 0
                        }else{
                            data.result[i].bearingCapacity = 1
                        }
                        data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                    }
                    that.finishScheduleOrder = data.result;
                    that.pageList1 = [];
                    that.totalPagesNum1 = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                })
            })
        },
        saveNewDriverInf(){
            var that = this;
            if(that.isShowCarrier == false){
                if(that.newOrderCarrier.cdPartyId == "" || that.newOrderCarrier1.partyName == "" || that.newOrderCarrierContact.contactName == "" || that.newOrderCarrierContact.contactTel == ""){
                    imitatePopup("请先选择承运商！",'alert');
                    return false;
                }
            }
            if($(".popupCon .newClassesCon .newCarrierEqpName").val().trim() == "" || $(".popupCon .newClassesCon #newCarrierEqpNo").val().trim() == "" || $(".popupCon .newClassesCon .newCarrierDriverTel").val().trim() == "" || $(".popupCon .newClassesCon #newCarrierDriverName").val().trim() == ""){
                imitatePopup("请先输入司机信息再保存",'alert');
                return false;
            }
            this.OrderCarrierEqp.eqpNo = this.newCarrierEqp.eqpNo;
            this.OrderCarrierEqp.eqpName = this.newCarrierEqp.eqpName;
            this.OrderCarrierEqp.eqpBrand = this.newCarrierEqp.eqpBrand;
            this.OrderCarrierEqp.eqpType = this.newCarrierEqp.eqpType;
            this.OrderCarrierEqp.eqpNature = this.newCarrierEqp.eqpNature;
            this.OrderCarrierEqp.eqpSpec = this.newCarrierEqp.eqpSpec;
            this.OrderCarrierEqp.eqpLength = this.newCarrierEqp.eqpLength;
            this.OrderCarrierEqp.eqpWidth = this.newCarrierEqp.eqpWidth;
            this.OrderCarrierEqp.eqpHeight = this.newCarrierEqp.eqpHeight;
            this.OrderCarrierEqp.eqpStr1 = this.newCarrierEqp.eqpStr1;
            this.OrderCarrierEqp.eqpStr2 = this.newCarrierEqp.eqpStr2;

            this.OrderCarrierDriver.contactName = this.newCarrierDriver.contactName;
            this.OrderCarrierDriver.contactTel = this.newCarrierDriver.contactTel;

            this.OrderCarrierContact.contactName = that.newOrderCarrierContact.contactName;
            this.OrderCarrierContact.contactTel = that.newOrderCarrierContact.contactTel;
            this.OrderCarrierContact.contactEmail = that.newOrderCarrierContact.contactEmail;
            this.OrderCarrierContact.contactAddress = that.newOrderCarrierContact.contactAddress;
            this.currentOrderInfo.party.partyName = that.newOrderCarrier1.partyName;
            this.currentOrderInfo.party.partyCode = that.newOrderCarrier1.partyCode;
            this.currentOrderInfo.party.isBuyer = that.newOrderCarrier1.isBuyer;
            this.currentOrderInfo.party.isVendor = that.newOrderCarrier1.isVendor;
            this.currentOrderInfo.party.isTruck = that.newOrderCarrier1.isTruck;
            this.currentOrderInfo.party.isWarehouse = that.newOrderCarrier1.isWarehouse;
            this.currentOrderInfo.party.is3pl = that.newOrderCarrier1.is3pl;
            var newDriverInfo = {
                carrierPartyInfo:{
                    contact: this.OrderCarrierDriver,
                    eqp: this.OrderCarrierEqp,
                    imgContact: this.OrderCarrierContact,
                    party: this.currentOrderInfo.party
                },
                order:this.resTfoOrder
            }
            postRequest(tmsUrl + "/save/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newDriverInfo,function(data){

                var searchFormArr = that.queryParam1;
                searchFormArr.isAsign = true;
                searchFormArr.pageInfo = {
                    pageNum:that.currentPage1,
                    pageSize:that.bcQueryPageSize
                }
                var deliveryTimeVal = that.deliveryDate;
                searchFormArr.startCompleteTime = deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.finishScheduleOrder = data.result;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                })
                setTimeout(function(){
                    $(".maskLayer1").hide();
                    $(".maskLayer6").show();
                },300)

            })
        },
        massDistribution(){
            //批量分配
            var that = this;
            if(this.isNewClasses){

            }else{
                if(!that.tfoOrderInfoDetail){
                    imitatePopup("请先选择线路再分配","alert");
                    return false;
                }
                if(that.orderList.length == 0){
                    imitatePopup("请至少勾选一条数据行","alert");
                    return false;
                }
                var allotOrderArr = [];
                var allotOrderArr1 = [];
                var allotOrderArr2 = [];
                var headInfo="订单已排单\r";
                var centerInfo="";
                var tailInfo="你确认要重新排单？";
                for(var i = 0; i < that.orderList.length;i++){
                    if(that.orderList[i].tfoOmOrderId==null || that.orderList[i].tfoOmOrderId=='' || that.orderList[i].tfoOmOrderId==undefined){
                        allotOrderArr.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                    }else{
                        centerInfo += "班次为:"+that.orderList[i].tfoCustomerRefNo+";车牌号为:"+that.orderList[i].eqpNo+";司机为"+that.orderList[i].contactName+"\r";
                        allotOrderArr1.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                        allotOrderArr2.push({
                            fromOrderId: that.orderList[i].tfoOmOrderId,
                            fromOrderNo:that.orderList[i].tfoOrderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                    }
                }
                if(allotOrderArr!=null && allotOrderArr!='' &&  allotOrderArr!=undefined){
                    postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                        that.orderList = [];
                        $(".waitScheduleList .reportMessages tr").removeClass("active");
                        $(".reportMessages table tr td .checkInp").attr("checked",false);
                        that.publicGetOrderList();
                    })
                }
                if(allotOrderArr1!=null && allotOrderArr1!='' &&  allotOrderArr1!=undefined){
                    var allInfo =headInfo + centerInfo + tailInfo;
                    var r = confirm(allInfo)
                    if(r){
                        //撤回已分配订单
                        postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr2,function(data){
                            //排单
                            postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, allotOrderArr1, function (data) {
                                $(".reportMessages table tr td .checkInp").attr("checked", false);
                                that.orderList = [];
                                that.publicGetOrderList()
                            })
                        })

                    }
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
                        that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                        that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                        that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                    }
                })
            }
        },
        massDistribute(){
            //分配派发
            var that = this;
            if(this.isNewClasses){

            }else{
                if(!that.tfoOrderInfoDetail){
                    imitatePopup("请先选择线路再分配","alert");
                    return false;
                }
                if(that.orderList.length == 0){
                    imitatePopup("请至少勾选一条数据行","alert");
                    return false;
                }
                var allotOrderArr = [];
                var allotOrderArr1 = [];
                var allotOrderArr2 = [];
                var headInfo="订单已排单\r";
                var centerInfo="";
                var tailInfo="你确认要重新排单？";
                for(var i = 0; i < that.orderList.length;i++){
                    if(that.orderList[i].tfoOmOrderId==null || that.orderList[i].tfoOmOrderId=='' || that.orderList[i].tfoOmOrderId==undefined){
                        allotOrderArr.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                    }else{
                        centerInfo += "班次为:"+that.orderList[i].tfoCustomerRefNo+";车牌号为:"+that.orderList[i].eqpNo+";司机为"+that.orderList[i].contactName+"\r";
                        allotOrderArr1.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                        allotOrderArr2.push({
                            fromOrderId: that.orderList[i].tfoOmOrderId,
                            fromOrderNo:that.orderList[i].tfoOrderNo,
                            toOrderId: that.orderList[i].omOrderId,
                            toOrderNo: that.orderList[i].orderNo
                        })
                    }
                }
                if(allotOrderArr!=null && allotOrderArr!='' &&  allotOrderArr!=undefined){
                    postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                        that.orderList = [];
                        $(".waitScheduleList .reportMessages tr").removeClass("active");
                        $(".reportMessages table tr td .checkInp").attr("checked",false);
                        that.publicGetOrderList();
                        that.getSearchVal1();
                    })
                }
                if(allotOrderArr1!=null && allotOrderArr1!='' &&  allotOrderArr1!=undefined){
                    var allInfo =headInfo + centerInfo + tailInfo;
                    var r = confirm(allInfo)
                    if(r){
                        //撤回已分配订单
                        postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr2,function(data){
                            //排单
                            postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr1,function(data){
                                $(".reportMessages table tr td .checkInp").attr("checked", false);
                                that.orderList = [];
                                that.publicGetOrderList();
                                that.getSearchVal1();
                            })
                        })

                    }
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
                        that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                        that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                        that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                    }
                })
            }
        },
        showPathPopup(){
            var that = this;
            this.currentRelatedArr = [];
            $("#pathOrderTable tbody .see").removeClass("active");
            $("#pathOrderTable input").prop('checked',false);
            $(".maskLayer3").show();
            var searchFormArr2 = {
                startDistCreateTime:that.timeHorizon1.split(" - ")[0],
                endDistCreateTime:that.timeHorizon1.split(" - ")[1],
                pageInfo:{
                    pageNum: 1,
                    pageSize: 1000
                }
            }
            //获取路线列表  /query/selectTloOrderInfoList
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                that.pathScheduleOrder = data.result;
            })
        },
        showAreaPopup(){
            var that = this;
            this.waybillInfoList = [];
            $("#areaOrderTable tbody .see").removeClass("active");
            $("#areaOrderTable input").prop('checked',false);
            $(".maskLayer8").show();
            var params = {};
            //获取路线列表  /query/selectTloOrderInfoList
            postRequest(tmsUrl + "/query/tzoOrderInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                that.waybillInfoList = data.result;
            })
        },
        textboxAllSelectionFun3(){
            var that = this;
            that.allocatedOrderArr=[];
            $("#allocatedMessages tbody input[type='checkbox']").prop('checked', $("#allocatedMessages thead input[type='checkbox']").prop('checked'));
            if($("#allocatedMessages thead input").prop("checked")){
                for(var i = 0; i < that.orderResultInfoList.length; i++){
                    that.allocatedOrderArr.push(that.orderResultInfoList[i]);
                }
            }else{
                for(var i = 0; i < that.orderResultInfoList.length; i++){
                    that.allocatedOrderArr = that.allocatedOrderArr.filter(function (ele){return ele != that.orderResultInfoList[i];});
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
            if(that.allocatedOrderArr.length == that.orderResultInfoList.length){  // 单选个数 = 该页条数，全选选中
                $("#allocatedMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#allocatedMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        batchRevocationFun(){
            var that = this;
            var revocationOrder = [];
            if(that.allocatedOrderArr.length == 0){
                imitatePopup("请至少勾选一条数据行","alert");
                return false;
            }
            var headInfo = "订单已装车或签收,原单号为:\r";
            var centerInfo = "";
            var tailInfo = "你确定要撤销吗？";
            for(var i = 0; i < that.allocatedOrderArr.length;i++){
                revocationOrder.push({
                    fromOrderId: that.currentClasses.omOrderId,
                    fromOrderNo: that.currentClasses.orderNo,
                    toOrderId: that.allocatedOrderArr[i].omOrderId,
                    toOrderNo: that.allocatedOrderArr[i].orderNo
                })
                if(that.allocatedOrderArr[i].completeStatus!='INIT'){
                    centerInfo += that.allocatedOrderArr[i].customerOriginalNo+"\r";
                } else if(that.allocatedOrderArr[i].assignStatus == 1){
                    headInfo = "订单已派发,原单号为:\r";
                    centerInfo += that.allocatedOrderArr[i].customerOriginalNo+"\r";
                }
            }
            if(centerInfo!=null && centerInfo!='' &&  centerInfo!=undefined){
                var allInfo = headInfo + centerInfo + tailInfo;
                var r = confirm(allInfo);
                if (!r) {
                    return false;
                }
            }
            postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                that.publicGetOrderList();
                that.allocatedOrderArr = [];
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
                        that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                        that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                        that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                    }
                })
            })
        },
        revocationFun(orderinfo){
            //撤回已分配订单
            if(orderinfo.completeStatus!='INIT') {
                var r = confirm("订单已装车或签收你确定要撤销吗？");
                if(!r){
                    return false;
                }
            }else if(orderinfo.assignStatus == 1) {
                var r = confirm("订单已派发是否确认撤销？");
                if(!r){
                    return false;
                }
            }
            var that = this;
            var revocationOrder = [];
            var searchArr = {
                fromOrderId:that.currentClasses.omOrderId,
                fromOrderNo:that.currentClasses.orderNo,
                toOrderId:orderinfo.omOrderId,
                toOrderNo:orderinfo.orderNo
            }
            revocationOrder.push(searchArr);
            postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                that.publicGetOrderList();
                $("#allocatedMessages tbody input[type='checkbox']").prop('checked',false);
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
                        that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                        that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                        that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                    }
                })
            })
        },
        textboxAllSelectionFun(allChecked){
            $(".waitScheduleList .reportMessages tbody input[type='checkbox']").prop('checked', $(".waitScheduleList .reportMessages thead input[type='checkbox']").prop('checked'));
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
                that.orderList.push(orderItem);
                that.orderStatistics.totalNumQty = accAdd(that.orderStatistics.totalNumQty,orderItem.totalQty);
                that.orderStatistics.totalNumWeight = accAdd(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
                that.orderStatistics.totalNumVolume = accAdd(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }else{
                that.orderList.splice($.inArray(orderItem,that.orderList),1);
                that.orderStatistics.totalNumQty = accSub(that.orderStatistics.totalNumQty,orderItem.totalQty);
                that.orderStatistics.totalNumWeight = accSub(that.orderStatistics.totalNumWeight,orderItem.totalWeight);
                that.orderStatistics.totalNumVolume = accSub(that.orderStatistics.totalNumVolume,orderItem.totalVolume);
            }
            that.orderStatistics.totalNum = that.orderList.length;
            if(that.orderStatistics.totalNum == $("#tableId tbody>tr").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".waitScheduleList .reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".waitScheduleList .reportMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        textboxAllSelectionFun1(){
            var that = this;
            that.currentRelatedArr=[];
            $("#pathOrderTable tbody input[type='checkbox']").prop('checked', $("#pathOrderTable thead input[type='checkbox']").prop('checked'));
            if($("#pathOrderTable thead input").prop("checked")){
                $("#pathOrderTable tbody tr").addClass("active");
                for(var i = 0; i < that.pathScheduleOrder.length; i++){
                    that.currentRelatedArr.push(that.pathScheduleOrder[i].omOrderId);
                }
            }else{
                $("#pathOrderTable tbody tr").removeClass("active");
                for(var i = 0; i < that.pathScheduleOrder.length; i++){
                    that.currentRelatedArr = that.currentRelatedArr.filter(function (ele){return ele != that.pathScheduleOrder[i].omOrderId;});
                }
            }
        },
        textboxSelectionFun1(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.currentRelatedArr.push(orderItem.omOrderId);
            }else{
                that.currentRelatedArr.splice($.inArray(orderItem.omOrderId,that.currentRelatedArr),1);
            }
            if(that.currentRelatedArr.length == that.pathScheduleOrder.length){  // 单选个数 = 该页条数，全选选中
                $("#pathOrderTable thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#pathOrderTable thead input[type='checkbox']").prop('checked',false);
            }
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
        textboxAllSelectionFun4(){
            var that = this;
            that.currentSelectedAreaArr=[];
            $("#areaOrderTable tbody input[type='checkbox']").prop('checked', $("#areaOrderTable thead input[type='checkbox']").prop('checked'));
            if($("#areaOrderTable thead input").prop("checked")){
                $("#areaOrderTable tbody tr").addClass("active");
                for(var i = 0; i < that.waybillInfoList.length; i++){
                    that.currentSelectedAreaArr.push(that.waybillInfoList[i].omOrderId);
                }
            }else{
                $("#areaOrderTable tbody tr").removeClass("active");
                for(var i = 0; i < that.waybillInfoList.length; i++){
                    that.currentSelectedAreaArr = that.currentSelectedAreaArr.filter(function (ele){return ele != that.waybillInfoList[i].omOrderId;});
                }
            }
        },
        textboxSelectionFun4(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.currentSelectedAreaArr.push(orderItem.omOrderId);
            }else{
                that.currentSelectedAreaArr.splice($.inArray(orderItem.omOrderId,that.currentSelectedAreaArr),1);
            }
            if(that.currentSelectedAreaArr.length == that.waybillInfoList.length){  // 单选个数 = 该页条数，全选选中
                $("#areaOrderTable thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#areaOrderTable thead input[type='checkbox']").prop('checked',false);
            }
        },
        distributeOrder(){
            //订单派发
            var that = this;
            if(that.currentClasses.carDrvContactName == null || that.currentClasses.carDrvContactName == undefined || that.currentClasses.carDrvContactName == ""
                || that.currentClasses.carDrvEqpNo == null || that.currentClasses.carDrvEqpNo == undefined || that.currentClasses.carDrvEqpNo == ""){
                imitatePopup('班次：'+that.currentClasses.str1+'，派发前请先指派司机和车辆！',"alert");
                return false;
            }
            var searchFormArr = [];
            searchFormArr.push({
                state:1,
                refId: that.currentClasses.omOrderId,
                refNo: that.currentClasses.orderNo
            })
            var searchFormArr1 = {
                pageInfo:{
                    pageNum: that.currentPage,
                    pageSize: that.bcQueryPageSize
                },
                isAsign: true
            }
            postRequest(tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                imitatePopup('订单派发成功！',"alert");
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
                imitatePopup("请先选择线路再分配","alert");
                return false;
            }
            if(orderItem.tfoOmOrderId==null || orderItem.tfoOmOrderId=='' || orderItem.tfoOmOrderId==undefined){
                var searchFormArr = [];
                searchFormArr.push({
                    fromOrderId: that.currentClasses.omOrderId,
                    fromOrderNo: that.currentClasses.orderNo,
                    toOrderId: orderItem.omOrderId,
                    toOrderNo: orderItem.orderNo
                })
                postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                    $(".reportMessages table tr td .checkInp").attr("checked", false);
                    that.orderList = [];
                    that.publicGetOrderList();
                })
            }else{
                var r = confirm("订单已排单\r班次为:"+orderItem.tfoCustomerRefNo+"\r车牌号为:"+orderItem.eqpNo+"\r司机为"+orderItem.contactName+"\r你确认要重新排单？")
                if(r){
                    //撤回已分配订单
                    var revocationOrder = [];
                    var searchArr = {
                        fromOrderId:orderItem.tfoOmOrderId,
                        fromOrderNo:orderItem.tfoOrderNo,
                        toOrderId:orderItem.omOrderId,
                        toOrderNo:orderItem.orderNo
                    }
                    revocationOrder.push(searchArr);
                    postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                        //排单
                        var searchFormArr = [];
                        searchFormArr.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: orderItem.omOrderId,
                            toOrderNo: orderItem.orderNo
                        })
                        postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                            $(".reportMessages table tr td .checkInp").attr("checked", false);
                            that.orderList = [];
                            that.publicGetOrderList();
                            // that.getSearchVal1();
                        })
                    })

                }
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
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }
            })
        },
        orderDistribute(orderItem){
            //订单分配派发
            var that = this;
            if(!that.tfoOrderInfoDetail){
                imitatePopup("请先选择线路再分配","alert");
                return false;
            }

            if(orderItem.tfoOmOrderId==null || orderItem.tfoOmOrderId=='' || orderItem.tfoOmOrderId==undefined){
                var searchFormArr = [];
                searchFormArr.push({
                    fromOrderId: that.currentClasses.omOrderId,
                    fromOrderNo: that.currentClasses.orderNo,
                    toOrderId: orderItem.omOrderId,
                    toOrderNo: orderItem.orderNo
                })
                postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    $(".reportMessages table tr td .checkInp").attr("checked", false);
                    that.orderList = [];
                    that.publicGetOrderList()
                })
            }else{
                var r = confirm("订单已排单\r班次为:"+orderItem.tfoCustomerRefNo+"\r车牌号为:"+orderItem.eqpNo+"\r司机为"+orderItem.contactName+"\r你确认要重新排单？")
                if(r){
                    //撤回已分配订单
                    var that = this;
                    var revocationOrder = [];
                    var searchArr = {
                        fromOrderId:orderItem.tfoOmOrderId,
                        fromOrderNo:orderItem.tfoOrderNo,
                        toOrderId:orderItem.omOrderId,
                        toOrderNo:orderItem.orderNo
                    }
                    revocationOrder.push(searchArr);
                    postRequest(tmsUrl + "/remove/tfoOrderTfoLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,revocationOrder,function(data){
                        //排单
                        var searchFormArr = [];
                        searchFormArr.push({
                            fromOrderId: that.currentClasses.omOrderId,
                            fromOrderNo: that.currentClasses.orderNo,
                            toOrderId: orderItem.omOrderId,
                            toOrderNo: orderItem.orderNo
                        })
                        postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                            $(".reportMessages table tr td .checkInp").attr("checked", false);
                            that.orderList = [];
                            that.publicGetOrderList()
                        })
                    })

                }
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
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }
            })
        },
        getRelatedOrderList(classifyItem,index){
            var that = this;
            that.currentOrderIndex1 = index;
            console.log(classifyItem.omOrderId);
            if(that.currentRelatedArr.includes(classifyItem.omOrderId)){
                //includes()方法判断是否包含某一元素,返回true或false表示是否包含元素，对NaN一样有效
                //filter()方法用于把Array的某些元素过滤掉，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素：生成新的数组
                that.currentRelatedArr = that.currentRelatedArr.filter(function (ele){return ele != classifyItem.omOrderId;});
                //this.arr=this.arr.filter((ele)=>ele!=i);
                //filter()为假时删除
            }else{
                that.currentRelatedArr.push(classifyItem.omOrderId);
            }
        },
        orderResultInfo(orderItem,index){
            var that = this;
            that.currentOrderIndex = index;
            var searchFormArr = {
                refId: orderItem.omOrderId,
                refNo: orderItem.orderNo
            }
            that.tfoOrderInfoDetail = true;
            $(".allocatedMessages table input").attr("checked",false);
            that.currentClasses = orderItem;
            that.orderResultOmOrderId = [];
            //获取订单列表
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                //that.orderDetails = data.result.order;  // 订单信息

                that.currentOrderInfo  = data.result.carrierPartyInfo;

                // that.tableDnD(document.getElementById("allocatedMessages"),that.tableDnEndFunc);

                // 成本
                if(data.result.amtList != null && data.result.amtList.length > 0){
                    var amtList = data.result.amtList;
                    for(var m=0;m<amtList.length;m++){
                        if(amtList[m].amtType == 'ITEM_COST'){
                            that.OrderAmtList.itemCost = amtList[m].amt;
                        } else if(amtList[m].amtType == 'KG_COST'){
                            that.OrderAmtList.kgCost = amtList[m].amt;
                        } else if(amtList[m].amtType == 'M3_COST'){
                            that.OrderAmtList.m3Cost = amtList[m].amt;
                        }
                    }
                }else{
                    that.OrderAmtList = {};
                }

                // 满载率
                if(data.result.meaList != null && data.result.meaList.length > 0){
                    var meaList = data.result.meaList;
                    for(var n=0;n<meaList.length;n++){
                        if(meaList[n].meaType == 'LOAD_RATE_VOLUME'){
                            that.OrderMeaList.loadVolume = meaList[n].mea;
                        } else if(meaList[n].meaType == 'LOAD_RATE_WEIGHT'){
                            that.OrderMeaList.loadWeight = meaList[n].mea;
                        }
                    }
                }else{
                    that.OrderMeaList = {};
                }

                if(data.result.carrierPartyInfo != null){
                    if(data.result.carrierPartyInfo.imgContact != null){
                        that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    }else{
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:"",
                            contactAddress:""
                        };
                    }
                    if(data.result.carrierPartyInfo.party != null){
                        that.OrderCarrier1 = data.result.carrierPartyInfo.party;
                    }else{
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
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {};
                }

                if(data.result.orderLnkList != null){
                    that.orderResultInfoList = data.result.orderLnkList;
                    if(data.result.orderLnkList.length>0){
                        for(var a=0;a<data.result.orderLnkList.length;a++){
                            that.orderResultOmOrderId.push(data.result.orderLnkList[a].omOrderId)
                        }
                    }
                    that.totalOrderResultNum = data.result.orderLnkList.length;
                    setTimeout(function(){
                        that.rowDrop()
                    },600)
                }
//
                if(data.result.order != null){
                    that.temOrderId = data.result.order.omOrderId;
                    that.resTfoOrder = data.result.order;
                    that.resTfoOrder.dtmTime = data.result.dtmTime;
                    var totalQtyAll = 0,totalWeightAll = 0,totalVolumeAll = 0;
                    $.each(that.orderResultInfoList,function (index,item) {
                        totalQtyAll += item.totalQty;
                        totalWeightAll += item.totalWeight;
                        totalVolumeAll += item.totalVolume;
                    });
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }
            })
        },
        classDetailOpera(orderItem,index,num){
            var that = this;
            if(!that.tfoOrderInfoDetail){
                that.orderResultInfo(orderItem,index,num);
            }
            $(".allocatedMessages table input").attr("checked",false);
            that.allocatedOrderArr = [];
            $(".maskLayer6").show();
            that.currTableOrderStr1 = orderItem.str1;
        },
        changePage(pageNum,clickStatus){
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
            if(that.diffTloOrderIds == 0){
                var searchFormArr = this.queryParam;
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == getQueryTime(-1)){
                    searchFormArr.startCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == getQueryTime(-1)){
                    searchFormArr.endCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }
                searchFormArr.isAsign = false;
                searchFormArr.pageInfo ={
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            }else{
                var searchFormArr = this.queryParam;
                var tloOrderIds = '';
                for(var a=0;a<that.currentRelatedArr.length;a++){
                    if(a<that.currentRelatedArr.length-1){
                        tloOrderIds += that.currentRelatedArr[a]+','
                    }else{
                        tloOrderIds += that.currentRelatedArr[a]
                    }
                }
                searchFormArr.tloOrderIds = tloOrderIds;
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == getQueryTime(-1)){
                    searchFormArr.startCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == getQueryTime(-1)){
                    searchFormArr.endCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }
                searchFormArr.isAsign = false;
                searchFormArr.pageInfo ={
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
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
                that.endCompleteDate = crcdEndTimeVal;
                that.waitScheduleOrder = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
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
                pageSize:that.bcQueryPageSize
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime= deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
            }
            $("#classTableId tr.see").removeClass('active');
            that.tfoOrderInfoDetail = false;
            that.temOrderId = '';
            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                for(var i = 0 ; i < data.result.length; i++ ){
                    if(data.result[i].num1 < data.result[i].totalVolume){
                        data.result[i].bearingCapacity = 0
                    }else{
                        data.result[i].bearingCapacity = 1
                    }
                    data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                }
                that.currentClassesArr = [];
                $("#classesOrderTable table input").attr("checked",false);
                that.finishScheduleOrder = data.result;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = {
                assignStatus:"0"
            }
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            that.diffTloOrderIds = 0;
            $(".searchBtn .collUnfold").hide();
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                searchFormArr.isAsign = false;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.queryPageSize
                }
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == getQueryTime(-1)){
                    searchFormArr.startCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == getQueryTime(-1)){
                    searchFormArr.endCompleteTime = getQueryTime(-1);
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
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.startCompleteDate = crcdStartTimeVal;
                    that.endCompleteDate = crcdEndTimeVal;
                    that.waitScheduleOrder = data.result;
                    that.currentPage = 1;
                    $(".waitScheduleList .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.pageList = [];
                    that.totalPagesNum = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            }else{
                imitatePopup("请输入大于1的正整数","alert");
                return false;
            }
        },
        // 查看路线点
        lookPointOrder(){
            var that = this;
            that.diffTloOrderIds = 1;
            if(that.currentRelatedArr.length == 0){
                imitatePopup("请先选择路线",'alert');
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
                    pageSize:that.queryPageSize
                }

                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == getQueryTime(0)){
                    searchFormArr.startCompleteTime = getQueryTime(0);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == ""){

                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.startCompleteDate = crcdStartTimeVal;
                    that.endCompleteDate = crcdEndTimeVal;
                    that.waitScheduleOrder = data.result;
                    that.currentPage = 1;
                    that.pageList = [];
                    that.totalPagesNum = data.pageInfo.total;
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                    $(".maskLayer3").hide();
                    that.queryParam.tloOrderIds = "";
                })
            }
        },
        getSearchVal1(){
            //订单搜索
            var that = this;
            that.orderResultOmOrderId = [];
            var splitCountNum = parseInt(that.bcQueryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.bcMultipleNum = that.bcQueryPageSize;
                var searchFormArr = this.queryParam1;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.bcMultipleNum
                }
                var deliveryTimeVal = that.deliveryDate;
                if(deliveryTimeVal == ""){
                    that.deliveryDate = getQueryTime(-1);
                    deliveryTimeVal = getQueryTime(-1);
                    imitatePopup("'发货日期'不能为空，已填写为默认时间！");
                }
                if(deliveryTimeVal == getQueryTime(-1)){
                    searchFormArr.startCompleteTime = getQueryTime(-1);
                    searchFormArr.endCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr.startCompleteTime = deliveryTimeVal;
                    searchFormArr.endCompleteTime = deliveryTimeVal;
                }
                $("#classTableId tr.see").removeClass('active');
                that.tfoOrderInfoDetail = false;
                that.temOrderId = '';

                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.theTotalShifts = data.result;
                    that.deliveryDate = deliveryTimeVal;
                    for(var i = 0 ; i < data.result.length; i++ ){
                        if(data.result[i].num1 < data.result[i].totalVolume){
                            data.result[i].bearingCapacity = 0
                        }else{
                            data.result[i].bearingCapacity = 1
                        }
                        data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                    }
                    that.finishScheduleOrder = data.result;
                    that.currentPage1 = 1;
                    that.currentOrderIndex = -1;
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
            }else{
                imitatePopup("请输入大于1的正整数",'alert');
                return false;
            }
        },
        batchDistributed(){   //批量派发
            var that = this;
            if(that.currentClassesArr.length == 0){
                imitatePopup("请先勾选班次",'alert');
                return false;
            }
            for(var a=0;a<that.currentClassesArr.length;a++){
                if(that.currentClassesArr[a].carDrvContactName == null || that.currentClassesArr[a].carDrvEqpNo == null){
                    imitatePopup('班次：'+that.currentClassesArr[a].str1+'，派发前请先指派司机和车辆！',"alert");
                    return false;
                }
            }
            that.currentOrderIndex = -1;
            that.tfoOrderInfoDetail = false;
            $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>批量派发中，请稍后......</span></div></div>');
            var stayOutClasses = [];
            for(var i = 0; i < that.currentClassesArr.length; i++){
                stayOutClasses.push({
                    state:1,
                    refId: that.currentClassesArr[i].omOrderId,
                    refNo: that.currentClassesArr[i].orderNo
                })
            }
            $.ajax({
                type: "post",
                url: tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                contentType : 'application/json',
                data: JSON.stringify(stayOutClasses),
                success:function(res){
                    $(".ajax-load-pupup .ajax-load-hint span").html("批量派发成功");
                    that.currentClassesArr = [];
                    $("#classesOrderTable table input").attr("checked",false);
                    setTimeout(function(){
                        $(".ajax-load-pupup").remove();
                    },600)
                }
            })
        },
        batchDeleteOrder(){
            var that = this;
            if(that.currentClassesArr.length == 0){
                imitatePopup("请先勾选班次",'alert');
                return false;
            }
            that.currentOrderIndex = -1;
            that.tfoOrderInfoDetail = false;
            var toDeleteArr = [];
            for(var i = 0 ; i < that.currentClassesArr.length;i++){
                toDeleteArr.push(that.currentClassesArr[i].omOrderId);
            }
            postRequest(tmsUrl + "/delete/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,toDeleteArr,function(data){
                that.currentClassesArr = [];
                that.checkedOperaOrder = [];
                //获取订单列表
                var searchFormArr1 = that.queryParam1;
                //that.tfoOrderInfoDetail = false;
                searchFormArr1.isAsign = true;
                searchFormArr1.pageInfo = {
                    pageNum: that.currentPage1,
                    pageSize: that.bcQueryPageSize
                }
                var deliveryTimeVal = that.deliveryDate;
                if(deliveryTimeVal == getQueryTime(-1)){
                    searchFormArr1.startCompleteTime = getQueryTime(-1);
                    searchFormArr1.endCompleteTime= getQueryTime(-1);
                }else{
                    searchFormArr1.startCompleteTime = deliveryTimeVal;
                    searchFormArr1.endCompleteTime = deliveryTimeVal;
                }
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                    for(var i = 0 ; i < data.result.length; i++ ){
                        if(data.result[i].num1 < data.result[i].totalVolume){
                            data.result[i].bearingCapacity = 0
                        }else{
                            data.result[i].bearingCapacity = 1
                        }
                        data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                    }
                    that.finishScheduleOrder = data.result;
                    that.pageList1 = [];
                    that.totalPagesNum1 = data.pageInfo.total;
                    //console.log(123);
                    $(".reportMessages table tr input").attr("checked",false);
                    for(var i = 0 ; i < data.pageInfo.pages;i++){
                        that.pageList1[i] = i + 1;
                    }
                })
            })
        },
        allDistributed(){   //全部派发
            var that = this;
            for(var a=0;a<that.theTotalShifts.length;a++){
                if(that.theTotalShifts[a].carDrvContactName == null || that.theTotalShifts[a].carDrvEqpNo == null){
                    imitatePopup('班次：'+that.theTotalShifts[a].str1+'，派发前请先指派司机和车辆！',"alert");
                    return false;
                }
            }
            var searchFormArr = this.queryParam1;
            that.currentOrderIndex = -1;
            that.tfoOrderInfoDetail = false;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 120
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime = deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
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
                            that.currentClassesArr = [];
                            $("#classesOrderTable table input").attr("checked",false);
                            setTimeout(function(){
                                $(".ajax-load-pupup").remove();
                            },600)

                        }
                    })
                }
            })
        },
        // 班次合并
        classesMerge() {
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
            $(".maskLayer4").show();
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
                    $(".maskLayer4").hide();
                }else{
                    imitatePopup(res.msg,"alert");
                }
            });
        },
        // 关闭班次调整
        closeMaskLayer4(){
            var that = this;
            $(".maskLayer4").hide();
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
                    url:umsUrl+'/query/objectByUser.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&userId="+that.logininf.umUserId+"&parentUmObjectId="+pageid,
                    type: "post",
                    success:function(res){
                        permissionListObj  = res.result;
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
        createdClassesAllotOrder(num){
            var that = this;
            if(num == 3 && that.currentRelatedArr.length == 0){
                imitatePopup("请先选择路线",'alert');
                return false;
            }
            if(num == 8 && that.currentSelectedAreaArr.length == 0){
                imitatePopup("请先选择班次",'alert');
                return false;
            }
            $(".maskLayer"+num).hide();
            $(".maskLayer2").show();
            that.typeCreateClass = num;
        },
        allotOrder(){
            var that = this;
            if(that.temOrderId == "" || that.temOrderId == null || that.temOrderId == undefined){
                imitatePopup("请先选中班次！",'alert');
                return false;
            }
            if(that.currentRelatedArr.length == 0){
                imitatePopup("至少选择一条路线！",'alert');
                return false;
            }
            var searchFormArr = this.queryParam;
            searchFormArr.tloOrderIdList = that.currentRelatedArr;
            searchFormArr.selectFromOrderId = that.temOrderId;
            postRequest(tmsUrl + "/save/newTfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                if(data.msg == "success" || data.msg == "SUCCESS"){
                    imitatePopup('分配成功！','alert');
                    $(".maskLayer3").hide();
                }
            })
        },
        createNewClasses(){
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                var searchFormArr = this.queryParam;
                searchFormArr.startCreateTime = that.timeHorizon.split(" - ")[0];
                searchFormArr.endCreateTime = that.timeHorizon.split(" - ")[1];
                searchFormArr.startCompleteTime = that.timeHorizon1.split(" - ")[0];
                searchFormArr.endCompleteTime = that.timeHorizon1.split(" - ")[1];
                searchFormArr.tloOrderIdList = that.currentRelatedArr;
                searchFormArr.dtmTime = that.deliveryDate3;
                $(".scheduleLoadPopup").show();
                $(".maskLayer2").hide();
                $(".maskLayer3").hide();
                $(".maskLayer8").hide();
                $.ajax({
                    type: 'POST',
                    url: tmsUrl + "/save/newTfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                    contentType : 'application/json',
                    data: JSON.stringify(searchFormArr),
                    beforeSend:function(){
                        var num = 0;
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
                    },
                    success: function (json) {
                        imitatePopup('创建班次并分配成功！','alert');
                        that.publicGetOrderList();
                        var searchFormArr2 = {
                            startDistCreateTime:that.startCompleteDate,
                            endDistCreateTime:that.endCompleteDate,
                            pageInfo:{
                                pageNum: 1,
                                pageSize: 100
                            }
                        }
                        $.ajax({
                            type: 'POST',
                            url: tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                            contentType : 'application/json',
                            data: JSON.stringify(searchFormArr2),
                            success:function(data){
                                that.pathScheduleOrder = data.result;
                            }
                        })
                        $(".progressCon").css({
                            "width": "100%"
                        })
                        $(".scheduleLoadPopup .scheduleTitle span").html("排单已完成");
                        setTimeout(function(){
                            $(".scheduleLoadPopup").hide();
                        },1000)
                    }
                });
            }else{
                imitatePopup("请输入大于1的正整数",'alert');
                return false;
            }
        },
        createNewClasses1(){
            var that = this;
            if (that.currentSelectedAreaArr.length == 0) {
                imitatePopup("请先选择片区！",'alert');
                return false;
            }
            var tzoOrderIdStr = "";
            for (var i = 0; i < that.currentSelectedAreaArr.length; i++) {
                if (i < that.currentSelectedAreaArr.length - 1) {
                    tzoOrderIdStr += that.currentSelectedAreaArr[i] + ',';
                } else {
                    tzoOrderIdStr += that.currentSelectedAreaArr[i];
                }
            }
            var searchFormArr = {
                tzoOrderIds: tzoOrderIdStr,
                startCompleteTime: that.timeHorizon1.split(" - ")[0],
                endCompleteTime: that.timeHorizon1.split(" - ")[1],
                assignStatus: '0',
                dtmTime: that.deliveryDate3
            };
            postRequest(tmsUrl + "/save/tjoTzoOrderInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                imitatePopup("片区创建班次并排单成功！","alert");
                that.getSearchVal1();
                that.getSearchVal();
                $(".maskLayer2").hide();
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
        changeCarrierInfo1(id){
            var that = this;
            if(id != ''){
                var param = {};
                $.each(that.resPartyList, function (indexs, val) {
                    if (val.cdPartyId == id) {
                        param = val;
                    }
                });
                that.newOrderCarrier1.partyName = param.partyName;// 承运商 名称
                that.newOrderCarrier1.partyCode = param.partyCode; // 承运商 编码
                that.newOrderCarrier1.isBuyer = param.isBuyer; // 承运商 是否买家
                that.newOrderCarrier1.isVendor = param.isVendor; // 承运商 是否卖家
                that.newOrderCarrier1.isTruck = param.isTruck; // 承运商 是否卡车公司
                that.newOrderCarrier1.isWarehouse = param.isWarehouse; // 承运商 是否仓库
                that.newOrderCarrier1.is3pl = param.is3pl; // 承运商 是否第三方物流
                that.newOrderCarrierContact.contactName = param.imgContactName; // 承运商联系人
                that.newOrderCarrierContact.contactTel = param.imgContactTel; // 承运商电话
                that.newOrderCarrierContact.contactEmail = param.imgContactEmail; // 承运商邮箱
                that.newOrderCarrierContact.contactAddress = param.imgContactAddress; // 承运商地址
            }
        },
        getOrderDetails(template,order,isAbnormalPage){
            this.abnormalPage = isAbnormalPage;
            this.templateTitle = template;
            this.currentOrderId = order.omOrderId;
            this.isShowSplitList = "0";
            var that = this;
            getRequest(tmsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.order.orderType == "DO"){
                    that.isShippingOrder = true;
                }else{
                    that.isShippingOrder = false;
                }
                // 发货商
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

                // 成本
                if(data.result.amtList != null && data.result.amtList.length > 0){
                    var amtList = data.result.amtList;
                    for(var m=0;m<amtList.length;m++){
                        if(amtList[m].amtType == 'ITEM_COST'){
                            that.OrderAmtList.itemCost = amtList[m].amt;
                        } else if(amtList[m].amtType == 'KG_COST'){
                            that.OrderAmtList.kgCost = amtList[m].amt;
                        } else if(amtList[m].amtType == 'M3_COST'){
                            that.OrderAmtList.m3Cost = amtList[m].amt;
                        }
                    }
                }else{
                    that.OrderAmtList = {};
                }

                // 满载率
                if(data.result.meaList != null && data.result.meaList.length > 0){
                    var meaList = data.result.meaList;
                    for(var n=0;n<meaList.length;n++){
                        if(meaList[n].meaType == 'LOAD_RATE_VOLUME'){
                            that.OrderMeaList.loadVolume = meaList[n].mea;
                        } else if(meaList[n].meaType == 'LOAD_RATE_WEIGHT'){
                            that.OrderMeaList.loadWeight = meaList[n].mea;
                        }
                    }
                }else{
                    that.OrderMeaList = {};
                }

                // 时间属性
                if(data.result.dtmList != null){
                    that.dtmListInfoList = data.result.dtmList;
                }else{
                    that.dtmListInfoList = [];
                }

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
            that.publicChangeBtnStatus();
            // that.isNewClasses = true;
            $(".maskLayer7").show();
            that.newDeliveryDate = getQueryTime(0) + " " + "01:00";
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
            var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:1
            };
            var searchFormArr0 = {
                refType:"PARTYLNK"
            };
            //获取新建班次承运商列表
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
            });
        },
        getSearchPathList(){
            var that = this;
            var searchFormArr = that.pathQueryParams;
            searchFormArr.startDistCreateTime=that.startCompleteDate;
            searchFormArr.endDistCreateTime=that.endCompleteDate;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 200
            }
            //获取路线列表  /query/selectTloOrderInfoList
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.pathScheduleOrder = data.result;
            })
        },
        changeOrder(template, order){
            var that = this;
            that.clickBtnType = "editHead";
            that.templateTitle = template;
            getRequest(tmsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data) {
                // 订单详情
                if(data.result.order != null){
                    that.orderDetail = data.result.order;
                    that.orderDetail.completeTime = timestampToTime2(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime2(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime2(null);
                    that.orderDetail.expireTime = timestampToTime2(null);
                }
            })
        },
        getCompleteTime(){
            var that = this;
            $("#completeTime").show();
            var mySchedule = new Schedule({
                el: '#completeTime',
                clickCb: function (y,m,d) {
                    $(".completeTimeSpan").val(formartDate(y,m,d));
                    that.orderDetail.completeTime = formartDate(y,m,d);
                    $("#completeTime").hide();
                }
            });
        },
        saveOrderHead() { // 订单修改
            var that = this;
            var omOrderHeadInfoModel = {};
            if (that.orderDetail.orderNature == "" || that.orderDetail.orderNature == undefined) {
                alert("请选择特性");
                return false;
            }
            if (that.orderDetail.completeTime == '') {
                alert("请选择要求送达时间");
                return false;
            }
            that.orderDetail.expireTime = that.orderDetail.completeTime;
            if (that.orderDetail.totalQty === "") {
                alert("请填写总数量");
                return false;
            }
            if (that.orderDetail.totalWeight === "") {
                alert("请填写总重量");
                return false;
            }
            if (that.orderDetail.totalVolume === "") {
                alert("请填写总体积");
                return false;
            }
            if (that.orderDetail.totalAmount === "") {
                alert("请填写总金额");
                return false;
            }
            omOrderHeadInfoModel.order = {};
            omOrderHeadInfoModel.order.trackingNo = that.orderDetail.trackingNo;
            omOrderHeadInfoModel.order.orderNature = that.orderDetail.orderNature;
            omOrderHeadInfoModel.order.completeTime = that.orderDetail.completeTime;
            omOrderHeadInfoModel.order.totalQty = that.orderDetail.totalQty;
            omOrderHeadInfoModel.order.qtyUnit = that.orderDetail.qtyUnit;
            omOrderHeadInfoModel.order.totalWeight = that.orderDetail.totalWeight;
            omOrderHeadInfoModel.order.weightUnit = that.orderDetail.weightUnit;
            omOrderHeadInfoModel.order.totalVolume = that.orderDetail.totalVolume;
            omOrderHeadInfoModel.order.volumeUnit = that.orderDetail.volumeUnit;
            omOrderHeadInfoModel.order.totalAmount = that.orderDetail.totalAmount;
            omOrderHeadInfoModel.order.currency = that.orderDetail.currency;
            omOrderHeadInfoModel.order.remark = that.orderDetail.remark;
            var omOrderHeadInfoList = [];
            omOrderHeadInfoList[0] = omOrderHeadInfoModel;
            postRequest(omsUrl + "/update/orderHeadInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, omOrderHeadInfoList, function (data) {
                // 关闭侧滑 ------ start
                $("#amendDshBoard").hide();
                var adsRightWid = $(".adsRight").width();
                $(".activityDshBoard").css({
                    "width": adsRightWid + "px"
                }, "fast");
                $(".activityDshBoard").removeClass("templateMin");
                // 关闭侧滑 ------ end
                that.getSearchVal();
            });
        },
        showItemDetails(){
            var that = this;
            that.shortShowType = '1';
        },
        hideItemDetails(){
            var that = this;
            that.shortShowType = '0';
        },
        showItemDetails1(){
            var that = this;
            that.shortShowType1 = '1';
        },
        hideItemDetails1(){
            var that = this;
            that.shortShowType1 = '0';
        },
        jumpFinishSchedule(){
            this.isNewClasses = false;
            this.publicChangeBtnStatus();
        },
        amendEndTime(){ // 修改要求到货时间
            var that = this;
            that.amendOrderInfo = [];
            if(that.orderList.length == 0){
                imitatePopup("请先勾选订单！","alert");
                return false;
            }
            for(var i=0;i<that.orderList.length;i++){
                that.amendOrderInfo.push(that.orderList[i].trackingNo)
            }
            $(".maskLayer5").show();
            that.changeCompleteTime = "";
            $("#changeEndTime").hide();
        },
        getChangeEndTime(){
            var that = this;
            $("#changeEndTime").show();
            var mySchedule = new Schedule({
                el: '#changeEndTime',
                clickCb: function (y,m,d) {
                    $(".changeComTimeSpan").val(formartDate(y,m,d));
                    that.changeCompleteTime = formartDate(y,m,d);
                    $("#changeEndTime").hide();
                }
            });
        },
        sureChangeComTime(){
            var that = this;
            var changeComTimeSpan = $(".changeComTimeSpan").val().trim();
            if(changeComTimeSpan == ""){
                imitatePopup("请先设置要求完成时间！","alert");
                return false;
            }
            var r = confirm("确定修改要求到货时间");
            if (r==true){
                var searchFormArr1 = [];
                for(var i=0;i<that.amendOrderInfo.length;i++){
                    var orderInfo = {
                        order:{
                            trackingNo: that.amendOrderInfo[i],
                            completeTime: changeComTimeSpan,
                            remark: null
                        }
                    };
                    searchFormArr1.push(orderInfo)
                }
                postRequest(omsUrl + "/update/orderHeadInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data) {
                    if(data.msg == "success" || data.msg == "SUCCESS"){
                        imitatePopup("修改要求到货时间成功！","alert");
                        $(".maskLayer5").hide();
                        that.getSearchVal();
                    }
                })
            }
        },
        resetOrderList(){
            window.location.reload();
        },
    },
    created:function(){
        var that = this;
        that.timeHorizon = ""+" - "+ "";
        that.timeHorizon1 = getQueryTime(-1)+" - "+ getQueryTime(-1);
        that.selectListData = getBasicData();    //获取下拉数据startCompleteDate
        that.queryParam = {};
        that.theTotalShifts = [];
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        var searchFormArr = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.queryPageSize
            },
            isAsign: false,
            assignStatus:0,
            startCompleteTime: getQueryTime(-1),
            endCompleteTime: getQueryTime(-1)
        }
        var searchFormArr1 = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.bcQueryPageSize
            },
            isAsign: true,
            startCompleteTime: getQueryTime(-1),
            endCompleteTime: getQueryTime(-1)
        }
        //获取待派车班次
        postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
            that.theTotalShifts = data.result;
            that.waitScheduleOrder = data.result;
            that.totalPagesNum = data.pageInfo.total;
            for(var i = 0 ; i < data.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();

            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoTloOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                for(var i = 0 ; i < data.result.length; i++ ){
                    if(data.result[i].num1 < data.result[i].totalVolume){
                        data.result[i].bearingCapacity = 0
                    }else{
                        data.result[i].bearingCapacity = 1
                    }
                    data.result[i].residueBear = accSub(data.result[i].num1,data.result[i].totalVolume);
                }
                that.finishScheduleOrder = data.result;
                that.totalPagesNum1 = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        })
        that.queryParam = {
            assignStatus:"0"
        }
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
        }
    }
})
function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
}

// 日期控件
$(document).ready(function() {
    // $('#timeRange').daterangepicker(null, function(start, end, label) {
    //     app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    // });
    $('#timeRange1').daterangepicker(null, function(start, end, label) {
        app.timeHorizon1  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('input[name="deliveryDate"]').daterangepicker({ singleDatePicker: true }, function(start, end, label) {
        app.deliveryDate= start.format('YYYY-MM-DD');
    });
    $('#timeRange2').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.newDeliveryDate = start.format('YYYY-MM-DD HH:mm');
    });

    $('#timeRange3').daterangepicker({
        singleDatePicker: true,
        timePicker: true,
        timePicker24Hour: true
    }, function (start) {
        app.deliveryDate3 = start.format('YYYY-MM-DD HH:mm');
    });
});

