
localStorage.removeItem("forgetCity");    // 页面初始化，清除之前点击的tws

var markersPng = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';  // 标记点图标

var markersArray = [];  // 标记点集合

var orderNumAll;

var testData = [
    {"adcode": "110000", "padcode": 100000, "name": "北京市", "value": 32,"orderNum":80},
    {"adcode": "120000", "padcode": 100000, "name": "天津市", "value": 17,"orderNum":50},
    {"adcode": "130000", "padcode": 100000, "name": "河北省", "value": 180,"orderNum":60},
    {"adcode": "140000", "padcode": 100000, "name": "山西省", "value": 131,"orderNum":56},
    {"adcode": "150000", "padcode": 100000, "name": "内蒙古自治区", "value": 116,"orderNum":71},
    {"adcode": "210000", "padcode": 100000, "name": "辽宁省", "value": 115,"orderNum":73},
    {"adcode": "220000", "padcode": 100000, "name": "吉林省", "value": 70,"orderNum":65},
    {"adcode": "230000", "padcode": 100000, "name": "黑龙江省", "value": 142,"orderNum":57},
    {"adcode": "310000", "padcode": 100000, "name": "上海市", "value": 17,"orderNum":52},
    {"adcode": "320000", "padcode": 100000, "name": "江苏省", "value": 110,"orderNum":67},
    {"adcode": "330000", "padcode": 100000, "name": "浙江省", "value": 101,"orderNum":73},
    {"adcode": "340000", "padcode": 100000, "name": "安徽省", "value": 122,"orderNum":83},
    {"adcode": "350000", "padcode": 100000, "name": "福建省", "value": 95,"orderNum":69},
    {"adcode": "360000", "padcode": 100000, "name": "江西省", "value": 112,"orderNum":61},
    {"adcode": "370000", "padcode": 100000, "name": "山东省", "value": 155,"orderNum":50},
    {"adcode": "410000", "padcode": 100000, "name": "河南省", "value": 176,"orderNum":70},
    {"adcode": "420000", "padcode": 100000, "name": "湖北省", "value": 117,"orderNum":90},
    {"adcode": "430000", "padcode": 100000, "name": "湖南省", "value": 137,"orderNum":30},
    {"adcode": "440000", "padcode": 100000, "name": "广东省", "value": 143,"orderNum":19},
    {"adcode": "450000", "padcode": 100000, "name": "广西壮族自治区", "value": 126,"orderNum":10},
    {"adcode": "460000", "padcode": 100000, "name": "海南省", "value": 28,"orderNum":23},
    {"adcode": "500000", "padcode": 100000, "name": "重庆市", "value": 39,"orderNum":83},
    {"adcode": "510000", "padcode": 100000, "name": "四川省", "value": 205,"orderNum":66},
    {"adcode": "520000", "padcode": 100000, "name": "贵州省", "value": 98,"orderNum":50},
    {"adcode": "530000", "padcode": 100000, "name": "云南省", "value": 146,"orderNum":30},
    {"adcode": "540000", "padcode": 100000, "name": "西藏自治区", "value": 82,"orderNum":70},
    {"adcode": "610000", "padcode": 100000, "name": "陕西省", "value": 118,"orderNum":76},
    {"adcode": "620000", "padcode": 100000, "name": "甘肃省", "value": 101,"orderNum":69},
    {"adcode": "630000", "padcode": 100000, "name": "青海省", "value": 52,"orderNum":50},
    {"adcode": "640000", "padcode": 100000, "name": "宁夏回族自治区", "value": 28,"orderNum":60},
    {"adcode": "650000", "padcode": 100000, "name": "新疆维吾尔自治区", "value": 120,"orderNum":60},
    {"adcode": "710000", "padcode": 100000, "name": "台湾省", "value": 1,"orderNum":81},
    {"adcode": "810000", "padcode": 100000, "name": "香港特别行政区", "value": 1,"orderNum":62},
    {"adcode": "820000", "padcode": 100000, "name": "澳门特别行政区", "value": 1,"orderNum":61},
    {"adcode": "130100", "padcode": "130000", "name": "石家庄市", "value": 23},
    {"adcode": "130200", "padcode": "130000", "name": "唐山市", "value": 15},
    {"adcode": "130300", "padcode": "130000", "name": "秦皇岛市", "value": 8},
    {"adcode": "130400", "padcode": "130000", "name": "邯郸市", "value": 19},
    {"adcode": "130500", "padcode": "130000", "name": "邢台市", "value": 20},
    {"adcode": "130600", "padcode": "130000", "name": "保定市", "value": 25},
    {"adcode": "130700", "padcode": "130000", "name": "张家口市", "value": 17},
    {
        "adcode": "130800",
        "padcode": "130000",
        "name": "承德市",
        "value": 12
    }, {"adcode": "130900", "padcode": "130000", "name": "沧州市", "value": 17},
    {
        "adcode": "131000",
        "padcode": "130000",
        "name": "廊坊市",
        "value": 11
    }, {"adcode": "131100", "padcode": "130000", "name": "衡水市", "value": 12},
    {
        "adcode": "140100",
        "padcode": "140000",
        "name": "太原市",
        "value": 11
    }, {"adcode": "140200", "padcode": "140000", "name": "大同市", "value": 12},
    {
        "adcode": "140300",
        "padcode": "140000",
        "name": "阳泉市",
        "value": 6
    }, {"adcode": "140400", "padcode": "140000", "name": "长治市", "value": 14},
    {
        "adcode": "140500",
        "padcode": "140000",
        "name": "晋城市",
        "value": 7
    }, {"adcode": "140600", "padcode": "140000", "name": "朔州市", "value": 7},
    {
        "adcode": "140700",
        "padcode": "140000",
        "name": "晋中市",
        "value": 12
    }, {"adcode": "140800", "padcode": "140000", "name": "运城市", "value": 14},
    {
        "adcode": "140900",
        "padcode": "140000",
        "name": "忻州市",
        "value": 15
    }, {"adcode": "141000", "padcode": "140000", "name": "临汾市", "value": 18},
    {
        "adcode": "141100",
        "padcode": "140000",
        "name": "吕梁市",
        "value": 14
    }, {"adcode": "150100", "padcode": "150000", "name": "呼和浩特市", "value": 10},
    {
        "adcode": "150200",
        "padcode": "150000",
        "name": "包头市",
        "value": 10
    }, {"adcode": "150300", "padcode": "150000", "name": "乌海市", "value": 4},
    {
        "adcode": "150400",
        "padcode": "150000",
        "name": "赤峰市",
        "value": 13
    }, {"adcode": "150500", "padcode": "150000", "name": "通辽市", "value": 9},
    {
        "adcode": "150600",
        "padcode": "150000",
        "name": "鄂尔多斯市",
        "value": 10
    }, {"adcode": "150700", "padcode": "150000", "name": "呼伦贝尔市", "value": 15},
    {
        "adcode": "150800",
        "padcode": "150000",
        "name": "巴彦淖尔市",
        "value": 8
    }, {"adcode": "150900", "padcode": "150000", "name": "乌兰察布市", "value": 12},
    {
        "adcode": "152200",
        "padcode": "150000",
        "name": "兴安盟",
        "value": 7
    }, {"adcode": "152500", "padcode": "150000", "name": "锡林郭勒盟", "value": 13},
    {
        "adcode": "152900",
        "padcode": "150000",
        "name": "阿拉善盟",
        "value": 4
    }, {"adcode": "210100", "padcode": "210000", "name": "沈阳市", "value": 14},
    {
        "adcode": "210200",
        "padcode": "210000",
        "name": "大连市",
        "value": 11
    }, {"adcode": "210300", "padcode": "210000", "name": "鞍山市", "value": 8},
    {
        "adcode": "210400",
        "padcode": "210000",
        "name": "抚顺市",
        "value": 8
    }, {"adcode": "210500", "padcode": "210000", "name": "本溪市", "value": 7},
    {
        "adcode": "210600",
        "padcode": "210000",
        "name": "丹东市",
        "value": 7
    }, {"adcode": "210700", "padcode": "210000", "name": "锦州市", "value": 8},
    {
        "adcode": "210800",
        "padcode": "210000",
        "name": "营口市",
        "value": 7
    }, {"adcode": "210900", "padcode": "210000", "name": "阜新市", "value": 8},
    {
        "adcode": "211000",
        "padcode": "210000",
        "name": "辽阳市",
        "value": 8
    }, {"adcode": "211100", "padcode": "210000", "name": "盘锦市", "value": 5}, {
        "adcode": "211200",
        "padcode": "210000",
        "name": "铁岭市",
        "value": 8
    }, {"adcode": "211300", "padcode": "210000", "name": "朝阳市", "value": 8}, {
        "adcode": "211400",
        "padcode": "210000",
        "name": "葫芦岛市",
        "value": 7
    }, {"adcode": "220100", "padcode": "220000", "name": "长春市", "value": 11}, {
        "adcode": "220200",
        "padcode": "220000",
        "name": "吉林市",
        "value": 10
    }, {"adcode": "220300", "padcode": "220000", "name": "四平市", "value": 7}, {
        "adcode": "220400",
        "padcode": "220000",
        "name": "辽源市",
        "value": 5
    }, {"adcode": "220500", "padcode": "220000", "name": "通化市", "value": 8}, {
        "adcode": "220600",
        "padcode": "220000",
        "name": "白山市",
        "value": 7
    }, {"adcode": "220700", "padcode": "220000", "name": "松原市", "value": 6}, {
        "adcode": "220800",
        "padcode": "220000",
        "name": "白城市",
        "value": 6
    }, {"adcode": "222400", "padcode": "220000", "name": "延边朝鲜族自治州", "value": 9}, {
        "adcode": "230100",
        "padcode": "230000",
        "name": "哈尔滨市",
        "value": 19
    }, {"adcode": "230200", "padcode": "230000", "name": "齐齐哈尔市", "value": 17}, {
        "adcode": "230300",
        "padcode": "230000",
        "name": "鸡西市",
        "value": 10
    }, {"adcode": "230400", "padcode": "230000", "name": "鹤岗市", "value": 9}, {
        "adcode": "230500",
        "padcode": "230000",
        "name": "双鸭山市",
        "value": 9
    }, {"adcode": "230600", "padcode": "230000", "name": "大庆市", "value": 10}, {
        "adcode": "230700",
        "padcode": "230000",
        "name": "伊春市",
        "value": 18
    }, {"adcode": "230800", "padcode": "230000", "name": "佳木斯市", "value": 11}, {
        "adcode": "230900",
        "padcode": "230000",
        "name": "七台河市",
        "value": 5
    }, {"adcode": "231000", "padcode": "230000", "name": "牡丹江市", "value": 11}, {
        "adcode": "231100",
        "padcode": "230000",
        "name": "黑河市",
        "value": 7
    }, {"adcode": "231200", "padcode": "230000", "name": "绥化市", "value": 11}, {
        "adcode": "232700",
        "padcode": "230000",
        "name": "大兴安岭地区",
        "value": 4
    }, {"adcode": "320100", "padcode": "320000", "name": "南京市", "value": 12}, {
        "adcode": "320200",
        "padcode": "320000",
        "name": "无锡市",
        "value": 8
    }, {"adcode": "320300", "padcode": "320000", "name": "徐州市", "value": 11}, {
        "adcode": "320400",
        "padcode": "320000",
        "name": "常州市",
        "value": 7
    }, {"adcode": "320500", "padcode": "320000", "name": "苏州市", "value": 10}, {
        "adcode": "320600",
        "padcode": "320000",
        "name": "南通市",
        "value": 9
    }, {"adcode": "320700", "padcode": "320000", "name": "连云港市", "value": 7}, {
        "adcode": "320800",
        "padcode": "320000",
        "name": "淮安市",
        "value": 8
    }, {"adcode": "320900", "padcode": "320000", "name": "盐城市", "value": 10}, {
        "adcode": "321000",
        "padcode": "320000",
        "name": "扬州市",
        "value": 7
    }, {"adcode": "321100", "padcode": "320000", "name": "镇江市", "value": 7}, {
        "adcode": "321200",
        "padcode": "320000",
        "name": "泰州市",
        "value": 7
    }, {"adcode": "321300", "padcode": "320000", "name": "宿迁市", "value": 6}, {
        "adcode": "330100",
        "padcode": "330000",
        "name": "杭州市",
        "value": 14
    }, {"adcode": "330200", "padcode": "330000", "name": "宁波市", "value": 11}, {
        "adcode": "330300",
        "padcode": "330000",
        "name": "温州市",
        "value": 12
    }, {"adcode": "330400", "padcode": "330000", "name": "嘉兴市", "value": 8}, {
        "adcode": "330500",
        "padcode": "330000",
        "name": "湖州市",
        "value": 6
    }, {"adcode": "330600", "padcode": "330000", "name": "绍兴市", "value": 7}, {
        "adcode": "330700",
        "padcode": "330000",
        "name": "金华市",
        "value": 10
    }, {"adcode": "330800", "padcode": "330000", "name": "衢州市", "value": 7}, {
        "adcode": "330900",
        "padcode": "330000",
        "name": "舟山市",
        "value": 5
    }, {"adcode": "331000", "padcode": "330000", "name": "台州市", "value": 10}, {
        "adcode": "331100",
        "padcode": "330000",
        "name": "丽水市",
        "value": 10
    }, {"adcode": "340100", "padcode": "340000", "name": "合肥市", "value": 10}, {
        "adcode": "340200",
        "padcode": "340000",
        "name": "芜湖市",
        "value": 9
    }, {"adcode": "340300", "padcode": "340000", "name": "蚌埠市", "value": 8}, {
        "adcode": "340400",
        "padcode": "340000",
        "name": "淮南市",
        "value": 8
    }, {"adcode": "340500", "padcode": "340000", "name": "马鞍山市", "value": 7}, {
        "adcode": "340600",
        "padcode": "340000",
        "name": "淮北市",
        "value": 5
    }, {"adcode": "340700", "padcode": "340000", "name": "铜陵市", "value": 5}, {
        "adcode": "340800",
        "padcode": "340000",
        "name": "安庆市",
        "value": 11
    }, {"adcode": "341000", "padcode": "340000", "name": "黄山市", "value": 8}, {
        "adcode": "341100",
        "padcode": "340000",
        "name": "滁州市",
        "value": 9
    }, {"adcode": "341200", "padcode": "340000", "name": "阜阳市", "value": 9}, {
        "adcode": "341300",
        "padcode": "340000",
        "name": "宿州市",
        "value": 6
    }, {"adcode": "341500", "padcode": "340000", "name": "六安市", "value": 8}, {
        "adcode": "341600",
        "padcode": "340000",
        "name": "亳州市",
        "value": 5
    }, {"adcode": "341700", "padcode": "340000", "name": "池州市", "value": 5}, {
        "adcode": "341800",
        "padcode": "340000",
        "name": "宣城市",
        "value": 8
    }, {"adcode": "350100", "padcode": "350000", "name": "福州市", "value": 14}, {
        "adcode": "350200",
        "padcode": "350000",
        "name": "厦门市",
        "value": 7
    }, {"adcode": "350300", "padcode": "350000", "name": "莆田市", "value": 6}, {
        "adcode": "350400",
        "padcode": "350000",
        "name": "三明市",
        "value": 13
    }, {"adcode": "350500", "padcode": "350000", "name": "泉州市", "value": 13}, {
        "adcode": "350600",
        "padcode": "350000",
        "name": "漳州市",
        "value": 12
    }, {"adcode": "350700", "padcode": "350000", "name": "南平市", "value": 11}, {
        "adcode": "350800",
        "padcode": "350000",
        "name": "龙岩市",
        "value": 8
    }, {"adcode": "350900", "padcode": "350000", "name": "宁德市", "value": 10}, {
        "adcode": "360100",
        "padcode": "360000",
        "name": "南昌市",
        "value": 10
    }, {"adcode": "360200", "padcode": "360000", "name": "景德镇市", "value": 5}, {
        "adcode": "360300",
        "padcode": "360000",
        "name": "萍乡市",
        "value": 6
    }, {"adcode": "360400", "padcode": "360000", "name": "九江市", "value": 14}, {
        "adcode": "360500",
        "padcode": "360000",
        "name": "新余市",
        "value": 3
    }, {"adcode": "360600", "padcode": "360000", "name": "鹰潭市", "value": 4}, {
        "adcode": "360700",
        "padcode": "360000",
        "name": "赣州市",
        "value": 19
    }, {"adcode": "360800", "padcode": "360000", "name": "吉安市", "value": 14}, {
        "adcode": "360900",
        "padcode": "360000",
        "name": "宜春市",
        "value": 11
    }, {"adcode": "361000", "padcode": "360000", "name": "抚州市", "value": 12}, {
        "adcode": "361100",
        "padcode": "360000",
        "name": "上饶市",
        "value": 13
    }, {"adcode": "370100", "padcode": "370000", "name": "济南市", "value": 11}, {
        "adcode": "370200",
        "padcode": "370000",
        "name": "青岛市",
        "value": 11
    }, {"adcode": "370300", "padcode": "370000", "name": "淄博市", "value": 9}, {
        "adcode": "370400",
        "padcode": "370000",
        "name": "枣庄市",
        "value": 7
    }, {"adcode": "370500", "padcode": "370000", "name": "东营市", "value": 6}, {
        "adcode": "370600",
        "padcode": "370000",
        "name": "烟台市",
        "value": 13
    }, {"adcode": "370700", "padcode": "370000", "name": "潍坊市", "value": 13}, {
        "adcode": "370800",
        "padcode": "370000",
        "name": "济宁市",
        "value": 12
    }, {"adcode": "370900", "padcode": "370000", "name": "泰安市", "value": 7}, {
        "adcode": "371000",
        "padcode": "370000",
        "name": "威海市",
        "value": 5
    }, {"adcode": "371100", "padcode": "370000", "name": "日照市", "value": 5}, {
        "adcode": "371200",
        "padcode": "370000",
        "name": "莱芜市",
        "value": 3
    }, {"adcode": "371300", "padcode": "370000", "name": "临沂市", "value": 13}, {
        "adcode": "371400",
        "padcode": "370000",
        "name": "德州市",
        "value": 12
    }, {"adcode": "371500", "padcode": "370000", "name": "聊城市", "value": 9}, {
        "adcode": "371600",
        "padcode": "370000",
        "name": "滨州市",
        "value": 8
    }, {"adcode": "371700", "padcode": "370000", "name": "菏泽市", "value": 10}, {
        "adcode": "410100",
        "padcode": "410000",
        "name": "郑州市",
        "value": 13
    }, {"adcode": "410200", "padcode": "410000", "name": "开封市", "value": 10}, {
        "adcode": "410300",
        "padcode": "410000",
        "name": "洛阳市",
        "value": 16
    }, {"adcode": "410400", "padcode": "410000", "name": "平顶山市", "value": 11}, {
        "adcode": "410500",
        "padcode": "410000",
        "name": "安阳市",
        "value": 10
    }, {"adcode": "410600", "padcode": "410000", "name": "鹤壁市", "value": 6}, {
        "adcode": "410700",
        "padcode": "410000",
        "name": "新乡市",
        "value": 13
    }, {"adcode": "410800", "padcode": "410000", "name": "焦作市", "value": 11}, {
        "adcode": "410900",
        "padcode": "410000",
        "name": "濮阳市",
        "value": 7
    }, {"adcode": "411000", "padcode": "410000", "name": "许昌市", "value": 7}, {
        "adcode": "411100",
        "padcode": "410000",
        "name": "漯河市",
        "value": 6
    }, {"adcode": "411200", "padcode": "410000", "name": "三门峡市", "value": 7}, {
        "adcode": "411300",
        "padcode": "410000",
        "name": "南阳市",
        "value": 14
    }, {"adcode": "411400", "padcode": "410000", "name": "商丘市", "value": 10}, {
        "adcode": "411500",
        "padcode": "410000",
        "name": "信阳市",
        "value": 11
    }, {"adcode": "411600", "padcode": "410000", "name": "周口市", "value": 11}, {
        "adcode": "411700",
        "padcode": "410000",
        "name": "驻马店市",
        "value": 12
    }, {"adcode": "420100", "padcode": "420000", "name": "武汉市", "value": 14}, {
        "adcode": "420200",
        "padcode": "420000",
        "name": "黄石市",
        "value": 7
    }, {"adcode": "420300", "padcode": "420000", "name": "十堰市", "value": 9}, {
        "adcode": "420500",
        "padcode": "420000",
        "name": "宜昌市",
        "value": 14
    }, {"adcode": "420600", "padcode": "420000", "name": "襄阳市", "value": 10}, {
        "adcode": "420700",
        "padcode": "420000",
        "name": "鄂州市",
        "value": 4
    }, {"adcode": "420800", "padcode": "420000", "name": "荆门市", "value": 6}, {
        "adcode": "420900",
        "padcode": "420000",
        "name": "孝感市",
        "value": 8
    }, {"adcode": "421000", "padcode": "420000", "name": "荆州市", "value": 9}, {
        "adcode": "421100",
        "padcode": "420000",
        "name": "黄冈市",
        "value": 11
    }, {"adcode": "421200", "padcode": "420000", "name": "咸宁市", "value": 7}, {
        "adcode": "421300",
        "padcode": "420000",
        "name": "随州市",
        "value": 4
    }, {"adcode": "422800", "padcode": "420000", "name": "恩施土家族苗族自治州", "value": 9}, {
        "adcode": "429004",
        "padcode": "420000",
        "name": "仙桃市",
        "value": 1
    }, {"adcode": "429005", "padcode": "420000", "name": "潜江市", "value": 1}, {
        "adcode": "429006",
        "padcode": "420000",
        "name": "天门市",
        "value": 1
    }, {"adcode": "429021", "padcode": "420000", "name": "神农架林区", "value": 1}, {
        "adcode": "430100",
        "padcode": "430000",
        "name": "长沙市",
        "value": 10
    }, {"adcode": "430200", "padcode": "430000", "name": "株洲市", "value": 10}, {
        "adcode": "430300",
        "padcode": "430000",
        "name": "湘潭市",
        "value": 6
    }, {"adcode": "430400", "padcode": "430000", "name": "衡阳市", "value": 13}, {
        "adcode": "430500",
        "padcode": "430000",
        "name": "邵阳市",
        "value": 13
    }, {"adcode": "430600", "padcode": "430000", "name": "岳阳市", "value": 10}, {
        "adcode": "430700",
        "padcode": "430000",
        "name": "常德市",
        "value": 10
    }, {"adcode": "430800", "padcode": "430000", "name": "张家界市", "value": 5}, {
        "adcode": "430900",
        "padcode": "430000",
        "name": "益阳市",
        "value": 7
    }, {"adcode": "431000", "padcode": "430000", "name": "郴州市", "value": 12}, {
        "adcode": "431100",
        "padcode": "430000",
        "name": "永州市",
        "value": 12
    }, {"adcode": "431200", "padcode": "430000", "name": "怀化市", "value": 13}, {
        "adcode": "431300",
        "padcode": "430000",
        "name": "娄底市",
        "value": 6
    }, {"adcode": "433100", "padcode": "430000", "name": "湘西土家族苗族自治州", "value": 9}, {
        "adcode": "440100",
        "padcode": "440000",
        "name": "广州市",
        "value": 12
    }, {"adcode": "440200", "padcode": "440000", "name": "韶关市", "value": 11}, {
        "adcode": "440300",
        "padcode": "440000",
        "name": "深圳市",
        "value": 9
    }, {"adcode": "440400", "padcode": "440000", "name": "珠海市", "value": 4}, {
        "adcode": "440500",
        "padcode": "440000",
        "name": "汕头市",
        "value": 8
    }, {"adcode": "440600", "padcode": "440000", "name": "佛山市", "value": 6}, {
        "adcode": "440700",
        "padcode": "440000",
        "name": "江门市",
        "value": 8
    }, {"adcode": "440800", "padcode": "440000", "name": "湛江市", "value": 10}, {
        "adcode": "440900",
        "padcode": "440000",
        "name": "茂名市",
        "value": 6
    }, {"adcode": "441200", "padcode": "440000", "name": "肇庆市", "value": 9}, {
        "adcode": "441300",
        "padcode": "440000",
        "name": "惠州市",
        "value": 6
    }, {"adcode": "441400", "padcode": "440000", "name": "梅州市", "value": 9}, {
        "adcode": "441500",
        "padcode": "440000",
        "name": "汕尾市",
        "value": 5
    }, {"adcode": "441600", "padcode": "440000", "name": "河源市", "value": 7}, {
        "adcode": "441700",
        "padcode": "440000",
        "name": "阳江市",
        "value": 5
    }, {"adcode": "441800", "padcode": "440000", "name": "清远市", "value": 9}, {
        "adcode": "441900",
        "padcode": "440000",
        "name": "东莞市",
        "value": 1
    }, {"adcode": "442000", "padcode": "440000", "name": "中山市", "value": 1}, {
        "adcode": "445100",
        "padcode": "440000",
        "name": "潮州市",
        "value": 4
    }, {"adcode": "445200", "padcode": "440000", "name": "揭阳市", "value": 6}, {
        "adcode": "445300",
        "padcode": "440000",
        "name": "云浮市",
        "value": 6
    }, {"adcode": "450100", "padcode": "450000", "name": "南宁市", "value": 13}, {
        "adcode": "450200",
        "padcode": "450000",
        "name": "柳州市",
        "value": 11
    }, {"adcode": "450300", "padcode": "450000", "name": "桂林市", "value": 18}, {
        "adcode": "450400",
        "padcode": "450000",
        "name": "梧州市",
        "value": 8
    }, {"adcode": "450500", "padcode": "450000", "name": "北海市", "value": 5}, {
        "adcode": "450600",
        "padcode": "450000",
        "name": "防城港市",
        "value": 5
    }, {"adcode": "450700", "padcode": "450000", "name": "钦州市", "value": 5}, {
        "adcode": "450800",
        "padcode": "450000",
        "name": "贵港市",
        "value": 6
    }, {"adcode": "450900", "padcode": "450000", "name": "玉林市", "value": 8}, {
        "adcode": "451000",
        "padcode": "450000",
        "name": "百色市",
        "value": 13
    }, {"adcode": "451100", "padcode": "450000", "name": "贺州市", "value": 6}, {
        "adcode": "451200",
        "padcode": "450000",
        "name": "河池市",
        "value": 12
    }, {"adcode": "451300", "padcode": "450000", "name": "来宾市", "value": 7}, {
        "adcode": "451400",
        "padcode": "450000",
        "name": "崇左市",
        "value": 8
    }, {"adcode": "460100", "padcode": "460000", "name": "海口市", "value": 5}, {
        "adcode": "460200",
        "padcode": "460000",
        "name": "三亚市",
        "value": 5
    }, {"adcode": "460300", "padcode": "460000", "name": "三沙市", "value": 1}, {
        "adcode": "460400",
        "padcode": "460000",
        "name": "儋州市",
        "value": 10
    }, {"adcode": "469025", "padcode": "460000", "name": "白沙黎族自治县", "value": 1}, {
        "adcode": "469026",
        "padcode": "460000",
        "name": "昌江黎族自治县",
        "value": 1
    }, {"adcode": "469027", "padcode": "460000", "name": "乐东黎族自治县", "value": 1}, {
        "adcode": "469028",
        "padcode": "460000",
        "name": "陵水黎族自治县",
        "value": 1
    }, {"adcode": "469029", "padcode": "460000", "name": "保亭黎族苗族自治县", "value": 1}, {
        "adcode": "469030",
        "padcode": "460000",
        "name": "琼中黎族苗族自治县",
        "value": 1
    }, {"adcode": "510100", "padcode": "510000", "name": "成都市", "value": 21}, {
        "adcode": "510300",
        "padcode": "510000",
        "name": "自贡市",
        "value": 7
    }, {"adcode": "510400", "padcode": "510000", "name": "攀枝花市", "value": 6}, {
        "adcode": "510500",
        "padcode": "510000",
        "name": "泸州市",
        "value": 8
    }, {"adcode": "510600", "padcode": "510000", "name": "德阳市", "value": 7}, {
        "adcode": "510700",
        "padcode": "510000",
        "name": "绵阳市",
        "value": 10
    }, {"adcode": "510800", "padcode": "510000", "name": "广元市", "value": 8}, {
        "adcode": "510900",
        "padcode": "510000",
        "name": "遂宁市",
        "value": 6
    }, {"adcode": "511000", "padcode": "510000", "name": "内江市", "value": 6}, {
        "adcode": "511100",
        "padcode": "510000",
        "name": "乐山市",
        "value": 12
    }, {"adcode": "511300", "padcode": "510000", "name": "南充市", "value": 10}, {
        "adcode": "511400",
        "padcode": "510000",
        "name": "眉山市",
        "value": 7
    }, {"adcode": "511500", "padcode": "510000", "name": "宜宾市", "value": 11}, {
        "adcode": "511600",
        "padcode": "510000",
        "name": "广安市",
        "value": 7
    }, {"adcode": "511700", "padcode": "510000", "name": "达州市", "value": 8}, {
        "adcode": "511800",
        "padcode": "510000",
        "name": "雅安市",
        "value": 9
    }, {"adcode": "511900", "padcode": "510000", "name": "巴中市", "value": 6}, {
        "adcode": "512000",
        "padcode": "510000",
        "name": "资阳市",
        "value": 4
    }, {"adcode": "513200", "padcode": "510000", "name": "阿坝藏族羌族自治州", "value": 14}, {
        "adcode": "513300",
        "padcode": "510000",
        "name": "甘孜藏族自治州",
        "value": 19
    }, {"adcode": "513400", "padcode": "510000", "name": "凉山彝族自治州", "value": 18}, {
        "adcode": "520100",
        "padcode": "520000",
        "name": "贵阳市",
        "value": 11
    }, {"adcode": "520200", "padcode": "520000", "name": "六盘水市", "value": 5}, {
        "adcode": "520300",
        "padcode": "520000",
        "name": "遵义市",
        "value": 15
    }, {"adcode": "520400", "padcode": "520000", "name": "安顺市", "value": 7}, {
        "adcode": "520500",
        "padcode": "520000",
        "name": "毕节市",
        "value": 9
    }, {"adcode": "520600", "padcode": "520000", "name": "铜仁市", "value": 11}, {
        "adcode": "522300",
        "padcode": "520000",
        "name": "黔西南布依族苗族自治州",
        "value": 9
    }, {"adcode": "522600", "padcode": "520000", "name": "黔东南苗族侗族自治州", "value": 17}, {
        "adcode": "522700",
        "padcode": "520000",
        "name": "黔南布依族苗族自治州",
        "value": 13
    }, {"adcode": "530100", "padcode": "530000", "name": "昆明市", "value": 15}, {
        "adcode": "530300",
        "padcode": "530000",
        "name": "曲靖市",
        "value": 10
    }, {"adcode": "530400", "padcode": "530000", "name": "玉溪市", "value": 10}, {
        "adcode": "530500",
        "padcode": "530000",
        "name": "保山市",
        "value": 6
    }, {"adcode": "530600", "padcode": "530000", "name": "昭通市", "value": 12}, {
        "adcode": "530700",
        "padcode": "530000",
        "name": "丽江市",
        "value": 6
    }, {"adcode": "530800", "padcode": "530000", "name": "普洱市", "value": 11}, {
        "adcode": "530900",
        "padcode": "530000",
        "name": "临沧市",
        "value": 9
    }, {"adcode": "532300", "padcode": "530000", "name": "楚雄彝族自治州", "value": 11}, {
        "adcode": "532500",
        "padcode": "530000",
        "name": "红河哈尼族彝族自治州",
        "value": 14
    }, {"adcode": "532600", "padcode": "530000", "name": "文山壮族苗族自治州", "value": 9}, {
        "adcode": "532800",
        "padcode": "530000",
        "name": "西双版纳傣族自治州",
        "value": 4
    }, {"adcode": "532900", "padcode": "530000", "name": "大理白族自治州", "value": 13}, {
        "adcode": "533100",
        "padcode": "530000",
        "name": "德宏傣族景颇族自治州",
        "value": 6
    }, {"adcode": "533300", "padcode": "530000", "name": "怒江傈僳族自治州", "value": 5}, {
        "adcode": "533400",
        "padcode": "530000",
        "name": "迪庆藏族自治州",
        "value": 4
    }, {"adcode": "540100", "padcode": "540000", "name": "拉萨市", "value": 9}, {
        "adcode": "540200",
        "padcode": "540000",
        "name": "日喀则市",
        "value": 19
    }, {"adcode": "540300", "padcode": "540000", "name": "昌都市", "value": 12}, {
        "adcode": "540400",
        "padcode": "540000",
        "name": "林芝市",
        "value": 8
    }, {"adcode": "540500", "padcode": "540000", "name": "山南市", "value": 13}, {
        "adcode": "540600",
        "padcode": "540000",
        "name": "那曲市",
        "value": 12
    }, {"adcode": "542500", "padcode": "540000", "name": "阿里地区", "value": 8}, {
        "adcode": "610100",
        "padcode": "610000",
        "name": "西安市",
        "value": 14
    }, {"adcode": "610200", "padcode": "610000", "name": "铜川市", "value": 5}, {
        "adcode": "610300",
        "padcode": "610000",
        "name": "宝鸡市",
        "value": 13
    }, {"adcode": "610400", "padcode": "610000", "name": "咸阳市", "value": 15}, {
        "adcode": "610500",
        "padcode": "610000",
        "name": "渭南市",
        "value": 12
    }, {"adcode": "610600", "padcode": "610000", "name": "延安市", "value": 14}, {
        "adcode": "610700",
        "padcode": "610000",
        "name": "汉中市",
        "value": 12
    }, {"adcode": "610800", "padcode": "610000", "name": "榆林市", "value": 13}, {
        "adcode": "610900",
        "padcode": "610000",
        "name": "安康市",
        "value": 11
    }, {"adcode": "611000", "padcode": "610000", "name": "商洛市", "value": 8}, {
        "adcode": "620100",
        "padcode": "620000",
        "name": "兰州市",
        "value": 9
    }, {"adcode": "620200", "padcode": "620000", "name": "嘉峪关市", "value": 1}, {
        "adcode": "620300",
        "padcode": "620000",
        "name": "金昌市",
        "value": 3
    }, {"adcode": "620400", "padcode": "620000", "name": "白银市", "value": 6}, {
        "adcode": "620500",
        "padcode": "620000",
        "name": "天水市",
        "value": 8
    }, {"adcode": "620600", "padcode": "620000", "name": "武威市", "value": 5}, {
        "adcode": "620700",
        "padcode": "620000",
        "name": "张掖市",
        "value": 7
    }, {"adcode": "620800", "padcode": "620000", "name": "平凉市", "value": 8}, {
        "adcode": "620900",
        "padcode": "620000",
        "name": "酒泉市",
        "value": 8
    }, {"adcode": "621000", "padcode": "620000", "name": "庆阳市", "value": 9}, {
        "adcode": "621100",
        "padcode": "620000",
        "name": "定西市",
        "value": 8
    }, {"adcode": "621200", "padcode": "620000", "name": "陇南市", "value": 10}, {
        "adcode": "622900",
        "padcode": "620000",
        "name": "临夏回族自治州",
        "value": 9
    }, {"adcode": "623000", "padcode": "620000", "name": "甘南藏族自治州", "value": 9}, {
        "adcode": "630100",
        "padcode": "630000",
        "name": "西宁市",
        "value": 8
    }, {"adcode": "630200", "padcode": "630000", "name": "海东市", "value": 7}, {
        "adcode": "632200",
        "padcode": "630000",
        "name": "海北藏族自治州",
        "value": 5
    }, {"adcode": "632300", "padcode": "630000", "name": "黄南藏族自治州", "value": 5}, {
        "adcode": "632500",
        "padcode": "630000",
        "name": "海南藏族自治州",
        "value": 6
    }, {"adcode": "632600", "padcode": "630000", "name": "果洛藏族自治州", "value": 7}, {
        "adcode": "632700",
        "padcode": "630000",
        "name": "玉树藏族自治州",
        "value": 7
    }, {"adcode": "632800", "padcode": "630000", "name": "海西蒙古族藏族自治州", "value": 6}, {
        "adcode": "640100",
        "padcode": "640000",
        "name": "银川市",
        "value": 7
    }, {"adcode": "640200", "padcode": "640000", "name": "石嘴山市", "value": 4}, {
        "adcode": "640300",
        "padcode": "640000",
        "name": "吴忠市",
        "value": 6
    }, {"adcode": "640400", "padcode": "640000", "name": "固原市", "value": 6}, {
        "adcode": "640500",
        "padcode": "640000",
        "name": "中卫市",
        "value": 4
    }, {"adcode": "650100", "padcode": "650000", "name": "乌鲁木齐市", "value": 9}, {
        "adcode": "650200",
        "padcode": "650000",
        "name": "克拉玛依市",
        "value": 5
    }, {"adcode": "650400", "padcode": "650000", "name": "吐鲁番市", "value": 4}, {
        "adcode": "650500",
        "padcode": "650000",
        "name": "哈密市",
        "value": 4
    }, {"adcode": "652300", "padcode": "650000", "name": "昌吉回族自治州", "value": 8}, {
        "adcode": "652700",
        "padcode": "650000",
        "name": "博尔塔拉蒙古自治州",
        "value": 5
    }, {"adcode": "652800", "padcode": "650000", "name": "巴音郭楞蒙古自治州", "value": 10}, {
        "adcode": "652900",
        "padcode": "650000",
        "name": "阿克苏地区",
        "value": 10
    }, {"adcode": "653000", "padcode": "650000", "name": "克孜勒苏柯尔克孜自治州", "value": 5}, {
        "adcode": "653100",
        "padcode": "650000",
        "name": "喀什地区",
        "value": 13
    }, {"adcode": "653200", "padcode": "650000", "name": "和田地区", "value": 9}, {
        "adcode": "654000",
        "padcode": "650000",
        "name": "伊犁哈萨克自治州",
        "value": 12
    }, {"adcode": "654200", "padcode": "650000", "name": "塔城地区", "value": 8}, {
        "adcode": "654300",
        "padcode": "650000",
        "name": "阿勒泰地区",
        "value": 8
    }, {"adcode": "659001", "padcode": "650000", "name": "石河子市", "value": 1}, {
        "adcode": "659002",
        "padcode": "650000",
        "name": "阿拉尔市",
        "value": 1
    }, {"adcode": "659003", "padcode": "650000", "name": "图木舒克市", "value": 1}, {
        "adcode": "659004",
        "padcode": "650000",
        "name": "五家渠市",
        "value": 1
    }, {"adcode": "659005", "padcode": "650000", "name": "北屯市", "value": 1}, {
        "adcode": "659006",
        "padcode": "650000",
        "name": "铁门关市",
        "value": 1
    }, {"adcode": "659007", "padcode": "650000", "name": "双河市", "value": 1}, {
        "adcode": "659008",
        "padcode": "650000",
        "name": "可克达拉市",
        "value": 1
    }, {"adcode": "659009", "padcode": "650000", "name": "昆玉市", "value": 1}, {
        "adcode": "110101",
        "padcode": "110000",
        "name": "东城区",
        "value": 1
    }, {"adcode": "110102", "padcode": "110000", "name": "西城区", "value": 1}, {
        "adcode": "110105",
        "padcode": "110000",
        "name": "朝阳区",
        "value": 2
    }, {"adcode": "110106", "padcode": "110000", "name": "丰台区", "value": 1}, {
        "adcode": "110107",
        "padcode": "110000",
        "name": "石景山区",
        "value": 1
    }, {"adcode": "110108", "padcode": "110000", "name": "海淀区", "value": 1}, {
        "adcode": "110109",
        "padcode": "110000",
        "name": "门头沟区",
        "value": 1
    }, {"adcode": "110111", "padcode": "110000", "name": "房山区", "value": 1}, {
        "adcode": "110112",
        "padcode": "110000",
        "name": "通州区",
        "value": 2
    }, {"adcode": "110113", "padcode": "110000", "name": "顺义区", "value": 1}, {
        "adcode": "110114",
        "padcode": "110000",
        "name": "昌平区",
        "value": 1
    }, {"adcode": "110115", "padcode": "110000", "name": "大兴区", "value": 1}, {
        "adcode": "110116",
        "padcode": "110000",
        "name": "怀柔区",
        "value": 1
    }, {"adcode": "110117", "padcode": "110000", "name": "平谷区", "value": 1}, {
        "adcode": "110118",
        "padcode": "110000",
        "name": "密云区",
        "value": 1
    }, {"adcode": "110119", "padcode": "110000", "name": "延庆区", "value": 1}, {
        "adcode": "120101",
        "padcode": "天津",
        "name": "和平区",
        "value": 2
    }, {"adcode": "120102", "padcode": "天津", "name": "河东区", "value": 2}, {
        "adcode": "120103",
        "padcode": "天津",
        "name": "河西区",
        "value": 1
    }, {"adcode": "120104", "padcode": "天津", "name": "南开区", "value": 1}, {
        "adcode": "120105",
        "padcode": "天津",
        "name": "河北区",
        "value": 1
    }, {"adcode": "120106", "padcode": "天津", "name": "红桥区", "value": 1}, {
        "adcode": "120110",
        "padcode": "天津",
        "name": "东丽区",
        "value": 1
    }, {"adcode": "120111", "padcode": "天津", "name": "西青区", "value": 1}, {
        "adcode": "120112",
        "padcode": "天津",
        "name": "津南区",
        "value": 1
    }, {"adcode": "120113", "padcode": "天津", "name": "北辰区", "value": 1}, {
        "adcode": "120114",
        "padcode": "天津",
        "name": "武清区",
        "value": 1
    }, {"adcode": "120115", "padcode": "天津", "name": "宝坻区", "value": 1}, {
        "adcode": "120116",
        "padcode": "天津",
        "name": "滨海新区",
        "value": 1
    }, {"adcode": "120117", "padcode": "天津", "name": "宁河区", "value": 1}, {
        "adcode": "120118",
        "padcode": "天津",
        "name": "静海区",
        "value": 1
    }, {"adcode": "120119", "padcode": "天津", "name": "蓟州区", "value": 1}, {
        "adcode": "130102",
        "padcode": "130100",
        "name": "长安区",
        "value": 2
    }, {"adcode": "130104", "padcode": "130100", "name": "桥西区", "value": 3}, {
        "adcode": "130105",
        "padcode": "130100",
        "name": "新华区",
        "value": 3
    }, {"adcode": "130107", "padcode": "130100", "name": "井陉矿区", "value": 1}, {
        "adcode": "130108",
        "padcode": "130100",
        "name": "裕华区",
        "value": 1
    }, {"adcode": "130109", "padcode": "130100", "name": "藁城区", "value": 1}, {
        "adcode": "130110",
        "padcode": "130100",
        "name": "鹿泉区",
        "value": 1
    }, {"adcode": "130111", "padcode": "130100", "name": "栾城区", "value": 1}, {
        "adcode": "130121",
        "padcode": "130100",
        "name": "井陉县",
        "value": 1
    }, {"adcode": "130123", "padcode": "130100", "name": "正定县", "value": 1}, {
        "adcode": "130125",
        "padcode": "130100",
        "name": "行唐县",
        "value": 1
    }, {"adcode": "130126", "padcode": "130100", "name": "灵寿县", "value": 1}, {
        "adcode": "130127",
        "padcode": "130100",
        "name": "高邑县",
        "value": 1
    }, {"adcode": "130128", "padcode": "130100", "name": "深泽县", "value": 1}, {
        "adcode": "130129",
        "padcode": "130100",
        "name": "赞皇县",
        "value": 1
    }, {"adcode": "130130", "padcode": "130100", "name": "无极县", "value": 1}, {
        "adcode": "130131",
        "padcode": "130100",
        "name": "平山县",
        "value": 1
    }, {"adcode": "130132", "padcode": "130100", "name": "元氏县", "value": 1}, {
        "adcode": "130133",
        "padcode": "130100",
        "name": "赵县",
        "value": 1
    }, {"adcode": "130181", "padcode": "130100", "name": "辛集市", "value": 1}, {
        "adcode": "130183",
        "padcode": "130100",
        "name": "晋州市",
        "value": 1
    }, {"adcode": "130184", "padcode": "130100", "name": "新乐市", "value": 1}, {
        "adcode": "130202",
        "padcode": "130200",
        "name": "路南区",
        "value": 1
    }, {"adcode": "130203", "padcode": "130200", "name": "路北区", "value": 1}, {
        "adcode": "130204",
        "padcode": "130200",
        "name": "古冶区",
        "value": 1
    }, {"adcode": "130205", "padcode": "130200", "name": "开平区", "value": 1}, {
        "adcode": "130207",
        "padcode": "130200",
        "name": "丰南区",
        "value": 1
    }, {"adcode": "130208", "padcode": "130200", "name": "丰润区", "value": 1}, {
        "adcode": "130209",
        "padcode": "130200",
        "name": "曹妃甸区",
        "value": 1
    }, {"adcode": "130223", "padcode": "130200", "name": "滦县", "value": 1}, {
        "adcode": "130224",
        "padcode": "130200",
        "name": "滦南县",
        "value": 1
    }, {"adcode": "130225", "padcode": "130200", "name": "乐亭县", "value": 1}, {
        "adcode": "130227",
        "padcode": "130200",
        "name": "迁西县",
        "value": 1
    }, {"adcode": "130229", "padcode": "130200", "name": "玉田县", "value": 1}, {
        "adcode": "130281",
        "padcode": "130200",
        "name": "遵化市",
        "value": 1
    }, {"adcode": "130283", "padcode": "130200", "name": "迁安市", "value": 1}, {
        "adcode": "130302",
        "padcode": "130300",
        "name": "海港区",
        "value": 1
    }, {"adcode": "130303", "padcode": "130300", "name": "山海关区", "value": 1}, {
        "adcode": "130304",
        "padcode": "130300",
        "name": "北戴河区",
        "value": 1
    }, {"adcode": "130306", "padcode": "130300", "name": "抚宁区", "value": 1}, {
        "adcode": "130321",
        "padcode": "130300",
        "name": "青龙满族自治县",
        "value": 1
    }, {"adcode": "130322", "padcode": "130300", "name": "昌黎县", "value": 1}, {
        "adcode": "130324",
        "padcode": "130300",
        "name": "卢龙县",
        "value": 1
    }, {"adcode": "130402", "padcode": "130400", "name": "邯山区", "value": 1}, {
        "adcode": "130403",
        "padcode": "130400",
        "name": "丛台区",
        "value": 1
    }, {"adcode": "130404", "padcode": "130400", "name": "复兴区", "value": 1}, {
        "adcode": "130406",
        "padcode": "130400",
        "name": "峰峰矿区",
        "value": 1
    }, {"adcode": "130407", "padcode": "130400", "name": "肥乡区", "value": 1}, {
        "adcode": "130408",
        "padcode": "130400",
        "name": "永年区",
        "value": 1
    }, {"adcode": "130423", "padcode": "130400", "name": "临漳县", "value": 1}, {
        "adcode": "130424",
        "padcode": "130400",
        "name": "成安县",
        "value": 1
    }, {"adcode": "130425", "padcode": "130400", "name": "大名县", "value": 1}, {
        "adcode": "130426",
        "padcode": "130400",
        "name": "涉县",
        "value": 1
    }, {"adcode": "130427", "padcode": "130400", "name": "磁县", "value": 1}, {
        "adcode": "130430",
        "padcode": "130400",
        "name": "邱县",
        "value": 1
    }, {"adcode": "130431", "padcode": "130400", "name": "鸡泽县", "value": 1}, {
        "adcode": "130432",
        "padcode": "130400",
        "name": "广平县",
        "value": 1
    }, {"adcode": "130433", "padcode": "130400", "name": "馆陶县", "value": 1}, {
        "adcode": "130434",
        "padcode": "130400",
        "name": "魏县",
        "value": 1
    }, {"adcode": "130435", "padcode": "130400", "name": "曲周县", "value": 1}, {
        "adcode": "130481",
        "padcode": "130400",
        "name": "武安市",
        "value": 1
    }, {"adcode": "130502", "padcode": "130500", "name": "桥东区", "value": 2}, {
        "adcode": "130503",
        "padcode": "130500",
        "name": "桥西区",
        "value": 3
    }, {"adcode": "130521", "padcode": "130500", "name": "邢台县", "value": 1}, {
        "adcode": "130522",
        "padcode": "130500",
        "name": "临城县",
        "value": 1
    }, {"adcode": "130523", "padcode": "130500", "name": "内丘县", "value": 1}, {
        "adcode": "130524",
        "padcode": "130500",
        "name": "柏乡县",
        "value": 1
    }, {"adcode": "130525", "padcode": "130500", "name": "隆尧县", "value": 1}, {
        "adcode": "130526",
        "padcode": "130500",
        "name": "任县",
        "value": 1
    }, {"adcode": "130527", "padcode": "130500", "name": "南和县", "value": 1}, {
        "adcode": "130528",
        "padcode": "130500",
        "name": "宁晋县",
        "value": 1
    }, {"adcode": "130529", "padcode": "130500", "name": "巨鹿县", "value": 1}, {
        "adcode": "130530",
        "padcode": "130500",
        "name": "新河县",
        "value": 1
    }, {"adcode": "130531", "padcode": "130500", "name": "广宗县", "value": 1}, {
        "adcode": "130532",
        "padcode": "130500",
        "name": "平乡县",
        "value": 1
    }, {"adcode": "130533", "padcode": "130500", "name": "威县", "value": 1}, {
        "adcode": "130534",
        "padcode": "130500",
        "name": "清河县",
        "value": 1
    }, {"adcode": "130535", "padcode": "130500", "name": "临西县", "value": 1}, {
        "adcode": "130581",
        "padcode": "130500",
        "name": "南宫市",
        "value": 1
    }, {"adcode": "130582", "padcode": "130500", "name": "沙河市", "value": 1}, {
        "adcode": "130602",
        "padcode": "130600",
        "name": "竞秀区",
        "value": 1
    }, {"adcode": "130606", "padcode": "130600", "name": "莲池区", "value": 1}, {
        "adcode": "130607",
        "padcode": "130600",
        "name": "满城区",
        "value": 1
    }, {"adcode": "130608", "padcode": "130600", "name": "清苑区", "value": 1}, {
        "adcode": "130609",
        "padcode": "130600",
        "name": "徐水区",
        "value": 1
    }, {"adcode": "130623", "padcode": "130600", "name": "涞水县", "value": 1}, {
        "adcode": "130624",
        "padcode": "130600",
        "name": "阜平县",
        "value": 1
    }, {"adcode": "130626", "padcode": "130600", "name": "定兴县", "value": 1}, {
        "adcode": "130627",
        "padcode": "130600",
        "name": "唐县",
        "value": 1
    }, {"adcode": "130628", "padcode": "130600", "name": "高阳县", "value": 1}, {
        "adcode": "130629",
        "padcode": "130600",
        "name": "容城县",
        "value": 1
    }, {"adcode": "130630", "padcode": "130600", "name": "涞源县", "value": 1}, {
        "adcode": "130631",
        "padcode": "130600",
        "name": "望都县",
        "value": 1
    }, {"adcode": "130632", "padcode": "130600", "name": "安新县", "value": 1}, {
        "adcode": "130633",
        "padcode": "130600",
        "name": "易县",
        "value": 1
    }, {"adcode": "130634", "padcode": "130600", "name": "曲阳县", "value": 1}, {
        "adcode": "130635",
        "padcode": "130600",
        "name": "蠡县",
        "value": 1
    }, {"adcode": "130636", "padcode": "130600", "name": "顺平县", "value": 1}, {
        "adcode": "130637",
        "padcode": "130600",
        "name": "博野县",
        "value": 1
    }, {"adcode": "130638", "padcode": "130600", "name": "雄县", "value": 1}, {
        "adcode": "130681",
        "padcode": "130600",
        "name": "涿州市",
        "value": 1
    }, {"adcode": "130682", "padcode": "130600", "name": "定州市", "value": 1}, {
        "adcode": "130683",
        "padcode": "130600",
        "name": "安国市",
        "value": 1
    }, {"adcode": "130684", "padcode": "130600", "name": "高碑店市", "value": 1}, {
        "adcode": "130702",
        "padcode": "130700",
        "name": "桥东区",
        "value": 2
    }, {"adcode": "130703", "padcode": "130700", "name": "桥西区", "value": 3}, {
        "adcode": "130705",
        "padcode": "130700",
        "name": "宣化区",
        "value": 1
    }, {"adcode": "130706", "padcode": "130700", "name": "下花园区", "value": 1}, {
        "adcode": "130708",
        "padcode": "130700",
        "name": "万全区",
        "value": 1
    }, {"adcode": "130709", "padcode": "130700", "name": "崇礼区", "value": 1}, {
        "adcode": "130722",
        "padcode": "130700",
        "name": "张北县",
        "value": 1
    }, {"adcode": "130723", "padcode": "130700", "name": "康保县", "value": 1}, {
        "adcode": "130724",
        "padcode": "130700",
        "name": "沽源县",
        "value": 1
    }, {"adcode": "130725", "padcode": "130700", "name": "尚义县", "value": 1}, {
        "adcode": "130726",
        "padcode": "130700",
        "name": "蔚县",
        "value": 1
    }, {"adcode": "130727", "padcode": "130700", "name": "阳原县", "value": 1}, {
        "adcode": "130728",
        "padcode": "130700",
        "name": "怀安县",
        "value": 1
    }, {"adcode": "130730", "padcode": "130700", "name": "怀来县", "value": 1}, {
        "adcode": "130731",
        "padcode": "130700",
        "name": "涿鹿县",
        "value": 1
    }, {"adcode": "130732", "padcode": "130700", "name": "赤城县", "value": 1}, {
        "adcode": "130802",
        "padcode": "130800",
        "name": "双桥区",
        "value": 1
    }, {"adcode": "130803", "padcode": "130800", "name": "双滦区", "value": 1}, {
        "adcode": "130804",
        "padcode": "130800",
        "name": "鹰手营子矿区",
        "value": 1
    }, {"adcode": "130821", "padcode": "130800", "name": "承德县", "value": 1}, {
        "adcode": "130822",
        "padcode": "130800",
        "name": "兴隆县",
        "value": 1
    }, {"adcode": "130824", "padcode": "130800", "name": "滦平县", "value": 1}, {
        "adcode": "130825",
        "padcode": "130800",
        "name": "隆化县",
        "value": 1
    }, {"adcode": "130826", "padcode": "130800", "name": "丰宁满族自治县", "value": 1}, {
        "adcode": "130827",
        "padcode": "130800",
        "name": "宽城满族自治县",
        "value": 1
    }, {"adcode": "130828", "padcode": "130800", "name": "围场满族蒙古族自治县", "value": 1}, {
        "adcode": "130881",
        "padcode": "130800",
        "name": "平泉市",
        "value": 1
    }, {"adcode": "130902", "padcode": "130900", "name": "新华区", "value": 3}, {
        "adcode": "130903",
        "padcode": "130900",
        "name": "运河区",
        "value": 1
    }, {"adcode": "130921", "padcode": "130900", "name": "沧县", "value": 1}, {
        "adcode": "130922",
        "padcode": "130900",
        "name": "青县",
        "value": 1
    }, {"adcode": "130923", "padcode": "130900", "name": "东光县", "value": 1}, {
        "adcode": "130924",
        "padcode": "130900",
        "name": "海兴县",
        "value": 1
    }, {"adcode": "130925", "padcode": "130900", "name": "盐山县", "value": 1}, {
        "adcode": "130926",
        "padcode": "130900",
        "name": "肃宁县",
        "value": 1
    }, {"adcode": "130927", "padcode": "130900", "name": "南皮县", "value": 1}, {
        "adcode": "130928",
        "padcode": "130900",
        "name": "吴桥县",
        "value": 1
    }, {"adcode": "130929", "padcode": "130900", "name": "献县", "value": 1}, {
        "adcode": "130930",
        "padcode": "130900",
        "name": "孟村回族自治县",
        "value": 1
    }, {"adcode": "130981", "padcode": "130900", "name": "泊头市", "value": 1}, {
        "adcode": "130982",
        "padcode": "130900",
        "name": "任丘市",
        "value": 1
    }, {"adcode": "130983", "padcode": "130900", "name": "黄骅市", "value": 1}, {
        "adcode": "130984",
        "padcode": "130900",
        "name": "河间市",
        "value": 1
    }, {"adcode": "131002", "padcode": "131000", "name": "安次区", "value": 1}, {
        "adcode": "131003",
        "padcode": "131000",
        "name": "广阳区",
        "value": 1
    }, {"adcode": "131022", "padcode": "131000", "name": "固安县", "value": 1}, {
        "adcode": "131023",
        "padcode": "131000",
        "name": "永清县",
        "value": 1
    }, {"adcode": "131024", "padcode": "131000", "name": "香河县", "value": 1}, {
        "adcode": "131025",
        "padcode": "131000",
        "name": "大城县",
        "value": 1
    }, {"adcode": "131026", "padcode": "131000", "name": "文安县", "value": 1}, {
        "adcode": "131028",
        "padcode": "131000",
        "name": "大厂回族自治县",
        "value": 1
    }, {"adcode": "131081", "padcode": "131000", "name": "霸州市", "value": 1}, {
        "adcode": "131082",
        "padcode": "131000",
        "name": "三河市",
        "value": 1
    }, {"adcode": "131102", "padcode": "131100", "name": "桃城区", "value": 1}, {
        "adcode": "131103",
        "padcode": "131100",
        "name": "冀州区",
        "value": 1
    }, {"adcode": "131121", "padcode": "131100", "name": "枣强县", "value": 1}, {
        "adcode": "131122",
        "padcode": "131100",
        "name": "武邑县",
        "value": 1
    }, {"adcode": "131123", "padcode": "131100", "name": "武强县", "value": 1}, {
        "adcode": "131124",
        "padcode": "131100",
        "name": "饶阳县",
        "value": 1
    }, {"adcode": "131125", "padcode": "131100", "name": "安平县", "value": 1}, {
        "adcode": "131126",
        "padcode": "131100",
        "name": "故城县",
        "value": 1
    }, {"adcode": "131127", "padcode": "131100", "name": "景县", "value": 1}, {
        "adcode": "131128",
        "padcode": "131100",
        "name": "阜城县",
        "value": 1
    }, {"adcode": "131182", "padcode": "131100", "name": "深州市", "value": 1}, {
        "adcode": "140105",
        "padcode": "140100",
        "name": "小店区",
        "value": 1
    }, {"adcode": "140106", "padcode": "140100", "name": "迎泽区", "value": 1}, {
        "adcode": "140107",
        "padcode": "140100",
        "name": "杏花岭区",
        "value": 1
    }, {"adcode": "140108", "padcode": "140100", "name": "尖草坪区", "value": 1}, {
        "adcode": "140109",
        "padcode": "140100",
        "name": "万柏林区",
        "value": 1
    }, {"adcode": "140110", "padcode": "140100", "name": "晋源区", "value": 1}, {
        "adcode": "140121",
        "padcode": "140100",
        "name": "清徐县",
        "value": 1
    }, {"adcode": "140122", "padcode": "140100", "name": "阳曲县", "value": 1}, {
        "adcode": "140123",
        "padcode": "140100",
        "name": "娄烦县",
        "value": 1
    }, {"adcode": "140181", "padcode": "140100", "name": "古交市", "value": 1}, {
        "adcode": "140202",
        "padcode": "140200",
        "name": "城区",
        "value": 5
    }, {"adcode": "140203", "padcode": "140200", "name": "矿区", "value": 2}, {
        "adcode": "140211",
        "padcode": "140200",
        "name": "南郊区",
        "value": 1
    }, {"adcode": "140212", "padcode": "140200", "name": "新荣区", "value": 1}, {
        "adcode": "140221",
        "padcode": "140200",
        "name": "阳高县",
        "value": 1
    }, {"adcode": "140222", "padcode": "140200", "name": "天镇县", "value": 1}, {
        "adcode": "140223",
        "padcode": "140200",
        "name": "广灵县",
        "value": 1
    }, {"adcode": "140224", "padcode": "140200", "name": "灵丘县", "value": 1}, {
        "adcode": "140225",
        "padcode": "140200",
        "name": "浑源县",
        "value": 1
    }, {"adcode": "140226", "padcode": "140200", "name": "左云县", "value": 1}, {
        "adcode": "140227",
        "padcode": "140200",
        "name": "大同县",
        "value": 1
    }, {"adcode": "140302", "padcode": "140300", "name": "城区", "value": 5}, {
        "adcode": "140303",
        "padcode": "140300",
        "name": "矿区",
        "value": 2
    }, {"adcode": "140311", "padcode": "140300", "name": "郊区", "value": 4}, {
        "adcode": "140321",
        "padcode": "140300",
        "name": "平定县",
        "value": 1
    }, {"adcode": "140322", "padcode": "140300", "name": "盂县", "value": 1}, {
        "adcode": "140402",
        "padcode": "140400",
        "name": "城区",
        "value": 5
    }, {"adcode": "140411", "padcode": "140400", "name": "郊区", "value": 4}, {
        "adcode": "140421",
        "padcode": "140400",
        "name": "长治县",
        "value": 1
    }, {"adcode": "140423", "padcode": "140400", "name": "襄垣县", "value": 1}, {
        "adcode": "140424",
        "padcode": "140400",
        "name": "屯留县",
        "value": 1
    }, {"adcode": "140425", "padcode": "140400", "name": "平顺县", "value": 1}, {
        "adcode": "140426",
        "padcode": "140400",
        "name": "黎城县",
        "value": 1
    }, {"adcode": "140427", "padcode": "140400", "name": "壶关县", "value": 1}, {
        "adcode": "140428",
        "padcode": "140400",
        "name": "长子县",
        "value": 1
    }, {"adcode": "140429", "padcode": "140400", "name": "武乡县", "value": 1}, {
        "adcode": "140430",
        "padcode": "140400",
        "name": "沁县",
        "value": 1
    }, {"adcode": "140431", "padcode": "140400", "name": "沁源县", "value": 1}, {
        "adcode": "140481",
        "padcode": "140400",
        "name": "潞城市",
        "value": 1
    }, {"adcode": "140502", "padcode": "140500", "name": "城区", "value": 5}, {
        "adcode": "140521",
        "padcode": "140500",
        "name": "沁水县",
        "value": 1
    }, {"adcode": "140522", "padcode": "140500", "name": "阳城县", "value": 1}, {
        "adcode": "140524",
        "padcode": "140500",
        "name": "陵川县",
        "value": 1
    }, {"adcode": "140525", "padcode": "140500", "name": "泽州县", "value": 1}, {
        "adcode": "140581",
        "padcode": "140500",
        "name": "高平市",
        "value": 1
    }, {"adcode": "140602", "padcode": "140600", "name": "朔城区", "value": 1}, {
        "adcode": "140603",
        "padcode": "140600",
        "name": "平鲁区",
        "value": 1
    }, {"adcode": "140621", "padcode": "140600", "name": "山阴县", "value": 1}, {
        "adcode": "140622",
        "padcode": "140600",
        "name": "应县",
        "value": 1
    }, {"adcode": "140623", "padcode": "140600", "name": "右玉县", "value": 1}, {
        "adcode": "140624",
        "padcode": "140600",
        "name": "怀仁县",
        "value": 1
    }, {"adcode": "140702", "padcode": "140700", "name": "榆次区", "value": 1}, {
        "adcode": "140721",
        "padcode": "140700",
        "name": "榆社县",
        "value": 1
    }, {"adcode": "140722", "padcode": "140700", "name": "左权县", "value": 1}, {
        "adcode": "140723",
        "padcode": "140700",
        "name": "和顺县",
        "value": 1
    }, {"adcode": "140724", "padcode": "140700", "name": "昔阳县", "value": 1}, {
        "adcode": "140725",
        "padcode": "140700",
        "name": "寿阳县",
        "value": 1
    }, {"adcode": "140726", "padcode": "140700", "name": "太谷县", "value": 1}, {
        "adcode": "140727",
        "padcode": "140700",
        "name": "祁县",
        "value": 1
    }, {"adcode": "140728", "padcode": "140700", "name": "平遥县", "value": 1}, {
        "adcode": "140729",
        "padcode": "140700",
        "name": "灵石县",
        "value": 1
    }, {"adcode": "140781", "padcode": "140700", "name": "介休市", "value": 1}, {
        "adcode": "140802",
        "padcode": "140800",
        "name": "盐湖区",
        "value": 1
    }, {"adcode": "140821", "padcode": "140800", "name": "临猗县", "value": 1}, {
        "adcode": "140822",
        "padcode": "140800",
        "name": "万荣县",
        "value": 1
    }, {"adcode": "140823", "padcode": "140800", "name": "闻喜县", "value": 1}, {
        "adcode": "140824",
        "padcode": "140800",
        "name": "稷山县",
        "value": 1
    }, {"adcode": "140825", "padcode": "140800", "name": "新绛县", "value": 1}, {
        "adcode": "140826",
        "padcode": "140800",
        "name": "绛县",
        "value": 1
    }, {"adcode": "140827", "padcode": "140800", "name": "垣曲县", "value": 1}, {
        "adcode": "140828",
        "padcode": "140800",
        "name": "夏县",
        "value": 1
    }, {"adcode": "140829", "padcode": "140800", "name": "平陆县", "value": 1}, {
        "adcode": "140830",
        "padcode": "140800",
        "name": "芮城县",
        "value": 1
    }, {"adcode": "140881", "padcode": "140800", "name": "永济市", "value": 1}, {
        "adcode": "140882",
        "padcode": "140800",
        "name": "河津市",
        "value": 1
    }, {"adcode": "140902", "padcode": "140900", "name": "忻府区", "value": 1}, {
        "adcode": "140921",
        "padcode": "140900",
        "name": "定襄县",
        "value": 1
    }, {"adcode": "140922", "padcode": "140900", "name": "五台县", "value": 1}, {
        "adcode": "140923",
        "padcode": "140900",
        "name": "代县",
        "value": 1
    }, {"adcode": "140924", "padcode": "140900", "name": "繁峙县", "value": 1}, {
        "adcode": "140925",
        "padcode": "140900",
        "name": "宁武县",
        "value": 1
    }, {"adcode": "140926", "padcode": "140900", "name": "静乐县", "value": 1}, {
        "adcode": "140927",
        "padcode": "140900",
        "name": "神池县",
        "value": 1
    }, {"adcode": "140928", "padcode": "140900", "name": "五寨县", "value": 1}, {
        "adcode": "140929",
        "padcode": "140900",
        "name": "岢岚县",
        "value": 1
    }, {"adcode": "140930", "padcode": "140900", "name": "河曲县", "value": 1}, {
        "adcode": "140931",
        "padcode": "140900",
        "name": "保德县",
        "value": 1
    }, {"adcode": "140932", "padcode": "140900", "name": "偏关县", "value": 1}, {
        "adcode": "140981",
        "padcode": "140900",
        "name": "原平市",
        "value": 1
    }, {"adcode": "141002", "padcode": "141000", "name": "尧都区", "value": 1}, {
        "adcode": "141021",
        "padcode": "141000",
        "name": "曲沃县",
        "value": 1
    }, {"adcode": "141022", "padcode": "141000", "name": "翼城县", "value": 1}, {
        "adcode": "141023",
        "padcode": "141000",
        "name": "襄汾县",
        "value": 1
    }, {"adcode": "141024", "padcode": "141000", "name": "洪洞县", "value": 1}, {
        "adcode": "141025",
        "padcode": "141000",
        "name": "古县",
        "value": 1
    }, {"adcode": "141026", "padcode": "141000", "name": "安泽县", "value": 1}, {
        "adcode": "141027",
        "padcode": "141000",
        "name": "浮山县",
        "value": 1
    }, {"adcode": "141028", "padcode": "141000", "name": "吉县", "value": 1}, {
        "adcode": "141029",
        "padcode": "141000",
        "name": "乡宁县",
        "value": 1
    }, {"adcode": "141030", "padcode": "141000", "name": "大宁县", "value": 1}, {
        "adcode": "141031",
        "padcode": "141000",
        "name": "隰县",
        "value": 1
    }, {"adcode": "141032", "padcode": "141000", "name": "永和县", "value": 1}, {
        "adcode": "141033",
        "padcode": "141000",
        "name": "蒲县",
        "value": 1
    }, {"adcode": "141034", "padcode": "141000", "name": "汾西县", "value": 1}, {
        "adcode": "141081",
        "padcode": "141000",
        "name": "侯马市",
        "value": 1
    }, {"adcode": "141082", "padcode": "141000", "name": "霍州市", "value": 1}, {
        "adcode": "141102",
        "padcode": "141100",
        "name": "离石区",
        "value": 1
    }, {"adcode": "141121", "padcode": "141100", "name": "文水县", "value": 1}, {
        "adcode": "141122",
        "padcode": "141100",
        "name": "交城县",
        "value": 1
    }, {"adcode": "141123", "padcode": "141100", "name": "兴县", "value": 1}, {
        "adcode": "141124",
        "padcode": "141100",
        "name": "临县",
        "value": 1
    }, {"adcode": "141125", "padcode": "141100", "name": "柳林县", "value": 1}, {
        "adcode": "141126",
        "padcode": "141100",
        "name": "石楼县",
        "value": 1
    }, {"adcode": "141127", "padcode": "141100", "name": "岚县", "value": 1}, {
        "adcode": "141128",
        "padcode": "141100",
        "name": "方山县",
        "value": 1
    }, {"adcode": "141129", "padcode": "141100", "name": "中阳县", "value": 1}, {
        "adcode": "141130",
        "padcode": "141100",
        "name": "交口县",
        "value": 1
    }, {"adcode": "141181", "padcode": "141100", "name": "孝义市", "value": 1}, {
        "adcode": "141182",
        "padcode": "141100",
        "name": "汾阳市",
        "value": 1
    }, {"adcode": "150102", "padcode": "150100", "name": "新城区", "value": 2}, {
        "adcode": "150103",
        "padcode": "150100",
        "name": "回民区",
        "value": 1
    }, {"adcode": "150104", "padcode": "150100", "name": "玉泉区", "value": 1}, {
        "adcode": "150105",
        "padcode": "150100",
        "name": "赛罕区",
        "value": 1
    }, {"adcode": "150121", "padcode": "150100", "name": "土默特左旗", "value": 1}, {
        "adcode": "150122",
        "padcode": "150100",
        "name": "托克托县",
        "value": 1
    }, {"adcode": "150123", "padcode": "150100", "name": "和林格尔县", "value": 1}, {
        "adcode": "150124",
        "padcode": "150100",
        "name": "清水河县",
        "value": 1
    }, {"adcode": "150125", "padcode": "150100", "name": "武川县", "value": 1}, {
        "adcode": "150202",
        "padcode": "150200",
        "name": "东河区",
        "value": 1
    }, {"adcode": "150203", "padcode": "150200", "name": "昆都仑区", "value": 1}, {
        "adcode": "150204",
        "padcode": "150200",
        "name": "青山区",
        "value": 2
    }, {"adcode": "150205", "padcode": "150200", "name": "石拐区", "value": 1}, {
        "adcode": "150206",
        "padcode": "150200",
        "name": "白云鄂博矿区",
        "value": 1
    }, {"adcode": "150207", "padcode": "150200", "name": "九原区", "value": 1}, {
        "adcode": "150221",
        "padcode": "150200",
        "name": "土默特右旗",
        "value": 1
    }, {"adcode": "150222", "padcode": "150200", "name": "固阳县", "value": 1}, {
        "adcode": "150223",
        "padcode": "150200",
        "name": "达尔罕茂明安联合旗",
        "value": 1
    }, {"adcode": "150302", "padcode": "150300", "name": "海勃湾区", "value": 1}, {
        "adcode": "150303",
        "padcode": "150300",
        "name": "海南区",
        "value": 1
    }, {"adcode": "150304", "padcode": "150300", "name": "乌达区", "value": 1}, {
        "adcode": "150402",
        "padcode": "150400",
        "name": "红山区",
        "value": 1
    }, {"adcode": "150403", "padcode": "150400", "name": "元宝山区", "value": 1}, {
        "adcode": "150404",
        "padcode": "150400",
        "name": "松山区",
        "value": 1
    }, {"adcode": "150421", "padcode": "150400", "name": "阿鲁科尔沁旗", "value": 1}, {
        "adcode": "150422",
        "padcode": "150400",
        "name": "巴林左旗",
        "value": 1
    }, {"adcode": "150423", "padcode": "150400", "name": "巴林右旗", "value": 1}, {
        "adcode": "150424",
        "padcode": "150400",
        "name": "林西县",
        "value": 1
    }, {"adcode": "150425", "padcode": "150400", "name": "克什克腾旗", "value": 1}, {
        "adcode": "150426",
        "padcode": "150400",
        "name": "翁牛特旗",
        "value": 1
    }, {"adcode": "150428", "padcode": "150400", "name": "喀喇沁旗", "value": 1}, {
        "adcode": "150429",
        "padcode": "150400",
        "name": "宁城县",
        "value": 1
    }, {"adcode": "150430", "padcode": "150400", "name": "敖汉旗", "value": 1}, {
        "adcode": "150502",
        "padcode": "150500",
        "name": "科尔沁区",
        "value": 1
    }, {"adcode": "150521", "padcode": "150500", "name": "科尔沁左翼中旗", "value": 1}, {
        "adcode": "150522",
        "padcode": "150500",
        "name": "科尔沁左翼后旗",
        "value": 1
    }, {"adcode": "150523", "padcode": "150500", "name": "开鲁县", "value": 1}, {
        "adcode": "150524",
        "padcode": "150500",
        "name": "库伦旗",
        "value": 1
    }, {"adcode": "150525", "padcode": "150500", "name": "奈曼旗", "value": 1}, {
        "adcode": "150526",
        "padcode": "150500",
        "name": "扎鲁特旗",
        "value": 1
    }, {"adcode": "150581", "padcode": "150500", "name": "霍林郭勒市", "value": 1}, {
        "adcode": "150602",
        "padcode": "150600",
        "name": "东胜区",
        "value": 1
    }, {"adcode": "150603", "padcode": "150600", "name": "康巴什区", "value": 1}, {
        "adcode": "150621",
        "padcode": "150600",
        "name": "达拉特旗",
        "value": 1
    }, {"adcode": "150622", "padcode": "150600", "name": "准格尔旗", "value": 1}, {
        "adcode": "150623",
        "padcode": "150600",
        "name": "鄂托克前旗",
        "value": 1
    }, {"adcode": "150624", "padcode": "150600", "name": "鄂托克旗", "value": 1}, {
        "adcode": "150625",
        "padcode": "150600",
        "name": "杭锦旗",
        "value": 1
    }, {"adcode": "150626", "padcode": "150600", "name": "乌审旗", "value": 1}, {
        "adcode": "150627",
        "padcode": "150600",
        "name": "伊金霍洛旗",
        "value": 1
    }, {"adcode": "150702", "padcode": "150700", "name": "海拉尔区", "value": 1}, {
        "adcode": "150703",
        "padcode": "150700",
        "name": "扎赉诺尔区",
        "value": 1
    }, {"adcode": "150721", "padcode": "150700", "name": "阿荣旗", "value": 1}, {
        "adcode": "150722",
        "padcode": "150700",
        "name": "莫力达瓦达斡尔族自治旗",
        "value": 1
    }, {"adcode": "150723", "padcode": "150700", "name": "鄂伦春自治旗", "value": 1}, {
        "adcode": "150724",
        "padcode": "150700",
        "name": "鄂温克族自治旗",
        "value": 1
    }, {"adcode": "150725", "padcode": "150700", "name": "陈巴尔虎旗", "value": 1}, {
        "adcode": "150726",
        "padcode": "150700",
        "name": "新巴尔虎左旗",
        "value": 1
    }, {"adcode": "150727", "padcode": "150700", "name": "新巴尔虎右旗", "value": 1}, {
        "adcode": "150781",
        "padcode": "150700",
        "name": "满洲里市",
        "value": 1
    }, {"adcode": "150782", "padcode": "150700", "name": "牙克石市", "value": 1}, {
        "adcode": "150783",
        "padcode": "150700",
        "name": "扎兰屯市",
        "value": 1
    }, {"adcode": "150784", "padcode": "150700", "name": "额尔古纳市", "value": 1}, {
        "adcode": "150785",
        "padcode": "150700",
        "name": "根河市",
        "value": 1
    }, {"adcode": "150802", "padcode": "150800", "name": "临河区", "value": 1}, {
        "adcode": "150821",
        "padcode": "150800",
        "name": "五原县",
        "value": 1
    }, {"adcode": "150822", "padcode": "150800", "name": "磴口县", "value": 1}, {
        "adcode": "150823",
        "padcode": "150800",
        "name": "乌拉特前旗",
        "value": 1
    }, {"adcode": "150824", "padcode": "150800", "name": "乌拉特中旗", "value": 1}, {
        "adcode": "150825",
        "padcode": "150800",
        "name": "乌拉特后旗",
        "value": 1
    }, {"adcode": "150826", "padcode": "150800", "name": "杭锦后旗", "value": 1}, {
        "adcode": "150902",
        "padcode": "150900",
        "name": "集宁区",
        "value": 1
    }, {"adcode": "150921", "padcode": "150900", "name": "卓资县", "value": 1}, {
        "adcode": "150922",
        "padcode": "150900",
        "name": "化德县",
        "value": 1
    }, {"adcode": "150923", "padcode": "150900", "name": "商都县", "value": 1}, {
        "adcode": "150924",
        "padcode": "150900",
        "name": "兴和县",
        "value": 1
    }, {"adcode": "150925", "padcode": "150900", "name": "凉城县", "value": 1}, {
        "adcode": "150926",
        "padcode": "150900",
        "name": "察哈尔右翼前旗",
        "value": 1
    }, {"adcode": "150927", "padcode": "150900", "name": "察哈尔右翼中旗", "value": 1}, {
        "adcode": "150928",
        "padcode": "150900",
        "name": "察哈尔右翼后旗",
        "value": 1
    }, {"adcode": "150929", "padcode": "150900", "name": "四子王旗", "value": 1}, {
        "adcode": "150981",
        "padcode": "150900",
        "name": "丰镇市",
        "value": 1
    }, {"adcode": "152201", "padcode": "152200", "name": "乌兰浩特市", "value": 1}, {
        "adcode": "152202",
        "padcode": "152200",
        "name": "阿尔山市",
        "value": 1
    }, {"adcode": "152221", "padcode": "152200", "name": "科尔沁右翼前旗", "value": 1}, {
        "adcode": "152222",
        "padcode": "152200",
        "name": "科尔沁右翼中旗",
        "value": 1
    }, {"adcode": "152223", "padcode": "152200", "name": "扎赉特旗", "value": 1}, {
        "adcode": "152224",
        "padcode": "152200",
        "name": "突泉县",
        "value": 1
    }, {"adcode": "152501", "padcode": "152500", "name": "二连浩特市", "value": 1}, {
        "adcode": "152502",
        "padcode": "152500",
        "name": "锡林浩特市",
        "value": 1
    }, {"adcode": "152522", "padcode": "152500", "name": "阿巴嘎旗", "value": 1}, {
        "adcode": "152523",
        "padcode": "152500",
        "name": "苏尼特左旗",
        "value": 1
    }, {"adcode": "152524", "padcode": "152500", "name": "苏尼特右旗", "value": 1}, {
        "adcode": "152525",
        "padcode": "152500",
        "name": "东乌珠穆沁旗",
        "value": 1
    }, {"adcode": "152526", "padcode": "152500", "name": "西乌珠穆沁旗", "value": 1}, {
        "adcode": "152527",
        "padcode": "152500",
        "name": "太仆寺旗",
        "value": 1
    }, {"adcode": "152528", "padcode": "152500", "name": "镶黄旗", "value": 1}, {
        "adcode": "152529",
        "padcode": "152500",
        "name": "正镶白旗",
        "value": 1
    }, {"adcode": "152530", "padcode": "152500", "name": "正蓝旗", "value": 1}, {
        "adcode": "152531",
        "padcode": "152500",
        "name": "多伦县",
        "value": 1
    }, {"adcode": "152921", "padcode": "152900", "name": "阿拉善左旗", "value": 1}, {
        "adcode": "152922",
        "padcode": "152900",
        "name": "阿拉善右旗",
        "value": 1
    }, {"adcode": "152923", "padcode": "152900", "name": "额济纳旗", "value": 1}, {
        "adcode": "210102",
        "padcode": "210100",
        "name": "和平区",
        "value": 2
    }, {"adcode": "210103", "padcode": "210100", "name": "沈河区", "value": 1}, {
        "adcode": "210104",
        "padcode": "210100",
        "name": "大东区",
        "value": 1
    }, {"adcode": "210105", "padcode": "210100", "name": "皇姑区", "value": 1}, {
        "adcode": "210106",
        "padcode": "210100",
        "name": "铁西区",
        "value": 3
    }, {"adcode": "210111", "padcode": "210100", "name": "苏家屯区", "value": 1}, {
        "adcode": "210112",
        "padcode": "210100",
        "name": "浑南区",
        "value": 1
    }, {"adcode": "210113", "padcode": "210100", "name": "沈北新区", "value": 1}, {
        "adcode": "210114",
        "padcode": "210100",
        "name": "于洪区",
        "value": 1
    }, {"adcode": "210115", "padcode": "210100", "name": "辽中区", "value": 1}, {
        "adcode": "210123",
        "padcode": "210100",
        "name": "康平县",
        "value": 1
    }, {"adcode": "210124", "padcode": "210100", "name": "法库县", "value": 1}, {
        "adcode": "210181",
        "padcode": "210100",
        "name": "新民市",
        "value": 1
    }, {"adcode": "210202", "padcode": "210200", "name": "中山区", "value": 1}, {
        "adcode": "210203",
        "padcode": "210200",
        "name": "西岗区",
        "value": 1
    }, {"adcode": "210204", "padcode": "210200", "name": "沙河口区", "value": 1}, {
        "adcode": "210211",
        "padcode": "210200",
        "name": "甘井子区",
        "value": 1
    }, {"adcode": "210212", "padcode": "210200", "name": "旅顺口区", "value": 1}, {
        "adcode": "210213",
        "padcode": "210200",
        "name": "金州区",
        "value": 1
    }, {"adcode": "210214", "padcode": "210200", "name": "普兰店区", "value": 1}, {
        "adcode": "210224",
        "padcode": "210200",
        "name": "长海县",
        "value": 1
    }, {"adcode": "210281", "padcode": "210200", "name": "瓦房店市", "value": 1}, {
        "adcode": "210283",
        "padcode": "210200",
        "name": "庄河市",
        "value": 1
    }, {"adcode": "210302", "padcode": "210300", "name": "铁东区", "value": 2}, {
        "adcode": "210303",
        "padcode": "210300",
        "name": "铁西区",
        "value": 3
    }, {"adcode": "210304", "padcode": "210300", "name": "立山区", "value": 1}, {
        "adcode": "210311",
        "padcode": "210300",
        "name": "千山区",
        "value": 1
    }, {"adcode": "210321", "padcode": "210300", "name": "台安县", "value": 1}, {
        "adcode": "210323",
        "padcode": "210300",
        "name": "岫岩满族自治县",
        "value": 1
    }, {"adcode": "210381", "padcode": "210300", "name": "海城市", "value": 1}, {
        "adcode": "210402",
        "padcode": "210400",
        "name": "新抚区",
        "value": 1
    }, {"adcode": "210403", "padcode": "210400", "name": "东洲区", "value": 1}, {
        "adcode": "210404",
        "padcode": "210400",
        "name": "望花区",
        "value": 1
    }, {"adcode": "210411", "padcode": "210400", "name": "顺城区", "value": 1}, {
        "adcode": "210421",
        "padcode": "210400",
        "name": "抚顺县",
        "value": 1
    }, {"adcode": "210422", "padcode": "210400", "name": "新宾满族自治县", "value": 1}, {
        "adcode": "210423",
        "padcode": "210400",
        "name": "清原满族自治县",
        "value": 1
    }, {"adcode": "210502", "padcode": "210500", "name": "平山区", "value": 1}, {
        "adcode": "210503",
        "padcode": "210500",
        "name": "溪湖区",
        "value": 1
    }, {"adcode": "210504", "padcode": "210500", "name": "明山区", "value": 1}, {
        "adcode": "210505",
        "padcode": "210500",
        "name": "南芬区",
        "value": 1
    }, {"adcode": "210521", "padcode": "210500", "name": "本溪满族自治县", "value": 1}, {
        "adcode": "210522",
        "padcode": "210500",
        "name": "桓仁满族自治县",
        "value": 1
    }, {"adcode": "210602", "padcode": "210600", "name": "元宝区", "value": 1}, {
        "adcode": "210603",
        "padcode": "210600",
        "name": "振兴区",
        "value": 1
    }, {"adcode": "210604", "padcode": "210600", "name": "振安区", "value": 1}, {
        "adcode": "210624",
        "padcode": "210600",
        "name": "宽甸满族自治县",
        "value": 1
    }, {"adcode": "210681", "padcode": "210600", "name": "东港市", "value": 1}, {
        "adcode": "210682",
        "padcode": "210600",
        "name": "凤城市",
        "value": 1
    }, {"adcode": "210702", "padcode": "210700", "name": "古塔区", "value": 1}, {
        "adcode": "210703",
        "padcode": "210700",
        "name": "凌河区",
        "value": 1
    }, {"adcode": "210711", "padcode": "210700", "name": "太和区", "value": 1}, {
        "adcode": "210726",
        "padcode": "210700",
        "name": "黑山县",
        "value": 1
    }, {"adcode": "210727", "padcode": "210700", "name": "义县", "value": 1}, {
        "adcode": "210781",
        "padcode": "210700",
        "name": "凌海市",
        "value": 1
    }, {"adcode": "210782", "padcode": "210700", "name": "北镇市", "value": 1}, {
        "adcode": "210802",
        "padcode": "210800",
        "name": "站前区",
        "value": 1
    }, {"adcode": "210803", "padcode": "210800", "name": "西市区", "value": 1}, {
        "adcode": "210804",
        "padcode": "210800",
        "name": "鲅鱼圈区",
        "value": 1
    }, {"adcode": "210811", "padcode": "210800", "name": "老边区", "value": 1}, {
        "adcode": "210881",
        "padcode": "210800",
        "name": "盖州市",
        "value": 1
    }, {"adcode": "210882", "padcode": "210800", "name": "大石桥市", "value": 1}, {
        "adcode": "210902",
        "padcode": "210900",
        "name": "海州区",
        "value": 2
    }, {"adcode": "210903", "padcode": "210900", "name": "新邱区", "value": 1}, {
        "adcode": "210904",
        "padcode": "210900",
        "name": "太平区",
        "value": 1
    }, {"adcode": "210905", "padcode": "210900", "name": "清河门区", "value": 1}, {
        "adcode": "210911",
        "padcode": "210900",
        "name": "细河区",
        "value": 1
    }, {"adcode": "210921", "padcode": "210900", "name": "阜新蒙古族自治县", "value": 1}, {
        "adcode": "210922",
        "padcode": "210900",
        "name": "彰武县",
        "value": 1
    }, {"adcode": "211002", "padcode": "211000", "name": "白塔区", "value": 1}, {
        "adcode": "211003",
        "padcode": "211000",
        "name": "文圣区",
        "value": 1
    }, {"adcode": "211004", "padcode": "211000", "name": "宏伟区", "value": 1}, {
        "adcode": "211005",
        "padcode": "211000",
        "name": "弓长岭区",
        "value": 1
    }, {"adcode": "211011", "padcode": "211000", "name": "太子河区", "value": 1}, {
        "adcode": "211021",
        "padcode": "211000",
        "name": "辽阳县",
        "value": 1
    }, {"adcode": "211081", "padcode": "211000", "name": "灯塔市", "value": 1}, {
        "adcode": "211102",
        "padcode": "211100",
        "name": "双台子区",
        "value": 1
    }, {"adcode": "211103", "padcode": "211100", "name": "兴隆台区", "value": 1}, {
        "adcode": "211104",
        "padcode": "211100",
        "name": "大洼区",
        "value": 1
    }, {"adcode": "211122", "padcode": "211100", "name": "盘山县", "value": 1}, {
        "adcode": "211202",
        "padcode": "211200",
        "name": "银州区",
        "value": 1
    }, {"adcode": "211204", "padcode": "211200", "name": "清河区", "value": 1}, {
        "adcode": "211221",
        "padcode": "211200",
        "name": "铁岭县",
        "value": 1
    }, {"adcode": "211223", "padcode": "211200", "name": "西丰县", "value": 1}, {
        "adcode": "211224",
        "padcode": "211200",
        "name": "昌图县",
        "value": 1
    }, {"adcode": "211281", "padcode": "211200", "name": "调兵山市", "value": 1}, {
        "adcode": "211282",
        "padcode": "211200",
        "name": "开原市",
        "value": 1
    }, {"adcode": "211302", "padcode": "211300", "name": "双塔区", "value": 1}, {
        "adcode": "211303",
        "padcode": "211300",
        "name": "龙城区",
        "value": 1
    }, {"adcode": "211321", "padcode": "211300", "name": "朝阳县", "value": 1}, {
        "adcode": "211322",
        "padcode": "211300",
        "name": "建平县",
        "value": 1
    }, {"adcode": "211324", "padcode": "211300", "name": "喀喇沁左翼蒙古族自治县", "value": 1}, {
        "adcode": "211381",
        "padcode": "211300",
        "name": "北票市",
        "value": 1
    }, {"adcode": "211382", "padcode": "211300", "name": "凌源市", "value": 1}, {
        "adcode": "211402",
        "padcode": "211400",
        "name": "连山区",
        "value": 1
    }, {"adcode": "211403", "padcode": "211400", "name": "龙港区", "value": 1}, {
        "adcode": "211404",
        "padcode": "211400",
        "name": "南票区",
        "value": 1
    }, {"adcode": "211421", "padcode": "211400", "name": "绥中县", "value": 1}, {
        "adcode": "211422",
        "padcode": "211400",
        "name": "建昌县",
        "value": 1
    }, {"adcode": "211481", "padcode": "211400", "name": "兴城市", "value": 1}, {
        "adcode": "220102",
        "padcode": "220100",
        "name": "南关区",
        "value": 1
    }, {"adcode": "220103", "padcode": "220100", "name": "宽城区", "value": 1}, {
        "adcode": "220104",
        "padcode": "220100",
        "name": "朝阳区",
        "value": 2
    }, {"adcode": "220105", "padcode": "220100", "name": "二道区", "value": 1}, {
        "adcode": "220106",
        "padcode": "220100",
        "name": "绿园区",
        "value": 1
    }, {"adcode": "220112", "padcode": "220100", "name": "双阳区", "value": 1}, {
        "adcode": "220113",
        "padcode": "220100",
        "name": "九台区",
        "value": 1
    }, {"adcode": "220122", "padcode": "220100", "name": "农安县", "value": 1}, {
        "adcode": "220182",
        "padcode": "220100",
        "name": "榆树市",
        "value": 1
    }, {"adcode": "220183", "padcode": "220100", "name": "德惠市", "value": 1}, {
        "adcode": "220202",
        "padcode": "220200",
        "name": "昌邑区",
        "value": 1
    }, {"adcode": "220203", "padcode": "220200", "name": "龙潭区", "value": 1}, {
        "adcode": "220204",
        "padcode": "220200",
        "name": "船营区",
        "value": 1
    }, {"adcode": "220211", "padcode": "220200", "name": "丰满区", "value": 1}, {
        "adcode": "220221",
        "padcode": "220200",
        "name": "永吉县",
        "value": 1
    }, {"adcode": "220281", "padcode": "220200", "name": "蛟河市", "value": 1}, {
        "adcode": "220282",
        "padcode": "220200",
        "name": "桦甸市",
        "value": 1
    }, {"adcode": "220283", "padcode": "220200", "name": "舒兰市", "value": 1}, {
        "adcode": "220284",
        "padcode": "220200",
        "name": "磐石市",
        "value": 1
    }, {"adcode": "220302", "padcode": "220300", "name": "铁西区", "value": 3}, {
        "adcode": "220303",
        "padcode": "220300",
        "name": "铁东区",
        "value": 2
    }, {"adcode": "220322", "padcode": "220300", "name": "梨树县", "value": 1}, {
        "adcode": "220323",
        "padcode": "220300",
        "name": "伊通满族自治县",
        "value": 1
    }, {"adcode": "220381", "padcode": "220300", "name": "公主岭市", "value": 1}, {
        "adcode": "220382",
        "padcode": "220300",
        "name": "双辽市",
        "value": 1
    }, {"adcode": "220402", "padcode": "220400", "name": "龙山区", "value": 1}, {
        "adcode": "220403",
        "padcode": "220400",
        "name": "西安区",
        "value": 2
    }, {"adcode": "220421", "padcode": "220400", "name": "东丰县", "value": 1}, {
        "adcode": "220422",
        "padcode": "220400",
        "name": "东辽县",
        "value": 1
    }, {"adcode": "220502", "padcode": "220500", "name": "东昌区", "value": 1}, {
        "adcode": "220503",
        "padcode": "220500",
        "name": "二道江区",
        "value": 1
    }, {"adcode": "220521", "padcode": "220500", "name": "通化县", "value": 1}, {
        "adcode": "220523",
        "padcode": "220500",
        "name": "辉南县",
        "value": 1
    }, {"adcode": "220524", "padcode": "220500", "name": "柳河县", "value": 1}, {
        "adcode": "220581",
        "padcode": "220500",
        "name": "梅河口市",
        "value": 1
    }, {"adcode": "220582", "padcode": "220500", "name": "集安市", "value": 1}, {
        "adcode": "220602",
        "padcode": "220600",
        "name": "浑江区",
        "value": 1
    }, {"adcode": "220605", "padcode": "220600", "name": "江源区", "value": 1}, {
        "adcode": "220621",
        "padcode": "220600",
        "name": "抚松县",
        "value": 1
    }, {"adcode": "220622", "padcode": "220600", "name": "靖宇县", "value": 1}, {
        "adcode": "220623",
        "padcode": "220600",
        "name": "长白朝鲜族自治县",
        "value": 1
    }, {"adcode": "220681", "padcode": "220600", "name": "临江市", "value": 1}, {
        "adcode": "220702",
        "padcode": "220700",
        "name": "宁江区",
        "value": 1
    }, {"adcode": "220721", "padcode": "220700", "name": "前郭尔罗斯蒙古族自治县", "value": 1}, {
        "adcode": "220722",
        "padcode": "220700",
        "name": "长岭县",
        "value": 1
    }, {"adcode": "220723", "padcode": "220700", "name": "乾安县", "value": 1}, {
        "adcode": "220781",
        "padcode": "220700",
        "name": "扶余市",
        "value": 1
    }, {"adcode": "220802", "padcode": "220800", "name": "洮北区", "value": 1}, {
        "adcode": "220821",
        "padcode": "220800",
        "name": "镇赉县",
        "value": 1
    }, {"adcode": "220822", "padcode": "220800", "name": "通榆县", "value": 1}, {
        "adcode": "220881",
        "padcode": "220800",
        "name": "洮南市",
        "value": 1
    }, {"adcode": "220882", "padcode": "220800", "name": "大安市", "value": 1}, {
        "adcode": "222401",
        "padcode": "222400",
        "name": "延吉市",
        "value": 1
    }, {"adcode": "222402", "padcode": "222400", "name": "图们市", "value": 1}, {
        "adcode": "222403",
        "padcode": "222400",
        "name": "敦化市",
        "value": 1
    }, {"adcode": "222404", "padcode": "222400", "name": "珲春市", "value": 1}, {
        "adcode": "222405",
        "padcode": "222400",
        "name": "龙井市",
        "value": 1
    }, {"adcode": "222406", "padcode": "222400", "name": "和龙市", "value": 1}, {
        "adcode": "222424",
        "padcode": "222400",
        "name": "汪清县",
        "value": 1
    }, {"adcode": "222426", "padcode": "222400", "name": "安图县", "value": 1}, {
        "adcode": "230102",
        "padcode": "230100",
        "name": "道里区",
        "value": 1
    }, {"adcode": "230103", "padcode": "230100", "name": "南岗区", "value": 1}, {
        "adcode": "230104",
        "padcode": "230100",
        "name": "道外区",
        "value": 1
    }, {"adcode": "230108", "padcode": "230100", "name": "平房区", "value": 1}, {
        "adcode": "230109",
        "padcode": "230100",
        "name": "松北区",
        "value": 1
    }, {"adcode": "230110", "padcode": "230100", "name": "香坊区", "value": 1}, {
        "adcode": "230111",
        "padcode": "230100",
        "name": "呼兰区",
        "value": 1
    }, {"adcode": "230112", "padcode": "230100", "name": "阿城区", "value": 1}, {
        "adcode": "230113",
        "padcode": "230100",
        "name": "双城区",
        "value": 1
    }, {"adcode": "230123", "padcode": "230100", "name": "依兰县", "value": 1}, {
        "adcode": "230124",
        "padcode": "230100",
        "name": "方正县",
        "value": 1
    }, {"adcode": "230125", "padcode": "230100", "name": "宾县", "value": 1}, {
        "adcode": "230126",
        "padcode": "230100",
        "name": "巴彦县",
        "value": 1
    }, {"adcode": "230127", "padcode": "230100", "name": "木兰县", "value": 1}, {
        "adcode": "230128",
        "padcode": "230100",
        "name": "通河县",
        "value": 1
    }, {"adcode": "230129", "padcode": "230100", "name": "延寿县", "value": 1}, {
        "adcode": "230183",
        "padcode": "230100",
        "name": "尚志市",
        "value": 1
    }, {"adcode": "230184", "padcode": "230100", "name": "五常市", "value": 1}, {
        "adcode": "230202",
        "padcode": "230200",
        "name": "龙沙区",
        "value": 1
    }, {"adcode": "230203", "padcode": "230200", "name": "建华区", "value": 1}, {
        "adcode": "230204",
        "padcode": "230200",
        "name": "铁锋区",
        "value": 1
    }, {"adcode": "230205", "padcode": "230200", "name": "昂昂溪区", "value": 1}, {
        "adcode": "230206",
        "padcode": "230200",
        "name": "富拉尔基区",
        "value": 1
    }, {"adcode": "230207", "padcode": "230200", "name": "碾子山区", "value": 1}, {
        "adcode": "230208",
        "padcode": "230200",
        "name": "梅里斯达斡尔族区",
        "value": 1
    }, {"adcode": "230221", "padcode": "230200", "name": "龙江县", "value": 1}, {
        "adcode": "230223",
        "padcode": "230200",
        "name": "依安县",
        "value": 1
    }, {"adcode": "230224", "padcode": "230200", "name": "泰来县", "value": 1}, {
        "adcode": "230225",
        "padcode": "230200",
        "name": "甘南县",
        "value": 1
    }, {"adcode": "230227", "padcode": "230200", "name": "富裕县", "value": 1}, {
        "adcode": "230229",
        "padcode": "230200",
        "name": "克山县",
        "value": 1
    }, {"adcode": "230230", "padcode": "230200", "name": "克东县", "value": 1}, {
        "adcode": "230231",
        "padcode": "230200",
        "name": "拜泉县",
        "value": 1
    }, {"adcode": "230281", "padcode": "230200", "name": "讷河市", "value": 1}, {
        "adcode": "230302",
        "padcode": "230300",
        "name": "鸡冠区",
        "value": 1
    }, {"adcode": "230303", "padcode": "230300", "name": "恒山区", "value": 1}, {
        "adcode": "230304",
        "padcode": "230300",
        "name": "滴道区",
        "value": 1
    }, {"adcode": "230305", "padcode": "230300", "name": "梨树区", "value": 1}, {
        "adcode": "230306",
        "padcode": "230300",
        "name": "城子河区",
        "value": 1
    }, {"adcode": "230307", "padcode": "230300", "name": "麻山区", "value": 1}, {
        "adcode": "230321",
        "padcode": "230300",
        "name": "鸡东县",
        "value": 1
    }, {"adcode": "230381", "padcode": "230300", "name": "虎林市", "value": 1}, {
        "adcode": "230382",
        "padcode": "230300",
        "name": "密山市",
        "value": 1
    }, {"adcode": "230402", "padcode": "230400", "name": "向阳区", "value": 2}, {
        "adcode": "230403",
        "padcode": "230400",
        "name": "工农区",
        "value": 1
    }, {"adcode": "230404", "padcode": "230400", "name": "南山区", "value": 2}, {
        "adcode": "230405",
        "padcode": "230400",
        "name": "兴安区",
        "value": 1
    }, {"adcode": "230406", "padcode": "230400", "name": "东山区", "value": 1}, {
        "adcode": "230407",
        "padcode": "230400",
        "name": "兴山区",
        "value": 1
    }, {"adcode": "230421", "padcode": "230400", "name": "萝北县", "value": 1}, {
        "adcode": "230422",
        "padcode": "230400",
        "name": "绥滨县",
        "value": 1
    }, {"adcode": "230502", "padcode": "230500", "name": "尖山区", "value": 1}, {
        "adcode": "230503",
        "padcode": "230500",
        "name": "岭东区",
        "value": 1
    }, {"adcode": "230505", "padcode": "230500", "name": "四方台区", "value": 1}, {
        "adcode": "230506",
        "padcode": "230500",
        "name": "宝山区",
        "value": 2
    }, {"adcode": "230521", "padcode": "230500", "name": "集贤县", "value": 1}, {
        "adcode": "230522",
        "padcode": "230500",
        "name": "友谊县",
        "value": 1
    }, {"adcode": "230523", "padcode": "230500", "name": "宝清县", "value": 1}, {
        "adcode": "230524",
        "padcode": "230500",
        "name": "饶河县",
        "value": 1
    }, {"adcode": "230602", "padcode": "230600", "name": "萨尔图区", "value": 1}, {
        "adcode": "230603",
        "padcode": "230600",
        "name": "龙凤区",
        "value": 1
    }, {"adcode": "230604", "padcode": "230600", "name": "让胡路区", "value": 1}, {
        "adcode": "230605",
        "padcode": "230600",
        "name": "红岗区",
        "value": 1
    }, {"adcode": "230606", "padcode": "230600", "name": "大同区", "value": 1}, {
        "adcode": "230621",
        "padcode": "230600",
        "name": "肇州县",
        "value": 1
    }, {"adcode": "230622", "padcode": "230600", "name": "肇源县", "value": 1}, {
        "adcode": "230623",
        "padcode": "230600",
        "name": "林甸县",
        "value": 1
    }, {"adcode": "230624", "padcode": "230600", "name": "杜尔伯特蒙古族自治县", "value": 1}, {
        "adcode": "230702",
        "padcode": "230700",
        "name": "伊春区",
        "value": 1
    }, {"adcode": "230703", "padcode": "230700", "name": "南岔区", "value": 1}, {
        "adcode": "230704",
        "padcode": "230700",
        "name": "友好区",
        "value": 1
    }, {"adcode": "230705", "padcode": "230700", "name": "西林区", "value": 1}, {
        "adcode": "230706",
        "padcode": "230700",
        "name": "翠峦区",
        "value": 1
    }, {"adcode": "230707", "padcode": "230700", "name": "新青区", "value": 1}, {
        "adcode": "230708",
        "padcode": "230700",
        "name": "美溪区",
        "value": 1
    }, {"adcode": "230709", "padcode": "230700", "name": "金山屯区", "value": 1}, {
        "adcode": "230710",
        "padcode": "230700",
        "name": "五营区",
        "value": 1
    }, {"adcode": "230711", "padcode": "230700", "name": "乌马河区", "value": 1}, {
        "adcode": "230712",
        "padcode": "230700",
        "name": "汤旺河区",
        "value": 1
    }, {"adcode": "230713", "padcode": "230700", "name": "带岭区", "value": 1}, {
        "adcode": "230714",
        "padcode": "230700",
        "name": "乌伊岭区",
        "value": 1
    }, {"adcode": "230715", "padcode": "230700", "name": "红星区", "value": 1}, {
        "adcode": "230716",
        "padcode": "230700",
        "name": "上甘岭区",
        "value": 1
    }, {"adcode": "230722", "padcode": "230700", "name": "嘉荫县", "value": 1}, {
        "adcode": "230781",
        "padcode": "230700",
        "name": "铁力市",
        "value": 1
    }, {"adcode": "230803", "padcode": "230800", "name": "向阳区", "value": 2}, {
        "adcode": "230804",
        "padcode": "230800",
        "name": "前进区",
        "value": 1
    }, {"adcode": "230805", "padcode": "230800", "name": "东风区", "value": 1}, {
        "adcode": "230811",
        "padcode": "230800",
        "name": "郊区",
        "value": 4
    }, {"adcode": "230822", "padcode": "230800", "name": "桦南县", "value": 1}, {
        "adcode": "230826",
        "padcode": "230800",
        "name": "桦川县",
        "value": 1
    }, {"adcode": "230828", "padcode": "230800", "name": "汤原县", "value": 1}, {
        "adcode": "230881",
        "padcode": "230800",
        "name": "同江市",
        "value": 1
    }, {"adcode": "230882", "padcode": "230800", "name": "富锦市", "value": 1}, {
        "adcode": "230883",
        "padcode": "230800",
        "name": "抚远市",
        "value": 1
    }, {"adcode": "230902", "padcode": "230900", "name": "新兴区", "value": 1}, {
        "adcode": "230903",
        "padcode": "230900",
        "name": "桃山区",
        "value": 1
    }, {"adcode": "230904", "padcode": "230900", "name": "茄子河区", "value": 1}, {
        "adcode": "230921",
        "padcode": "230900",
        "name": "勃利县",
        "value": 1
    }, {"adcode": "231002", "padcode": "231000", "name": "东安区", "value": 1}, {
        "adcode": "231003",
        "padcode": "231000",
        "name": "阳明区",
        "value": 1
    }, {"adcode": "231004", "padcode": "231000", "name": "爱民区", "value": 1}, {
        "adcode": "231005",
        "padcode": "231000",
        "name": "西安区",
        "value": 2
    }, {"adcode": "231025", "padcode": "231000", "name": "林口县", "value": 1}, {
        "adcode": "231081",
        "padcode": "231000",
        "name": "绥芬河市",
        "value": 1
    }, {"adcode": "231083", "padcode": "231000", "name": "海林市", "value": 1}, {
        "adcode": "231084",
        "padcode": "231000",
        "name": "宁安市",
        "value": 1
    }, {"adcode": "231085", "padcode": "231000", "name": "穆棱市", "value": 1}, {
        "adcode": "231086",
        "padcode": "231000",
        "name": "东宁市",
        "value": 1
    }, {"adcode": "231102", "padcode": "231100", "name": "爱辉区", "value": 1}, {
        "adcode": "231121",
        "padcode": "231100",
        "name": "嫩江县",
        "value": 1
    }, {"adcode": "231123", "padcode": "231100", "name": "逊克县", "value": 1}, {
        "adcode": "231124",
        "padcode": "231100",
        "name": "孙吴县",
        "value": 1
    }, {"adcode": "231181", "padcode": "231100", "name": "北安市", "value": 1}, {
        "adcode": "231182",
        "padcode": "231100",
        "name": "五大连池市",
        "value": 1
    }, {"adcode": "231202", "padcode": "231200", "name": "北林区", "value": 1}, {
        "adcode": "231221",
        "padcode": "231200",
        "name": "望奎县",
        "value": 1
    }, {"adcode": "231222", "padcode": "231200", "name": "兰西县", "value": 1}, {
        "adcode": "231223",
        "padcode": "231200",
        "name": "青冈县",
        "value": 1
    }, {"adcode": "231224", "padcode": "231200", "name": "庆安县", "value": 1}, {
        "adcode": "231225",
        "padcode": "231200",
        "name": "明水县",
        "value": 1
    }, {"adcode": "231226", "padcode": "231200", "name": "绥棱县", "value": 1}, {
        "adcode": "231281",
        "padcode": "231200",
        "name": "安达市",
        "value": 1
    }, {"adcode": "231282", "padcode": "231200", "name": "肇东市", "value": 1}, {
        "adcode": "231283",
        "padcode": "231200",
        "name": "海伦市",
        "value": 1
    }, {"adcode": "232721", "padcode": "232700", "name": "呼玛县", "value": 1}, {
        "adcode": "232722",
        "padcode": "232700",
        "name": "塔河县",
        "value": 1
    }, {"adcode": "232723", "padcode": "232700", "name": "漠河县", "value": 1},
    {"adcode": "310101", "padcode": "310000", "name": "黄浦区", "value": 1, "orderPosition":[[121.480838,31.214881],[121.489684,31.199985],[121.465217,31.239395]],
        "driverInfo":[{"driverName":"程潇潇","driverTel":"16389698696","eqpNo":"沪B68812"},{"driverName":"张坤","driverTel":"16709693696","eqpNo":"沪B60612"},{"driverName":"赵长湖","driverTel":"13969999999","eqpNo":"沪B65602"}]},
    {"adcode": "310104", "padcode": "310000", "name": "徐汇区", "value": 1, "orderPosition":[[121.436525,31.188523],[121.44116,31.171781],[121.446057,31.131804]],
        "driverInfo":[{"driverName":"李宇阳","driverTel":"18989698995","eqpNo":"沪B18612"},{"driverName":"周志宸","driverTel":"1376123565","eqpNo":"沪B95612"},{"driverName":"王贤成","driverTel":"1389888882","eqpNo":"沪B05612"}]},
    {"adcode": "310105", "padcode": "310000", "name": "长宁区", "value": 1, "orderPosition":[[121.424624,31.220367],[121.374671,31.247228]],
        "driverInfo":[{"driverName":"张一阳","driverTel":"16789698696","eqpNo":"沪B09612"},{"driverName":"刘备","driverTel":"16700698930","eqpNo":"沪B95012"}]},
    {"adcode": "310106", "padcode": "310000", "name": "静安区", "value": 1, "orderPosition":[[121.434851,31.308678],[121.453047,31.242803]],
        "driverInfo":[{"driverName":"龙非夜","driverTel":"16789698696","eqpNo":"沪B01612"},{"driverName":"杨阳","driverTel":"16666666616","eqpNo":"沪B95612"}]},
    {"adcode": "310107", "padcode": "310000", "name": "普陀区", "value": 2, "orderPosition":[[121.395555,31.24984],[121.353155,31.284028],[121.375041,31.235383]],
        "driverInfo":[{"driverName":"高岑","driverTel":"16780098696","eqpNo":"沪B05612"},{"driverName":"许智阳","driverTel":"16789698696","eqpNo":"沪B05612"},{"driverName":"刘子睿","driverTel":"16789698696","eqpNo":"沪B55612"}]},
    {"adcode": "310109", "padcode": "310000", "name": "虹口区", "value": 1, "orderPosition":[[121.483544,31.271762],[121.474389,31.29797],[121.475036,31.283607],[121.498158,31.25016],[121.482429,31.281247]],
        "driverInfo":[{"driverName":"刘宇浩","driverTel":"16789698002","eqpNo":"沪B65612"},{"driverName":"张传铭","driverTel":"16719198696","eqpNo":"沪B19612"},{"driverName":"孙辰尧","driverTel":"1389888882","eqpNo":"沪B77612"},{"driverName":"周师傅","driverTel":"16789698696","eqpNo":"沪B99912"},{"driverName":"吴昊","driverTel":"16789698696","eqpNo":"沪B61623"}]},
    {"adcode": "310110", "padcode": "310000", "name": "杨浦区", "value": 1, "orderPosition":[[121.525727,31.259822],[121.528064,31.308544],[121.505868,31.299923]],
        "driverInfo":[{"driverName":"胡云纬","driverTel":"16789696726","eqpNo":"沪B65612"},{"driverName":"周向晨","driverTel":"1376123565","eqpNo":"沪B95012"},{"driverName":"张宸瑜","driverTel":"13969999999","eqpNo":"沪B99619"}]},
    {"adcode": "310112", "padcode": "310000", "name": "闵行区", "value": 1, "orderPosition":[[121.381709,31.112813],[121.397159,31.055772],[121.505,31.055161]],
        "driverInfo":[{"driverName":"宁清","driverTel":"16789698696","eqpNo":"沪B65710"},{"driverName":"子默","driverTel":"11789698696","eqpNo":"沪B09610"},{"driverName":"刘梓臣","driverTel":"1389888882","eqpNo":"沪B95692"}]},
    {"adcode": "310113", "padcode": "310000", "name": "宝山区", "value": 2, "orderPosition":[[121.489612,31.405457],[121.458198,31.346833],[121.412536,31.363838],[121.423866,31.340676]],
        "driverInfo":[{"driverName":"何传航","driverTel":"18989698995","eqpNo":"沪B67617"},{"driverName":"赵萌萌","driverTel":"13789698696","eqpNo":"沪B95692"},{"driverName":"周洁宇","driverTel":"13969999999","eqpNo":"沪B00612"},{"driverName":"张瑜","driverTel":"16789698696","eqpNo":"沪B01612"}]},
    {"adcode": "310114", "padcode": "310000", "name": "嘉定区", "value": 1, "orderPosition":[[121.2653,31.375602],[121.235259,31.339102],[121.168655,31.35728],[121.282981,31.305227]],
        "driverInfo":[{"driverName":"赵骐","driverTel":"16789692696","eqpNo":"沪B45672"},{"driverName":"张传胜","driverTel":"10789668696","eqpNo":"沪B61612"},{"driverName":"赵玮扬","driverTel":"16789698696","eqpNo":"沪B85612"},{"driverName":"赵启辰","driverTel":"16789698696","eqpNo":"沪B85612"}]},
    {"adcode": "310115", "padcode": "310000", "name": "浦东新区", "value": 1, "orderPosition":[[121.562747,31.185397],[121.835688,31.035339],[121.544379,31.221517],[121.76977,31.132662],[121.68085,31.140596]],
        "driverInfo":[{"driverName":"吴世华","driverTel":"16789608690","eqpNo":"沪B75612"},{"driverName":"李德","driverTel":"16786698696","eqpNo":"沪B95612"},{"driverName":"周传毅","driverTel":"1389888882","eqpNo":"沪BG0002"},{"driverName":"李师傅","driverTel":"16789698696","eqpNo":"沪B17812"},{"driverName":"张培","driverTel":"1389888883","eqpNo":"沪BG0065"}]},
    {"adcode": "310116", "padcode": "310000", "name": "金山区", "value": 1, "orderPosition":[[121.34197,30.741991],[121.267469,30.789339],[121.349866,30.803053],[121.311414,30.707461],[121.280859,30.761759]],
        "driverInfo":[{"driverName":"刘仁辉","driverTel":"16709698690","eqpNo":"沪B95772"},{"driverName":"李传泽","driverTel":"16789668696","eqpNo":"沪B95612"},{"driverName":"张师傅","driverTel":"16789698696","eqpNo":"沪BG0002"},{"driverName":"付思睿","driverTel":"16789698696","eqpNo":"沪B12612"},{"driverName":"王有玉","driverTel":"1389888883","eqpNo":"沪BG0008"}]},
    {"adcode": "310117", "padcode": "310000", "name": "松江区", "value": 1, "orderPosition":[[121.227747,31.032243],[121.161829,31.017238],[121.270834,30.991931],[121.179682,31.07739],[121.270662,31.056363]],
        "driverInfo":[{"driverName":"周岳扬","driverTel":"16780698196","eqpNo":"沪B05602"},{"driverName":"周宇阳","driverTel":"16789668696","eqpNo":"沪B65612"},{"driverName":"肖肖","driverTel":"13969999999","eqpNo":"沪BG2002"},{"driverName":"赵乐伶","driverTel":"16789698696","eqpNo":"沪B15772"},{"driverName":"赵青","driverTel":"1389888883","eqpNo":"沪BG0070"}]},
    {"adcode": "310118", "padcode": "310000", "name": "青浦区", "value": 1, "orderPosition":[[121.124178,31.150681],[121.110445,31.120413],[121.083824,31.25537],[121.046072,31.125703],[121.174303,31.147596]],
        "driverInfo":[{"driverName":"洪杰","driverTel":"16781698196","eqpNo":"沪B65612"},{"driverName":"孔梓镐","driverTel":"16789698666","eqpNo":"沪B65612"},{"driverName":"赵成昀","driverTel":"16789698696","eqpNo":"沪BG0207"},{"driverName":"李泽桐","driverTel":"16789698696","eqpNo":"沪B65666"},{"driverName":"付博文","driverTel":"1389888883","eqpNo":"沪BG0002"}]},
    {"adcode": "310120", "padcode": "310000", "name": "奉贤区", "value": 1, "orderPosition":[[121.43971,30.902183],[121.543565,30.898795],[121.396794,30.94165],[121.503911,30.93841],[121.452413,30.953722]],
        "driverInfo":[{"driverName":"刘子君","driverTel":"16799098396","eqpNo":"沪B65610"},{"driverName":"张山","driverTel":"16789698696","eqpNo":"沪B62612"},{"driverName":"孔俊","driverTel":"1389888882","eqpNo":"沪B05612"},{"driverName":"李谷凯","driverTel":"16789698696","eqpNo":"沪B G0036"},{"driverName":"叶恒","driverTel":"1389888883","eqpNo":"沪BG0002"}]},
    {"adcode": "310151", "padcode": "310000", "name": "崇明区", "value": 1, "orderPosition":[[121.449087,31.683352],[121.465567,31.615986],[121.544359,31.655009]],
        "driverInfo":[{"driverName":"刘杰颢","driverTel":"16009698696","eqpNo":"沪B65552"},{"driverName":"周传震","driverTel":"16789668696","eqpNo":"沪B45610"},{"driverName":"赵青文","driverTel":"13969999999","eqpNo":"沪B45612"}]},
    {
        "adcode": "320102",
        "padcode": "320100",
        "name": "玄武区",
        "value": 1
    }, {"adcode": "320104", "padcode": "320100", "name": "秦淮区", "value": 1}, {
        "adcode": "320105",
        "padcode": "320100",
        "name": "建邺区",
        "value": 1
    }, {"adcode": "320106", "padcode": "320100", "name": "鼓楼区", "value": 4}, {
        "adcode": "320111",
        "padcode": "320100",
        "name": "浦口区",
        "value": 1
    }, {"adcode": "320113", "padcode": "320100", "name": "栖霞区", "value": 1}, {
        "adcode": "320114",
        "padcode": "320100",
        "name": "雨花台区",
        "value": 1
    }, {"adcode": "320115", "padcode": "320100", "name": "江宁区", "value": 1}, {
        "adcode": "320116",
        "padcode": "320100",
        "name": "六合区",
        "value": 1
    }, {"adcode": "320117", "padcode": "320100", "name": "溧水区", "value": 1}, {
        "adcode": "320118",
        "padcode": "320100",
        "name": "高淳区",
        "value": 1
    }, {"adcode": "320205", "padcode": "320200", "name": "锡山区", "value": 1}, {
        "adcode": "320206",
        "padcode": "320200",
        "name": "惠山区",
        "value": 1
    }, {"adcode": "320211", "padcode": "320200", "name": "滨湖区", "value": 1}, {
        "adcode": "320213",
        "padcode": "320200",
        "name": "梁溪区",
        "value": 1
    }, {"adcode": "320214", "padcode": "320200", "name": "新吴区", "value": 1}, {
        "adcode": "320281",
        "padcode": "320200",
        "name": "江阴市",
        "value": 1
    }, {"adcode": "320282", "padcode": "320200", "name": "宜兴市", "value": 1}, {
        "adcode": "320302",
        "padcode": "320300",
        "name": "鼓楼区",
        "value": 4
    }, {"adcode": "320303", "padcode": "320300", "name": "云龙区", "value": 1}, {
        "adcode": "320305",
        "padcode": "320300",
        "name": "贾汪区",
        "value": 1
    }, {"adcode": "320311", "padcode": "320300", "name": "泉山区", "value": 1}, {
        "adcode": "320312",
        "padcode": "320300",
        "name": "铜山区",
        "value": 1
    }, {"adcode": "320321", "padcode": "320300", "name": "丰县", "value": 1}, {
        "adcode": "320322",
        "padcode": "320300",
        "name": "沛县",
        "value": 1
    }, {"adcode": "320324", "padcode": "320300", "name": "睢宁县", "value": 1}, {
        "adcode": "320381",
        "padcode": "320300",
        "name": "新沂市",
        "value": 1
    }, {"adcode": "320382", "padcode": "320300", "name": "邳州市", "value": 1}, {
        "adcode": "320402",
        "padcode": "320400",
        "name": "天宁区",
        "value": 1
    }, {"adcode": "320404", "padcode": "320400", "name": "钟楼区", "value": 1}, {
        "adcode": "320411",
        "padcode": "320400",
        "name": "新北区",
        "value": 1
    }, {"adcode": "320412", "padcode": "320400", "name": "武进区", "value": 1}, {
        "adcode": "320413",
        "padcode": "320400",
        "name": "金坛区",
        "value": 1
    }, {"adcode": "320481", "padcode": "320400", "name": "溧阳市", "value": 1}, {
        "adcode": "320505",
        "padcode": "320500",
        "name": "虎丘区",
        "value": 1
    }, {"adcode": "320506", "padcode": "320500", "name": "吴中区", "value": 1}, {
        "adcode": "320507",
        "padcode": "320500",
        "name": "相城区",
        "value": 1
    }, {"adcode": "320508", "padcode": "320500", "name": "姑苏区", "value": 1}, {
        "adcode": "320509",
        "padcode": "320500",
        "name": "吴江区",
        "value": 1
    }, {"adcode": "320581", "padcode": "320500", "name": "常熟市", "value": 1}, {
        "adcode": "320582",
        "padcode": "320500",
        "name": "张家港市",
        "value": 1
    }, {"adcode": "320583", "padcode": "320500", "name": "昆山市", "value": 1}, {
        "adcode": "320585",
        "padcode": "320500",
        "name": "太仓市",
        "value": 1
    }, {"adcode": "320602", "padcode": "320600", "name": "崇川区", "value": 1}, {
        "adcode": "320611",
        "padcode": "320600",
        "name": "港闸区",
        "value": 1
    }, {"adcode": "320612", "padcode": "320600", "name": "通州区", "value": 2}, {
        "adcode": "320621",
        "padcode": "320600",
        "name": "海安县",
        "value": 1
    }, {"adcode": "320623", "padcode": "320600", "name": "如东县", "value": 1}, {
        "adcode": "320681",
        "padcode": "320600",
        "name": "启东市",
        "value": 1
    }, {"adcode": "320682", "padcode": "320600", "name": "如皋市", "value": 1}, {
        "adcode": "320684",
        "padcode": "320600",
        "name": "海门市",
        "value": 1
    }, {"adcode": "320703", "padcode": "320700", "name": "连云区", "value": 1}, {
        "adcode": "320706",
        "padcode": "320700",
        "name": "海州区",
        "value": 2
    }, {"adcode": "320707", "padcode": "320700", "name": "赣榆区", "value": 1}, {
        "adcode": "320722",
        "padcode": "320700",
        "name": "东海县",
        "value": 1
    }, {"adcode": "320723", "padcode": "320700", "name": "灌云县", "value": 1}, {
        "adcode": "320724",
        "padcode": "320700",
        "name": "灌南县",
        "value": 1
    }, {"adcode": "320803", "padcode": "320800", "name": "淮安区", "value": 1}, {
        "adcode": "320804",
        "padcode": "320800",
        "name": "淮阴区",
        "value": 1
    }, {"adcode": "320812", "padcode": "320800", "name": "清江浦区", "value": 1}, {
        "adcode": "320813",
        "padcode": "320800",
        "name": "洪泽区",
        "value": 1
    }, {"adcode": "320826", "padcode": "320800", "name": "涟水县", "value": 1}, {
        "adcode": "320830",
        "padcode": "320800",
        "name": "盱眙县",
        "value": 1
    }, {"adcode": "320831", "padcode": "320800", "name": "金湖县", "value": 1}, {
        "adcode": "320902",
        "padcode": "320900",
        "name": "亭湖区",
        "value": 1
    }, {"adcode": "320903", "padcode": "320900", "name": "盐都区", "value": 1}, {
        "adcode": "320904",
        "padcode": "320900",
        "name": "大丰区",
        "value": 1
    }, {"adcode": "320921", "padcode": "320900", "name": "响水县", "value": 1}, {
        "adcode": "320922",
        "padcode": "320900",
        "name": "滨海县",
        "value": 1
    }, {"adcode": "320923", "padcode": "320900", "name": "阜宁县", "value": 1}, {
        "adcode": "320924",
        "padcode": "320900",
        "name": "射阳县",
        "value": 1
    }, {"adcode": "320925", "padcode": "320900", "name": "建湖县", "value": 1}, {
        "adcode": "320981",
        "padcode": "320900",
        "name": "东台市",
        "value": 1
    }, {"adcode": "321002", "padcode": "321000", "name": "广陵区", "value": 1}, {
        "adcode": "321003",
        "padcode": "321000",
        "name": "邗江区",
        "value": 1
    }, {"adcode": "321012", "padcode": "321000", "name": "江都区", "value": 1}, {
        "adcode": "321023",
        "padcode": "321000",
        "name": "宝应县",
        "value": 1
    }, {"adcode": "321081", "padcode": "321000", "name": "仪征市", "value": 1}, {
        "adcode": "321084",
        "padcode": "321000",
        "name": "高邮市",
        "value": 1
    }, {"adcode": "321102", "padcode": "321100", "name": "京口区", "value": 1}, {
        "adcode": "321111",
        "padcode": "321100",
        "name": "润州区",
        "value": 1
    }, {"adcode": "321112", "padcode": "321100", "name": "丹徒区", "value": 1}, {
        "adcode": "321181",
        "padcode": "321100",
        "name": "丹阳市",
        "value": 1
    }, {"adcode": "321182", "padcode": "321100", "name": "扬中市", "value": 1}, {
        "adcode": "321183",
        "padcode": "321100",
        "name": "句容市",
        "value": 1
    }, {"adcode": "321202", "padcode": "321200", "name": "海陵区", "value": 1}, {
        "adcode": "321203",
        "padcode": "321200",
        "name": "高港区",
        "value": 1
    }, {"adcode": "321204", "padcode": "321200", "name": "姜堰区", "value": 1}, {
        "adcode": "321281",
        "padcode": "321200",
        "name": "兴化市",
        "value": 1
    }, {"adcode": "321282", "padcode": "321200", "name": "靖江市", "value": 1}, {
        "adcode": "321283",
        "padcode": "321200",
        "name": "泰兴市",
        "value": 1
    }, {"adcode": "321302", "padcode": "321300", "name": "宿城区", "value": 1}, {
        "adcode": "321311",
        "padcode": "321300",
        "name": "宿豫区",
        "value": 1
    }, {"adcode": "321322", "padcode": "321300", "name": "沭阳县", "value": 1}, {
        "adcode": "321323",
        "padcode": "321300",
        "name": "泗阳县",
        "value": 1
    }, {"adcode": "321324", "padcode": "321300", "name": "泗洪县", "value": 1}, {
        "adcode": "330102",
        "padcode": "330100",
        "name": "上城区",
        "value": 1
    }, {"adcode": "330103", "padcode": "330100", "name": "下城区", "value": 1}, {
        "adcode": "330104",
        "padcode": "330100",
        "name": "江干区",
        "value": 1
    }, {"adcode": "330105", "padcode": "330100", "name": "拱墅区", "value": 1}, {
        "adcode": "330106",
        "padcode": "330100",
        "name": "西湖区",
        "value": 2
    }, {"adcode": "330108", "padcode": "330100", "name": "滨江区", "value": 1}, {
        "adcode": "330109",
        "padcode": "330100",
        "name": "萧山区",
        "value": 1
    }, {"adcode": "330110", "padcode": "330100", "name": "余杭区", "value": 1}, {
        "adcode": "330111",
        "padcode": "330100",
        "name": "富阳区",
        "value": 1
    }, {"adcode": "330112", "padcode": "330100", "name": "临安区", "value": 1}, {
        "adcode": "330122",
        "padcode": "330100",
        "name": "桐庐县",
        "value": 1
    }, {"adcode": "330127", "padcode": "330100", "name": "淳安县", "value": 1}, {
        "adcode": "330182",
        "padcode": "330100",
        "name": "建德市",
        "value": 1
    }, {"adcode": "330203", "padcode": "330200", "name": "海曙区", "value": 1}, {
        "adcode": "330205",
        "padcode": "330200",
        "name": "江北区",
        "value": 2
    }, {"adcode": "330206", "padcode": "330200", "name": "北仑区", "value": 1}, {
        "adcode": "330211",
        "padcode": "330200",
        "name": "镇海区",
        "value": 1
    }, {"adcode": "330212", "padcode": "330200", "name": "鄞州区", "value": 1}, {
        "adcode": "330213",
        "padcode": "330200",
        "name": "奉化区",
        "value": 1
    }, {"adcode": "330225", "padcode": "330200", "name": "象山县", "value": 1}, {
        "adcode": "330226",
        "padcode": "330200",
        "name": "宁海县",
        "value": 1
    }, {"adcode": "330281", "padcode": "330200", "name": "余姚市", "value": 1}, {
        "adcode": "330282",
        "padcode": "330200",
        "name": "慈溪市",
        "value": 1
    }, {"adcode": "330302", "padcode": "330300", "name": "鹿城区", "value": 1}, {
        "adcode": "330303",
        "padcode": "330300",
        "name": "龙湾区",
        "value": 1
    }, {"adcode": "330304", "padcode": "330300", "name": "瓯海区", "value": 1}, {
        "adcode": "330305",
        "padcode": "330300",
        "name": "洞头区",
        "value": 1
    }, {"adcode": "330324", "padcode": "330300", "name": "永嘉县", "value": 1}, {
        "adcode": "330326",
        "padcode": "330300",
        "name": "平阳县",
        "value": 1
    }, {"adcode": "330327", "padcode": "330300", "name": "苍南县", "value": 1}, {
        "adcode": "330328",
        "padcode": "330300",
        "name": "文成县",
        "value": 1
    }, {"adcode": "330329", "padcode": "330300", "name": "泰顺县", "value": 1}, {
        "adcode": "330381",
        "padcode": "330300",
        "name": "瑞安市",
        "value": 1
    }, {"adcode": "330382", "padcode": "330300", "name": "乐清市", "value": 1}, {
        "adcode": "330402",
        "padcode": "330400",
        "name": "南湖区",
        "value": 1
    }, {"adcode": "330411", "padcode": "330400", "name": "秀洲区", "value": 1}, {
        "adcode": "330421",
        "padcode": "330400",
        "name": "嘉善县",
        "value": 1
    }, {"adcode": "330424", "padcode": "330400", "name": "海盐县", "value": 1}, {
        "adcode": "330481",
        "padcode": "330400",
        "name": "海宁市",
        "value": 1
    }, {"adcode": "330482", "padcode": "330400", "name": "平湖市", "value": 1}, {
        "adcode": "330483",
        "padcode": "330400",
        "name": "桐乡市",
        "value": 1
    }, {"adcode": "330502", "padcode": "330500", "name": "吴兴区", "value": 1}, {
        "adcode": "330503",
        "padcode": "330500",
        "name": "南浔区",
        "value": 1
    }, {"adcode": "330521", "padcode": "330500", "name": "德清县", "value": 1}, {
        "adcode": "330522",
        "padcode": "330500",
        "name": "长兴县",
        "value": 1
    }, {"adcode": "330523", "padcode": "330500", "name": "安吉县", "value": 1}, {
        "adcode": "330602",
        "padcode": "330600",
        "name": "越城区",
        "value": 1
    }, {"adcode": "330603", "padcode": "330600", "name": "柯桥区", "value": 1}, {
        "adcode": "330604",
        "padcode": "330600",
        "name": "上虞区",
        "value": 1
    }, {"adcode": "330624", "padcode": "330600", "name": "新昌县", "value": 1}, {
        "adcode": "330681",
        "padcode": "330600",
        "name": "诸暨市",
        "value": 1
    }, {"adcode": "330683", "padcode": "330600", "name": "嵊州市", "value": 1}, {
        "adcode": "330702",
        "padcode": "330700",
        "name": "婺城区",
        "value": 1
    }, {"adcode": "330703", "padcode": "330700", "name": "金东区", "value": 1}, {
        "adcode": "330723",
        "padcode": "330700",
        "name": "武义县",
        "value": 1
    }, {"adcode": "330726", "padcode": "330700", "name": "浦江县", "value": 1}, {
        "adcode": "330727",
        "padcode": "330700",
        "name": "磐安县",
        "value": 1
    }, {"adcode": "330781", "padcode": "330700", "name": "兰溪市", "value": 1}, {
        "adcode": "330782",
        "padcode": "330700",
        "name": "义乌市",
        "value": 1
    }, {"adcode": "330783", "padcode": "330700", "name": "东阳市", "value": 1}, {
        "adcode": "330784",
        "padcode": "330700",
        "name": "永康市",
        "value": 1
    }, {"adcode": "330802", "padcode": "330800", "name": "柯城区", "value": 1}, {
        "adcode": "330803",
        "padcode": "330800",
        "name": "衢江区",
        "value": 1
    }, {"adcode": "330822", "padcode": "330800", "name": "常山县", "value": 1}, {
        "adcode": "330824",
        "padcode": "330800",
        "name": "开化县",
        "value": 1
    }, {"adcode": "330825", "padcode": "330800", "name": "龙游县", "value": 1}, {
        "adcode": "330881",
        "padcode": "330800",
        "name": "江山市",
        "value": 1
    }, {"adcode": "330902", "padcode": "330900", "name": "定海区", "value": 1}, {
        "adcode": "330903",
        "padcode": "330900",
        "name": "普陀区",
        "value": 2
    }, {"adcode": "330921", "padcode": "330900", "name": "岱山县", "value": 1}, {
        "adcode": "330922",
        "padcode": "330900",
        "name": "嵊泗县",
        "value": 1
    }, {"adcode": "331002", "padcode": "331000", "name": "椒江区", "value": 1}, {
        "adcode": "331003",
        "padcode": "331000",
        "name": "黄岩区",
        "value": 1
    }, {"adcode": "331004", "padcode": "331000", "name": "路桥区", "value": 1}, {
        "adcode": "331022",
        "padcode": "331000",
        "name": "三门县",
        "value": 1
    }, {"adcode": "331023", "padcode": "331000", "name": "天台县", "value": 1}, {
        "adcode": "331024",
        "padcode": "331000",
        "name": "仙居县",
        "value": 1
    }, {"adcode": "331081", "padcode": "331000", "name": "温岭市", "value": 1}, {
        "adcode": "331082",
        "padcode": "331000",
        "name": "临海市",
        "value": 1
    }, {"adcode": "331083", "padcode": "331000", "name": "玉环市", "value": 1}, {
        "adcode": "331102",
        "padcode": "331100",
        "name": "莲都区",
        "value": 1
    }, {"adcode": "331121", "padcode": "331100", "name": "青田县", "value": 1}, {
        "adcode": "331122",
        "padcode": "331100",
        "name": "缙云县",
        "value": 1
    }, {"adcode": "331123", "padcode": "331100", "name": "遂昌县", "value": 1}, {
        "adcode": "331124",
        "padcode": "331100",
        "name": "松阳县",
        "value": 1
    }, {"adcode": "331125", "padcode": "331100", "name": "云和县", "value": 1}, {
        "adcode": "331126",
        "padcode": "331100",
        "name": "庆元县",
        "value": 1
    }, {"adcode": "331127", "padcode": "331100", "name": "景宁畲族自治县", "value": 1}, {
        "adcode": "331181",
        "padcode": "331100",
        "name": "龙泉市",
        "value": 1
    }, {"adcode": "340102", "padcode": "340100", "name": "瑶海区", "value": 1}, {
        "adcode": "340103",
        "padcode": "340100",
        "name": "庐阳区",
        "value": 1
    }, {"adcode": "340104", "padcode": "340100", "name": "蜀山区", "value": 1}, {
        "adcode": "340111",
        "padcode": "340100",
        "name": "包河区",
        "value": 1
    }, {"adcode": "340121", "padcode": "340100", "name": "长丰县", "value": 1}, {
        "adcode": "340122",
        "padcode": "340100",
        "name": "肥东县",
        "value": 1
    }, {"adcode": "340123", "padcode": "340100", "name": "肥西县", "value": 1}, {
        "adcode": "340124",
        "padcode": "340100",
        "name": "庐江县",
        "value": 1
    }, {"adcode": "340181", "padcode": "340100", "name": "巢湖市", "value": 1}, {
        "adcode": "340202",
        "padcode": "340200",
        "name": "镜湖区",
        "value": 1
    }, {"adcode": "340203", "padcode": "340200", "name": "弋江区", "value": 1}, {
        "adcode": "340207",
        "padcode": "340200",
        "name": "鸠江区",
        "value": 1
    }, {"adcode": "340208", "padcode": "340200", "name": "三山区", "value": 1}, {
        "adcode": "340221",
        "padcode": "340200",
        "name": "芜湖县",
        "value": 1
    }, {"adcode": "340222", "padcode": "340200", "name": "繁昌县", "value": 1}, {
        "adcode": "340223",
        "padcode": "340200",
        "name": "南陵县",
        "value": 1
    }, {"adcode": "340225", "padcode": "340200", "name": "无为县", "value": 1}, {
        "adcode": "340302",
        "padcode": "340300",
        "name": "龙子湖区",
        "value": 1
    }, {"adcode": "340303", "padcode": "340300", "name": "蚌山区", "value": 1}, {
        "adcode": "340304",
        "padcode": "340300",
        "name": "禹会区",
        "value": 1
    }, {"adcode": "340311", "padcode": "340300", "name": "淮上区", "value": 1}, {
        "adcode": "340321",
        "padcode": "340300",
        "name": "怀远县",
        "value": 1
    }, {"adcode": "340322", "padcode": "340300", "name": "五河县", "value": 1}, {
        "adcode": "340323",
        "padcode": "340300",
        "name": "固镇县",
        "value": 1
    }, {"adcode": "340402", "padcode": "340400", "name": "大通区", "value": 1}, {
        "adcode": "340403",
        "padcode": "340400",
        "name": "田家庵区",
        "value": 1
    }, {"adcode": "340404", "padcode": "340400", "name": "谢家集区", "value": 1}, {
        "adcode": "340405",
        "padcode": "340400",
        "name": "八公山区",
        "value": 1
    }, {"adcode": "340406", "padcode": "340400", "name": "潘集区", "value": 1}, {
        "adcode": "340421",
        "padcode": "340400",
        "name": "凤台县",
        "value": 1
    }, {"adcode": "340422", "padcode": "340400", "name": "寿县", "value": 1}, {
        "adcode": "340503",
        "padcode": "340500",
        "name": "花山区",
        "value": 1
    }, {"adcode": "340504", "padcode": "340500", "name": "雨山区", "value": 1}, {
        "adcode": "340506",
        "padcode": "340500",
        "name": "博望区",
        "value": 1
    }, {"adcode": "340521", "padcode": "340500", "name": "当涂县", "value": 1}, {
        "adcode": "340522",
        "padcode": "340500",
        "name": "含山县",
        "value": 1
    }, {"adcode": "340523", "padcode": "340500", "name": "和县", "value": 1}, {
        "adcode": "340602",
        "padcode": "340600",
        "name": "杜集区",
        "value": 1
    }, {"adcode": "340603", "padcode": "340600", "name": "相山区", "value": 1}, {
        "adcode": "340604",
        "padcode": "340600",
        "name": "烈山区",
        "value": 1
    }, {"adcode": "340621", "padcode": "340600", "name": "濉溪县", "value": 1}, {
        "adcode": "340705",
        "padcode": "340700",
        "name": "铜官区",
        "value": 1
    }, {"adcode": "340706", "padcode": "340700", "name": "义安区", "value": 1}, {
        "adcode": "340711",
        "padcode": "340700",
        "name": "郊区",
        "value": 4
    }, {"adcode": "340722", "padcode": "340700", "name": "枞阳县", "value": 1}, {
        "adcode": "340802",
        "padcode": "340800",
        "name": "迎江区",
        "value": 1
    }, {"adcode": "340803", "padcode": "340800", "name": "大观区", "value": 1}, {
        "adcode": "340811",
        "padcode": "340800",
        "name": "宜秀区",
        "value": 1
    }, {"adcode": "340822", "padcode": "340800", "name": "怀宁县", "value": 1}, {
        "adcode": "340824",
        "padcode": "340800",
        "name": "潜山县",
        "value": 1
    }, {"adcode": "340825", "padcode": "340800", "name": "太湖县", "value": 1}, {
        "adcode": "340826",
        "padcode": "340800",
        "name": "宿松县",
        "value": 1
    }, {"adcode": "340827", "padcode": "340800", "name": "望江县", "value": 1}, {
        "adcode": "340828",
        "padcode": "340800",
        "name": "岳西县",
        "value": 1
    }, {"adcode": "340881", "padcode": "340800", "name": "桐城市", "value": 1}, {
        "adcode": "341002",
        "padcode": "341000",
        "name": "屯溪区",
        "value": 1
    }, {"adcode": "341003", "padcode": "341000", "name": "黄山区", "value": 1}, {
        "adcode": "341004",
        "padcode": "341000",
        "name": "徽州区",
        "value": 1
    }, {"adcode": "341021", "padcode": "341000", "name": "歙县", "value": 1}, {
        "adcode": "341022",
        "padcode": "341000",
        "name": "休宁县",
        "value": 1
    }, {"adcode": "341023", "padcode": "341000", "name": "黟县", "value": 1}, {
        "adcode": "341024",
        "padcode": "341000",
        "name": "祁门县",
        "value": 1
    }, {"adcode": "341102", "padcode": "341100", "name": "琅琊区", "value": 1}, {
        "adcode": "341103",
        "padcode": "341100",
        "name": "南谯区",
        "value": 1
    }, {"adcode": "341122", "padcode": "341100", "name": "来安县", "value": 1}, {
        "adcode": "341124",
        "padcode": "341100",
        "name": "全椒县",
        "value": 1
    }, {"adcode": "341125", "padcode": "341100", "name": "定远县", "value": 1}, {
        "adcode": "341126",
        "padcode": "341100",
        "name": "凤阳县",
        "value": 1
    }, {"adcode": "341181", "padcode": "341100", "name": "天长市", "value": 1}, {
        "adcode": "341182",
        "padcode": "341100",
        "name": "明光市",
        "value": 1
    }, {"adcode": "341202", "padcode": "341200", "name": "颍州区", "value": 1}, {
        "adcode": "341203",
        "padcode": "341200",
        "name": "颍东区",
        "value": 1
    }, {"adcode": "341204", "padcode": "341200", "name": "颍泉区", "value": 1}, {
        "adcode": "341221",
        "padcode": "341200",
        "name": "临泉县",
        "value": 1
    }, {"adcode": "341222", "padcode": "341200", "name": "太和县", "value": 1}, {
        "adcode": "341225",
        "padcode": "341200",
        "name": "阜南县",
        "value": 1
    }, {"adcode": "341226", "padcode": "341200", "name": "颍上县", "value": 1}, {
        "adcode": "341282",
        "padcode": "341200",
        "name": "界首市",
        "value": 1
    }, {"adcode": "341302", "padcode": "341300", "name": "埇桥区", "value": 1}, {
        "adcode": "341321",
        "padcode": "341300",
        "name": "砀山县",
        "value": 1
    }, {"adcode": "341322", "padcode": "341300", "name": "萧县", "value": 1}, {
        "adcode": "341323",
        "padcode": "341300",
        "name": "灵璧县",
        "value": 1
    }, {"adcode": "341324", "padcode": "341300", "name": "泗县", "value": 1}, {
        "adcode": "341502",
        "padcode": "341500",
        "name": "金安区",
        "value": 1
    }, {"adcode": "341503", "padcode": "341500", "name": "裕安区", "value": 1}, {
        "adcode": "341504",
        "padcode": "341500",
        "name": "叶集区",
        "value": 1
    }, {"adcode": "341522", "padcode": "341500", "name": "霍邱县", "value": 1}, {
        "adcode": "341523",
        "padcode": "341500",
        "name": "舒城县",
        "value": 1
    }, {"adcode": "341524", "padcode": "341500", "name": "金寨县", "value": 1}, {
        "adcode": "341525",
        "padcode": "341500",
        "name": "霍山县",
        "value": 1
    }, {"adcode": "341602", "padcode": "341600", "name": "谯城区", "value": 1}, {
        "adcode": "341621",
        "padcode": "341600",
        "name": "涡阳县",
        "value": 1
    }, {"adcode": "341622", "padcode": "341600", "name": "蒙城县", "value": 1}, {
        "adcode": "341623",
        "padcode": "341600",
        "name": "利辛县",
        "value": 1
    }, {"adcode": "341702", "padcode": "341700", "name": "贵池区", "value": 1}, {
        "adcode": "341721",
        "padcode": "341700",
        "name": "东至县",
        "value": 1
    }, {"adcode": "341722", "padcode": "341700", "name": "石台县", "value": 1}, {
        "adcode": "341723",
        "padcode": "341700",
        "name": "青阳县",
        "value": 1
    }, {"adcode": "341802", "padcode": "341800", "name": "宣州区", "value": 1}, {
        "adcode": "341821",
        "padcode": "341800",
        "name": "郎溪县",
        "value": 1
    }, {"adcode": "341822", "padcode": "341800", "name": "广德县", "value": 1}, {
        "adcode": "341823",
        "padcode": "341800",
        "name": "泾县",
        "value": 1
    }, {"adcode": "341824", "padcode": "341800", "name": "绩溪县", "value": 1}, {
        "adcode": "341825",
        "padcode": "341800",
        "name": "旌德县",
        "value": 1
    }, {"adcode": "341881", "padcode": "341800", "name": "宁国市", "value": 1}, {
        "adcode": "350102",
        "padcode": "350100",
        "name": "鼓楼区",
        "value": 4
    }, {"adcode": "350103", "padcode": "350100", "name": "台江区", "value": 1}, {
        "adcode": "350104",
        "padcode": "350100",
        "name": "仓山区",
        "value": 1
    }, {"adcode": "350105", "padcode": "350100", "name": "马尾区", "value": 1}, {
        "adcode": "350111",
        "padcode": "350100",
        "name": "晋安区",
        "value": 1
    }, {"adcode": "350112", "padcode": "350100", "name": "长乐区", "value": 1}, {
        "adcode": "350121",
        "padcode": "350100",
        "name": "闽侯县",
        "value": 1
    }, {"adcode": "350122", "padcode": "350100", "name": "连江县", "value": 1}, {
        "adcode": "350123",
        "padcode": "350100",
        "name": "罗源县",
        "value": 1
    }, {"adcode": "350124", "padcode": "350100", "name": "闽清县", "value": 1}, {
        "adcode": "350125",
        "padcode": "350100",
        "name": "永泰县",
        "value": 1
    }, {"adcode": "350128", "padcode": "350100", "name": "平潭县", "value": 1}, {
        "adcode": "350181",
        "padcode": "350100",
        "name": "福清市",
        "value": 1
    }, {"adcode": "350203", "padcode": "350200", "name": "思明区", "value": 1}, {
        "adcode": "350205",
        "padcode": "350200",
        "name": "海沧区",
        "value": 1
    }, {"adcode": "350206", "padcode": "350200", "name": "湖里区", "value": 1}, {
        "adcode": "350211",
        "padcode": "350200",
        "name": "集美区",
        "value": 1
    }, {"adcode": "350212", "padcode": "350200", "name": "同安区", "value": 1}, {
        "adcode": "350213",
        "padcode": "350200",
        "name": "翔安区",
        "value": 1
    }, {"adcode": "350302", "padcode": "350300", "name": "城厢区", "value": 1}, {
        "adcode": "350303",
        "padcode": "350300",
        "name": "涵江区",
        "value": 1
    }, {"adcode": "350304", "padcode": "350300", "name": "荔城区", "value": 1}, {
        "adcode": "350305",
        "padcode": "350300",
        "name": "秀屿区",
        "value": 1
    }, {"adcode": "350322", "padcode": "350300", "name": "仙游县", "value": 1}, {
        "adcode": "350402",
        "padcode": "350400",
        "name": "梅列区",
        "value": 1
    }, {"adcode": "350403", "padcode": "350400", "name": "三元区", "value": 1}, {
        "adcode": "350421",
        "padcode": "350400",
        "name": "明溪县",
        "value": 1
    }, {"adcode": "350423", "padcode": "350400", "name": "清流县", "value": 1}, {
        "adcode": "350424",
        "padcode": "350400",
        "name": "宁化县",
        "value": 1
    }, {"adcode": "350425", "padcode": "350400", "name": "大田县", "value": 1}, {
        "adcode": "350426",
        "padcode": "350400",
        "name": "尤溪县",
        "value": 1
    }, {"adcode": "350427", "padcode": "350400", "name": "沙县", "value": 1}, {
        "adcode": "350428",
        "padcode": "350400",
        "name": "将乐县",
        "value": 1
    }, {"adcode": "350429", "padcode": "350400", "name": "泰宁县", "value": 1}, {
        "adcode": "350430",
        "padcode": "350400",
        "name": "建宁县",
        "value": 1
    }, {"adcode": "350481", "padcode": "350400", "name": "永安市", "value": 1}, {
        "adcode": "350502",
        "padcode": "350500",
        "name": "鲤城区",
        "value": 1
    }, {"adcode": "350503", "padcode": "350500", "name": "丰泽区", "value": 1}, {
        "adcode": "350504",
        "padcode": "350500",
        "name": "洛江区",
        "value": 1
    }, {"adcode": "350505", "padcode": "350500", "name": "泉港区", "value": 1}, {
        "adcode": "350521",
        "padcode": "350500",
        "name": "惠安县",
        "value": 1
    }, {"adcode": "350524", "padcode": "350500", "name": "安溪县", "value": 1}, {
        "adcode": "350525",
        "padcode": "350500",
        "name": "永春县",
        "value": 1
    }, {"adcode": "350526", "padcode": "350500", "name": "德化县", "value": 1}, {
        "adcode": "350527",
        "padcode": "350500",
        "name": "金门县",
        "value": 1
    }, {"adcode": "350581", "padcode": "350500", "name": "石狮市", "value": 1}, {
        "adcode": "350582",
        "padcode": "350500",
        "name": "晋江市",
        "value": 1
    }, {"adcode": "350583", "padcode": "350500", "name": "南安市", "value": 1}, {
        "adcode": "350602",
        "padcode": "350600",
        "name": "芗城区",
        "value": 1
    }, {"adcode": "350603", "padcode": "350600", "name": "龙文区", "value": 1}, {
        "adcode": "350622",
        "padcode": "350600",
        "name": "云霄县",
        "value": 1
    }, {"adcode": "350623", "padcode": "350600", "name": "漳浦县", "value": 1}, {
        "adcode": "350624",
        "padcode": "350600",
        "name": "诏安县",
        "value": 1
    }, {"adcode": "350625", "padcode": "350600", "name": "长泰县", "value": 1}, {
        "adcode": "350626",
        "padcode": "350600",
        "name": "东山县",
        "value": 1
    }, {"adcode": "350627", "padcode": "350600", "name": "南靖县", "value": 1}, {
        "adcode": "350628",
        "padcode": "350600",
        "name": "平和县",
        "value": 1
    }, {"adcode": "350629", "padcode": "350600", "name": "华安县", "value": 1}, {
        "adcode": "350681",
        "padcode": "350600",
        "name": "龙海市",
        "value": 1
    }, {"adcode": "350702", "padcode": "350700", "name": "延平区", "value": 1}, {
        "adcode": "350703",
        "padcode": "350700",
        "name": "建阳区",
        "value": 1
    }, {"adcode": "350721", "padcode": "350700", "name": "顺昌县", "value": 1}, {
        "adcode": "350722",
        "padcode": "350700",
        "name": "浦城县",
        "value": 1
    }, {"adcode": "350723", "padcode": "350700", "name": "光泽县", "value": 1}, {
        "adcode": "350724",
        "padcode": "350700",
        "name": "松溪县",
        "value": 1
    }, {"adcode": "350725", "padcode": "350700", "name": "政和县", "value": 1}, {
        "adcode": "350781",
        "padcode": "350700",
        "name": "邵武市",
        "value": 1
    }, {"adcode": "350782", "padcode": "350700", "name": "武夷山市", "value": 1}, {
        "adcode": "350783",
        "padcode": "350700",
        "name": "建瓯市",
        "value": 1
    }, {"adcode": "350802", "padcode": "350800", "name": "新罗区", "value": 1}, {
        "adcode": "350803",
        "padcode": "350800",
        "name": "永定区",
        "value": 2
    }, {"adcode": "350821", "padcode": "350800", "name": "长汀县", "value": 1}, {
        "adcode": "350823",
        "padcode": "350800",
        "name": "上杭县",
        "value": 1
    }, {"adcode": "350824", "padcode": "350800", "name": "武平县", "value": 1}, {
        "adcode": "350825",
        "padcode": "350800",
        "name": "连城县",
        "value": 1
    }, {"adcode": "350881", "padcode": "350800", "name": "漳平市", "value": 1}, {
        "adcode": "350902",
        "padcode": "350900",
        "name": "蕉城区",
        "value": 1
    }, {"adcode": "350921", "padcode": "350900", "name": "霞浦县", "value": 1}, {
        "adcode": "350922",
        "padcode": "350900",
        "name": "古田县",
        "value": 1
    }, {"adcode": "350923", "padcode": "350900", "name": "屏南县", "value": 1}, {
        "adcode": "350924",
        "padcode": "350900",
        "name": "寿宁县",
        "value": 1
    }, {"adcode": "350925", "padcode": "350900", "name": "周宁县", "value": 1}, {
        "adcode": "350926",
        "padcode": "350900",
        "name": "柘荣县",
        "value": 1
    }, {"adcode": "350981", "padcode": "350900", "name": "福安市", "value": 1}, {
        "adcode": "350982",
        "padcode": "350900",
        "name": "福鼎市",
        "value": 1
    }, {"adcode": "360102", "padcode": "360100", "name": "东湖区", "value": 1}, {
        "adcode": "360103",
        "padcode": "360100",
        "name": "西湖区",
        "value": 2
    }, {"adcode": "360104", "padcode": "360100", "name": "青云谱区", "value": 1}, {
        "adcode": "360105",
        "padcode": "360100",
        "name": "湾里区",
        "value": 1
    }, {"adcode": "360111", "padcode": "360100", "name": "青山湖区", "value": 1}, {
        "adcode": "360112",
        "padcode": "360100",
        "name": "新建区",
        "value": 1
    }, {"adcode": "360121", "padcode": "360100", "name": "南昌县", "value": 1}, {
        "adcode": "360123",
        "padcode": "360100",
        "name": "安义县",
        "value": 1
    }, {"adcode": "360124", "padcode": "360100", "name": "进贤县", "value": 1}, {
        "adcode": "360202",
        "padcode": "360200",
        "name": "昌江区",
        "value": 1
    }, {"adcode": "360203", "padcode": "360200", "name": "珠山区", "value": 1}, {
        "adcode": "360222",
        "padcode": "360200",
        "name": "浮梁县",
        "value": 1
    }, {"adcode": "360281", "padcode": "360200", "name": "乐平市", "value": 1}, {
        "adcode": "360302",
        "padcode": "360300",
        "name": "安源区",
        "value": 1
    }, {"adcode": "360313", "padcode": "360300", "name": "湘东区", "value": 1}, {
        "adcode": "360321",
        "padcode": "360300",
        "name": "莲花县",
        "value": 1
    }, {"adcode": "360322", "padcode": "360300", "name": "上栗县", "value": 1}, {
        "adcode": "360323",
        "padcode": "360300",
        "name": "芦溪县",
        "value": 1
    }, {"adcode": "360402", "padcode": "360400", "name": "濂溪区", "value": 1}, {
        "adcode": "360403",
        "padcode": "360400",
        "name": "浔阳区",
        "value": 1
    }, {"adcode": "360404", "padcode": "360400", "name": "柴桑区", "value": 1}, {
        "adcode": "360423",
        "padcode": "360400",
        "name": "武宁县",
        "value": 1
    }, {"adcode": "360424", "padcode": "360400", "name": "修水县", "value": 1}, {
        "adcode": "360425",
        "padcode": "360400",
        "name": "永修县",
        "value": 1
    }, {"adcode": "360426", "padcode": "360400", "name": "德安县", "value": 1}, {
        "adcode": "360428",
        "padcode": "360400",
        "name": "都昌县",
        "value": 1
    }, {"adcode": "360429", "padcode": "360400", "name": "湖口县", "value": 1}, {
        "adcode": "360430",
        "padcode": "360400",
        "name": "彭泽县",
        "value": 1
    }, {"adcode": "360481", "padcode": "360400", "name": "瑞昌市", "value": 1}, {
        "adcode": "360482",
        "padcode": "360400",
        "name": "共青城市",
        "value": 1
    }, {"adcode": "360483", "padcode": "360400", "name": "庐山市", "value": 1}, {
        "adcode": "360502",
        "padcode": "360500",
        "name": "渝水区",
        "value": 1
    }, {"adcode": "360521", "padcode": "360500", "name": "分宜县", "value": 1}, {
        "adcode": "360602",
        "padcode": "360600",
        "name": "月湖区",
        "value": 1
    }, {"adcode": "360622", "padcode": "360600", "name": "余江县", "value": 1}, {
        "adcode": "360681",
        "padcode": "360600",
        "name": "贵溪市",
        "value": 1
    }, {"adcode": "360702", "padcode": "360700", "name": "章贡区", "value": 1}, {
        "adcode": "360703",
        "padcode": "360700",
        "name": "南康区",
        "value": 1
    }, {"adcode": "360704", "padcode": "360700", "name": "赣县区", "value": 1}, {
        "adcode": "360722",
        "padcode": "360700",
        "name": "信丰县",
        "value": 1
    }, {"adcode": "360723", "padcode": "360700", "name": "大余县", "value": 1}, {
        "adcode": "360724",
        "padcode": "360700",
        "name": "上犹县",
        "value": 1
    }, {"adcode": "360725", "padcode": "360700", "name": "崇义县", "value": 1}, {
        "adcode": "360726",
        "padcode": "360700",
        "name": "安远县",
        "value": 1
    }, {"adcode": "360727", "padcode": "360700", "name": "龙南县", "value": 1}, {
        "adcode": "360728",
        "padcode": "360700",
        "name": "定南县",
        "value": 1
    }, {"adcode": "360729", "padcode": "360700", "name": "全南县", "value": 1}, {
        "adcode": "360730",
        "padcode": "360700",
        "name": "宁都县",
        "value": 1
    }, {"adcode": "360731", "padcode": "360700", "name": "于都县", "value": 1}, {
        "adcode": "360732",
        "padcode": "360700",
        "name": "兴国县",
        "value": 1
    }, {"adcode": "360733", "padcode": "360700", "name": "会昌县", "value": 1}, {
        "adcode": "360734",
        "padcode": "360700",
        "name": "寻乌县",
        "value": 1
    }, {"adcode": "360735", "padcode": "360700", "name": "石城县", "value": 1}, {
        "adcode": "360781",
        "padcode": "360700",
        "name": "瑞金市",
        "value": 1
    }, {"adcode": "360802", "padcode": "360800", "name": "吉州区", "value": 1}, {
        "adcode": "360803",
        "padcode": "360800",
        "name": "青原区",
        "value": 1
    }, {"adcode": "360821", "padcode": "360800", "name": "吉安县", "value": 1}, {
        "adcode": "360822",
        "padcode": "360800",
        "name": "吉水县",
        "value": 1
    }, {"adcode": "360823", "padcode": "360800", "name": "峡江县", "value": 1}, {
        "adcode": "360824",
        "padcode": "360800",
        "name": "新干县",
        "value": 1
    }, {"adcode": "360825", "padcode": "360800", "name": "永丰县", "value": 1}, {
        "adcode": "360826",
        "padcode": "360800",
        "name": "泰和县",
        "value": 1
    }, {"adcode": "360827", "padcode": "360800", "name": "遂川县", "value": 1}, {
        "adcode": "360828",
        "padcode": "360800",
        "name": "万安县",
        "value": 1
    }, {"adcode": "360829", "padcode": "360800", "name": "安福县", "value": 1}, {
        "adcode": "360830",
        "padcode": "360800",
        "name": "永新县",
        "value": 1
    }, {"adcode": "360881", "padcode": "360800", "name": "井冈山市", "value": 1}, {
        "adcode": "360902",
        "padcode": "360900",
        "name": "袁州区",
        "value": 1
    }, {"adcode": "360921", "padcode": "360900", "name": "奉新县", "value": 1}, {
        "adcode": "360922",
        "padcode": "360900",
        "name": "万载县",
        "value": 1
    }, {"adcode": "360923", "padcode": "360900", "name": "上高县", "value": 1}, {
        "adcode": "360924",
        "padcode": "360900",
        "name": "宜丰县",
        "value": 1
    }, {"adcode": "360925", "padcode": "360900", "name": "靖安县", "value": 1}, {
        "adcode": "360926",
        "padcode": "360900",
        "name": "铜鼓县",
        "value": 1
    }, {"adcode": "360981", "padcode": "360900", "name": "丰城市", "value": 1}, {
        "adcode": "360982",
        "padcode": "360900",
        "name": "樟树市",
        "value": 1
    }, {"adcode": "360983", "padcode": "360900", "name": "高安市", "value": 1}, {
        "adcode": "361002",
        "padcode": "361000",
        "name": "临川区",
        "value": 1
    }, {"adcode": "361003", "padcode": "361000", "name": "东乡区", "value": 1}, {
        "adcode": "361021",
        "padcode": "361000",
        "name": "南城县",
        "value": 1
    }, {"adcode": "361022", "padcode": "361000", "name": "黎川县", "value": 1}, {
        "adcode": "361023",
        "padcode": "361000",
        "name": "南丰县",
        "value": 1
    }, {"adcode": "361024", "padcode": "361000", "name": "崇仁县", "value": 1}, {
        "adcode": "361025",
        "padcode": "361000",
        "name": "乐安县",
        "value": 1
    }, {"adcode": "361026", "padcode": "361000", "name": "宜黄县", "value": 1}, {
        "adcode": "361027",
        "padcode": "361000",
        "name": "金溪县",
        "value": 1
    }, {"adcode": "361028", "padcode": "361000", "name": "资溪县", "value": 1}, {
        "adcode": "361030",
        "padcode": "361000",
        "name": "广昌县",
        "value": 1
    }, {"adcode": "361102", "padcode": "361100", "name": "信州区", "value": 1}, {
        "adcode": "361103",
        "padcode": "361100",
        "name": "广丰区",
        "value": 1
    }, {"adcode": "361121", "padcode": "361100", "name": "上饶县", "value": 1}, {
        "adcode": "361123",
        "padcode": "361100",
        "name": "玉山县",
        "value": 1
    }, {"adcode": "361124", "padcode": "361100", "name": "铅山县", "value": 1}, {
        "adcode": "361125",
        "padcode": "361100",
        "name": "横峰县",
        "value": 1
    }, {"adcode": "361126", "padcode": "361100", "name": "弋阳县", "value": 1}, {
        "adcode": "361127",
        "padcode": "361100",
        "name": "余干县",
        "value": 1
    }, {"adcode": "361128", "padcode": "361100", "name": "鄱阳县", "value": 1}, {
        "adcode": "361129",
        "padcode": "361100",
        "name": "万年县",
        "value": 1
    }, {"adcode": "361130", "padcode": "361100", "name": "婺源县", "value": 1}, {
        "adcode": "361181",
        "padcode": "361100",
        "name": "德兴市",
        "value": 1
    }, {"adcode": "370102", "padcode": "370100", "name": "历下区", "value": 1}, {
        "adcode": "370103",
        "padcode": "370100",
        "name": "市中区",
        "value": 4
    }, {"adcode": "370104", "padcode": "370100", "name": "槐荫区", "value": 1}, {
        "adcode": "370105",
        "padcode": "370100",
        "name": "天桥区",
        "value": 1
    }, {"adcode": "370112", "padcode": "370100", "name": "历城区", "value": 1}, {
        "adcode": "370113",
        "padcode": "370100",
        "name": "长清区",
        "value": 1
    }, {"adcode": "370114", "padcode": "370100", "name": "章丘区", "value": 1}, {
        "adcode": "370124",
        "padcode": "370100",
        "name": "平阴县",
        "value": 1
    }, {"adcode": "370125", "padcode": "370100", "name": "济阳县", "value": 1}, {
        "adcode": "370126",
        "padcode": "370100",
        "name": "商河县",
        "value": 1
    }, {"adcode": "370202", "padcode": "370200", "name": "市南区", "value": 1}, {
        "adcode": "370203",
        "padcode": "370200",
        "name": "市北区",
        "value": 1
    }, {"adcode": "370211", "padcode": "370200", "name": "黄岛区", "value": 1}, {
        "adcode": "370212",
        "padcode": "370200",
        "name": "崂山区",
        "value": 1
    }, {"adcode": "370213", "padcode": "370200", "name": "李沧区", "value": 1}, {
        "adcode": "370214",
        "padcode": "370200",
        "name": "城阳区",
        "value": 1
    }, {"adcode": "370215", "padcode": "370200", "name": "即墨区", "value": 1}, {
        "adcode": "370281",
        "padcode": "370200",
        "name": "胶州市",
        "value": 1
    }, {"adcode": "370283", "padcode": "370200", "name": "平度市", "value": 1}, {
        "adcode": "370285",
        "padcode": "370200",
        "name": "莱西市",
        "value": 1
    }, {"adcode": "370302", "padcode": "370300", "name": "淄川区", "value": 1}, {
        "adcode": "370303",
        "padcode": "370300",
        "name": "张店区",
        "value": 1
    }, {"adcode": "370304", "padcode": "370300", "name": "博山区", "value": 1}, {
        "adcode": "370305",
        "padcode": "370300",
        "name": "临淄区",
        "value": 1
    }, {"adcode": "370306", "padcode": "370300", "name": "周村区", "value": 1}, {
        "adcode": "370321",
        "padcode": "370300",
        "name": "桓台县",
        "value": 1
    }, {"adcode": "370322", "padcode": "370300", "name": "高青县", "value": 1}, {
        "adcode": "370323",
        "padcode": "370300",
        "name": "沂源县",
        "value": 1
    }, {"adcode": "370402", "padcode": "370400", "name": "市中区", "value": 4}, {
        "adcode": "370403",
        "padcode": "370400",
        "name": "薛城区",
        "value": 1
    }, {"adcode": "370404", "padcode": "370400", "name": "峄城区", "value": 1}, {
        "adcode": "370405",
        "padcode": "370400",
        "name": "台儿庄区",
        "value": 1
    }, {"adcode": "370406", "padcode": "370400", "name": "山亭区", "value": 1}, {
        "adcode": "370481",
        "padcode": "370400",
        "name": "滕州市",
        "value": 1
    }, {"adcode": "370502", "padcode": "370500", "name": "东营区", "value": 1}, {
        "adcode": "370503",
        "padcode": "370500",
        "name": "河口区",
        "value": 1
    }, {"adcode": "370505", "padcode": "370500", "name": "垦利区", "value": 1}, {
        "adcode": "370522",
        "padcode": "370500",
        "name": "利津县",
        "value": 1
    }, {"adcode": "370523", "padcode": "370500", "name": "广饶县", "value": 1}, {
        "adcode": "370602",
        "padcode": "370600",
        "name": "芝罘区",
        "value": 1
    }, {"adcode": "370611", "padcode": "370600", "name": "福山区", "value": 1}, {
        "adcode": "370612",
        "padcode": "370600",
        "name": "牟平区",
        "value": 1
    }, {"adcode": "370613", "padcode": "370600", "name": "莱山区", "value": 1}, {
        "adcode": "370634",
        "padcode": "370600",
        "name": "长岛县",
        "value": 1
    }, {"adcode": "370681", "padcode": "370600", "name": "龙口市", "value": 1}, {
        "adcode": "370682",
        "padcode": "370600",
        "name": "莱阳市",
        "value": 1
    }, {"adcode": "370683", "padcode": "370600", "name": "莱州市", "value": 1}, {
        "adcode": "370684",
        "padcode": "370600",
        "name": "蓬莱市",
        "value": 1
    }, {"adcode": "370685", "padcode": "370600", "name": "招远市", "value": 1}, {
        "adcode": "370686",
        "padcode": "370600",
        "name": "栖霞市",
        "value": 1
    }, {"adcode": "370687", "padcode": "370600", "name": "海阳市", "value": 1}, {
        "adcode": "370702",
        "padcode": "370700",
        "name": "潍城区",
        "value": 1
    }, {"adcode": "370703", "padcode": "370700", "name": "寒亭区", "value": 1}, {
        "adcode": "370704",
        "padcode": "370700",
        "name": "坊子区",
        "value": 1
    }, {"adcode": "370705", "padcode": "370700", "name": "奎文区", "value": 1}, {
        "adcode": "370724",
        "padcode": "370700",
        "name": "临朐县",
        "value": 1
    }, {"adcode": "370725", "padcode": "370700", "name": "昌乐县", "value": 1}, {
        "adcode": "370781",
        "padcode": "370700",
        "name": "青州市",
        "value": 1
    }, {"adcode": "370782", "padcode": "370700", "name": "诸城市", "value": 1}, {
        "adcode": "370783",
        "padcode": "370700",
        "name": "寿光市",
        "value": 1
    }, {"adcode": "370784", "padcode": "370700", "name": "安丘市", "value": 1}, {
        "adcode": "370785",
        "padcode": "370700",
        "name": "高密市",
        "value": 1
    }, {"adcode": "370786", "padcode": "370700", "name": "昌邑市", "value": 1}, {
        "adcode": "370811",
        "padcode": "370800",
        "name": "任城区",
        "value": 1
    }, {"adcode": "370812", "padcode": "370800", "name": "兖州区", "value": 1}, {
        "adcode": "370826",
        "padcode": "370800",
        "name": "微山县",
        "value": 1
    }, {"adcode": "370827", "padcode": "370800", "name": "鱼台县", "value": 1}, {
        "adcode": "370828",
        "padcode": "370800",
        "name": "金乡县",
        "value": 1
    }, {"adcode": "370829", "padcode": "370800", "name": "嘉祥县", "value": 1}, {
        "adcode": "370830",
        "padcode": "370800",
        "name": "汶上县",
        "value": 1
    }, {"adcode": "370831", "padcode": "370800", "name": "泗水县", "value": 1}, {
        "adcode": "370832",
        "padcode": "370800",
        "name": "梁山县",
        "value": 1
    }, {"adcode": "370881", "padcode": "370800", "name": "曲阜市", "value": 1}, {
        "adcode": "370883",
        "padcode": "370800",
        "name": "邹城市",
        "value": 1
    }, {"adcode": "370902", "padcode": "370900", "name": "泰山区", "value": 1}, {
        "adcode": "370911",
        "padcode": "370900",
        "name": "岱岳区",
        "value": 1
    }, {"adcode": "370921", "padcode": "370900", "name": "宁阳县", "value": 1}, {
        "adcode": "370923",
        "padcode": "370900",
        "name": "东平县",
        "value": 1
    }, {"adcode": "370982", "padcode": "370900", "name": "新泰市", "value": 1}, {
        "adcode": "370983",
        "padcode": "370900",
        "name": "肥城市",
        "value": 1
    }, {"adcode": "371002", "padcode": "371000", "name": "环翠区", "value": 1}, {
        "adcode": "371003",
        "padcode": "371000",
        "name": "文登区",
        "value": 1
    }, {"adcode": "371082", "padcode": "371000", "name": "荣成市", "value": 1}, {
        "adcode": "371083",
        "padcode": "371000",
        "name": "乳山市",
        "value": 1
    }, {"adcode": "371102", "padcode": "371100", "name": "东港区", "value": 1}, {
        "adcode": "371103",
        "padcode": "371100",
        "name": "岚山区",
        "value": 1
    }, {"adcode": "371121", "padcode": "371100", "name": "五莲县", "value": 1}, {
        "adcode": "371122",
        "padcode": "371100",
        "name": "莒县",
        "value": 1
    }, {"adcode": "371202", "padcode": "371200", "name": "莱城区", "value": 1}, {
        "adcode": "371203",
        "padcode": "371200",
        "name": "钢城区",
        "value": 1
    }, {"adcode": "371302", "padcode": "371300", "name": "兰山区", "value": 1}, {
        "adcode": "371311",
        "padcode": "371300",
        "name": "罗庄区",
        "value": 1
    }, {"adcode": "371312", "padcode": "371300", "name": "河东区", "value": 2}, {
        "adcode": "371321",
        "padcode": "371300",
        "name": "沂南县",
        "value": 1
    }, {"adcode": "371322", "padcode": "371300", "name": "郯城县", "value": 1}, {
        "adcode": "371323",
        "padcode": "371300",
        "name": "沂水县",
        "value": 1
    }, {"adcode": "371324", "padcode": "371300", "name": "兰陵县", "value": 1}, {
        "adcode": "371325",
        "padcode": "371300",
        "name": "费县",
        "value": 1
    }, {"adcode": "371326", "padcode": "371300", "name": "平邑县", "value": 1}, {
        "adcode": "371327",
        "padcode": "371300",
        "name": "莒南县",
        "value": 1
    }, {"adcode": "371328", "padcode": "371300", "name": "蒙阴县", "value": 1}, {
        "adcode": "371329",
        "padcode": "371300",
        "name": "临沭县",
        "value": 1
    }, {"adcode": "371402", "padcode": "371400", "name": "德城区", "value": 1}, {
        "adcode": "371403",
        "padcode": "371400",
        "name": "陵城区",
        "value": 1
    }, {"adcode": "371422", "padcode": "371400", "name": "宁津县", "value": 1}, {
        "adcode": "371423",
        "padcode": "371400",
        "name": "庆云县",
        "value": 1
    }, {"adcode": "371424", "padcode": "371400", "name": "临邑县", "value": 1}, {
        "adcode": "371425",
        "padcode": "371400",
        "name": "齐河县",
        "value": 1
    }, {"adcode": "371426", "padcode": "371400", "name": "平原县", "value": 1}, {
        "adcode": "371427",
        "padcode": "371400",
        "name": "夏津县",
        "value": 1
    }, {"adcode": "371428", "padcode": "371400", "name": "武城县", "value": 1}, {
        "adcode": "371481",
        "padcode": "371400",
        "name": "乐陵市",
        "value": 1
    }, {"adcode": "371482", "padcode": "371400", "name": "禹城市", "value": 1}, {
        "adcode": "371502",
        "padcode": "371500",
        "name": "东昌府区",
        "value": 1
    }, {"adcode": "371521", "padcode": "371500", "name": "阳谷县", "value": 1}, {
        "adcode": "371522",
        "padcode": "371500",
        "name": "莘县",
        "value": 1
    }, {"adcode": "371523", "padcode": "371500", "name": "茌平县", "value": 1}, {
        "adcode": "371524",
        "padcode": "371500",
        "name": "东阿县",
        "value": 1
    }, {"adcode": "371525", "padcode": "371500", "name": "冠县", "value": 1}, {
        "adcode": "371526",
        "padcode": "371500",
        "name": "高唐县",
        "value": 1
    }, {"adcode": "371581", "padcode": "371500", "name": "临清市", "value": 1}, {
        "adcode": "371602",
        "padcode": "371600",
        "name": "滨城区",
        "value": 1
    }, {"adcode": "371603", "padcode": "371600", "name": "沾化区", "value": 1}, {
        "adcode": "371621",
        "padcode": "371600",
        "name": "惠民县",
        "value": 1
    }, {"adcode": "371622", "padcode": "371600", "name": "阳信县", "value": 1}, {
        "adcode": "371623",
        "padcode": "371600",
        "name": "无棣县",
        "value": 1
    }, {"adcode": "371625", "padcode": "371600", "name": "博兴县", "value": 1}, {
        "adcode": "371626",
        "padcode": "371600",
        "name": "邹平县",
        "value": 1
    }, {"adcode": "371702", "padcode": "371700", "name": "牡丹区", "value": 1}, {
        "adcode": "371703",
        "padcode": "371700",
        "name": "定陶区",
        "value": 1
    }, {"adcode": "371721", "padcode": "371700", "name": "曹县", "value": 1}, {
        "adcode": "371722",
        "padcode": "371700",
        "name": "单县",
        "value": 1
    }, {"adcode": "371723", "padcode": "371700", "name": "成武县", "value": 1}, {
        "adcode": "371724",
        "padcode": "371700",
        "name": "巨野县",
        "value": 1
    }, {"adcode": "371725", "padcode": "371700", "name": "郓城县", "value": 1}, {
        "adcode": "371726",
        "padcode": "371700",
        "name": "鄄城县",
        "value": 1
    }, {"adcode": "371728", "padcode": "371700", "name": "东明县", "value": 1}, {
        "adcode": "410102",
        "padcode": "410100",
        "name": "中原区",
        "value": 1
    }, {"adcode": "410103", "padcode": "410100", "name": "二七区", "value": 1}, {
        "adcode": "410104",
        "padcode": "410100",
        "name": "管城回族区",
        "value": 1
    }, {"adcode": "410105", "padcode": "410100", "name": "金水区", "value": 1}, {
        "adcode": "410106",
        "padcode": "410100",
        "name": "上街区",
        "value": 1
    }, {"adcode": "410108", "padcode": "410100", "name": "惠济区", "value": 1}, {
        "adcode": "410122",
        "padcode": "410100",
        "name": "中牟县",
        "value": 1
    }, {"adcode": "410181", "padcode": "410100", "name": "巩义市", "value": 1}, {
        "adcode": "410182",
        "padcode": "410100",
        "name": "荥阳市",
        "value": 1
    }, {"adcode": "410183", "padcode": "410100", "name": "新密市", "value": 1}, {
        "adcode": "410184",
        "padcode": "410100",
        "name": "新郑市",
        "value": 1
    }, {"adcode": "410185", "padcode": "410100", "name": "登封市", "value": 1}, {
        "adcode": "410202",
        "padcode": "410200",
        "name": "龙亭区",
        "value": 1
    }, {"adcode": "410203", "padcode": "410200", "name": "顺河回族区", "value": 1}, {
        "adcode": "410204",
        "padcode": "410200",
        "name": "鼓楼区",
        "value": 4
    }, {"adcode": "410205", "padcode": "410200", "name": "禹王台区", "value": 1}, {
        "adcode": "410212",
        "padcode": "410200",
        "name": "祥符区",
        "value": 1
    }, {"adcode": "410221", "padcode": "410200", "name": "杞县", "value": 1}, {
        "adcode": "410222",
        "padcode": "410200",
        "name": "通许县",
        "value": 1
    }, {"adcode": "410223", "padcode": "410200", "name": "尉氏县", "value": 1}, {
        "adcode": "410225",
        "padcode": "410200",
        "name": "兰考县",
        "value": 1
    }, {"adcode": "410302", "padcode": "410300", "name": "老城区", "value": 1}, {
        "adcode": "410303",
        "padcode": "410300",
        "name": "西工区",
        "value": 1
    }, {"adcode": "410304", "padcode": "410300", "name": "瀍河回族区", "value": 1}, {
        "adcode": "410305",
        "padcode": "410300",
        "name": "涧西区",
        "value": 1
    }, {"adcode": "410306", "padcode": "410300", "name": "吉利区", "value": 1}, {
        "adcode": "410311",
        "padcode": "410300",
        "name": "洛龙区",
        "value": 1
    }, {"adcode": "410322", "padcode": "410300", "name": "孟津县", "value": 1}, {
        "adcode": "410323",
        "padcode": "410300",
        "name": "新安县",
        "value": 1
    }, {"adcode": "410324", "padcode": "410300", "name": "栾川县", "value": 1}, {
        "adcode": "410325",
        "padcode": "410300",
        "name": "嵩县",
        "value": 1
    }, {"adcode": "410326", "padcode": "410300", "name": "汝阳县", "value": 1}, {
        "adcode": "410327",
        "padcode": "410300",
        "name": "宜阳县",
        "value": 1
    }, {"adcode": "410328", "padcode": "410300", "name": "洛宁县", "value": 1}, {
        "adcode": "410329",
        "padcode": "410300",
        "name": "伊川县",
        "value": 1
    }, {"adcode": "410381", "padcode": "410300", "name": "偃师市", "value": 1}, {
        "adcode": "410402",
        "padcode": "410400",
        "name": "新华区",
        "value": 3
    }, {"adcode": "410403", "padcode": "410400", "name": "卫东区", "value": 1}, {
        "adcode": "410404",
        "padcode": "410400",
        "name": "石龙区",
        "value": 1
    }, {"adcode": "410411", "padcode": "410400", "name": "湛河区", "value": 1}, {
        "adcode": "410421",
        "padcode": "410400",
        "name": "宝丰县",
        "value": 1
    }, {"adcode": "410422", "padcode": "410400", "name": "叶县", "value": 1}, {
        "adcode": "410423",
        "padcode": "410400",
        "name": "鲁山县",
        "value": 1
    }, {"adcode": "410425", "padcode": "410400", "name": "郏县", "value": 1}, {
        "adcode": "410481",
        "padcode": "410400",
        "name": "舞钢市",
        "value": 1
    }, {"adcode": "410482", "padcode": "410400", "name": "汝州市", "value": 1}, {
        "adcode": "410502",
        "padcode": "410500",
        "name": "文峰区",
        "value": 1
    }, {"adcode": "410503", "padcode": "410500", "name": "北关区", "value": 1}, {
        "adcode": "410505",
        "padcode": "410500",
        "name": "殷都区",
        "value": 1
    }, {"adcode": "410506", "padcode": "410500", "name": "龙安区", "value": 1}, {
        "adcode": "410522",
        "padcode": "410500",
        "name": "安阳县",
        "value": 1
    }, {"adcode": "410523", "padcode": "410500", "name": "汤阴县", "value": 1}, {
        "adcode": "410526",
        "padcode": "410500",
        "name": "滑县",
        "value": 1
    }, {"adcode": "410527", "padcode": "410500", "name": "内黄县", "value": 1}, {
        "adcode": "410581",
        "padcode": "410500",
        "name": "林州市",
        "value": 1
    }, {"adcode": "410602", "padcode": "410600", "name": "鹤山区", "value": 1}, {
        "adcode": "410603",
        "padcode": "410600",
        "name": "山城区",
        "value": 1
    }, {"adcode": "410611", "padcode": "410600", "name": "淇滨区", "value": 1}, {
        "adcode": "410621",
        "padcode": "410600",
        "name": "浚县",
        "value": 1
    }, {"adcode": "410622", "padcode": "410600", "name": "淇县", "value": 1}, {
        "adcode": "410702",
        "padcode": "410700",
        "name": "红旗区",
        "value": 1
    }, {"adcode": "410703", "padcode": "410700", "name": "卫滨区", "value": 1}, {
        "adcode": "410704",
        "padcode": "410700",
        "name": "凤泉区",
        "value": 1
    }, {"adcode": "410711", "padcode": "410700", "name": "牧野区", "value": 1}, {
        "adcode": "410721",
        "padcode": "410700",
        "name": "新乡县",
        "value": 1
    }, {"adcode": "410724", "padcode": "410700", "name": "获嘉县", "value": 1}, {
        "adcode": "410725",
        "padcode": "410700",
        "name": "原阳县",
        "value": 1
    }, {"adcode": "410726", "padcode": "410700", "name": "延津县", "value": 1}, {
        "adcode": "410727",
        "padcode": "410700",
        "name": "封丘县",
        "value": 1
    }, {"adcode": "410728", "padcode": "410700", "name": "长垣县", "value": 1}, {
        "adcode": "410781",
        "padcode": "410700",
        "name": "卫辉市",
        "value": 1
    }, {"adcode": "410782", "padcode": "410700", "name": "辉县市", "value": 1}, {
        "adcode": "410802",
        "padcode": "410800",
        "name": "解放区",
        "value": 1
    }, {"adcode": "410803", "padcode": "410800", "name": "中站区", "value": 1}, {
        "adcode": "410804",
        "padcode": "410800",
        "name": "马村区",
        "value": 1
    }, {"adcode": "410811", "padcode": "410800", "name": "山阳区", "value": 1}, {
        "adcode": "410821",
        "padcode": "410800",
        "name": "修武县",
        "value": 1
    }, {"adcode": "410822", "padcode": "410800", "name": "博爱县", "value": 1}, {
        "adcode": "410823",
        "padcode": "410800",
        "name": "武陟县",
        "value": 1
    }, {"adcode": "410825", "padcode": "410800", "name": "温县", "value": 1}, {
        "adcode": "410882",
        "padcode": "410800",
        "name": "沁阳市",
        "value": 1
    }, {"adcode": "410883", "padcode": "410800", "name": "孟州市", "value": 1}, {
        "adcode": "410902",
        "padcode": "410900",
        "name": "华龙区",
        "value": 1
    }, {"adcode": "410922", "padcode": "410900", "name": "清丰县", "value": 1}, {
        "adcode": "410923",
        "padcode": "410900",
        "name": "南乐县",
        "value": 1
    }, {"adcode": "410926", "padcode": "410900", "name": "范县", "value": 1}, {
        "adcode": "410927",
        "padcode": "410900",
        "name": "台前县",
        "value": 1
    }, {"adcode": "410928", "padcode": "410900", "name": "濮阳县", "value": 1}, {
        "adcode": "411002",
        "padcode": "411000",
        "name": "魏都区",
        "value": 1
    }, {"adcode": "411003", "padcode": "411000", "name": "建安区", "value": 1}, {
        "adcode": "411024",
        "padcode": "411000",
        "name": "鄢陵县",
        "value": 1
    }, {"adcode": "411025", "padcode": "411000", "name": "襄城县", "value": 1}, {
        "adcode": "411081",
        "padcode": "411000",
        "name": "禹州市",
        "value": 1
    }, {"adcode": "411082", "padcode": "411000", "name": "长葛市", "value": 1}, {
        "adcode": "411102",
        "padcode": "411100",
        "name": "源汇区",
        "value": 1
    }, {"adcode": "411103", "padcode": "411100", "name": "郾城区", "value": 1}, {
        "adcode": "411104",
        "padcode": "411100",
        "name": "召陵区",
        "value": 1
    }, {"adcode": "411121", "padcode": "411100", "name": "舞阳县", "value": 1}, {
        "adcode": "411122",
        "padcode": "411100",
        "name": "临颍县",
        "value": 1
    }, {"adcode": "411202", "padcode": "411200", "name": "湖滨区", "value": 1}, {
        "adcode": "411203",
        "padcode": "411200",
        "name": "陕州区",
        "value": 1
    }, {"adcode": "411221", "padcode": "411200", "name": "渑池县", "value": 1}, {
        "adcode": "411224",
        "padcode": "411200",
        "name": "卢氏县",
        "value": 1
    }, {"adcode": "411281", "padcode": "411200", "name": "义马市", "value": 1}, {
        "adcode": "411282",
        "padcode": "411200",
        "name": "灵宝市",
        "value": 1
    }, {"adcode": "411302", "padcode": "411300", "name": "宛城区", "value": 1}, {
        "adcode": "411303",
        "padcode": "411300",
        "name": "卧龙区",
        "value": 1
    }, {"adcode": "411321", "padcode": "411300", "name": "南召县", "value": 1}, {
        "adcode": "411322",
        "padcode": "411300",
        "name": "方城县",
        "value": 1
    }, {"adcode": "411323", "padcode": "411300", "name": "西峡县", "value": 1}, {
        "adcode": "411324",
        "padcode": "411300",
        "name": "镇平县",
        "value": 1
    }, {"adcode": "411325", "padcode": "411300", "name": "内乡县", "value": 1}, {
        "adcode": "411326",
        "padcode": "411300",
        "name": "淅川县",
        "value": 1
    }, {"adcode": "411327", "padcode": "411300", "name": "社旗县", "value": 1}, {
        "adcode": "411328",
        "padcode": "411300",
        "name": "唐河县",
        "value": 1
    }, {"adcode": "411329", "padcode": "411300", "name": "新野县", "value": 1}, {
        "adcode": "411330",
        "padcode": "411300",
        "name": "桐柏县",
        "value": 1
    }, {"adcode": "411381", "padcode": "411300", "name": "邓州市", "value": 1}, {
        "adcode": "411402",
        "padcode": "411400",
        "name": "梁园区",
        "value": 1
    }, {"adcode": "411403", "padcode": "411400", "name": "睢阳区", "value": 1}, {
        "adcode": "411421",
        "padcode": "411400",
        "name": "民权县",
        "value": 1
    }, {"adcode": "411422", "padcode": "411400", "name": "睢县", "value": 1}, {
        "adcode": "411423",
        "padcode": "411400",
        "name": "宁陵县",
        "value": 1
    }, {"adcode": "411424", "padcode": "411400", "name": "柘城县", "value": 1}, {
        "adcode": "411425",
        "padcode": "411400",
        "name": "虞城县",
        "value": 1
    }, {"adcode": "411426", "padcode": "411400", "name": "夏邑县", "value": 1}, {
        "adcode": "411481",
        "padcode": "411400",
        "name": "永城市",
        "value": 1
    }, {"adcode": "411502", "padcode": "411500", "name": "浉河区", "value": 1}, {
        "adcode": "411503",
        "padcode": "411500",
        "name": "平桥区",
        "value": 1
    }, {"adcode": "411521", "padcode": "411500", "name": "罗山县", "value": 1}, {
        "adcode": "411522",
        "padcode": "411500",
        "name": "光山县",
        "value": 1
    }, {"adcode": "411523", "padcode": "411500", "name": "新县", "value": 1}, {
        "adcode": "411524",
        "padcode": "411500",
        "name": "商城县",
        "value": 1
    }, {"adcode": "411525", "padcode": "411500", "name": "固始县", "value": 1}, {
        "adcode": "411526",
        "padcode": "411500",
        "name": "潢川县",
        "value": 1
    }, {"adcode": "411527", "padcode": "411500", "name": "淮滨县", "value": 1}, {
        "adcode": "411528",
        "padcode": "411500",
        "name": "息县",
        "value": 1
    }, {"adcode": "411602", "padcode": "411600", "name": "川汇区", "value": 1}, {
        "adcode": "411621",
        "padcode": "411600",
        "name": "扶沟县",
        "value": 1
    }, {"adcode": "411622", "padcode": "411600", "name": "西华县", "value": 1}, {
        "adcode": "411623",
        "padcode": "411600",
        "name": "商水县",
        "value": 1
    }, {"adcode": "411624", "padcode": "411600", "name": "沈丘县", "value": 1}, {
        "adcode": "411625",
        "padcode": "411600",
        "name": "郸城县",
        "value": 1
    }, {"adcode": "411626", "padcode": "411600", "name": "淮阳县", "value": 1}, {
        "adcode": "411627",
        "padcode": "411600",
        "name": "太康县",
        "value": 1
    }, {"adcode": "411628", "padcode": "411600", "name": "鹿邑县", "value": 1}, {
        "adcode": "411681",
        "padcode": "411600",
        "name": "项城市",
        "value": 1
    }, {"adcode": "411702", "padcode": "411700", "name": "驿城区", "value": 1}, {
        "adcode": "411721",
        "padcode": "411700",
        "name": "西平县",
        "value": 1
    }, {"adcode": "411722", "padcode": "411700", "name": "上蔡县", "value": 1}, {
        "adcode": "411723",
        "padcode": "411700",
        "name": "平舆县",
        "value": 1
    }, {"adcode": "411724", "padcode": "411700", "name": "正阳县", "value": 1}, {
        "adcode": "411725",
        "padcode": "411700",
        "name": "确山县",
        "value": 1
    }, {"adcode": "411726", "padcode": "411700", "name": "泌阳县", "value": 1}, {
        "adcode": "411727",
        "padcode": "411700",
        "name": "汝南县",
        "value": 1
    }, {"adcode": "411728", "padcode": "411700", "name": "遂平县", "value": 1}, {
        "adcode": "411729",
        "padcode": "411700",
        "name": "新蔡县",
        "value": 1
    }, {"adcode": "419001", "padcode": "411700", "name": "济源市", "value": 1}, {
        "adcode": "420102",
        "padcode": "420100",
        "name": "江岸区",
        "value": 1
    }, {"adcode": "420103", "padcode": "420100", "name": "江汉区", "value": 1}, {
        "adcode": "420104",
        "padcode": "420100",
        "name": "硚口区",
        "value": 1
    }, {"adcode": "420105", "padcode": "420100", "name": "汉阳区", "value": 1}, {
        "adcode": "420106",
        "padcode": "420100",
        "name": "武昌区",
        "value": 1
    }, {"adcode": "420107", "padcode": "420100", "name": "青山区", "value": 2}, {
        "adcode": "420111",
        "padcode": "420100",
        "name": "洪山区",
        "value": 1
    }, {"adcode": "420112", "padcode": "420100", "name": "东西湖区", "value": 1}, {
        "adcode": "420113",
        "padcode": "420100",
        "name": "汉南区",
        "value": 1
    }, {"adcode": "420114", "padcode": "420100", "name": "蔡甸区", "value": 1}, {
        "adcode": "420115",
        "padcode": "420100",
        "name": "江夏区",
        "value": 1
    }, {"adcode": "420116", "padcode": "420100", "name": "黄陂区", "value": 1}, {
        "adcode": "420117",
        "padcode": "420100",
        "name": "新洲区",
        "value": 1
    }, {"adcode": "420202", "padcode": "420200", "name": "黄石港区", "value": 1}, {
        "adcode": "420203",
        "padcode": "420200",
        "name": "西塞山区",
        "value": 1
    }, {"adcode": "420204", "padcode": "420200", "name": "下陆区", "value": 1}, {
        "adcode": "420205",
        "padcode": "420200",
        "name": "铁山区",
        "value": 1
    }, {"adcode": "420222", "padcode": "420200", "name": "阳新县", "value": 1}, {
        "adcode": "420281",
        "padcode": "420200",
        "name": "大冶市",
        "value": 1
    }, {"adcode": "420302", "padcode": "420300", "name": "茅箭区", "value": 1}, {
        "adcode": "420303",
        "padcode": "420300",
        "name": "张湾区",
        "value": 1
    }, {"adcode": "420304", "padcode": "420300", "name": "郧阳区", "value": 1}, {
        "adcode": "420322",
        "padcode": "420300",
        "name": "郧西县",
        "value": 1
    }, {"adcode": "420323", "padcode": "420300", "name": "竹山县", "value": 1}, {
        "adcode": "420324",
        "padcode": "420300",
        "name": "竹溪县",
        "value": 1
    }, {"adcode": "420325", "padcode": "420300", "name": "房县", "value": 1}, {
        "adcode": "420381",
        "padcode": "420300",
        "name": "丹江口市",
        "value": 1
    }, {"adcode": "420502", "padcode": "420500", "name": "西陵区", "value": 1}, {
        "adcode": "420503",
        "padcode": "420500",
        "name": "伍家岗区",
        "value": 1
    }, {"adcode": "420504", "padcode": "420500", "name": "点军区", "value": 1}, {
        "adcode": "420505",
        "padcode": "420500",
        "name": "猇亭区",
        "value": 1
    }, {"adcode": "420506", "padcode": "420500", "name": "夷陵区", "value": 1}, {
        "adcode": "420525",
        "padcode": "420500",
        "name": "远安县",
        "value": 1
    }, {"adcode": "420526", "padcode": "420500", "name": "兴山县", "value": 1}, {
        "adcode": "420527",
        "padcode": "420500",
        "name": "秭归县",
        "value": 1
    }, {"adcode": "420528", "padcode": "420500", "name": "长阳土家族自治县", "value": 1}, {
        "adcode": "420529",
        "padcode": "420500",
        "name": "五峰土家族自治县",
        "value": 1
    }, {"adcode": "420581", "padcode": "420500", "name": "宜都市", "value": 1}, {
        "adcode": "420582",
        "padcode": "420500",
        "name": "当阳市",
        "value": 1
    }, {"adcode": "420583", "padcode": "420500", "name": "枝江市", "value": 1}, {
        "adcode": "420602",
        "padcode": "420600",
        "name": "襄城区",
        "value": 1
    }, {"adcode": "420606", "padcode": "420600", "name": "樊城区", "value": 1}, {
        "adcode": "420607",
        "padcode": "420600",
        "name": "襄州区",
        "value": 1
    }, {"adcode": "420624", "padcode": "420600", "name": "南漳县", "value": 1}, {
        "adcode": "420625",
        "padcode": "420600",
        "name": "谷城县",
        "value": 1
    }, {"adcode": "420626", "padcode": "420600", "name": "保康县", "value": 1}, {
        "adcode": "420682",
        "padcode": "420600",
        "name": "老河口市",
        "value": 1
    }, {"adcode": "420683", "padcode": "420600", "name": "枣阳市", "value": 1}, {
        "adcode": "420684",
        "padcode": "420600",
        "name": "宜城市",
        "value": 1
    }, {"adcode": "420702", "padcode": "420700", "name": "梁子湖区", "value": 1}, {
        "adcode": "420703",
        "padcode": "420700",
        "name": "华容区",
        "value": 1
    }, {"adcode": "420704", "padcode": "420700", "name": "鄂城区", "value": 1}, {
        "adcode": "420802",
        "padcode": "420800",
        "name": "东宝区",
        "value": 1
    }, {"adcode": "420804", "padcode": "420800", "name": "掇刀区", "value": 1}, {
        "adcode": "420821",
        "padcode": "420800",
        "name": "京山县",
        "value": 1
    }, {"adcode": "420822", "padcode": "420800", "name": "沙洋县", "value": 1}, {
        "adcode": "420881",
        "padcode": "420800",
        "name": "钟祥市",
        "value": 1
    }, {"adcode": "420902", "padcode": "420900", "name": "孝南区", "value": 1}, {
        "adcode": "420921",
        "padcode": "420900",
        "name": "孝昌县",
        "value": 1
    }, {"adcode": "420922", "padcode": "420900", "name": "大悟县", "value": 1}, {
        "adcode": "420923",
        "padcode": "420900",
        "name": "云梦县",
        "value": 1
    }, {"adcode": "420981", "padcode": "420900", "name": "应城市", "value": 1}, {
        "adcode": "420982",
        "padcode": "420900",
        "name": "安陆市",
        "value": 1
    }, {"adcode": "420984", "padcode": "420900", "name": "汉川市", "value": 1}, {
        "adcode": "421002",
        "padcode": "421000",
        "name": "沙市区",
        "value": 1
    }, {"adcode": "421003", "padcode": "421000", "name": "荆州区", "value": 1}, {
        "adcode": "421022",
        "padcode": "421000",
        "name": "公安县",
        "value": 1
    }, {"adcode": "421023", "padcode": "421000", "name": "监利县", "value": 1}, {
        "adcode": "421024",
        "padcode": "421000",
        "name": "江陵县",
        "value": 1
    }, {"adcode": "421081", "padcode": "421000", "name": "石首市", "value": 1}, {
        "adcode": "421083",
        "padcode": "421000",
        "name": "洪湖市",
        "value": 1
    }, {"adcode": "421087", "padcode": "421000", "name": "松滋市", "value": 1}, {
        "adcode": "421102",
        "padcode": "421100",
        "name": "黄州区",
        "value": 1
    }, {"adcode": "421121", "padcode": "421100", "name": "团风县", "value": 1}, {
        "adcode": "421122",
        "padcode": "421100",
        "name": "红安县",
        "value": 1
    }, {"adcode": "421123", "padcode": "421100", "name": "罗田县", "value": 1}, {
        "adcode": "421124",
        "padcode": "421100",
        "name": "英山县",
        "value": 1
    }, {"adcode": "421125", "padcode": "421100", "name": "浠水县", "value": 1}, {
        "adcode": "421126",
        "padcode": "421100",
        "name": "蕲春县",
        "value": 1
    }, {"adcode": "421127", "padcode": "421100", "name": "黄梅县", "value": 1}, {
        "adcode": "421181",
        "padcode": "421100",
        "name": "麻城市",
        "value": 1
    }, {"adcode": "421182", "padcode": "421100", "name": "武穴市", "value": 1}, {
        "adcode": "421202",
        "padcode": "421200",
        "name": "咸安区",
        "value": 1
    }, {"adcode": "421221", "padcode": "421200", "name": "嘉鱼县", "value": 1}, {
        "adcode": "421222",
        "padcode": "421200",
        "name": "通城县",
        "value": 1
    }, {"adcode": "421223", "padcode": "421200", "name": "崇阳县", "value": 1}, {
        "adcode": "421224",
        "padcode": "421200",
        "name": "通山县",
        "value": 1
    }, {"adcode": "421281", "padcode": "421200", "name": "赤壁市", "value": 1}, {
        "adcode": "421303",
        "padcode": "421300",
        "name": "曾都区",
        "value": 1
    }, {"adcode": "421321", "padcode": "421300", "name": "随县", "value": 1}, {
        "adcode": "421381",
        "padcode": "421300",
        "name": "广水市",
        "value": 1
    }, {"adcode": "422801", "padcode": "422800", "name": "恩施市", "value": 1}, {
        "adcode": "422802",
        "padcode": "422800",
        "name": "利川市",
        "value": 1
    }, {"adcode": "422822", "padcode": "422800", "name": "建始县", "value": 1}, {
        "adcode": "422823",
        "padcode": "422800",
        "name": "巴东县",
        "value": 1
    }, {"adcode": "422825", "padcode": "422800", "name": "宣恩县", "value": 1}, {
        "adcode": "422826",
        "padcode": "422800",
        "name": "咸丰县",
        "value": 1
    }, {"adcode": "422827", "padcode": "422800", "name": "来凤县", "value": 1}, {
        "adcode": "422828",
        "padcode": "422800",
        "name": "鹤峰县",
        "value": 1
    }, {"adcode": "430102", "padcode": "430100", "name": "芙蓉区", "value": 1}, {
        "adcode": "430103",
        "padcode": "430100",
        "name": "天心区",
        "value": 1
    }, {"adcode": "430104", "padcode": "430100", "name": "岳麓区", "value": 1}, {
        "adcode": "430105",
        "padcode": "430100",
        "name": "开福区",
        "value": 1
    }, {"adcode": "430111", "padcode": "430100", "name": "雨花区", "value": 1}, {
        "adcode": "430112",
        "padcode": "430100",
        "name": "望城区",
        "value": 1
    }, {"adcode": "430121", "padcode": "430100", "name": "长沙县", "value": 1}, {
        "adcode": "430181",
        "padcode": "430100",
        "name": "浏阳市",
        "value": 1
    }, {"adcode": "430182", "padcode": "430100", "name": "宁乡市", "value": 1}, {
        "adcode": "430202",
        "padcode": "430200",
        "name": "荷塘区",
        "value": 1
    }, {"adcode": "430203", "padcode": "430200", "name": "芦淞区", "value": 1}, {
        "adcode": "430204",
        "padcode": "430200",
        "name": "石峰区",
        "value": 1
    }, {"adcode": "430211", "padcode": "430200", "name": "天元区", "value": 1}, {
        "adcode": "430221",
        "padcode": "430200",
        "name": "株洲县",
        "value": 1
    }, {"adcode": "430223", "padcode": "430200", "name": "攸县", "value": 1}, {
        "adcode": "430224",
        "padcode": "430200",
        "name": "茶陵县",
        "value": 1
    }, {"adcode": "430225", "padcode": "430200", "name": "炎陵县", "value": 1}, {
        "adcode": "430281",
        "padcode": "430200",
        "name": "醴陵市",
        "value": 1
    }, {"adcode": "430302", "padcode": "430300", "name": "雨湖区", "value": 1}, {
        "adcode": "430304",
        "padcode": "430300",
        "name": "岳塘区",
        "value": 1
    }, {"adcode": "430321", "padcode": "430300", "name": "湘潭县", "value": 1}, {
        "adcode": "430381",
        "padcode": "430300",
        "name": "湘乡市",
        "value": 1
    }, {"adcode": "430382", "padcode": "430300", "name": "韶山市", "value": 1}, {
        "adcode": "430405",
        "padcode": "430400",
        "name": "珠晖区",
        "value": 1
    }, {"adcode": "430406", "padcode": "430400", "name": "雁峰区", "value": 1}, {
        "adcode": "430407",
        "padcode": "430400",
        "name": "石鼓区",
        "value": 1
    }, {"adcode": "430408", "padcode": "430400", "name": "蒸湘区", "value": 1}, {
        "adcode": "430412",
        "padcode": "430400",
        "name": "南岳区",
        "value": 1
    }, {"adcode": "430421", "padcode": "430400", "name": "衡阳县", "value": 1}, {
        "adcode": "430422",
        "padcode": "430400",
        "name": "衡南县",
        "value": 1
    }, {"adcode": "430423", "padcode": "430400", "name": "衡山县", "value": 1}, {
        "adcode": "430424",
        "padcode": "430400",
        "name": "衡东县",
        "value": 1
    }, {"adcode": "430426", "padcode": "430400", "name": "祁东县", "value": 1}, {
        "adcode": "430481",
        "padcode": "430400",
        "name": "耒阳市",
        "value": 1
    }, {"adcode": "430482", "padcode": "430400", "name": "常宁市", "value": 1}, {
        "adcode": "430502",
        "padcode": "430500",
        "name": "双清区",
        "value": 1
    }, {"adcode": "430503", "padcode": "430500", "name": "大祥区", "value": 1}, {
        "adcode": "430511",
        "padcode": "430500",
        "name": "北塔区",
        "value": 1
    }, {"adcode": "430521", "padcode": "430500", "name": "邵东县", "value": 1}, {
        "adcode": "430522",
        "padcode": "430500",
        "name": "新邵县",
        "value": 1
    }, {"adcode": "430523", "padcode": "430500", "name": "邵阳县", "value": 1}, {
        "adcode": "430524",
        "padcode": "430500",
        "name": "隆回县",
        "value": 1
    }, {"adcode": "430525", "padcode": "430500", "name": "洞口县", "value": 1}, {
        "adcode": "430527",
        "padcode": "430500",
        "name": "绥宁县",
        "value": 1
    }, {"adcode": "430528", "padcode": "430500", "name": "新宁县", "value": 1}, {
        "adcode": "430529",
        "padcode": "430500",
        "name": "城步苗族自治县",
        "value": 1
    }, {"adcode": "430581", "padcode": "430500", "name": "武冈市", "value": 1}, {
        "adcode": "430602",
        "padcode": "430600",
        "name": "岳阳楼区",
        "value": 1
    }, {"adcode": "430603", "padcode": "430600", "name": "云溪区", "value": 1}, {
        "adcode": "430611",
        "padcode": "430600",
        "name": "君山区",
        "value": 1
    }, {"adcode": "430621", "padcode": "430600", "name": "岳阳县", "value": 1}, {
        "adcode": "430623",
        "padcode": "430600",
        "name": "华容县",
        "value": 1
    }, {"adcode": "430624", "padcode": "430600", "name": "湘阴县", "value": 1}, {
        "adcode": "430626",
        "padcode": "430600",
        "name": "平江县",
        "value": 1
    }, {"adcode": "430681", "padcode": "430600", "name": "汨罗市", "value": 1}, {
        "adcode": "430682",
        "padcode": "430600",
        "name": "临湘市",
        "value": 1
    }, {"adcode": "430702", "padcode": "430700", "name": "武陵区", "value": 1}, {
        "adcode": "430703",
        "padcode": "430700",
        "name": "鼎城区",
        "value": 1
    }, {"adcode": "430721", "padcode": "430700", "name": "安乡县", "value": 1}, {
        "adcode": "430722",
        "padcode": "430700",
        "name": "汉寿县",
        "value": 1
    }, {"adcode": "430723", "padcode": "430700", "name": "澧县", "value": 1}, {
        "adcode": "430724",
        "padcode": "430700",
        "name": "临澧县",
        "value": 1
    }, {"adcode": "430725", "padcode": "430700", "name": "桃源县", "value": 1}, {
        "adcode": "430726",
        "padcode": "430700",
        "name": "石门县",
        "value": 1
    }, {"adcode": "430781", "padcode": "430700", "name": "津市市", "value": 1}, {
        "adcode": "430802",
        "padcode": "430800",
        "name": "永定区",
        "value": 2
    }, {"adcode": "430811", "padcode": "430800", "name": "武陵源区", "value": 1}, {
        "adcode": "430821",
        "padcode": "430800",
        "name": "慈利县",
        "value": 1
    }, {"adcode": "430822", "padcode": "430800", "name": "桑植县", "value": 1}, {
        "adcode": "430902",
        "padcode": "430900",
        "name": "资阳区",
        "value": 1
    }, {"adcode": "430903", "padcode": "430900", "name": "赫山区", "value": 1}, {
        "adcode": "430921",
        "padcode": "430900",
        "name": "南县",
        "value": 1
    }, {"adcode": "430922", "padcode": "430900", "name": "桃江县", "value": 1}, {
        "adcode": "430923",
        "padcode": "430900",
        "name": "安化县",
        "value": 1
    }, {"adcode": "430981", "padcode": "430900", "name": "沅江市", "value": 1}, {
        "adcode": "431002",
        "padcode": "431000",
        "name": "北湖区",
        "value": 1
    }, {"adcode": "431003", "padcode": "431000", "name": "苏仙区", "value": 1}, {
        "adcode": "431021",
        "padcode": "431000",
        "name": "桂阳县",
        "value": 1
    }, {"adcode": "431022", "padcode": "431000", "name": "宜章县", "value": 1}, {
        "adcode": "431023",
        "padcode": "431000",
        "name": "永兴县",
        "value": 1
    }, {"adcode": "431024", "padcode": "431000", "name": "嘉禾县", "value": 1}, {
        "adcode": "431025",
        "padcode": "431000",
        "name": "临武县",
        "value": 1
    }, {"adcode": "431026", "padcode": "431000", "name": "汝城县", "value": 1}, {
        "adcode": "431027",
        "padcode": "431000",
        "name": "桂东县",
        "value": 1
    }, {"adcode": "431028", "padcode": "431000", "name": "安仁县", "value": 1}, {
        "adcode": "431081",
        "padcode": "431000",
        "name": "资兴市",
        "value": 1
    }, {"adcode": "431102", "padcode": "431100", "name": "零陵区", "value": 1}, {
        "adcode": "431103",
        "padcode": "431100",
        "name": "冷水滩区",
        "value": 1
    }, {"adcode": "431121", "padcode": "431100", "name": "祁阳县", "value": 1}, {
        "adcode": "431122",
        "padcode": "431100",
        "name": "东安县",
        "value": 1
    }, {"adcode": "431123", "padcode": "431100", "name": "双牌县", "value": 1}, {
        "adcode": "431124",
        "padcode": "431100",
        "name": "道县",
        "value": 1
    }, {"adcode": "431125", "padcode": "431100", "name": "江永县", "value": 1}, {
        "adcode": "431126",
        "padcode": "431100",
        "name": "宁远县",
        "value": 1
    }, {"adcode": "431127", "padcode": "431100", "name": "蓝山县", "value": 1}, {
        "adcode": "431128",
        "padcode": "431100",
        "name": "新田县",
        "value": 1
    }, {"adcode": "431129", "padcode": "431100", "name": "江华瑶族自治县", "value": 1}, {
        "adcode": "431202",
        "padcode": "431200",
        "name": "鹤城区",
        "value": 1
    }, {"adcode": "431221", "padcode": "431200", "name": "中方县", "value": 1}, {
        "adcode": "431222",
        "padcode": "431200",
        "name": "沅陵县",
        "value": 1
    }, {"adcode": "431223", "padcode": "431200", "name": "辰溪县", "value": 1}, {
        "adcode": "431224",
        "padcode": "431200",
        "name": "溆浦县",
        "value": 1
    }, {"adcode": "431225", "padcode": "431200", "name": "会同县", "value": 1}, {
        "adcode": "431226",
        "padcode": "431200",
        "name": "麻阳苗族自治县",
        "value": 1
    }, {"adcode": "431227", "padcode": "431200", "name": "新晃侗族自治县", "value": 1}, {
        "adcode": "431228",
        "padcode": "431200",
        "name": "芷江侗族自治县",
        "value": 1
    }, {"adcode": "431229", "padcode": "431200", "name": "靖州苗族侗族自治县", "value": 1}, {
        "adcode": "431230",
        "padcode": "431200",
        "name": "通道侗族自治县",
        "value": 1
    }, {"adcode": "431281", "padcode": "431200", "name": "洪江市", "value": 1}, {
        "adcode": "431302",
        "padcode": "431300",
        "name": "娄星区",
        "value": 1
    }, {"adcode": "431321", "padcode": "431300", "name": "双峰县", "value": 1}, {
        "adcode": "431322",
        "padcode": "431300",
        "name": "新化县",
        "value": 1
    }, {"adcode": "431381", "padcode": "431300", "name": "冷水江市", "value": 1}, {
        "adcode": "431382",
        "padcode": "431300",
        "name": "涟源市",
        "value": 1
    }, {"adcode": "433101", "padcode": "433100", "name": "吉首市", "value": 1}, {
        "adcode": "433122",
        "padcode": "433100",
        "name": "泸溪县",
        "value": 1
    }, {"adcode": "433123", "padcode": "433100", "name": "凤凰县", "value": 1}, {
        "adcode": "433124",
        "padcode": "433100",
        "name": "花垣县",
        "value": 1
    }, {"adcode": "433125", "padcode": "433100", "name": "保靖县", "value": 1}, {
        "adcode": "433126",
        "padcode": "433100",
        "name": "古丈县",
        "value": 1
    }, {"adcode": "433127", "padcode": "433100", "name": "永顺县", "value": 1}, {
        "adcode": "433130",
        "padcode": "433100",
        "name": "龙山县",
        "value": 1
    }, {"adcode": "440103", "padcode": "440100", "name": "荔湾区", "value": 1}, {
        "adcode": "440104",
        "padcode": "440100",
        "name": "越秀区",
        "value": 1
    }, {"adcode": "440105", "padcode": "440100", "name": "海珠区", "value": 1}, {
        "adcode": "440106",
        "padcode": "440100",
        "name": "天河区",
        "value": 1
    }, {"adcode": "440111", "padcode": "440100", "name": "白云区", "value": 2}, {
        "adcode": "440112",
        "padcode": "440100",
        "name": "黄埔区",
        "value": 1
    }, {"adcode": "440113", "padcode": "440100", "name": "番禺区", "value": 1}, {
        "adcode": "440114",
        "padcode": "440100",
        "name": "花都区",
        "value": 1
    }, {"adcode": "440115", "padcode": "440100", "name": "南沙区", "value": 1}, {
        "adcode": "440117",
        "padcode": "440100",
        "name": "从化区",
        "value": 1
    }, {"adcode": "440118", "padcode": "440100", "name": "增城区", "value": 1}, {
        "adcode": "440203",
        "padcode": "440200",
        "name": "武江区",
        "value": 1
    }, {"adcode": "440204", "padcode": "440200", "name": "浈江区", "value": 1}, {
        "adcode": "440205",
        "padcode": "440200",
        "name": "曲江区",
        "value": 1
    }, {"adcode": "440222", "padcode": "440200", "name": "始兴县", "value": 1}, {
        "adcode": "440224",
        "padcode": "440200",
        "name": "仁化县",
        "value": 1
    }, {"adcode": "440229", "padcode": "440200", "name": "翁源县", "value": 1}, {
        "adcode": "440232",
        "padcode": "440200",
        "name": "乳源瑶族自治县",
        "value": 1
    }, {"adcode": "440233", "padcode": "440200", "name": "新丰县", "value": 1}, {
        "adcode": "440281",
        "padcode": "440200",
        "name": "乐昌市",
        "value": 1
    }, {"adcode": "440282", "padcode": "440200", "name": "南雄市", "value": 1}, {
        "adcode": "440303",
        "padcode": "440300",
        "name": "罗湖区",
        "value": 1
    }, {"adcode": "440304", "padcode": "440300", "name": "福田区", "value": 1}, {
        "adcode": "440305",
        "padcode": "440300",
        "name": "南山区",
        "value": 2
    }, {"adcode": "440306", "padcode": "440300", "name": "宝安区", "value": 1}, {
        "adcode": "440307",
        "padcode": "440300",
        "name": "龙岗区",
        "value": 1
    }, {"adcode": "440308", "padcode": "440300", "name": "盐田区", "value": 1}, {
        "adcode": "440309",
        "padcode": "440300",
        "name": "龙华区",
        "value": 2
    }, {"adcode": "440310", "padcode": "440300", "name": "坪山区", "value": 1}, {
        "adcode": "440402",
        "padcode": "440400",
        "name": "香洲区",
        "value": 1
    }, {"adcode": "440403", "padcode": "440400", "name": "斗门区", "value": 1}, {
        "adcode": "440404",
        "padcode": "440400",
        "name": "金湾区",
        "value": 1
    }, {"adcode": "440507", "padcode": "440500", "name": "龙湖区", "value": 1}, {
        "adcode": "440511",
        "padcode": "440500",
        "name": "金平区",
        "value": 1
    }, {"adcode": "440512", "padcode": "440500", "name": "濠江区", "value": 1}, {
        "adcode": "440513",
        "padcode": "440500",
        "name": "潮阳区",
        "value": 1
    }, {"adcode": "440514", "padcode": "440500", "name": "潮南区", "value": 1}, {
        "adcode": "440515",
        "padcode": "440500",
        "name": "澄海区",
        "value": 1
    }, {"adcode": "440523", "padcode": "440500", "name": "南澳县", "value": 1}, {
        "adcode": "440604",
        "padcode": "440600",
        "name": "禅城区",
        "value": 1
    }, {"adcode": "440605", "padcode": "440600", "name": "南海区", "value": 1}, {
        "adcode": "440606",
        "padcode": "440600",
        "name": "顺德区",
        "value": 1
    }, {"adcode": "440607", "padcode": "440600", "name": "三水区", "value": 1}, {
        "adcode": "440608",
        "padcode": "440600",
        "name": "高明区",
        "value": 1
    }, {"adcode": "440703", "padcode": "440700", "name": "蓬江区", "value": 1}, {
        "adcode": "440704",
        "padcode": "440700",
        "name": "江海区",
        "value": 1
    }, {"adcode": "440705", "padcode": "440700", "name": "新会区", "value": 1}, {
        "adcode": "440781",
        "padcode": "440700",
        "name": "台山市",
        "value": 1
    }, {"adcode": "440783", "padcode": "440700", "name": "开平市", "value": 1}, {
        "adcode": "440784",
        "padcode": "440700",
        "name": "鹤山市",
        "value": 1
    }, {"adcode": "440785", "padcode": "440700", "name": "恩平市", "value": 1}, {
        "adcode": "440802",
        "padcode": "440800",
        "name": "赤坎区",
        "value": 1
    }, {"adcode": "440803", "padcode": "440800", "name": "霞山区", "value": 1}, {
        "adcode": "440804",
        "padcode": "440800",
        "name": "坡头区",
        "value": 1
    }, {"adcode": "440811", "padcode": "440800", "name": "麻章区", "value": 1}, {
        "adcode": "440823",
        "padcode": "440800",
        "name": "遂溪县",
        "value": 1
    }, {"adcode": "440825", "padcode": "440800", "name": "徐闻县", "value": 1}, {
        "adcode": "440881",
        "padcode": "440800",
        "name": "廉江市",
        "value": 1
    }, {"adcode": "440882", "padcode": "440800", "name": "雷州市", "value": 1}, {
        "adcode": "440883",
        "padcode": "440800",
        "name": "吴川市",
        "value": 1
    }, {"adcode": "440902", "padcode": "440900", "name": "茂南区", "value": 1}, {
        "adcode": "440904",
        "padcode": "440900",
        "name": "电白区",
        "value": 1
    }, {"adcode": "440981", "padcode": "440900", "name": "高州市", "value": 1}, {
        "adcode": "440982",
        "padcode": "440900",
        "name": "化州市",
        "value": 1
    }, {"adcode": "440983", "padcode": "440900", "name": "信宜市", "value": 1}, {
        "adcode": "441202",
        "padcode": "441200",
        "name": "端州区",
        "value": 1
    }, {"adcode": "441203", "padcode": "441200", "name": "鼎湖区", "value": 1}, {
        "adcode": "441204",
        "padcode": "441200",
        "name": "高要区",
        "value": 1
    }, {"adcode": "441223", "padcode": "441200", "name": "广宁县", "value": 1}, {
        "adcode": "441224",
        "padcode": "441200",
        "name": "怀集县",
        "value": 1
    }, {"adcode": "441225", "padcode": "441200", "name": "封开县", "value": 1}, {
        "adcode": "441226",
        "padcode": "441200",
        "name": "德庆县",
        "value": 1
    }, {"adcode": "441284", "padcode": "441200", "name": "四会市", "value": 1}, {
        "adcode": "441302",
        "padcode": "441300",
        "name": "惠城区",
        "value": 1
    }, {"adcode": "441303", "padcode": "441300", "name": "惠阳区", "value": 1}, {
        "adcode": "441322",
        "padcode": "441300",
        "name": "博罗县",
        "value": 1
    }, {"adcode": "441323", "padcode": "441300", "name": "惠东县", "value": 1}, {
        "adcode": "441324",
        "padcode": "441300",
        "name": "龙门县",
        "value": 1
    }, {"adcode": "441402", "padcode": "441400", "name": "梅江区", "value": 1}, {
        "adcode": "441403",
        "padcode": "441400",
        "name": "梅县区",
        "value": 1
    }, {"adcode": "441422", "padcode": "441400", "name": "大埔县", "value": 1}, {
        "adcode": "441423",
        "padcode": "441400",
        "name": "丰顺县",
        "value": 1
    }, {"adcode": "441424", "padcode": "441400", "name": "五华县", "value": 1}, {
        "adcode": "441426",
        "padcode": "441400",
        "name": "平远县",
        "value": 1
    }, {"adcode": "441427", "padcode": "441400", "name": "蕉岭县", "value": 1}, {
        "adcode": "441481",
        "padcode": "441400",
        "name": "兴宁市",
        "value": 1
    }, {"adcode": "441502", "padcode": "441500", "name": "城区", "value": 5}, {
        "adcode": "441521",
        "padcode": "441500",
        "name": "海丰县",
        "value": 1
    }, {"adcode": "441523", "padcode": "441500", "name": "陆河县", "value": 1}, {
        "adcode": "441581",
        "padcode": "441500",
        "name": "陆丰市",
        "value": 1
    }, {"adcode": "441602", "padcode": "441600", "name": "源城区", "value": 1}, {
        "adcode": "441621",
        "padcode": "441600",
        "name": "紫金县",
        "value": 1
    }, {"adcode": "441622", "padcode": "441600", "name": "龙川县", "value": 1}, {
        "adcode": "441623",
        "padcode": "441600",
        "name": "连平县",
        "value": 1
    }, {"adcode": "441624", "padcode": "441600", "name": "和平县", "value": 1}, {
        "adcode": "441625",
        "padcode": "441600",
        "name": "东源县",
        "value": 1
    }, {"adcode": "441702", "padcode": "441700", "name": "江城区", "value": 1}, {
        "adcode": "441704",
        "padcode": "441700",
        "name": "阳东区",
        "value": 1
    }, {"adcode": "441721", "padcode": "441700", "name": "阳西县", "value": 1}, {
        "adcode": "441781",
        "padcode": "441700",
        "name": "阳春市",
        "value": 1
    }, {"adcode": "441802", "padcode": "441800", "name": "清城区", "value": 1}, {
        "adcode": "441803",
        "padcode": "441800",
        "name": "清新区",
        "value": 1
    }, {"adcode": "441821", "padcode": "441800", "name": "佛冈县", "value": 1}, {
        "adcode": "441823",
        "padcode": "441800",
        "name": "阳山县",
        "value": 1
    }, {"adcode": "441825", "padcode": "441800", "name": "连山壮族瑶族自治县", "value": 1}, {
        "adcode": "441826",
        "padcode": "441800",
        "name": "连南瑶族自治县",
        "value": 1
    }, {"adcode": "441881", "padcode": "441800", "name": "英德市", "value": 1}, {
        "adcode": "441882",
        "padcode": "441800",
        "name": "连州市",
        "value": 1
    }, {"adcode": "445102", "padcode": "445100", "name": "湘桥区", "value": 1}, {
        "adcode": "445103",
        "padcode": "445100",
        "name": "潮安区",
        "value": 1
    }, {"adcode": "445122", "padcode": "445100", "name": "饶平县", "value": 1}, {
        "adcode": "445202",
        "padcode": "445200",
        "name": "榕城区",
        "value": 1
    }, {"adcode": "445203", "padcode": "445200", "name": "揭东区", "value": 1}, {
        "adcode": "445222",
        "padcode": "445200",
        "name": "揭西县",
        "value": 1
    }, {"adcode": "445224", "padcode": "445200", "name": "惠来县", "value": 1}, {
        "adcode": "445281",
        "padcode": "445200",
        "name": "普宁市",
        "value": 1
    }, {"adcode": "445302", "padcode": "445300", "name": "云城区", "value": 1}, {
        "adcode": "445303",
        "padcode": "445300",
        "name": "云安区",
        "value": 1
    }, {"adcode": "445321", "padcode": "445300", "name": "新兴县", "value": 1}, {
        "adcode": "445322",
        "padcode": "445300",
        "name": "郁南县",
        "value": 1
    }, {"adcode": "445381", "padcode": "445300", "name": "罗定市", "value": 1}, {
        "adcode": "450102",
        "padcode": "450100",
        "name": "兴宁区",
        "value": 1
    }, {"adcode": "450103", "padcode": "450100", "name": "青秀区", "value": 1}, {
        "adcode": "450105",
        "padcode": "450100",
        "name": "江南区",
        "value": 1
    }, {"adcode": "450107", "padcode": "450100", "name": "西乡塘区", "value": 1}, {
        "adcode": "450108",
        "padcode": "450100",
        "name": "良庆区",
        "value": 1
    }, {"adcode": "450109", "padcode": "450100", "name": "邕宁区", "value": 1}, {
        "adcode": "450110",
        "padcode": "450100",
        "name": "武鸣区",
        "value": 1
    }, {"adcode": "450123", "padcode": "450100", "name": "隆安县", "value": 1}, {
        "adcode": "450124",
        "padcode": "450100",
        "name": "马山县",
        "value": 1
    }, {"adcode": "450125", "padcode": "450100", "name": "上林县", "value": 1}, {
        "adcode": "450126",
        "padcode": "450100",
        "name": "宾阳县",
        "value": 1
    }, {"adcode": "450127", "padcode": "450100", "name": "横县", "value": 1}, {
        "adcode": "450202",
        "padcode": "450200",
        "name": "城中区",
        "value": 2
    }, {"adcode": "450203", "padcode": "450200", "name": "鱼峰区", "value": 1}, {
        "adcode": "450204",
        "padcode": "450200",
        "name": "柳南区",
        "value": 1
    }, {"adcode": "450205", "padcode": "450200", "name": "柳北区", "value": 1}, {
        "adcode": "450206",
        "padcode": "450200",
        "name": "柳江区",
        "value": 1
    }, {"adcode": "450222", "padcode": "450200", "name": "柳城县", "value": 1}, {
        "adcode": "450223",
        "padcode": "450200",
        "name": "鹿寨县",
        "value": 1
    }, {"adcode": "450224", "padcode": "450200", "name": "融安县", "value": 1}, {
        "adcode": "450225",
        "padcode": "450200",
        "name": "融水苗族自治县",
        "value": 1
    }, {"adcode": "450226", "padcode": "450200", "name": "三江侗族自治县", "value": 1}, {
        "adcode": "450302",
        "padcode": "450300",
        "name": "秀峰区",
        "value": 1
    }, {"adcode": "450303", "padcode": "450300", "name": "叠彩区", "value": 1}, {
        "adcode": "450304",
        "padcode": "450300",
        "name": "象山区",
        "value": 1
    }, {"adcode": "450305", "padcode": "450300", "name": "七星区", "value": 1}, {
        "adcode": "450311",
        "padcode": "450300",
        "name": "雁山区",
        "value": 1
    }, {"adcode": "450312", "padcode": "450300", "name": "临桂区", "value": 1}, {
        "adcode": "450321",
        "padcode": "450300",
        "name": "阳朔县",
        "value": 1
    }, {"adcode": "450323", "padcode": "450300", "name": "灵川县", "value": 1}, {
        "adcode": "450324",
        "padcode": "450300",
        "name": "全州县",
        "value": 1
    }, {"adcode": "450325", "padcode": "450300", "name": "兴安县", "value": 1}, {
        "adcode": "450326",
        "padcode": "450300",
        "name": "永福县",
        "value": 1
    }, {"adcode": "450327", "padcode": "450300", "name": "灌阳县", "value": 1}, {
        "adcode": "450328",
        "padcode": "450300",
        "name": "龙胜各族自治县",
        "value": 1
    }, {"adcode": "450329", "padcode": "450300", "name": "资源县", "value": 1}, {
        "adcode": "450330",
        "padcode": "450300",
        "name": "平乐县",
        "value": 1
    }, {"adcode": "450331", "padcode": "450300", "name": "荔浦县", "value": 1}, {
        "adcode": "450332",
        "padcode": "450300",
        "name": "恭城瑶族自治县",
        "value": 1
    }, {"adcode": "450403", "padcode": "450400", "name": "万秀区", "value": 1}, {
        "adcode": "450405",
        "padcode": "450400",
        "name": "长洲区",
        "value": 1
    }, {"adcode": "450406", "padcode": "450400", "name": "龙圩区", "value": 1}, {
        "adcode": "450421",
        "padcode": "450400",
        "name": "苍梧县",
        "value": 1
    }, {"adcode": "450422", "padcode": "450400", "name": "藤县", "value": 1}, {
        "adcode": "450423",
        "padcode": "450400",
        "name": "蒙山县",
        "value": 1
    }, {"adcode": "450481", "padcode": "450400", "name": "岑溪市", "value": 1}, {
        "adcode": "450502",
        "padcode": "450500",
        "name": "海城区",
        "value": 1
    }, {"adcode": "450503", "padcode": "450500", "name": "银海区", "value": 1}, {
        "adcode": "450512",
        "padcode": "450500",
        "name": "铁山港区",
        "value": 1
    }, {"adcode": "450521", "padcode": "450500", "name": "合浦县", "value": 1}, {
        "adcode": "450602",
        "padcode": "450600",
        "name": "港口区",
        "value": 1
    }, {"adcode": "450603", "padcode": "450600", "name": "防城区", "value": 1}, {
        "adcode": "450621",
        "padcode": "450600",
        "name": "上思县",
        "value": 1
    }, {"adcode": "450681", "padcode": "450600", "name": "东兴市", "value": 1}, {
        "adcode": "450702",
        "padcode": "450700",
        "name": "钦南区",
        "value": 1
    }, {"adcode": "450703", "padcode": "450700", "name": "钦北区", "value": 1}, {
        "adcode": "450721",
        "padcode": "450700",
        "name": "灵山县",
        "value": 1
    }, {"adcode": "450722", "padcode": "450700", "name": "浦北县", "value": 1}, {
        "adcode": "450802",
        "padcode": "450800",
        "name": "港北区",
        "value": 1
    }, {"adcode": "450803", "padcode": "450800", "name": "港南区", "value": 1}, {
        "adcode": "450804",
        "padcode": "450800",
        "name": "覃塘区",
        "value": 1
    }, {"adcode": "450821", "padcode": "450800", "name": "平南县", "value": 1}, {
        "adcode": "450881",
        "padcode": "450800",
        "name": "桂平市",
        "value": 1
    }, {"adcode": "450902", "padcode": "450900", "name": "玉州区", "value": 1}, {
        "adcode": "450903",
        "padcode": "450900",
        "name": "福绵区",
        "value": 1
    }, {"adcode": "450921", "padcode": "450900", "name": "容县", "value": 1}, {
        "adcode": "450922",
        "padcode": "450900",
        "name": "陆川县",
        "value": 1
    }, {"adcode": "450923", "padcode": "450900", "name": "博白县", "value": 1}, {
        "adcode": "450924",
        "padcode": "450900",
        "name": "兴业县",
        "value": 1
    }, {"adcode": "450981", "padcode": "450900", "name": "北流市", "value": 1}, {
        "adcode": "451002",
        "padcode": "451000",
        "name": "右江区",
        "value": 1
    }, {"adcode": "451021", "padcode": "451000", "name": "田阳县", "value": 1}, {
        "adcode": "451022",
        "padcode": "451000",
        "name": "田东县",
        "value": 1
    }, {"adcode": "451023", "padcode": "451000", "name": "平果县", "value": 1}, {
        "adcode": "451024",
        "padcode": "451000",
        "name": "德保县",
        "value": 1
    }, {"adcode": "451026", "padcode": "451000", "name": "那坡县", "value": 1}, {
        "adcode": "451027",
        "padcode": "451000",
        "name": "凌云县",
        "value": 1
    }, {"adcode": "451028", "padcode": "451000", "name": "乐业县", "value": 1}, {
        "adcode": "451029",
        "padcode": "451000",
        "name": "田林县",
        "value": 1
    }, {"adcode": "451030", "padcode": "451000", "name": "西林县", "value": 1}, {
        "adcode": "451031",
        "padcode": "451000",
        "name": "隆林各族自治县",
        "value": 1
    }, {"adcode": "451081", "padcode": "451000", "name": "靖西市", "value": 1}, {
        "adcode": "451102",
        "padcode": "451100",
        "name": "八步区",
        "value": 1
    }, {"adcode": "451103", "padcode": "451100", "name": "平桂区", "value": 1}, {
        "adcode": "451121",
        "padcode": "451100",
        "name": "昭平县",
        "value": 1
    }, {"adcode": "451122", "padcode": "451100", "name": "钟山县", "value": 1}, {
        "adcode": "451123",
        "padcode": "451100",
        "name": "富川瑶族自治县",
        "value": 1
    }, {"adcode": "451202", "padcode": "451200", "name": "金城江区", "value": 1}, {
        "adcode": "451203",
        "padcode": "451200",
        "name": "宜州区",
        "value": 1
    }, {"adcode": "451221", "padcode": "451200", "name": "南丹县", "value": 1}, {
        "adcode": "451222",
        "padcode": "451200",
        "name": "天峨县",
        "value": 1
    }, {"adcode": "451223", "padcode": "451200", "name": "凤山县", "value": 1}, {
        "adcode": "451224",
        "padcode": "451200",
        "name": "东兰县",
        "value": 1
    }, {"adcode": "451225", "padcode": "451200", "name": "罗城仫佬族自治县", "value": 1}, {
        "adcode": "451226",
        "padcode": "451200",
        "name": "环江毛南族自治县",
        "value": 1
    }, {"adcode": "451227", "padcode": "451200", "name": "巴马瑶族自治县", "value": 1}, {
        "adcode": "451228",
        "padcode": "451200",
        "name": "都安瑶族自治县",
        "value": 1
    }, {"adcode": "451229", "padcode": "451200", "name": "大化瑶族自治县", "value": 1}, {
        "adcode": "451302",
        "padcode": "451300",
        "name": "兴宾区",
        "value": 1
    }, {"adcode": "451321", "padcode": "451300", "name": "忻城县", "value": 1}, {
        "adcode": "451322",
        "padcode": "451300",
        "name": "象州县",
        "value": 1
    }, {"adcode": "451323", "padcode": "451300", "name": "武宣县", "value": 1}, {
        "adcode": "451324",
        "padcode": "451300",
        "name": "金秀瑶族自治县",
        "value": 1
    }, {"adcode": "451381", "padcode": "451300", "name": "合山市", "value": 1}, {
        "adcode": "451402",
        "padcode": "451400",
        "name": "江州区",
        "value": 1
    }, {"adcode": "451421", "padcode": "451400", "name": "扶绥县", "value": 1}, {
        "adcode": "451422",
        "padcode": "451400",
        "name": "宁明县",
        "value": 1
    }, {"adcode": "451423", "padcode": "451400", "name": "龙州县", "value": 1}, {
        "adcode": "451424",
        "padcode": "451400",
        "name": "大新县",
        "value": 1
    }, {"adcode": "451425", "padcode": "451400", "name": "天等县", "value": 1}, {
        "adcode": "451481",
        "padcode": "451400",
        "name": "凭祥市",
        "value": 1
    }, {"adcode": "460105", "padcode": "460100", "name": "秀英区", "value": 1}, {
        "adcode": "460106",
        "padcode": "460100",
        "name": "龙华区",
        "value": 2
    }, {"adcode": "460107", "padcode": "460100", "name": "琼山区", "value": 1}, {
        "adcode": "460108",
        "padcode": "460100",
        "name": "美兰区",
        "value": 1
    }, {"adcode": "460202", "padcode": "460200", "name": "海棠区", "value": 1}, {
        "adcode": "460203",
        "padcode": "460200",
        "name": "吉阳区",
        "value": 1
    }, {"adcode": "460204", "padcode": "460200", "name": "天涯区", "value": 1}, {
        "adcode": "460205",
        "padcode": "460200",
        "name": "崖州区",
        "value": 1
    }, {"adcode": "469001", "padcode": "460400", "name": "五指山市", "value": 1}, {
        "adcode": "469002",
        "padcode": "460400",
        "name": "琼海市",
        "value": 1
    }, {"adcode": "469005", "padcode": "460400", "name": "文昌市", "value": 1}, {
        "adcode": "469006",
        "padcode": "460400",
        "name": "万宁市",
        "value": 1
    }, {"adcode": "469007", "padcode": "460400", "name": "东方市", "value": 1}, {
        "adcode": "469021",
        "padcode": "460400",
        "name": "定安县",
        "value": 1
    }, {"adcode": "469022", "padcode": "460400", "name": "屯昌县", "value": 1}, {
        "adcode": "469023",
        "padcode": "460400",
        "name": "澄迈县",
        "value": 1
    }, {"adcode": "469024", "padcode": "460400", "name": "临高县", "value": 1}, {
        "adcode": "500101",
        "padcode": "500000",
        "name": "万州区",
        "value": 1
    }, {"adcode": "500102", "padcode": "500000", "name": "涪陵区", "value": 1}, {
        "adcode": "500103",
        "padcode": "500000",
        "name": "渝中区",
        "value": 1
    }, {"adcode": "500104", "padcode": "500000", "name": "大渡口区", "value": 1}, {
        "adcode": "500105",
        "padcode": "500000",
        "name": "江北区",
        "value": 2
    }, {"adcode": "500106", "padcode": "500000", "name": "沙坪坝区", "value": 1}, {
        "adcode": "500107",
        "padcode": "500000",
        "name": "九龙坡区",
        "value": 1
    }, {"adcode": "500108", "padcode": "500000", "name": "南岸区", "value": 1}, {
        "adcode": "500109",
        "padcode": "500000",
        "name": "北碚区",
        "value": 1
    }, {"adcode": "500110", "padcode": "500000", "name": "綦江区", "value": 1}, {
        "adcode": "500111",
        "padcode": "500000",
        "name": "大足区",
        "value": 1
    }, {"adcode": "500112", "padcode": "500000", "name": "渝北区", "value": 1}, {
        "adcode": "500113",
        "padcode": "500000",
        "name": "巴南区",
        "value": 1
    }, {"adcode": "500114", "padcode": "500000", "name": "黔江区", "value": 1}, {
        "adcode": "500115",
        "padcode": "500000",
        "name": "长寿区",
        "value": 1
    }, {"adcode": "500116", "padcode": "500000", "name": "江津区", "value": 1}, {
        "adcode": "500117",
        "padcode": "500000",
        "name": "合川区",
        "value": 1
    }, {"adcode": "500118", "padcode": "500000", "name": "永川区", "value": 1}, {
        "adcode": "500119",
        "padcode": "500000",
        "name": "南川区",
        "value": 1
    }, {"adcode": "500120", "padcode": "500000", "name": "璧山区", "value": 1}, {
        "adcode": "500151",
        "padcode": "500000",
        "name": "铜梁区",
        "value": 1
    }, {"adcode": "500152", "padcode": "500000", "name": "潼南区", "value": 1}, {
        "adcode": "500153",
        "padcode": "500000",
        "name": "荣昌区",
        "value": 1
    }, {"adcode": "500154", "padcode": "500000", "name": "开州区", "value": 1}, {
        "adcode": "500155",
        "padcode": "500000",
        "name": "梁平区",
        "value": 1
    }, {"adcode": "500156", "padcode": "500000", "name": "武隆区", "value": 1}, {
        "adcode": "500229",
        "padcode": "500000",
        "name": "城口县",
        "value": 1
    }, {"adcode": "500230", "padcode": "500000", "name": "丰都县", "value": 1}, {
        "adcode": "500231",
        "padcode": "500000",
        "name": "垫江县",
        "value": 1
    }, {"adcode": "500233", "padcode": "500000", "name": "忠县", "value": 1}, {
        "adcode": "500235",
        "padcode": "500000",
        "name": "云阳县",
        "value": 1
    }, {"adcode": "500236", "padcode": "500000", "name": "奉节县", "value": 1}, {
        "adcode": "500237",
        "padcode": "500000",
        "name": "巫山县",
        "value": 1
    }, {"adcode": "500238", "padcode": "500000", "name": "巫溪县", "value": 1}, {
        "adcode": "500240",
        "padcode": "500000",
        "name": "石柱土家族自治县",
        "value": 1
    }, {"adcode": "500241", "padcode": "500000", "name": "秀山土家族苗族自治县", "value": 1}, {
        "adcode": "500242",
        "padcode": "500000",
        "name": "酉阳土家族苗族自治县",
        "value": 1
    }, {"adcode": "500243", "padcode": "500000", "name": "彭水苗族土家族自治县", "value": 1}, {
        "adcode": "510104",
        "padcode": "510100",
        "name": "锦江区",
        "value": 1
    }, {"adcode": "510105", "padcode": "510100", "name": "青羊区", "value": 1}, {
        "adcode": "510106",
        "padcode": "510100",
        "name": "金牛区",
        "value": 1
    }, {"adcode": "510107", "padcode": "510100", "name": "武侯区", "value": 1}, {
        "adcode": "510108",
        "padcode": "510100",
        "name": "成华区",
        "value": 1
    }, {"adcode": "510112", "padcode": "510100", "name": "龙泉驿区", "value": 1}, {
        "adcode": "510113",
        "padcode": "510100",
        "name": "青白江区",
        "value": 1
    }, {"adcode": "510114", "padcode": "510100", "name": "新都区", "value": 1}, {
        "adcode": "510115",
        "padcode": "510100",
        "name": "温江区",
        "value": 1
    }, {"adcode": "510116", "padcode": "510100", "name": "双流区", "value": 1}, {
        "adcode": "510117",
        "padcode": "510100",
        "name": "郫都区",
        "value": 1
    }, {"adcode": "510121", "padcode": "510100", "name": "金堂县", "value": 1}, {
        "adcode": "510129",
        "padcode": "510100",
        "name": "大邑县",
        "value": 1
    }, {"adcode": "510131", "padcode": "510100", "name": "蒲江县", "value": 1}, {
        "adcode": "510132",
        "padcode": "510100",
        "name": "新津县",
        "value": 1
    }, {"adcode": "510181", "padcode": "510100", "name": "都江堰市", "value": 1}, {
        "adcode": "510182",
        "padcode": "510100",
        "name": "彭州市",
        "value": 1
    }, {"adcode": "510183", "padcode": "510100", "name": "邛崃市", "value": 1}, {
        "adcode": "510184",
        "padcode": "510100",
        "name": "崇州市",
        "value": 1
    }, {"adcode": "510185", "padcode": "510100", "name": "简阳市", "value": 1}, {
        "adcode": "510302",
        "padcode": "510300",
        "name": "自流井区",
        "value": 1
    }, {"adcode": "510303", "padcode": "510300", "name": "贡井区", "value": 1}, {
        "adcode": "510304",
        "padcode": "510300",
        "name": "大安区",
        "value": 1
    }, {"adcode": "510311", "padcode": "510300", "name": "沿滩区", "value": 1}, {
        "adcode": "510321",
        "padcode": "510300",
        "name": "荣县",
        "value": 1
    }, {"adcode": "510322", "padcode": "510300", "name": "富顺县", "value": 1}, {
        "adcode": "510402",
        "padcode": "510400",
        "name": "东区",
        "value": 1
    }, {"adcode": "510403", "padcode": "510400", "name": "西区", "value": 1}, {
        "adcode": "510411",
        "padcode": "510400",
        "name": "仁和区",
        "value": 1
    }, {"adcode": "510421", "padcode": "510400", "name": "米易县", "value": 1}, {
        "adcode": "510422",
        "padcode": "510400",
        "name": "盐边县",
        "value": 1
    }, {"adcode": "510502", "padcode": "510500", "name": "江阳区", "value": 1}, {
        "adcode": "510503",
        "padcode": "510500",
        "name": "纳溪区",
        "value": 1
    }, {"adcode": "510504", "padcode": "510500", "name": "龙马潭区", "value": 1}, {
        "adcode": "510521",
        "padcode": "510500",
        "name": "泸县",
        "value": 1
    }, {"adcode": "510522", "padcode": "510500", "name": "合江县", "value": 1}, {
        "adcode": "510524",
        "padcode": "510500",
        "name": "叙永县",
        "value": 1
    }, {"adcode": "510525", "padcode": "510500", "name": "古蔺县", "value": 1}, {
        "adcode": "510603",
        "padcode": "510600",
        "name": "旌阳区",
        "value": 1
    }, {"adcode": "510604", "padcode": "510600", "name": "罗江区", "value": 1}, {
        "adcode": "510623",
        "padcode": "510600",
        "name": "中江县",
        "value": 1
    }, {"adcode": "510681", "padcode": "510600", "name": "广汉市", "value": 1}, {
        "adcode": "510682",
        "padcode": "510600",
        "name": "什邡市",
        "value": 1
    }, {"adcode": "510683", "padcode": "510600", "name": "绵竹市", "value": 1}, {
        "adcode": "510703",
        "padcode": "510700",
        "name": "涪城区",
        "value": 1
    }, {"adcode": "510704", "padcode": "510700", "name": "游仙区", "value": 1}, {
        "adcode": "510705",
        "padcode": "510700",
        "name": "安州区",
        "value": 1
    }, {"adcode": "510722", "padcode": "510700", "name": "三台县", "value": 1}, {
        "adcode": "510723",
        "padcode": "510700",
        "name": "盐亭县",
        "value": 1
    }, {"adcode": "510725", "padcode": "510700", "name": "梓潼县", "value": 1}, {
        "adcode": "510726",
        "padcode": "510700",
        "name": "北川羌族自治县",
        "value": 1
    }, {"adcode": "510727", "padcode": "510700", "name": "平武县", "value": 1}, {
        "adcode": "510781",
        "padcode": "510700",
        "name": "江油市",
        "value": 1
    }, {"adcode": "510802", "padcode": "510800", "name": "利州区", "value": 1}, {
        "adcode": "510811",
        "padcode": "510800",
        "name": "昭化区",
        "value": 1
    }, {"adcode": "510812", "padcode": "510800", "name": "朝天区", "value": 1}, {
        "adcode": "510821",
        "padcode": "510800",
        "name": "旺苍县",
        "value": 1
    }, {"adcode": "510822", "padcode": "510800", "name": "青川县", "value": 1}, {
        "adcode": "510823",
        "padcode": "510800",
        "name": "剑阁县",
        "value": 1
    }, {"adcode": "510824", "padcode": "510800", "name": "苍溪县", "value": 1}, {
        "adcode": "510903",
        "padcode": "510900",
        "name": "船山区",
        "value": 1
    }, {"adcode": "510904", "padcode": "510900", "name": "安居区", "value": 1}, {
        "adcode": "510921",
        "padcode": "510900",
        "name": "蓬溪县",
        "value": 1
    }, {"adcode": "510922", "padcode": "510900", "name": "射洪县", "value": 1}, {
        "adcode": "510923",
        "padcode": "510900",
        "name": "大英县",
        "value": 1
    }, {"adcode": "511002", "padcode": "511000", "name": "市中区", "value": 4}, {
        "adcode": "511011",
        "padcode": "511000",
        "name": "东兴区",
        "value": 1
    }, {"adcode": "511024", "padcode": "511000", "name": "威远县", "value": 1}, {
        "adcode": "511025",
        "padcode": "511000",
        "name": "资中县",
        "value": 1
    }, {"adcode": "511083", "padcode": "511000", "name": "隆昌市", "value": 1}, {
        "adcode": "511102",
        "padcode": "511100",
        "name": "市中区",
        "value": 4
    }, {"adcode": "511111", "padcode": "511100", "name": "沙湾区", "value": 1}, {
        "adcode": "511112",
        "padcode": "511100",
        "name": "五通桥区",
        "value": 1
    }, {"adcode": "511113", "padcode": "511100", "name": "金口河区", "value": 1}, {
        "adcode": "511123",
        "padcode": "511100",
        "name": "犍为县",
        "value": 1
    }, {"adcode": "511124", "padcode": "511100", "name": "井研县", "value": 1}, {
        "adcode": "511126",
        "padcode": "511100",
        "name": "夹江县",
        "value": 1
    }, {"adcode": "511129", "padcode": "511100", "name": "沐川县", "value": 1}, {
        "adcode": "511132",
        "padcode": "511100",
        "name": "峨边彝族自治县",
        "value": 1
    }, {"adcode": "511133", "padcode": "511100", "name": "马边彝族自治县", "value": 1}, {
        "adcode": "511181",
        "padcode": "511100",
        "name": "峨眉山市",
        "value": 1
    }, {"adcode": "511302", "padcode": "511300", "name": "顺庆区", "value": 1}, {
        "adcode": "511303",
        "padcode": "511300",
        "name": "高坪区",
        "value": 1
    }, {"adcode": "511304", "padcode": "511300", "name": "嘉陵区", "value": 1}, {
        "adcode": "511321",
        "padcode": "511300",
        "name": "南部县",
        "value": 1
    }, {"adcode": "511322", "padcode": "511300", "name": "营山县", "value": 1}, {
        "adcode": "511323",
        "padcode": "511300",
        "name": "蓬安县",
        "value": 1
    }, {"adcode": "511324", "padcode": "511300", "name": "仪陇县", "value": 1}, {
        "adcode": "511325",
        "padcode": "511300",
        "name": "西充县",
        "value": 1
    }, {"adcode": "511381", "padcode": "511300", "name": "阆中市", "value": 1}, {
        "adcode": "511402",
        "padcode": "511400",
        "name": "东坡区",
        "value": 1
    }, {"adcode": "511403", "padcode": "511400", "name": "彭山区", "value": 1}, {
        "adcode": "511421",
        "padcode": "511400",
        "name": "仁寿县",
        "value": 1
    }, {"adcode": "511423", "padcode": "511400", "name": "洪雅县", "value": 1}, {
        "adcode": "511424",
        "padcode": "511400",
        "name": "丹棱县",
        "value": 1
    }, {"adcode": "511425", "padcode": "511400", "name": "青神县", "value": 1}, {
        "adcode": "511502",
        "padcode": "511500",
        "name": "翠屏区",
        "value": 1
    }, {"adcode": "511503", "padcode": "511500", "name": "南溪区", "value": 1}, {
        "adcode": "511521",
        "padcode": "511500",
        "name": "宜宾县",
        "value": 1
    }, {"adcode": "511523", "padcode": "511500", "name": "江安县", "value": 1}, {
        "adcode": "511524",
        "padcode": "511500",
        "name": "长宁县",
        "value": 1
    }, {"adcode": "511525", "padcode": "511500", "name": "高县", "value": 1}, {
        "adcode": "511526",
        "padcode": "511500",
        "name": "珙县",
        "value": 1
    }, {"adcode": "511527", "padcode": "511500", "name": "筠连县", "value": 1}, {
        "adcode": "511528",
        "padcode": "511500",
        "name": "兴文县",
        "value": 1
    }, {"adcode": "511529", "padcode": "511500", "name": "屏山县", "value": 1}, {
        "adcode": "511602",
        "padcode": "511600",
        "name": "广安区",
        "value": 1
    }, {"adcode": "511603", "padcode": "511600", "name": "前锋区", "value": 1}, {
        "adcode": "511621",
        "padcode": "511600",
        "name": "岳池县",
        "value": 1
    }, {"adcode": "511622", "padcode": "511600", "name": "武胜县", "value": 1}, {
        "adcode": "511623",
        "padcode": "511600",
        "name": "邻水县",
        "value": 1
    }, {"adcode": "511681", "padcode": "511600", "name": "华蓥市", "value": 1}, {
        "adcode": "511702",
        "padcode": "511700",
        "name": "通川区",
        "value": 1
    }, {"adcode": "511703", "padcode": "511700", "name": "达川区", "value": 1}, {
        "adcode": "511722",
        "padcode": "511700",
        "name": "宣汉县",
        "value": 1
    }, {"adcode": "511723", "padcode": "511700", "name": "开江县", "value": 1}, {
        "adcode": "511724",
        "padcode": "511700",
        "name": "大竹县",
        "value": 1
    }, {"adcode": "511725", "padcode": "511700", "name": "渠县", "value": 1}, {
        "adcode": "511781",
        "padcode": "511700",
        "name": "万源市",
        "value": 1
    }, {"adcode": "511802", "padcode": "511800", "name": "雨城区", "value": 1}, {
        "adcode": "511803",
        "padcode": "511800",
        "name": "名山区",
        "value": 1
    }, {"adcode": "511822", "padcode": "511800", "name": "荥经县", "value": 1}, {
        "adcode": "511823",
        "padcode": "511800",
        "name": "汉源县",
        "value": 1
    }, {"adcode": "511824", "padcode": "511800", "name": "石棉县", "value": 1}, {
        "adcode": "511825",
        "padcode": "511800",
        "name": "天全县",
        "value": 1
    }, {"adcode": "511826", "padcode": "511800", "name": "芦山县", "value": 1}, {
        "adcode": "511827",
        "padcode": "511800",
        "name": "宝兴县",
        "value": 1
    }, {"adcode": "511902", "padcode": "511900", "name": "巴州区", "value": 1}, {
        "adcode": "511903",
        "padcode": "511900",
        "name": "恩阳区",
        "value": 1
    }, {"adcode": "511921", "padcode": "511900", "name": "通江县", "value": 1}, {
        "adcode": "511922",
        "padcode": "511900",
        "name": "南江县",
        "value": 1
    }, {"adcode": "511923", "padcode": "511900", "name": "平昌县", "value": 1}, {
        "adcode": "512002",
        "padcode": "512000",
        "name": "雁江区",
        "value": 1
    }, {"adcode": "512021", "padcode": "512000", "name": "安岳县", "value": 1}, {
        "adcode": "512022",
        "padcode": "512000",
        "name": "乐至县",
        "value": 1
    }, {"adcode": "513201", "padcode": "513200", "name": "马尔康市", "value": 1}, {
        "adcode": "513221",
        "padcode": "513200",
        "name": "汶川县",
        "value": 1
    }, {"adcode": "513222", "padcode": "513200", "name": "理县", "value": 1}, {
        "adcode": "513223",
        "padcode": "513200",
        "name": "茂县",
        "value": 1
    }, {"adcode": "513224", "padcode": "513200", "name": "松潘县", "value": 1}, {
        "adcode": "513225",
        "padcode": "513200",
        "name": "九寨沟县",
        "value": 1
    }, {"adcode": "513226", "padcode": "513200", "name": "金川县", "value": 1}, {
        "adcode": "513227",
        "padcode": "513200",
        "name": "小金县",
        "value": 1
    }, {"adcode": "513228", "padcode": "513200", "name": "黑水县", "value": 1}, {
        "adcode": "513230",
        "padcode": "513200",
        "name": "壤塘县",
        "value": 1
    }, {"adcode": "513231", "padcode": "513200", "name": "阿坝县", "value": 1}, {
        "adcode": "513232",
        "padcode": "513200",
        "name": "若尔盖县",
        "value": 1
    }, {"adcode": "513233", "padcode": "513200", "name": "红原县", "value": 1}, {
        "adcode": "513301",
        "padcode": "513300",
        "name": "康定市",
        "value": 1
    }, {"adcode": "513322", "padcode": "513300", "name": "泸定县", "value": 1}, {
        "adcode": "513323",
        "padcode": "513300",
        "name": "丹巴县",
        "value": 1
    }, {"adcode": "513324", "padcode": "513300", "name": "九龙县", "value": 1}, {
        "adcode": "513325",
        "padcode": "513300",
        "name": "雅江县",
        "value": 1
    }, {"adcode": "513326", "padcode": "513300", "name": "道孚县", "value": 1}, {
        "adcode": "513327",
        "padcode": "513300",
        "name": "炉霍县",
        "value": 1
    }, {"adcode": "513328", "padcode": "513300", "name": "甘孜县", "value": 1}, {
        "adcode": "513329",
        "padcode": "513300",
        "name": "新龙县",
        "value": 1
    }, {"adcode": "513330", "padcode": "513300", "name": "德格县", "value": 1}, {
        "adcode": "513331",
        "padcode": "513300",
        "name": "白玉县",
        "value": 1
    }, {"adcode": "513332", "padcode": "513300", "name": "石渠县", "value": 1}, {
        "adcode": "513333",
        "padcode": "513300",
        "name": "色达县",
        "value": 1
    }, {"adcode": "513334", "padcode": "513300", "name": "理塘县", "value": 1}, {
        "adcode": "513335",
        "padcode": "513300",
        "name": "巴塘县",
        "value": 1
    }, {"adcode": "513336", "padcode": "513300", "name": "乡城县", "value": 1}, {
        "adcode": "513337",
        "padcode": "513300",
        "name": "稻城县",
        "value": 1
    }, {"adcode": "513338", "padcode": "513300", "name": "得荣县", "value": 1}, {
        "adcode": "513401",
        "padcode": "513400",
        "name": "西昌市",
        "value": 1
    }, {"adcode": "513422", "padcode": "513400", "name": "木里藏族自治县", "value": 1}, {
        "adcode": "513423",
        "padcode": "513400",
        "name": "盐源县",
        "value": 1
    }, {"adcode": "513424", "padcode": "513400", "name": "德昌县", "value": 1}, {
        "adcode": "513425",
        "padcode": "513400",
        "name": "会理县",
        "value": 1
    }, {"adcode": "513426", "padcode": "513400", "name": "会东县", "value": 1}, {
        "adcode": "513427",
        "padcode": "513400",
        "name": "宁南县",
        "value": 1
    }, {"adcode": "513428", "padcode": "513400", "name": "普格县", "value": 1}, {
        "adcode": "513429",
        "padcode": "513400",
        "name": "布拖县",
        "value": 1
    }, {"adcode": "513430", "padcode": "513400", "name": "金阳县", "value": 1}, {
        "adcode": "513431",
        "padcode": "513400",
        "name": "昭觉县",
        "value": 1
    }, {"adcode": "513432", "padcode": "513400", "name": "喜德县", "value": 1}, {
        "adcode": "513433",
        "padcode": "513400",
        "name": "冕宁县",
        "value": 1
    }, {"adcode": "513434", "padcode": "513400", "name": "越西县", "value": 1}, {
        "adcode": "513435",
        "padcode": "513400",
        "name": "甘洛县",
        "value": 1
    }, {"adcode": "513436", "padcode": "513400", "name": "美姑县", "value": 1}, {
        "adcode": "513437",
        "padcode": "513400",
        "name": "雷波县",
        "value": 1
    }, {"adcode": "520102", "padcode": "520100", "name": "南明区", "value": 1}, {
        "adcode": "520103",
        "padcode": "520100",
        "name": "云岩区",
        "value": 1
    }, {"adcode": "520111", "padcode": "520100", "name": "花溪区", "value": 1}, {
        "adcode": "520112",
        "padcode": "520100",
        "name": "乌当区",
        "value": 1
    }, {"adcode": "520113", "padcode": "520100", "name": "白云区", "value": 2}, {
        "adcode": "520115",
        "padcode": "520100",
        "name": "观山湖区",
        "value": 1
    }, {"adcode": "520121", "padcode": "520100", "name": "开阳县", "value": 1}, {
        "adcode": "520122",
        "padcode": "520100",
        "name": "息烽县",
        "value": 1
    }, {"adcode": "520123", "padcode": "520100", "name": "修文县", "value": 1}, {
        "adcode": "520181",
        "padcode": "520100",
        "name": "清镇市",
        "value": 1
    }, {"adcode": "520201", "padcode": "520200", "name": "钟山区", "value": 1}, {
        "adcode": "520203",
        "padcode": "520200",
        "name": "六枝特区",
        "value": 1
    }, {"adcode": "520221", "padcode": "520200", "name": "水城县", "value": 1}, {
        "adcode": "520281",
        "padcode": "520200",
        "name": "盘州市",
        "value": 1
    }, {"adcode": "520302", "padcode": "520300", "name": "红花岗区", "value": 1}, {
        "adcode": "520303",
        "padcode": "520300",
        "name": "汇川区",
        "value": 1
    }, {"adcode": "520304", "padcode": "520300", "name": "播州区", "value": 1}, {
        "adcode": "520322",
        "padcode": "520300",
        "name": "桐梓县",
        "value": 1
    }, {"adcode": "520323", "padcode": "520300", "name": "绥阳县", "value": 1}, {
        "adcode": "520324",
        "padcode": "520300",
        "name": "正安县",
        "value": 1
    }, {"adcode": "520325", "padcode": "520300", "name": "道真仡佬族苗族自治县", "value": 1}, {
        "adcode": "520326",
        "padcode": "520300",
        "name": "务川仡佬族苗族自治县",
        "value": 1
    }, {"adcode": "520327", "padcode": "520300", "name": "凤冈县", "value": 1}, {
        "adcode": "520328",
        "padcode": "520300",
        "name": "湄潭县",
        "value": 1
    }, {"adcode": "520329", "padcode": "520300", "name": "余庆县", "value": 1}, {
        "adcode": "520330",
        "padcode": "520300",
        "name": "习水县",
        "value": 1
    }, {"adcode": "520381", "padcode": "520300", "name": "赤水市", "value": 1}, {
        "adcode": "520382",
        "padcode": "520300",
        "name": "仁怀市",
        "value": 1
    }, {"adcode": "520402", "padcode": "520400", "name": "西秀区", "value": 1}, {
        "adcode": "520403",
        "padcode": "520400",
        "name": "平坝区",
        "value": 1
    }, {"adcode": "520422", "padcode": "520400", "name": "普定县", "value": 1}, {
        "adcode": "520423",
        "padcode": "520400",
        "name": "镇宁布依族苗族自治县",
        "value": 1
    }, {"adcode": "520424", "padcode": "520400", "name": "关岭布依族苗族自治县", "value": 1}, {
        "adcode": "520425",
        "padcode": "520400",
        "name": "紫云苗族布依族自治县",
        "value": 1
    }, {"adcode": "520502", "padcode": "520500", "name": "七星关区", "value": 1}, {
        "adcode": "520521",
        "padcode": "520500",
        "name": "大方县",
        "value": 1
    }, {"adcode": "520522", "padcode": "520500", "name": "黔西县", "value": 1}, {
        "adcode": "520523",
        "padcode": "520500",
        "name": "金沙县",
        "value": 1
    }, {"adcode": "520524", "padcode": "520500", "name": "织金县", "value": 1}, {
        "adcode": "520525",
        "padcode": "520500",
        "name": "纳雍县",
        "value": 1
    }, {"adcode": "520526", "padcode": "520500", "name": "威宁彝族回族苗族自治县", "value": 1}, {
        "adcode": "520527",
        "padcode": "520500",
        "name": "赫章县",
        "value": 1
    }, {"adcode": "520602", "padcode": "520600", "name": "碧江区", "value": 1}, {
        "adcode": "520603",
        "padcode": "520600",
        "name": "万山区",
        "value": 1
    }, {"adcode": "520621", "padcode": "520600", "name": "江口县", "value": 1}, {
        "adcode": "520622",
        "padcode": "520600",
        "name": "玉屏侗族自治县",
        "value": 1
    }, {"adcode": "520623", "padcode": "520600", "name": "石阡县", "value": 1}, {
        "adcode": "520624",
        "padcode": "520600",
        "name": "思南县",
        "value": 1
    }, {"adcode": "520625", "padcode": "520600", "name": "印江土家族苗族自治县", "value": 1}, {
        "adcode": "520626",
        "padcode": "520600",
        "name": "德江县",
        "value": 1
    }, {"adcode": "520627", "padcode": "520600", "name": "沿河土家族自治县", "value": 1}, {
        "adcode": "520628",
        "padcode": "520600",
        "name": "松桃苗族自治县",
        "value": 1
    }, {"adcode": "522301", "padcode": "522300", "name": "兴义市", "value": 1}, {
        "adcode": "522322",
        "padcode": "522300",
        "name": "兴仁县",
        "value": 1
    }, {"adcode": "522323", "padcode": "522300", "name": "普安县", "value": 1}, {
        "adcode": "522324",
        "padcode": "522300",
        "name": "晴隆县",
        "value": 1
    }, {"adcode": "522325", "padcode": "522300", "name": "贞丰县", "value": 1}, {
        "adcode": "522326",
        "padcode": "522300",
        "name": "望谟县",
        "value": 1
    }, {"adcode": "522327", "padcode": "522300", "name": "册亨县", "value": 1}, {
        "adcode": "522328",
        "padcode": "522300",
        "name": "安龙县",
        "value": 1
    }, {"adcode": "522601", "padcode": "522600", "name": "凯里市", "value": 1}, {
        "adcode": "522622",
        "padcode": "522600",
        "name": "黄平县",
        "value": 1
    }, {"adcode": "522623", "padcode": "522600", "name": "施秉县", "value": 1}, {
        "adcode": "522624",
        "padcode": "522600",
        "name": "三穗县",
        "value": 1
    }, {"adcode": "522625", "padcode": "522600", "name": "镇远县", "value": 1}, {
        "adcode": "522626",
        "padcode": "522600",
        "name": "岑巩县",
        "value": 1
    }, {"adcode": "522627", "padcode": "522600", "name": "天柱县", "value": 1}, {
        "adcode": "522628",
        "padcode": "522600",
        "name": "锦屏县",
        "value": 1
    }, {"adcode": "522629", "padcode": "522600", "name": "剑河县", "value": 1}, {
        "adcode": "522630",
        "padcode": "522600",
        "name": "台江县",
        "value": 1
    }, {"adcode": "522631", "padcode": "522600", "name": "黎平县", "value": 1}, {
        "adcode": "522632",
        "padcode": "522600",
        "name": "榕江县",
        "value": 1
    }, {"adcode": "522633", "padcode": "522600", "name": "从江县", "value": 1}, {
        "adcode": "522634",
        "padcode": "522600",
        "name": "雷山县",
        "value": 1
    }, {"adcode": "522635", "padcode": "522600", "name": "麻江县", "value": 1}, {
        "adcode": "522636",
        "padcode": "522600",
        "name": "丹寨县",
        "value": 1
    }, {"adcode": "522701", "padcode": "522700", "name": "都匀市", "value": 1}, {
        "adcode": "522702",
        "padcode": "522700",
        "name": "福泉市",
        "value": 1
    }, {"adcode": "522722", "padcode": "522700", "name": "荔波县", "value": 1}, {
        "adcode": "522723",
        "padcode": "522700",
        "name": "贵定县",
        "value": 1
    }, {"adcode": "522725", "padcode": "522700", "name": "瓮安县", "value": 1}, {
        "adcode": "522726",
        "padcode": "522700",
        "name": "独山县",
        "value": 1
    }, {"adcode": "522727", "padcode": "522700", "name": "平塘县", "value": 1}, {
        "adcode": "522728",
        "padcode": "522700",
        "name": "罗甸县",
        "value": 1
    }, {"adcode": "522729", "padcode": "522700", "name": "长顺县", "value": 1}, {
        "adcode": "522730",
        "padcode": "522700",
        "name": "龙里县",
        "value": 1
    }, {"adcode": "522731", "padcode": "522700", "name": "惠水县", "value": 1}, {
        "adcode": "522732",
        "padcode": "522700",
        "name": "三都水族自治县",
        "value": 1
    }, {"adcode": "530102", "padcode": "530100", "name": "五华区", "value": 1}, {
        "adcode": "530103",
        "padcode": "530100",
        "name": "盘龙区",
        "value": 1
    }, {"adcode": "530111", "padcode": "530100", "name": "官渡区", "value": 1}, {
        "adcode": "530112",
        "padcode": "530100",
        "name": "西山区",
        "value": 1
    }, {"adcode": "530113", "padcode": "530100", "name": "东川区", "value": 1}, {
        "adcode": "530114",
        "padcode": "530100",
        "name": "呈贡区",
        "value": 1
    }, {"adcode": "530115", "padcode": "530100", "name": "晋宁区", "value": 1}, {
        "adcode": "530124",
        "padcode": "530100",
        "name": "富民县",
        "value": 1
    }, {"adcode": "530125", "padcode": "530100", "name": "宜良县", "value": 1}, {
        "adcode": "530126",
        "padcode": "530100",
        "name": "石林彝族自治县",
        "value": 1
    }, {"adcode": "530127", "padcode": "530100", "name": "嵩明县", "value": 1}, {
        "adcode": "530128",
        "padcode": "530100",
        "name": "禄劝彝族苗族自治县",
        "value": 1
    }, {"adcode": "530129", "padcode": "530100", "name": "寻甸回族彝族自治县", "value": 1}, {
        "adcode": "530181",
        "padcode": "530100",
        "name": "安宁市",
        "value": 1
    }, {"adcode": "530302", "padcode": "530300", "name": "麒麟区", "value": 1}, {
        "adcode": "530303",
        "padcode": "530300",
        "name": "沾益区",
        "value": 1
    }, {"adcode": "530321", "padcode": "530300", "name": "马龙县", "value": 1}, {
        "adcode": "530322",
        "padcode": "530300",
        "name": "陆良县",
        "value": 1
    }, {"adcode": "530323", "padcode": "530300", "name": "师宗县", "value": 1}, {
        "adcode": "530324",
        "padcode": "530300",
        "name": "罗平县",
        "value": 1
    }, {"adcode": "530325", "padcode": "530300", "name": "富源县", "value": 1}, {
        "adcode": "530326",
        "padcode": "530300",
        "name": "会泽县",
        "value": 1
    }, {"adcode": "530381", "padcode": "530300", "name": "宣威市", "value": 1}, {
        "adcode": "530402",
        "padcode": "530400",
        "name": "红塔区",
        "value": 1
    }, {"adcode": "530403", "padcode": "530400", "name": "江川区", "value": 1}, {
        "adcode": "530422",
        "padcode": "530400",
        "name": "澄江县",
        "value": 1
    }, {"adcode": "530423", "padcode": "530400", "name": "通海县", "value": 1}, {
        "adcode": "530424",
        "padcode": "530400",
        "name": "华宁县",
        "value": 1
    }, {"adcode": "530425", "padcode": "530400", "name": "易门县", "value": 1}, {
        "adcode": "530426",
        "padcode": "530400",
        "name": "峨山彝族自治县",
        "value": 1
    }, {"adcode": "530427", "padcode": "530400", "name": "新平彝族傣族自治县", "value": 1}, {
        "adcode": "530428",
        "padcode": "530400",
        "name": "元江哈尼族彝族傣族自治县",
        "value": 1
    }, {"adcode": "530502", "padcode": "530500", "name": "隆阳区", "value": 1}, {
        "adcode": "530521",
        "padcode": "530500",
        "name": "施甸县",
        "value": 1
    }, {"adcode": "530523", "padcode": "530500", "name": "龙陵县", "value": 1}, {
        "adcode": "530524",
        "padcode": "530500",
        "name": "昌宁县",
        "value": 1
    }, {"adcode": "530581", "padcode": "530500", "name": "腾冲市", "value": 1}, {
        "adcode": "530602",
        "padcode": "530600",
        "name": "昭阳区",
        "value": 1
    }, {"adcode": "530621", "padcode": "530600", "name": "鲁甸县", "value": 1}, {
        "adcode": "530622",
        "padcode": "530600",
        "name": "巧家县",
        "value": 1
    }, {"adcode": "530623", "padcode": "530600", "name": "盐津县", "value": 1}, {
        "adcode": "530624",
        "padcode": "530600",
        "name": "大关县",
        "value": 1
    }, {"adcode": "530625", "padcode": "530600", "name": "永善县", "value": 1}, {
        "adcode": "530626",
        "padcode": "530600",
        "name": "绥江县",
        "value": 1
    }, {"adcode": "530627", "padcode": "530600", "name": "镇雄县", "value": 1}, {
        "adcode": "530628",
        "padcode": "530600",
        "name": "彝良县",
        "value": 1
    }, {"adcode": "530629", "padcode": "530600", "name": "威信县", "value": 1}, {
        "adcode": "530630",
        "padcode": "530600",
        "name": "水富县",
        "value": 1
    }, {"adcode": "530702", "padcode": "530700", "name": "古城区", "value": 1}, {
        "adcode": "530721",
        "padcode": "530700",
        "name": "玉龙纳西族自治县",
        "value": 1
    }, {"adcode": "530722", "padcode": "530700", "name": "永胜县", "value": 1}, {
        "adcode": "530723",
        "padcode": "530700",
        "name": "华坪县",
        "value": 1
    }, {"adcode": "530724", "padcode": "530700", "name": "宁蒗彝族自治县", "value": 1}, {
        "adcode": "530802",
        "padcode": "530800",
        "name": "思茅区",
        "value": 1
    }, {"adcode": "530821", "padcode": "530800", "name": "宁洱哈尼族彝族自治县", "value": 1}, {
        "adcode": "530822",
        "padcode": "530800",
        "name": "墨江哈尼族自治县",
        "value": 1
    }, {"adcode": "530823", "padcode": "530800", "name": "景东彝族自治县", "value": 1}, {
        "adcode": "530824",
        "padcode": "530800",
        "name": "景谷傣族彝族自治县",
        "value": 1
    }, {"adcode": "530825", "padcode": "530800", "name": "镇沅彝族哈尼族拉祜族自治县", "value": 1}, {
        "adcode": "530826",
        "padcode": "530800",
        "name": "江城哈尼族彝族自治县",
        "value": 1
    }, {"adcode": "530827", "padcode": "530800", "name": "孟连傣族拉祜族佤族自治县", "value": 1}, {
        "adcode": "530828",
        "padcode": "530800",
        "name": "澜沧拉祜族自治县",
        "value": 1
    }, {"adcode": "530829", "padcode": "530800", "name": "西盟佤族自治县", "value": 1}, {
        "adcode": "530902",
        "padcode": "530900",
        "name": "临翔区",
        "value": 1
    }, {"adcode": "530921", "padcode": "530900", "name": "凤庆县", "value": 1}, {
        "adcode": "530922",
        "padcode": "530900",
        "name": "云县",
        "value": 1
    }, {"adcode": "530923", "padcode": "530900", "name": "永德县", "value": 1}, {
        "adcode": "530924",
        "padcode": "530900",
        "name": "镇康县",
        "value": 1
    }, {"adcode": "530925", "padcode": "530900", "name": "双江拉祜族佤族布朗族傣族自治县", "value": 1}, {
        "adcode": "530926",
        "padcode": "530900",
        "name": "耿马傣族佤族自治县",
        "value": 1
    }, {"adcode": "530927", "padcode": "530900", "name": "沧源佤族自治县", "value": 1}, {
        "adcode": "532301",
        "padcode": "532300",
        "name": "楚雄市",
        "value": 1
    }, {"adcode": "532322", "padcode": "532300", "name": "双柏县", "value": 1}, {
        "adcode": "532323",
        "padcode": "532300",
        "name": "牟定县",
        "value": 1
    }, {"adcode": "532324", "padcode": "532300", "name": "南华县", "value": 1}, {
        "adcode": "532325",
        "padcode": "532300",
        "name": "姚安县",
        "value": 1
    }, {"adcode": "532326", "padcode": "532300", "name": "大姚县", "value": 1}, {
        "adcode": "532327",
        "padcode": "532300",
        "name": "永仁县",
        "value": 1
    }, {"adcode": "532328", "padcode": "532300", "name": "元谋县", "value": 1}, {
        "adcode": "532329",
        "padcode": "532300",
        "name": "武定县",
        "value": 1
    }, {"adcode": "532331", "padcode": "532300", "name": "禄丰县", "value": 1}, {
        "adcode": "532501",
        "padcode": "532500",
        "name": "个旧市",
        "value": 1
    }, {"adcode": "532502", "padcode": "532500", "name": "开远市", "value": 1}, {
        "adcode": "532503",
        "padcode": "532500",
        "name": "蒙自市",
        "value": 1
    }, {"adcode": "532504", "padcode": "532500", "name": "弥勒市", "value": 1}, {
        "adcode": "532523",
        "padcode": "532500",
        "name": "屏边苗族自治县",
        "value": 1
    }, {"adcode": "532524", "padcode": "532500", "name": "建水县", "value": 1}, {
        "adcode": "532525",
        "padcode": "532500",
        "name": "石屏县",
        "value": 1
    }, {"adcode": "532527", "padcode": "532500", "name": "泸西县", "value": 1}, {
        "adcode": "532528",
        "padcode": "532500",
        "name": "元阳县",
        "value": 1
    }, {"adcode": "532529", "padcode": "532500", "name": "红河县", "value": 1}, {
        "adcode": "532530",
        "padcode": "532500",
        "name": "金平苗族瑶族傣族自治县",
        "value": 1
    }, {"adcode": "532531", "padcode": "532500", "name": "绿春县", "value": 1}, {
        "adcode": "532532",
        "padcode": "532500",
        "name": "河口瑶族自治县",
        "value": 1
    }, {"adcode": "532601", "padcode": "532600", "name": "文山市", "value": 1}, {
        "adcode": "532622",
        "padcode": "532600",
        "name": "砚山县",
        "value": 1
    }, {"adcode": "532623", "padcode": "532600", "name": "西畴县", "value": 1}, {
        "adcode": "532624",
        "padcode": "532600",
        "name": "麻栗坡县",
        "value": 1
    }, {"adcode": "532625", "padcode": "532600", "name": "马关县", "value": 1}, {
        "adcode": "532626",
        "padcode": "532600",
        "name": "丘北县",
        "value": 1
    }, {"adcode": "532627", "padcode": "532600", "name": "广南县", "value": 1}, {
        "adcode": "532628",
        "padcode": "532600",
        "name": "富宁县",
        "value": 1
    }, {"adcode": "532801", "padcode": "532800", "name": "景洪市", "value": 1}, {
        "adcode": "532822",
        "padcode": "532800",
        "name": "勐海县",
        "value": 1
    }, {"adcode": "532823", "padcode": "532800", "name": "勐腊县", "value": 1}, {
        "adcode": "532901",
        "padcode": "532900",
        "name": "大理市",
        "value": 1
    }, {"adcode": "532922", "padcode": "532900", "name": "漾濞彝族自治县", "value": 1}, {
        "adcode": "532923",
        "padcode": "532900",
        "name": "祥云县",
        "value": 1
    }, {"adcode": "532924", "padcode": "532900", "name": "宾川县", "value": 1}, {
        "adcode": "532925",
        "padcode": "532900",
        "name": "弥渡县",
        "value": 1
    }, {"adcode": "532926", "padcode": "532900", "name": "南涧彝族自治县", "value": 1}, {
        "adcode": "532927",
        "padcode": "532900",
        "name": "巍山彝族回族自治县",
        "value": 1
    }, {"adcode": "532928", "padcode": "532900", "name": "永平县", "value": 1}, {
        "adcode": "532929",
        "padcode": "532900",
        "name": "云龙县",
        "value": 1
    }, {"adcode": "532930", "padcode": "532900", "name": "洱源县", "value": 1}, {
        "adcode": "532931",
        "padcode": "532900",
        "name": "剑川县",
        "value": 1
    }, {"adcode": "532932", "padcode": "532900", "name": "鹤庆县", "value": 1}, {
        "adcode": "533102",
        "padcode": "533100",
        "name": "瑞丽市",
        "value": 1
    }, {"adcode": "533103", "padcode": "533100", "name": "芒市", "value": 1}, {
        "adcode": "533122",
        "padcode": "533100",
        "name": "梁河县",
        "value": 1
    }, {"adcode": "533123", "padcode": "533100", "name": "盈江县", "value": 1}, {
        "adcode": "533124",
        "padcode": "533100",
        "name": "陇川县",
        "value": 1
    }, {"adcode": "533301", "padcode": "533300", "name": "泸水市", "value": 1}, {
        "adcode": "533323",
        "padcode": "533300",
        "name": "福贡县",
        "value": 1
    }, {"adcode": "533324", "padcode": "533300", "name": "贡山独龙族怒族自治县", "value": 1}, {
        "adcode": "533325",
        "padcode": "533300",
        "name": "兰坪白族普米族自治县",
        "value": 1
    }, {"adcode": "533401", "padcode": "533400", "name": "香格里拉市", "value": 1}, {
        "adcode": "533422",
        "padcode": "533400",
        "name": "德钦县",
        "value": 1
    }, {"adcode": "533423", "padcode": "533400", "name": "维西傈僳族自治县", "value": 1}, {
        "adcode": "540102",
        "padcode": "540100",
        "name": "城关区",
        "value": 2
    }, {"adcode": "540103", "padcode": "540100", "name": "堆龙德庆区", "value": 1}, {
        "adcode": "540104",
        "padcode": "540100",
        "name": "达孜区",
        "value": 1
    }, {"adcode": "540121", "padcode": "540100", "name": "林周县", "value": 1}, {
        "adcode": "540122",
        "padcode": "540100",
        "name": "当雄县",
        "value": 1
    }, {"adcode": "540123", "padcode": "540100", "name": "尼木县", "value": 1}, {
        "adcode": "540124",
        "padcode": "540100",
        "name": "曲水县",
        "value": 1
    }, {"adcode": "540127", "padcode": "540100", "name": "墨竹工卡县", "value": 1}, {
        "adcode": "540202",
        "padcode": "540200",
        "name": "桑珠孜区",
        "value": 1
    }, {"adcode": "540221", "padcode": "540200", "name": "南木林县", "value": 1}, {
        "adcode": "540222",
        "padcode": "540200",
        "name": "江孜县",
        "value": 1
    }, {"adcode": "540223", "padcode": "540200", "name": "定日县", "value": 1}, {
        "adcode": "540224",
        "padcode": "540200",
        "name": "萨迦县",
        "value": 1
    }, {"adcode": "540225", "padcode": "540200", "name": "拉孜县", "value": 1}, {
        "adcode": "540226",
        "padcode": "540200",
        "name": "昂仁县",
        "value": 1
    }, {"adcode": "540227", "padcode": "540200", "name": "谢通门县", "value": 1}, {
        "adcode": "540228",
        "padcode": "540200",
        "name": "白朗县",
        "value": 1
    }, {"adcode": "540229", "padcode": "540200", "name": "仁布县", "value": 1}, {
        "adcode": "540230",
        "padcode": "540200",
        "name": "康马县",
        "value": 1
    }, {"adcode": "540231", "padcode": "540200", "name": "定结县", "value": 1}, {
        "adcode": "540232",
        "padcode": "540200",
        "name": "仲巴县",
        "value": 1
    }, {"adcode": "540233", "padcode": "540200", "name": "亚东县", "value": 1}, {
        "adcode": "540234",
        "padcode": "540200",
        "name": "吉隆县",
        "value": 1
    }, {"adcode": "540235", "padcode": "540200", "name": "聂拉木县", "value": 1}, {
        "adcode": "540236",
        "padcode": "540200",
        "name": "萨嘎县",
        "value": 1
    }, {"adcode": "540237", "padcode": "540200", "name": "岗巴县", "value": 1}, {
        "adcode": "540302",
        "padcode": "540300",
        "name": "卡若区",
        "value": 1
    }, {"adcode": "540321", "padcode": "540300", "name": "江达县", "value": 1}, {
        "adcode": "540322",
        "padcode": "540300",
        "name": "贡觉县",
        "value": 1
    }, {"adcode": "540323", "padcode": "540300", "name": "类乌齐县", "value": 1}, {
        "adcode": "540324",
        "padcode": "540300",
        "name": "丁青县",
        "value": 1
    }, {"adcode": "540325", "padcode": "540300", "name": "察雅县", "value": 1}, {
        "adcode": "540326",
        "padcode": "540300",
        "name": "八宿县",
        "value": 1
    }, {"adcode": "540327", "padcode": "540300", "name": "左贡县", "value": 1}, {
        "adcode": "540328",
        "padcode": "540300",
        "name": "芒康县",
        "value": 1
    }, {"adcode": "540329", "padcode": "540300", "name": "洛隆县", "value": 1}, {
        "adcode": "540330",
        "padcode": "540300",
        "name": "边坝县",
        "value": 1
    }, {"adcode": "540402", "padcode": "540400", "name": "巴宜区", "value": 1}, {
        "adcode": "540421",
        "padcode": "540400",
        "name": "工布江达县",
        "value": 1
    }, {"adcode": "540422", "padcode": "540400", "name": "米林县", "value": 1}, {
        "adcode": "540423",
        "padcode": "540400",
        "name": "墨脱县",
        "value": 1
    }, {"adcode": "540424", "padcode": "540400", "name": "波密县", "value": 1}, {
        "adcode": "540425",
        "padcode": "540400",
        "name": "察隅县",
        "value": 1
    }, {"adcode": "540426", "padcode": "540400", "name": "朗县", "value": 1}, {
        "adcode": "540502",
        "padcode": "540500",
        "name": "乃东区",
        "value": 1
    }, {"adcode": "540521", "padcode": "540500", "name": "扎囊县", "value": 1}, {
        "adcode": "540522",
        "padcode": "540500",
        "name": "贡嘎县",
        "value": 1
    }, {"adcode": "540523", "padcode": "540500", "name": "桑日县", "value": 1}, {
        "adcode": "540524",
        "padcode": "540500",
        "name": "琼结县",
        "value": 1
    }, {"adcode": "540525", "padcode": "540500", "name": "曲松县", "value": 1}, {
        "adcode": "540526",
        "padcode": "540500",
        "name": "措美县",
        "value": 1
    }, {"adcode": "540527", "padcode": "540500", "name": "洛扎县", "value": 1}, {
        "adcode": "540528",
        "padcode": "540500",
        "name": "加查县",
        "value": 1
    }, {"adcode": "540529", "padcode": "540500", "name": "隆子县", "value": 1}, {
        "adcode": "540530",
        "padcode": "540500",
        "name": "错那县",
        "value": 1
    }, {"adcode": "540531", "padcode": "540500", "name": "浪卡子县", "value": 1}, {
        "adcode": "540602",
        "padcode": "540600",
        "name": "色尼区",
        "value": 1
    }, {"adcode": "540621", "padcode": "540600", "name": "嘉黎县", "value": 1}, {
        "adcode": "540622",
        "padcode": "540600",
        "name": "比如县",
        "value": 1
    }, {"adcode": "540623", "padcode": "540600", "name": "聂荣县", "value": 1}, {
        "adcode": "540624",
        "padcode": "540600",
        "name": "安多县",
        "value": 1
    }, {"adcode": "540625", "padcode": "540600", "name": "申扎县", "value": 1}, {
        "adcode": "540626",
        "padcode": "540600",
        "name": "索县",
        "value": 1
    }, {"adcode": "540627", "padcode": "540600", "name": "班戈县", "value": 1}, {
        "adcode": "540628",
        "padcode": "540600",
        "name": "巴青县",
        "value": 1
    }, {"adcode": "540629", "padcode": "540600", "name": "尼玛县", "value": 1}, {
        "adcode": "540630",
        "padcode": "540600",
        "name": "双湖县",
        "value": 1
    }, {"adcode": "542521", "padcode": "542500", "name": "普兰县", "value": 1}, {
        "adcode": "542522",
        "padcode": "542500",
        "name": "札达县",
        "value": 1
    }, {"adcode": "542523", "padcode": "542500", "name": "噶尔县", "value": 1}, {
        "adcode": "542524",
        "padcode": "542500",
        "name": "日土县",
        "value": 1
    }, {"adcode": "542525", "padcode": "542500", "name": "革吉县", "value": 1}, {
        "adcode": "542526",
        "padcode": "542500",
        "name": "改则县",
        "value": 1
    }, {"adcode": "542527", "padcode": "542500", "name": "措勤县", "value": 1}, {
        "adcode": "610102",
        "padcode": "610100",
        "name": "新城区",
        "value": 2
    }, {"adcode": "610103", "padcode": "610100", "name": "碑林区", "value": 1}, {
        "adcode": "610104",
        "padcode": "610100",
        "name": "莲湖区",
        "value": 1
    }, {"adcode": "610111", "padcode": "610100", "name": "灞桥区", "value": 1}, {
        "adcode": "610112",
        "padcode": "610100",
        "name": "未央区",
        "value": 1
    }, {"adcode": "610113", "padcode": "610100", "name": "雁塔区", "value": 1}, {
        "adcode": "610114",
        "padcode": "610100",
        "name": "阎良区",
        "value": 1
    }, {"adcode": "610115", "padcode": "610100", "name": "临潼区", "value": 1}, {
        "adcode": "610116",
        "padcode": "610100",
        "name": "长安区",
        "value": 2
    }, {"adcode": "610117", "padcode": "610100", "name": "高陵区", "value": 1}, {
        "adcode": "610118",
        "padcode": "610100",
        "name": "鄠邑区",
        "value": 1
    }, {"adcode": "610122", "padcode": "610100", "name": "蓝田县", "value": 1}, {
        "adcode": "610124",
        "padcode": "610100",
        "name": "周至县",
        "value": 1
    }, {"adcode": "610202", "padcode": "610200", "name": "王益区", "value": 1}, {
        "adcode": "610203",
        "padcode": "610200",
        "name": "印台区",
        "value": 1
    }, {"adcode": "610204", "padcode": "610200", "name": "耀州区", "value": 1}, {
        "adcode": "610222",
        "padcode": "610200",
        "name": "宜君县",
        "value": 1
    }, {"adcode": "610302", "padcode": "610300", "name": "渭滨区", "value": 1}, {
        "adcode": "610303",
        "padcode": "610300",
        "name": "金台区",
        "value": 1
    }, {"adcode": "610304", "padcode": "610300", "name": "陈仓区", "value": 1}, {
        "adcode": "610322",
        "padcode": "610300",
        "name": "凤翔县",
        "value": 1
    }, {"adcode": "610323", "padcode": "610300", "name": "岐山县", "value": 1}, {
        "adcode": "610324",
        "padcode": "610300",
        "name": "扶风县",
        "value": 1
    }, {"adcode": "610326", "padcode": "610300", "name": "眉县", "value": 1}, {
        "adcode": "610327",
        "padcode": "610300",
        "name": "陇县",
        "value": 1
    }, {"adcode": "610328", "padcode": "610300", "name": "千阳县", "value": 1}, {
        "adcode": "610329",
        "padcode": "610300",
        "name": "麟游县",
        "value": 1
    }, {"adcode": "610330", "padcode": "610300", "name": "凤县", "value": 1}, {
        "adcode": "610331",
        "padcode": "610300",
        "name": "太白县",
        "value": 1
    }, {"adcode": "610402", "padcode": "610400", "name": "秦都区", "value": 1}, {
        "adcode": "610403",
        "padcode": "610400",
        "name": "杨陵区",
        "value": 1
    }, {"adcode": "610404", "padcode": "610400", "name": "渭城区", "value": 1}, {
        "adcode": "610422",
        "padcode": "610400",
        "name": "三原县",
        "value": 1
    }, {"adcode": "610423", "padcode": "610400", "name": "泾阳县", "value": 1}, {
        "adcode": "610424",
        "padcode": "610400",
        "name": "乾县",
        "value": 1
    }, {"adcode": "610425", "padcode": "610400", "name": "礼泉县", "value": 1}, {
        "adcode": "610426",
        "padcode": "610400",
        "name": "永寿县",
        "value": 1
    }, {"adcode": "610427", "padcode": "610400", "name": "彬县", "value": 1}, {
        "adcode": "610428",
        "padcode": "610400",
        "name": "长武县",
        "value": 1
    }, {"adcode": "610429", "padcode": "610400", "name": "旬邑县", "value": 1}, {
        "adcode": "610430",
        "padcode": "610400",
        "name": "淳化县",
        "value": 1
    }, {"adcode": "610431", "padcode": "610400", "name": "武功县", "value": 1}, {
        "adcode": "610481",
        "padcode": "610400",
        "name": "兴平市",
        "value": 1
    }, {"adcode": "610502", "padcode": "610500", "name": "临渭区", "value": 1}, {
        "adcode": "610503",
        "padcode": "610500",
        "name": "华州区",
        "value": 1
    }, {"adcode": "610522", "padcode": "610500", "name": "潼关县", "value": 1}, {
        "adcode": "610523",
        "padcode": "610500",
        "name": "大荔县",
        "value": 1
    }, {"adcode": "610524", "padcode": "610500", "name": "合阳县", "value": 1}, {
        "adcode": "610525",
        "padcode": "610500",
        "name": "澄城县",
        "value": 1
    }, {"adcode": "610526", "padcode": "610500", "name": "蒲城县", "value": 1}, {
        "adcode": "610527",
        "padcode": "610500",
        "name": "白水县",
        "value": 1
    }, {"adcode": "610528", "padcode": "610500", "name": "富平县", "value": 1}, {
        "adcode": "610581",
        "padcode": "610500",
        "name": "韩城市",
        "value": 1
    }, {"adcode": "610582", "padcode": "610500", "name": "华阴市", "value": 1}, {
        "adcode": "610602",
        "padcode": "610600",
        "name": "宝塔区",
        "value": 1
    }, {"adcode": "610603", "padcode": "610600", "name": "安塞区", "value": 1}, {
        "adcode": "610621",
        "padcode": "610600",
        "name": "延长县",
        "value": 1
    }, {"adcode": "610622", "padcode": "610600", "name": "延川县", "value": 1}, {
        "adcode": "610623",
        "padcode": "610600",
        "name": "子长县",
        "value": 1
    }, {"adcode": "610625", "padcode": "610600", "name": "志丹县", "value": 1}, {
        "adcode": "610626",
        "padcode": "610600",
        "name": "吴起县",
        "value": 1
    }, {"adcode": "610627", "padcode": "610600", "name": "甘泉县", "value": 1}, {
        "adcode": "610628",
        "padcode": "610600",
        "name": "富县",
        "value": 1
    }, {"adcode": "610629", "padcode": "610600", "name": "洛川县", "value": 1}, {
        "adcode": "610630",
        "padcode": "610600",
        "name": "宜川县",
        "value": 1
    }, {"adcode": "610631", "padcode": "610600", "name": "黄龙县", "value": 1}, {
        "adcode": "610632",
        "padcode": "610600",
        "name": "黄陵县",
        "value": 1
    }, {"adcode": "610702", "padcode": "610700", "name": "汉台区", "value": 1}, {
        "adcode": "610703",
        "padcode": "610700",
        "name": "南郑区",
        "value": 1
    }, {"adcode": "610722", "padcode": "610700", "name": "城固县", "value": 1}, {
        "adcode": "610723",
        "padcode": "610700",
        "name": "洋县",
        "value": 1
    }, {"adcode": "610724", "padcode": "610700", "name": "西乡县", "value": 1}, {
        "adcode": "610725",
        "padcode": "610700",
        "name": "勉县",
        "value": 1
    }, {"adcode": "610726", "padcode": "610700", "name": "宁强县", "value": 1}, {
        "adcode": "610727",
        "padcode": "610700",
        "name": "略阳县",
        "value": 1
    }, {"adcode": "610728", "padcode": "610700", "name": "镇巴县", "value": 1}, {
        "adcode": "610729",
        "padcode": "610700",
        "name": "留坝县",
        "value": 1
    }, {"adcode": "610730", "padcode": "610700", "name": "佛坪县", "value": 1}, {
        "adcode": "610802",
        "padcode": "610800",
        "name": "榆阳区",
        "value": 1
    }, {"adcode": "610803", "padcode": "610800", "name": "横山区", "value": 1}, {
        "adcode": "610822",
        "padcode": "610800",
        "name": "府谷县",
        "value": 1
    }, {"adcode": "610824", "padcode": "610800", "name": "靖边县", "value": 1}, {
        "adcode": "610825",
        "padcode": "610800",
        "name": "定边县",
        "value": 1
    }, {"adcode": "610826", "padcode": "610800", "name": "绥德县", "value": 1}, {
        "adcode": "610827",
        "padcode": "610800",
        "name": "米脂县",
        "value": 1
    }, {"adcode": "610828", "padcode": "610800", "name": "佳县", "value": 1}, {
        "adcode": "610829",
        "padcode": "610800",
        "name": "吴堡县",
        "value": 1
    }, {"adcode": "610830", "padcode": "610800", "name": "清涧县", "value": 1}, {
        "adcode": "610831",
        "padcode": "610800",
        "name": "子洲县",
        "value": 1
    }, {"adcode": "610881", "padcode": "610800", "name": "神木市", "value": 1}, {
        "adcode": "610902",
        "padcode": "610900",
        "name": "汉滨区",
        "value": 1
    }, {"adcode": "610921", "padcode": "610900", "name": "汉阴县", "value": 1}, {
        "adcode": "610922",
        "padcode": "610900",
        "name": "石泉县",
        "value": 1
    }, {"adcode": "610923", "padcode": "610900", "name": "宁陕县", "value": 1}, {
        "adcode": "610924",
        "padcode": "610900",
        "name": "紫阳县",
        "value": 1
    }, {"adcode": "610925", "padcode": "610900", "name": "岚皋县", "value": 1}, {
        "adcode": "610926",
        "padcode": "610900",
        "name": "平利县",
        "value": 1
    }, {"adcode": "610927", "padcode": "610900", "name": "镇坪县", "value": 1}, {
        "adcode": "610928",
        "padcode": "610900",
        "name": "旬阳县",
        "value": 1
    }, {"adcode": "610929", "padcode": "610900", "name": "白河县", "value": 1}, {
        "adcode": "611002",
        "padcode": "611000",
        "name": "商州区",
        "value": 1
    }, {"adcode": "611021", "padcode": "611000", "name": "洛南县", "value": 1}, {
        "adcode": "611022",
        "padcode": "611000",
        "name": "丹凤县",
        "value": 1
    }, {"adcode": "611023", "padcode": "611000", "name": "商南县", "value": 1}, {
        "adcode": "611024",
        "padcode": "611000",
        "name": "山阳县",
        "value": 1
    }, {"adcode": "611025", "padcode": "611000", "name": "镇安县", "value": 1}, {
        "adcode": "611026",
        "padcode": "611000",
        "name": "柞水县",
        "value": 1
    }, {"adcode": "620102", "padcode": "620100", "name": "城关区", "value": 2}, {
        "adcode": "620103",
        "padcode": "620100",
        "name": "七里河区",
        "value": 1
    }, {"adcode": "620104", "padcode": "620100", "name": "西固区", "value": 1}, {
        "adcode": "620105",
        "padcode": "620100",
        "name": "安宁区",
        "value": 1
    }, {"adcode": "620111", "padcode": "620100", "name": "红古区", "value": 1}, {
        "adcode": "620121",
        "padcode": "620100",
        "name": "永登县",
        "value": 1
    }, {"adcode": "620122", "padcode": "620100", "name": "皋兰县", "value": 1}, {
        "adcode": "620123",
        "padcode": "620100",
        "name": "榆中县",
        "value": 1
    }, {"adcode": "620302", "padcode": "620300", "name": "金川区", "value": 1}, {
        "adcode": "620321",
        "padcode": "620300",
        "name": "永昌县",
        "value": 1
    }, {"adcode": "620402", "padcode": "620400", "name": "白银区", "value": 1}, {
        "adcode": "620403",
        "padcode": "620400",
        "name": "平川区",
        "value": 1
    }, {"adcode": "620421", "padcode": "620400", "name": "靖远县", "value": 1}, {
        "adcode": "620422",
        "padcode": "620400",
        "name": "会宁县",
        "value": 1
    }, {"adcode": "620423", "padcode": "620400", "name": "景泰县", "value": 1}, {
        "adcode": "620502",
        "padcode": "620500",
        "name": "秦州区",
        "value": 1
    }, {"adcode": "620503", "padcode": "620500", "name": "麦积区", "value": 1}, {
        "adcode": "620521",
        "padcode": "620500",
        "name": "清水县",
        "value": 1
    }, {"adcode": "620522", "padcode": "620500", "name": "秦安县", "value": 1}, {
        "adcode": "620523",
        "padcode": "620500",
        "name": "甘谷县",
        "value": 1
    }, {"adcode": "620524", "padcode": "620500", "name": "武山县", "value": 1}, {
        "adcode": "620525",
        "padcode": "620500",
        "name": "张家川回族自治县",
        "value": 1
    }, {"adcode": "620602", "padcode": "620600", "name": "凉州区", "value": 1}, {
        "adcode": "620621",
        "padcode": "620600",
        "name": "民勤县",
        "value": 1
    }, {"adcode": "620622", "padcode": "620600", "name": "古浪县", "value": 1}, {
        "adcode": "620623",
        "padcode": "620600",
        "name": "天祝藏族自治县",
        "value": 1
    }, {"adcode": "620702", "padcode": "620700", "name": "甘州区", "value": 1}, {
        "adcode": "620721",
        "padcode": "620700",
        "name": "肃南裕固族自治县",
        "value": 1
    }, {"adcode": "620722", "padcode": "620700", "name": "民乐县", "value": 1}, {
        "adcode": "620723",
        "padcode": "620700",
        "name": "临泽县",
        "value": 1
    }, {"adcode": "620724", "padcode": "620700", "name": "高台县", "value": 1}, {
        "adcode": "620725",
        "padcode": "620700",
        "name": "山丹县",
        "value": 1
    }, {"adcode": "620802", "padcode": "620800", "name": "崆峒区", "value": 1}, {
        "adcode": "620821",
        "padcode": "620800",
        "name": "泾川县",
        "value": 1
    }, {"adcode": "620822", "padcode": "620800", "name": "灵台县", "value": 1}, {
        "adcode": "620823",
        "padcode": "620800",
        "name": "崇信县",
        "value": 1
    }, {"adcode": "620824", "padcode": "620800", "name": "华亭县", "value": 1}, {
        "adcode": "620825",
        "padcode": "620800",
        "name": "庄浪县",
        "value": 1
    }, {"adcode": "620826", "padcode": "620800", "name": "静宁县", "value": 1}, {
        "adcode": "620902",
        "padcode": "620900",
        "name": "肃州区",
        "value": 1
    }, {"adcode": "620921", "padcode": "620900", "name": "金塔县", "value": 1}, {
        "adcode": "620922",
        "padcode": "620900",
        "name": "瓜州县",
        "value": 1
    }, {"adcode": "620923", "padcode": "620900", "name": "肃北蒙古族自治县", "value": 1}, {
        "adcode": "620924",
        "padcode": "620900",
        "name": "阿克塞哈萨克族自治县",
        "value": 1
    }, {"adcode": "620981", "padcode": "620900", "name": "玉门市", "value": 1}, {
        "adcode": "620982",
        "padcode": "620900",
        "name": "敦煌市",
        "value": 1
    }, {"adcode": "621002", "padcode": "621000", "name": "西峰区", "value": 1}, {
        "adcode": "621021",
        "padcode": "621000",
        "name": "庆城县",
        "value": 1
    }, {"adcode": "621022", "padcode": "621000", "name": "环县", "value": 1}, {
        "adcode": "621023",
        "padcode": "621000",
        "name": "华池县",
        "value": 1
    }, {"adcode": "621024", "padcode": "621000", "name": "合水县", "value": 1}, {
        "adcode": "621025",
        "padcode": "621000",
        "name": "正宁县",
        "value": 1
    }, {"adcode": "621026", "padcode": "621000", "name": "宁县", "value": 1}, {
        "adcode": "621027",
        "padcode": "621000",
        "name": "镇原县",
        "value": 1
    }, {"adcode": "621102", "padcode": "621100", "name": "安定区", "value": 1}, {
        "adcode": "621121",
        "padcode": "621100",
        "name": "通渭县",
        "value": 1
    }, {"adcode": "621122", "padcode": "621100", "name": "陇西县", "value": 1}, {
        "adcode": "621123",
        "padcode": "621100",
        "name": "渭源县",
        "value": 1
    }, {"adcode": "621124", "padcode": "621100", "name": "临洮县", "value": 1}, {
        "adcode": "621125",
        "padcode": "621100",
        "name": "漳县",
        "value": 1
    }, {"adcode": "621126", "padcode": "621100", "name": "岷县", "value": 1}, {
        "adcode": "621202",
        "padcode": "621200",
        "name": "武都区",
        "value": 1
    }, {"adcode": "621221", "padcode": "621200", "name": "成县", "value": 1}, {
        "adcode": "621222",
        "padcode": "621200",
        "name": "文县",
        "value": 1
    }, {"adcode": "621223", "padcode": "621200", "name": "宕昌县", "value": 1}, {
        "adcode": "621224",
        "padcode": "621200",
        "name": "康县",
        "value": 1
    }, {"adcode": "621225", "padcode": "621200", "name": "西和县", "value": 1}, {
        "adcode": "621226",
        "padcode": "621200",
        "name": "礼县",
        "value": 1
    }, {"adcode": "621227", "padcode": "621200", "name": "徽县", "value": 1}, {
        "adcode": "621228",
        "padcode": "621200",
        "name": "两当县",
        "value": 1
    }, {"adcode": "622901", "padcode": "622900", "name": "临夏市", "value": 1}, {
        "adcode": "622921",
        "padcode": "622900",
        "name": "临夏县",
        "value": 1
    }, {"adcode": "622922", "padcode": "622900", "name": "康乐县", "value": 1}, {
        "adcode": "622923",
        "padcode": "622900",
        "name": "永靖县",
        "value": 1
    }, {"adcode": "622924", "padcode": "622900", "name": "广河县", "value": 1}, {
        "adcode": "622925",
        "padcode": "622900",
        "name": "和政县",
        "value": 1
    }, {"adcode": "622926", "padcode": "622900", "name": "东乡族自治县", "value": 1}, {
        "adcode": "622927",
        "padcode": "622900",
        "name": "积石山保安族东乡族撒拉族自治县",
        "value": 1
    }, {"adcode": "623001", "padcode": "623000", "name": "合作市", "value": 1}, {
        "adcode": "623021",
        "padcode": "623000",
        "name": "临潭县",
        "value": 1
    }, {"adcode": "623022", "padcode": "623000", "name": "卓尼县", "value": 1}, {
        "adcode": "623023",
        "padcode": "623000",
        "name": "舟曲县",
        "value": 1
    }, {"adcode": "623024", "padcode": "623000", "name": "迭部县", "value": 1}, {
        "adcode": "623025",
        "padcode": "623000",
        "name": "玛曲县",
        "value": 1
    }, {"adcode": "623026", "padcode": "623000", "name": "碌曲县", "value": 1}, {
        "adcode": "623027",
        "padcode": "623000",
        "name": "夏河县",
        "value": 1
    }, {"adcode": "630102", "padcode": "630100", "name": "城东区", "value": 1}, {
        "adcode": "630103",
        "padcode": "630100",
        "name": "城中区",
        "value": 2
    }, {"adcode": "630104", "padcode": "630100", "name": "城西区", "value": 1}, {
        "adcode": "630105",
        "padcode": "630100",
        "name": "城北区",
        "value": 1
    }, {"adcode": "630121", "padcode": "630100", "name": "大通回族土族自治县", "value": 1}, {
        "adcode": "630122",
        "padcode": "630100",
        "name": "湟中县",
        "value": 1
    }, {"adcode": "630123", "padcode": "630100", "name": "湟源县", "value": 1}, {
        "adcode": "630202",
        "padcode": "630200",
        "name": "乐都区",
        "value": 1
    }, {"adcode": "630203", "padcode": "630200", "name": "平安区", "value": 1}, {
        "adcode": "630222",
        "padcode": "630200",
        "name": "民和回族土族自治县",
        "value": 1
    }, {"adcode": "630223", "padcode": "630200", "name": "互助土族自治县", "value": 1}, {
        "adcode": "630224",
        "padcode": "630200",
        "name": "化隆回族自治县",
        "value": 1
    }, {"adcode": "630225", "padcode": "630200", "name": "循化撒拉族自治县", "value": 1}, {
        "adcode": "632221",
        "padcode": "632200",
        "name": "门源回族自治县",
        "value": 1
    }, {"adcode": "632222", "padcode": "632200", "name": "祁连县", "value": 1}, {
        "adcode": "632223",
        "padcode": "632200",
        "name": "海晏县",
        "value": 1
    }, {"adcode": "632224", "padcode": "632200", "name": "刚察县", "value": 1}, {
        "adcode": "632321",
        "padcode": "632300",
        "name": "同仁县",
        "value": 1
    }, {"adcode": "632322", "padcode": "632300", "name": "尖扎县", "value": 1}, {
        "adcode": "632323",
        "padcode": "632300",
        "name": "泽库县",
        "value": 1
    }, {"adcode": "632324", "padcode": "632300", "name": "河南蒙古族自治县", "value": 1}, {
        "adcode": "632521",
        "padcode": "632500",
        "name": "共和县",
        "value": 1
    }, {"adcode": "632522", "padcode": "632500", "name": "同德县", "value": 1}, {
        "adcode": "632523",
        "padcode": "632500",
        "name": "贵德县",
        "value": 1
    }, {"adcode": "632524", "padcode": "632500", "name": "兴海县", "value": 1}, {
        "adcode": "632525",
        "padcode": "632500",
        "name": "贵南县",
        "value": 1
    }, {"adcode": "632621", "padcode": "632600", "name": "玛沁县", "value": 1}, {
        "adcode": "632622",
        "padcode": "632600",
        "name": "班玛县",
        "value": 1
    }, {"adcode": "632623", "padcode": "632600", "name": "甘德县", "value": 1}, {
        "adcode": "632624",
        "padcode": "632600",
        "name": "达日县",
        "value": 1
    }, {"adcode": "632625", "padcode": "632600", "name": "久治县", "value": 1}, {
        "adcode": "632626",
        "padcode": "632600",
        "name": "玛多县",
        "value": 1
    }, {"adcode": "632701", "padcode": "632700", "name": "玉树市", "value": 1}, {
        "adcode": "632722",
        "padcode": "632700",
        "name": "杂多县",
        "value": 1
    }, {"adcode": "632723", "padcode": "632700", "name": "称多县", "value": 1}, {
        "adcode": "632724",
        "padcode": "632700",
        "name": "治多县",
        "value": 1
    }, {"adcode": "632725", "padcode": "632700", "name": "囊谦县", "value": 1}, {
        "adcode": "632726",
        "padcode": "632700",
        "name": "曲麻莱县",
        "value": 1
    }, {"adcode": "632801", "padcode": "632800", "name": "格尔木市", "value": 1}, {
        "adcode": "632802",
        "padcode": "632800",
        "name": "德令哈市",
        "value": 1
    }, {"adcode": "632821", "padcode": "632800", "name": "乌兰县", "value": 1}, {
        "adcode": "632822",
        "padcode": "632800",
        "name": "都兰县",
        "value": 1
    }, {"adcode": "632823", "padcode": "632800", "name": "天峻县", "value": 1}, {
        "adcode": "640104",
        "padcode": "640100",
        "name": "兴庆区",
        "value": 1
    }, {"adcode": "640105", "padcode": "640100", "name": "西夏区", "value": 1}, {
        "adcode": "640106",
        "padcode": "640100",
        "name": "金凤区",
        "value": 1
    }, {"adcode": "640121", "padcode": "640100", "name": "永宁县", "value": 1}, {
        "adcode": "640122",
        "padcode": "640100",
        "name": "贺兰县",
        "value": 1
    }, {"adcode": "640181", "padcode": "640100", "name": "灵武市", "value": 1}, {
        "adcode": "640202",
        "padcode": "640200",
        "name": "大武口区",
        "value": 1
    }, {"adcode": "640205", "padcode": "640200", "name": "惠农区", "value": 1}, {
        "adcode": "640221",
        "padcode": "640200",
        "name": "平罗县",
        "value": 1
    }, {"adcode": "640302", "padcode": "640300", "name": "利通区", "value": 1}, {
        "adcode": "640303",
        "padcode": "640300",
        "name": "红寺堡区",
        "value": 1
    }, {"adcode": "640323", "padcode": "640300", "name": "盐池县", "value": 1}, {
        "adcode": "640324",
        "padcode": "640300",
        "name": "同心县",
        "value": 1
    }, {"adcode": "640381", "padcode": "640300", "name": "青铜峡市", "value": 1}, {
        "adcode": "640402",
        "padcode": "640400",
        "name": "原州区",
        "value": 1
    }, {"adcode": "640422", "padcode": "640400", "name": "西吉县", "value": 1}, {
        "adcode": "640423",
        "padcode": "640400",
        "name": "隆德县",
        "value": 1
    }, {"adcode": "640424", "padcode": "640400", "name": "泾源县", "value": 1}, {
        "adcode": "640425",
        "padcode": "640400",
        "name": "彭阳县",
        "value": 1
    }, {"adcode": "640502", "padcode": "640500", "name": "沙坡头区", "value": 1}, {
        "adcode": "640521",
        "padcode": "640500",
        "name": "中宁县",
        "value": 1
    }, {"adcode": "640522", "padcode": "640500", "name": "海原县", "value": 1}, {
        "adcode": "650102",
        "padcode": "650100",
        "name": "天山区",
        "value": 1
    }, {"adcode": "650103", "padcode": "650100", "name": "沙依巴克区", "value": 1}, {
        "adcode": "650104",
        "padcode": "650100",
        "name": "新市区",
        "value": 1
    }, {"adcode": "650105", "padcode": "650100", "name": "水磨沟区", "value": 1}, {
        "adcode": "650106",
        "padcode": "650100",
        "name": "头屯河区",
        "value": 1
    }, {"adcode": "650107", "padcode": "650100", "name": "达坂城区", "value": 1}, {
        "adcode": "650109",
        "padcode": "650100",
        "name": "米东区",
        "value": 1
    }, {"adcode": "650121", "padcode": "650100", "name": "乌鲁木齐县", "value": 1}, {
        "adcode": "650202",
        "padcode": "650200",
        "name": "独山子区",
        "value": 1
    }, {"adcode": "650203", "padcode": "650200", "name": "克拉玛依区", "value": 1}, {
        "adcode": "650204",
        "padcode": "650200",
        "name": "白碱滩区",
        "value": 1
    }, {"adcode": "650205", "padcode": "650200", "name": "乌尔禾区", "value": 1}, {
        "adcode": "650402",
        "padcode": "650400",
        "name": "高昌区",
        "value": 1
    }, {"adcode": "650421", "padcode": "650400", "name": "鄯善县", "value": 1}, {
        "adcode": "650422",
        "padcode": "650400",
        "name": "托克逊县",
        "value": 1
    }, {"adcode": "650502", "padcode": "650500", "name": "伊州区", "value": 1}, {
        "adcode": "650521",
        "padcode": "650500",
        "name": "巴里坤哈萨克自治县",
        "value": 1
    }, {"adcode": "650522", "padcode": "650500", "name": "伊吾县", "value": 1}, {
        "adcode": "652301",
        "padcode": "652300",
        "name": "昌吉市",
        "value": 1
    }, {"adcode": "652302", "padcode": "652300", "name": "阜康市", "value": 1}, {
        "adcode": "652323",
        "padcode": "652300",
        "name": "呼图壁县",
        "value": 1
    }, {"adcode": "652324", "padcode": "652300", "name": "玛纳斯县", "value": 1}, {
        "adcode": "652325",
        "padcode": "652300",
        "name": "奇台县",
        "value": 1
    }, {"adcode": "652327", "padcode": "652300", "name": "吉木萨尔县", "value": 1}, {
        "adcode": "652328",
        "padcode": "652300",
        "name": "木垒哈萨克自治县",
        "value": 1
    }, {"adcode": "652701", "padcode": "652700", "name": "博乐市", "value": 1}, {
        "adcode": "652702",
        "padcode": "652700",
        "name": "阿拉山口市",
        "value": 1
    }, {"adcode": "652722", "padcode": "652700", "name": "精河县", "value": 1}, {
        "adcode": "652723",
        "padcode": "652700",
        "name": "温泉县",
        "value": 1
    }, {"adcode": "652801", "padcode": "652800", "name": "库尔勒市", "value": 1}, {
        "adcode": "652822",
        "padcode": "652800",
        "name": "轮台县",
        "value": 1
    }, {"adcode": "652823", "padcode": "652800", "name": "尉犁县", "value": 1}, {
        "adcode": "652824",
        "padcode": "652800",
        "name": "若羌县",
        "value": 1
    }, {"adcode": "652825", "padcode": "652800", "name": "且末县", "value": 1}, {
        "adcode": "652826",
        "padcode": "652800",
        "name": "焉耆回族自治县",
        "value": 1
    }, {"adcode": "652827", "padcode": "652800", "name": "和静县", "value": 1}, {
        "adcode": "652828",
        "padcode": "652800",
        "name": "和硕县",
        "value": 1
    }, {"adcode": "652829", "padcode": "652800", "name": "博湖县", "value": 1}, {
        "adcode": "652901",
        "padcode": "652900",
        "name": "阿克苏市",
        "value": 1
    }, {"adcode": "652922", "padcode": "652900", "name": "温宿县", "value": 1}, {
        "adcode": "652923",
        "padcode": "652900",
        "name": "库车县",
        "value": 1
    }, {"adcode": "652924", "padcode": "652900", "name": "沙雅县", "value": 1}, {
        "adcode": "652925",
        "padcode": "652900",
        "name": "新和县",
        "value": 1
    }, {"adcode": "652926", "padcode": "652900", "name": "拜城县", "value": 1}, {
        "adcode": "652927",
        "padcode": "652900",
        "name": "乌什县",
        "value": 1
    }, {"adcode": "652928", "padcode": "652900", "name": "阿瓦提县", "value": 1}, {
        "adcode": "652929",
        "padcode": "652900",
        "name": "柯坪县",
        "value": 1
    }, {"adcode": "653001", "padcode": "653000", "name": "阿图什市", "value": 1}, {
        "adcode": "653022",
        "padcode": "653000",
        "name": "阿克陶县",
        "value": 1
    }, {"adcode": "653023", "padcode": "653000", "name": "阿合奇县", "value": 1}, {
        "adcode": "653024",
        "padcode": "653000",
        "name": "乌恰县",
        "value": 1
    }, {"adcode": "653101", "padcode": "653100", "name": "喀什市", "value": 1}, {
        "adcode": "653121",
        "padcode": "653100",
        "name": "疏附县",
        "value": 1
    }, {"adcode": "653122", "padcode": "653100", "name": "疏勒县", "value": 1}, {
        "adcode": "653123",
        "padcode": "653100",
        "name": "英吉沙县",
        "value": 1
    }, {"adcode": "653124", "padcode": "653100", "name": "泽普县", "value": 1}, {
        "adcode": "653125",
        "padcode": "653100",
        "name": "莎车县",
        "value": 1
    }, {"adcode": "653126", "padcode": "653100", "name": "叶城县", "value": 1}, {
        "adcode": "653127",
        "padcode": "653100",
        "name": "麦盖提县",
        "value": 1
    }, {"adcode": "653128", "padcode": "653100", "name": "岳普湖县", "value": 1}, {
        "adcode": "653129",
        "padcode": "653100",
        "name": "伽师县",
        "value": 1
    }, {"adcode": "653130", "padcode": "653100", "name": "巴楚县", "value": 1}, {
        "adcode": "653131",
        "padcode": "653100",
        "name": "塔什库尔干塔吉克自治县",
        "value": 1
    }, {"adcode": "653201", "padcode": "653200", "name": "和田市", "value": 1}, {
        "adcode": "653221",
        "padcode": "653200",
        "name": "和田县",
        "value": 1
    }, {"adcode": "653222", "padcode": "653200", "name": "墨玉县", "value": 1}, {
        "adcode": "653223",
        "padcode": "653200",
        "name": "皮山县",
        "value": 1
    }, {"adcode": "653224", "padcode": "653200", "name": "洛浦县", "value": 1}, {
        "adcode": "653225",
        "padcode": "653200",
        "name": "策勒县",
        "value": 1
    }, {"adcode": "653226", "padcode": "653200", "name": "于田县", "value": 1}, {
        "adcode": "653227",
        "padcode": "653200",
        "name": "民丰县",
        "value": 1
    }, {"adcode": "654002", "padcode": "654000", "name": "伊宁市", "value": 1}, {
        "adcode": "654003",
        "padcode": "654000",
        "name": "奎屯市",
        "value": 1
    }, {"adcode": "654004", "padcode": "654000", "name": "霍尔果斯市", "value": 1}, {
        "adcode": "654021",
        "padcode": "654000",
        "name": "伊宁县",
        "value": 1
    }, {"adcode": "654022", "padcode": "654000", "name": "察布查尔锡伯自治县", "value": 1}, {
        "adcode": "654023",
        "padcode": "654000",
        "name": "霍城县",
        "value": 1
    }, {"adcode": "654024", "padcode": "654000", "name": "巩留县", "value": 1}, {
        "adcode": "654025",
        "padcode": "654000",
        "name": "新源县",
        "value": 1
    }, {"adcode": "654026", "padcode": "654000", "name": "昭苏县", "value": 1}, {
        "adcode": "654027",
        "padcode": "654000",
        "name": "特克斯县",
        "value": 1
    }, {"adcode": "654028", "padcode": "654000", "name": "尼勒克县", "value": 1}, {
        "adcode": "654201",
        "padcode": "654200",
        "name": "塔城市",
        "value": 1
    }, {"adcode": "654202", "padcode": "654200", "name": "乌苏市", "value": 1}, {
        "adcode": "654221",
        "padcode": "654200",
        "name": "额敏县",
        "value": 1
    }, {"adcode": "654223", "padcode": "654200", "name": "沙湾县", "value": 1}, {
        "adcode": "654224",
        "padcode": "654200",
        "name": "托里县",
        "value": 1
    }, {"adcode": "654225", "padcode": "654200", "name": "裕民县", "value": 1}, {
        "adcode": "654226",
        "padcode": "654200",
        "name": "和布克赛尔蒙古自治县",
        "value": 1
    }, {"adcode": "654301", "padcode": "654300", "name": "阿勒泰市", "value": 1}, {
        "adcode": "654321",
        "padcode": "654300",
        "name": "布尔津县",
        "value": 1
    }, {"adcode": "654322", "padcode": "654300", "name": "富蕴县", "value": 1}, {
        "adcode": "654323",
        "padcode": "654300",
        "name": "福海县",
        "value": 1
    }, {"adcode": "654324", "padcode": "654300", "name": "哈巴河县", "value": 1}, {
        "adcode": "654325",
        "padcode": "654300",
        "name": "青河县",
        "value": 1
    }, {"adcode": "654326", "padcode": "654300", "name": "吉木乃县", "value": 1}];

var orderList = [
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"程潇潇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张坤"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"赵长湖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"李宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 13, "volumeUnit": "","completeStatus":"未完成","driverName":"周志宸"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"王贤成"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 12, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 9, "volumeUnit": "","completeStatus":"已完成","driverName":"张一阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘备"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 14, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"龙非夜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 8, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"杨阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"高岑"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"许智阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘子睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"刘宇浩"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张传铭"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 18, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"孙辰尧"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"已完成","driverName":"周师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"未完成","driverName":"吴昊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"胡云纬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"周向晨"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"张宸瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"已完成","driverName":"宁清"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"已完成","driverName":"子默"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"刘梓臣"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"何传航"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵萌萌"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"周洁宇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵骐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"张传胜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵玮扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵启辰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"吴世华"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李德"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"周传毅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"李师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张培"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"王有玉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"付思睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李传泽"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘仁辉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周岳扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"肖肖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵乐伶"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"付博文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李泽桐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵成昀"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔梓镐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"洪杰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘子君"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张山"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔俊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李谷凯"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"叶恒"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周传震"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘杰颢"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"程潇潇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张坤"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"赵长湖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"李宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 13, "volumeUnit": "","completeStatus":"未完成","driverName":"周志宸"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"王贤成"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 12, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 9, "volumeUnit": "","completeStatus":"已完成","driverName":"张一阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘备"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 14, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"龙非夜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 8, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"杨阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"高岑"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"许智阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘子睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"刘宇浩"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张传铭"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 18, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"孙辰尧"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"已完成","driverName":"周师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"未完成","driverName":"吴昊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"胡云纬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"周向晨"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"张宸瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"已完成","driverName":"宁清"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"已完成","driverName":"子默"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"刘梓臣"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"何传航"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵萌萌"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"周洁宇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵骐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"张传胜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵玮扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵启辰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"吴世华"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李德"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"周传毅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"李师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张培"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"王有玉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"付思睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李传泽"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘仁辉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周岳扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"肖肖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵乐伶"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"付博文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李泽桐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵成昀"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔梓镐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"洪杰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘子君"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张山"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔俊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李谷凯"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"叶恒"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周传震"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘杰颢"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"程潇潇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张坤"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"赵长湖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"李宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 13, "volumeUnit": "","completeStatus":"未完成","driverName":"周志宸"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"王贤成"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 12, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 9, "volumeUnit": "","completeStatus":"已完成","driverName":"张一阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘备"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 14, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"龙非夜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 8, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"杨阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"高岑"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"许智阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"未完成","driverName":"刘子睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"刘宇浩"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 15, "volumeUnit": "","completeStatus":"未完成","driverName":"张传铭"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 18, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 16, "volumeUnit": "","completeStatus":"已完成","driverName":"孙辰尧"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"已完成","driverName":"周师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 16, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"未完成","driverName":"吴昊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"未完成","driverName":"胡云纬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 10, "volumeUnit": "","completeStatus":"已完成","driverName":"周向晨"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 11, "volumeUnit": "","completeStatus":"未完成","driverName":"张宸瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 13, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 12, "volumeUnit": "","completeStatus":"已完成","driverName":"宁清"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 21, "volumeUnit": "","completeStatus":"已完成","driverName":"子默"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 10, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 17, "volumeUnit": "","completeStatus":"未完成","driverName":"刘梓臣"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 9, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 18, "volumeUnit": "","completeStatus":"已完成","driverName":"何传航"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵萌萌"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"周洁宇"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张瑜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵骐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"张传胜"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵玮扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"赵启辰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"吴世华"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李德"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"周传毅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"李师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张培"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 11, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 19, "volumeUnit": "","completeStatus":"未完成","driverName":"王有玉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 15, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 22, "volumeUnit": "","completeStatus":"已完成","driverName":"付思睿"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张师傅"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李传泽"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘仁辉"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周岳扬"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周宇阳"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"肖肖"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵乐伶"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"付博文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李泽桐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵成昀"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔梓镐"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"洪杰"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘子君"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"张山"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"孔俊"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"李谷凯"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"叶恒"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"赵青文"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"周传震"},
    {"orderNo": "DO18271", "trackingNo": '1010', "totalQty": 17, "qtyUnit":"","totalWeight": "10", "weightUnit": "","totalVolume": 20, "volumeUnit": "","completeStatus":"已完成","driverName":"刘杰颢"}
];


