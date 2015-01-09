angular.module('starter', ['ionic', 'ngAnimate', 'home', 'play', 'settings', 'chatMaster', 'registration', 'login', 'angular.css.injector', 'map', 'coins', 'pictureTaker', 'feedback', 'photos', 'chatDetail'])

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



.config(function ($stateProvider, $urlRouterProvider, cssInjectorProvider, $compileProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js


    $stateProvider
    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html",
        controller: 'tabsCtrl'
    })

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'loginCtrl',
        data: {
            css: 'styles/login.css'
        }
    })

    .state('registration', {
        url: "/registration",
        templateUrl: "templates/registration.html",
        controller: 'regCtrl',
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

    .state('tab.photos', {
        url: '/photos',
        views: {
            'tab-home': {
                templateUrl: 'templates/photos.html',
                controller: 'photosCtrl'
            }
        }
    })

    .state('tab.pictureTaker', {
        url: '/pictureTaker',
        views: {
            'tab-home': {
                templateUrl: 'templates/pictureTaker.html',
                controller: 'CameraCtrl'
            }
        }
    })

    .state('tab.map', {
        url: '/play-screen/map',
        views: {
            'tab-home': {
                templateUrl: 'templates/map.html',
                controller: 'mapCtrl'
            }

        }
    })

    .state('tab.chat-master', {
        url: '/chat-master',
        footerClass: "tabs-icon-top",
        views: {
            'tab-chat-master': {
                templateUrl: 'templates/tab-chat-master.html',
                controller: 'chatMasterCtrl'
            }
        }
    })

    .state('tab.chat-detail', {
        url: '/chat-detail',
        views: {
            'tab-chat-master': {
                templateUrl: 'templates/chat-detail.html',
                controller: 'chatDetailCtrl'
            }
        }
    })

    .state('tab.coins', {
        url: '/coins',
        views: {
            'tab-coins': {
                templateUrl: 'templates/tab-coins.html',
                controller: 'coinsCtrl'
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
    })

    .state('feedback', {
        url: "/feedback",
        templateUrl: "templates/feedback.html",
        controller: 'feedbackCtrl',
        data: {
            css: 'styles/feedback.css'
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('login');

    //After a page change all injected CSS files are removed
    cssInjectorProvider.setSinglePageMode(true);

})

.controller('tabsCtrl',
    function ($state, $scope, $rootScope, services) {
    
     $rootScope.$watch('hideFooter', function (newValue, oldValue) {
         console.log("change hideStatus")
         if($rootScope.hideFooter){
             $scope.footerClass="tabs-item-hide"
         }else{
             $scope.footerClass=""
         }
      
        });
    
    })