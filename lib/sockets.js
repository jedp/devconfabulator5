const
config = require('./config'),
cookie = require('cookie'),
parseSignedCookie = require('connect').utils.parseSignedCookie,
validator = require('validator');

module.exports = function(server, sessionStore) {
  this.io = require('socket.io').listen(server);

  io.set('authorization', function(handshake, callback) {
    if (handshake.headers.cookie) {
      var handshakeCookie = cookie.parse(handshake.headers.cookie);
      var sessionID = parseSignedCookie(handshakeCookie['blah'], config.secret);
      sessionStore.get(sessionID, function(err, session) {
        handshake.identity = handshake.address.port;
        callback(null, true);
      });
    } else {
      callback(null, false);
    }
  });

  io.sockets.on('connection', function(socket) {

    socket.emit('message', {from: socket.handshake.identity, text: "I like pie"});

    socket.on('message', function(data) {
      // sanitize data
      data = {
        type: validator.sanitize(data['type'] || '').escape(),
        from: validator.sanitize(data['from'] || '').escape(),
        text: validator.sanitize(data['text'] || '').escape(),
      };
      switch(data.type) {
        case 'nick':
          socket.handshake.identity = data.text;
          break;
        default:
          data.from = socket.handshake.identity;
          socket.emit('message', data);
          socket.broadcast.emit('message', data);
          break;
      }
    });

    socket.on('disconnect', function(data) {
      // pie
    });
  });
}

