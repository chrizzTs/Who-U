angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services, $ionicPopup) {

    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.visibleStatus;

    var visible = window.localStorage.getItem('visible');
    var pushNotifications = window.localStorage.getItem('pushNotifications');
    var saveData = window.localStorage.getItem('saveData');

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

    if (saveData == 'true') {
        $scope.loadJustOneImage = {
            mode: true
        };
    } else if (saveData == 'false') {
        $scope.loadJustOneImage = {
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
            $rootScope.disablePushNotification();
            
            pushNotifications = 'false';
            window.localStorage.setItem('pushNotifications', 'false');
        } else if (pushNotifications = 'false') {
            $rootScope.enablePushNotification()
            pushNotifications = 'true';
            window.localStorage.setItem('pushNotifications', 'true');
            console.log('Ya like us');
        }
    }

    $scope.changeLoadJustOneImage = function () {
        if (saveData == 'true') {
            //Code
            saveData = 'false';
            window.localStorage.setItem('saveData', 'false');
        } else if (saveData == 'false') {
            //Code
            saveData = 'true';
            window.localStorage.setItem('saveData', 'true');
        }
    }

    $scope.logout = function () {
        var credentials = JSON.parse(window.localStorage.getItem('Credentials'));
        var isFacebookUser = window.localStorage.getItem('facebook');
        if (isFacebookUser){
            openFB.logout(function (response) {
                });
        }
        if (credentials != null) {
            console.log(credentials.UID);
            if (credentials.UID != null && credentials.UID != '') {
                serverAPI.logout(credentials.UID, function (data) {
                    localStorage.clear();
                    window.location = '#/login';
                });
            }
        }
    };
    
    $scope.deleteAccount=function(){
        var confirmPopup = $ionicPopup.confirm({
                title: 'Warning!',
                template: 'Are you sure you want to delete your account?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Go to hell');
                }else{
                    console.log('Good choice');
                }
            });   
    }
})