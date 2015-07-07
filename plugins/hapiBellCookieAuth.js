exports.register = function(server, options, next) {

    //app cache to store user information once logged in.
    var cache = server.cache({
        expiresIn: options.cacheExpires
    });

    server.app.cache = cache;

    //Bind the object to the server to be accessible in handlers
    server.bind({
        cache: server.app.cache
    });

    //Add Multiple strategies here and we have used confidence to pick up the configuration.
    for (var key in options.providers) {
        var provider = options.providers[key];

        if (provider.provider) {
            server.auth.strategy(provider.provider, 'bell', provider);
        } else {

            provider.validateFunc = function(request, session, callback) {

                cache.get(session.sid, function(err, cached) {

                    if (err) {
                        return callback(err, false);
                    }

                    if (!cached) {
                        return callback(null, false);
                    }

                    return callback(null, true, cached.account);
                });

            }

            server.auth.strategy('session', 'cookie', provider);

        }

    };

    next();
};


var setupProfile = {};

// setupProfile.default is the catch-all. As provider-specific customizations are needed, additional setupProfile handlers should be created and chained off of default
setupProfile.default = function( account ) {
    return {
            sid: account.provider + '::' + account.profile.id,
            token: account.token,
            secret: account.secret,
            userName: account.profile.username,
            avatar: account.profile.raw.profile_image_url.replace('_normal', ''),
            about: account.profile.raw.description,
            fullName: account.profile.displayName,
        };
}


exports.doAuth = function(request, reply) {
    var t = request.auth.credentials;

    if (t) {

        var profile = {};

        if ( setupProfile[t.provider] ) {
            profile = setupProfile[t.provider]( t );
        } else {
            profile = setupProfile.default( t );
        }

        request.server.app.cache.set(profile.sid, {
            account: profile
        }, 0, function(err) {
            if (err) {
                reply(err);
            }
            request.auth.session.clear();
            request.auth.session.set(profile);
        });

    } else {
        console.log('request.auth.credentials is null or doesn\'t exist');
    }

    return reply.redirect('/');

}


exports.register.attributes = {
    pkg: require("../package.json")
};