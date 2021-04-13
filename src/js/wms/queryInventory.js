var app = new Vue({
	el: '#overall',
	data: {
		currentPage:1,
		queryPageSize: 20,
	    tableOrderList:{},
	    selectListData:{},
	    clickBtnType:"",
	    isDisable:false,
	    searchInf:[],
	    pageList:[],
	    totalPagesNum:"",
	    orderDetail:{},
	    logininf:{},
	    queryParam:{},
	    currentDqIndex:"",
	    contactList:{},
	    currentCotactIndex:"",
	    templateTitle:"新增联系人",
	    itemSingle:{},
	    inventory:{},
	},
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
	methods:{
		closeMaskLayer(){
			$(".maskLayer").hide();
		},
		getOrderDetails(title,pdItem){
			this.templateTitle = title;
			var that = this;
			this.clickBtnType = "detail";
			that.isDisable = true;
			that.inventory = pdItem;
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
			var searchFormArr = this.queryParam;
			searchFormArr.pageInfo ={
				pageNum:pageNum,
				pageSize:this.queryPageSize
			}
			var that = this;
			//获取订单列表
		  	postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.tableOrderList = res.result;
				that.pageList = [];
				for(var i = 0; i < res.result.length;i++){
					that.tableOrderList[i].invDateTime = timestampToTime(that.tableOrderList[i].invDateTime);
					that.tableOrderList[i].createTime = timestampToTime(that.tableOrderList[i].createTime);
				}
				for(var i = 0 ; i < res.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
		  	})
		},
        // 重置
        clearSearchInfo(){
            var that = this;
            that.queryParam = {};
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
		  	postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
				that.tableOrderList = res.result;
				that.currentPage = 1;
				that.pageList = [];
				$(".paging .pagingCon .pagination").animate({
					"left": "0px"
				},300);
				that.totalPagesNum = res.pageInfo.total;
				for(var i = 0; i < res.result.length;i++){
					that.tableOrderList[i].invDateTime = timestampToTime(that.tableOrderList[i].invDateTime);
					that.tableOrderList[i].createTime = timestampToTime(that.tableOrderList[i].createTime);
				}
				for(var i = 0 ; i < res.pageInfo.pages;i++){
					that.pageList[i] = i + 1;
				}
				that.publicChangeBtnStatus();
                $(".collUnfold").hide();
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
				pageNum:1,
				pageSize:that.queryPageSize
			}
		}
	  	that.logininf = JSON.parse(localStorage.getItem("logininf"));
	  	that.selectListData = getBasicData();    //获取下拉数据
	  	//获取订单列表
	  	postRequest(wmsUrl + "/query/selectItemInventoryInfoListPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
			that.tableOrderList = res.result;
			that.pageList = [];
			that.totalPagesNum = res.pageInfo.total;
			for(var i = 0; i < res.result.length;i++){
				that.tableOrderList[i].invDateTime = timestampToTime(that.tableOrderList[i].invDateTime);
				that.tableOrderList[i].createTime = timestampToTime(that.tableOrderList[i].createTime);
			}
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
