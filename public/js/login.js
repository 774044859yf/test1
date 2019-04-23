var time = localStorage.getItem('time');
if (time) {
    timer();
}
var t;
function isphone(inpurStr) {
    if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(inpurStr))){
        //alert("不是完整的11位手机号或者正确的手机号前七位");
        return false;
    }
    return true;
}

$('#login').on('click', '#getAccess', function () {
    console.log('----------------------------------------------')
    console.log(isphone($('#user input')[0].value))
    if(!isphone($('#user input')[0].value)){
        selfAlert(searchLst[language].alert,{text:alertMsg[language].sure,fun:function(){}})
    }
    if ($(this).attr('data-type') == '0'&&isphone($('#user input')[0].value)) {
//    发送手机号到后台，发送短信
        $.ajax({
            type: 'post',
            url: '/login/sendsms',
            data: {user_phone: $('#user').children('input').val()},
            success: function (msg) {
                var msg = JSON.parse(msg)
                if (msg.Success == '1') {
                    console.log(msg);
                    alert(msg.data.sms_code);
                    var oDate = new Date().getTime();
                    oldData = JSON.stringify(oDate)
                    localStorage.setItem('time', oldData);
                    timer();
                } else {
                    console.log(msg.data.msg)
                }
            }
        })
    }

})

function timer() {
    var old = parseInt(localStorage.getItem('time'))
    clearInterval(T);
    var T = setInterval(function () {
        var curData = new Date().getTime();
        var o = parseInt((curData - old) / 1000);
        if (o <= 60) {
            var tm =60 - o;
            $('#getAccess').html(tm + 's').css({
                'color': '#ffffff',
                'line-height': '1.6rem'
            }).attr('data-type', '1');
        } else {
            clearInterval(T);
            $('#getAccess').html('<div>'+searchLst[language].click+'</div><div>'+searchLst[language].pass+'</div>').attr('data-type', '0');
            localStorage.removeItem('time');
        }
    }, 1000);
}


getUserInfo();

var userStatus;
console.log(lang[language]);
function getUserInfo() {
    $.ajax({
        type: 'post',
        url: '/login/userinfo',
        data: {
            user_language: lang[language]
        },
        success: function (msg) {
            var status = JSON.parse(msg).data.login_state;
            var phone = JSON.parse(msg).data.user_phone;
            //alert(msg);
            console.log(status)
            if (status == '0') {
                userStatus = '0';
                $('#ipt_container')[0].innerHTML = '<div id="user">' +
                    '<div class="login_icon"></div>' +
                    '<input type="tel" placeholder="'+searchLst[language].phone+'"/>' +
                    '</div>' +
                    '<div id="pwd">' +
                    '<div class="login_icon"></div>' +
                    '<input id="sms_code" type="text"/>' +
                    '<div id="getAccess" data-type="0">' +
                    '<div>'+searchLst[language].click+'</div>' +
                    '<div>'+searchLst[language].pass+'</div>' +
                    '</div>' +
                    '</div>' +
                    '<div id="btn">'+searchLst[language].login+'</div>'
            } else {
                userStatus = '1';
                var str='';
                str+='<div id="user_phone"><span class="l">已登录:</span><span>'+phone+'</span></div><div id="btn">'+searchLst[language].logout+'</div>'
                $('#ipt_container')[0].innerHTML = str

            }

        }
    })
}
console.log(utils._var())

$('#login').on('click', '#btn', function () {
    if (userStatus == '0') {
        console.log($('#sms_code').val())
        $.ajax({
            type: 'post',
            url: '/login/login',
            data: {
                user_phone: $('#user').children('input').val(),
                sms_code: $('#sms_code').val()
            },
            success: function (msg) {
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    //window.location.href = '/' + utils._var();
                    window.history.back()
                    console.log(msg.data.user)
                    console.log('--------------------')
                } else {
                    selfAlert(msg.res,{text:alertMsg[language].sure,fun:function(){}})
console.log(msg)
                }

                localStorage.setItem('time', 0);
            }
        })
    } else {
        $.ajax({
            type: 'post',
            url: '/login/logout',
            success: function (msg) {
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    window.location.href = '/login' + utils._var();

                } else {
                    console.log('err')
                }
                localStorage.setItem('time', 0);
            }
        });

    }

})



