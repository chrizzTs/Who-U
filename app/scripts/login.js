'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI, $location) {
        $scope.EMail;
        $scope.password;
        var credentials
        var sessionKey
        var userId

        //Check if Credentials are in LocalStorage
        if ((credentials = window.localStorage['Credentials']) != null) {
            var sessionKey = JSON.parse(window.localStorage['Credentials'])['SessionKey']
            var userId = JSON.parse(window.localStorage['Credentials'])['UID']

            //If UID and SessionKey are available autoLogin
            if (sessionKey != null && userId != null)
                serverAPI.loginWithSessionKey(userId, sessionKey, function (data) {
                    console.log(data);
                    window.location = "#/tab/home";
                })
        }

        //Problem here as soon as someone signs up and anotherone logs in

        //Method to be called when credentials are inserted
        $scope.submit = function () {
            serverAPI.loginWithMail($scope.EMail, $scope.password, function (data) {
                console.log(data)
                var sessionKey = data //parseInt(data.substring(2))
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.location = "#/tab/home";
                } else {
                    console.log('Log-In Fehler')
                    $scope.loginFailed = true;
                }
            })
        }
    });