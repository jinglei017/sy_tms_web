var app = new Vue({
    el: '#overall',
    data: {
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        addType:"",
        isDisable:false,
        clearShow:true,
        titleDisable:false,
        searchInf:[],
        currentPage:1,
        currentPage1:1,
        currentPage2:1,
        currentPage3:1,
        currentPage4:1,
        queryPageSize:20,
	    multipleNum:12,
        queryModelPageSize:20, // 弹窗中的分页（一页20条）
        pageList:[],
        pageList1:[],
        pageList2:[],
        pageList3:[],
        pageList4:[],
        totalPagesNum :"",
        totalPagesNum1 :"",
        totalPagesNum2 :"",
        totalPagesNum3 :"",
        totalPagesNum4 :"",
        orderDetail:{},
        logininf:{},
        deviceList:{},
        templateTitle:"新增联系人",
        popupType:"address",
        currentArIndex:"",
        currentDqIndex:"",
        currentCtIndex:"",
        addressList:{},
        partyList:{},
        contactList:[{}],
        partyBaseInfo:{
            partyType:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        partyContactlList:[{
            contactType:"",
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
        contactEqplList:[{
            isDefault:"",
            eqpType:"",
            eqpStr1:"",
            eqpStr2:""
        }],
        queryParam:{
            refType:"",
            partyType:null
        },
        modelInfo:{
            refCode:"",
            refName:"",
            refType:"OTHER"
        },
        addContType:"-1",
        queryParam1:{
            partyType:null
        },
        queryParam2:{
            contactType:""
        },
        queryParam3:{},
        queryParam4:{
            eqpType:""
        },
        cdPartyLnkId:"",
        locationInfo:{ // 快捷新增 - 地址信息
            locationName:"",
            locationCode:"",
            locationType:"",
            countryCode:"100000",
            provinceCode:"",
            cityCode:"",
            districtCode:"",
            street:"",
            address:""
        },
        locationContactInfo:{ // 快捷新增 - 地址联系人
            contactName:"",
            contactTel:""
        },
        deviceInfo:{ // 快捷新增 - 设备信息
            eqpName:"",
            eqpType:"",
            eqpNo:"",
            eqpStr1:"",
            eqpStr2:""
        },
        deviceContactInfo:{ // 快捷新增 - 设备联系人
            contactName:"",
            contactTel:""
        },
        getAllCountryList:{}, // 国家列表
        address00:"", // 改变 address —— 国
        address0:"", // 改变 address —— 省
        address1:"", // 改变 address —— 市
        address2:"", // 改变 address —— 区
        address3:"", // 改变 address —— 街道

        orderPartyType:"",
        shipperParty:{}, // 平台集 -- 发货商
        receiptParty:{}, // 平台集 -- 收货商
        linkNames: ["客户管理","客户模板管理"],
        linkHrefs: []

    },
    methods:{
        chooseTheFileType(type){
            switch(type)
            {
                case '0': // 上传合作商地址数据
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
                case '0': // 上传合作商地址数据
                    fileUploadRequest(cmdUrl + '/import/partyLocationLnkData.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,function(res){
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
            if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
                searchFormArr.partyType = null;
            }
            //获取订单列表
            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.totalPagesNum = res.pageInfo.total;
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        changeAddContType(addContType,addType){
            var that = this,txt = '';
            /*$.each(that.selectListData.parRefTypeList, function (indexs, val) {
                if (val.code == addContType) {
                    txt = val.text;
                }
            });*/
            if(addContType == 'LOCATIONLNK'){  // isContains(txt, '地址')
                that.addContType = '0';
            }else{
                if(addContType == 'EQPLNK'){  // isContains(txt, '设备')
                    that.addContType = '1';
                }else{
                    if((addType == 'add1' || addType == 'add2') && (addContType == 'TENANTLNK' || addContType == 'USERLNK')){  // (isContains(txt, '平台') || isContains(txt, '用户'))
                        that.addContType = '2';
                        that.getDefaultShipperParty();
                    }else{
                        if(that.clickBtnType == 'detail' || that.clickBtnType == 'edit'){
                            if(addContType == 'TENANTLNK' || addContType == 'USERLNK'){  // isContains(txt, '平台') || isContains(txt, '用户')
                                that.addContType = '2';
                            }else {
                                that.addContType = '-1';
                            }
                        }else{
                            that.addContType = '-1';
                        }
                    }
                }
            }
        },
        getDefaultShipperParty(){ // 获取默认合作商作为发单方
            var that = this;
            if(that.selectListData.partyLists != undefined){
                if(that.selectListData.partyLists.length != 0){
                    that.shipperParty = that.selectListData.partyLists[0];
                }
            }
        },
        addOrderDetails(title){ // 新增
            //alert(1111)
            this.templateTitle = title;
            this.clickBtnType = "add";
            this.addType = "add1";
            var that = this;
            that.isDisable = false;
            that.titleDisable = false;
            that.partyBaseInfo = {
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.locationContactList = [{
                locationType:"",
                countryCode:"100000",
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:"",
                address:""
            }];
            that.contactEqplList = [{
                isDefault:"",
                eqpType:"",
                eqpStr1:"",
                eqpStr2:""
            }];
            that.partyContactlList = [{
                contactType:"",
                isDefault:""
            }];
            that.modelInfo = {
                refCode:"",
                refName:"",
                refType:"PARTYLNK"
            };
            that.addContType = '-1';
            that.resetAddressParamFun('1');

            that.shipperParty = { // 平台集 -- 发货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
            that.receiptParty = { // 平台集 -- 收货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
        },
        addOrderDetails2(title){ // 新增
            this.templateTitle = title;
            this.clickBtnType = "add2";
            this.addType = "add2";
            var that = this;
            that.isDisable = false;
            that.titleDisable = false;
            that.partyBaseInfo = {
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.partyContactlList = [{
                contactType:"",
                isDefault:""
            }];
            that.modelInfo = {
                refCode:"",
                refName:"",
                refType:"PARTYLNK"
            };
            that.addContType = '-1';

            that.locationInfo = { // 快捷新增 - 地址信息
                locationName:"",
                locationType:"",
                locationCode:"",
                countryCode:"100000",
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                street:"",
                address:""
            };
            that.locationContactInfo = { // 快捷新增 - 地址联系人
                contactName:"",
                contactTel:""
            };
            that.deviceInfo = { // 快捷新增 - 设备信息
                eqpName:"",
                eqpType:"",
                eqpNo:"",
                eqpStr1:"",
                eqpStr2:""
            };
            that.deviceContactInfo = { // 快捷新增 - 设备联系人
                contactName:"",
                contactTel:""
            };
            that.shipperParty={
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.receiptParty={
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            }
            that.resetAddressParamFun('1');
        },
        getOrderDetails(title,partyItem){ // 详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            this.addType = "add1";
            that.isDisable = true;
            that.titleDisable = true;
            that.modelInfo = {
                refCode:"",
                refName:"",
                refType:""
            };
            that.partyBaseInfo = {
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.partyContactlList = [{
                contactType:"",
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
            that.contactEqplList = [{
                isDefault:"",
                eqpType:"",
                eqpStr1:"",
                eqpStr2:""
            }];
            that.shipperParty = { // 平台集 -- 发货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
            that.receiptParty = { // 平台集 -- 收货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
            getRequest(cmdUrl + "/get/cdPartyLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyLnkId="+partyItem.cdPartyLnkId,function(res){
                if(res.result != null){
                    that.cdPartyLnkId = res.result.cdPartyLnkId;
                    that.modelInfo = { // 模板信息
                        refCode:res.result.refCode,
                        refName:res.result.refName,
                        refType:res.result.refType
                    };
                    that.changeAddContType(that.modelInfo.refType);
                    console.log(that.addContType);
                    // 平台集、用户集
                    if(that.addContType == '2'){
                        that.modelInfo = {
                            refNo:res.result.refNo,
                            refName:res.result.refName,
                            refType:res.result.refType,
                            refWorkCode:res.result.refWorkCode
                        };
                        var paramFrom = {
                            cdPartyId:res.result.cdPartyId
                        };
                        postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramFrom,function(res){
                            that.shipperParty = res.result[0];
                            if(that.shipperParty.isBuyer == null){
                                that.shipperParty.isBuyer = '';
                            }
                            if(that.shipperParty.isVendor == null){
                                that.shipperParty.isVendor = '';
                            }
                            if(that.shipperParty.isTruck == null){
                                that.shipperParty.isTruck = '';
                            }
                            if(that.shipperParty.isWarehouse == null){
                                that.shipperParty.isWarehouse = '';
                            }
                            if(that.shipperParty.is3pl == null){
                                that.shipperParty.is3pl = '';
                            }
                        });
                        var paramTo = {
                            cdPartyId:res.result.refId
                        };
                        postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramTo,function(res){
                            that.receiptParty = res.result[0];
                            if(that.receiptParty.isBuyer == null){
                                that.receiptParty.isBuyer = '';
                            }
                            if(that.receiptParty.isVendor == null){
                                that.receiptParty.isVendor = '';
                            }
                            if(that.receiptParty.isTruck == null){
                                that.receiptParty.isTruck = '';
                            }
                            if(that.receiptParty.isWarehouse == null){
                                that.receiptParty.isWarehouse = '';
                            }
                            if(that.receiptParty.is3pl == null){
                                that.receiptParty.is3pl = '';
                            }
                        });
                        return false;
                    }
                    // 合作商信息
                    var params0 = {
                        cdPartyId:res.result.cdPartyId
                    };
                    postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params0,function(res){
                        that.partyBaseInfo = res.result[0];
                        if(that.partyBaseInfo.isBuyer == null){
                            that.partyBaseInfo.isBuyer = '';
                        }
                        if(that.partyBaseInfo.isVendor == null){
                            that.partyBaseInfo.isVendor = '';
                        }
                        if(that.partyBaseInfo.isTruck == null){
                            that.partyBaseInfo.isTruck = '';
                        }
                        if(that.partyBaseInfo.isWarehouse == null){
                            that.partyBaseInfo.isWarehouse = '';
                        }
                        if(that.partyBaseInfo.is3pl == null){
                            that.partyBaseInfo.is3pl = '';
                        }
                    });
                    // 联系人信息
                    var params1 = {
                        cdContactId:res.result.cdContactId
                    };
                    postRequest(cmdUrl + "/get/contactVoListByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(res){
                        that.partyContactlList = res.result;
                    });
                    // 关联模板
                    var params2 = {};
                    switch(that.addContType)
                    {
                        case '-1': // 合作商模板 - 其他

                            break;
                        case '0': // 合作商模板 - 地址模板
                            params2 = {
                                cdLocationLnkId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/locationLnkVoListByLocationLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.locationContactList = res.result;
                            });
                            break;
                        case '1': // 合作商模板 - 设备模板
                            params2 = {
                                cdEqpLnkId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.contactEqplList = res.result;
                            });
                            break;
                    }
                }else{
                    that.cdPartyLnkId = "";
                    that.modelInfo = { // 模板信息
                        refCode:"",
                        refName:"",
                        refType:"",
                        refNo:"",
                        refWorkCode:""
                    };
                    that.addContType = '-1';
                    that.partyBaseInfo = { // 合作商信息
                        partyType:"",
                        isBuyer:"",
                        isVendor:"",
                        isTruck:"",
                        isWarehouse:"",
                        is3pl:""
                    };
                    that.partyContactlList = [{ // 联系人信息
                        contactType:"",
                        isDefault:""
                    }];
                    that.shipperParty = { // 平台集 -- 发货商
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                    that.receiptParty = { // 平台集 -- 收货商
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                }
            })
        },
        changeOrderDetails(title,partyItem){ // 修改
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            this.addType = "add2";
            that.isDisable = true;
            that.titleDisable = false;
            that.modelInfo = {
                refCode:"",
                refName:"",
                refType:""
            };
            that.partyBaseInfo = {
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            };
            that.partyContactlList = [{
                contactType:"",
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
            that.contactEqplList = [{
                isDefault:"",
                eqpType:"",
                eqpStr1:"",
                eqpStr2:""
            }];
            that.shipperParty = { // 平台集 -- 发货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
            that.receiptParty = { // 平台集 -- 收货商
                partyName:"",
                partyCode:"",
                isBuyer:null,
                isVendor:null,
                isTruck:null,
                isWarehouse:null,
                is3pl:null
            };
            getRequest(cmdUrl + "/get/cdPartyLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyLnkId="+partyItem.cdPartyLnkId,function(res){
                if(res.result != null){
                    that.cdPartyLnkId = res.result.cdPartyLnkId;
                    that.modelInfo = { // 模板信息
                        refCode:res.result.refCode,
                        refName:res.result.refName,
                        refType:res.result.refType
                    };
                    that.changeAddContType(that.modelInfo.refType);
                    // 平台集、用户集
                    if(that.addContType == '2'){
                        that.modelInfo = {
                            refNo:res.result.refNo,
                            refName:res.result.refName,
                            refType:res.result.refType,
                            refWorkCode:res.result.refWorkCode
                        };
                        var paramFrom = {
                            cdPartyId:res.result.cdPartyId
                        };
                        postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramFrom,function(res){
                            that.shipperParty = res.result[0];
                            if(that.shipperParty.isBuyer == null){
                                that.shipperParty.isBuyer = '';
                            }
                            if(that.shipperParty.isVendor == null){
                                that.shipperParty.isVendor = '';
                            }
                            if(that.shipperParty.isTruck == null){
                                that.shipperParty.isTruck = '';
                            }
                            if(that.shipperParty.isWarehouse == null){
                                that.shipperParty.isWarehouse = '';
                            }
                            if(that.shipperParty.is3pl == null){
                                that.shipperParty.is3pl = '';
                            }
                        });
                        var paramTo = {
                            cdPartyId:res.result.refId
                        };
                        postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramTo,function(res){
                            that.receiptParty = res.result[0];
                            if(that.receiptParty.isBuyer == null){
                                that.receiptParty.isBuyer = '';
                            }
                            if(that.receiptParty.isVendor == null){
                                that.receiptParty.isVendor = '';
                            }
                            if(that.receiptParty.isTruck == null){
                                that.receiptParty.isTruck = '';
                            }
                            if(that.receiptParty.isWarehouse == null){
                                that.receiptParty.isWarehouse = '';
                            }
                            if(that.receiptParty.is3pl == null){
                                that.receiptParty.is3pl = '';
                            }
                        });
                        return false;
                    }
                    // 合作商信息
                    var params0 = {
                        cdPartyId:res.result.cdPartyId
                    };
                    postRequest(cmdUrl + "/get/partyVoListByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params0,function(res){
                        that.partyBaseInfo = res.result[0];
                        if(that.partyBaseInfo.isBuyer == null){
                            that.partyBaseInfo.isBuyer = '';
                        }
                        if(that.partyBaseInfo.isVendor == null){
                            that.partyBaseInfo.isVendor = '';
                        }
                        if(that.partyBaseInfo.isTruck == null){
                            that.partyBaseInfo.isTruck = '';
                        }
                        if(that.partyBaseInfo.isWarehouse == null){
                            that.partyBaseInfo.isWarehouse = '';
                        }
                        if(that.partyBaseInfo.is3pl == null){
                            that.partyBaseInfo.is3pl = '';
                        }
                    });
                    // 联系人信息
                    var params1 = {
                        cdContactId:res.result.cdContactId
                    };
                    postRequest(cmdUrl + "/get/contactVoListByContactVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params1,function(res){
                        that.partyContactlList = res.result;
                    });
                    // 关联模板
                    var params2 = {};
                    switch(that.addContType)
                    {
                        case '-1': // 合作商模板 - 其他

                            break;
                        case '0': // 合作商模板 - 地址模板
                            params2 = {
                                cdLocationLnkId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/locationLnkVoListByLocationLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.locationInfo = res.result[0];
                                that.locationContactInfo = res.result[0];
                            });
                            break;
                        case '1': // 合作商模板 - 设备模板
                            params2 = {
                                cdEqpLnkId:res.result.refId
                            };
                            postRequest(cmdUrl + "/get/eqpLnkVoListByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params2,function(res){
                                that.deviceInfo = res.result[0];
                                that.deviceContactInfo = res.result[0];
                            });
                            break;
                    }
                }else{
                    that.cdPartyLnkId = "";
                    that.modelInfo = { // 模板信息
                        refCode:"",
                        refName:"",
                        refType:"",
                        refNo:"",
                        refWorkCode:""
                    };
                    that.addContType = '-1';
                    that.partyBaseInfo = { // 合作商信息
                        partyType:"",
                        isBuyer:"",
                        isVendor:"",
                        isTruck:"",
                        isWarehouse:"",
                        is3pl:""
                    };
                    that.partyContactlList = [{ // 联系人信息
                        contactType:"",
                        isDefault:""
                    }];
                    that.shipperParty = { // 平台集 -- 发货商
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                    that.receiptParty = { // 平台集 -- 收货商
                        partyName:"",
                        partyCode:"",
                        isBuyer:null,
                        isVendor:null,
                        isTruck:null,
                        isWarehouse:null,
                        is3pl:null
                    };
                }
            })
        },
        deleteOrderDetails(partyItem){ // 删除
            var that = this;
            var r = confirm("确定删除当前合作商模板");
            if (r==true){
                getRequest(cmdUrl + "/delete/cdPartyLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyLnkId="+partyItem.cdPartyLnkId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.totalPagesNum = res.pageInfo.total;
                        that.pageList = [];
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
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
                    params = {
                        refType:partyItem.refType,
                        cdPartyLnkId:partyItem.cdPartyLnkId,
                        isDefault:1
                    };
                    break;
                case '0': // 取消默认
                    params = {
                        refType:partyItem.refType,
                        cdPartyLnkId:partyItem.cdPartyLnkId,
                        isDefault:0
                    };
                    break;
            }
            postRequest(cmdUrl + "/save/setDefaultPartyLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                //获取订单列表
                var searchFormArr = {
                    pageInfo:{
                        pageNum:that.currentPage,
                        pageSize:that.queryPageSize
                    }
                };
                postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        saveNewOrderInfo(){
            var that = this,param;
            if(that.addContType != '2'){
                if(that.partyBaseInfo.cdPartyId == '' || that.partyBaseInfo.cdPartyId == undefined){
                    imitatePopup("请选择合作商","alert");
                    return false;
                }
                if(that.partyContactlList[0].cdContactId == '' || that.partyContactlList[0].cdContactId == undefined){
                    imitatePopup("请选择联系人","alert");
                    return false;
                }
            }
            switch(that.addContType)
            {
                case '-1': // 模板类型：其他
                    param = {
                        cdPartyId: that.partyBaseInfo.cdPartyId,
                        cdContactId: that.partyContactlList[0].cdContactId,
                        refId: '',
                        refCode: that.modelInfo.refCode,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdPartyLnkId = that.cdPartyLnkId
                    }
                    postRequest(cmdUrl + "/save/cdPartyLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){

                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".reportMessages .paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.currentPage = 1;
                                $(".reportMessages .paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                that.totalPagesNum = res.pageInfo.total;
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    });
                    break;
                case '0': // 模板类型：地址
                    if(that.locationContactList[0].cdLocationLnkId == '' || that.locationContactList[0].cdLocationLnkId == undefined){
                        imitatePopup("请选择地址模板","alert");
                        return false;
                    }
                    if(that.modelInfo.refName == "" || that.modelInfo.refName == undefined){
                        imitatePopup("请填写模板名称","alert");
                        return false;
                    }
                    param = {
                        cdPartyId: that.partyBaseInfo.cdPartyId,
                        cdContactId: that.partyContactlList[0].cdContactId,
                        refId: that.locationContactList[0].cdLocationLnkId,
                        refCode: that.modelInfo.refCode,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType,

                        party: that.partyBaseInfo,
                        imgContact: that.partyContactlList[0],
                        contact: that.partyContactlList[0],
                        location: that.locationContactList[0],
                        // eqp: ""
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdPartyLnkId = that.cdPartyLnkId
                    }
                    postRequest(cmdUrl + "/save/partyLocationLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){

                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".reportMessages .paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.currentPage = 1;
                                $(".reportMessages .paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                that.totalPagesNum = res.pageInfo.total;
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    });
                    break;
                case '1': // 模板类型：设备
                    if(that.contactEqplList[0].cdEqpLnkId == '' || that.contactEqplList[0].cdEqpLnkId == undefined){
                        imitatePopup("请选择设备模板","alert");
                        return false;
                    }
                    param = {
                        cdPartyId: that.partyBaseInfo.cdPartyId,
                        cdContactId: that.partyContactlList[0].cdContactId,
                        refId: that.contactEqplList[0].cdEqpLnkId,
                        refCode: that.modelInfo.refCode,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType,

                        party: that.partyBaseInfo,
                        imgContact: that.partyContactlList[0],
                        contact: that.partyContactlList[0],
                        eqp: that.contactEqplList[0]
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdPartyLnkId = that.cdPartyLnkId
                    }
                    postRequest(cmdUrl + "/save/partyEqpLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".reportMessages .paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.currentPage = 1;
                                $(".reportMessages .paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                that.totalPagesNum = res.pageInfo.total;
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    });
                    break;
                case '2': // 模板类型：平台 、用户
                    if(that.shipperParty.cdPartyId == '' || that.shipperParty.cdPartyId == undefined){
                        imitatePopup("请选择发单方合作商","alert");
                        return false;
                    }
                    if(that.receiptParty.cdPartyId == '' || that.receiptParty.cdPartyId == undefined){
                        imitatePopup("请选择接单方合作商","alert");
                        return false;
                    }
                    param = {
                        cdPartyId: that.shipperParty.cdPartyId,
                        cdContactId:"",
                        refId: that.receiptParty.cdPartyId,
                        refNo: that.modelInfo.refNo,
                        refName: that.modelInfo.refName,
                        refType: that.modelInfo.refType,
                        refWorkCode:that.modelInfo.refWorkCode
                    };
                    if(that.clickBtnType == 'edit'){
                        param.cdPartyLnkId = that.cdPartyLnkId
                    }
                    postRequest(cmdUrl + "/save/partyTenantLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){

                            // 关闭侧滑 ------ start
                        closeSideslip();
                            that.currentPage = 1;
                            $(".reportMessages .paging .pagingCon .pagination").animate({
                                "left": "0px"
                            },300);
                            var searchFormArr = that.queryParam;
                            searchFormArr.pageInfo = {
                                pageNum: 1,
                                pageSize:that.queryPageSize
                            };
                            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                that.tableOrderList = res.result;
                                that.pageList = [];
                                that.currentPage = 1;
                                $(".reportMessages .paging .pagingCon .pagination").animate({
                                    "left": "0px"
                                },300);
                                that.totalPagesNum = res.pageInfo.total;
                                for(var i = 0 ; i < res.pageInfo.pages;i++){
                                    that.pageList[i] = i + 1;
                                }
                                that.publicChangeBtnStatus();
                            })
                    });
                    break;
            }
        },
        saveNewOrderInfo2(){
            var that = this,param;
            if(!that.nonEmptyOrder(that)){
                return false;
            }
            param = {
                refCode: that.modelInfo.refCode,
                refName: that.modelInfo.refName,
                refType: that.modelInfo.refType,
                refNo: that.modelInfo.refNo,
                refWorkCode:that.modelInfo.refWorkCode,
                party: that.partyBaseInfo,
                imgContact: that.partyContactlList[0]
            };
            switch(that.addContType)
            {
                case '-1': // 模板类型：其他集 or 联系人

                    break;
                case '0': // 地址集
                    param.location = that.locationInfo;
                    param.contact = that.locationContactInfo;
                    break;
                case '1':// 设备集
                    that.deviceInfo.eqpNo = that.deviceInfo.eqpName;
                    param.eqp = that.deviceInfo;
                    param.contact = that.deviceContactInfo;
                    break;
                case '2':// 平台集 or 用户集
                    param.shipperParty = that.shipperParty;
                    param.receiptParty = that.receiptParty;
                    break;
            }
            postRequest(cmdUrl + "/insert/refLnkInfoModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                imitatePopup("保存合作商模板及基础数据成功","alert");
                // 关闭侧滑 ------ start
                closeSideslip();
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                var searchFormArr = that.queryParam;
                searchFormArr.pageInfo = {
                    pageNum: 1,
                    pageSize:that.queryPageSize
                };
                postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.totalPagesNum = res.pageInfo.total;
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            });
        },
        nonEmptyOrder(that){
            if(that.modelInfo.refType=="" || that.modelInfo.refType==null || that.modelInfo.refType==undefined){
                imitatePopup("请选择模板类型","alert");
                return false;
            }
            if(that.modelInfo.refName=='' || that.modelInfo.refName ==undefined){
                imitatePopup("请输入模板名称","alert");
                return false;
            }
            if(that.modelInfo.refType =='PARTYLNK' || that.modelInfo.refType =='LOCATIONLNK' || that.modelInfo.refType =='EQPLNK' || that.modelInfo.refType =='CONTACT'){

                if(that.partyBaseInfo.partyType=='' || that.partyBaseInfo.partyType ==undefined){
                    imitatePopup("请选择合作商类型","alert");
                    return false;
                }
                if(that.partyBaseInfo.partyName=='' || that.partyBaseInfo.partyName ==undefined){
                    imitatePopup("请输入合作商名称","alert");
                    return false;
                }
                if(that.partyBaseInfo.partyCode=='' || that.partyBaseInfo.partyCode ==undefined){
                    imitatePopup("请输入合作代码","alert");
                    return false;
                }
                if(that.partyBaseInfo.isBuyer==='' || that.partyBaseInfo.isBuyer ==undefined){
                    imitatePopup("请选择是否买家","alert");
                    return false;
                }
                if(that.partyBaseInfo.isVendor==='' || that.partyBaseInfo.isVendor ==undefined){
                    imitatePopup("请选择是否卖家","alert");
                    return false;
                }
                if(that.partyBaseInfo.isTruck==='' || that.partyBaseInfo.isTruck ==undefined){
                    imitatePopup("请选择是否卡车公司","alert");
                    return false;
                }
                if(that.partyBaseInfo.isWarehouse==='' || that.partyBaseInfo.isWarehouse ==undefined){
                    imitatePopup("请选择是否仓库","alert");
                    return false;
                }
                if(that.partyBaseInfo.is3pl==='' || that.partyBaseInfo.isBuyer ==undefined){
                    imitatePopup("请选择是否第三方物流","alert");
                    return false;
                }
                if(that.partyContactlList[0].contactName=='' || that.partyContactlList[0].contactName ==undefined){
                    imitatePopup("请输入商户联系人","alert");
                    return false;
                }
                if(that.partyContactlList[0].contactTel=='' || that.partyContactlList[0].contactTel==undefined){
                    imitatePopup("请输入联系人电话","alert");
                    return false;
                }
            }
            if(that.modelInfo.refType =='LOCATIONLNK'){
                if(that.locationInfo.locationName=='' || that.locationInfo.locationName==undefined){
                    imitatePopup("请输入地址简称","alert");
                    return false;
                }
                if(that.locationInfo.locationType=='' || that.locationInfo.locationType==undefined){
                    imitatePopup("请选择地址类型","alert");
                    return false;
                }
                if(that.locationInfo.countryCode=='' || that.locationInfo.provinceCode=='' || that.locationInfo.cityCode=='' || that.locationInfo.districtCode==''){
                    imitatePopup("请选择省市区","alert");
                    return false;
                }
                if(that.locationContactInfo.contactName=='' || that.locationContactInfo.contactName==undefined){
                    imitatePopup("请输入地址联系人","alert");
                    return false;
                }
                if(that.locationContactInfo.contactTel=='' || that.locationContactInfo.contactTel==undefined){
                    imitatePopup("请输入联系人电话","alert");
                    return false;
                }

            }
            if(that.modelInfo.refType =='EQPLNK'){
                if(that.deviceInfo.eqpName=='' || that.deviceInfo.eqpName==undefined){
                    imitatePopup("请输入车牌号","alert");
                    return false;
                }
                if(that.deviceInfo.eqpType=='' || that.deviceInfo.eqpType==undefined){
                    imitatePopup("请选择设备类型","alert");
                    return false;
                }
                if(that.deviceInfo.eqpBrand=='' || that.deviceInfo.eqpBrand==undefined){
                    imitatePopup("请输入设备品牌","alert");
                    return false;
                }
                if(that.deviceInfo.eqpSpec=='' || that.deviceInfo.eqpSpec==undefined){
                    imitatePopup("请输入设备型号","alert");
                    return false;
                }
                if(that.deviceInfo.eqpLength=='' || that.deviceInfo.eqpLength==undefined){
                    imitatePopup("请输入长度","alert");
                    return false;
                }
                if(that.deviceInfo.eqpWidth=='' || that.deviceInfo.eqpWidth==undefined){
                    imitatePopup("请输入宽度","alert");
                    return false;
                }
                if(that.deviceInfo.eqpHeight=='' || that.deviceInfo.eqpHeight==undefined){
                    imitatePopup("请输入高度","alert");
                    return false;
                }
                if(that.deviceContactInfo.contactName=='' || that.deviceContactInfo.contactName==undefined){
                    imitatePopup("请输入设备联系人","alert");
                    return false;
                }
                if(that.deviceContactInfo.contactTel=='' || that.deviceContactInfo.contactTel==undefined){
                    imitatePopup("请输入联系人电话","alert");
                    return false;
                }
            }
            if(that.modelInfo.refType =='TENANTLNK' || that.modelInfo.refType =='USERLNK') {
                if (that.shipperParty.partyType == '' || that.shipperParty.partyType == undefined) {
                    imitatePopup("请选择发货商类型","alert");
                    return false;
                }
                if (that.shipperParty.partyName == '' || that.shipperParty.partyName == undefined) {
                    imitatePopup("请输入发货商名称","alert");
                    return false;
                }
                if (that.shipperParty.partyCode == '' || that.shipperParty.partyCode == undefined) {
                    imitatePopup("请输入发货商代码","alert");
                    return false;
                }
                console.log(that.shipperParty.isBuyer)
                if (that.shipperParty.isBuyer === '' || that.shipperParty.isBuyer == undefined) {
                    imitatePopup("请选择发货商是否买家","alert");
                    return false;
                }
                if (that.shipperParty.isVendor === '' || that.shipperParty.isVendor == undefined) {
                    imitatePopup("请选择发货商是否卖家","alert");
                    return false;
                }
                if (that.shipperParty.isTruck === '' || that.shipperParty.isTruck == undefined) {
                    imitatePopup("请选择发货商是否卡车公司","alert");
                    return false;
                }
                if (that.shipperParty.isWarehouse === '' || that.shipperParty.isWarehouse == undefined) {
                    imitatePopup("请选择发货商是否仓库","alert");
                    return false;
                }
                if (that.shipperParty.is3pl === '' || that.shipperParty.isBuyer == undefined) {
                    imitatePopup("请选择发货商是否第三方物流","alert");
                    return false;
                }
                if (that.receiptParty.partyType == '' || that.receiptParty.partyType == undefined) {
                    imitatePopup("请选择收货商类型","alert");
                    return false;
                }
                if (that.receiptParty.partyName == '' || that.receiptParty.partyName == undefined) {
                    imitatePopup("请输入收货商名称","alert");
                    return false;
                }
                if (that.receiptParty.partyCode == '' || that.receiptParty.partyCode == undefined) {
                    imitatePopup("请输入收货商代码","alert");
                    return false;
                }
                if (that.receiptParty.isBuyer === '' || that.receiptParty.isBuyer == undefined) {
                    imitatePopup("请选择收货商是否买家","alert");
                    return false;
                }
                if (that.receiptParty.isVendor === '' || that.receiptParty.isVendor == undefined) {
                    imitatePopup("请选择收货商是否卖家","alert");
                    return false;
                }
                if (that.receiptParty.isTruck === '' || that.receiptParty.isTruck == undefined) {
                    imitatePopup("请选择收货商是否卡车公司","alert");
                    return false;
                }
                if (that.receiptParty.isWarehouse === '' || that.receiptParty.isWarehouse == undefined) {
                    imitatePopup("请选择收货商是否仓库","alert");
                    return false;
                }
                if (that.receiptParty.is3pl === '' || that.receiptParty.isBuyer == undefined) {
                    imitatePopup("请选择收货商是否第三方物流","alert");
                    return false;
                }
            }
            return true;
        },
        editNewOrderInfo2(){
            that = this;
            if(!that.nonEmptyOrder(that)){
                return false;
            }
            var param = {
                refCode: that.modelInfo.refCode,
                refName: that.modelInfo.refName,
                refType: that.modelInfo.refType,
                refNo: that.modelInfo.refNo,
                refWorkCode:that.modelInfo.refWorkCode,
                cdPartyLnkId:that.cdPartyLnkId,
                party: that.partyBaseInfo,
                imgContact: that.partyContactlList[0]
            };
            switch(that.addContType)
            {
                case '-1': // 模板类型：其他集 or 联系人

                    break;
                case '0': // 地址集
                    param.location = that.locationInfo;
                    param.contact = that.locationContactInfo;
                    break;
                case '1':// 设备集
                    that.deviceInfo.eqpNo = that.deviceInfo.eqpName;
                    param.eqp = that.deviceInfo;
                    param.contact = that.deviceContactInfo;
                    param.eqpLnkId = that.deviceInfo.cdEqpLnkId;
                    break;
                case '2':// 平台集 or 用户集
                    param.shipperParty = that.shipperParty;
                    param.receiptParty = that.receiptParty;
                    break;
            }
            postRequest(cmdUrl + "/insert/refLnkInfoModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                alert("修改合作商模板及基础数据成功");
                // 关闭侧滑 ------ start
                closeSideslip();
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                var searchFormArr = that.queryParam;
                searchFormArr.pageInfo = {
                    pageNum: 1,
                    pageSize:that.queryPageSize
                };
                postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.totalPagesNum = res.pageInfo.total;
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            });
        },
        choosePartyFun(type,orderPartyType){ // 选择合作商 - 按钮
            var that = this;
            that.orderPartyType = orderPartyType;
            that.popupType = type;
            that.queryParam1 = {
                partyType:null
            };
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
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
                $(".maskLayer1").show();
            })
        },
        chooseContactFun(index,type){ // 选择联系人 - 按钮
            var that = this;
            that.popupType = type;
            that.currentCtIndex = index;
            that.queryParam2 = {
                contactType:"",
                partyCode:that.partyBaseInfo.partyCode,
                partyName:that.partyBaseInfo.partyName
            };
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
                $(".maskLayer1").show();
            })
        },
        chooseAddressFun(index,type){ // 选择地址模板 - 按钮
            var that = this;
            that.popupType = type;
            that.currentArIndex = index;
            that.queryParam3 = {
                refType:"CONTACT"
            };
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationLnkByLocationLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
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
        chooseDeviceFun(index,type){ // 选择设备模板 - 按钮
            var that = this;
            that.popupType = type;
            that.currentDqIndex = index;
            that.queryParam4 = {
                refType:"CONTACT",
                eqpType:""
            };
            var params = that.queryParam4;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.deviceList = res.result;
                that.currentPage4 = 1;
                $(".popupType4 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.totalPagesNum4 = res.pageInfo.total;
                that.pageList4 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList4[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        selectPaFun(partyItem,index){ // 选择合作商 - tr
            var that = this;
            switch(that.orderPartyType)
            {
                case 'partyBaseInfo': // 合作商基本信息
                    that.partyBaseInfo = partyItem;
                    break;
                case 'from': // 发货商
                    that.shipperParty = partyItem;
                    break;
                case 'to': // 收货商
                    that.receiptParty = partyItem;
                    break;
            }
            if(that.receiptParty.partyName != '' && that.receiptParty.partyName != null && that.receiptParty.partyName != undefined){
                that.modelInfo.refName = that.receiptParty.partyName;
            }
            if(that.receiptParty.partyCode != '' && that.receiptParty.partyCode != null && that.receiptParty.partyCode != undefined){
                that.modelInfo.refNo = that.receiptParty.partyCode;
            }
            $(".maskLayer1").hide();
        },
        selectCtFun(contactItem,index){ // 选择联系人 - tr
            contactItem.isDefault = '';
            this.$set(this.partyContactlList,this.currentCtIndex,contactItem);
            $(".maskLayer1").hide();
        },
        selectAddress(addressItem,index){ // 选择地址模板 - tr
            addressItem.isDefault = '';
            this.$set(this.locationContactList,this.currentArIndex,addressItem);
            $(".maskLayer1").hide();
        },
        selectDqFun(deviceItem,index){ // 选择设备模板 - tr
            deviceItem.isDefault = '';
            this.$set(this.contactEqplList,this.currentDqIndex,deviceItem);
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
            };
            if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
                searchFormArr.partyType = null;
            }
            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
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
            var searchFormArr = that.queryParam1;
            searchFormArr.pageInfo ={
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.partyList = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            })
        },
        changePage2(pageNum,clickStatus){ // 弹窗联系人列表
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
        changePage3(pageNum,clickStatus){ // 弹窗地址模板列表
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
            postRequest(cmdUrl + "/select/pageLocationLnkByLocationLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.addressList = res.result;
                that.pageList3 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList3[i] = i + 1;
                }
            })
        },
        changePage4(pageNum,clickStatus){ // 弹窗设备模板列表
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
            var searchFormArr = that.queryParam4;
            searchFormArr.pageInfo ={
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.deviceList = res.result;
                that.pageList4 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList4[i] = i + 1;
                }
            })
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
	                pageSize:that.queryPageSize
	            };
	            if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
	                searchFormArr.partyType = null;
	            }
	            //获取订单列表
	            postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
	                that.tableOrderList = res.result;
	                that.totalPagesNum = res.pageInfo.total;
	                that.pageList = [];
	                for(var i = 0 ; i < res.pageInfo.pages;i++){
	                    that.pageList[i] = i + 1;
	                }
	                that.currentPage = 1;
	                $(".reportMessages .paging .pagingCon .pagination").animate({
	                    "left": "0px"
	                },300);
	                that.publicChangeBtnStatus();
	            })
	        }else{
				alert("请输入大于1且小于2000的正整数");
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
            postRequest(cmdUrl + "/select/pageLocationLnkByLocationLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
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
        getSearchVal4(){
            var that = this;
            var params = that.queryParam4;
            params.pageInfo = {
                pageNum:1,
                pageSize:that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpLnkByEqpLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.deviceList = res.result;
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
        closeMaskLayer(){ // 关闭弹窗
            $(".maskLayer").hide();
        },
        resetOrderList(){
            window.location.reload();
        }
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
        postRequest(cmdUrl + "/select/pagePartyLnkByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
