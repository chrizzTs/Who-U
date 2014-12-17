'use strict';

angular.module('coins', ['ServerAPI'])
    .controller('coinsCtrl', function ($scope, serverAPI, cssInjector) {

        console.log('angebunden');

        $scope.benefits[{
            'name': 'Skip a selected user, before starting a game',
            'price': 40
        }, {
            'name': 'Send 25 more messages in chat',
            'price': 15
        }, {
            'name': 'Filter (currently disabled due the lack of Facebook integration)',
            'price': 60
        }, {
            'name': 'Gather more points per game for 3 days',
            'price': 50
        }];


    });