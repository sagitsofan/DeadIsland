var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema( {
    text : String,
    name : String,
    active : Boolean,
    admin : mongoose.Schema.Types.ObjectId,
    lastplayerwon : mongoose.Schema.Types.ObjectId,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'players' }]
});

module.exports = mongoose.model('games', GameSchema);
