var events = require('events'),
    child = require('child_process'),
    path = require('path'),
    log = require('../log'),
    cli = require('./cli');

function watch(name, process) {

    function watchLog(data) {

        console.log('[ ' + name.toUpperCase() + ' ] ' + data.toString().replace(/\n$/, ''));
    }

    process.stdout.on(
        'data',
        function(data) {

            watchLog(data);
        }
    );

    process.stderr.on(
        'data',
        function(data) {

            watchLog(data);
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
        case 'repl':

            (function() {

                var repl = cli.createCLI('[ YOU ]');

                repl.on(
                    'input',
                    function(message) {

                        eventer.emit(
                            'message', 
                            {
                                body: message,
                                sender: {
                                    name: "my subconscious",
                                    handle: "subconscious"
                                },
                                chat: {
                                    id: "repl",
                                    private: true,
                                    userCount: 2
                                }
                            }
                        );
                    }
                );

            })()
            
            break;
        case 'skype':

            (function() {

                var adapter = child.spawn(
                    'python',
                    [path.resolve(__dirname, './skype.py'), options.port]
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
                            path.resolve(__dirname, '../../support/skypekit/skype')
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

                        if(!adapter)
                            process.nextTick(
                                function() {

                                    adapter = child.spawn(
                                        'python',
                                        [path.resolve(__dirname, './skypekit-bridge.py'), options.account, options.secret, options.port]
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


