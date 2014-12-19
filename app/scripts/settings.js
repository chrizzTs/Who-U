angular.module('settings', ['serverAPI'])

.controller('settingsCtrl', function ($scope, serverAPI) {

    $scope.logout = function () {

        var credentials = JSON.parse(window.localStorage.getItem('Credentials'));
        if (credentials != null) {
            console.log(credentials.UID);
            if (credentials.UID != null && credentials.UID != '') {
                serverAPI.logout(credentials.UID);
                window.localStorage.removeItem('Credentials')
            }
        }
    };

})