'use strict';

angular.module('play', ['serverAPI'])

.controller('playCtrl', ['$scope', 'cssInjector', 'serverAPI', '$ionicPopup', '$state',
    function ($scope, cssInjector, serverAPI, $ionicPopup, $state) {

        //add Styles
        cssInjector.removeAll();
        cssInjector.add('styles/play.css');

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        var GID = window.localStorage.getItem('gameId');


        //Init Data

        $scope.skipUser = 'false';
        $scope.skipUser = window.localStorage.getItem('skipUser');
        console.log('SkipUser ist: ' + $scope.skipUser);

        $scope.task;
        //fetch all data from localStorage from tab-home
        $scope.fetchDataFromLocalStorage = function () {

            //$scope.teammatePhotos{}

            $scope.name = window.localStorage.getItem('teammate');

            $scope.isEnumeration = window.localStorage.getItem('isEnumeration');

            $scope.task = window.localStorage.getItem('task');
        };

        $scope.slides = new Array();

        serverAPI.getUserData(window.localStorage.getItem('teammateUID'), function (data) {
            console.log(data);

            $scope.photoIds = data.photoIds;

            if ($scope.photoIds.length > 0){
            
            var saveData = window.localStorage.getItem('saveData');
            
            if (saveData == true){
                var profilePhotoId= data.profilePhotoId;
                serverAPI.getPhoto(window.localStorage.getItem('teammateUID'), profilePhotoId, function (data) {
                    console.log(data);
                    var imageJson = data;


                    $scope.slides.push(imageJson);
                }) 
            } else {
            
                
            //loop for getting the image data of every photo
            for (var i = 0; i < $scope.photoIds.length; i++) {

                serverAPI.getPhoto(window.localStorage.getItem('teammateUID'), $scope.photoIds[i], function (data) {
                    console.log(data);
                    var imageJson = data;


                    $scope.slides.push(imageJson);
                })
            }
            }
            } else {
                var entry = {
                    'id' : 0,
                    'data' : 'img/cover.png'
                }
            }
        })
        /*

    $scope.slides = [{
        image: 'img/picture_1.jpg',
      }, {
        image: 'img/picture_2.jpg',
      }

    ];
*/


        //check if task is a enumeration and split it if is

        $scope.checkEnumeration = function () {
            if ($scope.isEnumeration == 0) {
                $scope.tasklines = $scope.task;

            } else if ($scope.isEnumeration == 1) {
                var index = $scope.task.indexOf(';');
                $scope.tasklineOne = $scope.task.slice(0, index);
                var enumerationLines = $scope.task.slice(index + 1, $scope.task.length);
                $scope.enumeration = enumerationLines.split(';');
            }

        };

        //executeFunctions
        $scope.fetchDataFromLocalStorage();
        $scope.checkEnumeration();
        //Handling the Push sending to other User. 
        $scope.pushToOtherUser = function () {
            $scope.buttonDisable = true;
            serverAPI.pushStandardMessage(window.localStorage.getItem('teammateUID'), function (result) {
                console.log("Callback PushToOtherUSer" + result)
            })

        }

        $scope.done = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Attention!',
                template: 'Are you sure you want to finish this game?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $state.go('tab.home');
                }

            });
        };

        $scope.doSkipUser = function () {
            console.log('User wird übersprungen');
            $scope.skipUser = 'false';
            window.localStorage.setItem('skipUser', 'false');
            serverAPI.skipUser(UID, GID, function (data) {
                console.log('serverAPI.skipUser: ' + data);
                //UID=data.UID;
                //GID=data.gameId;
            });
            
            //Ganz elegant: diese Zeilen als eigene Funktion schreiben: ist sauberer und Code ist nicht doppelt.
            /*serverAPI.getUserData(UID, function (data) {
                $scope.photoIds = data.photoIds;

                //loop for getting the image data of every photo
                for (var i = 0; i < $scope.photoIds.length; i++) {
                    serverAPI.getPhoto(UID, $scope.photoIds[i], function (data) {
                        $scope.imageJson = data;
                        
                        //array of JSONs with the photoId and data is pushed into localStorage
                        var entry = {
                            "photoId": $scope.imageJson.id,
                            "image": $scope.imageJson.data
                        };
                        $scope.slides.push(entry);
                    })
                    Alter und neuer Spieler haben zur Zeit noch die gleichen Aufgaben
                }
            })*/
        }

      }
      ]);