#!/usr/bin/env python

import websocket
import json
import sys
import os

sys.path.append(os.path.abspath('./support/skypekit/sdk/ipc/python'))
sys.path.append(os.path.abspath('./support/skypekit/sdk/interfaces/skype/python'))

try:
    import SkyLib
except ImportError:
    raise SystemExit('Program requires SkyLib and skypekit modules')

account = sys.argv[1]
secret = sys.argv[2]
port = sys.argv[3]


def log(message)
    sys.stdout.write('[ SKYPEKIT ] ' + message + '\n');
    sys.stdout.flush();

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

    def skypeAccountChange(self, propertyName):

    def socketError(self, socket, error):
        log(error)

    def socketOpen(self, socket):
        log("Bridge connected!")

        bridge = self

        SkyLib.SkyLib.OnMessage = self.receiveSkypeMessage

        try:
            self.Skype = SkyLib.GetSkyLib(os.path.abspath('./support/skypekit/key.pem'))
        except Exception:
            log("Failed to create Skypekit instance!")
            raise

        def accountChange(self, propertyName):
            if propertyName == 'status':
                if(self.status == 'LOGGED_IN':
                    bridge.loggedIn = True
                    log("Skypekit is logged in to Skype..")


        SkyLib.Account.OnPropertyChange = accountChange

        self.account = self.Skype.GetAccount(account)

        log("Logging into Skype account " + account + "..")

        self.account.LoginWithPassword(secret, False, False)

    def receiveSkypeMessage(self, message, changesInboxTimestamp, supersedesHistoryMessage, conversation):

        if message.author != accountName:

            userCount = len(conversation.GetParticipants())
            self.sendBridgeMessage({ "body" : message.body_xml, "date" : message.timestamp, "chat" : { "id" : message.convo_id, "userCount" : userCount, "private" : userCount <= 1 }, "sender" { "id" : message.author, "name" : message.author_displayname }})

    def sendSkypeMessage(self, chatName, message):
        log("Sending message via Skypekit bridge to chat with ID " + chatName)
        SkyLib.GetConversationByIdentity(chatName).PostText(message)

    def receiveBridgeMessage(self, socket, message):

        log("Handling message received from bridge.")

        def handleData(message)
            self.sendSkypeMessage(message['chat']['id'], message['text'])

        json.loads(message, object_hook=handleData)

    def sendBridgeMessage(self, message):

        self.socket.send(json.dumps(message))
