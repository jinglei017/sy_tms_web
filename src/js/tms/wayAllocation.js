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
        isFinishSchedule:true,
        orderList:[],
        currentRelatedArr:[],
        currentClassesArr:[],
        resTfoOrder:{},
        OrderCarrierContact:{},
        OrderCarrierDriver:{},
        pathScheduleOrder:{},
        OrderCarrierEqp:{},
        newCarrierDriver:{},
        newCarrierEqp:{},
        searchInf:[],
        oneCarrierInfo:{},
        currentClasses:{},
        pathAllotProgressInf:{},
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
        allocatedOrderArr:[],
        currentCotactIndex:"",
        templateTitle:"新增联系人",
        currentOrderIndex:"-1",
        queryPageSize:150,
        multipleNum:150,
        bcQueryPageSize:150,
        bcMultipleNum:150,
        schemaInfo:"",
        OrderCarrier:{},
        defaultDeliveryDate:getQueryTime(-1),
        deliveryDate:getQueryTime(-1),
        startCompleteDate:getQueryTime(0),
        orderStatistics:{
            totalNum:0,
            totalNumQty:0,
            totalNumWeight:0,
            totalNumVolume:0
        },
        queryParam:{},
        queryParam1:{},
        pathQueryParams:{},
        resPartyList:[],
        shortShowType:"0",
        omOrderIdArray:[],
        splitType: 'master',
        isShowSplitList: false,
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
	    OrderCarrier:{},
	    OrderCarrierParty:{},
	    OrderCarrierContact:{},
	    OrderCarrierDriver:{},
	    OrderCarrierEqp:{},
	    dtmListInfoList:[{}],
	    packageGoodsDetails:"",
	    currentOrderId:"",
	    showTotalSingleList:false,
	    showDetailList:false,
	    abnormalPage:1,
	    isShowSplitList:"0",
	    orderSplitList:[{
	    	orderItemList:[{}]
	    }]
    },
    methods:{
//      rowDrop(orderList) {	//已分配订单拖拽
//          var tbody = document.querySelector('.allocatedMessages tbody')
//          var  that = this;
//          Sortable.create(tbody, {
//              onEnd: function (evt) {  //拖拽结束发生该事件
//                  that.orderResultInfoList.splice(evt.newIndex, 0, that.orderResultInfoList.splice(evt.oldIndex, 1)[0]);
//                  var newArray = that.orderResultInfoList.slice(0);
//                  that.orderResultInfoList = [];
//                  that.$nextTick(function () {
//                      that.orderResultInfoList = newArray;
//                  });
//              }
//          })
//      },
        tableDnEndFunc(){
            var that = this;
            that.omOrderIdArray = [];
            var newOrderResultInfoList = [];
            for(var i = 0; i < that.orderResultInfoList.length;i++){
                var currentOrderSeq = $("#allocatedMessages tbody tr").eq(i).attr("orderSeq");
                var currentOrderOmId = $("#allocatedMessages tbody tr").eq(i).attr("orderOmId");
                newOrderResultInfoList.push({
                    omOrderId: currentOrderOmId
                })
            }
            that.omOrderIdArray = newOrderResultInfoList;
        },
        tableDnD(el, callback) {
            if (typeof (el) == "string") {
                el = document.getElementById(el);
            }
            if (el == undefined || el == null) {
                return;
            }
            //绑定事件
            var addEvent = document.addEventListener ? function (el, type, callback) {
                el.addEventListener(type, callback, !1);
            } : function (el, type, callback) {
                el.attachEvent("on" + type, callback);
            }
            //移除事件
            var removeEvent = document.removeEventListener ? function (el, type, callback) {
                el.removeEventListener(type, callback);
            } : function (el, type, callback) {
                el.detachEvent("on" + type, callback);
            }
            //精确获取样式
            var getStyle = document.defaultView ? function (el, style) {
                return document.defaultView.getComputedStyle(el, null).getPropertyValue(style)
            } : function (el, style) {
                style = style.replace(/\-(\w)/g, function ($, $1) {
                    return $1.toUpperCase();
                });
                return el.currentStyle[style];
            }
            var dragManager = {
                clientY: 0,
                draging: function (e) {//mousemove时拖动行
                    var dragObj = dragManager.dragObj;
                    if (dragObj) {
                        e = e || event; //清除选区
                        if (window.getSelection) {//w3c
                            window.getSelection().removeAllRanges();
                        } else if (document.selection) {
                            document.selection.empty(); //IE
                        }
                        var y = e.clientY;
                        var down = y > dragManager.clientY; //是否向下移动
                        var tr = document.elementFromPoint(e.clientX, e.clientY);
                        if (tr && tr.nodeName == "TD") {
                            tr = tr.parentNode
                            dragManager.clientY = y;
                            if (dragObj !== tr && dragObj.parentNode===tr.parentNode) {
                                tr.parentNode.insertBefore(dragObj, (down ? tr.nextSibling : tr));
                            }
                        };
                    }
                },
                dragStart: function (e) {
                    e = e || event;
                    var target = e.target || e.srcElement;
                    if (target.nodeName === "TD") {
                        target = target.parentNode;
                        dragManager.dragObj = target;
                        if (!target.getAttribute("data-background")) {
                            var background = getStyle(target, "background-color");
                            target.setAttribute("data-background", background)
                        }
                        //显示为可移动的状态
                        target.style.backgroundColor = "#99d5ff";
                        target.style.cursor = "move";
                        dragManager.clientY = e.clientY;
                        addEvent(document, "mousemove", dragManager.draging);
                        addEvent(document, "mouseup", dragManager.dragEnd);
                    }
                },
                dragEnd: function (e) {
                    var dragObj = dragManager.dragObj
                    if (dragObj) {
                        e = e || event;
                        var target = e.target || e.srcElement;
                        if (target.nodeName === "TD") {
                            target = target.parentNode;
                            dragObj.style.backgroundColor = dragObj.getAttribute("data-background");
                            dragObj.style.cursor = "default";
                            dragManager.dragObj = null;
                            removeEvent(document, "mousemove", dragManager.draging);
                            removeEvent(document, "mouseup", dragManager.dragEnd);
                            if(typeof(callback)=='function'){
                                callback(target);
                            }
                        }
                    }
                },
                main: function (el) {
                    addEvent(el, "mousedown", dragManager.dragStart);
                }
            }
            dragManager.main(el);
        },
        saveNewSorting(){	//已分配订单保存排序
            var that = this;
            var fromOrderId = that.currentClasses.omOrderId;
            var newSortParams = [];
            for(var i = 0; i < this.omOrderIdArray.length;i++){
                newSortParams.push({
                    fromOrderId:fromOrderId,
                    seq:i+1,
                    toOrderId:this.omOrderIdArray[i].omOrderId
                })
            }
            that.orderResultInfoList = [];
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
        chooseTheFile(){	//上传文件
            this.filesUpload();
            this.clearShow = false;
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
                        $(".deliveryTimeSpan").val(getQueryTime(-1));
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
                        postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
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
            $(".maskLayer1").show();
        },
        closeMaskLayer(){
            $(".maskLayer1").hide();
            $(".maskLayer3").hide();
        },
        closeMaskLayer1(){
            $(".maskLayer1").hide();
            $(".maskLayer2").hide();
            $(".maskLayer3").show();
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
        getDeliveryTime(){
            var that = this;
            $("#deliveryTime").show();
            var mySchedule = new Schedule({
                el: '#deliveryTime',
                clickCb: function (y,m,d) {
                    $(".deliveryTimeSpan").val(formartDate(y,m,d));
                    that.deliveryDate = formartDate(y,m,d);
                    $("#deliveryTime").hide();
                }
            });
        },
        getDeliveryTimeVal(){
        	var deliveryTimeSpan = $("#deliveryTimeSpanVal").val();
			if(deliveryTimeSpan == ""){
				this.deliveryDate = "";
			}
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
        newDistributeOrder(){  // 新增该班次
            if($(".newClassesCon #carrierDriverName").val().trim() == "" && $(".newClassesCon .carrierDriverTel").val().trim() == "" && $(".newClassesCon #carrierEqpNo").val().trim() == "" && $(".newClassesCon .carrierEqpName").val().trim() == ""){
                imitatePopup("请先输入司机信息再保存",'alert');
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
                    party: that.OrderCarrier1
                },
                dtmTime:completionTime
            };
            console.log(newClassesObj);
            postRequest(tmsUrl + "/insert/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,newClassesObj,function(data){
                imitatePopup('班次新增成功！','alert');
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
        publicGetOrderList(){
            var that = this;
            that.orderList = [];
            that.allChecked = false;
            that.orderStatistics.totalNum = 0;
            that.orderStatistics.totalNumQty = 0;
            that.orderStatistics.totalNumWeight = 0;
            that.orderStatistics.totalNumVolume = 0;
            var searchFormArr = that.queryParam;
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
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
            if(crcdStartTimeVal == getQueryTime(0)){
                searchFormArr.startCompleteTime = getQueryTime(0);
            }else{
                searchFormArr.startCompleteTime = crcdStartTimeVal;
            }
            if(crcdEndTimeVal == ""){

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
                pageSize: that.bcQueryPageSize
            }
            var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
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
                that.waitScheduleOrder = data.result;
                that.pageList = [];
                that.totalPagesNum = data.pageInfo.total;
                for(var i = 0 ; i < data.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
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
            if($(".popupCon .newClassesCon .newCarrierEqpName").val().trim() == "" && $(".popupCon .newClassesCon #newCarrierEqpNo").val().trim() == "" && $(".popupCon .newClassesCon .newCarrierDriverTel").val().trim() == "" && $(".popupCon .newClassesCon #newCarrierDriverName").val().trim() == ""){
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
                var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
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
                    imitatePopup("请先选择线路再分配",'alert');
                    return false;
                }
                if(that.orderList.length == 0){
                    imitatePopup("请至少勾选一条数据行",'alert');
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
                    imitatePopup('批量分配成功！','alert');
                    that.orderList = [];
                    $(".waitScheduleList .reportMessages tr").removeClass("active");
                    $(".reportMessages table tr td .checkInp").attr("checked",false);
                    that.publicGetOrderList();

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
            }
        },
        massDistribute(){
            //分配派发
            var that = this;
            if(this.isNewClasses){

            }else{
                if(!that.tfoOrderInfoDetail){
                    imitatePopup("请先选择线路再分配",'alert');
                    return false;
                }
                if(that.orderList.length == 0){
                    imitatePopup("请至少勾选一条数据行",'alert');
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
                postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,allotOrderArr,function(data){
                    imitatePopup('批量分配派发成功','alert');
                    that.orderList = [];
                    $(".waitScheduleList .reportMessages tr").removeClass("active");
                    $(".reportMessages table tr td .checkInp").attr("checked",false);
                    that.publicGetOrderList();

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
            }
        },
        showPathPopup(){
            var that= this;
            this.currentRelatedArr = [];
            $("#pathOrderTable tbody .see").removeClass("active");
            $("#pathOrderTable input").prop('checked',false);
            $(".maskLayer3").show();
            var searchFormArr2 = {
                pageInfo:{
                    pageNum: 1,
                    pageSize: 200
                }
            }
            //获取路线列表  /query/selectTaskOrderInfoPage
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr2,function(data){
                that.pathScheduleOrder = data.result;
            })
        },
        textboxAllSelectionFun3(){
            var that = this;
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
                imitatePopup("请至少勾选一条数据行",'alert');
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
                $(".waitScheduleList .reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".waitScheduleList .reportMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        textboxAllSelectionFun1(){
            var that = this;
            $(".pathOrderListCon .reportMessages tbody input[type='checkbox']").prop('checked', $(".pathOrderListCon .reportMessages thead input[type='checkbox']").prop('checked'));
            if($(".pathOrderListCon .reportMessages thead input").prop("checked")){
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
                $(el).parents(".see").addClass("active");
                that.currentRelatedArr.push(orderItem.omOrderId);
            }else{
                $(el).parents(".see").removeClass("active");
                that.currentRelatedArr.splice($.inArray(orderItem.omOrderId,that.currentRelatedArr),1);
            }
            if(that.currentRelatedArr.length == that.pathScheduleOrder.length){  // 单选个数 = 该页条数，全选选中
                $("#classesOrderList thead input[type='checkbox']").prop('checked',true);
            }else{
                $("#classesOrderList thead input[type='checkbox']").prop('checked',false);
            }
        },
        textboxAllSelectionFun2(){
            var that = this;
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
                imitatePopup('订单派发成功！','alert');
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
                imitatePopup("请先选择线路再分配",'alert');
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
        orderDistribute(orderItem){
            //订单分配派发
            var that = this;
            if(!that.tfoOrderInfoDetail){
                imitatePopup("请先选择线路再分配",'alert');
                return false;
            }
            var searchFormArr = [];
            searchFormArr.push({
                fromOrderId:that.currentClasses.omOrderId,
                fromOrderNo:that.currentClasses.orderNo,
                toOrderId:orderItem.omOrderId,
                toOrderNo:orderItem.orderNo
            })
            postRequest(tmsUrl + "/save/tfoOrderTfoLnkAndAuditStatus.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                $(".reportMessages table tr td .checkInp").attr("checked",false);
                that.orderList = [];
                that.publicGetOrderList()
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
            //获取订单列表
            postRequest(tmsUrl + "/query/tfoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                //that.orderDetails = data.result.order;  // 订单信息

                that.currentOrderInfo  = data.result.carrierPartyInfo;

                that.tableDnD(document.getElementById("allocatedMessages"),that.tableDnEndFunc);

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
                    //that.rowDrop(data.result.orderLnkList);
                    that.orderResultInfoList = data.result.orderLnkList;
                    that.totalOrderResultNum = data.result.orderLnkList.length;
                }
//
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
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
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
            if(crcdStartTimeVal == getQueryTime(0)){
                searchFormArr.startCompleteTime = getQueryTime(0);
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
                pageSize:that.bcQueryPageSize
            }
            var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
            if(deliveryTimeVal == getQueryTime(-1)){
                searchFormArr.startCompleteTime = getQueryTime(-1);
                searchFormArr.endCompleteTime = getQueryTime(-1);
            }else{
                searchFormArr.startCompleteTime = deliveryTimeVal;
                searchFormArr.endCompleteTime = deliveryTimeVal;
            }
            $("#classTableId tr.see").removeClass('active');
            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
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
        getSearchVal(){
            //订单搜索
            var that = this;
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
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
                var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
                var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();
                if(crcdStartTimeVal == "" && crcdEndTimeVal == "" && startTimeVal == "" && endTimeVal == ""){
                    $(".startTimeSpan").val(getQueryTime(1));
                    startTimeVal = getQueryTime(1);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
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
                imitatePopup("请输入大于1的正整数",'alert');
                return false;
            }
        },
        getSearchVal1(){
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.bcQueryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                that.bcMultipleNum = that.bcQueryPageSize;
                var searchFormArr = this.queryParam1;
                searchFormArr.pageInfo = {
                    pageNum:1,
                    pageSize:that.bcQueryPageSize
                }
                var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
                if(deliveryTimeVal == ""){
                    $(".deliveryTimeSpan").val(getQueryTime(-1));
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
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
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
                var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
                if(deliveryTimeVal == getQueryTime(-1)){
                    searchFormArr1.startCompleteTime = getQueryTime(-1);
                    searchFormArr1.endCompleteTime = getQueryTime(-1);
                }else{
                    searchFormArr1.startCompleteTime = deliveryTimeVal;
                    searchFormArr1.endCompleteTime = deliveryTimeVal;
                }
                //获取现有班次
                postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
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
            var searchFormArr = this.queryParam1;
            that.currentOrderIndex = -1;
            that.tfoOrderInfoDetail = false;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 120
            }
            var deliveryTimeVal = $(".deliveryTimeSpan").val().trim();
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
        createdClassesAllotOrder(){
            var that = this;
            //console.log(that.currentRelatedArr);
            if(that.currentRelatedArr.length == 0){
                imitatePopup("请先选择路线");
            }else{
                $(".maskLayer3").hide();
                $(".maskLayer2").show();
            }
        },
        createNewClasses(){
            var that = this;
            var shipTimeVal = $("#shipTime").val();
            var	completionTime = $(".completionTime").html() + " "+ shipTimeVal;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 ) {
                var searchFormArr = this.queryParam;
                var startTimeVal = $(".startTimeSpan").val().trim();
                var endTimeVal = $(".endTimeSpan").val().trim();
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
                if(crcdStartTimeVal == getQueryTime(0)){
                    searchFormArr.startCompleteTime = getQueryTime(0);
                }else{
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                }
                if(crcdEndTimeVal == ""){

                }else{
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                }
                searchFormArr.tloOrderIdList = that.currentRelatedArr;
                searchFormArr.dtmTime = completionTime;
                $(".scheduleLoadPopup").show();
                $(".maskLayer2").hide();
                $(".maskLayer3").hide();
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
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: 200
            }
            //获取路线列表  /query/selectTaskOrderInfoPage
            postRequest(tmsUrl + "/query/selectTloOrderInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
                that.pathScheduleOrder = data.result;
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
        resetOrderList(){
            window.location.reload();
        },
    },
    created:function(){
        $(".startTimeSpan").attr("value",getQueryTime(1));
        var that = this;
        that.selectListData = getBasicData();    //获取下拉数据
        that.queryParam = {};
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        var searchFormArr = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.queryPageSize
            },
            isAsign: true,
            startCompleteTime: getQueryTime(0)
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
        //获取待派车班次    /query/selectTaskOrderInfoPage
        postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(data){
            that.waitScheduleOrder = data.result;
            that.totalPagesNum = data.pageInfo.total;
            for(var i = 0 ; i < data.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
            //获取现有班次
            postRequest(tmsUrl + "/query/selectTfoEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(data){
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
function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}
