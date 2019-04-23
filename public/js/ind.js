//--------------------------------主页--------------------------------------
getUserInfo();
function getUserInfo() {
    $.ajax({
        type: 'post',
        url: '/userinfo',
        //contentType: "application/json",
        data: {
            the_year_month: '201705',
        },
        success: function (msg) {
            userinfo=msg
            console.log(userinfo);
            console.log('-------------------')
        }
    })
}
$('#ex_type_item').css('height', document.body.scrollHeight - $('#ex_choose').height() + 'px');

var index = document.getElementById('index');

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




