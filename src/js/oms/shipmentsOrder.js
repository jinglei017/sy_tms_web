var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:20,
        totaAlllList:[],
        pageAllList:[],
        isDisable:false,
        clickBtnType:"",
        orderOmOrderId:"",
        tableOrderList:{},
        tableOrderList0:{},
        packageGoodsInf:{},
        selectListData:{},
        queryParam:{},
        selectGoods:{},
        temporaryGoods:[],
        temporaryGoodsId:[],
        queryParam1:{
            partyType:null
        },
        queryParam2:{
            partyType:null
        },
        queryParam3:{
            contactType:"",
            partyType:null
        },
        queryParam4:{
            refType:"",
            partyType:null
        },
        queryParam5:{
            refType:"",
            eqpType:null
        },
        pageList:[],
        totalPagesNum :"",
        orderDetail:{},
        shipperParty:{
            partyName:"",
            partyCode:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
        },
        shipperPartyContact:{
            contactName:"",
            contactTel:"",
            contactEmail:""
        },
        shipperPartyLocation:{
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
        },
        shipperPartyLocationContact:{
            contactName:"",
            contactTel:""
        },
        shipperPartyLocationContactList:{},
        shipperPartyContactList:{},
        shipperPartyLocationList:{},
        receiptParty:{
            partyName:"",
            partyCode:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
        },
        receiptPartyContact:{
            contactName:"",
            contactTel:"",
            contactEmail:""
        },
        receiptPartyLocation:{
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
        },
        receiptPartyLocationContact:{
            contactName:"",
            contactTel:""
        },
        receiptPartyLocationContactList:{},
        receiptPartyContactList:{},
        receiptPartyLocationList:{},
        carrierPartyContactNameList:{},
        carrierPartyEqpNameList:{},
        carrierPartyDriverNameList:{},
        OrderCarrier:{
            partyName:"",
            partyCode:"",
            partyType:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
        },
        OrderCarrierContact:{
            contactName:"",
            contactTel:"",
            contactEmail:"",
            contactAddress:""
        },
        OrderCarrierDriver:{
            contactName:"",
            contactTel:""
        },
        OrderCarrierEqp:{
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
        },
        OrderCarrierDriverList:{},
        OrderCarrierContactList:{},
        OrderCarrierEqpList:{},
        orderCarrierList:[{
            shipperPartyHave:{},
            receiptPartyHave:{},
            orderDetailHave:{},
            OrderCarrierContactHave:{},
            OrderCarrierEqpHave:{},
            OrderCarrierHave:{},
            OrderCarrierDriverHave:{}
        }],
        orderItemDetail:{orderItem:{}},
        uploadImgList:[],
        orderCodeItem:{},
        orderReceiptItem:{},
        orderLogisticsInfo:{},
        srcFileList:[],
        begin:"",
        downorderItemFileList:[],
        baginFile:"",
        magnifyImgSrc:"",
        magnifyImgType:"",
        indexImg:0,
        receiptImgList:[],
        receiptFilesList:[],
        orderItemImgList:[],
        orderItemFilesList:[],
        actCurrentInfo:{
            actCode:'',
            createTime:null,
            remark:''
        },
        actListInfo:{},
        logininf:{},
        orderList:[],
        checkedNum:0,
        allChecked:false,
        omOrderList:[],
        itemList:[],
        checkedOperaOrder:[],
        isShippingOrder:false,
        existCarrier:false,
        currentGoodsIndex:"",
        templateTitle:"新增订单",
        packageGoodsDetails:"",
        transitGoodsList:[],
        transitGoodsListId:[],
        showPackageList:[],
        vehicleTypeList:[],
        OrderStatusDetail:{},
        packageGoodsList:[{
            orderItem:{
                itemNature:"",
                itemName:"",
                itemNo:"",
                itemCode:"",
                lotNo:"",
                unitPrice:"",
                currency:"",
                qty:"",
                qtyUnit:"",
                weight:"",
                weightUnit:"",
                volume:"",
                volumeUnit:"",
                amount:""
            }
        }],
        popupType:"",
        partyList:{},
        OrderCarrierList:{},
        eqpDriverList:{},
        contactList:[{}],
        addressList:{},
        currentPage1:1,
        currentPage2:1,
        currentPage3:1,
        currentPage4:1,
        currentPage5:1,
        pageList1:[],
        pageList2:[],
        pageList3:[],
        pageList4:[],
        pageList5:[],
        totalPagesNum1 :"",
        totalPagesNum2 :"",
        totalPagesNum3 :"",
        totalPagesNum4 :"",
        totalPagesNum5 :"",
        orderPartyType:"",
        contanctBtnType:"",
        tableOrderItemAuditStatus:"", // 该订单的审核状态，，，，订单页 提交并审核通过
        auditOrderType:"0",
        orderDirection:{
            auditOrderRemark:"",
            direction:"0",
            refCode:"",
            refCodeTable:"0"
        },
        clearShow0:true, // 订单导入
        clearShow1:true,  // 上传附件
        clearShow2:true,  // 上传图片（回单）
        clearShow3:true, // 上传商品图片
        clearShow4:true, // 上传商品附件
        uploadFilesOrderItemId:'', // 上传附件 类型：3、4 商品id
        uploadFilesType:'', // 上传附件 类型：0 - 上传订单附件（订单新增），1 - 上传订单附件（订单修改），2 - 上传订单附件（上传-上传附件），3 - 上传商品附件（订单新增），4 - 上传商品附件（订单修改）
        getAllCountryList:{}, // 国家列表
        orderPartyList:[], // 订单 发单方，接单方 下拉列表
        showItemList:"0",
        address00:"", // 改变 address —— 国
        address0:"", // 改变 address —— 省
        address1:"", // 改变 address —— 市
        address2:"", // 改变 address —— 区
        address3:"", // 改变 address —— 街道

        activeStatusShow:'0',
        timeHorizon:"" //创建时间范围
    },
    methods:{
        // 点击“订单导入” （上传excel文件）---------------------------------------------------------------------------- start
        chooseTheFileType(){
            $('#excelFile').addClass('uploadType1');
            $('#excelFile').click();
        },
        chooseTheFile(){
            var that = this;
            that.clearShow0 = false;
            if($('#excelFile').hasClass('uploadType1')){
                that.filesUpload();
            }
        },
        filesUpload(){
            var that = this;
            fileUploadRequest(omsUrl + '/import/orderHaulInfoData.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,function(res){
                that.filesUploadSuc();
            });
        },
        filesUploadSuc(){
            var that = this;
            that.clearShow0 = true;
            setTimeout(function(){
                $(".fileUploadLi #inputBox0").css({"display":"inline-block"});
            },100);
            $(".ajax-load-pupup").remove();
            that.getSearchVal();
        },
        // 点击“订单导入” ---------------------------------------------------------------------------- end

        addOrderCarrierHint(){
            var that = this;
            if(that.checkedNum == 0){
                alert("请先勾选至少一条订单行！");
                return '0';
            }else{
                return '1'
            }
        },
        saveOrderStateFun(){
            var that = this;
            that.orderList = [];
            $('.checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    that.orderList.push({
                        omOrderId:$(this).val()
                    })
                }
            });
            var stateInf = [];
            for(var i = 0 ; i < that.orderList.length;i++){
                var params = {};
                params.orderId = that.orderList[i].omOrderId;
                if(that.OrderStatusDetail.completeStatus != ""){
                    params.completeStatus = that.OrderStatusDetail.completeStatus
                }
                if(that.OrderStatusDetail.sendStatus != ""){
                    params.sendStatus = that.OrderStatusDetail.sendStatus
                }
                if(that.OrderStatusDetail.expireStatus != ""){
                    params.expireStatus = that.OrderStatusDetail.expireStatus
                }
                if(that.OrderStatusDetail.exceptionStatus != ""){
                    params.exceptionStatus = that.OrderStatusDetail.exceptionStatus
                }
                if(that.OrderStatusDetail.activeStatus != ""){
                    params.activeStatus = that.OrderStatusDetail.activeStatus;
                }
                if(that.OrderStatusDetail.payStatus != ""){
                    params.payStatus = that.OrderStatusDetail.payStatus;
                }
                if(that.OrderStatusDetail.auditStatus != ""){

                    params.auditStatus = that.OrderStatusDetail.auditStatus;
                }
                if(that.OrderStatusDetail.motionStatus != ""){
                    params.actCode = that.OrderStatusDetail.motionStatus;
                }

                if(that.OrderStatusDetail.completeStatus == "" && that.OrderStatusDetail.sendStatus == "" && that.OrderStatusDetail.expireStatus == "" && that.OrderStatusDetail.exceptionStatus == "" && that.OrderStatusDetail.activeStatus == "" && that.OrderStatusDetail.payStatus == "" && that.OrderStatusDetail.auditStatus == "" && that.OrderStatusDetail.motionStatus == ""){
                    imitatePopup("当前未选中任何状态，请选择状态后再保存","alert");
                    return false;
                }
                stateInf.push(params)
            }
            postRequest(tmsUrl + "/orderProcessing.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,stateInf,function(data){
                if(data.result.success == true){
                    imitatePopup("订单状态添加成功","alert");
                    that.publicGetOrderListFun();
                }else{
                    imitatePopup(data.result.message,"alert");
                }
            })
        },
        addOrderCarrierFun(){ // 添加合作商 —— 按钮
            var that = this;
            that.orderList = [];
            $('.checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                    that.orderList.push({
                        omOrderId:$(this).val()
                    })
                }
            });
            if(that.orderList.length == 0){
                imitatePopup("请勾选对应数据行","alert");
                return false;
            }
            that.isDisable = true;
            that.orderCarrierList = [];
            for(var i = 0; i < that.orderList.length; i++){
                var params = {};
                params.omOrderId = that.orderList[i].omOrderId;
                that.omOrderList.push(that.orderList[i].omOrderId);
                //获取订单详情
                getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+that.orderList[i].omOrderId,function(data){
                    var parms1 = {};
                    parms1.shipperPartyHave = data.result.shipperPartyInfo.party;  // 发货商
                    parms1.receiptPartyHave = data.result.receiptPartyInfo.party;  // 收货商
                    parms1.orderDetailHave = data.result.order;  // 订单详情
                    if(data.result.carrierPartyInfo != null){
                        if(data.result.carrierPartyInfo.party != null){
                            parms1.OrderCarrierHave = data.result.carrierPartyInfo.party;  // 承运商
                        }else{
                            parms1.OrderCarrierHave = {};
                        }
                        if (data.result.carrierPartyInfo.imgContact != null) {
                            parms1.OrderCarrierContactHave = data.result.carrierPartyInfo.imgContact;  // 承运商联系人
                        }else {
                            parms1.OrderCarrierContactHave = {};
                        }
                        if (data.result.carrierPartyInfo.contact != null || data.result.carrierPartyInfo.eqp != null) { // existCarrier
                            that.existCarrier = true;
                        } else {
                            that.existCarrier = false;
                        }
                        if (data.result.carrierPartyInfo.contact != null) { // 司机
                            parms1.OrderCarrierDriverHave = data.result.carrierPartyInfo.contact;
                        } else {
                            parms1.OrderCarrierDriverHave = {};
                        }

                        if (data.result.carrierPartyInfo.eqp != null) { // 设备
                            parms1.OrderCarrierEqpHave = data.result.carrierPartyInfo.eqp;  // 设备
                        } else {
                            parms1.OrderCarrierEqpHave = {};
                        }
                    }else{
                        parms1.OrderCarrierHave = {};
                        parms1.OrderCarrierContactHave = {};
                        parms1.OrderCarrierDriverHave = {};
                        parms1.OrderCarrierEqpHave = {};
                    }
                    that.orderCarrierList.push(parms1);
                })
            }
        },
        chooseVehicleType(id){
            var that = this;
            for(var i = 0 ; i < that.vehicleTypeList.length;i++){
                if(that.vehicleTypeList[i].cdEqpId == id){
                    that.OrderCarrierEqp = that.vehicleTypeList[i]
                }
            }
        },
        carrierPartyList(params,id){
            var that = this;
            postRequest(cmdUrl + "/cdParty/selectCdPartySingle.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,id,function(res){
                that.receiptParty = res.result;
                var param = {},params = {};
                param.refId = that.receiptParty.cdPartyId;
                param.refTo = "cd_party";
                //   that.carrierPartyContactList(param);
                getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+id+"&isDefault=1&locationType=OTHER",function(res){
                    if(res.result.imgContactList != null){
                        that.OrderCarrierContact = res.result.imgContactList[0];  // 合作方默认联系人
                    }else{
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:"",
                            contactAddress:""
                        };
                    }
                    if(res.result.eqpList != null){
                        that.OrderCarrierEqp = res.result.eqpList[0];  // 默认设备
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

                    that.OrderCarrierDriver = { // 司机信息 （合作商——联系人、地址、设备。。。没有司机信息）
                        contactName:"",
                        contactTel:""
                    };
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
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:"",
                        contactEmail:"",
                        contactAddress:""
                    };
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
                    that.OrderCarrierDriver = {
                        contactName:"",
                        contactTel:""
                    };
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
                that.OrderCarrierContact = {
                    contactName:"",
                    contactTel:"",
                    contactEmail:"",
                    contactAddress:""
                };
                return false;
            }
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+cdContactId,function(res){
                if(res.result != null){
                    that.OrderCarrierContact = res.result;
                }else{
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:"",
                        contactEmail:"",
                        contactAddress:""
                    };
                }
            });
        },
        selectThisCarrierDriver(cdContactId){ // 根据司机select 列表所选司机 获取 司机信息
            var that = this;
            if(cdContactId == '' || cdContactId == undefined){
                that.OrderCarrierDriver = {
                    contactName:"",
                    contactTel:""
                };
                return false;
            }
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+cdContactId,function(res){
                if(res.result != null){
                    that.OrderCarrierDriver = res.result;
                }else{
                    that.OrderCarrierDriver = {
                        contactName:"",
                        contactTel:""
                    };
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
                });
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
        },
        addCarrierFun(){
            var that = this;
            if(that.OrderCarrier.partyName == undefined || that.OrderCarrier.partyName == ''){
                imitatePopup('请先选择合作商再保存！',"alert");
                return false;
            }
            if(that.OrderCarrier.partyType == undefined || that.OrderCarrier.partyType == '' || that.OrderCarrier.partyType == null){
                imitatePopup('请先选择合作商类型再保存！',"alert");
                return false;
            }
            var params = {
                refType:that.OrderCarrier.partyType,
                party:that.OrderCarrier, // 承运商基本信息
                imgContact:that.OrderCarrierContact, // 承运商联系人
                contact:that.OrderCarrierDriver, // 司机
                eqp:that.OrderCarrierEqp, // 设备
                refIdList: that.omOrderList // order id
            };
            postRequest(omsUrl + "/insert/batchOrderPartyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                // 关闭侧滑 ------ start
                closeSideslip();
                that.getSearchVal();
            });
        },
        textboxAllSelectionFun(allChecked){
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            if(allChecked == false){
                that.checkedOperaOrder = [];
                for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.checkedOperaOrder.length;
            }else{
                for(var ii = 0; ii < that.tableOrderList.length;ii++){
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii],that.checkedOperaOrder),1)
                }
                that.allChecked = false;
                that.checkedNum = that.checkedOperaOrder.length;
            }
        },
        textboxSelectionFun(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedOperaOrder.push(orderItem);
            }else{
                that.checkedOperaOrder.splice($.inArray(orderItem,that.checkedOperaOrder),1)
            }
            that.checkedNum = that.checkedOperaOrder.length;
            if(that.checkedNum == $(".reportMessages table tr.see").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
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
        /*getOverdueTime(){
            $("#overdueTime").show();
            var mySchedule = new Schedule({
                el: '#overdueTime',
                clickCb: function (y,m,d) {
                    $(".overdueTime").html(formartDate(y,m,d));
                    $("#overdueTime").hide();
                }
            });
        },*/
        publicGetOrderListFun(){
            var that = this;
            var searchFormArr = that.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum: that.currentPage,
                pageSize:that.queryPageSize
            }
            $(".reportMessages table tr td .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(omsUrl + "/query/selectSoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageInfo = res.pageInfo;
                that.pageList = [];
                that.totalPagesNum = res.pageInfo.total
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        createSendsingle(){ // 生成派送单
            var that = this;
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                params.push({
                    refId:that.checkedOperaOrder[i].omOrderId,
                    refNo:that.checkedOperaOrder[i].orderNo
                })
            }
            postRequest(omsUrl + "/generate/tjoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.result  == true){
                    that.publicGetOrderListFun();
                    imitatePopup("生成派送单成功","alert");
                }else{
                    imitatePopup("生成派送单失败","alert");
                    $(".reportMessages table tr td .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                }

            })
        },
        orderCancel(){ // 批量订单取消
            var that = this;
            if(that.addOrderCarrierHint() == 0){
                return false;
            }
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                params.push({
                    refId: that.checkedOperaOrder[i].omOrderId,
                    refNo: that.checkedOperaOrder[i].orderNo
                })
            }
            postRequest(omsUrl + "/save/batchCancelOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                imitatePopup("订单取消成功","alert");
                that.getSearchVal();
            })
        },
        orderAudit(tableOrderItem){ // 列表——单个订单审核通过
            var that = this;
            that.orderAuditStatus('0',tableOrderItem);
        },
        orderAuditStatus(type,tableOrderItem){ // 列表一个、、批量多选  订单审核 打开模态框
            var that = this;
            that.popupType = 'orderAudit';
            that.auditOrderType = type;
            that.orderDirection = {
                auditOrderRemark:"",
                direction:"0",
                refCode:"",
                refCodeTable:"0"
            };
            switch(type)
            {
                case '0': // 列表一个
                    var arrayList = [];
                    arrayList.push(tableOrderItem);
                    that.tableOrderList0 = arrayList;
                    break;
                case '1': // 批量多选
                    that.tableOrderList0 = that.checkedOperaOrder;
                    break;
                case '2': // 订单页 提交并审核通过
                    that.tableOrderList0 = [];
                    break;
            }
            $(".maskLayer1").show();
        },
        orderAuditRefCodeTable(){
            var that = this;
            that.orderDirection.refCodeTable = '1';
        },
        selectOrderPartyItemFun(orderPartyItem,index){
            var that = this;
            that.orderDirection.refCode = orderPartyItem.refNo;
            that.orderDirection.refCodeTable = '0';
        },
        orderAuditStatus0(){ // 批量 订单审核 不通过
            var that = this,params = [];
            if(that.orderDirection.direction == '1' && that.orderDirection.refCode == ''){
                imitatePopup('订单流向：其他租户，平台编码必填',"alert");
                return false;
            }
            if(that.orderDirection.direction == '2' && that.orderDirection.refCode == ''){
                imitatePopup('订单流向：其他接口，平台编码必填',"alert");
                return false;
            }
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                switch(that.orderDirection.direction)
                {
                    case '0': // 本租户
                        params.push({
                            refText:that.orderDirection.auditOrderRemark,
                            refCode:that.logininf.tenantNo,
                            refId: that.checkedOperaOrder[i].omOrderId,
                            refType: that.checkedOperaOrder[i].orderType,
                            refNo: that.checkedOperaOrder[i].orderNo,
                            state:"0",
                            refTo:'INTERNAL'
                        });
                        break;
                    case '1': // 其他租户
                        params.push({
                            refText:that.orderDirection.auditOrderRemark,
                            refCode:that.orderDirection.refCode,
                            refId: that.checkedOperaOrder[i].omOrderId,
                            refType: that.checkedOperaOrder[i].orderType,
                            refNo: that.checkedOperaOrder[i].orderNo,
                            state:"0",
                            refTo:'INTERNAL'
                        });
                        break;
                    case '2': // 其他接口
                        params.push({
                            refText:that.orderDirection.auditOrderRemark,
                            refCode:that.orderDirection.refCode,
                            refId: that.checkedOperaOrder[i].omOrderId,
                            refType: that.checkedOperaOrder[i].orderType,
                            refNo: that.checkedOperaOrder[i].orderNo,
                            state:"0",
                            refTo:'EXTERNAL'
                        });
                        break;
                }
            }
            postRequest(omsUrl + "/save/batchAuditOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                imitatePopup("提交成功","alert");
                that.getSearchVal();
                $(".maskLayer1").hide();
            })
        },
        orderAuditStatus1(){ // 列表一个、、批量多选 、、、订单页 提交并审核通过   订单审核 通过
            var that = this,params = [],orderAuditStatusNum = 0;
            switch(that.auditOrderType)
            {
                case '0': // 列表一个
                    if(that.orderDirection.direction == '1' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他租户，平台编码必填',"alert");
                        return false;
                    }
                    if(that.orderDirection.direction == '2' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他接口，平台编码必填',"alert");
                        return false;
                    }
                    var param = {
                        refText:that.orderDirection.auditOrderRemark,
                        refId: that.tableOrderList0[0].omOrderId,
                        refType: that.tableOrderList0[0].orderType,
                        refNo: that.tableOrderList0[0].orderNo,
                        state:"1"
                    };
                    switch(that.orderDirection.direction)
                    {
                        case '0': // 本租户
                            param.refCode = that.logininf.tenantNo;
                            param.refTo = 'INTERNAL';
                            break;
                        case '1': // 其他租户
                            param.refCode = that.orderDirection.refCode;
                            param.refTo = 'INTERNAL';
                            break;
                        case '2': // 其他接口
                            param.refCode = that.orderDirection.refCode;
                            param.refTo = 'EXTERNAL';
                            break;
                    }
                    postRequest(omsUrl + "/save/auditOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                        imitatePopup("审核通过","alert");
                        // 关闭侧滑 ------ start
                        closeSideslip();
                        $(".maskLayer").hide();
                        that.getSearchVal();
                    });
                    break;
                case '1': // 批量多选
                    if(that.orderDirection.direction == '1' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他租户，平台编码必填',"alert");
                        return false;
                    }
                    if(that.orderDirection.direction == '2' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他接口，平台编码必填',"alert");
                        return false;
                    }
                    for(var i = 0; i < that.checkedOperaOrder.length;i++){
                        switch(that.orderDirection.direction)
                        {
                            case '0': // 本租户
                                params.push({
                                    refText:that.orderDirection.auditOrderRemark,
                                    refCode:that.logininf.tenantNo,
                                    refId: that.checkedOperaOrder[i].omOrderId,
                                    refType: that.checkedOperaOrder[i].orderType,
                                    refNo: that.checkedOperaOrder[i].orderNo,
                                    state:"1",
                                    refTo:'INTERNAL'
                                });
                                break;
                            case '1': // 其他租户
                                params.push({
                                    refText:that.orderDirection.auditOrderRemark,
                                    refCode:that.orderDirection.refCode,
                                    refId: that.checkedOperaOrder[i].omOrderId,
                                    refType: that.checkedOperaOrder[i].orderType,
                                    refNo: that.checkedOperaOrder[i].orderNo,
                                    state:"1",
                                    refTo:'INTERNAL'
                                });
                                break;
                            case '2': // 其他接口
                                params.push({
                                    refText:that.orderDirection.auditOrderRemark,
                                    refCode:that.orderDirection.refCode,
                                    refId: that.checkedOperaOrder[i].omOrderId,
                                    refType: that.checkedOperaOrder[i].orderType,
                                    refNo: that.checkedOperaOrder[i].orderNo,
                                    state:"1",
                                    refTo:'EXTERNAL'
                                });
                                break;
                        }
                        if(that.checkedOperaOrder[i].auditStatus == 1){
                            orderAuditStatusNum ++;
                        }
                    }
                    if(orderAuditStatusNum > 0){
                        var r = confirm("所选订单中包括已审核订单，继续审核通过将会重复生成配送[DO]或仓库[WO]订单，是否继续？");
                        if(r == true){
                            postRequest(omsUrl + "/save/batchAuditOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                                imitatePopup("提交成功","alert");
                                that.getSearchVal();
                                $(".maskLayer1").hide();
                            });
                        }
                    }
                    break;
                case '2': // 订单页 提交并审核通过
                    if(that.orderDirection.direction == '1' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他租户，平台编码必填',"alert");
                        return false;
                    }
                    if(that.orderDirection.direction == '2' && that.orderDirection.refCode == ''){
                        imitatePopup('订单流向：其他接口，平台编码必填',"alert");
                        return false;
                    }
                    var param = {
                        refText:that.orderDirection.auditOrderRemark,
                        refId: that.orderDetail.omOrderId,
                        refType: that.orderDetail.orderType,
                        refNo: that.orderDetail.orderNo,
                        state:"1"
                    };
                    switch(that.orderDirection.direction)
                    {
                        case '0': // 本租户
                            param.refCode = that.logininf.tenantNo;
                            param.refTo = 'INTERNAL';
                            break;
                        case '1': // 其他租户
                            param.refCode = that.orderDirection.refCode;
                            param.refTo = 'INTERNAL';
                            break;
                        case '2': // 其他接口
                            param.refCode = that.orderDirection.refCode;
                            param.refTo = 'EXTERNAL';
                            break;
                    }
                    if(that.tableOrderItemAuditStatus == 1){
                        var r = confirm("该订单已审核，继续审核通过将会重复生成配送[DO]或仓库[WO]订单，是否继续？");
                        if(r == true){
                            postRequest(omsUrl + "/save/auditOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                                imitatePopup("提交并审核通过","alert");
                                // 关闭侧滑 ------ start
                                closeSideslip();
                                that.getSearchVal();
                                $(".maskLayer1").hide();
                            });
                        }
                    }else{
                        postRequest(omsUrl + "/save/auditOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                            imitatePopup("提交并审核通过","alert");
                            // 关闭侧滑 ------ start
                            closeSideslip();
                            that.getSearchVal();
                            $(".maskLayer1").hide();
                        });
                    }
                    break;
            }
        },
        orderToActivate(){ // 订单激活
            var that = this;
            if(that.addOrderCarrierHint() == 0){
                return false;
            }
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                params.push({
                    refNo:that.checkedOperaOrder[i].orderNo,
                    refId:that.checkedOperaOrder[i].omOrderId,
                    state:1
                })
            }
            postRequest(omsUrl + "/save/batchSubmitOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                imitatePopup("订单激活成功","alert");
                that.publicGetOrderListFun();
            })
        },
        orderBatchIssue(){ // 批量 订单下发
            var that = this;
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                params.push({
                    omOrderId:that.checkedOperaOrder[i].omOrderId,
                    orderNo:that.checkedOperaOrder[i].orderNo
                })
            }
            postRequest(omsUrl + "/save/sendOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.publicGetOrderListFun();
                imitatePopup("订单下发成功","alert");
            })
        },
        orderIssue(item){ // 列表单个 订单下发
            var params = [];
            var that = this;
            params.push({
                omOrderId:item.omOrderId,
                orderNo:item.orderNo
            })
            postRequest(omsUrl + "/save/sendOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.publicGetOrderListFun();
                imitatePopup("订单下发成功","alert");
            })
        },
        selectEqpFun(id){
            var that = this;
            var params = {
                cdEqpId:id
            }
            postRequest(omsUrl + "/cdEqp/selectOneEqp.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.OrderCarrierEqp = res.result;
            })
        },
        orderTypeFun(type){
            if(type == "DO"){
                this.isShippingOrder = true;
            }else{
                this.isShippingOrder = false;
            }
        },
        addOrderDetails(template){
            this.clickBtnType = "add";
            this.uploadFilesType = '0';
            this.templateTitle = template;
            this.isDisable = false;
            initSelectData(this);
            this.OrderCarrierContact = {
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:""
            };
            this.packageGoodsList = [];
            this.temporaryGoods = [];
            this.temporaryGoodsId = [];
            this.transitGoodsList = [];
            this.transitGoodsListId = [];
            this.showPackageList = [];
            $(".completionTime").html('要求送达时间');
            // $(".overdueTime").html('预约提货时间');
            this.resetAddressParamFun('1');
            this.orderDetail.orderNature = this.selectListData.orderNatureList[0].code; // 默认特性
            this.orderDetail.qtyUnit = this.selectListData.qtyUnitList[0].code; // 总数量默认单位
            this.orderDetail.weightUnit = this.selectListData.weightUnitList[0].code; // 总重量默认单位
            this.orderDetail.volumeUnit = this.selectListData.volumeUnitList[0].code; // 总体积默认单位
            this.orderDetail.currency = this.selectListData.currencyList[0].code; // 总金额默认单位
            var that = this;
            getRequest(cmdUrl + "/get/partyDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&partyCode="+that.logininf.userPartyNo+"&isDefault=1",function(res){
                if(res.result.party != null && res.result.party != ''){
                    that.shipperParty = res.result.party;
                }
                if(res.result.contactList != null && res.result.contactList != ''){
                    that.shipperPartyContact = res.result.contactList[0];
                    that.shipperPartyLocationContact = that.shipperPartyContact;
                }
                if(res.result.locationList != null && res.result.locationList != ''){
                    that.shipperPartyLocation = res.result.locationList[0];
                }
            })
        },
        getOrderDetails(template,order){
            this.clickBtnType = "detail";
            this.templateTitle = template;
            var that = this;
            that.isDisable = true;
            $("#completionTime").hide();
            // $("#overdueTime").hide();

            that.resetAddressParamFun('0'); // 重置 改变address 参数
            // 赋值 改变address 参数
            that.getAddressParamFun('countryCode',order,order.countryCode);
            that.getAddressParamFun('provinceCode',order,order.provinceCode);
            that.getAddressParamFun('cityCode',order,order.cityCode);
            that.getAddressParamFun('districtCode',order,order.districtCode);

            getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.orderStatus.activeStatus != '1' && data.result.orderStatus.activeStatus.auditStatus != '1'){
                    that.activeStatusShow = '1';
                }else{
                    that.activeStatusShow = '2';
                }
                // 订单详情
                if(data.result.order != null){
                    that.orderDetail = data.result.order;
                    that.orderDetail.completeTime = timestampToTime2(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime2(that.orderDetail.expireTime);
                    $(".completionTime").html(that.orderDetail.completeTime);
                    // $(".overdueTime").html(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime2(null);
                    that.orderDetail.expireTime = timestampToTime2(null);
                    $(".completionTime").html('');
                    // $(".overdueTime").html('');
                }
                if(that.orderDetail.orderType != undefined){
                    if(that.orderDetail.orderType == "DO"){
                        that.isShippingOrder = true;
                    }else{
                        that.isShippingOrder = false;
                    }
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
                    if(data.result.carrierPartyInfo.drvContactInfo != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.drvContactInfo.contact;
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.drvContactInfo.eqp;
                    }else{
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
                    }
                    if(data.result.carrierPartyInfo.locationInfo != null){
                        that.OrderCarrierLocation = data.result.carrierPartyInfo.locationInfo;
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
                    that.packageGoodsList = data.result.orderItemInfoList;
                    setTimeout(function(){
                        for(var i=0;i<data.result.orderItemInfoList.length;i++){
                            $(".detailGoodsLotNo").eq(i).html(timestampToTime(data.result.orderItemInfoList[i].orderItem.lotNo));
                        }
                    },300)
                }else {
                    that.packageGoodsList = [];
                }
            })
        },
        changeOrderDetails(template,order){
            this.clickBtnType = "edit";
            this.uploadFilesType = '1';
            this.templateTitle = template;
            this.orderOmOrderId = order.omOrderId;
            this.tableOrderItemAuditStatus = order.auditStatus;
            var that = this;
            that.isDisable = false;
            $("#completionTime").hide();
            // $("#overdueTime").hide();

            that.resetAddressParamFun('0'); // 重置 改变address 参数
            // 赋值 改变address 参数
            that.getAddressParamFun('countryCode',order,order.countryCode);
            that.getAddressParamFun('provinceCode',order,order.provinceCode);
            that.getAddressParamFun('cityCode',order,order.cityCode);
            that.getAddressParamFun('districtCode',order,order.districtCode);

            getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.orderStatus.activeStatus != '1' && data.result.orderStatus.activeStatus.auditStatus != '1'){
                    that.activeStatusShow = '1';
                }else{
                    that.activeStatusShow = '2';
                }
                // 订单详情
                if(data.result.order != null){
                    that.orderDetail = data.result.order;
                    that.orderDetail.completeTime = timestampToTime2(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime2(that.orderDetail.expireTime);
                    $(".completionTime").html(that.orderDetail.completeTime);
                    // $(".overdueTime").html(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime2(null);
                    that.orderDetail.expireTime = timestampToTime2(null);
                    $(".completionTime").html('');
                    // $(".overdueTime").html('');
                }
                if(that.orderDetail.orderType != undefined){
                    if(that.orderDetail.orderType == "DO"){
                        that.isShippingOrder = true;
                    }else{
                        that.isShippingOrder = false;
                    }
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
                    if(data.result.carrierPartyInfo.drvContactInfo != null){
                        that.OrderCarrierDriver = data.result.carrierPartyInfo.drvContactInfo.contact;
                        that.OrderCarrierEqp = data.result.carrierPartyInfo.drvContactInfo.eqp;
                    }else{
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
                    }
                    if(data.result.carrierPartyInfo.locationInfo != null){
                        that.OrderCarrierLocation = data.result.carrierPartyInfo.locationInfo;
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
                    that.packageGoodsList = data.result.orderItemInfoList;
                }else {
                    that.packageGoodsList = [];
                }
            })
        },
        // 列表单个 激活（ = 订单新增、修改—提交 ）
        activeStatusFun0(item){
            var that = this;
            var r = confirm("确定改变该订单激活状态为激活？");
            if (r==true){
                getRequest(omsUrl + "/save/submitOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&omOrderId="+item.omOrderId,function(data){
                    that.getSearchVal();
                    imitatePopup("订单激活成功","alert");
                })
            }
        },
        //列表单个 取消激活
        activeStatusFun1(item){
            var that = this;
            var r = confirm("确定改变该订单激活状态为冻结？");
            if (r==true){
                var params = {
                    refId: item.omOrderId,
                    refNo: item.orderNo
                };
                postRequest(omsUrl + "/save/cancelOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    that.getSearchVal();
                    imitatePopup("订单取消成功","alert");
                })
            }
        },
        //订单内页 取消激活
        activeStatusFun2(){
            var that = this;
            if(that.orderDetail.omOrderId == undefined || that.orderDetail.omOrderId == ""){
                imitatePopup('请先保存订单',"alert");
                return false;
            }
            var r = confirm("确定改变该订单激活状态为冻结？");
            if (r==true){
                var params = {
                    refId: that.orderDetail.omOrderId,
                    refNo: that.orderDetail.orderNo
                };
                postRequest(omsUrl + "/save/cancelOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    // 关闭侧滑 ------ start
                    closeSideslip();
                    that.getSearchVal();
                    imitatePopup("订单取消成功","alert");
                })
            }
        },
        getOrderCode(codeVal){
            $("#qrcode").html("");
            //获取二维码 条形码
            //	console.log(codeVal);
            //    this.orderCodeItem = codeVal;
            $("#barcode").barcode(codeVal.orderNo,"code93",{barWidth:2, barHeight:30});
            $("#qrcode").qrcode({
                render : "canvas",
                text : codeVal.orderNo,
                width : "200",
                height : "200",
                background : "#ffffff",
                foreground : "#000000"
            });
        },

        // 点击“订单附件” ---------------------------------------------------------------------------- start 190227
        getOrderReceipt(template,receiptVal){  // 点击“订单附件”按钮
            var that = this;
            that.templateTitle = template;
            that.uploadFilesType = '2';
            that.orderReceiptItem = receiptVal;
            that.getOrderCode(receiptVal);
            that.getReceiptImgList(receiptVal.omOrderId);
            that.getReceiptFilesList(receiptVal.omOrderId);
        },
        getReceiptImgList(omOrderId){ // 获取图片列表
            var that = this;
            that.receiptImgList = [];
            that.srcImgList = [];
            getRequest(omsUrl + "/select/orderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+omOrderId,function(res){
                for(var i = 0 ; i < res.result.length; i++){
                    var param = {
                        src:ImgWebsite + res.result[i].extValue,
                        omExtId:res.result[i].omExtId
                    };
                    that.receiptImgList.push(param);
                }
            })
        },
        getReceiptFilesList(omOrderId){ // 获取订单附件列表
            var that = this;
            that.receiptFilesList = [];
            that.srcFileList = [];
            getRequest(omsUrl + "/select/orderAnnexObjFiles.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+omOrderId,function(res){
                var newArray = [];
                for(var i = 0 ; i < res.result.length; i++){
                    var string0 = res.result[i].extValue.split('/'),extValue = '';
                    for(var s = 0 ; s < string0.length; s++){
                        if(isContains(string0[s], '.')){
                            extValue = string0[s];
                        }
                    }
                    var param = {
                        src:ImgWebsite + res.result[i].extValue,
                        extValue:extValue
                    };
                    if(isContains(res.result[i].extValue, 'rar')){
                        param.picType = 'rar';
                    }else{
                        if(isContains(res.result[i].extValue, 'zip')){
                            param.picType = 'zip';
                        }
                    }
                    newArray.push(param);
                }
                that.receiptFilesList = newArray;
            })
        },
        downloadFile(){  // 下载订单文件
            var that = this;
            clearInterval(that.begin);
            if(that.receiptFilesList != null && that.receiptFilesList != []){
                for(var j=0;j<that.receiptFilesList.length;j++){
                    if(that.receiptFilesList[j] != null){
                        that.srcFileList.push(that.receiptFilesList[j].src);
                    }
                }
            }
            that.downloadFileExecute();
        },
        downloadFileExecute(){
            var that = this;
            clearInterval(that.begin);
            if(that.srcFileList.length>0){
                window.location.href = that.srcFileList[0]
                $(".downloadFile").attr("download",that.srcFileList.length)
                that.srcFileList.splice(0,1);
                that.begin = setInterval(function(){
                    that.downloadFileExecute();
                },300)
            }
        },
        downloadFileItem(index){  // 单个下载订单文件
            var that = this;
            if(that.receiptFilesList != null && that.receiptFilesList != []){
                for(var j=0;j<that.receiptFilesList.length;j++){
                    if(that.receiptFilesList[j] != null){
                        that.srcFileList.push(that.receiptFilesList[j].src);
                    }
                }
                window.location.href = that.srcFileList[index];
            }
        },
        // 上传图片 —— 回单
        clickUploadOrderImg(){
            $('#imgfiles').click();
        },
        uploadOrderImgFun(){
            var that = this;
            that.clearShow2 = false;
            uploadImgUploadRequest(omsUrl + '/upload/orderUploadReceiptImg.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderId='+that.orderReceiptItem.omOrderId,function(res){
                if(res != null){
                    if(res.result != null){
                        if(res.result.extList != null){
                            that.receiptImgList = [];
                            for(var i = 0 ; i < res.result.extList.length; i++){
                                var param = {
                                    src:ImgWebsite + res.result.extList[i].extValue,
                                    omExtId:res.result.extList[i].omExtId
                                };
                                that.receiptImgList.push(param);
                            }
                        }
                    }
                }
                that.uploadOrderImgSuc();
            });
        },
        uploadOrderImgSuc(){
            var that = this;
            that.clearShow2 = true;
            $(".ajax-load-pupup").remove();
        },

        // 上传附件
        clickUploadOrderFiles2(){ // 上传附件 类型：2 - 上传订单附件（上传-上传附件）
            $('#files').click();
        },
        clickUploadOrderFiles01(){ // 上传附件 类型：0 - 上传订单附件（订单新增），1 - 上传订单附件（订单修改）
            var that = this;
            /*if(that.orderDetail.omOrderId == undefined || that.orderDetail.omOrderId == ""){
                alert('请先保存订单');
                return false;
            }*/
            that.getOrderCode(that.orderDetail);
            that.orderReceiptItem = that.orderDetail;
            that.receiptImgList = [];
            getRequest(omsUrl + "/select/orderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+that.orderDetail.omOrderId,function(res){
                for(var i = 0 ; i < res.result.length; i++){
                    var param = {
                        src:ImgWebsite + res.result[i].extValue,
                        omExtId:res.result[i].omExtId
                    };
                    that.receiptImgList.push(param);
                }
                that.receiptFilesList = [];
                getRequest(omsUrl + "/select/orderAnnexObjFiles.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+that.orderDetail.omOrderId,function(res){
                    var newArray = [];
                    for(var i = 0 ; i < res.result.length; i++){
                        var string0 = res.result[i].extValue.split('/'),extValue = '';
                        for(var s = 0 ; s < string0.length; s++){
                            if(isContains(string0[s], '.')){
                                extValue = string0[s];
                            }
                        }
                        var param = {
                            src:ImgWebsite + res.result[i].extValue,
                            extValue:extValue
                        };
                        if(isContains(res.result[i].extValue, 'rar')){
                            param.picType = 'rar';
                        }else{
                            if(isContains(res.result[i].extValue, 'zip')){
                                param.picType = 'zip';
                            }
                        }
                        newArray.push(param);
                    }
                    that.receiptFilesList = newArray;
                    $('#files').click();
                })
            });
        },
        uploadOrderFilesFun(){
            var that = this; // 上传附件 类型：0 - 上传订单附件（订单新增），1 - 上传订单附件（订单修改），2 - 上传订单附件（上传-上传附件），3 - 上传商品附件（订单新增），4 - 上传商品附件（订单修改）
            that.clearShow1 = false;
            switch(that.uploadFilesType)
            {
                case '0':
                    filesUploadRequest(omsUrl + '/upload/orderUploadFiles.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderId='+that.orderDetail.omOrderId,function(res){
                        that.uploadOrderFilesSuc();
                    });
                    break;
                case '1':
                    filesUploadRequest(omsUrl + '/upload/orderUploadFiles.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderId='+that.orderDetail.omOrderId,function(res){
                        that.uploadOrderFilesSuc();
                    });
                    break;
                case '2':
                    filesUploadRequest(omsUrl + '/upload/orderUploadFiles.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderId='+that.orderReceiptItem.omOrderId,function(res){
                        that.uploadOrderFilesSuc();
                    });
                    break;
            }
        },
        uploadOrderFilesSuc(){
            var that = this;
            that.getReceiptFilesList(that.orderReceiptItem.omOrderId);
            that.clearShow1 = true;
            $(".ajax-load-pupup").remove();
        },

        // 删除回单
        delReceiptImgItemFun(omExtId,index){
            var that = this;
            var r = confirm("确定删除该回单？");
            if (r==true){
                getRequest(omsUrl + "/delete/orderExtById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&extId="+omExtId,function(res){
                    that.receiptImgList.splice(index, 1);
                })
            }
        },
        // 放大回单图,商品图片
        magnifyReceiptImage(index,type){
            var that = this;
            $(".maskLayer2").show();
            that.indexImg = index;
            that.magnifyImgType = type;
            switch(type)
            {
                case 'RecImg':
                    that.magnifyImgSrc = that.receiptImgList[that.indexImg].src;
                    break;
                case 'comImg':
                    that.magnifyImgSrc = that.orderItemImgList[that.indexImg];
                    break;
            }
            $(".magnifyImg").fadeIn(550);
        },
        // 关闭放大回单图,商品图片窗口
        closeMagnifyReceiptImage(){
            var that = this;
            $(".maskLayer2").hide();
            that.magnifyImgSrc = "";
            $(".magnifyImg").css("display","none");
        },
        // 向左移动图片
        moveLeftReceiptImage(){
            var that = this;
            if(that.indexImg > 0){
                $(".magnifyImg").css("display","none");
                that.indexImg = that.indexImg-1;
                if(that.magnifyImgType == 'RecImg'){
                    that.magnifyReceiptImage(that.indexImg,'RecImg');
                }else if(that.magnifyImgType == 'comImg'){
                    that.magnifyReceiptImage(that.indexImg,'comImg');
                }
            }else{
                return false;
            }
        },
        // 向右移动图片
        moveRightReceiptImage(){
            var that = this;
            if(that.magnifyImgType == 'RecImg'){
                if(that.indexImg < that.receiptImgList.length-1){
                    $(".magnifyImg").css("display","none");
                    that.indexImg = that.indexImg+1;
                    that.magnifyReceiptImage(that.indexImg,'RecImg');
                }else{
                    return false;
                }
            }else if(that.magnifyImgType == 'comImg'){
                if(that.indexImg < that.orderItemImgList.length-1){
                    $(".magnifyImg").css("display","none");
                    that.indexImg = that.indexImg+1;
                    that.magnifyReceiptImage(that.indexImg,'comImg');
                }else{
                    return false;
                }
            }
        },

        // 点击“订单附件” ---------------------------------------------------------------------------- end 190227

        // 点击“商品上传” ---------------------------------------------------------------------------- start 190227
        uploadPackageGoodsListShow(item){ // 点击“新增——商品附件”
            var that = this;
            that.uploadFilesOrderItemId = item.wmItemInventoryId;
            // that.uploadFilesOrderItemId = that.temporaryGoods[index].orderItem.omOrderItemId;
            if(that.uploadFilesOrderItemId == undefined || that.uploadFilesOrderItemId == ""){
                imitatePopup('请先保存该商品',"alert");
                return false;
            }
            $(".maskLayer1").show();
            that.popupType = 'uploadPackageGoods';
            that.getOrderItemImgList(that.uploadFilesOrderItemId);
            that.getOrderItemFilesList(that.uploadFilesOrderItemId);
        },
        downloadPackageGoodsListShow(index){  //  点击“详情——商品附件”
            var that = this;
            that.uploadFilesOrderItemId = that.packageGoodsList[index].orderItem.omOrderItemId;
            if(that.uploadFilesOrderItemId == undefined || that.uploadFilesOrderItemId == ""){
                imitatePopup("暂无商品附件！","alert")
                return false;
            }
            $(".maskLayer1").show();
            that.popupType = 'uploadPackageGoods';
            that.getOrderItemImgList(that.uploadFilesOrderItemId);
            that.getOrderItemFilesList(that.uploadFilesOrderItemId);
        },
        getOrderItemImgList(omOrderItemId){ // 查询商品已有图片列表
            var that = this;
            that.orderItemImgList = [];
            that.downorderItemImgList = [];
            getRequest(omsUrl + "/select/orderItemObjImg.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderItemId="+omOrderItemId,function(res){
                for(var i = 0 ; i < res.result.length; i++){
                    that.orderItemImgList.push(ImgWebsite + res.result[i].extValue);
                }
            })
        },
        getOrderItemFilesList(omOrderItemId){ // 查询商品已有附件片列表
            var that = this;
            that.orderItemFilesList = [];
            that.downorderItemFileList = [];
            getRequest(omsUrl + "/select/orderItemAnnexObjFiles.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderItemId="+omOrderItemId,function(res){
                var newArray = [];
                for(var i = 0 ; i < res.result.length; i++){
                    var string0 = res.result[i].extValue.split('/'),extValue = '';
                    for(var s = 0 ; s < string0.length; s++){
                        if(isContains(string0[s], '.')){
                            extValue = string0[s];
                        }
                    }
                    var param = {
                        src:ImgWebsite + res.result[i].extValue,
                        extValue:extValue
                    };
                    if(isContains(res.result[i].extValue, 'rar')){
                        param.picType = 'rar';
                    }else{
                        if(isContains(res.result[i].extValue, 'zip')){
                            param.picType = 'zip';
                        }
                    }
                    newArray.push(param);
                }
                that.orderItemFilesList = newArray;
            })
        },
        // 上传图片 —— 商品图片
        clickUploadOrderItemImg(){
            $('#itemImgfiles').click();
        },
        uploadOrderItemImgFun(){
            var that = this;
            that.clearShow3 = false;
            itemUploadImgUploadRequest(omsUrl + '/upload/orderItemUploadImg.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderItemId='+that.uploadFilesOrderItemId,function(res){
                if(res != null){
                    if(res.result != null){
                        if(res.result.extList != null){
                            that.orderItemImgList = [];
                            for(var i = 0 ; i < res.result.extList.length; i++){
                                that.orderItemImgList.push(ImgWebsite + res.result.extList[i].extValue);
                            }
                        }
                    }
                }
                that.uploadOrderItemImgSuc();
            });
        },
        uploadOrderItemImgSuc(){
            var that = this;
            that.clearShow3 = true;
            $(".ajax-load-pupup").remove();
        },

        // 上传图片 —— 商品附件
        clickUploadOrderItemFiles(){
            $('#itemFiles').click();
        },
        uploadOrderItemFilesFun(){
            var that = this;
            that.clearShow4 = false;
            itemFilesUploadRequest(omsUrl + '/upload/orderItemUploadFiles.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderItemId='+that.uploadFilesOrderItemId,function(res){
                that.getOrderItemFilesList(that.uploadFilesOrderItemId);
                that.uploadOrderItemFilesSuc();
            });
        },
        uploadOrderItemFilesSuc(){
            var that = this;
            that.clearShow4 = true;
            $(".ajax-load-pupup").remove();
        },
        // 下载文件 —— 商品附件
        downloadOrderItemFile(){
            var that = this;
            if(that.orderItemFilesList != null && that.orderItemFilesList != []){
                for(var j=0;j<that.orderItemFilesList.length;j++){
                    if(that.orderItemFilesList[j] != null){
                        that.downorderItemFileList.push(that.orderItemFilesList[j].src);
                    }
                }
            }
            that.downloadOrderItemFileExecute();
        },
        downloadOrderItemFileExecute(){
            var that = this;
            clearInterval(that.baginFile);
            if(that.downorderItemFileList.length>0){
                window.location.href = that.downorderItemFileList[0];
                $(".downloadComFile").attr("download",that.downorderItemFileList.length);
                that.downorderItemFileList.splice(0,1);
                that.baginFile = setInterval(function(){
                    that.downloadOrderItemFileExecute();
                },300)
            }
        },
        downloadComFileItem(index){  // 单个下载商品文件
            var that = this;
            if(that.orderItemFilesList != null && that.orderItemFilesList != []){
                for(var j=0;j<that.orderItemFilesList.length;j++){
                    if(that.orderItemFilesList[j] != null){
                        that.downorderItemFileList.push(that.orderItemFilesList[j].src);
                    }
                }
                window.location.href = that.downorderItemFileList[index];
            }
        },

        // 点击“商品上传” ---------------------------------------------------------------------------- end 190227

        // 废除 ---------------------------------------------------------------------------- start
        uploadImgFun(){
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadImg").prop("files")[0];  //获取文件
            var that = this;
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function(evt) {
                    that.uploadImgList.push(evt.target.result);
                    //console.log(that.uploadImgList);
                    //console.log(evt.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                imitatePopup('上传失败，请重新上传！',"alert");
            }
        },
        uploadReceipt(orderno){ // 回单上传
            var that = this;
            var imgListArr = [];
            if(this.uploadImgList == 0){
                imitatePopup("请至少上传一张图片","alert");
                return false;
            }
            for(var i = 0; i < this.uploadImgList.length;i++){
                imgListArr.push(this.uploadImgList[i].split(",")[1]);
            }
            var receiptArr = {
                imgTypeColumn:"order_receipt",
                refTo:"om_order",
                refNo:orderno,
                imgBase64List:imgListArr
            }
            postRequest(omsUrl + "/save/OrderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,receiptArr,function(res){
                imitatePopup("回单上传成功","alert");
                for(var i = 0;i < res.result.imgList.length;i++){
                    that.receiptImgList.push(ImgWebsite + res.result.imgList[i]);
                }
                that.uploadImgList = [];
            })
        },
        // 废除 ---------------------------------------------------------------------------- end

        getLogisticsInfo(template,orderInfo){ // 物流信息
            var that = this;
            that.templateTitle = template;
            var orderinf = {
                refId:orderInfo.omOrderId,
                refTo:"om_order"
            }
            postRequest(omsUrl + "/query/ActInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderinf,function(data){
                if(data.result.actCurrent != null){
                    that.actCurrentInfo = data.result.actCurrent;
                }else{
                    that.actCurrentInfo = {
                        actCode:'',
                        createTime:null,
                        remark:''
                    };
                }
                if(data.result.actCurrent != null){
                    that.actListInfo = data.result.actList;
                }else{
                    that.actListInfo = {};
                }

                var waypointsArr = [];
                if(data.result.actList != null){
                    for(var i = 0; i < data.result.actList.length;i++){
                        if(data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == ""){

                        }else{
                            waypointsArr.push([data.result.actList[i].latLng.split(",")[0],data.result.actList[i].latLng.split(",")[1]]);
                        }
                    }
                }
                getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+orderInfo.omOrderId,function(res){
                    that.orderLogisticsInfo = res.result.order;
                    if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null){
                        that.orderLogisticsInfo["sfrAddress"] = res.result.shipperPartyInfo.location.address;
                    }
                    if(res.result.receiptPartyInfo != null){
                        that.orderLogisticsInfo["stoAddress"] = res.result.receiptPartyInfo.location.address;
                    }

                    if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null && res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.latLng != null){
                        mapFunction(res.result.receiptPartyInfo,res.result.shipperPartyInfo,waypointsArr);
                    }else{
                        mapFunction();
                    }
                })
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
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            $(".reportMessages table .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            that.allChecked = false;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            //获取订单列表
            postRequest(omsUrl + "/query/selectSoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })

            //新增商品列表--翻页
            var params = that.selectGoods;
            params.pageInfo = {
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".checkProduct").prop("checked",false);
            $(".maskLayer .popup .popupCon table tbody .productListTr").css("background","transparent");
            $(".maskLayer .popup .popupCon table tbody .productListTr").find('td').css("color","#333");
            postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.itemList = res.result;
                for(var q=0;q<that.itemList.length;q++){
                    $(".popupProDateTime").eq(q).html(timestampToTime(that.itemList[q].proDateTime));
                    for(var m=0;m<that.temporaryGoods.length;m++){
                        if(that.itemList[q].wmItemInventoryId == that.temporaryGoods[m].wmItemInventoryId){
                            $(".checkProduct").eq(q).prop("checked",true);
                            $(".maskLayer .popup .popupCon table tbody .productListTr").eq(q).css("background","#00528b");
                            $(".maskLayer .popup .popupCon table tbody .productListTr").eq(q).find('td').css("color","#fff");
                        }
                    }
                }
                that.pageAllList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageAllList[i] = i + 1;
                }
                that.totaAlllList = [];
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totaAlllList[n] = n + 1;
                }
            })
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                orderFrom:"",
                orderTo:"",
                completeStatus:"",
                sendStatus:"",
                expireStatus:"",
                exceptionStatus:"",
                activeStatus:"1",
                payStatus:"",
                auditStatus:"",
                actCode:"",
                orderType:""
            };
        },
        getSearchVal(){ // 订单搜索
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
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            }
            $(".reportMessages table .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            that.allChecked = false;
            //获取订单列表
            postRequest(omsUrl + "/query/selectSoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.pageList = [];
                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })

            //选择商品搜索
            var params = that.selectGoods;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            $(".checkProduct").prop("checked",false);
            $(".maskLayer .popup .popupCon table tbody .productListTr").css("background","transparent");
            $(".maskLayer .popup .popupCon table tbody .productListTr").find('td').css("color","#333");
            postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.itemList = res.result;
                setTimeout(function(){
                    for(var q=0;q<that.itemList.length;q++){
                        $(".popupProDateTime").eq(q).html(timestampToTime(that.itemList[q].proDateTime));
                        for(var m=0;m<that.temporaryGoods.length;m++){
                            if(that.itemList[q].wmItemInventoryId == that.temporaryGoods[m].wmItemInventoryId){
                                $(".checkProduct").eq(q).prop("checked",true);
                                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(q).css("background","#00528b");
                                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(q).find('td').css("color","#fff");
                            }
                        }
                    }
                },200)
                that.showItemList = '1';
                that.currentPage = 1;
                that.pageAllList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageAllList[i] = i + 1;
                }
                that.totaAlllList = [];
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totaAlllList[n] = n + 1;
                }
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
            })
        },
        getContactInfo(id){
            var that = this;
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+id,function(data){
                that.shipperPartyLocationContact = data.result;
            })
        },
        changeShipperPartyLocationContact(id){
            var that = this;
            $.each(that.shipperPartyLocationContactList, function (indexs, val) {
                if (val.cdContactId == id) {
                    that.shipperPartyLocationContact = val;
                }
            });
        },
        getContactInfo1(id){
            var that = this;
            getRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+id,function(data){
                that.receiptPartyLocationContact = data.result;
            })
        },
        shipperPartyList(selectList,cdpartyID){
            //选择发货商
            var that = this;
            var currentUmUserId = "";
            for(var i = 0 ; i < selectList.length; i++){
                if(selectList[i].cdPartyId == cdpartyID){
                    currentUmUserId = selectList[i].umUserId
                }
            }
            var params = {
                refId:cdpartyID,
                refTo:"cd_party"
            }
            postRequest(cmdUrl + "/cdParty/selectCdPartySingle.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,cdpartyID,function(data){
                // 根据所选的发货合作方查询该发货合作方的信息
                that.shipperParty = data.result;
                postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    // 获取合作方联系人 select 列表
                    that.shipperPartyContactList = data.result;
                })

                postRequest(cmdUrl + "/cdLocation/getCdLocationList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    // 获取服务点 select 列表
                    that.shipperPartyLocationList = data.result;
                    var params1 = {
                        refId: data.result[0].cdLocationId,
                        refTo: "cd_location"
                    }
                    postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(data){
                        //获取发货联系人select列表
                        that.shipperPartyLocationContactList = data.result;
                    })
                })
                getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+cdpartyID+"&isDefault=1&locationType=SFR",function(data){
                    // 根据所选的合作商获取默认信息
                    that.shipperPartyContact = data.result.imgContactList[0];  // 紧急联系人
                    if(data.result.locationList == "" || data.result.locationList == null || data.result.locationList.length == 0){
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
                        //that.shipperPartyLocationList = {};
                    }else{
                        //that.shipperPartyLocationList = data.result.locationList;   // 服务点select列表
                        that.shipperPartyLocation = data.result.locationList[0];   // 默认服务点
                        //	console.log(that.shipperPartyLocation);
                    }

                })

                getRequest(cmdUrl + "/cdLocation/selectCdLocationById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdLocationId="+currentUmUserId,function(data){
                    // 根据所选的服务点获取该服务点信息（地址、地址联系人）
                    that.shipperPartyContact = data.result;
                })
            });
        },
        receiptPartyList(selectList,cdpartyID){
            //选择发货商
            var that = this;
            var currentUmUserId = "";
            var params = {
                refId:cdpartyID,
                refTo:"cd_party"
            }
            postRequest(cmdUrl + "/cdParty/selectCdPartySingle.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,cdpartyID,function(data){
                // 根据所选的发货合作方查询该发货合作方的信息
                that.receiptParty = data.result;

                postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    // 获取合作方联系人 select 列表
                    that.receiptPartyContactList = data.result;
                })

                postRequest(cmdUrl + "/cdLocation/getCdLocationList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                    // 获取服务点 select 列表
                    that.receiptPartyLocationList = data.result;
                    var params1 = {
                        refId: data.result[0].cdLocationId,
                        refTo: "cd_location"
                    }
                    postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(data){
                        //获取发货联系人select列表
                        that.receiptPartyLocationContactList = data.result;
                    })
                })
                getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+cdpartyID+"&isDefault=1&locationType=STO",function(data){
                    // 根据所选的合作商获取默认信息
                    that.receiptPartyContact = data.result.imgContactList[0];  // 紧急联系人
                    if(data.result.locationList == "" || data.result.locationList == null || data.result.locationList.length == 0){
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
                    }else{
                        that.receiptPartyLocation = data.result.locationList[0];   // 默认服务点
                    }
                })
            });
        },
        getServicePointInf(id){
            var that = this;
            getRequest(cmdUrl + "/cdLocation/selectCdLocationById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdLocationId="+id,function(data){
                // 根据所选的服务点获取该服务点信息（地址、地址联系人）
                that.receiptPartyLocation = data.result;   // 默认服务点
            })
            var params1 = {
                refId: id,
                refTo: "cd_location"
            }
            postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(data){
                //获取发货联系人select列表
                that.receiptPartyLocationContactList = data.result;
            })
        },
        OrderCarrierPartyList(selectData,cdpartyID){
            var that = this;
            that.OrderCarrierContactList = [];
            that.OrderCarrierContact = {
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:""
            };
            that.OrderCarrierDriverList = [];
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
            postRequest(cmdUrl + "/cdParty/selectCdPartySingle.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,cdpartyID,function(data){

                that.OrderCarrier = data.result;
                var param = {};
                param.refId = that.OrderCarrier.cdPartyId;
                param.refTo = "cd_party";
                //return false;
                postRequest(cmdUrl + "/cdContact/selectCdContactList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                    if(data.result != null){
                        that.OrderCarrierContactList = data.result;
                        that.OrderCarrierContact = data.result[0];
                        that.OrderCarrierDriverList = data.result;
                        that.OrderCarrierDriver = data.result[0];
                    }else{
                        that.OrderCarrierContactList = [];
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:"",
                            contactEmail:"",
                            contactAddress:""
                        };
                        that.OrderCarrierDriverList = [];
                        that.OrderCarrierDriver = {
                            contactName:"",
                            contactTel:""
                        };
                    }
                })
                postRequest(cmdUrl + "/cdEqp/selectEqp.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,{},function(data){
                    if(data.result != null){
                        //	console.log(that.OrderCarrierEqpList);
                        that.OrderCarrierEqpList = data.result
                    }else{
                        that.OrderCarrierEqpList = {}
                    }
                })
                getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+that.OrderCarrier.cdPartyId+"&isDefault=1&locationType=OTHER",function(data){
                    //    console.log(data);
                    if(data.result.eqpList != null){
                        that.OrderCarrierEqp = data.result.eqpList[0]; // 默认设备
                    }
                })
            })

        },
        changeTextbox(){    //保存为地址簿
            var checkbox = $("input[name='receiptCheckbox']").is(':checked');
            var that = this;
            if(checkbox == true){
                if(that.receiptParty.partyName == "" || that.receiptParty.partyCode == ""){
                    imitatePopup("请选择收货商","alert");
                    $("input[name='receiptCheckbox']").prop('checked',false);
                    return false;
                }
                if(that.receiptPartyLocationContact.contactName == "" || that.receiptPartyLocationContact.contactTel == ""){
                    imitatePopup("请填写收货地联系人、联系人电话","alert");
                    $("input[name='receiptCheckbox']").prop('checked',false);
                    return false;
                }
                if(that.receiptPartyLocation.countryCode == "" || that.receiptPartyLocation.provinceCode == "" || that.receiptPartyLocation.cityCode == "" || that.receiptPartyLocation.districtCode == "" || that.receiptPartyLocation.street == ""){
                    imitatePopup("请填写详细收货地址","alert");
                    $("input[name='receiptCheckbox']").prop('checked',false);
                    return false;
                }
                that.receiptPartyLocation.address = "中国" + $(".pointProvinceName").find("option:selected").text() + $(".pointCityName").find("option:selected").text() + $(".pointDistrictName").find("option:selected").text() + that.receiptPartyLocation.street;
                var locationLnkInfo = {
                    "location": {
                        locationName: that.receiptParty.partyName,
                        provinceCode: that.receiptPartyLocation.provinceCode,
                        cityCode: that.receiptPartyLocation.cityCode,
                        districtCode: that.receiptPartyLocation.districtCode,
                        address: that.receiptPartyLocation.address,
                        street: that.receiptPartyLocation.street,
                        locationType:"STO"
                    },
                    "contact": {
                        contactName: that.receiptPartyLocationContact.contactName,
                        contactTel: that.receiptPartyLocationContact.contactTel,
                        contactType:"SAL"
                    },
                    "partyCode":that.receiptParty.partyCode
                }
                var r = confirm("保存收货地址！")
                if (r==true){
                    $.ajax({
                        url: cmdUrl + "/save/locationContactLnk?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,
                        type: "post",
                        contentType : 'application/json',
                        data: JSON.stringify(locationLnkInfo),
                        success: function (data) {
                            if(data.msg == 'SUCCESS'){
                                imitatePopup("保存成功","alert");
                            }else{
                                imitatePopup(data.msg,"alert");
                            }
                        },
                        error:function(){
                            imitatePopup("保存失败！","alert");
                        }
                    })
                }else{
                    $("input[name='receiptCheckbox']").prop('checked',false);
                }

            }
        },
        saveNewOrderInfo(){ // 订单  新增、修改
            var that = this;
            if(that.orderDetail.orderNature == "" || that.orderDetail.orderNature == undefined){
                imitatePopup("请选择特性","alert");
                return false;
            }
            that.orderDetail.completeTime = $(".completionTime").html();
            if(that.shipperParty.partyName == "" || that.shipperParty.partyCode == ""){
                imitatePopup("请先绑定商户信息","alert");
                return false;
            }
            if(that.shipperPartyContact.contactName == "" || that.shipperPartyContact.contactTel == ""){
                imitatePopup("请先设定商户默认联系人信息","alert");
                return false;
            }
            if(that.orderDetail.completeTime == '要求送达时间'){
                imitatePopup("请选择要求送达时间","alert");
                return false;
            }
            that.orderDetail.expireTime = $(".completionTime").html();
            if(that.receiptParty.partyName == ""){
                imitatePopup("请选择收货商","alert");
                return false;
            }
            if(that.receiptPartyContact.contactName == "" || that.receiptPartyContact.contactTel == ""){
                imitatePopup("请填写收货商联系人、联系人电话","alert");
                return false;
            }
            if(that.receiptPartyLocationContact.contactName == "" || that.receiptPartyLocationContact.contactTel == ""){
                imitatePopup("请填写收货地联系人、联系人电话","alert");
                return false;
            }
            if(that.receiptPartyLocation.countryCode == "" || that.receiptPartyLocation.provinceCode == "" || that.receiptPartyLocation.cityCode == "" || that.receiptPartyLocation.districtCode == "" || that.receiptPartyLocation.street == ""){
                imitatePopup("请填写详细收货地址","alert");
                return false;
            }
            if(that.showPackageList.length < 1){
                imitatePopup("请选择商品","alert");
                return false;
            }
            that.orderDetail.orderType = 'SO';
            that.orderDetail.orderFrom = that.logininf.tenantNo;

            var omOrderHeadInfoModel = {};
            var shipperPartyInfoModel = {};
            shipperPartyInfoModel.party = that.shipperParty;  // 1-发货商基本信息
            shipperPartyInfoModel.imgContact = that.shipperPartyContact;  // 2-发货商紧急联系人
            /*shipperPartyInfoModel.location = that.shipperPartyLocation;  // 3-发货商地址信息
            shipperPartyInfoModel.contact = that.shipperPartyLocationContact;  // 4-发货商地址联系人*/

            var receiptPartyInfoModel = {};
            receiptPartyInfoModel.party = that.receiptParty;  // 1-收货商基本信息
            receiptPartyInfoModel.imgContact = that.receiptPartyContact;  // 2-收货商紧急联系人
            receiptPartyInfoModel.location = that.receiptPartyLocation;  // 3-收货商地址信息
            receiptPartyInfoModel.contact = that.receiptPartyLocationContact;  // 4-收货商地址联系人

            // 商品信息
            var orderGoodsInfoList = [];
            for(var i=0;i<that.showPackageList.length;i++){
                var orderItem = {
                    orderItem: {
                        seq: i,
                        itemNature: that.showPackageList[i].itemNature,
                        itemName: that.showPackageList[i].itemName,
                        itemCode: that.showPackageList[i].itemCode,
                        itemDesc: that.showPackageList[i].itemName,
                        lotNo: that.showPackageList[i].lotNo,
                        receivedQty: that.showPackageList[i].qty,
                        qty: that.showPackageList[i].qty,
                        qtyUnit: that.showPackageList[i].qtyUnit,
                        weight: that.showPackageList[i].weight,
                        weightUnit: that.showPackageList[i].weightUnit,
                        volume: that.showPackageList[i].volume,
                        volumeUnit: that.showPackageList[i].volumeUnit,
                        unitPrice: that.showPackageList[i].unitPrice,
                        amount: that.showPackageList[i].amount,
                        currency: that.showPackageList[i].currency,
                        locationCode: that.showPackageList[i].locationCode,
                        remark: that.showPackageList[i].remark
                    }
                };
                orderGoodsInfoList.push(orderItem)
            }
            var OrderCarrier = {};
            var parms1 = {}, parms2 = {};
            parms1.contact = that.OrderCarrierContact;
            parms1.eqp = that.OrderCarrierEqp;
            OrderCarrier.drvContactInfo = parms1; // 合作商司机信息
            parms2.contact = that.OrderCarrierContact;
            parms2.eqp = that.OrderCarrierEqp;
            OrderCarrier.imgContactInfo = parms2; // 合作商紧急联系人
            OrderCarrier.orderList = that.OrderCarrieromOrderListInfo; // omOrderId []
            that.OrderCarrier.refTo = "om_order";
            that.OrderCarrier.partyType = "CAR";
            OrderCarrier.party = that.OrderCarrier;
            omOrderHeadInfoModel.order = that.orderDetail;
            omOrderHeadInfoModel.shipperPartyInfo = shipperPartyInfoModel;
            omOrderHeadInfoModel.receiptPartyInfo = receiptPartyInfoModel;
            omOrderHeadInfoModel.orderItemInfoList = orderGoodsInfoList;

            switch(that.clickBtnType)
            {
                case 'add':
                    if(that.orderDetail.omOrderId != undefined && that.orderDetail.omOrderId != ''){  // 修改
                        postRequest(omsUrl + "/update/omOrderHeadInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderHeadInfoModel,function(data){
                            that.orderDetailInfoFun(data);
                            that.tableOrderItemAuditStatus = data.result.orderStatus.auditStatus;
                            that.getSearchVal();
                        });
                    }else{  // 新增
                        postRequest(omsUrl + "/inster/omSoOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderHeadInfoModel,function(data){
                            imitatePopup("提交成功","alert");
                            // 关闭侧滑 ------ start
                            closeSideslip();
                            that.getSearchVal();
                        });
                    }
                    break;
                case 'edit': // 修改
                    postRequest(omsUrl + "/update/omOrderHeadInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,omOrderHeadInfoModel,function(data){
                        that.orderDetailInfoFun(data);
                        that.tableOrderItemAuditStatus = data.result.orderStatus.auditStatus;
                        that.getSearchVal();
                    });
                    break;
            }
        },
        orderDetailInfoFun(data){ // 订单详情
            var that = this;
            if(data.result.orderStatus.activeStatus != '1' && data.result.orderStatus.activeStatus.auditStatus != '1'){
                that.activeStatusShow = '1';
            }else{
                that.activeStatusShow = '2';
            }
            // 订单详情
            that.orderDetail = data.result.order;
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
        },
        submitNewOrderInfo1(){  // 提交并审核通过，，，
            var that = this;
            if(that.orderDetail.omOrderId == undefined || that.orderDetail.omOrderId == ""){
                imitatePopup('请先保存订单',"alert");
                return false;
            }
            that.orderAuditStatus('2');
        },
        submitNewOrderInfo2(){  // 提交
            var that = this;
            if(that.orderDetail.omOrderId == undefined || that.orderDetail.omOrderId == ""){
                imitatePopup('请先保存订单',"alert");
                return false;
            }
            var r = confirm("确定改变该订单激活状态为激活？");
            if(r == true){
                getRequest(omsUrl + "/save/submitOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&omOrderId="+that.orderDetail.omOrderId,function(data){
                    imitatePopup("提交成功","alert");
                    // 关闭侧滑 ------ start
                    closeSideslip();
                    that.getSearchVal();
                })
            }
        },
        changeItemNatureFun(orderNature){
            var that = this;
            if(that.packageGoodsList.length != 0){
                $.each(that.packageGoodsList, function (index, val) {
                    val.orderItem.itemNature = orderNature;
                });
            }
        },
        delPackageGoodsListInfo(item){
            var that = this;
            var ids = $.inArray(item.wmItemInventoryId,that.transitGoodsListId);
            this.showPackageList.splice(ids,1);
            this.transitGoodsList.splice(ids,1);
            this.transitGoodsListId.splice(ids,1);
        },
        chooseGoodsFun(index){ // 选择商品 - 按钮
            $(".maskLayer1").show();
            var that = this;
            that.showItemList = '0';
            that.popupType = 'goods';
            that.currentGoodsIndex = index;
            that.selectGoods.partyCode = that.shipperParty.partyCode;
            that.selectGoods.partyName = that.shipperParty.partyName;
            var params = {
                pageInfo: {
                    pageNum:1,
                    pageSize:that.queryPageSize
                },
                partyCode:that.shipperParty.partyCode,
                partyName:that.shipperParty.partyName
            }
            that.temporaryGoods = [];
            that.temporaryGoodsId = [];
            for(var a=0;a<that.transitGoodsList.length;a++){
                that.temporaryGoods.push(that.transitGoodsList[a])
                that.temporaryGoodsId.push(that.transitGoodsListId[a])
            }
            $(".checkProduct").prop("checked",false);
            $(".maskLayer .popup .popupCon table tbody .productListTr").css("background","transparent");
            $(".maskLayer .popup .popupCon table tbody .productListTr").find('td').css("color","#333");
            postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.itemList = res.result;
                setTimeout(function(){
                    for(var a=0;a<that.itemList.length;a++){
                        $(".popupProDateTime").eq(a).html(timestampToTime(that.itemList[a].proDateTime));
                        for(var b=0;b<that.temporaryGoods.length;b++){
                            if(that.itemList[a].wmItemInventoryId == that.temporaryGoodsId[b]){
                                $(".checkProduct").eq(a).prop("checked",true);
                                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(a).css("background","#00528b");
                                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(a).find('td').css("color","#fff");
                            }
                        }
                    }
                },200)
                that.showItemList = '1';
                that.currentPage = 1;
                that.pageAllList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageAllList[i] = i + 1;
                }
                that.totaAlllList = [];
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totaAlllList[n] = n + 1;
                }
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
            })
        },
        choosePartyFun(type,orderPartyType){ // 选择合作商 - 按钮
            $(".maskLayer1").show();
            var that = this;
            that.orderPartyType = orderPartyType;
            that.popupType = type;
            that.queryParam1 = {
                partyType:null
            };
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.partyList = res.result;
                that.currentPage1 = 1;
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        chooseOrderCarrierFun(type){ // 选择承运商 - 按钮
            $(".maskLayer1").show();
            var that = this;
            that.popupType = type;
            that.queryParam4 = {
                refType:"",
                partyType:null
            };
            var params = that.queryParam4;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.OrderCarrierList = res.result;
                that.currentPage4 = 1;
                $(".popupType4 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum4 = res.pageInfo.total;
                that.pageList4 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList4[i] = i + 1;
                }
            })
        },
        chooseContactFun(type,orderPartyType,contanctBtnType){ // 选择联系人 - 按钮
            $(".maskLayer1").show();
            var that = this;
            that.orderPartyType = orderPartyType;
            that.contanctBtnType = contanctBtnType;
            that.popupType = type;
            that.queryParam3 = {
                contactType:"",
                partyType:null
            };
            switch(that.orderPartyType)
            {
                case 'from': // 发货商
                    if(that.shipperParty.partyType != '' && that.shipperParty.partyType != undefined){
                        that.queryParam3.partyType = that.shipperParty.partyType;
                    }else{
                        that.queryParam3.partyType = null;
                    }
                    if(that.shipperParty.partyName != '' && that.shipperParty.partyName != undefined){
                        that.queryParam3.partyName = that.shipperParty.partyName;
                    }
                    if(that.shipperParty.partyCode != '' && that.shipperParty.partyCode != undefined){
                        that.queryParam3.partyCode = that.shipperParty.partyCode;
                    }
                    break;
                case 'to': // 收货商
                    if(that.receiptParty.partyType != '' && that.receiptParty.partyType != undefined){
                        that.queryParam3.partyType = that.receiptParty.partyType;
                    }else{
                        that.queryParam3.partyType = null;
                    }
                    if(that.receiptParty.partyName != '' && that.receiptParty.partyName != undefined){
                        that.queryParam3.partyName = that.receiptParty.partyName;
                    }
                    if(that.receiptParty.partyCode != '' && that.receiptParty.partyCode != undefined){
                        that.queryParam3.partyCode = that.receiptParty.partyCode;
                    }
                    break;
                case 'carrierContact': // 订单多选添加合作商 联系人
                    if(that.OrderCarrier.partyType != '' && that.OrderCarrier.partyType != undefined){
                        that.queryParam3.partyType = that.OrderCarrier.partyType;
                    }else{
                        that.queryParam3.partyType = null;
                    }
                    if(that.OrderCarrier.partyName != '' && that.OrderCarrier.partyName != undefined){
                        that.queryParam3.partyName = that.OrderCarrier.partyName;
                    }
                    if(that.OrderCarrier.partyCode != '' && that.OrderCarrier.partyCode != undefined){
                        that.queryParam3.partyCode = that.OrderCarrier.partyCode;
                    }
                    break;
            }
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.contactList = res.result;
                that.currentPage3 = 1;
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum3 = res.pageInfo.total;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
            })
        },
        chooseAddressFun(type,orderPartyType){ // 选择地址 - 按钮
            $(".maskLayer1").show();
            var that = this;
            that.orderPartyType = orderPartyType;
            that.popupType = type;
            that.queryParam2 = {
                partyType:null
            };
            switch(that.orderPartyType)
            {
                case 'from': // 发货商
                    if(that.shipperParty.partyType != '' && that.shipperParty.partyType != undefined){
                        that.queryParam2.partyType = that.shipperParty.partyType;
                    }else{
                        that.queryParam2.partyType = null;
                    }
                    if(that.shipperParty.partyName != '' && that.shipperParty.partyName != undefined){
                        that.queryParam2.partyName = that.shipperParty.partyName;
                    }
                    if(that.shipperParty.partyCode != '' && that.shipperParty.partyCode != undefined){
                        that.queryParam2.partyCode = that.shipperParty.partyCode;
                    }
                    break;
                case 'to': // 收货商
                    if(that.receiptParty.partyType != '' && that.receiptParty.partyType != undefined){
                        that.queryParam2.partyType = that.receiptParty.partyType;
                    }else{
                        that.queryParam2.partyType = null;
                    }
                    if(that.receiptParty.partyName != '' && that.receiptParty.partyName != undefined){
                        that.queryParam2.partyName = that.receiptParty.partyName;
                    }
                    if(that.receiptParty.partyCode != '' && that.receiptParty.partyCode != undefined){
                        that.queryParam2.partyCode = that.receiptParty.partyCode;
                    }
                    break;
            }
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
                that.currentPage2 = 1;
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum2 = res.pageInfo.total;
                that.pageList2 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList2[i] = i + 1;
                }
            })
        },
        chooseEqpDriverFun(type){
            $(".maskLayer1").show();
            var that = this;
            that.popupType = type;
            that.queryParam5 = {
                refType:"",
                eqpType:null
            };
            var params = that.queryParam5;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.eqpDriverList = res.result;
                that.currentPage5 = 1;
                $(".popupType5 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum5 = res.pageInfo.total;
                that.pageList5 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList5[i] = i + 1;
                }
            })
        },
        //  批量选择商品
        selectGoodsFun(item,index){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(index).css("background","#00528b");
                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(index).find('td').css("color","#fff");
                if(that.temporaryGoodsId.indexOf(item.wmItemInventoryId) == -1){
                    that.temporaryGoodsId.push(item.wmItemInventoryId);
                    that.temporaryGoods.push(item);
                }
            }else{
                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(index).css("background","transparent");
                $(".maskLayer .popup .popupCon table tbody .productListTr").eq(index).find('td').css("color","#333");
                var ids = $.inArray(item.wmItemInventoryId,that.temporaryGoodsId);
                that.temporaryGoodsId.splice(ids,1);
                that.temporaryGoods.splice(ids,1)
            }
        },
        //  添加已批量选择商品
        addSelectGoods(){
            var that = this;
            that.transitGoodsList = [];
            that.transitGoodsListId = [];
            that.showPackageList = [];
            for(var i=0;i<that.temporaryGoods.length;i++){
                that.transitGoodsList.push(that.temporaryGoods[i]);
                that.transitGoodsListId.push(that.temporaryGoodsId[i]);
                var showPackageItem = {
                    seq: i,                                                  // item的排列顺序
                    itemNature: that.selectListData.orderNatureList[0].code, // 性质：GEN-普货，DAN-危货
                    itemName: that.temporaryGoods[i].itemName,               // 条目名称
                    itemCode: that.temporaryGoods[i].itemNo,                 // 条目编码
                    itemDesc: that.temporaryGoods[i].itemName,               // 条目描述
                    itemBarCode: that.temporaryGoods[i].itemBarCode,         // 商品编号
                    lotNo: timestampToTime(that.temporaryGoods[i].proDateTime),// 批次号
                    receivedQty: 1,                                          // 实数量
                    qty: 1,                                                  // 实数量
                    qty1: that.temporaryGoods[i].qty1,                       // 库存
                    qty2: that.temporaryGoods[i].qty2,                       // 最小库存
                    unit: that.temporaryGoods[i].unit2,                      // 选中单位
                    unit1: that.temporaryGoods[i].unit1,                     // 大单位
                    unit2: that.temporaryGoods[i].unit2,                     // 小单位
                    qtyUnit: that.selectListData.qtyUnitList[0].code,        // PCS-件
                    weight: that.temporaryGoods[i].weight,                   // 总重量
                    weightUnit: that.selectListData.weightUnitList[0].code,  // KG-公斤
                    volume: that.temporaryGoods[i].volume,                   // 总体积
                    volumeUnit: that.selectListData.volumeUnitList[0].code,  // M3-立方米
                    unitPrice: that.temporaryGoods[i].amount,                // 单价
                    amount: that.temporaryGoods[i].amount,                   // 总价值
                    currency: that.selectListData.currencyList[0].code,      // CNY-人民币
                    unitConversion: that.temporaryGoods[i].unitConversion,   // 转换率
                    locationCode: that.temporaryGoods[i].locationCode,       // 仓库编码
                    remark:'',                                               // 备注
                    wmItemInventoryId: that.temporaryGoods[i].wmItemInventoryId                                    //id
                };
                that.showPackageList.push(showPackageItem);
            }
            $(".maskLayer1").hide();
        },
        changeGoodsQtyAndUnit(packageItem,index){
            var that = this;
            var receivedQty = packageItem.receivedQty;
            var conversion = packageItem.unitConversion;
            var amount = receivedQty * that.temporaryGoods[index].unitPrice;
            var weight = receivedQty * that.temporaryGoods[index].weight;
            var volume = receivedQty * that.temporaryGoods[index].volume;
            if(packageItem.unit == packageItem.unit1 && conversion > 0){
                packageItem.amount = (amount * conversion).toFixed(2);
                packageItem.weight = (weight * conversion).toFixed(2);
                packageItem.volume = (volume * conversion).toFixed(2);
                packageItem.qty = receivedQty * conversion;
            }else{
                packageItem.amount = amount.toFixed(2);
                packageItem.weight = weight.toFixed(2);
                packageItem.volume = volume.toFixed(2);
                packageItem.qty = receivedQty;
            }
        },
        selectPaFun(partyItem,index){ // 选择合作商 - tr
            var that = this;
            partyItem.cdPartyId = undefined;
            //    console.log(partyItem);
            switch(that.orderPartyType)
            {
                case 'from': // 发货商
                    that.shipperParty = partyItem;
                    break;
                case 'to': // 收货商
                    that.receiptParty = partyItem;
                    break;
                case 'carrier': // 承运商
                    that.OrderCarrier = partyItem;
                    that.OrderCarrier.partyType = "";
                    break;
            }
            $(".maskLayer1").hide();
        },
        selectOrderCarrierFun(OrderCarrierItem,index){ // 选择承运商 - tr
            var that = this;
            OrderCarrierItem.cdPartyId = undefined;
            //    console.log(OrderCarrierItem);
            that.OrderCarrier = OrderCarrierItem;
            that.OrderCarrierContact.contactName = OrderCarrierItem.imgContactName;
            that.OrderCarrierContact.contactTel = OrderCarrierItem.imgContactTel;
            that.OrderCarrierContact.contactEmail = OrderCarrierItem.imgContactEmail;
            //   that.OrderCarrierContact.contactAddress = ;
            $(".maskLayer1").hide();
        },
        queryPartyLocationContact(cdLocationId,type){ // 查地址联系人
            var that = this;
            getRequest(cmdUrl + "/get/locationDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdLocationId="+cdLocationId,function(res){
                switch(type)
                {
                    case 'from': // 发货商
                        that.shipperPartyLocationContactList = res.result.contactList;
                        if(that.shipperPartyLocationContactList.length != 0){
                            that.shipperPartyLocationContact = that.shipperPartyLocationContactList[0];
                        }else{
                            that.shipperPartyLocationContact = {
                                contactName:"",
                                contactTel:""
                            };
                        }
                        break;
                    case 'to': // 收货商
                        that.receiptPartyLocationContactList = res.result.contactList;
                        if(that.receiptPartyLocationContactList.length != 0){
                            that.receiptPartyLocationContact = that.receiptPartyLocationContactList[0];
                        }else{
                            that.receiptPartyLocationContact = {
                                contactName:"",
                                contactTel:""
                            };
                        }
                        break;
                }
                $(".maskLayer1").hide();
            });
        },
        selectAddress(addressItem,index){ // 选择地址 - tr
            var that = this;
            var cdLocationId = addressItem.cdLocationId;
            addressItem.cdLocationId = undefined;
            //  console.log(addressItem);
            /*addressItem.cdLocationId = undefined;
            addressItem.isDefault = '';*/

            switch(that.orderPartyType)
            {
                case 'from': // 发货商
                    that.shipperPartyLocation = addressItem;
                    //    that.queryPartyLocationContact(cdLocationId,'from'); // 查地址联系人
                    break;
                case 'to': // 收货商
                    that.receiptPartyLocation = addressItem;
                    //	that.queryPartyLocationContact(cdLocationId,'to'); // 查地址联系人
                    break;
            }
            $(".maskLayer1").hide();
        },
        selectCtFun(contactItem,index){ // 选择联系人 - tr
            var that = this;
            contactItem.cdContactId = undefined;
            //    console.log(contactItem);
            /*contactItem.cdContactId = undefined;
            contactItem.isDefault = '';*/
            switch(that.contanctBtnType)
            {
                case '0': // 发货商联系人
                    that.shipperPartyContact = contactItem;
                    that.shipperPartyLocationContact = contactItem;
                    break;
                case '1': //  发货地联系人
                    that.shipperPartyLocationContact = contactItem;
                    break;
                case '2': // 收货商联系人
                    that.receiptPartyContact = contactItem;
                    that.receiptPartyLocationContact = contactItem;
                    break;
                case '3': // 收货地联系人
                    that.receiptPartyLocationContact = contactItem;
                    break;
                case '4': // 订单多选添加合作商 联系人
                    that.OrderCarrierContact = contactItem;
                    break;
            }
            $(".maskLayer1").hide();
        },
        selecteqpDriverFun(eqpDriverItem,index){ // 选择设备模板 - tr
            var that = this;
            //    console.log(eqpDriverItem);
            var paramObj = eqpDriverItem;
            var paramObj1 = {
                contactName:paramObj.contactName,
                contactTel:paramObj.contactTel
            };
            var paramObj2 = {
                eqpNo:paramObj.eqpNo,
                eqpName:paramObj.eqpName,
                eqpLength:paramObj.eqpLength,
                eqpWidth:paramObj.eqpWidth,
                eqpHeight:paramObj.eqpHeight,
                eqpStr1:paramObj.eqpStr1,
                eqpStr2:paramObj.eqpStr2
            };
            that.OrderCarrierDriver = paramObj1;
            that.OrderCarrierEqp = paramObj2;
            $(".maskLayer1").hide();
        },
        getSearchVal1(){ // 查询 - 合作商
            var that = this;
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.partyList = res.result;
                that.currentPage1 = 1;
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        getSearchVal2(){ // 查询 - 地址
            var that = this;
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
                that.currentPage2 = 1;
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum2 = res.pageInfo.total;
                that.pageList2 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList2[i] = i + 1;
                }
            })
        },
        getSearchVal3(){ // 查询 - 联系人
            var that = this;
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.contactList = res.result;
                that.currentPage3 = 1;
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum3 = res.pageInfo.total;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
            })
        },
        getSearchVal4(){ // 查询 - 合作商模板
            var that = this;
            var params = that.queryParam4;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.OrderCarrierList = res.result;
                that.currentPage4 = 1;
                $(".popupType4 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum4 = res.pageInfo.total;
                that.pageList4 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList4[i] = i + 1;
                }
            })
        },
        getSearchVal5(){ // 查询 - 设备模板
            var that = this;
            var params = that.queryParam5;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.eqpDriverList = res.result;
                that.currentPage5 = 1;
                $(".popupType5 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum5 = res.pageInfo.total;
                that.pageList5 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList5[i] = i + 1;
                }
            })
        },
        changePage1(pageNum,clickStatus){ // 弹窗合作商列表
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage1 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage1 > pageNum){
                    $(".popupType1 .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }else{
                    $(".popupType1 .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }
            }else{
                this.currentPage1 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            };
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.partyList = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        changePage2(pageNum,clickStatus){ // 弹窗地址列表
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage2 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage2 > pageNum){
                    $(".popupType2 .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage2 = pageNum;
                }else{
                    $(".popupType2 .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage2 = pageNum;
                }
            }else{
                this.currentPage2 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.addressList = res.result;
                that.pageList2 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList2[i] = i + 1;
                }
            })
        },
        changePage3(pageNum,clickStatus){ // 弹窗联系人列表
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage3 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage3 > pageNum){
                    $(".popupType3 .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage3 = pageNum;
                }else{
                    $(".popupType3 .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage3 = pageNum;
                }
            }else{
                this.currentPage3 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.contactList = res.result;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
            })
        },
        changePage4(pageNum,clickStatus){ // 弹窗合作商模板列表
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType4 .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage4 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage4 > pageNum){
                    $(".popupType4 .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage4 = pageNum;
                }else{
                    $(".popupType4 .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage4 = pageNum;
                }
            }else{
                this.currentPage4 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            };
            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.OrderCarrierList = res.result;
                that.pageList4 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList4[i] = i + 1;
                }
            })
        },
        changePage5(pageNum,clickStatus){ // 弹窗设备模板列表
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType5 .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage5 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage5 > pageNum){
                    $(".popupType5 .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage5 = pageNum;
                }else{
                    $(".popupType5 .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage5 = pageNum;
                }
            }else{
                this.currentPage5 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:pageNum,
                    pageSize:that.queryPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.eqpDriverList = res.result;
                that.pageList5 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList5[i] = i + 1;
                }
            })
        },
        getOrderPartyList(){
            var that = this;
            var searchFormArr = {
                refType: 'TENANTLNK'
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.orderPartyList = res.result;
            })
        },

        // cdm基础数据 选择国省市区，以及输入街道改变详细地址 ——————— start
        selectLocLevelFun(level,paramObj,code){ // 选中国省市区触发事件，入参：地址级别，对象，当前 国、省、市、区 编码 [ 便于扩展实时改变 详细地址address ]
            var that = this;
            switch(level)
            {
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
            that.changeAddressFun(level,paramObj,code);
        },
        getAllProviceList(countryCode){ // 根据所选的 countryCode 获取对应 省列表
            return getProvinceData(countryCode);
        },
        getAllCityList(provinceCode){ // 根据所选的 provinceCode 获取对应 市列表
            return getCityData(provinceCode);
        },
        getAllDistrictList(cityCode){ // 根据所选的 cityCode 获取对应 区列表
            return getDistrictData(cityCode);
        },
        changeAddressFun(level,paramObj,code){ // 选择国省市区，实时改变 详细地址 address ，入参：地址级别，当前 国、省、市、区 编码
            var that = this;
            switch(level)
            {
                case 'countryCode': // 选择 国 ，改变 address
                    if(code == ''){
                        that.address00 = '';
                    }else{
                        $.each(that.getAllCountryList, function (indexs, val) {
                            if (val.adcode == code) {
                                that.address00 = val.chineseName;
                            }
                        });
                    }
                    that.address0 = '';
                    that.address1 = '';
                    that.address2 = '';
                    break;
                case 'provinceCode': // 选择 省 ，改变 address
                    if(code == ''){
                        that.address0 = '';
                    }else{
                        $.each(that.getAllProviceList(paramObj.countryCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address0 = val.chineseName;
                            }
                        });
                    }
                    that.address1 = '';
                    that.address2 = '';
                    break;
                case 'cityCode': // 选择 市 ，改变 address
                    if(code == ''){
                        that.address1 = '';
                    }else{
                        $.each(that.getAllCityList(paramObj.provinceCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address1 = val.chineseName;
                            }
                        });
                    }
                    that.address2 = '';
                    break;
                case 'districtCode': // 选择 区 ，改变 address
                    if(code == ''){
                        that.address2 = '';
                    }else{
                        $.each(that.getAllDistrictList(paramObj.cityCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address2 = val.chineseName;
                            }
                        });
                    }
                    break;
            }
            if(paramObj.street != '' && paramObj.street != undefined && paramObj.street != null){
                that.address3 = paramObj.street;
            }else{
                that.address3 = '';
            }
            paramObj.address = that.address00 + that.address0 + that.address1 + that.address2 + that.address3;
        },
        changeAddress(paramObj,street,type){ // 输入街道，改变 address
            var that = this;
            if(street == undefined){
                return false;
            }
            that.address3 = street;
            switch(type)
            {
                case '0': // 发货商，改变 address
                    that.changeAddressFun('countryCode',that.shipperPartyLocation,that.shipperPartyLocation.countryCode);
                    that.changeAddressFun('provinceCode',that.shipperPartyLocation,that.shipperPartyLocation.provinceCode);
                    that.changeAddressFun('cityCode',that.shipperPartyLocation,that.shipperPartyLocation.cityCode);
                    that.changeAddressFun('districtCode',that.shipperPartyLocation,that.shipperPartyLocation.districtCode);
                    break;
                case '1': // 收货商，改变 address
                    that.changeAddressFun('countryCode',that.receiptPartyLocation,that.receiptPartyLocation.countryCode);
                    that.changeAddressFun('provinceCode',that.receiptPartyLocation,that.receiptPartyLocation.provinceCode);
                    that.changeAddressFun('cityCode',that.receiptPartyLocation,that.receiptPartyLocation.cityCode);
                    that.changeAddressFun('districtCode',that.receiptPartyLocation,that.receiptPartyLocation.districtCode);
                    break;
            }
            paramObj.address = that.address00 + that.address0 + that.address1 + that.address2 + that.address3;
        },
        resetAddressParamFun(type){ // 重置 改变address 参数，入参：类型（全重置、默认国家“中国”）
            var that = this;
            switch(type)
            {
                case '0':
                    that.address00 = '';
                    that.address0 = '';
                    that.address1 = '';
                    that.address2 = '';
                    that.address3 = '';
                    break;
                case '1':
                    that.address00 = '中国';
                    that.address0 = '';
                    that.address1 = '';
                    that.address2 = '';
                    that.address3 = '';
                    break;
            }
        },
        getAddressParamFun(level,paramObj,code){ // 赋值 改变address 参数
            var that = this;
            switch(level)
            {
                case 'countryCode':
                    if(code != null && code != ''){
                        $.each(that.getAllCountryList, function (indexs, val) {
                            if (val.adcode == code) {
                                that.address00 = val.chineseName;
                            }
                        });
                    }else{
                        that.address00 = '';
                        paramObj.countryCode = "";
                    }
                    break;
                case 'provinceCode':
                    if(code != null && code != ''){
                        $.each(that.getAllProviceList(paramObj.countryCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address0 = val.chineseName;
                            }
                        });
                    }else{
                        that.address0 = '';
                        paramObj.provinceCode = "";
                    }
                    break;
                case 'cityCode':
                    if(code != null && code != ''){
                        $.each(that.getAllCityList(paramObj.provinceCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address1 = val.chineseName;
                            }
                        });
                    }else{
                        that.address1 = '';
                        paramObj.cityCode = "";
                    }
                    break;
                case 'districtCode':
                    if(code != null && code != ''){
                        $.each(that.getAllDistrictList(paramObj.cityCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address2 = val.chineseName;
                            }
                        });
                    }else{
                        that.address2 = '';
                        paramObj.districtCode = "";
                    }
                    break;
            }
        },
        // cdm基础数据 选择国省市区，以及输入街道改变详细地址 ——————— end

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
                })
            },100)
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        resetOrderList(){
            window.location.reload();
        }
    },
    created(){
        var that = this;
        that.getAllCountryList = getCountryData();
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        initSelectData(that);
        that.selectListData = getBasicData();    //获取下拉数据
        that.timeHorizon = getQueryTime(1)+" - "+ getTodayTime();
        that.getOrderPartyList();
        var searchFormArr = {
            activeStatus:"1",
            startCreateTime:getQueryTime(1),
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        //获取订单列表
        postRequest(omsUrl + "/query/selectSoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.pageInfo = res.pageInfo;
            that.totalPagesNum = res.pageInfo.total
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
    },
    watch: {
        'firstname': function(newVal,oldVal){
            this.fullname = newVal + '-' + this.lastname
        },
        'lastname': function(newVal){
            this.fullname = this.firstname + '-' + newVal
        },
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
})

function changeSelected(){
    $(".reportMessages .checkInp").prop("checked",false);
}

function mapFunction(sfrAddress,stoAddress,wayPoint){
    if(sfrAddress == null || stoAddress == null || sfrAddress.location.latLng == null || stoAddress.location.latLng == null){
        imitatePopup("收发货地址不全，暂时无法显示轨迹信息","alert");
        var map = new AMap.Map("container", {
            resizeEnable: true,
            zoom: 13 //地图显示的缩放级别
        });
        //构造路线导航类
        var driving = new AMap.Driving({
            map: map
        });
    }else{
        var sfrLocationCode = sfrAddress.location.latLng.split(",");
        var stoLocationCode = stoAddress.location.latLng.split(",");
        //基本地图加载
        var map = new AMap.Map("container", {
            resizeEnable: true,
            center: [sfrLocationCode[0], sfrLocationCode[1]],//地图中心点
            zoom: 13 //地图显示的缩放级别
        });
        //构造路线导航类
        var driving = new AMap.Driving({
            map: map
        });
        // 根据起终点经纬度规划驾车导航路线
        driving.search(new AMap.LngLat(sfrLocationCode[0], sfrLocationCode[1]), new AMap.LngLat(stoLocationCode[0], stoLocationCode[1]),{waypoints:wayPoint});
    }
}

//日期格式化
function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}

