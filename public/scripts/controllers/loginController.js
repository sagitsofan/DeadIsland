mainApp.controller('loginController', ['$scope', '$http', '$location', '$rootScope', 'DataModel', '$Player', function ($scope, $http, $location, $rootScope, DataModel, $Player) {
        
        $scope.formData = {};
        
        $scope.login = function () {
        
            DataModel.login($scope.formData.username, $scope.formData.password).success(function (data) {
        
                if (data != "") {
                    $Player.set(data);
                    $rootScope.$emit("LoginOccured"); //refresh basecontroller login
                    $location.path("/dashboard");
                }
                else {
                    $scope.label = "Username / password was incorrect";
                }
            })
        };
        
        $scope.FBLogin = function () {
            FB.login(function (response) {
                $scope.statusChangeCallback(response);
            });
        };
        
        $scope.getLoginStatus = function () {
            FB.getLoginStatus(function (response) {
                $scope.statusChangeCallback(response);
            });
        };
        
        //$scope.testAPI = function () {
        //    console.log('Welcome!  Fetching your information.... ');
        //    FB.api('/me', function (response) {
        //        console.log('Successful login for: ' + response.name);
        //        console.log(response);
        //        console.log('Thanks for logging in, ' + response.name + '!');
        //    });
        //};
        
        $scope.statusChangeCallback = function (response) {
            $scope.FBUserId = response.authResponse.userID;
            console.log('statusChangeCallback');
            console.log(response);
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                // Logged into your app and Facebook.
                //$scope.testAPI();
                console.log('connected');
            } else if (response.status === 'not_authorized') {
                // The person is logged into Facebook, but not your app.
                console.log('not_authorized');
            } else {
                // The person is not logged into Facebook, so we're not sure if
                // they are logged into this app or not.
                console.log('Please log into Facebook.');
            }
        };
    }]);






