var mongoose    = require('mongoose');
//var bcrypt      = require('bcrypt-nodejs');
var GuestSchma  = new mongoose.Schema({
    g_name:String,      //用户名
    g_telephone:Number,     //用户电话
    g_job:String        //用户职业
});
module.exports = GuestSchma;
