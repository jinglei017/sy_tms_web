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
        itemAttrLists:{},
        itemAttrValLists:{},
        itemSingleList:[{
            pdSpecId:"",
            specCode:"",
            specLabel:"",
            specDesc:"",
            pdSpecValueId:"",
            specValue:"",
            specValueDesc:""
        }]
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.itemSingleList = [{
                pdSpecId:"",
                specCode:"",
                specLabel:"",
                specDesc:"",
                pdSpecValueId:"",
                specValue:"",
                specValueDesc:""
            }]
        },
        selectSomeModel(){ // 获取全部产品属性及属性值
            var that = this,param = {};
            postRequest(pidUrl + "/select/listSpecBySpecVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.itemAttrLists = res.result;
            });
            postRequest(pidUrl + "/select/listSpecValueBySpecValueVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.itemAttrValLists = res.result;
            });
        },
        chooseOneProAttr(itemAttrLists,pdSpecId){
            var that = this;
            $.each(itemAttrLists,function (index,item) {
                if(item.pdSpecId == pdSpecId){
                    that.itemSingleList[0].specCode = item.specCode;
                    that.itemSingleList[0].specLabel = item.specLabel;
                    that.itemSingleList[0].specDesc = item.specDesc;
                }
            });
        },
        chooseOneProAttrVal(itemAttrValLists,pdSpecValueId){
            var that = this;
            $.each(itemAttrValLists,function (index,item) {
                if(item.pdSpecValueId == pdSpecValueId){
                    that.itemSingleList[0].specValue = item.specValue;
                    that.itemSingleList[0].specValueDesc = item.specValueDesc;
                }
            });
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.itemSingleList = [];
            getRequest(pidUrl + "/get/pdSpecValueLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdSpecValueLnkId="+pdItem.pdSpecValueLnkId,function(res){
                if(res.result != null){
                    that.itemSingleList.push(res.result);
                    $.each(that.itemAttrLists,function (index,item) {
                        if(item.pdSpecId == that.itemSingleList[0].pdSpecId){
                            that.itemSingleList[0].pdSpecId = item.pdSpecId;
                            that.itemSingleList[0].specCode = item.specCode;
                            that.itemSingleList[0].specLabel = item.specLabel;
                            that.itemSingleList[0].specDesc = item.specDesc;
                        }
                    });
                    $.each(that.itemAttrValLists,function (index,item) {
                        if(item.pdSpecValueId == that.itemSingleList[0].pdSpecValueId){
                            that.itemSingleList[0].pdSpecValueId = item.pdSpecValueId;
                            that.itemSingleList[0].specValue = item.specValue;
                            that.itemSingleList[0].specValueDesc = item.specValueDesc;
                        }
                    });
                }else{
                    that.itemSingleList = [{
                        pdSpecId:"",
                        specCode:"",
                        specLabel:"",
                        specDesc:"",
                        pdSpecValueId:"",
                        specValue:"",
                        specValueDesc:""
                    }]
                }
            });
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.itemSingleList = [];
            getRequest(pidUrl + "/get/pdSpecValueLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdSpecValueLnkId="+pdItem.pdSpecValueLnkId,function(res){
                if(res.result != null){
                    that.itemSingleList.push(res.result);
                    $.each(that.itemAttrLists,function (index,item) {
                        if(item.pdSpecId == that.itemSingleList[0].pdSpecId){
                            that.itemSingleList[0].pdSpecId = item.pdSpecId;
                            that.itemSingleList[0].specCode = item.specCode;
                            that.itemSingleList[0].specLabel = item.specLabel;
                            that.itemSingleList[0].specDesc = item.specDesc;
                        }
                    });
                    $.each(that.itemAttrValLists,function (index,item) {
                        if(item.pdSpecValueId == that.itemSingleList[0].pdSpecValueId){
                            that.itemSingleList[0].pdSpecValueId = item.pdSpecValueId;
                            that.itemSingleList[0].specValue = item.specValue;
                            that.itemSingleList[0].specValueDesc = item.specValueDesc;
                        }
                    });
                }else{
                    that.itemSingleList = [{
                        pdSpecId:"",
                        specCode:"",
                        specLabel:"",
                        specDesc:"",
                        pdSpecValueId:"",
                        specValue:"",
                        specValueDesc:""
                    }]
                }
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除该产品属性模板");
            if (r==true){
                getRequest(pidUrl + "/delete/pdSpecValueLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdSpecValueLnkId="+pdItem.pdSpecValueLnkId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:12
                        }
                    };
                    postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            if(searchFormArr.specLabel == ''){
                searchFormArr.specLabel = undefined;
            }
            if(searchFormArr.specValue == ''){
                searchFormArr.specValue = undefined;
            }
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:12
            };
            //获取订单列表
            postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            if(that.itemSingleList[0].specLabel == "" || that.itemSingleList[0].specLabel == undefined){
                imitatePopup("产品属性不能为空",'alert');
                return false;
            }
            if(that.itemSingleList[0].specValue == "" || that.itemSingleList[0].specValue == undefined){
                imitatePopup("产品属性值不能为空",'alert');
                return false;
            }
            var paramsObj = that.itemSingleList[0];
            //保存修改信息
            postRequest(pidUrl + "/update/pdSpecValueLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭侧滑 ------ start
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:12
                        }
                    };
                    postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            if(that.itemSingleList[0].specLabel == "" || that.itemSingleList[0].specLabel == undefined){
                imitatePopup("产品属性不能为空",'alert');
                return false;
            }
            if(that.itemSingleList[0].specValue == "" || that.itemSingleList[0].specValue == undefined){
                imitatePopup("产品属性值不能为空",'alert');
                return false;
            }
            var paramsObj = that.itemSingleList[0];
            //保存新增信息
            postRequest(pidUrl + "/insert/pdSpecValueLnk.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingleList = [{
                        pdSpecId:"",
                        specCode:"",
                        specLabel:"",
                        specDesc:"",
                        pdSpecValueId:"",
                        specValue:"",
                        specValueDesc:""
                    }];
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
                    postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        that.selectSomeModel();
        //获取订单列表
        postRequest(pidUrl + "/select/pageSpecValueLnkBySpecValueLnkVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
