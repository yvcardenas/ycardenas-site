#!/usr/bin/python3
import os, datetime
print("Content-Type: text/html")
print()

ip = (os.environ.get("HTTP_X_FORWARDED_FOR", '').split(",")[0].strip()
    or os.environ.get("REMOTE_ADDR", "unknown"))
now = datetime.datetime.now().isoformat()

print(f"""
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello Python World</title>
      </head>
      <body>
          <h1>Hello Python World!</h1>
          <hr>
          <p>Hello World</p>
          <p>This page was generated with the Pythong programming language.</p>
          <p>This program was run at: {now}</p>
          <p>Your current IP address is {ip}</p>
      </body>
      </html>
      """)