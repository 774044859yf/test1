/**
 * Created by Administrator on 2017/5/2.
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
// GET /signin 登录页
router.get('/', function (req, res) {
    res.render('login');
});
router.post('/sendsms', function (req, res, next) {
    var sms;
    var msg = {
        data: {},
        Success: '1'
    };
    req.session.user_phone = req.body.user_phone;
    console.log(req.body.user_phone)
    if (!req.session.timestamp || (req.session.timestamp && ((new Date().getTime() - parseInt(req.session.timestamp)) / 1000) >= 60*2 ) || !req.session.sms) {
        req.session.timestamp = new Date().getTime();
        sms = getSms();
        req.session.sms = sms;
    }
    msg.data.sms_code = req.session.sms;
    console.log(msg.data.sms_code);
    console.log('-----------------');
    res.send(JSON.stringify(msg))
});
router.post('/userinfo', function (req, res, next) {
    var response = {
        data: {
            login_state: '0'
        }
    };
    if (req.session.user) {
        response.data.login_state = '1';
        response.data.user_phone = req.session.user
    }
    res.send(JSON.stringify(response))
});
router.post('/login', function (req, res, next) {
    var code = req.body.sms_code;
    var phone = req.body.user_phone;
    var sql = 'SELECT count(*) FROM user where user_phone = ' + phone;
//查

    var msg = {
        data: {},
        Success: '0',
        res:''
    };

    if (code == req.session.sms && phone == req.session.user_phone) {
//    如果用户存在就把用户名存进sesion
//    不存在就创建用户 并把用户名存进sesion
        msg.Success='1';
        msg.data.res=phone;
        req.session.user=phone;
        con.query(sql, function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                return;
            }

            if(result[0]['count(*)']=='0'){
                var  addSql = 'INSERT INTO user(user_phone,user_register_time) VALUES(?,?)';
                var  addSqlParams = [phone,new Date().getTime()];
//增
                con.query(addSql,addSqlParams,function (err, result) {
                    if(err){
                        console.log('[INSERT ERROR] - ',err.message);
                        return;
                    }
                    console.log('--------------------------INSERT----------------------------');
                    //console.log('INSERT ID:',result.insertId);
                    console.log('INSERT ID:',result);
                    console.log('-----------------------------------------------------------------\n\n');

                })}
        });

    }

   else if (!req.session.sms || code != req.session.sms) {
        msg.Success='0';
        msg.res='验证码错误';
    }

   else if( phone != req.session.user_phone){
        msg.Success='0';
        msg.res='手机号错误';
    }
    res.send(JSON.stringify(msg))
});
router.post('/logout', function (req, res, next) {
    //session.destroy(req.session.user)
    req.session.user = null
    var msg = {};
    if (!req.session.user) {
        msg.Success = '1'
        res.send(JSON.stringify(msg))
    }

});

function getSms() {
    var sms = '';
    for (var i = 0, j = 7; i < j; i++) {
        sms += String(Math.ceil(9 * Math.random()))
    }
    return sms;
}
module.exports = router;