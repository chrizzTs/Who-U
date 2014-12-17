angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $location, $state, localStorageService, serverAPI, $ionicPopup) {
        $scope.username = "maax",
        $scope.buttonType = "icon ion-search",
        $scope.buttonDisable = false,
        $scope.news = localStorageService.getHistory();
        var UID = JSON.parse(window.localStorage['Credentials']).UID;
        serverAPI.getUserData(UID, function (data) {
            console.log(data)
        })

        //Request new feedback sheet from server to rate last plays (contat with new persons)
        //        serverAPI.requestFeedback(function (UID, data) {
        //        // Check if there are any new feedback sheets availalbe
        //        date = 1;
        //        if (data == 1) {
        //            $ionicPopup.alert({
        //                title: 'Feedback',
        //                template: 'There is a player that you have not rated yet. Please rate the player before you can keep playing.'
        //            });
        //            $scope.go('tab.feedback');
        //        }
        //    })

        $scope.click = function () {
            $scope.buttonDisable = true;
            $scope.buttonType = "icon ion-loading-a";

            //Grap geoLocation        
            var location = navigator.geolocation.getCurrentPosition(sendToServer);

            function sendToServer(pos) {

                serverAPI.searchPartnerToPlayWith(pos.coords.longitude, pos.coords.latitude, UID, function (data) {

                    //No other players around you. Server returns -1 
                    if (data == -1) {
                        $ionicPopup.alert({
                            title: 'Too bad :(',
                            template: 'Unfortunateley there are no other players around you. Try it some other time!'
                        });
                    } else {
                        $state.go('tab.play-screen');
                    }


                })
            }



            //Ask server for availalble player an get data

            //End server request




            //Test für NewsGrid
            var event = {
                "typ": "played",
                "date": new Date(),
                "person": "Lars Thomas"
            }

            localStorageService.addEvent(event);

        };

    })