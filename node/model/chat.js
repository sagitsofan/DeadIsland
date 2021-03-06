﻿var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema( {
    gameId : mongoose.Schema.Types.ObjectId,
    playerId : mongoose.Schema.Types.ObjectId,
    message : String,
    timestamp: Date
});

module.exports = mongoose.model('chat', ChatSchema);
