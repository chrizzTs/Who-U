'use strict';

angular.module('map', ['uiGmapgoogle-maps'])

//ensures, that angular-google-maps does not begin processing until all of the Google Maps SDK is fully ready
.config(function (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization',
        china: true
    });
})


.controller('mapCtrl', function ($scope, uiGmapGoogleMapApi, uiGmapIsReady, cssInjector) {

        $scope.marker1, $scope.marker2;

        //Map Styles hinzufügen
        cssInjector.removeAll();
        cssInjector.add('styles/map.css');

        $scope.myPosition = JSON.parse(window.localStorage.getItem("myPosition"));

        $scope.teammatePosition = JSON.parse(window.localStorage.getItem("teammatePosition"));

        //Directive needs to be ready to be used
        // Do stuff with your $scope.
        // Note: Some of the directives require at least something to be defined originally!
        // e.g. $scope.markers = []

        // uiGmapGoogleMapApi is a promise.
        // The "then" callback function provides the google.maps object.

        uiGmapGoogleMapApi.then(function (maps) {

            //fetch data from local Storage from tab-home




            $scope.map = {
                center: angular.copy($scope.myPosition),
                zoom: 17
            };



    });
});