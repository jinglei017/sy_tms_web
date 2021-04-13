var logininf = localStorage.getItem("logininf");
if (logininf == "" || logininf == null || logininf == undefined) {
    location.href = "/login.html"
}

var day2 = new Date();
day2.setTime(day2.getTime());
var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();

var getCurrentData = localStorage.getItem("getCurrentData");
if (getCurrentData == "" || getCurrentData == null || getCurrentData == undefined) {
    localStorage.setItem("getCurrentData", s2);
} else if (getCurrentData != s2) {
    var loginInf = JSON.parse(localStorage.getItem("logininf"));
    getRequest(umsUrl + "/user/logout?token=" + loginInf.token, function (res) {
        localStorage.removeItem("logininf");
        localStorage.setItem("getCurrentData", s2);
        location.href = "/login.html";
    })

}

//解决sortable.js拖拽打开新页面
document.body.ondrop = function (event) {
    event.preventDefault();
    event.stopPropagation();
};

// 关闭侧滑
function closeSideslip(){
    $(".adsRight .pageHeaderBack .visible").click();
}

var getAllData = localStorage.getItem("basicData");
getBasicData();

//获取基础数据
function getBasicData() {
    var basicDataObj = {};
    var logininf1 = JSON.parse(logininf);
    if (getAllData == "" || getAllData == null || getAllData == "null") {
        getRequest(cmdUrl + "/dictionary/all/all.json?token=" + logininf1.token + "&timeStamp=" + logininf1.timeStamp, function (res) {
            setTimeout(function () {
                $(".ajax-load-pupup").remove();
            }, 1000);
            getAllData = res.result;
            basicDataObj.qtyUnitList = getDictDataList('om_order', 'qty_unit');  //件数单位
            basicDataObj.volumeUnitList = getDictDataList('om_order', 'volume_unit');  //体积单位
            basicDataObj.currencyList = getDictDataList('om_order', 'currency');  //金额单位
            basicDataObj.weightUnitList = getDictDataList('om_order', 'weight_unit');  //重量单位
            basicDataObj.orderTypeList = getDictDataList('om_order', 'order_type');	//订单类型
            basicDataObj.orderNatureList = getDictDataList('om_order', 'order_nature');	//货物类型
            basicDataObj.partyTypeList = getDictDataList('cd_party', 'party_type'); 	//合作商类型
            basicDataObj.omPartyTypeList = getDictDataList('om_party', 'party_type'); 	//合作商类型
            basicDataObj.dtmTypeList = getDictDataList('om_dtm', 'dtm_type');	// 时间类型
            basicDataObj.eqpTypeList = getDictDataList('cd_eqp', 'eqp_type');  //设备类型
            basicDataObj.eqpLabelList = getDictDataList('cd_eqp', 'eqp_label');  //设备类型
            basicDataObj.eqpNatureList = getDictDataList('cd_eqp', 'eqp_nature');  //设备性质
            basicDataObj.orderToList = getDictDataList('om_order', 'order_to');	//发单方
            basicDataObj.orderFromList = getDictDataList('om_order', 'order_from');	//接单方
            basicDataObj.orderOrigin = getDictDataList('om_order', 'origin'); // 来源
            basicDataObj.contactLists = getDictDataList('cd_contact', 'contact_type');  // 联系人类型
            //basicDataObj.orderStatusList = getDictDataList('om_order', 'status'); // 状态
            basicDataObj.storeList = getDictDataList('om_party', 'party_no');  // 超时状态
            basicDataObj.expireStatusList = getDictDataList('om_order_status', 'expire_statusvarchar');  // 超时状态
            basicDataObj.completeStatusList = getDictDataList('om_order_status', 'complete_statusvarchar');  // 完成状态
            basicDataObj.sendStatusList = getDictDataList('om_order_status', 'send_statusvarchar');  // 发送状态
            basicDataObj.exceptionStatusList = getDictDataList('om_order_status', 'exception_statusvarchar');  // 异常状态
            basicDataObj.activeStatusList = getDictDataList('om_order_status', 'active_statusvarchar');  // 激活状态
            basicDataObj.payStatusList = getDictDataList('om_order_status', 'pay_statusvarchar');   // 支付状态
            basicDataObj.auditStatusList = getDictDataList('om_order_status', 'audit_statusvarchar');  // 审核状态
            basicDataObj.assignStatusList = getDictDataList('om_order_status', 'assign_status');  // 指派状态
            basicDataObj.billStatusList = getDictDataList('om_order_status', 'bill_status');   // 结算状态
            basicDataObj.actLists = getAllData.actList;  // 物流信息 —— 状态  // 动作状态
            basicDataObj.parRefTypeList = getDictDataList('cd_party_lnk', 'ref_type');  // cd 合作商模板类型
            basicDataObj.locRefTypeList = getDictDataList('cd_location_lnk', 'ref_type');  // cd 地址模板类型
            basicDataObj.eqpRefTypeList = getDictDataList('cd_eqp_lnk', 'ref_type');  // cd 设备模板类型
            basicDataObj.locationTypeList = getDictDataList('cd_location', 'location_type');  // cd 地址类型
            basicDataObj.locationLableList = getDictDataList('cd_location', 'location_lable');  // cd 地址标签
            basicDataObj.partyLists = getAllData.partyList;  // cd 合作商模板，平台集，发单方（默认，取partyList数组0）
            //basicDataObj.partyList = getPartyDataList(logininf1.umTenantId);
            basicDataObj.countryList = getAllData.countryList;  // 国家
            basicDataObj.provinceList = getAllData.provinceList;  // 省
            basicDataObj.cityList = getAllData.cityList;  // 市
            basicDataObj.districtList = getAllData.districtList;  // 区

            basicDataObj.rpTypeList = getDictDataList('bm_charge', 'rp_type');  //收付类型，AR/AP
            basicDataObj.chargeTypeList = getDictDataList('bm_charge', 'charge_type');  //费用编码
            basicDataObj.chargeGroupList = getDictDataList('bm_charge', 'charge_group');  //费用组编码
            basicDataObj.chargeStrategyList = getDictDataList('bm_charge', 'charge_strategy');  //计费规则
            basicDataObj.billTypeList = getDictDataList('bm_bill', 'bill_type');  //费用类型
            basicDataObj.payTypeList = getDictDataList('bm_bill', 'ref_code');  //付款类型
            basicDataObj.sourceCodeList = getDictDataList('bm_extra', 'source_code');  //来源
            basicDataObj.seteqpSpec= getDictDataList('cd_eqp', 'eqp_spec');  //设备型号
            localStorage.setItem("basicData", JSON.stringify(basicDataObj));
        })
        return basicDataObj;
    } else {
        getAllData = JSON.parse(localStorage.getItem("basicData"));
        basicDataObj = JSON.parse(localStorage.getItem("basicData"));
        return basicDataObj;
    }
}

