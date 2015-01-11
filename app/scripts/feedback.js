angular.module('feedback', ['serverAPI'])

.controller('feedbackCtrl', function ($scope, cssInjector, serverAPI) {

    cssInjector.add('styles/feedback.css');

    //Counter for counting in array with not yet rated games
    $scope.counter = 0;
    var stayInTouch = 'true';

    $scope.UID = JSON.parse(window.localStorage.getItem('Credentials')).UID;

    $scope.showChoice = true;
    $scope.question1;
    $scope.question2 = 0;
    $scope.question3 = 0;

    $scope.openGames = [];
    serverAPI.getGamesToRate($scope.UID, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            $scope.openGames[i] = data[i];
        }

        serverAPI.getUserData($scope.openGames[$scope.counter].otherPlayerId, function (data) {
            $scope.ratedName = data.userName;
        });
    });

    //Doesn't work for now...why?!?
    if (stayInTouch == 'true') {
        $scope.userChoiceContact = {
            mode: true
        };
    } else {
        $scope.userChoiceContact = {
            mode: false
        };
    }

    $scope.starsQuestion2 = [
        {
            id: 0,
            action: 'rateQuestion2(1)',
            icon: 'ios7-star-outline'
       }, {
            id: 1,
            action: 'rateQuestion2(2)',
            icon: 'ios7-star-outline'
       }, {
            id: 2,
            action: 'rateQuestion2(3)',
            icon: 'ios7-star-outline'
       }, {
            id: 3,
            action: 'rateQuestion2(4)',
            icon: 'ios7-star-outline'
       }, {
            id: 4,
            action: 'rateQuestion2(5)',
            icon: 'ios7-star-outline'
       }]

    $scope.starsQuestion3 = [
        {
            id: 0,
            action: 'rateQuestion3(1)',
            icon: 'ios7-star-outline'
       }, {
            id: 1,
            action: 'rateQuestion3(2)',
            icon: 'ios7-star-outline'
       }, {
            id: 2,
            action: 'rateQuestion3(3)',
            icon: 'ios7-star-outline'
       }, {
            id: 3,
            action: 'rateQuestion3(4)',
            icon: 'ios7-star-outline'
       }, {
            id: 4,
            action: 'rateQuestion3(5)',
            icon: 'ios7-star-outline'
       }]

    $scope.contacted = function () {
        $scope.showChoice = false;
        $scope.showForm = true;
        $scope.question1 = true;
    }

    $scope.notContacted = function () {
        serverAPI.insertNewRating($scope.openGames[$scope.counter].otherPlayerId, 0, $scope.openGames[$scope.counter].gameId, function (data) {
            console.log('Insert new rating:' + data);
        });

        console.log("No contact");
        window.location = "#/tab/home";
    }

    $scope.rateQuestion2 = function (x) {
        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            $scope.starsQuestion2[i].icon = 'ios7-star-outline';
        }

        $scope.question2 = x;
        var selected = x - 1;
        console.log($scope.question2);

        for (var i = 0; i < $scope.starsQuestion2.length; i++) {
            if ($scope.starsQuestion2[i].id <= selected) {
                $scope.starsQuestion2[i].icon = 'ios7-star';
            }
        }
    }

    $scope.rateQuestion3 = function (x) {
        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            $scope.starsQuestion3[i].icon = 'ios7-star-outline';
        }

        $scope.question3 = x;
        var selected = x - 1;
        console.log($scope.question3);

        for (var i = 0; i < $scope.starsQuestion3.length; i++) {
            if ($scope.starsQuestion3[i].id <= selected) {
                $scope.starsQuestion3[i].icon = 'ios7-star'
            }
        }
    }

    $scope.enableSubmit = function () {
        if ($scope.question2 == 0 || $scope.question3 == 0) {
            return true;
        }
    }

    $scope.changeUserChoiceContact = function () {
        if (stayInTouch == 'true') {
            console.log('user hat keinen Bock auf dich');
            stayInTouch = 'false';
        } else {
            console.log('user steht auf dich');
            stayInTouch = 'true';
        }

    }

    $scope.evaluate = function () {
        var scoreQuestion1 = 5;
        var scoreQuestion2 = parseInt($scope.question2);
        var scoreQuestion3 = parseInt($scope.question3);
        var finalScore = scoreQuestion1 + scoreQuestion2 + scoreQuestion3;
        console.log(finalScore);

        serverAPI.insertNewRating($scope.openGames[$scope.counter].otherPlayerId, finalScore, $scope.openGames[$scope.counter].gameId, function (data) {
            console.log('Insert new rating: ' + data);

            $scope.counter++;
            if ($scope.counter < $scope.openGames.length) {
                console.log($scope.counter);
            } else {
                window.location = "#/tab/home";
            }
        });
    }
})