var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
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
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"",
        itemSingle:{},
        equallyBomLists:[],
        rootBomLists:[],
        leafBomLists:[]
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.itemSingle = {};
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            getRequest(pidUrl + "/get/bomDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItem.pdItemId,function(res){
                if(res.result != null){
                    if(res.result.bom != null){
                        that.itemSingle = res.result.bom;
                    }else{
                        that.itemSingle = {};
                    }
                    if(res.result.equallyBoms != null){
                        that.equallyBomLists = res.result.equallyBoms;
                    }else{
                        that.equallyBomLists = [];
                    }
                    if(res.result.rootBoms != null){
                        that.rootBomLists = res.result.rootBoms;
                    }else{
                        that.rootBomLists = [];
                    }
                    if(res.result.leafBoms != null){
                        that.leafBomLists = res.result.leafBoms;
                    }else{
                        that.leafBomLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.equallyBomLists = [];
                    that.rootBomLists = [];
                    that.leafBomLists = [];
                }
            });
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            getRequest(pidUrl + "/get/bomDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItem.pdItemId,function(res){
                if(res.result != null){
                    if(res.result.bom != null){
                        that.itemSingle = res.result.bom;
                    }else{
                        that.itemSingle = {};
                    }
                    if(res.result.equallyBoms != null){
                        that.equallyBomLists = res.result.equallyBoms;
                    }else{
                        that.equallyBomLists = [];
                    }
                    if(res.result.rootBoms != null){
                        that.rootBomLists = res.result.rootBoms;
                    }else{
                        that.rootBomLists = [];
                    }
                    if(res.result.leafBoms != null){
                        that.leafBomLists = res.result.leafBoms;
                    }else{
                        that.leafBomLists = [];
                    }
                }else{
                    that.itemSingle = {};
                    that.equallyBomLists = [];
                    that.rootBomLists = [];
                    that.leafBomLists = [];
                }
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除该BOM");
            if (r==true){
                getRequest(pidUrl + "/delete/pdBom.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdItemId="+pdItem.pdItemId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:12
                        }
                    };
                    postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                pageSize:12
            };
            postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            var searchFormArr = this.queryParam;
            if(searchFormArr.itemCode == ''){
                searchFormArr.itemCode = undefined;
            }
            if(searchFormArr.itemName == ''){
                searchFormArr.itemName = undefined;
            }
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:12
            };
            //获取订单列表
            postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        },
        editOrderInfo(){
            var that = this;
            if(that.itemSingle.itemQty == "" || that.itemSingle.itemQty == undefined){
                imitatePopup("请输入有效的数量值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.itemQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的数量值",'alert');
                    return false;
                }
            }
            if(that.itemSingle.qtyUnit == "" || that.itemSingle.qtyUnit == undefined){
                imitatePopup("数量单位不能为空",'alert');
                return false;
            }
            var paramsObj = that.itemSingle;
            //保存修改信息
            postRequest(pidUrl + "/update/pdBom.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭侧滑 ------ start
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:12
                        }
                    };
                    postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            if(that.itemSingle.itemQty == "" || that.itemSingle.itemQty == undefined){
                imitatePopup("请输入有效的数量值",'alert');
                return false;
            }else{
                if(checkNumType(that.itemSingle.itemQty) == '正数'){

                }else{
                    imitatePopup("请输入有效的数量值",'alert');
                    return false;
                }
            }
            if(that.itemSingle.qtyUnit == "" || that.itemSingle.qtyUnit == undefined){
                imitatePopup("数量单位不能为空",'alert');
                return false;
            }
            var paramsObj = that.itemSingle;
            //保存新增信息
            postRequest(pidUrl + "/insert/pdBom.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

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
                            pageSize:12
                        }
                    };
                    postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                pageSize:12
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(pidUrl + "/select/pageBomByBomVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
