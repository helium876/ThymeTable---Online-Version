var app = angular.module('starter', ['ionic', 'firebase']);
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
    $stateProvider
    .state('login', {
        url: '/login',
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
    $urlRouterProvider.otherwise('/login');
});

app.controller("LoginController", function($scope, $firebaseAuth, $location) {
 
    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $location.path("/time");
        }).catch(function(error) {
            console.error("ERROR: " + error);
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
            $location.path("/time");
        }).catch(function(error) {
            console.error("ERROR " + error);
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
    }
});

app.$inject = ['$scope'];