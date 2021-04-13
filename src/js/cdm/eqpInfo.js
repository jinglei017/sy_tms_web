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
        pageList: [],
        pageList1: [],
        pageList2: [],
        totalPagesNum1: "",
        totalPagesNum2: "",
        totalList: [],
        orderDetail: {},
        currentDqIndex: "",
        addressList: {},
        currentCotactIndex: "",
        currentArIndex: '',
        templateTitle: "新增联系人",
        deviceInfo: {
            eqpName: "",
            eqpStatus: "",
            eqpNature: "",
            eqpType: "",
            eqpNo: "",
            isDefault: "",
            eqpStr1: "",
            eqpStr2: ""
        },
        eqpContactList: [{
            contactType: "",
            contactName: "",
            contactTel: "",
            contactEmail: "",
            contactAddress: "",
            remark: "",
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
        queryParamLocationContactList: [{
            locationType: "",
            countryCode: "100000",
            provinceCode: "",
            cityCode: "",
            districtCode: "",
            isDefault: "",
            address: ""
        }],
        queryParam: {
            partyType: null,
            contactType: "",
            eqpStatus: "",
            eqpNature: "",
            eqpType: "",
            locationType: ""
        },
        queryParam1: {},
        queryParam2: {
            contactType: ""
        },
        popupType: "",
        savedNewOrderInfo: '0',
        locShortShowList: [],
        contShortShowList: [],
        clearShow: true,
        getAllCountryList: {}, // 国家列表
        address00: "", // 改变 address —— 国
        address0: "", // 改变 address —— 省
        address1: "", // 改变 address —— 市
        address2: "", // 改变 address —— 区
        address3: "", // 改变 address —— 街道

        modifyCdLocationId: '', // 修改 设备 - 地址信息 ， 地址id
        modifyCdContactId: '', // 修改 设备 - 联系人信息 ， 联系人id
        equipLatLng: '',
        latLngList: '',
        locationType: 'LOA',
        allLocationType: "",
        partyCode: '',   // 合作商code
        shareInfoList: [],
        shareCarInfo: {
            eqpNo: "",
            eqpName: "",
            eqpBrand: "",
            eqpType: "",
            eqpNature: "",
            eqpSpec: "",
            eqpLength: "",
            eqpWidth: "",
            eqpHeight: "",
            eqpStr1: "",
            eqpStr2: ""
        },
        driverInfo: {},
        carrierInfo: {},
        resPartyList: [],
        shortShowType: "0",
        shortShowType1: "0",
        carrierDetail: {},
        carrierContactDetail: {},
        showDriverList: false,
        showDriverList1: false,
        contactList: [],
        infoWindow: new AMap.InfoWindow({ offset: new AMap.Pixel(5, 1) }), //信息窗体
        coorLatLngList: [],
        marOrderItem: {},
        coordinateLatLngInfo: {},
        linkNames: ["车辆管理", "车辆模板管理"],
        linkHrefs: [],
        sharingTimeItem: "",
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
                case '0': // 上传设备
                    $('#excelFile').addClass('uploadType1');
                    $('#excelFile').removeClass('uploadType2');
                    break;
                case '1': // 上传设备信息
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
                case '0': // 上传设备
                    fileUploadRequest(cmdUrl + '/import/eqpData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
                case '1': // 上传设备信息
                    fileUploadRequest(cmdUrl + '/import/eqpInfoData.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp, function (res) {
                        that.filesUploadSuc();
                    });
                    break;
            }
        },
        filesUploadSuc() {
            var that = this;
            that.clearShow = true;
            setTimeout(function () {
                $(".fileUploadLi #inputBox1").css({ "display": "inline-block" });
            }, 100);
            $(".ajax-load-pupup").remove();
            //获取列表
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
            $(".mapInfoMatter").hide();
            var that = this;
            let partyCode = that.logininf.userPartyNo;
            that.partyCode = partyCode;
            that.isDisable = false;
            that.deviceInfo = {
                eqpName: "",
                eqpStatus: "",
                eqpNature: "",
                eqpType: "",
                eqpNo: "",
                isDefault: "",
                eqpStr1: "",
                eqpStr2: ""
            };
            that.eqpContactList = [{
                contactType: "",
                contactName: "",
                contactTel: "",
                contactEmail: "",
                contactAddress: "",
                remark: "",
                isDefault: ""
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
            that.contShortShowList = [];
            that.locShortShowList = [];
            that.resetAddressParamFun('1');
        },
        getOrderDetails(title, dpItem) { // 详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            $(".mapInfoMatter").hide();
            that.isDisable = true;
            that.coordinateLatLngInfo = dpItem;
            that.partyCode = dpItem.partyCode;
            getRequest(cmdUrl + "/get/eqpDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + dpItem.cdEqpId, function (res) {
                that.deviceInfo = res.result.eqp;
                that.contShortShowList = res.result.contactList;
                that.locationContactList = res.result.locationList;
                if (that.locationContactList == null || that.locationContactList == '' || that.locationContactList == undefined) {
                    that.locationContactList = [{
                        locationType: "",
                        countryCode: "100000",
                        provinceCode: "",
                        cityCode: "",
                        districtCode: "",
                        isDefault: "",
                        address: ""
                    }];
                }
                setTimeout(function () {
                    if (that.deviceInfo.eqpLabel != null && that.deviceInfo.eqpLabel != '' && that.deviceInfo.eqpLabel != undefined) {
                        var eqpLabelArr = that.deviceInfo.eqpLabel.split(',');
                        for (var j = 0; j < that.selectListData.eqpLabelList.length; j++) {
                            for (var i = 0; i < eqpLabelArr.length; i++) {
                                if (eqpLabelArr[i] == that.selectListData.eqpLabelList[j].code) {
                                    $(".zzDivLi .zzDiv").eq(j).find("input").attr("checked", "checked");
                                }
                            }
                        }
                    }
                }, 300)
            })
        },
        changeOrderDetails(title, dpItem) { // 修改
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            $(".mapInfoMatter").hide();
            that.isDisable = false;
            that.savedNewOrderInfo = '1';
            that.partyCode = dpItem.partyCode;
            getRequest(cmdUrl + "/get/eqpDetails.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + dpItem.cdEqpId, function (res) {
                console.log(res.result)
                that.deviceInfo = res.result.eqp;
                that.contShortShowList = res.result.contactList;
                that.locationContactList = res.result.locationList;
                if (that.locationContactList == null || that.locationContactList == '' || that.locationContactList == undefined) {
                    that.locationContactList = [{
                        locationType: "",
                        countryCode: "100000",
                        provinceCode: "",
                        cityCode: "",
                        districtCode: "",
                        isDefault: "",
                        address: ""
                    }];
                }
                that.eqpContactList = [];
                setTimeout(function () {
                    if (that.deviceInfo.eqpLabel != null && that.deviceInfo.eqpLabel != '' && that.deviceInfo.eqpLabel != undefined) {
                        var eqpLabelArr = that.deviceInfo.eqpLabel.split(',');
                        for (var j = 0; j < that.selectListData.eqpLabelList.length; j++) {
                            for (var i = 0; i < eqpLabelArr.length; i++) {
                                if (eqpLabelArr[i] == that.selectListData.eqpLabelList[j].code) {
                                    $(".zzDivLi .zzDiv").eq(j).find("input").attr("checked", "checked");
                                }
                            }
                        }
                    }
                }, 300)
            })
        },
        deleteOrderDetails(dpItem) {
            var that = this;
            var r = confirm("确定删除当前设备");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + dpItem.cdEqpId, function (res) {
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo: {
                            pageNum: that.currentPage,
                            pageSize: that.queryPageSize
                        }
                    };
                    postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        for (var i = 0; i < res.pageInfo.pages; i++) {
                            that.pageList[i] = i + 1;
                        }
                        that.totalList = [];
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
                    cdEqpId = partyItem.cdEqpId;
                    isDefault = 1;
                    break;
                case '0': // 取消默认
                    cdEqpId = partyItem.cdEqpId;
                    isDefault = 0;
                    break;
            }
            getRequest(cmdUrl + "/set/setDefaultEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdEqpId=" + cdEqpId + "&isDefault=" + isDefault, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg, "alert");
                    return false;
                }
            })
        },
        getCoordinateLatLng() {
            drawClearFun1();
            $(".orderMapPoint,.orderMapPointDef,.amap-icon").remove();
            $(".mapInfoMatter").show();
            var that = this;
            that.allLocationType = 0;
            that.markerArrayFun(that.coordinateLatLngInfo);
        },
        changeLocationType() {
            var that = this;
            that.markerArrayFun(that.marOrderItem);
        },
        markerArrayFun(markerInfo) {  // 标记点
            map.clearMap();
            var that = this;
            var markerLocation = [], marker, itemLatlng;
            var newDiv = document.createElement("div");
            if (that.locationType == "LOA") {
                itemLatlng = markerInfo.loaLatLng;
            } else if (that.locationType == "CL") {
                itemLatlng = markerInfo.clLatLng;
            }
            if (itemLatlng != null) {
                var string = itemLatlng.split(',');
                markerLocation.push(string[0]);
                markerLocation.push(string[1]);
            } else {
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
        signalOrderClick(e) {
            var that = this;
            var eqpType = that.exchangeEqpType(that.marOrderItem.eqpType);
            var eqpStatus = that.exchangeEqpStatus(that.marOrderItem.eqpStatus);
            var eqpNature = that.exchangeEqpNature(that.marOrderItem.eqpNature);
            var info = '<div>' +
                '<p><span class="pointInfoColor1">设备类型：</span><span class="pointInfoColor2">' + eqpType + '</span></p>' +
                '<p><span class="pointInfoColor1">设备状态：</span><span class="pointInfoColor2">' + eqpStatus + '</span></p>' +
                '<p><span class="pointInfoColor1">设备性质：</span><span class="pointInfoColor2">' + eqpNature + '</span></p>' +
                '<p><span class="pointInfoColor1">设备号：</span><span class="pointInfoColor2">' + that.marOrderItem.eqpNo + '</span></p>' +
                '<p><span class="pointInfoColor1">合作商：</span><span class="pointInfoColor2">' + that.marOrderItem.partyName + '</span></p>' +
                '</div>';
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        addConactFun() { // 新增联系人
            var that = this;
            that.eqpContactList = [];
            that.eqpContactList.push({
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
        editOrderInfo() { // 保存设备信息
            var that = this;
            console.log(that.deviceInfo)
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpType == "" || that.deviceInfo.eqpNo == undefined) {
                imitatePopup("设备类型不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpBrand == "" || that.deviceInfo.eqpBrand == undefined) {
                imitatePopup("设备品牌不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpNo == "" || that.deviceInfo.eqpNo == undefined) {
                imitatePopup("设备号不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpNature == "" || that.deviceInfo.eqpNature == undefined) {
                imitatePopup("设备性质不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpStatus === "" || that.deviceInfo.eqpStatus === undefined) {
                imitatePopup("设备状态不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpSpec == "" || that.deviceInfo.eqpSpec == undefined) {
                imitatePopup("设备型号不能为空！", "alert");
                return false;
            }

            if (that.locationContactList[0].countryCode == '' || that.locationContactList[0].provinceCode == '' || that.locationContactList[0].cityCode == '' || that.locationContactList[0].districtCode == '') {
                imitatePopup("请选择省市区", "alert");
                return false;
            }
            if (that.locationContactList[0].street == '' || that.locationContactList[0].street == null) {
                imitatePopup("请输入街道", "alert");
                return false;
            }
            if (that.locationContactList[0].address == '' || that.locationContactList[0].address == null) {
                imitatePopup("请输入详细地址", "alert");
                return false;
            }
            var labelArr = [];
            $("input[name='label']:checked").each(function (i) {
                labelArr.push($(this).val())
            })
            that.deviceInfo.eqpLabel = labelArr.toString();
            var params = {
                partyCode: that.partyCode,
                eqp: that.deviceInfo,
                location: that.locationContactList[0]
            };
            postRequest(cmdUrl + "/update/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.queryParam.partyCode = "";
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg, "alert");
                    return false;
                }
            })
        },
        saveNewOrderInfo() { // 新增设备信息
            var that = this;
            var check = 0;
            if (that.partyCode == "" || that.partyCode == undefined) {
                imitatePopup("合作商编码不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpNo == "" || that.deviceInfo.eqpNo == undefined) {
                imitatePopup("设备号不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpBrand == "" || that.deviceInfo.eqpBrand == undefined) {
                imitatePopup("设备品牌不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpStatus === "" || that.deviceInfo.eqpStatus === undefined) {
                imitatePopup("设备状态不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpSpec == "" || that.deviceInfo.eqpSpec == undefined) {
                imitatePopup("设备型号不能为空！", "alert");
                return false;
            }
            if (that.deviceInfo.eqpType == '' || that.deviceInfo.eqpStatus == '' || that.deviceInfo.eqpNature == '' || that.deviceInfo.eqpNo == '') {
                check += 1;
            }
            if (check != 0) {
                imitatePopup('请完整填写必填项', "alert");
                return false;
            }
            if (that.locationContactList[0].countryCode == '' || that.locationContactList[0].provinceCode == '' || that.locationContactList[0].cityCode == '' || that.locationContactList[0].districtCode == '') {
                imitatePopup("请选择省市区", "alert");
                return false;
            }
            if (that.locationContactList[0].street == '' || that.locationContactList[0].street == null) {
                imitatePopup("请输入街道", "alert");
                return false;
            }
            if (that.locationContactList[0].address == '' || that.locationContactList[0].address == null) {
                imitatePopup("请输入详细地址", "alert");
                return false;
            }
            var labelArr = [];
            $("input[name='label']:checked").each(function (i) {
                labelArr.push($(this).val())
            })
            that.deviceInfo.eqpLabel = labelArr.toString();
            var params = {
                partyCode: that.partyCode,
                eqp: that.deviceInfo,
                location: that.locationContactList[0]
            };
            postRequest(cmdUrl + "/insert/cdEqp.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {

                that.savedNewOrderInfo = '1';
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    closeSideslip();//关闭侧滑
                    that.getSearchVal();//调用查询页面
                } else {
                    imitatePopup(res.msg, "alert");
                    return false;
                }
            })
        },
        delLocInfo(locShortShow, indexes) { // 删除设备下的地址，，，，同货点删除
            var that = this;
            var r = confirm("确定删除该地址？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdLocation.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdLocationId=" + locShortShow.cdLocationId, function (res) {
                    that.locShortShowList.splice(indexes, 1);
                    that.locationContactList = [];
                })
            }
        },
        delContInfo(contShortShow, indexes) { // 删除设备下联系人，，，，同联系人删除
            var that = this;
            var r = confirm("确定删除该联系人？");
            if (r == true) {
                getRequest(cmdUrl + "/delete/cdContact.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&cdContactId=" + contShortShow.cdContactId, function (res) {
                    that.contShortShowList.splice(indexes, 1);
                    that.eqpContactList = [];
                })
            }
        },
        setLocDefault(indexes) { },
        setContDefault(indexes) { },
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
            that.eqpContactList = newArray;
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
                //    postCode:locShortShow.postCode,
                address: locShortShow.address
            };
            newArray.push(param);
            that.locationContactList = newArray;
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
        chooseContactFun(index, type) { // 选择联系人 - 按钮
            var that = this;
            that.popupType = type;
            that.currentCotactIndex = index;
            that.queryParam2 = {
                contactType: ""
            };
            var params = that.queryParam2;
            params.pageInfo = {
                pageNum: 1,
                pageSize: 12
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
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
        selectAddress(addressItem, index) { // 选择地址 - tr
            var that = this;
            addressItem.cdLocationId = undefined;
            addressItem.isDefault = '';
            this.$set(this.locationContactList, this.currentArIndex, addressItem);
            $(".maskLayer1").hide();
        },
        selectContactFun(contactItem, index) { // 选择联系人 - tr
            var that = this;
            contactItem.cdContactId = undefined;
            contactItem.isDefault = '';
            this.$set(this.eqpContactList, this.currentCotactIndex, contactItem);
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
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: that.queryPageSize
            }
            postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
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
        changePage2(pageNum, clickStatus) { // 弹窗联系人列表
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
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.contactList = res.result;
                that.pageList2 = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList2[i] = i + 1;
                }
            })
        },
        getSearchVal() { // 搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
            that.logininf = JSON.parse(localStorage.getItem("logininf"));
            var ex = /^\d+$/;
            if (ex.test(splitCountNum) && splitCountNum > 1 && splitCountNum < 2000) {
                that.multipleNum = that.queryPageSize;
                this.queryParam.provinceCode = that.queryParamLocationContactList[0].provinceCode;
                this.queryParam.cityCode = that.queryParamLocationContactList[0].cityCode;
                this.queryParam.districtCode = that.queryParamLocationContactList[0].districtCode;
                var searchFormArr = this.queryParam;
                searchFormArr.pageInfo = {
                    pageNum: 1,
                    pageSize: that.queryPageSize
                }
                //获取订单列表
                postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                    that.tableOrderList = res.result;
                    that.pageList = [];
                    for (var i = 0; i < res.pageInfo.pages; i++) {
                        that.pageList[i] = i + 1;
                    }
                    that.totalList = [];
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
                imitatePopup("请输入大于1且小于2000的正整数", "alert");
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
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                that.contactList = res.result;
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
        getCoordinateVal(title) {
            this.templateTitle = title;
            drawClearFun1();
            $(".orderMapPoint,.orderMapPointDef,.amap-icon").remove();
            var that = this;
            that.allLocationType = 1;
            that.latLngList = [];
            var searchFormArr = this.queryParam;
            //获取订单列表
            postRequest(cmdUrl + "/get/eqpVoListByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.equipLatLng = res.result;
                that.markerArrayFun1(that.equipLatLng)
            })
        },
        allChangeLocationType() {
            var that = this;
            that.markerArrayFun1(that.equipLatLng);
        },
        markerArrayFun1(markerInfoArray) {   // 批量标记点
            map.clearMap();
            var that = this;
            var newDiv = "";
            for (var n = 0; n < markerInfoArray.length; n++) {
                var item = markerInfoArray[n], markerLocation = [], marker, itemLatlng;
                newDiv = document.createElement("div");
                if (that.locationType == "LOA") {
                    itemLatlng = item.loaLatLng;
                } else if (that.locationType == "CL") {
                    itemLatlng = item.clLatLng;
                }
                if (itemLatlng != null) {
                    var string = itemLatlng.split(',');
                    markerLocation.push(string[0]);
                    markerLocation.push(string[1]);
                    that.coorLatLngList.push(itemLatlng);
                    newDiv.setAttribute("coorLatlng", itemLatlng);
                } else {
                    continue;
                }
                newDiv.className = "markerSet";
                newDiv.setAttribute("eqpNo", item.eqpNo);
                marker = new AMap.Marker({
                    map: map,
                    position: markerLocation,
                    offset: new AMap.Pixel(0, 0)
                });
                marker.setContent(newDiv);
                marker.on('click', that.signalOrderClick1);
            }
        },
        signalOrderClick1(e) {  // 打开信息窗体
            var that = this;
            var eqpNo = e.target.ue.content.attributes.eqpNo.value;
            var coorLatlng = e.target.ue.content.attributes.coorLatlng.value;
            $('.amap-info-contentContainer').show();
            var temp = [], info;
            for (var n = 0; n < that.coorLatLngList.length; n++) {
                if (that.coorLatLngList[n] == coorLatlng) {
                    temp.push(n);
                }
            }
            for (var i = 0; i < that.equipLatLng.length; i++) {
                if (that.equipLatLng[i].eqpNo == eqpNo) {
                    var totalDiv = '';
                    for (var a = 0; a < temp.length; a++) {
                        var tem = temp[a];
                        var eqpType = that.exchangeEqpType(that.equipLatLng[tem].eqpType);
                        var eqpStatus = that.exchangeEqpStatus(that.equipLatLng[tem].eqpStatus);
                        var eqpNature = that.exchangeEqpNature(that.equipLatLng[tem].eqpNature);
                        totalDiv += '<p><span class="pointInfoColor1">序号：</span><span class="pointInfoColor3">' + (tem + 1) * 1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">设备类型：</span><span class="pointInfoColor2">' + eqpType + '</span></p>' +
                            '<p><span class="pointInfoColor1">设备状态：</span><span class="pointInfoColor2">' + eqpStatus + '</span></p>' +
                            '<p><span class="pointInfoColor1">设备性质：</span><span class="pointInfoColor2">' + eqpNature + '</span></p>' +
                            '<p><span class="pointInfoColor1">设备号：</span><span class="pointInfoColor2">' + that.equipLatLng[tem].eqpNo + '</span></p>' +
                            '<p><span class="pointInfoColor1">合作商：</span><span class="pointInfoColor2">' + that.equipLatLng[tem].partyName + '</span></p>';
                    }
                    info = '<div>' + totalDiv + '</div>';
                }
            }
            that.infoWindow.setContent(info);
            that.infoWindow.open(map, e.target.getPosition());
        },
        exchangeEqpType(eqpType) {
            var that = this;
            for (var i = 0; i < that.selectListData.eqpTypeList.length; i++) {
                if (eqpType == that.selectListData.eqpTypeList[i].code) {
                    eqpType = that.selectListData.eqpTypeList[i].text
                }
            }
            return eqpType;
        },
        exchangeEqpStatus(eqpStatus) {
            var that = this;
            if (eqpStatus == "0") {
                eqpStatus = "空闲";
            } else if (eqpStatus == "1") {
                eqpStatus = "占用";
            } else if (eqpStatus == "2") {
                eqpStatus = "预约";
            }
            return eqpStatus;
        },
        exchangeEqpNature(eqpNature) {
            var that = this;
            if (eqpNature == "COLD") {
                eqpNature = "冷链";
            } else if (eqpNature == "NORM") {
                eqpNature = "常温";
            } else if (eqpNature == "MIXI") {
                eqpNature = "双温";
            }
            return eqpNature;
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
        showItemDetails(type) {
            var that = this;
            if (type == 0) {
                that.shortShowType = '1';
            } else {
                that.shortShowType1 = '1';
            }
        },
        hideItemDetails(type) {
            var that = this;
            if (type == 0) {
                that.shortShowType = '0';
            } else {
                that.shortShowType1 = '0';
            }
        },
        changeCarrierInfo(id) {
            var that = this;
            if (id != '') {
                var param = {};
                $.each(that.resPartyList, function (indexs, val) {
                    if (val.cdPartyId == id) {
                        param = val;
                    }
                });
                that.carrierDetail.partyName = param.partyName;// 承运商 名称
                that.carrierDetail.partyCode = param.partyCode; // 承运商 编码
                that.carrierDetail.isBuyer = param.isBuyer; // 承运商 是否买家
                that.carrierDetail.isVendor = param.isVendor; // 承运商 是否卖家
                that.carrierDetail.isTruck = param.isTruck; // 承运商 是否卡车公司
                that.carrierDetail.isWarehouse = param.isWarehouse; // 承运商 是否仓库
                that.carrierDetail.is3pl = param.is3pl; // 承运商 是否第三方物流
                that.carrierContactDetail.contactName = param.imgContactName; // 承运商联系人
                that.carrierContactDetail.contactTel = param.imgContactTel; // 承运商电话
                that.carrierContactDetail.contactEmail = param.imgContactEmail; // 承运商邮箱
                that.carrierContactDetail.contactAddress = param.imgContactAddress; // 承运商地址
            }
        },
        shareCar(tableOrderItem) {
            let that = this;
            that.shareCarInfo = tableOrderItem;
            that.carrierInfo = {};
            that.carrierDetail = {};
            that.carrierContactDetail = {};
            that.driverInfo = {
                contactName: "",
                contactTel: ""
            };

            //查询当前租户的合作商信息
            var searchFormArr0 = {
                partyCode: tableOrderItem.partyCode,
            };
            postRequest(cmdUrl + "/get/cdPartys.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr0, function (data) {
                if (data.result != null && data.result.length > 0) {
                    that.carrierDetail = data.result[0];
                } else {
                    that.carrierDetail = {};
                }
            });
            that.carrierContactDetail.contactAddress = tableOrderItem.address;
            that.resetShareInfo();
            $(".maskLayer2").show();
        },

        //添加时间
        addShareInfo() {
            let that = this;
            let shareStartTime = that.sharingTimeItem.split(" - ")[0];
            let shareEndTime = that.sharingTimeItem.split(" - ")[1];
            if (shareStartTime == "" || shareEndTime == "") {
                imitatePopup("请填写开始时间和结束时间", "alert");
                return false;
            }
            let shareInfo = {
                dtmTime: shareStartTime,
                dtmTime1: shareEndTime,
            };
            that.shareInfoList.push(shareInfo);
            this.resetShareInfo();
        },
        //重置时间
        resetShareInfo() {
            let that = this;
            that.sharingTimeItem = "";
        },

        //删除时间
        removeShareInfo(index) {
            let that = this;
            this.shareInfoList.splice(index, 1);
        },
        //修改时间
        updateShareInfo(index, shareInfo) {
            let that = this;
            that.sharingTimeItem = shareInfo.dtmTime + " - " + shareInfo.dtmTime1;
            this.shareInfoList.splice(index, 1);
        },

        //查询联系人信息
        getContactInfo(val, type) {
            let that = this;
            let params = {
                contactName: val
            }
            if (type == 1) {
                params.contactType = "SAL";
            } else {
                params.contactType = "DRV";
            }
            that.contactList = [];
            params.pageInfo = {
                pageNum: 1,
                pageSize: 20
            };
            postRequest(cmdUrl + "/select/pageContactByContactVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                if (data.result != null) {
                    that.contactList = data.result;
                    if (type == 1) {
                        that.showDriverList1 = true;
                    } else {
                        that.showDriverList = true;
                    }
                }
            })
        },

        chooseContact(contactInfo, type) { // 选择司机
            if (type == 1) {
                this.carrierContactDetail.contactName = contactInfo.contactName;
                this.carrierContactDetail.contactTel = contactInfo.contactTel;
                this.carrierContactDetail.contactEmail = contactInfo.contactEmail;
                this.showDriverList1 = false;
            } else {
                this.driverInfo.contactName = contactInfo.contactName;
                this.driverInfo.contactTel = contactInfo.contactTel;
                this.showDriverList = false;
            }
        },

        mouseLeave(type) {
            if (type == 1) {
                this.showDriverList1 = false;
            } else {
                this.showDriverList = false;
            }
        },

        saveShareVehicleOrder() {
            var that = this;
            if (that.carrierDetail.partyName == "" || that.carrierDetail.partyName == undefined) {
                imitatePopup("承运商名称不能为空", "alert");
                return false;
            }

            if (that.shareCarInfo.eqpName == "" || that.shareCarInfo.eqpName == undefined) {
                imitatePopup("设备名称不能为空", "alert");
                return false;
            }

            if (that.driverInfo.contactName == "" || that.driverInfo.contactName == undefined) {
                imitatePopup("司机姓名不能为空", "alert");
                return false;
            }

            if (that.driverInfo.contactTel == "" || that.driverInfo.contactTel == undefined) {
                imitatePopup("司机电话不能为空", "alert");
                return false;
            }

            if (that.shareCarInfo.eqpNo == "" || that.shareCarInfo.eqpNo == undefined) {
                imitatePopup("车牌号不能为空", "alert");
                return false;
            }
            if (that.shareCarInfo.eqpNature == "" || that.shareCarInfo.eqpNature == undefined) {
                imitatePopup("请选择设备性质", "alert");
                return false;
            }
            that.carrierDetail.refTo = "om_order";
            that.carrierDetail.partyType = "CAR";
            //共享时间
            var dtmModelList = [];
            //共享地址
            var locationModelList = [];
            for (var i = 0; i < that.shareInfoList.length; i++) {
                var shareStartTime = that.shareInfoList[i].dtmTime;
                var shareEndTime = that.shareInfoList[i].dtmTime1;
                if (shareStartTime == "" || shareEndTime == "") {
                    imitatePopup("请填写开始时间和结束时间", "alert");
                    return false;
                }
                var dtmModel = {
                    dtmTime: new Date(shareStartTime),
                    dtmTime1: new Date(shareEndTime),

                }
                dtmModelList.push(dtmModel);
                /*var startLocationModel = {
                    address:that.shareInfoList[i].startAddress,
                    locationType:"STO"
                }
                locationModelList.push(startLocationModel);
                var endLocationModel = {
                    address:that.shareInfoList[i].endAddress,
                    locationType:"STO"

                }
                locationModelList.push(endLocationModel);*/
            }
            //共享设备
            var eqpInfoList = [];
            var eqpInfo = {
                eqp: that.shareCarInfo,
                contact: {
                    contactName: that.driverInfo.contactName,
                    contactTel: that.driverInfo.contactTel,
                    contactType: "DRV"
                },
                refType: that.shareCarInfo.eqpType
            }
            eqpInfoList.push(eqpInfo);
            var params = {
                order: {
                    orderType: 'SFO',
                    orderFrom: that.logininf.tenantNo,
                },
                partyContactInfo: {
                    party: that.carrierDetail,
                    imgContact: that.carrierContactDetail,
                },
                eqpInfoList: eqpInfoList,
                dtmModelList: dtmModelList
            };
            postRequest(tmsUrl + "/busShared/insertAndPullSfoOrderInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    imitatePopup("共享车辆成功", "alert");
                    $(".maskLayer2").hide();
                } else {
                    imitatePopup(res.msg, "alert");
                    return false;
                }
            })
        },


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
                                            $(".fileUploadHint1").css({ "display": "inline-block" });
                                        }
                                        if (permissionListObj[i].objectCode == "UPLOAD1") {
                                            $(".fileUploadHint2").css({ "display": "inline-block" });
                                        }
                                        $(".butOperatePermission").eq(j).css({ "display": "inline-block" })
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
        closeMaskLayer() {
            $(".maskLayer").hide();
        },
        resetOrderList() {
            window.location.reload();
        },
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
        postRequest(cmdUrl + "/select/pageEqpByEqpVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
            that.tableOrderList = res.result;
            for (var i = 0; i < res.pageInfo.pages; i++) {
                that.pageList[i] = i + 1;
            }
            for (var n = 0; n < res.pageInfo.total; n++) {
                that.totalList[n] = n + 1;
            }
            that.publicChangeBtnStatus();
        });

        //查询承运商列表
        /*var searchFormArr0 = {
            refType: "PARTYLNK"
        };
        postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr0, function (data) {
            if (data.result != null) {
                if (data.result.length > 0) {
                    that.resPartyList = data.result;
                } else {
                    that.resPartyList = [];
                }
            } else {
                that.resPartyList = [];
            }
        });*/
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

// 日期控件
$(document).ready(function () {
    $('#timeRange').daterangepicker(null, function (start, end) {
        app.sharingTimeItem = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});
