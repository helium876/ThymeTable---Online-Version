var app = angular.module('starter', ['ionic', 'firebase','ui.router','ngCordova','drawer']);
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

app.controller("LoginController", function($scope, $ionicPopup, $rootScope, $state, $timeout, $firebaseAuth, $ionicLoading) {
 
    $scope.login = function(username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $ionicLoading.show({
                content: 'Loading',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
              });

           // $scope.message= "Logged in as:" + authData.uid;
            console.log("Logged in as:" + authData.uid);
           $timeout(function() {
                $ionicLoading.hide();
                $state.transitionTo("time");
            }, 2000);
        }).catch(function(error) {
            //$scope.error = 
            console.log("Authentication failed: " + error);
            var msg = "Try Again";

        /*if(error && error.code) {
          switch (error.code) {
            case "EMAIL_TAKEN":
              msg = "This Email has been taken."; break;
            case "INVALID_EMAIL":
              msg = "Invalid Email."; break;
          case "NETWORK_ERROR":
              msg = "Network Error."; break;
            case "INVALID_PASSWORD":
              msg = "Invalid Password."; break;
            case "INVALID_USER":
              msg = "Invalid User."; break;
          }
        }*/
            
            $ionicPopup.alert({
                 title: 'Login Error',
                 template: msg
               });
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
            

        var msg = "Try Again";

        /*if(error && error.code) {
          switch (error.code) {
            case "EMAIL_TAKEN":
              msg = "This Email has been taken."; break;
            case "INVALID_EMAIL":
              msg = "Invalid Email."; break;
          case "NETWORK_ERROR":
              msg = "Network Error."; break;
            case "INVALID_PASSWORD":
              msg = "Invalid Password."; break;
            case "INVALID_USER":
              msg = "Invalid User."; break;
          }
        }*/
            
            $ionicPopup.alert({
                 title: 'Registration Error',
                 template: msg
               });
    
            console.log("Authentication failed: " + error);
        });
    }


 
});

app.controller("TimeController", function($scope, $firebaseObject, $ionicModal, $ionicActionSheet,$timeout) {
    
    $scope.list = function() {
        fbAuth = fb.getAuth();
        if(fbAuth) {
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }
        
    }

    /*$scope.getColor = function(color){
        $(function(){
            console.log(color);
            $scope.Q1 = "#1E8A09";
            //Q2 = "#7D2A68";
            //Q3 = "#333676";
            if(color == "Lab"){
                //$(".card .item, .card").css("background-color","#AA3939");
                $scope.Q1 = "#AA3939";
            }else
                if(color == "Lecture"){
                    //$(".card .item, .card").css("background-color","#7D2A68");
                    console.log(Q2);
                    $scope.Q1 = "#7D2A68";
                }else if(color == "Tutorial"){
                        //$(".card .item, .card").css("background-color","#333676");
                        $scope.Q1 = "#333676";
                     }
                     //else{
                        //$(".card .item, .card").css("background-color","#fff");
                        //return { color: "#fff" }
                //}
        })
    }*/

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
            day: tt.day,
            type: tt.type,
            lect: tt.lect
        });
        $scope.closeLogin();
    }


        // Triggered on a button click, or some other target
     $scope.onHold = function(index) {
      var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
       // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
            {text: 'Delete'},
            { text: 'Edit' },
            {text: 'Mark'}
         ],
         titleText: 'Options',
         cancelText: 'Cancel',
         cancel: function() {
              hidesheet();
            },
         buttonClicked: function(index) {
              if (index == 0) {
                console.log("DELETE");
                $syncObject.$remove(index);
              };
           return true;
         }
       });

       // For example's sake, hide the sheet after two seconds
       //$timeout(function() {
       //  hideSheet();
      // }, 2000);

     };
});

app.$inject = ['$scope'];
app.$inject = ['state'];