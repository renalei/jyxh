
var Title           =   require('../../model/titles.js');//引入模型文件导出的模块
var Second_title    =   require('../../model/second_titles.js');//引入模型文件导出的模块
var Content         =   require('../../model/contents.js');//引入模型文件导出的模块
var Article         =   require('../../model/articles.js');//引入模型文件导出的模块

var _               =   require('underscore');//新数据替换旧数据
var multiparty_new  =   require('multiparty');
var util            =   require('util');
var fs              =   require('fs');


var multipart           =   require('connect-multiparty');
var multipartMiddleware =   multipart();


exports.index=function(req, res, next) {
    res.redirect('/admin/general/1');
}


exports.general=function(req, res, next) {
    var c_id      = req.params.id||1; 
    //console.log(c_id);
    Content.findOne({id:c_id}, function(err, data1){    
        Second_title.find({pid:2},function(err, titleData){
            //console.log(data1);
            if(err) console.log(err);
            res.render('admin/index/general',{
                title       : '协会概要',
                titleData   : titleData,
                c_content   : data1.c_content,
                c_id        : c_id
            });
        });
    });   
}

exports.general_change=function(req, res, next) {
    var content_data = req.body;
    var c_pid = content_data.c_pid;
    var _content;
    Content.findOne({id: c_pid},function(err, data1){
        if(err) console.log(err);
        _content  =   _.extend(data1, content_data);//新数据替换旧数据
        _content.save(function(err, data1){
            if(err){
              console.log(err);
            }
            //console.log('更新成功');
            //console.log(data1);            
              res.redirect('/admin/general/'+data1.c_pid);
        
         });
    });
}

exports.member=function(req, res, next) {
    c_pid      = req.params.id
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 3;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({c_pid:c_pid}).sort({ _id: -1 }).exec(function(err,articles){
        var part_articles = articles.slice(begin,end);
        var num = Math.ceil(articles.length / count);
        res.render('admin/index/member_display',{
            title       :   '会员介绍预览',
            begin       :   begin,
            articles    :   part_articles, //需要显示的信息
            totalPage   :   num,         //总共页数
            page_display:   page+1
        });
    });
}


exports.member_add=function(req, res, next) {
    res.render('admin/index/member_add',{
        title : '添加会员介绍',
        titles:  '会员介绍'
    });
}


exports.member_add_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log('parse error: ' + err);
        }else{
            var date = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day =date.getDate();
            var time =date.getTime();
            // console.log(files);
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
                var urlPath='';
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            _article= new Article({
                pid:2,
                c_pid:5,                    //second_titles中的会员介绍  5   文本父id
                c_from:fields.c_from[0],    //文本来源
                c_title: fields.c_title[0],  //文本标题
                c_firstTitle:0,    //显示为头条
                c_topscroll:0, //显示是否为滚动
                c_content:fields.c_content[0] //文本内容
            });
            if(fields.c_firstTitle != undefined){
                _article.c_firstTitle = 1;
            }
            if(fields.c_topscroll != undefined){
                _article.c_topscroll = 1;
            }
            _article.c_urlname  = urlPath;
            _article.c_time     = new Date;
            _article.save(function(err, arti){
                if(err)console.log(err);
                res.redirect('/admin/jiugong/5');
            });
        }
    });
}

exports.member_edit=function(req, res, next) {
    var id = req.params.id; 
    Article.findOne({_id:id},function(err,article){
        res.render('admin/index/member_edit',{
            title   : '会员介绍编辑',         
            article : article
        });
    });
   
}

