var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:20,
        selectListData:{},
        queryParam:{},
        allChecked:false,
        pageList:[],
        totalPagesNum:"",
        tableBillList:{},
        refHashList:{},
        checkedBill:[],
        tableBillItemList:{},
        templateTitle:"",
        timeHorizon:"", //创建时间范围
        linkNames: ["费用管理","账单管理"],
        linkHrefs: []
    },
    methods:{
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
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:this.queryPageSize
            };
            var that = this;
            searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
            //获取订单列表
            postRequest(bmsUrl + "/select/pageBillByBillVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableBillList = res.result;
                that.pageInfo = res.pageInfo;
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedBill = [];
                that.checkedNum = 0;
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
                source:"",
                billNo:"",
                billType:"",
                refCode:"",
                refType:"",
                billFrom:"",
                billTo:"",
                billFromName:"",
                billToName:"",
                isExecute:"",
                activeStatus:""
            };
            if(that.logininf.tenantPartyNo == that.logininf.userPartyNo){
                that.queryParam.source = "IN";
            }else {
                that.queryParam.source = "RE";
            }
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            var searchFormArr = this.queryParam;

            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            if(startTimeVal == getQueryTime(1)){
                searchFormArr.startCreateTime = getQueryTime(1);
            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == "创建时间--结束时间"){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
            //获取订单列表
            postRequest(bmsUrl + "/select/pageBillByBillVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.startCreatDate = startTimeVal;
                that.tableBillList = res.result;
                that.pageInfo = res.pageInfo;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedBill = [];
                that.checkedNum = 0;

                that.currentPage = 1;
                that.pageList = [];
                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        getBillItemDetails(template,bill){
            var that = this;
            this.templateTitle = template;

            getRequest(bmsUrl + "/get/billItemDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&bmBillId="+bill.bmBillId,function(data){
                //账单详情
                that.tableBillItemList = data.result;
            })
        },
        cancelBill(){  //取消账单
            var that = this;
            var params=[];
            if(that.checkedBill.length>0){
                for(var i = 0; i < that.checkedBill.length;i++) {
                    if(that.checkedBill[i].billType == 'INV' || that.checkedBill[i].isExecute == 1){
                        alert("账单号["+that.checkedBill[i].billNo+ "]已经生成发票,无法取消！");
                        return false;
                    }
                    if(that.checkedBill[i].activeStatus == 0){
                        imitatePopup("账单号["+that.checkedBill[i].billNo+ "]已经取消！","alert");
                        return false;
                    }
                    params.push({
                        billNo: that.checkedBill[i].billNo
                    })
                }
            }else{
                imitatePopup("请选择账单","alert");
                return false;
            }
            var r = confirm("是否取消账单"); //在页面上弹出对话框
            if(r == true) {
                postRequest(bmsUrl + "/cancel/BusBill.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                    if(data.result == true){
                        imitatePopup("取消账单成功！","alert");
                        that.getSearchVal();
                    }else{
                        imitatePopup(data.msg,"alert");
                        return false;
                    }
                })
            }
        },
        confirmBill(){  //确认账单
            var that = this;
            var params=[];
            if(that.checkedBill.length>0){
                for(var i = 0; i < that.checkedBill.length;i++) {
                    if(that.checkedBill[i].refType == 'AP'){
                        alert("账单号["+that.checkedBill[i].billNo+ "]为应付类型,请选择应收类型确认账单！");
                        return false;
                    }
                    if(that.checkedBill[i].billType == 'INV' || that.checkedBill[i].isExecute == 1){
                        alert("账单号["+that.checkedBill[i].billNo+ "]已经生成发票,无法确认账单！");
                        return false;
                    }
                    if(that.checkedBill[i].activeStatus == 0){
                        alert("账单号["+that.checkedBill[i].billNo+ "]已经取消,请重新生成账单再确认账单！");
                        return false;
                    }
                    params.push({
                        billNo: that.checkedBill[i].billNo
                    })
                }
            }else{
                alert("请选择账单");
                return false;
            }
            var r = confirm("是否确认账单"); //在页面上弹出对话框
            if(r == true) {
                postRequest(bmsUrl + "/confirm/BusBill.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                    if(data.result == true){
                        alert("确认账单成功！");
                        that.getSearchVal();
                    }else{
                        alert(data.msg);
                        return false;
                    }
                })
            }
        },
        exportBillAndBIllItem(){ //导出账单列表
            $(".ajax-load-pupup1").show();
            var that = this;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == getQueryTime(1)){
                searchFormArr.startCreateTime = getQueryTime(1);
            }else{
                searchFormArr.startCreateTime = startTimeVal;
            }
            if(endTimeVal == "创建时间--结束时间"){

            }else{
                searchFormArr.endCreateTime = endTimeVal;
            }
            var searchInfo = "";
            for(key in searchFormArr){
                searchInfo += "&"+key+"="+searchFormArr[key]
            }
            window.location.href = bmsUrl + "/export/bmBillAndBillItem.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        textboxAllSelectionFun(allChecked){
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            if(allChecked == false){
                that.checkedBill = [];
                for(var i = 0; i < that.tableBillList.length;i++){
                    that.checkedBill.push(that.tableBillList[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.checkedBill.length;
            }else{
                for(var ii = 0; ii < that.tableBillList.length;ii++){
                    that.checkedBill.splice($.inArray(that.tableBillList[ii],that.checkedBill),1)
                }
                that.allChecked = false;
                that.checkedNum = that.checkedBill.length;
            }
        },
        textboxSelectionFun(event,tableBill){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedBill.push(tableBill);
            }else{
                that.checkedBill.splice($.inArray(tableBill,that.checkedBill),1)
            }
            that.checkedNum = that.checkedBill.length;
            if(that.checkedNum == $(".reportMessages table tr.see").length){  // 单选个数 = 该页条数，全选选中
                that.allChecked = true;
                $(".reportMessages thead input[type='checkbox']").prop('checked',true);
            }else{
                that.allChecked = false;
                $(".reportMessages thead input[type='checkbox']").prop('checked',false);
            }
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
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        initSelectData(that);
        that.linkHrefs = getJumpLinkList(that.linkNames);
        if(that.logininf.tenantPartyNo == that.logininf.userPartyNo){
            that.queryParam.source = "IN";
        }else {
            that.queryParam.source = "RE";
        }
        this.selectListData = getBasicData();    //获取下拉数据
        that.timeHorizon = getTodayTime(1)+" - "+ getTodayTime(-30);
        var searchFormArr = {
            startCreateTime: getQueryTime(1),
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
        searchFormArr.source = that.queryParam.source;
        //获取订单列表
        postRequest(bmsUrl + "/select/pageBillByBillVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableBillList = res.result;
            that.pageInfo = res.pageInfo;
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

function initSelectData(that){

    that.queryParam = { // 搜索条件
        source:"",
        billNo:"",
        billType:"",
        refCode:"",
        refType:"",
        billFrom:"",
        billTo:"",
        billFromName:"",
        billToName:"",
        isExecute:"",
        activeStatus:""
    };
    that.billI={ //列表信息
        billNo:"",
        billType:"",
        refCode:"",
        refType:"",
        billFrom:"",
        billTo:"",
        totalQty:"",
        totalAmount:"",
        totalCurrency:"",
        billTime:"",
        expiredTime:"",
        customerRefNo:"",
        isExecute:"",
        activeStatus:""
    };
    that.billItem={
        bmBillItemId:"",
        bmBillId:"",
        seq:"",
        itemCode:"",
        chargeCode:"",
        chargeGroupCode:"",
        rateBase:"",
        rateBaseId:"",
        chargeRate:"",
        qty:"",
        qtyUnit:"",
        percent:"",
        amount:"",
        currency:"",
        exchangeRate:"",
        summary:""
    };
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});

