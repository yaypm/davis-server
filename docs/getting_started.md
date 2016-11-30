Getting Started
============

- [Deploy to Heroku](#deploy-to-heroku-cloud-paas-provider)
- [Custom Deployment](#custom-deployment)
 - [Prerequisites](#prerequisites)
 - [Setup](#setup)
  - [Installation](#installation)
  - [SSL Configuration](#ssl-configuration)
  - [Nginx Configuration](#nginx-configuration)
- [Configuration](#configuration)
- [Management](#management)
- [Basic Usage](#basic-usage)

## Deploy to Heroku Cloud Paas Provider

### Button
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/Dynatrace/davis-server)

By far the simplest way to get started with Davis is to simply click the "Deploy to Heroku" button.  This will automatically grab the latest version of Davis, provision a MongoDB instance, and start the server.  From there, you can configure Davis via the configuration UI.

### CLI

It's also possible to deploy to Heroku using their CLI.

* Clone this repo and change directory to it
* Log in with the [Heroku Toolbelt](https://toolbelt.heroku.com/) and create an app: `heroku create`
* Use the [mLab addon](https://elements.heroku.com/addons/mongolab): `heroku addons:create mongolab:sandbox --app YourAppName`
* Deploy with the following command: `git push heroku master`

### Limitations

While Heroku offers a generous free tier, it is not recommended for Davis.  Feel free to use it while you're evaluating but the hobby tier is not recommended for production use.  This is mainly because the free tier goes to sleep after 30 minutes of inactivity and the startup process is relativity slow.

## Custom Deployment

### Prerequisites

- [NodeJS](https://nodejs.org) 6 or higher
- [MongoDB](https://docs.mongodb.com/v3.0/administration/install-on-linux)
- [Nginx](https://nginx.org/en/) or [Apache](https://httpd.apache.org) (This guide will only cover setup using Nginx)
- HTTPS Certificate (Can be obtained for free from [LetsEncrypt](https://letsencrypt.org))

### Setup
> TODO: Build and deploy releases on github

#### Installation

If using Amazon Linux AMI

```bash
echo "[mongodb-org-3.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.2.asc" |
  sudo tee -a /etc/yum.repos.d/mongodb-org-3.2.repo
sudo yum -y update && sudo yum install -y mongodb-org-server \
  mongodb-org-shell mongodb-org-tools git nginx python27-devel \
  nodejs npm
git clone https://github.com/Dynatrace.com/davis-server.git
cd davis-server
npm install --production
```

On Ubuntu Linux:

```bash
# ubuntu
sudo apt-get install mongodb-server git nginx letsencrypt nodejs npm
git clone https://github.com/Dynatrace.com/davis-server.git
cd davis-server
npm install --production
```

#### SSL Configuration

Next we need to obtain an ssl certificate. If you already have
an ssl certificate, skip to [nginx configuration](#nginx-configuration).

Amazon Linux

```bash
git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt
/opt/letsencrypt/letsencrypt-auto --debug
echo "rsa-key-size = 4096" >> /etc/letsencrypt/config.ini
echo "email = email@example.com" >> /etc/letsencrypt/config.ini
service nginx stop # must stop nginx to allow letsencrypt to bind on port 80
/opt/letsencrypt/letsencrypt certonly
service nginx start
# follow the prompts
```

Ubuntu Linux

```bash
sudo apt-get install letsencrypt
# must stop nginx to allow letsencrypt to bind on port 80
sudo service nginx stop
letsencrypt certonly
# follow the prompts
sudo service nginx start
```


#### Nginx Configuration

Add the following configuration to Nginx

```nginx
server {
  # redirect standard HTTP traffic to HTTPS
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name your.davis.domain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2 default_server;
  listen [::]:443 ssl http2 default_server;
  ssl_certificate /etc/letsencrypt/live/your.davis.domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your.davis.domain.com/privkey.pem;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers on;
  ssl_ciphers "EECDH+AESGCM:EDG+AESGCM:AES256+EECDH:AES256+EDH";
  ssl_ecdh_curve secp384r1;
  ssl_session_cache shared:SSL:10m;
  ssl_session_tickets off;
  ssl_stapling on;
  ssl_stapling_verify on;
  resolver 8.8.8.8 8.8.4.4 valid=300s;
  resolver_timeout 5s;
  # Uncomment the following line only if you know what you are doing and are aware of the implications
  # add_header Strict-Transport-Security "max-age=63072000; includeSubdomains; preload";
  add_header X-Frame-Options DENY;
  add_header X-Content-Type-Options nosniff;
  server_name _;
  location / {
    # Proxy traffic to Davis
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
  }
}
```

Now restart the nginx process

```bash
sudo service nginx restart
```

Now you can run your Davis server.

```bash
NODE_ENV=production nodejs bin/davis-server
```

And you should be able to browse to your domain in a web browser and be connected
using a secure https connection. Please note that the web interface is not
currently working, but we are working on it!

## Configuration

- [Alexa](setup/alexa.md)
- [Slack](setup/slack.md)

## Management

A configuration UI is currently in the works!  Until then, please have a look at our [REST API docs](development/API.md).

## Basic Usage

Here are a few example interactions to get you started with Davis.

### Basic Time Range query

> Alexa, start davis.

> How can I be of service?

> What happened yesterday?

> I hate to be the bearer of bad news, but there were 15 problems detected yesterday between
12:00 AM and 11:59 PM. However, I would recommend focusing on one of the following problems. First
off, there was a global outage for synthetic based web checks, which affected Jerry -
easytravel.demo.dynatrace dot com:8080/, but it closed around 6:40 AM. Next, there was a global
outage for synthetic based web checks, which affected easyTravel demo booking, but was resolved
yesterday around 1:05 AM. Finally, there was a global outage for synthetic based web checks, which
affected easyTravel demo booking, but it closed yesterday around 2:40 AM. Would you be interested in
hearing more about the first, second, or third problem?

> The third one

> This problem started yesterday around 2:00 AM when a global outage for synthetic based web checks
started impacting easyTravel demo booking. This problem appears to be resolved now. However, I would
recommend investigating the root cause of this problem to see if there's a way to avoid this in the
future. Is there anything else I can help you with?

> No

> Ok, Have a good one!

### Specific Application Query

> Alexa, start davis.

> How can I be of service?

> What happened yesterday with my fancy application?

> There was a series of connectivity failures that affected my fancy application.  This problem
started yesterday around 3 AM but was resolved yesterday around 3:30 AM. Would you like me to
analyze this further for you?

> No

> Ok, Have a nice day!
