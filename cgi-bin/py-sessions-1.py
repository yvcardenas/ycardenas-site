#!/usr/bin/python3
import os, uuid, json, sys
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

# read form (POST or GET) and update
method = os.environ.get("REQUEST_METHOD", "")
cl = os.environ.get("CONTENT_LENGTH", "")
cl = int(cl) if cl and cl.isdigit() else 0
input_data = sys.stdin.read(cl) if method == "POST" else os.environ.get("QUERY_STRING", "")
name = parse_qs(input_data).get("username", [""])[0].strip()

if name:
    sess["username"] = name
    with open(session_path, "w") as f:
        json.dump(sess, f)  

# set cookie
setcookie = cookies.SimpleCookie()
setcookie[COOKIE_NAME] = sid
setcookie[COOKIE_NAME]["path"] = "/"

print("Content-Type: text/html")
print(setcookie.output())
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
<a href="/cgi-bin/python-sessions-2.py">Session 2</a><br/>
<a href="/hw2/python-cgiform.html">Python CGI Form</a><br/>
<form style="margin-top:30px" action="/cgi-bin/python-destroy-session.py" method="get">
  <button type="submit">Destroy Session</button>
</form>
</body>
</html>""")