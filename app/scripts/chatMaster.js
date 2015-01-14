angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, serverAPI, $state, chatDetail, cssInjector) {

    
    
    //Retrive Chatpartner from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.chatPartner = new Array();
    serverAPI.getUsersCurrentlyPlayedWith(UID, function(data){
    
        for (var i= 0; i<data.length; i++){
            serverAPI.getUserData(data[i], function(userData){
            var picture;
            var message;
            serverAPI.getPhoto(userData.id, userData.profilePhotoId, function(photoData){
            
            serverAPI.getPreviousMessages(UID, userData.id, function(messages){
                console.log(messages)
                
            })
                        
            picture = photoData.data;   
                var tempPlayer = {
                    "id": userData.id,
                    "name": userData.userName,
                    "picture": picture,
                    "message" : message
                }
                   $scope.chatPartner.push(tempPlayer);
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