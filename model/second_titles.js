var mongoose    =   require('mongoose');//引入mongoose
var Second_titleSchma  =   require('../schema/second_titles.js');//引入模式文件导出的模块
var Second_title       =   mongoose.model('Second_title',Second_titleSchma);//编译生成Second_title模型   Second_title模型    Second_title模式
module.exports  =   Second_title;    //导出构造方法
