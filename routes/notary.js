/**
 * Created by Administrator on 2017/5/5.
 */
var express = require('express');
var mysql = require('mysql');
//var con=require('../models/default').connection;
var sqlConfig = require('../models/default').option;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session')
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
    //store: new MongoStore({// 将 session 存储到 mongodb
    //    url: config.mongodb// mongodb 地址
    //})
}));
router.get('/', function (req, res) {
    res.render('notary');
});
router.post('/notary_list', function (req, res) {
    var msg = {
        Success: '0',
        data: {
            notary_list:[],
            authority:'0'
        },
        user_authority_level:'0'
    };
    if(req.session.user){
        var userLevel='SELECT user_authority_level FROM user where user_phone = '+req.session.user;
        con.query(userLevel, function (err, result) {
            if (err) {
                ////console.log('[INSERT ERROR] - ', err.message);
                return;
            }
            msg.user_authority_level=result[0].user_authority_level;
            console.log('用户权限：'+result[0].user_authority_level);
            if(result[0].user_authority_level=='1'){
                var sql = 'SELECT * FROM notary';
                con.query(sql, function (err, result) {
                    if (err) {
                        return;
                    }
                    msg.Success = '1';
                    msg.data.authority='1';
                    for(var i= 0,j=result.length;i<j;i++){
                        msg.data.notary_list.push(result[i]);
                    }
                    res.send(JSON.stringify(msg))
                })
            }else{
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
                    res.send(JSON.stringify(msg))
                })
            }

        })
    }
    else{
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
            res.send(JSON.stringify(msg))
        })
    }

});
router.post('/notary_add',function(req,res){
    console.log(req.body.name);
    var notary={notary_name:req.body.name,notary_position:req.body.position,
        notary_nation:req.body.nation,notary_intro:req.body.intro,notary_status:'0'};
    var msg={
        Success:'0',
        data:notary
    }
    con.query('insert into notary set ?', notary, function(err, result) {
        if (err) throw err;
        console.log('inserted'+notary.name);
        console.log(result.insertId);
        console.log(result);
        console.log('\n');
        res.send(JSON.stringify({Success:'1',id:result.insertId}))
    });
});
router.post('/notary_del',function(req,res){
    console.log(req.body);
    con.query('delete from notary where notary_id = '+parseInt(req.body.del), function(err, result) {
        if (err) throw err;
        console.log('del'+req.body.del);
        console.log(result);
        console.log('\n');
        res.send(JSON.stringify({Success:'1'}))
    });
});
router.post('/notary_edit',function(req,res){
    console.log(req.body)
    var data=req.body;
    var sql='update notary set notary_name = "'+ req.body.name+
        '" , notary_intro = "'+ req.body.intro+
        '" , notary_nation = "'+ req.body.nation+
        '" , notary_position = "'+ req.body.position+
            '" where notary_id = '+req.body.notary_id;
    console.log(sql)
    con.query(sql,function(err,result){
        if (err) throw err;
        console.log(result)
        res.send(JSON.stringify({Success:'1'}))
    })

});
router.post('/notary_control',function(req,res){
    var msg={
        Success:'0'
    };
    var sql='update notary set notary_status = "'+req.body.type+'" where notary_id ='+req.body.id;
    con.query(sql,function(err,result){
        if (err) throw err;
        msg.Success='1';
        res.send(JSON.stringify(msg));
    })
});

module.exports = router;
