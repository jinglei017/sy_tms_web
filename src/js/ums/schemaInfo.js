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
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"新增联系人",
        schemaInfo:"",
        queryParam:{},
        queryPageSize: 20,
        multipleNum: 12,
        checkedOperaOrder:[],
        checkedNum:0,
        allChecked:false,
        popupType:"",
        roleCode:"",
        tableOrderCode:"",
        judge:0
    },
    methods:{
        syncBaseMenuOneFun(tableOrderItem){
            var that = this;
            that.judge = 0;
            that.orderAuditStatus();
            this.tableOrderCode = tableOrderItem;
        },
        orderAuditStatus(){
            var that = this;
            that.popupType = 'orderAudit';
            $(".maskLayer1").show();
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        qxInput(){
            this.roleCode = "";
            this.closeMaskLayer();
        },
        judgeInput(){
            var that = this;
            if(this.roleCode == ""){
                imitatePopup("角色编码不能为空","alert");
            }else{
                var paramsInfo = {
                	umTenantId: that.tableOrderCode.umTenantId,
                	tenantCode: that.tableOrderCode.tenantCode,
                	tenantName: that.tableOrderCode.tenantName,
                	tenantNo: that.tableOrderCode.tenantNo,
                    roleCode: that.roleCode
                };
                postRequest(umsUrl + "/save/syncBaseMenu.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsInfo,function(data){
                    that.resetOrderList();
                });
            }
        },
        syncBaseMenuFun(){
            var that = this;
            that.popupType = 'orderAudit';
            that.orderAuditStatus();
            that.judge = 1;
        },
        judgeInput1(){
            var that = this;
            tenants = [];
            if(this.roleCode == ""){
                imitatePopup("角色编码不能为空","alert");
            }else{
                for(var i = 0; i < that.checkedOperaOrder.length;i++){
                    tenants.push({
                        umTenantId: that.checkedOperaOrder[i].umTenantId,
                        tenantCode: that.checkedOperaOrder[i].tenantCode,
                        tenantName: that.checkedOperaOrder[i].tenantName,
                        tenantNo: that.checkedOperaOrder[i].tenantNo
                        });
                }
                var paramsInfo = {
                    roleCode: that.roleCode,
                    tenants: tenants
                };
                postRequest(umsUrl + "/save/batchSyncBaseMenu.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsInfo,function(data){
                    that.resetOrderList();
                })
            }
        },
        addOrderCarrierHint(){
            imitatePopup("请先勾选至少一条订单行！","alert");
        },
        textboxAllSelectionFun(allChecked){
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            if(allChecked == false){
                that.checkedOperaOrder = [];
                for(var i = 0; i < that.tableOrderList.length;i++){
                    that.checkedOperaOrder.push(that.tableOrderList[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.checkedOperaOrder.length;
            }else{
                for(var ii = 0; ii < that.tableOrderList.length;ii++){
                    that.checkedOperaOrder.splice($.inArray(that.tableOrderList[ii],that.checkedOperaOrder),1)
                }
                that.allChecked = false;
                that.checkedNum = that.checkedOperaOrder.length;
            }
        },
        textboxSelectionFun(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedOperaOrder.push(orderItem);
            }else{
                that.checkedOperaOrder.splice($.inArray(orderItem,that.checkedOperaOrder),1)
            }
            that.checkedNum = that.checkedOperaOrder.length;
            if(that.checkedNum == $(".reportMessages table tr.see").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
        },
        getOrderDetails(title,dpItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            this.schemaInfo = dpItem;
        },
        changeOrderDetails(title,dpItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            this.schemaInfo = dpItem;
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
            that.allChecked = false;
            var searchFormArr = this.queryParam;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            //获取订单列表
            postRequest(umsUrl + "/select/pageTenantByTenantVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                $(".reportMessages input[type='checkbox']").prop('checked',false);
                that.pageList = [];
                that.checkedOperaOrder = [];
                that.checkedNum = 0;
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
            that.allChecked = false;
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
	            postRequest(umsUrl + "/select/pageTenantByTenantVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
	                that.tableOrderList = res.result;
	                that.pageList = [];
	                that.checkedOperaOrder = [];
	                that.checkedNum = 0;
	                $(".reportMessages input[type='checkbox']").prop('checked',false);
	                for(var i = 0 ; i < res.pageInfo.pages;i++){
	                    that.pageList[i] = i + 1;
	                }
	                that.currentPage = 1;
	                $(".paging .pagingCon .pagination").animate({
	                    "left": "0px"
	                },300);
	                that.totalList = [];
	                for(var n = 0 ; n < res.pageInfo.total;n++){
	                    that.totalList[n] = n + 1;
	                }
	                that.publicChangeBtnStatus();
                    $(".collUnfold").hide();
	            })
            }else{
                imitatePopup("请输入大于1且小于2000的正整数","alert");
                return false;
            }
        },
        editOrderInfo(){
            var that = this;
            postRequest(umsUrl + "/update/tenant.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,this.schemaInfo,function(res){

                // 关闭侧滑 ------ start
                closeSideslip();

                    that.pageList = [];
                    that.totalList = [];
                    var searchFormArr = that.queryParam;
                    searchFormArr.pageInfo = {
                        pageNum:that.currentPage,
                        pageSize:that.queryPageSize
                    }
                    postRequest(umsUrl + "/select/pageTenantByTenantVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                        that.tableOrderList = res.result;
                        for(var i = 0 ; i < res.pageInfo.pages;i++){
                            that.pageList[i] = i + 1;
                        }
                        for(var n = 0 ; n < res.pageInfo.total;n++){
                            that.totalList[n] = n + 1;
                        }
                    })
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
    created:function(){
        var that = this;
        var searchFormArr = {
            pageInfo:{
                pageNum: 1,
                pageSize: that.queryPageSize
            },
            umTenantId:""
        }
        that.queryParam = {};
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(umsUrl + "/select/pageTenantByTenantVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
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
