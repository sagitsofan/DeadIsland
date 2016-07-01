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

        app.post('/api/player/signup', function (req, res) {
            
            DalPlayer.signup(req.body.username, req.body.password, req.body.fullname, function (err, player) {
                
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