exports.member_edit_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        }else{
            var date  = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day   = date.getDate();
            var time  = date.getTime();
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            var id = fields.id[0];
            var _article_data;
            var _article;
            Article.find({ _id: id}, function(err, data1){
                if(err) console.log(err);
                _article_data={
                    pid: 2,
                    c_pid: 5,
                    c_from : fields.c_from[0],
                    c_firstTitle: 0,
                    c_topscroll : 0,
                    c_title:fields.c_title[0],
                    c_content:fields.c_content[0]
                }
                if(fields.c_firstTitle != undefined){
                  _article_data.c_firstTitle = 1;
                }
                if(fields.c_topscroll != undefined){
                  _article_data.c_topscroll = 1;
                }
                if(originalFilename !=''){
                  _article_data.c_urlname = urlPath;
                }

                _article_data.c_time     = new Date;
                _article  =   _.extend(data1[0], _article_data);//新数据替换旧数据
                _article.save(function(err){
                   if(err){
                      console.log(err);
                   }

                   res.redirect('/admin/jiugong/5');
                 });
            });
        }
    });
}


exports.news_delete=function(req, res, next){
    var id = req.params.id;
    if(id){
        Article.remove({_id:id},function(err, delmovie){
            if(err){
                console.log(err);
            }else{
                res.json({success:1});
            }
        });
    }
}
exports.information=function(req, res, next) {
    var pid   = req.params.id
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 3;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({ pid:pid}).sort({ _id: -1 }).exec(function(err,articles){
        var part_articles = articles.slice(begin,end);
        var num = Math.ceil(articles.length / count);
        res.render('admin/information/information_display',{
            title       :   '教育前沿信息预览',
            begin       :   begin,
            articles    :   part_articles, //需要显示的信息
            totalPage   :   num,         //总共页数
            page_display:   page+1
        });
    });
}

exports.information_add=function(req, res, next) {
    Second_title.find({pid:3},function(err,titles){
        res.render('admin/information/information_add',{
            title : '添加教育咨询',
            titles:  titles
        });
    });
}

exports.information_add_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log('parse error: ' + err);
        }else{
            var date    =   new Date;
            var year    =   date.getFullYear();
            var month   =   date.getMonth()+1;
            var day     =   date.getDate();
            var time    =   date.getTime();
            // console.log(files);
            var inputFile   = files.c_urlname[0];
            var oldPath     = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
                var urlPath='';
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            _article= new Article({
                pid:3,                      //second_titles中的教育资源    3   文本父id
                c_pid:fields.c_pid[0],      //文本父id
                c_from:fields.c_from[0],    //文本来源
                c_title: fields.c_title[0],  //文本标题
                c_firstTitle:0,    //显示为头条
                c_topscroll:0, //显示是否为滚动
                c_content:fields.c_content[0] //文本内容
            });
            if(fields.c_firstTitle != undefined){
                _article.c_firstTitle = 1;
            }
            if(fields.c_topscroll != undefined){
                _article.c_topscroll = 1;
            }
            _article.c_urlname  = urlPath;
            _article.c_time     = new Date;
            _article.save(function(err, arti){
                if(err)console.log(err);
                res.redirect('/admin/information/3');
            });
        }
    });
}


exports.information_edit=function(req, res, next) {
    var id = req.params.id; 
    Second_title.find({pid:3},function(err,titles){
        Article.findOne({_id:id},function(err,article){
            res.render('admin/information/information_edit',{
                title   : '教育前沿信息编辑', 
                titles  : titles,        
                article : article
            });
        });
    });
   
}

exports.information_edit_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        }else{
            var date  = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day   = date.getDate();
            var time  = date.getTime();
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            var id = fields.id[0];
            var _article_data;
            var _article;
            Article.find({ _id: id}, function(err, data1){
                if(err) console.log(err);
                _article_data={
                    //pid         : 3,                      //second_titles中的教育咨询  3   文本父id
                    c_pid       : fields.c_pid[0],      //文本父id
                    c_from      : fields.c_from[0],
                    c_firstTitle: 0,
                    c_topscroll : 0,
                    c_title:fields.c_title[0],
                    c_content:fields.c_content[0]
                }
                if(fields.c_firstTitle != undefined){
                  _article_data.c_firstTitle = 1;
                }
                if(fields.c_topscroll != undefined){
                  _article_data.c_topscroll = 1;
                }
                if(originalFilename !=''){
                  _article_data.c_urlname = urlPath;
                }

                _article_data.c_time     = new Date;
               
                _article  =   _.extend(data1[0], _article_data);//新数据替换旧数据
                _article.save(function(err){
                   if(err){
                      console.log(err);
                   }

                   res.redirect('/admin/information/3');
                 });
            });
        }
    });
}


