//    --------------------------展商列表---------------------------------------------------------------
//itt.indata3.com/server/company post方式 参数 the_year_month = '201703'
// localStorage.removeItem('history_search')
var flag = false;
~function () {
    var reg1 = /AppleWebKit.*Mobile/i,
        reg2 = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;
    //->条件成立说明当前页面是运行在移动端设备中的
    if (reg1.test(navigator.userAgent) || reg2.test(navigator.userAgent)) {
        flag = true;
    } else {
        $('#exhibitor_list').css('overflow', "scroll")
    }
}();

var myScroll_quick, isPulled = false;


document.getElementById('exhibitor_list').addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);

document.getElementById('type_container').addEventListener('touchmove', function (e) {
    e.stopPropagation();
}, false);

var pullDownOffset = $('#scroll_r').height();
if (flag) {
    myScroll_quick = new IScroll('#exhibitor_list', {
        scrollbarClass: 'myScrollbar', /* 重要样式 */
        momentum: true,
        click: true,
        probeType: 3,
    });
    myScroll_quick.on('scroll', function () {
        var y = this.y,
            maxY = this.maxScrollY - y;
        if (parseInt(maxY) > 10) {
            if (statusList == 'list') {
                ajS();
            } else {
                searchAj()
            }
        }
    })
}
var history_search = localStorage.getItem('history_search') ? eval(localStorage.getItem('history_search')) : [];
var ex_list = document.getElementById('ex_list_con');
var ex_der = document.getElementById('ex_list_der');
var statusList = 'list';

var ex_search = {
    game_sponsor: [],
    game_type: [],
    game_start_date: [],
    game_status: [],
    keywords: [],
};
//开始的时候进行AJAX查询展商列表信息-----------------------------------------1 ++  ----------------------------
var aj = {
    start: 0,
    time: 0,
    running: false
}
console.log(aj);
var favorite = {};
ajF();
//-------------------搜索头部ajax查询-------------------------------------
function ajF() {
    $.ajax({
        type: 'post',
        url: '/list/list_search_option',
        data: {the_year_month: '201705'},
        timeout: 5000,
        success: function (msg) {
            var msg = JSON.parse(msg)
            console.log(msg.data.search_option);
            searchList(msg.data.search_option);
        },
        beforeSend: function () {
            $('.loading').show();

        },
        complete: function (XMLHttpRequest, status) {
            console.log(status);
            if (status == 'timeout' || status == 'error') {//超时,status还有success,等值的情况
                //ajaxTimeOut.abort(); //取消请求
                console.log('timeout')
                $('.loading').hide();
                $('.ref_txt').html('糟糕！网络遇到问题点击屏幕刷新');
                $('#refurbish').css('display', "table");
                $('#refurbish').on('click', function () {
                    $(this).css('display', 'none');
                    location.reload();
                });
                aj.running = false;
                //console.log(e)
            }
        }
    });
}
function searchList(msg) {
    str = '';
    for (var e in msg) {
        if (e == 'type') {
            str += '<div class="tag_container">'
            for (var i = 0, j = msg[e].length; i < j; i++) {
                str += '<div class="tags" data-position="0" data-type="0" id="' + msg[e][i] + '">'
                    + '<span class="tag_word">' + msg[e][i] + '</span><div class="tag_cho"></div>'
                    + '</div>'
            }
            str += '</div>';
        }
        else if (e == 'date') {
            str += '<div class="tag_container">'
            for (var i = 0, j = msg[e].length; i < j; i++) {
                str += '<div class="tags" data-position="0" data-type="1" id="' + msg[e][i] + '">'
                    + '<span class="tag_word">' + msg[e][i] + '</span><div class="tag_cho"></div>'
                    + '</div>'
            }
            str += '</div>';
        }
        else if (e == 'sponsor') {
            str += '<div class="tag_container">'
            for (var i = 0, j = msg[e].length; i < j; i++) {
                str += '<div class="tags" data-position="0" data-type="2" id="' + msg[e][i][1] + '">'
                    + '<span class="tag_word">' + msg[e][i][0] + '</span><div class="tag_cho"></div>'
                    + '</div>'
            }
            str += '</div>';
        }
        else if (e == 'state') {
            str += '<div class="tag_container">'
            for (var i = 0, j = msg[e].length; i < j; i++) {
                str += '<div class="tags" data-position="0" data-type="3" id="' + msg[e][i] + '">'
                    + '<span class="tag_word">' + state(msg[e][i]) + '</span><div class="tag_cho"></div>'
                    + '</div>'
            }
            str += '</div>';
        }
    }
    $('#type_container')[0].innerHTML += str;
    favoriteAj();
}
// --------------------我的收藏列表进行查询--------------------------------------------
function favoriteAj() {
    $.ajax({
        type: 'post',
        url: '/list/favorites_list',
        data: {the_year_month: '201705'},
        timeout: 5000,
        success: function (msg) {
            var msg = JSON.parse(msg)
            favoriteList(msg)
        },
        complete: function (XMLHttpRequest, status) {
            console.log(status);
            if (status == 'timeout' || status == 'error') {//超时,status还有success,等值的情况
                //ajaxTimeOut.abort(); //取消请求
                console.log('timeout')
                $('.loading').hide();
                $('.ref_txt').html('糟糕！网络遇到问题点击屏幕刷新');
                $('#refurbish').css('display', "table");
                $('#refurbish').on('click', function () {
                    $(this).css('display', 'none');
                    location.reload();
                });
                aj.running = false;
                //console.log(e)
            }
        }

    });
}

