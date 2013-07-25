const
app = require('./lib/server'),
http = require('http');

// getting express and socket.io to play together
var httpServer = app.server.listen(app.server.get('port'));
require('./lib/sockets')(httpServer, app.store);

console.log("Express server listening on port " + app.server.get('port'));
