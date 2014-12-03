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
});