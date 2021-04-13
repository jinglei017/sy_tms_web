var app = new Vue({
    el: '#overall',
    data: {
        organizationList:[],
        tableOrderList:{},
        clickBtnType:"",
        currentMeauId:"",
        isDisable:false,
        searchInf:[],
        pageList:[],
        totalList:[],
        orderDetail:{},
        logininf:{},
        queryParam:{},
        currentDqIndex:"",
        contactList:{},
        addOrgNameParams:{},
        addPermissionParmas:{},
        meauPermissionList:{},
        currentCotactIndex:"",
        currentPermissionId:{},
        templateTitle:"新增联系人",
        opeMeauTitle:"新增模块信息",
        permissTitle:"新增权限",
        permissionInf:{},
        isAddInf: true,
        moduleInf:{}
    },
    methods:{
        addOrderDetails(title){
        	var that = this;
        	this.moduleInf = {};
            this.templateTitle = title;
            this.clickBtnType = "add";
            this.isDisable = false;
            this.moduleInf.parentUmObjectId = 0;
        },
        closeMaskLayer(){
        	$(".maskLayer1").hide();
        	$(".permissionsLayer").hide();
        	var that = this;
        	that.addPermissionParmas = {};
        	that.permissTitle = "新增权限";

        },
//      getSearchVal(){
//          //订单搜索
//          var that = this;
//          var searchFormArr = {};
//          searchFormArr = that.queryParam;
//      	//获取订单列表
//      	postRequest(umsUrl + "/query/objectList.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
//              that.tableOrderList = res.result;
//              that.publicChangeBtnStatus();
//          })
//      },
       	resetOrderList(){
            window.location.reload();
        }
    },
    created:function(){
    	var that = this;
    	that.logininf = JSON.parse(localStorage.getItem("logininf"));

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
var zTreeNodes;
var setting = {
	view: {
		showLine: false,
		showIcon: false,
		addDiyDom: addDiyDom
	},
	data: {
		simpleData: {
			enable: true
		}
	}
};
/**
 * 自定义DOM节点
 */
function addDiyDom(treeId, treeNode) {
	var spaceWidth = 20;
	var liObj = $("#" + treeNode.tId);
	var aObj = $("#" + treeNode.tId + "_a");
	var switchObj = $("#" + treeNode.tId + "_switch");
	var icoObj = $("#" + treeNode.tId + "_ico");
	var spanObj = $("#" + treeNode.tId + "_span");
	aObj.attr('title', '');
	aObj.append('<div class="diy swich"></div>');
	var div = $(liObj).find('div').eq(0);
	switchObj.remove();
	spanObj.remove();
	icoObj.remove();
	div.append(switchObj);
	div.append(spanObj);
	var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
	switchObj.before(spaceStr);
	var editStr = '';
	editStr += '<div class="diy">' + (treeNode.type == null ? '&nbsp;' : treeNode.type) + '</div>';
	editStr += '<div class="diy">' + (treeNode.code == null ? '&nbsp;' : treeNode.code) + '</div>';
	editStr += '<div class="diy">' + (treeNode.desc == null ? '&nbsp;' : treeNode.desc) + '</div>';
	editStr += '<div class="diy">' + (treeNode.time == null ? '&nbsp;' : timestampToTime(treeNode.time)) + '</div>';
	editStr += '<div class="diy">' + formatHandle(treeNode) + '</div>';
	aObj.append(editStr);
}
/**
 * 查询数据
 */
function query() {
	var logininf = JSON.parse(localStorage.getItem("logininf"));
	zTreeNodes = [];
	getRequest(umsUrl + "/query/objectList.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&parentUmObjectId=",function(res){
        //初始化列表
		for(var i = 0; i < res.result.length; i++){
			if(res.result[i].umObjectId == 1){
				zTreeNodes.push({
					id: res.result[i].umObjectId,
		   			pId: res.result[i].parentObjectId,
		   			name: res.result[i].objectName,
		   			level: res.result[i].level,
		   			time: res.result[i].createTime,
		   			code: res.result[i].objectCode,
		   			type: res.result[i].objectType,
		   			desc: res.result[i].objectDesc,
		   			open: true
				})
			}else{
				zTreeNodes.push({
					id: res.result[i].umObjectId,
		   			pId: res.result[i].parentObjectId,
		   			name: res.result[i].objectName,
		   			level: res.result[i].level,
		   			time: res.result[i].createTime,
		   			code: res.result[i].objectCode,
		   			desc: res.result[i].objectDesc,
		   			type: res.result[i].objectType
				})
			}
		}
		console.log(zTreeNodes);
		//初始化树
		$.fn.zTree.init($("#dataTree"), setting, zTreeNodes);
		//添加表头
		var li_head  = '<li class="head">'+
							'<a>'+
								'<div class="diy" style="text-align: center;">菜单名称</div>'+
								'<div class="diy">菜单类型</div>'+
								'<div class="diy">菜单编码</div>'+
								'<div class="diy">菜单描述</div>'+
								'<div class="diy">创建时间</div>'+
								'<div class="diy">操作</div>'+
							'</a>'+
						'</li>'
		var rows = $("#dataTree").find('li');
		if(rows.length > 0) {
			rows.eq(0).before(li_head)
		} else {
			$("#dataTree").append(li_head);
		}
		//var zTree = $.fn.zTree.getZTreeObj("dataTree");
  })
}
/**
 * 根据权限展示功能按钮
 * @param treeNode
 * @returns {string}
 */
var newTreeNode  = [];
function formatHandle(treeNode) {
	newTreeNode.push(treeNode)
	var htmlStr = '';
	htmlStr += '<span class="btn btn-details see" onClick="view(' + treeNode.id+','+ treeNode.pId+ ')" title="新增下一级">新增</span>'+
				'<span class="btn btn-edit edit" onClick="edit(' + treeNode.id+','+ treeNode.pId+ ')">修改</span>'+
				'<span class="btn btn-logistics" onClick="seePermissions(' + treeNode.id+','+ treeNode.pId+ ')">权限</span>'+
				'<span class="btn btn-delete" onClick="del(\'' + treeNode.id + '\')">删除</span>'
	return htmlStr;
}

function view(id,pid){
	$(".saveNewMeauInf").show();
	$(".editMeauInf").hide();
	$(".maskLayer1").show();
	$(".maskLayer1 .popupTitle span").html("新增模块信息");
	$(".maskLayer1 .userModifyUlRows li input").val("");
	$(".currentModulePid").val(id);
}
function edit(id,pid){
	$(".saveNewMeauInf").hide();
	$(".editMeauInf").show();
	var logininf = JSON.parse(localStorage.getItem("logininf"));
	$(".maskLayer1").show();
	$(".maskLayer1 .popupTitle span").html("修改模块信息");
	$(".currentModulePid").val(pid);
	$(".currentModuleId").val(id);
	$.ajax({
		type: "get",
		url: umsUrl + "/get/object?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&objectId="+id,
		success:function(res){
			$(".newModuleCode").val(res.result.objectCode);
			$(".newModuleName").val(res.result.objectName);
			$(".newModuleType").val(res.result.objectType);
			$(".newModuleDesc").val(res.result.objectDesc);
		}
	});
}
function seePermissions(id){
	var logininf = JSON.parse(localStorage.getItem("logininf"));
	$(".newPermissionCode").val("");
	$(".newPermissionName").val("");
	$(".newPermissionId").val("");
	$(".permissionsLayer").show();
	$(".currentObjId").val(id);
	$(".permissionsLayer .addPermiss .permissTitle").html("新增权限");
	getCurrentObjPerlist(id);
}

function getCurrentObjPerlist(id){
	$(".permissionsCon .permissList .reportMessages .tbody").html("");
	postRequest(umsUrl + "/query/permissionList?token="+logininf.token+"&timeStamp="+logininf.timeStamp,{umObjectId:id},function(res){
		var permissList = "";
		for(var i = 0; i < res.result.length; i++){
			permissList += '<tr>'+
							'<td>'+
								'<p>'+res.result[i].umPermissionId+'</p>'+
							'</td>'+
							'<td>'+
								'<p>'+res.result[i].permissionName+'</p>'+
							'</td>'+
							'<td>'+
								'<p>'+res.result[i].permissionCode+'</p>'+
							'</td>'+
							'<td><span class="deleBtns" onClick="eidtPerItem(this,\'' + id + '\')">修改</span><span class="deleBtns" onClick="deletePerItem(this,' + id+')">删除</span></td>'+
						'</tr>'

		}
		$(".permissionsCon .permissList .reportMessages tbody").html(permissList);
	})
}

function del(id) {
	var zTree = $.fn.zTree.getZTreeObj("dataTree");
	var r = confirm("确认要删除吗？");
	if(r == true) {
		$.ajax({
			type: "get",
			url: umsUrl + "/delete/object?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&objectId="+id,
			success:function(res){
				if(res.result.success == true){
				    for(var i = 0; i < newTreeNode.length; i++){
				    	if(newTreeNode[i].id == id){
				    		zTree.removeNode(newTreeNode[i]);
				    	}
				    }
				}else{
					imitatePopup(res.result.message,"alert");
				}
			}
		});
	}
}

function eidtPerItem(that,id){
	var newPermissionCode = $(that).parents("tr").find("td").eq(2).children("p").html();
	var newPermissionName = $(that).parents("tr").find("td").eq(1).children("p").html();
	var currentPerId = $(that).parents("tr").find("td").eq(0).children("p").html();
	$(".newPermissionCode").val(newPermissionCode);
	$(".newPermissionName").val(newPermissionName)
	$(".currentPermissId").val(currentPerId);
	$(".permissionsLayer .addPermiss .permissTitle").html("修改权限")
}


function deletePerItem(that,id){
	var r = confirm("确认要删除吗？");
	var perId = $(that).parents("tr").find("td").eq(0).children("p").html();
	if(r == true) {
		$(".newPermissionCode").val("");
		$(".newPermissionName").val("");
		$(".currentPermissId").val("");
		$(".permissionsLayer .addPermiss .permissTitle").html("新增权限");
		$.ajax({
			type:"get",
			url: umsUrl + "/delete/permission?token="+logininf.token+"&timeStamp="+logininf.timeStamp+"&permissionId="+perId,
			success:function(){
				getCurrentObjPerlist(id);
			}
		})
	}
}

$(".saveNewPermissionInf").click(function(){
	if($(".newPermissionCode").val().trim() == ""){
        imitatePopup("权限代码不能为空","alert");
    	return false;
    }
    if($(".newPermissionName").val().trim() == ""){
        imitatePopup("权限名称不能为空","alert");
    	return false;
    }
    if($(".permissionsLayer .addPermiss .permissTitle").html() == "修改权限"){
        imitatePopup("请先修改权限","alert");
    	return false;
    }

    var addPermissionParmas = {
    	permissionCode: $(".newPermissionCode").val(),
    	permissionName: $(".newPermissionName").val(),
    	umObjectId: $(".currentObjId").val()
    };
	postRequest(umsUrl + "/add/permission.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,addPermissionParmas,function(data){
		getCurrentObjPerlist($(".currentObjId").val());
		$(".newPermissionCode").val("")
		$(".newPermissionName").val("")
    })
})

$(".eidtPermissionInf").click(function(){
	if($(".newPermissionCode").val().trim() == ""){
        imitatePopup("权限代码不能为空","alert");
    	return false;
    }
    if($(".newPermissionName").val().trim() == ""){
        imitatePopup("权限名称不能为空","alert");
    	return false;
    }
    var addPermissionParmas = {
    	permissionCode: $(".newPermissionCode").val(),
    	permissionName: $(".newPermissionName").val(),
    	umObjectId: $(".currentObjId").val(),
    	umPermissionId: $(".currentPermissId").val()
    };
	postRequest(umsUrl + "/update/permission.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,addPermissionParmas,function(data){
		getCurrentObjPerlist($(".currentObjId").val());
		$(".newPermissionCode").val("");
		$(".newPermissionName").val("");
		$(".currentPermissId").val("");
		$(".permissionsLayer .addPermiss .permissTitle").html("新增权限");
    })
})


$(".saveNewMeauInf").click(function(){
	var zTree = $.fn.zTree.getZTreeObj("dataTree");
    if($(".newModuleName").val().trim() == ""){
        imitatePopup("模块名称不能为空","alert");
    	return false;
    }
    if($(".newModuleType").val().trim() == ""){
        imitatePopup("模块类型不能为空","alert");
    	return false;
    }
    var addOrgNameParams = {
    	objectCode: $(".newModuleCode").val(),
    	objectName: $(".newModuleName").val(),
    	objectType: $(".newModuleType").val(),
    	objectDesc: $(".newModuleDesc").val(),
    	parentObjectId: $(".currentModulePid").val()
    }
    var modulePid = $(".currentModulePid").val();
    var currentPidNode = {};
    for(var i = 0; i < newTreeNode.length; i++){
    	if(newTreeNode[i].id == modulePid){
    		currentPidNode = newTreeNode[i]
    	}
    }
	postRequest(umsUrl + "/add/object.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,addOrgNameParams,function(res){
		zTree.addNodes(currentPidNode, {
			id:res.result.umObjectId,
			pId:res.result.parentObjectId,
			name:res.result.objectName,
   			level: res.result.level,
   			time: res.result.createTime,
   			code: res.result.objectCode,
   			type: res.result.objectType,
   			desc: res.result.objectDesc
		});
    })
	setTimeout(function(){
		$(".maskLayer1").hide();
	},100)
})

