'use strict';
angular.module('WhoU.controllers', [])

.controller('HomeCtrl', function ($scope) {
    $scope.names = [
        {
            name: 'Jani',
            country: 'Norway'
        },
        {
            name: 'Hege',
            country: 'Sweden'
        },
        {
            name: 'Kai',
            country: 'Denmark'
        }
    ];
})

.controller('FriendsCtrl', function ($scope, Friends) {
    $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function ($scope, $stateParams, Friends) {
    $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function ($scope) {});