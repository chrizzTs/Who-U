angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services) {

<<<<<<< HEAD
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

=======
    $scope.visible = true;
    $scope.changeVisibility = function () {
        if (this.visible) {
            services.startBackgroundGps();
        } else {
            services.endBackgroundGps();
        }
    };
>>>>>>> dba56cba138fa6c9f02e469d72ede9283de8cfb1
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

});
