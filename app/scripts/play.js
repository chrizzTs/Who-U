angular.module('play', [])

.controller('playCtrl', function($scope, cssInjector) {

  cssInjector.add('styles/play.css');

  $scope.storageTasklines = "Eat the following;Burger 1;Burger 2;Doener";
  $scope.name = "Megan";
  $scope.isEnumeration = true;
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
      description: 'Megan 1'
    }, {
      image: 'img/Megan_2.jpg',
      description: 'Megan 2'
    }

  ];


})


;
