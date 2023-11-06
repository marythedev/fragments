#Docker instructions necessary for Docker Engine to build the image
FROM node:18.17.0-alpine3.17@sha256:e0641d0ac1f49f045c8dc05bbedc066fc7c88bc2730ead423088eeb0788623a1

LABEL maintainer="Maria Dmytrenko"
LABEL description="Fragments node.js microservice"

# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Use /app as our working directory
WORKDIR /app

# Copies the package.json and package-lock.json files into the working dir (./app)
COPY package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
# Install tini to handle signals (terminate container, etc)
RUN npm ci --production && \
    apk add --no-cache tini=0.19.0

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

#changing the ownership of the files to node user
COPY --chown=node:node . /app

#changing the user to a less privileged user
USER node

# Use tini to handle signals (terminate container, etc)
ENTRYPOINT ["tini", "--"]

# Start the container by running our server
CMD ["node", "src/server.js"]

# Run service on port 8080
EXPOSE 8080

HEALTHCHECK --interval=3m --retries=3 \
    CMD curl --fail http://localhost:${PORT}/ || exit 1