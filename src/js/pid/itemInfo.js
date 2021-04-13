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
        modelType:'-1',
        queryParamModel0:{
            prdCode:"",
            prdLabel:""
        },
        queryParamModel1:{
            propLabel:"",
            propValue:""
        },
        pdLists0:{},
        pdLists1:{},
        itemAttrLists:{},
        itemAttrValLists:{},
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"",
        itemSingle0:{
            partyCode:"",
            partyName:""
        },
        itemSingle:{
            pdPrdId:"",
            qtyUnit:"",
            weightUnit:"",
            volumeUnit:""
        },
        itemSingle1:{
            prdCode:"",
            prdLabel:""
        },
        propValueModelList:[],
        propValueModelListIndex:"",
        itemSingleBom:{
            itemQty:"",
            qtyUnit:"",
            qtyUnitName:""
        },
        bomInfoLists:[],
        equallyBomLists:[],
        rootBomLists:[],
        leafBomLists:[],
        itemAttrLnkValList:[]
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.itemSingle = {
                pdPrdId:"",
                qtyUnit:"",
                weightUnit:"",
                volumeUnit:""
            };
            that.itemSingle0 = {
                partyCode:"",
                partyName:""
            };
            that.itemSingle1 = {
                prdCode:"",
                prdLabel:""
            };
            that.propValueModelList = [];
        },
        closeMaskLayer(){
            $(".maskLayer#someSelectModel").hide();
        },
        addPropValueModelFun(){
            var that = this;
            that.propValueModelList.push({
                pdPropId:"",
                propCode:"",
                propLabel:"",
                propDesc:"",
                pdPropValueId:"",
                propValue:"",
                propValueDesc:""
            });
        },
        delPropValueModelFun(index){
            var that = this;
            that.propValueModelList.splice(index, 1);
        },
        chooseOneItemAttr(itemAttrLists,pdPropId,indexs){
            var that = this;
            $.each(itemAttrLists,function (index,item) {
                if(item.pdPropId == pdPropId){
                    that.propValueModelList[indexs].propCode = item.propCode;
                    that.propValueModelList[indexs].propLabel = item.propLabel;
                    that.propValueModelList[indexs].propDesc = item.propDesc;
                }
            });
        },
        chooseOneItemAttrVal(itemAttrValLists,pdPropValueId,indexs){
            var that = this;
            $.each(itemAttrValLists,function (index,item) {
                if(item.pdPropValueId == pdPropValueId){
                    that.propValueModelList[indexs].propValue = item.propValue;
                    that.propValueModelList[indexs].propValueDesc = item.propValueDesc;
                }
            });
        },
        chooseOnePartyCode(itemAttrLnkValList,partyCode){
            var that = this;
            $.each(itemAttrLnkValList,function (index,item){
                if(item.propValue == partyCode){
                    that.itemSingle0.partyCode = item.propValue;
                    that.itemSingle0.partyName = item.propValueDesc;
                }
            });
        },
        selectSomeModel(type,indexx){ // 获取全部产品，，，获取全部商品属性及属性值，，，获取全部属性与值关联
            var that = this,param = {};
            switch(type)
            {
                case '0': // 获取全部产品
                    that.modelType = '0';
                    that.queryParamModel0 = {
                        prdCode:"",
                        prdLabel:""
                    };
                    param = that.queryParamModel0;
                    if(param.prdCode == ''){
                        param.prdCode = undefined;
                    }
                    if(param.prdLabel == ''){
                        param.prdLabel = undefined;
                    }
                    postRequest(pidUrl + "/get/pdPrds.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.pdLists0 = res.result;
                        $(".maskLayer#someSelectModel").show();
                    });
                    break;
                case '1': // 获取全部商品属性及属性值
                    postRequest(pidUrl + "/select/listPropByPropVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.itemAttrLists = res.result;
                    });
                    var param1 = {};
                    postRequest(pidUrl + "/select/listPropValueByPropValueVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param1,function(res){
                        that.itemAttrValLists = res.result;
                    });
                    break;
                case '2': // 获取全部属性与值关联
                    that.propValueModelListIndex = indexx;
                    that.modelType = '1';
                    that.queryParamModel1 = {
                        propLabel:"",
                        propValue:""
                    };
                    param = that.queryParamModel1;
                    if(param.propLabel == ''){
                        param.propLabel = undefined;
                    }
                    if(param.propValue == ''){
                        param.propValue = undefined;
                    }
                    postRequest(pidUrl + "/select/listPropValueLnkByPropValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.pdLists1 = res.result;
                        $(".maskLayer#someSelectModel").show();
                    });
                    break;
                case '3': // 获取全部属性与值关联
                    param.propLabel = '货主';
                    postRequest(pidUrl + "/select/listPropValueLnkByPropValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                        that.itemAttrLnkValList = res.result;
                    });
                    break;
            }

        },
        getSearchModelVal0(){ // 搜索产品列表
            var that = this,param = {};
            param = that.queryParamModel0;
            if(param.prdCode == ''){
                param.prdCode = undefined;
            }
            if(param.prdLabel == ''){
                param.prdLabel = undefined;
            }
            postRequest(pidUrl + "/get/pdPrds.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.pdLists0 = res.result;
            });
        },
        getSearchModelVal1(){// 搜索商品属性与值关联列表
            var that = this,param = {};
            param = that.queryParamModel1;
            if(param.propLabel == ''){
                param.propLabel = undefined;
            }
            if(param.propValue == ''){
                param.propValue = undefined;
            }
            postRequest(pidUrl + "/select/listPropValueLnkByPropValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.pdLists1 = res.result;
            });
        },
        selectOneFun0(item,index){ // 选择某一个产品
            var that = this;
            that.itemSingle.pdPrdId = item.pdPrdId;
            that.itemSingle1.prdCode = item.prdCode;
            that.itemSingle1.prdLabel = item.prdLabel;
            $(".maskLayer#someSelectModel").hide();
        },
        selectOneFun1(items,index){// 选择某一个商品属性与值关联
            var that = this;
            $.each(that.itemAttrLists,function (index,item) {
                if(item.pdPropId == items.pdPropId){
                    that.propValueModelList[that.propValueModelListIndex].pdPropId = item.pdPropId;
                    that.propValueModelList[that.propValueModelListIndex].propLabel = item.propLabel
                    that.propValueModelList[that.propValueModelListIndex].propCode = item.propCode;
                    that.propValueModelList[that.propValueModelListIndex].propLabel = item.propLabel;
                    that.propValueModelList[that.propValueModelListIndex].propDesc = item.propDesc;
                }
            });
            $.each(that.itemAttrValLists,function (index,item) {
                if(item.pdPropValueId == items.pdPropValueId){
                    that.propValueModelList[that.propValueModelListIndex].pdPropValueId = item.pdPropValueId;
                    that.propValueModelList[that.propValueModelListIndex].propValue = item.propValue;
                    that.propValueModelList[that.propValueModelListIndex].propValueDesc = item.propValueDesc;
                }
            });

            $(".maskLayer#someSelectModel").hide();
            console.log(that.propValueModelList[that.propValueModelListIndex]);
        },
        changeBomQtyUnit(qtyUnit){
            var that = this;
            $.each(that.selectListData.qtyUnitList, function (index, item) {
                if(item.code == qtyUnit){
                    that.itemSingleBom.qtyUnitName =  item.text;
                }
            });
        },
        saveNewBomInfo(){
            var that = this;
            if(that.itemSingleBom.itemQty == "" || that.itemSingleBom.itemQty == undefined){
                imitatePopup("换算值不能为空",'alert');
                return false;
            }
            if(that.itemSingleBom.qtyUnit == "" || that.itemSingleBom.qtyUnit == undefined){
                imitatePopup("单位不能为空",'alert');
                return false;
            }
            var paramsObj = that.itemSingleBom;
            paramsObj.pdItemId = that.itemSingle.pdItemId;
            postRequest(pidUrl + "/add/itemBomInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingleBom = {
                        itemQty:"",
                        qtyUnit:"",
                        qtyUnitName:""
                    };
                    if(res.result != null){
                        that.bomInfoLists = res.result;
                    }else{
                        that.bomInfoLists = [];
                    }


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
                    postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        that.totalList = [];
                        that.currentPage = 1;
                        $(".paging .pagingCon .pagination").animate({
                            "left": "0px"
                        },300);
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                        that.publicChangeBtnStatus();
                    })
            });
        },
        getOrderDetails(title,pdItem,type){
            var pdItemId = pdItem.pdItemId,itemCode = pdItem.itemCode;
            this.templateTitle = title;
            var that = this;
            that.isDisable = true;
            switch(type)
            {
                case '0': // 详情
                    this.clickBtnType = "detail";
                    break;
                case '1': // BOM信息
                    this.clickBtnType = "detailBom";
                    that.itemSingleBom = {
                        itemQty:"",
                        qtyUnit:"",
                        qtyUnitName:""
                    };
                    break;
            }
            getRequest(pidUrl + "/get/itemDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItemId+"&itemCode="+itemCode,function(res){
                if(res.result != null){
                    if(res.result.itemInfo != null){
                        if(res.result.itemInfo.item != null){
                            that.itemSingle = res.result.itemInfo.item;
                        }else{
                            that.itemSingle = {};
                        }
                        if(res.result.itemInfo.partyCode != null){
                            that.itemSingle0.partyCode = res.result.itemInfo.partyCode;
                        }else{
                            that.itemSingle0.partyCode = "";
                        }
                        if(res.result.itemInfo.partyName != null){
                            that.itemSingle0.partyName = res.result.itemInfo.partyName;
                        }else{
                            that.itemSingle0.partyName = "";
                        }
                        if(res.result.itemInfo.bomDetailModel != null){
                            if(res.result.itemInfo.bomDetailModel.bom != null){
                                that.bomInfoLists[0] = res.result.itemInfo.bomDetailModel.bom;
                            }else{
                                that.bomInfoLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.equallyBoms != null){
                                that.equallyBomLists = res.result.itemInfo.bomDetailModel.equallyBoms;
                            }else{
                                that.equallyBomLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.rootBoms != null){
                                that.rootBomLists = res.result.itemInfo.bomDetailModel.rootBoms;
                            }else{
                                that.rootBomLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.leafBoms != null){
                                that.leafBomLists = res.result.itemInfo.bomDetailModel.leafBoms;
                            }else{
                                that.leafBomLists = [];
                            }
                        }else{
                            that.bomInfoLists = [];
                            that.equallyBomLists = [];
                            that.rootBomLists = [];
                            that.leafBomLists = [];
                        }
                        if(res.result.itemInfo.itemPropInfoModels != null){
                            that.propValueModelList = res.result.itemInfo.itemPropInfoModels;
                        }else{
                            that.propValueModelList = [];
                        }
                    }else{
                        that.itemSingle = {};
                        that.itemSingle0 = {
                            partyCode:"",
                            partyName:""
                        };
                        that.propValueModelList = [];
                        that.bomInfoLists = [];
                        that.equallyBomLists = [];
                        that.rootBomLists = [];
                        that.leafBomLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.itemSingle0 = {
                        partyCode:"",
                        partyName:""
                    };
                    that.propValueModelList = [];
                    that.bomInfoLists = [];
                    that.equallyBomLists = [];
                    that.rootBomLists = [];
                    that.leafBomLists = [];
                }
                // 根据that.itemSingle 的 pdPrdId 获取该商品所属产品的产品代码、产品名称
                if(that.itemSingle.pdPrdId != '' && that.itemSingle.pdPrdId != null && that.itemSingle.pdPrdId != undefined){
                    var param = {
                        pdPrdId: that.itemSingle.pdPrdId
                    };
                    postRequest(pidUrl + "/get/pdPrds.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                        if(data != null){
                            if(data.result != null){
                                if(data.result.length > 0){
                                    that.itemSingle1 = data.result[0];
                                }else{
                                    that.itemSingle1 = data.result;
                                }
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
            getRequest(pidUrl + "/get/itemDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItem.pdItemId+"&itemCode="+pdItem.itemCode,function(res){
                if(res.result != null){
                    if(res.result.itemInfo != null){
                        if(res.result.itemInfo.item != null){
                            that.itemSingle = res.result.itemInfo.item;
                        }else{
                            that.itemSingle = {};
                        }
                        if(res.result.itemInfo.partyCode != null){
                            that.itemSingle0.partyCode = res.result.itemInfo.partyCode;
                        }else{
                            that.itemSingle0.partyCode = "";
                        }
                        if(res.result.itemInfo.partyName != null){
                            that.itemSingle0.partyName = res.result.itemInfo.partyName;
                        }else{
                            that.itemSingle0.partyName = "";
                        }
                        if(res.result.itemInfo.bomDetailModel != null){
                            if(res.result.itemInfo.bomDetailModel.bom != null){
                                that.bomInfoLists[0] = res.result.itemInfo.bomDetailModel.bom;
                            }else{
                                that.bomInfoLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.equallyBoms != null){
                                that.equallyBomLists = res.result.itemInfo.bomDetailModel.equallyBoms;
                            }else{
                                that.equallyBomLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.rootBoms != null){
                                that.rootBomLists = res.result.itemInfo.bomDetailModel.rootBoms;
                            }else{
                                that.rootBomLists = [];
                            }
                            if(res.result.itemInfo.bomDetailModel.leafBoms != null){
                                that.leafBomLists = res.result.itemInfo.bomDetailModel.leafBoms;
                            }else{
                                that.leafBomLists = [];
                            }
                        }else{
                            that.bomInfoLists = [];
                            that.equallyBomLists = [];
                            that.rootBomLists = [];
                            that.leafBomLists = [];
                        }
                        if(res.result.itemInfo.itemPropInfoModels != null){
                            that.propValueModelList = res.result.itemInfo.itemPropInfoModels;
                        }else{
                            that.propValueModelList = [];
                        }
                    }else{
                        that.itemSingle = {};
                        that.itemSingle0 = {
                            partyCode:"",
                            partyName:""
                        };
                        that.propValueModelList = [];
                        that.bomInfoLists = [];
                        that.equallyBomLists = [];
                        that.rootBomLists = [];
                        that.leafBomLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.itemSingle0 = {
                        partyCode:"",
                        partyName:""
                    };
                    that.propValueModelList = [];
                    that.bomInfoLists = [];
                    that.equallyBomLists = [];
                    that.rootBomLists = [];
                    that.leafBomLists = [];
                }
                // 根据that.itemSingle 的 pdPrdId 获取该商品所属产品的产品代码、产品名称
                if(that.itemSingle.pdPrdId != '' && that.itemSingle.pdPrdId != null && that.itemSingle.pdPrdId != undefined){
                    var param = {
                        pdPrdId: that.itemSingle.pdPrdId
                    };
                    postRequest(pidUrl + "/get/pdPrds.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(data){
                        if(data != null){
                            if(data.result != null){
                                if(data.result.length > 0){
                                    that.itemSingle1 = data.result[0];
                                }else{
                                    that.itemSingle1 = data.result;
                                }
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
            var r = confirm("确定删除商品");
            if (r==true){
                getRequest(pidUrl + "/delete/itemInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItem.pdItemId,function(res){

                        //获取订单列表
                        var searchFormArr = {
                            pageInfo:{
                                pageNum: that.currentPage,
                                pageSize:that.queryPageSize
                            }
                        }
                        postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            }
            postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        getSearchVal(){
            //订单搜索
            var that = this;
            var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
				that.multipleNum = that.queryPageSize;
	            var searchFormArr = this.queryParam;
	            searchFormArr.pageInfo = {
	                pageNum:1,
	                pageSize:that.queryPageSize
	            }
	            //获取订单列表
	            postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        editOrderInfo(){ //保存修改信息-基本信息 （暂时不改商品属性信息）
            var that = this;
            if(that.itemSingle.itemCode == "" || that.itemSingle.itemCode == undefined){
                imitatePopup("商品编码不能为空",'alert');
                return false;
            }
            if(that.itemSingle.itemName == "" || that.itemSingle.itemName == undefined){
                imitatePopup("商品名称不能为空",'alert');
                return false;
            }
            if(that.itemSingle.itemLabel == "" || that.itemSingle.itemLabel == undefined){
                imitatePopup("商品标签不能为空",'alert');
                return false;
            }
            if(that.itemSingle.pdPrdId == "" || that.itemSingle.pdPrdId == undefined){
                imitatePopup("请选择商品所属的产品",'alert');
                return false;
            }
            if(that.itemSingle0.partyCode == "" || that.itemSingle0.partyCode == undefined){
                imitatePopup("请选择货主",'alert');
                return false;
            }
            if(that.itemSingle.weight == "" || that.itemSingle.weight == undefined){
                imitatePopup("请输入有效的重量值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.weight) == '正数'){

                }else{
                    imitatePopup("请输入有效的重量值",'alert');
                    return false;
                }
            }
            if(that.itemSingle.volume == "" || that.itemSingle.volume == undefined){
                imitatePopup("请输入有效的体积值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.volume) == '正数'){

                }else{
                    imitatePopup("请输入有效的体积值",'alert');
                    return false;
                }
            }
            var paramsObj = that.itemSingle;
            paramsObj.partyCode = that.itemSingle0.partyCode;
            paramsObj.partyName = that.itemSingle0.partyName;
            //保存修改信息
            postRequest(pidUrl + "/update/pdItem.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭侧滑 ------ start
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            if(that.itemSingle.itemCode == "" || that.itemSingle.itemCode == undefined){
                imitatePopup("商品编码不能为空",'alert');
                return false;
            }
            if(that.itemSingle.itemName == "" || that.itemSingle.itemName == undefined){
                imitatePopup("商品名称不能为空",'alert');
                return false;
            }
            if(that.itemSingle.itemLabel == "" || that.itemSingle.itemLabel == undefined){
                imitatePopup("商品标签不能为空",'alert');
                return false;
            }
            if(that.itemSingle.pdPrdId == "" || that.itemSingle.pdPrdId == undefined){
                imitatePopup("请选择商品所属的产品",'alert');
                return false;
            }
            if(that.itemSingle0.partyCode == "" || that.itemSingle0.partyCode == undefined){
                imitatePopup("请选择货主",'alert');
                return false;
            }
            if(that.itemSingle.weight == "" || that.itemSingle.weight == undefined){
                imitatePopup("请输入有效的重量值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.weight) == '正数'){

                }else{
                    imitatePopup("请输入有效的重量值",'alert');
                    return false;
                }
            }
            if(that.itemSingle.volume == "" || that.itemSingle.volume == undefined){
                imitatePopup("请输入有效的体积值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.volume) == '正数'){

                }else{
                    imitatePopup("请输入有效的体积值",'alert');
                    return false;
                }
            }
            var paramsObj = {
                item: that.itemSingle,
                itemPropInfoModels:that.propValueModelList
            };
            paramsObj.partyCode = that.itemSingle0.partyCode;
            paramsObj.partyName = that.itemSingle0.partyName;
            //保存新增信息
            postRequest(pidUrl + "/add/itemInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingle = {
                        pdPrdId:""
                    };
                    that.itemSingle0 = {
                        partyCode:"",
                        partyName:""
                    };
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
                    postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        that.totalList = [];
                        that.currentPage = 1;
                        $(".paging .pagingCon .pagination").animate({
                            "left": "0px"
                        },300);
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
        }
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.selectSomeModel('1');
        that.selectSomeModel('3');
        //获取订单列表
        postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