$(".editMeauInf").click(function(){
	var zTree = $.fn.zTree.getZTreeObj("dataTree");
	if($(".newModuleName").val().trim() == ""){
        imitatePopup("模块名称不能为空","alert");
    	return false;
    }
    if($(".newModuleType").val().trim() == ""){
        imitatePopup("模块类型不能为空","alert");
    	return false;
    }
    var addOrgNameParams = {
    	objectCode: $(".newModuleCode").val(),
    	objectName: $(".newModuleName").val(),
    	objectType: $(".newModuleType").val(),
    	objectDesc: $(".newModuleDesc").val(),
    	parentObjectId: $(".currentModulePid").val(),
    	umObjectId: $(".currentModuleId").val()
    }
    var currentModuleId = $(".currentModuleId").val();
    var currentPidNode = {};
    for(var i = 0; i < newTreeNode.length; i++){
    	if(newTreeNode[i].id == currentModuleId){
    		newTreeNode[i].name = $(".newModuleName").val();
    		newTreeNode[i].code = $(".newModuleCode").val();
    		newTreeNode[i].type = $(".newModuleType").val();
    		newTreeNode[i].desc = $(".newModuleDesc").val();

    		zTree.updateNode(newTreeNode[i]);
    	}
    }

	postRequest(umsUrl + "/update/object.json?token="+logininf.token+"&timeStamp="+logininf.timeStamp,addOrgNameParams,function(res){

    })
	setTimeout(function(){
		$(".maskLayer1").hide();
	},100)
})
$(function(){
	query();
})

