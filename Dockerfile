# Based on https://github.com/mozilla-services/Dockerflow/blob/master/Dockerfile
FROM node:9.11.2-slim
ENV DEBIAN_FRONTEND=noninteractive

# add a non-privileged user for installing and running
# the application
RUN groupadd -g 10001 app && \
    useradd -m -g app -d /app -u 10001 app

RUN apt-get update -q \
    && apt-get install -yq libpng-dev nginx \
    && apt-get clean

WORKDIR /app
COPY nginx.conf.template /etc/nginx.conf.template
COPY scripts/startnginx /bin

COPY . /app
RUN yarn && \
    yarn build && \
    yarn cache clean && \
    mv build www

CMD ["startnginx"]
