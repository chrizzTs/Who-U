'use strict';

angular.module('coins', ['serverAPI'])
    .controller('coinsCtrl', function ($scope, serverAPI, cssInjector) {

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

        serverAPI.getUserData(UID, function (data) {
            $scope.coins = data.coins;
        });

        $scope.benefits = [];
        var tmp = serverAPI.getAllBenefitItems(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.benefits[i] = data[i];
            }
        });
        $scope.orderProp = 'price';

        $scope.buy = function (x) {

            var price = 0;

            //Search for the right element in "benefits" and storing its price in an external variable
            for (var i = 0; i < $scope.benefits.length; i++) {
                if ($scope.benefits[i].id == x) {
                    price = $scope.benefits[i].price;
                }
            }

            if (x == 1) {
                //Skip user
                console.log('ID = 1');
                window.localStorage.setItem('skipUser', 'true');
            } else if (x == 2) {
                //More chat messages
                console.log('ID = 2');
            } else if (x == 3) {
                //Filter

            } else if (x == 4) {
                //More poins per game

            }

            //Checking if purchase is possible and updating the new coins value
            if ($scope.coins >= price) {
                serverAPI.buyItem(UID, x, 1, function (data) {
                    serverAPI.getUserData(UID, function (data) {
                        $scope.coins = data.coins;
                    });
                });
            }
        }

        $scope.checkBudget = function (x) {
            if ($scope.coins >= x) {
                return false;
            } else {
                return true;
            }
        }
    });