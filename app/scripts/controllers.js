angular.module('starter.controllers', [])

.controller('HomeCtrl', function ($scope) {
    $scope.username = "maax",
    $scope.buttonType = "icon ion-search",
    $scope.buttonDisable = false,
    $scope.click = function () {
        $scope.buttonDisable = true
        $scope.buttonType = "icon ion-loading-a"
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
})

;
