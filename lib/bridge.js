var websocket = require('websocket-server'),
    events = require('events'),
    child = require('child_process'),
    path = require('path'),
    log = require('./log'),
    Message = require('./message');

exports.createBridge = function() {

    var server = websocket.createServer(),
        eventer = new events.EventEmitter(),
        connectionId,
        python;

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
                                log("Sending this response: " + response);
                                server.send(connection.id, response);
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

            log('Python process exited!');
            eventer.emit('dead');
        }
    );
    
    return eventer;
};

