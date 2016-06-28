var Player = require("../model/player.js");

var playerDal = (function () {
    
    function _login(username, password, callback) {
        
        Player.findOne({ username: username, password: password }, function (err, player) {
            return callback(err, player);
        });

        return null;
    }
    
    return {
        login: _login
    };
})();

module.exports = playerDal;