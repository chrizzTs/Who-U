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
It can be called by services.Method() and then runs the method in the `services.js`

and the `serverAPI.js` differ from the others.

#Registration

The registration page contains actually just a HTML-form, which collects userinput from textfields. From a technical standpoint there was no need to use a form. But from an UI-standpoint this enabled the use of the `$invalid`-variable. With an easy check in the associated CSS-Sheet a grafical animation - weather the form is correct or incorrect - could be displayed. Angular recognizes the state of `$invalid` and uses the matching CSS arguments; e.g.:
````css
.regForm.ng-invalid {
    border: 10px solid rgba(255, 0, 0, .2);
    -moz-box-shadow: 0 0 13px 3px rgba(255, 0, 0, .5);
    -webkit-box-shadow: 0 0 13px 3px rgba(255, 0, 0, .5);
    box-shadow: 0 0 13px 3px rgba(255, 0, 0, .5);
}
````

As long as all required fields are not filled out in a proper way, the submit button is disabled. There is a special function in the controller for that purpose. This enables a content validation against mistakes, before the input is actually used. The use of `$watch`-variable provides the user instant feedback to the entered values. The function below responds with every change in the password input field to its status. With this the user is not required to press a button to get error notifications, which speeds up the registration process. Note: the `$scope.enableButton()`-function is just for checking, wether the form is correct; so the button is no enabled in the ``$watch``-function.

````javascript
$scope.$watch('password2', function () {
            if ($scope.password2 == $scope.password1) {
                if ($scope.password2 == '') {
                    $scope.showWarningEmpty = true;
                }
                $scope.showWarningPW2 = false;
                $scope.enableButton();
            } else {
                console.log('Sind ungleich');
                $scope.showWarningEmpty = false;
                $scope.showWarningPW2 = true;
            }

        });
````

As soon as the user presses the registration button, the registration process is started. First, the user has to be located. This is required due the fact that the database saves the position of every user. The more a freshly initialized user should be able to participate in a game.

[Part Christian: geolocation]

After the location all required data is sent to the server using:

