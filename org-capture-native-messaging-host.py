#!/usr/bin/env python2

import json
import subprocess
import struct
import sys
import logging, logging.handlers
import os

class LoggerWriter:
    def __init__(self, logger, level):
        self.logger = logger
        self.level = level

    def write(self, message):
        if message != '\n':
            self.logger.log(self.level, message)

NAME = 'org-capture-native-messaging-host'
logger = logging.getLogger(NAME)

if os.uname()[0] == 'Darwin':
    address = '/var/run/syslog'
else:
    address = '/dev/log'
logger.addHandler(logging.handlers.SysLogHandler(address))
sys.stderr = LoggerWriter(logger, logging.INFO)

try:
    while True:
        msglen_field = sys.stdin.read(4)
        if msglen_field == '':
            # End of file
            sys.exit(0)
        msglen = struct.unpack("=I", msglen_field)[0]
        msg = json.loads(sys.stdin.read(msglen))
        subprocess.call([msg['emacsclientLocation'], msg['uri']])
        reply = '{}'  # JSON reply - empty
        sys.stdout.write(struct.pack("=Is", len(reply), reply))
except BaseException:
    logger.exception("%s: Fatal error in main loop" % (NAME))
    raise e
