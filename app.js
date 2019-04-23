/**
 * Created by Administrator on 2017/4/22.
 */
//models: ��Ų������ݿ���ļ�
//public: ��ž�̬�ļ�������ʽ��ͼƬ��
//routes: ���·���ļ�
//views: ���ģ���ļ�
//index.js: �������ļ�
var express = require('express');
var path = require('path');
var url=require("url");
var http = require("http");
var fs = require("fs");

var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

//��ҳ
var indexRouter = require('./routes/index');
//���ƶ�
var controlRouter = require('./routes/control');
//showlist
var listRouter = require('./routes/list');
//��¼
var loginRouter = require('./routes/login');
//�ƶ���

var mobileRouter = require('./routes/mobile');
var addRouter = require('./routes/add');
//��ʾ��
var screenRouter = require('./routes/screen');
//˽�˿ռ�
var personalRouter = require('./routes/personal');
//��ʾ��
var notaryRouter = require('./routes/notary');

app.use('/',indexRouter );
app.use('/index',indexRouter );
app.use('/list', listRouter);
app.use('/control', controlRouter);
app.use('/mobile', mobileRouter);
app.use('/add', addRouter);
app.use('/login', loginRouter);
app.use('/screen', screenRouter );
app.use('/personal', personalRouter );
app.use('/notary', notaryRouter );
// ���þ�̬�ļ�Ŀ¼
app.set('views',path.join(__dirname,'views'));
app.use('/public', express.static('public'));
//html ģ��
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// ��������ļ��ϴ����м��
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname,'public/upload/img'),// �ϴ��ļ�Ŀ¼
    keepExtensions: true// ������׺
}));
app.use(flash());

// ����ģ��ȫ�ֳ���
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};
//wx.showMenuItems({
//    menuList: [
//        "menuItem:copyUrl",
//        'menuItem:share:appMessage',
//        'menuItem:share:timeline',
//        "menuItem:share:qq",
//        "menuItem:favorite",
//        "menuItem:profile",
//        "menuItem:openWithSafari",
//        "menuItem:openWithQQBrowser"
//    ]
//});
// ���ģ��������������
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//�����ڵ��� res.render ��ʱ��Ͳ��ô������ĸ������ˣ�
// express Ϊ�����Զ� merge ��������ģ�壬
// �������ǿ�����ģ����ֱ��ʹ�����ĸ�������
//app.get('/', function (req, res) {
//    if (req.session.sign) {//����û��Ƿ��Ѿ���¼
//        console.log(req.session);//��ӡsession��ֵ
//        res.send('welecome <strong>' + req.session.name + '</strong>, ��ӭ���ٴε�¼');
//    } else {//����չʾindexҳ��
//        req.session.sign = true;
//        req.session.name = '������';
//        res.end('��ӭ��½��');
//    }
//});

// ·��
//routes(app);

io.on('connection', function (socket) {

    socket.on('aa', function (obj) {
        io.sockets.emit('aa', obj);
    });
    socket.on('clear', function () {
        dataA = {};
        dataB = {};
        io.sockets.emit('refresh');
    });
    socket.on('dataBase', function (obj) {
        if (live == 'A') {
            for (var i = 0; i < obj.length; i++) {
                if (dataA[obj[i][0] + obj[i][1]]) {
                    dataA[obj[i][0] + obj[i][1]]++
                } else {
                    dataA[obj[i][0] + obj[i][1]] = 1;
                }
            }
        } else {
            for (var i = 0; i < obj.length; i++) {
                if (dataB[obj[i][0] + obj[i][1]]) {
                    dataB[obj[i][0] + obj[i][1]]++
                } else {
                    dataB[obj[i][0] + obj[i][1]] = 1;
                }
            }
        }
    });
    socket.on('reload', function () {
        if (live == 'A') {
            io.sockets.emit('init', dataA);
        } else {
            io.sockets.emit('init', dataB);
        }
        // console.log(data);
    });
    //���ܿ��ƶ˷��͵ĳ�������
    socket.on('send_changci', function (data) {
        console.log(data);
        live = data;
        io.sockets.emit('change', data);
    });
    //����Ŀǰ��ʾ��ҳ�����
    io.sockets.emit('success', '�ͻ������ӳɹ�');
    //�ֻ��˴�ʱ��ʾ��ǰҳ��
    io.sockets.emit('news', new_num);
    socket.on('send_msg', function (data) {
        new_num = data;
        io.sockets.emit('news', data);
    });
    socket.on('begin',function(scd){
        io.sockets.emit('begin',scd);
        console.log('begin')
    });
    socket.on('clearUser',function(){
        io.sockets.emit('clearUser')
    })

});
var a=
{
    "product": {
        "title": "ר�����ƴ��汦���",
        "unit": "��",
        "slogan": "Ʒ��ר�������ӻ���",
        "content": "���ı����ı����ı�",
        "max_price": "100000.00",
        "min_price": "100.00",
        "src": [
            "http://assets.bootcss.com/www/assets/img/webpack.png",
            "http://assets.bootcss.com/www/assets/img/react.png",
            "http://assets.bootcss.com/www/assets/img/typescript.png"
        ],
        "thumbnail": [
            "http://assets.bootcss.com/www/assets/img/webpack.png",
            "http://assets.bootcss.com/www/assets/img/react.png",
            "http://assets.bootcss.com/www/assets/img/typescript.png"
        ],
        "sku": [
            {
                "title": "��-��-��",
                "sku_id": "123456789159753",
                "price": "3000.00",
                "stock": 0
            },
            {
                "title": "��-С-����",
                "sku_id": "asasasasas4555",
                "price": "100000.00",
                "stock": 0
            },
            {
                "title": "�ƺ�ɫ-С-����",
                "sku_id": "123456789159753",
                "price": "100.00",
                "stock": 0
            }
        ],
        "attr":{
            "��ɫ":['��ɫ',"�ƺ�ɫ","��ɫ"],
            "�ߴ�":["��","С"],
            "��ʽ":["����","����"]
        }

    }
}


// �����˿ڣ���������
app.listen(config.port, function () {
    console.log(pkg.name+' listening on port '+config.port);
});