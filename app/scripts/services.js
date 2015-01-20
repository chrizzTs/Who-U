var services = angular.module('services', [])

services.factory('services', function ($window, serverAPI, $rootScope, $interval) {
    var bgGeo;
    var mailRetrivalTimerSlow;
    var mailRetrivalTimerFast;
    var chatPartnerRetrivalTimer;
    

    return {
        startBackgroundGps: function () {
            //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            if (window.cordova) {
                bgGeo.start();
            }
        },

        initBackgroundGps: function () {
            //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            if (window.cordova) {
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
                    url: 'http://only.for.android.com/update_location.json', // <-- Android ONLY:  your server url to send locations to
                    params: {
                        auth_token: 'user_secret_auth_token', //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                        foo: 'bar' //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
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



            }
        },
        
        addFBProfilePicture: function(){
            var UID = window.localStorage.getItem('UID');
            
           openFB.api({
        path: '/me/picture',
        params: {
            redirect: 'false',
            width: '380',
            height: '380',
            fields: 'url'},
        success: function(picture) {
            
           
        
        var facebookprofilePhoto = new Image();
    facebookprofilePhoto.setAttribute('width', '380');
    facebookprofilePhoto.setAttribute('height', '380');
    facebookprofilePhoto.setAttribute('crossorigin', 'anonymous');
    facebookprofilePhoto.setAttribute('src', picture.data.url);
    console.log(facebookprofilePhoto);
    if(document.readyState === "complete") {
  //Already loaded!
        console.log('ready');
    var c = document.createElement('canvas');
    c.setAttribute('width', '380');
    c.setAttribute('height', '380');
    }
    var ctx = c.getContext("2d");
    ctx.drawImage(facebookprofilePhoto, 10, 10, 380, 380);
 var encodedImage = c.toDataURL('image/jpeg', 0.5);
        console.log(encodedImage);
            serverAPI.saveNewPhoto(UID, encodedImage, function(data){
                window.localStorage.setItem('facebookProfilePicture', JSON.stringify(picture));
                });
            
            
            
        },
        error: function(error){
            console.log(error.error_description);
        }
        })
        },
                      
    
        
        loginToFacebook: function() {
               
         openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
             //   console.log(response.grantedScopes);
                

            } else {
                alert('Facebook login failed');
            }
        },
        {scope: 'email, user_photos',
        return_scopes: true});
        },
        
        endBackgroundGps: function () {
            if (window.cordova) {
                bgGeo.stop()
            }

        },
        
        getChatPartner: function(callback){
        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

        serverAPI.getUsersCurrentlyPlayedWith(UID, function(usersCurrentlyPlayedWith){        
        
        var newUser= true;
        for(var i = 0; i<usersCurrentlyPlayedWith.length; i++){
            for(var j= 0; j<$rootScope.chatPartner.length; j++){
                if($rootScope.chatPartner[j]._id== usersCurrentlyPlayedWith[i]._id){
                    var lastMessageTmp = $rootScope.chatPartner[j].lastMessage 
                     var messagesTmp = $rootScope.chatPartner[j].messages
                    usersCurrentlyPlayedWith[i].lastMessage = lastMessageTmp;
                    usersCurrentlyPlayedWith[i].messages = messagesTmp;
                    $rootScope.chatPartner[j] = usersCurrentlyPlayedWith[i];
                    newUser=false;
                }
            }
            if(newUser){
                $rootScope.chatPartner.push(usersCurrentlyPlayedWith[i]);
            }
        }
    
            //Set avatar if now picture is available
            for(var i= 0; i< $rootScope.chatPartner.length; i++){
                if( $rootScope.chatPartner[i].profilPhoto == -1){
                     $rootScope.chatPartner[i].profilPhoto = 'img/cover.png'
                }
            }
            
            callback('1');
            
        })},
        
        
        getMessages: function (callback){        

    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
      count =0
    for(var i = 0; i<$rootScope.chatPartner.length; i++){
         serverAPI.getPreviousMessages(UID, $rootScope.chatPartner[i]._id, function(messages){
             
                    var msgCount = window.localStorage.getItem('msgCount'+messages.otherUser)
                    
                    
                    var message = ''
                    if(messages.messages.length>=1){
                        message = messages.messages[messages.messages.length-1].message
                     //New Message that has not been read yet.
                    if(messages.messages.length>msgCount && messages.messages[messages.messages.length-1].userSent != UID){
                        $rootScope.emailIcon ="new"
                        message = '●'+ message;
                    }else{
                        $rootScope.emailIcon=''
                    }
                    }
             
             //Save messsage to correct chatPartner
             for(var j =0; j<$rootScope.chatPartner.length; j++){
             if($rootScope.chatPartner[j]._id == messages.otherUser){
                 $rootScope.chatPartner[j].messages = messages;
                 $rootScope.chatPartner[j].lastMessage = message;
             }    
             }
             
             count++;
             if(count == $rootScope.chatPartner.length){
                 callback('1');
                  $rootScope.doneLoading = true
             }
        
    })}        

    },
        
            endChatPartnerRetrivalTimer: function(){
          $interval.cancel(chatPartnerRetrivalTimer)  
          chatPartnerRetrivalTimer = undefined
        },
    
    startChatPartnerRetrivalTimer : function(){
    var self = this;
   self.getChatPartner(function(){
       self.getMessages(function(){})
   })
    
    if(chatPartnerRetrivalTimer == undefined){
    chatPartnerRetrivalTimer   = $interval(function(){
    self.getChatPartner(function(){
        
    })      
    }, 3000)}
       },
        
    startMessageRetrivalTimerSlow : function(){
    var self = this;
   self.getMessages(function(){
       //callback
   })
   if(mailRetrivalTimerSlow == undefined){
    mailRetrivalTimerSlow   = $interval(function(){
    self.getMessages(function(){
        
    })      
    }, 5000)}
       },
        
        endMessageRetrivalTimerSlow: function(){
          $interval.cancel(mailRetrivalTimerSlow);
            mailRetrivalTimerSlow = undefined
        },
            startMessageRetrivalTimerFast : function(){
    var self = this;
   self.getMessages(function(){
       //callback
   })
    mailRetrivalTimerFast   = $interval(function(){
    self.getMessages(function(){
        
    })      
    }, 1000)
       },
        
        endMessageRetrivalTimerFast: function(){
          $interval.cancel(mailRetrivalTimerFast) 
          mailRetrivalTimerFast = undefined
        }
} })