# Fragments REST API Documentation

HTTP REST API to create, view, update, and delete small data "fragments" like text and images. System stores fragment data and metadata associated with it like its size, type, and creation/modification dates.
All operations require proper authorization (account), as fragments are specific to the user.
Additionally, it gives options to convert fragment data between different formats. For example, a Markdown fragment can be retrievable as HTML, a JPEG as a PNG, etc.
System is fully tested and deployed to AWS and is available scaling in order to store massive amounts of data.

Overview
-
**Development Setup Commands**
- [General Commands](#general-commands)
- [Docker (with example)](#docker)
- [Dockerfile Optimizations](#dockerfile-optimizations)
- [EC2 Environment & Docker on EC2 (with example)](#ec2-environment)
- [Amazon Elastic Container Registry](#amazon-elastic-container-registry)

**Testing Endpoints**
- [Available Routes](#available-routes)
- [Supported file types](#supported-file-types)
- [Get Server Responses in Terminal using Curl](#get-server-responses-in-terminal-using-curl)
- [Expected Server Responses](#expected-server-responses)
- [Testing and Code Coverage](#testing-and-code-coverage)




<br>




Development Setup Commands
-

## General Commands

`npm start` Start server

`npm run dev` Start the server in development mode** (with nodemon and logger in debug mode)

`npm run debug` Start the server in debug mode** (with nodemon, logger in debug mode and launched debugger in VSCode (launch.json))
> <details markdown='1'>
>  <summary><strong>If the debugger doesn't start (doesn't stop at breakpoints, etc)</strong></summary>
>  <br>
>  If there are any breakpoints set up, application should hit them.
>  <img src="https://github.com/marythedev/fragments/assets/79389256/8528348b-730a-4704-929f-20c74ef7c6b7" height="600px">
> 
>  If that has not happened, the problem might be that <a href="https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach" target="_blank">Auto Attach is not enabled and debugger doesn't get attached</a>:
>  <ol>
>    <li>In VSCode do `Ctrl+Shift+P`</li>
>    <li>Find and select `Debug: Toggle Auto Attach`</li>
>    <li>Select `Only With Flag` that will attach debugger when it sees "--inspect" flag like it's set up in `npm run debug` script.</li>
>  </ol>
></details>

`npm run lint` Check codebase for errors and enforce coding standards.

`hadolint Dockerfile` Check Dockerfile for errors and enforce best practices.

`npm run coverage` Run all tests and generate code coverage report.

`chmod +x ./scripts/local-aws-setup.sh` Make local-aws-setup.sh file (./scripts/local-aws-setup.sh) executable

`npm version <version> -m "Release v<version>"` Update package.json version

`git push origin master --tags` Push tag

<hr>

## Docker

**Authentication**
```
docker login --username <username> --password "<password>
```

<br>

<details markdown='1'>
<summary><strong>Build docker image</strong></summary>
 <blockquote>
   <br>
   `-t fragments:latest` is a <a href="https://docs.docker.com/engine/reference/commandline/build/#tag">tag</a> with name (fragments) and version (latest)
 </blockquote>
</details>

```
docker build -t fragments:latest .
```

<br>

**View created image**
```
docker image ls fragments
```

<br>

<details markdown='1'>
<summary><strong>Run docker container</strong></summary>
<blockquote>
  <br>
  Tag Meanings
  <ul>
    <li>`fragments` is container name</li>
    <li>`--env-file <.env>` adds environmental variables from local .env file</li>
    <li>`-p 8080:8080` binds local 8080 port to docker machine's 8080 port (left 8080 - host/local machine; right 8080 - container)</li>
    <li>`fragments:latest` is image name</li>
  </ul>
  <br>
  More options
  <ul>
    <li>To have signals from tini, add `--init` tag after `docker run` NOTE: `--init` won't work on alpine images</li>
    <ul>
       <li>i.e. `docker run --init --rm --name fragments --env-file env.jest -p 8080:8080 fragments:latest`</li>
    </ul>
    <li>To detach container (daemon, run in background), add `-d` flag</li>
    <ul>
       <li>i.e. `docker run --rm --name fragments --env-file env.jest -p 8080:8080 -d fragments:latest`</li>
       <li>it will detach container and as output will print the id of that container</li>
       <li>to view logs for the detached container run `docker logs -f detached-container-id` (`-f` is for following the logs, can be run without)</li>
    </ul>
    <li>To overwrite environmental variables values, add `-e` tag with key=value</li>
    <ul>
       <li>i.e. `docker run --rm --name fragments --env-file env.jest -e LOG_LEVEL=debug -p 8080:8080 fragments:latest`</li>
       <li>it will discard `LOG_LEVEL` value in env.jest and set it's value to `debug`</li>
    </ul>
  </ul>
</blockquote>
</details>

```
docker run --rm --name <fragments> --env-file <.env> -p 8080:8080 <fragments:latest>
```

![image](https://github.com/marythedev/fragments/assets/79389256/5623ef90-2a25-4315-9d81-7f4b313536c6)
*Above is the screenshot of fragments microservice running as a Docker container in detached mode. Using port 5555 on host for port 8080 in the container. Then, using curl to hit the server's health check route inside the container.*


<br>

<details markdown='1'>
<summary><strong>Run docker compose</strong></summary>
 <blockquote>
   <br>
   Additional Tags Available
   <ul>
    <li>use `-d` tag to run service(s) in the background (i.e. `docker compose up -d`)</li>
    <li>use `down` to stop service(s) `docker compose down`</li>
   </ul>
   <br>
   Changed codebase? - Re-build image (if changes are made to source code), use  `--build` flag to force a rebuild
   <ul>
    <li>`docker compose up --build`</li>
    <li>`docker compose up --build -d` (re-build in background)</li>
   </ul>
 </blockquote>
</details>

```
docker compose up
```

<br>

**Push to DockerHub**

1. Create a Tag
  ```
  docker tag <fragments>:<latest> <mdmytrenko/fragments>:<latest>
  ```

2. Make a push 
  ```
  docker push <mdmytrenko/fragments>
  ```
  > <details markdown='1'>
  >  <summary><strong>Available Options</strong></summary>
  >  <ul>
  >    <li>`mdmytrenko/fragments` image name</li>
  >    <li>if tag is omitted `:latest` tag is used by default as `mdmytrenko/fragments:latest`</li>
  >    <li>to push all existing tags add `--all-tags` tag, run `docker push --all-tags mdmytrenko/fragments`</li>
  >  </ul>
  ></details>

<br>

**Remove image (locally)**
```
docker rmi <image-name>
```

<hr>

## Dockerfile Optimizations

**How is Dockerfile currently optimized?**
- Use of Alpine Linux with the explicit image sha version: `FROM node:18.17.0-alpine3.17@sha256:e0641d0ac1f49f045c8dc05bbedc066fc7c88bc2730ead423088eeb0788623a1`
  - Using specific sha is used for security.
  - Using Alpine Linux hugely reduced container size, going from 1.15GB to 240.54MB. There is After/Before of using Alpine Linux: <br> ![image](https://github.com/marythedev/fragments/assets/79389256/01332c14-4951-49ca-b5b1-4da291373439)
- Installation of only production dependencies on docker image with `RUN npm ci --production`, as docker container doesn't need devDependencies.
- Downgrading user’s rights (from root user) with `USER node` for security purposes (attacker cannot use root user privileges if they get access to the container).
- Use of tini `ENTRYPOINT ["tini", "--"]` to control signals in order to terminate the docker container when necessary. Since Alpine version doesn’t have tini pre-installed, tini is added to the image with `RUN apk add --no-cache tini`.
- Healthcheck was added, so that container knows if the application runs properly or not. `HEALTHCHECK --interval=3m --retries=3 \ CMD curl --fail http://localhost:${PORT}/ || exit 1`

<br>

Eventually, with all of the above implementations, the container was optimized and went from 1.15GB to 186.76MB in size.
![image](https://github.com/marythedev/fragments/assets/79389256/5c1e957d-02a3-469d-95a6-99d2cb19a012)




<hr>

## EC2 Environment

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
2. <details markdown='1'>
    <summary><strong>On Local Machine: Run</strong></summary>
     <blockquote>
       <ul>
        <li>`-v` for verbose (to give detailed explanation, especially if something goes wrong)</li>
        <li>`-i .ssh/key-pair-file.ppk` key-pairs for connection</li>
        <li>`fragments-1.0.0.tgz` update with newer version if applicable</li>
        <li>`ec2-user` username (without it automatically guesses username & refuses key)</li>
        <li>`ec2-54-165-10-190.compute-1.amazonaws.com` example of remote computer address (check Public IPv4 DNS)</li>
        <li>`-P 22` if some  still arise add this flag to force it connect on port 22</li>
       </ul>
     </blockquote>
    </details>
    
   ```
   pscp -v -i .ssh/<key-pair-file.ppk> <fragments-1.0.0.tgz> ec2-user@<ec2-54-165-10-190.compute-1.amazonaws.com>:
   ``` 
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

Running server as a Docker container in detached mode on EC2. Using port 8080 for both host and the container.
<img src="https://github.com/marythedev/fragments/assets/79389256/c4269537-adc1-4c3e-ae13-6e7175745fbe" >

 <details markdown='1'>
  <summary><strong>Example of Docker Container Testing on EC2</strong></summary>
   <blockquote>
  <br>
  Using the browser to hit the EC2 server's health check route inside the docker container.
  <br>
  <img src="https://github.com/marythedev/fragments/assets/79389256/84888c57-9964-474b-9f37-fe2192e5df6d" >

  <br><br>
  Docker logs on the EC2 instance show request information after EC2 server's health check route `/` is visited via browser (screenshot above)
  <br>
  <img src="https://github.com/marythedev/fragments/assets/79389256/ec227bca-325e-4f47-b44e-76ae5313a5e1" height="400px">     
   </blockquote>
</details>


<hr>

## Amazon Elastic Container Registry

**Pull Docker Images from ECR**

1. On the EC2 instance login the docker client:
```
$ export AWS_ACCESS_KEY_ID=<access-key-id>
$ export AWS_SECRET_ACCESS_KEY=<secret-access-key>
$ export AWS_SESSION_TOKEN=<session_token>
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

## Available Routes

| Route | Method | Authentication | What it does | Query Options |
| ----- | ------ | -------------- | ------------ |  ------- |
| GET | `/`  | not required | Server health check | |
| GET | `/v1/fragments`  | required | Get all user's fragments | setting `?expand=1` will return fragments in the expanded form with metadata |
| GET | `/v1/fragments/:id`  | required | Get specific user fragment |  |
| GET | `/v1/fragments/:id/info`  | required | Get specific user fragment in the expanded form with metadata |  |
| POST | `/v1/fragments`  | required | Create fragment for the user |  |
| PUT | `/v1/fragments/:id`  | required | Update specific user fragment |  |
| DELETE | `/v1/fragments/:id`  | required | Delete specific user fragment |  |


## Supported file types
| Name       | Type               | Extension | Supported Conversion Extensions |
| ---------- | ------------------ | --------- | ------------------------------- |
| Plain Text | `text/plain`       | `.txt`    | `.txt`                          |
| Markdown   | `text/markdown`    | `.md`     | `.md`, `.html`, `.txt`          |
| HTML       | `text/html`        | `.html`   | `.html`, `.txt`                 |
| JSON       | `application/json` | `.json`   | `.json`, `.txt`                 |
| PNG Image  | `image/png`        | `.png`    | `.png`, `.jpg`, `.webp`, `.gif` |
| JPEG Image | `image/jpeg`       | `.jpg`    | `.png`, `.jpg`, `.webp`, `.gif` |
| WebP Image | `image/webp`       | `.webp`   | `.png`, `.jpg`, `.webp`, `.gif` |
| GIF Image  | `image/gif`        | `.gif`    | `.png`, `.jpg`, `.webp`, `.gif` |

<hr>

## Get Server Responses in Terminal using Curl

**Simple fetch**
```
curl.exe http://localhost:8080
```

Simple fetch (more readable response)
```
curl.exe -s localhost:8080 | jq
```

Expected Output
`
{"status":"ok","author":"<author>","githubUrl":"<github-repo>","version":"<package.json-version>", "hostname": "<hostname>"}
`

<br><br>

**Fetch for user's fragments**
```
curl.exe -i -u user1@email.com:password1 http://localhost:8080/v1/fragments
```

**Add new fragments for user**
```
curl.exe -i -X POST -u <user@email.com>:<password>  -H "Content-Type: <text/plain>" -d "<This is a fragment>" http://localhost:8080/v1/fragments
```

<hr>

## Expected Server Responses

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



<hr>


## Testing and Code Coverage
Tesing is extensively used in this application. Integration tests utilize `hurl` to test response from different routes. Unit tests are implemented using npm `supertest` package. Code coverage report shows that over 85% of the codebase has tests.
![image](https://github.com/marythedev/fragments/assets/79389256/c4b25e71-e9b7-42b0-9116-b41cb3e0eaa1)
