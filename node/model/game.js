var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema( {
    text : String,
    name : String,
    active : Boolean,
    createdDate: Date,
    admin : mongoose.Schema.Types.ObjectId,
    lastplayerwon : mongoose.Schema.Types.ObjectId,
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'players' }],
    history : [Schema.Types.Mixed]
});

module.exports = mongoose.model('games', GameSchema);
