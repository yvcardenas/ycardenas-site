#!/usr/bin/python3
import os, sys

print("Content-Type: text/html; charset=utf-8")
print()

method = os.environ.get("REQUEST_METHOD", "")
protocol = os.environ.get("SERVER_PROTOCOL", "")
query = os.environ.get("QUERY_STRING", "")

length = int(os.environ.get("CONTENT_LENGTH", "0") or "0")
body = sys.stdin.read(length) if length > 0 else ""

print(f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>General Request Echo</title>
</head>
<body>
    <h1>General Request Echo</h1>
    <hr>
    <p><strong>Request Method:</strong> {method}</p>
    <p><strong>Protocol:</strong> {protocol}</p>
    <p><strong>Query:</strong> {query}</p>
    <p><strong>Message Body:</strong>{body}</p>
</body>
</html>""")