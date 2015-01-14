var chatDetail = angular.module('chatDetail', ['ionic', 'monospaced.elastic', 'angularMoment'])


.controller('chatDetailCtrl', ['$scope', '$rootScope', '$state',
  '$stateParams', '$ionicActionSheet', '$ionicScrollDelegate', '$timeout', '$interval', 'cssInjector', 'serverAPI',
  function ($scope, $rootScope, $state, $stateParams,
        $ionicActionSheet, $ionicScrollDelegate, $timeout, $interval, cssInjector, serverAPI) {

        cssInjector.add('styles/chatDetail.css')
        $rootScope.hideFooter = true;
        
        $scope.$on("$destroy", function(){
 $rootScope.hideFooter = false;
});
      
      
        // Chatpartners User Data
        $scope.toUser = $rootScope.toUser;
      console.log($scope.toUser)
            
        //My Own data
        var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
        var pictue = window.localStorage.getItem('myProfilePicture')
        if(pictue = ''){
            
        }
        $scope.user = {
            id: UID,
            picture: window.localStorage.getItem('myProfilePicture'),
            name: window.localStorage.getItem('myname')
        };
      

        //Saving typed messages that have not been sent to local storage and to initialize them when the chat is reopened.
        $scope.input = {
            message: localStorage['userMessage-' + $scope.toUser.id] || ''
        };

        var messageCheckTimer;

        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput; // 

        getMessages();
        $scope.$on('$ionicView.enter', function () {
            console.log('UserMessages $ionicView.enter');




            $timeout(function () {
                footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                scroller = document.body.querySelector('#userMessagesView .scroll-content');
                txtInput = angular.element(footerBar.querySelector('textarea'));
            }, 0);

            messageCheckTimer = $interval(function () {
                // here you could check for new messages if your app doesn't use push notifications or user disabled them
            }, 20000);
        });

        $scope.$on('$ionicView.leave', function () {
            console.log('leaving UserMessages view, destroying interval');
            // Make sure that the interval is destroyed
            if (angular.isDefined(messageCheckTimer)) {
                $interval.cancel(messageCheckTimer);
                messageCheckTimer = undefined;
            }
        });

        $scope.$on('$ionicView.beforeLeave', function () {
            if (!$scope.input.message || $scope.input.message === '') {
                localStorage.removeItem('userMessage-' + $scope.toUser.id);
            }
        });


        //Retrive Messages from Server
//
//     $scope.$watch('messages', function (newValue, oldValue) {
//         console.log("change messages from undefined")
//         
//         
//         if($scope.message != undefined ){
//             console.log("messages is not undefined")
//            $scope.doneLoading = true;
//         }
//      
//        });
//      
      
    //Init get messages  
    serverAPI.getPreviousMessages(UID,  $scope.toUser.id, function(messages){
              $scope.messages = messages;
              })
                
                
    $scope.doneLoading = true;
      function getMessages(){
          setInterval(function () {
            console.log("loading Messages")
          serverAPI.getPreviousMessages(UID,  $scope.toUser.id, function(messages){
              console.log(messages);
              $scope.messages = messages;
              })    
          }, 3000);
          
      }
      


        //Saving input Message to local Storage
        $scope.$watch('input.message', function (newValue, oldValue) {
            if (!newValue) newValue = '';
            localStorage['userMessage-' + $scope.toUser.id] = newValue;
        });

        //Send message to Server
        $scope.sendMessage = function (sendMessageForm) {
         
            keepKeyboardOpen();
//            message.picture = $scope.user.picture;

            $scope.messages.push({'message':$scope.input.message, 'timeStamp': new Date(), 'userSent': $scope.toUser.id});

            $timeout(function () {
                keepKeyboardOpen();
                viewScroll.scrollBottom(true);
            }, 0);

            
            console.log("eigene UID:" + UID);
            console.log("Partner UID" + $scope.toUser.id)
            
            serverAPI.sendMessage(UID,  $scope.toUser.id, $scope.input.message,  new Date(), function(result){
                console.log("send Message Callback" + result);
            })
                 $scope.input.message = '';


        };

        // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
        function keepKeyboardOpen() {
            console.log('keepKeyboardOpen');
            // txtInput.one('blur', function () {
            //      console.log('textarea blur, focus back on it');
            //                txtInput[0].focus();
            //            });
        }

        $scope.onMessageHold = function (e, itemIndex, message) {
            console.log('onMessageHold');
            console.log('message: ' + JSON.stringify(message, null, 2));
            $ionicActionSheet.show({
                buttons: [{
                    text: 'Copy Text'
        }, {
                    text: 'Delete Message'
        }],
                buttonClicked: function (index) {
                    switch (index) {
                    case 0: // Copy Text
                        //cordova.plugins.clipboard.copy(message.text);

                        break;
                    case 1: // Delete
                        // no server side secrets here :~)
                        $scope.messages.splice(itemIndex, 1);
                        $timeout(function () {
                            viewScroll.resize();
                        }, 0);

                        break;
                    }

                    return true;
                }
            });
        };


        // I emit this event from the monospaced.elastic directive, read line 480
        $scope.$on('taResize', function (e, ta) {
            if (!ta) return;

            var taHeight = ta[0].offsetHeight;
            console.log('taHeight: ' + taHeight);


            if (!footerBar) return;

            var newFooterHeight = taHeight + 10;
            newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

            footerBar.style.height = newFooterHeight + 'px';
            scroller.style.bottom = newFooterHeight + 'px';
        });

}])


