var events = require('events'),
    child = require('child_process');

exports.createAdapter = function(type, options) {

    var eventer = new events.EventEmitter(),
        adapter;

    switch(type) {
        case 'skype':

            adapter = child.spawn(
                'python',
                [path.join(__dirname, './skype.py', options.port)]
            );

            break;
        case 'skypekit':

            adapter = child.spawn(
                'python',
                [path.join(__dirname, './skypekit.py', options.account, options.secret, options.port)]
            );

            break;
        default
            break;
    }

    adapter.stdout.on(
        'data',
        function(data) {

            console.log(data.toString());
        }
    );

    adapter.stderr.on(
        'data',
        function(data) {

            console.log(data.toString());
        }
    );

    adapter.on(
        'exit',
        function() {

            log('Adapter has shut down!');
            eventer.emit('dead');
        }
    );

    return eventer;

}


