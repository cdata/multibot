var log = require('./log'),
    bridge = require('./bridge');

exports = module.exports = function() {

    var handlers = Array.prototype.slice.call(arguments),
        interface = bridge.createBridge();

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