````javascript
serverAPI.createNewUser($scope.user, $scope.password1, $scope.EMail, myPosition.longitude, myPosition.latitude, function (data) {
...
}
````

There is a lot of localstorage use in the callback, which is the reason it is not displayed above. Basically it is about storing all required values for a later use in the localstorage. These are: User ID, Credentials (required for a login without a password), visible status and pushnotification status. The use of all the variables will be explained in this documentation. After all values are stored, the user is redirected to the home tab. If the E-Mailadress, which was used, is already assigned to an account, or if (however) the passwords were not identical, some error messages appear on the HTML-site. Due the knowledge of the own password is critical for the further use of the app, there was so much effort in storing the correct passwords.

#Facebook Integration

**General configuration**

The app uses `openfb.js`. This is a microlibrary which integrates Javascript applications with Facebook. It was downloaded from https://github.com/ccoenraets/OpenFB. Therefor the Facebook SDK is not needed. 

To start openFB and initialize the connection of the app with Facebook, the following line is added at the beginning of the Module 'Starter' in the .config to start directly when the app opens.

````javascript
    openFB.init({appId: '339615032892277', tokenStore: window.localStorage});
````

To make this connection possible the app has to be created on the official site 'developers.facebook.com'. On this website the site URL of this app has to be included at allowd Websites. In this case 'http://localhost:8100/' for both Site URL on Mobile Site URL. Client Oauth Login has to be activated and Valid Oauth redirect URLs have to be added. Valid OAuth Redirect URI's for this app are:
-   http://localhost:8100/oauthcallback.html (Desktop Login)
-   https://www.facebook.com/connect/login_success.html (Mobile/Cordova Login)

**Facebook Login**

Either Facebook Login and Registration are started with the 'Login with Facebook' button on the Login Page. 

````html
<button class="button button-positive" ng-click="facebookLogin()">
Login with Facebook
</button>
````

From there on the function facebook.login() in `login.js` is called. It tries to login to Facebook with the openFB API and if it succeds, executes the function $scope.goToHome(), which will take the user to the Home-Screen if he has been logged in to Facebook before. In the scope variable, permissions could be written, that need to be given from Facebook. The Facebook integration just needs the connection to Facebook, the name and the Profile Picture of the user, which are  public so nothing has to be inserted here.

`````javascript
 $scope.facebookLogin = function () {

         openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                $scope.goToHome();


            } else {
                alert('Facebook login failed');
            }
        },
        {scope: '',
        return_scopes: true});
         
    }
````

First the user data of the Facebook account (ID, First name) are taken  and the JSON object 'user', in which this data is stored is added to $scope and localStorage for later usage. Additionally a localStorageItem 'facebook' is set to true, so that in the App, functions can evaluate if the user is a Facebook User and offer special services.

````javascript
  openFB.api({
        path: '/me',
        params: {fields: 'id, first_name'},
        success: function(user) {
            $scope.$apply(function() {
                $scope.user = user;
                window.localStorage.setItem('user', JSON.stringify(user));
                window.localStorage.setItem('facebook', 'true');
                console.log(user);
            });
````

The callback does not end here, because the Facebook data is needed for the following Login. 

Facebook users are registered in the App with their Facebook ID as E-Mail address and 'facebook' as their password. If another user knows the Facebook ID of the user and this scheme, he can still not login in with the account, because the app only allows E-Mail addresses with the sign '@' when logging in the regular way.

The function $scope.goToHome() tries to login with the given ID and 'facebook' as the password. If it does not succed, a new Facebook User will be created ($scope.createFacebookUser();). If it is possible, all needed data is inserted to localStorage and the sessionKey is set. For further information to this process, look at the regular login process.

````javascript
serverAPI.loginWithMail($scope.user.id, 'facebook', function (data) {
                if (data != '-3'){
                //Case: Facebook user has been created yet
                
                //regular login process
                var sessionKey = data 
                if (data instanceof Object) {
                    window.localStorage.setItem('Credentials', JSON.stringify(data));
                    window.localStorage.setItem('visible', true);
                    window.localStorage.setItem('pushNotifications', 'true');
                    window.localStorage.setItem('saveData', 'false');
                    window.location = "#/tab/home";
                     $rootScope.login = true
                    services.initBackgroundGps();

                } else {
                    $scope.loginFailed = true;
                }
                }
                //Case: Facebook user is not created yet
                else {
                    $scope.createFacebookUser();
                }
            })
````

**Creating a new Facebook User**

Facebook Users are created with the function $scope.createFacebookUser in `login.js`. 

First, the Geoposition is taken from the user because it is needed for the registration. Then a new user is created with the Server API Method createNew User (look in Server Documentation for more information to this). A new user is created with
    	-Username:  First name in Facebook
        -Password:  'facebook'
        -E-Mail:    Facebook ID
        -Current Position

First the Facebook Profile Photo is added to the account with the function services.addFBProfilePicture(); Look at the Services Documentation for more Information. 

Then a few lines of registration specific code are executed. They are copied from `registration.js` so look there for more information. 

At last $scope.goToHome() is executed again. This time it will be able to login the user and he continue to the Home-Screen.

````javascript
serverAPI.createNewUser($scope.user.first_name, 'facebook', $scope.user.id, myPosition.longitude, myPosition.latitude, function (data) {
                    //Add Facebook Profile Photo
                    services.addFBProfilePicture();
                
                //Registration specific code. Copied from registration.js
                    console.log(data);
                    var storedCredentials;
                    var newCredentials;
                    if ((storedCredentials = window.localStorage.getItem('Credentials')) != null) {
                        storedCredentials = JSON.parse(storedCredentials)
                        storedCredentials['UID'] = data
                        storedCredentials['SessionKey'] = null
                        newCredentials = storedCredentials
                    } else {
                        newCredentials = {
                            'UID': data
                        }
                    }
                    
                    $rootScope.login = true
                    $scope.goToHome();
                    
                });
````

#Uploading and Taking Pictures: PictureTaker Page

The PictureTaker Page is designed to offer the user the ability to upload Pictures.
He can do that with his/her phone camera, saved pictures on the phone or facebook profile picture.
All images have to be cropped and downscaled, because on the one hand users should not have to download
huge, detailed versions of pictures and on the other hand big picture files cannot be sent to the server
in one POST.
The structure, functions and style of the PictureTaker are stored in:
-   `templates/pictureTaker.html`
-   `scripts/pictureTaker.js`
-   `styles/pictureTaker.css`

**Configuration**

In the Configuration of the Angular Module the Sanitization Whitelist of images has to be extended to allow images from android smartphones and to allow image rendering from Base64 encoded Image-Strings.

```javascript
.config(function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|img|content):|data:image\//);
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel):/);
})
````

**Factories for Camera API**

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
**Used Variables with initial Values**

```javascript
$scope.hasPicture = false;
````
If this variable is true, the uploaded picture will be shown. 
Additionally all options to crop, delete or save the uploaded image will be displayed. In HTML this is implemented with ng-if.

```javascript
$scope.pictureCropped = false;
````
This variable has to be true to be able to save Images, because only cropped Images can be uploaded.