function initSelectData(that){
    that.orderDetail = { // 订单基本信息
        orderFrom:"",
        orderTo:"",
        customerRefNo:"",
        orderType:"",
        orderNature:"",
        completeTime:"",
        expireTime:"",
        totalQty:"",
        qtyUnit:"",
        totalWeight:"",
        weightUnit:"",
        totalVolume:"",
        volumeUnit:"",
        totalAmount:"",
        currency:"",
        remark:""
    };

    that.shipperParty = { // 发货商
        partyName:"",
        partyCode:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };
    that.shipperPartyContact = { // 发货商 联系人
        contactName:"",
        contactTel:"",
        contactEmail:""
    };
    that.shipperPartyLocation = { // 发货地
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
    that.shipperPartyLocationContact = { // 发货地 联系人
        contactName:"",
        contactTel:""
    };

    that.receiptParty = { // 收货商
        partyName:"",
        partyCode:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };
    that.receiptPartyContact = { // 收货商 联系人
        contactName:"",
        contactTel:"",
        contactEmail:""
    };
    that.receiptPartyLocation = { // 收货地
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
    that.receiptPartyLocationContact = { // 收货地 联系人
        contactName:"",
        contactTel:""
    };

    that.OrderCarrier = { // 承运商
        partyName:"",
        partyCode:"",
        partyType:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };
    that.OrderCarrierContact = { // 承运商联系人
        contactName:"",
        contactTel:"",
        contactEmail:"",
        contactAddress:""
    };
    that.OrderCarrierDriver = { // 承运商 司机
        contactName:"",
        contactTel:""
    };
    that.OrderCarrierEqp = { // 承运商 车
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
    that.orderItemDetail = { // 单个包裹信息
        orderItem:{
            itemName:"",
            itemCode:"",
            lotNo:"",
            unitPrice:"",
            currency:"",
            qty:"",
            qtyUnit:"",
            weight:"",
            weightUnit:"",
            volume:"",
            volumeUnit:"",
            amount:""
        }
    };

    that.queryParam = { // 搜索条件
        orderFrom:"",
        orderTo:"",
        completeStatus:"",
        sendStatus:"",
        expireStatus:"",
        exceptionStatus:"",
        activeStatus:"1",
        payStatus:"",
        auditStatus:"",
        actCode:"",
        orderType:""
    };

    that.OrderStatusDetail = { // 订单状态
        expireStatus:"",
        expireStatusRemark:"",
        completeStatus:"",
        completeStatusRemark:"",
        sendStatus:"",
        sendStatusRemark:"",
        exceptionStatus:"",
        exceptionStatusRemark:"",
        activeStatus:"",
        activeStatusRemark:"",
        payStatus:"",
        payStatusRemark:"",
        auditStatus:"",
        auditStatusRemark:"",
        motionStatus:"",
        motionStatusRemark:""
    };
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});




