var app = new Vue({
    el: '#overall',
    data: {
        dpDistrictList:{},
        dpDistrictList1:{},
        logininf:{},
        selectListData:{},
        queryPageSize:20,
        tableOrderList:{},
        totalPagesNum:"",
        pageList:[],
        currentPage:1,
        queryParam:{
            completeStatus:"",
            auditStatus:"",
            isDistribute:""
        },
        checkedOperaOrder:[],
        allRight: 1,
        showPathList: [],
        sortTemShowList: [],
        sortTransDataList: [],
        selectOneBcList:[],
        orderTotallist: [],
        myFormat: '0',
        arrows: 1,
        coordinateList: [],
        totalQwv: [],
        iconBackgrounds: [{background: '#f30b53'},{background: '#f08f0e'},{background: '#e051f3'},{background: '#009def'},{background: '#64BD3D'},{background: '#E89589'},{background: '#16A085'},{background: '#4A235A'},{background: '#C39BD3'},{background: '#F9E79F'},{background: '#BA4A00'},{background: '#ECF0F1'},{background: '#4A235A'}],
        besicInfosList: [],
        timeHorizon:"",
        linkNames: ["班次管理","班次地图"],
        linkHrefs: []//创建时间范围
    },
    methods:{
        // 查询列表
        getSearchVal(){
            var that = this;
            map.clearMap();
            that.closeShowPathList();
            closeSignalOrderClick();
            that.tableOrderList = {};
            var searchFormArr = this.queryParam;
            if(searchFormArr.completeStatus == ""){
                delete searchFormArr.completeStatus;
            }
            searchFormArr.orderType = "TFO";
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            if(startTimeVal == "" && endTimeVal == ""){
                startTimeVal = getTodayTime();
                imitatePopup("查询条件中时间条件不能全置为空，已填入默认时间！");
            }
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:that.queryPageSize
            };
            $(".listboxDiv ul li .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                if(that.queryParam.completeStatus == undefined){
                    that.queryParam.completeStatus = "";
                }
                that.tableOrderList = res.result;
                that.pageList = [];
                that.currentPage = 1;
                that.totalPagesNum = res.pageInfo.total;
                /*$(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);*/
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
            })
        },
        // 查看路线
        getShowPathList(tableOrderItem,index){
            var that = this;
            map.clearMap();
            markerAcceptArray = [];
            markerAcceptArraySeq = [];
            that.arrows = 0;
            that.closeShowPathList();
            closeSignalOrderClick();
            $(".itemAddress").eq(index).show();
            $(".switchOrd1").eq(index).hide();
            $(".switchOrd2").eq(index).show();
            that.showPathList = [];
            that.coordinateList = [];
            markerInfoArray = [];
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            var driverParam = {
                orderNo:tableOrderItem.orderNo,
                contactTel:tableOrderItem.contactTel,
                eqpNo:tableOrderItem.eqpNo,
                startCompleteTime:startTimeVal,
                endCompleteTime:endTimeVal
            };
            postRequest(tmsUrl + "/wx/query/transportOrderPlanInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,driverParam,function(data){
                if(data.result != null){
                    if(data.result.orderInfoResVoList != null){
                        if(data.result.orderInfoResVoList.length != 0){
                            that.showPathList = data.result.orderInfoResVoList;
                            markerInfoArray = data.result.orderInfoResVoList;
                            stoLatLngList = [];
                            drawThePath(markerInfoArray,0);
                        }
                    }
                }
            })
        },
        // 关闭路线
        closeShowPathList(){
            var that = this;
            $(".itemAddress").hide();
            $(".switchOrd2").hide();
            $(".switchOrd1").show();
            that.showPathList = [];
        },
        //翻页
        changePage(pageNum,clickStatus){
            var that = this;
            map.clearMap();
            that.closeShowPathList();
            closeSignalOrderClick();
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
            if(searchFormArr.completeStatus == ""){
                delete searchFormArr.completeStatus;
            }
            if(searchFormArr.auditStatus == ""){
                delete searchFormArr.auditStatus;
            }
            if(searchFormArr.isDistribute == ""){
                delete searchFormArr.isDistribute;
            }
            searchFormArr.orderType = "TFO";
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            searchFormArr.startCompleteTime = startTimeVal;
            searchFormArr.endCompleteTime = endTimeVal;
            var that = this;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            }
            $(".listboxDiv ul li .checkInp").attr("checked",false);
            that.checkedOperaOrder = [];
            //获取订单列表
            postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                if(that.queryParam.completeStatus == undefined){
                    that.queryParam.completeStatus = "";
                }
                if(that.queryParam.auditStatus == undefined){
                    that.queryParam.auditStatus = "";
                }
                if(that.queryParam.isDistribute == undefined){
                    that.queryParam.isDistribute = "";
                }
                that.tableOrderList = res.result;
                that.pageList = [];
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageList[i] = i + 1;
                }
            })
        },
        //checkbox选择
        textboxSelectionFun(event,orderItem){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.checkedOperaOrder.push(orderItem);
            }else{
                that.checkedOperaOrder.splice($.inArray(orderItem,that.orderList),1)
            }
        },
        // 跳转到调整线路
        adjustOrderLine(){
            var that = this;
            map.clearMap();
            markerAcceptArray = [];
            markerAcceptArraySeq = [];
            if(!that.checkedOperaOrder.length){
                imitatePopup("请添加待调整线路","alert");
                return false;
            }
            var infos = that.checkedOperaOrder;
            that.pageWayFun(infos);
            that.allRight = 0;
            that.checkedOperaOrder = [];
            $(".listboxDiv ul li .checkInp").attr("checked",false);
        },
        // 得到调整线路数据
        pageWayFun(tableOrderItem){
            var that = this;
            that.sortTemShowList = [];
            that.sortTransDataList = [];
            that.orderTotallist = [];
            that.selectOneBcList = [];
            that.totalQwv = [];
            that.besicInfosList = [];
            stoLatLngList = [];
            var startTimeVal =that.timeHorizon.split(" - ")[0];
            var endTimeVal =that.timeHorizon.split(" - ")[1];
            that.selectOneBcList = tableOrderItem;
            for(let i=0;i<that.selectOneBcList.length;i++){
                var driverParam = {
                    orderNo:that.selectOneBcList[i].orderNo,
                    contactTel:that.selectOneBcList[i].contactTel,
                    eqpNo:that.selectOneBcList[i].eqpNo,
                    startCompleteTime:startTimeVal,
                    endCompleteTime:endTimeVal
                };
                postRequest(tmsUrl + "/wx/query/transportOrderPlanInfo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,driverParam,function(data){
                    if(data.result != null){
                        if(data.result.transportMonitorModel != null){
                            if(data.result.transportMonitorModel.length != 0){
                                that.orderTotallist.push(data.result.transportMonitorModel);
                                that.besicInfosList.push({
                                    totalQty: data.result.transportMonitorModel.totalQty,
                                    totalWeight: data.result.transportMonitorModel.totalWeight,
                                    totalVolume: data.result.transportMonitorModel.totalVolume
                                })
                            }
                        }
                        if(data.result.orderInfoResVoList != null){
                            if(data.result.orderInfoResVoList.length != 0){
                                that.sortTemShowList.push(data.result.orderInfoResVoList);
                                that.sortTransDataList.push(data.result.orderInfoResVoList);
                                for(var q=0;q<data.result.orderInfoResVoList.length;q++){
                                    var totalQwvItem = data.result.orderInfoResVoList[q].totalQty + '件 ' + data.result.orderInfoResVoList[q].totalWeight + 'kg ' + data.result.orderInfoResVoList[q].totalVolume + 'm³';
                                    that.totalQwv.push(totalQwvItem);
                                }
                                markerInfoArray = data.result.orderInfoResVoList;
                                drawThePath(markerInfoArray,i);
                            }
                        }
                    }
                })
            }
            setTimeout(function(){
                that.rowDrop();
            },300)
        },
        // 点击订单事件
        hintOrder(event,index,ids){
            var that = this;
            var el = event.target;
            $(".dragUlLi").removeClass("chooseDragActive");
            $(".mapNumDiv").css("background","rgba(255,255,255,0.4)");
            $(el).parents(".dragUlLi").toggleClass("chooseDragActive");
            var orderId = 'order'+that.sortTemShowList[index][ids].omOrderId;
            $("#"+orderId).find(".mapNumDiv").css("background","#00C2B1");
        },
        //订单拖拽排序
        rowDrop(orderList) {
            var that = this;
            var arr = {};
            for(let i=0;i<that.orderTotallist.length;i++){
                if(that.sortTransDataList[i]){
                    var drop = this.$refs.drop[i];
                    Sortable.create(drop, {
                        group: "words",
                        animation: 150,
                        onStart: function (evt) {  //拖拽开始发生该事件
                            var array = that.sortTransDataList[i].slice(0);
                            arr = array.splice(evt.oldIndex,1)[0];
                        },
                        onRemove: function (evt){ //删除拖拽节点的时候促发该事件
                            var newArray1 = that.sortTransDataList[i].slice(0);
                            newArray1.splice(evt.oldIndex,1)[0];
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray1;

                            that.besicInfosList[i].totalQty = ((that.besicInfosList[i].totalQty * 1-arr.totalQty * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalWeight = ((that.besicInfosList[i].totalWeight * 1-arr.totalWeight * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalVolume = ((that.besicInfosList[i].totalVolume * 1-arr.totalVolume * 1).toFixed(2))*1;
                        },
                        onAdd: function (evt){ //拖拽时候添加有新的节点的时候发生该事件
                            var newArray2 = that.sortTransDataList[i].slice(0);
                            var arrAdd = arr;
                            if(newArray2[0]){
                                arrAdd.fromOrderId = newArray2[0].fromOrderId;
                            }else{
                                arrAdd.fromOrderId = that.sortTemShowList[i][0].fromOrderId;
                            }
                            console.log(arrAdd)
                            newArray2.splice(evt.newIndex,0,arrAdd);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray2;

                            that.besicInfosList[i].totalQty = ((that.besicInfosList[i].totalQty * 1+arr.totalQty * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalWeight = ((that.besicInfosList[i].totalWeight * 1+arr.totalWeight * 1).toFixed(2))*1;
                            that.besicInfosList[i].totalVolume = ((that.besicInfosList[i].totalVolume * 1+arr.totalVolume * 1).toFixed(2))*1;
                        },
                        onUpdate: function (evt) {  //拖拽更新节点位置发生该事件
                            var newArray = that.sortTransDataList[i].slice(0);
                            newArray.splice(evt.newIndex, 0,newArray.splice(evt.oldIndex,1)[0]);
                            that.sortTransDataList[i] = [];
                            that.sortTransDataList[i] = newArray;
                        },
                        onEnd: function (evt){
                            map.clearMap();
                            markerAcceptArray = [];
                            markerAcceptArraySeq = [];
                            stoLatLngList = [];
                            for(var a=0;a<that.sortTransDataList.length;a++){
                                drawThePath(that.sortTransDataList[a],a);
                            }
                        }
                    });
                }
            }
        },
        // 保存排序
        saveOrderSortingFun(){
            var that = this;
            var newSortArray = [];
            for(let a=0;a<that.sortTransDataList.length;a++){
                var refInfoModelList = [];
                var temporaryDrawItem = that.sortTransDataList[a];
                for(var i = 0; i < temporaryDrawItem.length;i++){
                    refInfoModelList.push({refId:temporaryDrawItem[i].omOrderId});
                }
                newSortArray.push({
                    fromOrderId:temporaryDrawItem[0].fromOrderId,
                    refInfoModelList:refInfoModelList
                });
            }
            postRequest(tmsUrl+'/update/tfoOrderTfoLnk.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp,newSortArray,function(res){
                if(res.msg == 'success' || res.msg == 'SUCCESS'){
                    imitatePopup("调整订单排序成功！","alert");
                }else{
                    imitatePopup(res.msg,"alert");
                }
            });
        },
        // 返回列表
        backListDetail(){
            var that = this;
            that.allRight = 1;
            that.selectOneBcList = [];
            map.clearMap();
        },
    },
    created:function(){
        var that = this;
        this.dpDistrictList = getProvinceData("100000");
        this.dpDistrictList1 = getProvinceData("100000");
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.linkHrefs = getJumpLinkList(that.linkNames);
        that.allRight = 1;

        that.timeHorizon = getTodayTime()+" - "+ getTodayTime();
        //获取订单列表
        var searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            },
            orderType:"TFO",
            startCompleteTime: getTodayTime(),
            endCompleteTime: getTodayTime()
        };
        postRequest(tmsUrl + "/query/selectTfoOrderInfoPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
            that.tableOrderList = res.result;
            that.totalPagesNum = res.pageInfo.total;
            for(var i = 0 ; i < res.pageInfo.pages;i++){
                that.pageList[i] = i + 1;
            }
        })
    },
    filters:{
        timestampToTime(timestamp) {
            if(timestamp == null){
                return '--';
            }else{
                var offsetMs = new Date().getTimezoneOffset() * 60 * 1000;
                //	var currentTime = timestamp - offsetMs;
                var currentTime = timestamp;
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
});


var map, driving, marker ;
var markerList = [];
var stoLatLngList = [];
var markerInfoArray = [];
var markerAcceptArray = [];
var markerAcceptArraySeq = [];
var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(8, 0)}); //信息窗体
var lineColorList = ['#f30b53','#f08f0e','#e051f3','#009DEF','#64BD3D','#E89589','#16A085','#4A235A','#C39BD3','#F9E79F','#BA4A00','#ECF0F1','#4A235A'];
var startPoint, endPoint;

