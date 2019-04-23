/**
 * Created by Administrator on 2017/4/22.
 */
//models: 存放操作数据库的文件
//public: 存放静态文件，如样式、图片等
//routes: 存放路由文件
//views: 存放模板文件
//index.js: 程序主文件
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

//首页
var indexRouter = require('./routes/index');
//控制端
var controlRouter = require('./routes/control');
//showlist
var listRouter = require('./routes/list');
//登录
var loginRouter = require('./routes/login');
//移动端

var mobileRouter = require('./routes/mobile');
var addRouter = require('./routes/add');
//显示端
var screenRouter = require('./routes/screen');
//私人空间
var personalRouter = require('./routes/personal');
//显示端
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
// 设置静态文件目录
app.set('views',path.join(__dirname,'views'));
app.use('/public', express.static('public'));
//html 模板
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname,'public/upload/img'),// 上传文件目录
    keepExtensions: true// 保留后缀
}));
app.use(flash());

// 设置模板全局常量
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
// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//这样在调用 res.render 的时候就不用传入这四个变量了，
// express 为我们自动 merge 并传入了模板，
// 所以我们可以在模板中直接使用这四个变量。
//app.get('/', function (req, res) {
//    if (req.session.sign) {//检查用户是否已经登录
//        console.log(req.session);//打印session的值
//        res.send('welecome <strong>' + req.session.name + '</strong>, 欢迎你再次登录');
//    } else {//否则展示index页面
//        req.session.sign = true;
//        req.session.name = '汇智网';
//        res.end('欢迎登陆！');
//    }
//});

// 路由
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
    //接受控制端发送的场次命令
    socket.on('send_changci', function (data) {
        console.log(data);
        live = data;
        io.sockets.emit('change', data);
    });
    //定义目前显示的页面变量
    io.sockets.emit('success', '客户端连接成功');
    //手机端打开时显示当前页面
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
        "title": "专车定制床垫宝马款",
        "unit": "个",
        "slogan": "品牌专属、车居互联",
        "content": "富文本富文本富文本",
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
                "title": "黑-大-新",
                "sku_id": "123456789159753",
                "price": "3000.00",
                "stock": 0
            },
            {
                "title": "黑-小-经典",
                "sku_id": "asasasasas4555",
                "price": "100000.00",
                "stock": 0
            },
            {
                "title": "酒红色-小-经典",
                "sku_id": "123456789159753",
                "price": "100.00",
                "stock": 0
            }
        ],
        "attr":{
            "颜色":['黑色',"酒红色","白色"],
            "尺寸":["大","小"],
            "款式":["经典","复古"]
        }

    }
}


// 监听端口，启动程序
app.listen(config.port, function () {
    console.log(pkg.name+' listening on port '+config.port);
});