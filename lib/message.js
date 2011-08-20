var Message = function(bridge, raw) {

    this.bridge = bridge;
    this.raw = JSON.parse(raw);

    for(var i in this.raw)
        this[i] = this.raw[i];
};

Message.prototype.respond = function(body) {

    var response = {
            chatName: this.chatName,
            body: body
        };

    this.bridge.send(response);
};

exports = module.exports = Message;
