/**
 * Created by Administrator on 2017/5/5.
 */
var express=require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var router=express.Router();
