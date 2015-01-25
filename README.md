Who-U
=====
Who-U is a social gaming app that brings straingers together. 
The app helps breaking the ice by giving a hook for a conversation or an activity.

#Getting started
This app is a cross-platform app build with phonegap and ionic.
It is build by using the yeoman generator:ionic ([click here for more information] (https://github.com/diegonetto/generator-ionic))
This link describes how to run the app and how to install it on your phone/emulate it by using Grunt.

#App Structure
The app starts the index.html site. The index page is the main container, where all other pages will be injected to by the angularJs framework. All JS, CSS and third party libraries are inclued in the index.html and   It includes the following major elements:

**The navigation bar:**
```html
    <ion-nav-bar class="bar-stable nav-title-slide-ios7">
        <ion-nav-back-button class="button-icon icon ion-ios7-arrow-back">
            Back
        </ion-nav-back-button>
    </ion-nav-bar>
````

**The main container:**

If an hyperlink is clicked, the website will not change, but it will inject different html code into this container.
The pages that are injected in there always contain the same footer (only adjusted by which tab is selected) which is profided by the `templates/tabs.html`
```html
 <ion-nav-view></ion-nav-view>
```

**Routing:**
The routing between different pages is performed by the angular framework. For more details see: http://ionicframework.com/docs/api/directive/ionNavView/

The routing rules are managed by `scripts/app.js`
The `app.js` controls which html template is called when the url changes and which javascript file is called for the template.


**Html-Template:**
The folder `templates` includes all html files that are called by the `app.js`.


**Scripts**
The folder `scripts` includes all javascripts. All templates have their own javascript file.
The main function of the javascript files is to provide a controller for each template which handles the user's interaction with the UI. It modifies the UI according to the Users's actions.
The files are usually structured like this:

```javascript
 angular.module('home', ['services'])

.controller('homeCtrl',
    function (services, serverAPI) {

       $scope.isFacebookUser = window.localStorage.getItem('facebook');
    
    var UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    
    //start Timer if user loggs in first time
    services.startChatPartnerRetrivalTimer();
    services.startMessageRetrivalTimerSlow();
    })
```

The `services.js` is a factory which includes all methods that needs to be called from different javascript files. 
It can be called by services.Method() and then runs the method in the services.js

and the `serverAPI.js` differ from the others.


**PictureTaker**

Two factories load pictures ansynchronously from the Camera or PhoneAlbum.
These interfaces to the functions of the device are implemented with the Cordova plugin: org.apache.cordova.camera.
The options for the returned picture are saved in last block of the getPicture(options) function, which is a function of 
Cordova Camera API

Options for the returned pictures:
-   quality is set to 50 to downscale the picture in order to be small enough for posting it to the server
-   encodingtype is set to JPEG because JPEGs are very small and can be downcaled easily
-   destinationtype is set to DATA_URL. Due to that photos are saved in a Base64 encoded URI, which can be sent as
    a string to the server and received as a string
-   sourceType is either set to CAMERA or SAVEDPHOTOALBUM depending on the factory
-   correctOrientation is set to true, so that horizontal images are displayed horizontally and vertical images are 
    displayed vertically

This is the factory for the Camera API

```javascript
   .factory('PhoneCamera', ['$q',
  function($q) {


    return {
      getPicture: function(options) {
        var q = $q.defer();

        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, {
          quality: 50,
          encodingType: Camera.EncodingType.JPEG,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          correctOrientation: true
        });

        return q.promise;

      }
    };
  }
])
````



 


