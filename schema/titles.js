var mongoose    = require('mongoose');
var TitleSchma  = new mongoose.Schema({
    id:Number,
    title_name:String,
    url_name:String
});

module.exports = TitleSchma;
