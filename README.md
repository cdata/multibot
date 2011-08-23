# DamonBot

I'm a fanboy when it comes to Github's work culture. After reading [this blog post](http://zachholman.com/posts/why-github-hacks-on-side-projects/) by Zach Holman, I wanted my company to have a cool chat bot that people could easily hack on. However, one major obstacle to this dream was that our company's de facto communication platform is Skype, which isn't the most hackable platform to be found on the interwebs. As it turns out, there used to be an officially supported Python library for controlling Skype clients, and this library still works on the Skype client that installs through Ubuntu 11.04's Apt repository, so I wrote a small bridge library that uses WebSockets as a transport, and started building a chat bot in NodeJS. Behold, my creation is alive!

## Dependencies

### Skypekit Adapter

See support/skypekit/ABOUT-SKYPEKIT.md

### Skype Adapter

Python dependencies:

 - websocket-client
 - Skype4Py

NodeJS dependencies

 - websocket-server

Skype4Py appears to be a fairly obsolete / deprecated library. It definitely does not work on the latest Skype client in OSX, and it hasn't been tested in Windows. However, it appears to (mostly) work on Skype 2.2.0.35 as installed through Ubuntu 11.04's Apt repository.

## Project goals

Skype is obviously not a great target platform for fun side-projects, and Skype4Py's days as a functional library are almost certainly numbered. Using WebSockets as a transport mechanism over suitable "bridge" libraries that adapt the bot to various chat platforms should, in theory, allow the bot to be built in a platform agnostic way. It is my hope that even as Skype4Py dissolves into oblivion, or as my company abandon's Skype as a communication platform (oh please, let it be so!), that DamonBot will be transferred to new communication platforms with little effort and no modification of core functionality.

## About the name

This bot is called DamonBot after Damon, who is the tireless head of customer support and our awesome community manager at CloudFlare. The bot's personality is, to a limited extent, modeled in his image.