function favoriteList(msg) {
    if (msg.Success == '1') {
        for (var i = 0, j = msg.data.list.length; i < j; i++) {
            var t = msg.data.list[i];
            console.log(t)
            favorite[t] = '1'
        }
    }
    ajS();
}

//查詢展商列表ajax初次請求
function ajS() {
//-----------------展商列表进行查询-----------------------------------------------
    if (aj.running)
        return;
    aj.running = true;
    $.ajax({
        type: 'post',
        url: '/list/list',
        timeout: 5000,
        data: {
            the_year_month: '201703',
            page_id: aj.start,
            timestamp: aj.time
        },
        beforeSend: function () {
            $('.loading').show()
        },
        success: function (data) {
            $('.loading').hide()
            var data = JSON.parse(data)
            aj.running = false;
            createList(data)
            aj.start++;
            aj.time = data.data.timestamp
        },
        complete: function (XMLHttpRequest, status) {
            console.log(status);
            if (status == 'timeout' || status == 'error') {//超时,status还有success,等值的情况
                //ajaxTimeOut.abort(); //取消请求
                console.log('timeout')
                $('.loading').hide();
                $('.ref_txt').html('糟糕！网络遇到问题点击屏幕刷新');
                $('#refurbish').css('display', "table");
                $('#refurbish').on('click', function () {
                    $(this).css('display', 'none');
                    location.reload();
                });
                aj.running = false;
                //console.log(e)
            }
        }
    })
}

//----------------篩選時候的查詢展商列表--------------------------------
function searchAj() {
    if (aj.running)
        return;
    aj.running = true;
    console.log(ex_search);
    $.ajax({
        type: 'post',
        url: '/list/list_search',
        data: JSON.stringify(ex_search),
        timeout: 5000,
        beforeSend: function () {
            $('.loading').show()
        },
        success: function (data) {
            aj.running = false;
            $('.loading').hide();
            var data = JSON.parse(data);
            createList(data);
            aj.start++;
            aj.time = data.data.timestamp;
            ex_search.page_id = aj.start;
            ex_search.timestamp = aj.time;
        },
        complete: function (XMLHttpRequest, status) {
            console.log(status);
            if (status == 'timeout' || status == 'error') {//超时,status还有success,等值的情况
                //ajaxTimeOut.abort(); //取消请求
                console.log('timeout')
                $('.loading').hide();
                $('.ref_txt').html('糟糕！网络遇到问题点击屏幕刷新');
                $('#refurbish').show().css('display', "table");
                $('#refurbish').on('click', function () {
                    $(this).css('display', 'none');
                    location.reload();
                });
                aj.running = false;
            }
        }

    })
}

