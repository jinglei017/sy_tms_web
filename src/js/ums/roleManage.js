var app = new Vue({
    el: '#overall',
    data: {
		queryPageSize:20,
    	data2:[],
    	data3:[],
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
        queryParam:{},
        currentDqIndex:"",
        contactList:{},
        defaultCheckedId:[],
        roleInf:{},
        currentRoleId:"",
        meauList:{},
        actionList:{},
        subMeauArr:[],
        currentCotactIndex:"",
        templateTitle:"新增角色",
        itemSingle:{},
        allOrgList:{},
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    },
    methods:{
        addOrderDetails(title){
            this.templateTitle = title;
            this.clickBtnType = "add";
            var that = this;
            that.roleInf = {};
            that.isDisable = false;
        },
        closeMaskLayer(){
            $(".maskLayer").hide();
        },
        getOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "detail";
            that.isDisable = true;
            that.roleInf = pdItem;
        },
        changeOrderDetails(title,pdItem){
            this.templateTitle = title;
            var that = this;
            this.clickBtnType = "edit";
            that.isDisable = false;
            that.roleInf = pdItem;
        },
        editRoleInfo(pdItem){
        	var that = this;
        	postRequest(umsUrl + "/update/role.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.roleInf,function(res){
              //  alert("修改角色成功");
                // 关闭侧滑 ------ start
                closeSideslip();

                that.getSearchVal();
            })
        },
        deleteOrderDetails(pdItem){
            var that = this;
            var r = confirm("确定删除当前角色");
            if (r==true){
                getRequest(umsUrl + "/delete/role.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&roleId="+pdItem.umRoleId,function(res){
                 //   alert("删除当前角色成功");
                    that.getSearchVal();
                })
            }
        },
        saveNewRoleInfo(){
        	var that = this;
        	postRequest(umsUrl + "/add/role.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.roleInf,function(res){
              //  alert("新增角色成功");
                // 关闭侧滑 ------ start
                closeSideslip();

                that.getSearchVal();
            })
        },
        getSearchVal(){  // 搜索
            var that = this;
            var searchFormArr = {};
            searchFormArr = that.queryParam;
			searchFormArr.pageInfo = {
                pageNum:1,
                pageSize:100
           };
        	//获取订单列表
            postRequest(umsUrl + "/query/rolePage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
                that.publicChangeBtnStatus();
                $(".collUnfold").hide();
            })
        },
        allotOrganization(roleItem){  //跳转到分配组织页面
        	var that = this;
        	this.isDisable = true;
        	that.currentRoleId = roleItem.umRoleId;
        	that.roleInf = roleItem;
//          	$.ajax({
//			        url: umsUrl + "/query/roleOrgList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp+"&roleId="+that.currentRoleId,
//			        type: "post",
//			        success: function (res) {
//			        	var grantedMeauArr = [];
//			        	for(var i = 0 ; i < res.result.length;i++){
//			        		grantedMeauArr[i] = res.result[i].umOrgId
//			        	}
//			        	that.defaultCheckedId = grantedMeauArr;
//			        	//设置勾选的节点
//
//			        }
//			    });
        },
