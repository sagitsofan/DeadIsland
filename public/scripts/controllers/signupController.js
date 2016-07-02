mainApp.controller('signupController', ['$scope', '$http', '$location', '$rootScope', 'DataModel', '$Player', function ($scope, $http, $location, $rootScope, DataModel, $Player) {
        
        $scope.formData = {};
        
        $scope.signup = function () {
            
            DataModel.signup($scope.formData).success(function (data) {
        
                if (data != null) {
                    $Player.set(data);
                    $rootScope.$emit("LoginOccured"); //refresh basecontroller login
                    $location.path("/dashboard");
                }
                else {
                    $scope.label = "Username / password was incorrect";
                }
            })
        };
    }]);