angular.module('settings', ['serverAPI'])

.controller('settingsCtrl', function ($scope, serverAPI) {







    $scope.logout = function () {

        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        console.log(UID);
        serverAPI.logout(UID);
        window.localStorage.setItem('UID', JSON.stringify(''));
        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        console.log(UID);

    };

})