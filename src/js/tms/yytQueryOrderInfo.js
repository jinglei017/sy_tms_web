var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		isDisable:true,
		clearShow:true,
		abnormalPage:0,
		queryPageSize: 150,
		multipleNum: 150,
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
	    startCreatDate: getQueryTime(1),
	    logininf:{},
	    orderCarrierList:[{
	    	shipperPartyHave:{},
	    	receiptPartyHave:{},
	    	orderDetailHave:{},
	    	OrderCarrierContactHave:{},
	    	OrderCarrierEqpHave:{},
	    	OrderCarrierHave:{},
	    	OrderCarrierDriverHave:{}
	    }],
	    checkedNum:0,
	    omOrderList:[],
	    checkedOperaOrder:[],
	    orderList:[],
	    splitCount:"",
	    currentOrderId:"",
	    isShowSplitList:"0",
	    orderSplitList:[{
	    	orderItemList:[{}]
	    }],
	    templateTitle:"新增订单",
	    isShippingOrder:false,
	    packageGoodsDetails:"",
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
                url: tmsUrl + '/orderInfo/uploadExcelFile_EA.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp, //用于文件上传的服务器端请求地址
                type: 'post',
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'excelFile', //文件上传域的ID
                dataType: 'json', //返回值类型一般设置为json
                success: function (data, status) {
                	$(".progressCon").css({
		    				"width": "100%"
		    		})
			    	$(".scheduleLoadPopup .scheduleTitle span").html("订单上传完成");
			    	setTimeout(function(){
			    		num = 5;
			    		clearInterval(timer1);
			    		$(".scheduleLoadPopup").hide();
			    		$(".progressCon").css({
		    				"width": "5%"
		    			})
			    	},1000)
                    imitatePopup(data.result.resultMsg,"alert");

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
				    	orderType:"",
				    	subtasksStatus:"",
				    }
                    that.clearShow = true;
                    setTimeout(function(){
                		$(".fileUploadLi .inputBox").css({"display":"inline-block"});
                	},100)
                    var searchFormArr = {
						startCreateTime: getQueryTime(1),
						isHaulOrder:true,
						pageInfo:{
							pageNum:1,
							pageSize: that.queryPageSize
						}
					}
				  	//获取订单列表
				  	setTimeout(function(){
				  		postRequest(tmsUrl + "/query/OrderPartInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
							that.tableOrderList = res.result;
							that.totalPagesNum = res.pageInfo.total;
							that.pageInfo = res.pageInfo;
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
                    imitatePopup(上传文件失败,"alert");

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
                //	console.error(e);
                }
            });
		},
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
		addOrderDetails(template){
			this.templateTitle = template;
		},
		exportShippingOrder(){   //导出配送订单
            var that = this;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                $(".ajax-load-pupup1").show();
                var queryParam = that.publicGetQueryParam('1');
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/doOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },1000)
			}else{
                $(".ajax-load-pupup1").show();
                var queryParam = that.publicGetQueryParam('0');
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/doOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },3000)
			}
		},
		publicGetQueryParam(type){
            var that = this;
            var searchFormArr = {};
            switch(type)
            {
                case '0':

                    break;
                case '1':
                    searchFormArr = that.queryParam;
                    var startTimeVal = $(".startTimeSpan").val().trim();
                    var endTimeVal = $(".endTimeSpan").val().trim();
                    if(startTimeVal == getQueryTime(1)){
                        searchFormArr.startCreateTime = getQueryTime(1);
                    }else{
                        searchFormArr.startCreateTime = startTimeVal;
                    }
                    if(endTimeVal == ""){

                    }else{
                        searchFormArr.endCreateTime = endTimeVal;
                    }
                    searchFormArr.isHaulOrder = true;
                    that.startCreatDate = startTimeVal;
                    break;
            }
            return searchFormArr;
		},
		getStartCreatTime(){
			var that = this;
			$("#startTime").show();
			var mySchedule = new Schedule({
				el: '#startTime',
				clickCb: function (y,m,d) {
					$(".startTimeSpan").val(formartDate(y,m,d));
					that.startCreatDate = formartDate(y,m,d);
					$("#startTime").hide();
				}
			});
		},
		getStartCreatTimeVal(){
			var startTimeSpan = $("#startTimeSpanVal").val();
			if(startTimeSpan == ""){
				this.startCreatDate = "";
			}
		},
		carrierPartyList(params,id){
			var that = this;
			getRequest(cmdUrl + "/cdParty/selectPartyOneModel?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdPartyId="+id+"&isDefault=1&locationType=OTHER",function(res){
				that.OrderCarrierDriver = res.result.imgContactList[0];
				that.OrderCarrierEqp = res.result.eqpList[0];
				that.OrderCarrierContact = res.result.imgContactList[0];
				that.OrderCarrierParty = res.result.cdParty;
			})
		},
		textboxAllSelectionFun(event){
			var that = this;
			var el = event.target;
			if($(el).prop("checked")){
				$(".reportMessages table td .checkInp").prop("checked",true);
				for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
				that.checkedNum = that.checkedOperaOrder.length;
			}else{
				$(".reportMessages table td .checkInp").prop("checked",false);
				 for(var ii = 0; ii < that.tableOrderList.length;ii++){
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii],that.checkedOperaOrder),1)
                }
				 that.checkedNum = that.checkedOperaOrder.length;
			}
		},
		textboxSelectionFun(event,orderItem){
			var that = this;
			var el = event.target;
			if($(el).prop("checked")){
				that.checkedOperaOrder.push(orderItem);
			}else{
				that.checkedOperaOrder.splice($.inArray(orderItem,that.orderList),1)
			}
			that.checkedNum = that.checkedOperaOrder.length;
			if(that.checkedOperaOrder.length == ($(".reportMessages input[type='checkbox']").length-1)){  // 单选个数 = 该页条数，全选选中
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
		},
		createSendsingle(){
			if(this.checkedNum == 0){
				imitatePopup("请先勾选至少一条订单行！",'alert');
				return false;
			}
			//生成派送单
			var that = this;
			var params = [];
			for(var i = 0; i < that.checkedOperaOrder.length;i++){
				params.push({
					refId:that.checkedOperaOrder[i].omOrderId,
					refNo:that.checkedOperaOrder[i].orderNo
				})
			}
			postRequest(omsUrl + "/generate/tjoOrderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
				if(data.result  == true){
					imitatePopup("生成派送单成功",'alert');
					$(".reportMessages table tr .checkInp").attr("checked",false);
					that.checkedOperaOrder = [];
					that.checkedNum = 0;
					var searchFormArr = that.queryParam;
					var startTimeVal = $(".startTimeSpan").val().trim();
					var endTimeVal = $(".endTimeSpan").val().trim();
                    if(startTimeVal == "" && endTimeVal == ""){
                        $(".startTimeSpan").val(getQueryTime(1));
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
					searchFormArr.isHaulOrder = true;
					searchFormArr.pageInfo = {
						pageNum:that.currentPage,
						pageSize: that.queryPageSize
					}
					postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
						that.tableOrderList = res.result;
						that.publicChangeBtnStatus();
				  	})

				}else{
					imtatePopup("生成派送单失败，请稍后重试！",'alert');
					$(".reportMessages table tr .checkInp").attr("checked",false);
					that.checkedOperaOrder = [];
					that.checkedNum = 0;
				}

		    })
		},
		orderCancel(){
			var that = this;
			if(that.checkedOperaOrder.length == 0){
				imitatePopup("请至少勾选一条数据行",'alert');
				return  false;
			}
			var params = [];
			for(var i = 0; i < that.checkedOperaOrder.length;i++){
//				params.push({
//					orderId: that.checkedOperaOrder[i].omOrderId,
//					actCode: "FREEZE",
//					orderNo: that.checkedOperaOrder[i].orderNo
//				})
				params.push({
					refId: that.checkedOperaOrder[i].omOrderId,
					refNo:that.checkedOperaOrder[i].orderNo
				})
			}
			var that = this;
			postRequest(tmsUrl + "/delete/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(data){
				if(data.result.success == true ){
					imitatePopup("订单取消成功",'alert');
					var searchFormArr = that.queryParam;
					var startTimeVal = $(".startTimeSpan").val().trim();
					var endTimeVal = $(".endTimeSpan").val().trim();
					if(startTimeVal == getQueryTime(1)){
						searchFormArr.startCreateTime = getQueryTime(1);
					}else{
						searchFormArr.startCreateTime = startTimeVal;
					}
					if(endTimeVal == ""){

					}else{
						searchFormArr.endCreateTime = endTimeVal;
					}
					searchFormArr.isHaulOrder = true;
					searchFormArr.pageInfo = {
						pageNum: that.currentPage,
						pageSize: that.queryPageSize
					}
					$(".reportMessages table tr .checkInp").attr("checked",false);
					that.checkedOperaOrder = [];
					that.checkedNum = 0;
				 	postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
						that.startCreatDate = startTimeVal;
						that.tableOrderList = res.result;
						that.pageList = [];
						for(var i = 0 ; i < res.pageInfo.pages;i++){
							that.pageList[i] = i + 1;
						}
						that.publicChangeBtnStatus();
				    })
				}else{
					imitatePopup(data.result.message,'alert');
					$(".reportMessages table tr .checkInp").attr("checked",false);
					that.checkedOperaOrder = [];
					that.checkedNum = 0;
				}
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

		    })
		},
		changeOrderDetails(template){
			this.templateTitle = template;
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
					if(res.result.shipperPartyInfo != null){
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
//			createOrderSplit(){
//				var that = this;
//				that.isShowSplitList = "1";
//				var params = {
//					masterOrderId:that.currentOrderId,
//					splitCount:that.splitCount
//				}
//				postRequest(tmsUrl + "/split/houseOrderList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
//					console.log(res.result);
//					that.orderSplitList = res.result;
//			  	})
//
//			},
//			orderSplitFun(){
//				var that = this;
//				var params = {
//					masterOrderId:that.currentOrderId,
//					houseOrderList:that.orderSplitList
//				}
//				postRequest(tmsUrl + "/split/orderInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){
//					if(res.msg == "success"){
//						alert("拆单成功");
//						that.isShowSplitList = "0";
//					}
//			  	})
//			},
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
			var startTimeVal = $(".startTimeSpan").val().trim();
			var endTimeVal = $(".endTimeSpan").val().trim();
			if(startTimeVal == getQueryTime(1)){
				searchFormArr.startCreateTime = getQueryTime(1);
			}else{
				searchFormArr.startCreateTime = startTimeVal;
			}
			if(endTimeVal == "创建时间--结束时间"){

			}else{
				searchFormArr.endCreateTime = endTimeVal;
			}
			searchFormArr.isHaulOrder = true;
			searchFormArr.pageInfo = {
				pageNum:pageNum,
				pageSize: that.queryPageSize
			}
			$(".reportMessages table tr .checkInp").attr("checked",false);
			that.checkedOperaOrder = [];
			that.checkedNum = 0;
			//获取订单列表
		  	postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				//console.log(res.result);
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
			var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 ) {
				that.multipleNum = that.queryPageSize;

				var searchFormArr = this.queryParam;
				var startTimeVal = $(".startTimeSpan").val().trim();
				var endTimeVal = $(".endTimeSpan").val().trim();
                if(startTimeVal == "" && endTimeVal == ""){
                    $(".startTimeSpan").val(getQueryTime(1));
                    startTimeVal = getQueryTime(1);
                    imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
                }
				if(startTimeVal == getQueryTime(1)){
					searchFormArr.startCreateTime = getQueryTime(1);
				}else{
					searchFormArr.startCreateTime = startTimeVal;
				}
				if(endTimeVal == ""){

				}else{
					searchFormArr.endCreateTime = endTimeVal;
				}
				searchFormArr.isHaulOrder = true;
				searchFormArr.pageInfo = {
					pageNum:1,
					pageSize: that.queryPageSize
				}
			 	$(".reportMessages table tr .checkInp").attr("checked",false);
				that.checkedOperaOrder = [];
				that.checkedNum = 0;
				//获取订单列表
			  	postRequest(tmsUrl + "/query/OrderPartInfo.json.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
					that.startCreatDate = startTimeVal;
					that.tableOrderList = res.result;
					that.pageList = [];
					$(".paging .pagingCon .pagination").animate({
						"left": "0px"
					},300);
					that.totalPagesNum = res.pageInfo.total;
					that.currentPage = 1;
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
				  						if(permissionListObj[i].objectCode == "UPLOAD"){
				  							$(".fileUploadHint").css({"display":"inline-block"});
				  						}
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
	created:function(){
		var that = this;
	  	var searchFormArr = {
			startCreateTime: getQueryTime(1),
			isHaulOrder:true,
			pageInfo:{
				pageNum:1,
				pageSize: that.queryPageSize
			}
		}
	  	this.OrderCarrier = {}
	    this.OrderCarrierContact = {}
	    this.OrderCarrierDriver = {}
	    this.OrderCarrierEqp = {}
	  	that.sfrCountryList = getCountryData();
	  	that.dpDistrictList = getProvinceData("100000");
	  	that.logininf = JSON.parse(localStorage.getItem("logininf"));
	  	initSelectData(that);
	  	this.selectListData = getBasicData();    //获取下拉数据
	  	//获取订单列表
	  	postRequest(tmsUrl + "/query/OrderPartInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
			that.tableOrderList = res.result;
			that.totalPagesNum = res.pageInfo.total;
			for(var i = 0 ; i < res.pageInfo.pages;i++){
				that.pageList[i] = i + 1;
			}
			that.publicChangeBtnStatus();
		})
		//console.log(permissionList);
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
    	orderType:"",
    	subtasksStatus:"",
   }
}
