'use strict'
angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $location, $state, serverAPI, $ionicPopup, cssInjector) {

        cssInjector.removeAll();

        $scope.buttonType = "icon ion-search";
        $scope.buttonDisable = false;
        $scope.text = 'Search';


        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        serverAPI.getUserData(UID, function (data) {
            $scope.userName = data.userName;
            $scope.coins = data.coins;
            window.localStorage.setItem('photoIds', JSON.stringify(data.photoIds));
        });


        serverAPI.getRecentEvents(UID, function (data) {
            $scope.events = data;

        });

        serverAPI.getGamesToRate(UID, getGamesToRate);

        //Request new feedback sheet from server to rate last plays (contat with new persons)

        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

        function getGamesToRate(data) {
            console.log(data);
            // Check if there are any new feedback sheets availalbe
            if (data == -10) {} else {
                $ionicPopup.alert({
                    title: 'Feedback',
                    template: 'There is a player that you have not rated yet. Please rate the player before you can keep playing.'
                });
                $scope.go('tab.feedback');
            }
        };




        $scope.click = function () {
            console.log($scope.buttonDisable);
            $scope.buttonDisable = true;
            console.log($scope.buttonDisable);

            console.log($scope.text);
            $scope.text = 'Searching';
            console.log($scope.text);

            console.log($scope.buttonType);
            $scope.buttonType = 'icon ion-loading-a';
            console.log($scope.buttonType);



            //Grap geoLocation    
            var location = navigator.geolocation.getCurrentPosition(saveGeoData);



            function saveGeoData(geoData) {
                alert(geoData);
                var myPosition = {
                    'longitude': geoData.coords.longitude,
                    'latitude': geoData.coords.latitude
                };

                window.localStorage.setItem('myPosition', JSON.stringify(myPosition));
                //If geoloaction is saved successfully => Send geodata to server to receive teammate
                sendToServer(myPosition);
            };

            //Send current location to Server to receive teammate
            function sendToServer(myPosition) {
                serverAPI.searchPartnerToPlayWith(myPosition.longitude, myPosition.latitude, UID, function (data) {

                    //No other players around you. Server returns -1 
                    if (data == -1) {
                        $ionicPopup.alert({
                            title: 'Too bad :(',
                            template: 'Unfortunateley there are no other players around you. Try it some other time!'
                        });
                    } else {
                        window.localStorage.setItem('teammate', data.username);
                        window.localStorage.setItem('isEnummeration', data.taskType);
                        window.localStorage.setItem('task', data.task);
                        var teammatePosition = {
                            'longitude': data.longitude,
                            'latitude': data.latitude
                        };
                        window.localStorage.setItem('teammatePosition', teammatePosition);
                        //TODO: data.fotoId => request foto from server
                        $state.go('tab.play-screen');
                    }


                })
            }
        }
    })