var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
        queryPageSize:20,
	    tableOrderList:{},
	    selectListData:{},
	    clickBtnType:"",
	    isDisable:false,
	    isShippingOrder:false,
	    searchInf:[],
	    pageList:[],
	    totalPagesNum:"",
	    orderDetail:{},
	    logininf:{},
	    deviceList:{},
	    templateTitle:"新增联系人",
	    driverOrderList:[{}],
	    locationContact:{
	    	contactType:""
	    },
	    contactEqplList:[{
	    	isDefault:"",
	    	eqpType:""
	    }],
	    loadFactor:"0%",
	    currentDqIndex:"",
	    queryParam:{},
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
	    OrderCarrierContact:{},
	    OrderCarrierDriver:{},
	    OrderCarrierEqp:{},
	    orderItemDetail:{orderItem:{}},
	    packageGoodsDetails:"",
	    checkedOperaOrder:[],
	    checkedNum: 0,
	    packageGoodsList:[{
	    	orderItem:{
	    		itemName:"",
	    		currency:"",
	    		qtyUnit:"",
	    		volumeUnit:""
	    	}
	    }],
        selectOneBcItem:{},
        showSaveBtn:'0',
        allPosArray:[],  // 所有的点 stoLatLng 数组
        timeHorizon:"", //创建时间范围
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal();
        },
    },
	methods:{
		addOrderCarrierHint(){
            imitatePopup("请先勾选至少一条订单行！",'alert');
        },
		selectDqFun(deviceItem,index){
			//选择联系人
			this.$set(this.contactEqplList,this.currentDqIndex,deviceItem);
			$(".maskLayer").hide();
		},
		closeMaskLayer(){
			//关闭弹窗
			$(".maskLayer").hide();
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
        printDeliveryNote(){
        	var that = this;
            that.OrderCarrierContact.cdContactId = '';
            that.orderList = [];
            var searchInfo = "";
            $('.checkInp:checkbox').each(function() {
                if ($(this).prop('checked') == true) {
                	searchInfo += "&orderIdList="+$(this).val()
                }
            });
            //window.location.href = "/icdp-tms-app-1.0.0/query/orderTransportList?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
        },
		getOrderDetails(title,mtItem){  // 订单列表
		    this.selectOneBcItem = mtItem;
			this.templateTitle = title;
			var that = this;
			this.clickBtnType = "detail";
			that.isDisable = true;
            that.showSaveBtn = '0';
			var driverParam = {
                orderNo:mtItem.orderNo,
                contactTel:mtItem.contactTel,
                eqpNo:mtItem.eqpNo,
                startCompleteTime:getTodayTime(),
                endCompleteTime:getTodayTime()
            };
            postRequest(tmsUrl+'/driver/query/transportOrderPlanInfo.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,driverParam,function(res){
                orderReceiptMarkerArray = []; //标记订单点集合  清空

                that.allPosArray = [];  // 所有的点 stoLatLng 数组
                var newAllPosArray = [];  // 所有的点 stoLatLng 数组

                // ================= 高德
                /*map.clearMap();  // 清除地图上所有添加的覆盖物
                $('#panel').html('');*/

                // ================= 百度
                map.clearOverlays();  // 清除地图上所有添加的覆盖物
                $('#r-result').html('');

                if(res.result != null){
                    if(res.result.orderInfoResVoList != null){
                        if(res.result.orderInfoResVoList.length != 0){
                            that.rowDrop(res.result.orderInfoResVoList);
                            that.driverOrderList = res.result.orderInfoResVoList;

                            var orderInfoList = res.result.orderInfoResVoList;

                            // 选出所有的点（可能订单有相同点（stoLatLng））
                            for(var r=0;r<orderInfoList.length;r++){
                                var rItem = orderInfoList[r];
                                if(rItem.stoLatLng){
                                    newAllPosArray.push(rItem.stoLatLng);
                                }
                            }
                            that.allPosArray = quArraySameItemFun(newAllPosArray);

                            // 标记订单点

                            // ================= 高德
                            /*for(var j = 0,orderReceiptMarker; j < orderInfoList.length; j++){   // 标记单个订单
                                var item = orderInfoList[j],stoPosition = [];
                                if(item.stoLatLng){
                                    var string = item.stoLatLng.split(','),newDiv = document.createElement("div");
                                    stoPosition.push(string[0]);
                                    stoPosition.push(string[1]);

                                    orderReceiptMarker = new AMap.Marker({
                                        map: map,
                                        position: stoPosition
                                    });

                                    if(item.completeStatus == '1'){  // 完成
                                        newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                                        orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                                            '<p class="font_14"><span>完成状态：</span><span class="done2">完成</span></p>';
                                    }else{
                                        newDiv.innerHTML = '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png"/>'; // 15px-24px ; 13px-21px ; 14px-22px
                                        orderReceiptMarker.content = '<p class="font_14"><span>收货商：</span><span>'+item.stoPartyName+'</span></p>'+
                                            '<p class="font_14"><span>完成状态：</span><span class="no_done">未完成</span></p>';
                                    }

                                    orderReceiptMarker.setContent(newDiv);  //更新点标记内容

                                    /!*orderReceiptMarker.on('click', signalOrderClick);
                                    orderReceiptMarker.emit('click', {target: orderReceiptMarker});*!/
                                    orderReceiptMarkerArray.push(orderReceiptMarker);
                                }
                            }*/

                            // ================= 百度
                            for(var i=0;i<orderInfoList.length;i++){
                                var item = orderInfoList[i];
                                if(item.stoLatLng){
                                    var string = item.stoLatLng.split(','),BMapLat = '',BMapLon = '';
                                    getRequestBMap('/BMap-transformLocations/' + "?coords="+string[0]+","+string[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                                        if(data.result != undefined){
                                            BMapLat = data.result[0].x;
                                            BMapLon = data.result[0].y;
                                        }
                                    });
                                    var myIcon;
                                    if(item.completeStatus == '1'){  // 完成
                                        myIcon = new BMap.Icon("../../img/mark_b.png", new BMap.Size(22,40));
                                    }else{
                                        myIcon = new BMap.Icon("../../img/mark_r.png", new BMap.Size(22,40));
                                    }

                                    var marker = new BMap.Marker(new BMap.Point(BMapLat,BMapLon),{icon:myIcon});  // 创建标注
                                    var content = '收货商：'+item.stoPartyName;
                                    if(item.completeStatus == '1'){  // 完成
                                        content += '<br>完成状态：<span class="done2">完成</span>';
                                    }else{
                                        content += '<br>完成状态：<span class="no_done">未完成</span>';
                                    }
                                    map.addOverlay(marker);               // 将标注添加到地图中
                                //    addClickHandler(content,marker);
                                }
                            }

                        }else{
                            that.driverOrderList = [];
                        }
                    }else{
                        that.driverOrderList = [];
                    }
                }else{
                    that.driverOrderList = [];
                }
                //    that.publicChangeBtnStatus();
            });


            /*// 以前的接口 - 车上的订单列表
			postRequest(tmsUrl + "/provider/query/selectTaskOrderInfoPage?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,params,function(res){

		    })*/
		},
        rowDrop(orderList) {	//已分配订单拖拽
            var tbody = document.querySelector('.driverOrderListRowDrop tbody');
            var that = this;
            Sortable.create(tbody, {
                onEnd: function (evt) {  //拖拽结束发生该事件
                    that.driverOrderList.splice(evt.newIndex, 0, that.driverOrderList.splice(evt.oldIndex, 1)[0]);
                    var newArray = that.driverOrderList.slice(0);
                    that.driverOrderList = [];
                    that.$nextTick(function () {
                        that.driverOrderList = newArray;
                    });
                }
            })
        },
        sortOrderSortingFun(){ // 生成货车规划路线
            var that = this,stoLatLngNullNum = that.allPosArray.length;
            if(stoLatLngNullNum == 0){
                imitatePopup('未获取到订单收货经纬度，暂时无法规划路线！','alert');
                return false;
            }
            if(stoLatLngNullNum > 10){
                imitatePopup('送货点太多（大于10），暂时无法规划路线！','alert');
                return false;
            }

            // ================= 高德
           /* map.clearMap();  // 清除地图上所有添加的覆盖物
            $('#panel').html('');
            var truckDriving = new AMap.TruckDriving({
                map: map,
                policy: 0, // 规划策略
                size: 1, // 车型大小
                width: 2.5, // 宽度
                height: 2, // 高度
                load: 1, // 载重
                weight: 12, // 自重
                axlesNum: 2, // 轴数
                province: '沪', // 车辆牌照省份
                isOutline: true,
                outlineColor: '#ffeeee',
                panel: 'panel'
            });
            var truckPath = [],startEndPosition = [],numm = 0;  // 路线路径（第一个、最后一个 对应 起点终点），起止点（起点和终点——发货地）

            for(var i = 0; i < this.driverOrderList.length;i++){
                if(this.driverOrderList[i].sfrLatLng && numm == 0){
                    numm = 1;
                    var str = this.driverOrderList[i].sfrLatLng.split(',');
                    startEndPosition.push(str[0]);
                    startEndPosition.push(str[1]);
                }
            }

            truckPath.push({lnglat:startEndPosition});  // push 起点

            for(var ii = 0; ii < that.allPosArray.length;ii++){
                var string = that.allPosArray[ii].split(','),pointPosition = [];
                pointPosition.push(string[0]);
                pointPosition.push(string[1]);
                truckPath.push({lnglat:pointPosition});
            }

            truckPath.push({lnglat:startEndPosition});  // push 终点
         //   console.log(truckPath.length);
            truckDriving.search(truckPath, function(status, result) {
                // searchResult即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === 'complete') {
                    console.log('获取货车规划数据成功');
                } else {
                    console.log('获取货车规划数据失败：' + result)
                }
            });*/

            // ================= 百度 ++++++++++++++++++++++++++  限制：途经点不超过10个点
            map.clearOverlays();  // 清除地图上所有添加的覆盖物
            $('#r-result').html('');
			var endpointArray = [],waypointArray = [];  // 端点数组（起点和终点——发货地sfrLatLng），途经点数组（途经点——所有订单stoLatLng）
            for(var i = 0; i < this.driverOrderList.length;i++){
                var item = this.driverOrderList[i];
                if(item.sfrLatLng){
                    var string0 = item.sfrLatLng.split(',');
                    if(endpointArray.length == 0){
                        getRequestBMap('/BMap-transformLocations/' + "?coords="+string0[0]+","+string0[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                            if(data.result != undefined){
                                var pointItem0 = new BMap.Marker(new BMap.Point(data.result[0].x,data.result[0].y));
                                endpointArray.push(pointItem0);
                            }
                        });
                    }
                }
            }
            for(var ii = 0; ii < that.allPosArray.length;ii++){
                var item00 = that.allPosArray[ii];
                var string00 = item00.split(','),BMapLat00 = '',BMapLon00 = '';
                getRequestBMap('/BMap-transformLocations/' + "?coords="+string00[0]+","+string00[1]+"&from=1&to=5&ak="+BmapQdAk,function(data){
                    if(data.result != undefined){
                        BMapLat00 = data.result[0].x;
                        BMapLon00 = data.result[0].y;
                        var pointItem11 = new BMap.Marker(new BMap.Point(BMapLat00,BMapLon00));
                        waypointArray.push(pointItem11);
                    }
                });
            }
            var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, panel: "r-result",autoViewport: true}});
            driving.search(endpointArray[0], endpointArray[0],{waypoints:waypointArray});//waypoints表示途经点

            /*console.log(endpointArray);
            console.log(waypointArray);*/

            that.showSaveBtn = '1';
		},
        saveOrderSortingFun(){  // 保存排序订单
		    var that = this;
            var newSortArray = [];
            for(var i = 0; i < this.driverOrderList.length;i++){
                newSortArray.push({
                    fromOrderId:this.driverOrderList[i].fromOrderId,
                    seq:i+1,
                    toOrderId:this.driverOrderList[i].omOrderId
                })
            }
            postRequest(tmsUrl+'/driver/update/tfoOrderLnkSeq.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,newSortArray,function(res){
                var mtItem = that.selectOneBcItem;
                var driverParam = {
                    orderNo:mtItem.orderNo,
                    contactTel:mtItem.contactTel,
                    eqpNo:mtItem.eqpNo,
                    startCompleteTime:getTodayTime(),
                    endCompleteTime:getTodayTime()
                };
                postRequest(tmsUrl+'/driver/query/transportOrderPlanInfo.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,driverParam,function(res){
                    if(res.result != null){
                        if(res.result.orderInfoResVoList != null){
                            if(res.result.orderInfoResVoList.length != 0){
                                that.rowDrop(res.result.orderInfoResVoList);
                                that.driverOrderList = res.result.orderInfoResVoList;
                            }else{
                                that.driverOrderList = [];
                            }
                        }else{
                            that.driverOrderList = [];
                        }
                    }else{
                        that.driverOrderList = [];
                    }
                });
            });
        },
		getDriverOrderDetails(template,order){
			this.templateTitle = template;
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
			var searchFormArr = {};
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.pageInfo = {
				pageNum:pageNum,
				pageSize:that.queryPageSize
			}
			var that = this;
			$(".reportMessages table tr td .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            //获取订单列表
		  	postRequest(tmsUrl + "/wx/query/queryTransportMonitorPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.tableOrderList = res.result.pageModel.data;
				for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
			})
        },
		getSearchVal(){
			//订单搜索
			var that = this;
			var searchFormArr = {};
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getTodayTime();
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
			searchFormArr.startCompleteTime = startTimeVal;
			searchFormArr.endCompleteTime = endTimeVal;
			searchFormArr.pageInfo = {
				pageNum:1,
				pageSize:that.queryPageSize
            }
			//获取订单列表
		  	postRequest(tmsUrl + "/wx/query/queryTransportMonitorPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.tableOrderList = res.result.pageModel.data;
				that.currentPage = 1;
				that.pageList = [];
				$(".paging .pagingCon .pagination").animate({
					"left": "0px"
				},300);
				that.totalPagesNum = res.result.pageModel.pageInfo.total;
				for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}

				that.publicChangeBtnStatus();
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
        }
	},
	created(){
        var that = this;
        that.timeHorizon = getTodayTime()+" - "+ getTodayTime();
          var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            },
            startCompleteTime:getTodayTime(),
            endCompleteTime:getTodayTime()
        }
          that.logininf = JSON.parse(localStorage.getItem("logininf"));
          that.selectListData = getBasicData();    //获取下拉数据
          //获取订单列表
          postRequest(tmsUrl + "/wx/query/queryTransportMonitorPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result.pageModel.data;
            var loadFactor = 100;
            if(res.result.fullyLoaded != 0 && res.result.fullyLoaded != null && res.result.totalLoaded != 0 && res.result.totalLoaded != null){
                loadFactor =  ((res.result.fullyLoaded / res.result.totalLoaded) * 100).toFixed(2);
            }

            that.pageList = [];
            that.totalPagesNum = res.result.pageModel.pageInfo.total;
            that.loadFactor = loadFactor + "%";
            for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
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

// ================= 高德
// 地图
/*var map = new AMap.Map("container", {
    mapStyle: 'amap://styles/' + AmapQdStyle_white,
    zoom: 11
});
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(5, 1)}); //信息窗体
var orderReceiptMarkerArray = []; //标记订单点集合
function signalOrderClick(e) {
    infoWindow.setContent(e.target.content);
    infoWindow.open(map, e.target.getPosition());
}*/


// ================= 百度
// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(121.473658,31.230378), 11);
map.enableScrollWheelZoom(true);

var opts = {
    width : 250,     // 信息窗口宽度
    height: 80,     // 信息窗口高度
    title : "订单信息" , // 信息窗口标题
    enableMessage:true//设置允许信息窗发送短息
};
function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
        openInfo(content,e)}
    );
}
function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
    map.openInfoWindow(infoWindow,point); //开启信息窗口
}


// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});
