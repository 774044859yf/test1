var flag = false;
~function () {
    var reg1 = /AppleWebKit.*Mobile/i,
        reg2 = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;

    //->条件成立说明当前页面是运行在移动端设备中的
    if (reg1.test(navigator.userAgent) || reg2.test(navigator.userAgent)) {
        flag = true;
    }
}();
//私人的空间，
//可以编辑自己的场次 添加标签 删除标签 ，删除场次，添加场次

var user_id;
function allList(){
    $.ajax({
        type: 'post',
        url: '/personal/all_list',
        //我发起的，我收藏的
        data: {the_year_month: '201703'},
        success: function (msg) {
            var msg = JSON.parse(msg);
            console.log(msg)
            if (msg.Success == '1') {
                createList(msg);
                user_id=msg.game_sponsor;
                createSchedule(msg);
                swiperInit();
                if (flag){
                    scrollInitC();
                }else {
                    $('#favorite_company').css('overflow', "scroll");
                    $('#favorite_schedule').css('overflow', "scroll");
                }

            }else if (msg.data.error_code == '2188') {
                selfConfirm(searchLst[language].logmsg,{text:alertMsg[language].sure,fun:function(){
                    window.location.href = '/login' + utils._var();
                }},{text:alertMsg[language].cancel,fun:function(){
                    window.location.href = '/index' + utils._var();
                }})
            }

        }

    });
}
allList();


var mySwiper, myScrollC, myScrollS;
var companyList = {};
var scheduleList = {};
var container = document.querySelector('#favoriteContainer');

