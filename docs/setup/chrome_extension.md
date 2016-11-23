**Chrome Extension**

The chrome extension allows a user to push URLs to chrome using an Alexa device.

*Prerequisites*
- A computer with the Chrome browser
- [Alexa configured in Davis](https://github.com/Dynatrace/davis-server#echo-setup-more)

*Installing the plugin*

1. Make a copy of the chromeExtension folder.  This can be found at the root of davis-server.
2. open chrome settings and navigate the the extensions tab.
3. Enabled developer mode.
4. click load unpacked extension and select the chromeExtension folder in the directory explorer.

![extension](https://github.com/Dynatrace/davis-server/blob/master/setup/images/chrome-extensions.png)

*Configuring the extension*

Configuring the chrome extension is easy.  Simply open the options menu from the extension page or by right clicking on the Dynatrace Davis extension icon.

![options](https://github.com/Dynatrace/davis-server/blob/master/setup/images/nav-to-options.png)

Now simply add your Davis server URL and the [same Alexa ID](https://github.com/Dynatrace/davis-server#echo-setup-more) used in your configuration.

![config](https://github.com/Dynatrace/davis-server/blob/master/setup/images/extension-config.png)