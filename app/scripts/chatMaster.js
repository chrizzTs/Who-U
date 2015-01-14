angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, serverAPI, $state, chatDetail, cssInjector) {

    
    
    //Retrive Chatpartner from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.chatPartner = new Array();
    
    //Retrive all Users that are available to Chat with
    serverAPI.getUsersCurrentlyPlayedWith(UID, function(data){
    
        //Retrive all UserData for each Player
        for (var i= 0; i<data.length; i++){
            serverAPI.getUserData(data[i], function(userData){
            var picture;
            var message;
            //Retrive each Players profilePicture
            serverAPI.getPhoto(userData.id, userData.profilePhotoId, function(photoData){
    
            //Retrive each Players previos messages to display the last messages
            serverAPI.getPreviousMessages(UID, userData.id, function(messages){
                //Check if any Messages have been exchanged before to display
                if(messages.length>0){
                     message = messages[messages.length-1].message 
                }
             
            
            
            //Set avatar if no picture is availabe for the player
            if(photoData == -8){
                picture = 'img/cover.png'
            }else{
                picture = photoData.data;
            }
                var tempPlayer = {
                    "id": userData.id,
                    "name": userData.userName,
                    "picture": picture,
                    "message" : message
                }
                   $scope.chatPartner.push(tempPlayer);
                
                })
                }
                              )
            }
        )
             $scope.doneLoading = true;
    }

    })
    
     for (var i= 0; i< $scope.chatPartner; i++){
         console.log("start ForSchleife for ChatMessages")
            serverAPI.getPreviousMessages(UID, $scope.chatPartner[i].id, function(messages){
                console.log(messages)
                $scope.chatPartner.id
            })
     }
         

    
    //Redirects to chatDetail and passes all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {
        chatDetail.initChat(partner);
        $state.go('tab.chat-detail');
    }



})