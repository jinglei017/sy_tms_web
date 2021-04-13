var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isDisable:false,
        clearShow:true,
        titleDisable:false,
        searchInf:[],
        pageList:[],
        totalPagesNum :"",
        orderDetail:{},
        logininf:{},
        deviceList:{},
        dpDistrictList:{},
        dpCityList:{},
        dpProvinceList:{},
        templateTitle:"新增联系人",
        popupType:"address",
        currentArIndex:"",
        currentDqIndex:"",
        currentCtIndex:"",
        addressList:{},
        contactList:[{}],
        partyContactlList:[{
            contactType:"",
            isDefault:""
        }],
        partyBaseInfo:{
            partyType:"",
            isBuyer:"",
            isVendor:"",
            isTruck:"",
            isWarehouse:"",
            is3pl:""
        },
        locationContactList:[{
            provinceCode:"",
            cityCode:"",
            districtCode:"",
            isDefault:""
        }],
        locationContact:{
            contactType:""
        },
        contactEqplList:[{
            isDefault:"",
            eqpType:""
        }],
        queryParam:{
            partyType:null
        }
    },
    methods:{
        chooseTheFile(){
            this.filesUpload();
            this.clearShow = false;
            $(".scheduleLoadPopup").show();
        },
        filesUpload(){
            var that = this;
            var num = 5;
    		var timer1 = setInterval(function(){
    			if(num == 90){
    				clearInterval(timer1);
    			}else{
    				num++;
    				$(".progressCon").css({
	    				"width":num+"%"
	    			})
    			}
    		},3000)
            $.ajaxFileUpload({
                url: cmdUrl + '/partyInfo/uploadExcelFile_EA?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    $(".progressCon").css({
		    				"width": "100%"
		    		})
			    	$(".scheduleLoadPopup .scheduleTitle span").html("商品上传完成");
			    	setTimeout(function(){
			    		num = 5;
			    		clearInterval(timer1);
			    		$(".scheduleLoadPopup").hide();
			    		$(".progressCon").css({
		    				"width": "5%"
		    			})
			    	},1000)
                    imitatePopup(data.result.resultMsg,"alert");
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    var searchFormArr = that.queryParam;
                    searchFormArr.pageInfo = {
                        pageNum:1,
                        pageSize:12
                    };
                    if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
                        searchFormArr.partyType = null;
                    }
                    //获取订单列表
                    setTimeout(function(){
                    	postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
	                        that.tableOrderList = res.result;
	                        that.totalPagesNum = res.pageInfo.total;
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
                    },1500)
                    
                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    setTimeout(function(){
                        imitatePopup("上传文件失败",'alert');
                    },1200)
                    
                    setTimeout(function(){
                    	num = 5;
			    		clearInterval(timer1);
			    		$(".scheduleLoadPopup").hide();
			    		$(".progressCon").css({
		    				"width": "5%"
		    			})
                    },1000);
                    that.clearShow = true;
                    setTimeout(function(){
                        $(".fileUploadLi .inputBox").css({"display":"inline-block"});
                    },100)
                    //  console.error(e);
                }
            });
        },
        resetQueryParam(){
            this.queryParam = {
                partyType:""
            };
            var that = this;
            var searchFormArr = {
                pageInfo:{
                    pageNum:1,
                    pageSize:12
                }
            }
            //获取订单列表
            postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        selectDqFun(deviceItem,index){
            deviceItem.isDefault = '';
            this.$set(this.contactEqplList,this.currentDqIndex,deviceItem);
            $(".maskLayer").hide();
        },
        selectAddress(addressItem,index){
            addressItem.isDefault = '';
            this.$set(this.locationContactList,this.currentArIndex,addressItem);
            $(".maskLayer").hide();
        },
        selectCtFun(contactItem,index){
            contactItem.isDefault = '';
            this.$set(this.partyContactlList,this.currentCtIndex,contactItem);
            $(".maskLayer").hide();
        },
        addOrderDetails(title){
            //到新增页面
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = true;
            that.titleDisable = false;
            that.partyContactlList = [{
                contactType:"",
                isDefault:""
            }]
            that.partyBaseInfo = {
                partyType:"",
                isBuyer:"",
                isVendor:"",
                isTruck:"",
                isWarehouse:"",
                is3pl:""
            }
            that.locationContactList = [{
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:""
            }]
            that.locationContact = {
                contactType:""
            }
            that.contactEqplList = [{
                isDefault:"",
                eqpType:""
            }]
        },
        selectCity(proviececode){
            this.cityList = getCityData(proviececode);
            return this.cityList;
        },
        selectDistrict(citycode){
            this.districtList = getDistrictData(citycode);
            return this.districtList;
        },
        selectCity1(proviececode){
            this.dpCityList = getCityData(proviececode);
            this.locationInfo.districtCode = "";
            this.locationInfo.cityCode = "";

        },
        selectDistrict1(citycode){
            this.dpProvinceList = getDistrictData(citycode);
            this.locationInfo.districtCode = "";
        },
        closeMaskLayer(){
            //关闭弹窗
            $(".maskLayer").hide();
        },
        addDeviceFun(){
            this.contactEqplList.push({
                isDefault:"",
                eqpType:""
            });
        },
        addAddressFun(){
            this.locationContactList.push({
                provinceCode:"",
                cityCode:"",
                districtCode:"",
                isDefault:""
            });
        },
        addConactFun(){
            this.partyContactlList.push({
                contactType:"",
                isDefault:""
            });
        },
        getOrderDetails(title,partyItem){
            //跳转订单详情
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.titleDisable = true;
            getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+partyItem.cdPartyId,function(res){
                that.partyBaseInfo = res.result.cdParty;
                that.partyContactlList = res.result.imgContactList;
                that.locationContactList = res.result.locationList;
                that.contactEqplList = res.result.eqpList;
            })
        },
        changeOrderDetails(title,partyItem){
            //跳转到修改订单
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = true;
            that.titleDisable = false;
            getRequest(cmdUrl + "/cdParty/selectPartyOneModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+partyItem.cdPartyId,function(res){
                that.partyBaseInfo = res.result.cdParty;
                that.partyContactlList = res.result.imgContactList;
                that.locationContactList = res.result.locationList;
                that.contactEqplList = res.result.eqpList;
            })
        },
        deleteOrderDetails(partyItem){
            //删除当前订单
            var that = this;
            var r = confirm("确定删除当前合作商");
            if (r==true){
                getRequest(cmdUrl + "/cdParty/deletePartyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+partyItem.cdPartyId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:12
                        }
                    }
                    postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        chooseContactFun(index,type){
            this.currentCtIndex = index;
            this.popupType = type;
            var that = this;
            $(".maskLayer").show();
            var params = {
                noParty:"true"
            };
            postRequest(cmdUrl + "/cdContact/queryContactInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.contactList = res.result;
            })
        },
        chooseDeviceFun(index,type){
            this.currentDqIndex = index;
            this.popupType = type;
            var that = this;
            $(".maskLayer").show();
            var params = {
                noParty:"true"
            };
            postRequest(cmdUrl + "/cdEqp/queryEqpInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.deviceList = res.result;
            })
        },
        chooseAddressFun(index,type){
            this.currentArIndex = index;
            this.popupType = type;
            var that = this;
            $(".maskLayer").show();
            var params = {
                noParty:"true"
            };
            postRequest(cmdUrl + "/cdLocation/queryLocationInfoList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
                that.addressList = res.result;
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
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:12
            };
            if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
                searchFormArr.partyType = null;
            }
            postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:12
            };
            if(searchFormArr.partyType == '' || searchFormArr.partyType == 'null'){
                searchFormArr.partyType = null;
            }
            //获取订单列表
            postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.totalPagesNum = res.pageInfo.total;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.currentPage = 1;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.publicChangeBtnStatus();
            })
        },
        editOrderInfo(){
            var that = this,locationListArray = [], imgContactListArray = [], eqpListArray = [],locationListDefaultNum = 0,imgContactListDefaultNum = 0,eqpListDefaultNum = 0,eqpListDefaultKong = 0;
            if(that.partyBaseInfo.partyType == "" || that.partyBaseInfo.partyType == undefined){
                imitatePopup("请选择合作方类型",'alert');
                return false;
            }
            if(that.partyBaseInfo.partyName == "" || that.partyBaseInfo.partyName == undefined){
                imitatePopup("请输入合作方名称",'alert');
                return false;
            }
            if(that.partyBaseInfo.partyCode == "" || that.partyBaseInfo.partyCode == undefined){
                imitatePopup("请输入合作方代码",'alert');
                return false;
            }

            var paramsObj = {
                cdParty: that.partyBaseInfo,
                eqpList: eqpListArray,
                imgContactList: imgContactListArray,
                locationList: locationListArray,
            };

            $.each(that.locationContactList, function (index, val) {
                if (val.cdLocationId != undefined) {
                    var item = {};
                    item.cdLocationId = val.cdLocationId;
                    item.isDefault = val.isDefault;
                    locationListArray.push(item);
                }
            });

            $.each(that.partyContactlList, function (index, val) {
                if (val.cdContactId != undefined) {
                    var item = {};
                    item.cdContactId = val.cdContactId;
                    item.isDefault = val.isDefault;
                    imgContactListArray.push(item);
                }
            });

            $.each(that.contactEqplList, function (index, val) {
                if (val.cdEqpId != undefined) {
                    var item = {};
                    item.cdEqpId = val.cdEqpId;
                    item.isDefault = val.isDefault;
                    eqpListArray.push(item);
                }
            });

            paramsObj.eqpList = eqpListArray;
            paramsObj.imgContactList = imgContactListArray;
            paramsObj.locationList = locationListArray;

            if (imgContactListArray.length != 0) {

                if(locationListArray.length != 0){
                    $.each(locationListArray, function (index, val) {
                        if (val.isDefault == 1) {
                            locationListDefaultNum += 1;
                        }
                    });
                }

                if(eqpListArray.length != 0){
                    $.each(eqpListArray, function (index, val) {
                        if (val.isDefault == 1) {
                            eqpListDefaultNum += 1;
                        }else {
                            if (val.isDefault != 0) {
                                eqpListDefaultKong += 1;
                            }
                        }
                    });
                }

                $.each(imgContactListArray, function (index, val) {
                    if (val.isDefault == 1) {
                        imgContactListDefaultNum += 1;
                    }
                });

                if(imgContactListDefaultNum == 1){
                    if(locationListArray.length != 0 && locationListDefaultNum == 1){
                        if(eqpListArray.length != 0 ){
                            if(eqpListDefaultKong > 0){
                                imitatePopup('请手动选择设备信息是否默认后再提交！','alert');
                                return;
                            }
                            if(eqpListDefaultNum == 0){
                                imitatePopup('必须有一条默认设备，请核对后再提交！','alert');
                                return;
                            }else{
                                if(eqpListDefaultNum != 1){
                                    imitatePopup('默认设备只能有一条，请核对后再提交！','alert');
                                    return;
                                }
                            }
                        }

                        //保存服务商
                        postRequest(cmdUrl + "/cdParty/updatePartyInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                                var searchFormArr = that.queryParam;
                                searchFormArr.pageInfo = {
                                    pageNum: that.currentPage,
                                    pageSize:12
                                }
                                postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                    that.tableOrderList = res.result;
                                    that.totalPagesNum = res.pageInfo.total;
                                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                                        that.pageList[i] = i + 1;
                                    }
                                    that.publicChangeBtnStatus();
                                })

                        });

                    }else{
                        imitatePopup('地址信息为必填且包含一条默认地址，请核对后再提交！','alert');
                    }
                }else{
                    if(locationListArray.length != 0){
                        if(locationListDefaultNum == 0){
                            imitatePopup('必须有一条默认地址，请核对后再提交！','alert');
                        }else{
                            if(locationListDefaultNum != 1){
                                imitatePopup('默认地址只能有一条，请核对后再提交！','alert');
                            }
                        }
                    }

                    if(imgContactListDefaultNum == 0){
                        imitatePopup('必须有一条默认联系人，请核对后再提交！','alert');
                    }else{
                        imitatePopup('默认联系人只能有一条，请核对后再提交！','alert');
                    }
                }

            }else{
                imitatePopup('联系人信息为必填！','alert');
            }
        },
        saveNewOrderInfo(){
            var that = this,locationListArray = [], imgContactListArray = [], eqpListArray = [],locationListDefaultNum = 0,imgContactListDefaultNum = 0,eqpListDefaultNum = 0,eqpListDefaultKong = 0;
            if(that.partyBaseInfo.partyType == "" || that.partyBaseInfo.partyType == undefined){
                imitatePopup("请选择合作方类型",'alert');
                return false;
            }
            if(that.partyBaseInfo.partyName == "" || that.partyBaseInfo.partyName == undefined){
                imitatePopup("请输入合作方名称",'alert');
                return false;
            }
            if(that.partyBaseInfo.partyCode == "" || that.partyBaseInfo.partyCode == undefined){
                imitatePopup("请输入合作方代码",'alert');
                return false;
            }

            var paramsObj = {
                cdParty: that.partyBaseInfo,
                eqpList: eqpListArray,
                imgContactList: imgContactListArray,
                locationList: locationListArray,
            };

            $.each(that.locationContactList, function (index, val) {
                if (val.cdLocationId != undefined) {
                    var item = {};
                    item.cdLocationId = val.cdLocationId;
                    item.isDefault = val.isDefault;
                    locationListArray.push(item);
                }
            });

            $.each(that.partyContactlList, function (index, val) {
                if (val.cdContactId != undefined) {
                    var item = {};
                    item.cdContactId = val.cdContactId;
                    item.isDefault = val.isDefault;
                    imgContactListArray.push(item);
                }
            });

            $.each(that.contactEqplList, function (index, val) {
                if (val.cdEqpId != undefined) {
                    var item = {};
                    item.cdEqpId = val.cdEqpId;
                    item.isDefault = val.isDefault;
                    eqpListArray.push(item);
                }
            });

            paramsObj.eqpList = eqpListArray;
            paramsObj.imgContactList = imgContactListArray;
            paramsObj.locationList = locationListArray;

            if (imgContactListArray.length != 0) {

                if(locationListArray.length != 0){
                    $.each(locationListArray, function (index, val) {
                        if (val.isDefault == 1) {
                            locationListDefaultNum += 1;
                        }
                    });
                }

                if(eqpListArray.length != 0){
                    $.each(eqpListArray, function (index, val) {
                        if (val.isDefault == 1) {
                            eqpListDefaultNum += 1;
                        }else {
                            if (val.isDefault != 0) {
                                eqpListDefaultKong += 1;
                            }
                        }
                    });
                }

                $.each(imgContactListArray, function (index, val) {
                    if (val.isDefault == 1) {
                        imgContactListDefaultNum += 1;
                    }
                });

                if(imgContactListDefaultNum == 1){
                    if(locationListArray.length != 0 && locationListDefaultNum == 1){
                        if(eqpListArray.length != 0 ){
                            if(eqpListDefaultKong > 0){
                                imitatePopup('请手动选择设备信息是否默认后再提交！','alert');
                                return;
                            }
                            if(eqpListDefaultNum == 0){
                                imitatePopup('必须有一条默认设备，请核对后再提交！','alert');
                                return;
                            }else{
                                if(eqpListDefaultNum != 1){
                                    imitatePopup('默认设备只能有一条，请核对后再提交！','alert');
                                    return;
                                }
                            }
                        }

                        //保存联系人信息
                        postRequest(cmdUrl + "/cdParty/saveParty.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                                var searchFormArr = {
                                    pageInfo:{
                                        pageNum:1,
                                        pageSize:12
                                    }
                                };
                                that.partyContactlList = [{
                                    contactType:"",
                                    isDefault:""
                                }];
                                that.partyBaseInfo = {
                                    partyType:"",
                                    isBuyer:"",
                                    isVendor:"",
                                    isTruck:"",
                                    isWarehouse:"",
                                    is3pl:""
                                };
                                that.locationContactList = [{
                                    provinceCode:"",
                                    cityCode:"",
                                    districtCode:"",
                                    isDefault:""
                                }];
                                that.locationContact = {
                                    contactType:""
                                };
                                that.contactEqplList = [{
                                    isDefault:"",
                                    eqpType:""
                                }];
                                postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                                    that.tableOrderList = res.result;
                                    that.pageList = [];
                                    that.totalList = [];
                                    that.currentPage = 1;
                                    $(".paging .pagingCon .pagination").animate({
                                        "left": "0px"
                                    },300);
                                    that.totalPagesNum = res.pageInfo.total;
                                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                                        that.pageList[i] = i + 1;
                                    }
                                    that.publicChangeBtnStatus();
                                })
                        });

                    }else{
                        imitatePopup('地址信息为必填且包含一条默认地址，请核对后再提交！','alert');
                    }
                }else{
                    if(locationListArray.length != 0){
                        if(locationListDefaultNum == 0){
                            imitatePopup('必须有一条默认地址，请核对后再提交！','alert');
                        }else{
                            if(locationListDefaultNum != 1){
                                imitatePopup('默认地址只能有一条，请核对后再提交！','alert');
                            }
                        }
                    }

                    if(imgContactListDefaultNum == 0){
                        imitatePopup('必须有一条默认联系人，请核对后再提交！','alert');
                    }else{
                        imitatePopup('默认联系人只能有一条，请核对后再提交！','alert');
                    }
                }

            }else{
                imitatePopup('联系人信息为必填！','alert');
            }
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
        resetOrderList(){
            window.location.reload();
        }
    },
    created:function(){
        var that = this;
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:12
            }
        }
        this.dpDistrictList = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(cmdUrl + "/cdParty/queryPartyInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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