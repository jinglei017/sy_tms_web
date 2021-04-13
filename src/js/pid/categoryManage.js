var app = new Vue({
    el: '#overall',
    data: {
        currentPage:1,
        queryPageSize:12,
	    multipleNum:12,
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
        queryParamPdCat:{
            isRootCat:"",
            isLeafCat:"",
            pdCatId:"",
            catLabel:"",
            parentCatId:""
        },
        currentDqIndex:"",
        contactList:{},
        currentCotactIndex:"",
        templateTitle:"",
        itemSingle:{
            isRootCat:"3",
            isLeafCat:""
        },
        itemSingle2:{
            isRootCat:"3",
            isLeafCat:""
        },
        itemSingleDetail:{},
        showSelectParentCat: '3', // 是否根类目
        selectCatModelShowIndex: '0', // 品类级别显示
        showCatItemSingle: '0', // 选择表格行之后才能“新增品类”
        selectParentCatId:'', // 所选的父级品类id
        pdCatLists1:{},
        pdCatLists2:{},
        pdCatLists3:{},
        pdCatLists4:{},
        pdCatLists5:{},
        activeIndex1: '-1',
        activeIndex2: '-1',
        activeIndex3: '-1',
        activeIndex4: '-1',
        activeIndex5: '-1',
        equallyCatsList:[],
        rootCatsList:[],
        leafCatsList:[]
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.isDisable = false;
            that.showSelectParentCat = '3';
            that.itemSingle = {
                isRootCat:that.showSelectParentCat,
                isLeafCat:""
            };
            that.showCatItemSingle = '0';
        },
        changeIsRootCat(isRootCat){
            var that = this;
            if(isRootCat == '0'){
                that.showSelectParentCat = '1';
            }else{
                that.showSelectParentCat = '0';
            }
        },
        closeMaskLayer(){
            var that = this;
            that.showCatItemSingle = '0';
            $(".maskLayer#someSelectModel").hide();
        },
        closeMaskLayer2(){
            $(".maskLayer#someSelectModel2").hide();
        },
        selectCatModel(){ // 打开“品类级别”模态框
            var that = this;
            that.selectCatModelShowIndex = '0';
            that.showCatItemSingle = '0';
            that.selectParentCatId = '';
            that.queryParamPdCat = {
                isRootCat:"1",
                isLeafCat:"",
                pdCatId:"",
                catLabel:"",
                parentCatId:""
            };
            $("#someSelectModel .checkInp1").prop("checked",true);
            $("#someSelectModel .checkInp2").prop("checked",false);
            that.activeIndex1 = '-1';
            that.activeIndex2 = '-1';
            that.activeIndex3 = '-1';
            that.activeIndex4 = '-1';
            that.activeIndex5 = '-1';
            that.pdCatLists1 = {};
            that.pdCatLists2 = {};
            that.pdCatLists3 = {};
            that.pdCatLists4 = {};
            that.pdCatLists5 = {};
            var param = that.queryParamPdCat;
            postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.pdCatLists1 = res.result;
                $(".maskLayer#someSelectModel").show();
            })
        },
        changeQueryIsRootCat(event){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.queryParamPdCat.isRootCat = '1';
            }else{
                that.queryParamPdCat.isRootCat = '0';
            }
        },
        changeQueryIsLeafCat(event){
            var that = this;
            var el = event.target;
            if($(el).prop("checked")){
                that.queryParamPdCat.isLeafCat = '1';
            }else{
                that.queryParamPdCat.isLeafCat = '0';
            }
        },
        getSearchPdCatVal(){ // 品类级别 搜索
            var that = this;
            that.selectCatModelShowIndex = '0';
            that.showCatItemSingle = '0';
            that.selectParentCatId = '';
            that.activeIndex1 = '-1';
            that.activeIndex2 = '-1';
            that.activeIndex3 = '-1';
            that.activeIndex4 = '-1';
            that.activeIndex5 = '-1';
            that.pdCatLists1 = {};
            that.pdCatLists2 = {};
            that.pdCatLists3 = {};
            that.pdCatLists4 = {};
            that.pdCatLists5 = {};
            var param = that.queryParamPdCat;
            if(param.isRootCat == '' || param.isRootCat == '0'){
                param.isRootCat = undefined;
            }
            if(param.isLeafCat == '' || param.isLeafCat == '0'){
                param.isLeafCat = undefined;
            }
            if(param.pdCatId == ''){
                param.pdCatId = undefined;
            }
            if(param.catCode == ''){
                param.catCode = undefined;
            }
            if(param.catLabel == ''){
                param.catLabel = undefined;
            }
            if(param.parentCatId == ''){
                param.parentCatId = undefined;
            }
            postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                that.pdCatLists1 = res.result;
            })
        },
        selectOneCatFun(item,index,selectCatModelShowIndex){
            var that = this;
            that.selectParentCatId = item.pdCatId;
            that.showCatItemSingle = '1';
            switch(selectCatModelShowIndex)
            {
                case '1':
                    that.activeIndex1 = index;
                    that.activeIndex2 = '-1';
                    that.activeIndex3 = '-1';
                    that.activeIndex4 = '-1';
                    that.activeIndex5 = '-1';
                    break;
                case '2':
                    that.activeIndex2 = index;
                    that.activeIndex3 = '-1';
                    that.activeIndex4 = '-1';
                    that.activeIndex5 = '-1';
                    break;
                case '3':
                    that.activeIndex3 = index;
                    that.activeIndex4 = '-1';
                    that.activeIndex5 = '-1';
                    break;
                case '4':
                    that.activeIndex4 = index;
                    that.activeIndex5 = '-1';
                    break;
                case '5':
                    that.activeIndex5 = index;
                    break;
            }
            if(selectCatModelShowIndex == '5'){
                imitatePopup('当前层级数太多，可先输入查询条件过滤','alert');
                return false;
            }
            var param = {
                parentCatId: item.pdCatId
            };
            postRequest(pidUrl + "/select/listCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,param,function(res){
                switch(selectCatModelShowIndex)
                {
                    case '1':
                        that.pdCatLists2 = res.result;
                        break;
                    case '2':
                        that.pdCatLists3 = res.result;
                        break;
                    case '3':
                        that.pdCatLists4 = res.result;
                        break;
                    case '4':
                        that.pdCatLists5 = res.result;
                        break;
                }
            });
            that.selectCatModelShowIndex = selectCatModelShowIndex;
        },
        showCatItemSingleFun(){ // 新增品类模态框
            var that = this;
            if(that.showCatItemSingle == '0'){
                imitatePopup('请先选择品类的父级','alert');
                return false;
            }
            that.itemSingle2.parentCatId = that.selectParentCatId;
            if(that.clickBtnType == "add"){
                that.itemSingle2.isRootCat = that.itemSingle.isRootCat;
                that.itemSingle2.catCode = "";
                that.itemSingle2.catLabel = "";
                that.itemSingle2.catDesc = "";
                that.itemSingle2.isLeafCat = "";
            }
            if(that.clickBtnType == "edit"){
                that.itemSingle2 = that.itemSingle;
            }
            $(".maskLayer#someSelectModel2").show();
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.showSelectParentCat = '0';
            getRequest(pidUrl + "/get/catDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdCatId="+pdItem.pdCatId+"&catCode="+pdItem.catCode,function(res){
                if(res.result != null){
                    if(res.result.cat != null){
                        if(res.result.cat.isLeafCat == null){
                            res.result.cat.isLeafCat = "";
                        }
                        if(res.result.cat == null){
                            res.result.cat.isRootCat = "3";
                        }
                        that.itemSingle = res.result.cat;
                    }else{
                        res.result.isLeafCat = "";
                        res.result.isRootCat = "3";
                        that.itemSingle = res.result;
                    }
                    if(res.result.equallyCats != null){
                        that.equallyCatsList = res.result.equallyCats;
                    }else{
                        that.equallyCatsList = [];
                    }
                    if(res.result.rootCats != null){
                        that.rootCatsList = res.result.rootCats;
                    }else{
                        that.rootCatsList = [];
                    }
                    if(res.result.leafCats != null){
                        that.leafCatsList = res.result.leafCats;
                    }else{
                        that.leafCatsList = [];
                    }
                }else{
                    res.result.isLeafCat = "";
                    res.result.isRootCat = "3";
                    that.itemSingle = res.result;
                    that.equallyCatsList = [];
                    that.rootCatsList = [];
                    that.leafCatsList = [];
                }
            });
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.showSelectParentCat = '0';
            getRequest(pidUrl + "/get/catDetails.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdCatId="+pdItem.pdCatId+"&catCode="+pdItem.catCode,function(res){
                if(res.result != null){
                    if(res.result.cat != null){
                        if(res.result.cat.isLeafCat == null){
                            res.result.cat.isLeafCat = "";
                        }
                        if(res.result.cat == null){
                            res.result.cat.isRootCat = "3";
                        }
                        that.itemSingle = res.result.cat;
                        that.itemSingle2 = res.result.cat;
                    }else{
                        res.result.isLeafCat = "";
                        res.result.isRootCat = "3";
                        that.itemSingle = res.result;
                        that.itemSingle2 = res.result;
                    }
                }else{
                    res.result.isLeafCat = "";
                    res.result.isRootCat = "3";
                    that.itemSingle = res.result;
                    that.itemSingle2 = res.result;
                }
            });
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除该品类");
            if (r==true){
                getRequest(pidUrl + "/delete/pdCat.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&pdCatId="+pdItem.pdCatId+"&catCode="+pdItem.catCode,function(res){
                    //获取订单列表
                    var searchFormArr = {
                        pageInfo:{
                            pageNum: that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
                pageSize:that.queryPageSize
            }
            postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            var splitCountNum = parseInt(that.queryPageSize);
			var ex = /^\d+$/;
			if (ex.test(splitCountNum) && splitCountNum > 1 &&  splitCountNum < 2000 ) {
				that.multipleNum = that.queryPageSize;
	            var searchFormArr = this.queryParam;
	            if(searchFormArr.pdCatId == ''){
	                searchFormArr.pdCatId = undefined;
	            }
	            if(searchFormArr.catCode == ''){
	                searchFormArr.catCode = undefined;
	            }
	            if(searchFormArr.catLabel == ''){
	                searchFormArr.catLabel = undefined;
	            }
	            searchFormArr.pageInfo = {
	                pageNum:1,
	                pageSize:that.queryPageSize
	            };
	            //获取订单列表
	            postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
	        }else{
				imitatePopup("请输入大于1且小于2000的正整数",'alert');
		        return false;
			}
        },
        editOrderInfo(){
            var that = this;
            var paramsObj = {};
            if(that.showCatItemSingle == '0'){ // 没有模态框的修改
                if(that.itemSingle.catCode == "" || that.itemSingle.catCode == undefined){
                    imitatePopup("品类代码不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.catLabel == "" || that.itemSingle.catLabel == undefined){
                    imitatePopup("品类标签不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.isRootCat == "0" || that.itemSingle.isRootCat == "1"){

                }else{
                    imitatePopup("是否根类目不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.isLeafCat == "0" || that.itemSingle.isLeafCat == "1"){

                }else{
                    imitatePopup("是否末级类目不能为空",'alert');
                    return false;
                }
                paramsObj = that.itemSingle;
            }else{ // 有有模态框的修改
                if(that.itemSingle2.catCode == "" || that.itemSingle2.catCode == undefined){
                    imitatePopup("品类代码不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.catLabel == "" || that.itemSingle2.catLabel == undefined){
                    imitatePopup("品类标签不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.isRootCat == "0" || that.itemSingle2.isRootCat == "1"){

                }else{
                    imitatePopup("是否根类目不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.isLeafCat == "0" || that.itemSingle2.isLeafCat == "1"){

                }else{
                    imitatePopup("是否末级类目不能为空",'alert');
                    return false;
                }
                paramsObj = that.itemSingle2;
            }
            //保存修改的联系人信息
            postRequest(pidUrl + "/update/pdCat.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    // 关闭弹窗+侧滑 ------ start
                    that.closeMaskLayer();
                    that.closeMaskLayer2();
                closeSideslip();
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:that.currentPage,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
            var paramsObj = {};
            if(that.showCatItemSingle == '0'){ // 没有模态框的新增
                if(that.itemSingle.catCode == "" || that.itemSingle.catCode == undefined){
                    imitatePopup("品类代码不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.catLabel == "" || that.itemSingle.catLabel == undefined){
                    imitatePopup("品类标签不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.isRootCat == "0" || that.itemSingle.isRootCat == "1"){

                }else{
                    imitatePopup("是否根类目不能为空",'alert');
                    return false;
                }
                if(that.itemSingle.isLeafCat == "0" || that.itemSingle.isLeafCat == "1"){

                }else{
                    imitatePopup("是否末级类目不能为空",'alert');
                    return false;
                }
                that.itemSingle.parentCatId = '0';
                paramsObj = that.itemSingle;
            }else{ // 有有模态框的新增
                if(that.itemSingle2.catCode == "" || that.itemSingle2.catCode == undefined){
                    imitatePopup("品类代码不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.catLabel == "" || that.itemSingle2.catLabel == undefined){
                    imitatePopup("品类标签不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.isRootCat == "0" || that.itemSingle2.isRootCat == "1"){

                }else{
                    imitatePopup("是否根类目不能为空",'alert');
                    return false;
                }
                if(that.itemSingle2.isLeafCat == "0" || that.itemSingle2.isLeafCat == "1"){

                }else{
                    imitatePopup("是否末级类目不能为空",'alert');
                    return false;
                }
                paramsObj = that.itemSingle2;
            }
            //保存新增联系人信息
            postRequest(pidUrl + "/insert/pdCat.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){

                    that.itemSingle = {
                        isRootCat:"3",
                        isLeafCat:""
                    };
                    // 关闭弹窗+侧滑 ------ start
                    that.closeMaskLayer();
                    that.closeMaskLayer2();
                closeSideslip();
                    that.currentPage = 1;
                    $(".paging .pagingCon .pagination").animate({
                        "left": "0px"
                    },300);
                    var searchFormArr = {
                        pageInfo:{
                            pageNum:1,
                            pageSize:that.queryPageSize
                        }
                    };
                    postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
        var that = this,searchFormArr = {
            pageInfo:{
                pageNum:1,
                pageSize:that.queryPageSize
            }
        };
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
        postRequest(pidUrl + "/select/pageCatByCatVo.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
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
