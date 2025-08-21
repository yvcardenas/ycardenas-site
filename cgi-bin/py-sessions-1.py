#!/usr/bin/python3
import os, uuid, json, sys
from urllib.parse import parse_qs
from http import cookies

print("Content-Type: text/html")
print("""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Python Sessions</title>
</head>
<body>
<h1>Python Sessions Page 1</h1>
<hr>""")

if sess.get("username"):
    print(f"<p><b>Name:</b> {sess['username']}</p>")

print("""
<a href="/cgi-bin/py-sessions-2.py">Session 2</a><br/>
<a href="/hw2/py-cgiform.html">Python CGI Form</a><br/>
<form style="margin-top:30px" action="/cgi-bin/py-destroy-session.py" method="get">
  <button type="submit">Destroy Session</button>
</form>
</body>
</html>""")