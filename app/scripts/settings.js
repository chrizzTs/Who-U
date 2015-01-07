angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services) {

    var visible = window.localStorage.getItem('visible');
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

    //Meanins have to be inverted due the opposide meaning of the toggle (-->INvisible)
    if (visible == 'true') {
        $scope.visibleStatus = {
            mode: false
        };
    } else if (visible == 'false') {
        $scope.visibleStatus = {
            mode: true
        };
    }

    //Change visibility
    $scope.changeVisibility = function () {

        if (visible == 'true') {
            services.endBackgroundGps();
            serverAPI.changeModus(UID, 0, function (data) {
                console.log(data)
            });
            window.localStorage.setItem('visible', false);
            console.log('You are invisible');
        } else if (visible == 'false') {
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