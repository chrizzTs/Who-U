function takePicture() {
    navigator.camera.getPicture(function(imageURI) {
        
    // imageURI is the URL of the image that we can use for
    // an <img> element or backgroundImage.

  }, function(err) {

    // Ruh-roh, something bad happened

  }, cameraOptions);
}