function scrollInitC() {
    myScrollC = new IScroll('#favorite_company', {freeScroll: true, click: true});
    myScrollS = new IScroll('#favorite_schedule', {freeScroll: true, click: true});
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
    $('.nav_l').on('click', function () {
        mySwiper.slideTo(0, 300, false);
        $('.nav_l').css('background', "#fff").css('color', "#21b7cf");
        $('.nav_r').css('background', "#21b7cf").css('color', "#fff");
    }).css('background', "#fff").css('color',"#21b7cf");
    $('.nav_r').on('click', function () {
        mySwiper.slideTo(1, 300, false);
        $('.nav_l').css('background', "#21b7cf").css('color', "#fff");
        $('.nav_r').css('background', "#fff").css('color', "#21b7cf");
    }).css('background', "#21b7cf").css('color',"#fff");;
}
function state(state) {

    if (state == '0') {
        return '未开场'
    }
    return '已结束'
}
function createList(data) {
    var list = '';
    console.log(data.data);
    var da = data.data.mygame_list;
    console.log(da);
    list += '<div class="swiper-slide"><div id="favorite_company" class="favorites"><div class="favoriteCon"><div class="favorite_list">';
    if (data.data && da['0']) {
        for (var e in da) {
            var d = da[e];
            companyList[d.game_id] = '1';
            list += '<div class="lay_item">'
                + '<div id=' + d.game_id + ' class="exhibitors_item">'

                + '<div class="exhibitor_intro">'
                + '<div class="ex_name game_name">' + d.game_name + '</div>'

                + '<div class="personalEdit" data-pos="1" style=" width: 2rem;height: 2rem;position: absolute;top: 0;bottom: 0;right: 2.5rem ;margin: auto;background: url(/public/img/favoriteEidt.png); background-size:70% 70%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
                + '<div class="personalDel" data-pos="1" style=" width: 2rem;height: 2rem;position: absolute;top: 0;bottom: 0;right:0;margin: auto;background: url(/public/img/favoriteDel.png); background-size:70% 70%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'

                + '<div>'
                + '<span class="ex_country game_start_date">' + d.game_start_date + '</span>'
                + '<span class="ex_layout game_status" data-status="'+ d.game_status+'">' + state(d.game_status) + '</span>'
                + '</div>'

                + '</div>'

                + '<div class="exhibitor_detail">'
                + '<div class="ex_img" style="display: none;"></div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].address + '</span>'
                + '<span class="game_type">' + d.game_type + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].intro + '</span>'
                + '<span class="game_intro">' + d.game_intro + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].green + '</span>'
                + '<span class="tag_number">' + d.tag_number + '</span>'
                + '</div>'
                + '<div class="ex_type">'
                + '<span>限制票数</span>'
                + '<span class="tag_limit">' + d.tag_limit + '</span>'
                + '</div>'
                + '<input type="hidden" class="game_notary" value="'+ d.game_notary+'">'
                + '<div class="ex_type">'
                + '<span>' + companyLst[language].type + '</span>'
                + '<span class="user_name">' + d.user_name + '</span>'
                + '</div>'

                + '<div class="ex_option">'
                + '<div id= "' + d.game_id + '" class="ex_share" style="background:url(../public/img/shared.png); -webkit-background-size:100% 100%;background-size:100% 100%;"></div>'
                + '</div>'

                + '</div>'
                + '</div>'
                + '</div>'
            // der += '<a>' + data[i].letter + '</a>'
        }
    }
    else {
        list +=  noneCompany('company');
    }
    list += '</div></div></div></div>';
    container.innerHTML += list;
}
function createSchedule(data) {
    var list = '';
    var da = data.data.myfavorite_list;
    console.log(da);
    list += '<div class="swiper-slide"><div id="favorite_schedule" class="favorites"><div class="favoriteCon"><div class="favorite_list">';

    if (data.data && da['0']) {
        for (var e in da) {
            var d = da[e];
            scheduleList[d.game_id] = '1';
            list += '<div class="lay_item">'
                + '<div id="' + d.game_id + '" class="exhibitors_item">'

                + '<div class="exhibitor_intro">'
                + '<div class="ex_favorite" data-pos="1" style="background: url(/public/img/favoriteS.png); background-size:70% 70%; background-position:0.3rem 0.3rem; background-repeat: no-repeat;"></div>'
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

                + '<div class="ex_option">'
                + '<div class="ex_share" style="background:url(../public/img/shared.png); -webkit-background-size:100% 100%;background-size:100% 100%;"></div>'
                    // + '<a href="display1.html?floor=' + d.exhibition_hall_no.slice(0,d.exhibition_hall_no.length-1) + 'H&&room=' + d.exhibition_stand_no + '" class="ex_map" style="background:url(./img/listdidian2@2x.png); -webkit-background-size:100% 100%;background-size:100% 100%;"></a>'
                    //+ '<a href="display.html?floor=' + d.exhibition_hall_no + '&&room=' + d.exhibition_stand_no + '" class="ex_map"></a>'
                + '</div>'

                + '</div>'
                + '</div>'
                + '</div>'
            // der += '<a>' + data[i].letter + '</a>'
        }
    }
    else {
        list += noneCompany('schedule');
    }
    list += '</div></div></div></div>';
    container.innerHTML += list;
}
function noneCompany(msg){
    if(msg=='schedule'){
        return '<div id="noneFavorite"><div id="favoriteIcon"><div>'+'没有收藏任何场次'+'</div></div><a href="/list" class="add-favorite">'+'浏览列表'+'</a></div>'
    }else{
        return '<div id="noneFavorite"><div id="favoriteIcon"><div>'+'没有发起任何投票'+'</div></div><a class="add-favorite">'+'创建场次'+'</a></div>'
    }
}
//    展館頁面點擊展開展商詳情
$('#favorite').on('click', '.exhibitor_intro', function () {
    if ($(this).next('.exhibitor_detail').is(':hidden')) {
        $('.exhibitor_intro').next('.exhibitor_detail').hide();
        $(this).next('.exhibitor_detail').show();
    } else {
        $(this).next('.exhibitor_detail').hide();
    }
  if(flag){
      myScrollC.refresh();
      myScrollC.scrollToElement($(this).parent('.exhibitors_item')[0], 0);
  }else {
      $('#favorite_company')[0].scrollTop=$(this)[0].offsetTop;
  }
});

