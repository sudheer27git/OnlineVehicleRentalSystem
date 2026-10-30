import urllib.request, json
base = "http://127.0.0.1:8000"
for path in ["/", "/api/health", "/api/locations", "/api/vehicles"]:
    with urllib.request.urlopen(base + path) as response:
        body = json.loads(response.read().decode())
        print(path, response.status, "OK", (str(body)[:180]))
