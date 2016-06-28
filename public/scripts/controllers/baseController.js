mainApp.controller('baseController', ['$scope', '$rootScope', '$location', '$Player', function ($scope, $rootScope, $location, $Player) {
        
        $scope.init = function () {
            
            if ($Player.get() == null) {
                if ($location.$$path != "/login") {
                    $location.path("/login");
                }
            }
            else {
                $scope.loggedPlayer = $Player.get();
            }
        };

        $rootScope.$on("LoginOccured", function (event) {
            $scope.init();
        });

        $scope.logout = function () {
            $Player.logout();
        };
        
        $scope.init();
    }]);