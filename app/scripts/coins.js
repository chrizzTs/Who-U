'use strict';

angular.module('coins', ['serverAPI'])
    .controller('coinsCtrl', function ($scope, $rootScope, $ionicPopup, serverAPI, cssInjector) {
    
        cssInjector.add("styles/coins.css");

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
    
        $scope.getPopupMessage=function(contact){
            var choice=contact._id;
            console.log(choice);
            
            //BenefitID has to be 2 because the getPopupMessage is just called, if x is already 2
            serverAPI.buyItem(UID, 2, 1, function (data) {
                serverAPI.getUserData(UID, function (data) {
                    $scope.coins = data.coins;
                });
                console.log('buyItem: '+data);
            });
            
            console.log(UID+'<<<>>>'+choice);
            serverAPI.upgradeMessagesLeftCount(UID, choice, function(data){
                console.log('upgradeMessages'+data);
            });
        }

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
                
                //Checking if purchase is possible and updating the new coins value
                if ($scope.coins >= price) {
                    serverAPI.buyItem(UID, x, 1, function (data) {
                        serverAPI.getUserData(UID, function (data) {
                            $scope.coins = data.coins;
                        });
                    });
                }
                
            } else if (x == 2) {
                //More chat messages
                
                if ($scope.coins >= price) {

                    console.log($rootScope.chatPartner);
                    $rootScope.chatPartner

                    var selectUsers = $ionicPopup.show({
                        templateUrl: '../templates/popupMessages.html',
                        title: 'Select a user you want to chat with',
                        scope: $scope,
                        buttons: [
                           
                            { text: '<b>OK</b>',
                              type: 'button-positive',
                              onTap: function(e) {
                                  console.log('OK wurde ausgeführt');
                               }
                              },
                             ]
                       });

                       selectUsers.then(function(res) {
                         console.log('Popup wurde ausgeführt!', res);
                       });
                }
                                            
            } else if (x == 3) {
                //Filter

            } else if (x == 4) {
                //More poins per game
                //Implementation of this feature is on server site. Identification via Benefit-ID
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