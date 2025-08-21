#!/usr/bin/python3
import os, json
from http import cookies

SESSION_DIR = "/tmp/pycgi_sessions"
COOKIE_NAME = "PYSESSID"

# cookie -> sid
C = cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
sid = C[COOKIE_NAME].value if COOKIE_NAME in C else None

# load session
sess = {}
if sid:
    p = os.path.join(SESSION_DIR, f"{sid}.json")
    try:
        with open(p, "r") as f:
            sess = json.load(f)
    except Exception:
        pass

name = sess.get("username", "")

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
<a href="/cgi-bin/python-sessions-1.py">Session 1</a><br/>
<a href="/hw2/python-cgiform.html">Python CGI Form</a><br/>
<form style="margin-top:30px" action="/cgi-bin/python-destroy-session.py" method="get">
  <button type="submit">Destroy Session</button>
</form>
</body>
</html>""")