var websocket = require('websocket-server'),
    events = require('events'),
    child = require('child_process'),
    path = require('path'),
    argv = require('optimist').argv,
    log = require('./log'),
    Message = require('./message'),
    adapter = require('./adapter');

exports.createBridge = function() {

    var server = websocket.createServer(),
        eventer = new events.EventEmitter(),
        connectionId,
        bridge;

    server.addListener(
        "connection",
        function(connection) {

            log("Got a connection!");
            connectionId = connection.id;

            connection.addListener(
                "message",
                function(message) {

                    eventer.emit("message", new Message(
                        {
                            send: function(response) {

                                response = JSON.stringify(response);

                                log("Sending this message to client bridge: " + response);

                                server.send(connection.id, response);
                            }
                        }, 
                        JSON.parse(message)
                    ));
                }
            );
        }
    );

    server.listen(argv.port || 1337);

    if(argv.bridge) {

        bridge = adapter.createAdapter(argv.bridge, { account: argv.u, secret: argv.p, port: argv.port || 1337 });
        bridge.on('dead', function() { /* TODO: Attempt to restart.. */ });
        bridge.on('message', function(message) { 
            eventer.emit(
                'message', 
                new Message(
                    {
                        send: function(response) {

                            console.log(response.body);
                        }
                    },
                    message
                )
            )
        });
    }
    
    return eventer;
};

