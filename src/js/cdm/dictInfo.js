var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:20,
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
        dictLocation:{
            isActive:""
        },
        currentCotactIndex:"",
        templateTitle:"新增数据字典",
        itemSingle:{},
        clearShow:true,
        showTableList:false,
        showTableFieldList:false,
        tableList:[],
        tableFieldList:[]
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal();
        },
    },
    methods:{
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
            fileUploadRequest(cmdUrl + '/import/dictData.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,function(res){
                that.filesUploadSuc();
            });
        },
        filesUploadSuc(){
            var that = this;
            that.clearShow = true;
            setTimeout(function(){
                $(".fileUploadLi #inputBox1").css({"display":"inline-block"});
            },100);
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageNum: 1,
                pageSize:that.queryPageSize
            };
            postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        },
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.dictLocation = {
                tableName:"",
                columnName:""
            };
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            getRequest(cmdUrl + "/get/cdDict.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdDictId="+pdItem.cdDictId,function(res){
                that.dictLocation = res.result;
            });
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            getRequest(cmdUrl + "/get/cdDict.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdDictId="+pdItem.cdDictId,function(res){
                that.dictLocation = res.result;
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除当前数据字典");
            if (r==true){
                getRequest(cmdUrl + "/delete/cdDict.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&cdDictId="+pdItem.cdDictId,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
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
            postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            }
            //获取订单列表
            postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        editOrderInfo(){ // 保存修改
            var that = this;
            postRequest(cmdUrl + "/update/cdDict.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.dictLocation,function(res){
                    that.dictLocation = res.result;
                    // 关闭侧滑 ------ start
                closeSideslip();
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    var searchFormArr = that.queryParam;
                    searchFormArr.pageInfo = {
                        pageNum: that.currentPage,
                        pageSize:that.queryPageSize
                    };
                    postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        saveNewOrderInfo(){ // 保存新增
            var that = this;
            postRequest(cmdUrl + "/save/cdDict.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.dictLocation,function(res){
                    that.dictLocation = res.result;
                    // 关闭侧滑 ------ start
                closeSideslip();
                    that.currentPage = 1;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    var searchFormArr = that.queryParam;
                    searchFormArr.pageInfo = {
                        pageNum: 1,
                        pageSize:that.queryPageSize
                    };
                    postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        getTableInfo(val){  //按下键的时候获取表信息
            var that = this;
            var tableInfo = {
                tableName:"table",
                columnName:val
            };
            setTimeout(function() {
                postRequest(cmdUrl + "/get/dictEnumVoByDictEnumVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, tableInfo, function (res) {
                    that.tableList = [];
                    that.showTableList = true;
                    if (res.result.length > 0) {
                        that.tableList = res.result;
                    }
                })
            },200)
        },

        chooseTable(tableInfo){ // 选择table
            this.dictLocation.tableName = tableInfo.columnName;
            this.showTableList = false;
        },
        getTableFieldInfo(val){  //按下键的时候获取表字段信息
            var that = this;
            var tableInfo = {
                tableName:this.dictLocation.tableName,
                columnName:val
            };
            setTimeout(function() {
                postRequest(cmdUrl + "/get/dictEnumVoByDictEnumVo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, tableInfo, function (res) {
                    that.tableFieldList = [];
                    that.showTableFieldList = true;
                    if (res.result.length > 0) {
                        that.tableFieldList = res.result;
                    }
                })
            },200)
        },

        chooseTableField(tableFieldInfo){ // 选择table
            this.dictLocation.columnName = tableFieldInfo.columnName;
            this.dictLocation.code = tableFieldInfo.code;
            this.dictLocation.text = tableFieldInfo.codeDesc;
            this.dictLocation.description = tableFieldInfo.codeDesc;
            this.showTableFieldList = false;
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
        resetBasicData(){
            var that = this;
            var r = confirm("你确定要覆盖当前租户下用户的基础数据吗？");
            if(!r){
                return false;
            }
            getRequest(cmdUrl + "/reset/basicData.json?token="+that.logininf.token,function(data){
                imitatePopup(data.msg,'alert');
            })
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
        //获取订单列表
        postRequest(cmdUrl + "/select/pageDictByDictVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
