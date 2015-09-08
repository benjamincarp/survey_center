requirejs.config({
    baseUrl: '/js',
    paths: {
        jquery: 'lib/jquery-2.1.3',
        underscore: 'lib/underscore'
    },
    shim: {
        underscore: {
            exports: '_'
        }
    }
});

require(['/js/client.js'], function(){});