$('#favorite').on('click', '.ex_favorite', function (e) {
    e.stopPropagation();
//    点击收藏 进行ajax查询 如果成功 就发送公司id 到后台 如果失败 就进行登录
    var id = $(this).parents('.exhibitors_item').attr('id');
    var company = $(this).parents('.exhibitors_item');
    console.log(favoriteLst);
    selfConfirm(favoriteLst[language].confirmCancel,
        {text:alertMsg[language].sure,fun:function(){
        $.ajax({
            type: 'post',
            url: '/list/favorites_remove_list',
            data: {
                the_year_month: '201703',
                game_id: id
            },
            success: function (msg) {
                console.log(msg);
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    company.hide();
                    delete scheduleList[msg.data.game_id];
                    console.log(isEmptyObject(scheduleList));
                    console.log(scheduleList);
                    myScrollS.refresh();
                    if (isEmptyObject(scheduleList)) {
                        $('#favorite_schedule')[0].innerHTML = noneCompany('schedule');
                    }
                }
            },
            error:function(){
                selfWebRefresh()
            }
        });
    }},{text:alertMsg[language].cancel,fun:function(){}})
});
//展现页面提交的类型
var subType;
//私人空间
var tags=[];
var delTags=[];
$('.cN').on('click',function(){
    var opt=$(this).attr('id');
    var num=parseInt($('#tagLimit').val());
    var max=parseInt($('#tag_number').val());
    if(opt=='reduceNum'){
    //    减法
        if(num>0){
            num--;
            $('#tagLimit').val(num);
        }
    }else{
        if(num<max-1){
            num++;
            $('#tagLimit').val(num);
        }
    }

})
// 编辑接口
var editGame={};
$('#favorite').on('click','.personalEdit',function(e){
    e.stopPropagation();
    subType='edit';
    clearModel()
    $('#modelHead').html('编辑场次')
    editGame.game_id=$(this).parents('.exhibitors_item').attr('id');
    if($(this).parents('.exhibitors_item').find('.game_status').attr('data-status')=='1'){
        selfAlert('该场次已经结束',{text:'确定',fun:function(){}})
    }else{
        $.ajax({
            type:'post',
            url:'/personal/game_single',
            data:{game_id:editGame.game_id},
            success:function(data){
                var msg=JSON.parse(data).data.detail;

                console.log(msg)
                $('#game_name').val(msg.game_name);
                $('#game_start_date').val(msg.game_start_date);
                $('#game_type').val(msg.game_type);
                $('#addNotary').val(msg.notary_name).attr('data-id',msg.notary_id);
                $('#game_intro').val(msg.game_intro);
                $('#tag_number').val(msg.tag_number);
                $('#tagLimit').val(msg.tag_limit);
                var tag=JSON.parse(data).data.tags;
                var str='';
                console.log(tag);
                if(tag.length>0){
                    for(var i=0,j=tag.length;i<j;i++){
                        str+='<div class="game_tags" data-id="'+tag[i].tag_id+'"><div class="tag_name">'+tag[i].tag_name+'</div><div class="del">×</div></div>'
                    }
                }else{
                    str='显示错误'
                }
                $('#tagContainer').html(str);

                $('#addModel').show();
                console.log(editGame);
            }
        })
    }
});
function clearModel(){
    tags={};
    delTags={};
    $('#game_name').val('');
    $('#game_start_date').val('');
    $('#game_type').val('');
    $('#addNotary').val('');
    $('#game_intro').val('');
    $('#tag_number').val('0');
    $('#tagLimit').val('0');
    $('#modelHead').html('添加场次')
    $('#tagContainer').html('')
}
//添加接口
$('#favorite').on('click','.personalAdd',function(e){
    e.stopPropagation();
    subType='add';
    clearModel();
    $('#addModel').show();
});
$('#favorite').on('click','.add-favorite',function(){
    subType='add';
    clearModel();
    $('#addModel').show();
})
$('#addNotary').on('click',function(){
    //获取公证人列表
    if($('#notary_container').is(':hidden')){
        $.ajax({
            type:'post',
            url:'/personal/notary_list',
            success:function(data){
                var msg=JSON.parse(data);
                console.log(msg);
                if(msg.Success=='1'){
                    var list=msg.data.notary_list;
                    var str='';
                    if(list.length>0){
                        for(var i= 0,j=list.length;i<j;i++){
                            str+='<div class="notarys" id="'+list[i].notary_id+'">'+list[i].notary_name+'</div>'
                        }
                    }else{
                        str+='<div class="notarys" id="un">暂无数据</div>'
                    }
                    $('#notary_container').html(str).show()

                }
            }
        })

    }else{
        $('#notary_container').hide();
    }

})
$('#notary_container').on('click','.notarys',function(){
    if($(this).attr('id')!='un'){
        $('#addNotary').val($(this).html().trim()).attr('data-id',$(this).attr('id'))
    }
    $('#notary_container').hide()
})
//提交场次
$('#subGameAdd').on('click',function(){
    var game={};
    game.game_id=editGame.game_id;
    game.game_name=$('#game_name').val().trim();
    game.game_start_date=$('#game_start_date').val().trim();
    game.game_type=$('#game_type').val().trim();
    game.game_intro=$('#game_intro').val().trim();
    game.tag_number=$('#tag_number').val().trim();
    game.game_sponsor=user_id;
    game.game_notary=$('#addNotary').attr('data-id').trim();
    game.tag_limit=$('#tagLimit').val().trim();
    //var arr=[];
    //for(var e in tags){
    //    arr.push(e)
    //}
    game.tags=tags;
    game.delTags=delTags;
    console.log(game);
    if(parseInt(game.tag_number)<2||game.tag_limit=='0'){
        selfAlert('请至少添加两个标签并设置投票限制',{text:'确定',fun:function(){}})
    }else if(game.game_name==''){
        selfAlert('请填写场次名称',{text:'确定',fun:function(){}})
    }else if(game.game_type==''){
        selfAlert('请填写场次类别',{text:'确定',fun:function(){}})
    }else if(game.game_start_date==''){
        selfAlert('请填写场次开始日期',{text:'确定',fun:function(){}})
    }
    else if(game.game_notary==''){
        selfAlert('请填写场次公证人',{text:'确定',fun:function(){}})
    }else if(parseInt(game.tag_number)-1<parseInt(game.tag_limit)){
        selfAlert('票数限制不超过总数',{text:'确定',fun:function(){}})
    }
    else if(subType=='add'){
        //添加
        $.ajax({
                type: 'post',
                url: '/personal/game_add',
            data: JSON.stringify(game),
                success: function (msg) {
                    var msg = JSON.parse(msg);
                    if (msg.Success == '1') {
                        //$('#addModel').hide();
                        //allList();
                        companyList[msg.game_id]='1'
                        window.location.reload();
                    }
                }
            });

    }
    else{
    //编辑
        $.ajax({
            type: 'post',
            url: '/personal/game_edit',
            data: JSON.stringify(game),
            success: function (msg) {
                var msg = JSON.parse(msg);
                if (msg.Success == '1') {
                    //$('#addModel').hide();
                    //allList();
                    window.location.reload();
                }
            }
        });
    }


});

