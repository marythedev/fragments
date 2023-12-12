# Update and delete text/plain
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This is a fragment!"

#update content
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content.`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This fragment has updated content."

#update content (with a different content type)
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "This fragment has updated content."

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404






# Update and delete text/plain; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This is a fragment!"

#update content
PUT {{url}}
Content-Type: text/plain; charset=utf-8
[BasicAuth]
user1@email.com:password1
`This fragment has updated content.`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This fragment has updated content."

#update content (with a different content type)
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/plain; charset=utf-8
[Asserts]
body == "This fragment has updated content."

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete text/markdown
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This is a fragment!`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown
[Asserts]
body == "# This is a fragment!"

#update content
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`# This fragment has updated content.`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown
[Asserts]
body == "# This fragment has updated content."

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown
[Asserts]
body == "# This fragment has updated content."

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete text/markdown; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown; charset=utf-8
[BasicAuth]
user1@email.com:password1
`# This is a fragment!`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown; charset=utf-8
[Asserts]
body == "# This is a fragment!"

#update content
PUT {{url}}
Content-Type: text/markdown; charset=utf-8
[BasicAuth]
user1@email.com:password1
`# This fragment has updated content.`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown; charset=utf-8
[Asserts]
body == "# This fragment has updated content."

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/markdown; charset=utf-8
[Asserts]
body == "# This fragment has updated content."

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete text/html
POST http://localhost:8080/v1/fragments
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h1>This is a fragment!</h1>`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>This is a fragment!</h1>"

#update content
PUT {{url}}
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<h1>This fragment has updated content.</h1>`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>This fragment has updated content.</h1>"

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<h1>This fragment has updated content.</h1>"

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete text/html; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: text/html; charset=utf-8
[BasicAuth]
user1@email.com:password1
`<h1>This is a fragment!</h1>`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Asserts]
body == "<h1>This is a fragment!</h1>"

#update content
PUT {{url}}
Content-Type: text/html; charset=utf-8
[BasicAuth]
user1@email.com:password1
`<h1>This fragment has updated content.</h1>`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Asserts]
body == "<h1>This fragment has updated content.</h1>"

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: text/html; charset=utf-8
[Asserts]
body == "<h1>This fragment has updated content.</h1>"

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete application/json
POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"status": "testing"}`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == "{\"status\": \"testing\"}"

#update content
PUT {{url}}
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
`{"status": "updated testing"}`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == "{\"status\": \"updated testing\"}"

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json
[Asserts]
body == "{\"status\": \"updated testing\"}"

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404





# Update and delete application/json; charset=utf-8
POST http://localhost:8080/v1/fragments
Content-Type: application/json; charset=utf-8
[BasicAuth]
user1@email.com:password1
`{"status": "testing"}`

# Check that fragment was created successfully
HTTP/1.1 201
[Captures]
url: header "Location"

# check the content before update
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body == "{\"status\": \"testing\"}"

#update content
PUT {{url}}
Content-Type: application/json; charset=utf-8
[BasicAuth]
user1@email.com:password1
`{"status": "updated testing"}`

# Check that fragment was updated successfully
HTTP/1.1 200

# check that fragment was set to the correct content
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body == "{\"status\": \"updated testing\"}"

#update content (with a different content type)
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This fragment has updated content with a different content type.`

# Check that fragment was not updated as fragment's type cannot change after update
HTTP/1.1 400

# check that content was not updated
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
body == "{\"status\": \"updated testing\"}"

# delete fragment
DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Check that request was successful
HTTP/1.1 200

# check that fragment doesn't exist anymore
GET {{url}}
[BasicAuth]
user1@email.com:password1
HTTP/1.1 404