exports.exchange=function(req, res, next) {
    var pid   = req.params.id
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 3;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({ pid:pid}).sort({ _id: -1 }).exec(function(err,articles){
        var part_articles = articles.slice(begin,end);
        var num = Math.ceil(articles.length / count);
        res.render('admin/exchange/exchange_display',{
            title       :   '学术交流信息预览',
            begin       :   begin,
            articles    :   part_articles, //需要显示的信息
            totalPage   :   num,         //总共页数
            page_display:   page+1
        });
    });
}

exports.exchange_add=function(req, res, next) {
    Second_title.find({pid:4},function(err,titles){
        res.render('admin/exchange/exchange_add',{
            title : '添加学术交流信息',
            titles:  titles
        });
    });
}

exports.exchange_add_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log('parse error: ' + err);
        }else{
            var date    =   new Date;
            var year    =   date.getFullYear();
            var month   =   date.getMonth()+1;
            var day     =   date.getDate();
            var time    =   date.getTime();
            // console.log(files);
            var inputFile   = files.c_urlname[0];
            var oldPath     = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
                var urlPath='';
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            _article= new Article({
                pid:4,                      //second_titles中的教育资源    3   文本父id
                c_pid:fields.c_pid[0],      //文本父id
                c_from:fields.c_from[0],    //文本来源
                c_title: fields.c_title[0],  //文本标题
                c_firstTitle:0,    //显示为头条
                c_topscroll:0, //显示是否为滚动
                c_content:fields.c_content[0] //文本内容
            });
            if(fields.c_firstTitle != undefined){
                _article.c_firstTitle = 1;
            }
            if(fields.c_topscroll != undefined){
                _article.c_topscroll = 1;
            }
            _article.c_urlname  = urlPath;
            _article.c_time     = new Date;
            _article.save(function(err, arti){
                if(err)console.log(err);
                res.redirect('/admin/exchange/4');
            });
        }
    });
}


exports.exchange_edit=function(req, res, next) {
    var id = req.params.id; 
    Second_title.find({pid:4},function(err,titles){
        Article.findOne({_id:id},function(err,article){
            res.render('admin/exchange/exchange_edit',{
                title   : '学术交流信息编辑', 
                titles  : titles,        
                article : article
            });
        });
    });
   
}

exports.exchange_edit_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        }else{
            var date  = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day   = date.getDate();
            var time  = date.getTime();
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            var id = fields.id[0];
            var _article_data;
            var _article;
            Article.find({ _id: id}, function(err, data1){
                if(err) console.log(err);
                _article_data={
                    //pid         : 3,                      //second_titles中的教育咨询  3   文本父id
                    c_pid       : fields.c_pid[0],      //文本父id
                    c_from      : fields.c_from[0],
                    c_firstTitle: 0,
                    c_topscroll : 0,
                    c_title:fields.c_title[0],
                    c_content:fields.c_content[0]
                }
                if(fields.c_firstTitle != undefined){
                  _article_data.c_firstTitle = 1;
                }
                if(fields.c_topscroll != undefined){
                  _article_data.c_topscroll = 1;
                }
                if(originalFilename !=''){
                  _article_data.c_urlname = urlPath;
                }

                _article_data.c_time     = new Date;
                
                _article  =   _.extend(data1[0], _article_data);//新数据替换旧数据
                _article.save(function(err){
                   if(err){
                      console.log(err);
                   }

                   res.redirect('/admin/exchange/4');
                 });
            });
        }
    });
}



