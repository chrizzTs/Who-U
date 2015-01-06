'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI, $location, cssInjector, services) {
        cssInjector.add("styles/login.css");
        $scope.EMail;
        $scope.password;
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
                    if (visible == null) {
                        window.localStorage.setItem('visible', true);
                        services.initBackgroundGps();
                        services.startBackgroundGps();
                    }
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
                    window.location = "#/tab/home";
                    services.initBackgroundGps();
                    services.startBackgroundGps();
                } else {
                    $scope.loginFailed = true;
                }
            })
        }
    });