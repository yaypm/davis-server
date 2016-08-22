**Watson**

*You will need to obtain a Bluemix username, password, and token to be able to interact with the IBM Watson service that is powering the Speech To Text in the Web UI version of DAVIS. Navigate to [IBM Bluemix](https://console.ng.bluemix.net/catalog/services/speech-to-text) and create a free IBM Bluemix acccount.*

- [Create IBM Bluemix Account](https://new-console.ng.bluemix.net/)
- Create a Bluemix Organization (davis-ai)
- Create a Bluemix Space (davis)
	
![Watson](https://s3.amazonaws.com/davis-project/docs/watson-organization.png)

- Browse the Bluemix Catalog or search for Speech-To-Text
- Create the Speech-To-Text service and obtain Service Credentials
	
![Watson](https://s3.amazonaws.com/davis-project/docs/watson-speech.png)

*Your speech to text credential file will look similar to the following:*

````javascript
{
  "credentials": {
    "url": "https://stream.watsonplatform.net/speech-to-text/api",
    "password": "AbcDeFghiJk",
    "username": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee"
  }
}
````

*Your text to speech credential file will look similar to the following (notice the URL change:*

````javascript
{
  "credentials": {
    "url": "https://stream.watsonplatform.net/speech-to-text/api",
    "password": "AbcDeFghiJk",
    "username": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee"
  }
}
````

Save your generated tokens to your config.js file
