var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize: 20,
        tableOrderList:{},
        selectListData:{},
        pageList:[],
        totalPagesNum:"",
        logininf:{},
        checkedOperaOrder:[],
        generalInfo: {},
        timeHorizon:"" //创建时间范围
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
    methods:{
        changePage(pageNum,clickStatus){
            var that = this;
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
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:pageNum,
                pageSize:this.queryPageSize
            };
            //获取订单列表
            postRequest(tmsUrl + "/wx/query/transportCostInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.generalInfo = res.result;
                if(res.result.pageModel.data != null && res.result.pageModel.data.length > 0){
                    that.tableOrderList = res.result.pageModel.data;
                }
                that.publicChangeBtnStatus();
            })
        },
        getSearchVal(){
            //订单搜索
            var that = this;
            that.generalInfo = {};
            that.tableOrderList = [];
            var searchFormArr = {};
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getQueryTime(1);
                endTimeVal = getQueryTime(1);
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            //获取订单列表
            postRequest(tmsUrl + "/wx/query/transportCostInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.generalInfo = res.result;
                if(res.result.pageModel.data != null && res.result.pageModel.data.length > 0){
                    that.tableOrderList = res.result.pageModel.data;
                }
                that.pageList = [];
                that.totalPagesNum = res.result.pageModel.pageInfo.total;
                for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
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
        that.timeHorizon = getTodayTime()+" - "+ getTodayTime();
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            },
            startCompleteTime:getQueryTime(1),
            endCompleteTime:getQueryTime(1)
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(tmsUrl + "/wx/query/transportCostInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.generalInfo = res.result;
            if(res.result.pageModel.data != null && res.result.pageModel.data.length > 0){
                that.tableOrderList = res.result.pageModel.data;
            }
            that.pageList = [];
            that.totalPagesNum = res.result.pageModel.pageInfo.total;
            for(var i = 0 ; i < res.result.pageModel.pageInfo.pages;i++){
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
        },
        formatSeconds(value) { //秒转换成小时+分钟+秒
            var theTime = parseInt(value);// 需要转换的时间秒
            var theTime1 = 0;// 分
            var theTime2 = 0;// 小时
            if(theTime > 60) {
                theTime1 = parseInt(theTime/60);
                theTime = parseInt(theTime%60);
                if(theTime1 > 60) {
                    theTime2 = parseInt(theTime1/60);
                    theTime1 = parseInt(theTime1%60);
                }
            }
            var result = '';
            if(theTime > 0){
                result = ""+parseInt(theTime)+"秒";
            }
            if(theTime1 > 0) {
                result = ""+parseInt(theTime1)+"分"+result;
            }
            if(theTime2 > 0) {
                result = ""+parseInt(theTime2)+"小时"+result;
            }
            return result;
        }
    }
})

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});
