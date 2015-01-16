'use strict'
angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $rootScope, $interval, $location, $state, services, serverAPI, $ionicPopup, cssInjector, $http, base64) {


        cssInjector.removeAll();
       $scope.isFacebookUser = window.localStorage.getItem('Facebook');
    
        //Init Data so User does not have to wait till callback
        $scope.coins = 0;
        $scope.profilePicture = 'img/cover.png'

    
        $scope.buttonType = "icon ion-search";
    
        
    

        $rootScope.buttonDisable;

        $scope.text = 'Search';

        $scope.profilePhotoId, $scope.profilePicture;
$scope.isFacebookUser = window.localStorage.getItem('facebook');


        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        serverAPI.getUserData(UID, function (data) {
            console.log(data);
            $scope.pushId = data.pushId;
            $scope.userName = data.userName;
            $scope.coins = data.coins;
            $scope.profilePhotoId = data.profilePhotoId;
            window.localStorage.setItem('photoIds', JSON.stringify(data.photoIds));
            window.localStorage.setItem('myUsername', $scope.userName);
            //getProfile Picture
            serverAPI.getPhoto(UID, data.profilePhotoId, function (data) {
                if(data == -8){
                    console.log("No image uploaden: set to avatar")
                    $scope.profilePicture = 'img/cover.png'
                    if ($scope.isFacebookUser == 'true'){
                        addFBProfilePicture();
                    }
                }else{
                      $scope.profilePicture = data.data;
                }
                window.localStorage.setItem('myProfilePicture', $scope.profilePicture);
            });
        


            });
$scope.otherPlayerPictures = new Array();
    
        serverAPI.getRecentEvents(UID, function (data) {
            if(typeof data==='object'){
                 $scope.events = data; 
            }
            console.log(data);    
            for (var i = 0; i < data.length; i++){
                var otherPlayerUid = data[i].userId;
                serverAPI.getUserData(otherPlayerUid, function(data) {
                console.log(data);
                    var profilePhotoId = data.profilePhotoId;
                    serverAPI.getPhoto(data.id, data.profilePhotoId, function(photoData){
                        console.log(photoData);
                        var entry;
                        if(photoData == -8){
                        entry = {
                            'id': photoData.id,
                            'picture': 'img/cover.png'
                            
                        }
                        } else {
                            entry = {
                             'id': photoData.id,
                             'picture': photoData.picture
                            }
                        }
                        $scope.otherPlayerPictures.push(entry);
                    })
                })
                
            }
        });

        serverAPI.getGamesToRate(UID, getGamesToRate);

        //Request new feedback sheet from server to rate last plays (contat with new persons)

        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
        }

    
     
        function addFBProfilePicture(){
           openFB.api({
        path: '/me/picture',
        params: {
            redirect: 'false',
            width: '380',
            height: '380',
            fields: 'url'},
        success: function(picture) {
            $scope.$apply(function() {
           
        
        var facebookprofilePhoto = new Image();
    facebookprofilePhoto.setAttribute('width', '380');
    facebookprofilePhoto.setAttribute('height', '380');
    facebookprofilePhoto.setAttribute('crossorigin', 'anonymous');
    facebookprofilePhoto.setAttribute('src', picture.data.url);
    console.log(facebookprofilePhoto);
    
    var c = document.createElement('canvas');
    c.setAttribute('width', '380');
    c.setAttribute('height', '380');
    var ctx = c.getContext("2d");
    ctx.drawImage(facebookprofilePhoto, 10, 10, 380, 380);
 var encodedImage = c.toDataURL('image/jpeg', 0.5);
        console.log(encodedImage);
            
            serverAPI.saveNewPhoto(UID, encodedImage, function(data){
                    $scope.profilePicture = encodedImage;
                });
            
                 $scope.picture = picture;
                console.log(picture);
                window.localStorage.setItem('facebookProfilePicture', JSON.stringify(picture));
            })
            
        },
        error: function(error){
            console.log(error.error_description);
        }
        })
        }
                      
    
        function getGamesToRate(data) {
            //Check if there are any new feedback sheets availalbe
            if (data == -10) {} else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Feedback',
                    template: 'There is a player that has not been rated yet. Please rate the player before you keep playing.'
                });


                alertPopup.then(function (res) {
                    $state.go('feedback');
                });


            }
        };


        $scope.click = function () {
            $rootScope.buttonDisable=true;
            $scope.text='Disabled for 10s';
        
            $scope.enabler=$interval(function(){
                $rootScope.buttonDisable=false;
                $interval.cancel($scope.enabler);
            }, 10000);
            
            console.log('Button disable: '+$scope.buttonDisable);

            console.log($scope.text);
            //$scope.text = 'Searching';
            console.log($scope.text);

            console.log($scope.buttonType);
            $scope.buttonType = 'icon ion-loading-a';



            //Grap geoLocation    
            var location = navigator.geolocation.getCurrentPosition(saveGeoData);



            function saveGeoData(geoData) {
                console.log(geoData);
                var myPosition = {
                    'longitude': geoData.coords.longitude,
                    'latitude': geoData.coords.latitude
                };

                window.localStorage.setItem('myPosition', JSON.stringify(myPosition));
                //If geoloaction is saved successfully => Send geodata to server to receive teammate
                serverAPI.updateGPS(UID, myPosition.longitude, myPosition.latitude, function (data) {
                    if (data == 1) {
                        sendToServer(myPosition);
                    }
                });
            };

        
            
            
            //Send current location to Server to receive teammate
            function sendToServer(myPosition) {
                serverAPI.searchPartnerToPlayWith(myPosition.longitude, myPosition.latitude, UID, function (data) {
                    console.log('searchPartnerToPlayWith: '+data);

                    //No other players around you. Server returns -1 
                    if (data == -1) {
                        $ionicPopup.alert({
                            title: 'Too bad :(',
                            template: 'Unfortunateley there are no other players around you. Try it some other time!'
                        });

                        //Reset Button to start state
                        $scope.text = 'Search';
                        $scope.buttonDisable = false;
                        window.localStorage.setItem('disableSearchButton', 'false');
                        $scope.buttonType = "icon ion-search"

                    } else {
                        window.localStorage.setItem('teammate', data.username);
                        window.localStorage.setItem('isEnumeration', data.taskType);
                        window.localStorage.setItem('task', data.task);
                        window.localStorage.setItem('teammateUID', data.otherUserId);
                        window.localStorage.setItem('gameId', data.gameId);
                        console.log("Teammate Data")
                        console.log(data)
                        var teammatePosition = {
                            'longitude': data.longitude,
                            'latitude ': data.latitude
                        };
                        window.localStorage.setItem('teammatePosition', JSON.stringify(teammatePosition));
                        //TODO: data.fotoId => request foto from server
                        $state.go('tab.play-screen');
                        //Notify player that somebody is looking for him
                        serverAPI.pushSearchStarted(UID, function(result){
                            console.log("Push started send to serve:" + result)
                        })
                    }


                })
            }
        }
        
/************************************************************************************
        PUSH-NOTIFICATION
                                */
        
    //Register Notification at Goolge Server only if it has not been registered yet.
    if($scope.pushId != undefined){
    enablePushNotification();
    }
    
    function enablePushNotification() {
            document.addEventListener("deviceready", function () {
                var pushNotification = window.plugins.pushNotification.register(function(result){
                      console.log('Callback Success! Result = ' + result)
                }, function(error){
                              alert("ErrorHandler");
            alert(error);
                }, {
                    "senderID": "168615009802",
                    "ecb": "onNotificationGCM"
                });
          }
                                      
           , false)
        }
        
       window.onNotificationGCM = function (e) { 
           console.log(e)
                switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    serverAPI.insertPushId(UID, e.regid, function(result){
                        console.log("transmitted regid to Serve successfully")
                    })
                }
            break;
 
            case 'message':
            conso.log("is message")
            if(e.payload.isMessage){
            $rootScope.toUser = e.payload.userId
             $state.go('tab.chat-detail')  
            }
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
         
        }
    
    /*END PUSH NOTIFICATION */
    
    
    
    })