'use strict';

angular.module('play', ['home'])

.controller('playCtrl', ['$scope', 'cssInjector',
  function($scope, cssInjector, home) {


      cssInjector.add('styles/play.css');
      $scope.skipUser=window.localStorage.getItem('skipUser');
      console.log('SkipUser='+$scope.skipUser);
      
      if($scope.skipUser==null || $scope.skipUser=='false'){
          $scope.skipUser=false;
         console.log('Skip User wurde nicht gekauft');
        }else if($scope.skipUser=='true'){
            $scope.skipUser=true;
            console.log('Skip User wurde gekauft und ist aktiv');
        }
      
      
     // $scope.skipUser = window.localStorage.getItem('skipUser');
      
      $scope.task;
    //fetch all data from localStorage from tab-home
    $scope.fetchDataFromLocalStorage = function() {

      //$scope.teammatePhotos{}

      $scope.name = window.localStorage.getItem('teammate');

      $scope.isEnumeration = window.localStorage.getItem('isEnumeration');
      
        $scope.task = window.localStorage.getItem('task');
    };
      
      $scope.slides = new Array();
    
     /* serverAPI.getPhoto(UID, $scope.photoIds[i], function(data) {
            
        $scope.imageJson = data;
            
        //array of JSONs with the photoId and data is pushed into localStorage
        var entry  = {
            "photoId" : $scope.imageJson.id,
            "image" : $scope.imageJson.data
        };
             
          $scope.slides.push(entry);
          if (i == $scope.photoIds.length) {
            window.localStorage.setItem('userPhotos', JSON.stringify($scope.slides));
          }
        
*/
/*

    $scope.slides = [{
        image: 'img/picture_1.jpg',
      }, {
        image: 'img/picture_2.jpg',
      }

    ];
*/


    //check if task is a enumeration and split it if is

    $scope.checkEnumeration = function() {
      if ($scope.isEnumeration == 0) {
        $scope.tasklines = $scope.task;

      } else if ($scope.isEnumeration == 1) {
        var index = $scope.task.indexOf(';');
        $scope.tasklineOne = $scope.task.slice(0, index);
        var enumerationLines = $scope.task.slice(index + 1, $scope.task.length);
        $scope.enumeration = enumerationLines.split(';');
      }

    };

    //executeFunctions
    $scope.fetchDataFromLocalStorage();
    $scope.checkEnumeration();

      $scope.doSkipUser=function(){
       
          home.sendTo
          window.localStorage.setItem('skipUser', 'false');
          
      }
  }
])

;