exports.achievement=function(req, res, next) {
    var pid   = req.params.id
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 3;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({ pid:pid}).sort({ _id: -1 }).exec(function(err,articles){
        var part_articles = articles.slice(begin,end);
        var num = Math.ceil(articles.length / count);
        res.render('admin/achievement/achievement_display',{
            title       :   '学术交流信息预览',
            begin       :   begin,
            articles    :   part_articles, //需要显示的信息
            totalPage   :   num,         //总共页数
            page_display:   page+1
        });
    });
}

exports.achievement_add=function(req, res, next) {
    res.render('admin/achievement/achievement_add',{
        title : '添加学术成果介绍',
        
    });
}


exports.achievement_add_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log('parse error: ' + err);
        }else{
            var date    =   new Date;
            var year    =   date.getFullYear();
            var month   =   date.getMonth()+1;
            var day     =   date.getDate();
            var time    =   date.getTime();
            // console.log(files);
            var inputFile   = files.c_urlname[0];
            var oldPath     = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
                var urlPath='';
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            _article= new Article({
                pid:5,                      //second_titles中的学术交流    5   文本父id
                c_pid:0,     
                c_from:fields.c_from[0],    //文本来源
                c_title: fields.c_title[0],  //文本标题
                c_firstTitle:0,    //显示为头条
                c_topscroll:0, //显示是否为滚动
                c_content:fields.c_content[0] //文本内容
            });
            if(fields.c_firstTitle != undefined){
                _article.c_firstTitle = 1;
            }
            if(fields.c_topscroll != undefined){
                _article.c_topscroll = 1;
            }
            _article.c_urlname  = urlPath;
            _article.c_time     = new Date;
            _article.save(function(err, arti){
                if(err)console.log(err);
                res.redirect('/admin/achievement/5');
            });
        }
    });
}

exports.achievement_edit=function(req, res, next) {
    var id = req.params.id;     
    Article.findOne({_id:id},function(err,article){
        res.render('admin/achievement/achievement_edit',{
            title   : '学术成果信息编辑',                
            article : article
        });
    });
}


exports.achievement_edit_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        }else{
            var date  = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day   = date.getDate();
            var time  = date.getTime();
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            var id = fields.id[0];
            var _article_data;
            var _article;
            Article.find({ _id: id}, function(err, data1){
                if(err) console.log(err);
                _article_data={
                    //pid         : 3,                      //second_titles中的教育咨询  3   文本父id
                    //c_pid       : fields.c_pid[0],      //文本父id
                    c_from      : fields.c_from[0],
                    c_firstTitle: 0,
                    c_topscroll : 0,
                    c_title:fields.c_title[0],
                    c_content:fields.c_content[0]
                }
                if(fields.c_firstTitle != undefined){
                  _article_data.c_firstTitle = 1;
                }
                if(fields.c_topscroll != undefined){
                  _article_data.c_topscroll = 1;
                }
                if(originalFilename !=''){
                  _article_data.c_urlname = urlPath;
                }

                _article_data.c_time     = new Date;
                
                _article  =   _.extend(data1[0], _article_data);//新数据替换旧数据
                _article.save(function(err){
                   if(err){
                      console.log(err);
                   }

                   res.redirect('/admin/achievement/5');
                 });
            });
        }
    });
}


exports.message=function(req, res, next) {
    var pid   = req.params.id
    var page  = parseInt(req.query.p) || 0;//获取第几页  从0开始
    var count = 3;                  //定义每页的数据条数
    var begin = page * count;       //每一页的开始是第几条
    var end   = begin + count;      //每一页的结束条数   ？？？？？？
    Article.find({ pid:pid}).sort({ _id: -1 }).exec(function(err,articles){
        var part_articles = articles.slice(begin,end);
        var num = Math.ceil(articles.length / count);
        res.render('admin/message/message_display',{
            title       :   '资源信息库预览',
            begin       :   begin,
            articles    :   part_articles, //需要显示的信息
            totalPage   :   num,         //总共页数
            page_display:   page+1
        });
    });
}

