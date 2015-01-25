'use strict';

angular.module('pictureTaker', ['ngImgCrop'])

//=======Start: Config=========================


.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);
})
//======End: Config============================

/*
The following factories load pictures ansynchronously from the Camera or PhoneAlbum.
These interfaces to the functions of the device are implemented with the Cordova plugin: org.apache.cordova.camera
They set the properties of the Camera or PhoneAlbum. They are saved in last block of the get Picture function

Options for the returned pictures:
-   quality is set to 50 to downscale the picture in order to be small enough for posting it to the server
-   encodingtype is set to JPEG because JPEGs are very small and can be downcaled easily
-   destinationtype is set to DATA_URL. Due to that photos are saved in a Base64 encoded URI, which can be sent as
    a string to the server and received as a string
-   sourceType is either set to CAMERA or SAVEDPHOTOALBUM depending on the factory
-   correctOrientation is set to true, so that horizontal images are displayed horizontally and vertical images are 
    displayed vertically
*/
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
        }, {
          quality: 50,
          encodingType: Camera.EncodingType.JPEG,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          correctOrientation: true
        });

        return q.promise;

      }
    };
  }
])

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
        }, {
          quality: 50,
          encodingType: Camera.EncodingType.JPEG,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
          correctOrientation: true
        });

        return q.promise;

      }
    };
  }
])


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneAlbum', 'cssInjector', '$ionicModal', 'serverAPI', 'services',

  function($scope, PhoneCamera, PhoneAlbum, cssInjector, $ionicModal, serverAPI, services) {

      
    //add Styles
    cssInjector.removeAll();
    cssInjector.add('styles/pictureTaker.css');  
      
    //=====Start: Initialization of Variables=================
      
    //fetch Data from local Storage
    $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.isFacebookUser = window.localStorage.getItem('facebook');

    //image cropping, initialize Variables
    //userImage is the variable used in the image Cropper, on wich cropping square is displayed
      
        //$scope.hasPicture. If this variable is true, the uploaded picture will be shown. Additionally all options to crop, delete or save the uploaded image will be display. In HTML this is implemented with ng-if
    $scope.hasPicture = false;
    //$scope.pictureCropped. This variable has to be true to be able to save Images, because only cropped Images
    //can be uploaded.
    $scope.pictureCropped = false;
      
      
    $scope.userImage = '';
    //croppedUserImage is the return of the imageCropper, the part of the picture in the square
    $scope.croppedUserImage = 'data:image/jpeg;base64,';
    $scope.cropSpace = '';
    $scope.newImage = 'data:image/jpeg;base64,';

      
    //===========End: Initialization of Variables========
      
    //===========Start: Upload Images====================

      
    //get a Photo of user's camera. Uses PhoneCamera factory
    $scope.getCameraPhoto = function() {
      PhoneCamera.getPicture().then(function(imageURI) {
        $scope.successfulGetPhoto(imageURI);
      }, function(err) {
        console.err(err);
      });
    };

    //get a photo of user`s saved images. Uses PhoneAlbum factory
    $scope.getAlbumPhoto = function() {
      PhoneAlbum.getPicture().then(function(imageURI) {
        $scope.successfulGetPhoto(imageURI);
      }, function(err) {
        console.err(err);
      });
    };

    //Is called if an image is oploaded correctly
    $scope.successfulGetPhoto = function(imageURI){
        $scope.userImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.shownImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.hasPicture = true;
        $scope.pictureCropped = false;
        $scope.startCropping();
    }
    
    //===========End: Upload Images====================
      
    //===========Start: Image Cropping=================
    
    $scope.startCropping = function() {
      $scope.openModal();
    };

    $ionicModal.fromTemplateUrl('imageCrop', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
      
      
    //In $scope.endCropping the image is saved into $scope.shownImage, which is the image shown in the PictureTaker Page and which can be saved afterwards. The modal window is closed.
    $scope.endCropping = function() {
      $scope.shownImage = $scope.newImage;
      $scope.userImage = $scope.newImage;
      $scope.pictureCropped = true;
      $scope.closeModal();
    };

    
      
    //$scope.changeImage checks whether there are any changes to the image and whether there is any image at all. If so, it is saved to $scope.newImage, which will later be the saved Image.
    $scope.changeImage = function(dataUrl) {
      if ((dataUrl !== 'data:image/jpeg;base64,') && (dataUrl !== $scope.userImage)) {
        $scope.newImage = dataUrl;
      }
    };

    //=======End: Image Cropping====================
    //=======Start: Image Option Buttons============
      
    /*The three functions of $scope: saveImage(), discardImage() and addFBProfilePicture() allow the user to save an image, discard an image order add the user's Facebook Profile Picture to his account (only when logged in with Facebook).
    -   saveImage uses the Server API "saveNewPhoto". For more Information look at the function in the Server documentation
    -   discardImage just removes the image from §scope.shownImage and sets $scope.hasPicture to 'false'
    -   addFBProfilePicture uses a function declared in 'Services.js'. Read the documentation of the this file for more information

    */  
      
    $scope.saveImage = function() {
      serverAPI.saveNewPhoto($scope.userID, $scope.shownImage, function(data) {
        if (data === '1') {
          window.history.back();
        } else {
          alert('Photo could not be saved');
        }
      });
    };

    $scope.discardImage = function() {
      $scope.hasPicture = false;
      $scope.shownImage = '';
    };


    $scope.addFBProfilePicture = function() {
      services.addFBProfilePicture();
      window.history.back();
    };
  }
]);

    //=======End: Image Option Buttons=============