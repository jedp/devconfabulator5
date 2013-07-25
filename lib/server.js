const
config = require('./config'),
helmet = require('helmet'),
express = require('express'),
path = require('path'),
routes = require('./routes'),
sockets = require('./sockets');

var app = module.exports.server = express();

var sessionStore = module.exports.store = new express.session.MemoryStore();

/*
helmet.csp.policy({
  defaultPolicy: {
    'default-src': ["'self'"],
    'frame-src': ["'self'", "https://login.persona.org"],
    'script-src': ["'self'", "https://login.persona.org"]
  }
});
*/

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
  app.use(express.csrf());
//  app.use(helmet.csp());
  app.use(helmet.xframe());
  app.use(helmet.contentTypeOptions());

  app.use(app.router);
});

// Our own middleware to inject the csrf token into each request
// as a variable called 'csrf_token'.
function csrf(req, res, next) {
  res.locals.csrf_token = req.session._csrf;
  next();
}

// Routes for the paths we serve
app.get('/', csrf, routes.index);
