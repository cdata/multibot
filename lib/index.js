var skype = require('./bridge');

exports.run = function() {

    var bridge = skype.createBridge();

    bridge.on(
        'message',
        function(message) {

            console.log('Received message from ' + message.sender.name + ': "' + message.body + '"');
            if(message.body.match(/^damonbot/i))
                message.respond("You made a sound at me, " + message.sender.name + "!");
        }
    );

};
