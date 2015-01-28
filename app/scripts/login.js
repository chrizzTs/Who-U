'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI, $rootScope, $location, cssInjector, services, $state) {
        
        cssInjector.add("styles/login.css");
        
        $scope.EMail='';
        $scope.password='';
        $scope.user;
        $scope.email;
        $scope.disabler;
        var credentials
        var sessionKey
        var userId
        
        $scope.$watch('password', function () {
           if($scope.password.length >= 5 && $scope.loginForm.$valid==true){
               $scope.disabler=false;
           }else{
               $scope.disabler=true;
           }
        });

        //Check if Credentials are in LocalStorage
        if ((credentials = window.localStorage['Credentials']) != null) {
            var sessionKey = JSON.parse(window.localStorage['Credentials'])['SessionKey']
            var userId = JSON.parse(window.localStorage['Credentials'])['UID']
            var visible = window.localStorage.getItem('visible');

            //If UID and SessionKey are available autoLogin
            if (sessionKey != null && userId != null)
                serverAPI.loginWithSessionKey(userId, sessionKey, function (data) {
                    console.error(data);
                    //visible == null means, the app is starting for the first time, or the local storage was deleted by the user
                    //In case there is no "visible" available, BackgroundGps starts and the user is available for any games
                    //If there is a "visible" status available, we have to respect the users choice to keep off any games
                    if (visible == null || visible == true) {
                        window.localStorage.setItem('visible', true);
                        services.initBackgroundGps();
                    }
                    window.localStorage.setItem('saveData', 'false');
                    window.localStorage.setItem('pushNotifications', 'true');
                    window.location = "#/tab/home";
                    $rootScope.login = true
                })
        }

        //Method to be called when credentials are inserted
        $scope.submit = function () {
            $scope.disabler=true;
            //Login requires callback
            serverAPI.loginWithMail($scope.EMail, $scope.password, function (data) {
                console.error(data);
                var sessionKey = data;
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.localStorage.setItem('visible', true);
                    window.localStorage.setItem('saveData', 'false');
                    window.localStorage.setItem('facebook', 'false');
                    window.localStorage.setItem('pushNotifications', 'true');
                    window.location = "#/tab/home";
                     $rootScope.login = true
                    services.initBackgroundGps();
                } else {
                    $scope.loginFailed = true;
                }
            })
        }
//============Start: Facebook Integration=======================
        
//============Start: Facebook Login=============================
    
    //$scope.facebookLogin tries to login to Facebook with the openFB API and if it succeds, executes the function $scope.goToHome(), which will take the user to the Home-Screen if he has been logged in to Facebook before. In the scope variable, permissions could be written, that need to be given from Facebook. The Facebook integration just needs the connection to Facebook and the Profile Picture of the user, which are both public so nothing has to be inserted here.
    
     $scope.facebookLogin = function () {

         openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.goToHome();


            } else {
                alert('Facebook login failed');
            }
        },
        {scope: '',
        return_scopes: true});
         
    }
     
     
     
     
     
         $scope.goToHome = function(){
            
             openFB.api({
        path: '/me',
        params: {fields: 'id, first_name'},
        success: function(user) {
            $scope.$apply(function() {
                $scope.user = user;
                window.localStorage.setItem('user', JSON.stringify(user));
                window.localStorage.setItem('facebook', 'true');
                console.log(user);
            });
             
            //E-Mail of Facebook users: Facebook ID
            //Password of Facebook users: 'facebook'
            serverAPI.loginWithMail($scope.user.id, 'facebook', function (data) {
                if (data != '-3'){
                //Case: Facebook user has been created yet
                
                //regular login process
                var sessionKey = data 
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.localStorage.setItem('visible', true);
                    window.localStorage.setItem('pushNotifications', 'true');
                    window.localStorage.setItem('saveData', 'false');
                    window.location = "#/tab/home";
                     $rootScope.login = true
                    services.initBackgroundGps();

                } else {
                    $scope.loginFailed = true;
                }
                }
                //Case: Facebook user is not created yet
                else {
                    $scope.createFacebookUser();
                }
            })
            
        },
        error: function(error) {
            alert('Facebook error: ' + error.error_description);
        }
                
    });
             
         }
             

//====================End: Facebook Login=========================
//==================Start: Create Facebook User===================
       
        $scope.createFacebookUser = function () {
            
            //Find out current Position
            var myPosition;
            var location = navigator.geolocation.getCurrentPosition(function (geoData) {
                myPosition = {
                    'longitude': geoData.coords.longitude,
                    'latitude': geoData.coords.latitude
                }
                
                
            serverAPI.createNewUser($scope.user.first_name, 'facebook', $scope.user.id, myPosition.longitude, myPosition.latitude, function (data) {
                
                //Registration specific code. Copied from registration.js
                    console.log(data);
                    var storedCredentials;
                    var newCredentials;
                    if ((storedCredentials = window.localStorage.getItem('Credentials')) != null) {
                        storedCredentials = JSON.parse(storedCredentials)
                        storedCredentials['UID'] = data
                        storedCredentials['SessionKey'] = null
                        newCredentials = storedCredentials
                    } else {
                        newCredentials = {
                            'UID': data
                        }
                    }
                    
                    $rootScope.login = true
                    
                       //Add Facebook Profile Photo
                    services.addFBProfilePicture();
                    
                    //This time goToHome will be able to login the user and he continue to the Home-Screen.
                    $scope.goToHome();
                    
                });
            });
        };
});

//============End: Create Facebook User=======================
//============End: Facebook Integration=======================