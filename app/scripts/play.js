'use strict';


angular.module('play', ['serverAPI'])


.controller('playCtrl', ['$scope', 'cssInjector', 'serverAPI', '$ionicPopup', '$state', '$ionicSlideBoxDelegate', '$ionicViewService', '$ionicPlatform',
    function ($scope, cssInjector, serverAPI, $ionicPopup, $state, $ionicSlideBoxDelegate, $ionicViewService) {

//==================Start: Load Play Screen=====================
        //add Styles
        cssInjector.removeAll();
        cssInjector.add('styles/play.css');
        
        //clear history to prevent the user from leaving the game
        $ionicViewService.clearHistory();
        

        //initialize variables
        $scope.task, $scope.teammateUID;
        $scope.slides = new Array();

    
        //load Game Information
        $scope.fetchDataFromLocalStorage();
        $scope.checkEnumeration();
        $scope.loadImages();
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
           
        
//===============End: Load Play Screen =============================
//===============Start: Game Information Methods ====================
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
        
//=================End: Game Information Methods===================
//=================Start: Simon's Part=============================
        
         var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        var GID = window.localStorage.getItem('gameId');
        $scope.buttonDisable=false;

        //Init Data
        $scope.skipUser = 'false';
        $scope.skipUser = window.localStorage.getItem('skipUser');
        console.log('SkipUser ist: ' + $scope.skipUser);
        
        
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
            serverAPI.skipUser(UID, GID, function (data) {
                console.log(data);
                if(data == -1 || data == -5){
                    var alertPopup = $ionicPopup.alert({
                       title: 'You\'r alone...',
                       template: 'There are no other users around you, we could match with you. Sorry...'
                     });
                     alertPopup.then(function(res) {
                        $state.go('tab.home');
                     });
                }else{
                    $scope.teammateUID = data.otherUserId;
                    $scope.name = data.username;
                    $scope.slides = new Array();
                    $scope.loadImages();
                    $scope.skipUser = 'false';
                    window.localStorage.setItem('skipUser', 'false');
                    //$scope.redraw();
                    /*serverAPI.getUserData($scope.teammateUID, function(data){
                        $scope.name = data.name;
                    });*/
                }
            });
            
        }
        
//=================End: Simon's Part=============================

      
      }
      ]);