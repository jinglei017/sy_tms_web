var app = new Vue({
    el: '#overall',
    data: {
        logininf: {},
        tableContractList: [],
        templateTitle: '',
        conProvinceList: [],
        conCityList: [],
        partDivList: [],
        queryParam: {
            fPartyName: '',
            tPartyName: '',
            contractType: '通用合同',
            contractNo: ''
        },
        contractHeader: {
            fPartyName: '',
            tPartyName: '',
            fPartyCode: '',
            tPartyCode: '',
            contractType: '通用合同',
            contractNo: '',
            amendmentNo: '',
            effectDate: '',
            expiredDate: ''
        },
        contractBasicList: [],
        opeMeauTitle:"添加计费规则",
        order: 0,
        chargeRule: {},
        setting: {},
        zTreeNodesList: [],
        zTreeNodes: [],
        newTreeNode: [],
        ztreeIdName: "",
        btnPathway: 1,
        currentConOrder: '',
        moduleId: '',
        modulePid: '',
        dataTreeId: '',
        totalPagesNum :"",
        currentPage: 1,
        queryPageSize:20,
        pageAllList:[],
        isDisable:false,
        copyDisabled: false,
        clickBtnType: "",
        currTableContract: {}
    },
    watch:{
        'queryPageSize': function(newVal, oldVal) {
            this.queryPageSize = newVal;//赋值给每页显示的条数，否则选了的条数和切换分页显示的条数不一致
            this.getSearchVal()
        },
    },
    methods:{
        getSearchVal(){
            var that = this;
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo = {
                pageSize: that.queryPageSize,
                pageNum: 1
            };
            postRequest(bmsUrl + "/query/contractPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableContractList = res.result;
                that.currentPage = 1;
                that.pageAllList = [];
                that.totalPagesNum = res.pageInfo.total;
                $(".paging .pagingCon .pagination").animate({
                    "left": "0px"
                },300);
                for(var i = 0 ; i < res.pageInfo.pages;i++){
                    that.pageAllList[i] = i + 1;
                }
                that.publicChangeBtnStatus();
            })
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
            var that = this;
            var searchFormArr = that.queryParam;
            searchFormArr.pageInfo ={
                pageNum:pageNum,
                pageSize:that.queryPageSize
            };
            //获取订单列表
            postRequest(bmsUrl + "/query/contractPage.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                that.tableContractList = res.result;
            })
        },

        getContractInfos(template,order){
            var that = this;
            that.isDisable = true;
            that.clickBtnType = "detail";
            that.templateTitle = template;
            that.getOrderDetails(order);
        },

        changeContractInfos(template,order){
            var that = this;
            that.isDisable = false;
            that.clickBtnType = "edit";
            that.templateTitle = template;
            that.currTableContract = order;
            that.getOrderDetails(order);
        },

        getOrderDetails(order){
            var that = this;
            that.contractBasicList = [];
            that.partDivList = [];
            that.order = 0;
            that.zTreeNodesList = [];
            getRequest(bmsUrl + "/get/contractInfo.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&contractId=" + order.bmContractId, function (data) {
                that.contractHeader = data.result;
                if(data.result.effectDate){
                    that.contractHeader.effectDate = timestampToTime2(that.contractHeader.effectDate);
                }
                if(data.result.expiredDate){
                    that.contractHeader.expiredDate = timestampToTime2(that.contractHeader.expiredDate);
                }

                if(data.result.contractItemList){
                    var contractItemList = data.result.contractItemList;
                    for(let m=0;m<data.result.contractItemList.length;m++){
                        that.order += 1;
                        var zTreeNodes = [];
                        that.zTreeNodesList.push(zTreeNodes);

                        let partDivItem = {
                            order: that.order,
                            dataTreeItem: "dataTree"+that.order
                        };
                        that.partDivList.push(partDivItem);

                        var contractItemBasic = {
                            bmContractId: contractItemList[m].bmContractId,
                            bmContractItemId: contractItemList[m].bmContractItemId,
                            itemType: contractItemList[m].itemType,
                            itemName: contractItemList[m].itemName,
                            itemCode: contractItemList[m].itemCode,
                            remark: contractItemList[m].remark,
                            minAmount: contractItemList[m].minAmount,
                            maxAmount: contractItemList[m].maxAmount
                        };
                        that.contractBasicList.push(contractItemBasic);

                        setTimeout(function () {
                            $(".adsRightConPart .showBtn1").hide();
                            $(".adsRightConPart .showBtn2").show();

                            if (contractItemList[m].chargeStrategyList) {
                                var chargeStrategyList = contractItemList[m].chargeStrategyList;
                                for (var n = 0; n < chargeStrategyList.length; n++) {
                                    that.zTreeNodesList[m].push({
                                        id: chargeStrategyList[n].itemNo,
                                        pId: chargeStrategyList[n].fatherNo,
                                        chargeStrategyId: chargeStrategyList[n].bmChargeStrategyId,
                                        contractItemId: chargeStrategyList[n].bmContractItemId,
                                        name: chargeStrategyList[n].itemName,
                                        itemCode: that.changeItemType(chargeStrategyList[n].itemCode,"itemCode"),
                                        varName: chargeStrategyList[n].varName,
                                        varCode: chargeStrategyList[n].varCode,
                                        itemNo: chargeStrategyList[n].itemNo,
                                        varMax: chargeStrategyList[n].varMax,
                                        varMin: chargeStrategyList[n].varMin,
                                        basePrice: chargeStrategyList[n].basePrice,
                                        maxAmount: chargeStrategyList[n].maxAmount,
                                        priceType: that.changeItemType(chargeStrategyList[n].priceType,"priceType"),
                                        staPrice: chargeStrategyList[n].staPrice,
                                        staUnitValue: chargeStrategyList[n].staUnitValue,
                                        varValueType: that.changeItemType(chargeStrategyList[n].varValueType,"varValueType"),
                                        actDom: that.changeItemType(chargeStrategyList[n].actDom,"actDom"),
                                        repeatValue: that.changeItemType(chargeStrategyList[n].repeatValue,"repeatValue"),
                                        underlAct: that.changeItemType(chargeStrategyList[n].underlAct,"underlAct"),
                                        level: chargeStrategyList[n].level,
                                        seq: chargeStrategyList[n].seq
                                    });
                                }
                            }
                            $.fn.zTree.init($(".ztree").eq(m), that.setting, that.zTreeNodesList[m]);

                            var treeObj = $.fn.zTree.getZTreeObj(partDivItem.dataTreeItem);
                            var str = '<span onclick="addAccountRules(' + "'" + treeObj.setting.treeId + "'" + ',' + contractItemList[m].bmContractItemId + ',' + 0 + ',' + 0 + ')">添加计费规则</span>';
                            $("#" + partDivItem.dataTreeItem + "").siblings("div").find(".addconBtnsLi").append(str);

                            //添加表头
                            var li_head = '<li class="head">' +
                                '<a>' +
                                '<div class="diy">规则名称</div>' +
                                '<div class="diy">规则类型</div>' +
                                '<div class="diy">费用名称</div>' +
                                '<div class="diy">级别</div>' +
                                '<div class="diy">层次</div>' +
                                '<div class="diy">运算域</div>' +
                                '<div class="diy">值类型</div>' +
                                '<div class="diy">开始值</div>' +
                                '<div class="diy">结束值</div>' +
                                '<div class="diy">价格类型</div>' +
                                '<div class="diy">阶梯单价</div>' +
                                '<div class="diy">阶梯步长</div>' +
                                '<div class="diy">汇总金额</div>' +
                                '<div class="diy">上限金额</div>' +
                                '<div class="diy">与下级的运算符</div>' +
                                '<div class="diy">子级重复运算符</div>' +
                                '<div class="diy">操作</div>' +
                                '</a>' +
                                '</li>';
                            var rows = $(".ztree").eq(m).find('li');
                            if (rows.length > 0) {
                                rows.eq(0).before(li_head)
                            } else {
                                $(".ztree").eq(m).append(li_head);
                            }
                        }, 80)
                    }
                }
            })
        },
        changeItemType(code,txt) {
            var that = this;
            switch (txt) {
                case 'itemCode':
                    if (code && that.selectListData.chargeStrategyList) {
                        for (var i = 0; i < that.selectListData.chargeStrategyList.length; i++) {
                            if (that.selectListData.chargeStrategyList[i].code == code) {
                                return that.selectListData.chargeStrategyList[i].text
                            }
                        }
                    }
                    break;
                case 'varValueType':
                    if (code == '0') {
                        return "数值";
                    } else if(code == '1'){
                        return "字符";
                    } else if(code == '2'){
                        return "日期";
                    }
                    break;
                case 'actDom':
                    if (code == '0') {
                        return "当前域";
                    } else if(code == '1'){
                        return "非本域";
                    }
                    break;
                case 'repeatValue':
                    if (code == '0') {
                        return "加";
                    } else if(code == '1'){
                        return "减";
                    } else if(code == '2'){
                        return "乘";
                    } else if(code == '3'){
                        return "除";
                    } else if(code == '4'){
                        return "取大";
                    } else if(code == '5'){
                        return "取小";
                    }
                    break;
                case 'underlAct':
                    if (code == '0') {
                        return "加";
                    } else if(code == '1'){
                        return "减";
                    } else if(code == '2'){
                        return "乘";
                    } else if(code == '3'){
                        return "除";
                    } else if(code == '4'){
                        return "取大";
                    } else if(code == '5'){
                        return "取小";
                    }
                    break;
                case 'priceType':
                    if (code == '0') {
                        return "基础价";
                    } else if(code == '1'){
                        return "阶梯价";
                    }
                    break;
            }
        },
        changeVarCode(code) {
            var that = this;
            for (var i = 0; i < that.selectListData.chargeStrategyList.length; i++) {
                if (that.selectListData.chargeStrategyList[i].code == code) {
                    that.chargeRule.itemName = that.selectListData.chargeStrategyList[i].text
                }
            }
        },

        addContractInfos(template){
            var that = this;
            that.templateTitle = template;
            that.isDisable = false;
            $(".adsRightContractList").empty();
            that.contractHeader = {
                fPartyName: '',
                tPartyName: '',
                fPartyCode: '',
                tPartyCode: '',
                contractType: '通用合同',
                contractNo: '',
                amendmentNo: '',
                effectDate: getTodayTime(),
                expiredDate: getTodayTime()
            };
            that.zTreeNodesList = [];
            that.partDivList = [];
            that.contractBasicList = [];
            that.clickBtnType = "add";
            that.order = 0;
        },

        saveContractHeader(){ //新增保存
            var that = this;
            if(that.contractHeader.fPartyName == "" || that.contractHeader.tPartyName == "" || that.contractHeader.contractType == ""
            || that.contractHeader.contractNo == "" || that.contractHeader.amendmentNo == "" || that.contractHeader.effectDate == "" || that.contractHeader.expiredDate == ""){
                imitatePopup("请先填写完整合同信息！","alert");
                return false;
            }
            if(that.contractHeader.fPartyCode == ""){
                that.contractHeader.fPartyCode = that.contractHeader.fPartyName;
            }
            if(that.contractHeader.tPartyCode == ""){
                that.contractHeader.tPartyCode = that.contractHeader.tPartyName;
            }
            postRequest(bmsUrl + "/insert/contractByModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,that.contractHeader,function(res){
                that.contractHeader.bmContractId = res.result.bmContractId;
                imitatePopup("合同头部信息保存成功！","alert");
                that.clickBtnType = "edit";
                that.getSearchVal();
            })
        },

        editContractHeader(){
            var that = this;
            if(that.contractHeader.fPartyName == "" || that.contractHeader.tPartyName == "" || that.contractHeader.contractType == ""
                || that.contractHeader.contractNo == "" || that.contractHeader.amendmentNo == "" || that.contractHeader.effectDate == "" || that.contractHeader.expiredDate == ""){
                imitatePopup("请先填写完整合同信息！","alert");
                return false;
            }
            var searchFormArr = {
                bmContractId: that.contractHeader.bmContractId,
                tPartyCode: that.contractHeader.tPartyCode,
                fPartyCode: that.contractHeader.fPartyCode,
                tPartyName: that.contractHeader.tPartyName,
                fPartyName: that.contractHeader.fPartyName,
                contractType: that.contractHeader.contractType,
                contractNo: that.contractHeader.contractNo,
                amendmentNo: that.contractHeader.amendmentNo,
                effectDate: that.contractHeader.effectDate,
                expiredDate: that.contractHeader.expiredDate
            };
            postRequest(bmsUrl + "/save/contractByModel.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,searchFormArr,function(res){
                imitatePopup("合同头部信息修改成功！","alert");
                that.getSearchVal();
            })
        },

        addContractItem(){ // 添加合同项
            var that = this;
            var addSure = true;
            if(that.clickBtnType == 'add'){
                imitatePopup("请先保存合同信息！","alert");
                addSure = false;
            }
            $(".showBtn1").each(function(){
                if($(this).is(":visible")){
                    imitatePopup("存在未保存的合同项，请先保存再添加新合同项！","alert");
                    addSure = false;
                }
            });
            if(addSure == true){
                that.order += 1;
                var zTreeNodes = [];
                that.zTreeNodesList.push(zTreeNodes);
                var partDivItem = {
                    order: that.order,
                    dataTreeItem: "dataTree"+that.order
                };
                that.partDivList.push(partDivItem);
                var contractItemBasic = {
                    bmContractId: that.contractHeader.bmContractId,
                    itemType: "AR",
                    itemName: "",
                    itemCode: "",
                    remark: "",
                    minAmount: "",
                    maxAmount: ""
                };
                that.contractBasicList.push(contractItemBasic);
            }
        },

        saveAccountRules(partDivItem){ //保存
            var that = this;
            for(var j=0;j<that.partDivList.length;j++){
                if(that.partDivList[j].order == partDivItem.order){
                    var index = j;
                    var contractItemBasic = {
                        bmContractId: that.contractBasicList[j].bmContractId,
                        itemType: that.contractBasicList[j].itemType,
                        itemName: that.contractBasicList[j].itemName,
                        itemCode: that.contractBasicList[j].itemCode,
                        remark: that.contractBasicList[j].remark,
                        minAmount: that.contractBasicList[j].minAmount,
                        maxAmount: that.contractBasicList[j].maxAmount
                    };
                    if (contractItemBasic.itemType == "" || contractItemBasic.itemName == "" || contractItemBasic.itemCode == "" || contractItemBasic.minAmount == "" || contractItemBasic.maxAmount == "") {
                        imitatePopup("请先填写完整合同项基本信息！", "alert");
                        return false;
                    }
                    postRequest(bmsUrl + "/insert/contractItem.json?token="+that.logininf.token+"&timeStamp="+that.logininf.timeStamp,contractItemBasic,function(res){
                        var data = res.result;
                        that.contractBasicList[index].bmContractItemId = data.bmContractItemId;
                        $(".adsRightConPart").eq(index).find(".showBtn1").hide();
                        $(".adsRightConPart").eq(index).find(".showBtn2").show();

                        that.zTreeNodesList[partDivItem.order - 1] = [];
                        $.fn.zTree.init($("#" + partDivItem.dataTreeItem), that.setting, that.zTreeNodesList[partDivItem.order - 1]);

                        var treeObj = $.fn.zTree.getZTreeObj(partDivItem.dataTreeItem);
                        var str = '<span onclick="addAccountRules(' + "'" + treeObj.setting.treeId + "'" + ',' + data.bmContractItemId + ',' + 0 + ',' + 0 + ')">添加计费规则</span>';
                        $("#" + partDivItem.dataTreeItem + "").siblings("div").find(".addconBtnsLi").append(str);

                        //添加表头
                        var li_head = '<li class="head">' +
                            '<a>' +
                            '<div class="diy">规则名称</div>' +
                            '<div class="diy">规则类型</div>' +
                            '<div class="diy">费用名称</div>' +
                            '<div class="diy">级别</div>' +
                            '<div class="diy">层次</div>' +
                            '<div class="diy">运算域</div>' +
                            '<div class="diy">值类型</div>' +
                            '<div class="diy">开始值</div>' +
                            '<div class="diy">结束值</div>' +
                            '<div class="diy">价格类型</div>' +
                            '<div class="diy">阶梯单价</div>' +
                            '<div class="diy">阶梯步长</div>' +
                            '<div class="diy">汇总金额</div>' +
                            '<div class="diy">上限金额</div>' +
                            '<div class="diy">与下级的运算符</div>' +
                            '<div class="diy">子级重复运算符</div>' +
                            '<div class="diy">操作</div>' +
                            '</a>' +
                            '</li>';
                        var rows2 = $("#"+partDivItem.dataTreeItem).find('li');
                        if(rows2.length > 0) {
                            rows2.eq(0).before(li_head)
                        } else {
                            $("#"+partDivItem.dataTreeItem+"").append(li_head);
                        }
                    })
                }
            }
        },

        editAccountRules(partDivItem){
            var that = this;
            var dataTreeIdName = partDivItem.dataTreeItem + '_1';
            var zTree = $.fn.zTree.getZTreeObj(partDivItem.dataTreeItem);
            for (var j = 0; j < that.partDivList.length; j++) {
                if (that.partDivList[j].order == partDivItem.order) {
                    var index = j;
                    var contractItemBasic = that.contractBasicList[index];
                    if (contractItemBasic.itemType == "" || contractItemBasic.itemName == "" || contractItemBasic.itemCode == "" || contractItemBasic.minAmount == "" || contractItemBasic.maxAmount == "") {
                        imitatePopup("请先填写完整合同项基本信息！", "alert");
                        return false;
                    }
                    postRequest(bmsUrl + "/save/contractItem.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, contractItemBasic, function (res) {
                        imitatePopup("合同项修改成功！", "alert");
                        var data = res.result;
                        for (var i = 0; i < that.newTreeNode.length; i++) {
                            if (that.newTreeNode[i].tId == dataTreeIdName && that.newTreeNode[i].pId == null) {
                                that.newTreeNode[i].name = data.itemName;
                                zTree.updateNode(that.newTreeNode[i]);
                            }
                        }
                    })
                }
            }
        },

        removeAccountRules(partDivItem){ //删除合同项
            var that = this;
            var zTree = $.fn.zTree.getZTreeObj(partDivItem.dataTreeItem);
            for (var j = 0; j < that.partDivList.length; j++) {
                if (that.partDivList[j].order == partDivItem.order) {
                    var index = j;
                    if (that.contractBasicList[index].bmContractItemId == "" || that.contractBasicList[index].bmContractItemId == undefined) {
                        imitatePopup("确定删除该合同项？", "confirm", function (res) {
                            if (res == 1) {
                                $(".adsRightConPart").eq(index).hide();
                            }
                        });
                    } else {
                        imitatePopup("确定删除该合同项？", "confirm", function (res) {
                            if (res == 1) {
                                var bmContractItemId = that.contractBasicList[index].bmContractItemId;
                                getRequest(bmsUrl + "/delete/contractItem.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&bmContractItemId=" + bmContractItemId, function (res) {
                                    if (res.msg === "SUCCESS" || res.msg === "success") {
                                        $.fn.zTree.destroy(partDivItem.dataTreeItem);
                                        $(".adsRightConPart").eq(index).hide();
                                    } else {
                                        imitatePopup(res.msg, "alert");
                                    }
                                });
                            }
                        });
                    }
                }
            }
        },

        addAccountRules(treeId, cItemId, itemNo, id){ //添加计费规则
            var that = this;
            if(that.clickBtnType == "detail"){
                return false;
            }
            that.chargeRule = {
                bmContractItemId: cItemId,
                varName: "",
                varCode: "DELIVER",
                itemType: "MA",
                itemName: "",
                itemCode: "",
                currency: "CNY",
                varValueType: "0",
                level: 1,
                varMin: 0,
                varMax: 10000,
                varSmo: 0,
                basePrice: 1000.00,
                staPrice: 20.00,
                maxAmount: "10000",
                priceType: "0",
                fatherNo: itemNo,
                actDom: 0,
                repeatType: 0,
                repeatValue: 4,
                isUnderl: 0,
                underlAct: 4
            };
            that.opeMeauTitle = "添加计费规则";
            that.btnPathway = 1;
            that.moduleId = id;
            that.dataTreeId = treeId;
            $(".maskLayer1").show();
        },

        saveChargeRule() { //保存计费规则
            var that = this;
            var zTree = $.fn.zTree.getZTreeObj(that.dataTreeId);
            var currentPidNode = null;
            for (var i = 0; i < that.newTreeNode.length; i++) {
                if (that.newTreeNode[i].id == that.moduleId) {
                    currentPidNode = that.newTreeNode[i];
                    break;
                }
            }
            var searchFormArr = that.chargeRule;
            console.log(that.chargeRule.level)
            if (searchFormArr.varCode != "OTHER") {
                searchFormArr.varName = $(".userModifyUl .chargeNameee option:selected").text();
            } else {
                searchFormArr.varCode = searchFormArr.varName;
            }
            if (searchFormArr.priceType == '0') {
                searchFormArr.staPrice = 0;
            }
            postRequest(bmsUrl + "/insert/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                var data = res.result;
                zTree.addNodes(currentPidNode, {
                    id: data.itemNo,
                    pId: data.fatherNo,
                    contractItemId: data.bmContractItemId,
                    chargeStrategyId: data.bmChargeStrategyId,
                    name: data.itemName,
                    itemCode: that.changeItemType(data.itemCode,"itemCode"),
                    varName: data.varName,
                    varCode: data.varCode,
                    itemNo: data.itemNo,
                    varMax: data.varMax,
                    varMin: data.varMin,
                    basePrice: data.basePrice,
                    maxAmount: data.maxAmount,
                    priceType: that.changeItemType(data.priceType,"priceType"),
                    staPrice: data.staPrice,
                    staUnitValue: data.staUnitValue,
                    varValueType: that.changeItemType(data.varValueType,"varValueType"),
                    actDom: that.changeItemType(data.actDom,"actDom"),
                    repeatValue: that.changeItemType(data.repeatValue,"repeatValue"),
                    underlAct: that.changeItemType(data.underlAct,"underlAct"),
                    level: data.level,
                    seq: data.seq
                });
                $(".maskLayer").hide();
            })
        },

        copyChargeRule(){
            var that = this;
            var zTree = $.fn.zTree.getZTreeObj(that.dataTreeId);
            var currentParentNode = null;
            for (var i = 0; i < that.newTreeNode.length; i++) {
                if (that.newTreeNode[i].id == that.moduleId) {
                    currentParentNode = that.newTreeNode[i].getParentNode();
                    break;
                }
            }
            var searchFormArr = that.chargeRule;
            if (searchFormArr.varCode != "OTHER") {
                searchFormArr.varName = $(".userModifyUl .chargeNameee option:selected").text();
            } else {
                searchFormArr.varCode = searchFormArr.varName;
            }
            if (searchFormArr.priceType == '0') {
                searchFormArr.staPrice = 0;
            }
            postRequest(bmsUrl + "/insert/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                var data = res.result;
                zTree.addNodes(currentParentNode, {
                    id: data.itemNo,
                    pId: data.fatherNo,
                    contractItemId: data.bmContractItemId,
                    chargeStrategyId: data.bmChargeStrategyId,
                    name: data.itemName,
                    itemCode: that.changeItemType(data.itemCode,"itemCode"),
                    varName: data.varName,
                    varCode: data.varCode,
                    itemNo: data.itemNo,
                    varMax: data.varMax,
                    varMin: data.varMin,
                    basePrice: data.basePrice,
                    maxAmount: data.maxAmount,
                    priceType: that.changeItemType(data.priceType,"priceType"),
                    staPrice: data.staPrice,
                    staUnitValue: data.staUnitValue,
                    varValueType: that.changeItemType(data.varValueType,"varValueType"),
                    actDom: that.changeItemType(data.actDom,"actDom"),
                    repeatValue: that.changeItemType(data.repeatValue,"repeatValue"),
                    underlAct: that.changeItemType(data.underlAct,"underlAct"),
                    level: data.level,
                    seq: data.seq
                });
                $(".maskLayer").hide();
                that.copyDisabled = false;
            })
        },

        addDiyDom(treeId, treeNode) {
            var that = this;
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
            editStr += '<div class="diy">' + (treeNode.itemCode == null ? '&nbsp;' : treeNode.itemCode) + '</div>';//规则类型
            editStr += '<div class="diy">' + (treeNode.varName == null ? '&nbsp;' : treeNode.varName) + '</div>';//费用名称
            editStr += '<div class="diy">' + (treeNode.level == null ? '&nbsp;' : treeNode.level+1) + '</div>';//级别
            editStr += '<div class="diy">' + (treeNode.seq == null ? '&nbsp;' : treeNode.seq) + '</div>';//层次
            editStr += '<div class="diy">' + (treeNode.actDom == null ? '&nbsp;' : treeNode.actDom) + '</div>';//运算域
            editStr += '<div class="diy">' + (treeNode.varValueType == null ? '&nbsp;' : treeNode.varValueType) + '</div>';//值类型
            editStr += '<div class="diy">' + (treeNode.varMin == null ? '&nbsp;' : treeNode.varMin) + '</div>';//最小值
            editStr += '<div class="diy">' + (treeNode.varMax == null ? '&nbsp;' : treeNode.varMax) + '</div>';//最大值
            editStr += '<div class="diy">' + (treeNode.priceType == null ? '&nbsp;' : treeNode.priceType) + '</div>';//价格类型
            editStr += '<div class="diy">' + (treeNode.staPrice == null ? '&nbsp;' : treeNode.staPrice) + '</div>';//阶梯步长
            editStr += '<div class="diy">' + (treeNode.staUnitValue == null ? '&nbsp;' : treeNode.staUnitValue) + '</div>';//阶梯单价
            editStr += '<div class="diy">' + (treeNode.basePrice == null ? '&nbsp;' : treeNode.basePrice) + '</div>';//汇总金额
            editStr += '<div class="diy">' + (treeNode.maxAmount == null ? '&nbsp;' : treeNode.maxAmount) + '</div>';//上限金额
            editStr += '<div class="diy">' + (treeNode.underlAct == null ? '&nbsp;' : treeNode.underlAct) + '</div>';//与下级的运算符
            editStr += '<div class="diy">' + (treeNode.repeatValue == null ? '&nbsp;' : treeNode.repeatValue) + '</div>';//子级重复运算符
            editStr += '<div class="diy">' + that.formatHandle(treeId, treeNode) + '</div>';
            aObj.append(editStr);
        },
        formatHandle(treeId, treeNode) {
            var that = this;
            that.newTreeNode.push(treeNode);
            var htmlStr = '';
            htmlStr += '<span class="btn btn-details see" onClick="view(' + "'" + treeId + "'" + ',' + treeNode.contractItemId + ',' + treeNode.itemNo + ',' + treeNode.id + ',' + treeNode.level + ')" title="添加子规则">添加子规则</span>' +
                '<span class="btn btn-details see" onClick="copy(' + "'" + treeId + "'" + ',' + treeNode.id + ',' + treeNode.chargeStrategyId + ')" title="添加下级规则">添加下级规则</span>' +
                '<span class="btn btn-edit edit" onClick="edit(' + "'" + treeId + "'" + ',' + treeNode.id + ',' + treeNode.chargeStrategyId + ')">修改</span>' +
                '<span class="btn btn-delete" onClick="del(' + "'" + treeId + "'" + ',' + treeNode.id + ',' + treeNode.chargeStrategyId + ')">删除</span>';
            setTimeout(function () {
                if (that.clickBtnType == "detail") {
                    $(".ztree .btn").css({color:"#fff",background: "#aaa"})
                }
            }, 100);
            return htmlStr;
        },

        view(treeId, cItemId, no, id, level) {
            var that = this;
            if (that.clickBtnType == "detail") {
                return false;
            }
            that.btnPathway = 1;
            that.copyDisabled = false;
            var index = (treeId.substr(8, 1)) * 1;
            that.opeMeauTitle = "添加子级规则";
            that.chargeRule = {
                bmContractItemId: cItemId,
                varName: "",
                varCode: "DELIVER",
                itemType: "MA",
                itemName: "",
                itemCode: "",
                currency: "CNY",
                varValueType: "0",
                level: level+1,
                varMin: 0,
                varMax: 10000,
                varSmo: 0,
                basePrice: 1000.00,
                staPrice: 20.00,
                maxAmount: "10000",
                priceType: "0",
                fatherNo: no,
                actDom: 0,
                repeatType: 0,
                repeatValue: 4,
                isUnderl: 0,
                underlAct: 4
            };
            $(".maskLayer1").show();
            that.moduleId = id;
            that.dataTreeId = treeId;
        },

        copy(treeId, id, chargeStrategyId) { //添加下级规则
            var that = this;
            if (that.clickBtnType == "detail") {
                return false;
            }
            that.btnPathway = 5;
            that.copyDisabled = true;
            that.opeMeauTitle = "添加下层规则";
            $(".maskLayer1").show();
            that.dataTreeId = treeId;
            that.moduleId = id;
            getRequest(bmsUrl + "/get/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&bmChargeStrategyId=" + chargeStrategyId, function (res) {
                that.chargeRule = res.result;
                that.chargeRule.seq += 1;
            });
        },

        edit(treeId, id, chargeStrategyId) {
            var that = this;
            if (that.clickBtnType == "detail") {
                return false;
            }
            that.btnPathway = 4;
            that.copyDisabled = false;
            that.opeMeauTitle = "修改子规则";
            $(".maskLayer1").show();
            that.dataTreeId = treeId;
            that.moduleId = id;
            getRequest(bmsUrl + "/get/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&bmChargeStrategyId=" + chargeStrategyId, function (res) {
                that.chargeRule = res.result;
            });
        },
        editChargeRule(){
            var that = this;
            var zTree = $.fn.zTree.getZTreeObj(that.dataTreeId);
            var searchFormArr = that.chargeRule;
            if (searchFormArr.varCode != "OTHER") {
                searchFormArr.varName = $(".userModifyUl .chargeNameee option:selected").text();
            } else {
                searchFormArr.varCode = searchFormArr.varName;
            }
            if (searchFormArr.priceType == '0') {
                searchFormArr.staPrice = 0;
            }
            postRequest(bmsUrl + "/save/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp, searchFormArr, function (res) {
                var data = res.result;
                // that.getOrderDetails(that.currTableContract);
                for (var i = 0; i < that.newTreeNode.length; i++) {
                    if (that.newTreeNode[i].id == that.moduleId) {
                        that.newTreeNode[i].name = data.itemName;
                        that.newTreeNode[i].itemCode = that.changeItemType(data.itemCode,"itemCode");
                        that.newTreeNode[i].varName = data.varName;
                        that.newTreeNode[i].varCode = data.varCode;
                        that.newTreeNode[i].itemNo = data.itemNo;
                        that.newTreeNode[i].varMax = data.varMax;
                        that.newTreeNode[i].varMin = data.varMin;
                        that.newTreeNode[i].basePrice = data.basePrice;
                        that.newTreeNode[i].maxAmount = data.maxAmount;
                        that.newTreeNode[i].priceType = that.changeItemType(data.priceType,"priceType");
                        that.newTreeNode[i].staPrice = data.staPrice;
                        that.newTreeNode[i].staUnitValue = data.staUnitValue;
                        that.newTreeNode[i].varValueType = that.changeItemType(data.varValueType,"varValueType");
                        that.newTreeNode[i].actDom = that.changeItemType(data.actDom,"actDom");
                        that.newTreeNode[i].repeatValue = that.changeItemType(data.repeatValue,"repeatValue");
                        that.newTreeNode[i].underlAct = that.changeItemType(data.underlAct,"underlAct");
                        zTree.updateNode(that.newTreeNode[i]);
                    }
                }
                $(".maskLayer").hide();
            })
        },

        del(treeId, id, chargeStrategyId) {
            var that = this;
            if (that.clickBtnType == "detail") {
                return false;
            }
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            var index = 0;
            for (var i = 0; i < that.newTreeNode.length; i++) {
                if (that.newTreeNode[i].id == id) {
                    index = i;
                }
            }
            imitatePopup("确定删除该规则？", "confirm", function (res) {
                if (res == 1) {
                    getRequest(bmsUrl + "/delete/chargeStrategy.json?token=" + that.logininf.token + "&timeStamp=" + that.logininf.timeStamp + "&bmChargeStrategyId=" + chargeStrategyId, function (res) {
                        if (res.msg === "SUCCESS" || res.msg === "success") {
                            zTree.removeNode(that.newTreeNode[index]);
                        } else {
                            imitatePopup(res.msg, "alert");
                        }
                    });
                }
            });
        },

        closeRegionCh(){ //关闭“市”div
            var that = this;
            $(".regionConSelect").css("background","transparent");
            $(".regionConSelChildren").hide();
        },
        getAllCityList(provinceCode,index){ //根据省显示市
            var that = this;
            that.conCityList = getCityData(provinceCode);
            $(".regionConSelect").css("background","transparent");
            $(".regionConSelChildren").hide();
            setTimeout(function () {
                if($(".regionConSelect").eq(index).find(".regionConSelectPro").prop('checked') == true){
                    $(".regionConSelect").eq(index).css("background","#edf6ff");
                    $(".regionConSelect").eq(index).find(".regionConSelChildren input[type='checkbox']").prop('checked',true);
                    $(".regionConSelect").eq(index).find(".regionConSelChildren").show();
                }else{
                    $(".regionConSelect").css("background","transparent");
                    $(".regionConSelect").eq(index).find(".regionConSelChildren input[type='checkbox']").prop('checked',false);
                    $(".regionConSelChildren").hide();
                }
            },30);
        },
        chooseCityList(index){ //选择市
            var that = this;
            $(".regionConSelect").eq(index).css("background","#edf6ff");
            $(".regionConSelect").eq(index).find(".regionConSelChildren").show();
            var childCheckbox = $(".regionConSelect").eq(index).find(".regionConSelChildren input[type='checkbox']");
            var hasChecked = false;
            for(var i=0;i<childCheckbox.length;i++){
                if(childCheckbox[i].checked){
                    hasChecked = true;
                }
            }
            if(hasChecked == false){
                $(".regionConSelect").eq(index).find(".regionConSelectPro").prop('checked',false);
            }else{
                $(".regionConSelect").eq(index).find(".regionConSelectPro").prop('checked',true);
            }
        },
        regonAllChecked(){ //全选
            var that = this;
            $(".regionConSelect").find("input[type='checkbox']").prop('checked',true);
        },
        regonClearChecked(){ //清空
            var that = this;
            $(".regionConSelect").find("input[type='checkbox']").prop('checked',false);
            $(".regionConSelect").css("background","transparent");
            $(".regionConSelChildren").hide();
        },
        closeMaskLayer(){ //关闭弹窗
            $(".maskLayer").hide();
        },
        publicChangeBtnStatus(){
            var that = this;
            setTimeout(function(){
                var permissionListObj  = "";
                var pageid = GetQueryString("objectId");
                var buttonObj = $(".butOperatePermission");
                getRequest(umsUrl+'/query/objectByUser.json?token='+that.logininf.token+'&timeStamp='+that.logininf.timeStamp+"&userId="+that.logininf.umUserId+"&parentUmObjectId="+pageid,function(res){
                    permissionListObj  = res.result;
                    for(var i = 0; i < permissionListObj.length; i++){
                        for(var j = 0; j < buttonObj.length; j++){
                            if(permissionListObj[i].objectCode == buttonObj.eq(j).attr("buttonCode")){
                                for(var m = 0; m < permissionListObj[i].permissionList.length;m++){
                                    if(permissionListObj[i].permissionList[m].permissionCode == "SHOW" || permissionListObj[i].permissionList[m].permissionCode == "show"){
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
    },
    created:function(){
        var that = this;
        window.view = that.view;
        window.copy = that.copy;
        window.edit = that.edit;
        window.del = that.del;
        window.addAccountRules = that.addAccountRules;
        that.logininf = JSON.parse(localStorage.getItem("logininf"));
        that.selectListData = getBasicData();    //获取下拉数据
        that.conProvinceList = getProvinceData("100000");
        that.setting = {
            view: {
                showLine: false,
                showIcon: false,
                addDiyDom: that.addDiyDom
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        that.getSearchVal();
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
});



// 日期控件
$(document).ready(function() {
    $('input[name="effectDate"]').daterangepicker({ singleDatePicker: true }, function(start, end, label) {
        app.contractHeader.effectDate= start.format('YYYY-MM-DD');
    });

    $('input[name="expiredDate"]').daterangepicker({ singleDatePicker: true }, function(start, end, label) {
        app.contractHeader.expiredDate= start.format('YYYY-MM-DD');
    });
});

