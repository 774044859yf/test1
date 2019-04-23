/**
 * Created by Administrator on 2017/5/7.
 */
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
//session �м��
router.use(session({
    name: config.session.key,// ���� cookie �б��� session id ���ֶ�����
    secret: config.session.secret,// ͨ������ secret ������ hash ֵ������ cookie �У�ʹ������ signedCookie ���۸�
    resave: true,// ǿ�Ƹ��� session
    saveUninitialized: false,// ����Ϊ false��ǿ�ƴ���һ�� session����ʹ�û�δ��¼
    cookie: {
        maxAge: config.session.maxAge// ����ʱ�䣬���ں� cookie �е� session id �Զ�ɾ��
    },
    store: new SessionStore(sqlConfig)
    //store: new MongoStore({// �� session �洢�� mongodb
    //    url: config.mongodb// mongodb ��ַ
    //})
}));

router.get('/',function(req,res){
    res.render('add', {
        name: req.params.name
    });
});




module.exports = router;