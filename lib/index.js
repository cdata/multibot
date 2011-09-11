var log = require('./log'),
    bridge = require('./bridge');

exports = module.exports = function() {

    var interface = bridge.createBridge(),
        handlers = [],
        bot = {};

    for(var index = 0; index < arguments.length; index++)
        handlers.push(arguments[index](bot));

    interface.on(
        'message',
        function(message) {

            (function(index) {
                
                var next = arguments.callee;

                if(index < handlers.length)
                    handlers[index](message, function() { next(index + 1); });
            })(0);
        }
    );
};
