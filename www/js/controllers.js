angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope) {
    $scope.username = "maax",
    $scope.buttonType = "icon ion-search",
    $scope.buttonDisable = false,
    $scope.click = function () {
        $scope.buttonDisable = true;
    };

})

.controller('FriendsCtrl', function ($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {})

.controller('PlayCtrl', function ($scope) {
    $scope.name = 'Megan';
    $scope.task = 'Eat a burger together!';
    
    <!-- Code für den Picture Slider -->
    $scope.slides = [
        {image: 'img/Megan_1.jpg', description: 'Megan 1'},
        {image: 'img/Megan_2.jpg', description: 'Megan 2'}
    ];
    
    $scope.currentIndex = 0;
    
    $scope.setCurrentSlideIndex = function(index){
        $scope.currentIndex = index;
    }
    
    $scope.isCurrentSlideIndex = function(index){
        return $scope.currentIndex === index;
    }
    
        $scope.prevSlide = function () {
            $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        };

        $scope.nextSlide = function () {
            $scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
        };
})

.animation('.slide-animation', function () {
        return {
            addClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });                   
                }
                else {
                    done();
                }
            },
            removeClass: function (element, className, done) {
                if (className == 'ng-hide') {
                    element.removeClass('ng-hide');

                    TweenMax.set(element, { left: element.parent().width() });
                    TweenMax.to(element, 0.5, {left: 0, onComplete: done });
                }
                else {
                    done();
                }
            }
        };
    });
