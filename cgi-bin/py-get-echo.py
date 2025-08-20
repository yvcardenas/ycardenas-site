#!/usr/bin/python3
import os, urllib.parse
print("Content-Type: text/html; charset=utf-8")
print()

query = os.environ.get('QUERY_STRING', '')
params = urllib.parse.parse_qs(query)

print("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GET Echo</title>
</head>
<body>
    <h1>GET Request Echo</h1>
    <hr>
      """)
print(f"<p><strong>Query String: </strong>{query}</p>")
print("<ul>")
if params:
    for key, values in params.items():
        print(f"<li><strong>{key}:</strong> {values}</li>")
print("</ul></body></html>")