var pokerSim = require("../lib/poker-sim.js");
var DalGame = require("../dal/game.js");

var gameSocket = (function () {
    
    function _initialize(io) {
        
        io.on('connection', function (socket) {
            
            socket.on('PlayerEntersGame', function (gameId, player) {
                
                DalGame.attachPlayerToGame(gameId, player._id, function (err, game) { });
                
                //join player into current socket
                socket.join(gameId);
                
                //raise event to all clients
                io.sockets.in(gameId).emit('NewPlayerEntersGame', player);
            });
            
            socket.on('PlayerLeftGame', function (gameId, player) {
                
                DalGame.dettachPlayerToGame(gameId, player._id, function (err, game) { });
                
                //dispath player from current socket
                socket.leave(gameId);
                
                //raise event to all clients
                io.sockets.in(gameId).emit('NewPlayerLeftGame', player);
            });
            
            socket.on('PlayerWonGame', function (gameId, player) {
                
                DalGame.setPlayerWon(gameId, player._id, function (err, game) { });
            });
            
            socket.on('StartGame', function (gameId) {
                
                io.sockets.in(gameId).emit('GameStarted');

                var game = new pokerSim.Game();
                
                //deal hands
                setTimeout(function () {
                    
                    console.log("=============================== HANDS ====================================");

                    //add "Hands" or players
                    DalGame.getGame(gameId, function (err, g) {
                        
                        g.players.forEach(function (player) {
                            game.addHand(player.id);
                        })
                        
                        //Deal two cards (getting fancy with this and trying to add more or less than 2 will probably get you in trouble)
                        game.dealCard().dealCard();
                        
                        //call evalHands() to process win percentages using the current state of the game
                        //game.evalHands()
                        
                        //output the status of the game to the console
                        game.printGame();
                        
                        io.sockets.in(gameId).emit('DealHands', game.getGame());
                    });
                    
                }, 1000)
                
                //flop
                setTimeout(function () {
                    
                    console.log("=============================== FLOP ====================================");

                    //flop (3 cards)
                    game.communityCard().communityCard().communityCard();
                    
                    //eval and print
                    game.evalHands().printGame();
                    
                    io.sockets.in(gameId).emit('Flop', game.getGame());
                }, 3000)
                
                //turn
                setTimeout(function () {
                    
                    console.log("================================ TURN ===================================");

                    //turn
                    game.communityCard();
                    
                    //eval and print
                    game.evalHands().printGame();
                    
                    io.sockets.in(gameId).emit('Turn', game.getGame());
                }, 5000)
                
                //river
                setTimeout(function () {
                    
                    console.log("================================ RIVER  ===================================");

                    //river
                    game.communityCard();
                    
                    //eval and print
                    game.evalHands().printGame();
                    
                    io.sockets.in(gameId).emit('River', game.getGame());
                    
                    console.log("================================= STATS  ==================================");
                    
                    //at any time you can return the JSON of the game status
                    console.log(game.getGame());

                    io.sockets.in(gameId).emit('GameEnded');
                }, 7000)
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = gameSocket;