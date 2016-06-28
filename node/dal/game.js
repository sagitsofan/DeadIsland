var Game = require("../model/game.js");

var gameDal = (function () {
    
    function _getGame(gameId, callback) {
        
        Game.findOne({ _id: gameId })
            .populate('players', 'username')
            .exec(function (err, game) {
            
            return callback(err, game);
        });
    }
    
    function _getGames(callback) {
        
        Game.find({ active: true }, function (err, games) {
            
            return callback(err, games);
        });
    }
    
    function _attachPlayerToGame(gameId, playerId, callback) {
        
        //remove all the duplicates players with "playerId" from the array
        Game.findOneAndUpdate({ _id: gameId }, { $pull: { players: playerId } }, function (err, data) {
            
            //add player into array
            Game.findOne({ _id: gameId }, function (err, game) {
                
                var newPlayer = {
                    _id: playerId
                };
                
                game.players.push(newPlayer);
                
                game.save(function (err) {

                    return callback(err, game);
                });
            });
        });
    }
    
    function _dettachPlayerToGame(gameId, playerId, callback) {
        
        //remove all the duplicates players with "playerId" from the array
        Game.findOneAndUpdate({ _id: gameId }, { $pull: { players: playerId } }, function (err, data) {
            return callback(err, data);
        });
    }
    
    function _setPlayerWon(gameId, playerId, callback) {
        
        Game.findByIdAndUpdate(gameId, { $set: { lastplayerwon: playerId } }, function (err, game) {
            return callback(err, game);
        });
    }

    return {
        getGame: _getGame,
        getGames: _getGames,
        attachPlayerToGame: _attachPlayerToGame,
        dettachPlayerToGame: _dettachPlayerToGame,
        setPlayerWon: _setPlayerWon
    };
})();

module.exports = gameDal;