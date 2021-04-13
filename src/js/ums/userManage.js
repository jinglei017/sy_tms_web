var app = new Vue({
    el: '#overall',
    data: {
        currentPage: 1,
        queryPageSize:20,
        tableOrderList: {},
        selectListData: {},
        clickBtnType: "",
        isDisable: false,
        searchInf: [],
        pageList: [],
        totalList: [],
        orderDetail: {},
        logininf: {},
        queryParam: {},
        currentUserId: "",
        contactList: {},
        roleList: [],
        roleList1: [],
        zzList: [],
        currentRoleId: [],
        currentRoleList: [],
        userInfObj: {
            isActive: "",
            deviceType:null
        },
        driverInfObj: {
            homeTenantNo: "",
            homeTenantName:"",
            userCode:"",
            passWd:"",
            newPassWd:"",
            contactName:"",
            contactTel:"",
            validToken: null,
            contactEmail: "",
            countryCode:"100000",
            provinceCode:"",
            userName: "",
            cityCode:"",
            districtCode:"",
            street:"",
            address:""
        },
        currentCotactIndex: "",
        templateTitle: "新增用户",
        itemSingle: {},

        currentRoleId: "",
        treeDemoInputList: "",
        showPlaceList: false,
        getPlaceListTimer: null,
        cooperative: false,
        getAllCountryList: [],
        gotValidToken1:'0',
        getValidTokenInt1: 60,
        getValidTokenTimer1: null,
        timeHorizon:"", //创建时间范围
    },
    methods: {
        queryPlaceInfo(val) { //  合作商
            if (val != '' && val != ' ') {
                var that = this;
                that.showPlaceList = false;
                clearTimeout(that.getPlaceListTimer);
                that.getPlaceListTimer = null;
                that.getPlaceListTimer = setTimeout(function () {
                    var cdPartyVo = {
                        partyName: val.trim()
                    };
                    $.ajax({
                        url: cmdUrl + "/query/getPartyListByPartyName.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,
                        type: "post",
                        contentType: 'application/json',
                        data: JSON.stringify(cdPartyVo),
                        success: function (data) {
                            that.placeList = [];
                            if (data.result.length > 0) {
                                that.placeList = data.result;
                                that.showPlaceList = true;
                            }
                        }
                    });
                }, 300);
            }
        },
        choosePlace(placeItem) {
            var that = this;
            that.userInfObj.partyName = placeItem.partyName;
            that.userInfObj.partyNo = placeItem.partyCode;
            that.showPlaceList = false;
        },
        chooseRole(index) {
            var that = this;
            if (currentRoleIdChecked.indexOf(index) < 0) {
                currentRoleIdChecked.push(index);
                that.userInfObj.currentRoleId = currentRoleIdChecked;
            } else {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                currentRoleIdChecked.remove(index);
                that.userInfObj.currentRoleId = currentRoleIdChecked;
            }
        },
        chooseZz(value) {
            var that = this;
            if (currentOrgIdChecked.indexOf(value) < 0) {
                currentOrgIdChecked.push(value)
                that.userInfObj.currentOrgId = currentOrgIdChecked;
            } else {
                Array.prototype.remove = function (val) {
                    var index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                currentOrgIdChecked.remove(value);
                that.userInfObj.currentOrgId = currentOrgIdChecked;
            }
        },
        checkedRole(event, roleItem) {
            var el = event.target;
            $(el).toggleClass("roleItemActive");
        },
        addOrderDetails(title) {
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.cooperative = true;
            that.userInfObj = {deviceType:null};
            var umTenantId = that.logininf.umTenantId;
            that.zzAndRoleAdd("add", umTenantId);
        },
        zzAndRoleAdd(value1, value2) {
            var that = this;
            currentOrgIdChecked = [];
            var flagStr = value1;
            var paramId = value2;
            $.ajax({
                type: "get",
                url: umsUrl + "/get/userOrgAndRoleById.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&flagStr=" + flagStr + "&paramId=" + paramId,
                success: function (res) {
                    that.zzList = res.result.umOrgs;
                    that.roleList1 = res.result.umRoles;
                }
            })
        },
        zzAndRoleDetail(value1, value2) {
            var that = this;
            currentRoleIdChecked = [];
            currentOrgIdChecked = [];
            that.zzList = {};
            that.roleList1 = {};
            var flagStr = value1;
            var paramId = value2;
            $.ajax({
                type: "get",
                url: umsUrl + "/get/userOrgAndRoleById.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&flagStr=" + flagStr + "&paramId=" + paramId,
                success: function (res) {
                    var dataOrg = res.result.orgAssignModel;
                    if (dataOrg.allOrgList != null) {
                        var allOrgList = dataOrg.allOrgList;
                        that.zzList = allOrgList;
                        setTimeout(function () {
                            if (dataOrg.currentOrgId != null) {
                                var currentOrgId = dataOrg.currentOrgId;
                                for (var j = 0; j < allOrgList.length; j++) {
                                    for (var i = 0; i < currentOrgId.length; i++) {
                                        if (currentOrgId[i] == allOrgList[j].umOrgId) {
                                            currentOrgIdChecked.push(currentOrgId[i]);
                                            $(".zzDivLi .zzDiv").eq(j).find("input").attr("checked", "checked");
                                        }
                                    }
                                }
                            }
                        }, 300)
                    } else {
                        that.zzList = [];
                    }
                    var dataRole = res.result.roleAssignModel;
                    if (dataRole.allRoleList != null) {
                        var allRoleList = dataRole.allRoleList;
                        that.roleList1 = allRoleList;
                        setTimeout(function () {
                            if (dataRole.currentRoleId != null) {
                                var currentRoleId = dataRole.currentRoleId;
                                for (var j = 0; j < allRoleList.length; j++) {
                                    for (var i = 0; i < currentRoleId.length; i++) {
                                        if (currentRoleId[i] == allRoleList[j].umRoleId) {
                                            $(".roleDivLi .zzDiv").eq(j).find("input").attr("checked", true);
                                            currentRoleIdChecked.push(currentRoleId[i]);
                                        }
                                    }
                                }
                            }
                        }, 300)
                    } else {
                        that.roleList1 = [];
                    }
                }
            })
        },
        saveRolePermission() {
            var that = this;
            if ($(".roleItemActive").length == 0) {
                imitatePopup("请选择角色后再保存", 'alert');
                return false;
            }
            var roleIdArr = [];
            for (var i = 0; i < $(".roleItemActive").length; i++) {
                roleIdArr[i] = $(".roleItemActive").eq(i).attr("data-roleid")
            }
            var paramsObj = {
                refId: that.currentUserId,
                currentRoleId: roleIdArr
            };
            postRequest(umsUrl + "/assign/userRole.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, paramsObj, function (res) {
                imitatePopup("分配角色成功", 'alert');
                // 关闭侧滑 ------ start
                closeSideslip();

                that.getSearchVal();
            })
        },
        closeMaskLayer() {
            $(".maskLayer").hide();
        },
        getOrderDetails(title, pdItem) {
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.cooperative = false;
            that.userInfObj = pdItem;
            var umUserId = pdItem.umUserId
            that.zzAndRoleDetail("detail", umUserId);
        },
        assignRole(pdItem) {
            var that = this;
            this.isDisable = true;
            $(".adsRightConRoleList .roleitemLi").removeClass("roleItemActive");
            that.userInfObj = pdItem;
            this.currentUserId = pdItem.umUserId;
            $.ajax({
                type: "post",
                url: umsUrl + "/get/userRoleInfoList.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&userId=" + pdItem.umUserId,
                success: function (res) {
                    if (res.result.currentRoleId != null) {
                        that.currentRoleList = res.result.currentRoleId;
                    } else {
                        that.currentRoleList = [];
                    }
                    if (res.result.allRoleList != null) {
                        that.roleList = res.result.allRoleList;
                    } else {
                        that.roleList = [];
                    }
                }
            })

        },

        allotOrganization(roleItem) {  //跳转到分配组织页面
            var that = this;
            this.isDisable = true;
            that.currentRoleId = roleItem.umRoleId;
            that.userInfObj = roleItem;
        },


        changeOrderDetails(title, pdItem) {
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.cooperative = false;
            that.userInfObj = pdItem;
            var umUserId = pdItem.umUserId;
            that.zzAndRoleDetail("detail", umUserId);
        },
        changePage(pageNum, clickStatus) {
            var num = parseInt(pageNum / 7);
            if (pageNum % 7 == 0 && clickStatus == "up") {
                var leftNum1 = -210 * parseInt(num - 1);
                $(".paging .pagingCon .pagination").animate({
                    "left": leftNum1 + "px"
                }, 300);
                this.currentPage = pageNum;
            } else if (pageNum % 7 == 1 && pageNum != 1) {
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if (clickStatus == "up" || this.currentPage > pageNum) {
                    $(".paging .pagingCon .pagination").animate({
                        "left": leftNum1 + "px"
                    }, 300);
                    this.currentPage = pageNum;
                } else {
                    $(".paging .pagingCon .pagination").animate({
                        "left": leftNum + "px"
                    }, 300);
                    this.currentPage = pageNum;
                }
            } else {
                this.currentPage = pageNum;
            }
            //翻页
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum: pageNum,
                pageSize: this.queryPageSize
            }
            var that = this;
            //获取订单列表
            postRequest(umsUrl + "/select/pageUserByUserVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
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
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = {}
        },
        getSearchVal() {
            //查询方法用户信息条件参数
            var that = this;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if (startTimeVal === '创建时间--起始时间') {
            } else {
                searchFormArr.startCreateTime = startTimeVal;
            }
            if (endTimeVal === '创建时间--终止时间') {
            } else {
                searchFormArr.endCreateTime = endTimeVal;
            }
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize: that.queryPageSize
            }
            //获取用户信息列表
            postRequest(umsUrl + "/select/pageUserByUserVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                that.tableOrderList = res.result;
                that.pageList = [];
                for (var i = 0; i < res.pageInfo.pages; i++) {
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
                that.currentPage = 1;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                }, 300);
                for (var n = 0; n < res.pageInfo.total; n++) {
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        editUserInfo() {
            var that = this;
            if (that.userInfObj.userName == "" || that.userInfObj.userName == null || that.userInfObj.userName == undefined) {
                imitatePopup("请填写用户名！", 'alert');
                return false;
            }
            if (that.userInfObj.userName == "" || that.userInfObj.userName == null || that.userInfObj.userName == undefined) {
                imitatePopup("请填写组织！", 'alert');
                return false;
            }
            if (that.userInfObj.userName == "" || that.userInfObj.userName == null || that.userInfObj.userName == undefined) {
                imitatePopup("请填写角色！", 'alert');
                return false;
            }
            if (that.userInfObj.userCode == "" || that.userInfObj.userCode == null || that.userInfObj.userCode == undefined) {
                imitatePopup("请填写用户编码！", 'alert');
                return false;
            }
            if (that.userInfObj.roleLevel == "" || that.userInfObj.roleLevel == null || that.userInfObj.roleLevel == undefined) {
                imitatePopup("请填写用户等级！", 'alert');
                return false;
            }
            var paramsObj = that.userInfObj;
            var roleIdList = paramsObj.currentRoleId;
            var orgIdList = paramsObj.currentOrgId;
            //保存联系人信息
            $.ajax({
                url: umsUrl + "/update/user.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&orgIdList[]=" + orgIdList + "&roleIdList[]=" + roleIdList,
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify(paramsObj),
                success: function (res) {
                    imitatePopup("修改用户信息成功", 'alert');
                    // 关闭侧滑 ------ start
                    closeSideslip();

                    that.getSearchVal();
                }
            })
        },
        saveNewUserInfo() {
            var that = this;
            if (that.userInfObj.userName == "" || that.userInfObj.userName == null || that.userInfObj.userName == undefined) {
                imitatePopup("请填写用户名！", 'alert');
                return false;
            }
            if (that.userInfObj.userCode == "" || that.userInfObj.userCode == null || that.userInfObj.userCode == undefined) {
                imitatePopup("请填写用户编码！", 'alert');
                return false;
            }
            if (that.userInfObj.roleLevel == "" || that.userInfObj.roleLevel == null || that.userInfObj.roleLevel == undefined) {
                imitatePopup("请填写用户等级！", 'alert');
                return false;
            }
            if (that.userInfObj.passwd == "" || that.userInfObj.passwd == null || that.userInfObj.passwd == undefined) {
                imitatePopup("请填写密码！", 'alert');
                return false;
            }
            var paramsObj = that.userInfObj;
            //保存联系人信息
            $.ajax({
                url: umsUrl + "/add/user.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp,
                type: "post",
                contentType: 'application/json',
                data: JSON.stringify(paramsObj),
                success: function (res) {
                    $(".ajax-load-pupup").remove();
                    // 关闭侧滑 ------ start
                    closeSideslip();

                    that.getSearchVal();
                }
            })
        },
        //修改用户状态
        changeUserStatus(dataParams, statusType) {
            var that = this;
            if (statusType !== "" && statusType === "black") {
                if (confirm("确定要注销吗？")) {
                } else {
                    return false;
                }
            }
            getRequest(umsUrl + '/update/changeUserStatusByUserId?token=' + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&userId=" + dataParams.umUserId + "&state=" + statusType, function (data) {
                if (data.status === 0) {
                    imitatePopup("操作成功！", 'alert');
                    that.getSearchVal();
                    return false;
                } else {
                    imitatePopup("操作失败！" + data.msg, 'alert');
                    console.log(data.error);
                    return false;
                }
            });
        },
        publicChangeBtnStatus() {
            var that = this;
            setTimeout(function () {
                var permissionListObj = "";
                var pageid = GetQueryString("objectId");
                var buttonObj = $(".butOperatePermission");
                getRequest(umsUrl + '/query/objectByUser.json?token=' + that.logininf.token + '&timeStamp=' + that.logininf.timeStamp + "&userId=" + that.logininf.umUserId + "&parentUmObjectId=" + pageid, function (res) {
                    permissionListObj = res.result;
                    for (var i = 0; i < permissionListObj.length; i++) {
                        for (var j = 0; j < buttonObj.length; j++) {
                            if (permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")) {
                                for (var m = 0; m < permissionListObj[i].permissionList.length; m++) {
                                    if (permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show") {
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
        resetOrderList() {
            window.location.reload();
        },

        // 提交司机入驻
        saveNewDriverInfo(){
            var that = this;
            if(that.driverInfObj.userName == ""){
                imitatePopup("请输入用户名称","alert");
                return false;
            }
            if(that.driverInfObj.userCode == ""){
                imitatePopup("请输入登录账号","alert");
                return false;
            }
            if(that.driverInfObj.passWd == ""){
                imitatePopup("请输入密码","alert");
                return false;
            }
            if(that.driverInfObj.newPassWd == ""){
                imitatePopup("请输入确认密码","alert");
                return false;
            }
            if(that.driverInfObj.passWd != that.driverInfObj.newPassWd){
                imitatePopup("两次输入的密码不同，请确认！","alert");
                return false;
            }
            if(that.driverInfObj.contactName == ""){
                imitatePopup("请输入联系人姓名","alert");
                return false;
            }
            if(that.driverInfObj.contactTel == ""){
                imitatePopup("请输入联系人手机号","alert");
                return false;
            }
            that.driverInfObj.address = "中国" + $(".driverAddress .inp select:first-child").find("option:selected").text()
                + $(".driverAddress .inp select:nth-child(2)").find("option:selected").text()
                + $(".driverAddress .inp select:nth-child(3)").find("option:selected").text()
                + $(".driverStreet .inp input").val();
            that.driverInfObj.homeTenantName = $(".driverTenName").find("option:selected").text();
            that.driverInfObj.homeTenantName = that.logininf.tenantName;
            that.driverInfObj.homeTenantNo = that.logininf.tenantNo;
            postRequest(umsUrl + "/insert/joinDrvContactInfo.json",that.driverInfObj,function(res){
                imitatePopup("入驻成功！","alert");
                closeSideslip();
                that.getSearchVal();
            });
        },

        // 省市区选择
        selectLocLevelFun(level, paramObj, code, name) { // 选中国省市区触发事件，入参：地址级别，对象，当前 国、省、市、区 编码 [ 便于扩展实时改变 详细地址address ]
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
    },
    created: function () {
        var that = this;
        var searchFormArr = {
            pageInfo: {
                pageNum: 1,
                pageSize: that.queryPageSize
            }
        }
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.getAllCountryList = getCountryData();
        //获取订单列表
        postRequest(umsUrl + "/select/pageUserByUserVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
            that.tableOrderList = res.result;
            for (var i = 0; i < res.pageInfo.pages; i++) {
                that.pageList[i] = i + 1;
            }
            for (var n = 0; n < res.pageInfo.total; n++) {
                that.totalList[n] = n + 1;
            }
            that.publicChangeBtnStatus();
        });
    },
    watch: {
        roleList: function () {
            this.$nextTick(function () {  // $nextTick 里面DOM更新是指页面上的数据是最新的数据
                for (var i = 0; i < this.roleList.length; i++) {
                    for (var j = 0; j < this.currentRoleList.length; j++) {
                        if (this.roleList[i].umRoleId == this.currentRoleList[j]) {
                            $(".roleitemLi").eq(i).addClass("roleItemActive");
                        }
                    }
                }
            })
        },
        treeDemoInputList: function () {
            this.$nextTick(function () {  // $nextTick 里面DOM更新是指页面上的数据是最新的数据
                var meauOperateObj = $("#treeDemo .inp-operate");
                for (var j = 0; j < meauOperateObj.length; j++) {
                    for (var i = 0; i < currentOrgList.length; i++) {
                        if (currentOrgList[i] == meauOperateObj.eq(j).val()) {
                            meauOperateObj.eq(j).prop("checked", true);
                        }
                    }
                }

            })
        },
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        }
    },
    filters: {
        timestampToTime(timestamp) {
            if (timestamp == null) {
                return '--';
            } else {
                var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
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
var currentRoleIdChecked = [];
var currentOrgIdChecked = [];
var logininf = JSON.parse(localStorage.getItem("logininf")), currentOrgList = [];  // 用户所在组织列表

$(document).ready(function () {
    var curUserId = "";

    $(".reportMessages tbody").on("click", "tr #getAllotOrgId", function () {
        curUserId = $(this).attr("userid");
        $.ajax({
            url: umsUrl + "/get/userOrgInfoList.json?token=" + logininf.token + "&timeStamp=" + logininf.timeStamp + "&userId=" + curUserId,
            type: "post",
            success: function (data) {
                var allOrgArray = [];
                if (data.result.allOrgList != null) {
                    allOrgArray = data.result.allOrgList;
                }
                if (data.result.currentOrgId != null) {
                    currentOrgList = data.result.currentOrgId;
                }

                ////////////////////////////////////////////////////////////// 加载 树结构 数据 —— start ////////////////////////////////////////////////////////////////////

                var IDMark_Switch = "_switch", IDMark_Icon = "_ico", IDMark_Span = "_span", IDMark_Input = "_input",
                    IDMark_Check = "_check", IDMark_Edit = "_edit",
                    IDMark_Remove = "_remove", IDMark_Ul = "_ul", IDMark_A = "_a";
                var setting = {
                    check: {
                        enable: false
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    /*callback:{
                        onCheck:onCheck
                    },*/
                    view: {
                        addDiyDom: addDiyDom
                    }
                };

                ///////////////////////////////////////////// 节点数据 —— start
                var zNodes = [];
                for (var i = 0; i < allOrgArray.length; i++) {
                    zNodes.push({
                        id: allOrgArray[i].umOrgId,
                        pId: allOrgArray[i].parentUmOrgId,
                        name: allOrgArray[i].orgName,
                        level: allOrgArray[i].level
                    })
                }
                /////////////////////////////////////////////// 节点数据 —— end

                var checkedOrgId = [];

                function onCheck(e, treeId, treeNode) {
                    checkedOrgId = [];
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");

                    var nodes = treeObj.getCheckedNodes(true);
                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i].children == undefined || nodes[i].children.length == 0) {  // 取子节点
                            checkedOrgId[checkedOrgId.length] = nodes[i].id;
                        }
                    }
                }

                function addDiyDom(treeId, treeNode) {
                    var aObj = $("#" + treeNode.tId + IDMark_A);
                    for (var i = 0; i < allOrgArray.length; i++) {
                        if (treeNode.id == allOrgArray[i].umOrgId) {
                            var editStr = '<input type="checkbox" value="' + allOrgArray[i].umOrgId + '" class="inp-operate"/><label for="" class="inp-txt">选中</label>';
                            aObj.after(editStr);
                        }
                    }
                }

                var code;

                function setCheck() {
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                        py = $("#py").attr("checked") ? "p" : "",
                        sy = $("#sy").attr("checked") ? "s" : "",
                        pn = $("#pn").attr("checked") ? "p" : "",
                        sn = $("#sn").attr("checked") ? "s" : "",
                        type = {"Y": py + sy, "N": pn + sn};
                    zTree.setting.check.chkboxType = type;
                    showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
                }

                function showCode(str) {
                    if (!code) code = $("#code");
                    code.empty();
                    code.append("<li>" + str + "</li>");
                }

                ////////////////////////////////////////////////////////////// 加载 树结构 数据 —— end ////////////////////////////////////////////////////////////////////


                //////////////////////////////////////////////////////////  ready ////////////////////////////////////////
                $.fn.zTree.init($("#treeDemo"), setting, zNodes).expandAll(true);  // 初始化 树结构，节点 全部展开
                setCheck();
                $("#py").bind("change", setCheck);
                $("#sy").bind("change", setCheck);
                $("#pn").bind("change", setCheck);
                $("#sn").bind("change", setCheck);
                //////////////////////////////////////////////////////////  ready ////////////////////////////////////////


                ////////////////////////////////////////////////////////// 勾选已分配 节点 //////////////////

                $("#treeDemo .inp-operate").prop("checked", false);
                /*var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
                zTreeObj.checkAllNodes(false);
                zTreeObj.cancelSelectedNode();
                zTreeObj.expandAll(true);*/

                app.treeDemoInputList = zNodes;
            }
        })
    });

    $(".saveNewOrgBtn").click(function () {
        var meauOperateObj = $("#treeDemo .inp-operate");
        var permissionIdArr = [];
        for (var i = 0; i < meauOperateObj.length; i++) {
            if (meauOperateObj.eq(i).prop("checked")) {
                permissionIdArr[permissionIdArr.length] = meauOperateObj.eq(i).val();  // way1
                //   permissionIdArr.push(meauOperateObj.eq(i).val());   // way2
            }
        }
        var paramsObj = {
            refId: curUserId,
            currentOrgId: permissionIdArr
        };
        postRequest(umsUrl + "/assign/userOrg.json?token=" + logininf.token + "&timeStamp=" + logininf.timeStamp, paramsObj, function (res) {
            imitatePopup("用户分配组织成功！", 'alert');

            // 关闭侧滑 ------ start
            closeSideslip();

            app.getSearchVal();
        })
    });

});

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});

// 校验手机号
function checkInputPhone(tel){
    if(!(/^1[34578]\d{9}$/.test(tel))){
        return false;
    }else{
        return true;
    }
}
