'use strict';

angular.module('play', [])

.controller('playCtrl', ['$scope', 'cssInjector',
  function($scope, cssInjector) {


    cssInjector.add('styles/play.css');

    //fetch all data from localStorage from tab-home
    $scope.fetchDataFromLocalStorage = function() {
      $scope.task = window.localStorage.getItem('task');

      //$scope.teammatePhotos{}

      $scope.name = window.localStorage.getItem('username');

      $scope.isEnumeration = window.localStorage.getItem('isEnumeration');
    };

    $scope.slides = [{
        image: 'img/picture_1.jpg',
      }, {
        image: 'img/picture_2.jpg',
      }

    ];



    //check if task is a enumeration and split it if it is

    $scope.checkEnumeration = function() {
      if ($scope.isEnumeration === false) {
        $scope.tasklines = $scope.task;

      } else if ($scope.isEnumeration === true) {
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
