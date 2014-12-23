'use strict';

angular.module('pictureTaker', ['ngImgCrop'])


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
        }, {quality: 20,
           destinationType: Camera.DestinationType.DATA_URL,
           sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            //jpeg
           encodingType : 0,
            //only Pictures
           mediaType : 0,
           });
          
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


.controller('CameraCtrl', ['$scope', 'PhoneCamera', 'PhoneLibrary', 'PhoneAlbum', 'cssInjector', '$sce',

  function($scope, PhoneCamera, PhoneLibrary, PhoneAlbum, cssInjector, $sce) {
      
    



    //add Styles
    cssInjector.add('styles/pictureTaker.css');
      
    //initialize Source-Variable of Image
      $scope.hasPicture = false;
    

      $scope.getCameraPhoto = function() {
    PhoneCamera.getPicture().then(function(imageURI) {
        $scope.cameraPic = "data:image/jpeg;base64," + imageURI;
        $scope.hasPicture = true;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    });
  };
      
       $scope.getLibraryPhoto = function() {
   //$scope.cameraPic = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCABNAE4DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCxe3MsUwVGwMZ6VX+3XH98flT9S/4+R/u1UrNvU66cYuK0LH264/vj8qT7dc/3x+VV6KLsrkj2LH264/vj8qPt9z/f/Sq1FFxcsexY+33P/PQf980n9oXP/PQflUKo7/dUt9BTWVlbawwfQ0yOWJP/AGhdf89B/wB81o6dPJPE7SMCQ2OmKxa1tI/1D/71NETSSIdT/wCPkf7tU6t6n/x8j/dqpUvc2p/CgopKKRYVfs7EMoklHB6L/jVezh86cA/dXk1ssyxoWPAAzVJGFWfRCgKi4AAFYd8QbuQj2/lRc3T3D5yQnZar02xQhbUK1dH/ANQ/+9WTWto/+of/AHqEKexDqf8Ax8j/AHap1c1T/j6H+7VKpe5pD4ULRSVLbQNcShR0/iPoKCm7GlpkWyAuRy/P4VbZQwIYZHoaBhFx0AFY019M0zGOQqueAKvY5knJ3LWpxolupVFU7uwrKqSS4llXbJIWHXBqKpNYqyCtbR/9Q/8AvVkVr6P/AKiT/epomexBqn/H0P8AdqlVzVf+Pof7tUqTLh8JcsbdLgvvz8uOhxWrFEkK7Y1AFY1tdNbbiqht3qadLfzyjGQg/wBmmRKLbLWo3YCmGM8n7xHb2rLpyOUOcZ9jTXbcxOMewpFJcuglJRRQAVr6N/qJP96setjRv9RJ/vU0RPYr6t/x9D/dqjXQy2sUzbnXJFR/YLf/AJ5inYSnZGFRmt37Bb/88xR9gt/7gpWH7QwaK3vsFv8A88xR9gtv+eYp2DnRgUldB/Z9v/zzFH9n23/PMUWFznP1saN/x7yf71WP7Ptv+eYqWGGOBSI1wDRYlyuf/9k=';
     //      $scope.hasPicture = true;
           
       PhoneLibrary.getPicture().then(function(imageURI) {
       if (imageURI.substring(0,21)=="content://com.android") {
  photo_split=imageURI.split("%3A");
  imageURI="content://media/external/images/media/"+photo_split[1];
}
       $scope.cameraPic =  'data:image/jpeg;base64,' + imageURI;
       $scope.hasPicture = true;
       
       
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    })};
 
      
       $scope.getAlbumPhoto = function() {
    PhoneAlbum.getPicture().then(function(imageURI) {
        $scope.cameraPic = imageURI;
        $scope.hasPicture = true;
      console.log(imageURI);
    }, function(err) {
      console.err(err);
        $scope.errorMessage= err;
    });
  };
      
    
    $scope.trustAsResourcUrl = function(url) {
    return $sce.trustAsResourceUrl(url);
};   
   

  }
])
    

                             .config(function($compileProvider){
 $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);

})
;
