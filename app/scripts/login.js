'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope, serverAPI) {
        console.log('Läuft')
        $scope.EMail;
        $scope.password;

        var SessionKey = window.localStorage['SessionKey'];


        if (SessionKey) {
            serverAPI.loginWithSessionKey($scope.EMail, SessionKey);
        } else {
            $scope.submit = function () {
                serverAPI.testMehtode()
            };
            //if logIn successfull --> store sessionKey in local storage
        }

    });