# Fragments REST API Documentation

HTTP REST API to create, view, update, and delete small data "fragments" like text and images. System stores fragment data and metadata associated with it like its size, type, and creation/modification dates.
All operations require proper authorization (account), as fragments are specific to the user.
Additionally, it gives options to convert fragment data between different formats. For example, a Markdown fragment can be retrievable as HTML, a JPEG as a PNG, etc.
System is fully tested and deployed to AWS and is available scaling in order to store massive amounts of data.

Overview
-
**Development Setup Commands**
- [General Commands](#general-commands)
- [Docker](#docker)
- [EC2 Environment](#ec2-environment)
- [Amazon Elastic Container Registry](#amazon-elastic-container-registry)

**Testing Endpoints**
- [Available Routes](#available-routes)
- [Supported file types](#supported-file-types)
- [Get Server Responses in Terminal using Curl](#get-server-responses-in-terminal-using-curl)
- [Expected Server Responses](#expected-server-responses)




<br>




Development Setup Commands
-

### General Commands

**Start server**
```
npm start
```

**Start the server in development mode** (with nodemon and logger in debug mode)
```
npm run dev
```

**Start the server in debug mode** (with nodemon, logger in debug mode and launched debugger in VSCode (launch.json))
```
npm run debug
```
> Note: If the debugger doesn't start (doesn't stop at breakpoints, etc), the problem might be that [Auto Attach is not enabled and debugger doesn't get attached](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach):
>  - In VSCode do `Ctrl+Shift+P`
>  - Find and select `Debug: Toggle Auto Attach`
>  - Select `Only With Flag` that will attach debugger when it sees "--inspect" flag like it's set up in `npm run debug` script.

**Command to make `local-aws-setup.sh` (`./scripts/local-aws-setup.sh`) executable**
```
chmod +x ./scripts/local-aws-setup.sh
```

**Update `package.json` version**
```
npm version <version> -m "Release v<version>"
```

**Push tag**
```
git push origin master --tags
```

<hr>

### Docker

**Authentication**
```
docker login --username <username> --password "<password>"
```

<br>

**Build docker image**
```
docker build -t fragments:latest .
```
  > - `-t fragments:latest`, is a [tag](https://docs.docker.com/engine/reference/commandline/build/#tag) with name (fragments) and version (latest)

<br>

**View created image**
```
docker image ls fragments
```

<br>

**Run docker container**
```
docker run --rm --name <fragments> --env-file <.env> -p 8080:8080 <fragments:latest>
```
  > - `<fragments>` is container name
  > - `--env-file <.env>` adds environmental variables from local .env file
  > - `-p 8080:8080` binds local 8080 port to docker machine's 8080 port (left 8080 - host/local machine; right 8080 - container)
  > - `<fragments:latest>` is image name

  More options:
  > - To have signals from tini, add `--init` tag after `docker run` NOTE: `--init` won't work on alpine images
  >   - i.e. `docker run --init --rm --name <fragments> --env-file <env.jest> -p 8080:8080 <fragments:latest>`
  > - To detach container (daemon, run in background), add `-d` flag
  >   - i.e. `docker run --rm --name <fragments> --env-file <env.jest> -p 8080:8080 -d <fragments:latest>`
  >   - it will detach container and as output will print the id of that container
  >   - to view logs for the detached container run `docker logs -f <detached container id>` (`-f` is for following the logs, can be run without)
  > - To overwrite environmental variables values, add `-e` tag with key=value
  >   - i.e. `docker run --rm --name <fragments> --env-file <env.jest> -e LOG_LEVEL=debug -p 8080:8080 <fragments:latest>`
  >   - it will discard `LOG_LEVEL` value in env.jest and set it's value to `debug`

<br>

**Docker Compose**
1. Run docker compose: `docker compose up`
  > - use `-d` tag to run service(s) in the background (i.e. `docker compose up -d`)
  > - use `down` to stop service(s) `docker compose down`
2. Re-build image (if changes are made to source code), use  `--build` flag to force a rebuild
  > - `docker compose up --build`
  > - `docker compose up --build -d` (re-build in background)

<br>

**Push to DockerHub**
1. Create a Tag `docker tag <fragments>:<latest> <mdmytrenko/fragments>:<latest>`
2. Make a push `docker push <mdmytrenko/fragments>`
> - `<mdmytrenko/fragments>` image name
> - if tag is omitted `:latest` tag is used by default as `mdmytrenko/fragments:latest`
> - to push all existing tags add `--all-tags` tag, run `docker push --all-tags mdmytrenko/fragments`

<br>

**Remove image (locally)**
```
docker rmi <image-name>
```

<hr>

### EC2 Environment

**Start & Stop EC2 instances from AWS command line**
- Start: `aws ec2 start-instances --instance-ids <instance-id>`
- Stop: `aws ec2 stop-instances --instance-ids <instance-id>`

**Connect with PuTTY**
1. Session -> Host Name set to `Public IPv4 address` (something like 54.165.10.190), check port to be `22`
2. Connection -> Seconds between keepalives set to `30`
3. Connection -> SSH -> Auth -> Credentials -> Private key file for authentication select file `dps955-fragments-key-pair.ppk` (in fragments/.ssh folder)
4. Login as `ec2-user`

**Setup CentOS with necessary tools**
1. Update system's packages with `sudo yum update`
2. Install package (git as the example) `sudo yum install git -y`
3. Check package version (git as the example) `git --version`
4. Switch between node versions `nvm use --lts` or `nvm use 16`(version 16 is installed) or  `nvm use 14`(version 14 is installed)

**Copy source code from local machine to EC2**
1. On Local Machine: Run `npm pack`
2. On Local Machine: Run
   ```
   pscp -v -i .ssh/<key-pair-file.ppk> <fragments-1.0.0.tgz> ec2-user@<ec2-54-165-10-190.compute-1.amazonaws.com>:
   ```
   > - `-v` for verbose (to give detailed explanation, especially if something goes wrong)
   > - `-i .ssh/<key-pair-file.ppk>` key-pairs for connection
   > - `<fragments-1.0.0.tgz>` update with newer version if applicable
   > - `ec2-user` username (without it automatically guesses username & refuses key)
   > - `<ec2-54-165-10-190.compute-1.amazonaws.com>` example of remote computer address (check Public IPv4 DNS)
   > - `-P 22` if some [errors](https://stackoverflow.com/questions/62817854/ssh-init-network-error-cannot-assign-requested-address) still arise add this flag to force it connect on port 22
4. On Remote Machine: Run `tar -xvzf <fragments-0.0.1.tgz>` to unpack
5. On Remote Machine: Run `cd package` to get into unpacked folder
6. On Remote Machine: Run `nvm use 14` prior to npm installing for fragments-ui, otherwise it might get frozen. 

**Docker on EC2**
1. Install Docker `sudo yum install -y docker` (might need to reload the ssh session `exit`)
2. Start Docker `sudo dockerd`
3. Pack, transfer & unpack codebase (refer to commands in the sections above)
4. Run `npm install` (will generate package-lock.json)
5. Build image `sudo docker build -t <fragments>:<latest> .`
6. Run other commands needed to run docker container (add `sudo` for root rights)

<hr>

### Amazon Elastic Container Registry

**Pull Docker Images from ECR**

1. On the EC2 instance login the docker client:
```
# Define Environment Variables for all AWS Credentials.  Use the Learner Lab AWS CLI Credentials:
$ export AWS_ACCESS_KEY_ID=<learner-lab-access-key-id>
$ export AWS_SECRET_ACCESS_KEY=<learner-lab-secret-access-key>
$ export AWS_SESSION_TOKEN=<learner-lab-session_token>
$ export AWS_DEFAULT_REGION=us-east-1

# Login the EC2's docker client, swapping your full ECR registry name
# Make sure docker is running! (sudo dockerd)
$ sudo docker login -u AWS -p $(aws ecr get-login-password --region us-east-1) 390240750368.dkr.ecr.us-east-1.amazonaws.com
```

2. Pull Image
```
sudo docker pull 390240750368.dkr.ecr.us-east-1.amazonaws.com/fragments:vtag
```

3. Run Pulled Image
```
sudo docker run --rm --name fragments --env-file .env -p 8080:8080 390240750368.dkr.ecr.us-east-1.amazonaws.com/fragments:vtag
```




<br>





Testing Endpoints
-

### Available Routes

| Route | Method | Authentication | What it does | Query Options |
| ----- | ------ | -------------- | ------------ |  ------- |
| GET | `/`  | not required | Server health check | |
| GET | `/v1/fragments`  | required | Get all user's fragments | setting `?expand=1` will return fragments in the expanded form with metadata |
| GET | `/v1/fragments/:id`  | required | Get specific user fragment |  |
| GET | `/v1/fragments/:id/info`  | required | Get specific user fragment in the expanded form with metadata |  |
| POST | `/v1/fragments`  | required | Create fragment for the user |  |
| PUT | `/v1/fragments/:id`  | required | Update specific user fragment |  |
| DELETE | `/v1/fragments/:id`  | required | Delete specific user fragment |  |


### Supported file types
| Name       | Type               | Extension |
| ---------- | ------------------ | --------- |
| Plain Text | `text/plain`       | `.txt`    |
| Markdown   | `text/markdown`    | `.md`     |
| HTML       | `text/html`        | `.html`   |
| JSON       | `application/json` | `.json`   |
| PNG Image  | `image/png`        | `.png`    |
| JPEG Image | `image/jpeg`       | `.jpg`    |
| WebP Image | `image/webp`       | `.webp`   |
| GIF Image  | `image/gif`        | `.gif`    |

**Supported coversions between types**
| Type               | Supported Conversion Extensions |
| ------------------ | ------------------------------- |
| `text/plain`       | `.txt`                          |
| `text/markdown`    | `.md`, `.html`, `.txt`          |
| `text/html`        | `.html`, `.txt`                 |
| `application/json` | `.json`, `.txt`                 |
| `image/png`        | `.png`, `.jpg`, `.webp`, `.gif` |
| `image/jpeg`       | `.png`, `.jpg`, `.webp`, `.gif` |
| `image/webp`       | `.png`, `.jpg`, `.webp`, `.gif` |
| `image/gif`        | `.png`, `.jpg`, `.webp`, `.gif` |

<hr>

### Get Server Responses in Terminal using Curl

**Simple fetch**
```
curl.exe http://localhost:8080
```

Expected Output
```
{"status":"ok","author":"<author>","githubUrl":"<github-repo>","version":"<package.json-version>", "hostname": "<hostname>"}
```


Simple fetch (but more readable response)
```
curl.exe -s localhost:8080 | jq
```

**Fetch for user's fragments**
```
curl.exe -i -u user1@email.com:password1 http://localhost:8080/v1/fragments
```

**Add new fragments for user**
```
curl.exe -i -X POST -u <user@email.com>:<password>  -H "Content-Type: <text/plain>" -d "<This is a fragment>" http://localhost:8080/v1/fragments
```

<hr>

### Expected Server Responses

**Expected Health Check Route Response**
```
{
  "status": "ok",
  "author": "<author>",
  "githubUrl": "<github-repo>",
  "version": "<package.json-version>",
  "hostname": "<hostname>"
}
```

**Successful Response**

Basic Successful Response
```
{
  "status": "ok"
}
```

Successful Response that returns data
```
{
  "status": "ok",
  "fragment": {
    "id": "<fragment-id>",
    "ownerId": "<owner-id>",
    "created": "<date-of-creation>",
    "updated": "<date-of-modification>",
    "type": "<fragment-type>",
    "size": <fragment-size>
  }
}
```

**Error Response**
```
{
  "status": "error",
  "error": {
    "code": <error-status-code>,
    "message": "<error-message>"
  }
}
```
