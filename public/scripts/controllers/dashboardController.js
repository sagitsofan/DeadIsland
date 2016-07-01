
﻿mainApp.controller('dashboardController', ['$scope', '$http', '$location', '$Player', 'DataModel', function ($scope, $http, $location, $Player, DataModel) {
        
        $scope.currentPlayer = $Player.get();

        $scope.init = function () {
            $scope.isGamesLoading = true;

            // DataModel.getGames().success(function (data) {
            DataModel.getActiveGames().success(function (data) {
                $scope.games = data;
                $scope.isGamesLoading = false;
            })
        };
        

        $scope.joinGame = function (gameId) {
            $location.path("/game/" + gameId);
        };
        
        $scope.deleteGame = function (game) {
            DataModel.deleteGame(game).success(function (data) {
                $scope.init();
            })
        }
        
        $scope.createGame = function (game) {
            
            if (game != undefined && game.name != "") {
                
                game.admin = $Player.get()._id;

                DataModel.addGame(game).success(function (data) {
                    $scope.game = null;
                    $scope.init();
                })
            }
        }

        $scope.init();
}]);