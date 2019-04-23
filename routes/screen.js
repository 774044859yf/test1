/**
 * Created by Administrator on 2017/5/2.
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
router.get('/',function(req,res){
    res.render('screen', {
        name: req.params.name
    });
});
router.get('/',function(req,res){
    var game=req.session.active_game;
    res.render('screen', {
        name: req.params.name
    });
});
router.post('/get_notary',function(req,res){
    var msg={
        Success:'0',
        data:{
            notary_list:[]
        }
    }
    var sql = 'SELECT * FROM notary,game where game.game_notary = notary.notary_id and game.game_id = '+req.body.game_id;
    con.query(sql, function (err, result) {
        if (err) throw err;
        msg.Success = '1';
        for(var i= 0,j=result.length;i<j;i++){
            msg.data.notary_list.push(result[i]);
        }
        res.send(JSON.stringify(msg))})
})

module.exports = router;