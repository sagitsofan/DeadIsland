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

mainApp.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.myEnter);
                });
                
                event.preventDefault();
            }
        });
    };
});
