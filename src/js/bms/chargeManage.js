var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:20,
        tableChargeList:{},
        selectListData:{},
        queryParam:{},
        allChecked:false,
        pageList:[],
        totalPagesNum:"",
        refHashList:{},
        checkedCharge:[],
        timeHorizon:"", //创建时间范围
        linkNames: ["费用管理","账单管理"],
        linkHrefs: [],
        costDetailList: []
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
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
            var that = this;
            var searchFormArr = this.queryParam;
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCreateTime = startTimeVal;
            searchFormArr.endCreateTime = endTimeVal;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:this.queryPageSize
            };
            searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
            //获取订单列表
            postRequest(bmsUrl + "/select/pageChargeByChargeVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableChargeList = res.result;
                that.pageInfo = res.pageInfo;
                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedCharge = [];
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
                refId:"",
                refHash:"",
                chargeFrom:"",
                chargeTo:"",
                chargeFromName:"",
                chargeToName:"",
                rpType:"",
                chargeType:"",
                chargeGroup:"",
                isBilled:"0",
                activeStatus:"1"
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
            searchFormArr.activeStatus = 1;
            searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
            //获取订单列表
            postRequest(bmsUrl + "/select/pageChargeByChargeVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.startCreatDate = startTimeVal;
                that.tableChargeList = res.result;
                that.pageInfo = res.pageInfo;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                that.currentPage = 1;
                that.pageList = [];

                $(".reportMessages table tr .checkInp").attr("checked",false);
                that.checkedCharge = [];
                that.checkedNum = 0;

                that.totalPagesNum = res.pageInfo.total;
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        createBill(){  //创建账单
            var that = this;
            var params=[];
            if(that.checkedCharge.length>0){
                for(var i = 0; i < that.checkedCharge.length;i++) {
                    if(that.checkedCharge[i].isBilled == 1){
                        imitatePopup("费用ID["+that.checkedCharge[i].bmChargeId+ "]已经生成账单！","alert");
                        return false;
                    }
                    params.push({
                        bmChargeId: that.checkedCharge[i].bmChargeId,
                        refHash: that.checkedCharge[i].refHash
                    })
                }
            }else{
                imitatePopup("请选择账单","alert");
                return false;
            }
            var r = confirm("是否创建账单"); //在页面上弹出对话框
            if(r == true) {
                postRequest(bmsUrl + "/save/BusBill.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, params, function (data) {
                    if(data.result == true){
                        imitatePopup("生成账单成功！","alert");
                        that.getSearchVal();
                    }else{
                        imitatePopup(data.msg,"alert");
                        return false;
                    }
                })
            }
        },
        exportCharge(){ //导出费用列表
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
            window.location.href = bmsUrl + "/export/bmCharge.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        exportTjoCharge(){ //导出费用列表
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
            window.location.href = tmsUrl + "/export/tjoCharge.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+searchInfo;
            setTimeout(function(){
                $(".ajax-load-pupup1").hide();
            },1000)
        },
        textboxAllSelectionFun(allChecked){
            $(".reportMessages tbody input[type='checkbox']").prop('checked', $(".reportMessages thead input[type='checkbox']").prop('checked'));
            var that = this;
            if(allChecked == false){
                that.checkedCharge = [];
                for(var i = 0; i < that.tableChargeList.length;i++){
                    that.checkedCharge.push(that.tableChargeList[i]);
                }
                that.allChecked = true;
                that.checkedNum = that.checkedCharge.length;
            }else{
                for(var ii = 0; ii < that.tableChargeList.length;ii++){
                    that.checkedCharge.splice($.inArray(that.tableChargeList[ii],that.checkedCharge),1)
                }
                that.allChecked = false;
                that.checkedNum = that.checkedCharge.length;
            }
        },
        textboxSelectionFun(event,tableCharge){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedCharge.push(tableCharge);
            }else{
                that.checkedCharge.splice($.inArray(tableCharge,that.checkedCharge),1)
            }
            that.checkedNum = that.checkedCharge.length;
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
        // 账单批量激活、取消
        orderToActivate(txt) {
            var that = this;
            if(that.checkedCharge.length == 0){
                imitatePopup("请选择账单","alert");
                return false;
            }
            var info = "";
            if(txt == 1){
                info = "确定激活？"
            }else{
                info = "确定取消？"
            }
            imitatePopup(info, 'confirm', (num) => {
                if (num) {
                    var chargeIdList = [];
                    for (var i = 0; i < that.checkedCharge.length; i++) {
                        chargeIdList.push(that.checkedCharge[i].bmChargeId);
                    }
                    postRequest(bmsUrl + "/save/batchActiveStatusCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp+ "&activeStatus=" + txt, chargeIdList, function (res) {
                        if(txt == '1'){
                            imitatePopup("账单激活成功", 'alert');
                        }else{
                            imitatePopup("账单取消成功", 'alert');
                        }
                        that.getSearchVal();
                    })
                }
            })
        },
        // 账单激活、取消
        orderItemToActivate(bmChargeId,txt) {
            var that = this;
            var info = "";
            if(txt == 1){
                info = "确定激活？"
            }else{
                info = "确定取消？"
            }
            imitatePopup(info, 'confirm', (num) => {
                if (num) {
                    postRequest(bmsUrl + "/save/activeStatusCharge.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp+ "&activeStatus=" + txt+ "&chargeId=" + bmChargeId,{}, function (res) {
                        if(txt == '1'){
                            imitatePopup("账单激活成功", 'alert');
                        }else{
                            imitatePopup("账单取消成功", 'alert');
                        }
                        that.getSearchVal();
                    })
                }
            })
        },

        //账单明细
        getCostItemInfo(chargeId){
            var that = this;
            that.costDetailList = [];
            getRequest(bmsUrl + "/get/chargeItemList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&chargeId="+chargeId,function(res){
                if(res.result != null){
                    that.costDetailList = res.result;
                    $.each(res.result,function(index,item){
                        that.costDetailList[index].leftDis = "0px";
                    })
                }
                $(".maskLayer1").show();
            })
        },
        getCostChildItemInfo(chargeId,leftDis,num,type){ //明细子详情
            var that = this;
            $(".seeCost").eq(num).find(".switchTd .open:first-child").toggle();
            $(".seeCost").eq(num).find(".switchTd .open:last-child").toggle();
            if(type){
                var eqNum = num+1,level = leftDis.split("px")[0];
                getRequest(bmsUrl + "/get/chargeItemLevelList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&chargeItemId="+chargeId,function(res){
                    if(res.result != null){
                        $.each(res.result,function(index,item){
                            if(chargeId == item.parentId){
                                that.costDetailList.splice(eqNum,0,item);
                                that.costDetailList[eqNum].leftDis = (level+8)+"px";
                                eqNum += 1;
                            }
                        })
                    }
                })
            }else{
                that.deleteCostChild(chargeId);
            }
        },
        deleteCostChild(chargeId){
            var that = this;
            for(var i=0;i<that.costDetailList.length;i++){
                if(chargeId == that.costDetailList[i].parentId){
                    if(that.costDetailList[i].isUnderl){
                        that.deleteCostChild(that.costDetailList[i].bmChargeItemId);
                        that.costDetailList.splice(i,1);
                        i--;
                    } else{
                        that.costDetailList.splice(i,1);
                        i--;
                    }
                }
            }
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        }
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
        that.timeHorizon = getQueryTime(1)+" - "+ getQueryTime(-1);
        var searchFormArr = {
            startCreateTime: getQueryTime(1),
            endCreateTime: getQueryTime(-1),
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        searchFormArr.activeStatus = 1;
        searchFormArr.tenantPartyNo = that.logininf.tenantPartyNo;
        searchFormArr.source = that.queryParam.source;
        //获取订单列表
        postRequest(bmsUrl + "/select/pageChargeByChargeVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableChargeList = res.result;
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
        refId:"",
        refHash:"",
        chargeFrom:"",
        chargeTo:"",
        chargeFromName:"",
        chargeToName:"",
        rpType:"",
        isBilled:"0",
        activeStatus:"1",
        chargeType:"",
        chargeGroup:""
    };
    that.charge={ //charge表信息
        bmChargeId:"",
        refId:"",
        refHash:"",
        chargeFrom:"",
        chargeTo:"",
        rpType:"",
        chargeType:"",
        chargeGroup:"",
        chargeRate:"",
        qty:"",
        qtyUnit:"",
        discountRate:"",
        discount:"",
        taxRate:"",
        tax:"",
        amount:"",
        currency:"",
        exchangeRate:"",
        remark:"",
        isBilled:"",
        activeStatus:"",
        createTime:""
    };
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});
