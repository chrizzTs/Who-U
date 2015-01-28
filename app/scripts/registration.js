'use strict';

angular.module('registration', ['serverAPI'])
    .controller('regCtrl', function ($scope, $rootScope, serverAPI, cssInjector) {

        cssInjector.removeAll();
        cssInjector.add('styles/registration.css');

        $scope.user='';
        $scope.password1='';
        $scope.password2='';
        $scope.EMail='';
        $scope.EMailInUse=false;
    
        $scope.disabler=true;
    
        $scope.enableButton=function(){
            if($scope.user.length>=5 && $scope.password1.length>=5 && $scope.password1==$scope.password2 && $scope.regForm.$valid==true){
                $scope.disabler=false;
            }else{
                $scope.disabler=true;
            }
        }

        //Handling user submit
        $scope.submit = function () {
            if ($scope.password1 == $scope.password2) {
                $scope.disabler=true;
                //Catch GeoData to initialize useres position and to grant access to GPS.
                //Grap geoLocation
                var myPosition;
                var location = navigator.geolocation.getCurrentPosition(function (geoData) {
                    myPosition = {
                        'longitude': geoData.coords.longitude,
                        'latitude': geoData.coords.latitude
                    }
                    
                    serverAPI.createNewUser($scope.user, $scope.password1, $scope.EMail, myPosition.longitude, myPosition.latitude, function (data) {
                        console.error(data);
                        var check=parseInt(data);
                        
                        if(check==-2){
                            $scope.EMailInUse=true;
                        }else{
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
                            window.localStorage.setItem('saveData', 'false');
                            window.localStorage.setItem('pushNotifications', 'true');
                            window.location = "#/tab/home";
                             $rootScope.login = true
                        }
                    });
                });

            } 
        };

        //Check if user name has at least 5 characters
        $scope.$watch('user', function () {
            if($scope.user.length < 5){
                $scope.showWarningUser = true;
            }else{
                $scope.showWarningUser = false;
                $scope.enableButton();
            }
            
        });

        //Chek if PW1 is at least 5 characters
        $scope.$watch('password1', function () {
           if($scope.password1.length < 5){
                $scope.showWarningPW1 = true;
           }else{
                $scope.showWarningPW1 = false;
                $scope.enableButton();
           }
        });

        //Check if user entered same PW two times
        $scope.$watch('password2', function () {
            if ($scope.password2 == $scope.password1) {
                if ($scope.password2 == '') {
                    $scope.showWarningEmpty = true;
                }
                $scope.showWarningPW2 = false;
                $scope.enableButton();
            } else {
                $scope.showWarningEmpty = false;
                $scope.showWarningPW2 = true;
            }

        });

        $scope.$watch('EMail', function () {
            $scope.showWarningEMail = $scope.EMail ? false : true;
            $scope.enableButton();
        });

    });