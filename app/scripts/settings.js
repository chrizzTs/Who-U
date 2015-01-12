angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services) {

    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.visibleStatus;

    var visible = window.localStorage.getItem('visible');
    var pushNotifications = window.localStorage.getItem('pushNotifications');

    if (visible == 'true') {
        $scope.visibleStatus = {
            mode: true
        };
    } else if (visible == 'false') {
        $scope.visibleStatus = {
            mode: false
        };
    }

    if (pushNotifications == 'true') {
        $scope.pushNotificationStatus = {
            mode: true
        };
    } else if (pushNotifications == 'false') {
        $scope.pushNotificationStatus = {
            mode: false
        };
    }

    $scope.changeVisibility = function () {

        if (visible == 'true') {
            visible = 'false';
            services.endBackgroundGps();
            serverAPI.changeModus(UID, 0, function (data) {
                console.log(data)
            });
            window.localStorage.setItem('visible', 'false');
            console.log('You are invisible');
        } else {
            visible = 'true';
            services.startBackgroundGps();
            serverAPI.changeModus(UID, 1, function (data) {
                console.log(data)
            });
            window.localStorage.setItem('visible', 'true');
            console.log('You are visible');
        }
    };

    $scope.changePushNotifications = function () {
        if (pushNotifications = 'true') {
            pushNotifications = 'false';
        } else if (pushNotifications = 'false') {
            pushNotifications = 'true';
            console.log('Ya like us');
        }
    }

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