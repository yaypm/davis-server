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

