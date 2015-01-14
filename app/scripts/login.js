'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI, $location, cssInjector, services, $state) {
        cssInjector.add("styles/login.css");
        $scope.EMail;
        $scope.password;
        $scope.user;
        $scope.email;
        var credentials
        var sessionKey
        var userId

        //Check if Credentials are in LocalStorage
        if ((credentials = window.localStorage['Credentials']) != null) {
            var sessionKey = JSON.parse(window.localStorage['Credentials'])['SessionKey']
            var userId = JSON.parse(window.localStorage['Credentials'])['UID']
            var visible = window.localStorage.getItem('visible');

            //If UID and SessionKey are available autoLogin
            if (sessionKey != null && userId != null)
                serverAPI.loginWithSessionKey(userId, sessionKey, function (data) {
                    console.log(data);
                    //visible == null means, the app is starting for the first time, or the local storage was deleted by the user
                    //In case there is no "visible" available, BackgroundGps starts and the user is available for any games
                    //If there is a "visible" status available, we have to respect the users choice to keep off any games
                    if (visible == null || visible == true) {
                        window.localStorage.setItem('visible', true);
                        services.initBackgroundGps();
                        services.startBackgroundGps();
                    }
                    window.localStorage.setItem('searchButton', 'true');
                    window.location = "#/tab/home";
                })
        }

        //Problem here as soon as someone signs up and anotherone logs in

        //Method to be called when credentials are inserted
        $scope.submit = function () {
            //Login requires callback
            serverAPI.loginWithMail($scope.EMail, $scope.password, function (data) {
                console.log(data)
                var sessionKey = data //parseInt(data.substring(2))
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.localStorage.setItem('visible', true);
                    window.localStorage.setItem('searchButton', 'true');
                    window.localStorage.setItem('Facebook', false);
                    window.location = "#/tab/home";
                    services.initBackgroundGps();
                    services.startBackgroundGps();
                } else {
                    $scope.loginFailed = true;
                }
            })
        }

    
    
     $scope.facebookLogin = function () {

        
         openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
             //   console.log(response.grantedScopes);
                $scope.goToHome();
                $scope.closeLogin();
            } else {
                alert('Facebook login failed');
            }
        },
        {scope: 'email, user_photos',
        return_scopes: true});
         
     }
     
     
     
         $scope.goToHome = function(){
               //Catch GeoData to initialize useres position and to grant access to GPS.
                //Grap geoLocation
                    
             openFB.api({
        path: '/me',
        params: {fields: 'id,name, first_name'},
        success: function(user) {
            $scope.$apply(function() {
                $scope.user = user;
                window.localStorage.setItem('user', JSON.stringify(user));
                window.localStorage.setItem('facebook', true);
                console.log(user);
            });
            serverAPI.loginWithMail($scope.user.id, 'facebook', function (data) {
                if (data != '3'){
                console.log(data)
                var sessionKey = data //parseInt(data.substring(2))
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.localStorage.setItem('visible', true);
                    window.localStorage.setItem('searchButton', 'true');
                    window.location = "#/tab/home";
                    services.initBackgroundGps();
                    services.startBackgroundGps();
                } else {
                    $scope.loginFailed = true;
                }
                } else {
                    $scope.createFacebookUser();
                }
            })
            
        },
        error: function(error) {
            alert('Facebook error: ' + error.error_description);
        }
    });
         }
             




       
        $scope.createFacebookUser = function () {
            console.log($scope.user.name);
            console.log($scope.user.email);
            console.log($scope.user.id);
            var myPosition;
            var location = navigator.geolocation.getCurrentPosition(function (geoData) {
                myPosition = {
                    'longitude': geoData.coords.longitude,
                    'latitude': geoData.coords.latitude
                }
                serverAPI.createNewUser($scope.user.first_name, 'facebook', $scope.user.id, myPosition.longitude, myPosition.latitude, function (data) {
                    console.log(data);
                    var storedCredentials
                    var newCredentials
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
                    window.localStorage.setItem('Credentials', JSON.stringify(newCredentials));
                    window.localStorage.setItem('visible', true);
                    window.location = "#/tab/home";
                });
            });




        };




        $scope.facebookLogout = function () {
            openFB.logout(
                function (response) {
                    alert('You are logged out');
                })


        }



        /*

    $scope.fbOptions = 
        {fbId: '{339615032892277}',
    permissions: 'email,user_photos',
    fields: 'email,user_photos',
    success: function (data) {
        console.log('Basic public user data returned by Facebook', data);
    },
    error: function (error) {
        console.log('An error occurred.', error);
    }};



        $.fblogin({
    fbId: '{339615032892277}',
    permissions: 'email,user_photos',
    fields: 'email,user_photos',
    success: function (data) {
        console.log('Basic public user data returned by Facebook', data);
    },
    error: function (error) {
        console.log('An error occurred.', error);
    }
});*/

    });