//绘制矢量图形
map = new AMap.Map("container", {
    zoom: 9,
    resizeEnable: true,
    mapStyle: 'amap://styles/' + AmapQdStyle_white
});
//绘制路径
function drawThePath(markerInfoArray,index){
    var infos = markerInfoArray;
    startPoint = [];
    endPoint = [];
    var opts = {waypoints:[]};
    if(infos.length != 0){
        startPoint.push(infos[0].sfrLatLng.split(',')[0],infos[0].sfrLatLng.split(',')[1]);
        endPoint.push(infos[infos.length-1].stoLatLng.split(',')[0],infos[infos.length-1].stoLatLng.split(',')[1]);
        if(infos.length>1){
            for(var i=0;i<infos.length-1;i++){
                var marLat = infos[i].stoLatLng.split(',');
                if(marLat == '' || marLat == null || marLat == undefined){
                    return false;
                }
                var marLatArr = [marLat[0]/1,marLat[1]/1];
                opts.waypoints.push(marLatArr);
            }
        }
    }
    map.plugin('AMap.Driving', function() {
        driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_TIME,
            showTraffic: false,
            isOutline: false,
            hideMarkers: true
        });
        driving.search(startPoint,endPoint,opts,function(status, result){
            markerArrayFun(markerInfoArray,lineColorList[index]); // 点
            drawRoute(result.routes[0],lineColorList[index]); // 线
        });
    })
}
// 批量标记点
function markerArrayFun(markerInfoArray,color) {
    var defaultLatLng = '121.473658,31.230378';
    var newDiv = '';
    var newDiv1 = '';
    var mapNumDiv = '';
    markerList = [];
    if(markerInfoArray[0].sfrLatLng != null && markerInfoArray[0].sfrLatLng != ''){
        var str1= markerInfoArray[0].sfrLatLng.split(',');
        var marker1 = [];
        marker1.push(str1[0]);
        marker1.push(str1[1]);
        newDiv1 = '<div class="mapPointStart"></div>';
        marker1 = new AMap.Marker({
            map: map,
            position: marker1,
            offset: new AMap.Pixel(0, 0)
        });
        marker1.setContent(newDiv1);
        marker1.on('click', signalOrderClickStart);
    }
    for(var n = 0; n < markerInfoArray.length; n++){
        markerAcceptArraySeq.push(n);
        markerAcceptArray.push(markerInfoArray[n]);
        newDiv = document.createElement("div");
        mapNumDiv = document.createElement("div");
        mapNumDiv.className = 'mapNumDiv';
        mapNumDiv.innerHTML = n+1;
        var item = markerInfoArray[n],markerLocation = [];
        if(item.stoLatLng != null && item.stoLatLng != '' && n < markerInfoArray.length-1){
            var string = item.stoLatLng.split(',');
            markerLocation.push(string[0]);
            markerLocation.push(string[1]);
            newDiv.className  = 'mapPoints';
            newDiv.append(mapNumDiv);
            newDiv.style.background = color;
        }
        if(n == markerInfoArray.length-1){
            var str2 = item.stoLatLng.split(',');
            markerLocation.push(str2[0]);
            markerLocation.push(str2[1]);
            newDiv.className  = 'mapPointEnd';
            newDiv.append(mapNumDiv);
        }
        newDiv.id = 'order'+item.omOrderId;
        newDiv.setAttribute("stoLatLng",item.stoLatLng);
        stoLatLngList.push(item.stoLatLng);
        marker = new AMap.Marker({
            map: map,
            position: markerLocation,
            offset: new AMap.Pixel(0, 0)
        });
        marker.setContent(newDiv);  //更新点标记内容
        markerList.push(marker);
        marker.on('click', signalOrderClick);
    }
}
// 路线设置
function drawRoute (route,color) {
    var path = parseRouteToPath(route);
    var routeLine = new AMap.Polyline({
        path: path,
        isOutline: false,
        strokeOpacity: 1,
        strokeColor: color,
        strokeWeight: 4,
        lineJoin: 'bevel',
        showDir: true
    });
    routeLine.setMap(map);
    map.setFitView([routeLine])
}
function parseRouteToPath(route) {
    var path = []
    for (var i = 0, l = route.steps.length; i < l; i++) {
        var step = route.steps[i]
        for (var j = 0, n = step.path.length; j < n; j++) {
            path.push(step.path[j])
        }
    }
    return path
}

