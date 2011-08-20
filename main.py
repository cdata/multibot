#!/usr/bin/env python
import Skype4Py

skype = Skype4Py.Skype()

skype.Client.Start()

skype.Attach()




#def main():
    #print 'foo'
    #skype = Skype4Py.Skype()
    #skype.OnMessageStatus = on_message
    #skype.Attach()

#def on_message(message, status):
    #if status == 'RECEIVED' or status == 'SENT':
        #print message

#main()
