var mongoose    = require('mongoose');
var UserSchma  = new mongoose.Schema({
    admin_name: String,
    admin_password:String
});
module.exports = UserSchma;
