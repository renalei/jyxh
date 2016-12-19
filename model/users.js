var mongoose    =   require('mongoose');//引入mongoose
var UserSchma   =   require('../schema/users.js');//引入模式文件导出的模块
var User        =   mongoose.model('User',UserSchma);//编译生成User模型   User模型    UserSchma模式
module.exports  =   User;    //导出构造方法
