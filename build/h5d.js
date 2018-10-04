const webminify = require('webminify');


webminify()
    .load('src', [

        'base/oo.js',
        'base/stream.js',

        'web/http.js',

        'renderer/renderer.js',
        'renderer/calendar.js',

        'control/control.js',
        'control/calendar.js',
        'control/date.js'
    ])
    .combine('\r\n\r\n\r\n\r\n\r\n')
    .compressjs()
    .output('js/flyingon-min.js');
