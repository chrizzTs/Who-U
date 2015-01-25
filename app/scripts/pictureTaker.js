'use strict';

angular.module('pictureTaker', ['ngImgCrop'])

/*
The follwing factories load pictures ansynchronously from the Camera or PhoneAlbum.
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


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneAlbum', 'cssInjector', '$ionicModal', 'serverAPI', '$state', 'services',

  function($scope, PhoneCamera, PhoneAlbum, cssInjector, $ionicModal, serverAPI, $state, services) {


    //fetch Data from local Storage
    $scope.userHasPictures = window.localStorage.getItem('userHasPictures');
    $scope.userID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.isFacebookUser = window.localStorage.getItem('facebook');

    //add Styles
    cssInjector.removeAll();
    cssInjector.add('styles/pictureTaker.css');

    //image cropping, initialize Variables
    //userImage is the variable used in the image Cropper, on wich cropping square is displayed
    $scope.userImage = '';
    //croppedUserImage is the return of the imageCropper, the part of the picture in the square
    $scope.croppedUserImage = 'data:image/jpeg;base64,';
    //check if user is cropping
    $scope.isCurrentlyCropping = false;
    //used to check if picture is cropped and user can save it therefor
    $scope.pictureCropped = false;
    $scope.cropSpace = '';

    // $scope.shownImage = '';
    $scope.newImage = 'data:image/jpeg;base64,';


    //initialize Source-Variable of Image
    $scope.hasPicture = false;
    $scope.pictureCropped = false;

    //get a Photo of user's camera
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
        $scope.errorMessage = err;
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
        $scope.errorMessage = err;
      });
    };


    $scope.startCropping = function() {
      $scope.isCurrentlyCropping = true;
      $scope.openModal();
    };

    $scope.endCropping = function() {
      $scope.shownImage = $scope.newImage;
      $scope.userImage = $scope.newImage;
      $scope.isCurrentlyCropping = false;
      $scope.pictureCropped = true;
      $scope.closeModal();
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

    $scope.saveImage = function() {
      serverAPI.saveNewPhoto($scope.userID, $scope.shownImage, function(data) {
        if (data === 1) {
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

    $scope.changeImage = function(dataUrl) {
      if ((dataUrl !== 'data:image/jpeg;base64,') && (dataUrl !== $scope.userImage)) {
        $scope.newImage = dataUrl;
      }
    };

    $scope.addFBProfilePicture = function() {
      services.addFBProfilePicture();
    };
  }
])



.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);



});
