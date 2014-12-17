'use strict'
var services = angular.module('services', [])


//Init the history array

var data2 = {
    "typ": "message",
    "from": "Max",
    "title": "Hallo neue Kontakt"
};

var data1 = {
    "typ": "played",
    "date": "04-21-2014",
    "person": "Tim Federmann"
};

var arrayData = {
    'array': [
            data1,
            data2
                ]
}

localStorage.setItem('history', JSON.stringify(arrayData));

//End init


//Create a hitsotry of Events to see the recent Events

services.factory('localStorageService', function () {
    return {
        addEvent: function (event) {


            //Pull the history of local storage
            var history = localStorage.getItem('history');
            if (history != null) {
                history = JSON.parse(history);
            } else {
                console.error("No local history saved");
            }

            var date = event.date.getDate();
            var month = event.date.getMonth() + 1;
            var year = event.date.getFullYear();

            event.date = month.toString() + '-' + date.toString() + '-' + year.toString();

            history.array.unshift(event);

            localStorage.setItem('history', JSON.stringify(history));

        },

        getHistory: function () {
            return JSON.parse(localStorage.getItem('history')).array;
        }

    }
});