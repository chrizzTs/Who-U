'use strict';

angular.module('coins', ['serverAPI'])
    .controller('coinsCtrl', function ($scope, serverAPI, cssInjector) {

        $scope.coins = 100;

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

        $scope.buy = function (x) {

            var price = 0;

            //Search for the right element in "benefits" and storing its price in an external variable
            for (var i = 0; i < $scope.benefits.length; i++) {
                if ($scope.benefits[i].id == x) {
                    price = $scope.benefits[i].price;
                }
            }

            //Checking if purchase is possible and updating the new coins value
            if ($scope.coins >= price) {
                //Aufruf der serverAPI, kann ich die Transaktion sichern, dass nur bei positiver Response die Punkte abgezogen werden?
                $scope.coins = $scope.coins - price;
            } else {
                console.log('Preis zu hoch');
                //Fehlermeldung über ng-show wäre echt cool; wirft das dann wieder Fehler aus?
            }
        }

    });