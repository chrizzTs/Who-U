angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $location, $state, localStorageService, serverAPI, $ionicPopup) {

        $scope.buttonType = "icon ion-search";
        $scope.buttonDisable = false;
        $scope.text = 'Search';
        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        serverAPI.getUserData(UID, function (data) {
            $scope.userName = data.userName;
            $scope.points = data.points;
            $scope.fotoID = data.fotoID;
            console.log(data);
        });

        serverAPI.getRecentEvents(UID, function (data) {
            $scope.username = data.username;
            $scope.username = data.points;
            console.log(data);

        });

        serverAPI.requestFeedback(UID, data, requestFeedback);
        $scope.click = click();



        //Request new feedback sheet from server to rate last plays (contat with new persons)
        function requestFeedback(data) {
            // Check if there are any new feedback sheets availalbe
            if (data == 1) {
                $ionicPopup.alert({
                    title: 'Feedback',
                    template: 'There is a player that you have not rated yet. Please rate the player before you can keep playing.'
                });
                $scope.go('tab.feedback');
            }
        };


        function click() {
            $scope.buttonDisable = true;
            $scope.text = 'Searching';
            $scope.buttonType = "icon ion-loading-a";

            //Grap geoLocation        
            var location = navigator.geolocation.getCurrentPosition(saveGeoData);

            function saveGeoData(geoData) {
                var myPosition = {
                    'longitude': geoData.coords.longitude,
                    'latitude': geoData.coords.latitude
                };
                window.localStorage.setItem('myPosition', JSON.stringify(myPosition));
                //If geoloaction is saved successfully => Send geodata to server to receive teammate
                sendToServer(myPosition);
            }


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

                        window.localStorage.setItem('teammate', teammate);
                        window.localStorage.setItem('isEnummeration', isEnummeration);
                        window.localStorage.setItem('task', task);
                        windwo.localeCompare.setItem('teammatePosition', teammatePosition);

                        $state.go('tab.play-screen');
                    }


                })
            }

        };

    })