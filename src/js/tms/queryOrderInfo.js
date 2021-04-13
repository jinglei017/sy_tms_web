var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        isDisable:true,
        clearShow:true,
        splitType: 'master',
        isOpOrCloDetail: '0',
        isOpOrCloAddressInfos:[],
        abnormalPage:0,
        queryPageSize:20,
        multipleNum:12,
        tableOrderList:{},
        formLeft:{},
        dpDistrictList:{},
        packageGoodsInf:{},
        selectListData:{},
        queryParam:{},
        searchInf:[],
        pageList:[],
        totalPagesNum:"",
        masterOrderType:"DO",
        orderSplitBeginInfo: {},
        orderSplitEndInfo: {},
        orderSplitPassList: [],
        singleHouseOrderList: [],
        billTask:{},
        popupType:"",
        address00: '中国',
        partyList:{},
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
        OrderCarrierContact:{},
        OrderCarrierDriver:{},
        OrderCarrierEqp:{},
        dtmListInfoList:[{}],
        eqpListInfoList:[{}],
        orderItemDetail:{orderItem:{}},
        uploadImgList:[],
        orderCodeItem:{},
        orderReceiptItem:{},
        orderLogisticsInfo:{},
        receiptImgList:[],
        actCurrentInfo:{
            actCode:'',
            createTime:null,
            remark:''
        },
        actListInfo:{},
        logininf:{},
        checkedNum:0,
        checkedOperaOrder:[],
        orderList:[],
        splitCount:"",
        currentOrderId:"",
        isShowSplitList:"0",
        orderSplitList:[{
            houseOrderId:'',
            orderItemList:[{}],
            shipperPartyInfo:{},
            receiptPartyInfo:{},
        }],
        templateTitle:"新增订单",
        isShippingOrder:false,
        packageGoodsDetails:"",
        packageGoodsList:[{
            orderItem:{
                itemName:"",
                currency:"",
                qtyUnit:"",
                volumeUnit:""
            }
        }],
        timeHorizon:"", //创建时间范围
        linkNames: ["配送订单","派送任务"],
        linkHrefs: [],
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
        OrderCarrier1:{
            partyName:"",
            partyCode:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        shortShowType:"0",
        resPartyList:[],
        showDriverList:[],
        driverList:[],
        showPlateList:false,
        omOrderList:[],
        timeHorizon1: getQueryTime(0) + " " + "00:00",
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
                url: tmsUrl + '/orderInfo/uploadExcelFile.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    imitatePopup(data.result.resultMsg,"alert");
                    that.queryParam = {
                        orderNature: "",
                        origin: "",
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
                        orderType:"",
                        subtasksStatus:"",
                    }
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    var searchFormArr = {
                        startCreateTime: getQueryTime(1),
                        isHaulOrder:true,
                        pageInfo:{
                            pageNum:1,
                            pageSize:that.queryPageSize
                        }
                    }
                    //获取订单列表
                    postRequest(tmsUrl + "/query/OrderPartInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.totalPagesNum = res.pageInfo.total;
                        that.pageInfo = res.pageInfo;
                        that.currentPage = 1;
                        $(".paging .pagingCon .pagination").animate({
                            "left": "0px"
                        },300);
                        that.pageList = [];
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    imitatePopup("上传文件失败","alert");
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    //	console.error(e);
                }
            });
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
        addOrderDetails(template){
            this.templateTitle = template;
        },
        exportShippingOrder(){   //导出配送订单
            var that = this;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                $(".ajax-load-pupup1").show();
                var queryParam = that.publicGetQueryParam('1');
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/doOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },1000)
            }else{
                $(".ajax-load-pupup1").show();
                var queryParam = that.publicGetQueryParam('0');
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/doOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },3000)
            }
        },
        exportShippingOrderReport(){   //导出配送订单
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
            window.location.href = tmsUrl + "/export/doOrderReport?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportShippingOrderDetailReport(){   //导出配送订单
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
            window.location.href = tmsUrl + "/export/doOrderDetailReport?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        publicGetQueryParam(type){
            var that = this;
            var searchFormArr = {};
            switch(type)
            {
                case '0':

                    break;
                case '1':
                    searchFormArr = this.queryParam;
                    var startTimeVal =that.timeHorizon.split(" - ")[0];
                    var endTimeVal =that.timeHorizon.split(" - ")[1];
                    searchFormArr.startCreateTime = startTimeVal;
                    searchFormArr.endCreateTime = endTimeVal;
                    searchFormArr.isHaulOrder = true;
                    break;
            }
            return searchFormArr;
        },
        carrierPartyList(params,id){
            var that = this;
            getRequest(cmdUrl + "/cdParty/selectPartyOneModel?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+id+"&isDefault=1&locationType=OTHER",function(res){
                that.OrderCarrierDriver = res.result.imgContactList[0];
                that.OrderCarrierEqp = res.result.eqpList[0];
                that.OrderCarrierContact = res.result.imgContactList[0];
                that.OrderCarrierParty = res.result.cdParty;
            })
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
        createSendsingle(){
            if(this.checkedNum == 0){
                imitatePopup("请先勾选至少一条订单行！","alert");
                return false;
            }
            //生成派送单
            var that = this;
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
                params.push({
                    refId:that.checkedOperaOrder[i].omOrderId,
                    refNo:that.checkedOperaOrder[i].orderNo
                })
            }
            postRequest(tmsUrl + "/generate/tjoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.result  == true){
                    imitatePopup("生成派送单成功","alert");
                    $(".reportMessages table tr .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                    that.checkedNum = 0;
                    var searchFormArr = that.queryParam;
                    var startTimeVal =that.timeHorizon.split(" - ")[0];
                    var endTimeVal =that.timeHorizon.split(" - ")[1];
                    searchFormArr.startCreateTime = startTimeVal;
                    searchFormArr.endCreateTime = endTimeVal;
                    searchFormArr.isHaulOrder = true;
                    searchFormArr.pageInfo = {
                        pageNum:that.currentPage,
                        pageSize:that.queryPageSize
                    }
                    postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.publicChangeBtnStatus();
                    })

                }else{
                    imitatePopup("生成派送单失败，请稍后重试！","alert");
                    $(".reportMessages table tr .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                    that.checkedNum = 0;
                }

            })
        },
        orderCancel(){
            var that = this;
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请至少勾选一条数据行","alert");
                return  false;
            }
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
//              params.push({
//                  orderId: that.checkedOperaOrder[i].omOrderId,
//                  actCode: "FREEZE",
//                  orderNo: that.checkedOperaOrder[i].orderNo
//              })
                params.push({
                    refId: that.checkedOperaOrder[i].omOrderId,
                    refNo:that.checkedOperaOrder[i].orderNo
                })
            }
            var that = this;
            postRequest(tmsUrl + "/delete/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
                if(data.result.success == true ){
                    imitatePopup("订单取消成功","alert");
                    var searchFormArr = that.queryParam;
                    var startTimeVal =that.timeHorizon.split(" - ")[0];
                    var endTimeVal =that.timeHorizon.split(" - ")[1];
                    searchFormArr.startCreateTime = startTimeVal;
                    searchFormArr.endCreateTime = endTimeVal;
                    searchFormArr.isHaulOrder = true;
                    searchFormArr.pageInfo = {
                        pageNum: that.currentPage,
                        pageSize:that.queryPageSize
                    }
                    $(".reportMessages table tr .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                    that.checkedNum = 0;
                    postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                }else{
                    imitatePopup(data.result.message,"alert");
                    $(".reportMessages table tr .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                    that.checkedNum = 0;
                }
            })
        },
        getOrderDetails(template,order,isAbnormalPage){
            this.abnormalPage = isAbnormalPage;
            if(this.abnormalPage == 2){
                $('.receiptTaskDivs').eq(0).show();
                $('.receiptTaskDivs').eq(1).hide();
                $('.receiptTaskDivs').eq(2).hide();
                $(".taskOrderItemDiv").eq(0).find("p").css({"background-color":"#00365b","background-image": "url(../../img/select.png)"});
            }
            this.templateTitle = template;
            this.currentOrderId = order.omOrderId;
            this.isShowSplitList = "0";
            var that = this;
            that.orderSplitPassList = [];
            that.splitType = 'master';
            that.splitCount = '';
            getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.order.orderType == "DO"){
                    that.isShippingOrder = true;
                }else{
                    that.isShippingOrder = false;
                }

                // 分单显示数据
                if(data.result.shipperPartyInfo != null && data.result.receiptPartyInfo != null){
                    // 起点
                    that.orderSplitBeginInfo = {
                        orderModel: "提货任务",
                        partyInfoModel: {
                            imgContact: {
                                contactName: data.result.shipperPartyInfo.imgContact.contactName,
                                contactTel: data.result.shipperPartyInfo.imgContact.contactTel
                            },
                            location: {
                                address: data.result.shipperPartyInfo.location.address,
                                street: data.result.shipperPartyInfo.location.street,
                                postCode: data.result.shipperPartyInfo.location.postCode,
                                districtCode: data.result.shipperPartyInfo.location.districtCode,
                                cityCode: data.result.shipperPartyInfo.location.cityCode,
                                provinceCode: data.result.shipperPartyInfo.location.provinceCode,
                                countryCode: "100000"
                            }
                        }
                    }
                    // 终点
                    that.orderSplitEndInfo = {
                        orderModel: "提货任务",
                        partyInfoModel: {
                            imgContact: {
                                contactName: data.result.receiptPartyInfo.imgContact.contactName,
                                contactTel: data.result.receiptPartyInfo.imgContact.contactTel
                            },
                            location: {
                                address: data.result.receiptPartyInfo.location.address,
                                street: data.result.receiptPartyInfo.location.street,
                                postCode: data.result.receiptPartyInfo.location.postCode,
                                districtCode: data.result.receiptPartyInfo.location.districtCode,
                                cityCode: data.result.receiptPartyInfo.location.cityCode,
                                provinceCode: data.result.receiptPartyInfo.location.provinceCode,
                                countryCode: "100000"
                            }
                        }
                    }
                }else{
                    that.orderSplitBeginInfo = that.billTask;
                    that.orderSplitEndInfo = that.billTask;
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
                    that.orderDetail.completeTime = timestampToTime2(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime2(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime2(null);
                    that.orderDetail.expireTime = timestampToTime2(null);
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
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:""
                    };
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {};
                    that.OrderCarrierLocation = {};
                }
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
        changeOrderDetails(template){
            this.templateTitle = template;
        },
        getLogisticsInfo(orderInfo){
            //物流信息
            var that = this;
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
                if(data.result.actList != null) {
                    for (var i = 0; i < data.result.actList.length; i++) {
                        if (data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == "") {

                        } else {
                            waypointsArr.push([data.result.actList[i].latLng.split(",")[0], data.result.actList[i].latLng.split(",")[1]]);
                        }
                    }
                }
                getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+orderInfo.omOrderId,function(res){
                    that.orderLogisticsInfo = res.result.order;
                    if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null){
                        that.orderLogisticsInfo["sfrAddress"] = res.result.shipperPartyInfo.location.address;
                    }
                    if(res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.address != null){
                        that.orderLogisticsInfo["stoAddress"] = res.result.receiptPartyInfo.location.address;
                    }

                    if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null && res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.address != null){
                        mapFunction(res.result.receiptPartyInfo,res.result.shipperPartyInfo,waypointsArr);
                    }else{
                        mapFunction();
                    }
                })
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
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:12
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
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum:1,
                pageSize:12
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
                    pageSize:12
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
        getSearchVal1(){ // 查询 - 合作商
            var that = this;
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:12
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
                pageSize:12
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
                pageSize:12
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
        selectPaFun(partyItem,index){ // 选择合作商 - tr
            var that = this;
            partyItem.cdPartyId = undefined;
            $(".maskLayer1").hide();
        },
        selectCtFun(contactItem,index){ // 选择联系人 - tr
            var that = this;
            contactItem.cdContactId = undefined;
            $(".maskLayer1").hide();
        },
        selectAddress(addressItem,index){ // 选择地址 - tr
            var that = this;
            var cdLocationId = addressItem.cdLocationId;
            addressItem.cdLocationId = undefined;
            $(".maskLayer1").hide();
        },
        opOrCloDetail(){
            var that = this;
            if(that.isOpOrCloDetail == 0){
                $(".adsRightConItemAndFreely").show();
                $(".openDetailButton").html('收起总单详情');
                that.isOpOrCloDetail = 1;
            }else{
                $(".adsRightConItemAndFreely").hide();
                $(".openDetailButton").html('查看总单详情');
                that.isOpOrCloDetail = 0;
            }
        },
        openAddressInfo(index){
            var that = this;
            if(that.isOpOrCloAddressInfos.indexOf(index) == -1){
                that.isOpOrCloAddressInfos.push(index);
            }
            for(var i=0;i<that.isOpOrCloAddressInfos.length;i++){
                if(that.isOpOrCloAddressInfos[i] != undefined){
                    $(".childOrderAddress").eq(that.isOpOrCloAddressInfos[i]).show();
                    $(".txta2").eq(that.isOpOrCloAddressInfos[i]).show();
                    $(".txta1").eq(that.isOpOrCloAddressInfos[i]).hide();
                }
            }
        },
        closeAddressInfo(index){
            var that = this;
            that.isOpOrCloAddressInfos.remove(index);
            $(".childOrderAddress").eq(index).hide();
            $(".txta1").eq(index).show();
            $(".txta2").eq(index).hide();
        },
        createOrderSplit(){
            var that = this;
            $(".childOrderAddress").hide();
            $(".txta2").hide();
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
                    for(var i=0;i<that.orderSplitList.length;i++){
                        that.orderSplitList[i].shipperPartyInfo = {
                            party: {
                                powerDto: that.shipperParty.powerDto,
                                authority: that.shipperParty.authority,
                                rowStatus: that.shipperParty.rowStatus,
                                pageInfo: that.shipperParty.pageInfo,
                                omPartyId: that.shipperParty.omPartyId,
                                refId: that.shipperParty.refId,
                                refTo: that.shipperParty.refTo,
                                partyType: that.shipperParty.partyType,
                                partyName: that.shipperParty.partyName,
                                partyCode: that.shipperParty.partyCode,
                                partyAbbr: that.shipperParty.partyAbbr,
                                isBuyer: that.shipperParty.isBuyer,
                                isVendor: that.shipperParty.isVendor,
                                isTruck: that.shipperParty.isTruck,
                                isWarehouse: that.shipperParty.isWarehouse,
                                is3pl: that.shipperParty.is3pl,
                                str1: that.shipperParty.str1,
                                str2: that.shipperParty.str2,
                                str3: that.shipperParty.str3,
                                umUserId: that.shipperParty.umUserId,
                                umTenantId: that.shipperParty.umTenantId,
                                createTime: that.shipperParty.createTime,
                                updateTime: that.shipperParty.updateTime,
                                ext: that.shipperParty.ext,
                                extList: that.shipperParty.extList,
                                modifyRow: that.shipperParty.modifyRow,
                                addRow: that.shipperParty.addRow,
                                initilRow: that.shipperParty.initilRow,
                                deletedRow: that.shipperParty.deletedRow,
                            },
                            imgContact: {
                                powerDto: that.shipperPartyContact.powerDto,
                                authority: that.shipperPartyContact.authority,
                                rowStatus: that.shipperPartyContact.rowStatus,
                                pageInfo: that.shipperPartyContact.pageInfo,
                                omContactId: that.shipperPartyContact.omContactId,
                                refId: that.shipperPartyContact.refId,
                                refTo: that.shipperPartyContact.refTo,
                                contactType: that.shipperPartyContact.contactType,
                                contactName: that.shipperPartyContact.contactName,
                                contactTel: that.shipperPartyContact.contactTel,
                                contactEmail: that.shipperPartyContact.contactEmail,
                                contactAddress: that.shipperPartyContact.contactAddress,
                                remark: that.shipperPartyContact.remark,
                                umUserId: that.shipperPartyContact.umUserId,
                                umTenantId: that.shipperPartyContact.umTenantId,
                                createTime: that.shipperPartyContact.createTime,
                                updateTime: that.shipperPartyContact.updateTime,
                                ext: that.shipperPartyContact.ext,
                                extList: that.shipperPartyContact.extList,
                                modifyRow: that.shipperPartyContact.modifyRow,
                                addRow: that.shipperPartyContact.addRow,
                                initilRow: that.shipperPartyContact.initilRow,
                                deletedRow: that.shipperPartyContact.deletedRow
                            },
                            contact: {
                                powerDto: that.shipperPartyLocationContact.powerDto,
                                authority: that.shipperPartyLocationContact.authority,
                                rowStatus: that.shipperPartyLocationContact.rowStatus,
                                pageInfo: that.shipperPartyLocationContact.pageInfo,
                                omContactId: that.shipperPartyLocationContact.omContactId,
                                refId: that.shipperPartyLocationContact.refId,
                                refTo: that.shipperPartyLocationContact.refTo,
                                contactType: that.shipperPartyLocationContact.contactType,
                                contactName: that.shipperPartyLocationContact.contactName,
                                contactTel: that.shipperPartyLocationContact.contactTel,
                                contactEmail: that.shipperPartyLocationContact.contactEmail,
                                contactAddress: that.shipperPartyLocationContact.contactAddress,
                                remark: that.shipperPartyLocationContact.remark,
                                umUserId: that.shipperPartyLocationContact.umUserId,
                                umTenantId: that.shipperPartyLocationContact.umTenantId,
                                createTime: that.shipperPartyLocationContact.createTime,
                                updateTime: that.shipperPartyLocationContact.updateTime,
                                ext: that.shipperPartyLocationContact.ext,
                                extList: that.shipperPartyLocationContact.extList,
                                modifyRow: that.shipperPartyLocationContact.modifyRow,
                                addRow: that.shipperPartyLocationContact.addRow,
                                initilRow: that.shipperPartyLocationContact.initilRow,
                                deletedRow: that.shipperPartyLocationContact.deletedRow
                            },
                            location: {
                                powerDto: that.shipperPartyLocation.powerDto,
                                authority: that.shipperPartyLocation.authority,
                                rowStatus: that.shipperPartyLocation.rowStatus,
                                pageInfo: that.shipperPartyLocation.pageInfo,
                                omLocationId: that.shipperPartyLocation.omLocationId,
                                refId: that.shipperPartyLocation.refId,
                                refTo: that.shipperPartyLocation.refTo,
                                seq: that.shipperPartyLocation.seq,
                                locationType: that.shipperPartyLocation.locationType,
                                locationName: that.shipperPartyLocation.locationName,
                                locationCode: that.shipperPartyLocation.locationCode,
                                latLng: that.shipperPartyLocation.latLng,
                                lng: that.shipperPartyLocation.lng,
                                lat: that.shipperPartyLocation.lat,
                                address: that.shipperPartyLocation.address,
                                street: that.shipperPartyLocation.street,
                                postCode: that.shipperPartyLocation.postCode,
                                districtCode: that.shipperPartyLocation.districtCode,
                                cityCode: that.shipperPartyLocation.cityCode,
                                provinceCode: that.shipperPartyLocation.provinceCode,
                                countryCode: that.shipperPartyLocation.countryCode,
                                umUserId: that.shipperPartyLocation.umUserId,
                                umTenantId: that.shipperPartyLocation.umTenantId,
                                createTime: that.shipperPartyLocation.createTime,
                                updateTime: that.shipperPartyLocation.updateTime,
                                ext: that.shipperPartyLocation.ext,
                                extList: that.shipperPartyLocation.extList,
                                modifyRow: that.shipperPartyLocation.modifyRow,
                                addRow: that.shipperPartyLocation.addRow,
                                initilRow: that.shipperPartyLocation.initilRow,
                                deletedRow: that.shipperPartyLocation.deletedRow
                            },
                            eqp: null
                        };
                        that.orderSplitList[i].receiptPartyInfo = {
                            party: {
                                powerDto: that.receiptParty.powerDto,
                                authority: that.receiptParty.authority,
                                rowStatus: that.receiptParty.rowStatus,
                                pageInfo: that.receiptParty.pageInfo,
                                omPartyId: that.receiptParty.omPartyId,
                                refId: that.receiptParty.refId,
                                refTo: that.receiptParty.refTo,
                                partyType: that.receiptParty.partyType,
                                partyName: that.receiptParty.partyName,
                                partyCode: that.receiptParty.partyCode,
                                partyAbbr: that.receiptParty.partyAbbr,
                                isBuyer: that.receiptParty.isBuyer,
                                isVendor: that.receiptParty.isVendor,
                                isTruck: that.receiptParty.isTruck,
                                isWarehouse: that.receiptParty.isWarehouse,
                                is3pl: that.receiptParty.is3pl,
                                str1: that.receiptParty.str1,
                                str2: that.receiptParty.str2,
                                str3: that.receiptParty.str3,
                                umUserId: that.receiptParty.umUserId,
                                umTenantId: that.receiptParty.umTenantId,
                                createTime: that.receiptParty.createTime,
                                updateTime: that.receiptParty.updateTime,
                                ext: that.receiptParty.ext,
                                extList: that.receiptParty.extList,
                                modifyRow: that.receiptParty.modifyRow,
                                addRow: that.receiptParty.addRow,
                                initilRow: that.receiptParty.initilRow,
                                deletedRow: that.receiptParty.deletedRow,
                            },
                            imgContact: {
                                powerDto: that.receiptPartyContact.powerDto,
                                authority: that.receiptPartyContact.authority,
                                rowStatus: that.receiptPartyContact.rowStatus,
                                pageInfo: that.receiptPartyContact.pageInfo,
                                omContactId: that.receiptPartyContact.omContactId,
                                refId: that.receiptPartyContact.refId,
                                refTo: that.receiptPartyContact.refTo,
                                contactType: that.receiptPartyContact.contactType,
                                contactName: that.receiptPartyContact.contactName,
                                contactTel: that.receiptPartyContact.contactTel,
                                contactEmail: that.receiptPartyContact.contactEmail,
                                contactAddress: that.receiptPartyContact.contactAddress,
                                remark: that.receiptPartyContact.remark,
                                umUserId: that.receiptPartyContact.umUserId,
                                umTenantId: that.receiptPartyContact.umTenantId,
                                createTime: that.receiptPartyContact.createTime,
                                updateTime: that.receiptPartyContact.updateTime,
                                ext: that.receiptPartyContact.ext,
                                extList: that.receiptPartyContact.extList,
                                modifyRow: that.receiptPartyContact.modifyRow,
                                addRow: that.receiptPartyContact.addRow,
                                initilRow: that.receiptPartyContact.initilRow,
                                deletedRow: that.receiptPartyContact.deletedRow
                            },
                            contact: {
                                powerDto: that.receiptPartyLocationContact.powerDto,
                                authority: that.receiptPartyLocationContact.authority,
                                rowStatus: that.receiptPartyLocationContact.rowStatus,
                                pageInfo: that.receiptPartyLocationContact.pageInfo,
                                omContactId: that.receiptPartyLocationContact.omContactId,
                                refId: that.receiptPartyLocationContact.refId,
                                refTo: that.receiptPartyLocationContact.refTo,
                                contactType: that.receiptPartyLocationContact.contactType,
                                contactName: that.receiptPartyLocationContact.contactName,
                                contactTel: that.receiptPartyLocationContact.contactTel,
                                contactEmail: that.receiptPartyLocationContact.contactEmail,
                                contactAddress: that.receiptPartyLocationContact.contactAddress,
                                remark: that.receiptPartyLocationContact.remark,
                                umUserId: that.receiptPartyLocationContact.umUserId,
                                umTenantId: that.receiptPartyLocationContact.umTenantId,
                                createTime: that.receiptPartyLocationContact.createTime,
                                updateTime: that.receiptPartyLocationContact.updateTime,
                                ext: that.receiptPartyLocationContact.ext,
                                extList: that.receiptPartyLocationContact.extList,
                                modifyRow: that.receiptPartyLocationContact.modifyRow,
                                addRow: that.receiptPartyLocationContact.addRow,
                                initilRow: that.receiptPartyLocationContact.initilRow,
                                deletedRow: that.receiptPartyLocationContact.deletedRow
                            },
                            location: {
                                powerDto: that.receiptPartyLocation.powerDto,
                                authority: that.receiptPartyLocation.authority,
                                rowStatus: that.receiptPartyLocation.rowStatus,
                                pageInfo: that.receiptPartyLocation.pageInfo,
                                omLocationId: that.receiptPartyLocation.omLocationId,
                                refId: that.receiptPartyLocation.refId,
                                refTo: that.receiptPartyLocation.refTo,
                                seq: that.receiptPartyLocation.seq,
                                locationType: that.receiptPartyLocation.locationType,
                                locationName: that.receiptPartyLocation.locationName,
                                locationCode: that.receiptPartyLocation.locationCode,
                                latLng: that.receiptPartyLocation.latLng,
                                lng: that.receiptPartyLocation.lng,
                                lat: that.receiptPartyLocation.lat,
                                address: that.receiptPartyLocation.address,
                                street: that.receiptPartyLocation.street,
                                postCode: that.receiptPartyLocation.postCode,
                                districtCode: that.receiptPartyLocation.districtCode,
                                cityCode: that.receiptPartyLocation.cityCode,
                                provinceCode: that.receiptPartyLocation.provinceCode,
                                countryCode: that.receiptPartyLocation.countryCode,
                                umUserId: that.receiptPartyLocation.umUserId,
                                umTenantId: that.receiptPartyLocation.umTenantId,
                                createTime: that.receiptPartyLocation.createTime,
                                updateTime: that.receiptPartyLocation.updateTime,
                                ext: that.receiptPartyLocation.ext,
                                extList: that.receiptPartyLocation.extList,
                                modifyRow: that.receiptPartyLocation.modifyRow,
                                addRow: that.receiptPartyLocation.addRow,
                                initilRow: that.receiptPartyLocation.initilRow,
                                deletedRow: that.receiptPartyLocation.deletedRow
                            },
                            eqp: null
                        }
                    }
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
                }
                that.getSearchVal(1);
                closeSideslip();
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
            searchFormArr.isHaulOrder = true;
            searchFormArr.pageInfo = {
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".reportMessages table tr .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            that.checkedNum = 0;
            //获取订单列表
            postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                //console.log(res.result);
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
            that.queryParam = {
                orderNature: "",
                origin: "",
                completeStatus:"",
                exceptionStatus:"",
                activeStatus:"",
                actCode:"",
                subtasksStatus:"",
            }
        },
        getSearchVal(showPageNum){
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                if(startTimeVal == "" && endTimeVal == ""){
                    startTimeVal = getQueryTime(1);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
                searchFormArr.startCreateTime = startTimeVal;
                searchFormArr.endCreateTime = endTimeVal;
                searchFormArr.isHaulOrder = true;
                if(showPageNum == 1){
                    searchFormArr.pageInfo = {
                        pageNum:that.currentPage,
                        pageSize:that.queryPageSize
                    }
                }else {
                    searchFormArr.pageInfo = {
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    }
                }
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
                //获取订单列表
                postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.totalPagesNum = res.pageInfo.total;
                    that.currentPage = 1;
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            }else{
                imitatePopup("请输入大于1且小于2000的正整数","alert");
                return false;
            }

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
                                        if(permissionListObj[i].objectCode == "UPLOAD"){
                                            $(".fileUploadHint").css({"display":"inline-block"});
                                        }
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
        },
        //分单增加途经点
        addPassAddress(){
            var that = this;
            that.orderSplitPassList.push({
                orderModel: "提货任务",
                partyInfoModel:{
                    imgContact: {
                        contactName: '',
                        contactTel: '',
                    },
                    location: {
                        address: "",
                        street: [],
                        postCode: "",
                        districtCode: "",
                        cityCode: "",
                        provinceCode: "",
                        countryCode: "100000"
                    }
                }
            });
        },
        // 删除途经点
        deletePassItem(index){
            var that = this;
            that.orderSplitPassList.splice(index,1)
        },
        //保存分单订单
        savePartOrderInfo(){
            var that = this;
            that.singleHouseOrderList = [];
            that.singleHouseOrderList.push(that.orderSplitBeginInfo);
            if(that.orderSplitPassList.length > 0){
                for(var i=0;i<that.orderSplitPassList.length;i++){
                    that.singleHouseOrderList.push(that.orderSplitPassList[i])
                }
            }
            that.singleHouseOrderList.push(that.orderSplitEndInfo);
            for(var j=0;j<that.singleHouseOrderList.length;j++){
                var party = that.singleHouseOrderList[j].partyInfoModel;
                if(party.imgContact.contactName == '' || party.imgContact.contactTel == '' ||
                    party.location.provinceCode == '' || party.location.cityCode == '' ||
                    party.location.districtCode == '' || party.location.street == ''){
                    imitatePopup("请填写完整分单信息","alert")
                    return false;
                }
            }

            var params = {
                masterOrderId:that.currentOrderId,
                masterOrderType:that.masterOrderType,
                houseOrderList:that.singleHouseOrderList
            };
            postRequest(tmsUrl + "/part/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                if(res.msg == 'success' || res.msg == 'SUCCESS'){
                    if(res.msg.success == false){
                        imitatePopup(res.msg.message,"alert");
                        return false;
                    }
                }
                that.getSearchVal(1);
                closeSideslip();
            })
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        getDriverInfo(val){ // 新建班次--司机姓名联想
            this.publicGetDriverInfo(val,1);
        },
        getDriverInfo1(val){ // 修改司机信息--司机姓名联想
            this.publicGetDriverInfo(val,2);
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
        addOrderCarrierFun(){
            var that = this;
            that.OrderCarrierDriver = {
                cdContactId:""
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
    },
    created:function(){
        this.timeHorizon = getQueryTime(1)+" - "+ getQueryTime(-10);
        $(".childOrderAddress").hide();
        $(".txta2").hide();
        var searchFormArr = {
            startCreateTime: getQueryTime(1),
            isHaulOrder:true,
            pageInfo:{
                pageNum:1,
                pageSize:this.queryPageSize
            }
        }
        this.OrderCarrier = {}
        this.OrderCarrierContact = {}
        this.OrderCarrierDriver = {}
        this.OrderCarrierEqp = {}
        var that = this;
        that.sfrCountryList = getCountryData();
        that.dpDistrictList = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.linkHrefs = getJumpLinkList(that.linkNames);
        initSelectData(that);
        this.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(tmsUrl + "/query/OrderPartInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
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
            if(data.result != null) {
                if (data.result.length > 0) {
                    that.resPartyList = data.result;
                }
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

function mapFunction(sfrAddress,stoAddress,wayPoint){
    if(sfrAddress == null || stoAddress == null || sfrAddress.location.latLng == null || stoAddress.location.latLng == null){
        imitatePopup("收发货地址不全，暂时无法显示轨迹信息","alert");
        var map = new AMap.Map("container", {
            mapStyle: 'amap://styles/' + AmapQdStyle_white,
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
            mapStyle: 'amap://styles/' + AmapQdStyle_white,
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
        orderNature: "",
        origin: "",
        completeStatus:"",
        exceptionStatus:"",
        activeStatus:"",
        actCode:"",
        subtasksStatus:"",
    }

    that.billTask = {
        orderModel: "提货任务",
        partyInfoModel:{
            imgContact: {
                contactName: '',
                contactTel: '',
            },
            location: {
                address: "",
                street: [],
                postCode: "",
                districtCode: "",
                cityCode: "",
                provinceCode: "",
                countryCode: "100000"
            }
        }
    }

    that.orderSplitBeginInfo = that.billTask;
    that.orderSplitEndInfo = that.billTask;

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

