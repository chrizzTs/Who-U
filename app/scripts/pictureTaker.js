'use strict';

angular.module('pictureTaker', ['ngImgCrop', 'ngDialog'])


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
            destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.CAMERA});
          
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
        }, {quality: 100,
           destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM});
          
        return q.promise;
      
    }
  }
  }])


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneAlbum', 'cssInjector', 'ngDialog',

  function($scope, PhoneCamera,PhoneAlbum, cssInjector, ngDialog) {
      
 

    //add Styles
      cssInjector.removeAll();
    cssInjector.add('styles/pictureTaker.css');

     //image cropping
      $scope.userImage = '';
      $scope.croppedUserImage =  'data:image/jpeg;base64,';
      $scope.isCurrentlyCropping=false;
      $scope.cropSpace = '';
      $scope.shownImage = '';

    //initialize Source-Variable of Image
      $scope.hasPicture = false;
      $scope.pictureCropped = false;
    

      $scope.getCameraPhoto = function() {
    PhoneCamera.getPicture().then(function(imageURI) {
        $scope.userImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.shownImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.hasPicture = true;
        
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
    
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    });
  };
      
      
   $scope.startCropping = function(){
        $scope.isCurrentlyCropping = true;
       ngDialog.open({ template: 'imageCrop', scope: $scope});
   };

   $scope.endCropping = function(){
       $scope.isCurrentlyCropping=false;
       $scope.pictureCropped = true;
       console.log($scope.croppedUserImage);
   };
      
    


  }
])
    

                             .config(function($compileProvider, ngDialogProvider){
 $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);

    ngDialogProvider.setDefaults({
				className: 'ngdialog-theme-default',
				plain: false,
				showClose: true,
				closeByDocument: true,
				closeByEscape: true,
				appendTo: false,
				preCloseCallback: function () {
					console.log('default pre-close callback');
				}
			});
    
})

;
