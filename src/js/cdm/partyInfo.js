var app = new Vue({
    el: '#overall',
    data: {
        tableOrderList: {},
        selectListData: {},
        cooperPartyPositiveImgList:[],
        cooperPartyBackImgList:[],
        cooperPartyEqpPositiveImgList:[],
        cooperPartyEqpBackImgList:[],
        cooperPartyContactPositiveImgList:[],
        cooperPartyContactBackImgList:[],
        cooperPartyDriverPositiveImgList:[],
        cooperPartyDriverBackImgList:[],
        cooperPartyDepotPositiveImgList:[],
        cooperPartyDepotBackImgList:[],
        cooperPartyLocationPositiveImgList:[],
        cooperPartyLocationBackImgList:[],
        clickBtnType: "",
        isDisable: false,
        clearShow: true,
        titleDisable: false,
        currentPage: 1,
        currentPage1: 1,
        currentPage2: 1,
        currentPage3: 1,
        currentPage4: 1,
        currentPage11: 1,
        currentPage22: 1,
        currentPage33: 1,
        currentPage44: 1,
        queryPageSize: 20,
        multipleNum: 12,
        queryItemPageSize: 12, // 详情下的分页（一页12条）
        queryModelPageSize: 12, // 弹窗中的分页（一页12条）
        pageList: [],
        pageList1: [],
        pageList2: [],
        pageList3: [],
        pageList4: [],
        pageList11: [],
        pageList22: [],
        pageList33: [],
        pageList44: [],
        totalPagesNum: "",
        totalPagesNum1: "",
        totalPagesNum2: "",
        totalPagesNum3: "",
        totalPagesNum4: "",
        totalPagesNum11: "",
        totalPagesNum22: "",
        totalPagesNum33: "",
        totalPagesNum44: "",
        orderDetail: {},
        logininf: {},
        deviceList: {},
        templateTitle: "新增联系人",
        popupType: "address",
        currentArIndex: "",
        currentDqIndex: "",
        currentCtIndex: "",
        addressList: {},
        contactList: [{}],
        partyBaseInfo: {
            partyType: "",
            isBuyer: "",
            isVendor: "",
            isTruck: "",
            isWarehouse: "",
            is3pl: "",
            cdExt: {
                extValue: "",
                cdExtId: ""
            }
        },
        partyContact:[{
            contactName:"",
            contactTel:""
        }],
        partyContactlList: [{
            contactType: "",
            isDefault: ""
        }],
        locationContactList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        registerLocationContactList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        operateLocationContactList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        depotLocationList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        loaLocationContactList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        contactEqplList: [{
            isDefault: "",
            eqpType: "",
            eqpStatus: "",
            eqpNature: "",
            eqpStr1: "",
            eqpStr2: ""
        }],
        queryParam: {
            partyType: null,
            isBuyer: "",
            isVendor: "",
            isTruck: "",
            isWarehouse: "",
            is3pl: "",
            cdExt: {
                extValue: "",
                cdExtId: ""
            }
        },
        depotList:[{
            cdDepotId:"",
            depotType:"",
            depotCode:"",
            depotName:"",
            depotLable:"",
            totalArea:"",
            usedArea:"",
            usableArea:""
        }],
        queryParam1: {},
        queryParam2: {
            eqpType: ""
        },
        queryParam3: {
            contactType: ""
        },
        queryParam11: {},
        queryParam22: {
            eqpType: "",
            eqpStatus: "",
            eqpNature: "",
        },
        queryParam33: {
            contactType: ""
        },
        searchVal11: '0',
        searchVal22: '0',
        searchVal33: '0',
        savedNewOrderInfo: '0',
        cdPartyId:null,
        cdEqpId:null,
        cdContactId:null,
        cdDriverId:null,
        locShortShowList: [],
        eqpShortShowList: [],
        contShortShowList: [],
        depotShortShowList:[],
        checkedCardValue: 'contact',
        getAllCountryList: {}, // 国家列表
        address00: "", // 改变 address —— 国
        address0: "", // 改变 address —— 省
        address1: "", // 改变 address —— 市
        address2: "", // 改变 address —— 区
        address3: "", // 改变 address —— 街道

        modifyCdLocationId: '', // 修改 合作商 - 地址信息 ， 地址id
        modifyCdEqpId: '', // 修改 合作商 - 设备信息 ， 设备id
        modifyCdContactId: '', // 修改 合作商 - 联系人信息 ， 联系人id
        modifyCdDepotId: '', //  修改 合作商 - 仓库信息 ， 仓库id
        linkNames: ["客户管理","客户模板管理"],
        linkHrefs: [],
        naSelectList: [],
        naShowSelectList: []
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
    methods: {
        chooseTheFileType(type) {
            switch (type) {
                case '0': // 上传合作商
                    $('#excelFile').addClass('uploadType1');
                    $('#excelFile').removeClass('uploadType2');
                    break;
                case '1': // 上传合作商信息
                    $('#excelFile').addClass('uploadType2');
                    $('#excelFile').removeClass('uploadType1');
                    break;
            }
            $('#excelFile').click();
        },
        chooseTheFile() {
            var that = this;
            that.clearShow = false;
            if ($('#excelFile').hasClass('uploadType1')) {
                that.filesUpload('0');
            } else {
                if ($('#excelFile').hasClass('uploadType2')) {
                    that.filesUpload('1');
                }
            }
        },
        filesUpload(type) {
            var that = this;
            switch (type) {
                case '0': // 上传合作商
                    fileUploadRequest(cmdUrl + '/import/partyData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
                case '1': // 上传合作商信息
                    fileUploadRequest(cmdUrl + '/import/partyInfoData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
            }
        },
        filesUploadSuc() {
            var that = this;
            that.clearShow = true;
            setTimeout(function () {
                $(".fileUploadLi .inputBox").css({"display": "inline-block"});
            }, 100);
            $(".ajax-load-pupup").remove();
            //获取列表
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
            };
            if (searchFormArr.partyType == '' || searchFormArr.partyType == 'null') {
                searchFormArr.partyType = null;
            }
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.totalPagesNum = res.pageInfo.total;
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        addOrderDetails(title) { // 新增
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.titleDisable = false;
            that.cooperPartyPositiveImgList=[];
            that.cooperPartyBackImgList=[];
            that.cooperPartyEqpPositiveImgList=[];
            that.cooperPartyEqpBackImgList=[];
            that.cooperPartyContactPositiveImgList=[];
            that.cooperPartyContactBackImgList=[];
            that.cooperPartyDriverPositiveImgList=[];
            that.cooperPartyDriverBackImgList=[];
            that.cooperPartyDepotPositiveImgList=[];
            that.cooperPartyDepotBackImgList=[];
            that.cooperPartyLocationPositiveImgList=[];
            that.cooperPartyLocationBackImgList=[];
            that.partyBaseInfo = {
                partyType: "",
                isBuyer: "",
                isVendor: "",
                isTruck: "",
                isWarehouse: "",
                is3pl: "",
                cdExt: {
                    extValue: "",
                    cdExtId: ""
                }
            };
            that.locationContactList = [{
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                isDefault: "",
                address: ""
            }];
            that.contactEqplList = [{
                isDefault: "",
                eqpType: "",
                eqpStatus: "",
                eqpNature: "",
                eqpStr1: "",
                eqpStr2: ""
            }];
            that.depotLocationList= [{
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                isDefault: "",
                address: ""
            }];
            that.partyContactlList = [{
                contactType: "",
                isDefault: ""
            }];
            that.savedNewOrderInfo = '0';

            that.locShortShowList = [];
            that.totalPagesNum11 = 0;
            that.pageList11 = [];
            that.currentPage11 = 1;
            $(".popupType11 .paging .pagingCon .pagination").animate({
                "left": "0px"
            }, 300);

            that.eqpShortShowList = [];
            that.totalPagesNum22 = 0;
            that.pageList22 = [];
            that.currentPage22 = 1;
            $(".popupType22 .paging .pagingCon .pagination").animate({
                "left": "0px"
            }, 300);

            that.contShortShowList = [];
            that.totalPagesNum33 = 0;
            that.pageList33 = [];
            that.currentPage33 = 1;
            $(".popupType33 .paging .pagingCon .pagination").animate({
                "left": "0px"
            }, 300);

            that.resetAddressParamFun('1');

        },
        getOrderDetails(title, partyItem) { // 详情
            this.templateTitle = title;
            var that = this;
            var cdExt1 = {
                extValue: partyItem.extValue,
                cdExtId: partyItem.cdExtId
            }
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.titleDisable = true;
            that.cooperPartyPositiveImgList=[];
            that.cooperPartyBackImgList=[];
            that.cooperPartyEqpPositiveImgList=[];
            that.cooperPartyEqpBackImgList=[];
            that.cooperPartyContactPositiveImgList=[];
            that.cooperPartyContactBackImgList=[];
            that.cooperPartyDriverPositiveImgList=[];
            that.cooperPartyDriverBackImgList=[];
            that.cooperPartyDepotPositiveImgList=[];
            that.cooperPartyDepotBackImgList=[];
            that.cooperPartyLocationPositiveImgList=[];
            that.cooperPartyLocationBackImgList=[];
            that.naSelectList = [];
            that.naShowSelectList = [];
            $(".a_select1").addClass("active");
            $(".a_selectOption1 p").removeClass("active");
            getRequest(cmdUrl + "/get/partyDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdPartyId=" + partyItem.cdPartyId, function (res) {
                that.partyBaseInfo = res.result.party;
                for(var i = 0 ; i < res.result.positivePictureList.length; i++){
                    that.cooperPartyPositiveImgList.push(ImgWebsite + res.result.positivePictureList[i].extValue);
                }
                for(var i = 0 ; i < res.result.negativePictureList.length; i++){
                    that.cooperPartyBackImgList.push(ImgWebsite + res.result.negativePictureList[i].extValue);
                }
                if (that.partyBaseInfo.isBuyer == null) {
                    that.partyBaseInfo.isBuyer = '';
                }
                if (that.partyBaseInfo.isVendor == null) {
                    that.partyBaseInfo.isVendor = '';
                }
                if (that.partyBaseInfo.isTruck == null) {
                    that.partyBaseInfo.isTruck = '';
                }
                if (that.partyBaseInfo.isWarehouse == null) {
                    that.partyBaseInfo.isWarehouse = '';
                }
                if (that.partyBaseInfo.is3pl == null) {
                    that.partyBaseInfo.is3pl = '';
                }
                if (that.partyBaseInfo.cdExt == null) {
                    that.partyBaseInfo.cdExt = cdExt1;
                }

                that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
            })
        },
        changeOrderDetails(title, partyItem) { // 修改
            this.templateTitle = title;
            var that = this;
            var cdExt1 = {
                extValue: partyItem.extValue,
                cdExtId: partyItem.cdExtId
            }
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.titleDisable = false;
            that.savedNewOrderInfo = '1';
            that.cooperPartyPositiveImgList=[];
            that.cooperPartyBackImgList=[];
            that.cooperPartyEqpPositiveImgList=[];
            that.cooperPartyEqpBackImgList=[];
            that.cooperPartyContactPositiveImgList=[];
            that.cooperPartyContactBackImgList=[];
            that.cooperPartyDriverPositiveImgList=[];
            that.cooperPartyDriverBackImgList=[];
            that.cooperPartyDepotPositiveImgList=[];
            that.cooperPartyDepotBackImgList=[];
            that.cooperPartyLocationPositiveImgList=[];
            that.cooperPartyLocationBackImgList=[];
            that.naSelectList = [];
            that.naShowSelectList = [];
            $(".a_select1").removeClass("active");
            $(".a_selectOption1 p").removeClass("active");
            getRequest(cmdUrl + "/get/partyDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdPartyId=" + partyItem.cdPartyId+"&isDefault=1", function (res) {
               that.cdPartyId=res.result.party.cdPartyId;
               if(res.result.contactList[0]!=null){
                   that.partyContact=res.result.contactList;
               }
               if(res.result.registerLocationList[0]!=null){
                   that.registerLocationContactList=res.result.registerLocationList;
               }
               if(res.result.operateLocationList[0]!=null) {
                   that.operateLocationContactList = res.result.operateLocationList;
               }
               that.partyBaseInfo = res.result.party;
                for(var i = 0 ; i < res.result.positivePictureList.length; i++){
                    that.cooperPartyPositiveImgList.push(ImgWebsite + res.result.positivePictureList[i].extValue);
                }
                for(var i = 0 ; i < res.result.negativePictureList.length; i++){
                    that.cooperPartyBackImgList.push(ImgWebsite + res.result.negativePictureList[i].extValue);
                }
                if (that.partyBaseInfo.isBuyer == null) {
                    that.partyBaseInfo.isBuyer = '';
                }
                if (that.partyBaseInfo.isVendor == null) {
                    that.partyBaseInfo.isVendor = '';
                }
                if (that.partyBaseInfo.isTruck == null) {
                    that.partyBaseInfo.isTruck = '';
                }
                if (that.partyBaseInfo.isWarehouse == null) {
                    that.partyBaseInfo.isWarehouse = '';
                }
                if (that.partyBaseInfo.is3pl == null) {
                    that.partyBaseInfo.is3pl = '';
                }
                if (that.partyBaseInfo.cdExt == null) {
                    that.partyBaseInfo.cdExt = cdExt1;
                }
                that.locationContactList = [{
                    locationType: "",
                    countryCode: "100000",
                    provinceCode: "",
                    cityCode: "",
                    districtCode: "",
                    isDefault: "",
                    address: ""
                }];
                that.contactEqplList = [{
                    isDefault: "",
                    eqpType: "",
                    eqpStatus: "",
                    eqpNature: "",
                    eqpStr1: "",
                    eqpStr2: ""
                }];
                that.partyContactlList = [{
                    contactType: "",
                    isDefault: ""
                }];

                that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
            })
        },
        getDetailLocShortShowList(partyCode) { // 获取 详情 - 地址列表
            var that = this;
            var searchFormArr11 = {
                partyCode: partyCode,
                pageInfo: {
                    pageNum: 1,
                    pageSize: that.queryItemPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr11, function (res) {
                that.locShortShowList = res.result;
                if(that.locShortShowList != null && that.locShortShowList.length > 0){
                    for(var k=0;k<that.locShortShowList.length;k++){
                        var lable = that.locShortShowList[k].locationLable;
                        if(lable != null){
                            var lableStr = [];
                            var locationLable = lable.split(',');
                            for(var p=0;p<that.selectListData.locationLableList.length;p++){
                                for(var q=0;q<locationLable.length;q++){
                                    if(that.selectListData.locationLableList[p].code == locationLable[q]){
                                        lableStr.push(that.selectListData.locationLableList[p].text);
                                        that.naShowSelectList[k] = lableStr.toString();
                                    }
                                }
                            }
                        }
                    }
                }
                that.totalPagesNum11 = res.pageInfo.total;
                that.pageList11 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList11[i] = i + 1;
                }
                that.currentPage11 = 1;
                $(".popupType11 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
            });
        },
        getDetailEqpShortShowList(partyCode) { // 获取 详情 - 设备列表
            var that = this;
            var searchFormArr22 = {
                partyCode: partyCode,
                pageInfo: {
                    pageNum: 1,
                    pageSize: that.queryItemPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr22, function (res) {
                that.eqpShortShowList = res.result;
                that.totalPagesNum22 = res.pageInfo.total;
                that.pageList22 = [];
                for (var m = 0; m < res.pageInfo.pages; m++) {
                    that.pageList22[m] = m + 1;
                }
                that.currentPage22 = 1;
                $(".popupType22 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
            });
        },
        getDetailContShortShowList(partyCode) { // 获取 详情 - 联系人列表
            var that = this;
            var searchFormArr33 = {
                partyCode: partyCode,
                pageInfo: {
                    pageNum: 1,
                    pageSize: that.queryItemPageSize
                }
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr33, function (res) {
                that.contShortShowList = res.result;
                that.totalPagesNum33 = res.pageInfo.total;
                that.pageList33 = [];
                for (var n = 0; n < res.pageInfo.pages; n++) {
                    that.pageList33[n] = n + 1;
                }
                that.currentPage33 = 1;
                $(".popupType33 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
            });
        },
        getDetailDepotShortShowList(partyCode) {
            var that = this;
            var searchFormArr44 = {
                partyCode: partyCode,
                pageInfo: {
                    pageNum: 1,
                    pageSize: that.queryItemPageSize
                }
            };
            postRequest(cmdUrl + "/query/depotInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr44, function (res) {
                that.depotShortShowList = res.result;
                that.totalPagesNum44 = res.pageInfo.total;
                that.pageList44 = [];
                for (var n = 0; n < res.pageInfo.pages; n++) {
                    that.pageList44[n] = n + 1;
                }
                that.currentPage44 = 1;
                $(".popupType33 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
            });
        },
        deleteOrderDetails(partyItem) { // 删除
            var that = this;
            var r = confirm("确定删除当前合作商");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdParty.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdPartyId=" + partyItem.cdPartyId, function (res) {
                    //获取订单列表
                    var searchFormArr = that.queryParam;
                    searchFormArr.pageInfo = {
                        pageNum: that.currentPage,
                        pageSize: that.queryPageSize
                    };
                    if (searchFormArr.partyType == '' || searchFormArr.partyType == 'null') {
                        searchFormArr.partyType = null;
                    }
                    postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                        that.tableOrderList = res.result;
                        that.totalPagesNum = res.pageInfo.total;
                        that.pageList = [];
                        for (var i = 0; i < res.pageInfo.pages; i++) {
                            that.pageList[i] = i + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                })
            }
        },
        defaultOrderDetails(partyItem, type) { // 合作商设为默认、取消默认
            var that = this, params = {};
            switch (type) {
                case '1': // 设为默认
                    params = {
                        cdPartyId: partyItem.cdPartyId,
                        isDefault: 1
                    };
                    break;
                case '0': // 取消默认
                    params = {
                        cdPartyId: partyItem.cdPartyId,
                        isDefault: 0
                    };
                    break;
            }
            postRequest(cmdUrl + "/save/setDefaultParty.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                //获取订单列表
                var searchFormArr = that.queryParam;
                searchFormArr.pageInfo = {
                    pageNum: that.currentPage,
                    pageSize: that.queryPageSize
                };
                if (searchFormArr.partyType == '' || searchFormArr.partyType == 'null') {
                    searchFormArr.partyType = null;
                }
                postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.totalPagesNum = res.pageInfo.total;
                    that.pageList = [];
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            })
        },
        chooseAddressFun(index, type) { // 选择地址 - 按钮
            var that = this;
            that.popupType = type;
            that.currentArIndex = index;
            that.queryParam1 = {};
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum: 1,
                pageSize: 12
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.addressList = res.result;
                that.currentPage1 = 1;
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList1[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        chooseDeviceFun(index, type) { // 选择设备 - 按钮
            var that = this;
            that.popupType = type;
            that.currentDqIndex = index;
            that.queryParam2 = {
                eqpType: "",
                eqpStatus: "",
                eqpNature: "",
            };
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum: 1,
                pageSize: 12
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.deviceList = res.result;
                that.currentPage2 = 1;
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum2 = res.pageInfo.total;
                that.pageList2 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList2[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        chooseContactFun(index, type) { // 选择联系人 - 按钮
            var that = this;
            that.popupType = type;
            that.currentCtIndex = index;
            that.queryParam3 = {
                contactType: ""
            };
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum: 1,
                pageSize: 12
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
                that.currentPage3 = 1;
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum3 = res.pageInfo.total;
                that.pageList3 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList3[i] = i + 1;
                }
                $(".maskLayer1").show();
            })
        },
        selectAddress(addressItem, index) { // 选择地址 - tr
            var that = this;
            addressItem.cdLocationId = undefined;
            addressItem.isDefault = '';
            this.$set(this.locationContactList, this.currentArIndex, addressItem);
            $(".maskLayer1").hide();
        },
        selectDqFun(deviceItem, index) { // 选择设备 - tr
            var that = this;
            deviceItem.cdEqpId = undefined;
            deviceItem.isDefault = '';
            this.$set(this.contactEqplList, this.currentDqIndex, deviceItem);
            $(".maskLayer1").hide();
        },
        selectCtFun(contactItem, index) { // 选择联系人 - tr
            var that = this;
            contactItem.cdContactId = undefined;
            contactItem.isDefault = '';
            this.$set(this.partyContactlList, this.currentCtIndex, contactItem);
            $(".maskLayer1").hide();
        },
        changePage(pageNum, clickStatus) {
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage > pageNum) {
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage = pageNum;
                } else {
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage = pageNum;
                }
            } else {
                this.currentPage = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            };
            if (searchFormArr.partyType == '' || searchFormArr.partyType == 'null') {
                searchFormArr.partyType = null;
            }
            postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        changePage1(pageNum, clickStatus) { // 弹窗地址列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage1 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage1 > pageNum) {
                    $(".popupType1 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage1 = pageNum;
                } else {
                    $(".popupType1 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage1 = pageNum;
                }
            } else {
                this.currentPage1 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = that.queryParam1;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.addressList = res.result;
                that.pageList1 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList1[i] = i + 1;
                }
            })
        },
        changePage2(pageNum, clickStatus) { // 弹窗设备列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage2 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage2 > pageNum) {
                    $(".popupType2 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage2 = pageNum;
                } else {
                    $(".popupType2 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage2 = pageNum;
                }
            } else {
                this.currentPage2 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = that.queryParam2;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.deviceList = res.result;
                that.pageList2 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList2[i] = i + 1;
                }
            })
        },
        changePage3(pageNum, clickStatus) { // 弹窗联系人列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage3 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage3 > pageNum) {
                    $(".popupType3 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage3 = pageNum;
                } else {
                    $(".popupType3 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage3 = pageNum;
                }
            } else {
                this.currentPage3 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = that.queryParam3;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.contactList = res.result;
                that.pageList3 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList3[i] = i + 1;
                }
            })
        },
        changePage11(pageNum, clickStatus) { // 合作商 - 地址列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType11 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage11 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage11 > pageNum) {
                    $(".popupType11 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage11 = pageNum;
                } else {
                    $(".popupType11 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage11 = pageNum;
                }
            } else {
                this.currentPage11 = pageNum;
            }
            //翻页
            var that = this;
            if (that.searchVal11 == '1') {
                that.queryParam11 = that.locationContactList[0];
            } else {
                that.queryParam11 = {};
            }
            that.queryParam11.partyCode = that.partyBaseInfo.partyCode;
            var searchFormArr = that.queryParam11;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.locShortShowList = res.result;
                that.totalPagesNum11 = res.pageInfo.total;
                that.pageList11 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList11[i] = i + 1;
                }
            })
        },
        changePage22(pageNum, clickStatus) { // 合作商 - 设备列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType22 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage22 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage22 > pageNum) {
                    $(".popupType22 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage22 = pageNum;
                } else {
                    $(".popupType22 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage22 = pageNum;
                }
            } else {
                this.currentPage22 = pageNum;
            }
            //翻页
            var that = this;
            if (that.searchVal22 == '1') {
                that.queryParam22 = that.contactEqplList[0];
            } else {
                that.queryParam22 = {};
            }
            that.queryParam22.partyCode = that.partyBaseInfo.partyCode;
            var searchFormArr = that.queryParam22;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.eqpShortShowList = res.result;
                that.totalPagesNum22 = res.pageInfo.total;
                that.pageList22 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList22[i] = i + 1;
                }
            })
        },
        changePage33(pageNum, clickStatus) { // 合作商 - 联系人列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType33 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage33 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage33 > pageNum) {
                    $(".popupType33 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage33 = pageNum;
                } else {
                    $(".popupType33 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage33 = pageNum;
                }
            } else {
                this.currentPage33 = pageNum;
            }
            //翻页
            var that = this;
            if (that.searchVal33 == '1') {
                that.queryParam33 = that.partyContactlList[0];
            } else {
                that.queryParam33 = {};
            }
            that.queryParam33.partyCode = that.partyBaseInfo.partyCode;
            var searchFormArr = that.queryParam33;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.contShortShowList = res.result;
                that.totalPagesNum33 = res.pageInfo.total;
                that.pageList33 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList33[i] = i + 1;
                }
            })
        },
        changePage44(pageNum, clickStatus) { // 合作商 - 联系人列表
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupType44 .paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage44 = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage44 > pageNum) {
                    $(".popupType44 .paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage44 = pageNum;
                } else {
                    $(".popupType44 .paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage44 = pageNum;
                }
            } else {
                this.currentPage44 = pageNum;
            }
            //翻页
            var that = this;
            if (that.searchVal44 == '1') {
                that.queryParam44 = that.depotList[0];
            } else {
                that.queryParam44 = {};
            }
            that.queryParam44.partyCode = that.partyBaseInfo.partyCode;
            var searchFormArr = that.queryParam44;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/query/depotInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.depotShortShowList = res.result;
                that.totalPagesNum44 = res.pageInfo.total;
                that.pageList44 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList44[i] = i + 1;
                }
            })
        },
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = { // 搜索条件
                partyType: null,
                isBuyer: "",
                isVendor: "",
                isTruck: "",
                isWarehouse: "",
                is3pl: "",
                cdExt: {
                    extValue: "",
                    cdExtId: ""
                }
            };
        },
        getSearchVal() { // 搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 && splitCountNum < 2000) {
                that.multipleNum = that.queryPageSize;
                var searchFormArr = this.queryParam;
                searchFormArr.pageInfo = {
                    pageNum: 1,
                    pageSize: that.queryPageSize
                };
                if (searchFormArr.partyType == '' || searchFormArr.partyType == 'null') {
                    searchFormArr.partyType = null;
                }
                //获取订单列表
                postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.totalPagesNum = res.pageInfo.total;
                    that.pageList = [];
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    }, 300);
                    that.publicChangeBtnStatus();
                })
            } else {
                imitatePopup("请输入大于1且小于2000的正整数",'alert');
                return false;
            }
        },
        getSearchVal1() { // 弹窗地址列表
            var that = this;
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.addressList = res.result;
                that.currentPage1 = 1;
                $(".popupType1 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList1[i] = i + 1;
                }
            })
        },
        getSearchVal2() { // 弹窗设备列表
            var that = this;
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.deviceList = res.result;
                that.currentPage2 = 1;
                $(".popupType2 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum2 = res.pageInfo.total;
                that.pageList2 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList2[i] = i + 1;
                }
            })
        },
        getSearchVal3() { // 弹窗联系人列表
            var that = this;
            var params = that.queryParam3;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryModelPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
                that.currentPage3 = 1;
                $(".popupType3 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum3 = res.pageInfo.total;
                that.pageList3 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList3[i] = i + 1;
                }
            })
        },
        getSearchVal11() { // 合作商 - 地址列表
            var that = this;
            that.searchVal11 = '1';
            that.queryParam11 = {
                partyCode: that.partyBaseInfo.partyCode,
                locationName: that.locationContactList[0].locationName,
                locationType: that.locationContactList[0].locationType,
                locationCode: that.locationContactList[0].locationCode,
                countryCode: '100000',
                provinceCode: that.locationContactList[0].provinceCode,
                cityCode: that.locationContactList[0].cityCode,
                districtCode: that.locationContactList[0].districtCode,
                street: that.locationContactList[0].street,
                //    postCode:that.locationContactList[0].postCode,
                address: that.locationContactList[0].address
            };
            var params = that.queryParam11;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.locShortShowList = res.result;
                that.currentPage11 = 1;
                $(".popupType11 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum11 = res.pageInfo.total;
                that.pageList11 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList11[i] = i + 1;
                }
            })
        },
        getSearchVal22() { // 合作商 - 设备列表
            var that = this;
            that.searchVal22 = '1';
            that.queryParam22 = {
                partyCode: that.partyBaseInfo.partyCode,
                eqpName: that.contactEqplList[0].eqpName,
                eqpType: that.contactEqplList[0].eqpType,
                eqpStatus: that.contactEqplList[0].eqpStatus,
                eqpNature: that.contactEqplList[0].eqpNature,
                eqpBrand: that.contactEqplList[0].eqpBrand,
                eqpSpec: that.contactEqplList[0].eqpSpec,
                eqpNo: that.contactEqplList[0].eqpNo,
                eqpLength: that.contactEqplList[0].eqpLength,
                eqpWidth: that.contactEqplList[0].eqpWidth,
                eqpHeight: that.contactEqplList[0].eqpHeight,
                eqpStr1: that.contactEqplList[0].eqpStr1,
                eqpStr2: that.contactEqplList[0].eqpStr2,
                remark: that.contactEqplList[0].remark
            };
            var params = that.queryParam22;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.eqpShortShowList = res.result;
                that.currentPage22 = 1;
                $(".popupType22 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum22 = res.pageInfo.total;
                that.pageList22 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList22[i] = i + 1;
                }
            })
        },
        getSearchVal33() { // 合作商 - 联系人列表
            var that = this;
            that.searchVal33 = '1';
            that.queryParam33 = {
                partyCode: that.partyBaseInfo.partyCode,
                contactType: that.partyContactlList[0].contactType,
                contactName: that.partyContactlList[0].contactName,
                contactTel: that.partyContactlList[0].contactTel,
                contactEmail: that.partyContactlList[0].contactEmail,
                contactAddress: that.partyContactlList[0].contactAddress,
                remark: that.partyContactlList[0].remark
            };
            var params = that.queryParam33;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contShortShowList = res.result;
                that.currentPage33 = 1;
                $(".popupType33 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum33 = res.pageInfo.total;
                that.pageList33 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList33[i] = i + 1;
                }
            })
        },
        getSearchVal44() { // 合作商 - 联系人列表
            var that = this;
            that.searchVal44 = '1';
            that.queryParam44 = {
                partyCode: that.partyBaseInfo.partyCode,
                depotType:that.depotList[0].depotType,
                depotCode:that.depotList[0].depotCode,
                depotName:that.depotList[0].depotName,
                depotLable:that.depotList[0].depotLable

            };
            var params = that.queryParam44;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryItemPageSize
            };
            postRequest(cmdUrl + "/query/depotInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.depotShortShowList = res.result;
                that.currentPage44 = 1;
                $(".popupType44 .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                that.totalPagesNum44 = res.pageInfo.total;
                that.pageList44 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList44[i] = i + 1;
                }
            })
        },
        resetSearchVal11() {
            var that = this;
            that.locationContactList = [{
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                isDefault: "",
                address: ""
            }];
            that.searchVal11 = '0';
            that.modifyCdLocationId = '';
            that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
        },
        resetSearchVal22() {
            var that = this;
            that.contactEqplList = [{
                isDefault: "",
                eqpType: "",
                eqpStatus: "",
                eqpNature: "",
                eqpStr1: "",
                eqpStr2: ""
            }];
            that.loaLocationContactList=[{
                provinceCode:"",
                countryCode:"",
                cityCode:"",
                districtCode:"",
                address:"",
                street:""
            }];
            $("input[name='label']").prop('checked', false);
            that.searchVal22 = '0';
            that.modifyCdEqpId = '';
            that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
        },
        resetSearchVal33() {
            var that = this;
            that.partyContactlList = [{
                contactType: "",
                isDefault: ""
            }];
            that.searchVal33 = '0';
            that.modifyCdContactId = '';
            that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
        },
        resetDepot(){
            var that = this;
            that.depotList = [{
                depotType: "",
                depotCode: "",
                depotName: "",
                depotLable: "",
                totalArea: "",
                usedArea: "",
                usableArea:""
            }];
            that.depotLocationList=[{
                provinceCode:"",
                countryCode:"",
                cityCode:"",
                districtCode:"",
                address:"",
                street:""
            }];
            that.modifyCdDepotId = '';
            that.naSelectList = [];
            that.naShowSelectList = [];
            $(".a_select1").removeClass("active");
            $(".a_selectOption1 p").removeClass("active");
            //that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
        },
        editOrderInfo() {
            var that = this;
            if (that.partyBaseInfo.partyType == "" || that.partyBaseInfo.partyType == undefined) {
                imitatePopup("请选择合作商类型",'alert');
                return false;
            }
            if (that.partyBaseInfo.partyName == "" || that.partyBaseInfo.partyName == undefined) {
                imitatePopup("请输入合作商名称",'alert');
                return false;
            }
            if (that.partyBaseInfo.partyCode == "" || that.partyBaseInfo.partyCode == undefined) {
                imitatePopup("请输入合作商编码",'alert');
                return false;
            }
            if (that.partyContact[0].contactName == "" || that.partyContact[0].contactName == undefined) {
                imitatePopup("请输入合作商联系人",'alert');
                return false;
            }
            if (that.partyContact[0].contactTel == "" || that.partyContact[0].contactTel == undefined) {
                imitatePopup("请输入联系人手机号",'alert');
                return false;
            }
            var paramObj = {
                cdPartyId:that.partyBaseInfo.cdPartyId,
                partyType:that.partyBaseInfo.partyType,
                partyName:that.partyBaseInfo.partyName,
                partyCode:that.partyBaseInfo.partyCode,
                isVendor:that.partyBaseInfo.isVendor,
                isBuyer:that.partyBaseInfo.isBuyer,
                isTruck:that.partyBaseInfo.isTruck,
                isWarehouse:that.partyBaseInfo.isWarehouse,
                is3pl:that.partyBaseInfo.is3pl,
                contact:that.partyContact[0],
                registerLocation:that.registerLocationContactList[0],
                operateLocation:that.operateLocationContactList[0]
            };
            //保存服务商
            postRequest(cmdUrl + "/save/cdParty.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }

            });
        },
        saveNewOrderInfo() {
            var that = this;
            if (that.partyBaseInfo.partyType == "" || that.partyBaseInfo.partyType == undefined) {
                imitatePopup("请选择合作商类型",'alert');
                return false;
            }
            if (that.partyBaseInfo.partyName == "" || that.partyBaseInfo.partyName == undefined) {
                imitatePopup("请输入合作商名称",'alert');
                return false;
            }
            if (that.partyBaseInfo.partyCode == "" || that.partyBaseInfo.partyCode == undefined) {
                imitatePopup("请输入合作商编码",'alert');
                return false;
            }
            if (that.partyContact[0].contactName == "" || that.partyContact[0].contactName == undefined) {
                imitatePopup("请输入合作商联系人",'alert');
                return false;
            }
            if (that.partyContact[0].contactTel == "" || that.partyContact[0].contactTel == undefined) {
                imitatePopup("请输入联系人手机号",'alert');
                return false;
            }
            var paramObj = {
                partyType:that.partyBaseInfo.partyType,
                partyName:that.partyBaseInfo.partyName,
                partyCode:that.partyBaseInfo.partyCode,
                isVendor:that.partyBaseInfo.isVendor,
                isBuyer:that.partyBaseInfo.isBuyer,
                isTruck:that.partyBaseInfo.isTruck,
                isWarehouse:that.partyBaseInfo.isWarehouse,
                is3pl:that.partyBaseInfo.is3pl,
                contact:that.partyContact[0],
                registerLocation:that.registerLocationContactList[0],
                operateLocation:that.operateLocationContactList[0]
            };
            postRequest(cmdUrl + "/save/cdParty.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (res) {
                that.titleDisable = true;
                that.savedNewOrderInfo = '1';
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    //closeSideslip();//关闭侧滑
                    //that.getSearchVal();//调用查询页面
                    that.cdPartyId=res.result.cdPartyId;
                    imitatePopup(res.msg,'alert');
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            });
        },
        addAddressFun() { // 新增地址
            var that = this;
            that.locationContactList = [];
            that.locationContactList.push({
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                isDefault: "",
                address: ""
            });
            that.resetAddressParamFun('1');
        },
        addDeviceFun() { // 新增设备
            var that = this;
            that.contactEqplList = [];
            that.contactEqplList.push({
                isDefault: "",
                eqpType: "",
                eqpStatus: "",
                eqpNature: "",
                eqpStr1: "",
                eqpStr2: ""
            });
        },
        addConactFun() { // 新增联系人
            var that = this;
            that.partyContactlList = [];
            that.partyContactlList.push({
                contactType: "",
                isDefault: ""
            });
        },
        saveLocInfo(indexx) { // 保存合作商下的地址
            var that = this;
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            var check = 0;
            if (that.locationContactList[indexx].locationType == '' || that.locationContactList[indexx].provinceCode == '' ||
                that.locationContactList[indexx].cityCode == '' || that.locationContactList[indexx].districtCode == '' || that.locationContactList[indexx].street == '') {
                check += 1;
            }
            if (check != 0) {
                imitatePopup('请完整填写必填项','alert');
                return false;
            }
            that.locationContactList[indexx].refId = that.partyBaseInfo.cdPartyId;
            that.locationContactList[indexx].partyCode = that.partyBaseInfo.partyCode;
            that.locationContactList[indexx].countryCode = '100000';
            var paramObj = that.locationContactList[indexx];
            if (that.clickBtnType == 'edit' && that.modifyCdLocationId != '') {
                paramObj.cdLocationId = that.modifyCdLocationId;
            } else {
                delete paramObj.cdLocationId;
            }
            if(that.naSelectList.length > 0){
                var orderNature = [];
                for(var a=0;a<that.naSelectList.length;a++){
                    orderNature.push(that.naSelectList[a].code);
                }
                paramObj.locationLable = orderNature.toString();
            }
            postRequest(cmdUrl + "/save/cdLocation?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (data) {
                that.cdLocationId = data.cdLocationId;
                if (data != null && data.result != null) {
                    that.modifyCdLocationId = '';
                    that.locationContactList = [{
                        locationType: "",
                        countryCode: "100000",
                        provinceCode: "",
                        cityCode: "",
                        districtCode: "",
                        isDefault: "",
                        address: ""
                    }];
                    that.getDetailLocShortShowList(that.partyBaseInfo.partyCode); //获取 合作商 - 地址列表
                } else {
                    imitatePopup('保存地址信息失败！','alert');
                }
            });
        },
        saveEqpInfo(indexx) { // 保存合作商下设备
            var that = this;
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            var check = 0;
            if (that.contactEqplList[indexx].eqpType == '' || that.contactEqplList[indexx].eqpStatus == null || that.contactEqplList[indexx].eqpNature == '' || that.contactEqplList[indexx].eqpNo == '') {
                check += 1;
            }
            console.log(check)
            if (check != 0) {
                imitatePopup('请完整填写必填项','alert');
                return false;
            }
            if(that.loaLocationContactList[0].countryCode=='' || that.loaLocationContactList[0].provinceCode=='' || that.loaLocationContactList[0].cityCode=='' || that.loaLocationContactList[0].districtCode==''){
                imitatePopup("请选择省市区","alert");
                return false;
            }
            if(that.loaLocationContactList[0].street=='' || that.loaLocationContactList[0].street == null){
                imitatePopup("请输入街道","alert");
                return false;
            }
            if(that.loaLocationContactList[0].address=='' || that.loaLocationContactList[0].address == null){
                imitatePopup("请输入详细地址","alert");
                return false;
            }
            var labelArr = [];
            $("input[name='label']:checked").each(function(i){
                labelArr.push($(this).val())
            })
            that.contactEqplList[indexx].eqpLabel = labelArr.toString();
            that.contactEqplList[indexx].refId = that.partyBaseInfo.cdPartyId;
            that.contactEqplList[indexx].partyCode = that.partyBaseInfo.partyCode;
            var paramObj = that.contactEqplList[indexx];
            paramObj.provinceCode = that.loaLocationContactList[0].provinceCode;
            paramObj.countryCode = that.loaLocationContactList[0].countryCode;
            paramObj.cityCode = that.loaLocationContactList[0].cityCode;
            paramObj.districtCode = that.loaLocationContactList[0].districtCode;
            paramObj.address = that.loaLocationContactList[0].address;
            paramObj.street = that.loaLocationContactList[0].street;

            if (that.clickBtnType == 'edit' && that.modifyCdEqpId != '') {
                paramObj.cdEqpId = that.modifyCdEqpId;
            } else {
                delete paramObj.cdEqpId;
            }
            postRequest(cmdUrl + "/save/cdEqp?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (data) {
                that.cdEqpId = data.cdEqpId;
                if (data != null && data.result != null) {
                    that.modifyCdEqpId = '';
                    that.contactEqplList = [{
                        isDefault: "",
                        eqpType: "",
                        eqpStatus: "",
                        eqpNature: "",
                        eqpStr1: "",
                        eqpStr2: ""
                    }];
                    that.loaLocationContactList=[{
                        provinceCode:"",
                        countryCode:"",
                        cityCode:"",
                        districtCode:"",
                        address:"",
                        street:""
                    }]
                    $("input[name='label']").prop('checked', false);
                    that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode); // 获取 详情 - 设备列表
                } else {
                    imitatePopup('保存设备信息失败！','alert');
                }
            });
        },
        saveDepotInfo(indexx) { // 保存合作商下仓库
            var that = this;
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            var check = 0;
            if (that.depotList[indexx].depotType == '' || that.depotList[indexx].depotCode == null || that.depotList[indexx].depotName == '' || that.depotList[indexx].depotLable == ''
                || that.depotList[indexx].totalArea == '' || that.depotList[indexx].usedArea == '' || that.depotList[indexx].usableArea == '') {
                check += 1;
            }
            if (check != 0) {
                imitatePopup('请完整填写必填项','alert');
                return false;
            }
            if(that.depotLocationList[0].countryCode=='' || that.depotLocationList[0].provinceCode=='' || that.depotLocationList[0].cityCode=='' || that.depotLocationList[0].districtCode==''){
                imitatePopup("请选择省市区","alert");
                return false;
            }
            if(that.depotLocationList[0].street=='' || that.depotLocationList[0].street == null){
                imitatePopup("请输入街道","alert");
                return false;
            }
            if(that.depotLocationList[0].address=='' || that.depotLocationList[0].address == null){
                imitatePopup("请输入详细地址","alert");
                return false;
            }
            if (that.clickBtnType == 'edit' && that.modifyCdDepotId != '') {
                that.depotList[0].cdDepotId = that.modifyCdDepotId;
            } else {
                delete that.depotList[0].cdDepotId;
            }
            var paramObj = {
                partyCode:that.partyBaseInfo.partyCode,
                depot:that.depotList[0],
                location:that.depotLocationList[0]
            };
            postRequest(cmdUrl + "/save/depotInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (data) {
                that.cdDepotId = data.cdDepotId;
                if (data != null && data.result != null) {
                    that.modifycdDepotId = '';
                    that.depotList = [{
                        depotType: "",
                        depotCode: "",
                        depotName: "",
                        depotLable: "",
                        totalArea: "",
                        usedArea: "",
                        usableArea:""
                    }];
                    that.depotLocationList=[{
                        provinceCode:"",
                        countryCode:"",
                        cityCode:"",
                        districtCode:"",
                        address:"",
                        street:""
                    }];
                    that.naSelectList = [];
                    that.naShowSelectList = [];
                    $(".a_select1").removeClass("active");
                    $(".a_selectOption1 p").removeClass("active");
                    that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode); // 获取 详情 - 仓库列表
                } else {
                    imitatePopup('保存仓库信息失败！','alert');
                }
            });

        },
        saveContInfo(indexx) { // 保存合作商下联系人
            var that = this;
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            var check = 0;
            if (that.partyContactlList[indexx].contactType == '' || that.partyContactlList[indexx].contactTel == '') {
                check += 1;
            }
            if (check != 0) {
                imitatePopup('请完整填写必填项','alert');
                return false;
            }
            that.partyContactlList[indexx].refId = that.partyBaseInfo.cdPartyId;
            that.partyContactlList[indexx].partyCode = that.partyBaseInfo.partyCode;
            var paramObj = that.partyContactlList[indexx];
            if (that.clickBtnType == 'edit' && that.modifyCdContactId != '') {
                paramObj.cdContactId = that.modifyCdContactId;
            } else {
                delete paramObj.cdContactId;
            }
            postRequest(cmdUrl + "/save/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramObj, function (data) {
                that.cdContactId = data.cdContactId;
                if (data != null && data.result != null) {
                    that.modifyCdContactId = '';
                    that.partyContactlList = [{
                        contactType: "",
                        isDefault: ""
                    }];
                    that.getDetailContShortShowList(that.partyBaseInfo.partyCode); // 获取 详情 - 联系人列表
                } else {
                    imitatePopup('保存联系人信息失败！','alert');
                }
            });
        },
        delLocInfo(locShortShow, indexes) { // 删除合作商下的地址，，，，同货点删除
            var that = this;
            var r = confirm("确定删除该地址？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + locShortShow.cdLocationId, function (res) {
                    that.locationContactList = [{
                        locationType: "",
                        countryCode: "100000",
                        provinceCode: "",
                        cityCode: "",
                        districtCode: "",
                        isDefault: "",
                        address: ""
                    }];
                    that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                })
            }
        },
        delEqpInfo(eqpShortShow, indexes) { // 删除合作商下设备，，，，同设备删除
            var that = this;
            var r = confirm("确定删除该设备？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + eqpShortShow.cdEqpId, function (res) {
                    that.contactEqplList = [{
                        isDefault: "",
                        eqpType: "",
                        eqpStatus: "",
                        eqpNature: "",
                        eqpStr1: "",
                        eqpStr2: ""
                    }];
                    that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                })
            }
        },
        delContInfo(contShortShow, indexes) { // 删除合作商下联系人，，，，同联系人删除
            var that = this;
            var r = confirm("确定删除该联系人？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + contShortShow.cdContactId, function (res) {
                    that.partyContactlList = [{
                        contactType: "",
                        isDefault: ""
                    }];
                    that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                })
            }
        },
        delDepotInfo(depotShortShow, indexes) { // 删除合作商下联系人，，，，同联系人删除
            var that = this;
            var r = confirm("确定删除仓库信息？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/depotInfoById.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdDepotId=" + depotShortShow.cdDepotId, function (res) {
                    that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
                    that.resetDepot();
                })
            }
        },
        setLocDefault(locItem, type) { // 合作商-地址信息 设为默认or取消默认
            var that = this;
            switch (type) {
                case '1': // 设为默认
                    cdLocationId = locItem.cdLocationId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdLocationId = locItem.cdLocationId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + cdLocationId + "&isDefault=" + isDefault, function (res) {
                if (res.msg == "SUCCESS" || res.msg == "success") {
                    that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                } else {
                    imitatePopup(res.msg,'alert')
                }
            })
        },
        setEqpDefault(eqpItem, type) { // 合作商-设备信息 设为默认or取消默认
            var that = this;
            switch (type) {
                case '1': // 设为默认
                    cdEqpId = eqpItem.cdEqpId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdEqpId = eqpItem.cdEqpId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + cdEqpId + "&isDefault=" + isDefault, function (res) {
                if (res.msg == "SUCCESS" || res.msg == "success") {
                    that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                } else {
                    imitatePopup(res.msg,'alert')
                }
            })
        },
        setContDefault(contItem, type) { // 合作商-联系人信息 设为默认or取消默认
            var that = this;
            switch (type) {
                case '1': // 设为默认
                    cdContactId = contItem.cdContactId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdContactId = contItem.cdContactId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + cdContactId + "&isDefault=" + isDefault, function (res) {
                if (res.msg == "SUCCESS" || res.msg == "success") {
                    that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                } else {
                    imitatePopup(res.msg,'alert')
                }
            })
        },
        setDepotDefault(contItem, type) { // 合作商-联系人信息 设为默认or取消默认
            var that = this;
            console.log(contItem)
            var cdDepot ={
                cdDepotId:contItem.cdDepotId,
                isDefault:1,
                refId:contItem.refId
            };
            postRequest(cmdUrl + "/set/defaultDepotByModel?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,cdDepot, function (res) {
                if (res.msg == "SUCCESS" || res.msg == "success") {
                    that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
                } else {
                    imitatePopup(res.msg,'alert')
                }
            })
        },
        selectLocShortShow(locShortShow, indexes) {
            var that = this, newArray = [];
            that.cdLocationId=locShortShow.cdLocationId;
            that.modifyCdLocationId = locShortShow.cdLocationId;
            that.cooperPartyLocationPositiveImgList=[];
            that.cooperPartyLocationBackImgList=[];
            that.naSelectList = [];
            $(".a_selectOption1 p").removeClass("active");
            that.resetAddressParamFun('0'); // 重置 改变address 参数
            // 赋值 改变address 参数
            that.getAddressParamFun('countryCode', locShortShow, locShortShow.countryCode);
            that.getAddressParamFun('provinceCode', locShortShow, locShortShow.provinceCode);
            that.getAddressParamFun('cityCode', locShortShow, locShortShow.cityCode);
            that.getAddressParamFun('districtCode', locShortShow, locShortShow.districtCode);
            locShortShow.address = that.address00 + that.address0 + that.address1 + that.address2 + locShortShow.street;
            var param = {
                locationName: locShortShow.locationName,
                locationType: locShortShow.locationType,
                locationCode: locShortShow.locationCode,
                countryCode: locShortShow.countryCode,
                provinceCode: locShortShow.provinceCode,
                cityCode: locShortShow.cityCode,
                districtCode: locShortShow.districtCode,
                street: locShortShow.street,
                //    postCode:locShortShow.postCode,
                address: locShortShow.address
            };
            newArray.push(param);
            that.locationContactList = newArray;
            if(locShortShow.cdExtList!=null){
                for(i=0;i<locShortShow.cdExtList.length;i++){
                    var s={
                        cdExtId:locShortShow.cdExtList[i].cdExtId,
                        extValue:ImgWebsite+locShortShow.cdExtList[i].extValue
                    }
                    that.cooperPartyLocationPositiveImgList.push(s);
                }
            }

            if(that.naShowSelectList[indexes] != null && that.naShowSelectList[indexes] != undefined){
                var locationLable = that.naShowSelectList[indexes].split(',');
                for(var p=0;p<that.selectListData.locationLableList.length;p++){
                    for(var q=0;q<locationLable.length;q++){
                        if(that.selectListData.locationLableList[p].text == locationLable[q]){
                            var assemble = {
                                code: that.selectListData.locationLableList[p].code,
                                text: that.selectListData.locationLableList[p].text
                            };
                            that.naSelectList.push(assemble);
                            $(".a_selectOption1 p").eq(p).addClass("active");
                        }
                    }
                }
            }
        },
        selectEqpShortShow(eqpShortShow, indexes) {
            console.log(eqpShortShow)
            var that = this, newArray = [];
            that.cdEqpId=eqpShortShow.cdEqpId;
            that.cooperPartyEqpPositiveImgList=[];
            that.cooperPartyEqpBackImgList=[];
            that.modifyCdEqpId = eqpShortShow.cdEqpId;
            var param = {
                eqpName: eqpShortShow.eqpName,
                eqpType: eqpShortShow.eqpType,
                eqpBrand: eqpShortShow.eqpBrand,
                eqpStatus: eqpShortShow.eqpStatus,
                eqpNature: eqpShortShow.eqpNature,
                eqpSpec: eqpShortShow.eqpSpec,
                eqpNo: eqpShortShow.eqpNo,
                eqpLength: eqpShortShow.eqpLength,
                eqpWidth: eqpShortShow.eqpWidth,
                eqpHeight: eqpShortShow.eqpHeight,
                eqpStr1: eqpShortShow.eqpStr1,
                eqpStr2: eqpShortShow.eqpStr2,
                remark: eqpShortShow.remark
            };
            var locationArray=[];
            var locationParam = {
                countryCode: eqpShortShow.countryCode,
                provinceCode:eqpShortShow.provinceCode,
                cityCode:eqpShortShow.cityCode,
                districtCode:eqpShortShow.districtCode,
                address:eqpShortShow.address,
                street:eqpShortShow.street
            };
            setTimeout(function () {
                if(eqpShortShow.eqpLabel!=null && eqpShortShow.eqpLabel!='' && eqpShortShow.eqpLabel != undefined){
                    var eqpLabelArr = eqpShortShow.eqpLabel.split(',');
                    for (var j = 0; j < that.selectListData.eqpLabelList.length; j++) {
                        for (var i = 0; i < eqpLabelArr.length; i++) {
                            if (eqpLabelArr[i] == that.selectListData.eqpLabelList[j].code) {
                                $(".zzDivLi .zzDiv").eq(j).find("input").attr("checked", "checked");
                            }
                        }
                    }
                }
            }, 300)
            newArray.push(param);
            locationArray.push(locationParam)
            that.contactEqplList = newArray;
            that.loaLocationContactList = locationArray;
            if(eqpShortShow.pExtValue!=null){
                that.cooperPartyEqpPositiveImgList.push(ImgWebsite + eqpShortShow.pExtValue);
            }
            if(eqpShortShow.nExtValue!=null) {
                that.cooperPartyEqpBackImgList.push(ImgWebsite + eqpShortShow.nExtValue);
            }
        },
        selectContShortShow(contShortShow, indexes) {
            var that = this, newArray = [];
            that.cdContactId=contShortShow.cdContactId;
            that.cooperPartyContactPositiveImgList=[];
            that.cooperPartyContactBackImgList=[];
            that.cooperPartyDriverPositiveImgList=[];
            that.cooperPartyDriverBackImgList=[];
            that.modifyCdContactId = contShortShow.cdContactId;
            var param = {
                contactType: contShortShow.contactType,
                contactName: contShortShow.contactName,
                contactTel: contShortShow.contactTel,
                contactEmail: contShortShow.contactEmail,
                contactAddress: contShortShow.contactAddress,
                remark: contShortShow.remark
            };
            newArray.push(param);
            that.partyContactlList = newArray;
            console.log(contShortShow)
            if(contShortShow.pExtValue!=null){
                that.cooperPartyContactPositiveImgList.push(ImgWebsite + contShortShow.pExtValue);
            }
            if(contShortShow.nExtValue!=null) {
                that.cooperPartyContactBackImgList.push(ImgWebsite + contShortShow.nExtValue);
            }
            if(contShortShow.ppExtValue!=null){
                that.cooperPartyDriverPositiveImgList.push(ImgWebsite + contShortShow.ppExtValue);
            }
            if(contShortShow.npExtValue!=null) {
                that.cooperPartyDriverBackImgList.push(ImgWebsite + contShortShow.npExtValue);
            }
        },
        selectDepotShortShow(depotShortShow, indexes) {
            var that = this, newArray = [];
            that.cooperPartyDepotPositiveImgList=[];
            that.cooperPartyDepotBackImgList=[];
            that.cdDepotId=depotShortShow.cdDepotId;
            that.modifyCdDepotId = depotShortShow.cdDepotId;
            that.cooperPartyDepotPositiveImgList=[];
            var param = {
                depotType: depotShortShow.depotType,
                depotCode: depotShortShow.depotCode,
                depotName: depotShortShow.depotName,
                depotLable: depotShortShow.depotLable,
                totalArea: depotShortShow.totalArea,
                usedArea: depotShortShow.usedArea,
                usableArea:depotShortShow.usableArea
            };
            var locationArray=[];
            var locationParam = {
                countryCode: depotShortShow.countryCode,
                provinceCode:depotShortShow.provinceCode,
                cityCode:depotShortShow.cityCode,
                districtCode:depotShortShow.districtCode,
                address:depotShortShow.address,
                street:depotShortShow.street
            };
            newArray.push(param);
            that.depotList = newArray;
            locationArray.push(locationParam)
            that.depotLocationList = locationArray;
            if(depotShortShow.cdExtList!=null){
                for(i=0;i<depotShortShow.cdExtList.length;i++){
                    var s={
                        cdExtId:depotShortShow.cdExtList[i].cdExtId,
                        extValue:ImgWebsite+depotShortShow.cdExtList[i].extValue
                    }
                    that.cooperPartyDepotPositiveImgList.push(s);
                }
            }
        },
        // cdm基础数据 选择国省市区，以及输入街道改变详细地址 ——————— start
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
                    break;
                case 'cityCode':
                    paramObj.districtCode = "";
                    break;
                case 'districtCode':

                    break;
            }
            that.changeAddressFun(level, paramObj, code);
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
        changeAddressFun(level, paramObj, code) { // 选择国省市区，实时改变 详细地址 address ，入参：地址级别，当前 国、省、市、区 编码
            var that = this;
            switch (level) {
                case 'countryCode': // 选择 国 ，改变 address
                    if (code == '') {
                        that.address00 = '';
                    } else {
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
                    if (code == '') {
                        that.address0 = '';
                    } else {
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
                    if (code == '') {
                        that.address1 = '';
                    } else {
                        $.each(that.getAllCityList(paramObj.provinceCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address1 = val.chineseName;
                            }
                        });
                    }
                    that.address2 = '';
                    break;
                case 'districtCode': // 选择 区 ，改变 address
                    if (code == '') {
                        that.address2 = '';
                    } else {
                        $.each(that.getAllDistrictList(paramObj.cityCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address2 = val.chineseName;
                            }
                        });
                    }
                    break;
            }
            if (paramObj.street != '' && paramObj.street != undefined && paramObj.street != null) {
                that.address3 = paramObj.street;
            } else {
                that.address3 = '';
            }
            paramObj.address = that.address00 + that.address0 + that.address1 + that.address2 + that.address3;
        },
        changeAddress(paramObj, street) { // 输入街道，改变 address
            var that = this;
            if (street == undefined) {
                return false;
            }
            that.address3 = street;
            paramObj.address = that.address00 + that.address0 + that.address1 + that.address2 + that.address3;
        },
        resetAddressParamFun(type) { // 重置 改变address 参数，入参：类型（全重置、默认国家“中国”）
            var that = this;
            switch (type) {
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
        getAddressParamFun(level, paramObj, code) { // 赋值 改变address 参数
            var that = this;
            switch (level) {
                case 'countryCode':
                    if (code != null && code != '') {
                        $.each(that.getAllCountryList, function (indexs, val) {
                            if (val.adcode == code) {
                                that.address00 = val.chineseName;
                            }
                        });
                    } else {
                        that.address00 = '';
                        paramObj.countryCode = "";
                    }
                    break;
                case 'provinceCode':
                    if (code != null && code != '') {
                        $.each(that.getAllProviceList(paramObj.countryCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address0 = val.chineseName;
                            }
                        });
                    } else {
                        that.address0 = '';
                        paramObj.provinceCode = "";
                    }
                    break;
                case 'cityCode':
                    if (code != null && code != '') {
                        $.each(that.getAllCityList(paramObj.provinceCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address1 = val.chineseName;
                            }
                        });
                    } else {
                        that.address1 = '';
                        paramObj.cityCode = "";
                    }
                    break;
                case 'districtCode':
                    if (code != null && code != '') {
                        $.each(that.getAllDistrictList(paramObj.cityCode), function (indexs, val) {
                            if (val.adcode == code) {
                                that.address2 = val.chineseName;
                            }
                        });
                    } else {
                        that.address2 = '';
                        paramObj.districtCode = "";
                    }
                    break;
            }
        },
        // cdm基础数据 选择国省市区，以及输入街道改变详细地址 ——————— end

        publicChangeBtnStatus() {
            var that = this;
            setTimeout(function () {
                var permissionListObj = "";
                var pageid = GetQueryString("objectId");
                var buttonObj = $(".butOperatePermission");
                getRequest(umsUrl + '/query/objectByUser.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp + "&userId=" + that.logininf.umUserId + "&parentUmObjectId=" + pageid, function (res) {
                    permissionListObj = res.result;
                    //console.log(buttonObj.length);
                    for (var i = 0; i < permissionListObj.length; i++) {
                        for (var j = 0; j < buttonObj.length; j++) {
                            if (permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")) {
                                for (var m = 0; m < permissionListObj[i].permissionList.length; m++) {
                                    if (permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show") {
                                        //console.log(j);
                                        if (permissionListObj[i].objectCode == "UPLOAD0") {
                                            $(".fileUploadHint1").css({"display": "inline-block"});
                                        }
                                        if (permissionListObj[i].objectCode == "UPLOAD1") {
                                            $(".fileUploadHint2").css({"display": "inline-block"});
                                        }
                                        $(".butOperatePermission").eq(j).css({"display": "inline-block"})
                                        $(".butOperatePermission").eq(j).show();
                                    } else {
                                        $(".butOperatePermission").eq(j).parents(".commandbarItem").hide();
                                        $(".butOperatePermission").eq(j).hide();

                                    }
                                }
                            }
                        }
                    }
                })
            }, 100)
        },
        cooperItemOpen(item){
            var that = this;
            $(".cooperMagnify").fadeIn("slow");
            $(".cooperMagnify div img").attr("src",item)
        },
        cooperMagClose(){
            $(".cooperMagnify").fadeOut();
        },
        closeMaskLayer() { // 关闭弹窗
            $(".maskLayer").hide();
        },
        resetOrderList() {
            window.location.reload();
        },
        uploadPartyPositiveImgFun(){
            $('#uploadPartyPositiveImgYes').click();
        },
        uploadPartyPositiveImgFunYes() {
            var that = this;
            that.cooperPartyPositiveImgList=[];
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyPositiveImgYes").prop("files")[0];  //获取文件
            if (file) {
                 var reader = new FileReader();  //创建读取文件的对象
                 reader.onload = function (evt) {
                     var pictureUpload = {
                         extValue:evt.target.result.split(',')[1],
                         refId:that.cdPartyId,
                         refTo:'cd_party',
                         extColumn:'I_BL_P'
                     }
                     postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                         if (res.msg === "SUCCESS" || res.msg === "success") {
                             imitatePopup(res.msg,'alert');
                             that.cooperPartyPositiveImgList.push(ImgWebsite+res.result.extValue)
                         } else {
                             imitatePopup(res.msg,'alert');
                             return false;
                         }
                     });
                 };
                 reader.readAsDataURL(file);
            }
        },
        cooperPartyPositiveItemClose(index){
            var that = this;
            that.cooperPartyPositiveImgList.splice(index,1);
        },
        cooperPartyDepotPositiveItemClose(cooperItem,index){
            var that = this;
            that.cooperPartyDepotPositiveImgList.splice(index,1);
            getRequest(cmdUrl + "/delPicture.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp+"&cdExtId="+cooperItem.cdExtId, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    imitatePopup(res.msg,'alert');
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
                that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
            });
        },
        cooperPartyDepotBackItemClose(index){
            var that = this;
            that.cooperPartyDepotBackImgList.splice(index,1);
        },
        cooperPartyLocationPositiveItemClose(cooperItem,index){
            var that = this;
            that.cooperPartyLocationPositiveImgList.splice(index,1);
            getRequest(cmdUrl + "/delPicture.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp+"&cdExtId="+cooperItem.cdExtId, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    imitatePopup(res.msg,'alert');
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
                that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
            });
        },
        cooperPartyLocationBackItemClose(index){
            var that = this;
            that.cooperPartyLocationBackImgList.splice(index,1);
        },
        uploadPartyBackImgFun(){
            $('#uploadPartyBackImgYes').click();
        },
        uploadPartyBackImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.savedNewOrderInfo == '0') {
                imitatePopup("请先保存合作商基本信息",'alert');
                return false;
            }
            that.cooperPartyBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdPartyId,
                        refTo:'cd_party',
                        extColumn:'I_BL_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyBackImgList.push(ImgWebsite+res.result.extValue)
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyBackItemClose(index){
            var that = this;
            that.cooperPartyBackImgList.splice(index,1);
        },
        uploadPartyEqpPositiveImgFun(){
            $('#uploadPartyEqpPositiveImgYes').click();
        },
        uploadPartyEqpPositiveImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyEqpPositiveImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdEqpId == null) {
                imitatePopup("请先保存设备基本信息",'alert');
                return false;
            }
            that.cooperPartyEqpPositiveImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdEqpId,
                        refTo:'cd_eqp',
                        extColumn:'I_DL_P'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyEqpPositiveImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyEqpPositiveItemClose(index){
            var that = this;
            that.cooperPartyEqpPositiveImgList.splice(index,1);
        },
        uploadPartyEqpBackImgFun(){
            $('#uploadPartyEqpBackImgYes').click();
        },
        uploadPartyEqpBackImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyEqpBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdEqpId == null) {
                imitatePopup("请先保存设备基本信息",'alert');
                return false;
            }
            that.cooperPartyEqpBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdEqpId,
                        refTo:'cd_eqp',
                        extColumn:'I_DL_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyEqpBackImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailEqpShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyEqpBackItemClose(index){
            var that = this;
            that.cooperPartyEqpBackImgList.splice(index,1);
        },
        uploadPartyContactPositiveImgFun(){
            $('#uploadPartyContactPositiveImgYes').click();
        },
        uploadPartyContactPositiveImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyContactPositiveImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdContactId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyContactPositiveImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdContactId,
                        refTo:'cd_contact',
                        extColumn:'I_ID_P'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyContactPositiveImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyContactPositiveItemClose(index){
            var that = this;
            that.cooperPartyContactPositiveImgList.splice(index,1);
        },
        uploadPartyContactBackImgFun(){
            $('#uploadPartyContactBackImgYes').click();
        },
        uploadPartyContactBackImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyContactBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdContactId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyContactBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdContactId,
                        refTo:'cd_contact',
                        extColumn:'I_ID_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyContactBackImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyContactBackItemClose(index){
            var that = this;
            that.cooperPartyContactBackImgList.splice(index,1);
        },
        uploadPartyDriverPositiveImgFun(){
            $('#uploadPartyDriverPositiveImgYes').click();
        },
        uploadPartyDepotPositiveImgFun(){
            $('#uploadPartyDepotPositiveImgYes').click();
        },
        uploadPartyDepotBackImgFun(){
            $('#uploadPartyDepotBackImgYes').click();
        },
        uploadPartyLocationPositiveImgFun(){
            $('#uploadPartyLocationPositiveImgYes').click();
        },
        uploadPartyLocationBackImgFun(){
            $('#uploadPartyLocationBackImgYes').click();
        },
        uploadPartyDriverPositiveImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyDriverPositiveImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdContactId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyDriverPositiveImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdContactId,
                        refTo:'cd_contact',
                        extColumn:'I_IP_P'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyDriverPositiveImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        uploadPartyDepotPositiveImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyDepotPositiveImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdDepotId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            //that.cooperPartyDepotPositiveImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdDepotId,
                        refTo:'cd_depot',
                        extColumn:'E_IMG'
                    }
                    postRequest(cmdUrl + "/upload/attachments?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            var s={
                                cdExtId:res.result.cdExtId,
                                extValue:ImgWebsite+res.result.extValue
                            }
                            console.log(res)
                            that.cooperPartyDepotPositiveImgList.push(s);
                            that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        uploadPartyDepotBackImgFunYes(){
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyDepotBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdDepotId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyDepotBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdDepotId,
                        refTo:'cd_depot',
                        extColumn:'E_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyDepotBackImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailDepotShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        uploadPartyLocationPositiveImgFunYes(){
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyLocationPositiveImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdLocationId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            //that.cooperPartyLocationPositiveImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdLocationId,
                        refTo:'cd_location',
                        extColumn:'E_IMG'
                    }
                    postRequest(cmdUrl + "/upload/attachments?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            console.log(res)
                            var s={
                                cdExtId:res.result.cdExtId,
                                extValue:ImgWebsite+res.result.extValue
                            }
                            that.cooperPartyLocationPositiveImgList.push(s);
                            that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        uploadPartyLocationBackImgFunYes(){
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyLocationBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdLocationId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyLocationBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdLocationId,
                        refTo:'cd_location',
                        extColumn:'E_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyLocationBackImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailLocShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyDriverPositiveItemClose(index){
            var that = this;
            that.cooperPartyDriverPositiveImgList.splice(index,1);
        },
        uploadPartyDriverBackImgFun(){
            $('#uploadPartyDriverBackImgYes').click();
        },
        uploadPartyDriverBackImgFunYes() {
            //选择图片 并将图片转为base64位编码格式
            var file = $("#uploadPartyDriverBackImgYes").prop("files")[0];  //获取文件
            var that = this;
            if (that.cdContactId == null) {
                imitatePopup("请先保存联系人基本信息",'alert');
                return false;
            }
            that.cooperPartyDriverBackImgList=[];
            if (file) {
                var reader = new FileReader();  //创建读取文件的对象
                reader.onload = function (evt) {
                    var pictureUpload = {
                        extValue:evt.target.result.split(',')[1],
                        refId:that.cdContactId,
                        refTo:'cd_contact',
                        extColumn:'I_IP_N'
                    }
                    postRequest(cmdUrl + "/picture/upload.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,pictureUpload, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            imitatePopup(res.msg,'alert');
                            that.cooperPartyDriverBackImgList.push(ImgWebsite+res.result.extValue);
                            that.getDetailContShortShowList(that.partyBaseInfo.partyCode);
                        } else {
                            imitatePopup(res.msg,'alert');
                            return false;
                        }
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        cooperPartyDriverBackItemClose(index){
            var that = this;
            that.cooperPartyDriverBackImgList.splice(index,1);
        },
        chooseNaSelectLi(lableItem,num){
            var that = this;
            that.naSelectList = [];
            $(".a_selectOption1 p").eq(num).toggleClass("active");
            for(var i=0;i<that.selectListData.locationLableList.length;i++){
                if($(".a_selectOption1 p").eq(i).hasClass("active")){
                    var assemble = {
                        code: that.selectListData.locationLableList[i].code,
                        text: that.selectListData.locationLableList[i].text
                    };
                    that.naSelectList.push(assemble);
                }
            }
        }
    },
    created: function () {
        var that = this;
        that.getAllCountryList = getCountryData();
        that.linkHrefs = getJumpLinkList(that.linkNames);
        var searchFormArr = {
            pageInfo: {
                pageNum: 1,
                pageSize: that.queryPageSize
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(cmdUrl + "/select/pagePartyByPartyVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
            that.tableOrderList = res.result;
            that.totalPagesNum = res.pageInfo.total;
            for (var i = 0; i < res.pageInfo.pages; i++) {
                that.pageList[i] = i + 1;
            }
            that.publicChangeBtnStatus();
        })
    },
    filters: {
        timestampToTime(timestamp) {
            if (timestamp == null) {
                return '--';
            } else {
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
                var currentTime = timestamp - offsetMs;
                var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                Y = date.getFullYear() + '-';
                M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
                h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ':';
                m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
                s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
                return Y + M + D + h + m;
            }
        }
    }
})
