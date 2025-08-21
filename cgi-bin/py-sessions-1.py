#!/usr/bin/python3
import os, uuid, json, sys
import cgi
from urllib.parse import parse_qs
from http import cookies

SESSION_DIR = "/tmp/pycgi_sessions"
COOKIE_NAME = "PYSESSID"

os.makedirs(SESSION_DIR, exist_ok=True)

# cookie -> sid (create if missing)
C = cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
sid = C[COOKIE_NAME].value if COOKIE_NAME in C else uuid.uuid4().hex

# load session dict
session_path = os.path.join(SESSION_DIR, f"{sid}.json")
try:
    with open(session_path, "r") as f:
        sess = json.load(f)
except Exception:
    sess = {}

# read form
form = cgi.FieldStorage()
name = (form.getfirst("username") or "").strip()
if name:
    sess["username"] = name
    with open(session_path, "w") as f:
        json.dump(sess, f)

# set cookie
out = cookies.SimpleCookie()
out[COOKIE_NAME] = sid
out[COOKIE_NAME]["path"] = "/"

print("Content-Type: text/html")
print(out.output())
print()
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