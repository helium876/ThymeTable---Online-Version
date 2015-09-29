var app = angular.module('starter', ['ionic', 'firebase','ui.router','ngCordova']);
var fb = null;
 
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        fb = new Firebase("https://skedulr.firebaseio.com/");
    });
});

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider
    .state('login', {
        url: '/login',
        //abstract: true, 
        templateUrl: 'templates/login.html',
        controller: 'LoginController'
    })
    .state('add', {
        url: '/add',
        templateUrl: 'templates/add.html',
        controller: 'TimeController'

    })
    .state('time', {
        url: '/time',
        templateUrl: 'templates/time.html',
        controller: 'TimeController'    
    });
});

app.controller("LoginController", function($scope, $rootScope, $state, $timeout, $firebaseAuth) {
 
    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $scope.message= "Logged in as:" + authData.uid;
           $timeout(function() {
                $state.transitionTo("time");
            }, 1000);
        }).catch(function(error) {
            $scope.error = "Authentication failed: " +error;
        });
    }
 
    $scope.register = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
        $scope.message= "Logged in as:" + authData.uid;
            $timeout(function() {
                $state.transitionTo("time");
            }, 5000);
        }).catch(function(error) {
            $scope.error("ERROR " + error);
        });
    }
 
});

app.controller("TimeController", function($scope, $firebaseObject, $ionicModal, $timeout) {
    
    $scope.list = function() {
        fbAuth = fb.getAuth();
        if(fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
    }

    $ionicModal.fromTemplateUrl('templates/add.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      $scope.openModal = function() {
        $scope.modal.show();
      };
    $scope.create = function(tt) {
        if($scope.data.hasOwnProperty("ttables") !== true) {
            $scope.data.ttables = [];
        }
        $scope.data.ttables.push({
            title: tt.module, 
            room: tt.room,
            time: tt.time,
            //day: tt.day,
            lect: tt.lect
        });
        $scope.closeLogin();
    }
});

app.$inject = ['$scope'];
app.$inject = ['state'];