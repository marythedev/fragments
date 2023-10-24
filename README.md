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

Fetch for users' fragments
```
curl.exe -i -u user1@email.com:password1 http://localhost:8080/v1/fragments
curl.exe -i -u user2@email.com:password2 http://localhost:8080/v1/fragments
```
Add new fragments for users (example)
```
curl.exe -i -X POST -u user1@email.com:password1  -H "Content-Type: text/plain" -d "This is a fragment" http://localhost:8080/v1/fragments
curl.exe -i -X POST -u user2@email.com:password2  -H "Content-Type: text/plain" -d "This is a fragment" http://localhost:8080/v1/fragments
```


EC2 Environment
-
CentOS
- Update system's packages with `sudo yum update`
- Install package (git as the example) `sudo yum install git -y`
- Check package version (git as the example) `git --version`
- Switch between node versions `nvm use --lts` or `nvm use 16`(version 16 is installed) or  `nvm use 14`(version 14 is installed)

Connect with PuTTY
1. Session -> Host Name set to `Public IPv4 address` (something like 54.165.10.190), check port to be `22`
2. Connection -> Seconds between keepalives set to `30`
3. Connection -> SSH -> Auth -> Credentials -> Private key file for authentication select file `dps955-fragments-key-pair.ppk` (in fragments/.ssh folder)
4. Login as `ec2-user`

Copy source code from local machine to EC2
1. Run `npm pack`
2. Run `pscp -v -i .ssh/dps955-fragments-key-pair.ppk fragments-0.0.1.tgz ec2-user@ec2-54-165-10-190.compute-1.amazonaws.com:`

   `-v` for verbose (to give detailed explanation, especially if something goes wrong)
   
   `-i .ssh/dps955-fragments-key-pair.ppk` key-pairs for connection

   `fragments-0.0.1.tgz` update with newer version if applicable
   
   `ec2-user` username (without it automatically guesses username & refuses key)

   `ec2-54-165-10-190.compute-1.amazonaws.com` example of remote computer address (check Public IPv4 DNS)

   `-P 22` if some [errors](https://stackoverflow.com/questions/62817854/ssh-init-network-error-cannot-assign-requested-address) still arise add this flag to force it connect on port 22
3. Run `tar -xvzf fragments-0.0.1.tgz` on the remote machine
4. Run `cd package` on the remote machine
5. Run `nvm use 14` prior to npm installing for fragments-ui, otherwise it gets frozen. 

Start & Stop EC2 instances from AWS command line:
- Start with `aws ec2 start-instances --instance-ids {instance-id}`
- Stop with `aws ec2 stop-instances --instance-ids {instance-id}`





Docker
-
##### Authenticate
```
docker login --username <username> --password "<password>"
```

##### Push and pull to/from Docker Hub
- Push `docker push mdmytrenko/fragments`
   - `mdmytrenko/fragments` is image name
   - if tag is omitted `:latest` tag is used by default as `mdmytrenko/fragments:latest`
   - to push all tags on `mdmytrenko/fragments` run `docker push --all-tags mdmytrenko/fragments`
- 

##### Create and run image
1. Run `docker build -t fragments:latest .` to build docker image
    - -t fragments:latest, is a [tag](https://docs.docker.com/engine/reference/commandline/build/#tag) with name (fragments) and version (latest)
2. View created image with `docker image ls fragments`
3. Run `docker run --rm --name fragments --env-file .env -p 8080:8080 fragments:latest`
    - `--env-file .env` adds environmental variables from local .env file
    - `-p 8080:8080` binds local 8080 port to docker machine's 8080 port (8080 on the host/local machine (left-hand) and 8080 in the container (right-hand))
    - in order to have signals from tini that is built into docker, run `docker run --init --rm --name fragments --env-file .env -p 8080:8080 fragments:latest`
      - NOTE: `--init` won't work on alpine images

##### Overwrite environmental variables 
- add `-e` tag with key=value
- for example, `docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 fragments:latest`

##### Detach container (daemon, run in background)
- add `-d` flag (which will print the id of the detached container)
- for example, `docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 -d fragments:latest`
- run `docker logs -f <detached container id>` (`-f` flag is for following the logs, can be run without it)

##### Remove image (locally)
```
docker rmi hello-world
```

### Docker on EC2
1. Install Docker `sudo yum install -y docker` (might need to reload the ssh session `exit`)
2. Start Docker `sudo dockerd`
3. Pack, transfer & unpack codebase (refer to commands in the sections above)
4. Run `npm install` (will generate package-lock.json)
5. Build image `sudo docker build -t fragments:latest .`
6. Run other commands needed to run docker container (add `sudo` for root rights)
