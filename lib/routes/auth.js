const
qs = require('querystring'),
request = require('request');

/**
 * POST /auth/logout
 *
 * Destroy the current session, thereby logging the user out.
 */
exports.logout = function authLogout(req, res) {
  req.session.destroy();
  res.send(200);
};

/**
 * POST /auth/login
 *
 * body params:      assertion
 *
 * The client is presenting an identity assertion for a user.  If the
 * assertion is valid, log the user in.
 */
exports.login = function authLogin(req, res) {
  verifyAssertion(req.body.assertion, function(err, result) {
    if (err) {
      console.error("ERROR: authLogin: " + err.stack);
      return res.send({status: "failure", reason: "Internal error"});
    }
    res.send(200, {result: result});
  });
};

/**
 * verifyAssertion
 *
 * Consult the persona verifier to determin whether an assertion is valid.
 * If it is, the verifier will return a blob of json like:
 *
 *     {"status":"okay",
 *      "email":"someone@somewhere.org",
 *      "audience":"yoursite.org",
 *      "expires":1354060533192,
 *      "issuer":"eyedee.me"}
 *
 * The email is the identity of the user trying to log in.
 * The audience should be the url of your site.
 * The expiry date is in milliseconds since the unix epoch.
 * The issuer is the identity provider who vouched for the identity.
 *
 * Some identity providers implement the browserid protocol (eyedee.me
 * is one).  For providers that do not implement browserid, Mozilla
 * Persona will be used as a fallback.  Persona sends a web link in an
 * email to the email the user has provided.  If the user can retrieve
 * his or her email and follow that link, then the user has given
 * proof of control over the identity and Persona will vouch for it by
 * signing the assertion.
 *
 * Note that we always verify assertions on the server side.  Never
 * do we do this in the client.
 */
function verifyAssertion(assertion, callback) {
  var body = qs.stringify({
    assertion: assertion,
    audience: process.env['PUBLIC_URL'] || '127.0.0.1'
  });

  var options = {
    uri: 'https://verifier.login.persona.org/verify',
    headers: {
     'content-type': 'application/x-www-form-urlencoded',
     'content-length': body.length
    },
    body: body
  };

  request.post(options, function requestComplete(err, res, body) {
    try {
      if (err) return callback(err);
      return callback(null, JSON.parse(body));
    } catch (err) {
      return callback(err);
    }
  });
};
