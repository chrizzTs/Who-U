angular.module('chatMaster', ['chatDetail'])

.controller('chatMasterCtrl', function ($scope, $state, chatDetail) {


    //Redirect to chatDetauk and pass all needed Chatinformation to chatDetail
    $scope.clicked = function (partner) {
        chatDetail.initChat(partner);
        $state.go('chat-detail');
    }


    //TEST DATA
    var data = [{
            "id": "12345",
            "name": "Max",
            "fotoID": "534b8fb2aa5e7afc1b23e69c",
            "message": "Hallo Maxodsjdsdpsdsökddfjsdufdsjfsuffujsdfsdfsdfojifodsjdfsosdfjsdfdsfjidsfijidsjfjodfsdfsiojdfsodfsijifdsjofdsjfdjodsojsdfdssdfjsdfijdfsfdsdfsijsdfipodfssdoffdsijsdfijo"
        }, {
            "id": "5655",
            "name": "Tom",
            "fotoID": "534b8fb2aa5e7afc1b23e69c"
        },
        {
            "id": "12345433245",
            "name": "Anna",
            "fotoID": "534b8fb2aa5e7afc1b23e69c"
        }, {
            "id": "232356",
            "name": "Tim",
            "fotoID": "534b8fb2aa5e7afc1b23e69c"
        }]

    $scope.chatPartner = data;

})