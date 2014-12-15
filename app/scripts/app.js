angular.module('starter', ['ionic', 'ngAnimate', 'home', 'play', 'settings', 'chatMaster', 'registration', 'login'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
    })

    .state('registration', {
        url: "/registration",
        templateUrl: "templates/registration.html",
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
        url: '/home',
        views: {
            'tab-home': {
                templateUrl: 'templates/tab-home.html',
                controller: 'homeCtrl'
            }
        }
    })

    .state('tab.play-screen', {
        url: '/play-screen',
        views: {
            'tab-home': {
                templateUrl: 'templates/play-screen.html',
                controller: 'playCtrl'
            }
        }
    })
        .state('tab.chat-master', {
            url: '/chat-master',
            views: {
                'tab-chat-master': {
                    templateUrl: 'templates/tab-chat-master.html',
                    controller: 'chatMasterCtrl'
                }
            }
        })

    .state('tab.coins', {
        url: '/coins',
        views: {
            'tab-coins': {
                templateUrl: 'templates/tab-coins.html',
                controller: 'chatMasterCtrl'
            }
        }
    })

    .state('tab.settings', {
        url: '/settings',
        views: {
            'tab-settings': {
                templateUrl: 'templates/tab-settings.html',
                controller: 'settingsCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

});