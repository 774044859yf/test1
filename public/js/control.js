/**
 * Created by Administrator on 2017/5/6.
 */
//var socket = io.connect('ws://10.17.121.218:55555');
//var socket = io.connect('ws://10.4.175.162:55555');
var socket = io.connect('ws://192.168.43.109:5555');
//var socket = io.connect('ws://223.104.3.198:5555');
//var socket = io.connect('ws://172.27.188.10:55555');


var vote_statue,game_status;
var container = document.querySelector('#gameContainer');
// 先查询session中场次 ， 没有返回值
var game_detail={};

function state(state) {

    if (state == '0') {
        return '未开场'
    }
    return '已结束'
}
function createTags(data) {
    var msg = data.data.list;
    console.log(msg)
    var list = ''
    if (msg.length > 0) {
        for (var i = 0, j = msg.length; i < j; i++) {
            list += '<div class="active_tags" id="' + msg[i].tag_id + '" >' + msg[i].tag_name + '</div>'
        }
    } else {
        list += '没有标签'
    }
    document.querySelector('#tagsContainer').innerHTML = list;
}

function createList(data) {
    var list = '';
    var da = data.data.list;
    if (data.data && da['0']) {
        user_self=da.user_id;
        if(da.user_id==da.game_sponsor){
            vote_statue=true
        }else{
            vote_statue=false
        }
        for (var e in da) {
            var d = da[e];
            list += '<div class="lay_item">'
                + '<div id=' + d.game_id + ' class="exhibitors_item">'
                + '<div class="exhibitor_intro">'
                + '<div class="ex_name">' + d.game_name + '</div>'
                + '<div>'
                + '<span class="ex_country">' + d.game_start_date + '</span>'
                + '<span class="ex_layout">' + state(d.game_status) + '</span>'
                + '</div>'
                + '</div>'
                + '<div class="exhibitor_detail" style="display: block;">'
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
                + '</div>' + '</div>' + '</div>' + '</div>'
        }
    }
    else {
        list += noneCompany('company');
    }
    container.innerHTML = list;
}
function noneCompany(msg) {

    return '<div id="noneFavorite"><div id="favoriteIcon"><div>' + '没有投票活动' + '</div></div><a class="add-favorite" href="/personal">' + '选择活动' + '</a></div>'

}



socket.emit('controlReady');
socket.on('controlBegin',function(){
    $('#connectMsg').html('连接成功');
    $.ajax({
        type: 'post',
        url: '/control/session_game',
        data: {
            the_year_month: '201703'
        },
        success: function (data) {
            var data = JSON.parse(data);
            if (data.Success == '1') {
                game_detail.intro=data;
                createList(data);
                $.ajax({
                    type: 'post',
                    url: '/control/session_tags',
                    data: {
                        the_year_month: '201703'
                    },
                    success: function (data) {
                        var data = JSON.parse(data);
                        if (data.Success == '1') {
                            game_detail.tags=data;
                            socket.emit('default',game_detail);
                            createTags(data);
                            $.ajax({
                                type: 'post',
                                url: '/mobile/set_game',
                                data: {
                                    the_year_month: '201703',
                                    game_id:game_detail.intro.data.list[0].game_id
                                },
                                success:function(){
                                    console.log('设置成功')
                                }
                            })
                        }
                    }
                })
            } else {
                selfConfirm('暂无活动场次，去我发布的看看吧', {
                    text: '确定', fun: function () {
                        window.location.href = '/personal' + utils._var();
                    }
                }, {
                    text: '取消', fun: function () {
                        window.location.href = '/index' + utils._var();
                    }
                })
            }
        }
    })
});
$('#changeNotary').click(function(){
    socket.emit('changeNotary')
});
$('#changeGame').click(function(){
    socket.emit('changeGame')
});

$('#clearUserSession').click(function(){
    //让用户清空状态
    socket.emit('clear')

})
$('#finishGame').click(function(){
    socket.emit('finished');
    console.log('save')
})
//  如果有返回场次 可以删除 即控制状态设置为0 并刷新页面
//手机端显示该场次

//  场次状态为1 则显示投票结果

//  不是本人的场次  状态为0 ，则显示未开始，
//  是本人的场次  状态为1 ，则显示开始投票，



//  保存投票结果 ，并保存公证人


//  在公证环节给用户看