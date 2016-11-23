var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/wizard/wizard-base/wizard.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/shared/config.service';
import * as import9 from '@angular/router/src/router';
export var Wrapper_WizardComponent = (function () {
    function Wrapper_WizardComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.WizardComponent(p0, p1);
    }
    Wrapper_WizardComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_WizardComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_WizardComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_WizardComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_WizardComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_WizardComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_WizardComponent;
}());
var renderType_WizardComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_WizardComponent_Host0 = (function (_super) {
    __extends(View_WizardComponent_Host0, _super);
    function View_WizardComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_WizardComponent_Host0, renderType_WizardComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_WizardComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'wizard', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_WizardComponent0(this.viewUtils, this, 0, this._el_0);
        this._WizardComponent_0_3 = new Wrapper_WizardComponent(this.injectorGet(import8.ConfigService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._WizardComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._WizardComponent_0_3.context);
    };
    View_WizardComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.WizardComponent) && (0 === requestNodeIndex))) {
            return this._WizardComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_WizardComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._WizardComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_WizardComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_WizardComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_WizardComponent_Host0;
}(import1.AppView));
export var WizardComponentNgFactory = new import7.ComponentFactory('wizard', View_WizardComponent_Host0, import0.WizardComponent);
var styles_WizardComponent = [];
var renderType_WizardComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, styles_WizardComponent, {});
export var View_WizardComponent0 = (function (_super) {
    __extends(View_WizardComponent0, _super);
    function View_WizardComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_WizardComponent0, renderType_WizardComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_WizardComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'wizard-step'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n  ', null);
        this._text_2 = this.renderer.createText(this._el_0, '\n', null);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._text_2
        ]), null);
        return null;
    };
    return View_WizardComponent0;
}(import1.AppView));
//# sourceMappingURL=wizard.component.ngfactory.js.map