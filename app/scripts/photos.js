// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])

.controller('photosCtrl', ['$scope', 'cssInjector', function ($scope, cssInjector) {

cssInjector.removeAll();
    
 $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    
 cssInjector.add('styles/photos.css');
    
  $scope.loaded = false;
  
  $scope.images = [
    'img/picture_1.jpg',
    'img/picture_2.jpg',
    'img/Megan_2.jpg',
      'img/Megan_1.jpg'
  ];
    
    
  
  $scope.selection = $scope.images[0];
  
  $scope.setHero = function (img) {
    $scope.selection = img;
  }
  
  $scope.loaded = true;

                         
                         }]);
