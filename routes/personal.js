/**
 * Created by Administrator on 2017/5/5.
 */
var express = require('express');
var con = require('../models/default').connection;
var sqlConfig = require('../models/default').option;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session')
var config = require('../config/default');
var router = express.Router();
router.use(bodyParser.urlencoded({extended: false}))
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
    //store: new MongoStore({// 将 session 存储到 mongodb
    //    url: config.mongodb// mongodb 地址
    //})
}));


router.get('/', function (req, res) {
    res.render('personal');
});
router.post('/all_list', function (req, res) {
    var msg = {
        Success: '0',
        data: {
            mygame_list:[],
            myfavorite_list:[]
        },
    };
    if (req.session.user) {
        var user='select user_id from user where user_phone = '+req.session.user;
        con.query(user,function(err,result){
            if(err) throw err;
            msg.game_sponsor=result[0].user_id;
            var sql = 'select * from user,game where game.game_sponsor = user.user_id and user_phone = '+ req.session.user;
            console.log(sql);
            con.query(sql, function (err, result) {
                if (err) {
                    return;
                }
                //console.log(result.length);
                for(var i= 0,j=result.length;i<j;i++){
                    msg.data.mygame_list.push(result[i])
                }
                var sql = 'SELECT user_favorite_games FROM user where user_phone = ' + req.session.user;
                con.query(sql, function (err, result) {
                    if (err) {
                        ////console.log('[INSERT ERROR] - ', err.message);
                        return;
                    }
                    console.log(result);
                    //var flag=false;
                    //if(!result[0].user_favorite_games){
                    //
                    //}
                    var sql3='select * from game,user where user.user_id=game.game_sponsor and ( ';
                    if(result[0].user_favorite_games){
                        var flag =result[0].user_favorite_games.indexOf('|')>-1;
                        if(flag){
                            var arr=result[0].user_favorite_games.split('|');
                            for(var i= 0,j=arr.length;i<j;i++){
                                sql3+=' game_id = '+arr[i]+' or'
                            }
                            sql3=sql3.substring(0,sql3.lastIndexOf('or'))
                            sql3+=' )'
                        }else{
                            sql3+=' game_id = '+result[0].user_favorite_games+' )'
                        }
                        //console.log(sql3)
                        con.query(sql3, function (err, result3) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                                return;
                            }
                            msg.Success = '1';
                            for(var m= 0,n=result3.length;m<n;m++){
                                msg.data.myfavorite_list.push(result3[m])
                            }
                            //console.log(result3)
                            res.send(JSON.stringify(msg))
                        })
                    } else{
                        msg.Success = '1';
                        res.send(JSON.stringify(msg))
                    }
                })
            })
        })


    } else {
        msg.data.error_code = '2188'
        res.send(JSON.stringify(msg))
    }
});
router.post('/active_game',function(req,res){
    req.session.active_game=req.body.game_id;
    var msg={
        Success:'1'
    }
    res.send(JSON.stringify(msg))
});
router.post('/active_tags',function(req,res){
    var game=req.body.active_game;
    var msg={
        Success:'0',
        data:{
            list: [],
            user_id:req.session.user,
        }
    }
    if(game){
        console.log(game)
        var sql = 'select * from tags where games_id = '+game;
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            console.log(result)
            if(result.length>1){
                for(var i= 0,j=result.length;i<j;i++){
                    msg.data.list.push(result[i]);
                }
            }
            msg.Success = '1';
            res.send(JSON.stringify(msg));
        })
    }else{
        res.send(JSON.stringify(msg))
    }

});
router.post('/notary_list',function(req,res){
    var msg = {
        Success: '0',
        data: {
            notary_list:[],
            authority:'0'
        }
    }
    var sql = 'SELECT * FROM notary where notary_status = 1';
    con.query(sql, function (err, result) {
        if (err) {
            ////console.log('[INSERT ERROR] - ', err.message);
            return;
        }
        msg.Success = '1';
        for(var i= 0,j=result.length;i<j;i++){
            msg.data.notary_list.push(result[i]);
        }
        console.log('根据用户权限查出的结果')
        res.send(JSON.stringify(msg))})
})
router.post('/game_add',function(req,res){
    var msg={
        Success:'0',

    };
    console.log(req.body);
    for(var t in req.body){
        var request=JSON.parse(t);
    }
    var insert={
        game_name:request.game_name,
        game_start_date:request.game_start_date,
        game_type:request.game_type,
        game_intro:request.game_intro,
        tag_number:parseInt(request.tag_number),
        game_sponsor:request.game_sponsor,
        game_notary:request.game_notary,
        tag_limit:request.tag_limit,
    }
    var tags=request.tags
    con.query('insert into game set ? ',insert,function(err,result){
        if (err) throw err;
        console.log('inserted'+insert.game_name);
        msg.game_id=result.insertId;
        console.log(result.insertId);
        console.log(result);
        console.log('\n');
        for(var e in tags){
            console.log(e);
            var sql1='insert into tags set tag_name = "'+e+'" , games_id = "'+result.insertId+'"';
            con.query(sql1,function(err,result){
                if (err) throw err;
            })
        }
        msg.Success='1';
        res.send(JSON.stringify(msg))
    })
});
router.post('/game_del',function(req,res){
    console.log(req.body.game_id);
    var msg={
        Success:'0',
        game_id:req.body.game_id
    };
    var sql='delete from game where game_id = '+req.body.game_id;
    con.query(sql,function(err,result){
        if (err) throw err;
        console.log(result);
        if(req.body.game_id==req.session.active_game){
            req.session.active_game=null;
        }
        msg.Success='1';
        res.send(JSON.stringify(msg))
    })

});
router.post('/game_edit',function(req,res){
    var msg={
        Success:'0'
    };
    console.log(req.body);
    for(var t in req.body){
        var request=JSON.parse(t);
    }

    console.log(request);
    var sql='update game set game_name = "'+ request.game_name+
        '" , game_start_date = "'+ request.game_start_date+
        '" , game_type = "'+ request.game_type+
        '" , game_intro = "'+ request.game_intro+
        '" , tag_number = "'+ request.tag_number+
        '" , game_sponsor = "'+ request.game_sponsor+
        '" , tag_limit = "'+ request.tag_limit+
        '" , game_notary = "'+ request.game_notary+
        '" where game_id = '+request.game_id;
    console.log(sql)
    var tags=request.tags;
    var delTags=request.delTags;
    con.query(sql,function(err,result){
        if (err) throw err;
        console.log(result);
        console.log(tags)
        //添加
        if(tags){
            console.log('+++++++++++++++'+true);
            for(var u in tags){
                console.log(u);
                var sql1='insert into tags set tag_name = "'+u+'" , games_id = "'+request.game_id+'"';
                con.query(sql1,function(err,result){
                    if (err) throw err;
                })
            }
        }
        //删除
        if(delTags){
            console.log(delTags);
            for(var o in delTags){
                var sql2='delete from tags where tag_id = '+o;
                console.log(sql2);
                con.query(sql2,function(err,result2){
                    if (err) throw err;
                })
            }
        }

        msg.Success='1';
        res.send(JSON.stringify(msg))
    })

});
router.post('/game_single',function(req,res){
    var id=req.body.game_id;
    var msg={
        Success:'0',
        data:{
            tags:[],
            detail:{}
        }
    }
    var sql = 'select *  from notary,game where game.game_notary = notary.notary_id and game_id = '+id;
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) throw err;
        msg.data.detail=result[0];
        console.log(result[0])
        var sql1 = 'select *  from tags where games_id = '+id;
        console.log(sql1)

        con.query(sql1,function(err,result1){
            if (err) throw err;
            for(var i= 0,j=result1.length;i<j;i++){
                msg.data.tags.push(result1[i])
            }
            msg.Success = '1';
            console.log(result)
            res.send(JSON.stringify(msg))
        })
    })
})
router.post('/tag_del',function(req,res){
    var id=req.body.tag_id;
    var sql='delete from tags where tag_id = '+id;
    con.query(sql,function(err,result){
        if (err) throw err;
        res.send(JSON.stringify({Success:'1'}))
    })
})
module.exports = router;
