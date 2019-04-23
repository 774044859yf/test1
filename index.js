var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session')
var con = mysql.createConnection({
    host     : 'localhost',
        user     : 'design',
        password : '123456',
        database : 'vote',
        port:'3306'
})
app.use(bodyParser.urlencoded({extended: false}))
//session 中间件
app.use(session({
    name: 'design',// 设置 cookie 中保存 session id 的字段名称
    secret:'design' ,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: 1000*60*60*24*30// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new SessionStore({
        host     : 'localhost',
        user     : 'design',
        password : '123456',
        database : 'vote',
        port:'3306'
    })
}));
con.connect();
var type='game';
var game_tag_num={};
var game_id;
function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}
var game;
var game_status;
//var game_status_screen;
io.on('connection', function (socket) {
    io.sockets.emit('success', '客户端连接成功');
    socket.on('controlReady',function(){
        io.sockets.emit('controlBegin');
    });
    socket.on('default',function(data){
        console.log('-------newGame---------');
        io.sockets.emit('game_default');
        var list=data.tags.data.list;
        game=data.intro.data.list[0].game_id;
        game_status=data.intro.data.list[0].game_status;
        console.log('当前场次id:'+game);
        console.log('当前场次状态：'+game_status);
        game_tag_num[game]={};
        for(var i= 0,j=list.length;i<j;i++){
            game_tag_num[game][list[i].tag_id]=0;
        }
        //if((game_tag_num[game]&&isEmptyObject(game_tag_num[game]))||!game_tag_num[game]){
        //    game_tag_num[game]={};
        //    for(var i= 0,j=list.length;i<j;i++){
        //        game_tag_num[game][list[i].tag_id]=0;
        //    }
        //}
    });
    socket.on('changeNotary',function(data){
        io.sockets.emit('notary',game);
    });
    socket.on('changeGame',function(data){
        io.sockets.emit('notaryHide');
    });
//    显示端获取数据
    socket.on('get_tag_num',function(data){
        if(data=='0'){
        //    在服务器拿数据
            console.log('服务器数据:')
            console.log(game_tag_num[game])
            console.log('当前场次id:'+game);
            io.sockets.emit('tag_num',game_tag_num[game]);

        }else{
        //    在数据库拿数据
            console.log('数据库拿数据:')
            console.log('当前场次id:'+game);
            var msg={};
            var sql = 'select tag_id,tag_number from tags where games_id = '+game;
            con.query(sql, function (err, result) {
                if (err) {
                    ////console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
                if(result.length>1){
                    for(var i= 0,j=result.length;i<j;i++){
                        msg[result[i].tag_id]=result[i].tag_number
                    }
                }
                console.log('从数据库中获取的数据：'+msg)
                io.sockets.emit('tag_num',msg);
            })
        }
    })
    socket.on('add',function(data){
        //可以提交并添加的场次状态
        if(game_status=='0'){
            console.log('提交上来的数据:'+data);
            for(var i= 0,j=data.length;i<j;i++){
                //console.log('当前添加的标签id：'+data[i])
                //console.log('添加之前服务器中当前的id数量:'+game_tag_num[game][data[i]])
                game_tag_num[game][data[i]]=parseInt(game_tag_num[game][data[i]])+1
                //console.log('添加之后服务器中当前的id数量:'+game_tag_num[game][data[i]])
            }
            io.sockets.emit('tag_add',data)
        }

    });
    socket.on('finished',function(data){
        console.log('save');
        var sql1='update game set game_status = 1 where game_id = '+game;
        con.query(sql1, function (err, result) {
            if (err) throw err;
            for(var e in game_tag_num[game]){
                var sql = 'update tags set tag_number = '+game_tag_num[game][e]+' where tag_id = '+e;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    game_status='1';
                })
            }
        })
    })
    socket.on('clear',function(){
        game_tag_num[game]={};
    })
});
server.listen(55556, function () {
    console.log('listening on *:55556');
});
