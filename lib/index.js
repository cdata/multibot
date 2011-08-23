var skype = require('./bridge'),
    log = require('./log'),
    bot = require('./bot');

exports.run = function() {

    var bridge = skype.createBridge(),
        damon = bot.createBot();

    bridge.on(
        'message',
        function(message) {

            log('Received message from ' + message.data.sender.name + ': "' + message.data.body + '"');
            if(message.data.body.match(/^damonbot/i))
                damon.parse(message);
        }
    );

};
