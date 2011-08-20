#!/usr/bin/env python

import Skype4Py
import websocket
import json
import sys

skype = Skype4Py.Skype()
chatCache = {}

def log(message):
    sys.stdout.write('[ PYTHON ] ' + message)
    sys.stdout.flush()

def socketError(socket, error):
    log(error)

def socketOpen(socket):

    log("Socket connected!")

    skype.OnMessageStatus = parseSkypeMessage
    skype.Attach()

    log("Damonbot is listening attentively..")

def parseSkypeMessage(message, status):
    chatCache[message.ChatName] = message.Chat
    socketSend(json.dumps({"body": message.Body, "sender" : { "handle": message.Sender.Handle, "name": message.Sender.FullName }, "chatName": message.ChatName}))

def socketSend(message):
    socket.send(json.dumps(message))

def socketClose(socket):
    log("Socket closed!")

def socketMessage(socket, message):
    parsed = json.loads(message, object_hook=parseNodeMessage)

def parseNodeMessage(message):

    log("Handling a command from the server: ")

    #chatName = message.chatName
    #chat = chatCache[chatName]
    #chat.SendMessage(message.body)


try:
    socket = websocket.WebSocketApp("ws://localhost:1337", on_message = socketMessage, on_error = socketError, on_close = socketClose)
except:
    log("Failed to make websocket connection!")
    raise

socket.on_open = socketOpen
socket.run_forever()

