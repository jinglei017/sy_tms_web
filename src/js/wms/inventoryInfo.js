var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        currentPage1:1,
        tableOrderList:{},
        selectListData:{},
        clickBtnType:"",
        isDisable:false,
        searchInf:[],
        pageList:[],
        totalList:[],
        pageList1:[],
        totalPagesNum1:"",
        orderDetail:{},
        logininf:{},
        queryParam:{},
        queryParam1:{
            itemCode:"",
            itemLabel:"",
            itemNo:"",
            itemBarCode:""
        },
        currentDqIndex:"",
        itemInfoList:{},
        currentCotactIndex:"",
        templateTitle:"",
        itemSingle:{
            qtyUnit:"",
            weightUnit:"",
            volumeUnit:""
        },
        incDec:{
            incDecType:"1",
            incDecQty:""
        }
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.itemSingle = {
                qtyUnit:"",
                weightUnit:"",
                volumeUnit:""
            };
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            getRequest(wmsUrl + "/get/inventoryDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&wmInventoryId="+pdItem.wmInventoryId,function(res){
                if(res.result != null && res.result.inventory != null){
                    that.itemSingle = res.result.inventory;
                }else{
                    that.itemSingle = {
                        qtyUnit:"",
                        weightUnit:"",
                        volumeUnit:""
                    };
                }
            });
        },
        changeOrderDetails(title,pdItem,type){
            this.templateTitle = title;
            var that = this;
            switch(type)
            {
                case '0': // 修改库存
                    that.isDisable = false;
                    this.clickBtnType = "edit";
                    break;
                case '1': // 增减库存数量
                    that.isDisable = true;
                    this.clickBtnType = "incDec";
                    that.incDec = {
                        incDecType:"1",
                        incDecQty:""
                    };
                    break;
            }
            getRequest(wmsUrl + "/get/inventoryDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&wmInventoryId="+pdItem.wmInventoryId,function(res){
                if(res.result != null && res.result.inventory != null){
                    that.itemSingle = res.result.inventory;
                }else{
                    that.itemSingle = {
                        qtyUnit:"",
                        weightUnit:"",
                        volumeUnit:""
                    };
                }
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除该库存");
            if (r==true){
                getRequest(wmsUrl + "/delete/wmInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&wmInventoryId="+pdItem.wmInventoryId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:12
                        }
                    }
                    postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage > pageNum){
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage = pageNum;
                }else{
                    $(".reportMessages .paging .pagingCon .pagination").animate({
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
            }
            postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        changePage1(pageNum,clickStatus){
            //翻页
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".popupDpList .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage1 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage1 > pageNum){
                    $(".popupDpList .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }else{
                    $(".popupDpList .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }
            }else{
                this.currentPage1 = pageNum;
            }
            //翻页
            var that = this;
            var searchFormArr = this.queryParam1;
            searchFormArr.pageInfo = {
                pageNum:pageNum,
                pageSize:12
            }
            postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.itemInfoList = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
                that.totalPagesNum1 = res.pageInfo.total;
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
            }
            //获取订单列表
            postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.totalList = [];
                that.currentPage = 1;
                $(".reportMessages .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                for(var n = 0 ; n < res.pageInfo.total;n++){
                    that.totalList[n] = n + 1;
                }
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        getSearchVal1(){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam1;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:12
            };
            if(searchFormArr.itemCode == ''){
                searchFormArr.itemCode = undefined;
            }
            if(searchFormArr.itemLabel == ''){
                searchFormArr.itemLabel = undefined;
            }
            if(searchFormArr.itemNo == ''){
                searchFormArr.itemNo = undefined;
            }
            if(searchFormArr.itemBarCode == ''){
                searchFormArr.itemBarCode = undefined;
            }
            //获取订单列表
            postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.itemInfoList = res.result;
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
                that.currentPage1 = 1;
                $(".popupDpList .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);

                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        editOrderInfo(){
            var that = this;
            if(that.itemSingle.itemCode == "" || that.itemSingle.itemCode == undefined){
                imitatePopup("sku代码不能为空","alert");
                return false;
            }
            if(that.itemSingle.itemName == "" || that.itemSingle.itemName == undefined){
                imitatePopup("sku名称不能为空","alert");
                return false;
            }
            if(checkNumType(that.itemSingle.totalQty) == '正数'){

            }else{
                imitatePopup("请输入有效的总数量","alert");
                return false;
            }
            if(that.itemSingle.avaliableQty != "" && that.itemSingle.avaliableQty != undefined){
                if(checkNumType(that.itemSingle.avaliableQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的可用数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.allocatedQty != "" && that.itemSingle.allocatedQty != undefined){
                if(checkNumType(that.itemSingle.allocatedQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的已分配数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.blockedQty != "" && that.itemSingle.blockedQty != undefined){
                if(checkNumType(that.itemSingle.blockedQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的冻结数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.weight != "" && that.itemSingle.weight != undefined){
                if(checkNumType(that.itemSingle.weight) == '正数'){

                }else{
                    imitatePopup("请输入有效的重量值","alert");
                    return false;
                }
            }
            if(that.itemSingle.volume != "" && that.itemSingle.volume != undefined){
                if(checkNumType(that.itemSingle.volume) == '正数'){

                }else{
                    imitatePopup("请输入有效的体积值","alert");
                    return false;
                }
            }
            if(that.itemSingle.qtyUnit == "" || that.itemSingle.qtyUnit == undefined){
                imitatePopup("数量单位不能为空","alert");
                return false;
            }
            var paramsObj = that.itemSingle;
            //保存修改信息
            postRequest(wmsUrl + "/save/wmInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){
                // 关闭侧滑 ------ start
                closeSideslip();
                var searchFormArr = {
                    pageInfo:{
                        pageNum:that.currentPage,
                        pageSize:12
                    }
                };
                postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        editOrderInfo1(){
            var that = this;
            if(that.incDec.incDecQty == ''){
                imitatePopup("请输入有效的增减值","alert");
                return false;
            }else{
                if(checkNumType(that.incDec.incDecQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的增减值","alert");
                    return false;
                }
            }
            if(that.incDec.incDecType == '1'){ // 增
                that.incDec.incDecQty = Number(that.incDec.incDecQty);
            }
            if(that.incDec.incDecType == '0'){ // 减
                that.incDec.incDecQty = Number(that.incDec.incDecQty) * -1;
            }
            var paramsObj = {
                wmInventoryId: that.itemSingle.wmInventoryId,
                qty: that.incDec.incDecQty
            };
            //保存增减的库存数量
            postRequest(wmsUrl + "/update/changeInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭侧滑 ------ start
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:12
                        }
                    };
                    postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                imitatePopup("sku代码不能为空","alert");
                return false;
            }
            if(that.itemSingle.itemName == "" || that.itemSingle.itemName == undefined){
                imitatePopup("sku名称不能为空","alert");
                return false;
            }
            if(checkNumType(that.itemSingle.totalQty) == '正数'){

            }else{
                imitatePopup("请输入有效的总数量","alert");
                return false;
            }
            if(that.itemSingle.avaliableQty != "" && that.itemSingle.avaliableQty != undefined){
                if(checkNumType(that.itemSingle.avaliableQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的可用数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.allocatedQty != "" && that.itemSingle.allocatedQty != undefined){
                if(checkNumType(that.itemSingle.allocatedQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的已分配数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.blockedQty != "" && that.itemSingle.blockedQty != undefined){
                if(checkNumType(that.itemSingle.blockedQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的冻结数量","alert");
                    return false;
                }
            }
            if(that.itemSingle.weight != "" && that.itemSingle.weight != undefined){
                if(checkNumType(that.itemSingle.weight) == '正数'){

                }else{
                    imitatePopup("请输入有效的重量值","alert");
                    return false;
                }
            }
            if(that.itemSingle.volume != "" && that.itemSingle.volume != undefined){
                if(checkNumType(that.itemSingle.volume) == '正数'){

                }else{
                    imitatePopup("请输入有效的体积值","alert");
                    return false;
                }
            }
            if(that.itemSingle.qtyUnit == "" || that.itemSingle.qtyUnit == undefined){
                imitatePopup("数量单位不能为空","alert");
                return false;
            }
            var paramsObj = that.itemSingle;
            //保存新增信息
            postRequest(wmsUrl + "/save/wmInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingle = {
                        qtyUnit:"",
                        weightUnit:"",
                        volumeUnit:""
                    };
                    // 关闭侧滑 ------ start
                closeSideslip();
                    that.currentPage = 1;
                    $(".reportMessages .paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:1,
                            pageSize:12
                        }
                    }
                    postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        that.pageList = [];
                        that.totalList = [];
                        that.currentPage = 1;
                        $(".reportMessages .paging .pagingCon .pagination").animate({
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
        chooseItemInfoFun(){
            var that = this;
            that.queryParam1 = {
                itemCode:"",
                itemLabel:"",
                itemNo:"",
                itemBarCode:""
            };
            var searchFormArr = {
                pageInfo:{
                    pageNum:1,
                    pageSize:12
                }
            };
            postRequest(pidUrl + "/select/pageItemByItemVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.itemInfoList = res.result;
                that.pageList1 = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
                that.totalPagesNum1 = res.pageInfo.total;
                $(".maskLayer").show();
                that.publicChangeBtnStatus();
            });
        },
        selectItemInfoFun(itemInfo,index){
            var that = this;
            that.itemSingle = itemInfo;
            $(".maskLayer").hide();
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
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
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(wmsUrl + "/select/pageInventory.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
