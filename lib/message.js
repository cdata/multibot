var log = require('./log');

var Message = function(bridge, raw) {

    this.bridge = bridge;
    this.data = raw;
};

Message.prototype.respond = function(body) {

    var response = {
            chat: {
                id: this.data.chat.id
            },
            body: body,
            date: Date.now()
        };

    this.bridge.send(response);
};

exports = module.exports = Message;
