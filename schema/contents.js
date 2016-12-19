var mongoose    = require('mongoose');
//var bcrypt      = require('bcrypt-nodejs');
var ContentSchma  = new mongoose.Schema({
	id:Number,
    c_pid:Number,      //文本父id
    c_title: String,  //文本标题
    c_content:String //文本内容   
});
module.exports = ContentSchma;
