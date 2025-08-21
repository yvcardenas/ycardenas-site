#!/usr/bin/python3
import os
from http import cookies

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