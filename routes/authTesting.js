module.exports = function( options ) {
    var hapiBellCookiePlugin = options.hapiBellCookiePlugin,
        nav = '<nav><a href="/">Home</a> <a href="/session">Session</a> <a href="/hi">Hi</a> <a href="/logout">Log out</a></nav>';
    
  return  [
    {
        method: ['GET', 'POST'],
        path: '/signin-twitter',
        config: {
            auth: {
                strategy: 'twitter',
                mode: 'try'
            },
            handler: hapiBellCookiePlugin.doAuth
        }
    }, {
        method: ['GET'],
        path: '/logout',
        config: {
            auth: 'session',
            handler: function(request, reply) {
                request.auth.session.clear();
                return reply.redirect('/');
            }
        }
    }, {
        method: 'GET',
        path: '/',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    var profile = request.auth.credentials
                    reply(nav + '<h1>Hello, ' + profile.fullName + '</h1><p>Here\'s a nice picture of you I found:</p><img src="' + profile.avatar + '"/>')
                } else {
                    reply(nav + '<h1>Hello</h1><p><a href="/signin-twitter"><img src="https://g.twimg.com/dev/sites/default/files/images_documentation/sign-in-with-twitter-gray.png" alt="Sign in with Twitter"></a></p>')
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/session',
        config: {
            auth: {
                strategy: 'session',
                mode: 'try'
            },
            handler: function(request, reply) {
                if (request.auth.isAuthenticated) {
                    reply(nav + '<h1>Session</h1><pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
                } else {
                    reply(nav + '<h1>Session</h1>' + '<pre>' + JSON.stringify(request.auth.session, null, 4) + '</pre>' + '<p>You should <a href="/signin-twitter">log in</a>.</p>')
                }

            }
        }
    },
    {
        method: 'GET',
        path: '/hi',
        config: {
            auth: false,
            handler: function(request, reply) {
                reply(nav + '<h1>Hi, no auth required here</h1>')
            }
        }
    }
    ];
}