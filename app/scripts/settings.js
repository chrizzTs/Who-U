angular.module('settings', ['serverAPI'])

.controller('settingsCtrl', function ($scope, serverAPI) {

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

    $scope.changeVisibility = function () {

        if (visible == 'true') {
            //console.log(UID);
            serverAPI.changeModus(UID, 0);
            window.localStorage.setItem('visible', false);
            console.log('You are invisible');
        } else if (visible == 'false') {
            //console.log(UID);
            serverAPI.changeModus(UID, 1);
            window.localStorage.setItem('visible', true);
            console.log('You are visible');
        }
    };

    $scope.logout = function () {

        var credentials = JSON.parse(window.localStorage.getItem('Credentials'));
        if (credentials != null) {
            console.log(credentials.UID);
            if (credentials.UID != null && credentials.UID != '') {
                serverAPI.logout(credentials.UID);
                window.localStorage.removeItem('Credentials');
                window.location = '#/login';
            }
        }
    };

})