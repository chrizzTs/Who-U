'use strict';

angular.module('login', [])
    .controller('loginCtrl', function ($scope) {

        $scope.EMail;
        $scope.password;

        var SessionKey = window.localStorage['SessionKey'];

        if (SessionKey) {
            loginWithSessionKey($scope.EMail, SessionKey);
        } else {
            $scope.submit = function () {
                // loginWithUsername($scope.EMail, $scope.password);
            };
            //if logIn successfull --> store sessionKey in local storage
        }

    });