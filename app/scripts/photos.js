// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])



.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI', '$state', '$window',
  function($scope, cssInjector, serverAPI, $state, $window) {

    //remove all injected CSS Designs
    cssInjector.removeAll();
      
      $scope.profilePhotoIsShown = false;

    //default: user has no Pictures. Variable gets used to decide whether to display a gallery
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');

    //initialize the selection photo and the selected photoId
    $scope.selection;
    $scope.selectionPhotoId = 0;
    $scope.profilePhotoId;
    //initialize the array in which images of the user will be stored
    $scope.images = new Array();

    //get user ID from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

      
    $scope.photoIds = window.localStorage.getItem('photoIds');  
    //get User Data from Server. Everything depends on this data so every single method has to be written into the callback
    serverAPI.getUserData(UID, function(data) {
        $scope.profilePhotoId = data.profilePhotoId;
      $scope.photoIds = window.localStorage.getItem('photoIds');
     
      //check if the wished photos are already in localStorage.
    //  if (window.localStorage.getItem('userPhotos') === null) {
        //if server photoIds are newer than the localStorage photoIds, the photoIds are set to the ones from the server
        $scope.photoIds = data.photoIds;
        window.localStorage.setItem('photoIds', $scope.photoIds);

     

        $scope.localStorageImages = JSON.parse(window.localStorage.getItem('userPhotos'));
          
        //loop for getting the image data of every photo
        for (var i = 0; i < data.photoIds.length; i++) {

        var itemInLocalStorage = false;
          //get the image data of every photo, everything has to be in the callback because it is dependend on the photo
            if ($scope.localStorageImages != null){
        for (var j = 0; j < $scope.localStorageImages.length; j++){
          if ($scope.localStorageImages[j].photoId == data.photoIds[i]){
              
              itemInLocalStorage = true;
              $scope.images.push($scope.localStorageImages[j]);
              console.log('Already in localStorage: ' + $scope.localStorageImages[j].photoId);
               if (i== 0){
                   $scope.selection = $scope.images[0].image;
                   $scope.selectionPhotoId = $scope.images[0].selectionPhotoId;
              }
          }
        }
            }
         if (itemInLocalStorage == false){
          serverAPI.getPhoto(UID, $scope.photoIds[i], function(data) {

            $scope.imageJson = data;


            //array of JSONs with the photoId and data is pushed into localStorage
            var entry = {
              "photoId": $scope.imageJson.id,
              "image": $scope.imageJson.data
            };

            $scope.images.push(entry);
            if (i == $scope.photoIds.length) {
              window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
            }
            console.log('Loaded from Server:' + entry.photoId);

              if (i== 0){
                   $scope.selection = $scope.images[0].image;
                  $scope.selectionPhotoId = $scope.images[0].selectionPhotoId;
              }
          });
         }
        }
      /*} else {

        $scope.userHasPictures = 1;
        window.localStorage.setItem('userHasPictures', '1');
        $scope.images = JSON.parse(window.localStorage.getItem('userPhotos'));
        $scope.selection = $scope.images[0].image;
        $scope.selectionPhotoId = $scope.images[0].photoId;
      }*/
       //check if user has any Photos at all
        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
          //Selection of the gallery is set to the firwst image by default
        }
    })

    //add CSS styles
    cssInjector.add('styles/photos.css');

    //if an image is clicked it gets displayed in big mode
    $scope.setHero = function(img) {
      $scope.selection = img.image;
      $scope.selectionPhotoId = img.photoId;
      checkIfProfilePhotoIsShown();
    }

    $scope.userId = UID;

    $scope.loaded = false;

    $scope.deletePhoto = function() {
      console.log('userId: ' + $scope.userId);
      console.log('selectionPhotoId: ' + $scope.selectionPhotoId);
      serverAPI.deletePhoto($scope.userId, $scope.selectionPhotoId, function(data) {
        console.log(data);
           window.localStorage.setItem('userPhotos', null);
       window.location.reload(true)
      });
    }

    $scope.loaded = true;

    $scope.setImageAsProfilePicture = function() {
      console.log($scope.selectionPhotoId);
      serverAPI.updateProfilPhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          if (data ==1){
               window.location.reload(true);
          }
      })
    }
    
 function checkIfProfilePhotoIsShown(){
     if ($scope.selectionPhotoId == $scope.profilePhotoId)
     {$scope.profilePhotoIsShown = true} else
     {$scope.profilePhotoIsShown = false};
 }



  }]);
