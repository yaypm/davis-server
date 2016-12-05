var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/config/config-dynatrace/config-dynatrace.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/config/config.service';
import * as import9 from '@angular/router/src/router';
import * as import10 from './config-dynatrace.component.css.shim';
import * as import11 from '@angular/core/src/linker/view_container';
import * as import12 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import13 from '../../../../node_modules/@angular/forms/src/directives/ng_form.ngfactory';
import * as import14 from '../../../../node_modules/@angular/forms/src/directives/ng_control_status.ngfactory';
import * as import15 from '../../../../node_modules/@angular/forms/src/directives/default_value_accessor.ngfactory';
import * as import16 from '../../../../node_modules/@angular/forms/src/directives/validators.ngfactory';
import * as import17 from '../../../../node_modules/@angular/forms/src/directives/ng_model.ngfactory';
import * as import18 from '@angular/core/src/linker/template_ref';
import * as import19 from '@angular/core/src/linker/element_ref';
import * as import20 from '@angular/common/src/directives/ng_if';
import * as import21 from '@angular/forms/src/directives/default_value_accessor';
import * as import22 from '@angular/forms/src/directives/validators';
import * as import23 from '@angular/forms/src/validators';
import * as import24 from '@angular/forms/src/directives/control_value_accessor';
import * as import25 from '@angular/forms/src/directives/ng_model';
import * as import26 from '@angular/forms/src/directives/ng_control';
import * as import27 from '@angular/forms/src/directives/ng_control_status';
import * as import28 from '@angular/forms/src/directives/ng_form';
import * as import29 from '@angular/forms/src/directives/control_container';
import * as import30 from '@angular/core/src/change_detection/change_detection_util';
export var Wrapper_ConfigDynatraceComponent = (function () {
    function Wrapper_ConfigDynatraceComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.ConfigDynatraceComponent(p0, p1);
    }
    Wrapper_ConfigDynatraceComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_ConfigDynatraceComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_ConfigDynatraceComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_ConfigDynatraceComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_ConfigDynatraceComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_ConfigDynatraceComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_ConfigDynatraceComponent;
}());
var renderType_ConfigDynatraceComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_ConfigDynatraceComponent_Host0 = (function (_super) {
    __extends(View_ConfigDynatraceComponent_Host0, _super);
    function View_ConfigDynatraceComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigDynatraceComponent_Host0, renderType_ConfigDynatraceComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_ConfigDynatraceComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'config-dynatrace', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_ConfigDynatraceComponent0(this.viewUtils, this, 0, this._el_0);
        this._ConfigDynatraceComponent_0_3 = new Wrapper_ConfigDynatraceComponent(this.injectorGet(import8.ConfigService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._ConfigDynatraceComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._ConfigDynatraceComponent_0_3.context);
    };
    View_ConfigDynatraceComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.ConfigDynatraceComponent) && (0 === requestNodeIndex))) {
            return this._ConfigDynatraceComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_ConfigDynatraceComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._ConfigDynatraceComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_ConfigDynatraceComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_ConfigDynatraceComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigDynatraceComponent_Host0;
}(import1.AppView));
export var ConfigDynatraceComponentNgFactory = new import7.ComponentFactory('config-dynatrace', View_ConfigDynatraceComponent_Host0, import0.ConfigDynatraceComponent);
var styles_ConfigDynatraceComponent = [import10.styles];
var renderType_ConfigDynatraceComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.Emulated, styles_ConfigDynatraceComponent, {});
export var View_ConfigDynatraceComponent0 = (function (_super) {
    __extends(View_ConfigDynatraceComponent0, _super);
    function View_ConfigDynatraceComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigDynatraceComponent0, renderType_ConfigDynatraceComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_ConfigDynatraceComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'page'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0, null);
        this._vc_2 = new import11.ViewContainer(2, 0, this, this._anchor_2);
        this._TemplateRef_2_5 = new import18.TemplateRef_(this, 2, this._anchor_2);
        this._NgIf_2_6 = new import12.Wrapper_NgIf(this._vc_2.vcRef, this._TemplateRef_2_5);
        this._text_3 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'title'), null);
        this._text_5 = this.renderer.createText(this._el_4, '\n        Connect to Dynatrace\n    ', null);
        this._text_6 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'content'), null);
        this._text_8 = this.renderer.createText(this._el_7, '\n        ', null);
        this._el_9 = import3.createRenderElement(this.renderer, this._el_7, 'form', import3.EMPTY_INLINE_ARRAY, null);
        this._NgForm_9_3 = new import13.Wrapper_NgForm(null, null);
        this._ControlContainer_9_4 = this._NgForm_9_3.context;
        this._NgControlStatusGroup_9_5 = new import14.Wrapper_NgControlStatusGroup(this._ControlContainer_9_4);
        this._text_10 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_11 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_11 = new import11.ViewContainer(11, 9, this, this._anchor_11);
        this._TemplateRef_11_5 = new import18.TemplateRef_(this, 11, this._anchor_11);
        this._NgIf_11_6 = new import12.Wrapper_NgIf(this._vc_11.vcRef, this._TemplateRef_11_5);
        this._text_12 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_13 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_14 = this.renderer.createText(this._el_13, '\n                ', null);
        this._el_15 = import3.createRenderElement(this.renderer, this._el_13, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_16 = this.renderer.createText(this._el_15, '\n                    ', null);
        this._el_17 = import3.createRenderElement(this.renderer, this._el_15, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_18 = this.renderer.createText(this._el_17, 'Dynatrace Tenant URL', null);
        this._text_19 = this.renderer.createText(this._el_15, '\n                    ', null);
        this._el_20 = import3.createRenderElement(this.renderer, this._el_15, 'input', new import3.InlineArray16(10, 'autofocus', '', 'name', 'url', 'placeholder', 'https://qwefgmasd.live.dynatrace.com', 'required', '', 'type', 'text'), null);
        this._DefaultValueAccessor_20_3 = new import15.Wrapper_DefaultValueAccessor(this.renderer, new import19.ElementRef(this._el_20));
        this._RequiredValidator_20_4 = new import16.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_20_5 = [this._RequiredValidator_20_4.context];
        this._NG_VALUE_ACCESSOR_20_6 = [this._DefaultValueAccessor_20_3.context];
        this._NgModel_20_7 = new import17.Wrapper_NgModel(this._ControlContainer_9_4, this._NG_VALIDATORS_20_5, null, this._NG_VALUE_ACCESSOR_20_6);
        this._NgControl_20_8 = this._NgModel_20_7.context;
        this._NgControlStatus_20_9 = new import14.Wrapper_NgControlStatus(this._NgControl_20_8);
        this._text_21 = this.renderer.createText(this._el_15, '\n                ', null);
        this._text_22 = this.renderer.createText(this._el_13, '\n            ', null);
        this._text_23 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_24 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_25 = this.renderer.createText(this._el_24, '\n                ', null);
        this._el_26 = import3.createRenderElement(this.renderer, this._el_24, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_27 = this.renderer.createText(this._el_26, '\n                    ', null);
        this._el_28 = import3.createRenderElement(this.renderer, this._el_26, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_29 = this.renderer.createText(this._el_28, 'Dynatrace API Token', null);
        this._text_30 = this.renderer.createText(this._el_26, '\n                    ', null);
        this._el_31 = import3.createRenderElement(this.renderer, this._el_26, 'input', new import3.InlineArray8(8, 'name', 'token', 'placeholder', 'IYVTz0nBSkZdsQOhS7W3P', 'required', '', 'type', 'text'), null);
        this._DefaultValueAccessor_31_3 = new import15.Wrapper_DefaultValueAccessor(this.renderer, new import19.ElementRef(this._el_31));
        this._RequiredValidator_31_4 = new import16.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_31_5 = [this._RequiredValidator_31_4.context];
        this._NG_VALUE_ACCESSOR_31_6 = [this._DefaultValueAccessor_31_3.context];
        this._NgModel_31_7 = new import17.Wrapper_NgModel(this._ControlContainer_9_4, this._NG_VALIDATORS_31_5, null, this._NG_VALUE_ACCESSOR_31_6);
        this._NgControl_31_8 = this._NgModel_31_7.context;
        this._NgControlStatus_31_9 = new import14.Wrapper_NgControlStatus(this._NgControl_31_8);
        this._text_32 = this.renderer.createText(this._el_26, '\n                ', null);
        this._text_33 = this.renderer.createText(this._el_24, '\n            ', null);
        this._text_34 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_35 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_36 = this.renderer.createText(this._el_35, '\n                ', null);
        this._el_37 = import3.createRenderElement(this.renderer, this._el_35, 'div', new import3.InlineArray2(2, 'class', 'flex-item next'), null);
        this._text_38 = this.renderer.createText(this._el_37, '\n                    ', null);
        this._el_39 = import3.createRenderElement(this.renderer, this._el_37, 'button', new import3.InlineArray4(4, 'class', 'nextBtn', 'type', 'submit'), null);
        this._text_40 = this.renderer.createText(this._el_39, 'Continue', null);
        this._text_41 = this.renderer.createText(this._el_37, '\n                ', null);
        this._text_42 = this.renderer.createText(this._el_35, '\n            ', null);
        this._text_43 = this.renderer.createText(this._el_9, '\n        ', null);
        this._text_44 = this.renderer.createText(this._el_7, '\n    ', null);
        this._text_45 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_9, new import3.InlineArray4(4, 'submit', null, 'reset', null), this.eventHandler(this.handleEvent_9));
        var disposable_1 = import3.subscribeToRenderElement(this, this._el_20, new import3.InlineArray8(6, 'ngModelChange', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_20));
        this._NgModel_20_7.subscribe(this, this.eventHandler(this.handleEvent_20), true);
        var disposable_2 = import3.subscribeToRenderElement(this, this._el_31, new import3.InlineArray8(6, 'ngModelChange', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_31));
        this._NgModel_31_7.subscribe(this, this.eventHandler(this.handleEvent_31), true);
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
            this._anchor_11,
            this._text_12,
            this._el_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._el_17,
            this._text_18,
            this._text_19,
            this._el_20,
            this._text_21,
            this._text_22,
            this._text_23,
            this._el_24,
            this._text_25,
            this._el_26,
            this._text_27,
            this._el_28,
            this._text_29,
            this._text_30,
            this._el_31,
            this._text_32,
            this._text_33,
            this._text_34,
            this._el_35,
            this._text_36,
            this._el_37,
            this._text_38,
            this._el_39,
            this._text_40,
            this._text_41,
            this._text_42,
            this._text_43,
            this._text_44,
            this._text_45
        ]), [
            disposable_0,
            disposable_1,
            disposable_2
        ]);
        return null;
    };
    View_ConfigDynatraceComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import18.TemplateRef) && (2 === requestNodeIndex))) {
            return this._TemplateRef_2_5;
        }
        if (((token === import20.NgIf) && (2 === requestNodeIndex))) {
            return this._NgIf_2_6.context;
        }
        if (((token === import18.TemplateRef) && (11 === requestNodeIndex))) {
            return this._TemplateRef_11_5;
        }
        if (((token === import20.NgIf) && (11 === requestNodeIndex))) {
            return this._NgIf_11_6.context;
        }
        if (((token === import21.DefaultValueAccessor) && (20 === requestNodeIndex))) {
            return this._DefaultValueAccessor_20_3.context;
        }
        if (((token === import22.RequiredValidator) && (20 === requestNodeIndex))) {
            return this._RequiredValidator_20_4.context;
        }
        if (((token === import23.NG_VALIDATORS) && (20 === requestNodeIndex))) {
            return this._NG_VALIDATORS_20_5;
        }
        if (((token === import24.NG_VALUE_ACCESSOR) && (20 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_20_6;
        }
        if (((token === import25.NgModel) && (20 === requestNodeIndex))) {
            return this._NgModel_20_7.context;
        }
        if (((token === import26.NgControl) && (20 === requestNodeIndex))) {
            return this._NgControl_20_8;
        }
        if (((token === import27.NgControlStatus) && (20 === requestNodeIndex))) {
            return this._NgControlStatus_20_9.context;
        }
        if (((token === import21.DefaultValueAccessor) && (31 === requestNodeIndex))) {
            return this._DefaultValueAccessor_31_3.context;
        }
        if (((token === import22.RequiredValidator) && (31 === requestNodeIndex))) {
            return this._RequiredValidator_31_4.context;
        }
        if (((token === import23.NG_VALIDATORS) && (31 === requestNodeIndex))) {
            return this._NG_VALIDATORS_31_5;
        }
        if (((token === import24.NG_VALUE_ACCESSOR) && (31 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_31_6;
        }
        if (((token === import25.NgModel) && (31 === requestNodeIndex))) {
            return this._NgModel_31_7.context;
        }
        if (((token === import26.NgControl) && (31 === requestNodeIndex))) {
            return this._NgControl_31_8;
        }
        if (((token === import27.NgControlStatus) && (31 === requestNodeIndex))) {
            return this._NgControlStatus_31_9.context;
        }
        if (((token === import28.NgForm) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 43)))) {
            return this._NgForm_9_3.context;
        }
        if (((token === import29.ControlContainer) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 43)))) {
            return this._ControlContainer_9_4;
        }
        if (((token === import27.NgControlStatusGroup) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 43)))) {
            return this._NgControlStatusGroup_9_5.context;
        }
        return notFoundResult;
    };
    View_ConfigDynatraceComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_2_0_0 = this.context.configService.isWizard;
        this._NgIf_2_6.check_ngIf(currVal_2_0_0, throwOnChange, false);
        this._NgIf_2_6.ngDoCheck(this, this._anchor_2, throwOnChange);
        this._NgForm_9_3.ngDoCheck(this, this._el_9, throwOnChange);
        this._NgControlStatusGroup_9_5.ngDoCheck(this, this._el_9, throwOnChange);
        var currVal_11_0_0 = !this.context.configService.config['dynatrace'].success;
        this._NgIf_11_6.check_ngIf(currVal_11_0_0, throwOnChange, false);
        this._NgIf_11_6.ngDoCheck(this, this._anchor_11, throwOnChange);
        this._DefaultValueAccessor_20_3.ngDoCheck(this, this._el_20, throwOnChange);
        var currVal_20_1_0 = '';
        this._RequiredValidator_20_4.check_required(currVal_20_1_0, throwOnChange, false);
        this._RequiredValidator_20_4.ngDoCheck(this, this._el_20, throwOnChange);
        var currVal_20_2_0 = 'url';
        this._NgModel_20_7.check_name(currVal_20_2_0, throwOnChange, false);
        var currVal_20_2_1 = this.context.configService.values.dynatrace.url;
        this._NgModel_20_7.check_model(currVal_20_2_1, throwOnChange, false);
        this._NgModel_20_7.ngDoCheck(this, this._el_20, throwOnChange);
        this._NgControlStatus_20_9.ngDoCheck(this, this._el_20, throwOnChange);
        this._DefaultValueAccessor_31_3.ngDoCheck(this, this._el_31, throwOnChange);
        var currVal_31_1_0 = '';
        this._RequiredValidator_31_4.check_required(currVal_31_1_0, throwOnChange, false);
        this._RequiredValidator_31_4.ngDoCheck(this, this._el_31, throwOnChange);
        var currVal_31_2_0 = 'token';
        this._NgModel_31_7.check_name(currVal_31_2_0, throwOnChange, false);
        var currVal_31_2_1 = this.context.configService.values.dynatrace.token;
        this._NgModel_31_7.check_model(currVal_31_2_1, throwOnChange, false);
        this._NgModel_31_7.ngDoCheck(this, this._el_31, throwOnChange);
        this._NgControlStatus_31_9.ngDoCheck(this, this._el_31, throwOnChange);
        this._vc_2.detectChangesInNestedViews(throwOnChange);
        this._vc_11.detectChangesInNestedViews(throwOnChange);
        this._NgControlStatusGroup_9_5.checkHost(this, this, this._el_9, throwOnChange);
        this._RequiredValidator_20_4.checkHost(this, this, this._el_20, throwOnChange);
        this._NgControlStatus_20_9.checkHost(this, this, this._el_20, throwOnChange);
        this._RequiredValidator_31_4.checkHost(this, this, this._el_31, throwOnChange);
        this._NgControlStatus_31_9.checkHost(this, this, this._el_31, throwOnChange);
    };
    View_ConfigDynatraceComponent0.prototype.destroyInternal = function () {
        this._vc_2.destroyNestedViews();
        this._vc_11.destroyNestedViews();
        this._NgModel_20_7.ngOnDestroy();
        this._NgModel_31_7.ngOnDestroy();
        this._NgForm_9_3.ngOnDestroy();
    };
    View_ConfigDynatraceComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 2)) {
            return new View_ConfigDynatraceComponent1(this.viewUtils, this, 2, this._anchor_2, this._vc_2);
        }
        if ((nodeIndex == 11)) {
            return new View_ConfigDynatraceComponent2(this.viewUtils, this, 11, this._anchor_11, this._vc_11);
        }
        return null;
    };
    View_ConfigDynatraceComponent0.prototype.handleEvent_9 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._NgForm_9_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'submit')) {
            var pd_sub_0 = (this.context.doSubmit() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_ConfigDynatraceComponent0.prototype.handleEvent_20 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_20_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.configService.values.dynatrace.url = $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_ConfigDynatraceComponent0.prototype.handleEvent_31 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_31_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.configService.values.dynatrace.token = $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ConfigDynatraceComponent0;
}(import1.AppView));
var View_ConfigDynatraceComponent1 = (function (_super) {
    __extends(View_ConfigDynatraceComponent1, _super);
    function View_ConfigDynatraceComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigDynatraceComponent1, renderType_ConfigDynatraceComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigDynatraceComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'div', new import3.InlineArray2(2, 'class', 'step'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n        Step 2 of 4\n    ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigDynatraceComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigDynatraceComponent1;
}(import1.AppView));
var View_ConfigDynatraceComponent2 = (function (_super) {
    __extends(View_ConfigDynatraceComponent2, _super);
    function View_ConfigDynatraceComponent2(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigDynatraceComponent2, renderType_ConfigDynatraceComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_5 = import30.UNINITIALIZED;
    }
    View_ConfigDynatraceComponent2.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width error'), null);
        this._text_3 = this.renderer.createText(this._el_2, '', null);
        this._text_4 = this.renderer.createText(this._el_0, '\n            ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._text_4
        ]), null);
        return null;
    };
    View_ConfigDynatraceComponent2.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_5 = import3.inlineInterpolate(1, '\n                    ', this.parentView.context.configService.config['dynatrace'].error, '\n                ');
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setText(this._text_3, currVal_5);
            this._expr_5 = currVal_5;
        }
    };
    View_ConfigDynatraceComponent2.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigDynatraceComponent2;
}(import1.AppView));
//# sourceMappingURL=config-dynatrace.component.ngfactory.js.map