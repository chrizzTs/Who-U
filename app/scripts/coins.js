'use strict';

angular.module('coins', ['serverAPI'])
    .controller('coinsCtrl', function ($scope, serverAPI, cssInjector) {

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        console.log(UID);

        serverAPI.getUserData(UID, function (data) {
            $scope.coins = data.coins;
        });
        console.log($scope.coins);

        $scope.benefits = [];
        var tmp = serverAPI.getAllBenefitItems(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.benefits[i] = data[i];
            }
        });

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
                //serverAPI.buyItem(UID, x, 1);
                $scope.coins = $scope.coins - price;
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