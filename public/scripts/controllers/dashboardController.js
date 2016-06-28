mainApp.controller('dashboardController', ['$scope', '$http', '$location', 'DataModel', function ($scope, $http, $location, DataModel) {
        
        $scope.init = function () {

            DataModel.getActiveGames().success(function (data) {
                
                $scope.games = data;
            })
        };
        
        $scope.joinGame = function () {
            $location.path("/game/" + $scope.selectedGame);
        };

        $scope.init();
}]);