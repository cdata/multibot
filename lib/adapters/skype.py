#!/usr/bin/env python

import Skype4Py
import websocket
import json
import sys

port = argv[1]

def log(message):
    sys.stdout.write('[ PYTHON ] ' + message + '\n');
    sys.stdout.flush();

class SkypeBridge:

    def __init__(self):
        log('Initializing Skype bridge..');

        self.skype = Skype4Py.Skype()
        self.connect()

    def connect(self):
        try:
            socket = websocket.WebSocketApp("ws://localhost:1337", on_message = self.receiveBridgeMessage, on_error = self.socketError, on_close = self.socketClose)
        except:
            log("Failed to make websocket connection!")
            raise

        self.socket = socket

        socket.on_open = self.socketOpen
        socket.run_forever()

    def socketError(self, socket, error):
        log(error)

    def socketOpen(self, socket):
        
        log("Bridge connected!")
        self.skype.OnMessageStatus = self.receiveSkypeMessage
        self.skype.Attach()
        log("Skype client attached!")

    def socketClose(self, socket):
        log("Bridge closed!")

    def receiveSkypeMessage(self, message, status):

        if message.Sender != self.skype.CurrentUser:
            self.sendBridgeMessage({"text" : message.Body, "chat" : { "id" : message.ChatName, "userCount" : message.Chat.Members.__len__(), "private" : message.Chat.Members.__len__() <= 1 }, "sender" : { "id" : message.Sender.Handle, "name" : message.Sender.FullName }})

    def sendSkypeMessage(self, chatName, message):

        log("Sending message to Skype chat " + chatName)

        self.lookupChat(chatName).SendMessage(message)

    def receiveBridgeMessage(self, socket, message):

        log("Handling message received from bridge.");

        def handleData(message):
            self.sendSkypeMessage(message['chatName'], message['body'])
            
        json.loads(message, object_hook=handleData)

    def sendBridgeMessage(self, message):

        self.socket.send(json.dumps(message))

    def lookupChat(self, chatName):

        for chat in self.skype.Chats:
            if chat.Name == chatName:
                return chat

bridge = SkypeBridge()

