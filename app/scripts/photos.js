// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])



.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI',
  function($scope, cssInjector, serverAPI) {

      $scope.images = new Array();
      
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');

    cssInjector.removeAll();

      $scope.selection;
      
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    serverAPI.getUserData(UID, function(data) {
        $scope.userName = data.userName;
        $scope.coins = data.coins;
        $scope.photoIds = data.photoIds;
        window.localStorage.setItem('photoIds', $scope.photoIds);

        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
        }
        
        
        for (var i = 0; i < $scope.photoIds.length; i++) {
            
        serverAPI.getPhoto($scope.userID, $scope.photoIds[i], function(data) {
        var entry  = {
            "id" : $scope.photoIds[i],
            "image" : data
        };
            
          $scope.images.push(entry);
          if (i == $scope.photoIds.length) {
            window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
          }
            
        $scope.selection = $scope.images[0].image;
        });
        }
        
      })

      $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

      cssInjector.add('styles/photos.css');

      $scope.loaded = false;




      
      


      /*  $scope.images = [
    'img/picture_1.jpg',
    'img/picture_2.jpg',
    'img/Megan_2.jpg',
      'img/Megan_1.jpg'
  ];*/


      $scope.setHero = function(img) {
        $scope.selection = img.image;
      }

      $scope.loaded = true;




    }

]);