```javascript
$scope.userImage = '';
    //croppedUserImage is the return of the imageCropper, the part of the picture in the square
    $scope.croppedUserImage = 'data:image/jpeg;base64,';
    //check if user is cropping
    $scope.isCurrentlyCropping = false;
    //used to check if picture is cropped and user can save it therefor
    $scope.cropSpace = '';
    $scope.newImage = 'data:image/jpeg;base64,';
````

These are variables used in the angular module ngImgCrop for cropping images.

````html
<img-crop image = "userImage"
                    area-type = "square"
                    result-image = "croppedUserImage"
                    result-image-size = "360"
                    on-change="changeImage($dataURI)"
                    result-image-format = "image/jpeg"
                > </img-crop>
````
Variables
-   $scope.userImage: the area with the original image, on which a cropping square is shown
-   $scope.croppedUserImage: the return of the image Cropper, so it is the part of the picture in the square. 
-   $scope.newImage: contains the last cached cropped Image

**Functions $scope.getCameraPhoto/$scope.getAlbumPhoto**
 
As an example the $scope.getCameraPhoto() method is shown here

```javascript
    $scope.getCameraPhoto = function() {
      PhoneCamera.getPicture().then(function(imageURI) {
        $scope.successfulGetPhoto(imageURI);
      }, function(err) {
        console.err(err);
      });
    };
    
     $scope.successfulGetPhoto = function(imageURI){
        $scope.userImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.shownImage = 'data:image/jpeg;base64,' + imageURI;
        $scope.hasPicture = true;
        $scope.pictureCropped = false;
        $scope.startCropping();
    }
````

The method uses the described factories for downloading the images asynchronously. If the download succeeds, variables for the following pictureCropping are set. PictureCropped is set to false so that the user cannot save the image before cropping it. Afterwards the Cropping function starts.

**Image Cropping

For Image Cropping, the angular module "ngImgCrop" is used. The Github site for this module is: https://github.com/alexk111/ngImgCrop

The Image Cropping process is done in a modal window. The Script-Part of this modal window is done with the $ionicModal service. The needed functions are shown below:

````javascript
    $scope.startCropping = function() {
      $scope.openModal();
    };

    $ionicModal.fromTemplateUrl('imageCrop', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
      
````

It is embedded at the bottom of pictureTaker.html.

````html
<script type='text/ng-template' id='imageCrop'>
    <ion-header-bar class="bar-positive">
        <h1 class="title">Crop Image</h1>
    </ion-header-bar>
    <div class="modal">
        <ion-content>
            <div class = 'imageHolder'>
                <img-crop image = "userImage"
                    area-type = "square"
                    result-image = "croppedUserImage"
                    result-image-size = "360"
                    on-change="changeImage($dataURI)"
                    result-image-format = "image/jpeg"
                > </img-crop>
            </div >
                <button class = 'button button-positive button-full'
            ng-click = "endCropping()">
                Crop </button> 
            </ion-content>
        </div>
    </script>
````html

For Image Cropping it is important to set the original image to a defined size, absolute or relative. This is done with the following:

````css

.imageHolder {
    height: 50%;
    width: 100%;
}



.imageHolder > img {
    text-align: center;
    width: 90%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    display: block;
}

````

It uses the variables which have been explained in the Variables Part of this chapter.

Important apart from these are the the three attributed of the img-crop element:
-   area-type: is set to "square" to cut out a square part from the original image
-   result-image-size: Is set to 360 to downscale the image but not too small to identify the user
-   onChange: $dataURI object is given with the last cached cropped image. It is further processed in the changeImage function.

The changeImage function:
````javascript
   $scope.changeImage = function(dataUrl) {
      if ((dataUrl !== 'data:image/jpeg;base64,') && (dataUrl !== $scope.userImage)) {
        $scope.newImage = dataUrl;
      }
    };
````
It checks whether there are any changes to the image and whether there is any image at all. If so, it is saved to $scope.newImage, which will later be the saved Image.

In $scope.endCropping the image is saved into $scope.shownImage, which is the image shown in the PictureTaker Page and which can be saved afterwards. The modal window is closed.

````javascript
  $scope.endCropping = function() {
      $scope.shownImage = $scope.newImage;
      $scope.userImage = $scope.newImage;
      $scope.pictureCropped = true;
      $scope.closeModal();
    };
````

**Image Option Buttons**
The three functions of $scope: saveImage(), discardImage() and addFBProfilePicture() allow the user to save an image, discard an image order add the user's Facebook Profile Picture to his account (only when logged in with Facebook).
-   saveImage uses the Server API "saveNewPhoto". For more Information look at the function in the Server documentation
-   discardImage just removes the image from §scope.shownImage and sets $scope.hasPicture to 'false'
-   addFBProfilePicture uses a function declared in `Services.js`. Read the documentation of the this file for more information




