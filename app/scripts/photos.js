// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])

.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI',
  function($scope, cssInjector, serverAPI) {

    $scope.hasPictures = false;
      
    cssInjector.removeAll();

              var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        serverAPI.getUserData(UID, function (data) {
            $scope.userName = data.userName;
            $scope.coins = data.coins;
            window.localStorage.setItem('photoIds', JSON.stringify(data.photoIds));
        });
      
    $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

    cssInjector.add('styles/photos.css');

    $scope.loaded = false;

    $scope.photoIds =
      JSON.parse(window.localStorage.getItem('photoIds'));

      if ($scope.photoIds.isDefined == true){
          $scope.hasPictures = true;
      }

    $scope.images = new Array();

    for (var i = 0; i < $scope.photoIds.length; i++) {
      serverAPI.getPhoto($scope.userID, $scope.photoIds[i], function(data) {
        console.log(data);
        console.log(data.length)
        $scope.images.push(data);
      });
    }

    JSON.stringify(window.localStorage.setItem('userPhotos', $scope.images));


    /*  $scope.images = [
    'img/picture_1.jpg',
    'img/picture_2.jpg',
    'img/Megan_2.jpg',
      'img/Megan_1.jpg'
  ];*/



    $scope.selection = $scope.images[0];

    $scope.setHero = function(img) {
      $scope.selection = img;
    }

    $scope.loaded = true;
    
    


  }
]);
