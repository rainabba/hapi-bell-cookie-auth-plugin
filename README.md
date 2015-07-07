hapi-bell-cookie-auth-plugin
========================

This project is intended to be a complete example for how to implement Bell and hapi-auth-cookie in Hapi 8 as a plugin that's configuration driven (the Hapi mantra), for multiple providers, against various paths.

I've been struggling with this implementation for over a year, but after upgrading a small project from Hapi 1.x to 8.x and by heavily referencing the following 2 projects, I was able to get this together. It's still not a COMPLETE implementation because it doesn't deal with creating new accounts, using multiple auth providers for the same account, etc, and that is what I hope to tackle next, but this should be enough to get someone going if they're reasonably competent with Node and have some understanding of Hapi.

The point of routes/authTesting.js was two-fold. One is to show how to actually use the plugin in this context and the other is so that index.js is very clean, allowing someone to really continue with this project without having to rip chunks out.

Thanks to:
- [hapi-auth-example by santbob](https://github.com/santbob/hapi-auth-example)
- [hapi-bell-twitter by adambrault](https://github.com/adambrault/hapi-bell-twitter-cookie)
- [hapi](http://hapijs.com)
- [bell](https://github.com/hapijs/bell)
- [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie)

### Setup

1. Go [configure a Twitter app](https://apps.twitter.com/app/new)

  - Make sure to check *Allow this application to be used to Sign in with Twitter*
  - It doesn't matter what you put in the callback URL.
  
2. Copy config.js.sample to Edit ``config.js`` then edit hapiBellCookieAuth.providers

  - Grab the *Consumer Key (API Key)* and set it as ``ClientId``
  - Grab the *Consumer Secret (API Secret)* and set it as ``ClientSecret``
  - NOTE: This config uses [confidence](https://github.com/hapijs/confidence) and will apply different configs based on env.ENVIRONMENT which is why you see each config block listed more than once. This way you can easily maintain configs for each BUT you still shouldn't inclue the config file in your source control. Ideally, in production you would deploy it and reference environment variables setup in your hosting (assuming you're using scalable hosting anyway.)
  
3. That's it!

### Run

``npm install`` then ``npm start``
