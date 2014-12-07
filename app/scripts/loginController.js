'use strict';

var WhoU = angular.module('WhoU', []);

angular.module('WhoU', [])
    .controller('loginCtrl', function ($scope) {

        $scope.EMail;
        $scope.password;

        var SessionKey = window.localStorage['SessionKey'];

        if (SessionKey) {
            loginWithSessionKey($scope.EMail, SessionKey);
        } else {
            $scope.submit = function () {
                loginWithUsername($scope.EMail, $scope.password);
            };
            //if logIn successfull --> store sessionKey in local storage
        }
    });