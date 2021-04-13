var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		queryPageSize:20,
		isDisable:true,
		abnormalPage:0,
	    tableOrderList:{},
	    formLeft:{},
	    dpDistrictList:{},
	    packageGoodsInf:{},
	    selectListData:{},
	    queryParam:{},
	    searchInf:[],
	    pageList:[],
	    totalPagesNum:"",
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
		srcFileList:[],
		begin:"",
		magnifyImgSrc:"",
		magnifyImgType:"",
		indexImg:0,
	    uploadImgList:[],
	    orderCodeItem:{},
	    orderReceiptItem:{},
	    orderLogisticsInfo:{},
	    receiptImgList:[],
        receiptFilesList:[],
	    actCurrentInfo:{
            actCode:'',
            createTime:null,
            remark:''
		},
	    actListInfo:{},
	    logininf:{},
	    searchsStartTime:"",
	    orderCarrierList:[{
	    	shipperPartyHave:{},
	    	receiptPartyHave:{},
	    	orderDetailHave:{},
	    	OrderCarrierContactHave:{},
	    	OrderCarrierEqpHave:{},
	    	OrderCarrierHave:{},
	    	OrderCarrierDriverHave:{}
	    }],
	    omOrderList:[],
	    checkedOperaOrder:[],
	    splitCount:"",
	    currentOrderId:"",
	    isShowSplitList:"0",
	    checkedNum:0,
	    orderSplitList:[{
	    	orderItemList:[{}]
	    }],
	    vehicleTypeList:[],
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
		timeHorizon:"", //创建时间范围
		timeHorizon1:""//完成时间范围
	},
	methods:{
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
		addOrderCarrierHint(){
			alert("请先勾选至少一条订单行！");
		},
		addOrderDetails(template){
			this.templateTitle = template;
		},
		exportDeliveryNote(){   //导出送货单
			$(".ajax-load-pupup1").show();
			var that = this;
			var queryParam = that.publicGetQueryParam();
			var searchInfo = "";
			for(key in queryParam){
				searchInfo += "&"+key+"="+queryParam[key]
			}
			window.location.href = tmsUrl + "/export/tjoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
			setTimeout(function(){
				$(".ajax-load-pupup1").hide();
			},1000)
		},
		exportShippingOrder(){   //导出配送订单
			$(".ajax-load-pupup1").show();
			var that = this;
			var queryParam = that.publicGetQueryParam();
			var searchInfo = "";
			for(key in queryParam){
				searchInfo += "&"+key+"="+queryParam[key]
			}
			window.location.href = tmsUrl + "/export/doOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
			setTimeout(function(){
				$(".ajax-load-pupup1").hide();
			},1000)
		},
		exportShiftReport(){	//导出班次报表
			$(".ajax-load-pupup1").show();
			var that = this;
			var queryParam = that.publicGetQueryParam();
			var searchInfo = "";
			for(key in queryParam){
				searchInfo += "&"+key+"="+queryParam[key]
			}
			window.location.href = tmsUrl + "/export/tfoOrder2?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
			setTimeout(function(){
				$(".ajax-load-pupup1").hide();
			},1000)
		},
		publicGetQueryParam(){
			var that = this;
			var searchFormArr = that.queryParam;
			var startTimeVal =that.timeHorizon.split(" - ")[0];
			var endTimeVal =that.timeHorizon.split(" - ")[1];
			var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
			var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.startCreateTime = crcdStartTimeVal;
			searchFormArr.endCreateTime = crcdEndTimeVal;
			return searchFormArr;
		},
		textboxSelectionFun(orderItem){
			var that = this;
			var el = event.target;
			if($(el).prop("checked")){
				that.checkedOperaOrder.push(orderItem);
			}else{
				that.checkedOperaOrder.splice($.inArray(orderItem,that.orderList),1)
			}
			that.checkedNum = that.checkedOperaOrder.length;
		},
		carrierPartyList(params,id){
			var that = this;
			getRequest(cmdUrl + "/cdParty/selectPartyOneModel?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+id+"&isDefault=1&locationType=OTHER",function(res){
				that.OrderCarrierDriver = res.result.imgContactList[0];
				that.OrderCarrierContact = res.result.imgContactList[0];
				that.OrderCarrierParty = res.result.cdParty;
			})
		},
		chooseVehicleType(id){
			var that = this;
			for(var i = 0 ; i < that.vehicleTypeList.length;i++){
				if(that.vehicleTypeList[i].cdEqpId == id){
					that.OrderCarrierEqp = that.vehicleTypeList[i]
				}
			}
		},
		addCarrierFun(){
			var that = this;
			var params = {
				drvContactInfo:{
					contact:that.OrderCarrierContact,
					eqp:that.OrderCarrierEqp
				},
				imgContactInfo:{
					contact:that.OrderCarrierContact,
					eqp:that.OrderCarrierEqp
				},
				orderList: that.omOrderList,
				party:that.OrderCarrierParty
			}
			postRequest(omsUrl + "/save/OrderPartyInfo?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){

			})

		},
		getOrderDetails(template,order,isAbnormalPage){
			this.abnormalPage = isAbnormalPage;
			this.templateTitle = template;
			this.currentOrderId = order.omOrderId;
			this.isShowSplitList = "0";
			var that = this;
			getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
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
                    that.OrderCarrierDriver = {};
                    that.OrderCarrierEqp = {};
                    that.OrderCarrierLocation = {};
                }
                // 时间属性
				if(data.result.dtmList != null){
                    that.dtmListInfoList = data.result.dtmList;
				}else{
                    that.dtmListInfoList = [];
				}
		    })
		},
		changeOrderDetails(template){
			this.templateTitle = template;
		},
		uploadReceipt(orderno){
			//回单上传
			var that = this;
			var imgListArr = [];
		//	console.log(orderno);
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
				console.log(res.result);
				alert("回单上传成功");
				that.receiptImgList.push(ImgWebsite + res.result.imgList[0]);
				that.uploadImgList = [];
		  	})
		},
		getOrderCode(codeVal){//获取二维码 条形码
            $("#qrcode").html("");
        //    this.orderCodeItem = codeVal;
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
		getOrderReceipt(receiptVal){   // 点击“订单附件”按钮
			var that = this;
			that.orderReceiptItem = receiptVal;
            that.getOrderCode(receiptVal);
            that.getReceiptImgList(receiptVal.omOrderId);
            that.getReceiptFilesList(receiptVal.omOrderId);
		},
        getReceiptImgList(omOrderId){ // 获取图片列表
            var that = this;
            that.receiptImgList = [];
			that.srcImgList = [];
            getRequest(omsUrl + "/select/orderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+omOrderId,function(res){
                for(var i = 0 ; i < res.result.length; i++){
                    that.receiptImgList.push(ImgWebsite + res.result[i].extValue);
                }
            })
        },
        getReceiptFilesList(omOrderId){ // 获取订单附件列表
            var that = this;
            that.receiptFilesList = [];
			that.srcFileList = [];
            getRequest(omsUrl + "/select/orderAnnexObjFiles.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+omOrderId,function(res){
                var newArray = [];
                for(var i = 0 ; i < res.result.length; i++){
                    var string0 = res.result[i].extValue.split('/'),extValue = '';
                    for(var s = 0 ; s < string0.length; s++){
                        if(isContains(string0[s], '.')){
                            extValue = string0[s];
                        }
                    }
                    var param = {
						src:ImgWebsite + res.result[i].extValue,
                        extValue:extValue
                    };
                    if(isContains(res.result[i].extValue, 'rar')){
                        param.picType = 'rar';
                    }else{
                        if(isContains(res.result[i].extValue, 'zip')){
                            param.picType = 'zip';
                        }
                    }
                    newArray.push(param);
                }
                that.receiptFilesList = newArray;
            })
        },
		downloadFile(){  // 下载订单文件
			var that = this;
			clearInterval(that.begin);
			if(that.receiptFilesList != null && that.receiptFilesList != []){
				for(var j=0;j<that.receiptFilesList.length;j++){
					if(that.receiptFilesList[j] != null){
						that.srcFileList.push(that.receiptFilesList[j].src);
					}
				}
			}
			that.downloadFileExecute();
		},
		downloadFileExecute(){
			var that = this;
			clearInterval(that.begin);
			if(that.srcFileList.length>0){
				window.location.href = that.srcFileList[0]
				$(".downloadFile").attr("download",that.srcFileList.length)
				that.srcFileList.splice(0,1);
				that.begin = setInterval(function(){
					that.downloadFileExecute();
				},300)
			}
		},
		downloadFileItem(index){  // 单个下载订单文件
			var that = this;
			if(that.receiptFilesList != null && that.receiptFilesList != []){
				for(var j=0;j<that.receiptFilesList.length;j++){
					if(that.receiptFilesList[j] != null){
						that.srcFileList.push(that.receiptFilesList[j].src);
					}
				}
				window.location.href = that.srcFileList[index];
			}
		},
		// 删除回单
		delReceiptImgItemFun(omExtId,index){
			var that = this;
			var r = confirm("确定删除该回单？");
			if (r==true){
				getRequest(omsUrl + "/delete/orderExtById.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&extId="+omExtId,function(res){
					that.receiptImgList.splice(index, 1);
				})
			}
		},
		// 放大回单图,商品图片
		magnifyReceiptImage(index,type){
			var that = this;
			$(".maskLayer2").show();
			that.indexImg = index;
			that.magnifyImgType = type;
			switch(type)
			{
				case 'RecImg':
					that.magnifyImgSrc = that.receiptImgList[that.indexImg].src;
					break;
				case 'comImg':
					that.magnifyImgSrc = that.orderItemImgList[that.indexImg];
					break;
			}
			$(".magnifyImg").fadeIn(550);
		},
		// 关闭放大回单图,商品图片窗口
		closeMagnifyReceiptImage(){
			var that = this;
			$(".maskLayer2").hide();
			that.magnifyImgSrc = "";
			$(".magnifyImg").css("display","none");
		},
		// 向左移动图片
		moveLeftReceiptImage(){
			var that = this;
			if(that.indexImg > 0){
				$(".magnifyImg").css("display","none");
				that.indexImg = that.indexImg-1;
				if(that.magnifyImgType == 'RecImg'){
					that.magnifyReceiptImage(that.indexImg,'RecImg');
				}else if(that.magnifyImgType == 'comImg'){
					that.magnifyReceiptImage(that.indexImg,'comImg');
				}
			}else{
				return false;
			}
		},
		// 向右移动图片
		moveRightReceiptImage(){
			var that = this;
			if(that.magnifyImgType == 'RecImg'){
				if(that.indexImg < that.receiptImgList.length-1){
					$(".magnifyImg").css("display","none");
					that.indexImg = that.indexImg+1;
					that.magnifyReceiptImage(that.indexImg,'RecImg');
				}else{
					return false;
				}
			}else if(that.magnifyImgType == 'comImg'){
				if(that.indexImg < that.orderItemImgList.length-1){
					$(".magnifyImg").css("display","none");
					that.indexImg = that.indexImg+1;
					that.magnifyReceiptImage(that.indexImg,'comImg');
				}else{
					return false;
				}
			}
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
                if(data.result.actList != null){
					for(var i = 0; i < data.result.actList.length;i++){
						if(data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == ""){

						}else{
							waypointsArr.push([data.result.actList[i].latLng.split(",")[0],data.result.actList[i].latLng.split(",")[1]]);
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

					if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.latLng != null && res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.latLng != null){
						mapFunction(res.result.receiptPartyInfo,res.result.shipperPartyInfo,waypointsArr);
					}else{
						mapFunction();
					}
			    })
		    })
		},
		uploadImgFun(){
			//选择图片 并将图片转为base64位编码格式
			var file = $("#uploadImg").prop("files")[0];  //获取文件
			var that = this;
	        if (file) {
	            var reader = new FileReader();  //创建读取文件的对象
	            reader.onload = function(evt) {
	            	that.uploadImgList.push(evt.target.result);
	            };
	            reader.readAsDataURL(file);
	        } else {
	            alert('上传失败，请重新上传！');
	        }
		},
		createOrderSplit(){
			var that = this;
			that.isShowSplitList = "1";
			var params = {
				masterOrderId:that.currentOrderId,
				splitCount:that.splitCount
			}
			postRequest(tmsUrl + "/split/houseOrderList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
				that.orderSplitList = res.result;
		  	})

		},
		orderSplitFun(){
			var that = this;
			var params = {
				masterOrderId:that.currentOrderId,
				houseOrderList:that.orderSplitList
			}
			postRequest(tmsUrl + "/split/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){

					that.isShowSplitList = "0";

		  	})
		},
		addOrderCarrierFun(){
			var that = this;
			that.orderList = [];
			$('.checkInp:checkbox').each(function() {
		        if ($(this).prop('checked') == true) {
		        	that.orderList.push({
		        		omOrderId:$(this).val()
		        	})
		        }
		    });
		    if(that.orderList.length == 0){
		    	alert("请勾选对应数据行");
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
                    parms1.shipperPartyHave = data.result.shipperPartyInfo.party;  // 发货商
                    parms1.receiptPartyHave = data.result.receiptPartyInfo.party;  // 收货商
                    parms1.orderDetailHave = data.result.order;  // 订单详情
                    if(data.result.carrierPartyInfo != null){
                    	parms1.OrderCarrierHave = data.result.carrierPartyInfo.party;  // 承运商
                    	if (data.result.carrierPartyInfo.imgContactInfo != null) {
                    		if(data.result.carrierPartyInfo.imgContactInfo.contact != null || data.result.carrierPartyInfo.imgContactInfo.contact != undefined){
                    			parms1.OrderCarrierContactHave = data.result.carrierPartyInfo.imgContactInfo.contact;  // 承运商联系人
                    		}else{
                    			parms1.OrderCarrierContactHave = {};
                    		}

	                    }else {
	                        parms1.OrderCarrierContactHave = {};
	                    }
	                    if (data.result.carrierPartyInfo.drvContactInfo != null) {
	                    	that.existCarrier = true;
	                        parms1.OrderCarrierDriverHave = data.result.carrierPartyInfo.drvContactInfo.contact;  // 司机
	                        parms1.OrderCarrierEqpHave = data.result.carrierPartyInfo.drvContactInfo.eqp;  // 设备
	                    } else {
	                    	that.existCarrier = false;
	                        parms1.OrderCarrierDriverHave = {};
	                        parms1.OrderCarrierEqpHave = {};
	                    }
                    }else{
                    	parms1.OrderCarrierHave = {}
                    	parms1.OrderCarrierContactHave = {};
                    	parms1.OrderCarrierDriverHave = {};
	                    parms1.OrderCarrierEqpHave = {};
                    }

                    that.orderCarrierList.push(parms1);
			  	})
		    }
		    postRequest(cmdUrl + "/cdEqp/selectEqp.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,{},function(res){
				that.vehicleTypeList = res.result;
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
			var searchFormArr = that.queryParam;
			var startTimeVal =that.timeHorizon.split(" - ")[0];
			var endTimeVal =that.timeHorizon.split(" - ")[1];
			var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
			var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.startCreateTime = crcdStartTimeVal;
			searchFormArr.endCreateTime = crcdEndTimeVal;
			searchFormArr.pageInfo ={
				pageNum:pageNum,
				pageSize:that.queryPageSize
			}
			$(".reportMessages table tr td .checkInp").attr("checked",false);
		 	that.checkedOperaOrder = [];
		 	that.checkedNum = 0;
			//获取订单列表
		  	postRequest(tmsUrl + "/query/orderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                completeStatus:"",
                exceptionStatus:"",
                actCode:"",
            }
        },
		getSearchVal(){
			//订单搜索
			var that = this;
			var searchFormArr = this.queryParam;
			var startTimeVal =that.timeHorizon.split(" - ")[0];
			var endTimeVal =that.timeHorizon.split(" - ")[1];
			var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
			var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
			if(crcdStartTimeVal == "" && crcdEndTimeVal == "" && startTimeVal == "" && endTimeVal == ""){
                crcdStartTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.startCreateTime = crcdStartTimeVal;
			searchFormArr.endCreateTime = crcdEndTimeVal;
			searchFormArr.pageInfo = {
				pageNum:1,
				pageSize:that.queryPageSize
			}
			//获取订单列表
		  	postRequest(tmsUrl + "/query/orderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.searchsStartTime = crcdStartTimeVal;
				that.tableOrderList = res.result;
				that.currentPage = 1;
				$(".paging .pagingCon .pagination").animate({
					"left": "0px"
				},300);
				that.pageList = [];
				that.totalPagesNum = res.pageInfo.total;
				for(var i = 0 ; i < res.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
                $(".collUnfold").hide();
		  	})
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
	},
	created:function(){
		this.timeHorizon1 = getQueryTime(1)+" - "+ getTodayTime(-30);
	  	var searchFormArr = {
	  		startCreateTime: getQueryTime(1),
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
	  	initSelectData(that);
	  	this.selectListData = getBasicData();    //获取下拉数据
		that.searchsStartTime = getQueryTime(1);
	  	//获取订单列表
	  	postRequest(tmsUrl + "/query/orderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
			that.tableOrderList = res.result;
			that.totalPagesNum = res.pageInfo.total
			for(var i = 0 ; i < res.pageInfo.pages;i++){
				that.pageList[i] = i + 1;
			}
			that.publicChangeBtnStatus();
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
	if(sfrAddress == null || stoAddress == null){
		alert("收发货地址不全，暂时无法显示轨迹信息");
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
    	completeStatus:"",
    	exceptionStatus:"",
    	actCode:"",
   }
}
// 日期控件
$(document).ready(function() {
	$('#timeRange').daterangepicker(null, function(start, end, label) {
		app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
	});
	$('#timeRange1').daterangepicker(null, function(start, end, label) {
		app.timeHorizon1  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
	});
});
