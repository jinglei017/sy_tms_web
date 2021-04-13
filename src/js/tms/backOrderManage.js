var app = new Vue({
    el: '#overall',
    data: {
        classesTableList:[],
        historyTableList:[],
        selectListData:{},
        isDisable:false,
        currentPage:1,
        currentPage1:1,
        pageList:[],
        pageList1: [],
        totalPagesNum:"",
        totalPagesNum1:"",
        logininf:{},
        templateTitle:"新增联系人",
        driverOrderList:[],
        driverHisOrderList:[],
        activeTxt: "当日",
        classesNo: {},
        currentOrdersArr: [],
        alive: true,
        startCompleteTime: "",
        endCompleteTime: ""
    },
    methods:{
        changeActiveNum(txt){
            var that = this;
            that.activeTxt = txt;
            $(".startTimeSpan").attr("value",getQueryTime(7));
            $(".endTimeSpan").attr("value",getQueryTime(0));
            that.getSearchVal();
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
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:pageNum,
                pageSize:12
            };
            var that = this;
            that.currentOrdersArr = [];
            $(".currentOrderTable input").prop('checked',false);
            $(".waitScheduleList tr.see").removeClass('active');
            //获取订单列表
            if(that.activeTxt == '当日'){
                postRequest(tmsUrl + "/wx/query/queryTransportMonitorPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.classesTableList = res.result.pageModel.data;
                    for(var j=0;j<that.classesTableList.length;j++){
                        if(that.classesTableList[j].str1 == that.classesNo.str1){
                            $(".waitScheduleList tr.see").eq(j).addClass('active');
                            break;
                        }
                    }
                    for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();

                })
            }else if(that.activeTxt == '历史'){
                postRequest(tmsUrl + "/query/receiptDriverPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.historyTableList = res.result;
                    for(var j=0;j<that.historyTableList.length;j++){
                        if(that.historyTableList[j].carDrvContactName == that.classesNo.str1){
                            $(".waitScheduleList tr.see").eq(j).addClass('active');
                            break;
                        }
                    }
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }
                    that.publicChangeBtnStatus();

                })
            }

        },

        changePage1(pageNum,clickStatus){
            //翻页
            var num = parseInt(pageNum/7);
            if(pageNum % 7 == 0 && clickStatus == "up"){
                var leftNum1 = -210 * parseInt(num - 1);
                $(".finishScheduleList .paging .pagingCon .pagination").animate({
                    "left":leftNum1 + "px"
                },300);
                this.currentPage1 = pageNum;
            }else if(pageNum % 7 == 1 && pageNum != 1){
                var leftNum = -210 * num;
                var leftNum1 = -210 * parseInt(num - 1)
                if(clickStatus == "up" || this.currentPage1 > pageNum){
                    $(".finishScheduleList .paging .pagingCon .pagination").animate({
                        "left":leftNum1 + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }else{
                    $(".finishScheduleList .paging .pagingCon .pagination").animate({
                        "left":leftNum + "px"
                    },300);
                    this.currentPage1 = pageNum;
                }
            }else{
                this.currentPage1 = pageNum;
            }
            //翻页
            var that = this;
            that.currentOrdersArr = [];
            $(".currentOrderTable input").prop('checked',false);
            var startCompleteTime = $(".crcdStartTimeSpan").val().trim();
            var endCompleteTime = $(".crcdEndTimeSpan").val().trim();
            var searchFormArr = {
                startCompleteTime: startCompleteTime,
                endCompleteTime: endCompleteTime,
                carDrvContactTel: that.classesNo.Tel,
                pageInfo: {
                    pageNum: pageNum,
                    pageSize: 8
                }
            };
            postRequest(tmsUrl+'/query/receiptOrderPage.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,searchFormArr,function(res){
                if(res.result != null){
                    if(res.result != null && res.result.length > 0){
                        that.driverHisOrderList = res.result;
                    }
                }
            });
        },

        getSearchVal(){   //班次列表
            var that = this;
            that.currentOrdersArr = [];
            $(".currentOrderTable input").prop('checked',false);
            var searchFormArr = {};
            var startTimeVal = $(".startTimeSpan").val().trim();
            var endTimeVal = $(".endTimeSpan").val().trim();
            if(startTimeVal == "" && endTimeVal == ""){
                $(".startTimeSpan").val(getQueryTime(7));
                startTimeVal = getQueryTime(7);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            that.startCompleteTime = startTimeVal;
            that.endCompleteTime = endTimeVal;

            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:12
            };

            //获取订单列表
            if(that.activeTxt == '当日'){
                that.classesTableList = [];
                that.driverOrderList = [];
                postRequest(tmsUrl + "/wx/query/queryTransportMonitorPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    that.classesTableList = res.result.pageModel.data;
                    setTimeout(function () {
                        that.getOrderDetails(that.classesTableList[0],'0');
                    },50);
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
            } else if(that.activeTxt == '历史'){
                that.historyTableList = [];
                that.driverHisOrderList = [];
                that.pageList1 = [];
                that.currentPage1 = 1;
                postRequest(tmsUrl + "/query/receiptDriverPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                    if(res.result != null && res.result.length > 0){
                        that.historyTableList = res.result;
                        setTimeout(function () {
                            that.getHisOrderDetails(that.historyTableList[0],'0');
                        },50);
                    }

                    that.currentPage = 1;
                    that.pageList = [];
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    that.totalPagesNum = res.pageInfo.total;
                    for(var i = 0 ; i < res.pageInfo.pages;i++){
                        that.pageList[i] = i + 1;
                    }

                    that.publicChangeBtnStatus();
                })
            }
        },

        getOrderDetails(mtItem,index){  // 订单列表
            var that = this;
            that.currentOrdersArr = [];
            $(".currentOrderTable input").prop('checked',false);

            that.classesNo = {
                str1: mtItem.str1,
                Tel: ""
            };
            $(".waitScheduleList tr.see").removeClass('active');
            $(".waitScheduleList tr.see").eq(index).addClass('active');
            that.driverOrderList = [];
            var driverParam = {
                orderNo:mtItem.orderNo,
                contactTel:mtItem.contactTel,
                eqpNo:mtItem.eqpNo
            };
            postRequest(tmsUrl+'/driver/query/transportOrderPlanInfo.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,driverParam,function(res){
                if(res.result != null){
                    if(res.result.orderInfoResVoList != null && res.result.orderInfoResVoList.length > 0){
                        that.driverOrderList = res.result.orderInfoResVoList;
                    }
                }
            });
        },

        getHisOrderDetails(hisItem,index){
            var that = this;
            that.currentOrdersArr = [];
            $(".currentOrderTable input").prop('checked',false);

            if(hisItem != undefined && hisItem != ""){
                that.classesNo = {
                    str1: hisItem.carDrvContactName,
                    Tel: hisItem.carDrvContactTel
                };
                $(".waitScheduleList tr.see").removeClass('active');
                $(".waitScheduleList tr.see").eq(index).addClass('active');
                $(".crcdStartTimeSpan").val(that.startCompleteTime);
                $(".crcdEndTimeSpan").val(that.endCompleteTime);
            }


            var startCompleteTime = $(".crcdStartTimeSpan").val().trim();
            var endCompleteTime = $(".crcdEndTimeSpan").val().trim();
            if(startCompleteTime == "" && endCompleteTime == ""){
                $(".crcdStartTimeSpan").val(that.startCompleteTime);
                $(".crcdEndTimeSpan").val(that.endCompleteTime);
                startCompleteTime = that.startCompleteTime;
                endCompleteTime = that.endCompleteTime;
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }

            that.driverHisOrderList = [];
            var searchFormArr = {
                startCompleteTime: startCompleteTime,
                endCompleteTime: endCompleteTime,
                carDrvContactTel: that.classesNo.Tel,
                pageInfo: {
                    pageNum: 1,
                    pageSize: 8
                }
            };
            postRequest(tmsUrl+'/query/receiptOrderPage.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,searchFormArr,function(res){
                if(res.result != null){
                    if(res.result != null && res.result.length > 0){
                        that.driverHisOrderList = res.result;
                    }
                }
                that.totalPagesNum1 = res.pageInfo.total;
                that.pageList1 = [];
                that.currentPage1 = 1;
                $(".finishScheduleList .paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList1[i] = i + 1;
                }
            });
        },

        confirmBackOrder(orderItem,index){   //回单确认
            var that = this;
            var confirmOrderList = [{
                orderId: orderItem.omOrderId,
                actCode: orderItem.actCode,
                orderNo: orderItem.orderNo
            }];
            postRequest(tmsUrl + "/save/ConfirmReceipt.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,confirmOrderList,function(data){
                if(that.activeTxt == '当日'){
                    that.driverOrderList[index].isState = 1;
                } else if(that.activeTxt == '历史'){
                    that.driverHisOrderList[index].isState = 1;
                }
                that.currentOrdersArr = [];
                $(".currentOrderTable input").prop('checked',false);
                that.reload();
            })
        },

        batchConfirmBackOrder(){  //批量回单确认
            var that = this;
            var confirmOrderList = [];
            if(that.currentOrdersArr.length == 0){
                imitatePopup("请至少勾选一条订单","alert");
                return false;
            }
            for(var i=0;i<that.currentOrdersArr.length;i++){
                confirmOrderList.push({
                    orderId: that.currentOrdersArr[i].orderItem.omOrderId,
                    actCode: that.currentOrdersArr[i].orderItem.actCode,
                    orderNo: that.currentOrdersArr[i].orderItem.orderNo
                })
            }
            postRequest(tmsUrl + "/save/ConfirmReceipt.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,confirmOrderList,function(data){
                for(j=0;j<that.currentOrdersArr.length;j++){
                    var num = that.currentOrdersArr[j].index;
                    if(that.activeTxt == '当日'){
                        that.driverOrderList[num].isState = 1;
                    } else if(that.activeTxt == '历史'){
                        that.driverHisOrderList[num].isState = 1;
                    }
                }
                that.currentOrdersArr = [];
                $(".currentOrderTable input").prop('checked',false);
                that.reload();
            })
        },

        reload(){ //实现局部刷新
            var that = this;
            that.alive= false;
            this.$nextTick(() => {
                that.alive = true;
            })
        },

        textboxAllSelectionFun2(num){
            var that = this;
            that.currentOrdersArr = [];
            var thisOrderList = [];
            if(num == 1){
                thisOrderList = that.driverOrderList;
            } else if(num == 2){
                thisOrderList = that.driverHisOrderList;
            }

            $(".currentOrderTable tbody input[type='checkbox']").prop('checked', $(".currentOrderTable thead input[type='checkbox']").prop('checked'));
            if($(".currentOrderTable thead input").prop("checked")){
                for(var i = 0; i < thisOrderList.length; i++){
                    var ordersArr = {
                        orderItem: thisOrderList[i],
                        index: i
                    };
                    that.currentOrdersArr.push(ordersArr);
                }
            }else{
                for(var j = 0; j < thisOrderList.length; j++){
                    var ordersArr = {
                        orderItem: thisOrderList[j],
                        index: j
                    };
                    that.currentOrdersArr = that.currentOrdersArr.filter(function (ele){return ele != ordersArr;});
                }

            }
        },

        textboxSelectionFun2(event,orderItem,index){
            event.stopPropagation();
            var that = this;
            var el = event.target;
            var num = index;
            var ordersArr = {
                orderItem: orderItem,
                index: num
            };
            if($(el).prop("checked")){
                that.currentOrdersArr.push(ordersArr);
            }else{
                for(var i=0;i<that.currentOrdersArr.length;i++){
                    if(that.currentOrdersArr[i].index == num){
                        that.currentOrdersArr.splice(i,1);
                        break;
                    }
                }
            }
            if(that.currentOrdersArr.length == that.driverOrderList.length){  // 单选个数 = 该页条数，全选选中
                $(".currentOrderTable thead input[type='checkbox']").prop('checked',true);
            }else{
                $(".currentOrderTable thead input[type='checkbox']").prop('checked',false);
            }
        },

        closeMaskLayer(){ //关闭弹窗
            $(".maskLayer").hide();
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
    },
    created:function(){
        var that = this;
        $(".startTimeSpan").attr("value",getQueryTime(7));
        $(".endTimeSpan").attr("value",getQueryTime(0));
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.getSearchVal();
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
