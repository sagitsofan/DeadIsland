var mainApp = angular.module('mainApp', ['ngRoute', 'ngSanitize']);

mainApp.config(['$routeProvider', function ($routeProvider) {
        
        $routeProvider.
                    when('/login', { templateUrl: '/views/login.html' }).
                    when('/dashboard', { templateUrl: '/views/dashboard.html' }).
                    when('/game/:gameId', { templateUrl: '/views/game.html' }).
                    otherwise({ redirectTo: '/login' });
                   //$locationProvider.html5Mode(true);
    }]);
