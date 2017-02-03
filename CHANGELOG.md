<a name="0.10.0"></a>
# [0.10.0](https://github.com/Dynatrace/davis-server/compare/v0.9.0...v0.10.0) (2017-02-03)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/Dynatrace/davis-server/compare/v0.8.0...v0.9.0) (2017-02-02)


### Bug Fixes

* [#204](https://github.com/Dynatrace/davis-server/issues/204) raw request not saved through clarification step ([f160ab8](https://github.com/Dynatrace/davis-server/commit/f160ab8))
* In config-user, typing in the password input and deleting all characters still results in isDirty being true [#199](https://github.com/Dynatrace/davis-server/issues/199). config-user fails to initialize properly due to alexa_ids array being null in some cases [#198](https://github.com/Dynatrace/davis-server/issues/198) ([88707d3](https://github.com/Dynatrace/davis-server/commit/88707d3))
* In config-user, typing in the password input and deleting all characters still results in isDirty being true [#199](https://github.com/Dynatrace/davis-server/issues/199). config-user fails to initialize properly due to alexa_ids array being null in some cases [#198](https://github.com/Dynatrace/davis-server/issues/198) ([b962d91](https://github.com/Dynatrace/davis-server/commit/b962d91))
* Parse slack dates in the text field [#179](https://github.com/Dynatrace/davis-server/issues/179) ([7f84a3a](https://github.com/Dynatrace/davis-server/commit/7f84a3a))


### Features

* Add filter scope as description [#200](https://github.com/Dynatrace/davis-server/issues/200) ([b510d14](https://github.com/Dynatrace/davis-server/commit/b510d14))
* Add pager functionality, port problem and problemDetails ([abef11f](https://github.com/Dynatrace/davis-server/commit/abef11f))
* Add web ui configuration section for filters [#163](https://github.com/Dynatrace/davis-server/issues/163) ([186efce](https://github.com/Dynatrace/davis-server/commit/186efce))
* back to list from problem details ([75c9d4e](https://github.com/Dynatrace/davis-server/commit/75c9d4e))
* Restyle auth-login UI to match existing Dynatrace login UI [#186](https://github.com/Dynatrace/davis-server/issues/186) ([3edbd7d](https://github.com/Dynatrace/davis-server/commit/3edbd7d))
* Web UI should render footers on attachments [#175](https://github.com/Dynatrace/davis-server/issues/175) ([6e34a78](https://github.com/Dynatrace/davis-server/commit/6e34a78))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/Dynatrace/davis-server/compare/v0.7.2...v0.8.0) (2017-01-19)


### Bug Fixes

* Alexa wizard step is broken, unable to find user error returned [#115](https://github.com/Dynatrace/davis-server/issues/115) ([784eedb](https://github.com/Dynatrace/davis-server/commit/784eedb))
* Alexa wizard step is broken, unable to find user error returned [#115](https://github.com/Dynatrace/davis-server/issues/115) ([8fcfd44](https://github.com/Dynatrace/davis-server/commit/8fcfd44))
* Card field wrap bug ([e28c521](https://github.com/Dynatrace/davis-server/commit/e28c521))
* fix bug where Nlp did not respect timezone of duckling output ([b239f1f](https://github.com/Dynatrace/davis-server/commit/b239f1f))
* Fixed clipboard issue related to switching to Webpack ([2c59fe6](https://github.com/Dynatrace/davis-server/commit/2c59fe6))
* Fixed clipboard issue related to switching to Webpack ([eecbef8](https://github.com/Dynatrace/davis-server/commit/eecbef8))
* fixed crash if logLevel omitted from constructor ([7fb57e4](https://github.com/Dynatrace/davis-server/commit/7fb57e4))
* Forgot to uncomment section ([a7aa066](https://github.com/Dynatrace/davis-server/commit/a7aa066))
* Handle non 200 response codes from /api/v1/web calls [#119](https://github.com/Dynatrace/davis-server/issues/119) ([8f1f013](https://github.com/Dynatrace/davis-server/commit/8f1f013))
* Invalid routes break the page [#97](https://github.com/Dynatrace/davis-server/issues/97) ([6daeb89](https://github.com/Dynatrace/davis-server/commit/6daeb89))
* length of undefined fixed ([9aad263](https://github.com/Dynatrace/davis-server/commit/9aad263))
* made "the second 1" route to 2 ([7df6af4](https://github.com/Dynatrace/davis-server/commit/7df6af4))
* Minor bug related to recent changes to breadcrumbs ([ffe07af](https://github.com/Dynatrace/davis-server/commit/ffe07af))
* No longer displays visual.text and visual.card.text at same time ([e94278a](https://github.com/Dynatrace/davis-server/commit/e94278a))
* problem follow up if there are no problems ([#124](https://github.com/Dynatrace/davis-server/issues/124)) ([7517eeb](https://github.com/Dynatrace/davis-server/commit/7517eeb))
* Safari and Chrome-iOS do not update Angular bound values when autocomplete is used [#141](https://github.com/Dynatrace/davis-server/issues/141) ([cb7cfed](https://github.com/Dynatrace/davis-server/commit/cb7cfed))
* Secured problem event endpoint. ([2bbd518](https://github.com/Dynatrace/davis-server/commit/2bbd518)), closes [#108](https://github.com/Dynatrace/davis-server/issues/108)
* stop exchanges from double building on multi-depth exchanges ([#165](https://github.com/Dynatrace/davis-server/issues/165)) ([93c9478](https://github.com/Dynatrace/davis-server/commit/93c9478))
* There are currently git merge conflict markers checked into dev in the web directory [#136](https://github.com/Dynatrace/davis-server/issues/136) ([64c24c3](https://github.com/Dynatrace/davis-server/commit/64c24c3))
* Timezone no longer saves during wizard [#148](https://github.com/Dynatrace/davis-server/issues/148). feat: Port v1 web UI to Angular 2. Web Cards working [#56](https://github.com/Dynatrace/davis-server/issues/56). ([671f588](https://github.com/Dynatrace/davis-server/commit/671f588))
* Unable to add new users [#153](https://github.com/Dynatrace/davis-server/issues/153) ([5ccef95](https://github.com/Dynatrace/davis-server/commit/5ccef95))
* Update the Dynatrace Help Link [#102](https://github.com/Dynatrace/davis-server/issues/102). Redirect unauthorized users to the login page immediately [#98](https://github.com/Dynatrace/davis-server/issues/98). All hyperlinks should open a new tab [#96](https://github.com/Dynatrace/davis-server/issues/96). ([4962b7c](https://github.com/Dynatrace/davis-server/commit/4962b7c))
* Updated the routing regex to be case insensitive ([eda1d84](https://github.com/Dynatrace/davis-server/commit/eda1d84)), closes [#152](https://github.com/Dynatrace/davis-server/issues/152)
* Web UI has blank white screen on Android Chrome [#105](https://github.com/Dynatrace/davis-server/issues/105). feat: Create unique routes for each config option [#100](https://github.com/Dynatrace/davis-server/issues/100). ([b371294](https://github.com/Dynatrace/davis-server/commit/b371294))
* When adding a new user fails, the users list in Edit Users includes the logged in user [#133](https://github.com/Dynatrace/davis-server/issues/133), fix: Davis web interface does not auto scroll to bottom of page when switching between pages and returning [#132](https://github.com/Dynatrace/davis-server/issues/132), fix: Unable to set a user as admin [#120](https://github.com/Dynatrace/davis-server/issues/120), feat: Add a link to the change log [#127](https://github.com/Dynatrace/davis-server/issues/127) ([903aa6e](https://github.com/Dynatrace/davis-server/commit/903aa6e))
* Workaround for serverside bug related to responding to multiple choice with uppercase first letter (Second vs second) ([c42f42e](https://github.com/Dynatrace/davis-server/commit/c42f42e))


### Features

* Add a loading screen to the web UI. [#99](https://github.com/Dynatrace/davis-server/issues/99) ([a97c8e5](https://github.com/Dynatrace/davis-server/commit/a97c8e5))
* Add additional Dynatrace API options [#112](https://github.com/Dynatrace/davis-server/issues/112) ([f26339d](https://github.com/Dynatrace/davis-server/commit/f26339d))
* Add mode for iFrame tile (hide navbars) [#118](https://github.com/Dynatrace/davis-server/issues/118). Replaced root cause emoji with text. Fixed date capitilization issue in web cards. ([d5f5f59](https://github.com/Dynatrace/davis-server/commit/d5f5f59))
* Add session tagging [#155](https://github.com/Dynatrace/davis-server/issues/155). feat: For mobile users, improve /davis layout [#140](https://github.com/Dynatrace/davis-server/issues/140). Added enter button to davisInput ([1d95643](https://github.com/Dynatrace/davis-server/commit/1d95643))
* add templates for issues, pull requests, and contributing ([7171e2b](https://github.com/Dynatrace/davis-server/commit/7171e2b))
* Added a get version API endpoint. ([4375189](https://github.com/Dynatrace/davis-server/commit/4375189))
* Added compression to express response. ([03471b6](https://github.com/Dynatrace/davis-server/commit/03471b6)), closes [#107](https://github.com/Dynatrace/davis-server/issues/107)
* Cache timezones [#121](https://github.com/Dynatrace/davis-server/issues/121) ([f99db9b](https://github.com/Dynatrace/davis-server/commit/f99db9b))
* Enable Dynatrace UEM Support [#101](https://github.com/Dynatrace/davis-server/issues/101) ([3383a07](https://github.com/Dynatrace/davis-server/commit/3383a07))
* Enable Dynatrace UEM Support [#101](https://github.com/Dynatrace/davis-server/issues/101) ([9b4ff0d](https://github.com/Dynatrace/davis-server/commit/9b4ff0d))
* enforce minium password length of 6 ([c19807d](https://github.com/Dynatrace/davis-server/commit/c19807d)), closes [#149](https://github.com/Dynatrace/davis-server/issues/149)
* For mobile users, improve /davis layout. Timestamp added [#140](https://github.com/Dynatrace/davis-server/issues/140) ([82bfe52](https://github.com/Dynatrace/davis-server/commit/82bfe52))
* If config is already set, wizard should autopopulate fields [#88](https://github.com/Dynatrace/davis-server/issues/88) ([aea2c0e](https://github.com/Dynatrace/davis-server/commit/aea2c0e))
* much more helpful help ([f864ab3](https://github.com/Dynatrace/davis-server/commit/f864ab3))
* problemNotification uses VisualBuilder and buttons ([e23ff7e](https://github.com/Dynatrace/davis-server/commit/e23ff7e))
* Redirect user to initial desired location after login [#114](https://github.com/Dynatrace/davis-server/issues/114) ([7ff3f7b](https://github.com/Dynatrace/davis-server/commit/7ff3f7b))
* Redirect user to initial desired location after login [#114](https://github.com/Dynatrace/davis-server/issues/114) ([4fc1d59](https://github.com/Dynatrace/davis-server/commit/4fc1d59))
* Update the menu when the user is in the settings page [#164](https://github.com/Dynatrace/davis-server/issues/164). feat: Add web ui configuration section for filters [#163](https://github.com/Dynatrace/davis-server/issues/163). Started filters section ([c0274e5](https://github.com/Dynatrace/davis-server/commit/c0274e5))
* Use the Dynatrace Groundhog CDN instead of referencing locally [#138](https://github.com/Dynatrace/davis-server/issues/138) ([607687b](https://github.com/Dynatrace/davis-server/commit/607687b))
* VisualBuilder class builds responses for visual clients ([d27d451](https://github.com/Dynatrace/davis-server/commit/d27d451))
* webpack builds ([1de49ee](https://github.com/Dynatrace/davis-server/commit/1de49ee))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/Dynatrace/davis-server/compare/v0.7.1...v0.7.2) (2016-12-27)


### Bug Fixes

* Removed a race condition from the Nlp module ([#103](https://github.com/Dynatrace/davis-server/issues/103)) ([332ab64](https://github.com/Dynatrace/davis-server/commit/332ab64))


<a name="0.7.1"></a>
## [0.7.1](https://github.com/Dynatrace/davis-server/compare/v0.6.3...v0.7.1) (2016-12-22)


### Bug Fixes

* typescript compile issue ([08d4839](https://github.com/Dynatrace/davis-server/commit/08d4839))


<a name="0.7.0"></a>
# [0.7.0](https://github.com/Dynatrace/davis-server/compare/v0.6.3...v0.7.0) (2016-12-22)


### Bug Fixes

* datetimes now always respect timezones ([64446a7](https://github.com/Dynatrace/davis-server/commit/64446a7))
* enforce exchange maximum recursion depth ([#81](https://github.com/Dynatrace/davis-server/issues/81)) ([81faa11](https://github.com/Dynatrace/davis-server/commit/81faa11))
* Last and middle routing commands are now handled correctly. ([9b3dee3](https://github.com/Dynatrace/davis-server/commit/9b3dee3)), closes [#92](https://github.com/Dynatrace/davis-server/issues/92)
* Resolved a templating issue affecting single infrastructure issues. ([c3992fe](https://github.com/Dynatrace/davis-server/commit/c3992fe))


### Features

* add meaningful responses to did you mean ([#78](https://github.com/Dynatrace/davis-server/issues/78)) ([82e02d9](https://github.com/Dynatrace/davis-server/commit/82e02d9))
* added /api/v1/system/info endpoint ([b23dc92](https://github.com/Dynatrace/davis-server/commit/b23dc92))
* Database migrations ([4625324](https://github.com/Dynatrace/davis-server/commit/4625324))
* save classifiers to disk for fast loading ([0dd3df5](https://github.com/Dynatrace/davis-server/commit/0dd3df5))
* showMe intent pushes arbitrary links to browser ([#87](https://github.com/Dynatrace/davis-server/issues/87)) ([fc82e66](https://github.com/Dynatrace/davis-server/commit/fc82e66))
* trim user input on insertion to database ([#83](https://github.com/Dynatrace/davis-server/issues/83)) ([1aa6123](https://github.com/Dynatrace/davis-server/commit/1aa6123))
* Updated web UI to Groundhog components ([1041919](https://github.com/Dynatrace/davis-server/commit/1041919))
* web API returns all response types ([fb4775f](https://github.com/Dynatrace/davis-server/commit/fb4775f))

