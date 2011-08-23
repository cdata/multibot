# Skypekit

This is a brief rundown of what I have learned setting up Skypekit.

## What is Skypekit?

Skype has a seemingly heavily buggy / deprecated python API that accesses a "public api," called Skype4Py. However, you can now sign up for a Skype developer program (it costs $10) and acquire a much more relevant SDK, as well as access to "headless" binary distributions of Skype for most platforms. This new SDK is known as Skypekit. It is very proprietary, and without question cannot be distributed with this application. That said, I will be using SkypeKit as my primary target for Damonbot development moving forward. Skype4Py will continue to be supported, but it should be understood that my development and testing will mostly happen through Skypekit. These instructions should help you get setup with Skypekit should you choose to shell out the $10 for a developer account.

## What do you need?

You will need to place the following things into this folder:

 - The Skypekit SDK
 - A Skypekit runtime for your platform
 - An application key for Skypekit

All three of these things can be obtained from Skype's developer website [here](https://developer.skype.com/).

When you have downloaded the SDK, extract it, change the folder name to "sdk" and place it in the <damonbot>/support/skypekit folder.

You must request a runtime for your platform. This usually takes about a day to be provided by Skype after you request it. Once you have received the tarball, extract it, find the Skype runtime binary within, rename it to "skype" and place it in the <damonbot>/support/skypekit folder.

You must request a development Application key from Skype. This will allow your headless runtime to work for up to sixty days. It's not ideal, but it's worth it for the sake of having a headless Skype instance. Once you have received this Application key, name it "key.pem" and place it in the <damonbot>/support/skypekit folder.

## Additional dependencies

Under 64-bit Ubuntu Server 11.04, I had to install the following 32-bit libraries through apt in order to get the Skypekit binary to run:

    sudo apt-get install lib32asound2 lib32bz2-1.0 lib32gcc1 lib32ncurses5 lib32ncursesw5 lib32stdc++6 lib32v4l-0 lib32z1 libasound2 libc6-i386 libpython2.7 libv4l-0

I have not setup a development environment natively on OSX yet. My hunch is that it is probably simpler than Ubuntu Linux, but if you try it and it isn't, I'd love to hear about your experience!