// 打开信息窗体
function signalOrderClick(e) {
    $('.amap-info-contentContainer').show();
    var idString = e.target.ue.content.id;
    var stoLatLngVal = e.target.ue.content.attributes.stoLatLng.value;
    var temp=[];
    for(var n=0;n<stoLatLngList.length;n++){
        if(stoLatLngList[n] == stoLatLngVal){
            temp.push(n);
        }
    }
    var pointIdArray = idString.split('order');
    var id = pointIdArray[1];
    var info = '',stoPartyName = '-',stoAddress = '-',totalQty = '-',totalWeight = '-',totalVolume = '-';
    var markerInfoPopover = markerAcceptArray;
    if(id != '') {
        for (var i = 0; i < markerInfoPopover.length; i++) {
            if(temp.length>1){
                var totalDiv = '';
                for(var a=0;a<temp.length;a++){
                    var tem = temp[a];
                    if(a == 0){
                        stoPartyName = markerInfoPopover[tem].stoPartyName;
                        stoAddress = markerInfoPopover[tem].stoAddress;
                    }
                    totalQty = markerInfoPopover[tem].totalQty;
                    totalWeight = markerInfoPopover[tem].totalWeight;
                    totalVolume = markerInfoPopover[tem].totalVolume;
                    totalDiv += '<p><span class="pointInfoColor1">配送顺序：</span><span class="pointInfoColor3">' + (markerAcceptArraySeq[tem]+1)*1 + '</span></p>' +
                        '<p>' +
                        '<span class="pointInfoColor1">货物数量：</span><span class="pointInfoColor2">' + totalQty + '件</span>&nbsp;&nbsp;' +
                        '<span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + totalWeight + 'kg</span>&nbsp;&nbsp;' +
                        '<span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + totalVolume + 'm³</span>&nbsp;&nbsp;' +
                        '</p>';
                }
                info = '<div>' +
                            '<p><span class="pointInfoColor1">站点：</span><span class="pointInfoColor2">' + stoPartyName + '</span></p>' +
                            '<p><span class="pointInfoColor1">地址：</span><span class="pointInfoColor2">' + stoAddress + '</span></p>' +
                            totalDiv +
                        '</div>';
            }else if (markerInfoPopover[i].omOrderId == id) {
                if (markerInfoPopover[i].stoPartyName != null) {
                    stoPartyName = markerInfoPopover[i].stoPartyName;
                }
                if (markerInfoPopover[i].stoAddress != null) {
                    stoAddress = markerInfoPopover[i].stoAddress;
                }
                if (markerInfoPopover[i].totalQty != null) {
                    totalQty = markerInfoPopover[i].totalQty;
                }
                if (markerInfoPopover[i].totalWeight != null) {
                    totalWeight = markerInfoPopover[i].totalWeight;
                }
                if (markerInfoPopover[i].totalVolume != null) {
                    totalVolume = markerInfoPopover[i].totalVolume;
                }
                info = '<div>' +
                            '<p><span class="pointInfoColor1">站点：</span><span class="pointInfoColor2">' + stoPartyName + '</span></p>' +
                            '<p><span class="pointInfoColor1">地址：</span><span class="pointInfoColor2">' + stoAddress + '</span></p>' +
                            '<p><span class="pointInfoColor1">配送顺序：</span><span class="pointInfoColor3">' + (markerAcceptArraySeq[i]+1)*1 + '</span></p>' +
                            '<p><span class="pointInfoColor1">货物数量：</span><span class="pointInfoColor2">' + totalQty + '件</span>&nbsp;&nbsp;' +
                                '<span class="pointInfoColor1">重量：</span><span class="pointInfoColor2">' + totalWeight + 'kg</span>&nbsp;&nbsp;' +
                                '<span class="pointInfoColor1">体积：</span><span class="pointInfoColor2">' + totalVolume + 'm³</span>&nbsp;&nbsp;' +
                            '</p>' +
                        '</div>';
            }
        }
    }
    infoWindow.setContent(info);
    infoWindow.open(map, e.target.getPosition());
}
function signalOrderClickStart(e) {
    $('.amap-info-contentContainer').show();
    infoWindow.setContent('<div><p><span class="pointInfoColor1">起点：</span><span class="pointInfoColor2">' + markerInfoArray[0].sfrAddress + '</span></p></div>');
    infoWindow.open(map,e.target.getPosition());
}
// 关闭信息窗体
function closeSignalOrderClick() {
    $('.amap-info-contentContainer').hide();
}


document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
}

// 日期控件
$(document).ready(function() {
    $('#timeRange').daterangepicker(null, function(start, end, label) {
        app.timeHorizon  = start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD');
    });
});