function getJumpLinkList(linkNames){
    var jumpLinkList = JSON.parse(localStorage.getItem("jumpLinkList"));
    var linkHrefs = [];
    for(var a=0;a<jumpLinkList.length;a++){
        var linkFun = jumpLinkList[a].linkItemFun;
        for(var b=0;b<linkFun.length;b++){
            for(var d=0;d<linkNames.length;d++){
                if(linkFun[b].indexOf(linkNames[d]) != -1){
                    linkHrefs[d] = linkFun[b].split(":")[1];
                }
            }
        }
    }
    return linkHrefs;
}

//根据  tableName  columnName  匹配基础数据
function getDictDataList(tableName, columnName) {
    var dictListData, listData = [];
    if (getAllData != null && getAllData != "" && getAllData != undefined) {
        if (getAllData.dictList != null && getAllData.dictList != "" && getAllData.dictList != undefined) {
            dictListData = getAllData.dictList;
            for (var i = 0; i < dictListData.length; i++) {
                if (dictListData[i].tableName == tableName && dictListData[i].columnName == columnName) {
                    listData.push(dictListData[i]);
                }
            }
        }
    }
    return listData;
}

function getCountryData() {
    var countryData, listData = [];
    if (getAllData != null && getAllData != "" && getAllData != undefined) {
        if (getAllData.countryList != null && getAllData.countryList != "" && getAllData.countryList != undefined) {
            countryData = getAllData.countryList;
            for (var i = 0; i < countryData.length; i++) {
                listData.push(countryData[i]);
            }
        }
    }
    return listData;
}