// fitlers
.filter('nl2br', ['$filter',
  function ($filter) {
        return function (data) {
            if (!data) return data;
            return data.replace(/\n\r?/g, '<br />');
        };
  }
])

// directives
.directive('autolinker', ['$timeout',
  function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var eleHtml = element.html();

                    if (eleHtml === '') {
                        return false;
                    }

                    var text = Autolinker.link(eleHtml, {
                        className: 'autolinker',
                        newWindow: false
                    });

                    element.html(text);

                    var autolinks = element[0].getElementsByClassName('autolinker');

                    for (var i = 0; i < autolinks.length; i++) {
                        angular.element(autolinks[i]).bind('click', function (e) {
                            var href = e.target.href;
                            console.log('autolinkClick, href: ' + href);

                            if (href) {
                                //window.open(href, '_system');
                                window.open(href, '_blank');
                            }

                            e.preventDefault();
                            return false;
                        });
                    }
                }, 0);
            }
        }
  }
])

// configure moment relative time
moment.locale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "%d sec",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
});

angular.module('monospaced.elastic', [])

.constant('msdElasticConfig', {
    append: ''
})

.directive('msdElastic', [
    '$timeout', '$window', 'msdElasticConfig',
    function ($timeout, $window, config) {
        'use strict';

        return {
            require: 'ngModel',
            restrict: 'A, C',
            link: function (scope, element, attrs, ngModel) {

                // cache a reference to the DOM element
                var ta = element[0],
                    $ta = element;

                // ensure the element is a textarea, and browser is capable
                if (ta.nodeName !== 'TEXTAREA' || !$window.getComputedStyle) {
                    return;
                }

                // set these properties before measuring dimensions
                $ta.css({
                    'overflow': 'hidden',
                    'overflow-y': 'hidden',
                    'word-wrap': 'break-word'
                });

                // force text reflow
                var text = ta.value;
                ta.value = '';
                ta.value = text;

                var append = attrs.msdElastic ? attrs.msdElastic.replace(/\\n/g, '\n') : config.append,
                    $win = angular.element($window),
                    mirrorInitStyle = 'position: absolute; top: -999px; right: auto; bottom: auto;' +
                    'left: 0; overflow: hidden; -webkit-box-sizing: content-box;' +
                    '-moz-box-sizing: content-box; box-sizing: content-box;' +
                    'min-height: 0 !important; height: 0 !important; padding: 0;' +
                    'word-wrap: break-word; border: 0;',
                    $mirror = angular.element('<textarea tabindex="-1" ' +
                        'style="' + mirrorInitStyle + '"/>').data('elastic', true),
                    mirror = $mirror[0],
                    taStyle = getComputedStyle(ta),
                    resize = taStyle.getPropertyValue('resize'),
                    borderBox = taStyle.getPropertyValue('box-sizing') === 'border-box' ||
                    taStyle.getPropertyValue('-moz-box-sizing') === 'border-box' ||
                    taStyle.getPropertyValue('-webkit-box-sizing') === 'border-box',
                    boxOuter = !borderBox ? {
                        width: 0,
                        height: 0
                    } : {
                        width: parseInt(taStyle.getPropertyValue('border-right-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-right'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-left'), 10) +
                            parseInt(taStyle.getPropertyValue('border-left-width'), 10),
                        height: parseInt(taStyle.getPropertyValue('border-top-width'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-top'), 10) +
                            parseInt(taStyle.getPropertyValue('padding-bottom'), 10) +
                            parseInt(taStyle.getPropertyValue('border-bottom-width'), 10)
                    },
                    minHeightValue = parseInt(taStyle.getPropertyValue('min-height'), 10),
                    heightValue = parseInt(taStyle.getPropertyValue('height'), 10),
                    minHeight = Math.max(minHeightValue, heightValue) - boxOuter.height,
                    maxHeight = parseInt(taStyle.getPropertyValue('max-height'), 10),
                    mirrored,
                    active,
                    copyStyle = ['font-family',
                           'font-size',
                           'font-weight',
                           'font-style',
                           'letter-spacing',
                           'line-height',
                           'text-transform',
                           'word-spacing',
                           'text-indent'];

                // exit if elastic already applied (or is the mirror element)
                if ($ta.data('elastic')) {
                    return;
                }

                // Opera returns max-height of -1 if not set
                maxHeight = maxHeight && maxHeight > 0 ? maxHeight : 9e4;

                // append mirror to the DOM
                if (mirror.parentNode !== document.body) {
                    angular.element(document.body).append(mirror);
                }

                // set resize and apply elastic
                $ta.css({
                    'resize': (resize === 'none' || resize === 'vertical') ? 'none' : 'horizontal'
                }).data('elastic', true);

                /*
                 * methods
                 */

                function initMirror() {
                    var mirrorStyle = mirrorInitStyle;

                    mirrored = ta;
                    // copy the essential styles from the textarea to the mirror
                    taStyle = getComputedStyle(ta);
                    angular.forEach(copyStyle, function (val) {
                        mirrorStyle += val + ':' + taStyle.getPropertyValue(val) + ';';
                    });
                    mirror.setAttribute('style', mirrorStyle);
                }

                function adjust() {
                    var taHeight,
                        taComputedStyleWidth,
                        mirrorHeight,
                        width,
                        overflow;

                    if (mirrored !== ta) {
                        initMirror();
                    }
                    //                    // active flag prevents actions in function from calling adjust again
                    if (!active) {
                        active = true;

                        mirror.value = ta.value + append; // optional whitespace to improve animation
                        mirror.style.overflowY = ta.style.overflowY;

                        taHeight = ta.style.height === '' ? 'auto' : parseInt(ta.style.height, 10);

                        taComputedStyleWidth = getComputedStyle(ta).getPropertyValue('width');

                        // ensure getComputedStyle has returned a readable 'used value' pixel width
                        if (taComputedStyleWidth.substr(taComputedStyleWidth.length - 2, 2) === 'px') {
                            // update mirror width in case the textarea width has changed
                            width = parseInt(taComputedStyleWidth, 10) - boxOuter.width;
                            mirror.style.width = width + 'px';
                        }

                        mirrorHeight = mirror.scrollHeight;

                        if (mirrorHeight > maxHeight) {
                            mirrorHeight = maxHeight;
                            overflow = 'scroll';
                        } else if (mirrorHeight < minHeight) {
                            mirrorHeight = minHeight;
                        }
                        mirrorHeight += boxOuter.height;
                        ta.style.overflowY = overflow || 'hidden';

                        if (taHeight !== mirrorHeight) {
                            ta.style.height = mirrorHeight + 'px';
                            scope.$emit('elastic:resize', $ta);
                        }

                        scope.$emit('taResize', $ta); // listen to this in the UserMessagesCtrl

                        // small delay to prevent an infinite loop
                        $timeout(function () {
                            active = false;
                        }, 1);

                    }
                }

                function forceAdjust() {
                    active = false;
                    adjust();
                }

                /*
                 * initialise
                 */

                // listen
                if ('onpropertychange' in ta && 'oninput' in ta) {
                    // IE9
                    ta['oninput'] = ta.onkeyup = adjust;
                } else {
                    ta['oninput'] = adjust;
                }

                $win.bind('resize', forceAdjust);

                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newValue) {
                    forceAdjust();
                });

                scope.$on('elastic:adjust', function () {
                    initMirror();
                    forceAdjust();
                });

                $timeout(adjust);

                /*
                 * destroy
                 */

                scope.$on('$destroy', function () {
                    $mirror.remove();
                    $win.unbind('resize', forceAdjust);
                });
            }
        };
    }
  ]);


// Factory for ChatMaster to notify which Chat to load
chatDetail.factory('chatDetail', function ($rootScope) {
    return {
        initChat: function (partner) {
        $rootScope.toUser = partner
        console.log(partner)
        }
    }
})