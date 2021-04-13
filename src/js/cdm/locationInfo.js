var app = new Vue({
    el: '#overall',
    data: {
        logininf: {},
        selectListData: {},
        tableOrderList: {},
        contactList: {},
        deviceList: {},
        popupType: "",
        clickBtnType: "",
        isDisable: false,
        queryPageSize: 20,
        multipleNum: 12,
        queryModelPageSize: 12, // 弹窗中的分页（一页12条）
        currentPage: 1,
        currentPage1: 1,
        currentPage2: 1,
        totalList: [],
        pageList: [],
        pageList1: [],
        pageList2: [],
        totalPagesNum1: "",
        totalPagesNum2: "",
        queryParam: {
            partyType: null,
            contactType: "",
            eqpType: ""
        },
        queryParam1: {
            contactType: ""
        },
        queryParam2: {
            eqpType: ""
        },
        orderDetail: {},
        currentCotactIndex: '',
        currentDqIndex: '',
        templateTitle: "新增地址",
        locationInfo: {
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            address: ""
        },
        locationContactList: [{
            contactType: "",
            contactName: "",
            contactTel: "",
            contactEmail: "",
            contactAddress: "",
            remark: "",
            isDefault: ""
        }],
        contactEqplList: [{
            isDefault: "",
            eqpType: "",
            eqpStr1: "",
            eqpStr2: ""
        }],
        savedNewOrderInfo: '0',
        contShortShowList: [],
        eqpShortShowList: [],
        clearShow: true,
        getAllCountryList: {}, // 国家列表
        address00: "", // 改变 address —— 国
        address0: "", // 改变 address —— 省
        address1: "", // 改变 address —— 市
        address2: "", // 改变 address —— 区
        address3: "", // 改变 address —— 街道

        modifyCdContactId: '', // 修改 地址 - 联系人信息 ， 联系人id
        modifyCdEqpId: '', // 修改 地址 - 设备信息 ， 设备id
        partyCode: '', // 合作商编码
        addressLatLng:'',
        infoWindow: new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}), //信息窗体
        coorLatLngList: [],
        marOrderItem: {},
        linkNames: ["地址管理","地址模板管理"],
        linkHrefs: [],
        naSelectList: []
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
                case '0': // 上传地址
                    $('#excelFile').addClass('uploadType1');
                    $('#excelFile').removeClass('uploadType2');
                    break;
                case '1': // 上传地址信息
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
                case '0': // 上传地址
                    fileUploadRequest(cmdUrl + '/import/locationData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
                case '1': // 上传地址信息
                    fileUploadRequest(cmdUrl + '/import/locationInfoData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
            }
        },
        filesUploadSuc() {
            var that = this;
            that.clearShow = true;
            setTimeout(function () {
                $(".fileUploadLi #inputBox0").css({"display": "inline-block"});
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
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
        addOrderDetails(title) { // 新增
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            let partyCode = that.logininf.userPartyNo;
            that.partyCode = partyCode;
            that.isDisable = false;
            that.locationInfo = {
                locationType: "",
                countryCode: "100000",
                provinceCode: "",
                cityCode: "",
                districtCode: "",
                address: ""
            };
            that.locationContactList = [{
                contactType: "",
                contactName: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: "",
                remark: "",
                isDefault: ""
            }];
            that.contactEqplList = [{
                isDefault: "",
                eqpType: "",
                eqpStr1: "",
                eqpStr2: ""
            }];
            that.savedNewOrderInfo = '0';
            that.eqpShortShowList = [];
            that.contShortShowList = [];
            that.resetAddressParamFun('1');

            mapFunction("121.544379", "31.221517");
            that.naSelectList = [];
            $(".a_select1").removeClass("active");
            $(".a_selectOption1 p").removeClass("active");
        },
        getOrderDetails(title, dpItem) { // 详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.resetAddressParamFun('0'); // 重置 改变address 参数
            that.partyCode = dpItem.partyCode;
            that.naSelectList = [];
            $(".a_select1").addClass("active");
            $(".a_selectOption1 p").removeClass("active");
            getRequest(cmdUrl + "/get/locationDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + dpItem.cdLocationId, function (res) {
                that.locationInfo = res.result.location;
                if (that.locationInfo.locationType == null) {
                    that.locationInfo.locationType = "";
                }
                // 赋值 改变address 参数
                that.getAddressParamFun('countryCode', that.locationInfo, that.locationInfo.countryCode);
                that.getAddressParamFun('provinceCode', that.locationInfo, that.locationInfo.provinceCode);
                that.getAddressParamFun('cityCode', that.locationInfo, that.locationInfo.cityCode);
                that.getAddressParamFun('districtCode', that.locationInfo, that.locationInfo.districtCode);

                that.contShortShowList = res.result.contactList;
                $.each(that.contShortShowList, function (indexs, val) {
                    if (val.contactType == null || val.contactType == undefined) {
                        that.contactType = "";
                    }
                });
                that.eqpShortShowList = res.result.eqpList;
                if (that.locationInfo.latLng != null) {
                    var locationCode = that.locationInfo.latLng.split(",");
                    mapFunction(locationCode[0], locationCode[1]);
                } else {
                    mapFunction("121.544379", "31.221517");
                }

                if(that.locationInfo.locationLable != null){
                    var locationLable = that.locationInfo.locationLable.split(',');
                    for(var p=0;p<that.selectListData.locationLableList.length;p++){
                        for(var q=0;q<locationLable.length;q++){
                            if(that.selectListData.locationLableList[p].code == locationLable[q]){
                                var assemble = {
                                    code: that.selectListData.locationLableList[p].code,
                                    text: that.selectListData.locationLableList[p].text
                                };
                                that.naSelectList.push(assemble);
                            }
                        }
                    }
                }
            })
        },
        changeOrderDetails(title, dpItem) { // 修改
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.savedNewOrderInfo = '1';
            that.resetAddressParamFun('0'); // 重置 改变address 参数
            that.partyCode = dpItem.partyCode;
            that.naSelectList = [];
            $(".a_select1").removeClass("active");
            $(".a_selectOption1 p").removeClass("active");
            getRequest(cmdUrl + "/get/locationDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + dpItem.cdLocationId, function (res) {
                that.locationInfo = res.result.location;
                if (that.locationInfo.locationType == null) {
                    that.locationInfo.locationType = "";
                }
                // 赋值 改变address 参数
                that.getAddressParamFun('countryCode', that.locationInfo, that.locationInfo.countryCode);
                that.getAddressParamFun('provinceCode', that.locationInfo, that.locationInfo.provinceCode);
                that.getAddressParamFun('cityCode', that.locationInfo, that.locationInfo.cityCode);
                that.getAddressParamFun('districtCode', that.locationInfo, that.locationInfo.districtCode);

                that.contShortShowList = res.result.contactList;
                $.each(that.contShortShowList, function (indexs, val) {
                    if (val.contactType == null || val.contactType == undefined) {
                        that.contactType = "";
                    }
                });
                that.eqpShortShowList = res.result.eqpList;
                $.each(that.eqpShortShowList, function (indexs, val) {
                    if (val.eqpTypeList == null || val.eqpTypeList == undefined) {
                        that.eqpTypeList = "";
                    }
                });

                that.locationContactList = [];
                that.contactEqplList = [];

                if (that.locationInfo.latLng != null) {
                    var locationCode = that.locationInfo.latLng.split(",");
                    mapFunction(locationCode[0], locationCode[1]);
                } else {
                    mapFunction("121.544379", "31.221517");
                }

                if(that.locationInfo.locationLable != null){
                    var locationLable = that.locationInfo.locationLable.split(',');
                    for(var p=0;p<that.selectListData.locationLableList.length;p++){
                        for(var q=0;q<locationLable.length;q++){
                            if(that.selectListData.locationLableList[p].code == locationLable[q]){
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
            })
        },
        deleteOrderDetails(dpItem) {  // 删除
            var that = this;
            var r = confirm("确定删除当前地址");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + dpItem.cdLocationId, function (res) {
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo: {
                            pageNum: that.currentPage,
                            pageSize: that.queryPageSize
                        }
                    };
                    postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
        },
        defaultOrderDetails(partyItem, type) { // 设为默认、取消默认
            var that = this, params = {};
            switch (type) {
                case '1': // 设为默认
                    cdLocationId = partyItem.cdLocationId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdLocationId = partyItem.cdLocationId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + cdLocationId + "&isDefault=" + isDefault, function (res) {
                //获取订单列表
                var searchFormArr = {
                    pageInfo: {
                        pageNum: 1,
                        pageSize: that.queryPageSize
                    }
                };
                postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
        editOrderInfo() {  // 保存地址基本信息
            var that = this;
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！","alert");
                return false;
            }
            if (that.locationInfo.locationName == "" || that.locationInfo.locationName == undefined) {
                imitatePopup("请填写地址名称",'alert');
                return false;
            }
            if (that.locationInfo.locationType == "" || that.locationInfo.locationType == undefined) {
                imitatePopup("请选择地址类型",'alert');
                return false;
            }
            if (that.locationInfo.provinceCode == "" || that.locationInfo.cityCode == "" || that.locationInfo.districtCode == "") {
                imitatePopup("请完善地址信息",'alert');
                return false;
            }
            let partyCode = that.partyCode;
            that.locationInfo.partyCode = partyCode;
            let params = that.locationInfo;
            if(that.naSelectList.length > 0){
                var orderNature = [];
                for(var a=0;a<that.naSelectList.length;a++){
                    orderNature.push(that.naSelectList[a].code);
                }
                params.locationLable = orderNature.toString();
            }
            postRequest(cmdUrl + "/update/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        saveNewOrderInfo() { // 新增地址基本信息
            var that = this;
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！",'alert');
                return false;
            }
            if (that.locationInfo.locationName == "" || that.locationInfo.locationName == undefined) {
                imitatePopup("请填写地址名称",'alert');
                return false;
            }
            if (that.locationInfo.locationType == "" || that.locationInfo.locationType == undefined) {
                imitatePopup("请选择地址类型",'alert');
                return false;
            }
            if (that.locationInfo.provinceCode == "" || that.locationInfo.cityCode == "" || that.locationInfo.districtCode == "") {
                imitatePopup("请完善地址信息",'alert');
                return false;
            }
            that.locationInfo.partyCode = that.partyCode;
            let params = that.locationInfo;
            if(that.naSelectList.length > 0){
                var orderNature = [];
                for(var a=0;a<that.naSelectList.length;a++){
                    orderNature.push(that.naSelectList[a].code);
                }
                params.locationLable = orderNature.toString();
            }
            postRequest(cmdUrl + "/insert/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {

                that.savedNewOrderInfo = '1';
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        addConactFun() {
            var that = this;
            that.locationContactList = [];
            that.locationContactList.push({
                contactType: "",
                contactName: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: "",
                remark: "",
                isDefault: ""
            });
            that.modifyCdContactId = '';
        },
        addDeviceFun() {
            var that = this;
            that.contactEqplList = [];
            that.contactEqplList.push({
                isDefault: "",
                eqpType: "",
                eqpStr1: "",
                eqpStr2: ""
            });
            that.modifyCdEqpId = '';
        },
        selectContShortShow(contShortShow, indexes) { // 选择已有联系人
            var that = this, newArray = [];
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
            that.locationContactList = newArray;
        },
        selectEqpShortShow(eqpShortShow, indexes) { // 选择已有设备
            var that = this, newArray = [];
            that.modifyCdEqpId = eqpShortShow.cdEqpId;
            var param = {
                eqpName: eqpShortShow.eqpName,
                eqpType: eqpShortShow.eqpType,
                eqpBrand: eqpShortShow.eqpBrand,
                eqpSpec: eqpShortShow.eqpSpec,
                eqpNo: eqpShortShow.eqpNo,
                eqpLength: eqpShortShow.eqpLength,
                eqpWidth: eqpShortShow.eqpWidth,
                eqpHeight: eqpShortShow.eqpHeight,
                eqpStr1: eqpShortShow.eqpStr1,
                eqpStr2: eqpShortShow.eqpStr2,
                remark: eqpShortShow.remark
            };
            newArray.push(param);
            that.contactEqplList = newArray;
        },
        delContInfo(contShortShow, indexes) { // 删除地址下联系人
            var that = this;
            var r = confirm("确定删除该联系人？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + contShortShow.cdContactId, function (res) {
                    that.contShortShowList.splice(indexes, 1);
                    that.locationContactList = [];
                })
            }
        },
        delEqpInfo(eqpShortShow, indexes) { // 删除地址下设备
            var that = this;
            var r = confirm("确定删除该设备？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + eqpShortShow.cdEqpId, function (res) {
                    that.eqpShortShowList.splice(indexes, 1);
                    that.contactEqplList = [];
                })
            }
        },
        getPointFun() { // 地图标记
            var addressInf = $(".pointProvinceName option:selected").text() + $(".pointCityName option:selected").text() + $(".pointDistrictName option:selected").text() + $(".pointAddress").val();
            if (addressInf == '省份/自治州城市/地区区/县') {
                mapFunction("121.544379", "31.221517");
            } else {
                getLocationCode(addressInf, this);
            }
        },
        chooseContactFun(index, type) { // 选择联系人 - 按钮
            var that = this;
            that.popupType = type;
            that.currentCotactIndex = index;
            that.queryParam1 = {
                contactType: ""
            };
            var params = that.queryParam1;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + this.logininf.token + "&timeStamp=" + this.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
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
        chooseDeviceFun(index, type) {  // 选择设备 - 按钮
            var that = this;
            that.popupType = type;
            that.currentDqIndex = index;
            that.queryParam2 = {
                eqpType: ""
            };
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
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
        selectContactFun(contactItem, index) { // 选择联系人 - tr
            var that = this;
            contactItem.cdContactId = undefined;
            contactItem.isDefault = '';
            this.$set(this.locationContactList, this.currentCotactIndex, contactItem);
            $(".maskLayer1").hide();
        },
        selectDqFun(deviceItem, index) { // 选择设备 - tr
            var that = this;
            deviceItem.cdEqpId = undefined;
            deviceItem.isDefault = '';
            this.$set(this.contactEqplList, this.currentDqIndex, deviceItem);
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
            postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
        changePage1(pageNum, clickStatus) { // 弹窗联系人列表
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
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.contactList = res.result;
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
                postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    that.totalList = [];
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    }, 300);
                    for (var n = 0; n < res.pageInfo.total; n++) {
                        that.totalList[n] = n + 1;
                    }
                    that.publicChangeBtnStatus();
                })
            } else {
                imitatePopup("请输入大于1且小于2000的正整数",'alert');
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
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
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
                $.ajax({
                    type: "get",
                    url: umsUrl + '/query/objectByUser.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp + "&userId=" + that.logininf.umUserId + "&parentUmObjectId=" + pageid,
                    success: function (res) {
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
                    }
                })
            }, 100)
        },
        closeMaskLayer() {
            $(".maskLayer").hide();
        },
        resetOrderList() {
            window.location.reload();
        },
        // 获取所有地址标记点
        getCoordinateVal(title){
            this.templateTitle = title;
            drawClearFun1();
            $(".orderMapPoint,.orderMapPointDef,.amap-icon").remove();
            var that = this;
            that.latLngList = [];
            var searchFormArr = this.queryParam;
            //获取订单列表
            postRequest(cmdUrl + "/get/locationVoListByLocationVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.addressLatLng = res.result;
                that.markerArrayFun1(that.addressLatLng)
            })
        },
        markerArrayFun1(markerInfoArray) {   // 批量标记点
            map.clearMap();
            var that = this;
            var newDiv = "";
            for(var n = 0; n < markerInfoArray.length; n++){
                var item = markerInfoArray[n],markerLocation = [],marker,itemLatlng;
                newDiv = document.createElement("div");
                itemLatlng = item.latLng;
                if(itemLatlng != null){
                    var string = itemLatlng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                    that.coorLatLngList.push(itemLatlng);
                    newDiv.setAttribute("coorLatlng",itemLatlng);
                }else{
                    continue;
                }
                newDiv.className = "markerSet";
                newDiv.setAttribute("cdLocationId",item.cdLocationId);
                marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);
                marker.on('click', that.signalOrderClick1);
            }
        },
        signalOrderClick1(e){
            var that = this;
            var cdLocationId = e.target.Nh.content.attributes.cdLocationId.value;
            var coorLatlng = e.target.Nh.content.attributes.coorLatlng.value;
            $('.amap-info-contentContainer').show();
            var temp = [],info;
            for(var n=0;n<that.coorLatLngList.length;n++){
                if(that.coorLatLngList[n] == coorLatlng){
                    temp.push(n);
                }
            }
            for (var i = 0; i < that.addressLatLng.length; i++) {
                if(that.addressLatLng[i].cdLocationId == cdLocationId) {
                    var totalDiv = '';
                    for (var a = 0; a < temp.length; a++) {
                        var tem = temp[a];
                        var partyType = that.exchangePartyType(that.addressLatLng[tem].partyType);
                        var locationType = that.exchangeLocationType(that.addressLatLng[tem].locationType);
                        totalDiv += '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">合作商类型：</span><span class="pointInfoColor2">' + partyType + '</span></p>' +
                            '<p><span class="pointInfoColor1">合作商名称：</span><span class="pointInfoColor2">' + that.addressLatLng[tem].partyName + '</span></p>' +
                            '<p><span class="pointInfoColor1">地址类型：</span><span class="pointInfoColor2">' + locationType + '</span></p>' +
                            '<p><span class="pointInfoColor1">详细地址：</span><span class="pointInfoColor2">' + that.addressLatLng[tem].address + '</span></p>';
                    }
                    info = '<div>' +totalDiv + '</div>';
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },

        // 获取单个地址标记点
        getCoordinateLatLng(title,index){
            drawClearFun1();
            $(".orderMapPoint,.orderMapPointDef,.amap-icon").remove();
            this.templateTitle = title;
            var that = this;
            that.marOrderItem = that.tableOrderList[index];
            that.markerArrayFun(that.marOrderItem);
        },
        markerArrayFun(markerInfo) {  // 标记点
            map.clearMap();
            var that = this;
            var markerLocation = [],marker,itemLatlng;
            var newDiv = document.createElement("div");
            itemLatlng = markerInfo.latLng;
            if(itemLatlng != null){
                var string = itemLatlng.split(',');
                markerLocation.push(string[0]);
                markerLocation.push(string[1]);
            }else{
                return false;
            }
            newDiv.className = "markerSet";
            marker = new AMap.Marker({
                map: map,
                position: markerLocation,
                offset: new AMap.Pixel(0, 0)
            });
            marker.setContent(newDiv);
            marker.on('click', that.signalOrderClick);
        },
        signalOrderClick(e){
            var that = this;
            var partyType = that.exchangePartyType(that.marOrderItem.partyType);
            var locationType = that.exchangeLocationType(that.marOrderItem.locationType);
            var info = '<div>' +
                '<p><span class="pointInfoColor1">合作商类型：</span><span class="pointInfoColor2">' + partyType + '</span></p>' +
                '<p><span class="pointInfoColor1">合作商名称：</span><span class="pointInfoColor2">' + that.marOrderItem.partyName + '</span></p>' +
                '<p><span class="pointInfoColor1">地址类型：</span><span class="pointInfoColor2">' + locationType + '</span></p>' +
                '<p><span class="pointInfoColor1">详细地址：</span><span class="pointInfoColor2">' + that.marOrderItem.address + '</span></p>' +
                '</div>';
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },

        exchangePartyType(partyType){
            var that = this;
            for(var i=0;i<that.selectListData.partyTypeList.length;i++){
                if(partyType == that.selectListData.partyTypeList[i].code){
                    partyType = that.selectListData.partyTypeList[i].text
                }
            }
            return partyType;
        },
        exchangeLocationType(locationType){
            var that = this;
            for(var i=0;i<that.selectListData.locationTypeList.length;i++){
                if(locationType == that.selectListData.locationTypeList[i].code){
                    locationType = that.selectListData.locationTypeList[i].text
                }
            }
            return locationType;
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
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        this.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        //获取订单列表
        var searchFormArr = {
            pageInfo: {
                pageNum: 1,
                pageSize: that.queryPageSize
            }
        };
        postRequest(cmdUrl + "/select/pageLocationByLocationVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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

function getLocationCode(address, that) {
    var map = new AMap.Map("container", {
        resizeEnable: true
    });
    AMap.plugin('AMap.Geocoder', function () {
        var geocoder = new AMap.Geocoder({
            // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
        })
        geocoder.getLocation(address, function (status, result) {
            if (status === 'complete' && result.info === 'OK') {
                // result中对应详细地理坐标信息
                var lng = result.geocodes[0].location.lng;
                var lat = result.geocodes[0].location.lat;
                that.locationInfo.latLng = lng + "," + lat;
                $("#latlng").val(lng + "," + lat);
                mapFunction(lng, lat)
            }
        })
    })
}

function mapFunction(lng, lat) {
    var map = new AMap.Map("container", {
        resizeEnable: true,
        center: [lng, lat],//地图中心点
        mapStyle: 'amap://styles/' + AmapQdStyle_white,
        zoom: 13 //地图显示的缩放级别
    });
    //添加点标记，并使用自己的icon
    new AMap.Marker({
        map: map,
        position: [lng, lat],
        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        offset: new AMap.Pixel(0, 0)
    });
}

//绘制矢量图形
var map = new AMap.Map("container1", {
    zoom: 9,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});
// 清除已绘制图形
function drawClearFun1() {
    markerLocation = [];
    $('.orderMapPoint').html('');
    $('.orderMapPointDef').html('');
}
function arraySameItem(array) {  // 验证重复元素，有重复返回true；否则返回false
    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + array.join("\x0f\x0f") + "\x0f");
}
