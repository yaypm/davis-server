"use strict";
var app_po_1 = require('./app.po');
describe('wizard App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.DavisWizardPage();
    });
    it('should display message saying app works', function () {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
//# sourceMappingURL=app.e2e-spec.js.map