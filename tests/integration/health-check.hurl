# Health Check Test
GET http://localhost:8080

# Expect an HTTP 1.1 200 response
HTTP/1.1 200
# Expect a non-cacheable response (cache-control header)
Cache-Control: no-cache

[Asserts]
# Expect a JSON response with { "status": "ok", ... }
jsonpath "$.status" == "ok"
# Expect a JSON response with { ..., "author": "..." }
jsonpath "$.author" isString
# Expect a JSON response with { ..., "githubUrl": "..." }
jsonpath "$.githubUrl" matches /^https:\/\/github.com\/.+/
# Expect a JSON response with { ..., "version": "x.y.z" }
jsonpath "$.version" matches /^\d+\.\d+\.\d+$/