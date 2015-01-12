// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])



.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI',
  function($scope, cssInjector, serverAPI) {
      
      //remove all injected CSS Designs
      cssInjector.removeAll();
    
      //default: user has no Pictures. Variable gets used to decide whether to display a gallery
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');
     
      //initialize the selection photo and the selected photoId
      $scope.selection;
      $scope.selectionPhotoId;
      
      //initialize the array in which images of the user will be stored
      $scope.images = new Array();
      
      //get user ID from Server
        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

      //get User Data from Server. Everything depends on this data so every single method has to be written into the callback
        serverAPI.getUserData(UID, function(data) {
        $scope.photoIds = window.localStorage.getItem('photoIds');
        
        //check if the wished photos are already in localStorage. 
        if (($scope.photoIds != data.photoIds) || (window.localStorage.getItem('userPhotos') === null)){
        //if server photoIds are newer than the localStorage photoIds, the photoIds are set to the ones from the server
        $scope.photoIds = data.photoIds;
        window.localStorage.setItem('photoIds', $scope.photoIds);

        //check if user has any Photos at all
        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
        }
        
        //loop for getting the image data of every photo
        for (var i = 0; i < $scope.photoIds.length; i++) {
            
        //get the image data of every photo, everything has to be in the callback because it is dependend on the photo
        serverAPI.getPhoto(UID, $scope.photoIds[i], function(data) {
            
        $scope.imageJson = data;
            
            
        //array of JSONs with the photoId and data is pushed into localStorage
        var entry  = {
            "photoId" : $scope.imageJson.id,
            "image" : $scope.imageJson.data
        };
             
          $scope.images.push(entry);
          if (i == $scope.photoIds.length) {
            window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
          }
        
        //Selection of the gallery is set to the firwst image by default
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

        //add CSS styles
      cssInjector.add('styles/photos.css');

      //if an image is clicked it gets displayed in big mode
      $scope.setHero = function(img) {
        $scope.selection = img.image;
        $scope.selectionPhotoId = img.photoId;
      }

      $scope.userId = UID;

      $scope.loaded = false;
      
      $scope.deletePhoto = function(){
           serverAPI.deletePhoto($scope.userID, $scope.shownImage, function(data){console.log(data)});
      }

      $scope.loaded = true;

    }
                           

]);
