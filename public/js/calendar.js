var flag = false;
~function () {
    var reg1 = /AppleWebKit.*Mobile/i,
        reg2 = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;

    //->条件成立说明当前页面是运行在移动端设备中的
    if (reg1.test(navigator.userAgent) || reg2.test(navigator.userAgent)) {
        flag = true;
    }
}();
var mySwiper, myScrollS;
var container = document.querySelector('.favorite_list');

function scrollInitC() {
    myScrollS = new IScroll('#favorite_schedule', {freeScroll: true, click: true});
}
var userLevel;
var listOnce = true;
function notaryList() {
    $.ajax({
        type: 'post',
        url: '/notary/notary_list',
        data: {the_year_month: '201703'},
        success: function (msg) {
            var msg = JSON.parse(msg);
            if (msg.Success == '1') {
                userLevel = msg.user_authority_level;
                createSchedule(msg);
                checkLevel();
                scrollInitC();
                //if(listOnce){
                //    console.log('listOnce')
                //    listOnce=false;
                //    console.log(flag)
                //    if (flag){
                //        scrollInitC();
                //    }else {
                //        $('#favorite_company').css('overflow', "scroll");
                //        $('#favorite_schedule').css('overflow', "scroll");
                //    }
                //}else{
                //    console.log('listMany')
                //    myScrollS.refresh();
                //}
            }
        }
    });
}
notaryList();

function checkLevel() {
    console.log(userLevel);
    if (userLevel == '1') {
        $('#favorite')[0].innerHTML += '<div id="notaryAdd" class="notaryAdd">+</div>'
    }
}
function swiperInit() {
    mySwiper = new Swiper(".swi", {
        direction: "horizontal",
        observer: true,
        threshold: 100,
        onSlideChangeEnd: function (aa) {
            console.log(mySwiper.activeIndex);
            if (mySwiper.activeIndex == 0) {
                $('.nav_l').css('background', "#fff").css('color', "#21b7cf");
                $('.nav_r').css('background', "#21b7cf").css('color', "#fff");
            } else {
                $('.nav_l').css('background', "#21b7cf").css('color', "#fff");
                $('.nav_r').css('background', "#fff").css('color', "#21b7cf");
            }
        }
    });
}
function userCheck(userLevel) {
    var list = ''
    console.log(userLevel);
    if (userLevel == '1') {
        list += '<div class="apply_for notaryDel" data-pos="1"></div>'
            + '<div class="icon notaryEdit" data-pos="1" style=" position: absolute; margin: auto; right:0;width: .85rem; left: 0; bottom:2.5rem; height: .85rem; background:url(/public/img/5.png); -webkit-background-size:100% 100%;background-size:100% 100%;"></div>'
    }
    return list;
}
function creatDel(level,show){
    var res='';
    console.log(level+'+++++++++'+show)
    if(level=='1'){
        if(show=='1'){
            res+='<div data-pos="1" class="showControl" style=" z-index:99; width: 1.5rem;height:1.5rem;position: absolute;top: 0;right: 0 ;left: 0; border: 1px solid #5f5f5f;margin: auto;background-image: url(/public/img/gou.png); background-color:#fff;  background-size:90% 90%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
        }else{
            res+='<div data-pos="0" class="showControl" style="z-index:99; width: 1.5rem;height: 1.5rem;position: absolute;top: 0;right: 0 ;left: 0; border: 1px solid #5f5f5f;margin: auto;background: #fff; background-size:90% 90%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
        }
    }
    return res;
}
function createSchedule(data) {
    var list = '';
    var da = data.data.notary_list;
    console.log(userLevel);
    userLevel = data.user_authority_level;
    if (data.data && da['0']) {
        for (var e in da) {
            var d = da[e];
            console.log(d)
            list += '<div class="purses" id="' + d.notary_id + '">'
                + '<div class="timeContainer">'
                + userCheck(userLevel)
                +creatDel(userLevel, d.notary_status)

                + '</div>'
                + '<div class="purseDetail">'
                + '<div class="purseName name">' + d.notary_name + '</div>'
                + '<div class="par_list clear" >'
                + '<span class="par_l">' + '民族' + '</span>'
                + '<span class="par_r nation">' + d.notary_nation + '</span>'
                + '</div>'
                + '<div class="par_list clear">'
                + '<span class="par_l">' + '职务' + '</span>'
                + '<span class="par_r position">' + d.notary_position + '</span>'
                + '</div>'
                + '<div class="par_list clear">'
                + '<span class="par_l">' + '简介' + '</span>'
                + '<span class="par_r intro">' + d.notary_intro + '</span>'
                + '</div>'
                + '</div>'
                + '<div style="clear: both;"></div>'
                + '</div>';
        }


    } else {
        list += noneCompany('schedule');
    }
    container.innerHTML = list;

}

function noneCompany(msg) {
    return '<div id="noneFavorite"><div id="favoriteIcon"><div>暂无数据</div></div><a class="notaryAdd">添加公证人</a></div>'
}

