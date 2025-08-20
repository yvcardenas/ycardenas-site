#!/usr/bin/python3
import os, json, datetime
print("Content-Type: application/json")
print()

ip = (os.environ.get("HTTP_X_FORWARDED_FOR", '').split(",")[0].strip()
      or os.environ.get("REMOTE_ADDR", "unknown"))

data = {
    "message" : "Hello World from Python!",
    "date" : datetime.datetime.now().isoformat(),
    "ip_address" : ip
}
print(json.dumps(data))