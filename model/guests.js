
var mongoose    =   require('mongoose');//引入mongoose
var GuestSchma  =   require('../schema/guests.js');//引入模式文件导出的模块
var Guest       =   mongoose.model('Guest',GuestSchma);//编译生成Guest模型   Guest模型    GuestSchma模式
module.exports  =   Guest;    //导出构造方法
