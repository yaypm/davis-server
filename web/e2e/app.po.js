"use strict";
var protractor_1 = require('protractor');
var DavisWizardPage = (function () {
    function DavisWizardPage() {
    }
    DavisWizardPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    DavisWizardPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return DavisWizardPage;
}());
exports.DavisWizardPage = DavisWizardPage;
//# sourceMappingURL=app.po.js.map