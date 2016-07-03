mainApp.controller('gameController', ['$scope', '$http','$timeout', '$location', '$window', '$routeParams', 'DataModel', '$Player', '$Cards', 
    function ($scope, $http, $timeout, $location, $window, $routeParams, DataModel, $Player, $Cards) {
        
        var socket = io();
        $scope.currentPlayer = $Player.get();
        $scope.isGameInProgress = false;
        $scope.winner = null;
        $scope.gameWinners = [];
        $scope.advantage = "stav";
        $scope.chatStack = "";
        
        $scope.init = function () {
            
            $scope.reloadGame();

            socket.emit('PlayerEntersGame', $routeParams.gameId, $Player.get()); //raise event for new player entered game in sever
            
            //catch the new player event entered room from server
            socket.on('NewPlayerEntersGame', function (player) {
                $scope.reloadGame();
            });
            
            //catch the new player event entered room from server
            socket.on('NewPlayerLeftGame', function (player) {
                $scope.reloadGame();
            });
            
            socket.on('DealHands', function (game) {
                $scope.dealHands(game);
            });
            
            socket.on('Flop', function (game) {
                $scope.dealHands(game);
            });
            
            socket.on('Turn', function (game) {
                $scope.dealHands(game);
            });
            
            socket.on('River', function (game) {
                $scope.dealHands(game);
            });

            socket.on('GameStarted', function (game) {
                $scope.isGameInProgress = true;
                
            });

            socket.on('GameEnded', function (game) {
                $scope.updateWinners();
                $scope.isGameInProgress = false;
                
                if ($scope.gameWinners.length > 1){
                    //split
                    $scope.advantage = null;
                    //$timeout($scope.startGame,3000);

                } else if ($scope.gameWinners.length === 1) {
                    
                    if ($scope.advantage === $scope.gameWinners[0]){
                        //second point, the winner!
                        $scope.advantage = null;
                        $scope.winner = $scope.gameWinners[0];
                    } else {
                        //we have one winner - set advantage
                        $scope.advantage = $scope.gameWinners[0];
                        if ($scope.isAdmin($scope.currentPlayer)){
                            //$timeout($scope.startGame,2000);
                        }
                    }

                }





                $scope.$apply();
                
            });

            socket.on('ChatWatchDog', function (from, message) {
                $scope.chatStack += from.username + ":" + message + "<br>";
                $scope.$apply();
            });

            //socket.on('disconnect', function () {
                //socket.emit('PlayerLeftGame', $routeParams.gameId, $Player.get());
            //});
        };
        
        $scope.isAdmin = function(player){
            if (player){
                return player._id === $scope.currentGame.admin;
            }
        }

        $scope.reloadGame = function () {
            DataModel.getGame($routeParams.gameId).success(function (data) {
                $scope.currentGame = data;
            })
        };

        $scope.leaveGame = function () {
            socket.emit('PlayerLeftGame', $routeParams.gameId, $Player.get()); //raise event for player left game in sever
            $location.path("/dashboard");
        }
        
        $scope.startGame = function () {
            $scope.gameWinners = [];
            $scope.winner = null;
            socket.emit('StartGame', $routeParams.gameId); //raise event for player start game in sever
        }
        
        $scope.getPlayerHand = function(player){
            if ($scope.game){
                var x = _.where($scope.game.hands,{"name":player._id});
                if (x && x.length > 0 && x[0].hand){
                    return x[0].hand;
                }
            }
        }

        $scope.getPlayerBet = function(player){
            if ($scope.game && player && $scope.game.eval){
                var num = $scope.game.eval[player._id];
                return parseInt(num * 100, 0) + "%";
            }
        }

        $scope.updateWinners = function(player){

            _.each($scope.game.eval,function(val,key){
                if (val === 1){
                    $scope.gameWinners.push(key);
                }
            });
            console.log($scope.gameWinners);
        }

        $scope.isPlayerWinner = function(player){
            if ($scope.game){
                if ($scope.game.eval){ 
                    if ($scope.game.eval[player._id] === 1){
                        return true;
                    } else {
                        return false;
                    }                
                    
                }
            }
        }

        $scope.dealHands = function (game) {
            $scope.game = game;
            $scope.$apply();
        }
        
        $scope.sendChatMessage = function () {
            if ($scope.chatMessage != null) {
                socket.emit('PlayerSendChatMessage', $routeParams.gameId, $scope.currentPlayer, $scope.chatMessage);
                $scope.chatMessage = null;
            }
        }

        $window.onbeforeunload = $scope.leaveGame;
        
        $scope.init();
    }]);