# Authentication

## `/api/v1/authenticate`

### POST

Authenticate and receive a JavaScript Web Token valid for 24 hours.
This token is required for all other system level API calls. It must
be set as the `x-access-token` header.

#### Payload

```
{
  "email": "admin@localhost",
  "password": "changeme"
}
```

#### Response

```
{
  "success": true,
  "message": "Authentication successful!",
  "token": "jwt_token_here"
}
```

# System

## `/api/v1/system/config/:category(dynatrace|slack|watson)`

### GET

Get a configuration from :category.

### PUT

Update a configuration for :category.

## `/api/v1/system/users`

### GET

List all users

### POST

Create a user

#### Payload

```
{
	"email": "user@example.com",
	"password": "12345"
}
```

#### Response

```
{
  "success": true,
  "message": "User created!"
}
```

## `/api/v1/system/users/:user_email`

### GET

Get a single user

### PUT

Modify a single user

#### Payload

```
{
	"alexa_ids": [] // list of alexa ids
}
```

#### Response

```
{
  "success": true,
  "message": "User updated!"
}
```

### DELETE

Delete a single user

## `/api/v1/system/users/timezones`

### GET

Returns a list of valid timezones

## `/api/v1/system/aliases`

### GET

Get all aliases

## `/api/v1/system/aliases/:category(applications|services|infrastructure)`

### GET

List all aliases in a category

### POST

Create a new alias

#### Payload

```
{
  "name": "Easy Travel",
  "category": "application",
  "display": {
    "audible": "Easy Travel",
    "visual": "Easy Travel"
  },
  "aliases": ["easy travel", "easytravel"]
}
```

#### Response

```
{
  "msg": "Created a new application alias for Easy Travel.",
}
```

## `/api/v1/system/aliases/:category(applications|services|infrastructure)/:alias_id`

### PUT

#### Payload

```
{
  "name": "Easy Travel",
  "category": "application",
  "display": {
    "audible": "Easy Travel",
    "visual": "Easy Travel"
  },
  "aliases": ["easy travel", "easytravel"]
}
```

#### Response

```
{
  "msg": "Created a new application alias for Easy Travel.",
}
```

### DELETE

Delete an alias

## `/api/v1/system/mongodb/validate`

### GET

Check that Davis is connected to a MongoDB instance

## `/api/v1/system/dynatrace/validate`

Check that Davis is connected to a Dynatrace instance

# Events

## `/api/v1/events/problems`

### GET

Get help with webhook configuration

#### Response

```
{
  msg: 'Add the following to the web hook configuration.',
  uri: `/api/v1/events/problems/${token}/`,
  config: 'Example Dynatrace WebHook config'
}
```

### POST

Save a problem to the database and sends alerts to subscribed channels

#### Payload

```
{
  "PID": String,
  "ProblemID": String,
  "State": String,
  "ProblemImpact": String,
  "ProblemURL": String,
  "ImpactedEntity": String,
  "Tags": [String],
}
```

#### Response

N/A

# Alexa

## `/alexa`

This endpoint is for the amazon echo app.  If the Davis server has
the `production` environment variable set, any requests not sent from
the Amazon Alexa service will be rejected.  The feature requires Davis
to be running an a Linux server with OpenSSL.

# Watson

## `/api/v1/watson/:type(tts|stt)/token`

This endpoint is for the watson text to speech and speech to text services.