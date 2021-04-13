var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		isDisable:true,
		clearShow:true,
		abnormalPage:0,
		splitType: 'master',
		isOpOrCloDetail: '0',
        recordd:'',
        splitAddress: 0,
        temporarySplitItem: {},
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
		srcFileList:[],
		begin:"",
		magnifyImgSrc:"",
		magnifyImgType:"",
		indexImg:0,
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
	    queryPageSize: 20,
	    multipleNum:12,
	    packageGoodsDetails:"",
	    packageGoodsList:[{
	    	orderItem:{
	    		itemName:"",
	    		currency:"",
	    		qtyUnit:"",
	    		volumeUnit:""
	    	}
	    }],
        charge: { // 费用信息
            bmChargeId: "",
            refTo: "",
            refSource: "",
            customerRefNo: "",
            refId: "",
            refHash: "",
            chargeFrom: "",
            chargeTo: "",
            chargeFromName: "",
            chargeToName: "",
            rpType: "",
            chargeInfoList: []
        },
        chargeInfo: {  //费用组信息
            chargeType: "",
            chargeGroup: "",
            chargeRate: "",
            qty: "",
            qtyUnit: "",
            discountRate: "",
            discount: "",
            taxRate: "",
            tax: "",
            amount: "",
            currency: "",
            exchangeRate: "",
            remark: ""
        },
        chargeInfoTable: {}, //费用列表
        transportOrder: {},
        timeHorizon:"", //创建时间范围
        timeHorizon1:"",//完成时间范围
        linkNames: ["配送订单","派送任务"],
        linkHrefs: []
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
            imitatePopup("请先勾选至少一条订单行！","alert");
		},
		addOrderDetails(template){
			this.templateTitle = template;
		},
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
				    	orderType:""
				    }
                    var searchFormArr = {
                        startCreateTime: getQueryTime(1),
						pageInfo:{
							pageNum:1,
							pageSize:that.queryPageSize
						}
					}
				  	//获取订单列表
				  	postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                	alert("上传文件失败");
                	that.clearShow = true;
                	setTimeout(function(){
                		$(".fileUploadLi .inputBox").css({"display":"inline-block"});
                	},100)
                 //   console.error(e);
                }
            });
		},
		exportDeliveryNote(){   //导出送货单
            var that = this;
            var r = confirm("是否带入现有查询条件？");
            if(r == true){
                $(".ajax-load-pupup1").show();
                var queryParam = that.publicGetQueryParam('1');
                var searchInfo = "";
                for(key in queryParam){
                    searchInfo += "&"+key+"="+queryParam[key]
                }
                window.location.href = tmsUrl + "/export/tjoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
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
                window.location.href = tmsUrl + "/export/tjoOrder?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
                setTimeout(function(){
                    $(".ajax-load-pupup1").hide();
                },3000)
            }
		},
		publicGetQueryParam(type){
            var searchFormArr = {};
            switch(type)
            {
                case '0':

                    break;
                case '1':
                    searchFormArr = this.queryParam;
                    var startTimeVal =this.timeHorizon.split(" - ")[0];
                    var endTimeVal =this.timeHorizon.split(" - ")[1];
                    var crcdStartTimeVal =this.timeHorizon1.split(" - ")[0];
                    var crcdEndTimeVal =this.timeHorizon1.split(" - ")[1];
                    searchFormArr.startCreateTime = startTimeVal;
                    searchFormArr.endCreateTime = endTimeVal;
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                    break;
            }
            return searchFormArr;
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
			that.splitType = 'master';
			that.splitCount = '';
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

                    if(data.result.carrierPartyInfo.imgContact != null){
                        that.OrderCarrierContact = data.result.carrierPartyInfo.imgContact;
                    }else{
                        that.OrderCarrierContact = {
                            contactName:"",
                            contactTel:""
                        };
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
                    that.OrderCarrierContact = {
                        contactName:"",
                        contactTel:""
                    };
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
        getOrderEdit(template,order){
            this.templateTitle = template;
            this.currentOrderId = order.omOrderId;
            var that = this;
            that.splitType = 'master';
            that.splitCount = '';
            getRequest(tmsUrl + "/query/OrderTjoInfoDetail.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&orderId="+order.omOrderId,function(data){
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

            })
        },
        saveOrderHead() { // 订单  新增、修改
            var that = this;
            var omOrderHeadInfoModel = {};
            if (that.orderDetail.completeTime == '') {
                alert("请选择要求送达时间");
                return false;
            }
            that.orderDetail.expireTime = that.orderDetail.completeTime;
            omOrderHeadInfoModel.order = {};
            omOrderHeadInfoModel.order.trackingNo = that.orderDetail.trackingNo;
            omOrderHeadInfoModel.order.completeTime = that.orderDetail.completeTime;
            omOrderHeadInfoModel.order.remark = that.orderDetail.remark;
            var omOrderHeadInfoList = [];
            omOrderHeadInfoList[0] = omOrderHeadInfoModel
            postRequest(omsUrl + "/update/orderHeadInfo?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, omOrderHeadInfoList, function (data) {
                that.getSearchVal();
            });
        },
        orderCancel(){
            var that = this;
            if(that.checkedOperaOrder.length == 0){
                imitatePopup("请至少勾选一条数据行",'alert');
                return  false;
            }
            var params = [];
            for(var i = 0; i < that.checkedOperaOrder.length;i++){
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
                    var startTimeVal =that.timeHorizon.split(" - ")[0];
                    var endTimeVal =that.timeHorizon.split(" - ")[1];
                    var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                    var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
                    searchFormArr.startCreateTime = startTimeVal;
                    searchFormArr.endCreateTime = endTimeVal;
                    searchFormArr.startCompleteTime = crcdStartTimeVal;
                    searchFormArr.endCompleteTime = crcdEndTimeVal;
                    searchFormArr.pageInfo ={
                        pageNum:that.currentPage,
                        pageSize:that.queryPageSize
                    }
                    $(".reportMessages table tr .checkInp").attr("checked",false);
                    that.checkedOperaOrder = [];
                    that.checkedNum = 0;
                    //获取订单列表
                    postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
		getOrderCode(codeVal){ //获取二维码 条形码
            $("#qrcode").html("");
		//	this.orderCodeItem = codeVal;
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
		getOrderReceipt(receiptVal){  // 点击“订单附件”按钮
			var that = this;
            that.orderReceiptItem = receiptVal;
            that.getOrderCode(receiptVal);
            that.getReceiptImgList(receiptVal.omOrderId);
            that.getReceiptFilesList(receiptVal.omOrderId);
		},
        getReceiptImgList(omOrderId){ // 获取图片列表
            var that = this;
            that.receiptImgList = [];
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
					that.magnifyImgSrc = that.receiptImgList[that.indexImg];
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

					if(res.result.shipperPartyInfo != null && res.result.shipperPartyInfo.location.address != null && res.result.receiptPartyInfo != null && res.result.receiptPartyInfo.location.latLng != null){
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
		opOrCloDetail(){
			var that = this;
			if(that.isOpOrCloDetail == 0){
				$(".adsRightConItemAndFreely").show();
				$(".openDetailButton").html('收起总单详情');
				that.isOpOrCloDetail = 1;
			}else{
				$(".adsRightConItemAndFreely").hide();
				$(".openDetailButton").html('查看总单详情');
				that.isOpOrCloDetail = 0;
			}
		},
		openAddressInfo(index){
			var that = this;
			that.recordd = index;
            that.splitAddress = 1;
            for(var i=0;i<$(".txta2").length;i++){
                $(".txta2").eq(i).hide();
                $(".txta1").eq(i).show();
            }
            $(".txta2").eq(index).show();
            $(".txta1").eq(index).hide();
            that.temporarySplitItem = {
                shipperPartyInfo: that.orderSplitList[index].shipperPartyInfo,
                receiptPartyInfo: that.orderSplitList[index].receiptPartyInfo
            }
		},
		closeAddressInfo(index){
			var that = this;
            that.recordd = '';
            that.splitAddress = 0;
            $(".txta2").eq(index).hide();
            $(".txta1").eq(index).show();
		},
        saveTemporarySplitItem(item){
            var that = this;
            if(that.temporarySplitItem.shipperPartyInfo.party.partyName == ""||that.temporarySplitItem.shipperPartyInfo.imgContact.contactName == ""||
                that.temporarySplitItem.shipperPartyInfo.imgContact.contactTel == ""||that.temporarySplitItem.shipperPartyInfo.location.address == ""||
                that.temporarySplitItem.receiptPartyInfo.party.partyName == ""||that.temporarySplitItem.receiptPartyInfo.imgContact.contactName == ""||
                that.temporarySplitItem.receiptPartyInfo.imgContact.contactTel == ""||that.temporarySplitItem.receiptPartyInfo.location.address == ""){
                imitatePopup("请填写完整收货商和发货商信息！","alert");
                return false;
            }
            that.orderSplitList[that.recordd].shipperPartyInfo = that.temporarySplitItem.shipperPartyInfo;
            that.orderSplitList[that.recordd].receiptPartyInfo = that.temporarySplitItem.receiptPartyInfo;
            imitatePopup("修改成功！","alert");
            $(".txta2").hide();
            $(".txta1").show();
            that.recordd = '';
            that.splitAddress = 0;
        },
		createOrderSplit(){
			var that = this;
			$(".childOrderAddress").hide();
			$(".txta2").hide();
            $(".txta1").show();
            that.recordd = '';
            that.splitAddress = 0;
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
					for(var i=0;i<that.orderSplitList.length;i++){
						that.orderSplitList[i].shipperPartyInfo = {
							party: {
								powerDto: that.shipperParty.powerDto,
								authority: that.shipperParty.authority,
								rowStatus: that.shipperParty.rowStatus,
								pageInfo: that.shipperParty.pageInfo,
								omPartyId: that.shipperParty.omPartyId,
								refId: that.shipperParty.refId,
								refTo: that.shipperParty.refTo,
								partyType: that.shipperParty.partyType,
								partyName: that.shipperParty.partyName,
								partyCode: that.shipperParty.partyCode,
								partyAbbr: that.shipperParty.partyAbbr,
								isBuyer: that.shipperParty.isBuyer,
								isVendor: that.shipperParty.isVendor,
								isTruck: that.shipperParty.isTruck,
								isWarehouse: that.shipperParty.isWarehouse,
								is3pl: that.shipperParty.is3pl,
								str1: that.shipperParty.str1,
								str2: that.shipperParty.str2,
								str3: that.shipperParty.str3,
								umUserId: that.shipperParty.umUserId,
								umTenantId: that.shipperParty.umTenantId,
								createTime: that.shipperParty.createTime,
								updateTime: that.shipperParty.updateTime,
								ext: that.shipperParty.ext,
								extList: that.shipperParty.extList,
								modifyRow: that.shipperParty.modifyRow,
								addRow: that.shipperParty.addRow,
								initilRow: that.shipperParty.initilRow,
								deletedRow: that.shipperParty.deletedRow,
							},
							imgContact: {
								powerDto: that.shipperPartyContact.powerDto,
								authority: that.shipperPartyContact.authority,
								rowStatus: that.shipperPartyContact.rowStatus,
								pageInfo: that.shipperPartyContact.pageInfo,
								omContactId: that.shipperPartyContact.omContactId,
								refId: that.shipperPartyContact.refId,
								refTo: that.shipperPartyContact.refTo,
								contactType: that.shipperPartyContact.contactType,
								contactName: that.shipperPartyContact.contactName,
								contactTel: that.shipperPartyContact.contactTel,
								contactEmail: that.shipperPartyContact.contactEmail,
								contactAddress: that.shipperPartyContact.contactAddress,
								remark: that.shipperPartyContact.remark,
								umUserId: that.shipperPartyContact.umUserId,
								umTenantId: that.shipperPartyContact.umTenantId,
								createTime: that.shipperPartyContact.createTime,
								updateTime: that.shipperPartyContact.updateTime,
								ext: that.shipperPartyContact.ext,
								extList: that.shipperPartyContact.extList,
								modifyRow: that.shipperPartyContact.modifyRow,
								addRow: that.shipperPartyContact.addRow,
								initilRow: that.shipperPartyContact.initilRow,
								deletedRow: that.shipperPartyContact.deletedRow
							},
							contact: {
								powerDto: that.shipperPartyLocationContact.powerDto,
								authority: that.shipperPartyLocationContact.authority,
								rowStatus: that.shipperPartyLocationContact.rowStatus,
								pageInfo: that.shipperPartyLocationContact.pageInfo,
								omContactId: that.shipperPartyLocationContact.omContactId,
								refId: that.shipperPartyLocationContact.refId,
								refTo: that.shipperPartyLocationContact.refTo,
								contactType: that.shipperPartyLocationContact.contactType,
								contactName: that.shipperPartyLocationContact.contactName,
								contactTel: that.shipperPartyLocationContact.contactTel,
								contactEmail: that.shipperPartyLocationContact.contactEmail,
								contactAddress: that.shipperPartyLocationContact.contactAddress,
								remark: that.shipperPartyLocationContact.remark,
								umUserId: that.shipperPartyLocationContact.umUserId,
								umTenantId: that.shipperPartyLocationContact.umTenantId,
								createTime: that.shipperPartyLocationContact.createTime,
								updateTime: that.shipperPartyLocationContact.updateTime,
								ext: that.shipperPartyLocationContact.ext,
								extList: that.shipperPartyLocationContact.extList,
								modifyRow: that.shipperPartyLocationContact.modifyRow,
								addRow: that.shipperPartyLocationContact.addRow,
								initilRow: that.shipperPartyLocationContact.initilRow,
								deletedRow: that.shipperPartyLocationContact.deletedRow
							},
							location: {
								powerDto: that.shipperPartyLocation.powerDto,
								authority: that.shipperPartyLocation.authority,
								rowStatus: that.shipperPartyLocation.rowStatus,
								pageInfo: that.shipperPartyLocation.pageInfo,
								omLocationId: that.shipperPartyLocation.omLocationId,
								refId: that.shipperPartyLocation.refId,
								refTo: that.shipperPartyLocation.refTo,
								seq: that.shipperPartyLocation.seq,
								locationType: that.shipperPartyLocation.locationType,
								locationName: that.shipperPartyLocation.locationName,
								locationCode: that.shipperPartyLocation.locationCode,
								latLng: that.shipperPartyLocation.latLng,
								lng: that.shipperPartyLocation.lng,
								lat: that.shipperPartyLocation.lat,
								address: that.shipperPartyLocation.address,
								street: that.shipperPartyLocation.street,
								postCode: that.shipperPartyLocation.postCode,
								districtCode: that.shipperPartyLocation.districtCode,
								cityCode: that.shipperPartyLocation.cityCode,
								provinceCode: that.shipperPartyLocation.provinceCode,
								countryCode: that.shipperPartyLocation.countryCode,
								umUserId: that.shipperPartyLocation.umUserId,
								umTenantId: that.shipperPartyLocation.umTenantId,
								createTime: that.shipperPartyLocation.createTime,
								updateTime: that.shipperPartyLocation.updateTime,
								ext: that.shipperPartyLocation.ext,
								extList: that.shipperPartyLocation.extList,
								modifyRow: that.shipperPartyLocation.modifyRow,
								addRow: that.shipperPartyLocation.addRow,
								initilRow: that.shipperPartyLocation.initilRow,
								deletedRow: that.shipperPartyLocation.deletedRow
							},
							eqp: null
						};
						that.orderSplitList[i].receiptPartyInfo = {
							party: {
								powerDto: that.receiptParty.powerDto,
								authority: that.receiptParty.authority,
								rowStatus: that.receiptParty.rowStatus,
								pageInfo: that.receiptParty.pageInfo,
								omPartyId: that.receiptParty.omPartyId,
								refId: that.receiptParty.refId,
								refTo: that.receiptParty.refTo,
								partyType: that.receiptParty.partyType,
								partyName: that.receiptParty.partyName,
								partyCode: that.receiptParty.partyCode,
								partyAbbr: that.receiptParty.partyAbbr,
								isBuyer: that.receiptParty.isBuyer,
								isVendor: that.receiptParty.isVendor,
								isTruck: that.receiptParty.isTruck,
								isWarehouse: that.receiptParty.isWarehouse,
								is3pl: that.receiptParty.is3pl,
								str1: that.receiptParty.str1,
								str2: that.receiptParty.str2,
								str3: that.receiptParty.str3,
								umUserId: that.receiptParty.umUserId,
								umTenantId: that.receiptParty.umTenantId,
								createTime: that.receiptParty.createTime,
								updateTime: that.receiptParty.updateTime,
								ext: that.receiptParty.ext,
								extList: that.receiptParty.extList,
								modifyRow: that.receiptParty.modifyRow,
								addRow: that.receiptParty.addRow,
								initilRow: that.receiptParty.initilRow,
								deletedRow: that.receiptParty.deletedRow,
							},
							imgContact: {
								powerDto: that.receiptPartyContact.powerDto,
								authority: that.receiptPartyContact.authority,
								rowStatus: that.receiptPartyContact.rowStatus,
								pageInfo: that.receiptPartyContact.pageInfo,
								omContactId: that.receiptPartyContact.omContactId,
								refId: that.receiptPartyContact.refId,
								refTo: that.receiptPartyContact.refTo,
								contactType: that.receiptPartyContact.contactType,
								contactName: that.receiptPartyContact.contactName,
								contactTel: that.receiptPartyContact.contactTel,
								contactEmail: that.receiptPartyContact.contactEmail,
								contactAddress: that.receiptPartyContact.contactAddress,
								remark: that.receiptPartyContact.remark,
								umUserId: that.receiptPartyContact.umUserId,
								umTenantId: that.receiptPartyContact.umTenantId,
								createTime: that.receiptPartyContact.createTime,
								updateTime: that.receiptPartyContact.updateTime,
								ext: that.receiptPartyContact.ext,
								extList: that.receiptPartyContact.extList,
								modifyRow: that.receiptPartyContact.modifyRow,
								addRow: that.receiptPartyContact.addRow,
								initilRow: that.receiptPartyContact.initilRow,
								deletedRow: that.receiptPartyContact.deletedRow
							},
							contact: {
								powerDto: that.receiptPartyLocationContact.powerDto,
								authority: that.receiptPartyLocationContact.authority,
								rowStatus: that.receiptPartyLocationContact.rowStatus,
								pageInfo: that.receiptPartyLocationContact.pageInfo,
								omContactId: that.receiptPartyLocationContact.omContactId,
								refId: that.receiptPartyLocationContact.refId,
								refTo: that.receiptPartyLocationContact.refTo,
								contactType: that.receiptPartyLocationContact.contactType,
								contactName: that.receiptPartyLocationContact.contactName,
								contactTel: that.receiptPartyLocationContact.contactTel,
								contactEmail: that.receiptPartyLocationContact.contactEmail,
								contactAddress: that.receiptPartyLocationContact.contactAddress,
								remark: that.receiptPartyLocationContact.remark,
								umUserId: that.receiptPartyLocationContact.umUserId,
								umTenantId: that.receiptPartyLocationContact.umTenantId,
								createTime: that.receiptPartyLocationContact.createTime,
								updateTime: that.receiptPartyLocationContact.updateTime,
								ext: that.receiptPartyLocationContact.ext,
								extList: that.receiptPartyLocationContact.extList,
								modifyRow: that.receiptPartyLocationContact.modifyRow,
								addRow: that.receiptPartyLocationContact.addRow,
								initilRow: that.receiptPartyLocationContact.initilRow,
								deletedRow: that.receiptPartyLocationContact.deletedRow
							},
							location: {
								powerDto: that.receiptPartyLocation.powerDto,
								authority: that.receiptPartyLocation.authority,
								rowStatus: that.receiptPartyLocation.rowStatus,
								pageInfo: that.receiptPartyLocation.pageInfo,
								omLocationId: that.receiptPartyLocation.omLocationId,
								refId: that.receiptPartyLocation.refId,
								refTo: that.receiptPartyLocation.refTo,
								seq: that.receiptPartyLocation.seq,
								locationType: that.receiptPartyLocation.locationType,
								locationName: that.receiptPartyLocation.locationName,
								locationCode: that.receiptPartyLocation.locationCode,
								latLng: that.receiptPartyLocation.latLng,
								lng: that.receiptPartyLocation.lng,
								lat: that.receiptPartyLocation.lat,
								address: that.receiptPartyLocation.address,
								street: that.receiptPartyLocation.street,
								postCode: that.receiptPartyLocation.postCode,
								districtCode: that.receiptPartyLocation.districtCode,
								cityCode: that.receiptPartyLocation.cityCode,
								provinceCode: that.receiptPartyLocation.provinceCode,
								countryCode: that.receiptPartyLocation.countryCode,
								umUserId: that.receiptPartyLocation.umUserId,
								umTenantId: that.receiptPartyLocation.umTenantId,
								createTime: that.receiptPartyLocation.createTime,
								updateTime: that.receiptPartyLocation.updateTime,
								ext: that.receiptPartyLocation.ext,
								extList: that.receiptPartyLocation.extList,
								modifyRow: that.receiptPartyLocation.modifyRow,
								addRow: that.receiptPartyLocation.addRow,
								initilRow: that.receiptPartyLocation.initilRow,
								deletedRow: that.receiptPartyLocation.deletedRow
							},
							eqp: null
						}
					}
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
                        if (data.result.carrierPartyInfo.party != null) {
                            parms1.OrderCarrierHave = data.result.carrierPartyInfo.party;  // 承运商
                        }else {
                            parms1.OrderCarrierHave = {};
                        }
                    	if (data.result.carrierPartyInfo.imgContactInfo != null) {
                            parms1.OrderCarrierContactHave = data.result.carrierPartyInfo.imgContactInfo;  // 承运商联系人
	                    }else {
	                        parms1.OrderCarrierContactHave = {};
	                    }
                        if (data.result.carrierPartyInfo.contact != null) {
                            parms1.OrderCarrierDriverHave = data.result.carrierPartyInfo.contact;  // 司机
                        } else {
                            parms1.OrderCarrierDriverHave = {};
                        }
	                    if (data.result.carrierPartyInfo.eqp != null) {
	                        parms1.OrderCarrierEqpHave = data.result.carrierPartyInfo.eqp;  // 设备
	                    } else {
	                        parms1.OrderCarrierEqpHave = {};
	                    }
                    }else{
                    	parms1.OrderCarrierHave = {};
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
            var startTimeVal =this.timeHorizon.split(" - ")[0];
            var endTimeVal =this.timeHorizon.split(" - ")[1];
            var crcdStartTimeVal =this.timeHorizon1.split(" - ")[0];
            var crcdEndTimeVal =this.timeHorizon1.split(" - ")[1];
			searchFormArr.startCreateTime = startTimeVal;
			searchFormArr.endCreateTime= endTimeVal;
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
			//获取订单列表
		  	postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            that.queryParam = { // 搜索条件
                completeStatus:"",
                actCode:"",
                exceptionStatus:""
            };
        },
		getSearchVal(showPageNum){
			//订单搜索
			var that = this;
			var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 ) {
				that.multipleNum = that.queryPageSize;
				var searchFormArr = this.queryParam;

                var startTimeVal =that.timeHorizon.split(" - ")[0];
                var endTimeVal =that.timeHorizon.split(" - ")[1];
                var crcdStartTimeVal =that.timeHorizon1.split(" - ")[0];
                var crcdEndTimeVal =that.timeHorizon1.split(" - ")[1];
                if(crcdStartTimeVal == "" && crcdEndTimeVal == "" && startTimeVal == "" && endTimeVal == ""){
                    startTimeVal = getQueryTime(1);
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
				that.checkedNum = 0;
				//获取订单列表
			  	postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
					that.tableOrderList = res.result;
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
        getChargeInfo(orderItem) {
            var that = this;
            that.transportOrder = {
                actCode: orderItem.actCode,
                expireStatus: orderItem.expireStatus,
                completeStatus: orderItem.completeStatus,
                sendStatus: orderItem.sendStatus,
                exceptionStatus: orderItem.exceptionStatus,
                activeStatus: orderItem.activeStatus,
                auditStatus: orderItem.auditStatus,
                totalQty: orderItem.totalQty,
                qtyUnit: orderItem.qtyUnit,
                totalWeight: orderItem.totalWeight,
                totalVolume: orderItem.totalVolume,
                volumeUnit: orderItem.volumeUnit,
                weightUnit: orderItem.weightUnit
            };
            that.chargeInfo.qtyUnit = that.selectListData.qtyUnitList[0].code;
            that.chargeInfo.currency = that.selectListData.currencyList[0].code;
            that.charge.customerRefNo = orderItem.customerRefNo;
            that.charge.refId = orderItem.omOrderId;
            that.charge.refHash = orderItem.orderNo;
            that.charge.chargeFrom = that.logininf.tenantPartyNo;
            that.charge.chargeTo = orderItem.carPartyCode;
            that.charge.chargeFromName = that.logininf.tenantName;
            that.charge.chargeToName = orderItem.carPartyName;
            that.charge.rpType = "AP";
            var params = {
                refHash: orderItem.orderNo,
                activeStatus: 1
            };
            postRequest(bmsUrl + "/get/chargeVoListByChargeVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        saveChargeInfo: function () { // 新增收费信息
            var that = this;
            if (that.charge.chargeTo == "" || that.charge.chargeTo == undefined) {
                imitatePopup("应付费用请在订单排单后添加！",'alert');
                return false;
            }
            if (that.chargeInfo.chargeGroup == "" || that.chargeInfo.chargeGroup == undefined) {
                imitatePopup("请选择费用组类型！",'alert');
                return false;
            }
            if (that.chargeInfo.chargeType == "" || that.chargeInfo.chargeType == undefined) {
                imitatePopup("请选择费用类型",'alert');
                return false;
            }
            if (that.chargeInfo.qty == "" || that.chargeInfo.qty == undefined) {
                imitatePopup("请填写数量",'alert');
                return false;
            } else {
                //验证必须是数字
                var reg = new RegExp("^[1-9]+[0-9]*$")
                if (!reg.test(that.chargeInfo.qty)) {
                    alert("数量请填写正整数");
                    return false;
                }
            }
            if (that.chargeInfo.amount == "" || that.chargeInfo.amount == undefined) {
                imitatePopup("费用金额",'alert');
                return false;
            } else {
                var num = new RegExp("^(([1-9][0-9]*)|(([0]\\.\\d{1,2}|[1-9][0-9]*\\.\\d{1,2})))$")
                if (!num.test(that.chargeInfo.amount)) {
                    imitatePopup("费用金额任意正整数，正小数（小数位不超过2位）",'alert');
                    return false;
                }
            }
            if (that.chargeInfo.discountRate != "") {
                //验证必须是数字：/^[0-9]*$/
                var reg = new RegExp("^-?(0\\.\\d*[1-9]+\\d*)$")
                if (!reg.test(that.chargeInfo.discountRate)) {
                    alert("折扣请填写0-1之间的小数");
                    return false;
                }
            }
            that.charge.refSource = "tms";
            that.charge.refTo = "ORDER";
            that.charge.chargeInfoList = [];
            that.charge.chargeInfoList.push(that.chargeInfo);
            let params = that.charge;
            postRequest(bmsUrl + "/save/bmCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                    that.resetChargeInfo();//重置数据
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        updateChargeInfo(chargeInf) { // 修改收费信息
            var that = this;
            that.charge.bmChargeId = chargeInf.bmChargeId;
            that.chargeInfo.chargeGroup = chargeInf.chargeGroup;
            that.chargeInfo.chargeType = chargeInf.chargeType;
            that.chargeInfo.qty = chargeInf.qty;
            that.chargeInfo.qtyUnit = chargeInf.qtyUnit;
            that.chargeInfo.amount = chargeInf.amount;
            that.chargeInfo.currency = chargeInf.currency;
            that.chargeInfo.discountRate = chargeInf.discountRate;
            that.chargeInfo.remark = chargeInf.remark;
        },
        deleteChargeInfo(chargeInf) { // 删除收费信息
            var that = this;
            var params = {
                bmChargeId: chargeInf.bmChargeId,
                refHash: that.charge.refHash,
                activeStatus: 0
            }
            postRequest(bmsUrl + "/delete/bmCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (res) {
                if (res.msg === "SUCCESS" || res.msg === "success") {
                    that.chargeInfoTable = res.result;
                } else {
                    imitatePopup(res.msg,'alert');
                    return false;
                }
            })
        },
        resetChargeInfo() { // 重置收费信息
            var that = this;
            that.charge.bmChargeId = "";
            that.chargeInfo.chargeGroup = "";
            that.chargeInfo.chargeType = "";
            that.chargeInfo.qty = "";
            that.chargeInfo.qtyUnit = "";
            that.chargeInfo.amount = "";
            that.chargeInfo.currency = "";
            that.chargeInfo.discountRate = "";
            that.chargeInfo.remark = "";
            that.chargeInfo.qtyUnit = that.selectListData.qtyUnitList[0].code;
            that.chargeInfo.currency = that.selectListData.currencyList[0].code;
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
		},
	},
	created:function(){
		var that = this;
        that.timeHorizon = getQueryTime(1)+" - "+ getQueryTime(-10);
		$(".childOrderAddress").hide();
		$(".txta2").hide();
	  	var searchFormArr = {
            startCreateTime: getQueryTime(1),
			pageInfo:{
				pageNum:1,
				pageSize:that.queryPageSize
			}
		}
	  	this.OrderCarrier = {}
	    this.OrderCarrierContact = {}
	    this.OrderCarrierDriver = {}
	    this.OrderCarrierEqp = {}
	  	that.sfrCountryList = getCountryData();
	  	that.dpDistrictList = getProvinceData("100000");
	  	that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.linkHrefs = getJumpLinkList(that.linkNames);
	  	initSelectData(that);
	  	this.selectListData = getBasicData();    //获取下拉数据
	  	that.searchsStartTime = getQueryTime(1);
	  	//获取订单列表
	  	postRequest(tmsUrl + "/query/selectTaskOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
  		currency:"",
        completeTime:getTodayTime()
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
    	exceptionStatus:""
   }
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('#timeRange1').daterangepicker(null, function(start, end, label) {
        app.timeHorizon1 = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
    $('input[name="completeTime"]').daterangepicker({
        singleDatePicker: true,
        showDropdowns:true,
        minYear:1901,
        maxYear:parseInt(moment().format('YYYY'),10)
    }, function(start, end, label) {
        app.orderDetail.completeTime= start.format('YYYY-MM-DD');
    });
});