//根据国家获取省
function getProvinceData(countryCode) {
    var provinceData, listData = [];
    if (getAllData != null && getAllData != "" && getAllData != undefined) {
        if (getAllData.provinceList != null && getAllData.provinceList != "" && getAllData.provinceList != undefined) {
            provinceData = getAllData.provinceList;
            for (var i = 0; i < provinceData.length; i++) {
                if (provinceData[i].parentCode == countryCode) {
                    listData.push(provinceData[i]);
                }
            }
        }
    }
    return listData;
}

//根据省获取市
function getCityData(provinceCode) {
    var cityData, listData = [];
    if (getAllData != null && getAllData != "" && getAllData != undefined) {
        if (getAllData.cityList != null && getAllData.cityList != "" && getAllData.cityList != undefined) {
            cityData = getAllData.cityList;
            for (var i = 0; i < cityData.length; i++) {
                if (cityData[i].parentCode == provinceCode) {
                    listData.push(cityData[i]);
                }
            }
        }
    }
    return listData;
}

//根据市获取区
function getDistrictData(cityCode) {
    var districtData, listData = [];
    if (getAllData != null && getAllData != "" && getAllData != undefined) {
        if (getAllData.districtList != null && getAllData.districtList != "" && getAllData.districtList != undefined) {
            districtData = getAllData.districtList;
            for (var i = 0; i < districtData.length; i++) {
                if (districtData[i].parentCode == cityCode) {
                    listData.push(districtData[i]);
                }
            }
        }
    }
    return listData;
}

