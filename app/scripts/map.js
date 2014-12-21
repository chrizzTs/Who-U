'use strict';

angular.module('map', ['uiGmapgoogle-maps'])

//ensures, that angular-google-maps does not begin processing until all of the Google Maps SDK is fully ready
.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization',
    china: true
  });
})


.controller('mapCtrl', function($scope, uiGmapGoogleMapApi, uiGmapIsReady, cssInjector) {

  //Map Styles hinzufügen
  cssInjector.add('styles/map.css');

  //Directive needs to be ready to be used
  // Do stuff with your $scope.
  // Note: Some of the directives require at least something to be defined originally!
  // e.g. $scope.markers = []

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.

  uiGmapGoogleMapApi.then(function(maps) {

    //fetch data from local Storage from tab-home

    $scope.myPosition = JSON.parse(window.localStorage.getItem("myPosition"));

    $scope.teammatePosition = JSON.parse(window.localStorage.getItem("teammatePosition"));

    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };

    $scope.myPosition = {
      latitude: 41.89020210802678,
      longitude: 12.491927146911621
    };
    $map.zoomLevel = 10;
  });


  <!--
  function showPosition(position) {
    var otherPlayerCoordinates = {
      latitude: 41.89020210802678,
      longitude: 12.491927146911621
    };
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    var km = calculateDistance(position.coords, otherPlayerCoordinates);
    var div = document.getElementById("distance");
    div.innerHTML = "Ihre distance bis zum Museum betraegt " + km + "km";

    showMap(position.coords);
  }

  function showError(fehler) {
    var fehlerTypen = {
      0: "Unbekannter Fehler",
      1: "Keine Genehmigung von Benutzer",
      2: "Position nicht verfügbar",
      3: "Zeitüberschreitung der Anforderung"
    }

    var fehlerMeldung = fehlerTypen[fehler.code];
    if (fehler.code == 0 || fehler.code == 2) {
      fehlerMeldung = fehlerMeldung + " " + fehler.message;
    }

    var div = document.getElementById("position");
    div.innerHTML = fehlerMeldung;
  }

  function calculateDistance(startCoords, destinationCoords) {
    var startLatRads = getInRadian(startCoords.latitude);
    var startLongRads = getInRadian(startCoords.longitude);
    var destinationLatRads = getInRadian(destinationCoords.latitude);
    var destinationLongRads = getInRadian(destinationCoords.longitude);

    var radius = 6371;
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destinationLatRads) +
      Math.cos(startLatRads) * Math.cos(destinationLatRads) *
      Math.cos(startLongRads - destinationLongRads)) * radius;
    return distance;
  }

  function getInRadian(grad) {
    radiant = (grad * Math.PI) / 180;
    return radiant;
  }

  function showMap(coords) {

    var googleLatitudeLongitude = new google.maps.LatLng(coords.latitude, coords.longitude);

    var mapOption = {
      zoom: 4,
      center: googleLatitudeLongitude,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var kartenDiv = document.getElementById("karte");
    kartenDiv = new google.maps.Map(kartenDiv, mapOption);

    var titel = "Das sind Sie";
    var inhalt = "Sie befinden sich hier:<br>Breitengrad: " + coords.latitude + ",<br>Laengengrad: " + coords.longitude;
    addPin(kartenDiv, googleLatitudeLongitude, titel, inhalt);

    var titel = "Das ist das Museum";
    var inhalt = "Hier steht unser bombiges Museum";

    var otherPlayerCoordinates = {
      latitude: 41.89020210802678,
      longitude: 12.491927146911621
    };
    googleLatitudeLongitude = new google.maps.LatLng(otherPlayerCoordinates.latitude, otherPlayerCoordinates.longitude);
    addPin(kartenDiv, googleLatitudeLongitude, titel, inhalt);
  };

  function addPin(karte, latlong, titel, inhalt) {

    var nadelOptionen = {
      position: latlong,
      map: karte,
      title: titel,
      clickable: true
    };

    var nadel = new google.maps.Marker(nadelOptionen);

    var infoFensterOptionen = {
      content: inhalt,
      position: latlong
    };

    var infoFenster = new google.maps.InfoWindow(infoFensterOptionen);

    google.maps.event.addListener(nadel, "click", function() {
      infoFenster.open(karte);
    });
  };
  -->


});
