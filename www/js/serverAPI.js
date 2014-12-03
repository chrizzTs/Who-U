//Error codes:
//9999 --> Not implemented
const http = require('http')
const querystring = require('querystring')
const request = require('request')
const host = 'http://localhost'
const port = 12345
const newUserPath = '/api/newUser'

var post_options

function createNewUser(username, password, mail) {
    var user = {
        'username': username,
        'password': password
    }

    request.post(host + ':' + port + newUserPath, {
        form: user
    }, function (err, response, body) {
        if (err) console.error
        console.log(body)
    })
    return -9999;
}

function loginWithUsername(username, password) {
    var user = {
        'username': username,
        'password': password
    }
    return -9999;
}

function loginWithSessionKey(username, sessionkey) {
    var user = {
        'username': username,
        'sessionkey': sessionkey
    }
    return -9999;
}

function searchPartnerToPlayWith(long, lat, userId) {
    var searchRequest = {
        'userId' = userId,
            'longitude' = long,
            'latitude' = lat
    }
    return -9999;
}