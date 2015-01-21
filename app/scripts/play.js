'use strict';

angular.module('play', ['serverAPI'])

.controller('playCtrl', ['$scope', 'cssInjector', 'serverAPI', '$ionicPopup', '$state', '$ionicSlideBoxDelegate', '$ionicViewService', '$ionicPlatform',
    function ($scope, cssInjector, serverAPI, $ionicPopup, $state, $ionicSlideBoxDelegate, $ionicViewService, $ionicPlatform) {

        //add Styles
        cssInjector.removeAll();
        cssInjector.add('styles/play.css');
        
        $ionicViewService.clearHistory();
        console.log($ionicViewService._getHistory());
        $ionicPlatform.onHardwareBackButton(function (event){
            if ($ionicViewService._getHistory().cursor <= 1){
                event.stopPropagation();
            } else {
                $ionicNavBarDelegate.back()
            }
        });
            

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        var GID = window.localStorage.getItem('gameId');
        $scope.buttonDisable=false;

        //Init Data

        $scope.skipUser = 'false';
        $scope.skipUser = window.localStorage.getItem('skipUser');
        console.log('SkipUser ist: ' + $scope.skipUser);

        $scope.task, $scope.teammateUID;
     

        $scope.slides = new Array();

        
        $scope.loadImages = function(){
        
        serverAPI.getUserData($scope.teammateUID, function (data) {
            console.log(data);

            $scope.photoIds = data.photoIds;

            if ($scope.photoIds.length > 0){
            
            var saveData = window.localStorage.getItem('saveData');
            
            if (saveData == 'true'){
                var profilePhotoId= data.profilePhotoId;
                serverAPI.getPhoto(window.localStorage.getItem('teammateUID'), profilePhotoId, function (data) {
                    console.log(data);
                    var imageJson = data;


                    $scope.slides.push(imageJson);
                    $ionicSlideBoxDelegate.update();
                }) 
            } else {
            var counter =0;
                
            //loop for getting the image data of every photo
            for (var i = 0; i < $scope.photoIds.length; i++) {
                

                serverAPI.getPhoto(window.localStorage.getItem('teammateUID'), $scope.photoIds[i], function (data) {
                    counter++;
                    console.log(data);


                    $scope.slides.push(data);
                     $ionicSlideBoxDelegate.update();
                    
                })
            }
            }
            } else {
                var entry = {
                    'id' : 0,
                    'data' : 'img/cover.png'
                }
                $scope.slides.push(entry)
            }
        
        
        })}
        
           $scope.fetchDataFromLocalStorage = function () {

            $scope.name = window.localStorage.getItem('teammate');

            $scope.isEnumeration = window.localStorage.getItem('isEnumeration');

            $scope.task = window.localStorage.getItem('task');
               
            $scope.teammateUID = window.localStorage.getItem('teammateUID');
        };
        

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
        $scope.loadImages();
        document.getElementById('userPic').style.display = 'none';
        document.getElementById('userPic').offsetHeight;
            document.getElementById('userPic').style.display = 'block';
        setTimeout(function(){
      $ionicSlideBoxDelegate.update();
  },1000);
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
 
        $scope.repaint = function() {
            document.getElementById('userPic').style.display = 'none';
            document.getElementById('userPic').style.display = 'block';
            console.log('hallo');
        };
        
        
        $scope.doSkipUser = function () {
            console.log('User wird übersprungen');
            $scope.skipUser = 'false';
            console.log('Skip user ist jetzt: '+$scope.skipUser);
            window.localStorage.setItem('skipUser', 'false');
            serverAPI.skipUser(UID, GID, function (data) {
                console.log(data);
                $scope.teammateUID = data.otherUserId;
                $scope.name = data.username;
                $scope.slides = new Array();
                $scope.loadImages();
                //$scope.redraw();
                /*serverAPI.getUserData($scope.teammateUID, function(data){
                    $scope.name = data.name;
                });*/
            });
            
        }

      
      }
      ]);