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
      $scope.selectionPhotoId;
      
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    serverAPI.getUserData(UID, function(data) {
        $scope.userName = data.userName;
        $scope.coins = data.coins;
        $scope.photoIds = window.localStorage.getItem('photoIds');
        
        
        if (($scope.photoIds != data.photoIds) || (window.localStorage.getItem('userPhotos') === null)){
        $scope.photoIds = data.photoIds;
        window.localStorage.setItem('photoIds', $scope.photoIds);

        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
        }
        
        
        for (var i = 0; i < $scope.photoIds.length; i++) {
            
        serverAPI.getPhoto($scope.userID, $scope.photoIds[i], function(data) {
        var entry  = {
            "photoId" : $scope.photoIds[i],
            "image" : data
        };
             
          $scope.images.push(entry);
          if (i == $scope.photoIds.length) {
            window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
          }
            
        $scope.selection = $scope.images[0].image;
        });
        }
        }else {
                      $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
         $scope.images = JSON.parse(window.localStorage.getItem('userPhotos'));
        $scope.selection = $scope.images[0].image;
            $scope.selectionPhotoId = $scope.images[0].photoId;
        }
      })

      $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

      cssInjector.add('styles/photos.css');

      $scope.loaded = false;




      
    


      $scope.setHero = function(img) {
        $scope.selection = img.image;
        $scope.selectionPhotoId = img.photoId;
      }

      $scope.loaded = true;

      $scope.deletePhoto = function(){
           serverAPI.deletePhoto($scope.userID, $scope.shownImage, function(data){console.log(data)});
      }


    }

]);
