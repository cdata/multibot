var websocket = require('websocket-server'),
    events = require('events'),
    child = require('child_process'),
    path = require('path'),
    Message = require('./message');

exports.createBridge = function() {

    var server = websocket.createServer(),
        eventer = new events.EventEmitter(),
        connectionId,
        python;

    server.addListener(
        "connection",
        function(connection) {

            console.log("Got a connection!");
            connectionId = connection.id;

            connection.addListener(
                "message",
                function(message) {

                    eventer.emit("message", new Message(
                        {
                            send: function(response) {
                                console.log("Sending this response: " + JSON.stringify(response));
                                server.send(connection.id, JSON.stringify(response));
                            }
                        }, 
                        JSON.parse(message)
                    ));
                }
            );
        }
    );

    server.listen(1337);

    python = child.spawn(
        'python',
        [path.join(__dirname, './bridge.py')]
    );

    python.stdout.on(
        'data',
        function(data) {

            console.log(data.toString());
        }
    );

    python.stderr.on(
        'data',
        function(data) {

            console.log(data.toString());
        }
    );

    python.on(
        'exit',
        function() {

            console.log('Bridge connection closed!');
            eventer.emit('dead');
        }
    );
    
    return eventer;
};

