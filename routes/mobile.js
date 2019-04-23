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
    res.render('mobile', {
        name: req.params.name
    });
});
var game;
router.post('/set_game',function(req,res){
    game=req.body.game_id;
    res.send(true)
})

router.post('/user_status',function(req,res){
    console.log('user_status'+game);
    console.log(req.session['user_status'+game]);

    if(req.session['user_status'+game]=='0'){
    //    存在
        console.log('-------------false');
        res.send(false);
    }else{
        console.log('-------------true');
        res.send(true);
    }

});
router.post('/set_false',function(req,res){
    req.session['user_status'+game]='0';
    res.send(true);
})
router.post('/clear_user_status',function(req,res){
    req.session['user_status'+game]=null;
    res.send(true)
})
router.post('/get_notary',function(req,res){
    var game=game;
    var msg={
        Success:'0',
        data:{
            list: [],
        }
    };
    console.log('-------------changeNotary-------------');
    console.log(game);
    var sql = 'SELECT game_notarys FROM game where game_id = ' + game;
    con.query(sql, function (err, result) {
        if (err) {
            ////console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        console.log(result)
        var sql3='select * from game where';
        if(result[0].game_notarys){
            var flag=result[0].game_notarys.indexOf('|')>-1;
            if(flag){
                var arr=result[0].game_notarys.split('|');
                for(var i= 0,j=arr.length;i<j;i++){
                    sql3+=' notary_id = '+arr[i]+' or'
                }
                sql3=sql3.substring(0,sql3.lastIndexOf('or'))
            }else{
                sql3+=' notary_id = '+result[0].game_notarys
            }
            console.log(sql3)
            con.query(sql3, function (err, result3) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
                msg.Success = '1';
                for(var m= 0,n=result3.length;m<n;m++){
                    msg.data.list.push(result3[m])
                }
                console.log(result3)
                res.send(JSON.stringify(msg));
            })
        } else{
            msg.Success = '1';
            res.send(JSON.stringify(msg));
        }
    })

});


module.exports = router;