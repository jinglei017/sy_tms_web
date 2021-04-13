var app = new Vue({
    el: '#overall',
    data: {
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isDisable:false,
        searchInf:[],
        currentPage:1,
        currentPage1:1,
        currentPage2:1,
        currentPage3:1,
        queryPageSize:20,
	    multipleNum:12,
        queryModelPageSize:12, // 弹窗中的分页（一页12条）
        pageList:[],
        pageList1:[],
        pageList2:[],
        pageList3:[],
        totalPagesNum1 :"",
        totalPagesNum2 :"",
        totalPagesNum3 :"",
        totalList:[],
        orderDetail:{},
        logininf:{},
        partyCode:"",
        contactList:{},
        addressList:{},
        deviceList:{},
        currentCotactIndex:"",
        currentArIndex:'',
        templateTitle:"新增联系人",
        deviceInfo:{
            eqpName:"",
            eqpType:"",
            eqpNo:"",
            isDefault:"",
            eqpStr1:"",
            eqpStr2:""
        },
        eqpContactList:[{
            contactType:"",
            contactName:"",
            contactTel:"",
            contactEmail:"",
            contactAddress:"",
            remark:"",
            isDefault:""
        }],
        locationContactList:[{
            locationType:"",
            countryCode:"100000",
            provinceCode:"",
            cityCode:"",
            districtCode:"",
            isDefault:"",
            address:""
        }],
        queryParam:{
            refType:"",
            eqpType:""
        },
        popupType:"",
        savedNewOrderInfo:'0',
        address0:"",
        address1:"",
        address2:"",
        address3:"",
        addContType:"-1",
        modelInfo:{
            refCode:"",
            refName:"",
            refType:""
        },
        queryParam1:{},
        queryParam2:{
            contactType:""
        },
        queryParam3:{
            eqpType:""
        },
        cdEqpLnkId:"",
        clearShow:true,
        getAllCountryList:{}, // 国家列表
        linkNames: ["车辆管理","车辆模板管理"],
        linkHrefs: []
    },
    methods:{
        chooseTheFileType(type){
            switch(type)
            {
                case '0': // 上传设备联系人数据
                    $('#excelFile').addClass('uploadType1');
                    break;
            }
            $('#excelFile').click();
        },
        chooseTheFile(){
            var that = this;
            that.clearShow = false;
            if($('#excelFile').hasClass('uploadType1')){
                that.filesUpload('0');
            }
        },
        filesUpload(type){
            var that = this;
            switch(type)
            {
                case '0': // 上传设备联系人数据
                    fileUploadRequest(cmdUrl + '/import/eqpContactLnkData.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,function(res){
                        that.filesUploadSuc();
                    });
                    break;
            }
        },
        filesUploadSuc(){
            var that = this;
            that.clearShow = true;
            setTimeout(function(){
                $(".fileUploadLi .inputBox").css({"display":"inline-block"});
            },100);
            $(".ajax-load-pupup").remove();
            //获取列表
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            //获取订单列表
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
            })

        },
        changeAddContType(addContType){
            var that = this,txt = '';
            $.each(that.selectListData.eqpRefTypeList, function (indexs, val) {
                if (val.code == addContType) {
                    txt = val.text;
                }
            });
            if(isContains(txt, '人')){
                that.addContType = '0';
            }else{
                if(isContains(txt, '地址')){
                    that.addContType = '1';
                }else{
                    that.addContType = '-1';
                }
            }
        },
        addOrderDetails(title){ // 新增
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.partyCode = that.logininf.userPartyNo;
            that.isDisable = false;
            that.deviceInfo = {
                eqpName:"",
                eqpType:"",
                eqpNo:"",
                isDefault:"",
                eqpStr1:"",
                eqpStr2:""
            };
            that.eqpContactList = [{
                contactType:"",
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:"",
                remark:"",
                isDefault:""
            }];
            that.locationContactList = [{
                locationType:"",
                countryCode:"100000",
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:"",
                address:""
            }];
            that.savedNewOrderInfo = '0';
            that.addContType = '-1';
            that.modelInfo = {
                refCode:"",
                refName:"",
                refType:""
            };
            that.resetAddressParamFun('1');
        },
        getOrderDetails(title,dpItem){ // 详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.eqpContactList = [{
                contactType:"",
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:"",
                remark:"",
                isDefault:""
            }];
            that.locationContactList = [{
                locationType:"",
                countryCode:"100000",
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:"",
                address:""
            }];
            getRequest(cmdUrl + "/get/cdEqpLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdEqpLnkId="+dpItem.cdEqpLnkId,function(res){
                if(res.result != null){
                    that.cdEqpLnkId = res.result.cdEqpLnkId;
                    that.modelInfo = { // 模板信息
                        refCode:res.result.refCode,
                        refName:res.result.refName,
                        refType:res.result.refType
                    };
                    that.changeAddContType(that.modelInfo.refType);
                    // 设备信息
                    var params0 = {
                        cdEqpId:res.result.cdEqpId
                    };
                    postRequest(cmdUrl + "/get/eqpVoListByEqpVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params0,function(res){
                        that.deviceInfo = res.result[0];
                    });
                    // 关联模板
                    var params2 = {};
                    switch(that.addContType)
                    {
                        case '-1': // 设备模板 - 其他

                            break;
                        case '0': // 设备模板 - 人
                            params2 = {
                                cdContactId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/contactVoListByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.eqpContactList = res.result;
                                that.partyCode = res.result[0].partyCode;
                            });
                            break;
                        case '1': // 设备模板 - 地址
                            params2 = {
                                cdLocationId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/locationVoListByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.locationContactList = res.result;
                                that.partyCode = res.result[0].partyCode;
                            });
                            break;
                    }
                }else{
                    that.cdEqpLnkId = "";
                    that.modelInfo = { // 模板信息
                        refCode:"",
                        refName:"",
                        refType:""
                    };
                    that.addContType = '-1';
                    that.deviceInfo = { // 设备信息
                        eqpName:"",
                        eqpType:"",
                        eqpNo:"",
                        isDefault:"",
                        eqpStr1:"",
                        eqpStr2:""
                    };
                }
            })
        },
        changeOrderDetails(title,dpItem){ // 修改
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.savedNewOrderInfo = '1';
            that.eqpContactList = [{
                contactType:"",
                contactName:"",
                contactTel:"",
                contactEmail:"",
                contactAddress:"",
                remark:"",
                isDefault:""
            }];
            that.locationContactList = [{
                locationType:"",
                countryCode:"100000",
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:"",
                address:""
            }];
            getRequest(cmdUrl + "/get/cdEqpLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdEqpLnkId="+dpItem.cdEqpLnkId,function(res){
                if(res.result != null){
                    that.cdEqpLnkId = res.result.cdEqpLnkId;
                    that.modelInfo = { // 模板信息
                        refCode:res.result.refCode,
                        refName:res.result.refName,
                        refType:res.result.refType
                    };
                    that.changeAddContType(that.modelInfo.refType);
                    // 设备信息
                    var params0 = {
                        cdEqpId:res.result.cdEqpId
                    };
                    postRequest(cmdUrl + "/get/eqpVoListByEqpVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params0,function(res){
                        that.deviceInfo = res.result[0];
                    });
                    // 关联模板
                    var params2 = {};
                    switch(that.addContType)
                    {
                        case '-1': // 设备模板 - 其他

                            break;
                        case '0': // 设备模板 - 人
                            params2 = {
                                cdContactId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/contactVoListByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.eqpContactList = res.result;
                                that.partyCode = res.result[0].partyCode;
                            });
                            break;
                        case '1': // 设备模板 - 地址
                            params2 = {
                                cdLocationId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/locationVoListByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.locationContactList = res.result;
                                that.partyCode = res.result[0].partyCode;
                            });
                            break;
                    }
                }else{
                    that.cdEqpLnkId = "";
                    that.modelInfo = { // 模板信息
                        refCode:"",
                        refName:"",
                        refType:""
                    };
                    that.addContType = '-1';
                    that.deviceInfo = { // 设备信息
                        eqpName:"",
                        eqpType:"",
                        eqpNo:"",
                        isDefault:"",
                        eqpStr1:"",
                        eqpStr2:""
                    };
                }
            })
        },
        deleteOrderDetails(dpItem){
            var that = this;
            var r = confirm("确定删除当前设备模板");
            if (r==true){
                getRequest(cmdUrl + "/delete/cdEqpLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdEqpLnkId="+dpItem.cdEqpLnkId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        that.totalList = [];
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                })
            }
        },
        defaultOrderDetails(partyItem,type){ // 设为默认、取消默认
            var that = this,params = {};
            switch(type)
            {
                case '1': // 设为默认
                    cdEqpLnkId = partyItem.cdEqpLnkId;
                    isDefault=1;
                    break;
                case '0': // 取消默认
                    cdEqpLnkId = partyItem.cdEqpLnkId;
                    isDefault=0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultEqpLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdEqpLnkId="+cdEqpLnkId+"&isDefault="+isDefault,function(res){
                //获取订单列表
                var searchFormArr = {
                    pageInfo:{
                        pageNum:1,
                        pageSize:that.queryPageSize
                    }
                };
                //获取订单列表
                postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.tableOrderList = res.result;
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    for(var n = 0 ; n < res.pageInfo.total;n++){
                        that.totalList[n] = n + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            })
        },
        saveNewOrderInfo(){ // 新增设备模板信息
            var that = this,param;
            if(that.partyCode =='' || that.partyCode ==null || that.partyCode == undefined){
                imitatePopup("请输入合作商编码",'alert');
                return false;
            }
            if(that.addContType == '-1'){
                imitatePopup("请选择模板类型","alert");
                return false;
            }
            if(that.modelInfo.refName =='' || that.modelInfo.refName == null || that.modelInfo.refName == undefined){
                imitatePopup("请输入模板名称",'alert');
                return false;
            }
            if(that.deviceInfo.eqpName == '' || that.deviceInfo.eqpName == undefined){
                imitatePopup("请输入设备名称","alert");
                return false;
            }
            if(that.deviceInfo.eqpType == ''){
                imitatePopup("请选择设备类型",'alert');
                return false;
            }
            if(that.deviceInfo.eqpBrand == '' || that.deviceInfo.eqpBrand == null || that.deviceInfo.eqpBrand == undefined){
                imitatePopup("请输入设备品牌",'alert');
                return false;
            }
            if(that.deviceInfo.eqpSpec == '' || that.deviceInfo.eqpSpec == null || that.deviceInfo.eqpSpec == undefined){
                imitatePopup("请输入设备型号",'alert');
                return false;
            }
            if(that.deviceInfo.eqpNo == '' || that.deviceInfo.eqpNo == null || that.deviceInfo.eqpNo == undefined){
                imitatePopup("请输入设备号",'alert');
                return false;
            }
            if(that.deviceInfo.eqpLength == '' || that.deviceInfo.eqpLength == null || that.deviceInfo.eqpLength == undefined){
                imitatePopup("请输入车长",'alert');
                return false;
            }
            if(that.deviceInfo.eqpWidth == '' || that.deviceInfo.eqpWidth == null || that.deviceInfo.eqpWidth == undefined){
                imitatePopup("请输入车宽",'alert');
                return false;
            }
            if(that.deviceInfo.eqpHeight == '' || that.deviceInfo.eqpHeight == null || that.deviceInfo.eqpHeight == undefined){
                imitatePopup("请输入车高",'alert');
                return false;
            }
            switch(that.addContType)
            {
                case '0':
                    if(that.eqpContactList[0].contactType == '' || that.eqpContactList[0].contactType == undefined){
                        imitatePopup("请选择联系人类型","alert");
                        return false;
                    }
                    if(that.eqpContactList[0].contactName == '' || that.eqpContactList[0].contactName == null){
                        imitatePopup("请输入联系人姓名",'alert');
                        return false;
                    }
                    if(that.eqpContactList[0].contactTel == '' || that.eqpContactList[0].contactTel == null){
                        imitatePopup("请输入联系人电话",'alert');
                        return false;
                    }
                    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
                    if(!reg.test(that.eqpContactList[0].contactTel)){
                        imitatePopup("请输入正确的联系人电话",'alert');
                        return false;
                    }
                    param = {
                        eqp: that.deviceInfo,
                        contact: that.eqpContactList[0],
                        partyCode:that.partyCode,
                        refCode: that.modelInfo.refCode,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdEqpLnkId = that.cdEqpLnkId
                    }
                    postRequest(cmdUrl + "/save/eqpContactLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){

                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.totalList = [];
                                that.currentPage = 1;
                                $(".paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                for(var n = 0 ; n < res.pageInfo.total;n++){
                                    that.totalList[n] = n + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    })
                    break;
                case '1':
                    if(that.locationContactList[0].locationName == '' || that.locationContactList[0].locationName == null ||  that.locationContactList[0].locationName == undefined){
                        imitatePopup("请输入地址简称",'alert');
                        return false;
                    }
                    if(that.locationContactList[0].locationType == ''){
                        imitatePopup("请选择地址类型",'alert');
                        return false;
                    }
                    if(that.locationContactList[0].locationCode == '' || that.locationContactList[0].locationCode == null || that.locationContactList[0].locationCode == undefined){
                        imitatePopup("请输入地址编码",'alert');
                        return false;
                    }
                    if(that.locationContactList[0].countryCode=='' || that.locationContactList[0].provinceCode=='' || that.locationContactList[0].cityCode=='' || that.locationContactList[0].districtCode==''){
                        imitatePopup("请选择省市区","alert");
                        return false;
                    }
                    if(that.locationContactList[0].street=='' || that.locationContactList[0].street == null){
                        imitatePopup("请输入街道","alert");
                        return false;
                    }
                    if(that.locationContactList[0].address=='' || that.locationContactList[0].address == null){
                        imitatePopup("请输入详细地址","alert");
                        return false;
                    }
                    param = {
                        eqp: that.deviceInfo,
                        location: that.locationContactList[0],
                        partyCode:that.partyCode,
                        refCode: that.modelInfo.refCode,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdEqpLnkId = that.cdEqpLnkId
                    }
                    postRequest(cmdUrl + "/save/eqpLocationLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){

                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.totalList = [];
                                that.currentPage = 1;
                                $(".paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                for(var n = 0 ; n < res.pageInfo.total;n++){
                                    that.totalList[n] = n + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    })
                    break;
            }
        },
        chooseAddressFun(index,type){ // 选择地址 - 按钮
            var that = this;
            that.popupType = type;
            that.currentArIndex = index;
            that.queryParam1 = {};
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
                that.currentPage1 = 1;
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        chooseContactFun(index,type){ // 选择联系人 - 按钮
            var that = this;
            that.popupType = type;
            that.currentCotactIndex = index;
            that.queryParam2 = {
                contactType:""
            };
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.contactList = res.result;
                that.currentPage2 = 1;
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum2 = res.pageInfo.total;
                that.pageList2 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList2[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        chooseDeviceFun(type){ // 选择设备 - 按钮
            var that = this;
            that.popupType = type;
            that.queryParam3 = {
                eqpType:""
            };
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.deviceList = res.result;
                that.currentPage3 = 1;
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum3 = res.pageInfo.total;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        selectAddress(addressItem,index){ // 选择地址 - tr
            addressItem.isDefault = '';
            this.$set(this.locationContactList,this.currentArIndex,addressItem);
            $(".maskLayer1").hide();
        },
        selectContactFun(contactItem,index){ // 选择联系人 - tr
            contactItem.isDefault = '';
            this.$set(this.eqpContactList,this.currentCotactIndex,contactItem);
            $(".maskLayer1").hide();
        },
        selectDqFun(deviceItem,index){ // 选择设备 - tr
            deviceItem.isDefault = '';
            var that = this;
            that.deviceInfo = deviceItem;
            $(".maskLayer1").hide();
        },
        changePage(pageNum,clickStatus){
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage > pageNum){
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage = pageNum;
                }else{
                    $(".reportMessages .paging .pagingCon .pagination").animate({
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
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        changePage1(pageNum,clickStatus){
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
            var searchFormArr = that.queryParam1;
            searchFormArr.pageInfo ={
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.addressList = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        changePage2(pageNum,clickStatus){
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
            var searchFormArr = that.queryParam2;
            searchFormArr.pageInfo ={
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.contactList = res.result;
                that.pageList2 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList2[i] = i + 1;
                }
            })
        },
        changePage3(pageNum,clickStatus){
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
            var searchFormArr = that.queryParam3;
            searchFormArr.pageInfo ={
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.deviceList = res.result;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
            })
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                refType:"",
                eqpType:""
            };
        },
        getSearchVal(){ // 搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
				that.multipleNum = that.queryPageSize;
	            var searchFormArr = this.queryParam;
	            searchFormArr.pageInfo = {
	                pageNum:1,
	                pageSize: that.queryPageSize
	            }
	            //获取订单列表
	            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
	                that.tableOrderList = res.result;
	                that.pageList = [];
	                for(var i = 0 ; i < res.pageInfo.pages;i++){
	                    that.pageList[i] = i + 1;
	                }
	                that.totalList = [];
	                that.currentPage = 1;
	                $(".reportMessages .paging .pagingCon .pagination").animate({
	                    "left": "0px"
	                },300);
	                for(var n = 0 ; n < res.pageInfo.total;n++){
	                    that.totalList[n] = n + 1;
	                }
	                that.publicChangeBtnStatus();
	            })
	        }else{
                imitatePopup("请输入大于1且小于2000的正整数","alert");
		        return false;
			}
        },
        getSearchVal1(){
            var that = this;
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
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
        getSearchVal2(){
            var that = this;
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.contactList = res.result;
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
        getSearchVal3(){
            var that = this;
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.deviceList = res.result;
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
        changeAddress(paramObj,street){ // 输入街道，改变 address
            var that = this;
            if(street == undefined){
                return false;
            }
            that.address3 = street;
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
				  							$(".fileUploadHint1").css({"display":"inline-block"});
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
        },
    },
    created:function(){
        var that = this;
        that.getAllCountryList = getCountryData();
        that.linkHrefs = getJumpLinkList(that.linkNames);
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            for(var n = 0 ; n < res.pageInfo.total;n++){
                that.totalList[n] = n + 1;
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
})

function arraySameItem(array) {  // 验证重复元素，有重复返回true；否则返回false
    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+array.join("\x0f\x0f") +"\x0f");
}
