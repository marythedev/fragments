# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# Send a plain text fragment
Content-Type: text/plain
# Include HTTP Basic Auth credentials using the [BasicAuth] section, which must go AFTER the headers
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
# 19 is the length of our fragment data: 'This is a fragment!'
jsonpath "$.fragment.size" == 19
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19
[Asserts]
body == "This is a fragment!"



# Authenticated POST to /v1/fragments and creating a fragment of unsupported type
POST http://localhost:8080/v1/fragments
# Send a pdf fragment
Content-Type: text/pdf
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 415
HTTP/1.1 415



# Authenticated POST to /v1/fragments and creating a fragment of text/plain; charset=utf-8
POST http://localhost:8080/v1/fragments
# Send a plain text fragment
Content-Type: text/plain; charset=utf-8
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`This is a fragment!`

# We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL and check if type is correct (text/plain; charset=utf-8)
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain; charset=utf-8



# Creating a fragment without authentication
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
`This is a fragment!`

# We expect to get back an HTTP 401
HTTP/1.1 401



# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# Send a json fragment
Content-Type: application/json
# Include HTTP Basic Auth credentials using the [BasicAuth] section
[BasicAuth]
user1@email.com:password1
# Body of the request
{"status": "testing"}

# We expect to get back an HTTP 201
HTTP/1.1 201
# We have various assertions about the response that we want to check
[Asserts]
# The Location header should look like what we expect (including the fragment id)
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
# You could also write a regex for this and use matches
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# 21 is the length of our fragment data: {"status": "testing"}
jsonpath "$.fragment.size" == 21
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == "{\"status\": \"testing\"}"


# application/json; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: application/json; charset=utf-8
[BasicAuth]
user1@email.com:password1
# Body of the request
{"status": "testing"}

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "application/json; charset=utf-8"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body == "{\"status\": \"testing\"}"


# text/markdown
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This is a fragment!`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/markdown"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/markdown
[Asserts]
body == "# This is a fragment!"


# text/markdown; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown; charset=utf-8
[BasicAuth]
user1@email.com:password1
`# This is a fragment!`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/markdown; charset=utf-8"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/markdown; charset=utf-8
[Asserts]
body == "# This is a fragment!"


# text/html
POST http://localhost:8080/v1/fragments
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h1>This is a fragment!</h1>`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/html"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>This is a fragment!</h1>"


# text/html; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: text/html; charset=utf-8
[BasicAuth]
user1@email.com:password1
`<h1>This is a fragment!</h1>`

HTTP/1.1 201
[Asserts]
jsonpath "$.fragment.type" == "text/html; charset=utf-8"
[Captures]
url: header "Location"

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Asserts]
body == "<h1>This is a fragment!</h1>"