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
        resTfoOrder:{},
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
        queryPageSize:20,
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
        startCompleteDate: "",
        defaultDeliveryDate:getQueryTime(-1),
        deliveryDate:getQueryTime(-1),
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
        showPlaceList:false,
        getPlaceListTimer:null,
        timeHorizon:"", //创建时间范围
        timeHorizon1:""//完成时间范围
    },
    methods:{
        queryPlaceInfo(val){ //  地区 联想
            if(val != '' && val != ' '){
                var that = this;
                that.showPlaceList = false;
                clearTimeout(that.getPlaceListTimer);
                that.getPlaceListTimer = null;
                that.getPlaceListTimer = setTimeout(function(){
                    var name = val.trim();
                    $.ajax({
                        url: cmdUrl + "/query/districts.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&name="+name,
                        type: "get",
                        contentType : 'application/json',
                        success: function (data) {
                            that.placeList = [];
                            if(data.result.length > 0){
                                that.placeList = data.result;
                                for(var i=0;i<that.placeList.length;i++){
                                    if(that.placeList[i].parentCode == '110100'){
                                        that.placeList[i].chineseName = "北京市-"+that.placeList[i].chineseName;
                                    }else if(that.placeList[i].parentCode == '220100'){
                                        that.placeList[i].chineseName = "长春市-"+that.placeList[i].chineseName;
                                    }
                                }
                                that.showPlaceList = true;
                            }
                        }
                    });
                },300);
            }else{
                var that = this;
                that.showPlaceList = false;
            }
        },
        choosePlace(placeItem){
            var that = this;
            if(placeItem.chineseName == "长春市-朝阳区" || placeItem.chineseName == "北京市-朝阳区"){
                that.queryParam.stoDistrictName = "朝阳区"
            }
            that.queryParam.stoDistrictCode = placeItem.adcode;
            that.queryParam.stoDistrictName = placeItem.chineseName;
            that.showPlaceList = false;
        },

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
            var that = this;
            that.newCarrierDriver = that.OrderCarrierDriver;
            that.newCarrierEqp = that.OrderCarrierEqp;
            $(".maskLayer1").show();
        },
        closeMaskLayer(){
            $(".maskLayer1").hide();
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
            var searchFormArr = {
                refType:"PARTYLNK",
                isDefault:1
            };
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
            this.OrderCarrierEqp.eqpNature = driveritem.eqpNature;
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
            this.newCarrierEqp.eqpNature = driveritem.eqpNature;
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
            this.OrderCarrierEqp.eqpNature = plateitem.eqpNature;
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
            this.newCarrierEqp.eqpNature = plateitem.eqpNature;
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
                pageSize: 5
            }
            var deliveryTimeVal = that.deliveryDate;
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr1.startCompleteTime = getQueryTime(-1);
                searchFormArr1.endCompleteTime= getQueryTime(-1);
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
                that.waitScheduleOrder = data.result;
                that.pageList = [];
                that.totalPagesNum = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
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
                imitatePopup("请先输入司机信息再保存","alert");
                return false;
            }
            this.OrderCarrierEqp.eqpNo = this.newCarrierEqp.eqpNo;
            this.OrderCarrierEqp.eqpName = this.newCarrierEqp.eqpName;
            this.OrderCarrierEqp.eqpBrand = this.newCarrierEqp.eqpBrand;
            this.OrderCarrierEqp.eqpType = this.newCarrierEqp.eqpType;
            this.OrderCarrierEqp.eqpNature = this.newCarrierEqp.eqpNature;
            this.OrderCarrierEqp.eqpSpec = this.newCarrierEqp.eqpSpec;
            this.OrderCarrierEqp.eqpNature = this.newCarrierEqp.eqpNature;
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
            }
        },
        revocationFun(orderinfo){
            //撤回已分配订单
            if(orderinfo.completeStatus!='INIT') {
                var r = confirm("订单已装车或签收你确定要撤销吗？");
                if(!r){
                    return false;
                }
            } else if (orderinfo.assignStatus == 1) {
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
                that.publicGetOrderList()
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
                imitatePopup("请先输入司机信息再保存","alert");
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
            var remark = $(".remarkNewBan").val();
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
                    party: that.OrderCarrier1
                },
                remark: remark,
                dtmTime:completionTime
            };
            console.log(newClassesObj);
            postRequest(tmsUrl + "/insert/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newClassesObj,function(data){
                that.deliveryDate = getQueryTime(-1);
                imitatePopup('班次新增成功！',"alert");
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
        // 派发
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

        // 全部派发
        allDistributed(){
            var that = this;
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

            /*postRequest(tmsUrl + "/query/selectTfoOrderIdInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                for(var i = 0; i < data.result.length; i++){
                    allOutClasses.push({
                        state: 1,
                        refId: data.result[i].refId,
                        refNo: data.result[i].refNo
                    })
                }
                postRequest(tmsUrl + "/save/tfoOrderAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allOutClasses,function(data){
                    that.currentClassesArr = [];
                    $("#classesOrderTable table input").attr("checked",false);
                    alert('全部派发成功');
                })
            })*/

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

        orderDistribution(orderItem){
            console.log(orderItem)
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
                        postRequest(tmsUrl + "/save/tfoOrderTfoLnk.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (data) {
                            $(".reportMessages table tr td .checkInp").attr("checked", false);
                            that.orderList = [];
                            that.publicGetOrderList()
                        })
                    })

                }
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
                    that.resTfoOrder.totalQtyAll = totalQtyAll.toFixed(2);
                    that.resTfoOrder.totalWeightAll = totalWeightAll.toFixed(2);
                    that.resTfoOrder.totalVolumeAll = totalVolumeAll.toFixed(2);
                }
            })
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
            searchFormArr.isAsign = false;
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
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                completeStatus:"",
                actCode:"",
                exceptionStatus:"",
                stoDistrictCode:"",
                stoDistrictName:"",
                assignStatus:"0"
            };
        },
        getSearchVal(){
            //订单搜索
            var that = this;
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
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];

                if(crcdStartTimeVal == "" && crcdEndTimeVal == "" && startTimeVal == "" && endTimeVal == ""){
                    startTimeVal = getQueryTime(1);
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
                postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                    that.startCompleteDate = crcdStartTimeVal;
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
        getSearchVal1(){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam1;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
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
                that.pageList1 = [];
                that.totalPagesNum1 = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
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
                imitatePopup("请输入大于1的正整数","alert");
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
                        imitatePopup(res.msg.message,"alert");
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
                    imitatePopup('距离上次订单同步间隔不到5分钟，请稍后重试！',"alert");
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
    },
    created:function(){
        var that = this;
        that.timeHorizon = getQueryTime(1)+" - "+ getQueryTime(-10);
        that.selectListData = getBasicData();    //获取下拉数据
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
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
        // 获取待派车班次    /query/selectTaskOrderInfoPage
        var searchFormArr = {
            pageInfo:{
                pageNum: 1,

                pageSize: that.queryPageSize
            },
            isAsign: false,
            assignStatus:0,
            startCreateTime: getQueryTime(1)
        };
        postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
//			for(var i = 0; i < data.result.length; i++){
//				data.result[i].newStoPartyName = data.result[i].stoPartyName.substring(0,6);
//			}
            that.waitScheduleOrder = data.result;
            that.totalPagesNum = data.pageInfo.total;
            for(var i = 0 ; i < data.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();

            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
                that.finishScheduleOrder = data.result;
                that.totalPagesNum1 = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        })
        initSelectData(this);
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
        exceptionStatus:"",
        stoDistrictCode:"",
        stoDistrictName:"",
        assignStatus:"0"
    }
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
    $('input[name="deliveryDate"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns:true,
        minYear:1901,
        maxYear:parseInt(moment().format('YYYY'),10)
    }, function(start, end, label) {
        app.deliveryDate= start.format('YYYY-MM-DD');
    });
});
