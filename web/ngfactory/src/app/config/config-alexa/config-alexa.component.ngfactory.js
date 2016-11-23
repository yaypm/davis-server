var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/config/config-alexa/config-alexa.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/config/config.service';
import * as import9 from '@angular/router/src/router';
import * as import10 from '@angular/core/src/linker/view_container';
import * as import11 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import12 from '../../../../node_modules/@angular/forms/src/directives/ng_form.ngfactory';
import * as import13 from '../../../../node_modules/@angular/forms/src/directives/ng_control_status.ngfactory';
import * as import14 from '../../../../node_modules/@angular/forms/src/directives/default_value_accessor.ngfactory';
import * as import15 from '../../../../node_modules/@angular/forms/src/directives/ng_model.ngfactory';
import * as import16 from '@angular/core/src/change_detection/change_detection_util';
import * as import17 from '@angular/core/src/linker/template_ref';
import * as import18 from '@angular/core/src/linker/element_ref';
import * as import19 from '@angular/common/src/directives/ng_if';
import * as import20 from '@angular/forms/src/directives/default_value_accessor';
import * as import21 from '@angular/forms/src/directives/control_value_accessor';
import * as import22 from '@angular/forms/src/directives/ng_model';
import * as import23 from '@angular/forms/src/directives/ng_control';
import * as import24 from '@angular/forms/src/directives/ng_control_status';
import * as import25 from '@angular/forms/src/directives/ng_form';
import * as import26 from '@angular/forms/src/directives/control_container';
export var Wrapper_ConfigAlexaComponent = (function () {
    function Wrapper_ConfigAlexaComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.ConfigAlexaComponent(p0, p1);
    }
    Wrapper_ConfigAlexaComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_ConfigAlexaComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_ConfigAlexaComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_ConfigAlexaComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_ConfigAlexaComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_ConfigAlexaComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_ConfigAlexaComponent;
}());
var renderType_ConfigAlexaComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_ConfigAlexaComponent_Host0 = (function (_super) {
    __extends(View_ConfigAlexaComponent_Host0, _super);
    function View_ConfigAlexaComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigAlexaComponent_Host0, renderType_ConfigAlexaComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_ConfigAlexaComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'config-alexa', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_ConfigAlexaComponent0(this.viewUtils, this, 0, this._el_0);
        this._ConfigAlexaComponent_0_3 = new Wrapper_ConfigAlexaComponent(this.injectorGet(import8.ConfigService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._ConfigAlexaComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._ConfigAlexaComponent_0_3.context);
    };
    View_ConfigAlexaComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.ConfigAlexaComponent) && (0 === requestNodeIndex))) {
            return this._ConfigAlexaComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_ConfigAlexaComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._ConfigAlexaComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_ConfigAlexaComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_ConfigAlexaComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigAlexaComponent_Host0;
}(import1.AppView));
export var ConfigAlexaComponentNgFactory = new import7.ComponentFactory('config-alexa', View_ConfigAlexaComponent_Host0, import0.ConfigAlexaComponent);
var styles_ConfigAlexaComponent = [];
var renderType_ConfigAlexaComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, styles_ConfigAlexaComponent, {});
export var View_ConfigAlexaComponent0 = (function (_super) {
    __extends(View_ConfigAlexaComponent0, _super);
    function View_ConfigAlexaComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigAlexaComponent0, renderType_ConfigAlexaComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
        this._expr_44 = import16.UNINITIALIZED;
        this._expr_45 = import16.UNINITIALIZED;
    }
    View_ConfigAlexaComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'page'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0, null);
        this._vc_2 = new import10.ViewContainer(2, 0, this, this._anchor_2);
        this._TemplateRef_2_5 = new import17.TemplateRef_(this, 2, this._anchor_2);
        this._NgIf_2_6 = new import11.Wrapper_NgIf(this._vc_2.vcRef, this._TemplateRef_2_5);
        this._text_3 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'title'), null);
        this._text_5 = this.renderer.createText(this._el_4, '\n        Connect to Amazon Alexa\n    ', null);
        this._text_6 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'content'), null);
        this._text_8 = this.renderer.createText(this._el_7, '\n        ', null);
        this._el_9 = import3.createRenderElement(this.renderer, this._el_7, 'form', import3.EMPTY_INLINE_ARRAY, null);
        this._NgForm_9_3 = new import12.Wrapper_NgForm(null, null);
        this._ControlContainer_9_4 = this._NgForm_9_3.context;
        this._NgControlStatusGroup_9_5 = new import13.Wrapper_NgControlStatusGroup(this._ControlContainer_9_4);
        this._text_10 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_11 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_12 = this.renderer.createText(this._el_11, '\n                ', null);
        this._el_13 = import3.createRenderElement(this.renderer, this._el_11, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_14 = this.renderer.createText(this._el_13, '\n                    ', null);
        this._el_15 = import3.createRenderElement(this.renderer, this._el_13, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_16 = this.renderer.createText(this._el_15, 'Alexa User ID', null);
        this._text_17 = this.renderer.createText(this._el_13, '\n                    ', null);
        this._el_18 = import3.createRenderElement(this.renderer, this._el_13, 'input', new import3.InlineArray8(8, 'autofocus', '', 'name', 'alexa', 'placeholder', 'amzn1.ask.account.AFP3ZWPOS2BGJR7OWZPO1SFXEQ...', 'type', 'text'), null);
        this._DefaultValueAccessor_18_3 = new import14.Wrapper_DefaultValueAccessor(this.renderer, new import18.ElementRef(this._el_18));
        this._NG_VALUE_ACCESSOR_18_4 = [this._DefaultValueAccessor_18_3.context];
        this._NgModel_18_5 = new import15.Wrapper_NgModel(this._ControlContainer_9_4, null, null, this._NG_VALUE_ACCESSOR_18_4);
        this._NgControl_18_6 = this._NgModel_18_5.context;
        this._NgControlStatus_18_7 = new import13.Wrapper_NgControlStatus(this._NgControl_18_6);
        this._text_19 = this.renderer.createText(this._el_13, '\n                ', null);
        this._text_20 = this.renderer.createText(this._el_11, '\n            ', null);
        this._text_21 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_22 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_23 = this.renderer.createText(this._el_22, '\n                ', null);
        this._el_24 = import3.createRenderElement(this.renderer, this._el_22, 'div', new import3.InlineArray2(2, 'class', 'flex-item next'), null);
        this._text_25 = this.renderer.createText(this._el_24, '\n                    ', null);
        this._el_26 = import3.createRenderElement(this.renderer, this._el_24, 'button', new import3.InlineArray4(4, 'class', 'nextBtn', 'type', 'submit'), null);
        this._text_27 = this.renderer.createText(this._el_26, '', null);
        this._text_28 = this.renderer.createText(this._el_24, '\n                ', null);
        this._text_29 = this.renderer.createText(this._el_22, '\n            ', null);
        this._text_30 = this.renderer.createText(this._el_9, '\n        ', null);
        this._text_31 = this.renderer.createText(this._el_7, '\n    ', null);
        this._text_32 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_9, new import3.InlineArray4(4, 'submit', null, 'reset', null), this.eventHandler(this.handleEvent_9));
        var disposable_1 = import3.subscribeToRenderElement(this, this._el_18, new import3.InlineArray8(8, 'ngModelChange', null, 'keyup', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_18));
        this._NgModel_18_5.subscribe(this, this.eventHandler(this.handleEvent_18), true);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._anchor_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._el_9,
            this._text_10,
            this._el_11,
            this._text_12,
            this._el_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._text_17,
            this._el_18,
            this._text_19,
            this._text_20,
            this._text_21,
            this._el_22,
            this._text_23,
            this._el_24,
            this._text_25,
            this._el_26,
            this._text_27,
            this._text_28,
            this._text_29,
            this._text_30,
            this._text_31,
            this._text_32
        ]), [
            disposable_0,
            disposable_1
        ]);
        return null;
    };
    View_ConfigAlexaComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import17.TemplateRef) && (2 === requestNodeIndex))) {
            return this._TemplateRef_2_5;
        }
        if (((token === import19.NgIf) && (2 === requestNodeIndex))) {
            return this._NgIf_2_6.context;
        }
        if (((token === import20.DefaultValueAccessor) && (18 === requestNodeIndex))) {
            return this._DefaultValueAccessor_18_3.context;
        }
        if (((token === import21.NG_VALUE_ACCESSOR) && (18 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_18_4;
        }
        if (((token === import22.NgModel) && (18 === requestNodeIndex))) {
            return this._NgModel_18_5.context;
        }
        if (((token === import23.NgControl) && (18 === requestNodeIndex))) {
            return this._NgControl_18_6;
        }
        if (((token === import24.NgControlStatus) && (18 === requestNodeIndex))) {
            return this._NgControlStatus_18_7.context;
        }
        if (((token === import25.NgForm) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 30)))) {
            return this._NgForm_9_3.context;
        }
        if (((token === import26.ControlContainer) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 30)))) {
            return this._ControlContainer_9_4;
        }
        if (((token === import24.NgControlStatusGroup) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 30)))) {
            return this._NgControlStatusGroup_9_5.context;
        }
        return notFoundResult;
    };
    View_ConfigAlexaComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_2_0_0 = this.context.configService.isWizard;
        this._NgIf_2_6.check_ngIf(currVal_2_0_0, throwOnChange, false);
        this._NgIf_2_6.ngDoCheck(this, this._anchor_2, throwOnChange);
        this._NgForm_9_3.ngDoCheck(this, this._el_9, throwOnChange);
        this._NgControlStatusGroup_9_5.ngDoCheck(this, this._el_9, throwOnChange);
        this._DefaultValueAccessor_18_3.ngDoCheck(this, this._el_18, throwOnChange);
        var currVal_18_1_0 = 'alexa';
        this._NgModel_18_5.check_name(currVal_18_1_0, throwOnChange, false);
        var currVal_18_1_1 = this.context.configService.values.alexa_ids;
        this._NgModel_18_5.check_model(currVal_18_1_1, throwOnChange, false);
        this._NgModel_18_5.ngDoCheck(this, this._el_18, throwOnChange);
        this._NgControlStatus_18_7.ngDoCheck(this, this._el_18, throwOnChange);
        this._vc_2.detectChangesInNestedViews(throwOnChange);
        this._NgControlStatusGroup_9_5.checkHost(this, this, this._el_9, throwOnChange);
        this._NgControlStatus_18_7.checkHost(this, this, this._el_18, throwOnChange);
        var currVal_44 = (this.context.buttonText === 'Skip');
        if (import3.checkBinding(throwOnChange, this._expr_44, currVal_44)) {
            this.renderer.setElementClass(this._el_26, 'warning', currVal_44);
            this._expr_44 = currVal_44;
        }
        var currVal_45 = import3.inlineInterpolate(1, '', this.context.buttonText, '');
        if (import3.checkBinding(throwOnChange, this._expr_45, currVal_45)) {
            this.renderer.setText(this._text_27, currVal_45);
            this._expr_45 = currVal_45;
        }
    };
    View_ConfigAlexaComponent0.prototype.destroyInternal = function () {
        this._vc_2.destroyNestedViews();
        this._NgModel_18_5.ngOnDestroy();
        this._NgForm_9_3.ngOnDestroy();
    };
    View_ConfigAlexaComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 2)) {
            return new View_ConfigAlexaComponent1(this.viewUtils, this, 2, this._anchor_2, this._vc_2);
        }
        return null;
    };
    View_ConfigAlexaComponent0.prototype.handleEvent_9 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._NgForm_9_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'submit')) {
            var pd_sub_0 = (this.context.doSubmit() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_ConfigAlexaComponent0.prototype.handleEvent_18 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_18_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.configService.values.alexa_ids = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'keyup')) {
            var pd_sub_1 = (this.context.validate() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    return View_ConfigAlexaComponent0;
}(import1.AppView));
var View_ConfigAlexaComponent1 = (function (_super) {
    __extends(View_ConfigAlexaComponent1, _super);
    function View_ConfigAlexaComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigAlexaComponent1, renderType_ConfigAlexaComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigAlexaComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'div', new import3.InlineArray2(2, 'class', 'step'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n        Step 3 of 4\n    ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigAlexaComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigAlexaComponent1;
}(import1.AppView));
//# sourceMappingURL=config-alexa.component.ngfactory.js.map