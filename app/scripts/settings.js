angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services) {

    $scope.visible = true;
    $scope.changeVisibility = function () {
        if (this.visible) {
            services.startBackgroundGps();
        } else {
            services.endBackgroundGps();
        }
    };
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

});