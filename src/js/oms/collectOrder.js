var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        clickBtnType:"",
        isDisable:true,
        isShippingOrder:false,
        tableOrderList:{},
        formLeft:{},
        packageGoodsInf:{},
        selectListData:{},
        queryParam:{},
        searchInf:[],
        pageList:[],
        totalPagesNum:"",
        orderDetail:{},
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
        OrderCarrierContact:{},
        OrderCarrierDriver:{},
        OrderCarrierEqp:{},
        orderItemDetail:{orderItem:{}},
        uploadImgList:[],
        orderCodeItem:{},
        orderReceiptItem:{},
        orderLogisticsInfo:{},
        orderCostInfo:{},
        queryPageSize: 20,
        orderCostParamInfo:{
            income:"",
            cost:"",
            billingWeight:""
        },
        orderCostChargeExt:{},
        srcFileList:[],
        begin:"",
        magnifyImgSrc:"",
        magnifyImgType:"",
        indexImg:0,
        receiptImgList:[],
        receiptFilesList:[],
        actCurrentInfo:{
            actCode:'',
            createTime:null,
            remark:''
        },
        actListInfo:{},
        logininf:{},
        templateTitle:"新增订单",
        packageGoodsDetails:"",
        packageGoodsList:[{
            orderItem:{
                itemName:"",
                currency:"",
                qtyUnit:"",
                volumeUnit:""
            }
        }],
        clearShow:true,
        getAllCountryList:{}, // 国家列表
        orderPartyList:[], // 订单 发单方，接单方 下拉列表
        orderTypeList2:[], // 订单 订单类型 下拉列表

        tableOrderList0:{},
        popupType:"",
        auditOrderType:"0",
        orderDirection:{
            auditOrderRemark:""
        },
        timeHorizon:"" //创建时间范围
    },
    methods:{
        getOrderPartyList(){
            var that = this;
            var searchFormArr = {
                refType: 'TENANTLNK'
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.orderPartyList = res.result;
            })
        },
        getOrderDetails(template,order){
            this.clickBtnType = "detail";
            this.templateTitle = template;
            var that = this;
            getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.order.orderType == "DO"){
                    that.isShippingOrder = true;
                }else{
                    that.isShippingOrder = false;
                }

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
                            locationType:null,
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
                        locationType:null,
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
                            locationType:null,
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
                        locationType:null,
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
        changeOrderDetails(template){
            this.templateTitle = template;
        },
        uploadReceipt(orderno){ // 回单上传
            var that = this;
            var imgListArr = [];
            //	console.log(orderno);
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
                alert("回单上传成功");
                that.receiptImgList.push(ImgWebsite + res.result.imgList[0]);
                that.uploadImgList = [];
            })
        },
        getOrderCode(codeVal){ // 获取二维码 条形码
            $("#qrcode").html("");
            //	this.orderCodeItem = codeVal;
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
        // 点击“订单附件” ---------------------------------------------------------------------------- start 190228
        getOrderReceipt(receiptVal){
            var that = this;
            that.receiptImgList = [];
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
                    that.receiptImgList.push(ImgWebsite + res.result[i].extValue);
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
        // 点击“订单附件” ---------------------------------------------------------------------------- end 190228

        getCostInfo(orderInfo){
            var that = this;
            that.orderCostInfo = orderInfo;
            that.orderCostParamInfo = {
                income:"",
                cost:"",
                billingWeight:""
            };
            getRequest(omsUrl + "/get/orderChargeInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+orderInfo.omOrderId,function(res){
                if(res.result != null){
                    if(res.result.income == null){
                        that.orderCostParamInfo.income = "";
                    }else{
                        that.orderCostParamInfo.income = res.result.income;
                    }
                    if(res.result.cost == null){
                        that.orderCostParamInfo.cost = "";
                    }else{
                        that.orderCostParamInfo.cost = res.result.cost;
                    }
                    if(res.result.billingWeight == null){
                        that.orderCostParamInfo.billingWeight = "";
                    }else{
                        that.orderCostParamInfo.billingWeight = res.result.billingWeight;
                    }
                    that.orderCostChargeExt = res.result.chargeExt;
                }
            })
        },
        saveOrderCostParamInfo(){
            var that = this;
            if(that.orderCostParamInfo.income == ""){
                alert("请输入收入金额");
                return false;
            }
            if(that.orderCostParamInfo.cost == ""){
                alert("请输入成本金额");
                return false;
            }
            if(that.orderCostParamInfo.billingWeight == ""){
                alert("请输入计费重");
                return false;
            }
            var param = that.orderCostParamInfo;
            param.refId = that.orderCostInfo.omOrderId;
            param.chargeExt = that.orderCostChargeExt;
            postRequest(omsUrl + "/save/orderChargeInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                // 关闭侧滑 ------ start
                closeSideslip();
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
                auditOrderRemark:""
            };
            switch(type)
            {
                case '0': // 列表一个
                    var arrayList = [];
                    arrayList.push(tableOrderItem);
                    that.tableOrderList0 = arrayList;
                    break;
            }
            $(".maskLayer1").show();
        },
        orderAuditStatus1(){ // 列表一个、、批量多选 、、、订单页 提交并审核通过   订单审核 通过
            var that = this,params = [],orderAuditStatusNum = 0;
            switch(that.auditOrderType)
            {
                case '0': // 列表一个
                    var param = {
                        refText:that.orderDirection.auditOrderRemark,
                        refId: that.tableOrderList0[0].omOrderId,
                        refType: that.tableOrderList0[0].orderType,
                        refNo: that.tableOrderList0[0].orderNo,
                        state:"1",
                        refCode:that.logininf.tenantNo,
                        refTo:'INTERNAL'
                    };
                    postRequest(omsUrl + "/save/auditOrderInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                        alert("审核通过");
                        $(".maskLayer1").hide();
                        // 关闭侧滑 ------ start
                        closeSideslip();
                        $(".maskLayer").hide();
                        that.getSearchVal();
                    });
                    break;
            }
        },
        getLogisticsInfo(orderInfo){ // 物流信息
            var that = this;
            var orderinf = {
                refId:orderInfo.omOrderId,
                refTo:"om_order"
            }
            postRequest(omsUrl + "/query/ActInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,orderinf,function(data) {
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
                if (data.result.actList != null){
                    for (var i = 0; i < data.result.actList.length; i++) {
                        if (data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == "") {

                        } else {
                            waypointsArr.push([data.result.actList[i].latLng.split(",")[0], data.result.actList[i].latLng.split(",")[1]]);
                        }
                    }
                };
                getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+orderInfo.omOrderId,function(res){
                    that.orderLogisticsInfo = res.result.order;
                    if(res.result.shipperPartyInfo != null){
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
        uploadImgFun(){ // 选择图片 并将图片转为base64位编码格式
            var file = $("#uploadImg").prop("files")[0];  //获取文件
            var that = this;
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function(evt) {
                    that.uploadImgList.push(evt.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert('上传失败，请重新上传！');
            }
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
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            var that = this;
            //获取订单列表
            postRequest(omsUrl + "/query/selectRoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
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
                activeStatus:"",
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
                $(".startTimeSpan").val(getQueryTime(1));
                startTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            }
            //获取订单列表
            postRequest(omsUrl + "/query/selectRoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.currentPage = 1;
                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },


        getContactInfo(id){
            var that = this;
            postRequest(cmdUrl + "/cdContact/selectCdContactById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdContactId="+id,function(data){
                that.shipperPartyLocationContact = data.result;
            })
        },

        // cdm基础数据 选择国省市区，以及输入街道改变详细地址 ——————— start
        selectLocLevelFun(level,paramObj,code){ // 选中国省市区触发事件，入参：地址级别，对象，当前 国、省、市、区 编码 [ 便于扩展实时改变 详细地址address ]
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
    created:function(){
        var that = this;
        that.getAllCountryList = getCountryData();
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        initSelectData(that);
        this.selectListData = getBasicData();    //获取下拉数据
        that.timeHorizon = getQueryTime(1)+" - "+ getTodayTime();

        var orderTypeList2 = []; // 根据基础数据筛选订单类型，只要 运输单，发货单
        $.each(that.selectListData.orderTypeList, function (indexs, val) {
            if (isContains(val.text, '运输单') || isContains(val.text, '发货单')) {
                orderTypeList2.push(val);
            }
        });
        that.orderTypeList2 = orderTypeList2;

        that.getOrderPartyList();
        var startTimeVal =that.timeHorizon.split(" - ")[0];
        var endTimeVal =that.timeHorizon.split(" - ")[1];
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            },
            startCreateTime: startTimeVal,
            endCreateTime: endTimeVal
        };
        //获取订单列表
        postRequest(omsUrl + "/query/selectRoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.pageInfo = res.pageInfo;
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
});

function mapFunction(sfrAddress,stoAddress,wayPoint){
    if(sfrAddress == null || stoAddress == null || sfrAddress.location.latLng == null || stoAddress.location.latLng == null){
        alert("收发货地址不全，暂时无法显示轨迹信息");
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
        activeStatus:"",
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
});
