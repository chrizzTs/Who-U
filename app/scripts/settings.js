angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services) {

    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

    $scope.visible = window.localStorage.getItem('visible');

    $scope.changeVisibility = function () {

        if ($scope.visible == true) {
            $scope.visible = false;
            services.endBackgroundGps();
            serverAPI.changeModus(UID, 0, function (data) {
                console.log(data)
            });
            window.localStorage.setItem('visible', false);
            console.log('You are invisible');
        } else {
            $scope.visible = true;
            services.startBackgroundGps();
            serverAPI.changeModus(UID, 1, function (data) {
                console.log(data)
            });
            window.localStorage.setItem('visible', true);
            console.log('You are visible');
        }
    };

    $scope.logout = function () {

        var credentials = JSON.parse(window.localStorage.getItem('Credentials'));
        if (credentials != null) {
            console.log(credentials.UID);
            if (credentials.UID != null && credentials.UID != '') {
                serverAPI.logout(credentials.UID, function (data) {
                    window.localStorage.removeItem('Credentials');
                    window.location = '#/login';
                });
            }
        }
    };
})