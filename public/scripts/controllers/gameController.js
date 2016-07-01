mainApp.controller('gameController', ['$scope', '$http', '$location', '$window', '$routeParams', 'DataModel', '$Player', '$Cards', function ($scope, $http, $location, $window, $routeParams, DataModel, $Player, $Cards) {
        
        var socket = io();
        $scope.ComunityCards = [];
        $scope.myCards = [];
        $scope.win = false;
        $scope.disableStartGameButton = false;
        $scope.currentPlayer = $Player.get();

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
                $scope.disableStartGameButton = true;
            });

            socket.on('GameEnded', function (game) {
                $scope.disableStartGameButton = false;
                $scope.$apply();
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
                    return ($scope.game.eval[player._id] === 1) 

                }
            }

        }

        $scope.dealHands = function (game) {
            console.log(game);
            $scope.win = false;
            $scope.game = game;
            $scope.ComunityCards = [];
            $scope.myCards = [];
            
            //print community cards
            angular.forEach(game.community, function (community) {
                $scope.ComunityCards.push(
                    {
                        suit: $Cards.translateCardSuit(community),
                        rank: $Cards.translateCardRank(community)
                    });
            });
            
            //print my hand
            angular.forEach(game.hands, function (hand, key) {
                
                if (hand.name === $Player.get()._id) {
                    
                    angular.forEach(hand.hand, function (community) {
                        $scope.myCards.push(
                            {
                                suit: $Cards.translateCardSuit(community),
                                rank: $Cards.translateCardRank(community)
                            });
                    });
                }
            });
            
            //get my myChances
            if (game.eval != undefined) {
                $scope.myChances = parseInt(game.eval[$Player.get()._id] * 100, 0);
                
                //check if current player won the game
                if (game.eval[$Player.get()._id] === 1) {
                    $scope.win = true;
                    socket.emit('PlayerWonGame', $routeParams.gameId, $Player.get());
                }
            }
            
            $scope.$apply();
        }
        
        $window.onbeforeunload = $scope.leaveGame;
        
        $scope.init();
    }]);