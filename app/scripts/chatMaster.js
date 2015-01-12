angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, serverAPI, $state, chatDetail, cssInjector) {

    cssInjector.removeAll();
    
    //Retrive Chatpartner from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.chatPartner = new Array();
    serverAPI.getUsersCurrentlyPlayedWith(UID, function(data){
        console.log(data);
        
         
        for (var i= 0; i<data.length; i++){
            serverAPI.getUserData(data[i], function(userData){
            var picture;
            console.log(userData.profilePhotoId);
            serverAPI.getPhoto(data[i], userData.profilePhotoId, function(photoData){
            picture = photoData.data;    
            
                console.log(picture);
                var tempPlayer = {
                    "id:": data[i],
                    "name": userData.userName,
                    "picture": picture
                }
                   $scope.chatPartner.push(tempPlayer);
                }
                              )
            }
        )
    }
    })
    
    //Redirects to chatDetail and passes all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {
        chatDetail.initChat(partner);
        $state.go('tab.chat-detail');
    }



})