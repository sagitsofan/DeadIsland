mainApp.controller('gameController', ['$scope', '$http','$timeout', '$location', '$window', '$routeParams', 'DataModel', '$Player', '$Cards', 
    function ($scope, $http, $timeout, $location, $window, $routeParams, DataModel, $Player, $Cards) {
        
        var socket = io();
        $scope.ComunityCards = [];
        $scope.myCards = [];
        $scope.win = false;
        $scope.currentPlayer = $Player.get();
        $scope.isGameInProgress = false;
        $scope.winner = null;
        $scope.advantage = "stav";
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
                $scope.isGameInProgress = false;
                
                if ($scope.winner === null){
                    $timeout($scope.startGame,2000);

                }

                // $scope.$apply();
                
            });
        };
        
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
            socket.emit('StartGame', $routeParams.gameId); //raise event for player start game in sever
        }
        
        $scope.getCardHtml = function (rank, suit) {
            return $Cards.ranks[rank].template.replace(/{{suit}}/g, suit).replace(/{{symbol}}/g, $Cards.suits[suit].symbol);
        }

        $scope.getPlayerHand = function(player){
            if ($scope.game){
                var x = _.where($scope.game.hands,{"name":player._id});
                console.log(x);
                if (x && x.length > 0 && x[0].hand){
                    return x[0].hand;
                }
            }
        }

        $scope.isPlayerWinner = function(player){
            if ($scope.game){
                if ($scope.game.eval){
                    if ($scope.game.eval[player._id] === 1){
                        $scope.advantage = player._id;
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        $scope.dealHands = function (game) {
            console.log(game);
            $scope.game = game;
            $scope.$apply();
        }
        
        $window.onbeforeunload = $scope.leaveGame;
        
        $scope.init();
    }]);