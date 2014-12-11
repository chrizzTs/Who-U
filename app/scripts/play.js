angular.module('play', [])

.controller('playCtrl', function($scope, $sce) {

  $scope.name = 'Megan';
  $scope.tasklines = [{
    line: 'Eat a burger together!'
  }, {
    line: 'enumerate 1'
  }, {
    line: 'enumerate 2'
  }, {
    line: 'enumerate 3'
  }, {
    line: 'enumerate 4'
  }]


  <!-- Code für den Picture Slider -->
  $scope.slides = [{
      image: 'img/Megan_1.jpg',
      description: 'Megan 1'
    }, {
      image: 'img/Megan_2.jpg',
      description: 'Megan 2'
    }

  ];

});
