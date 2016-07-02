mainApp.controller('baseController', ['$scope', '$sce', '$rootScope', '$location', '$Player', function ($scope, $sce, $rootScope, $location, $Player) {
        
        $rootScope.$on("LoginOccured", function (event) {
            $scope.init();
        });

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

        $scope.logout = function () {
            $Player.logout();
        };
        
        $scope.trustedHtml = function (plainText) {
            return $sce.trustAsHtml(plainText);
        }
        
        $scope.init();
    }]);