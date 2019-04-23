/**
 * Created by Administrator on 2017/5/4.
 */
var mysql      = require('mysql');
var config={
    option:{
        host     : 'localhost',
        user     : 'design',
        password : '123456',
        database : 'vote',
        port:'3306'
    }
};
config.connection=mysql.createPool(config.option)

module.exports=config;
