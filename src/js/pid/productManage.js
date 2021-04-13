var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:12,
	    multipleNum:12,
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isDisable:false,
        searchInf:[],
        pageList:[],
        totalList:[],
        orderDetail:{},
        logininf:{},
        queryParam:{},
        modelType:"-1",
        queryParamModel0:{
            brandCode:"",
            brandLabel:""
        },
        queryParamModel1:{
            catCode:"",
            catLabel:""
        },
        modelList0:{},
        modelList1:{},
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"",
        itemSingle:{},
        itemSingle0:{},
        itemSingle1:{},
        itemAttrLists:{},
        itemAttrValLists:{},
        propValueModelList:[],
        equallyPrdLists:[],
        rootPrdLists:[],
        leafPrdLists:[]
    },
    methods:{
        addPropValueModelFun(){
            var that = this;
            that.propValueModelList.push({
                pdSpecId:"",
                specCode:"",
                specLabel:"",
                specDesc:"",
                pdSpecValueId:"",
                specValue:"",
                specValueDesc:""
            });
        },
        delPropValueModelFun(index){
            var that = this;
            that.propValueModelList.splice(index, 1);
        },
        selectSomeModel1(){ // 获取全部产品属性及属性值
            var that = this,param = {};
            postRequest(pidUrl + "/get/pdSpecs.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.itemAttrLists = res.result;
            });
            postRequest(pidUrl + "/get/pdSpecValues.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.itemAttrValLists = res.result;
            });
        },
        chooseOneItemAttr(itemAttrLists,pdPropId,indexs){
            var that = this;
            $.each(itemAttrLists,function (index,item) {
                if(item.pdPropId == pdPropId){
                    that.propValueModelList[indexs].specCode = item.specCode;
                    that.propValueModelList[indexs].specLabel = item.specLabel;
                    that.propValueModelList[indexs].specDesc = item.specDesc;
                }
            });
        },
        chooseOneItemAttrVal(itemAttrValLists,pdPropValueId,indexs){
            var that = this;
            $.each(itemAttrValLists,function (index,item) {
                if(item.pdPropValueId == pdPropValueId){
                    that.propValueModelList[indexs].specValue = item.specValue;
                    that.propValueModelList[indexs].specValueDesc = item.specValueDesc;
                }
            });
        },
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.itemSingle = {};
            that.itemSingle0 = {};
            that.itemSingle1 = {};
            that.propValueModelList = [];
        },
        closeMaskLayer(){
            $(".maskLayer#someSelectModel").hide();
        },
        selectSomeModel(type){ // 获取全部品牌，，，获取全部品类
            var that = this,param = {};
            that.modelType = type;
            switch(type)
            {
                case '0': // 获取全部品牌
                    that.queryParamModel0 = {
                        brandCode:"",
                        brandLabel:""
                    };
                    param = that.queryParamModel0;
                    if(param.brandCode == ''){
                        param.brandCode = undefined;
                    }
                    if(param.brandLabel == ''){
                        param.brandLabel = undefined;
                    }
                    postRequest(pidUrl + "/select/listBrandByBrandVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.modelList0 = res.result;
                        $(".maskLayer#someSelectModel").show();
                    });
                    break;
                case '1': // 获取全部品类
                    that.queryParamModel1 = {
                        catCode:"",
                        catLabel:""
                    };
                    param = that.queryParamModel1;
                    postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.modelList1 = res.result;
                        $(".maskLayer#someSelectModel").show();
                    });
                    break;
            }

        },
        getSearchModelVal0(){ // 搜索品牌列表
            var that = this,param = {};
            param = that.queryParamModel0;
            if(param.pdBrandId == ''){
                param.pdBrandId = undefined;
            }
            if(param.brandCode == ''){
                param.brandCode = undefined;
            }
            if(param.brandLabel == ''){
                param.brandLabel = undefined;
            }
            postRequest(pidUrl + "/select/listBrandByBrandVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.modelList0 = res.result;
            });
        },
        getSearchModelVal1(){ // 搜索品类列表
            var that = this,param = {};
            param = that.queryParamModel1;
            postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.modelList1 = res.result;
            });
        },
        selectOneFun0(item,index){ // 选择一个品牌
            var that = this;
            that.itemSingle.pdBrandId = item.pdBrandId;
            that.itemSingle0 = item;
            that.closeMaskLayer();
        },
        selectOneFun1(item,index){ // 选择一个品类
            var that = this;
            that.itemSingle.pdCatId = item.pdCatId;
            that.itemSingle1 = item;
            that.closeMaskLayer();
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            getRequest(pidUrl + "/get/prdDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdPrdId="+pdItem.pdPrdId,function(res){
                if(res.result != null){
                    if(res.result.prdInfo != null){
                        if(res.result.prdInfo.prd != null){
                            that.itemSingle = res.result.prdInfo.prd;
                        }else{
                            that.itemSingle = {};
                        }
                        if(res.result.prdInfo.prdSpecInfoModels != null){
                            that.propValueModelList = res.result.prdInfo.prdSpecInfoModels;
                        }else{
                            that.propValueModelList = {};
                        }
                    }else{
                        that.itemSingle = {};
                        that.propValueModelList = [];
                    }
                    if(res.result.equallyPrds != null){
                        that.equallyPrdLists = res.result.equallyPrds;
                    }else{
                        that.equallyPrdLists = [];
                    }
                    if(res.result.rootPrds != null){
                        that.rootPrdLists = res.result.rootPrds;
                    }else{
                        that.rootPrdLists = [];
                    }
                    if(res.result.leafPrds != null){
                        that.leafPrdLists = res.result.leafPrds;
                    }else{
                        that.leafPrdLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.propValueModelList = [];
                    that.equallyPrdLists = [];
                    that.rootPrdLists = [];
                    that.leafPrdLists = [];
                }
                // 根据that.itemSingle 的 品牌id (pdBrandId)获取该产品所属品牌的品牌名称brandLabel
                if(that.itemSingle.pdBrandId != '' && that.itemSingle.pdBrandId != null && that.itemSingle.pdBrandId != undefined){
                    var param0 = {
                        pdBrandId: that.itemSingle.pdBrandId
                    };
                    postRequest(pidUrl + "/select/listBrandByBrandVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param0,function(data){
                        if(data != null){
                            if(data.result != null && data.result.length != 0){
                                that.itemSingle0 = data.result[0];
                            }else{
                                that.itemSingle0 = {};
                            }
                        }else{
                            that.itemSingle0 = {};
                        }
                    });
                }else{
                    that.itemSingle0 = {};
                }
                // 根据that.itemSingle 的 品类id(pdCatId) 获取该产品所属类的品类标签catLabel
                if(that.itemSingle.pdCatId != '' && that.itemSingle.pdCatId != null && that.itemSingle.pdCatId != undefined){
                    var param1 = {
                        pdCatId: that.itemSingle.pdCatId
                    };
                    postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param1,function(data){
                        if(data != null){
                            if(data.result != null && data.result.length != 0){
                                that.itemSingle1 = data.result[0];
                            }else{
                                that.itemSingle1 = {};
                            }
                        }else{
                            that.itemSingle1 = {};
                        }
                    });
                }else{
                    that.itemSingle1 = {};
                }
            });
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            getRequest(pidUrl + "/get/prdDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdPrdId="+pdItem.pdPrdId,function(res){
                if(res.result != null){
                    if(res.result.prdInfo != null){
                        if(res.result.prdInfo.prd != null){
                            that.itemSingle = res.result.prdInfo.prd;
                        }else{
                            that.itemSingle = {};
                        }
                        if(res.result.prdInfo.prdSpecInfoModels != null){
                            that.propValueModelList = res.result.prdInfo.prdSpecInfoModels;
                        }else{
                            that.propValueModelList = {};
                        }
                    }else{
                        that.itemSingle = {};
                        that.propValueModelList = [];
                    }
                    if(res.result.equallyPrds != null){
                        that.equallyPrdLists = res.result.equallyPrds;
                    }else{
                        that.equallyPrdLists = [];
                    }
                    if(res.result.rootPrds != null){
                        that.rootPrdLists = res.result.rootPrds;
                    }else{
                        that.rootPrdLists = [];
                    }
                    if(res.result.leafPrds != null){
                        that.leafPrdLists = res.result.leafPrds;
                    }else{
                        that.leafPrdLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.propValueModelList = [];
                    that.equallyPrdLists = [];
                    that.rootPrdLists = [];
                    that.leafPrdLists = [];
                }
                // 根据that.itemSingle 的 品牌id (pdBrandId)获取该产品所属品牌的品牌名称brandLabel
                if(that.itemSingle.pdBrandId != '' && that.itemSingle.pdBrandId != null && that.itemSingle.pdBrandId != undefined){
                    var param0 = {
                        pdBrandId: that.itemSingle.pdBrandId
                    };
                    postRequest(pidUrl + "/select/listBrandByBrandVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param0,function(data){
                        if(data != null){
                            if(data.result != null && data.result.length != 0){
                                that.itemSingle0 = data.result[0];
                            }else{
                                that.itemSingle0 = {};
                            }
                        }else{
                            that.itemSingle0 = {};
                        }
                    });
                }else{
                    that.itemSingle0 = {};
                }
                // 根据that.itemSingle 的 品类id(pdCatId) 获取该产品所属类的品类标签catLabel
                if(that.itemSingle.pdCatId != '' && that.itemSingle.pdCatId != null && that.itemSingle.pdCatId != undefined){
                    var param1 = {
                        pdCatId: that.itemSingle.pdCatId
                    };
                    postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param1,function(data){
                        if(data != null){
                            if(data.result != null && data.result.length != 0){
                                that.itemSingle1 = data.result[0];
                            }else{
                                that.itemSingle1 = {};
                            }
                        }else{
                            that.itemSingle1 = {};
                        }
                    });
                }else{
                    that.itemSingle1 = {};
                }
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除该产品");
            if (r==true){
                getRequest(pidUrl + "/delete/prdInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdPrdId="+pdItem.pdPrdId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        that.totalList = [];
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
                })
            }
        },
        changePage(pageNum,clickStatus){
            //翻页
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
                pageSize:that.queryPageSize
            };
            postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(){ //搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
				that.multipleNum = that.queryPageSize;
	            var searchFormArr = this.queryParam;
	            if(searchFormArr.prdCode == ''){
	                searchFormArr.prdCode = undefined;
	            }
	            if(searchFormArr.prdLabel == ''){
	                searchFormArr.prdLabel = undefined;
	            }
	            searchFormArr.pageInfo = {
	                pageNum:1,
	                pageSize:that.queryPageSize
	            };
	            //获取订单列表
	            postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
	                that.tableOrderList = res.result;
	                that.pageList = [];
	                for(var i = 0 ; i < res.pageInfo.pages;i++){
	                    that.pageList[i] = i + 1;
	                }
	                that.totalList = [];
	                that.currentPage = 1;
	                $(".paging .pagingCon .pagination").animate({
	                    "left": "0px"
	                },300);
	                for(var n = 0 ; n < res.pageInfo.total;n++){
	                    that.totalList[n] = n + 1;
	                }
	                that.publicChangeBtnStatus();
	            })
	        }else{
				imitatePopup("请输入大于1且小于2000的正整数",'alert');
		        return false;
			}
        },
        editOrderInfo(){
            var that = this;
            if(that.itemSingle.prdCode == "" || that.itemSingle.prdCode == undefined){
                imitatePopup("产品代码不能为空",'alert');
                return false;
            }
            if(that.itemSingle.prdLabel == "" || that.itemSingle.prdLabel == undefined){
                imitatePopup("产品名称不能为空",'alert');
                return false;
            }
          //  var paramsObj = that.itemSingle;
            var paramsObj = {
                prd: that.itemSingle,
                prdSpecInfoModels:that.propValueModelList
            };
            //保存修改信息
            postRequest(pidUrl + "/update/pdPrd.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭侧滑 ------ start
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
            })
        },
        saveNewOrderInfo(){
            var that = this;
            if(that.itemSingle.prdCode == "" || that.itemSingle.prdCode == undefined){
                imitatePopup("产品代码不能为空",'alert');
                return false;
            }
            if(that.itemSingle.prdLabel == "" || that.itemSingle.prdLabel == undefined){
                imitatePopup("产品名称不能为空",'alert');
                return false;
            }
            var paramsObj = {
                prd: that.itemSingle,
                prdSpecInfoModels:that.propValueModelList
            };
            //保存新增信息
            postRequest(pidUrl + "/add/prdInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingle = {};
                    // 关闭侧滑 ------ start
                closeSideslip();
                    that.currentPage = 1;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:1,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
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
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.selectSomeModel1();
        //获取订单列表
        postRequest(pidUrl + "/select/pagePrdByPrdVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
            for(var n = 0 ; n < res.pageInfo.total;n++){
                that.totalList[n] = n + 1;
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