//在創建展商列表的時候 添加收藏狀態
function checkFavorite(id) {
    for (var e in favorite) {
        if (favorite[e] == '1' && e == id) {
            return '<div class="ex_favorite" data-pos="1" style="background: url(/public/img/favoriteS.png)no-repeat; background-size:70% 70%;background-position: 0.3rem 0.3rem;  "></div>'
        }
    }
    return '<div class="ex_favorite" data-pos="0"></div>'
}

function purpose(msg) {
    var result = ''
    if (msg && msg.length > 1) {
        var arr = msg.split('|')
    }
    // console.log(arr)
    if (arr) {
        for (var i = 0, j = arr.length; i < j; i++) {
            result += '<img class="company_purpose_icon" src="' + arr[i] + '"/>'
        }
    }
    return result;
}

function state(state) {

    if (state == '0') {
        return '未开场'
    }
    return '已结束'
}

 function creatDel(level,show){
     var res='';
     console.log(level+'+++++++++'+show)
    if(level=='1'){
        res+='<div data-pos="1"class="personalDel" style=" width: 2rem;height: 2rem;position: absolute;top: 0;bottom: 0;right: 2.5rem ;margin: auto;background: url(/public/img/favoriteDel.png); background-size:90% 90%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
       if(show=='1'){
           res+='<div data-pos="1" class="showControl" style="background: url(/public/img/gou.png); background-size:90% 90%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
       }else{
           res+='<div data-pos="0" class="showControl" style="background: #fff;"></div>'
       }
    }
     return res;
 }

function createList(data) {
    var list = '';
    console.log(statusList)
    console.log(aj.time)
    console.log(data)
    var da = data.data;
    if (data.data && da.list['0']) {
        for (var e in da.list) {
            var d = da.list[e]
            list += '<div class="lay_item">'
                + '<div id=' + d.game_id + ' class="exhibitors_item">'
                + '<div class="exhibitor_intro">'
                + checkFavorite(d.game_id)
                + '<div class="ex_name">' + d.game_name + '</div>'
                + '<div>'
                + '<span class="ex_country">' + d.game_start_date + '</span>'
                + '<span class="ex_layout">' + state(d.game_status) + '</span>'
                + '</div>'
                + '</div>'
                + '<div class="exhibitor_detail">'
                + '<div class="ex_img" style="display: none;"></div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].address + '</span>'
                + '<span>' + d.game_type + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].intro + '</span>'
                + '<span>' + d.game_intro + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].green + '</span>'
                + '<span>' + d.tag_number + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].type + '</span>'
                + '<span>' + d.user_name + '</span>'
                + '</div>'
                + '<div class="ex_option" style="position: relative;">'
                + '<div id= "' + d.game_id + '" class="ex_share" style="background:url(../public/img/shared.png); -webkit-background-size:100% 100%;background-size:100% 100%;"></div>'
                +creatDel(da.user_authority_level,d.game_show_status)
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>'
        }
        if (aj.time == 0) {
            ex_list.innerHTML = list;
        } else {
            ex_list.innerHTML += list;
        }
    }
    else {
        if (aj.time == 0) {
            $('#ex_list_con').html('<div id="noneResult">没有符合筛选条件的结果</div>')
        }
         else{
            aj.running=true;
         }
    }
    pullDownOffset = $('#scroll_r').height();
    if (flag) {
        myScroll_quick.refresh();
    }
}

