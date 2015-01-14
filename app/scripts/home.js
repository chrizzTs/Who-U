'use strict'
angular.module('home', ['services'])

.controller('homeCtrl',
    function ($scope, $interval, $location, $state, services, serverAPI, $ionicPopup, cssInjector) {

        cssInjector.removeAll();

        $scope.buttonType = "icon ion-search";
        $scope.buttonDisable;
        
            var searchButtonStatus=window.localStorage.getItem('searchButton');
            console.log('SearchButtonStatus: '+searchButtonStatus);
            if(searchButtonStatus=='true'){
                $scope.buttonDisable=false;
            }else if(searchButtonStatus=='false'){
                $scope.buttonDisable=true;
            }
        console.log('$scope.buttonDisable: '+$scope.buttonDisable);
    
        /*$scope.change;
        $scope.buttonDisable;
        if($scope.change=='disable searchButton'){
            $scope.buttonDisable=true;
        }else{
            $scope.buttonDisable=false;
        }
        */
    
        $scope.changeButton=function(){
            $scope.buttonDisable=false;
        }
        
        
         $scope.$watch('$scope.buttonDisable', function () {
            $scope.disableSearch=function(){
                if($scope.buttonDisable==true){
                    return true;
                    console.log('im Watch im if');
                }else{
                    return false;
                    console.log('im Watch im else');
                }
            }
        });
        
        $scope.text = 'Search';

        $scope.profilePhotoId, $scope.profilePicture;

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        serverAPI.getUserData(UID, function (data) {
            console.log(data);
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




        serverAPI.getRecentEvents(UID, function (data) {
            $scope.events = data;
            console.log(data);    
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
            //console.log($scope.buttonDisable);
            //disables search button on home.js. (skipUser Benefit)
            $scope.buttonDisable = true;
            //$scope.change='disable searchButton';
            window.localStorage.setItem('searchButton', 'false');
            $scope.text='Disabled for 10s';
            //enables search button on home.js
            var timer=$interval(function(){
                console.log('in der Intervallfunktion');
                //$scope.change='enable search button';
                $scope.changeButton();
                console.log('buttonDisable: '+$scope.buttonDisable);
                //window.clearInterval();
                window.localStorage.setItem('searchButton', 'true');
                $interval.cancel(timer);
            }, 10000);
            console.log('Timer läuft (15s)');
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
                        //$scope.buttonDisable = false;
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
                    }


                })
            }
        }
    enablePushNotification();
    
    function enablePushNotification() {
            document.addEventListener("deviceready", function () {
                var pushNotification = window.plugins.pushNotification.register(function(result){
                      alert('Callback Success! Result = ' + result)
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
            alert("onNotification extra factory")
            
                switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    console.log("Regid " + e.regid);
                    alert('registration id = '+e.regid);
                    serverAPI.insertPushId(UID, e.regid, function(result){
                        console.log("transmitted regid to Serve successfully")
                    })
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
              alert('message = '+e.message+' msgcnt = '+e.msgcnt);
            break;
 
            case 'error':
              alert('GCM error = '+e.msg);
            break;
 
            default:
              alert('An unknown GCM event has occurred');
              break;
        }
         
        }
    
    
    
    
    
    
    
    
    })