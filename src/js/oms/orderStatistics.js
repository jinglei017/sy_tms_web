var app = new Vue({
	el: '#overall',
	data:{
		statistics:{},
		logininf:{}
	},
	methods:{
		publicChangeBtnStatus(){
			var that = this;
			setTimeout(function(){
				var permissionListObj  = "";
			  	var pageid = GetQueryString("objectId");
			  	if(pageid == null){
			  		pageid = 23
			  	}else{
			  		pageid = GetQueryString("objectId")
			  	}
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
				getRequest(umsUrl+'/query/objectByUser.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&userId="+that.logininf.umUserId+"&objectType=menu",function(res){
					var data  = res.result;
					console.log(data);
					for(var i = 0; i < data.length; i++){
						if(data[i].objectCode == "/html/tms/sendList.html"){
							buttonObj.eq(0).find("a").attr('href','/html/tms/sendList.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/orderAllocation.html"){
							buttonObj.eq(1).find("a").attr('href','/html/tms/orderAllocation.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/classesList.html"){
							buttonObj.eq(2).find("a").attr('href','/html/tms/classesList.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/operateOrder.html"){
							buttonObj.eq(3).find("a").attr('href','/html/tms/operateOrder.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/queryOrderInfo.html"){
							buttonObj.eq(4).find("a").attr('href','/html/tms/queryOrderInfo.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/sendList.html"){
							buttonObj.eq(5).find("a").attr('href','/html/tms/sendList.html?objectId='+data[i].umObjectId+'')
						}
						if(data[i].objectCode == "/html/tms/classesList.html"){
							buttonObj.eq(6).find("a").attr('href','/html/tms/classesList.html?objectId='+data[i].umObjectId+'')
						}
					}
				})
			},100)
		},
	},
	created(){
		var that = this;
		that.logininf = JSON.parse(localStorage.getItem("logininf"));
		var nowData = GetNowdate();
		var searchInf = {
			endTime: nowData+" 23:59:59",
			startTime: nowData+" 00:00:00",
			tenantId: that.logininf.umTenantId
		};
		//获取订单详细信息
		that.publicChangeBtnStatus();
	  	postRequest(chartUrl + "/tenant/getOrderTotalNum.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchInf,function(data){
	  		that.statistics = data.result;
		});
	}
});

/*取得当天日期(yyyy-MM-dd)*/
function GetNowdate() {
    var nowDate = new Date();
    var str = nowDate.getFullYear() + "-" + NumToString(nowDate.getMonth() + 1) + "-" + NumToString(nowDate.getDate());
    return str;
}

function NumToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }
}