//获取当前页面的id
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//获取合作商数据
function getPartyDataList(tenantId) {
    var partyData = getAllData.partyList;
    var listData = [];
    for (var i = 0; i < partyData.length; i++) {
        if (tenantId === partyData[i].umTenantId) {
            listData.push(partyData[i]);
        }
    }
    return listData;
}

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function postRequest(url, data, callback, txt) {
    $.ajax({
        url: url,
        type: "post",
        contentType: 'application/json',
        data: JSON.stringify(data),
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.msg == 'success' || response.msg == 'SUCCESS') {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    if (response.exceptionMsg != null) {
                        if (response.exceptionMsg == 'AUTHORIZEFAILURE') {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                            $(".ajax-load-hint img.closeTip").show();
                            setTimeout(function () {
                                location.href = "/login.html"
                            }, 3000);
                        } else {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint pre").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html(response.exceptionMsg);
                            $(".ajax-load-hint img.closeTip").show();
                        }
                    }
                }
            }
        },
        error: function (error) {
            if (error.responseJSON != undefined) {
                if (error.responseJSON != null) {
                    if (error.responseJSON.exceptionMsg == 'AUTHORIZEFAILURE') {
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                        $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                        $(".ajax-load-hint img.closeTip").show();
                        setTimeout(function () {
                            location.href = "/login.html"
                        }, 3000);
                        return false;
                    }
                }
            }

            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                } else {
                    $(".ajax-load-pupup").hide();
                }
                if ($('.ajax-load-pupup3').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                } else {
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
            } else {
                $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

/* ajax请求 —— 地址，方式，传参，成功回调函数，失败提示 */
function getRequest(url, callback, txt) {
    $.ajax({
        url: url,
        type: "get",
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.msg == 'success' || response.msg == 'SUCCESS') {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    if (response.exceptionMsg != null) {
                        if (response.exceptionMsg == 'AUTHORIZEFAILURE') {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                            $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                            $(".ajax-load-hint img.closeTip").show();
                            setTimeout(function () {
                                location.href = "/login.html"
                            }, 3000);
                        } else {
                            $(".ajax-load-pupup").addClass('hasExceptionMsg');
                            $(".hasExceptionMsg .ajax-load-hint span").css({'margin-top':'3%','margin-left':'4%'});
                            $(".ajax-load-pupup span").html("<pre>" + response.exceptionMsg + "</pre>");
                            $(".ajax-load-hint img.closeTip").show();
                        }
                    }
                }
            }
        },
        error: function (error) {
            if (error.responseJSON != undefined) {
                if (error.responseJSON != null) {
                    if (error.responseJSON.exceptionMsg == 'AUTHORIZEFAILURE') {
                        $(".ajax-load-pupup").addClass('hasExceptionMsg');
                        $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                        $(".ajax-load-pupup span").html('登录信息失效，页面将在3s后跳转至登录页');
                        $(".ajax-load-hint img.closeTip").show();
                        setTimeout(function () {
                            location.href = "/login.html"
                        }, 3000);
                        return false;
                    }
                }
            }

            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                } else {
                    $(".ajax-load-pupup").hide();
                }
                if ($('.ajax-load-pupup3').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                } else {
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
            } else {
                $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

/* 百度地图接口 —— 地址，方式，传参，成功回调函数，失败提示 */
function getRequestBMap(url, callback, txt) {
    $.ajax({
        url: url,
        async: false,
        type: "get",
        beforeSend: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
                }
            }
        },
        success: function (response) {
            if (response != null) {
                if (response.status == 0) {
                    setTimeout(function () {
                        if ($('.hasExceptionMsg').length < 1) {
                            $(".ajax-load-pupup").remove();
                        }
                    }, 300);
                    callback(response);
                } else {
                    $(".ajax-load-pupup").addClass('hasExceptionMsg');
                    $(".hasExceptionMsg .ajax-load-hint span").css('margin-top', '3%');
                    $(".ajax-load-pupup span").html('百度地图调用出错');   // response.message
                    $(".ajax-load-hint img.closeTip").show();
                }
            }
        },
        error: function () {
            if ($('.hasExceptionMsg').length < 1) {
                if ($('.ajax-load-pupup').length < 1) {
                } else {
                    $(".ajax-load-pupup").hide();
                }
                if ($('.ajax-load-pupup3').length < 1) {
                    $(".overall").append('<div class="ajax-load-pupup3 hasExceptionMsg"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>网络异常，请稍后重试！</span></div></div>');
                } else {
                    $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
                }
            } else {
                $(".ajax-load-pupup3 span").html('网络异常，请稍后重试！');
            }
            $(".ajax-load-hint img.closeTip").show();
        }
    });
}

/* 上传excel文件 —— 地址，成功回调函数 */
function fileUploadRequest(url, callback) {
    if ($('.ajax-load-pupup').length < 1) {
        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
    }
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        type: 'post',
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'excelFile', //文件上传域的ID
        dataType: 'json', //返回值类型一般设置为json
        success: function (response) {
            if (response != null) {
                if (response.exceptionMsg) {
                    $(".ajax-load-pupup").remove();
                    imitatePopup(response.exceptionMsg,'alert');
                }
                callback(response);
            }
        }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
            callback(e);
        }
    });
}

