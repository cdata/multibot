var skype = require('./bridge'),
    log = require('./log');

exports.run = function() {

    var bridge = skype.createBridge();

    bridge.on(
        'message',
        function(message) {

            log('Received message from ' + message.sender.name + ': "' + message.body + '"');
            if(message.body.match(/^damonbot/i))
                message.respond("You made a sound at me, " + message.sender.name + "!");
        }
    );

};
