'use strict';

angular.module('registration', ['ServerAPI'])
  .controller('regCtrl', function($scope, serverAPI, cssInjector) {

    cssInjector.add('styles/registration.css');

    $scope.user;
    $scope.password1;
    $scope.password2;
    $scope.EMail;

    //Handling user submit
    $scope.submit = function() {
      if ($scope.password1 === $scope.password2) {
        console.log('Formular wurde abgeschickt');
        serverAPI.createNewUser($scope.user, $scope.password1, $scope.EMail, function(data) {
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
          window.localStorage.setItem('Credentials', JSON.stringify(newCredentials))
          window.location = "#/login";
        });
      } else {
        console.log('Fehler bei den Passwörtern');
      }
    };

    //Check if user name has at least 5 characters
    $scope.$watch('user', function() {
      $scope.showWarningUser = $scope.user ? false : true;
    });

    //Chek if PW1 is at least 5 characters
    $scope.$watch('password1', function() {
      $scope.showWarningPW1 = $scope.password1 ? false : true;
    });

    //Check if user entered same PW two times
    //Currently errors
    $scope.$watch('password2', function() {
      if ($scope.password2 == $scope.password1) {
        if ($scope.password2 == null) {
          $scope.showWarningEmpty = true;
        }
        $scope.showWarningPW2 = false;
      } else {
        console.log('Sind ungleich');
        $scope.showWarningEmpty = false;
        $scope.showWarningPW2 = true;
      }

    });

    $scope.$watch('EMail', function() {
      $scope.showWarningEMail = $scope.EMail ? false : true;
    });

  });
