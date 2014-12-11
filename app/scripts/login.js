'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI) {
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
                    console.log(data)
                })
        }

        //Problem here as soon as someone signs up and anotherone logs in

        //Method to be called when credentials are inserted
        $scope.submit = function () {
            serverAPI.loginWithUsername($scope.EMail, $scope.password, function (data) {
                var sessionKey = parseInt(data.substring(2))
                if (sessionKey > 0) {
                    if (credentials != null) {
                        credentials['SessionKey'] = sessionKey
                    } else {
                        credentials = {
                            'UID': null,
                            'SessionKey': sessionKey
                        }
                    }
                    window.localStorage.setItem('Credentials', credentials)
                } else {
                    console.log('Log-In Fehler')
                }
            })
        }
        serverAPI.searchPartnerToPlayWith(123, 123, 123, function (data) {
            console.log(data)
        })
    })
