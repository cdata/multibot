#!/usr/bin/env python

import websocket
import json
import sys
import os

def log(message):
    sys.stdout.write(message + '\n');
    sys.stdout.flush();

sys.path.append('/home/chris/repositories/damonbot/support/skypekit/sdk/ipc/python')
sys.path.append('/home/chris/repositories/damonbot/support/skypekit/sdk/interfaces/skype/python')

import skypekit
import SkyLib

account = sys.argv[1]
secret = sys.argv[2]
port = sys.argv[3]

class SkypekitBridge:

    def __init__(self):

        log('Initializing Skypekit bridge..')
        self.connect()

    def connect(self):
        try:
            socket = websocket.WebSocketApp("ws://localhost:" + port, on_message = self.receiveBridgeMessage, on_error = self.socketError, on_close = self.socketClose)
        except:
            log("Failed to make websocket connection!")
            raise

        self.socket = socket
        socket.on_open = self.socketOpen
        socket.run_forever()

    def socketError(self, socket, error):
        log(error)

    def socketClose(self, socket):
        log("Websocket connection closed!")

    def socketOpen(self, socket):
        log("Bridge connected!")

        bridge = self

        try:
            SkyLib.SkyLib.OnMessage = self.receiveSkypeMessage
        except Exception as err:
            log("Failed to access SkyLib: " + err.__str__())

        try:
            self.Skype = SkyLib.GetSkyLib(os.path.abspath('./support/skypekit/key.pem'))
        except Exception:
            log("Failed to create Skypekit instance!")
            raise

        def accountChange(self, propertyName):
            if propertyName == 'status':
                if self.status == 'LOGGED_IN':
                    bridge.loggedIn = True
                    log("Skypekit is logged in to Skype..")


        SkyLib.Account.OnPropertyChange = accountChange

        self.account = self.Skype.GetAccount(account)

        log("Logging into Skype account " + account + "..")

        self.account.LoginWithPassword(secret, False, False)

    def receiveSkypeMessage(self, message, changesInboxTimestamp, supersedesHistoryMessage, conversation):

        if message.author != account:

            userCount = len(conversation.GetParticipants())
            self.sendBridgeMessage({ "body" : message.body_xml, "date" : message.timestamp, "chat" : { "id" : conversation.identity, "userCount" : userCount, "private" : userCount <= 1 }, "sender" : { "id" : message.author, "name" : message.author_displayname }})

    def sendSkypeMessage(self, chatName, message):
        log("Sending message via Skypekit bridge to chat with ID " + chatName)
        SkyLib.SkyLib.GetConversationByIdentity(self.Skype, chatName).PostText(message)

    def receiveBridgeMessage(self, socket, message):

        log("Handling message received from bridge: " + message)

        try:
            data = json.loads(message)
            self.sendSkypeMessage(data['chat']['id'], data['body'])
        except Exception as err:
            log("Failed to parse data received from node: " + err.__str__())


    def sendBridgeMessage(self, message):

        self.socket.send(json.dumps(message))

bridge = SkypekitBridge()
