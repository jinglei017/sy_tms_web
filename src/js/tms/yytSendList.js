var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		isDisable:true,
		clearShow:true,
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
	    uploadImgList:[],
	    orderCodeItem:{},
	    orderReceiptItem:{},
	    orderLogisticsInfo:{},
	    receiptImgList:[],
	    actCurrentInfo:{
            actCode:'',
            createTime:null,
            remark:''
		},
	    actListInfo:{},
	    logininf:{},
	    searchsStartTime:"",
	    askForTime: getQueryTime(0),
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
	    queryPageSize: 150,
	    multipleNum: 150,
	    splitType: 'master',
	    packageGoodsDetails:"",
	    printType:[],
	    printTypeValue:"Wework",
	    showPrintPopop: false,
	    currentRelatedArr:[],
	    packageGoodsList:[{
	    	orderItem:{
	    		itemName:"",
	    		currency:"",
	    		qtyUnit:"",
	    		volumeUnit:""
	    	}
	    }]
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
			imitatePopup("请先勾选至少一条订单行！",'alert');
		},
		addOrderDetails(template){
			this.templateTitle = template;
		},
		chooseTheFile(){
			this.filesUpload();
			this.clearShow = false;
		},
		filesUpload(){
			var that = this;
            $.ajaxFileUpload({
                url: tmsUrl + '/orderInfo/uploadExcelFile.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                    imitatePopup(data.result.resultMsg,"alert");
                    that.clearShow = true;
                    setTimeout(function(){
                		$(".fileUploadLi .inputBox").css({"display":"inline-block"});
                	},100)
                    that.queryParam = {
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
				    	assignStatus:"",
				    	orderType:""
				    }
                    var searchFormArr = {
				  		startCompleteTime: getQueryTime(0),
						pageInfo:{
							pageNum:1,
							pageSize:that.queryPageSize
						}
					}
				  	//获取订单列表
				  	postRequest(tmsUrl + "/query/selectTaskEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
						that.tableOrderList = res.result;
						that.totalPagesNum = res.pageInfo.total;
						that.pageList = [];
						that.currentPage = 1;
						$(".paging .pagingCon .pagination").animate({
							"left": "0px"
						},300);
						for(var i = 0 ; i < res.pageInfo.pages;i++){
							that.pageList[i] = i + 1;
						}
						that.publicChangeBtnStatus();
					})
                }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
                    imitatePopup(上传文件失败,"alert");
                	that.clearShow = true;
                	setTimeout(function(){
                		$(".fileUploadLi .inputBox").css({"display":"inline-block"});
                	},100)
                 //   console.error(e);
                }
            });
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
		choosePrintType(){
			if(this.currentRelatedArr.length == 0){
				imitatePopup("请至少勾选一条数据行",'alert');
			}else{
				this.showPrintPopop = true;
			}
		},
		printDeliveryOrder(){
			var that = this;
//			console.log(that.printTypeValue);
//			console.log(that.currentRelatedArr)
//			console.log(tmsUrl + "/print/deliveryEAOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderIdList="+that.currentRelatedArr+"&printType="+that.printTypeValue);
			window.location.href = tmsUrl + "/print/deliveryEAOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderIdList="+that.currentRelatedArr+"&printType="+that.printTypeValue;
//			$(".reportMessages table tr .checkInp").attr("checked",false);
//			that.currentRelatedArr = [];
			this.showPrintPopop = false;
		},
		closeMaskLayer(){
			this.showPrintPopop = false;
		},
		publicGetQueryParam(){
			var that = this;
			var searchFormArr = this.queryParam;
			var startTimeVal = $(".startTimeSpan").val().trim();
			var endTimeVal = $(".endTimeSpan").val().trim();
			var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
			var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.startCompleteTime = crcdStartTimeVal;
			searchFormArr.endCompleteTime = crcdEndTimeVal;
			that.askForTime = startTimeVal;
			return searchFormArr;
		},
		textboxAllSelectionFun(event){
			var that = this;
			$(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
			if($(".reportMessages thead input").prop("checked")){
				for(var i = 0; i < that.tableOrderList.length; i++){
					that.currentRelatedArr.push(that.tableOrderList[i].omOrderId);
				}
			}else{
				for(var i = 0; i < that.tableOrderList.length; i++){
					that.currentRelatedArr = that.currentRelatedArr.filter(function (ele){return ele != that.tableOrderList[i].omOrderId;});
				}
			}
		},
		textboxSelectionFun(event,orderItem){
			var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.currentRelatedArr.push(orderItem.omOrderId);
            }else{
                that.currentRelatedArr.splice($.inArray(orderItem.omOrderId,that.currentRelatedArr),1);
            }
            if(that.currentRelatedArr.length == that.tableOrderList.length){  // 单选个数 = 该页条数，全选选中
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
		},
		getAskForTime(){
			$("#startTime").show();
			var that = this;
			var mySchedule = new Schedule({
				el: '#startTime',
				clickCb: function (y,m,d) {
					$(".startTimeSpan").val(formartDate(y,m,d));
					that.askForTime = formartDate(y,m,d);
					$("#startTime").hide();
				}
			});
		},
		getAskForTimeVal(){
			var startTimeSpan = $("#startTimeSpan").val();
			if(startTimeSpan == ""){
				this.askForTime = "";
			}
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
				if(data.result.order.orderType == "DO"){
					that.isShippingOrder = true;
				}else{
					that.isShippingOrder = false;
				}
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
                    that.orderDetail.completeTime = timestampToTime(that.orderDetail.completeTime);
                    that.orderDetail.expireTime = timestampToTime(that.orderDetail.expireTime);
                }else{
                    that.orderDetail = {};
                    that.orderDetail.completeTime = timestampToTime(null);
                    that.orderDetail.expireTime = timestampToTime(null);
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
				imitatePopup("回单上传成功",'alert');
				that.receiptImgList.push(ImgWebsite + res.result.imgList[0]);
				that.uploadImgList = [];
		  	})
		},
		getOrderCode(codeVal){
			//获取二维码 条形码
		//	console.log(codeVal);
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
		getOrderReceipt(receiptVal){
			//回单列表
			var that = this;
			that.receiptImgList = [];
			that.orderReceiptItem = receiptVal
			var orderid = {
				refId:receiptVal.omOrderId
			}
			getRequest(omsUrl + "/select/orderReceiptImgBase64.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+receiptVal.omOrderId,function(res){
				for(var i = 0 ; i < res.result.length; i++){
					that.receiptImgList.push(ImgWebsite + res.result[i].extValue);
				}
		  	})

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
		    	for(var i = 0; i < data.result.actList.length;i++){
		    		if(data.result.actList[i].latLng == null || data.result.actList[i].latLng == "null" || data.result.actList[i].latLng == ""){

		    		}else{
		    			waypointsArr.push([data.result.actList[i].latLng.split(",")[0],data.result.actList[i].latLng.split(",")[1]]);
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

					if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null && res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.address != null){
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
	            imitatePopup('上传失败，请重新上传！','alert');
	        }
		},
		createOrderSplit(){
			var that = this;
			var splitCountNum = parseInt(that.splitCount);
			var splitType = that.splitType;
			var splitTypeTxt = "";
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 ) {
				if(splitType == 'master'){
					that.showDetailList = false;
					that.showTotalSingleList = true;
				}else{
					that.showTotalSingleList = false;
					that.showDetailList = true;

				}
				var params = {
					masterOrderId:that.currentOrderId,
					splitCount:that.splitCount,
					splitType: that.splitType
				}
				postRequest(tmsUrl + "/split/houseOrderList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
					that.isShowSplitList = "1";
					that.orderSplitList = res.result;
			    })
			}else{
				imitatePopup("请输入大于1的正整数",'alert');
		        that.isShowSplitList = "0";
		        return false;
			}
		},
		orderSplitFun(){
			var that = this;
			var params = {
				masterOrderId:that.currentOrderId,
				houseOrderList:that.orderSplitList,
				splitType:that.splitType
			}
			postRequest(tmsUrl + "/split/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
				if(res.msg == 'success' || res.msg == 'SUCCESS'){
					if(res.msg.success == false){
						imitatePopup(res.msg.message,'alert');
						return false;
					}
				};
				that.getSearchVal(1);
                closeSideslip();

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
		    	imitatePopup("请勾选对应数据行",'alert');
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
			var searchFormArr = this.queryParam;
			var startTimeVal = $(".startTimeSpan").val().trim();
			var endTimeVal = $(".endTimeSpan").val().trim();
			var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
			var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();
			searchFormArr.startCreateTime = startTimeVal;
			searchFormArr.endCreateTime = endTimeVal;
			searchFormArr.startCompleteTime = crcdStartTimeVal;
			searchFormArr.endCompleteTime = crcdEndTimeVal;
			var that = this;
			searchFormArr.pageInfo ={
				pageNum:pageNum,
				pageSize:that.queryPageSize
			}
			$(".reportMessages table tr .checkInp").attr("checked",false);
			that.checkedOperaOrder = [];
			that.checkedNum = 0;
			that.currentRelatedArr = [];
			//获取订单列表
		  	postRequest(tmsUrl + "/query/selectTaskEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.askForTime = startTimeVal;
				that.tableOrderList = res.result;
				that.pageList = [];
				for(var i = 0 ; i < res.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
		  	})
		},
		getSearchVal(showPageNum){
			//订单搜索
			var that = this;
			var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 ) {
				that.multipleNum = that.queryPageSize;
				var searchFormArr = this.queryParam;
				var startTimeVal = $(".startTimeSpan").val().trim();
				var endTimeVal = $(".endTimeSpan").val().trim();
				var crcdStartTimeVal = $(".crcdStartTimeSpan").val().trim();
				var crcdEndTimeVal = $(".crcdEndTimeSpan").val().trim();
                if(startTimeVal == "" && startTimeVal == ""){
                    $(".startTimeSpan").val(getQueryTime(0));
                    startTimeVal = getQueryTime(0);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
				searchFormArr.startCreateTime = startTimeVal;
				searchFormArr.endCreateTime = endTimeVal;
				searchFormArr.startCompleteTime = crcdStartTimeVal;
				searchFormArr.endCompleteTime = crcdEndTimeVal;

				if(showPageNum == 1){
                	searchFormArr.pageInfo = {
	                    pageNum:that.currentPage,
	                    pageSize:that.queryPageSize
	                }
                }else{
                	searchFormArr.pageInfo = {
	                    pageNum:1,
	                    pageSize:that.queryPageSize
	                }
                }
                $(".reportMessages table tr .checkInp").attr("checked",false);
				that.checkedOperaOrder = [];
				that.currentRelatedArr = [];
				that.checkedNum = 0;
				//获取订单列表
			  	postRequest(tmsUrl + "/query/selectTaskEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
					that.tableOrderList = res.result;
					that.askForTime = startTimeVal;
					if(showPageNum == 1){

	                }else{
	                	that.currentPage = 1;
	                }
					$(".paging .pagingCon .pagination").animate({
						"left": "0px"
					},300);
					that.pageList = [];
					that.totalPagesNum = res.pageInfo.total;
					for(var i = 0 ; i < res.pageInfo.pages;i++){
						that.pageList[i] = i + 1;
					}
					that.publicChangeBtnStatus();
			  	})
			}else{
				imitatePopup("请输入大于1的正整数",'alert');
		        return false;
			}
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
            startCompleteTime: getQueryTime(0),
			pageInfo:{
				pageNum:1,
				pageSize:that.queryPageSize
			}
		}
	  	this.printType = [{
	  		name: "Wework",
	  		value: "Wework模板"
	  	},{
	  		name: "NoPrintDate",
	  		value: "无打印日期模板"
	  	},{
	  		name: "NoTitle",
	  		value: "无抬头模板(常用)"
	  	},{
	  		name: "PJZK",
	  		value: "浦江折扣模板"
	  	},{
	  		name: "PJZKWJE",
	  		value: "浦江折扣无金额模板"
	  	},{
	  		name: "PJBZ",
	  		value: "浦江标准模板"
	  	},{
	  		name: "NoTitle2",
	  		value: "无抬头模板"
	  	},{
	  		name: "CTCC",
	  		value: "电信模板"
	  	},{
	  		name: "BCM",
	  		value: "交银模板"
	  	},{
	  		name: "NoPrice",
	  		value: "无价格模板"
	  	}];
	  	this.OrderCarrier = {}
	    this.OrderCarrierContact = {}
	    this.OrderCarrierDriver = {}
	    this.OrderCarrierEqp = {}
	  	that.sfrCountryList = getCountryData();
	  	that.dpDistrictList = getProvinceData("100000");
	  	that.logininf = JSON.parse(localStorage.getItem("logininf"));
	  	initSelectData(that);
	  	this.selectListData = getBasicData();    //获取下拉数据
	  	that.searchsStartTime = getQueryTime(1);
	  	//获取订单列表
	  	postRequest(tmsUrl + "/query/selectTaskEAOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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

function mapFunction(sfrAddress,stoAddress,wayPoint){
	if(sfrAddress == null || stoAddress == null){
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
    	actCode:"",
    	assignStatus:"",
    	exceptionStatus:""
   }
}
function formartDate (y,m,d,symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0'+m;
    d = (d.toString())[1] ? d : '0'+d;
    return y+symbol+m+symbol+d
}
