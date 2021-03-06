const
config = require('./config'),
express = require('express'),
path = require('path'),
routes = require('./routes'),
auth = require('./routes/auth'),
sockets = require('./sockets');

var app = module.exports.server = express();

var sessionStore = module.exports.store = new express.session.MemoryStore();

/*
 * express config
 */

app.configure(function() {
  app.set('port', config.port);
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, 'views')),
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.favicon());
  app.use(express.logger(config.mode));
  app.use(express.compress());
  app.use(express.errorHandler());
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Security and security headers
  app.use(express.cookieParser(config.secret));
  app.use(express.session({key: 'blah', store: sessionStore}));

  app.use(app.router);
});

// Routes for the paths we serve
app.get('/', routes.index);
app.post('/login', auth.login);
app.post('/logout', auth.logout);
