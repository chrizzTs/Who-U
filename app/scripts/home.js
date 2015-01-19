'use strict'
angular.module('home', ['services'])

.run(function ($rootScope, serverAPI){
   
    
    
    })

.controller('homeCtrl',
    function ($scope, $rootScope, $interval, $location, $state, services, serverAPI, $ionicPopup, cssInjector, $http) {

        cssInjector.removeAll();
       $scope.isFacebookUser = window.localStorage.getItem('facebook');
    
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    
    //start Timer if user loggs in first time
    services.startChatPartnerRetrivalTimer();
    services.startMessageRetrivalTimerSlow();

    
    
 
    
    
    if ($scope.isFacebookUser == 'true'){
    openFB.getLoginStatus(function(response) {
        console.log(response.status);
  if (response.status === 'connected') {
      console.log('connected to Facebook');
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
      getUserData();
  } else if (response.status === 'unknown') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
      console.log('not authenticated');
      services.loginToFacebook();
      getUserData();
  }
 });
    } else {
      getUserData();   
    }
    
        //Init Data so User does not have to wait till callback
        $scope.coins = 0;
        $scope.profilePicture = 'img/cover.png'
        $scope.buttonType = "icon ion-search";
        $rootScope.buttonDisable;
        $scope.text = 'Search';
$scope.isFacebookUser = window.localStorage.getItem('facebook');


        
function getUserData(){
        serverAPI.getUserData(UID, function (data) {
            console.log(UID);
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
                }else{
                      $scope.profilePicture = data.data;
                }
                window.localStorage.setItem('myProfilePicture', $scope.profilePicture);
            });
        


            });
};

    
        serverAPI.getRecentEvents(UID, function (data) {
            if(typeof data==='object'){
                 $scope.events = data;
                
                $scope.events.sort(function(a, b){
                    return b.date - a.date}
                                  );
            } 
            else{
                console.error("Error loading RecentEvents: " + data)
            }
            
            //Check if avata needs to be sent as profile Picture
            for(var i= 0; i< $scope.events.length; i++){
                if( $scope.events[i].profilPhoto == -1){
                     $scope.events[i].profilPhoto = 'img/cover.png'
                }
            }
            
            $scope.doneLoading = true;
            });
            
        

        serverAPI.getGamesToRate(UID, getGamesToRate);

        //Request new feedback sheet from server to rate last plays (contat with new persons)

        function onError(error) {
            alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
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
                            if(result < 0){
                                console.error ("Error pushSearchStarted: " + result)
                            }else{
                                console.log("Push started send to server")
                            }
                            
                        })
                    }


                })
            }
        }
        
/************************************************************************************
        PUSH-NOTIFICATION
                                */
        
    
     $rootScope.disablePushNotification = function(){
        window.plugins.pushNotification.unregister(function(){
            console.log("Push service is disabled")
        }, function(result){
            console.error("Error - unable to disable pushservice: " + result)
        })
    }
    
    $rootScope.enablePushNotification= function() {
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
    
        //Register Notification at Goolge Server only if it has not been registered yet.
    if(window.localStorage.getItem('pushId') == null){
    $rootScope.enablePushNotification();
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
                        if(result<0){
                            console.error("Error callback insertPushId: "+ result)
                        }else{
                            alert("insertedPush" + e.regid)
                            window.localStorage.setItem('pushId', e.regid)
                        }
                    })
                }
            break;
 
            case 'message':
                alert("is message")
            if(e.payload.isMessage){
            $rootScope.toUser = e.payload.userId
            alert(e.payload.userId);
            $state.go('tab.chat-detail')  
            }else{
                alert(e.payload.message)
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