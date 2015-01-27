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

#Login

The HTML-page of the login screen works pretty similar to the registration screen. This form does not change its color as response to the user's input. But there is also an AngularJS-vaidation in the background, which prevents the user from clicking the login button, without any credentials entered. This is implemented by the ``$watch`` function as well.

As soon as the user enters the login page, a credential validation starts. In case the user was already signed in on the device, a credential is stored in the local storage. The credential is a session key, which is associated with the user on the server. This is nothing else than an automatic login, without the use of cookies. In case there is a session key, the user will immediately redirected to the home tab. The validation itself is pretty fast, which means the user shouldn't notice that the displayed screen is actually the login screen. If the controller can't find a session key, nothing happens and the user has to enter E-Mail and password. If the user presses the login button, a validation of the E-Mail address and the password will be executed on the server. In case of a positive response local storage variables will be set, in case they were undefined. If there are any entries in the local storage which correspond to the user's settings, the app pays respect to the user's choice and doesn't change the status. If there are no settings stored, the default values will be chosen. After the entering of local storage variables a session key will be stored, after that, the user will be redirected to the home screen.
The fact that the login screen checks the stored credentials, make it to the default screen for error cases. If anything wents wrong during the routing, the user is redirected to the login screen. If the user still has stored credentials, the redirecting to the login screen is not noticed by the user.

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

**Uploading the Profile Picture**

The code for uploading the Facebook profile picture is written in the file `services.js`. The Profile Picture in Facebok is always public, so no special right has to be given for this method. First the Link to the picture is received with an API function of OpenFB.

