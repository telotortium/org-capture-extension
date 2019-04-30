#!/usr/bin/env python2

import json
import subprocess
import struct
import sys

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
