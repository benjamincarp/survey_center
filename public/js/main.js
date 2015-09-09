requirejs.config({
    baseUrl: '/js/lib/',
    paths: {
        jquery: 'jquery-2.1.3',
        underscore: 'underscore',
        hogan: 'hogan-3.0.1'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        hogan: {
            exports: 'Hogan'
        }
    }
});

require(['/js/client.js'], function(){});