//添加标签
function notInObject(tag,tags){
    for(var e in tags){
        if(e==tag){
            return false;
        }
    }
    return true;
}
//添加标签
$('#addTag').on('click',function(){
    var tag=$('#tag_name').val().trim();
    if(tag!=''&&notInObject(tag,tags)){
        tags[tag]=0;
        $('#tagContainer')[0].innerHTML+='<div class="game_tags"><div class="tag_name">'+tag+'</div><div class="del">×</div></div>'
        $('#tag_name').val('')
    }else if(!notInObject(tag,tags)){
        selfAlert('标签已存在',{text:'确定',fun:function(){}})
    }
    $('#tag_number').val($('#tagContainer').children('.game_tags').length);
});

//删除标签
$('#favorite').on('click','.del',function(){
    console.log(tags);
    console.log('del');
    $(this).parent('.game_tags').parent('#tagContainer')[0].removeChild($(this).parent('.game_tags')[0]);
    $('#tag_number').val($('#tagContainer').children('.game_tags').length);
    if(subType=='edit'&&notInObject($(this).prev('.tag_name').html().trim(),tags)){
        var id=$(this).parent('.game_tags').attr('data-id');
        //$.ajax({
        //    type:'post',
        //    url:'/personal/tag_del',
        //    data:{
        //        tag_id:id
        //    },
        //    success:function(data){
        //        if(JSON.parse(data).Success=='1'){
        //            console.log('delTagSuccess')
        //        }
        //    }
        //})
        delTags[id]='0'
    }else{
        delete tags[$(this).prev('.tag_name').html().trim()];
        console.log(tags)
    }
});
//删除接口
$('#favorite').on('click','.personalDel',function(e){
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
                    delete companyList[data.game_id];
                    console.log(isEmptyObject(companyList));
                    console.log(companyList);
                    myScrollS.refresh();
                    if (isEmptyObject(companyList)) {
                        $('#favorite_company')[0].innerHTML = noneCompany('company');
                    }
                    myScrollC.refresh();
                    //allList();
                    //window.location.reload();
                }
            }
        })
    }},{text:'取消',fun:function(){}})


});
//关闭
$('#closeModel').on('click',function(err,result){
    $('#addModel').hide();
});

//改变当前活动场次的接口（用session）
// 页面上显示添加场次，可以进入 我发起的，
// 此页有转到控制按钮 ，控制状态设置为1
// 并在成功的时候提示提示是否立即控制，否则不动 是则转到控制页面
$('#favorite').on('click', '.ex_share', function (e) {
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