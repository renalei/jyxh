var mongoose    =   require('mongoose');//引入mongoose
var TitleSchma  =   require('../schema/titles.js');//引入模式文件导出的模块
var Title       =   mongoose.model('Title',TitleSchma);//编译生成Title模型   Title模型    TitleSchma模式
module.exports  =   Title;    //导出构造方法