exResize();
function exResize() {
    $('#type_container').css('height', document.body.scrollHeight - ($('#ex_type')[0].clientHeight + $('#exhibitor_search')[0].clientHeight) + 'px');
    $('.tag_container').css('height', document.body.scrollHeight - ($('#ex_type')[0].clientHeight + $('#exhibitor_search')[0].clientHeight + $('#submitSearch')[0].clientHeight  ) + 'px');
}

$('#exhibitor_list').on('scroll', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($('#ex_list_con')[0].offsetHeight - $('#exhibitor_list')[0].scrollTop <= ($('#exhibitor_list')[0].offsetHeight + 20)) {
        if (statusList == 'list') {
            ajS();
        } else {
            searchAj()
        }
    }
})

//    展館頁面點擊展開展商詳情
$('#ex_list_con').on('click', '.exhibitor_intro', function (e) {
    e.stopPropagation()
    // console.log($(this)[0])
    // console.log($(this).next('.exhibitor_detail').is(':hidden'))
    // console.log($(this).parent('.exhibitors_item')[0].offsetTop)
    if ($(this).next('.exhibitor_detail').is(':hidden')) {
        $('.exhibitor_intro').next('.exhibitor_detail').hide();
        $(this).next('.exhibitor_detail').show();
    } else {
        $(this).next('.exhibitor_detail').hide();
    }

    if (flag) {
        myScroll_quick.refresh();
        myScroll_quick.scrollToElement($(this).parent('.exhibitors_item')[0], 0);
    } else {
        $('#exhibitor_list')[0].scrollTop = $(this).parent('.exhibitors_item')[0].offsetTop;
    }

})

//    分類搜索


var num = 0;
var type_num = {
    game_type: 0,
    game_start_date: 0,
    game_sponsor: 0,
    game_status: 0
};
var arr = ['game_type', 'game_start_date', 'game_sponsor', 'game_status'];
function reset() {
    for (var e in ex_search) {
        if (e != 'keywords') {
            ex_search[e] = [];
        }
    }
}
$('#submitSearch').html(searchLst[language].submit);
$('#ipt_search')[0].setAttribute('placeholder', searchLst[language].placeholder)
function resetTime() {
    statusList = 'search'
    aj.time = 0;
    aj.start = 0;
    ex_search.page_id = aj.start;
    ex_search.timestamp = aj.time;
}

//取消筛选的时候进行ajax----------------------------------2-----------------------------
$('#exhibitor_search_s').on('click', function () {
    if ($('#type_container').is(':hidden')) {

        $('#exhibitor_list').hide();
    } else {
        $('#exhibitor_list').show();
    }
    if ($(this)[0].getAttribute('data-cho') == '0') {
        //点击筛选时列出列表
        $('#type_container').show();
        var select = ''
        for (var i = 0, j = $('#type_container').children('.tag_container').length; i < j; i++) {
            if (!$('.tag_container').eq(i).is(':hidden')) {
                select = $('.tag_container').eq(i);
                $('.choose_tag').eq(i).css({background: '#fff', color: '#5f5f5f'})
            }
        }
        if (select == '') {
            $('.tag_container').eq(0).show();
            $('.choose_tag').eq(0).css({background: '#fff', color: '#5f5f5f'})
        }
        var tag = $('#exhibitor_type_search').children('.tags');
        for (var i = 0, j = tag.length; i < j; i++) {
            checkPosition(tag[i]);
        }
        $('#exhibitor_search_s').html(searchLst[language].cancel).attr('data-cho', '1')
    }
    else {
        //点击取消筛选进行取消Ajax
        reset()//清空搜索条件，除了关键词
        resetTime()//重置搜索页和时间戳的初始化。
        $('#ex_type .choose_tag').css({
            background: '#1cb8cf', color: '#fff'
        })
        for (var m = 0, n = $('.tags').length; m < n; m++) {
            $('.tags').eq(m).attr('data-position', '1');
            var ele = $('.tags').eq(m);
            checkPos(ele);
        }
        for (var e in type_num) {
            type_num[e] = 0;
        }
        num = 0;
        $('#ex_type').children('.choose_tag').children('.cho_num').html(' - ');
        $('#exhibitor_search_s').html(searchLst[language].filter).attr('data-cho', '0');
        searchAj()
        $('#type_container').hide();
        $('#ex_type .choose_tag').css({
            background: '#1cb8cf', color: '#fff'
        });
    }
    exResize();
});

