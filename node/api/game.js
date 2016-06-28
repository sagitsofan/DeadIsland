var DalGame = require("../dal/game.js");

var gameApi = (function () {
    
    function _initialize(app) {
        
        app.get('/api/game/getactivegames', function (req, res) {
            
            DalGame.getGames(function (err, games) {
                
                if (err)
                    res.send(err);
                
                res.send(games);
            });
        });

        app.get('/api/game/:_id', function (req, res) {
            
            DalGame.getGame(req.params._id, function (err, game) {
                
                if (err)
                    res.send(err);

                res.send(game);
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = gameApi;