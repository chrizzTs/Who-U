'use strict'
angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $rootScope, $interval, $timeout, $location, $state, services, serverAPI, $ionicPopup, cssInjector, $http, $stateParams) {

        cssInjector.removeAll();
       $scope.isFacebookUser = window.localStorage.getItem('facebook');
    
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    
    //start Timer if user loggs in first time
    services.startChatPartnerRetrivalTimer();
    services.startMessageRetrivalTimerSlow();


    $scope.normalButton;
    $scope.counterButton;
    $scope.timeSearchButton = parseInt(window.localStorage.getItem('timeSearchButton'));
    
    if(isNaN($scope.timeSearchButton)){
        //Var doesn't exist in local storage
        $scope.normalButton=true;
        $scope.counterButton=false;
    }else{
        console.log('in der else');
        //Counter has the value of the diable timout for SearchButton in Minutes
        $scope.normalButton=false;
        $scope.counterButton=true;
        
        //$scope.counter = 3;
        
        $scope.searchButtonTimeout = function(){
            //$scope.counter--;
            var remainingTime=$scope.timeSearchButton-Date.now();
            //window.localStorage.setItem('timeSearchButton', remainingTime);
            
            if(remainingTime<=0){
                $scope.stop();
            }else{
                //Divided through 60,000ms, to get a result in minutes
                //$scope.counter=Math.round(remainingTime/60000);
                $scope.counter=parseInt(remainingTime/1000);
            }
            
            //reduce counter after every 30s (=30,000)
            counterSearchButton = $timeout($scope.searchButtonTimeout,1000);
            
            //$rootScope.text='Disabled for {{counter}} minutes';
            
            
        }
        var counterSearchButton = $timeout($scope.searchButtonTimeout,0);

    
        $scope.stop = function(){
            $rootScope.buttonDisable=false;
            $rootScope.text='Search';
            $timeout.cancel(counterSearchButton);
            $scope.normalButton=true;
            $scope.counterButton=false;
            localStorage.removeItem('timeSearchButton')
        }
        
    }
    
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
        $rootScope.buttonType = "icon ion-search";
        $rootScope.text = 'Search';
        $rootScope.isFacebookUser = window.localStorage.getItem('facebook');


        
function getUserData(){
        serverAPI.getUserData(UID, function (data) {
            console.log(UID);
            console.log(data);
            $rootScope.pushId = data.pushId;
            $rootScope.userName = data.userName;
            $rootScope.coins = data.coins;
            $rootScope.profilePhotoId = data.profilePhotoId;
            window.localStorage.setItem('photoIds', JSON.stringify(data.photoIds));
            window.localStorage.setItem('myUsername', $scope.userName);
            //getProfile Picture
            serverAPI.getPhoto(UID, data.profilePhotoId, function (data) {
                if(data == -8){ 
                    console.log("No image uploaden: set to avatar")
                    $rootScope.profilePicture = 'img/cover.png'
                }else{
                      $rootScope.profilePicture = data.data;
                }
                window.localStorage.setItem('myProfilePicture', $scope.profilePicture);
            });
        


            });
};

    
        serverAPI.getRecentEvents(UID, function (data) {
            if(typeof data==='object'){
                 $rootScope.events = data;
                
                $rootScope.events.sort(function(a, b){
                    return b.date - a.date}
                                  );
            } 
            else if(data){
                console.error("Error loading RecentEvents: " + data)
                $scope.doneLoading = true;
                return;
            }
            
            //Check if avata needs to be sent as profile Picture
            for(var i= 0; i< $rootScope.events.length; i++){
                if( $rootScope.events[i].profilPhoto == -1){
                     $rootScope.events[i].profilPhoto = 'img/cover.png'
                }
            }
            
            $scope.doneLoading = true;
            });
            
        

        serverAPI.getGamesToRate(UID,  function getGamesToRate(data) {
            //Check if there are any new feedback sheets availalbe
            if (typeof data === 'object' ){
                var alertPopup = $ionicPopup.alert({
                    title: 'Feedback',
                    template: 'There is a player that has not been rated yet. Please rate the player before you keep playing.'
                });


                alertPopup.then(function (res) {
                    $state.go('feedback');
                });


            }else if(data != -10){
                
                console.error("Error: getGamesToRate: " + data)
            }
        });


        $scope.click = function () {
            
            $rootScope.buttonDisable=true;
            $rootScope.text='Searching';

            console.log($scope.buttonType);
            $rootScope.buttonType = 'icon ion-loading-a';



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
                            template: 'Unfortunateley there are no other players around you. Try it again later!'
                        });

                        //Reset Button to start state
                        $rootScope.text = 'Search';
                        $rootScope.buttonDisable = false;
                        window.localStorage.setItem('disableSearchButton', 'false');
                        $rootScope.buttonType = "icon ion-search"

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
                            'latitude': data.latitude
                        };
                        window.localStorage.setItem('teammatePosition', JSON.stringify(teammatePosition));
                        //TODO: data.fotoId => request foto from server
                        
                        //Setting timestamp for search button
                        var now = Date.now();
                        var timeStamp = now + 120000;
                        window.localStorage.setItem('timeSearchButton', timeStamp);
                        
                        
                        $state.go('tab.play-screen');
                        //Notify player that somebody is looking for him
                        serverAPI.pushSearchStarted(data.otherUserId, function(result){
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
        
  //    //Register Notification at Goolge Server only if it has not been registered yet.
    if($rootScope.login == true &&  $rootScope.login != undefined){
            document.addEventListener("deviceready", function () {
    services.enablePushNotification();
            })
         $rootScope.login = false
    }
    
    
    })