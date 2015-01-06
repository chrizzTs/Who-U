angular.module('feedback', ['serverAPI'])

.controller('feedbackCtrl', function ($scope, cssInjector) {

    cssInjector.add('styles/feedback.css');

    console.log("Angebunden");

    $scope.UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;
    //Communicated from server
    $scope.ratedUID = 123456789;
    //Dummy name due the lack of internet connection
    $scope.ratedName = "Hansi";
    //$scope.ratedCoins=?;

    $scope.showChoice = true;
    $scope.question1;
    $scope.question2 = 0;
    $scope.question3 = 0;
    $scope.formData = {};

    //REAL IMPLEMENTATION BELOW:
    //serverAPI.getUserData(UID, function (data) {
    //$scope.ratedName = data.userName;
    //$scope.ratedFotoId = data.fotoId;
    //console.log(data);
    //});

    $scope.checkForm = function () {
        if (formData.question2 == 0 && formData.question3 == 0) {
            return true;
        }
    }

    $scope.contacted = function () {
        $scope.showChoice = false;
        $scope.showForm = true;
        $scope.question1 = true;
    }

    $scope.notContacted = function () {
        console.log("No contact");
        window.location = "#/tab/home";
    }

    $scope.submit = function (x, y) {
        $scope.question2 = x;
        $scope.question3 = y;

        var scoreQuestion1 = 5;
        var scoreQuestion2 = parseInt($scope.question2);
        var scoreQuestion3 = parseInt($scope.question3);
        var finalScore = scoreQuestion1 + scoreQuestion2 + scoreQuestion3;
        console.log(finalScore);

        //serverAPI.insertNewRating(UID, finalScore);
    }
})