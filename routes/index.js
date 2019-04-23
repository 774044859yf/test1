/**
 * Created by Administrator on 2017/4/22.
 */
//投票管理 、公证人管理---------------------------------------------1，2
//管理页：GET /adminvote （adminpeople）

//显示列表           ：POST /listvote （listpeople）
//添加（包含上传图片）：POST /addvote （addpeople）
//编辑（包含上传图片）：POST /editvote （editpeople）
//删除              ：POST /delvote （delpeople）


//实时操作---------------------------------------------------------3
//投票场次的切换
//公正环节的切换
//保存当场投票数据

//回收站-----------------------------------------------------------4
//还原
//彻底删除

//req.query: 解析后的 url 中的 querystring，如 ?name=haha，req.query 的值为 {name: 'haha'}
//req.params: 解析 url 中的占位符，如 /:name，访问 /haha，req.params 的值为 {name: 'haha'}
//req.body: 解析后请求体，需使用相关的模块，如 body-parser，请求体为 {"name": "haha"}，则 req.body 为 {name: 'haha'}

var express=require('express');
var con=require('../models/default').connection;
var sqlConfig=require('../models/default').option;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session')
var config = require('../config/default');
var router=express.Router();
router.use(bodyParser.urlencoded({extended: false}))
console.log(sqlConfig);
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
    res.render('index', {
        user:req.session.user
    });
});
router.post('/userinfo',function(req,res){
    console.log(req.body);
    //res.send(req.body);
    var response='';
    //var user=req.body.user_info;
    if(req.session.user){
        response=req.session.user
        //console.log(req.session.user)
    }
    res.send(response)
});

module.exports = router;

// 创建 application/json 解析
//var jsonParser = bodyParser.json()
// 创建 application/x-www-form-urlencoded 解析
//var urlencodedParser = bodyParser.urlencoded({ extended: false })
//router.post('/userinfo',urlencodedParser,function(req,res){
//    //console.log(req.body);
//    //res.send(req.body);
//    var response;
//    var user=req.body.user_info;
//    if(user=='none'){
//        response=''
//    }
//
//});