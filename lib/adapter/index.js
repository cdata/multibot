var events = require('events'),
    child = require('child_process'),
    path = require('path'),
    log = require('../log');

function watch(name, process) {

    function log(data) {

        console.log(data.toString().replace(/\n$/, ''));
    }

    process.stdout.on(
        'data',
        function(data) {

            log(data);
        }
    );

    process.stderr.on(
        'data',
        function(data) {

            log(data);
        }
    );

    process.on(
        'exit',
        function() {

            log('Process "' + name + '" has shut down!');
        }
    );

}

exports.createAdapter = function(type, options) {

    var eventer = new events.EventEmitter();

    switch(type) {

        default:
        case 'skype':

            (function() {

                var adapter = child.spawn(
                    'python',
                    [path.join(__dirname, './skype.py'), options.port]
                );

                adapter.on(
                    'exit',
                    function() {

                        eventer.emit('dead');
                    }
                );

                watch("Skype Bridge", adapter);
            })();

            break;
        case 'skypekit':

            (function() {

                var adapter;
                try {

                    var client = child.spawn(
                            path.join(process.cwd, './support/skypekit/skype')
                        );
                    
                } catch(e) {

                    log("Failed to launch client process for skypekit!");

                    throw e;
                }

                watch("Skypekit Client", client);

                client.on(
                    'exit',
                    function() {

                        eventer.emit('dead');

                        try {
                            adapter.kill();
                        } catch(e) {}
                    }
                );

                client.stderr.on(
                    'data',
                    function() {

                        process.nextTick(
                            function() {

                                adapter = child.spawn(
                                    'python',
                                    [path.join(__dirname, './skypekit.py'), options.account, options.secret, options.port]
                                );

                                watch("Skypekit Bridge", adapter);

                                adapter.on(
                                    'exit',
                                    function() {

                                        eventer.emit('dead');
                                    }
                                );
                            }
                        );
                    }
                );

            })();

            break;
    }

    return eventer;

}


