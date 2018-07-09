# Based on https://github.com/mozilla-services/Dockerflow/blob/master/Dockerfile
FROM node:9.11.2-slim

# add a non-privileged user for installing and running
# the application
RUN groupadd -g 10001 app && \
    useradd -m -g app -d /app -u 10001 app

RUN apt-get update -q && apt-get install -yq libpng-dev
WORKDIR /app

USER app
COPY . /app
RUN yarn && \
    yarn build && \
    yarn cache clean

ENTRYPOINT ["yarn"]
CMD ["start"]