$('#ex_type').on('click', '.choose_tag', function () {
    var ind = $(this).index();
    $('#ex_type .choose_tag').css({
        background: '#1cb8cf', color: '#fff'
    });

    $(this).css({background: '#fff', color: '#5f5f5f'});
    if ($('#type_container').children('.tag_container').eq(ind).is(':hidden')) {
        $('#type_container').show().children('.tag_container').hide().eq(ind).show();
        $('#exhibitor_search_s').html(searchLst[language].cancel).attr('data-cho', '1')

    } else {
        $('#ex_type .choose_tag').css({
            background: '#1cb8cf', color: '#fff'
        });
        $('#type_container').hide().children('.tag_container').hide();
        $('#exhibitor_search_s').html(searchLst[language].filter).attr('data-cho', '0')
    }
    console.log($('#type_container').is(':hidden'))

    if ($('#type_container').is(':hidden')) {
        $('#exhibitor_list').show();
    } else {
        $('#exhibitor_list').hide();
    }


    exResize();
});
$('#type_container').on('click', '.tags', function () {
    var ele = $(this);
    var ind = parseInt(ele.attr('data-type'));
    if (ind == 3) {
        //单选
        if (ele.attr('data-position') == '0') {
            ele.parents('.tag_container').children('.tags').attr('data-position', '0').children('.tag_cho').css('background', '#fff');
            ele.attr('data-position', '1').children('.tag_cho').css({
                'background': 'url(/public/img/gou.png)',
                'background-size': '100% 100%'
            });
            type_num[arr[ind]] = 1;
            $('#ex_type').children('.choose_tag').eq(ind).children('.cho_num').html(type_num[arr[ind]]);
        }
        else {
            ele.parents('.tag_container').children('.tags').attr('data-position', '0').children('.tag_cho').css('background', '#fff');
            type_num[arr[ind]] = 0;
            $('#ex_type').children('.choose_tag').eq(ind).children('.cho_num').html('-');
        }

    } else {
        checkPos(ele, ind);
    }
});
function checkPos(ele, ind) {
    var index = parseInt(ele.attr('data-type'));
    if (ele.attr('data-position') == '0') {
        ele.attr('data-position', '1').children('.tag_cho').css({
            'background': 'url(/public/img/gou.png)',
            'background-size': '100% 100%'
        });
        type_num[arr[index]]++;
        num++;
        $('#ex_type').children('.choose_tag').eq(ind).children('.cho_num').html(type_num[arr[index]]);

    }
    else if (ele.attr('data-position') == '1') {
        ele.attr('data-position', '0').children('.tag_cho').css('background', '#fff');
        type_num[arr[index]]--;
        $('#ex_type').children('.choose_tag').eq(ind).children('.cho_num').html(type_num[arr[index]]);

        if (type_num[arr[index]] <= 0) {
            type_num[arr[index]] = 0;
            $('#ex_type').children('.choose_tag').eq(ind).children('.cho_num').html(' - ');
        }
        num--;
    }

}
//提交搜索，进行ajax到後台查詢數據----------3---------------------
$('#type_container').on('click', '#submitSearch', function () {
//    每次提交搜索进行搜索页和时间戳的初始化。
    reset();
    resetTime()
    $('#exhibitor_list').show();
    for (var i = 0, j = $('.tags').length; i < j; i++) {
        var tag = $('.tags').eq(i)[0];
        var th = $('.tags').eq(i);
        var word = tag.getAttribute('id');
        if (tag.getAttribute('data-position') == '1') {
            ex_search[arr[parseInt(tag.getAttribute('data-type'))]].push(word);
        }
    }
    searchAj()
    $('#type_container').hide();
    $('#ex_type .choose_tag').css({
        background: '#1cb8cf', color: '#fff'
    });
    exResize();
});

