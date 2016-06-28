var DalPlayer = require("../dal/player.js");

var playerApi = (function () {
    
    function _initialize(app) {
        
        app.post('/api/player/login', function (req, res) {
            
            DalPlayer.login(req.body.username, req.body.password, function (err, player) {
                
                if (err)
                    res.send(err);
                
                res.send(player);
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = playerApi;  