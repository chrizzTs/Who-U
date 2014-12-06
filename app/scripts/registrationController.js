'use strict';

var WhoU = angular.module('WhoU', []);

angular.module('WhoU', [])
    .controller('regCtrl', function ($scope) {

        $scope.user;
        $scope.password1;
        $scope.password2;
        $scope.EMail;

        //Handling user submit
        $scope.submit = function () {
            if ($scope.password1 === $scope.password2) {
                console.log('Formular wurde abgeschickt');
                createNewUser($scope.user, $scope.password1, $scope.EMail);
            } else {
                console.log('Fehler bei den Passwörtern');
            }
        };

        //Check if user name has at least 5 characters
        $scope.$watch('user', function () {
            $scope.showWarningUser = $scope.user ? false : true;
        });

        //Chek if PW1 is at least 5 characters
        $scope.$watch('password1', function () {
            $scope.showWarningPW1 = $scope.password1 ? false : true;
        });

        //Check if user entered same PW two times
        //Currently errors
        $scope.$watch('password2', function () {
            if ($scope.password2 == $scope.password1) {
                console.log('Sind gleich');
            } else {
                console.log('Sind ungleich');
                $scope.showWarningPW2 = $scope.password2 ? true : false;
                //$scope.showWarningPW2 = $scope.password2 ? false : true;
            }

        });

        $scope.$watch('EMail', function () {
            $scope.showWarningEMail = $scope.EMail ? false : true;
        });

    });