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

## `/api/v1/system/user`

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

## `/api/v1/system/user/:user_email`

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

## `/api/v1/system/user/timezones`

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

Check that DAVIS is connected to a MongoDB instance

## `/api/v1/system/dynatrace/validate`

Check that DAVIS is connected to a Dynatrace instance

# Events

## `/api/v1/events/problems`

### GET

Get help with webhook configuration

### POST

Save a problem to the database

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

## `/api/v1/alexa`

This endpoint is for the amazon echo app.

# Watson

## `/api/v1/watson/:type(tts|stt)/token`

This endpoint is for the watson text to speech and speech to text services.