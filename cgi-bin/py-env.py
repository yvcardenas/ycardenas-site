#!/usr/bin/python3
import os
print("Content-Type: text/html; charset=utf-8")
print()

print("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Environment Variables</title>
</head>
<body>
    <h1>Environment Variables</h1>
    <hr>
""")
for key, value in os.environ.items():
    print(f"<p><strong>{key}:</strong> {value}</p>")

print("""
</body>
</html>
""")