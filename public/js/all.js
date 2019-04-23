/**
 * Created by SoSee on 2017/1/24.
 */

//初始化
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

var language = localStorage.getItem('language') ? localStorage.getItem('language') : 'C';
var userinfo='';
var lang = {
    C: 'zh-cn',
    T: 'zh-tw',
    E: 'en'
}

String.prototype.queryURLParameter = function () {
    var obj = {},
        reg = /([^?=&#]+)=([^?=&#]+)/g;
    this.replace(reg, function () {
        var key = arguments[1],
            value = arguments[2];
        obj[key] = value;
    });
    return obj;
};


var indexC = ['场次列表', '公证人', '环节控制', '私人空间', '回收站']
var indexE = ['Exhibitor List', 'Trend Guide S/S2018', 'Hall Overview', 'Seminar Schedule', 'Fair fact', 'My favorites']
var indexT = ['展商列表', '流行趋势', '场馆布局', '论坛日程', '综合信息', '我的收藏']

var exhibitorC = ['搜索', '筛选', '类别', '结束日期', '发起人', '状态', '请输入查询条件', '取消', '热门搜索', '历史记录']

var favoriteT = ['展商收藏', '日程收藏']
var favoriteC = ['展商收藏', '日程收藏']
var favoriteE = ['Exhibitor', 'Seminar Schedule']


var companyLst = {
    T: {
        intro: '公司簡介',
        type: '產品類別',
        pupose: '產品用途',
        green: '環保公司',
        address: '地址',
        tell: '電話',
        tax: '傳真',
        mail: '郵箱',
        web: '網址',
    },
    E: {
        intro: 'Company',
        type: 'product group',
        pupose: 'product enduse',
        green: 'Eco-product',
        address: 'Address',
        tell: 'Tel',
        tax: 'Fax',
        mail: 'Email',
        web: 'Web',
    },
    C: {
        intro: '场次简介',
        type: '发起人',
        pupose: '标签个数',
        green: '标签个数',
        address: '场次类别',
        tell: '电话',
        tax: '传真',
        mail: '邮箱',
        web: '网址',
    }
}

var scheduleLst = {
    E: {
        summary: 'Topic/</br>Summary',
        speaker: 'Speaker/</br>Company',
        lang: 'Language',
        room: 'Room'
    },
    T: {
        summary: '主題/</br>講座簡介',
        speaker: '演講人/</br>主講公司',
        lang: '語言',
        room: '會議室'
    },
    C: {
        summary: '主题/</br>讲座简介',
        speaker: '演讲人/</br>主讲公司',
        lang: '语言',
        room: '会议室'
    },
}


var searchLst = {
    E: {
        search: 'Search',
        filter: 'Fliter',
        cancel: 'Cancel',
        submit: 'Submit',
        reset: 'Reset',
        select: 'Select All',
        fabric: 'Fabric',
        adjuvant: 'Adjuvant',
        clear: 'Clear History',
        placeholder: 'Search...',
        phone: 'Mobile Phone Number',
        click: 'Get',
        pass: 'Password',
        login: 'Login',
        logout: 'Logout',
        alert: 'Please Enter a Legal  Mobile Phone Number!',
        logmsg: 'You are not logged in , Please login',
    },
    T: {
        search: '搜索',
        filter: '篩選',
        cancel: '取消',
        submit: '確定搜索',
        reset: '重置',
        select: '全選',
        fabric: '面料',
        adjuvant: '輔料',
        clear: '清空歷史記錄',
        placeholder: '請輸入查詢條件',
        phone: '請輸入手機號碼',
        click: '點擊獲取',
        pass: '動態密碼',
        login: '登錄',
        logout: '註銷登錄',
        alert: '請輸入合法的手機號!',
        logmsg: '您還未登錄，確定登錄么？',
    },
    C: {
        search: '搜索',
        filter: '筛选',
        cancel: '取消',
        submit: '确定搜索',
        reset: '重置',
        select: '全选',
        fabric: '面料',
        adjuvant: '辅料',
        clear: '清空历史记录',
        placeholder: '请输入查询条件',
        phone: '请输入手机号码',
        click: '点击获取',
        pass: '动态密码',
        login: '登录',
        logout: '注销登录',
        alert: '请输入合法的手机号!',
        logmsg: '您还未登录，确定登录么？',

    }
}

var favoriteLst = {
    E: {
        promptC: 'No collection',
        promptS: 'No collection',
        watchC: 'Exhibitor List',
        watchS: 'Seminar Schedule',
        attention: 'Add to Favorite',
        attentionR: 'Added',
        confirmCancel: 'Delete？',

    },
    T: {
        promptC: '您沒有收藏任何展商',
        promptS: '您沒有收藏任何日程',
        watchS: '查看日程',
        watchC: '查看展商',
        attention: '添加關注',
        attentionR: '取消關注',
        confirmCancel: '確定取消收藏么？',

    },
    C: {
        promptC: '您没有收藏任何展商',
        promptS: '您没有收藏任何日程',
        watchS: '查看日程',
        watchC: '查看展商',
        attention: '添加关注',
        attentionR: '取消关注',
        confirmCancel: '确定取消收藏么？',

    },
}

var alertMsg = {
    E: {
        sure: 'ok',
        cancel: 'cancel',
        network: 'network instability',
        check: 'Please check the network connection',
        refresh: 'refresh',
    },
    T: {
        sure: '確定',
        cancel: '取消',
        network: '網絡連接不穩定',
        check: '請檢查網絡連接',
        refresh: '刷新',
    },
    C: {
        sure: '确定',
        cancel: '取消',
        network: '网络连接不稳定',
        check: '请检查网络连接',
        refresh: '刷新',
    }
}


function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

function Language() {
    // $('#ex_list_der').hide();
    var arr;

    if (window.location.href.indexOf('list') > -1) {
            arr = exhibitorC
    }
    else if (window.location.href.indexOf('favorite') > -1) {
        if (language == 'T') {
            arr = favoriteT
        }
        else if (language == 'E') {
            arr = favoriteE
        } else {
            arr = favoriteC
        }
    }
    else if (window.location.href.indexOf('index') > -1 || window.location.href.indexOf('.html') < 0) {
        if (language == 'T') {
            arr = indexT
        }
        else if (language == 'E') {
            arr = indexE
        } else {
            arr = indexC
        }
    }
    if (arr) {
        //console.log(arr)
        //console.log($('.menu').length)
        for (var i = 0, j = $('.menu').length; i < j; i++) {
            //console.log($('.menu').eq(i)[0])
            //console.log(arr[i])
            $('.menu').eq(i).html(arr[i])
        }
    }
    if(language=='T'||language=='C'){
        document.body.fontFamily="微软雅黑,黑体"
    }else{
        document.body.fontFamily="arial"
    }

}

function selfConfirm(msg, okBack, cancelCall) {
//    确定和取消
    var str = '';
    str += '<div class="hint">' +
        '<div class="hintBox">' +
        '<div class="hintText">' +
        '<p>'+msg+'</p></div>';
    str += '<button class="hintSure">' + okBack.text + '</button>';
    str += '<button class="initOff">' + cancelCall.text + '</button>';
    str += '</div></div>';

    $(document.body).append(str);

    str = '';
    $(document.body).on('click', '.hintSure', function () {
        $('.hint').remove();
        if (okBack != undefined && okBack.fun != undefined) {
            okBack.fun();
        }
    });
    $(document.body).on('click', '.initOff', function () {
        $('.hint').remove();
        if (cancelCall != undefined && cancelCall.fun != undefined) {
            cancelCall.fun();
        }
    });

}
var flag;

function selfAlert(msg, okBack, cancelCall) {
//    提示信息
    var str = '';
    str += '<div class="hint">' +
        '<div class="hintBox">' +
        '<div class="hintText">' +
        '<p>'+msg+'</p></div>';
    str += '<button class="alertSure">' + okBack.text + '</button>';
    // str += '<button class="initOff">' + cancelCall.text + '</button>';
    str += '</div></div>';

    $(document.body).append(str);

    str = '';

    $(document.body).on('click', '.alertSure', function () {
        $('.hint').remove();
        if (okBack != undefined && okBack.fun != undefined) {
            okBack.fun();
        }
    });
}

function selfWebRefresh(msg) {
    var str = '';
    str += '<div class="signal">' +
        '<div class="signalBox">' +
        '<div class="signal-img"></div>' +
        '<p class="mar-t">' + alertMsg[language].network + '</p>' +
        '<p>' + alertMsg[language].check + '</p>' +
        '<button class="signal-btn">' + alertMsg[language].refresh + '</button>' +
        '</div></div>';
    $(document.body).append(str);
    str = '';
    $(document.body).on('click', '.signal-btn', function () {
        $('.signal').remove();
        location.reload();
    })
}

window.onload = function () {
    Language();
    var pageArr = ['index', 'list', 'share', 'layout', 'personal', 'calendar', 'information', 'login']
    var reutrnArr = ['none', '#exhibitorsList', '#share', '#layout-page', '#favorite', '#calendar', '#information', '#login']
    var pageN = pageName(window.location.href)
    var home = notWeiXin()

    function pageName(page) {
        console.log(page)
        // var name= page.split('/');
        for (var i = 0, j = pageArr.length; i < j; i++) {
            if (page.indexOf(pageArr[i]) > -1) {
                //console.log(pageArr[i])
                return reutrnArr[i]
            }
        }
        return false;
    }

    if (home && pageN != 'none' && pageN) {
        console.log(pageN);
        $(pageN)[0].appendChild(home)
        if (pageN == '#exhibitorsList') {
            $("#exhibitor_search").children('.exhibitor_search').eq(0).css({
                width: '12.25rem',
                'margin-left': '3rem'
            });
            $("#ipt_search_con").css({
                width: '12.25rem',
                'margin-left': '3rem'
            });
        }
        else if (pageN == '#ex_list_con') {

        } else if (pageN == '#calendar') {
            $("#head_nav").css({
                width: 'calc(100% - 2.5rem)',
                'margin-left': '2.5rem'
            });
        } else if (pageN == '#information') {
            $("#syn_nav").css({
                width: 'calc(100% - 2.5rem)',
                'margin-left': '2.5rem'
            });
        } else if (pageN == '#favorite') {
            $("#head_nav").css({
                width: 'calc(100% - 2.5rem)',
                'margin-left': '2.5rem'
            });
        }


    }
    else {
        console.log('不显示home')
    }

//排序
    var segs, Array;

    function dataSort(arr) {
        arr.sort(function (a, b) {
            return a.company_name.localeCompare(b.company_name);
        })
        return arr
    }

    function pySegSort(arr, empty) {
        // if (!String.prototype.localeCompare)
        //     return null;
        var letters = "*abcdefghjklmnopqrstwxyz".split('');
        var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');//abcdefghjklmnopqrstwxyz
        segs = [];
        // var curr;
        // var a='吧'
        // var b='安'
        // console.log(a.localeCompare(b))
        $.each(letters, function (i, n) {
            curr = {letter: this, data: []};
            $.each(arr, function () {
                if ((!zh[i - 1] || zh[i - 1].localeCompare(this.company_name) <= 0) && this.company_name.localeCompare(zh[i]) == -1) {
                    // if ( this.company_name.localeCompare(zh[i]) >=0&& this.company_name.localeCompare(zh[i+1]) <0) {
                    curr.data.push(this);
                }
            });
            if (curr.data.length) {
                segs.push(curr);
                curr.data.sort(function (a, b) {
                    return a.company_name.localeCompare(b.company_name);
                });
            }
        });
        // alert(segs);
        return segs;
    }

    function size(desW) {
        var winW = document.documentElement.clientWidth,
            n = winW / desW;
        if (n > 1.3) {
            document.documentElement.style.fontSize = (1000 / desW) * 40 + "px";
        } else {
            document.documentElement.style.fontSize = n * 40 + "px";
        }

    }

    size(750)
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", resizeScreen, false);

    function resizeScreen() {
        size(750)
    }

    function notWeiXin() {
        // var ua = window.navigator.userAgent.toLowerCase();
        // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        //     return false;
        // } else {
        var home = document.createElement('a')
        home.setAttribute('class', 'home')
        //  ../ 调用了PHP动态页面,不要修改 kong  2017-03-9
        home.setAttribute('href', 'http://localhost:52120/');
        return home;
        // }
    }

}


