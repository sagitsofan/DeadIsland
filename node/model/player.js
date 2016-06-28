var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayersSchema = new Schema( {
    text : String
});

module.exports = mongoose.model('players', PlayersSchema);
