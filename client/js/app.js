/**
 * Created by nevena on 8.4.15..
 */
'use strict';

var app = angular.module('MyApp', [
    'lbServices',
    'ui.router',
    'ngResource',
    'ngMaterial',
    'ngMdIcons',
    'ngRoute'
]);

/*app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('lekovi', {
            url: '/lekovi',
            templateUrl: '../view/lekovi.html',
            controller: 'LekoviController',
            authenticate: true
        })
}]);*/

app.config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '../view/lekovi.html',
            controller: 'LekoviController'
        });
    $httpProvider.defaults.cache = true;
}]);

app.config(function(LoopBackResourceProvider) {
    LoopBackResourceProvider.setUrlBase('http://localhost:3000/api');
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
});

app.run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function(event, next) {

    });
}]);
