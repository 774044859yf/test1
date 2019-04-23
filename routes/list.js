/**
 * Created by Administrator on 2017/5/2.
 */
var express = require('express');
var mysql = require('mysql');
var sqlConfig = require('../models/default').option;
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var config = require('../config/default');
var router = express.Router();
router.use(bodyParser.urlencoded({extended: false}));
var con = mysql.createConnection(sqlConfig);
con.connect();
//session 中间件
router.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new SessionStore(sqlConfig)
}));


router.get('/', function (req, res) {
    //console.log(req.session.user);
    res.render('showlist');
});
router.post('/list_search_option', function (req, res, next) {
    var sql1 = 'SELECT distinct(game_type) FROM game';
    var sql2 = 'SELECT distinct(game_start_date) FROM game';
    var sql3 = 'select distinct (user.user_name),user.user_id from user inner join game on game.game_sponsor = user.user_id';
    con.query(sql1, function (err, result) {
        var msg = {
            data: {
                search_option: {
                    type: [],
                    date: [],
                    sponsor: []
                }
            }
        }
        if (err) {
            return;
        }
        ////console.log('--------------------------TYPE----------------------------');
        for (var i = 0, j = result.length; i < j; i++) {
            msg.data.search_option.type.push(result[i].game_type)
        }
        //console.log('-----------------------------------------------------------------\n\n');
        con.query(sql2, function (err, result2) {
            if (err) {
                return;
            }
            //console.log('--------------------------date----------------------------');
            for (var k = 0, l = result2.length; k < l; k++) {
                msg.data.search_option.date.push(result2[k].game_start_date)
            }
            con.query(sql3, function (err, result3) {
                if (err) {
                    return;
                }
                //console.log('--------------------------sponser----------------------------');
                for (var n = 0, m = result3.length; n < m; n++) {
                    msg.data.search_option.sponsor.push([result3[n].user_name, result3[n].user_id])
                }
                msg.data.search_option.state = ['0', '1']
                //console.log(msg)
                res.send(JSON.stringify(msg))
            })
        })
    })
});
router.post('/favorites_list', function (req, res, next) {
    //////console.log(req.session.user);
    var msg = {
        Success: '0',
        data: {
            list: []
        }
    }
    if (req.session.user) {
        var sql = 'SELECT * FROM user where user_phone = ' + req.session.user;
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if(result[0].user_favorite_games){
                msg.data.list = result[0].user_favorite_games.split('|');
            }
            msg.Success = '1';
            res.send(JSON.stringify(msg))
        })
    }
    else {
        msg.Success = '1';
        res.send(JSON.stringify(msg))
    }

});
var timestamp = '0';
router.post('/list', function (req, res, next) {
    var msg = {
        Success: '0', data: {
            list: [],
            timestamp: timestamp,
            page_id: req.body.page_id
        }
    };
    var sql;
    if(req.session.user=='13074510530'){
        sql = 'SELECT * FROM game,user where game.game_sponsor = user.user_id limit ' + req.body.page_id * 10 + ',10';
        msg.data.user_authority_level='1'
    }else{
        sql = 'SELECT * FROM game,user where game.game_sponsor = user.user_id and game.game_show_status = 1 limit ' + req.body.page_id * 10 + ',10';
        msg.data.user_authority_level='0'

    }
    console.log(sql)
    if ((req.body.timestamp!='0'&&(msg.data.timestamp == req.body.timestamp))|| req.body.timestamp=='0') {
        con.query(sql, function (err, result) {
            if (err) {
                return;
            }
            msg.Success = '1';
            msg.data.timestamp = new Date().getTime();
            timestamp = msg.data.timestamp;
            ////console.log(msg)
            for (var i = 0, j = result.length; i < j; i++) {
                msg.data.list.push(result[i])
            }
            res.send(JSON.stringify(msg))

        })
    }

});
router.post('/favorites_add_list', function (req, res, next) {
    var msg = {
        Success: '0', data: {
            data:{}
        }
    };
    console.log(req.session.user)
    if(req.session.user){
        var sql = 'SELECT user_favorite_games FROM user where user_phone = ' + req.session.user;
        console.log(sql)
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            var sql1=''
            console.log(result[0].user_favorite_games)
            if(result[0].user_favorite_games&&isntFacorite(req.body.game_id,result[0].user_favorite_games.split('|'))){
                var before=result[0].user_favorite_games.split('|'),after;
                after=before.join('|')+'|'+req.body.game_id;
                 sql1 = 'update user set user_favorite_games = "'+after+'" where user_phone = ' + req.session.user;
            }else{
                sql1 = 'update user set user_favorite_games = "'+req.body.game_id+'" where user_phone = ' + req.session.user;
            }
            con.query(sql1,function(err,result){
                if (err) {
                    ////console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
                console.log(result)
                msg.Success = '1';
                msg.data.option='add'
                msg.data.game_id=req.body.game_id;
                msg.data.user=req.session.user;
                res.send(JSON.stringify(msg))
            })

        })
    }else{
        msg.data.error_code='2188'
        res.send(JSON.stringify(msg))
    }

});
function isntFacorite(id,arr){
    for(var i=0,j=arr.length;i<j;i++){
        if(id==arr[i]){
            return false
        }
    }
    return true;
}
function isFavorite(id,arr){
    for (var i= 0,j=arr.length;i<j;i++){
        if(id==arr[i]){
            return i
        }
    }
    return -1
}
router.post('/favorites_remove_list', function (req, res, next) {
    var msg = {
        Success: '0', data: {
            data:{}
        }
    };
    if(req.session.user){
        var sql = 'SELECT user_favorite_games FROM user where user_phone = ' + req.session.user;
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            if(result[0].user_favorite_games){
                var before=result[0].user_favorite_games.split('|'),after;
            }
            console.log(before)
            var ind=isFavorite(req.body.game_id,before)
            if(ind!=-1){
                console.log(before[ind])
                console.log(req.body.game_id)
                before.splice(ind,1);
                var sql1 = 'update user set user_favorite_games = "'+before.join('|')+'" where user_phone = ' + req.session.user;
                con.query(sql1,function(err,result){
                    if (err) {
                        ////console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    msg.Success = '1';
                    msg.data.option='remove';
                    msg.data.user=req.session.user;
                    msg.data.game_id=req.body.game_id;
                    res.send(JSON.stringify(msg))
                })
            }else{
                msg.Success = '1';
                msg.data.option='remove';
                msg.data.user=req.session.user;
                res.send(JSON.stringify(msg))
            }
        })
    }
    else{
        msg.data.error_code='2188'
        res.send(JSON.stringify(msg))

    }


});
router.post('/show_control',function(req,res){
    var msg={
        Success:'0'
    };
    var sql='update game set game_show_status = "'+req.body.type+'" where game_id ='+req.body.id;
    con.query(sql,function(err,result){
        if (err) throw err;
        msg.Success='1';
        res.send(JSON.stringify(msg));
    })
});
//搜索接口----------------------------------------------------
var timestp = '0';
router.post('/list_search', function (req, res, next) {
    var dd
    for(var e in req.body){
        dd=JSON.parse(e);
    }
    var msg = {
        Success: '0',
        data: {
            list: [],
            timestamp: timestp,
            page_id: dd.page_id
        }
    };

    console.log('搜索条件');
    console.log(dd);
    if(req.session.user=='13074510530'){
        msg.data.user_authority_level='1'
    }else{
        msg.data.user_authority_level='0'
    }
    var sql='select * from game,user where game.game_sponsor = user.user_id';
    for(var e in dd){
        if(dd[e].length>0&&e!='timestamp'&&e!='page_id'&&e!='keywords'){
            sql+=' and ('
            for(var i= 0,j=dd[e].length;i<j;i++){
                sql+=' game.'+e+' = "'+dd[e][i]+'" or'
            }
            sql=sql.substring(0,sql.lastIndexOf('or'))
            sql+=')'
        }
        if(dd['keywords'].length>0){
            sql+=' and ( game.game_name like "%'+dd['keywords'][0]+'%" or game.game_type like "%'+dd['keywords'][0]+'%" or game.game_intro like "%'+dd['keywords'][0]+'%" )'
        }
    }
    sql+= ' limit ' + dd.page_id * 10 + ',10';
    console.log(sql);

    if ((dd.timestamp!='0'&&(msg.data.timestamp == dd.timestamp))|| dd.timestamp=='0') {
        console.log('时间戳对比正确进入查询')
        con.query(sql, function (err, result) {
            if (err) throw err;
            msg.Success = '1';
            msg.data.timestamp = new Date().getTime();
            timestp = msg.data.timestamp;
            for (var i = 0, j = result.length; i < j; i++) {
                msg.data.list.push(result[i])
            }
            res.send(JSON.stringify(msg))

        })
    }

});
module.exports = router;