var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
        queryPageSize: 20,
		isDisable:true,
		abnormalOrderText:"",
		isHaveAbnormal:false,
	    tableOrderList:{},
	    formLeft:{},
        clearShow2:true,  // 上传图片（回单）
	    packageGoodsInf:{},
	    selectListData:{},
	    currentOrder:{},
	    queryParam:{},
	    searchInf:[],
	    pageList:[],
	    totalPagesNum:"",
	    orderDetail:{},
	    shipperParty:{
            partyName:"",
            partyCode:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
		},
	    shipperPartyContact:{
            contactName:"",
            contactTel:"",
            contactEmail:""
		},
	    shipperPartyLocation:{
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
		},
	    shipperPartyLocationContact:{
            contactName:"",
            contactTel:""
		},
	    shipperPartyLocationContactList:{},
	    shipperPartyContactList:{},
	    shipperPartyLocationList:{},
	    receiptParty:{
            partyName:"",
            partyCode:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
		},
	    receiptPartyContact:{
            contactName:"",
            contactTel:"",
            contactEmail:""
		},
	    receiptPartyLocation:{
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
		},
	    receiptPartyLocationContact:{
            contactName:"",
            contactTel:""
		},
	    OrderCarrier:{
            partyName:"",
            partyCode:"",
            partyType:"",
            isBuyer:null,
            isVendor:null,
            isTruck:null,
            isWarehouse:null,
            is3pl:null
		},
	    OrderCarrierContact:{},
	    OrderCarrierDriver:{
            contactName:"",
            contactTel:""
		},
        OrderCarrierEqp:{
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
        },
	    orderItemDetail:{orderItem:{}},
	    uploadImgList:[],
	    orderCodeItem:{},
	    orderReceiptItem:{},
	    orderLogisticsInfo:{},
	    receiptImgList:[],
	    startCreatDate: getQueryTime(1),
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
        isShippingOrder:false,
        getAllCountryList:{}, // 国家列表
        orderPartyList:[], // 订单 发单方，接单方 下拉列表
        orderTypeList2:[], // 订单 订单类型 下拉列表
        timeHorizon:"" //创建时间范围
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
	methods:{
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
        getOrderPartyList(){
            var that = this;
            var searchFormArr = {
                refType: 'TENANTLNK'
            };
            postRequest(cmdUrl + "/get/partyLnkVoListByPartyLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.orderPartyList = res.result;
            })
        },
		addPackageGoods(){ // 添加包裹商品
            var that = this;
            that.packageGoodsList.push({
                orderItem:{
                    itemName:"",
                    itemCode:"",
                    lotNo:"",
                    unitPrice:"",
                    currency:"",
                    qty:"",
                    qtyUnit:"",
                    weight:"",
                    weightUnit:"",
                    volume:"",
                    volumeUnit:"",
                    amount:""
                }
            });
		},
		getOrderDetails(template,order){
			this.templateTitle = template;
			this.currentOrder = order;
			var that = this;
			that.abnormalOrderText = "";
			getRequest(omsUrl + "/query/OrderInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
                if(data.result.order.orderType == "DO"){
                    that.isShippingOrder = true;
                }else{
                    that.isShippingOrder = false;
                }

                // 订单详情
                if(data.result.order != null){
                    that.orderDetail = data.result.order;
                    that.orderDetail.completeTime = timestampToTime(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime(null);
                    that.orderDetail.expireTime = timestampToTime(null);
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

                if(data.result.exceRemarkList == null || data.result.exceRemarkList.length == 0){
                	that.isHaveAbnormal = false;
                }else{
                	that.isHaveAbnormal = true;
                	that.abnormalOrderText = data.result.exceRemarkList[0].note;
                }
		    })
		},
		submitException(){
			if(this.abnormalOrderText.trim() == ""){
				imitatePopup("请先填写异常处理意见再保存",'alert');
				return false;
			}
			var params = [];
			params.push({
				exceptionRemark:this.abnormalOrderText,
				exceptionStatus: "3",
				orderId:this.currentOrder.omOrderId
			})
			var that = this;
			postRequest(tmsUrl + "/orderProcessing.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
				var searchFormArr = that.queryParam;
                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
				searchFormArr.startCreateTime = startTimeVal;
				searchFormArr.endCreateTime = endTimeVal;
				searchFormArr.pageInfo ={
					pageNum: that.currentPage,
					pageSize:that.queryPageSize
				};
                searchFormArr.exceptionStatus = 1;
				//获取订单列表
			  	postRequest(omsUrl + "/query/selectHaulOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
					that.startCreatDate = startTimeVal;
					that.tableOrderList = res.result;
					that.pageInfo = res.pageInfo;
					for(var i = 0 ; i < res.pageInfo.pages;i++){
						that.pageList[i] = i + 1;
					}
					that.publicChangeBtnStatus();
				})
		    })

		},
		/*uploadReceipt(orderno){ // 回单上传
			var that = this;
			var imgListArr = [];
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
				imitatePopup("回单上传成功",'alert');
				for(var i = 0;i < res.result.imgList.length;i++){
					that.receiptImgList.push(ImgWebsite + res.result.imgList[i]);
				}
				that.uploadImgList = [];
		  	})
		},*/
		getOrderCode(codeVal){ // 获取二维码 条形码
			$("#qrcode").html("");
			this.orderCodeItem = codeVal;
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
		getOrderReceipt(receiptVal){ // 回单列表
			var that = this;
            that.getOrderCode(receiptVal);
			that.receiptImgList = [];
            that.orderReceiptItem = receiptVal;
			var orderid = {
				refId:receiptVal.omOrderId
			}
            getRequest(omsUrl + "/select/orderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+receiptVal.omOrderId,function(res){
				for(var i = 0 ; i < res.result.length; i++){
					that.receiptImgList.push(ImgWebsite + res.result[i].extValue);
				}
		    })
		},
		getLogisticsInfo(orderInfo){ // 物流信息
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
		    	for(var i = 0; i < data.result.actList.length;i++){
		    		if(data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == ""){

		    		}else{
		    			waypointsArr.push([data.result.actList[i].latLng.split(",")[0],data.result.actList[i].latLng.split(",")[1]]);
		    		}
		    	}
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
        // 上传图片 —— 回单
        clickUploadOrderImg(){
            $('#imgfiles').click();
        },
        uploadOrderImgFun(){
            var that = this;
            that.clearShow2 = false;
            console.log(99)
            uploadImgUploadRequest(omsUrl + '/upload/orderUploadReceiptImg.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+'&orderId='+that.orderReceiptItem.omOrderId,function(res){
                if(res != null){
                    if(res.result != null){
                        if(res.result.extList != null){
                            that.receiptImgList = [];
                            for(var i = 0 ; i < res.result.extList.length; i++){
                                that.receiptImgList.push(ImgWebsite + res.result.extList[i].extValue);
                            }
                        }
                    }
                }
                that.uploadOrderImgSuc();
            });
		},
        uploadOrderImgSuc(){
            var that = this;
            that.clearShow2 = true;
            $(".ajax-load-pupup").remove();
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
            var startTimeVal =this.timeHorizon.split(" - ")[0];
            var endTimeVal =this.timeHorizon.split(" - ")[1];
			searchFormArr.startCreateTime = startTimeVal;
			searchFormArr.endCreateTime = endTimeVal;
			searchFormArr.pageInfo ={
				pageNum:pageNum,
				pageSize:this.queryPageSize
			};
            searchFormArr.exceptionStatus = 1;
			var that = this;
			//获取订单列表
		  	postRequest(omsUrl + "/query/selectHaulOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.tableOrderList = res.result;
				that.pageInfo = res.pageInfo;
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
                orderFrom:"",
                orderTo:"",
                completeStatus:"",
                sendStatus:"",
                expireStatus:"",
                exceptionStatus:"1",
                activeStatus:"",
                payStatus:"",
                auditStatus:"",
                actCode:"",
                orderType:""
            }
        },
		getSearchVal(){
			//订单搜索
			var that = this;
			var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
			if(startTimeVal == getQueryTime(1)){
				searchFormArr.startCreateTime = getQueryTime(1);
			}else{
				searchFormArr.startCreateTime = startTimeVal;
			}
			if(endTimeVal == "创建时间--结束时间"){

			}else{
				searchFormArr.endCreateTime = endTimeVal;
			}
			searchFormArr.pageInfo = {
				pageNum:1,
				pageSize:that.queryPageSize
			};
			//获取订单列表
		  	postRequest(omsUrl + "/query/selectHaulOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.startCreatDate = startTimeVal;
				that.tableOrderList = res.result;
				that.pageInfo = res.pageInfo;
				$(".paging .pagingCon .pagination").animate({
					"left": "0px"
				},300);
				that.currentPage = 1;
				that.pageList = [];
				that.totalPagesNum = res.pageInfo.total;
				for(var i = 0 ; i < res.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
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
		resetOrderList(){
			window.location.reload();
        }
	},
	created(){
        var that = this;
        that.getAllCountryList = getCountryData();
          that.logininf = JSON.parse(localStorage.getItem("logininf"));
          initSelectData(that);
          this.selectListData = getBasicData();    //获取下拉数据
        console.log(this.selectListData.exceptionStatusList);
          for(var i = 0; i < this.selectListData.exceptionStatusList.length; i++){
              this.selectListData.exceptionStatusList[i].code = parseInt(this.selectListData.exceptionStatusList[i].code);
          }
          console.log(this.selectListData.exceptionStatusList);
        that.timeHorizon = getQueryTime(1)+" - "+ getTodayTime();
        var orderTypeList2 = []; // 根据基础数据筛选订单类型，只要 运输单，发货单
        $.each(that.selectListData.orderTypeList, function (indexs, val) {
            if (isContains(val.text, '运输单') || isContains(val.text, '发货单')) {
                orderTypeList2.push(val);
            }
        });
        that.orderTypeList2 = orderTypeList2;

        that.queryParam.exceptionStatus = '1';

        that.getOrderPartyList();
        var searchFormArr = {
            exceptionStatus: 1,
            startCreateTime: that.timeHorizon.split(" - ")[0],
            endCreateTime: that.timeHorizon.split(" - ")[1],
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
          //获取订单列表
          postRequest(omsUrl + "/query/selectHaulOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
})

function mapFunction(sfrAddress,stoAddress,wayPoint){
	if(sfrAddress == null || stoAddress == null || sfrAddress.location.latLng == null || stoAddress.location.latLng == null){
		imitatePopup("收发货地址不全，暂时无法显示轨迹信息",'alert');
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
    that.orderDetail = { // 订单基本信息
        orderFrom:"",
        orderTo:"",
        customerRefNo:"",
        orderType:"",
        completeTime:"",
        expireTime:"",
        totalQty:"",
        qtyUnit:"",
        totalWeight:"",
        weightUnit:"",
        totalVolume:"",
        volumeUnit:"",
        totalAmount:"",
        currency:"",
        remark:""
    };

    that.shipperParty = { // 发货商
        partyName:"",
        partyCode:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };
    that.shipperPartyContact = { // 发货商 联系人
        contactName:"",
        contactTel:"",
        contactEmail:""
    };
    that.shipperPartyLocation = { // 发货地
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
    that.shipperPartyLocationContact = { // 发货地 联系人
        contactName:"",
        contactTel:""
    };

    that.receiptParty = { // 收货商
        partyName:"",
        partyCode:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };
    that.receiptPartyContact = { // 收货商 联系人
        contactName:"",
        contactTel:"",
        contactEmail:""
    };
    that.receiptPartyLocation = { // 收货地
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
    that.receiptPartyLocationContact = {  // 收货地 联系人
        contactName:"",
        contactTel:""
    };

    that.OrderCarrier = { // 承运商
        partyName:"",
        partyCode:"",
        partyType:"",
        isBuyer:null,
        isVendor:null,
        isTruck:null,
        isWarehouse:null,
        is3pl:null
    };

    that.OrderCarrierDriver = { // 承运商 司机
        contactName:"",
        contactTel:""
    };

    that.OrderCarrierEqp = { // 承运商 车
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

    that.orderItemDetail = { // 单个包裹信息
        orderItem:{
            itemName:"",
            itemCode:"",
            lotNo:"",
            unitPrice:"",
            currency:"",
            qty:"",
            qtyUnit:"",
            weight:"",
            weightUnit:"",
            volume:"",
            volumeUnit:"",
            amount:""
        }
    };

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
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});

