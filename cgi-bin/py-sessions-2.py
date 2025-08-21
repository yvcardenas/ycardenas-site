#!/usr/bin/python3
import os, json
from http import cookies

print("Content-Type: text/html\n")
print("""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Python Sessions</title>
</head>
<body>
<h1>Python Sessions 2</h1>
<hr>""")

if name:
    print(f"<p><b>Name:</b> {name}</p>")
print("""
<a href="/cgi-bin/py-sessions-1.py">Session 1</a><br/>
<a href="/hw2/py-cgiform.html">Python CGI Form</a><br/>
<form style="margin-top:30px" action="/cgi-bin/py-destroy-session.py" method="get">
  <button type="submit">Destroy Session</button>
</form>
</body>
</html>""")