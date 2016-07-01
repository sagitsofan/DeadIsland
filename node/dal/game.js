var Game = require("../model/game.js");

var gameDal = (function () {
    
    function _getGame(_gameId, callback) {
        
        Game.findOne({ _id: _gameId })
            .populate('players', 'username')
            .exec(function (err, game) {
            
            return callback(err, game);
        });
    }
    
    function _getGames(callback) {
        
        Game.find({ active: true })
            .populate('players', 'username')
            .exec(function (err, games) {
            
            return callback(err, games);
        });
    }
    
    function _addGame(_name, callback) {
        
        var game = new Game({ name: _name, active: true });
        
        game.save(function (err) {

            if (err)
                return callback(err);

            return callback(err, game);
        });
    }
    
    function _deleteGame(_id, callback) {
        
        // find the user with id 4
        Game.findOneAndRemove({ _id: _id }, function (err) {
            
            if (err)
                return callback(err);
            
            return callback(err, "sucsess");
        });
    }

    function _attachPlayerToGame(_gameId, _playerId, callback) {
        
        //remove all the duplicates players with "playerId" from the array
        Game.findOneAndUpdate({ _id: _gameId }, { $pull: { players: _playerId } }, function (err, data) {
            
            //add player into array
            Game.findOne({ _id: _gameId }, function (err, game) {
                
                var newPlayer = {
                    _id: _playerId
                };
                
                game.players.push(newPlayer);
                
                game.save(function (err) {

                    return callback(err, game);
                });
            });
        });
    }
    
    function _dettachPlayerToGame(_gameId, _playerId, callback) {
        
        //remove all the duplicates players with "playerId" from the array
        Game.findOneAndUpdate({ _id: _gameId }, { $pull: { players: _playerId } }, function (err, data) {
            return callback(err, data);
        });
    }
    
    function _setPlayerWon(_gameId, _playerId, callback) {
        
        Game.findByIdAndUpdate(_gameId, { $set: { lastplayerwon: _playerId } }, function (err, game) {
            return callback(err, game);
        });
    }

    return {
        getGame: _getGame,
        getGames: _getGames,
        addGame: _addGame,
        deleteGame: _deleteGame,
        attachPlayerToGame: _attachPlayerToGame,
        dettachPlayerToGame: _dettachPlayerToGame,
        setPlayerWon: _setPlayerWon
    };
})();

module.exports = gameDal;