var mongoose    =   require('mongoose');//引入mongoose
var ContentSchma=   require('../schema/contents.js');//引入模式文件导出的模块
var Content     =   mongoose.model('Content',ContentSchma);//编译生成Content模型   Content模型    ContentSchma模式
module.exports  =   Content;    //导出构造方法
