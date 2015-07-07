var Hapi = require('hapi'),
    Config = require("./config"),
    connection = Config.get('/server/connection'),
    hapiBellCookieAuthConfig = Config.get('/hapiBellCookieAuth'),
    hapiBellCookiePlugin = require('./plugins/hapiBellCookieAuth.js'),
    Plugins = [
        require('bell'),
        require('hapi-auth-cookie'),

        { // Create an object using the hapiBellCookiePlugin register function and config and include in the Plugins array to be provided with server.register call.
            register: hapiBellCookiePlugin.register,
            options: {
                providers: hapiBellCookieAuthConfig.providers,
                cacheExpires: hapiBellCookieAuthConfig.cacheExpires
            }
        }

    ],
    server = new Hapi.Server();

server.connection({
    host: connection.hostname,
    port: connection.port
});

server.register(Plugins, function(err) {

    if (err) { throw err; }

    //Routes to demonstrate basic implementation and for dev testing. Don't include in production
    server.route( require('./routes/authTesting.js')( { hapiBellCookiePlugin: hapiBellCookiePlugin } ) );

    server.start(function(err) {
        console.log('Server started at:', server.info.uri);
    });
});
