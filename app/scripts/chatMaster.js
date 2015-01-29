angular.module('chatMaster', ['chatDetail', 'serverAPI'])

.controller('chatMasterCtrl', function ($scope, $rootScope, serverAPI, $state, cssInjector, services) {



    //Redirects to chatDetail and passes all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {

        for (var i = 0; i < $rootScope.chatPartner.length; i++) {
            if ($rootScope.chatPartner[i]._id == partner._id) {
                window.location = '#/tab/chat-detail/' + i
            }
        }
        //  $state.go('tab.chat-detail');
    }

    cssInjector.removeAll();

})