//      saveOrganization(){
//      	var that = this;
//			var selectedMenuObj = this.$refs.tree1.getCheckedNodes();
//			var selectedMenuArr = [];
//  		for(var i = 0 ; i < selectedMenuObj.length; i++){
//  			selectedMenuArr[i] = selectedMenuObj[i].id;
//  		}
//  		var paramsObj = {
//  			umRoleId: that.currentRoleId,
//  			orgIdList: selectedMenuArr
//  		}
//  		postRequest(umsUrl + "/assign/roleOrg?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){
//              alert("角色分配组织成功！");
//          })
//      },
        roleAuthor(roleItem){ //跳转到分配角色页面
        	var that = this;
        	this.isDisable = true;
        	that.currentRoleId = roleItem.umRoleId;
        	that.roleInf = roleItem;
        },
        publicGetRoleList(){
        	var that = this;
        	var searchFormArr = {
                pageInfo:{
                    pageNum:1,
                    pageSize:100
                }
            };
        	//获取订单列表
            postRequest(umsUrl + "/query/rolePage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableOrderList = res.result;
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
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        //获取订单列表
		that.publicGetRoleList();
		var searchFormArr = {
			level:1,
			parentUmOrgId:0
        }

		var searchFormArr1 = {
			level:"",
			parentOrgId:""
        }
//      postRequest(umsUrl + "/query/orgList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
//         	var data = res.result;
//         	for(var i = 0 ; i < data.length; i++){
//         		that.data3.push({
//      			id: data[i].umOrgId,
//      			label: data[i].orgName,
//      			level:data[i].level,
//      			children:[{
//      				id:"",
//      				label:""
//      			}]
//      		})
//         	}
//         	that.publicChangeBtnStatus();
//      })
        postRequest(umsUrl + "/query/orgList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr1,function(res){
           	that.allOrgList = res.result;
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


var logininf = JSON.parse(localStorage.getItem("logininf"));
var IDMark_Switch = "_switch",
	IDMark_Icon = "_ico",
	IDMark_Span = "_span",
	IDMark_Input = "_input",
	IDMark_Check = "_check",
	IDMark_Edit = "_edit",
	IDMark_Remove = "_remove",
	IDMark_Ul = "_ul",
	IDMark_A = "_a";


var setting = {
	check: {
		enable: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	/*callback:{
		onCheck:onCheck
	},*/
    view: {
        addDiyDom: addDiyDom
    }
};
var setting1 = {
	check: {
		enable: true
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback:{
		onCheck:onCheck1
	},
	view: {
		addDiyDom: addDiyDom1
	}
}
var zNodes = [];
var allOrgArray = [];
var searchFormArr1 = {
	level:"",
	parentOrgId:""
}
postRequest(umsUrl + "/query/orgList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,searchFormArr1,function(res){
    allOrgArray = res.result;
   	for(var i = 0; i < res.result.length; i++){
   		zNodes.push({
   			id: res.result[i].umOrgId,
   			pId: res.result[i].parentUmOrgId,
   			name: res.result[i].orgName,
   			level:res.result[i].level
   		})
   	}
   	var treeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
   	treeObj.expandAll(true);
})
var zNodes1 =[];
var meauDataObj = [];
$.ajax({
	url:umsUrl + "/get/adminBaseMenu.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,
	type: "post",
	success:function(res){
		meauDataObj = res.result;
		for(var i = 0; i < res.result.length; i++){
			if(res.result[i].permissionList.length != 0 && res.result[i].permissionList != undefined){
				var authId = res.result[i].permissionList[0].umPermissionId;
			}else{
				var authId = "-1";
			}
			zNodes1.push({
				id: res.result[i].umObjectId,
       			pId: res.result[i].parentObjectId,
       			name: res.result[i].objectName,
       			authId: authId,
       			children:[]
			})
		}
		var treeObj = $.fn.zTree.init($("#treeDemo1"), setting1, zNodes1);
		treeObj.expandAll(true);
	}
})

function addDiyDom(treeId, treeNode) {
    var aObj = $("#" + treeNode.tId + IDMark_A);
    for(var i = 0; i < allOrgArray.length;i++){
        if(treeNode.id == allOrgArray[i].umOrgId){
            var editStr = '<input type="checkbox" value="'+allOrgArray[i].umOrgId+'" class="inp-operate0"/><label for="" class="inp-txt">选中</label>';
            aObj.after(editStr);
        }
    }
}

function addDiyDom1(treeId, treeNode) {
    //if (treeNode.parentNode && treeNode.parentNode.id!=2) return;
    var aObj = $("#" + treeNode.tId + IDMark_A);
    var editStr = "";
    for(var i = 0; i < meauDataObj.length;i++){
        if(treeNode.id == meauDataObj[i].umObjectId){
            //console.log(123);
            editStr = "";
            for(var j = 0; j < meauDataObj[i].permissionList.length;j++){
                //console.log(222);
                editStr += '<input type="checkbox" value="'+meauDataObj[i].permissionList[j].umPermissionId+'" class="inp-operate"/><label for="" class="inp-txt">'+meauDataObj[i].permissionList[j].permissionName+'</label>';
            }
            aObj.after(editStr);
        }
    }
}

var checkedOrgId = [];
function onCheck(e, treeId, treeNode) {
	checkedOrgId = [];
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
	var	nodes = treeObj.getCheckedNodes(true);
	for(var i = 0; i < nodes.length; i++) {
		if(nodes[i].children == undefined || nodes[i].children.length == 0){
			checkedOrgId[checkedOrgId.length] =  nodes[i].id;
		}
	}
}


var checkedOrgId1 = [];
function onCheck1(e, treeId, treeNode) {
	var treeObj = $.fn.zTree.getZTreeObj("treeDemo1");
	var	nodes = treeObj.getCheckedNodes(true);
	var operateNode = $("#treeDemo1 .inp-operate");
	operateNode.prop("checked",false);
	for(var i = 0; i < operateNode.length; i++){
		for(var j = 0; j < nodes.length; j++){
			if(nodes[j].authId != "-1"){
				if(operateNode.eq(i).val() == nodes[j].authId){
					//console.log(operateNode.eq(i).val());
					operateNode.eq(i).prop("checked",true);
				}
			}
		}
	}
}

var code;

function setCheck() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
	py = $("#py").attr("checked")? "p":"",
	sy = $("#sy").attr("checked")? "s":"",
	pn = $("#pn").attr("checked")? "p":"",
	sn = $("#sn").attr("checked")? "s":"",
	type = { "Y":py + sy, "N":pn + sn};
	zTree.setting.check.chkboxType = type;
	showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
}
function showCode(str) {
	if (!code) code = $("#code");
	code.empty();
	code.append("<li>"+str+"</li>");
}

$(document).ready(function(){
	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	$.fn.zTree.init($("#treeDemo1"), setting1, zNodes1);
	setCheck();
	var currentOrgId = "";
	var currentMeauId = "";
	var umTenantId = "";
	var umUserId = "";
	$("#py").bind("change", setCheck);
	$("#sy").bind("change", setCheck);
	$("#pn").bind("change", setCheck);
	$("#sn").bind("change", setCheck);

	$(".saveNewOrgBtn").click(function(){
		/*if(checkedOrgId.length == 0){
			alert("保存失败，请重试！");
			return false;
		}
		var paramsObj = {
			umRoleId: currentOrgId,
			orgIdList: checkedOrgId
		};*/


        var orgOperateObj = $("#treeDemo .inp-operate0");
        var permissionIdArr = [];
        for(var i = 0; i < orgOperateObj.length; i++){
            if(orgOperateObj.eq(i).prop("checked")){
                permissionIdArr[permissionIdArr.length] = orgOperateObj.eq(i).val();  // way1
                //   permissionIdArr.push(orgOperateObj.eq(i).val());   // way2
            }
        }
        var paramsObj = {
            umRoleId: currentOrgId,
            orgIdList: permissionIdArr
        };
		postRequest(umsUrl + "/assign/roleOrg?token="+logininf.token+"&timeStamp="+logininf.timeStamp,paramsObj,function(res){
            imitatePopup("角色分配组织成功！","alert");

            // 关闭侧滑 ------ start
            closeSideslip();

            app.getSearchVal();
        })
	})

	$(".reportMessages tbody").on("click","tr #getAllotOrgId",function(){
	    var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo");
	    zTreeObj.checkAllNodes(false);
		zTreeObj.cancelSelectedNode();
		//zTreeObj.expandAll(false);
	    var zTree = zTreeObj.getCheckedNodes(false);
		currentOrgId = $(this).attr("orgid");
    	$.ajax({
	        url: umsUrl + "/query/roleOrgList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&roleId="+currentOrgId,
	        type: "post",
	        success: function (res) {

	        	//var grantedMeauArr = [];
	        	for(var i = 0; i < zTree.length;i++){
	        		for(var j = 0; j < res.result.length;j++){
	        			if(zTree[i].id == res.result[j].umOrgId){
              				zTreeObj.checkNode(zTree[i], true);

	        			}
	        		}
	        	}
	        }
	    })
	})

	$(".reportMessages tbody").on("click","tr #getAuthorMeauId",function(){
		$("#treeDemo1 .inp-operate").prop("checked",false);
	    var zTreeObj = $.fn.zTree.getZTreeObj("treeDemo1");
	    zTreeObj.checkAllNodes(false);
		zTreeObj.cancelSelectedNode();
		zTreeObj.expandAll(false);
	    var zTree = zTreeObj.getCheckedNodes(false);
		currentMeauId = $(this).attr("orgid");
		umTenantId = $(this).attr("orgid1");
		umUserId = $(this).attr("orgid2");
		$.ajax({
	        url: umsUrl + "/query/rolePermissionList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&roleId="+currentMeauId,
	        type: "post",
	        success: function (res) {
	        	var meauOperateObj = $("#treeDemo1 .inp-operate");
				for(var i = 0; i < zTree.length;i++){
	        		for(var j = 0; j < res.result.length;j++){
        				if(zTree[i].authId == res.result[j].umPermissionId){
              				zTreeObj.checkNode(zTree[i], true);
	        			}
	        		}
	       		}
				for(var i = 0; i < res.result.length; i++){
					for(var j = 0; j < meauOperateObj.length; j++){
						if(res.result[i].umPermissionId == meauOperateObj.eq(j).val()){
							meauOperateObj.eq(j).prop("checked",true);
						}
					}
				}
	        }
		});
	})

	$(".saveFunMeauBtn").click(function(){
		var meauOperateObj = $("#treeDemo1 .inp-operate");
		var permissionIdArr = [];
		for(var i = 0; i < meauOperateObj.length; i++){
			if(meauOperateObj.eq(i).prop("checked")){
				permissionIdArr[permissionIdArr.length] = meauOperateObj.eq(i).val()
			}
		}
		var paramsObj = {
			umRoleId: currentMeauId,
			umTenantId:umTenantId,
			umUserId:umUserId,
			permissionIdList: permissionIdArr
		}
		postRequest(umsUrl + "/assign/rolePermission?token="+logininf.token+"&timeStamp="+logininf.timeStamp,paramsObj,function(res){
            imitatePopup("角色授权成功！","alert");

            // 关闭侧滑 ------ start
            closeSideslip();

        })
	});
});
