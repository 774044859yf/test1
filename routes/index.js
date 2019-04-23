/**
 * Created by Administrator on 2017/4/22.
 */
//ͶƱ���� ����֤�˹���---------------------------------------------1��2
//����ҳ��GET /adminvote ��adminpeople��

//��ʾ�б�           ��POST /listvote ��listpeople��
//��ӣ������ϴ�ͼƬ����POST /addvote ��addpeople��
//�༭�������ϴ�ͼƬ����POST /editvote ��editpeople��
//ɾ��              ��POST /delvote ��delpeople��


//ʵʱ����---------------------------------------------------------3
//ͶƱ���ε��л�
//�������ڵ��л�
//���浱��ͶƱ����

//����վ-----------------------------------------------------------4
//��ԭ
//����ɾ��

//req.query: ������� url �е� querystring���� ?name=haha��req.query ��ֵΪ {name: 'haha'}
//req.params: ���� url �е�ռλ������ /:name������ /haha��req.params ��ֵΪ {name: 'haha'}
//req.body: �����������壬��ʹ����ص�ģ�飬�� body-parser��������Ϊ {"name": "haha"}���� req.body Ϊ {name: 'haha'}

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

// ���� application/json ����
//var jsonParser = bodyParser.json()
// ���� application/x-www-form-urlencoded ����
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