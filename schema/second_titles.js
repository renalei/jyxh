var mongoose    = require('mongoose');
var Second_titleSchma  = new mongoose.Schema({
    id:Number,
    pid:Number,
    children_name:String,
    type:String
});

module.exports = Second_titleSchma;



