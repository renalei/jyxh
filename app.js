var express = require('express');
var ejs = require('ejs');
var path = require('path');
var app = express();
var cookieParser = require('cookie-parser');

var ueditor = require("ueditor");
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// view engine setup


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
var moment = require('moment');
moment.lang('zh-cn');
app.locals.moment = moment;


//数据库的链接
var dbUrl  = 'mongodb://127.0.0.1:27017/myself'
//console.log("nihao".rainbow);
var mongoose = require('mongoose');
mongoose.connect(dbUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("连接成功");
});

//SESSION的引入
var session     =   require('express-session');

//引入connect-mongo数据中间件
var MongoStore  =   require('connect-mongo')(session);
var setting = {
    cookieSecret: "hello",
    url: dbUrl,
    collection: 'sessions'
}
//将SESSION的值存入数据表中
app.use(session({
    /*resave: false,
    saveUninitialized: true,*/
    secret: setting.cookieSecret,
    store: new MongoStore({
    url: setting.url,
    collection: setting.collection
  })
}));



var routes = require('./routes/index.js');
app.use('/', routes);


app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if (req.query.action === 'uploadimage') {
        var foo = req.ueditor;

        var imgname = req.ueditor.filename;

        var img_url = '/images/ueditor/' ;
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));

app.listen(3000, function() {
    console.log('app listen : 3000');
});

module.exports = app;
