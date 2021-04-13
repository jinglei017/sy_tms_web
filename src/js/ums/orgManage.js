var app = new Vue({
    el: '#overall',
    data: {
        tableOrderList:[],
        selectListData:{},
        organizationList:[],
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
        currentCotactIndex:"",
        templateTitle:"新增联系人",
        organizeInf:{}
    },
    methods:{
        addOrderDetails(title){
        	var that = this;
        	this.organizeInf = {};
            this.templateTitle = title;
            this.clickBtnType = "add";
            this.isDisable = false;
            this.organizeInf.parentUmOrgId = 0;
            this.organizeInf.level = 1;
        },
        closeMaskLayer(){
        	$(".maskLayer1").hide();
        },
        saveNewOrderInfo(){
            var that = this;
            if(that.organizeInf.orgCode.trim() == "" || that.organizeInf.orgCode == undefined){
            	imitatePopup("组织代码不能为空",'alert');
            	return false;
            }
            if(that.organizeInf.orgName.trim() == "" || that.organizeInf.orgName == undefined){
            	imitatePopup("组织名称不能为空",'alert');
            	return false;
            }

            var paramsObj = that.organizeInf;
            that.logininf = JSON.parse(localStorage.getItem("logininf"))
            //保存联系人信息
            postRequest(umsUrl + "/add/org.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,paramsObj,function(res){
                imitatePopup("保存组织信息成功",'alert');
                var zNodes = [];
				var searchFormArr1 = {
					level:"",
					parentOrgId:""
			    }
                console.log(res);
                postRequest(umsUrl + "/query/orgList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,searchFormArr1,function(res){
			       	for(var i = 0; i < res.result.length; i++){
			       		zNodes.push({
			       			id: res.result[i].umOrgId,
			       			pId: res.result[i].parentUmOrgId,
			       			name: res.result[i].orgName,
			       			level:res.result[i].level
			       		})
			       	}
			       	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
					$("#selectAll").bind("click", selectAll);

                    // 关闭侧滑 ------ start
                    closeSideslip();
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
    	this.publicChangeBtnStatus();
    	this.logininf = JSON.parse(localStorage.getItem("logininf"))
    }
})

var logininf = JSON.parse(localStorage.getItem("logininf"));
console.log(logininf);
var setting = {
	view: {
		addHoverDom: addHoverDom,
		removeHoverDom: removeHoverDom,
		selectedMulti: false
	},
	edit: {
		enable: true,
		editNameSelectAll: true,
		showRemoveBtn: showRemoveBtn,
		showRenameBtn: showRenameBtn
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		beforeDrag: beforeDrag,
		beforeEditName: beforeEditName,
		beforeRemove: beforeRemove,
		beforeRename: beforeRename,
		onRemove: onRemove,
		onRename: onRename
	}
};
var zNodes = [];
var searchFormArr1 = {
	level:"",
	parentOrgId:""
}
postRequest(umsUrl + "/query/orgList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,searchFormArr1,function(res){
   	for(var i = 0; i < res.result.length; i++){
   		zNodes.push({
   			id: res.result[i].umOrgId,
   			pId: res.result[i].parentUmOrgId,
   			name: res.result[i].orgName,
   			level:res.result[i].level
   		})
   	}
   	$.fn.zTree.init($("#treeDemo"), setting, zNodes);
	$("#selectAll").bind("click", selectAll);
})

var log, className = "dark";
function beforeDrag(treeId, treeNodes) {
	return false;
}

function beforeEditName(treeId, treeNode) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.selectNode(treeNode);
	setTimeout(function() {
		setTimeout(function() {
			zTree.editName(treeNode);
		}, 0);
	}, 0);
	return false;
}

function beforeRemove(treeId, treeNode) {
	className = (className === "dark" ? "":"dark");
	showLog("[ "+getTime()+" beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.selectNode(treeNode);
	return confirm("确认删除 组织-- " + treeNode.name + " 吗？");
}
function onRemove(e, treeId, treeNode) {
	showLog("[ "+getTime()+" onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
	getRequest(umsUrl + "/delete/org.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&orgId="+treeNode.id,function(res){
		console.log(res);
	})
}
function beforeRename(treeId, treeNode, newName, isCancel) {  //编辑之后进行的处理
	className = (className === "dark" ? "":"dark");
	showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
	if (newName.length == 0) {
		setTimeout(function() {
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			zTree.cancelEditName();
			imitatePopup("节点名称不能为空.",'alert');
		}, 0);
		return false;
	}else{
		var newOrgNameParams = {
			umOrgId: treeNode.id,
			orgCode: "",
			orgName: newName,
			level: treeNode.level + 1
		}
		postRequest(umsUrl + "/update/org.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,newOrgNameParams,function(res){

        })

	}
	return true;
}
function onRename(e, treeId, treeNode, isCancel) {
	showLog((isCancel ? "<span style='color:red'>":"") + "[ "+getTime()+" onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>":""));
}
function showRemoveBtn(treeId, treeNode) {
	if(treeNode.children == undefined || treeNode.children.length == 0){
		return treeNode
	}
	//return treeNode.isLastNode;
}
function showRenameBtn(treeId, treeNode) {
	return treeNode
}
function showLog(str) {
	if (!log) log = $("#log");
	log.append("<li class='"+className+"'>"+str+"</li>");
	if(log.children("li").length > 8) {
		log.get(0).removeChild(log.children("li")[0]);
	}
}
function getTime() {
	var now= new Date(),
	h=now.getHours(),
	m=now.getMinutes(),
	s=now.getSeconds(),
	ms=now.getMilliseconds();
	return (h+":"+m+":"+s+ " " +ms);
}

var newCount = 1;
var orgNameCount = 1;
var addOrgNameParams = {};
var treeNodeObj = {};
function addHoverDom(treeId, treeNode) {
	treeNodeObj = treeNode
	var sObj = $("#" + treeNode.tId + "_span");
	if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
		+ "' title='add' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_"+treeNode.tId);
	if (btn) btn.bind("click", function(){  //新增之后需要执行的
		addOrgNameParams = {
			parentUmOrgId: treeNode.id,
			level: treeNode.level + 2
		}
		$(".maskLayer1").show();
		return false;
	});
};

$(".saveNewOrgInf").click(function(){
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");

	if($(".newOrgCode").val().trim() == ""){
    	imitatePopup("组织代码不能为空",'alert');
    	return false;
    }
    if($(".newOrgName").val().trim() == ""){
    	imitatePopup("组织名称不能为空",'alert');
    	return false;
    }

	addOrgNameParams.orgCode = $(".newOrgCode").val();
	addOrgNameParams.orgName = $(".newOrgName").val();
	console.log(addOrgNameParams);
	postRequest(umsUrl + "/add/org.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,addOrgNameParams,function(res){
    	zTree.addNodes(treeNodeObj, {id:res.result.umOrgId, pId:res.result.parentUmOrgId, name:addOrgNameParams.orgName});
    })
	setTimeout(function(){
		$(".maskLayer1").hide();
	},100)
});

function removeHoverDom(treeId, treeNode) {   //删除之后执行的
	$("#addBtn_"+treeNode.tId).unbind().remove();
};
function selectAll() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
}
