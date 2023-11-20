# Access route that doesn't exist
GET http://localhost:8080/no-such-route

# Expect an HTTP 1.1 404 response
HTTP/1.1 404

[Asserts]
# Expect a JSON response with { "status": "error", ... }
jsonpath "$.status" == "error"
# Expect a JSON response with { ..., "error": {"code": 404, ...} }
jsonpath "$.error.code" == 404
# Expect a JSON response with { ..., "error": { ..., "message": "Not Found" } }
jsonpath "$.error.message" == "Not Found"