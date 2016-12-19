var express = require('express');
var router  = express.Router();
var moment = require('moment');

var Title   =   require('../../model/titles.js');   //引入模型文件导出的模块
var Content =   require('../../model/contents.js'); //引入模型文件导出的模块
var Article =   require('../../model/articles.js'); //引入模型文件导出的模块
var Guest   =   require('../../model/guests.js');   //引入模型文件导出的模块
/* GET home page. */
router.get('/', function(req, res, next) {
    Article.find({ c_topscroll: 1 })
    .limit(4)
    .sort({ c_time: -1 })
    .select('_id c_title c_urlname')
    .exec(function(err,scrollNews) {
        Article.find({})
        .limit(5)
        .sort({ c_time: -1 })
        .select('_id c_title c_urlname c_time')
        .exec(function(err,displayNews) {
            res.render('mobile/index/index', {
                title: '中华教育协会-手机版',
                scrollNews: scrollNews,    //滚动信息
                displayNews: displayNews    //所有信息
            });
        });
    });
})
router.get('/list/:id', function(req, res, next) {
    var id = req.params.id;
    Article.find({ c_pid: id })
    .limit(5)
    .sort({ _id: -1 })
    .select('_id c_title c_time c_pid c_urlname')
    .exec(function(err,eduMes){
        Title.findOne({ _id: id},'title_name', function(err, title_name){
            res.render('mobile/index/list',{
                title:title_name.title_name,
                eduMes:eduMes,
                title_name:title_name,  //需要显示的信息
                id:id
            });
        });
    })
})
router.get('/content/:id', function(req, res, next) {
    var id=req.params.id;
    //console.log(_id);
    Article.findOne({ _id: id }).select('_id c_title c_time c_pid c_urlname c_content c_from')
    .exec(function(err,article){
        var article_pid = article.c_pid;
        Title.findOne({ _id: article_pid }).exec(function(err,titleMes){
            res.render('mobile/index/content',{
                title:'文章内容页',
                //logo:1,
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
            res.render('mobile/index/about',{
                title:'关于我们',
                content:content,
                titleMes:titleMes
            });
        });
    });
})
router.post('/add_displayNews/:value',function(req, res, next){
    var value = req.params.value;
    var add_mes='';
    var num = 5;
    var begin=value*num+1;
    var end=begin+num;
    if(value){
        Article.find().sort({ _id: -1 }).exec(function(err, addArticle){
            if(err){
                console.log(err);
            }else{
                var _addArticle = addArticle.slice(begin,end);
                for(var i=0; i< _addArticle.length; i++){
                    add_mes+='<div class="col-xs-12">';
                    add_mes+='<div class="media" style="padding:10px; border-bottom:solid 1px #ddd ">';
                    add_mes+='<div class="media-left">';
                    add_mes+='<a href="/mobile/content/'+_addArticle[i]._id +'">';
                    if(_addArticle[i].c_urlname == ''){
                        add_mes+='<img class="media-object" src="/index/images/logo.png" style="height:64px ; width:64px">';
                    }else{
                        add_mes+='<img class="media-object" src="'+_addArticle[i].c_urlname +'"  title="'+ _addArticle[i].c_title +'" style="height:64px ; width:70px" alt="...">';
                    }
                    add_mes+='</a>';
                    add_mes+='</div>';
                    add_mes+='<div class="media-body">';
                    add_mes+='<a href="/mobile/content/'+ _addArticle[i]._id +'">';
                    add_mes+='<h5 class="media-heading" style="margin-top:10px">'+_addArticle[i].c_title+ '</h5>发布日期：';
                    add_mes+= moment(_addArticle[i].c_time).format('YY-MM-DD') ;
                    add_mes+='</a>';
                    add_mes+='</div>';
                    add_mes+='</div>';
                    add_mes+='</div>';
                }
                res.json({add_mes:add_mes});
            }
        });
    }
})
router.get('/add_list',function(req, res, next){
    var value = req.query.value;
    var get_id = req.query.get_id;
    var add_mes='';
    var num = 5;
    var begin=value*num+1;
    var end=begin+num;
    if(value){
        Article.find({c_pid:get_id}).sort({ _id: -1 }).exec(function(err, addArticle){
            if(err){
                console.log(err);
            }else{
                var _addArticle = addArticle.slice(begin,end);
                for(var i=0; i< _addArticle.length; i++){
                    add_mes+='<div class="col-xs-12">';
                    add_mes+='<div class="media" style="padding:10px; border-bottom:solid 1px #ddd ">';
                    add_mes+='<div class="media-left">';
                    add_mes+='<a href="/mobile/content/'+_addArticle[i]._id +'">';
                    if(_addArticle[i].c_urlname == ''){
                        add_mes+='<img class="media-object" src="/index/images/logo.png" style="height:64px ; width:64px">';
                    }else{
                        add_mes+='<img class="media-object" src="'+_addArticle[i].c_urlname +'"  title="'+ _addArticle[i].c_title +'" style="height:64px ; width:70px" alt="...">';
                    }
                    add_mes+='</a>';
                    add_mes+='</div>';
                    add_mes+='<div class="media-body">';
                    add_mes+='<a href="/mobile/content/'+ _addArticle[i]._id +'">';
                    add_mes+='<h5 class="media-heading" style="margin-top:10px">'+_addArticle[i].c_title+ '</h5>发布日期：';
                    add_mes+= moment(_addArticle[i].c_time).format('YY-MM-DD') ;
                    add_mes+='</a>';
                    add_mes+='</div>';
                    add_mes+='</div>';
                    add_mes+='</div>';
                }
                res.json({add_mes:add_mes});
            }
        });
    }
})

module.exports = router;
