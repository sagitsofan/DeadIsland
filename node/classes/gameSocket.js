var pokerSim = require("../lib/poker-sim.js");
var DalGame = require("../dal/game.js");
var DalChat = require("../dal/chat.js");

var gameSocket = (function () {
    
    function _initialize(io) {
        
        io.on('connection', function (socket) {
            
            socket.on('PlayerEntersGame', function (gameId, player) {
                
                DalGame.attachPlayerToGame(gameId, player._id, function (err, game) {
                    
                    //join player into current socket
                    socket.join(gameId);
                    
                    //raise event to all clients
                    io.sockets.in(gameId).emit('NewPlayerEntersGame', player);
                });
            });
            
            socket.on('PlayerLeftGame', function (gameId, player) {
                
                DalGame.dettachPlayerToGame(gameId, player._id, function (err, game) { 

                    //dispath player from current socket
                    socket.leave(gameId);
                    
                    //raise event to all clients
                    io.sockets.in(gameId).emit('NewPlayerLeftGame', player);
                });
            });
            
            socket.on('PlayerWonGame', function (gameId, player) {
                
                DalGame.setPlayerWon(gameId, player._id, function (err, game) { 
                
                });
            });
            
            socket.on('StartGame', function (gameId) {
                
                io.sockets.in(gameId).emit('GameStarted');

                var game = new pokerSim.Game();
                
                //deal hands
                setTimeout(function () {
                    
                    //add "Hands" or players
                    DalGame.getGame(gameId, function (err, g) {
                        
                        g.players.forEach(function (player) {
                            game.addHand(player.id);
                        })
                        
                        //Deal two cards (getting fancy with this and trying to add more or less than 2 will probably get you in trouble)
                        game.dealCard().dealCard();
                        
                        //call evalHands() to process win percentages using the current state of the game
                        //game.evalHands() // SAGI: DO NOT REMOVE COMMENT PLEASE - ITS TAKES A LOT OF TIME WHEN THERE IS 5+ PLAYERS (!!)
                        
                        io.sockets.in(gameId).emit('DealHands', game.getGame());
                    });

                    //flop
                    setTimeout(function () {

                        game.communityCard().communityCard().communityCard();
                        
                        //eval and print
                        game.evalHands()
                        
                        io.sockets.in(gameId).emit('Flop', game.getGame());

                        //turn
                        setTimeout(function () {
                            
                            game.communityCard();
                            
                            //eval and print
                            game.evalHands();
                            
                            io.sockets.in(gameId).emit('Turn', game.getGame());

                            //river
                            setTimeout(function () {
                                
                                game.communityCard();
                                
                                //eval and print
                                game.evalHands().printGame();
                                
                                //send to all players river cards
                                io.sockets.in(gameId).emit('River', game.getGame());
                                
                                //set stats
                                var history = game.getGame();
                                
                                history.timestamp = new Date();
                                DalGame.addGameHistory(gameId, history, function (err, game) { });

                                setTimeout(function () {

                                    io.sockets.in(gameId).emit('GameEnded');
                                },1000);
                            }, 3000)
                        }, 2000)
                    }, 5000)
                }, 10)
            });

            socket.on('PlayerSendChatMessage', function (gameId, player, message) {
                
                DalChat.saveChat(gameId, player._id, message, function (err, state) { });
                io.sockets.in(gameId).emit('ChatWatchDog', player, message);
            });
        });
    }
    
    return {
        initialize: _initialize
    };
})();

module.exports = gameSocket;