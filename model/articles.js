
var mongoose    =   require('mongoose');//引入mongoose
var ArticleSchma=   require('../schema/articles.js');//引入模式文件导出的模块
var Article     =   mongoose.model('Article',ArticleSchma);//编译生成Article模型   Article模型    ArticleSchma模式
module.exports  =   Article;    //导出构造方法
