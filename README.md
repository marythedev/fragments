# Fragments back-end API

Run `eslint` to spot any syntactic error
```
npm run lint
```

<hr>

Run the following command to start the server (basically an alias for `node src/server.js`)
```
npm start
```

<hr>

Run the following command to:
- start the server in development mode (with nodemon that will automatically restart the server when there're any new changes in the source code folder "src/")
- set logger to the debug mode (that will provide additional logs that might be useful for development) 
```
npm run dev
```

<hr>

The following command will do everything that the previous command `npm run dev` does AND will also:
- start debugger in VSCode (launch.json)
```
npm run debug
```
If the debugger doesn't start (doesn't stop at breakpoints, etc), the problem might be that [Auto Attach is not enabled and debugger doesn't get attached](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach):
  - In VSCode do `Ctrl+Shift+P`
  - Find and select `Debug: Toggle Auto Attach`
  - Select `Only With Flag` that will attach debugger when it sees "--inspect" flag like it's set up in `npm run debug` script.

<hr>

Get Server Responses
-
Browser: [http://localhost:8080](http://localhost:8080)

Terminal (the last one will provide a more readable response):
```
curl.exe http://localhost:8080
```
```
curl.exe -s localhost:8080 | jq
```
