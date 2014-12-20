'use strict';

angular.module('pictureTaker', [])


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
        }, {quality: 50,
           destinationType: Camera.DestinationType.FILE_URI,
           sourceType: Camera.PictureSourceType.CAMERA});
          
        return q.promise;
      
    }
  }
  }])


.factory('PhoneLibrary', ['$q', 
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
           destinationType: Camera.DestinationType.FILE_URI,
           sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
          
        return q.promise;
      
    }
  }
  }])

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
           destinationType: Camera.DestinationType.FILE_URI,
           sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM});
          
        return q.promise;
      
    }
  }
  }])


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneLibrary', 'PhoneAlbum', 'cssInjector',

  function($scope, PhoneCamera, PhoneLibrary, PhoneAlbum, cssInjector) {

    //add Styles
    cssInjector.add('styles/pictureTaker.css');

      $scope.getCameraPhoto = function() {
    PhoneCamera.getPicture().then(function(imageURI) {
        $scope.cameraPic = imageURI;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };
      
       $scope.getLibraryPhoto = function() {
    PhoneLibrary.getPicture().then(function(imageURI) {
        $scope.cameraPic = imageURI;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };
      
       $scope.getAlbumPhoto = function() {
    PhoneAlbum.getPicture().then(function(imageURI) {
        $scope.cameraPic = imageURI;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
    });
  };
      
   

  }
])

.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

;
