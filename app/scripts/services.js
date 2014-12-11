'use strict'
var services = angular.module('services', [])




//Create a hitsotry of Events to see the recent Events

services.factory('localStorageService', function () {
    return {
        addEvent: function (event) {


            //Init some Data 
            var data1 = {
                "id": "file1",
                "value": "File1",
                "popup": "sdds1"
            }
            var data2 = {
                "id": "file1",
                "value": "File1",
                "popup": "sdds1"
            }
            var history = [JSON.stringify(data1), JSON.stringify(data2)];
            localStorage.setItem('history', (history.toString()));

            //End init

            //Pull the history of local storage
            var history = localStorage.getItem('history');
            var historyTmp = [JSON.stringify(event)];

            //Update the history, so the newest entry at the beginning.
            if (history.length > 1) {
                history = historyTmp + ',' + history;
            } else {
                history = historyTmp;
            }


            //Save new history to local storage
            localStorage.setItem('history', history);
        },

        getHistory: function () {
            var history = localStorage.getItem('history').split('},');
            //Add ending bracket, which was deltedt by the split above to make it suitable to an JSON object again.
            for (var i = 0; i < history.length; i++) {
                history[i] = history[i] + '}';
            };
            return history;
        }

    }
});



/*  var lala = localStorage.getItem('events');
  if (lala == null) {
      console.log("null");
  }

  var i = 3;


  var sddsd + i = localStorage.getItem('sdsdsd');
  if (sddsd == null) {
      console.log("null")
  }

   //Pull the history
  var history = widow.localStorage.getItem('events');

  var neu = {
      "id": "file2",
      "value": "File2",
      "popup": "sdds2"
  };

  neu
  var updatedHistory = neu;
  updatedHistory.push()*/



/*overwrite the localStorage with the newest Event added in 
                the begining */
//            var eventUpdatet = newEvent;
//            eventUpdatet.push(events);
//            localStorage.setItem('events', JSON.stringify(eventUpdated));

//        },

/*getEvents: function () {
            return JSON.parse(localStorage.getItem('events'));
        }*/
//    }
//
//    return 1;