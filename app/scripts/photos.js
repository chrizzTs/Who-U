// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])



.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI', '$state', '$window',
  function($scope, cssInjector, serverAPI, $state, $window) {

    //remove all injected CSS Designs
    cssInjector.removeAll();
    cssInjector.add('styles/photos.css');
    
    $scope.profilePhotoIsShown = true;

    //default: user has no Pictures. Variable gets used to decide whether to display a gallery
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');

    //initialize the selection photo and the selected photoId
    $scope.selection;
    $scope.doneLoading = false;
    $scope.selectionPhotoId = 0;
    $scope.profilePhotoId = 0;
    //initialize the array in which images of the user will be stored
    $scope.images = new Array();
    $scope.photoIds;

    //get user ID from localStorage
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;  
      
      loadImages();
    
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
       loadImages();
          
      });
    }

    $scope.loaded = true;

    $scope.setImageAsProfilePicture = function() {
      console.log($scope.selectionPhotoId);
      serverAPI.updateProfilPhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          if (data ==1){
               loadImages();
          }
      })
    }
    
 function checkIfProfilePhotoIsShown(){
     if ($scope.selectionPhotoId == $scope.profilePhotoId)
     {$scope.profilePhotoIsShown = true} else
     {$scope.profilePhotoIsShown = false};
 }
      
      function loadImages(){
        $scope.images = new Array();
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
               if (i == ($scope.photoIds.length-1)) {
              window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
                $scope.doneLoading = true;
            }
              console.log('Already in localStorage: ' + $scope.localStorageImages[j].photoId);
               if (i== 0){
                   $scope.selection = $scope.images[0].image;
                   $scope.selectionPhotoId = $scope.images[0].photoId;
                   checkIfProfilePhotoIsShown();
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
              $scope.setHero($scope.images[0]);
            if (i == ($scope.photoIds.length-1)) {
              window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
                $scope.doneLoading = true;
            }
            console.log('Loaded from Server:' + entry.photoId);

              if (i== 0){
                   $scope.selection = $scope.images[0].image;
                  $scope.selectionPhotoId = $scope.images[0].selectionPhotoId;
                  checkIfProfilePhotoIsShown();
              }
          });
         }
        }

       //check if user has any Photos at all
        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
          //Selection of the gallery is set to the firwst image by default
        } else {
            $scope.doneLoading = true;
        }
    })
    }




  }]);
