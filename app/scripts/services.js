'use strict'
var services = angular.module('services', [])

services.factory('services', function (serverAPI) {
    var bgGeo;

    return {
        startBackgroundGps: function () {
            //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            if (window.cordova) {
                bgGeo.start();
            }
        },

        initBackgroundGps: function () {
            //Check if it is running in the browser or on a phone (background geo catching can only be performed on the phone)
            if (window.cordova) {
                bgGeo = window.plugins.backgroundGeoLocation;


                /** Server Callback function after GPS data is pushed to the server
                 */
                var callBackUpdateGPS = function (response) {
                    // Inform that the background-task is completed. Call funish () even if the server request was not successful, otherwise ios will crash the APP for spending too much time in the background.
                    bgGeo.finish();
                };

                /**
                 * This callback will be executed every time a geolocation is recorded in the background.
                 */
                var callbackFn = function (location) {

                    //Push all information to the server.
                    serverAPI.updateGPS(JSON.parse(window.localStorage.getItem('Credentials')).UID, location.longitude, location.latitude, callBackUpdateGPS);

                };

                var failureFn = function (error) {
                    console.log('BackgroundGeoLocation error');
                }

                // BackgroundGeoLocation
                bgGeo.configure(callbackFn, failureFn, {
                                    url: 'http://only.for.android.com/update_location.json', // <-- Android ONLY:  your server url to send locations to
                                    params: {
                                        auth_token: 'user_secret_auth_token', //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                                        foo: 'bar' //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
                                    },
                                    headers: { // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
                                        "X-Foo": "BAR"
                                    },
                    desiredAccuracy: 10,
                    stationaryRadius: 20,
                    distanceFilter: 30,
                    notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
                    notificationText: 'ENABLED', // <-- android only, customize the text of the notification
                    activityType: 'CLActivityTypeOther',
                    debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
                    stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
                });



            }
        },
        endBackgroundGps: function () {
            if (window.cordova) {
                bgGeo.stop()
            }

        }



    }
});