var app = new Vue({
    el: '#overall',
    data: {
        logininf: {},
        tableOrderList: {},
        selectListData: {},
        clickBtnType: "",
        isDisable: false,
        currentPage: 1,
        currentPage1: 1,
        currentPage2: 1,
        queryPageSize: 20,
        multipleNum: 12,
        queryModelPageSize: 12, // 弹窗中的分页（一页12条）
        totalList: [],
        pageList: [],
        pageList1: [],
        pageList2: [],
        totalPagesNum1: "",
        totalPagesNum2: "",
        orderDetail: {},
        deviceList: {},
        addressList: {},
        templateTitle: "新增联系人",
        locationContact: {
            contactType: "",
            contactName: "",
            contactTel: ""
        },
        contactEqplList: [{
            isDefault: "",
            eqpType: "",
            eqpStr1: "",
            eqpStr2: ""
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
        currentDqIndex: "",
        currentArIndex: "",
        queryParam: {
            partyType: null,
            contactType: "",
            eqpType: ""
        },
        queryParam1: {},
        queryParam2: {
            eqpType: ""
        },
        popupType: "",
        savedNewOrderInfo: '0',
        eqpShortShowList: [],
        locShortShowList: [],
        clearShow: true,
        getAllCountryList: {}, // 国家列表
        address00: "", // 改变 address —— 国
        address0: "", // 改变 address —— 省
        address1: "", // 改变 address —— 市
        address2: "", // 改变 address —— 区
        address3: "", // 改变 address —— 街道

        modifyCdLocationId: '', // 修改 联系人 - 地址信息 ， 地址id
        modifyCdEqpId: '', // 修改 联系人 - 设备信息 ， 设备id
        partyCode: '', //
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
                case '0': // 上传联系人
                    $('#excelFile').addClass('uploadType1');
                    $('#excelFile').removeClass('uploadType2');
                    break;
                case '1': // 上传联系人信息
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
                case '0': // 上传联系人
                    fileUploadRequest(cmdUrl + '/import/contactData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
                case '1': // 上传联系人信息
                    fileUploadRequest(cmdUrl + '/import/contactInfoData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
            }
        },
        filesUploadSuc() {
            var that = this;
            that.clearShow = true;
            setTimeout(function () {
                $(".fileUploadLi #inputBox1").css({"display": "inline-block"});
            }, 100);
            $(".ajax-load-pupup").remove();
            //获取列表
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                that.totalList = [];
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                for (var n = 0; n < res.pageInfo.total; n++) {
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
            })
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
            that.modifyCdLocationId = '';
            that.resetAddressParamFun('1');
        },
        addOrderDetails(title) { // 新增
            var that = this;
            this.templateTitle = title;
            this.clickBtnType = "add";
            let partyCode = that.logininf.userPartyNo;
            this.partyCode = partyCode;
            that.isDisable = false;
            that.locationContact = {
                contactType: "",
                contactName: "",
                contactTel: ""
            };
            that.contactEqplList = [{
                isDefault: "",
                eqpType: "",
                eqpStr1: "",
                eqpStr2: ""
            }];
            that.locationContactList = [{
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                isDefault: "",
                address: ""
            }];
            that.savedNewOrderInfo = '0';
            that.eqpShortShowList = [];
            that.locShortShowList = [];
            that.resetAddressParamFun('1');
        },
        getOrderDetails(title, dpItem) { // 详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.partyCode = dpItem.partyCode;
            getRequest(cmdUrl + "/get/contactDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + dpItem.cdContactId, function (res) {
                that.locationContact = res.result.contact;
                that.eqpShortShowList = res.result.eqpList;
                that.locShortShowList = res.result.locationList;
            })
        },
        changeOrderDetails(title, dpItem) { // 修改
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.savedNewOrderInfo = '1';
            that.partyCode = dpItem.partyCode;
            getRequest(cmdUrl + "/get/contactDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + dpItem.cdContactId, function (res) {
                that.locationContact = res.result.contact;
                that.eqpShortShowList = res.result.eqpList;
                that.locShortShowList = res.result.locationList;
                that.contactEqplList = [];
                that.locationContactList = [];
            })
        },
        deleteOrderDetails(dpItem) { // 删除
            var that = this;
            imitatePopup("确定删除当前联系人","confirm",function(res){
                if (res == 1) {
                    getRequest(cmdUrl + "/delete/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + dpItem.cdContactId, function (res) {
                        //获取订单列表
                        var searchFormArr = {
                            pageInfo: {
                                pageNum: that.currentPage,
                                pageSize: that.queryPageSize
                            }
                        }
                        postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                            that.tableOrderList = res.result;
                            that.pageList = [];
                            that.totalList = [];
                            for (var i = 0; i < res.pageInfo.pages; i++) {
                                that.pageList[i] = i + 1;
                            }
                            for (var n = 0; n < res.pageInfo.total; n++) {
                                that.totalList[n] = n + 1;
                            }
                            that.publicChangeBtnStatus();
                        })
                    })
                }
            })
        },
        defaultOrderDetails(partyItem, type) { // 设为默认、取消默认
            var that = this, params = {};
            switch (type) {
                case '1': // 设为默认
                    cdContactId = partyItem.cdContactId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdContactId = partyItem.cdContactId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + cdContactId + "&isDefault=" + isDefault, function (res) {
                //获取订单列表
                var searchFormArr = {
                    pageInfo: {
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    }
                };
                postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    for (var n = 0; n < res.pageInfo.total; n++) {
                        that.totalList[n] = n + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            })
        },
        editOrderInfo() { // 保存联系人
            var that = this;
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！","alert");
                return false;
            }
            if (that.locationContact.contactType == "" || that.locationContact.contactType == undefined) {
                imitatePopup("请选择联系人类型","alert");
                return false;
            }
            if (that.locationContact.contactName == "" || that.locationContact.contactName == undefined) {
                imitatePopup("请填写姓名","alert");
                return false;
            }
            if (that.locationContact.contactTel == "" || that.locationContact.contactTel == undefined) {
                imitatePopup("请填写电话","alert");
                return false;
            }
            that.locationContact.partyCode = that.partyCode;
            let params = that.locationContact;
            postRequest(cmdUrl + "/update/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                }else{
                    imitatePopup(res.msg,"alert");
                    return false;
                }
            });
        },
        saveNewOrderInfo() { // 新增联系人
            var that = this;
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！","alert");
                return false;
            }
            if (that.locationContact.contactType == "" || that.locationContact.contactType == undefined) {
                imitatePopup("请选择联系人类型","alert");
                return false;
            }
            if (that.locationContact.contactName == "" || that.locationContact.contactName == undefined) {
                imitatePopup("请填写姓名","alert");
                return false;
            }
            if (that.locationContact.contactTel == "" || that.locationContact.contactTel == undefined) {
                imitatePopup("请填写电话","alert");
                return false;
            }
            that.locationContact.partyCode = that.partyCode;
            let params = that.locationContact;
            postRequest(cmdUrl + "/insert/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.savedNewOrderInfo = '1';
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                }else{
                    imitatePopup(res.msg,"alert");
                    return false;
                }
            })
        },
        selectLocShortShow(locShortShow, indexes) { // 选择已有地址
            var that = this, newArray = [];
            that.modifyCdLocationId = locShortShow.cdLocationId;
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
                //   postCode:locShortShow.postCode,
                address: locShortShow.address
            };
            newArray.push(param);
            that.locationContactList = newArray;
        },
        delLocInfo(locShortShow, indexes) { // 删除合作商下的地址，，，，同货点删除
            var that = this;
            var r = confirm("确定删除该地址？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + locShortShow.cdLocationId, function (res) {
                    that.locShortShowList.splice(indexes, 1);
                    that.locationContactList = [];
                })
            }
        },
        delEqpInfo(eqpShortShow, indexes) { // 删除合作商下设备，，，，同设备删除
            var that = this;
            var r = confirm("确定删除该设备？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + eqpShortShow.cdEqpId, function (res) {
                    that.eqpShortShowList.splice(indexes, 1);
                    that.contactEqplList = [];
                })
            }
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
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            }
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                that.totalList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                for (var n = 0; n < res.pageInfo.total; n++) {
                    that.totalList[n] = n + 1;
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
                }
                //获取订单列表
                postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.totalList = [];
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    }, 300);
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    for (var n = 0; n < res.pageInfo.total; n++) {
                        that.totalList[n] = n + 1;
                    }
                    that.publicChangeBtnStatus();

                })
            } else {
                imitatePopup("请输入大于1且小于2000的正整数","alert");
                return false;
            }
        },
        getSearchVal1() {
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
        getSearchVal2() {
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
        closeMaskLayer() { // 关闭弹窗
            $(".maskLayer").hide();
        },
        resetOrderList() {
            window.location.reload();
        },
    },
    created: function () {
        var that = this;
        that.getAllCountryList = getCountryData();
        var searchFormArr = {
            pageInfo: {
                pageNum: 1,
                pageSize: that.queryPageSize
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取联系人列表
        postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
            that.tableOrderList = res.result;
            for (var i = 0; i < res.pageInfo.pages; i++) {
                that.pageList[i] = i + 1;
            }
            for (var n = 0; n < res.pageInfo.total; n++) {
                that.totalList[n] = n + 1;
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

function arraySameItem(array) {  // 验证重复元素，有重复返回true；否则返回false
    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + array.join("\x0f\x0f") + "\x0f");
}