//管理员
//公证人添加，编辑，删除，控制是否显示
//添加
$('#favorite').on('click', '.notaryAdd', function () {
    $('#addModel').show();
    $('#name').val('');
    $('#position').val('');
    $('nation').val('');
    $('intro').val('')
});
//确定添加
function checkAdd(add) {
    var result = '';
    var flag = true;
    if (add.name == '') {
        flag = false;
        result = '请填入公证人姓名'
    }
    if (add.nation == '') {
        flag = false;
        result = '请填入公证人民族'
    }
    if (add.position == '') {
        flag = false;
        result = '请填入公证人职务'
    }
    if (add.intro == '') {
        flag = false;
        result = '请填入公证人简介'
    }
    if (!flag) {
        selfAlert(result, {
            text: '确定', fun: function () {
            }
        })
    }
    return flag;
}

$('#favorite').on('click', '#subAdd', function () {
    console.log('submitAdd');
    var add = {};
    add.name = $('#name').val().trim();
    add.position = $('#position').val().trim();
    add.nation = $('#nation').val().trim();
    add.intro = $('#intro').val().trim();
    if (checkAdd(add)) {
        console.log(add);
        $.ajax({
            type: 'post',
            url: '/notary/notary_add',
            data: {
                the_year_month: '201703',
                detail: add,
                name: add.name,
                position: add.position,
                nation: add.nation,
                intro: add.intro
            },
            success: function (msg) {
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    console.log(msg.id);
                    console.log(add);
                    console.log(userLevel);
                    window.location.reload();
                    //var list='';
                    //list += '<div class="purses" id="' + msg.id+ '">'
                    //    + '<div class="timeContainer">'
                    //    +userCheck(userLevel)
                    //    + '</div>'
                    //    + '<div class="purseDetail">'
                    //    + '<div class="purseName">' + add.name + '</div>'
                    //    + '<div class="par_list clear">'
                    //    + '<span class="par_l">'+'民族'+'</span>'
                    //    + '<span class="par_r nation">' + add.nation + '</span>'
                    //    + '</div>'
                    //    + '<div class="par_list clear">'
                    //    + '<span class="par_l">'+'职务'+'</span>'
                    //    + '<span class="par_r position">' + add.position + '</span>'
                    //    + '</div>'
                    //    + '<div class="par_list clear">'
                    //    + '<span class="par_l">'+'简介'+'</span>'
                    //    + '<span class="par_r intro">' + add.intro + '</span>'
                    //    + '</div>'
                    //
                    //    + '</div>'
                    //    + '<div style="clear: both;"></div>'
                    //    + '</div>';
                    //console.log(list)
                    //container.innerHTML+=list;
                    //myScrollS.refresh();
                    //$('#addModel').hide();
                }
            }
        });
    }
});
//删除
$('#favorite').on('click', '.notaryDel', function () {
    console.log($(this).parents('.purses').attr('id'));
    var id = $(this).parents('.purses').attr('id');
    var notary = $(this).parents('#' + id)
    selfConfirm('确定删除公证人' + $(this).parents('.purses').children('.purseDetail').children('.purseName').html() + '么？',
        {
            text: '确定', fun: function () {
            $.ajax({
                type: 'post',
                url: '/notary/notary_del',
                data: {
                    del: id,
                },
                success: function (msg) {
                    var msg = JSON.parse(msg);
                    if (msg.Success == '1') {
                        notary.hide();
                        console.log('del');
                        //notaryList();
                        myScrollS.refresh();

                    }
                }
            });
        }
        }, {
            text: '取消', fun: function () {
            }
        }
    )

});
//编辑
var editData = {};
$('#favorite').on('click', '.notaryEdit', function () {
    console.log($(this).parents('.purses').attr('id'));
    editData.notary_id = $(this).parents('.purses').attr('id');
    $("#editModel").find('#notary_name').val($(this).parents('.purses').find('.name').html())
    $("#editModel").find('#notary_intro').val($(this).parents('.purses').find('.intro').html())
    $("#editModel").find('#notary_nation').val($(this).parents('.purses').find('.nation').html())
    $("#editModel").find('#notary_position').val($(this).parents('.purses').find('.position').html());
    $("#editModel").show();

});
$('#favorite').on('click', '#subEdit', function () {
    console.log('subEdit');
    editData.name =  $("#editModel").children('#notary_name').val().trim();
    editData.nation =$("#editModel").children('#notary_nation').val().trim();
    editData.position = $("#editModel").children('#notary_position').val().trim() ;
    editData.intro = $("#editModel").children('#notary_intro').val().trim();
    console.log(editData);
    if(checkAdd(editData)){
        $.ajax({
            type: 'post',
            url: '/notary/notary_edit',
            data:editData ,
            success: function (msg) {
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    window.location.reload();
                    //notaryList()
                    //$('#editModel').hide();
                }
            }
        });
    }


});
$('#favorite').on('click','.modelClose',function(){
    console.log('hidden');
    if($(this).attr('data-type')=='0'){
        $('#addModel').hide();
    }else{
        $("#editModel").hide();

    }
});
//普通用户
//公证人列表
//是否显示
$('#favorite').on('click','.showControl',function(e){
    var status='0';
    var self=$(this);
    var id=$(this).parents('.purses').attr('id')
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
        url:'/notary/notary_control',
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
                        'background-image': 'url(/public/img/gou.png)',
                        'background-size':'90% 90%',
                        'background-position': '0.3rem 0.3rem',
                        'background-repeat': 'no-repeat',
                        'background-color':'#fff'

                    })
                }
            }

        }
    })

})