//输入内容筛选部分
$("#exhibitor_search").on('click', '#exhibitor_search_i', function () {
    $('#exhibitor_input_search').show();
    $('#ipt_search').focus();
    $('#ipt_history_container').css('height', $('#exhibitor_input_search').height() - $('#ipt_history_container')[0].offsetTop + 'px')
    historySearch()
    checkWord()
})

function historySearch() {
    var str = ''
    // alert(typeof history_search)
    if (history_search.length > 0) {
        // $('#ipt_search_history').show();
        for (var i = 0, j = history_search.length; i < j; i++) {
            str += ' <div class="search_tag">' + history_search[i] + '</div>'
        }
        str += ' <div id="clear_ipt_history">' + searchLst[language].clear + '</div>'
    } else {
        // $('#ipt_search_history').hide();
    }
    $('#ipt_history_container').html(str);
}

document.onkeyup = function () {
    checkWord()
}

function checkWord() {
    var value = $('#ipt_search').val();
    if (value != '') {
        $('#ipt_submit').html(searchLst[language].search).attr('data-type', '1')
    } else {
        $('#ipt_submit').html(searchLst[language].cancel).attr('data-type', '0')
    }
}

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

//输入界面确定搜索进行ajax数据查询--------------------------4---------------------------------
$('#ipt_submit').on('click', function () {
    ex_search.keywords = [];//清空搜索关键词
    resetTime();
    var type = $(this).attr('data-type');
    if (type == '1') {
        //点击搜索，并把添加搜索条件和搜索栏和历史记录
        ex_search.keywords.push($('#ipt_search').val().trim());
        var a = true;
        for (var i = 0, j = history_search.length; i < j; i++) {
            if (history_search[i] == $('#ipt_search').val().trim()) {
                a = false;
                break;
            }
        }
        if (a) {
            history_search.push($('#ipt_search').val().trim())
        }
        localStorage.setItem('history_search', JSON.stringify(history_search));
        var str = '<div class="ipt_s">' + $('#ipt_search').val().trim() + '</div>' + '<div class="ipt_s_right">×</div>'
        $('#exhibitor_search_i').html(str)
    } else {
        //点击清空不进行搜索
        $('#exhibitor_search_i').html(searchLst[language].search)
    }
    searchAj()
    $('#exhibitor_input_search').hide();
})
//清空输入框
$('#ipt_cancel').on('click', function () {
    $('#ipt_search').val('');
    checkWord();
})
//点击历史搜索或者热门搜索添加进入输入框
$('#exhibitor_input_search').on('click', '.search_tag', function () {
    $('#ipt_search').val($(this)[0].childNodes[0].nodeValue)
    checkWord();
});
$('#exhibitor_input_search').on('click', '#clear_ipt_history', function () {
    history_search = [];
    localStorage.removeItem('history_search')
    historySearch();
})
//-------------------------------------------------收藏和取消收藏
$('#ex_list_con').on('click', '.ex_favorite', function (e) {
    e.stopPropagation();
//    点击收藏 进行ajax查询 如果成功 就发送公司id 到后台 如果失败 就进行登录
    var id = $(this).parents('.exhibitors_item').attr('id')
    var tt = $(this);
    var option = ['add', 'remove']
    var sta = $(this).attr('data-pos');
    console.log(option[parseInt($(this).attr('data-pos'))])
    $.ajax({
        type: 'post',
        url: '/list/favorites_' + option[parseInt($(this).attr('data-pos'))] + '_list',
        data: {
            the_year_month: '201703',
            game_id: id
        },
        success: function (msg) {
            var msg = JSON.parse(msg)
            console.log(msg)
            if (msg.Success == '1') {
                if (sta == '0') {
                    //添加收藏
                    favorite[id] = '1';
                    tt.css({
                        'background': 'url(/public/img/favoriteS.png)no-repeat',
                        'background-size': '70% 70%',
                        'background-position': '0.3rem 0.3rem'
                    }).attr('data-pos', '1');
                } else {
                    //取消收藏
                    tt.css({
                        'background': 'url(/public/img/favorite.png)no-repeat',
                        'background-size': '70% 70%',
                        'background-position': '0.3rem 0.3rem'
                    }).attr('data-pos', '0')
                    delete favorite[id];
                }
            }
            else if (msg.data.error_code == '2188') {
                selfConfirm(searchLst[language].logmsg, {
                    text: alertMsg[language].sure, fun: function () {
                        window.history.back()                    }
                }, {
                    text: alertMsg[language].cancel, fun: function () {
                    }
                })
            }
        }
    })
});


