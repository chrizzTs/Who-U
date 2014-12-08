angular.module('home', [])

.controller('homeCtrl', function ($scope, $location) {
    $scope.username = "maax",
    $scope.buttonType = "icon ion-search",
    $scope.buttonDisable = false,

    $scope.click = function () {
        $scope.buttonDisable = true
        $scope.buttonType = "icon ion-loading-a"

        //Grap geoLocation        
        var location = navigator.geolocation.getCurrentPosition(disp);

        function disp(pos) {
            var latitude = pos.coords.latitude;
            var longitude = pos.coords.longitude;
        }

        //Ask server for availalble player an get data

        //End server request


        //Link to play-screen

        $location.path("/tab/play-screen");
    };

})