exports.message_add=function(req, res, next) {
    Second_title.find({pid:6},function(err,titles){
        res.render('admin/message/message_add',{
            title : '添加资源信息库信息',
            titles:  titles
        });
    });
}

exports.message_add_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
            console.log('parse error: ' + err);
        }else{
            var date    =   new Date;
            var year    =   date.getFullYear();
            var month   =   date.getMonth()+1;
            var day     =   date.getDate();
            var time    =   date.getTime();
            // console.log(files);
            var inputFile   = files.c_urlname[0];
            var oldPath     = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
                var urlPath='';
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            _article= new Article({
                pid:6,                      //second_titles中的资源信息库    6   文本父id
                c_pid:fields.c_pid[0],      //文本父id
                c_from:fields.c_from[0],    //文本来源
                c_title: fields.c_title[0],  //文本标题
                c_firstTitle:0,    //显示为头条
                c_topscroll:0, //显示是否为滚动
                c_content:fields.c_content[0] //文本内容
            });
            if(fields.c_firstTitle != undefined){
                _article.c_firstTitle = 1;
            }
            if(fields.c_topscroll != undefined){
                _article.c_topscroll = 1;
            }
            _article.c_urlname  = urlPath;
            _article.c_time     = new Date;
            _article.save(function(err, arti){
                if(err)console.log(err);
                res.redirect('/admin/message/6');
            });
        }
    });
}


exports.message_edit=function(req, res, next) {
    var id = req.params.id; 
    Second_title.find({pid:6},function(err,titles){
        Article.findOne({_id:id},function(err,article){
            res.render('admin/message/message_edit',{
                title   : '资源信息库信息编辑', 
                titles  : titles,        
                article : article
            });
        });
    });
   
}

exports.message_edit_save=function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
    var form = new multiparty_new.Form({uploadDir: './public/images/news'});
    var _article;
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);
        if(err){
          console.log('parse error: ' + err);
        }else{
            var date  = new Date;
            var year  = date.getFullYear();
            var month = date.getMonth()+1;
            var day   = date.getDate();
            var time  = date.getTime();
            var inputFile = files.c_urlname[0];
            var oldPath = inputFile.path;
            var originalFilename = inputFile.originalFilename;
            if(originalFilename ==''){
                fs.unlink(oldPath, function(err){
                   if(err){throw err;}
                })
            }else{
                var newPath = './public/images/news/'+year+month+day+time+inputFile.originalFilename;
                var urlPath = '/images/news/'+year+month+day+time+inputFile.originalFilename;
                fs.rename(oldPath, newPath, function(err) {
                    if(err){
                        console.log('rename error: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
            var id = fields.id[0];
            var _article_data;
            var _article;
            Article.find({ _id: id}, function(err, data1){
                if(err) console.log(err);
                _article_data={
                    //pid         : 3,                      //second_titles中的教育咨询  3   文本父id
                    c_pid       : fields.c_pid[0],      //文本父id
                    c_from      : fields.c_from[0],
                    c_firstTitle: 0,
                    c_topscroll : 0,
                    c_title:fields.c_title[0],
                    c_content:fields.c_content[0]
                }
                if(fields.c_firstTitle != undefined){
                  _article_data.c_firstTitle = 1;
                }
                if(fields.c_topscroll != undefined){
                  _article_data.c_topscroll = 1;
                }
                if(originalFilename !=''){
                  _article_data.c_urlname = urlPath;
                }

                _article_data.c_time     = new Date;
                
                _article  =   _.extend(data1[0], _article_data);//新数据替换旧数据
                _article.save(function(err){
                   if(err){
                      console.log(err);
                   }

                   res.redirect('/admin/message/6');
                 });
            });
        }
    });
}





