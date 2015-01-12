angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, serverAPI, $state, chatDetail, cssInjector) {

    
    
    //Retrive Chatpartner from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.chatPartner = new Array();
    serverAPI.getUsersCurrentlyPlayedWith(UID, function(data){
    
         
        for (var i= 0; i<data.length; i++){
            serverAPI.getUserData(data[i], function(userData){
            var picture;
            serverAPI.getPhoto(userData.id, userData.profilePhotoId, function(photoData){
            picture = photoData.data;   
                var tempPlayer = {
                    "id:": userData.id,
                    "name": userData.userName,
                    "picture": picture
                }
                   $scope.chatPartner.push(tempPlayer);
                }
                              )
            }
        )
             $scope.doneLoading = true;
    }

    })
    
    //Redirects to chatDetail and passes all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {
        chatDetail.initChat(partner);
        $state.go('tab.chat-detail');
    }



})