/* 上传订单附件 —— 地址，成功回调函数 */
function filesUploadRequest(url, callback) {
    if ($('.ajax-load-pupup').length < 1) {
        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
    }
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        type: 'post',
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'files', //文件上传域的ID
        dataType: 'json', //返回值类型一般设置为json
        success: function (response) {
            if (response != null) {
                if (response.exceptionMsg) {
                    $(".ajax-load-pupup").remove();
                    imitatePopup(response.exceptionMsg,"alert");
                }
                callback(response);
            }
        }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
            callback(e);
        }
    });
}

/* 上传订单图片 —— 地址，成功回调函数 */
function uploadImgUploadRequest(url, callback) {
    if ($('.ajax-load-pupup').length < 1) {
        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
    }
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        type: 'post',
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'imgfiles', //文件上传域的ID
        dataType: 'json', //返回值类型一般设置为json
        success: function (response) {
            if (response != null) {
                if (response.exceptionMsg) {
                    $(".ajax-load-pupup").remove();
                    imitatePopup(response.exceptionMsg,"alert");
                }
                callback(response);
            }
        }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
            callback(e);
        }
    });
}

/* 上传商品附件 —— 地址，成功回调函数 */
function itemFilesUploadRequest(url, callback) {
    if ($('.ajax-load-pupup').length < 1) {
        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
    }
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        type: 'post',
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'itemFiles', //文件上传域的ID
        dataType: 'json', //返回值类型一般设置为json
        success: function (response) {
            if (response != null) {
                if (response.exceptionMsg) {
                    $(".ajax-load-pupup").remove();
                    imitatePopup(response.exceptionMsg,"alert");
                }
                callback(response);
            }
        }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
            callback(e);
        }
    });
}

/* 上传商品图片 —— 地址，成功回调函数 */
function itemUploadImgUploadRequest(url, callback) {
    if ($('.ajax-load-pupup').length < 1) {
        $(".overall").append('<div class="ajax-load-pupup"><div class="ajax-load-hint"><img class="closeTip" src="../../img/windowicon/bar_icon_close.png" alt="" title="关闭提示" /><img src="/img/loading51.gif"/><span>数据加载中，请稍后......</span></div></div>');
    }
    $.ajaxFileUpload({
        url: url, //用于文件上传的服务器端请求地址
        type: 'post',
        secureuri: false, //是否需要安全协议，一般设置为false
        fileElementId: 'itemImgfiles', //文件上传域的ID
        dataType: 'json', //返回值类型一般设置为json
        success: function (response) {
            if (response != null) {
                if (response.exceptionMsg) {
                    $(".ajax-load-pupup").remove();
                    imitatePopup(response.exceptionMsg,"alert")
                }
                callback(response);
            }
        }, error: function (data, status, e) {  //提交失败自动执行的处理函数。
            callback(e);
        }
    });
}

function getCurrentTime() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ":";
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes() + ":";
    s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}

function getCurrentDate() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ":";
    m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes();
    return Y + M + D + h + m;
}

function getCurrentMounth() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    return Y + M + "01";
}

function getTodayTime() {
    var date = new Date();
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
}

function getQueryTime(dateParmes) {
    var date = new Date();
    var year, month, day;
    date.setDate(date.getDate() - dateParmes);
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    s = year + '-' + (month < 10 ? ('0' + month) : month) + '-' + (day < 10 ? ('0' + day) : day);
    return s;

}

//判断当前时间是否在指定的两个时间范围内
function compareTime (d1,d2,dateTime) {
    var dateBegin = new Date(d1);
    var dateEnd  = new Date(d2);

    var beginDiff = dateTime - dateBegin.getTime();//时间差的毫秒数
    var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000));//计算出相差天数
    var endDiff = dateEnd.getTime() - dateTime;//时间差的毫秒数
    var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000));//计算出相差天数

    if(beginDiff >= 0 && endDiff >= 0){
        return true;
    }else{
        return false;
    }
}

//秒转换成小时+分钟+秒
function formatSeconds(value) {
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

// 精确加法
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}

