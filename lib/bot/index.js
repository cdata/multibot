var log = require('./log');

var funny = [
        'Chris is infesting something. It might be my brain.',
        'Watch out or I\'ll be evil and include a hashtag.',
        'Tremble before Darth Damon (bot)!',
        'This isn\'t the first time people have treated me like a bot..'
    ],
    general = [
        'How\'s it going, $1',
        'People get on my nerves sometimes.',
        'I\'d love to talk but.. oh, look! A customer support request! brb.',
        '$1, I wish I had a knickle for every time I\'ve heard that one.'
    ];

function parseMessage(message) {

    var concluded = false;

    if(message.body.indexOf('joke') !== -1 || message.body.indexOf('funny') !== -1) {
        message.respond(funny[Math.floor(Math.random() * 4)]);
        concluded = true;
    }

    if(!concluded) {
        if(message.body.indexOf('?') !== -1)
            message.respond("Sorry, " + message.sender.name + ", but I'm not smart enough to know how to help you yet. Help make me smarter by forking me at http://github.com/cdata/damonbot!");
        else
            message.respond(general[Math.floor(Math.random() * 4)].replace('$1', message.sender.name));
    }
}

exports.createBot = function() {

    return {

        parse: function(message) {

            parseMessage(message);
        }
    }
};