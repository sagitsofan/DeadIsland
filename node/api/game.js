var DalGame = require("../dal/game.js");

var gameApi = (function () {
    
    function _initialize(app) {
        
        app.get('/api/game/getgames', function (req, res) {
            
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

        app.post('/api/game/add', function (req, res) {
            
            DalGame.addGame(req.body.name, req.body.admin, function (err, game) {
                
                if (err)
                    res.send(err);
                
                res.send("success");
            });
        });

        app.post('/api/game/delete', function (req, res) {
            
            DalGame.deleteGame(req.body.id, function (err, game) {
                
                if (err)
                    res.send(err);
                
                res.send("success");
            });
        });

    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = gameApi;