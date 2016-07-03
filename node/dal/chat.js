var Chat = require("../model/chat.js");

var chatDal = (function () {
    
    function _saveChat(_gameId, _playerId, _message, callback) {
        
        var chat = new Chat({ gameId: _gameId, playerId: _playerId, message: _message });
        
        chat.save(function (err) {

            if (err)
                return callback(err);

            return callback(err, "success");
        });
    }

    return {
        saveChat: _saveChat
    };
})();

module.exports = chatDal;