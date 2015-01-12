'use strict';

angular.module('pictureTaker', ['ngImgCrop'])

//this factory loads the picture ansynchronously from the Camera
//it sets the properties of the camera
.factory('PhoneCamera', ['$q', 
  function($q) {
    
      
    return {
      getPicture: function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, { quality: 50,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.CAMERA,
           correctOrientation: true});
          
        return q.promise;
      
    }
  }
  }])

//same as phoneCamera, but with phoneAlbum
.factory('PhoneAlbum', ['$q',
  function($q) {
    
      
    return {
      getPicture: function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, {quality: 50,
            encodingType: Camera.EncodingType.JPEG,
           destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM});
          
        return q.promise;
      
    }
  }
  }])


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneAlbum', 'cssInjector', '$ionicModal', 'serverAPI', '$state',

  function($scope, PhoneCamera,PhoneAlbum, cssInjector, $ionicModal, serverAPI, $state) {
      
 
      //fetch Data from local Storage
      $scope.userHasPictures = window.localStorage.getItem('userHasPictures');
      $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
      
    //add Styles
      cssInjector.removeAll();
    cssInjector.add('styles/pictureTaker.css');

     //image cropping
      $scope.userImage = '';
      $scope.croppedUserImage =  'data:image/jpeg;base64,';
      $scope.isCurrentlyCropping=false;
      $scope.pictureCropped = false;
      $scope.cropSpace = '';
     // $scope.shownImage = '';
      $scope.newImage = 'data:image/jpeg;base64,';
      

    //initialize Source-Variable of Image
      $scope.hasPicture = false;
      $scope.pictureCropped = false;
    

      $scope.getCameraPhoto = function() {
    PhoneCamera.getPicture().then(function(imageURI) {
        $scope.userImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.shownImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.hasPicture = true;
        $scope.pictureCropped = false;
        $scope.startCropping();
        
      console.log(imageURI);
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    });
  };
      
    
 
      
       $scope.getAlbumPhoto = function() {
   PhoneAlbum.getPicture().then(function(imageURI) {
         $scope.userImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.shownImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.hasPicture = true;
        $scope.startCropping();
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    });
  };
      
      
   $scope.startCropping = function(){
        $scope.isCurrentlyCropping = true;
       $scope.openModal();
   };

   $scope.endCropping = function(){
       $scope.shownImage = $scope.newImage;
       $scope.userImage = $scope.newImage;
       $scope.isCurrentlyCropping=false;
       $scope.pictureCropped = true;
       $scope.closeModal();
   };
     
    $ionicModal.fromTemplateUrl('imageCrop', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  
      
    $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
      
    $scope.saveImage = function() {
        var pictureAlreadySaved = false;
        if ($scope.userHasPictures == 1){
        $scope.images = JSON.parse(window.localStorage.getItem('userPhotos'));
        for (var i=0; i < $scope.images.length; i++){
            if ($scope.images[i].image == $scope.shownImage){
                pictureAlreadySaved = true;
            }
        }
        }
    
        if ($scope.pictureAlreadySaved){
            $scope.showAlert = function(){
                var alertPopup = $ionicPopup.alert({
                    title : 'Picture already saved',
                    template : 'You already saved this picture for your profile!'});
                
            }
        } else {
                serverAPI.saveNewPhoto($scope.userID, $scope.shownImage, function(data){
                    $state.go('tab.photos');
                });
    }};
      
    $scope.discardImage = function() {
        $scope.hasPicture = false;
        $scope.shownImage = '';
    };        

      $scope.changeImage = function(dataUrl) {
          if ((dataUrl != 'data:image/jpeg;base64,') && (dataUrl != $scope.userImage))
          {$scope.newImage = dataUrl; }
      };

      //downscale Image
      
      
      
      
      
  }])

    

                             .config(function($compileProvider){
 $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);

  
    
});


