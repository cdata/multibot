var events = require('events');

function createCLI(prefix) {

    var eventer = new events.EventEmitter(),
        prompt = function() {
            
            process.stdout.write(prefix + ' ');
        };

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on(
        'data', 
        function(chunk) {

            eventer.emit('input', chunk);
            prompt();
        }
    );

    prompt();

    return eventer;
}

exports.createCLI = createCLI;