// 精确减法
function accSub(arg1, arg2) {
    var r1, r2, m, n;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//时间戳转化为时间
function timestampToTime(timestamp) {
    if (timestamp == null) {
        return '--';
    } else {
        //  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

        var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
        var currentTime = timestamp - offsetMs;
        var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ':';
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m;
    }
}

//时间戳转化为时间
function timestampToTime1(timestamp) {
    if (timestamp == null) {
        return '--';
    } else {
        var date ;
        //  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        if (timestamp.length==13){
            var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
            var currentTime = timestamp - offsetMs;
            date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        } else{
            date = new Date(timestamp);
        }
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        h = date.getHours() < 10 ? '0' + date.getHours() + ":" : date.getHours() + ':';
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ":" : date.getMinutes()+ ':';
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    }
}

function timestampToTime2(timestamp) { // 返回 年-月-日
    if (timestamp == null) {
        return '--';
    } else {
        //  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

        var offsetMs = new Date().getTimezoneOffset() * 60 * 1000
        var currentTime = timestamp - offsetMs;
        var date = new Date(currentTime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000

        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate();
        return Y + M + D;
    }
}

// 判断 正数，负数，不是数字
function checkNumType(num) {
    var reg = new RegExp("^-?[0-9]*.?[0-9]*$");
    if (reg.test(num)) { // 用于检测一个字符串是否匹配某个模式
        var absVal = Math.abs(num); // 如果参数是非负数，则返回该参数；如果参数是负数，则返回该参数的相反数。
        return num == absVal ? '正数' : '负数';
    }else {
        return '不是数字';
    }
}

/* 判断字符串str是否包含子串substr */
function isContains(str, substr) {
    return new RegExp(substr).test(str);
}

function formartDate(y, m, d, symbol) {
    symbol = symbol || '-';
    m = (m.toString())[1] ? m : '0' + m;
    d = (d.toString())[1] ? d : '0' + d;
    return y + symbol + m + symbol + d
}


// 去除数组重复元素：获取没重复的最右一值放入新数组
function quArraySameItemFun(array) {
    var r = [];
    for (var i = 0, l = array.length; i < l; i++) {
        for (var j = i + 1; j < l; j++)
            if (array[i] === array[j]) j = ++i;
        r.push(array[i]);
    }
    return r;
}

function deteleSameObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
        var keys = Object.keys(obj[i]);
        keys.sort(function (a, b) {
            return (Number(a) - Number(b));
        });
        var str = '';
        for (var j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }

    app.uniques = uniques;
    return uniques;
    //  return uniques.length;
}

// 删除指定元素
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

//alert
function imitatePopup(text,state,options){
    $('.ajax-load-pupup').remove();
    if ($('.hasExceptionMsg').length < 1) {
        if ($('.ajax-load-pupup-alert').length < 1) {
            var ajaxLoadPupup = '<div class="ajax-load-pupup-alert">' +
                '<div class="ajax-load-hint">' +
                    '<span class="alert"><pre>'+text+'</pre></span>' +
                    '<div class="ajax-load-button ajax-load-button1">' +
                        '<button class="sure sure1">确定</button>' +
                        '<button class="cancel">取消</button>' +
                    '</div>' +
                    '<div class="ajax-load-button ajax-load-button2">' +
                        '<button class="sure sure2">确定</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
            $(".overall").append(ajaxLoadPupup);
        }
    }
    if(state == 'alert' || state == '' || state == undefined || state == null){
        $(".ajax-load-button1").css("display","none");
        $('.ajax-load-pupup-alert').fadeIn(800);
        $(".sure2").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
        })
    }else{
        $(".ajax-load-button2").css("display","none");
        $('.ajax-load-pupup-alert').fadeIn(400);
        $(".sure1").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
            options(1)
        })
        $(".cancel").click(function(){
            $('.ajax-load-pupup-alert').fadeOut(400);
            $('.ajax-load-pupup-alert').remove();
            options(0)
        })
    }
}
