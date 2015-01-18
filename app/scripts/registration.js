'use strict';

angular.module('registration', ['serverAPI'])
    .controller('regCtrl', function ($scope, serverAPI, cssInjector) {

        cssInjector.removeAll();
        cssInjector.add('styles/registration.css');

        $scope.user;
        $scope.password1;
        $scope.password2;
        $scope.EMail;

        //Handling user submit
        $scope.submit = function () {
            if ($scope.password1 === $scope.password2) {
                console.log('Formular wurde abgeschickt');
                //Catch GeoData to initialize useres position and to grant access to GPS.
                //Grap geoLocation
                var myPosition;
                var location = navigator.geolocation.getCurrentPosition(function (geoData) {
                    myPosition = {
                        'longitude': geoData.coords.longitude,
                        'latitude': geoData.coords.latitude
                    }
                    console.log('' + $scope.user + $scope.password1 + $scope.EMail + myPosition.longitude + myPosition.latitude)
                    serverAPI.createNewUser($scope.user, $scope.password1, $scope.EMail, myPosition.longitude, myPosition.latitude, function (data) {
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
        $scope.$watch('password2', function () {
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

        $scope.$watch('EMail', function () {
            $scope.showWarningEMail = $scope.EMail ? false : true;
        });

    });