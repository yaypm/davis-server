"use strict";var __decorate=this&&this.__decorate||function(i,s,t,e){var a,o=arguments.length,c=o<3?s:null===e?e=Object.getOwnPropertyDescriptor(s,t):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)c=Reflect.decorate(i,s,t,e);else for(var n=i.length-1;n>=0;n--)(a=i[n])&&(c=(o<3?a(c):o>3?a(s,t,c):a(s,t))||c);return o>3&&c&&Object.defineProperty(s,t,c),c},__metadata=this&&this.__metadata||function(i,s){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(i,s)},core_1=require("@angular/core"),router_1=require("@angular/router"),davis_service_1=require("../../davis.service"),_=require("lodash"),ConfigSlackComponent=function(){function i(i,s){this.iDavis=i,this.router=s,this.myURL="",this.requestUri="",this.submitted=!1,this.submitButton=this.iDavis.isWizard?"Skip and Finish":"Create Davis Slack Bot",this.isPasswordFocused=!1,this.isPasswordMasked=!0,this.isDirty=!1,this.myURL="https://"+window.location.host,this.requestUri=this.myURL+"/slack/receive",this.iDavis.values.slack.redirectUri=this.myURL+"/oauth"}return i.prototype.validate=function(){this.iDavis.values.slack.clientId&&this.iDavis.values.slack.clientSecret?this.submitButton="Create Davis Slack Bot":!this.iDavis.config.slack.success&&this.iDavis.isWizard&&(this.submitButton="Skip and Finish"),this.isDirty=!_.isEqual(this.iDavis.values.slack,this.iDavis.values.original.slack)},i.prototype.doSubmit=function(){var i=this;!this.iDavis.config.slack.success&&this.iDavis.values.slack.clientId&&this.iDavis.values.slack.clientSecret?(this.submitButton="Saving...",this.iDavis.connectSlack().then(function(s){s.success?i.iDavis.startSlack().then(function(s){s.success?(sessionStorage.setItem("wizard-finished","true"),i.iDavis.config.slack.success=!0,i.iDavis.windowLocation(i.myURL)):(i.iDavis.config.slack.success=!1,i.iDavis.config.slack.error=s.message)},function(s){console.log(s),i.iDavis.config.slack.success=!1}):(i.iDavis.config.slack.success=!1,i.iDavis.config.slack.error=s.message)},function(s){console.log(s),i.iDavis.config.slack.success=!1}),this.submitted=!0):(sessionStorage.setItem("wizard-finished","true"),this.iDavis.windowLocation(this.myURL))},i.prototype.ngOnInit=function(){setTimeout(function(){document.getElementsByName("clientId")[0].focus(),new Clipboard(".clipboard")},200)},i}();ConfigSlackComponent=__decorate([core_1.Component({moduleId:module.id,selector:"config-slack",templateUrl:"./config-slack.component.html"}),__metadata("design:paramtypes",[davis_service_1.DavisService,router_1.Router])],ConfigSlackComponent),exports.ConfigSlackComponent=ConfigSlackComponent;
//# sourceMappingURL=../../../../maps/app/shared/config/config-slack/config-slack.component.js.map
