# FROM mhart/alpine-node:6
FROM node:6-alpine

RUN mkdir -p /opt/davis
WORKDIR /opt/davis
ADD . .

# clean up build dependencies on the same RUN
# this prevents the COW filesystem from bloating
RUN apk add --no-cache make gcc g++ python git && \
    npm install && \
    cd web && npm install && \
    npm run build:prod && cd ../ && \
    apk del make gcc g++ python git && \
    rm -rf /tmp /usr/share/man ~/.npm /var/cache/apk/*

EXPOSE 3000
CMD ["npm", "start"]
