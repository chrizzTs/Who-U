// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])

.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI',
    function ($scope, cssInjector, serverAPI) {

        cssInjector.removeAll();

        $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

        cssInjector.add('styles/photos.css');

        $scope.loaded = false;

        $scope.photoIds =
            JSON.parse(window.localStorage.getItem('photoIds'));

        console.log($scope.photoIds);


        $scope.images = new Array();

        for (var i = 0; i < $scope.photoIds.length; i++) {
            serverAPI.getPhoto($scope.userID, $scope.photoIds[i], function (data) {
                console.log(data);
                console.log(data.length)
                $scope.images.push(data);
            });
        }

        /*  $scope.images = [
    'img/picture_1.jpg',
    'img/picture_2.jpg',
    'img/Megan_2.jpg',
      'img/Megan_1.jpg'
  ];*/



        $scope.selection = $scope.images[0];

        $scope.setHero = function (img) {
            $scope.selection = img;
        }

        $scope.loaded = true;


                         }]);