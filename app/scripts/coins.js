'use strict';

angular.module('coins', ['serverAPI'])
    .controller('coinsCtrl', function ($scope, serverAPI, cssInjector) {

        console.log('angebunden');

        $scope.benefits = [{
            'id': 1,
            'name': 'Skip user',
            'description': 'Skip a selected user and see another one, before starting the game.',
            'price': 40
        }, {
            'id': 2,
            'name': 'More chat messages',
            'description': 'Send 25 more messages in chat, to any of your contacts.',
            'price': 15
        }, {
            'id': 3,
            'name': 'Filter',
            'description': 'Currently disabled due the lack of Facebook integration.',
            'price': 60
        }, {
            'id': 4,
            'name': 'More coins per game',
            'description': 'Gather more credits per game. This feature will be active during the next 3 days.',
            'price': 50
        }];


    });