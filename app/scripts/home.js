angular.module('home', ['services'])

.controller('homeCtrl', ['$scope', '$location', 'localStorageService',
    function ($scope, $location, localStorageService) {
        $scope.username = "maax",
        $scope.buttonType = "icon ion-search",
        $scope.buttonDisable = false,

        $scope.click = function () {
            $scope.buttonDisable = true
            $scope.buttonType = "icon ion-loading-a"

            //Grap geoLocation        
            var location = navigator.geolocation.getCurrentPosition(sendToServer);

            function sendToServer(pos) {
                //sendGeoData(pos.coords.latitude, pos.coords.longitude, window.localStorage.getItem("userId"))

            }

            //Ask server for availalble player an get data

            //End server request


            //Link to play-screen
            $location.path("/tab/play-screen");

            /* Test für NewsGrid
            var event = {
                "id": "neu",
                "value": "neu",
                "popup": "neu"
            }

            localStorageService.addEvent(event);
            var test = localStorageService.getHistory();
            $scope.news = localStorageService.getHistory();

    */

        };

}])