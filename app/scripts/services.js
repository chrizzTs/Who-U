var services = angular.module('services', [])

services.factory('services', function ($window, serverAPI, $rootScope, $ionicPopup, $interval) {
    var bgGeo;
    var mailRetrivalTimerSlow;
    var mailRetrivalTimerFast;
    var chatPartnerRetrivalTimer;
    var pushNotification;

    return {
        startBackgroundGps: function () {
            //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            document.addEventListener("deviceready", function () {
                bgGeo.start();
            })
        },

        initBackgroundGps: function () {
            var self = this
                //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            document.addEventListener("deviceready", function () {
                bgGeo = window.plugins.backgroundGeoLocation;


                /** Server Callback function after GPS data is pushed to the server
                 */
                var callBackUpdateGPS = function (response) {
                    // Inform that the background-task is completed. Call funish () even if the server request was not successful, otherwise ios will crash the APP for spending too much time in the background.
                    bgGeo.finish();
                };

                /**
                 * This callback will be executed every time a geolocation is recorded in the background.
                 */
                var callbackFn = function (location) {

                    //Push all information to the server.
                    serverAPI.updateGPS(JSON.parse(window.localStorage.getItem('Credentials')).UID, location.longitude, location.latitude, callBackUpdateGPS);

                };

                var failureFn = function (error) {
                    console.log('BackgroundGeoLocation error');
                }

                // BackgroundGeoLocation
                bgGeo.configure(callbackFn, failureFn, {
                    url: 'https://whou.sabic.uberspace.de/api/updateGPS', // <-- Android ONLY:  your server url to send locations to
                    params: {
                        _id: window.localStorage.getItem('Credentials').UID,
                        longitude: location.longitude,
                        latitude: location.latitude

                    },
                    headers: { // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
                        "X-Foo": "BAR"
                    },
                    desiredAccuracy: 10,
                    stationaryRadius: 30,
                    distanceFilter: 30,
                    notificationTitle: 'WhoU tracking', // <-- android only, customize the title of the notification
                    notificationText: 'ENABLED', // <-- android only, customize the text of the notification
                    activityType: 'CLActivityTypeOther',
                    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
                    stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
                });



            })
            //After BackgroundGPS is initialized start it
            self.startBackgroundGps()
        },

        addFBProfilePicture: function () {


            //get the Link to the facebook photo
            //size: 380px x 380px
            openFB.api({
                path: '/me/picture',
                params: {
                    redirect: 'false',
                    width: '380',
                    height: '380',
                    fields: 'url'
                },
                success: function (picture) {


                    //Create a new image with the profile picture in it
                    var facebookprofilePhoto = new Image();
                    facebookprofilePhoto.src = picture.data.url;
                    facebookprofilePhoto.width = 380;
                    facebookprofilePhoto.height = 380;
                    facebookprofilePhoto.setAttribute('crossorigin', 'anonymous');

                    //draw the image on a canvas, which can consequently be saved into
                    //a data URL
                    facebookprofilePhoto.onload = function () {
                        console.log(facebookprofilePhoto);
                        var c = document.createElement('canvas');
                        c.setAttribute('width', '380');
                        c.setAttribute('height', '380');
                        var ctx = c.getContext("2d");
                        ctx.fillStyle = "rgb(200,0,0)";
                        ctx.drawImage(facebookprofilePhoto, 0, 0, 380, 380);
                        var encodedImage = c.toDataURL('image/jpeg', 0.5);
                        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
                        serverAPI.saveNewPhoto(UID, encodedImage, function (data) {
                            window.localStorage.setItem('facebookProfilePicture', JSON.stringify(data));
                        });



                    }
                    facebookprofilePhoto.src = picture.data.url;
                },
                error: function (error) {
                    console.log(error.error_description);
                }
            })
        },



        loginToFacebook: function () {

            openFB.login(
                function (response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        //   console.log(response.grantedScopes);


                    } else {
                        alert('Facebook login failed');
                    }
                }, {
                    scope: 'email, user_photos',
                    return_scopes: true
                });
        },

        endBackgroundGps: function () {
            document.addEventListener("deviceready", function () {
                console.log("Background GPS stopped")
                bgGeo.stop(function () {
                    console.log("Background GPS stopped")
                }, function (error) {
                    console.error("Error: Stop geoLocation: " + error)
                })
            })

        },

        getChatPartner: function (callback) {
            var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

            serverAPI.getUsersCurrentlyPlayedWith(UID, function (usersCurrentlyPlayedWith) {

                if (typeof usersCurrentlyPlayedWith === 'object') {
                    var newUser = true;
                    for (var i = 0; i < usersCurrentlyPlayedWith.length; i++) {
                        for (var j = 0; j < $rootScope.chatPartner.length; j++) {
                            if ($rootScope.chatPartner[j]._id == usersCurrentlyPlayedWith[i]._id) {
                                var lastMessageTmp = $rootScope.chatPartner[j].lastMessage
                                var messagesTmp = $rootScope.chatPartner[j].messages
                                usersCurrentlyPlayedWith[i].lastMessage = lastMessageTmp;
                                usersCurrentlyPlayedWith[i].messages = messagesTmp;
                                $rootScope.chatPartner[j] = usersCurrentlyPlayedWith[i];
                                newUser = false;
                            }
                        }
                        if (newUser) {
                            $rootScope.chatPartner.push(usersCurrentlyPlayedWith[i]);
                        }
                    }

                    //Set avatar if now picture is available
                    for (var i = 0; i < $rootScope.chatPartner.length; i++) {
                        if ($rootScope.chatPartner[i].profilPhoto == -1) {
                            $rootScope.chatPartner[i].profilPhoto = 'img/cover.png'
                        }
                    }

                    callback('1');

                } else {
                    //If not ChatPartner is available => Set DoneLoading for ChatMaster because there is nothing to load
                    if (usersCurrentlyPlayedWith == -11) {
                        $rootScope.doneLoading = true;
                    } else {
                        console.error("Error: getUsersCurrentlyPlayedWith() " + usersCurrentlyPlayedWith)
                    }



                }
            })
        },


        getMessages: function (callback) {

            var mailCount = 0

            var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
            count = 0

            for (var i = 0; i < $rootScope.chatPartner.length; i++) {
                serverAPI.getPreviousMessages(UID, $rootScope.chatPartner[i]._id, function (messages) {

                    var msgCount = window.localStorage.getItem('msgCount' + messages.otherUser)


                    var message = ''
                    if (messages.messages.length >= 1) {
                        message = messages.messages[messages.messages.length - 1].message
                        //New Message that has not been read yet.
                        if (messages.messages.length > msgCount && messages.messages[messages.messages.length - 1].userSent != UID) {
                            mailCount += messages.messages.length - msgCount;
                            message = '●' + message;
                        }
                    }

                    //Save messsage to correct chatPartner
                    for (var j = 0; j < $rootScope.chatPartner.length; j++) {
                        if ($rootScope.chatPartner[j]._id == messages.otherUser) {
                            $rootScope.chatPartner[j].messages = messages;
                            $rootScope.chatPartner[j].lastMessage = message;
                        }
                    }

                    count++;
                    if (count == $rootScope.chatPartner.length) {
                        $rootScope.newMailCount = mailCount;
                        $rootScope.doneLoading = true
                        callback('1');

                    }

                })
            }



        },

        endChatPartnerRetrivalTimer: function () {
            $interval.cancel(chatPartnerRetrivalTimer)
            chatPartnerRetrivalTimer = undefined
        },

        startChatPartnerRetrivalTimer: function () {
            var self = this;
            self.getChatPartner(function () {
                self.getMessages(function () {})
            })

            if (chatPartnerRetrivalTimer == undefined) {
                chatPartnerRetrivalTimer = $interval(function () {
                    self.getChatPartner(function () {

                    })
                }, 3000)
            }
        },

        startMessageRetrivalTimerSlow: function () {
            var self = this;
            self.getMessages(function () {
                //callback
            })
            if (mailRetrivalTimerSlow == undefined) {
                mailRetrivalTimerSlow = $interval(function () {
                    self.getMessages(function () {

                    })
                }, 5000)
            }
        },

        endMessageRetrivalTimerSlow: function () {
            $interval.cancel(mailRetrivalTimerSlow);
            mailRetrivalTimerSlow = undefined
        },
        startMessageRetrivalTimerFast: function () {
            var self = this;
            self.getMessages(function () {
                //callback
            })
            mailRetrivalTimerFast = $interval(function () {
                self.getMessages(function () {

                })
            }, 1000)
        },

        endMessageRetrivalTimerFast: function () {
            $interval.cancel(mailRetrivalTimerFast)
            mailRetrivalTimerFast = undefined
        },




        disablePushNotification: function () {
            document.addEventListener("deviceready", function () {
                pushNotification.unregister(function () {
                    console.log("Unregister PushNotification successfull")
                }, function (error) {
                    console.error("Erro: Unregister PushNotification: " + error)
                })

            })
        },


        enablePushNotification: function () {
            document.addEventListener("deviceready", function () {
                pushNotification = window.plugins.pushNotification;
                pushNotification.register(
                    function successHandler(result) {
                        console.log('result = ' + result);
                    },
                    function errorHandler(error) {
                        console.err('error = ' + error);
                    }, {
                        "senderID": "168615009802",
                        "ecb": 'onNotificationGCM'
                    })
            })
        }



    }
})

//PushNotification Callback function
function onNotificationGCM(e) {



    console.log(e)
    switch (e.event) {
    case 'registered':
        if (e.regid.length > 0) {
            console.log("Regid " + e.regid);
            var serverAPI = angular.injector(['ng', 'serverAPI']).get("serverAPI");
            var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID
            serverAPI.insertPushId(UID, e.regid, function (result) {
                if (result < 0) {
                    console.error("Error serverAPI.insertPushId: " + result);
                }
            });



        }
        break;

    case 'message':
        if (e.payload.message == 'Be excited') {
            /* $ionicPopup.alert({
     title: 'Be excited!',
     template: 'Someone is seaching for you'
   }) */
        }
        if (e.payload.message == 'Do something to help...') {

            /*         $ionicPopup.alert({
     title: 'You cannot be found!',
     template: 'Do something to help...'
   }); */

        }
        break;

    case 'error':
        alert('GCM error = ' + e.msg);
        break;

    default:
        alert('An unknown GCM event has occurred');
        break;
    }

}