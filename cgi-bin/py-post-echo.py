#!/usr/bin/python3
import os, sys, json, urllib.parse
print("Content-Type: text/html; charset=utf-8")
print()

ctype = os.environ.get('CONTENT_TYPE', '')
length = int(os.environ.get('CONTENT_LENGTH', '0') or '0')
raw = sys.stdin.read(length) if length  > 0 else ""

fields = {}

if "application/x-www-form-urlencoded" in ctype and raw:
    fields = {k: (v[0] if len(v)==1 else ", ".join(v))
        for k, v in urllib.parse.parse_qs(raw).items()}

elif "application/json" in ctype and raw:
    try:
        decoded = json.loads(raw)
        if isinstance(decoded, dict):
            fields = {k: (", ".join(v) if isinstance(v, list) else v)
                for k, v in decoded.items()}
    except Exception:
        pass

print(f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POST Request Echo</title>  
</head>
<body>
    <h1>POST Request Echo</h1>
    <hr> 
    <p><strong>Content-Type: </strong>{ctype}</p>
    <p><strong>Message Body: </strong></p>
    <ul>
""")
if fields:
    for key, value in fields.items():
        print(f"<li><strong>{key}:</strong> {value}</li>")
print(f"""
</ul>
<p><strong>Raw Body</strong></p>
<pre>{raw}</pre>
</body>
</html>
""")