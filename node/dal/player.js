var Player = require("../model/player.js");

var playerDal = (function () {
    
    function _login(_username, _password, callback) {
        
        Player.findOne({ username: _username, password: _password }, function (err, player) {
            return callback(err, player);
        });
    }
    
    function _signup(_username, _password, _fullname, callback) {
        
        var player = new Player({ username: _username, password: _password, fullname: _fullname });
        
        player.save(function (err) {
            
            if (err)
                return callback(err);
            
            return callback(err, player);
        });
    }
    
    return {
        login: _login,
        signup: _signup
    };
})();

module.exports = playerDal;