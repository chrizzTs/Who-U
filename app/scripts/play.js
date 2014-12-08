angular.module('play', [])

.controller('playCtrl', function ($scope) {
    $scope.name = 'Megan';
    $scope.task = 'Eat a burger together!';

    <!-- Code für den Picture Slider -->
    $scope.slides = [
        {
            image: 'img/Megan_1.jpg',
            description: 'Megan 1'
    },
        {
            image: 'img/Megan_2.jpg',
            description: 'Megan 2'
    }
    ];
})