//设置搜素框内语言
(function () {
    var lang = localStorage.getItem('language');
    if (lang == 'E') {
        $('#ipt_search').attr('placeholder', 'company/Booth Number/. . .');
    } else if (lang == 'T') {
        $('#ipt_search').attr('placeholder', '公司/展位號/產品類別')
    } else {
        $('#ipt_search').attr('placeholder', '场次名称/场次类别')
    }
})()
//场次列表

//改变当前活动场次的接口（用session）
// 页面上显示添加场次，可以进入 我发起的，
// 此页有转到控制按钮 ，控制状态设置为1
// 并在成功的时候提示提示是否立即控制，否则不动 是则转到控制页面
$('#exhibitor_list').on('click', '.ex_share', function (e) {
    e.stopPropagation();
    console.log($(this).attr('id'));
    $.ajax({
        type:'post',
        url:'/personal/active_game',
        data:{
            game_id:$(this).attr('id')
        },
        success:function(data){
            var data=JSON.parse(data);
            if(data.Success=='1'){
                selfConfirm('转到活动控制？',{text:'转到',fun:function(){
                    window.location.href='/control'
                }},{text:'取消',fun:function(){}})
            }
        }
    })

});
//管理员删除
$('#exhibitor_list').on('click','.personalDel',function(e){
    e.stopPropagation();
    console.log('del');
    var self=$(this).parents('.exhibitors_item');
    var id=$(this).parents('.exhibitors_item').attr('id')
    console.log(id);
    selfConfirm('确定删除该场次么？',{text:'确定',fun:function(){
        $.ajax({
            type:'post',
            url:'/personal/game_del',
            data:{
                game_id:id
            },
            success:function(data){
                var data=JSON.parse(data);
                console.log(data);
                //console.log('delSuccess');
                //allList();
                if(data.Success=='1'){
                    console.log('delSuccess');
                    self.hide();
                    if (flag) {
                        myScroll_quick.refresh();
                    }
                    //allList();
                    //window.location.reload();
                }
            }
        })
    }},{text:'取消',fun:function(){}})


});
//管理员控制是否显示
$('#exhibitor_list').on('click','.showControl',function(e){
    var status='0';
    var self=$(this);
    var id=$(this).parents('.exhibitors_item').attr('id')
    if($(this).attr('data-pos')=='0'){
    //    点击设置成显示
        status='1'
        $(this).attr('data-pos','1')
    }else{
    //    点击设置成不显示
        status='0'
        $(this).attr('data-pos','0')

    }
    console.log(status)

    $.ajax({
        type:'post',
        url:'/list/show_control',
        data:{
            type:status,
            id:id
        },
        success:function(data){
            if(JSON.parse(data).Success=='1'){
                if(status=='0'){
                    console.log('更换不显示')

                    self.css({
                        'background':'#fff'
                    })
                }else{
                    console.log('更换显示')

                    self.css({
                        background: 'url(/public/img/gou.png)',
                    'background-size':'90% 90%',
                    'background-position': '0.3rem 0.3rem',
                    'background-repeat': 'no-repeat'
                    })
                }
            }

        }
    })

})











