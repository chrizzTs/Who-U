// Codepens used:
//http://codepen.io/calendee/pen/HIuft
//http://codepen.io/mmmeff/pen/LERZVe

'use strict';

angular.module('photos', [])



.controller('photosCtrl', ['$scope', 'cssInjector', 'serverAPI', '$state', '$window',
  function($scope, cssInjector, serverAPI, $state, $window) {

    //remove all injected CSS Designs and add new ones
    cssInjector.removeAll();
    cssInjector.add('styles/photos.css');
    
    //doneLoading: only true if first photo has been received. If doneLoading == false, 
    //a loading screen is shown to the user
    $scope.doneLoading = false;  

    //default: user has no Pictures. Variable gets used to decide whether to display a gallery
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');

    //profilePhotoShown: Variable that indicates wether the profile Picture of user is shown in large mode
    //if it is shown the star icon on the picture is filled blue, otherwise it is outlined
    $scope.profilePhotoIsShown = true;

    //initialize the selection photo and the selected photoId
    //selection: Data of the image that is shown large 
    //selectionPhotoId: Id of the image that is shown large
    $scope.selection = '';
    $scope.selectionPhotoId = 0;
      
    
    $scope.profilePhotoId = 0;
    //initialize the array in which images of the user will be stored
    $scope.images = new Array();
    $scope.photoIds;

    //get user ID from localStorage
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;  
      
      
      //for Image Loading
      $scope.itemInLocalStorage = false;
      $scope.position = 0;
      $scope.images;
      
      
      
      loadImages();
    
    //if an image is clicked it gets displayed in large mode
    $scope.setHero = function(img) {
      $scope.selection = img.data;
      $scope.selectionPhotoId = img.id;
      checkIfProfilePhotoIsShown();
    }

 var numSort = function(a,b) 
 { return a.id - b.id };
    
      
//deletes a photo of the user
    $scope.deletePhoto = function() {
      serverAPI.deletePhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          var deleteIndex;
        
          //find out which image to delete
          for (var i = 0; i < $scope.images.length; i++){
              if ($scope.images[i].id === $scope.selectionPhotoId){
                  deleteIndex = i;
              }
          }
          $scope.images.splice(deleteIndex,1);
          window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
          if ($scope.images[0] !== null){
          $scope.setHero($scope.images[0]);
          } else {
             $scope.userHasPictures = 0;
          window.localStorage.setItem('userHasPictures', '0');
          }
          
      });
    }


    $scope.setImageAsProfilePicture = function() {
      serverAPI.updateProfilPhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          if (data ==1){
               serverAPI.getUserData(UID, function(data) {
            $scope.profilePhotoId = data.profilePhotoId;
                   checkIfProfilePhotoIsShown();
               });                   
          }
      })
    }
    
    function checkIfProfilePhotoIsShown(){
     if ($scope.selectionPhotoId == $scope.profilePhotoId)
     {$scope.profilePhotoIsShown = true} else
     {$scope.profilePhotoIsShown = false};
 }
      
function checkIfPhotoIsInLocalStorage(){
        for (var j = 0; j < $scope.localStorageImages.length; j++){
          if ($scope.localStorageImages[j].id == $scope.photoIds[$scope.position]){
              
              $scope.itemInLocalStorage = true;
              console.log('Already in localStorage: ' + $scope.localStorageImages[j].id);
              saveEntryInImages($scope.localStorageImages[j]);
          }
        }
}
      
      function getImageFromServer(){
                  serverAPI.getPhoto(UID, $scope.photoIds[$scope.position], function(data) {
            console.log('Loaded from Server:' + data.id);
            saveEntryInImages(data);
          });
      }
      
      
      //save a loaded image in the images arry and localStorage
      function saveEntryInImages(imageJson){
            var entry = {
              'id': imageJson.id,
              'data': imageJson.data
            };

            $scope.images.push(entry);
              window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
             $scope.doneLoading = true;  

          if ($scope.selection === ''){
              $scope.setHero(entry);
          }
          
          if ($scope.images.length === $scope.photoIds.length){
              $scope.images.sort(numSort);
          }
      }
      
      function loadImages(){
        $scope.images = new Array();
    //get User Data from Server. Everything depends on this data so every single method has to be written into the callback
    serverAPI.getUserData(UID, function(data) {
        $scope.profilePhotoId = data.profilePhotoId;
        $scope.photoIds = window.localStorage.getItem('photoIds');
        $scope.photoIds = data.photoIds;
        window.localStorage.setItem('photoIds', $scope.photoIds);

        //When all images have been loaded, they are stored in the localStorage as well, to reduce time and network usage when entering this screen again. To check whether the images are in localStorage already they are loaded from loalStorage first.
        
        $scope.localStorageImages = JSON.parse(window.localStorage.getItem('userPhotos'));
        
        //loop for getting the image data of every photo
        for ($scope.position = 0; $scope.position < $scope.photoIds.length; $scope.position++) {

            $scope.itemInLocalStorage = false;
            
            //check if image is in localStrage
            if ($scope.localStorageImages != null){
                checkIfPhotoIsInLocalStorage();
            }
         if ($scope.itemInLocalStorage == false){
             //image is not in localStorage, get it from the server
            getImageFromServer();
         }
        }

       //check if user has any Photos at all
        if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
        } else {
            // if the user has no pictures the loading process is already finished
            $scope.doneLoading = true;
        }
    })
    }




  }]);
