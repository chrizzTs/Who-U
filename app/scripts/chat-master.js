angular.module('chat-master', [])

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

    $scope.currentIndex = 0;

    $scope.setCurrentSlideIndex = function (index) {
        $scope.currentIndex = index;
    }

    $scope.isCurrentSlideIndex = function (index) {
        return $scope.currentIndex === index;
    }

    $scope.prevSlide = function () {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
    };

    $scope.nextSlide = function () {
        $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
    };
})