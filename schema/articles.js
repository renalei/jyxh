var mongoose    = require('mongoose');
//var bcrypt      = require('bcrypt-nodejs');
var ArticleSchma  = new mongoose.Schema({
	pid:Number,      //一级标题id
    c_pid:Number,      //文本父id
    c_from:String,    //文本来源
    c_title: String,  //文本标题
    c_firstTitle:Number,    //显示为头条
    c_topscroll:Number, //显示是否为滚动
    c_urlname:String,     //大图路径
    c_content:String, //文本内容
    c_time:String    //创建时间
});
module.exports = ArticleSchma;
