angular.module('play', [])

.controller('playCtrl', function($scope, cssInjector) {

  cssInjector.add('styles/play.css');

  $scope.storageTasklines = window.localStorage.getItem("task");
    
//$scope.teammatePhotos{}
    
 //fetch all data from localStorage from tab-home 
  $scope.name = window.localStorage.getItem("username");
    
  $scope.isEnumeration = window.localStorage.getItem("isEnumeration");
    
  $scope.isText = false;
    




  if ($scope.isEnumeration == false) {
    $scope.tasklines = $scope.storageTasklines;

  } else if ($scope.isEnumeration) {
    var index = $scope.storageTasklines.indexOf(';');
    $scope.tasklineOne = $scope.storageTasklines.slice(0, index);
    var enumerationLines = $scope.storageTasklines.slice(index + 1, $scope.storageTasklines.length);
    $scope.enumeration = enumerationLines.split(';');
  }

  <!-- Code für den Picture Slider -->
  $scope.slides = [{
      image: 'img/Megan_1.jpg',
    }, {
      image: 'img/Megan_2.jpg',
    }

  ];


})


;
