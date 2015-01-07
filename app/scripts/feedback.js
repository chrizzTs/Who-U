angular.module('feedback', ['serverAPI'])

.controller('feedbackCtrl', function ($scope, cssInjector) {

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

    $scope.starsQuestion2 = [
        {
            id: 0,
            action: 'rateQuestion2(1)',
            icon: 'icon ion-android-star'
        }, {
            id: 1,
            action: 'rateQuestion2(2)',
            icon: 'icon ion-android-star'
        }, {
            id: 2,
            action: 'rateQuestion2(3)',
            icon: 'icon ion-android-star'
        }, {
            id: 3,
            action: 'rateQuestion2(4)',
            icon: 'icon ion-android-star'
        }, {
            id: 4,
            action: 'rateQuestion2(5)',
            icon: 'icon ion-android-star'
        }]

    $scope.starsQuestion3 = [
        {
            id: 0,
            action: 'rateQuestion3(1)',
            icon: 'icon ion-android-star'
        }, {
            id: 1,
            action: 'rateQuestion3(2)',
            icon: 'icon ion-android-star'
        }, {
            id: 2,
            action: 'rateQuestion3(3)',
            icon: 'icon ion-android-star'
        }, {
            id: 3,
            action: 'rateQuestion3(4)',
            icon: 'icon ion-android-star'
        }, {
            id: 4,
            action: 'rateQuestion3(5)',
            icon: 'icon ion-android-star'
        }]

    $scope.contacted = function () {
        $scope.showChoice = false;
        $scope.showForm = true;
        $scope.question1 = true;
    }

    $scope.notContacted = function () {
        console.log("No contact");
        window.location = "#/tab/home";
    }

    $scope.rateQuestion2 = function (x) {
        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            $scope.starsQuestion2[i].icon = 'ion-android-star';
        }

        $scope.question2 = x;
        var selected = x - 1;
        console.log($scope.question2);

        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            if ($scope.starsQuestion2[i].id <= selected) {
                $scope.starsQuestion2[i].icon = 'ion-asterisk';
            }
        }
    }

    $scope.rateQuestion3 = function (x) {
        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            $scope.starsQuestion3[i].icon = 'ion-android-star';
        }

        $scope.question3 = x;
        var selected = x - 1;
        console.log($scope.question3);

        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            if ($scope.starsQuestion3[i].id <= selected) {
                $scope.starsQuestion3[i].icon = 'ion-asterisk'
            }
        }
    }

    $scope.enableSubmit = function () {
        if ($scope.question2 == 0 || $scope.question3 == 0) {
            return true;
        }
    }

    $scope.evaluate = function () {
        var scoreQuestion1 = 5;
        var scoreQuestion2 = parseInt($scope.question2);
        var scoreQuestion3 = parseInt($scope.question3);
        var finalScore = scoreQuestion1 + scoreQuestion2 + scoreQuestion3;
        console.log(finalScore);

        serverAPI.insertNewRating(ratedUID, finalScore, function (data) {
            console.log(data);
        });
    }
})