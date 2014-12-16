angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $location, $state, localStorageService, serverAPI) {
        $scope.username = "maax",
        $scope.buttonType = "icon ion-search",
        $scope.buttonDisable = false,
        $scope.news = localStorageService.getHistory();

        $scope.click = function () {
            $scope.buttonDisable = true;
            $scope.buttonType = "icon ion-loading-a";

            //Grap geoLocation        
            var location = navigator.geolocation.getCurrentPosition(sendToServer);

            function sendToServer(pos) {

                serverAPI.searchPartnerToPlayWith(pos.coords.longitude, pos.coords.latitude, window.localStorage.getItem("Credentials"), function (data) {
                    console.log(data);
                    $state.go('tab.play-screen', {});
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