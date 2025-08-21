#!/usr/bin/python3
import os
from http import cookies

SESSION_DIR = "/tmp/pycgi_sessions"
COOKIE_NAME = "PYSESSID"

# cookie -> sid
C = cookies.SimpleCookie(os.environ.get("HTTP_COOKIE"))
sid = C[COOKIE_NAME].value if COOKIE_NAME in C else None

# delete file if exists
if sid:
    try:
        os.remove(os.path.join(SESSION_DIR, f"{sid}.json"))
    except FileNotFoundError:
        pass

# expire cookie
out = cookies.SimpleCookie()
out[COOKIE_NAME] = ""
out[COOKIE_NAME]["path"] = "/"
out[COOKIE_NAME]["max-age"] = 0

print("Content-Type: text/html")
print(out.output())
print()
print("""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Python Session Destroyed</title>
</head>
<body>
    <h1>Session Destroyed</h1>
    <hr>
    <a href="/hw2/py-cgiform.html">Back to the Python CGI Form</a><br />
    <a href="/cgi-bin/py-sessions-1.py">Back to Page 1</a><br />
    <a href="/cgi-bin/py-sessions-2.py">Back to Page 2</a>
</body>
</html>""")