````javascript
    openFB.api({
        path: '/me/picture',
        params: {
            redirect: 'false',
            width: '380',
            height: '380',
            fields: 'url'},
        success: function(picture) {
````

Afterwards a new image variable is created with the profile picture as URL. This image is painted on a canvas, which can then be saved into a Data URL, thereby reducing the quality of the picture.


````javascript
  facebookprofilePhoto.onload = function(){
    console.log(facebookprofilePhoto);
        var c = document.createElement('canvas');
        c.setAttribute('width', '380');
        c.setAttribute('height', '380');
        var ctx = c.getContext("2d");
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.drawImage(facebookprofilePhoto, 0, 0, 380, 380);
        var encodedImage = c.toDataURL('image/jpeg', 0.5);
        var UID =      JSON.parse(window.localStorage.getItem('Credentials')).UID;
         serverAPI.saveNewPhoto(UID, encodedImage, function(data){
                window.localStorage.setItem('facebookProfilePicture', JSON.stringify(data));
                });
            
             
            
        }
    facebookprofilePhoto.src = picture.data.url;
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


#Photos Gallery

On the screen "Your photos" photos of the user are shown, can be deleted, added or set as Profile Picture. If the user has no pictures at all, just a big plus sign is shown redirecting to the PictureTaker screen.

**Structure**

Thumbnail pictures are shown on the top of the screen, which can be scrolled horizontally. In the center of the screen a large version of always one picture is shown. To show a picture in large mode, the thumbnail has to be pressed. On the large version of the image, there are three icons
-   Star: Indicates whether the current selected picture is the profile picture. Filled Blue: It is the profile picture. Outlined: It is not the profile picture. If pressed, the selected picture is set to profile picture. 
-   Plus: Add a new picture to the profile
-   Trash: Delete the current picture

For the gallery the code snippet in http://codepen.io/mmmeff/pen/LERZVe was used. For horizontal Scrolling of the thumbnail pictures, the code snippet //http://codepen.io/calendee/pen/HIuft. Both were adjusted to the style and purpose of this app. 


**Variables used with default values**

````javascript
    $scope.doneLoading = false; 
````

This indicates that no pictures have been loaded and shows a loading screen. When the first picture is loaded, the variable is set true and all received images appear. For more information on this procedure read the documentation of the Chat Screen. 

````javascript
    $scope.userHasPictures = false;
    window.localStorage.setItem('userHasPictures', '0');
````

Variable that indicates whether the user has any pictures at all and if the gallery or big plus sign is shown.

````javascript
    $scope.profilePhotoIsShown = true;
````

This indicates whether the Profile Picture is shown. If it is shown, a  star on the big picture is filled blue.

````javascript
    $scope.selection;
    $scope.selectionPhotoId = 0;
````

$scope.selection is the data of the image that is shown in large mode.
$scope.selectionPhotoId is its ID. Both are changed when the user clicks on a thumbnail or deletes a photo. The knowledge of the current photoId is important for deleting specific images, setting them as profile picture or checking if they are the profile picture.


**Function loadImages()**

The function loadImages() loads all images from the server to the user. It saves all images into a JSON array named 'scope.images'. In every JSON in this arry, the ID of a picture and the data of the picture is stored. 

To find out, which pictures a user has saved, the Server API Method "getUserData" is called. It gives the client an arry of Photo IDs saved and the ID of the Profile Picture of the user. Every further procedure have to be written into the callback, because they are dependent on this information.

````javascript
     serverAPI.getUserData(UID, function(data) {
        $scope.profilePhotoId = data.profilePhotoId;
        $scope.photoIds = window.localStorage.getItem('photoIds');
````

When all images have been loaded, they are stored in the localStorage as well, to reduce time and network usage when entering this screen again. To check whether the images are in localStorage already they are loaded from loalStorage first.

````javascript
            $scope.localStorageImages = JSON.parse(window.localStorage.getItem('userPhotos'));
````

A loop starts asking for every Photo ID, first the local Storage and if that is not successful, it asks the server. For checking, if it is in localStorage the method 'checkIfPhotoIsInLocalStorage()' is called. For asking the server the method 'getImageFromServer()' is called. For more information to these procedures look at the section of the methods. 

````javascript
    for ($scope.position = 0; $scope.position < $scope.photoIds.length; $scope.position++) {

            $scope.itemInLocalStorage = false;
            
            //check if image is in localStrage
            if ($scope.localStorageImages != null){
                checkIfPhotoIsInLocalStorage();
            }
         if ($scope.itemInLocalStorage == false){
             //image is not in localStorage, get it from the server
            getImageFromServer();
         }
        }
````

Lastly there is a validation if the user has any pictures at all. If not, the loading process is already finished.

````javascript
 if ($scope.photoIds.length != 0) {
          $scope.userHasPictures = 1;
          window.localStorage.setItem('userHasPictures', '1');
        } else {
            $scope.doneLoading = true;
        }
````

**Functions checkIfPhotoIsInLocalStorage() and getImageFromServer()**

The functions checkIfPhotoIsInLocalStorage() and getImageFromServer() are similar to each other. They both load the a JSON containing the image and then save this entry into the $scope.images Array and localStorage. The second part is executed through the method 'saveEntryInImages(imageJson)'. 

````javascript
    function saveEntryInImages(imageJson){
            var entry = {
              'id': imageJson.id,
              'data': imageJson.data
            };

          $scope.images.push(entry);
              window.localStorage.setItem('userPhotos', JSON.stringify($scope.images));
             $scope.doneLoading = true;  

          if ($scope.selection === ''){
              $scope.setHero(entry);
          }
          
           if ($scope.images.length === $scope.photoIds.length){
              $scope.images.sort(numSort);
          }
      }
````

The relevant data is taken from the JSON, stored into another JSON and inserted in the images Array and localStorage. The loading Process now has finished and images can be displayed. If no picture is displayed in large mode yet, the now loaded image is set as the selection photo. 

'getImageFromServer()' executes the Server API function getPhoto to load the JSON:

````javascript
   function getImageFromServer(){
                  serverAPI.getPhoto(UID, $scope.photoIds[$scope.position], function(data) {
            console.log('Loaded from Server:' + data.id);
            saveEntryInImages(data);
          });
      }
````

'checkIfPhotoIsInLocalStorage()' checks with a loop if the Picture ID requested is already in localStorage. If so, it sets the variable  '$scope.itemInLocalStorage' to true, so that the picture does not get loaded from the server. Afterwards it executes the 'saveEntryInImages' method.

**Deleting Pictures and setting them as Profile Picture**
Pictures are deleted with the method '$scope.deletePhoto()'. It uses the Server API function 'deletePhoto'. After that it finds out, which image was deleted and what the index in the $scope.images is. It deletes the picture with this index from the array.

````javascript
 $scope.deletePhoto = function() {
      serverAPI.deletePhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          var deleteIndex;
           //window.localStorage.setItem('userPhotos', null);
          for (var i; i < $scope.images.length; i++){
              if ($scope.images.id === $scope.selectionPhotoId){
                  deleteIndex = i+1;
              }
          }
          $scope.images.splice(deleteIndex,1);
          if ($scope.images[0] !== null){
          $scope.setHero($scope.images[0]);
          } else {
             $scope.userHasPictures = 0;
          window.localStorage.setItem('userHasPictures', '0');
          }
          
      });
    }
````

To set an image as the profile Picture, the Server API function 'updateProfilPhoto' is called. The profilePicture is newely fetched from the server and again checked whether the profile Picture is currently shown. This time this validation will return true.

````javascript
     $scope.setImageAsProfilePicture = function() {
      serverAPI.updateProfilPhoto(UID, $scope.selectionPhotoId, function(data) {
        console.log(data);
          if (data ==1){
               serverAPI.getUserData(UID, function(data) {
            $scope.profilePhotoId = data.profilePhotoId;
                   checkIfProfilePhotoIsShown();
               });                   
          }
      })
    }
````

To check whether an image is the Profile Picture the method 'checkIfProfilePhotoIsShown()' is called. It compares '$scope.selectionPhotoId' to the Profile Picture ID. 

````javascript
function checkIfProfilePhotoIsShown(){
     if ($scope.selectionPhotoId == $scope.profilePhotoId)
     {$scope.profilePhotoIsShown = true} else
     {$scope.profilePhotoIsShown = false};
 }

````
#Coins and Benefits

To make the game itself even more interesting and to provide some little extras to the players who do several games, it is possible to get coins through playing. (To get further information to the point system, go to chapter "Feedback".
The benefits are retrieved from the server, which sends them as a JSON. They are stored locally and displayed in the HTML-file using `ng-repeat`. The buy procedure can distinguish between the benefits, by checking their ID, which is handed over to the procedure: 
````html
<button class="button button-full button-positive" ng-click="buy(benefit.id)" ng-disabled="checkBudget(benefit.price)">
    Buy ({{benefit.price}} coins)
</button>
````
As soon as the user clicks on the buy-button, the controller loads the right price from the mentioned array and executes the right code for every benefit, using an if-else-structure. In the following the code and functionallity of the benefits is explained.

**Skip user**

The skip user benefit makes it possible to skip the associated partner in the play screen, if the user wants to. 


#Feedback after games

The actual process to gather coins - which makes it possible to buy benefits - is after a game. Every game has to be rated. Its rating is stored on the server. The home tab detects, whether there are not rated games and redirects the user to the feedback page. To gurantee fast feedbacks, the users have to choice to deny the redirect to the feedback page. Just a notice is displayed on the screen. Both players in a game have to rate each other, after a game. 

The HTML-code consists of three areas: first, a general part, which displays the number of the not rated games and distinguish in its grammar between singluar and plural. Second, a basic question, if there was any contact between the two players (it could have happened that both players missed each other). Third, a simple to understand star rating, which is only displayed, if the user is claims to have contact with the other player. The star rating is implemented in javascript, using the ionicons icon set as graphical representation. The locial function of the stars is stored in a JSON, which is defined in the controller. The stars appear on the screen, using ``ng-repeat="..."``. E.g.:

````html
<span ng-repeat="star in starsQuestion2">
    <i class="icon {{star.icon}}" ng-click="{{star.action}}"></i>
</span>
````
````javascript
$scope.starsQuestion2 = [
    {
        id: 0,
        action: 'rateQuestion2(1)',
        icon: 'ion-ios-star-outline'
   }, {
   ...
   }
]
````

As soon as the user enters the feedback page, his ID is read from the local storage. After that a server method is called to check, if there are any open games available. This is necessary due the support of android devices, which have a back button. In case the user just was on the feedback page and presses this back button after the redirecting to the home tab, it would be possible to get to the feedback page, without any feedbacks. The result would be a loop of feedbacks, to no player. In case there are no feedbacks, the user is redirected to the home tab. In case there any feedbacks, the actual feedback process begins.

First all feedbacks are stored in a local array. Afer that nothing happens, until the user claims to either have had contact with the menitoned person, or not. In case there was no contact, the whole process in aborted and the game is marked as rated on the server. The player doesn't get any points.
If there was a contact, the contact question disappears. After that the only way out of the feedback process is rating the other player. After commiting that there was a contact, the other player automaticly gains five points. The rating of the following questiones ("Was the profile picture up to date?" and "How did you like the contact at all?") is implemented by the mentioned star rating. The questions can be answered through giving one to five stars. Every star symbolizes one point. This results in a maximum feedback value with 15 and a minumum value of seven, if there was a contact. Every star comes with its predefined function, like shown above. The used javascript code is pretty similar for both questiones:
````javascript
$scope.rateQuestion2 = function (x) {
        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            $scope.starsQuestion2[i].icon = 'ion-ios-star-outline';
        }

        $scope.question2 = x;
        var selected = x - 1;

        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            if ($scope.starsQuestion2[i].id <= selected) {
                $scope.starsQuestion2[i].icon = 'ion-ios-star';
            }
        }
    }
````
Both loops are just for a resopnse to the user. The first one is for setting all stars to the outline mode, in case the user changes the rating for the question to a lower level, the second one is to replace all stars to the pressed one with filled ones. The current choice of the user is stored in a varible.

After pressing the submit button, the evaluation starts. The user's rating is sent to the server:
````javascript
serverAPI.insertNewRating($scope.openGames[$scope.counter].otherPlayerId, finalScore, $scope.openGames[$scope.counter].gameId, sendStayInTouch, function (data) {
...
}
````
Inside the callback a check regarding the next position in the player array is done. In case there is another player, the name will be updated, all stars will be set to their outline form. In case there is no remaining feedback, the player is redirected to the home tab. The counter of the other player will update automatically.

#Settings

Since there are different options the user can choose from there is a need for a settings tab, which allows to change the settings. The HTML-page consists of three toggle buttons (visible status, push notifications, load just one image - to enable a reduce of the used data amount) and two normal buttons (logout and delete account).

As soon as the user enters the settings tab, the controller loads the settings values from the local storage and stores them into variables. This is necessary to display the position of the toggle button in the correct way. E.g.:
````javascript
var visible = window.localStorage.getItem('visible');
...
if (visible == 'true') {
        $scope.visibleStatus = {
            mode: true
        };
    } else if (visible == 'false') {
        $scope.visibleStatus = {
            mode: false
        };
    }
````
Every toggle button has its own function, which is activated, if status changes. These functions consist mostly of a simple if-else-structure. Both have inverted meanings, since the toggle button represents simple true or false meanings. E.g.:
````javascript
if (visible == 'true') {
    visible = 'false';
    services.endBackgroundGps();
    serverAPI.changeModus(UID, 0, function (data) {
        console.log(data)
    });
    window.localStorage.setItem('visible', 'false');
} else {
    ...
    }
````

The buttons for the logout and the account deletion are similar. In the logout function the local storage is completly cleared and all root scope variables are deleted. A notice is sent to the server, to delete the stored credentials on the server. After that the user is redirected to the login screen.
In case the user wants to delete the account, a popup appears. If the user confirms the choice, the account is deleted on the server. After that the logout session is executed.