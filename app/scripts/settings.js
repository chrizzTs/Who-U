angular.module('settings', ['services'])

.controller('settingsCtrl', function ($scope, serverAPI, services, $ionicPopup, $rootScope) {

    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    $scope.visibleStatus;

    var visible = window.localStorage.getItem('visible');
    var pushNotifications = window.localStorage.getItem('pushNotifications');
    var saveData = window.localStorage.getItem('saveData');
    
    window.localStorage.setItem('disableSearchButton', 'false');

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
        $scope.pushNotificationsStatus = {
            mode: true
        };
    } else if (pushNotifications == 'false') {
        $scope.pushNotificationsStatus = {
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
                console.error(data)
            });
            window.localStorage.setItem('visible', 'false');
        } else {
            visible = 'true';
            services.startBackgroundGps();
            serverAPI.changeModus(UID, 1, function (data) {
                console.error(data)
            });
            window.localStorage.setItem('visible', 'true');
        }
    };

    $scope.changePushNotifications = function () {
        if (pushNotifications == 'true') {    
            pushNotifications = 'false';
             services.disablePushNotification()
            window.localStorage.setItem('pushNotifications', 'false');
        } else if (pushNotifications = 'false') {
            services.enablePushNotification()
            pushNotifications = 'true';
            window.localStorage.setItem('pushNotifications', 'true');
        }
    }

    $scope.changeLoadJustOneImage = function () {
        if (saveData == 'true') {
            saveData = 'false';
            window.localStorage.setItem('saveData', 'false');
        } else if (saveData == 'false') {
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
            if (credentials.UID != null && credentials.UID != '') {
                serverAPI.logout(credentials.UID, function (data) {
                    localStorage.clear();
                    window.location = '#/login';
                });
            }
        }
                    services.endChatPartnerRetrivalTimer()
                    services.endMessageRetrivalTimerSlow()
                delete  $rootScope.userName
                delete  $rootScope.coins
                delete  $rootScope.events
                delete  $rootScope.buttonDisable
                delete $rootScope.newMailCount
                $rootScope.chatPartner = new Array()
        
    };
    
    $scope.deleteAccount=function(){
        var confirmPopup = $ionicPopup.confirm({
                title: 'Warning!',
                template: 'Are you sure you want to delete your account?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    if (window.localStorage.getItem('facebook')){
                              openFB.revokePermissions(
                function() {
                });
                }
    
                    serverAPI.deleteUser(UID, function(data){
                        $scope.logout();
                    });
                    
                }
            });   
    }
})