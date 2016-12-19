var express = require('express');
var router  = express.Router();

var Title   =   require('../../model/titles.js');//引入模型文件导出的模块
var Content =   require('../../model/contents.js');//引入模型文件导出的模块
var Article =   require('../../model/articles.js');//引入模型文件导出的模块
var Guest   =   require('../../model/guests.js');//引入模型文件导出的模块
/* GET home page. */
router.get('/', function(req, res, next) {
    var data_cop;
    Article.find({ c_firstTitle: 1 })
    .limit(1)
    .sort({ _id: -1 })
    .select('_id c_title')
    .exec(function(err,topNews){
        Article.find({ c_topscroll: 1 })
        .limit(4)
        .sort({ c_time: -1 })
        .select('_id c_title c_urlname')
        .exec(function(err,scrollNews){
            //console.log(scrollNews);
            Article.find({ c_pid: 3 })
            .limit(10)
            .sort({ _id: -1 })
            .select('_id c_title c_urlname c_time c_pid')
            .exec(function(err,eduMes){             //教育咨讯
                Article.find({ c_pid: 5 })
                .limit(8)
                .sort({ _id: -1 })
                .select('_id c_title c_urlname c_time c_pid')
                .exec(function(err,policyMes){      //政策法规
                    Article.find({ c_pid: 6 })
                    .limit(8)
                    .sort({ _id: -1 })
                    .select('_id c_title c_urlname c_time c_pid')
                    .exec(function(err,resMes){
                        res.render('index/index/index',{
                            title     : '中华教育协会',
                            topNews   : topNews[0] ||'',    //顶部信息
                            scrollNews: scrollNews,    //滚动信息
                            eduMes    : eduMes,        //教育咨讯
                            policyMes : policyMes,     //政策法规
                            resMes    : resMes         //资源信息
                        });
                    });
                });
            });
        });
    });
})
router.get('/list/:id', function(req, res, next) {
    var id = req.params.id;
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 15;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({ c_pid: id })
    .sort({ _id: -1 })
    .select('_id c_title c_time c_pid')
    .exec(function(err,eduMes){
        var part_articles = eduMes.slice(begin,end);
        var num = Math.ceil(eduMes.length / count);
        Title.findOne({ _id: id},'title_name', function(err, title_name){
            res.render('index/index/list',{
                title:title_name.title_name,
                eduMes:part_articles,
                title_name:title_name,  //需要显示的信息
                begin: begin,
                totalPage: num,         //总共页数
                id:id,
                page_display:page+1
            });
        });
    })
})
router.get('/content/:id', function(req, res, next) {
    var id = req.params.id;
    Article.findOne({ _id: id }).select('_id c_title c_time c_pid c_urlname c_content c_from')
    .exec(function(err,article){
        //console.log(article);
        var article_pid = article.c_pid;
        Title.findOne({ _id: article_pid }).exec(function(err,titleMes){
            res.render('index/index/article',{
                title:'文章内容页',
                logo:1,
                article:article,
                titleMes:titleMes
            });
        });
    })
})
router.get('/about/:id', function(req, res, next) {
    var c_pid = req.params.id;
    Content.findOne({ c_pid: c_pid }).exec(function(err,content){
        Title.findOne({ _id: content.c_pid }).exec(function(err,titleMes){
            res.render('index/index/about',{
                title:'关于我们',
                content:content,
                titleMes:titleMes
            });
        });
    });
})
router.post('/user_login', function(req, res, next) {
    var user_login = req.body;
    var _guest;
    _guest= new Guest({
        g_name:user_login.name,      //用户名
        g_telephone:user_login.telephone,     //用户电话
        g_job:user_login.job        //用户职业
    });
    _guest.save(function(err, guest){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    });
})

module.exports = router;
