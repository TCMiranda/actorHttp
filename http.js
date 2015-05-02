'use strict';

var request = require('request');
var emitter = require('actor-emitter');
var namespace = 'request';

var onRequestResponse = function(cb, err, res, body) {

    if (err)
        emitter.next(onRequestError, err, res, body);
    else
        emitter.next(onValidateResponse, cb, err, res, body);
}

var onValidateResponse = function(cb, err, res, body) {

    let key = 'request:'
            + res.request.uri.host + ''
            + res.request.uri.path + ':'
            + res.statusCode ;

    if (res.statusCode != 200)
        emitter.next(onRequestError, err, res);

    else (cb && setTimeout(cb.bind(this, err, res, body), 0));

    console.log('<- ', key);
    emitter.trigger(key);
}

var onRequestError = function(err, res) {

    res = res || {};

    console.error(err, res.statusCode);
}

var onRequestedGet = function(cb, url) {

    url = typeof url == "string"
        ? url : cb ;

    console.log('-> ', 'request:' + url.split('://').pop());
    request.get(url, onRequestResponse.bind(this, cb));
}

emitter.bind('request:get', onRequestedGet);

module.exports = emitter;
