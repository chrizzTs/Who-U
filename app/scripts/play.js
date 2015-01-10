'use strict';

angular.module('play', [])

.controller('playCtrl', ['$scope', 'cssInjector',
  function($scope, cssInjector) {


    cssInjector.add('styles/play.css');

      $scope.task;
    //fetch all data from localStorage from tab-home
    $scope.fetchDataFromLocalStorage = function() {

      //$scope.teammatePhotos{}

      $scope.name = window.localStorage.getItem('teammate');

      $scope.isEnumeration = window.localStorage.getItem('isEnumeration');
      
        $scope.task = window.localStorage.getItem('task');
    };

    $scope.slides = [{
        image: 'img/picture_1.jpg',
      }, {
        image: 'img/picture_2.jpg',
      }

    ];



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


  }
])

;
