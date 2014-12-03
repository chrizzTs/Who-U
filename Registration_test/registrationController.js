'use strict';

var WhoU = angular.module('WhoU', []);

angular.module('WhoU', [])
    .controller('regCtrl', function ($scope) {
        //$scope.regForm = {};
        $scope.user = 'Enter a user name';
        $scope.password1 = '1111';
        $scope.password2 = '1112';
        $scope.EMail = 'email@example.com';

    });