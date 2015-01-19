angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, $rootScope, serverAPI, $state, chatDetail, cssInjector) {

   cssInjector.removeAll();

    $scope.doneLoading = true
    
    //Retrive Chatpartner from Server
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.chatPartner = $rootScope.chatPartner;
    
    

    //Retrive all Users pictures 
    $rootScope.getMessages(function(){

    var loadingCounter = 0;
    for(var i = 0; i<$scope.chatPartner.length; i++){
        if($scope.chatPartner[i].profilePhotoId < 0){
            $scope.chatPartner[i].picture = 'img/cover.png'
            loadingCounter++;
        }else{
            
 
           serverAPI.getPhoto($scope.chatPartner[i].id, $scope.chatPartner[i].profilePhotoId, function(photoData){
                if(typeof photoData === 'object'){
               $scope.chatPartner[i].picture = photoData
            }else{
                console.error("Error loading picture: " + photoData)
            }
            
            loadingCounter++;
            })
                  }
                    if(loadingCounter==$scope.chatPartner.length){
                $scope.doneLoading = true;
               }
    }
           
    })         
            
    //Redirects to chatDetail and passes all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {
        chatDetail.initChat(partner);
        $state.go('tab.chat-detail');
    }



})