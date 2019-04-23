/**
 * Created by Administrator on 2017/5/2.
 */
//投票管理 、公证人管理---------------------------------------------1，2
//管理页：GET /adminvote （adminpeople）

//显示列表           ：POST /listvote （listpeople）
//添加（包含上传图片）：POST /addvote （addpeople）
//编辑（包含上传图片）：POST /editvote （editpeople）
//删除              ：POST /delvote （delpeople）

var express = require('express');
var con = require('../models/default').connection;
var sqlConfig = require('../models/default').option;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session')
var config = require('../config/default');

var router = express.Router();
var user;
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
router.get('/',function(req,res){
    res.render('controlAdmin', {
        name: req.params.name
    });
});

router.post('/active_game',function(req,res){
    var game=req.body.game_id;

    var msg={
        Success:'0',
        data:{
            list: [],
        }
    }
    if(game){
        console.log(game)
        var sql = 'select *  from user inner join game on game.game_sponsor = user.user_id and game_id = '+game;
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            msg.Success = '1';
            for(var i= 0,j=result.length;i<j;i++){
                msg.data.list.push(result[i]);
            }
            res.send(JSON.stringify(msg))
        })
    }else{
        res.send(JSON.stringify(msg))
    }
});

router.post('/active_tags',function(req,res){
    var game=req.body.game_id;
    var msg={
        Success:'0',
        data:{
            list: [],
            user_id:user,
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

            res.send(JSON.stringify(msg))
        })
    }else{
        res.send(JSON.stringify(msg))
    }

});

router.post('/session_game',function(req,res){
    var game=req.session.active_game;
    var msg={
        Success:'0',
        data:{
            list: [],
        }
    }
    if(game){
        console.log(game)
        var sql = 'select *  from user inner join game on game.game_sponsor = user.user_id and game_id = '+game;
        con.query(sql, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            msg.Success = '1';
            for(var i= 0,j=result.length;i<j;i++){
                msg.data.list.push(result[i]);
            }
            res.send(JSON.stringify(msg))
        })
    }else{
        res.send(JSON.stringify(msg))
    }
});

router.post('/session_tags',function(req,res){
    var game=req.session.active_game;
    user=req.session.user;
    var msg={
        Success:'0',
        data:{
            list: [],
            user_id:user,
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

            res.send(JSON.stringify(msg))
        })
    }else{
        res.send(JSON.stringify(msg))
    }

});



module.exports = router;