var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/auth/auth-login/auth-login.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/shared/davis.service';
import * as import9 from '@angular/router/src/router';
import * as import10 from '../../../../node_modules/@angular/forms/src/directives/ng_form.ngfactory';
import * as import11 from '../../../../node_modules/@angular/forms/src/directives/ng_control_status.ngfactory';
import * as import12 from '@angular/core/src/linker/view_container';
import * as import13 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import14 from '../../../../node_modules/@angular/forms/src/directives/default_value_accessor.ngfactory';
import * as import15 from '../../../../node_modules/@angular/forms/src/directives/validators.ngfactory';
import * as import16 from '../../../../node_modules/@angular/forms/src/directives/ng_model.ngfactory';
import * as import17 from '@angular/core/src/linker/template_ref';
import * as import18 from '@angular/core/src/linker/element_ref';
import * as import19 from '@angular/common/src/directives/ng_if';
import * as import20 from '@angular/forms/src/directives/default_value_accessor';
import * as import21 from '@angular/forms/src/directives/validators';
import * as import22 from '@angular/forms/src/validators';
import * as import23 from '@angular/forms/src/directives/control_value_accessor';
import * as import24 from '@angular/forms/src/directives/ng_model';
import * as import25 from '@angular/forms/src/directives/ng_control';
import * as import26 from '@angular/forms/src/directives/ng_control_status';
import * as import27 from '@angular/forms/src/directives/ng_form';
import * as import28 from '@angular/forms/src/directives/control_container';
import * as import29 from '@angular/core/src/change_detection/change_detection_util';
export var Wrapper_AuthLoginComponent = (function () {
    function Wrapper_AuthLoginComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.AuthLoginComponent(p0, p1);
    }
    Wrapper_AuthLoginComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_AuthLoginComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_AuthLoginComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        return changed;
    };
    Wrapper_AuthLoginComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_AuthLoginComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_AuthLoginComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_AuthLoginComponent;
}());
var renderType_AuthLoginComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_AuthLoginComponent_Host0 = (function (_super) {
    __extends(View_AuthLoginComponent_Host0, _super);
    function View_AuthLoginComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AuthLoginComponent_Host0, renderType_AuthLoginComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_AuthLoginComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'auth-login', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_AuthLoginComponent0(this.viewUtils, this, 0, this._el_0);
        this._AuthLoginComponent_0_3 = new Wrapper_AuthLoginComponent(this.injectorGet(import8.DavisService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._AuthLoginComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._AuthLoginComponent_0_3.context);
    };
    View_AuthLoginComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.AuthLoginComponent) && (0 === requestNodeIndex))) {
            return this._AuthLoginComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_AuthLoginComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._AuthLoginComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_AuthLoginComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_AuthLoginComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_AuthLoginComponent_Host0;
}(import1.AppView));
export var AuthLoginComponentNgFactory = new import7.ComponentFactory('auth-login', View_AuthLoginComponent_Host0, import0.AuthLoginComponent);
var styles_AuthLoginComponent = [];
var renderType_AuthLoginComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, styles_AuthLoginComponent, {});
export var View_AuthLoginComponent0 = (function (_super) {
    __extends(View_AuthLoginComponent0, _super);
    function View_AuthLoginComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_AuthLoginComponent0, renderType_AuthLoginComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_AuthLoginComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'page'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'title title-auth'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n        ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'img', new import3.InlineArray4(4, 'id', 'davis-logo', 'src', './assets/img/Davis_Avatar_512x512_blue_bg.png'), null);
        this._text_5 = this.renderer.createText(this._el_2, '\n        ', null);
        this._el_6 = import3.createRenderElement(this.renderer, this._el_2, 'div', new import3.InlineArray2(2, 'id', 'davis-logo-text'), null);
        this._text_7 = this.renderer.createText(this._el_6, 'Davis', null);
        this._text_8 = this.renderer.createText(this._el_2, '\n    ', null);
        this._text_9 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_10 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'content content-auth'), null);
        this._text_11 = this.renderer.createText(this._el_10, '\n        ', null);
        this._el_12 = import3.createRenderElement(this.renderer, this._el_10, 'form', import3.EMPTY_INLINE_ARRAY, null);
        this._NgForm_12_3 = new import10.Wrapper_NgForm(null, null);
        this._ControlContainer_12_4 = this._NgForm_12_3.context;
        this._NgControlStatusGroup_12_5 = new import11.Wrapper_NgControlStatusGroup(this._ControlContainer_12_4);
        this._text_13 = this.renderer.createText(this._el_12, '\n            ', null);
        this._anchor_14 = this.renderer.createTemplateAnchor(this._el_12, null);
        this._vc_14 = new import12.ViewContainer(14, 12, this, this._anchor_14);
        this._TemplateRef_14_5 = new import17.TemplateRef_(this, 14, this._anchor_14);
        this._NgIf_14_6 = new import13.Wrapper_NgIf(this._vc_14.vcRef, this._TemplateRef_14_5);
        this._text_15 = this.renderer.createText(this._el_12, '\n            ', null);
        this._el_16 = import3.createRenderElement(this.renderer, this._el_12, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_17 = this.renderer.createText(this._el_16, '\n                ', null);
        this._el_18 = import3.createRenderElement(this.renderer, this._el_16, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_19 = this.renderer.createText(this._el_18, '\n                    ', null);
        this._el_20 = import3.createRenderElement(this.renderer, this._el_18, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_21 = this.renderer.createText(this._el_20, 'Email', null);
        this._text_22 = this.renderer.createText(this._el_18, '\n                    ', null);
        this._el_23 = import3.createRenderElement(this.renderer, this._el_18, 'input', new import3.InlineArray16(12, 'autofocus', '', 'name', 'email', 'ngModel', '', 'placeholder', 'john.smith@example.com', 'required', '', 'type', 'email'), null);
        this._DefaultValueAccessor_23_3 = new import14.Wrapper_DefaultValueAccessor(this.renderer, new import18.ElementRef(this._el_23));
        this._RequiredValidator_23_4 = new import15.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_23_5 = [this._RequiredValidator_23_4.context];
        this._NG_VALUE_ACCESSOR_23_6 = [this._DefaultValueAccessor_23_3.context];
        this._NgModel_23_7 = new import16.Wrapper_NgModel(this._ControlContainer_12_4, this._NG_VALIDATORS_23_5, null, this._NG_VALUE_ACCESSOR_23_6);
        this._NgControl_23_8 = this._NgModel_23_7.context;
        this._NgControlStatus_23_9 = new import11.Wrapper_NgControlStatus(this._NgControl_23_8);
        this._text_24 = this.renderer.createText(this._el_18, '\n                ', null);
        this._text_25 = this.renderer.createText(this._el_16, '\n            ', null);
        this._text_26 = this.renderer.createText(this._el_12, '\n            ', null);
        this._el_27 = import3.createRenderElement(this.renderer, this._el_12, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_28 = this.renderer.createText(this._el_27, '\n                ', null);
        this._el_29 = import3.createRenderElement(this.renderer, this._el_27, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_30 = this.renderer.createText(this._el_29, '\n                    ', null);
        this._el_31 = import3.createRenderElement(this.renderer, this._el_29, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_32 = this.renderer.createText(this._el_31, 'Password', null);
        this._text_33 = this.renderer.createText(this._el_29, '\n                    ', null);
        this._el_34 = import3.createRenderElement(this.renderer, this._el_29, 'input', new import3.InlineArray8(8, 'name', 'password', 'placeholder', '••••••••••', 'required', '', 'type', 'password'), null);
        this._DefaultValueAccessor_34_3 = new import14.Wrapper_DefaultValueAccessor(this.renderer, new import18.ElementRef(this._el_34));
        this._RequiredValidator_34_4 = new import15.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_34_5 = [this._RequiredValidator_34_4.context];
        this._NG_VALUE_ACCESSOR_34_6 = [this._DefaultValueAccessor_34_3.context];
        this._NgModel_34_7 = new import16.Wrapper_NgModel(this._ControlContainer_12_4, this._NG_VALIDATORS_34_5, null, this._NG_VALUE_ACCESSOR_34_6);
        this._NgControl_34_8 = this._NgModel_34_7.context;
        this._NgControlStatus_34_9 = new import11.Wrapper_NgControlStatus(this._NgControl_34_8);
        this._text_35 = this.renderer.createText(this._el_29, '\n                ', null);
        this._text_36 = this.renderer.createText(this._el_27, '\n            ', null);
        this._text_37 = this.renderer.createText(this._el_12, '\n            ', null);
        this._el_38 = import3.createRenderElement(this.renderer, this._el_12, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_39 = this.renderer.createText(this._el_38, '\n                ', null);
        this._el_40 = import3.createRenderElement(this.renderer, this._el_38, 'div', new import3.InlineArray2(2, 'class', 'flex-item next'), null);
        this._text_41 = this.renderer.createText(this._el_40, '\n                    ', null);
        this._el_42 = import3.createRenderElement(this.renderer, this._el_40, 'button', new import3.InlineArray4(4, 'class', 'content-save-button log-in', 'type', 'submit'), null);
        this._text_43 = this.renderer.createText(this._el_42, 'Sign in', null);
        this._text_44 = this.renderer.createText(this._el_40, '\n                ', null);
        this._text_45 = this.renderer.createText(this._el_38, '\n            ', null);
        this._text_46 = this.renderer.createText(this._el_12, '\n        ', null);
        this._text_47 = this.renderer.createText(this._el_10, '\n    ', null);
        this._text_48 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_12, new import3.InlineArray8(6, 'ngSubmit', null, 'submit', null, 'reset', null), this.eventHandler(this.handleEvent_12));
        this._NgForm_12_3.subscribe(this, this.eventHandler(this.handleEvent_12), true);
        var disposable_1 = import3.subscribeToRenderElement(this, this._el_23, new import3.InlineArray4(4, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_23));
        var disposable_2 = import3.subscribeToRenderElement(this, this._el_34, new import3.InlineArray8(6, 'ngModelChange', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_34));
        this._NgModel_34_7.subscribe(this, this.eventHandler(this.handleEvent_34), true);
        this.init(null, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._el_6,
            this._text_7,
            this._text_8,
            this._text_9,
            this._el_10,
            this._text_11,
            this._el_12,
            this._text_13,
            this._anchor_14,
            this._text_15,
            this._el_16,
            this._text_17,
            this._el_18,
            this._text_19,
            this._el_20,
            this._text_21,
            this._text_22,
            this._el_23,
            this._text_24,
            this._text_25,
            this._text_26,
            this._el_27,
            this._text_28,
            this._el_29,
            this._text_30,
            this._el_31,
            this._text_32,
            this._text_33,
            this._el_34,
            this._text_35,
            this._text_36,
            this._text_37,
            this._el_38,
            this._text_39,
            this._el_40,
            this._text_41,
            this._el_42,
            this._text_43,
            this._text_44,
            this._text_45,
            this._text_46,
            this._text_47,
            this._text_48
        ]), [
            disposable_0,
            disposable_1,
            disposable_2
        ]);
        return null;
    };
    View_AuthLoginComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import17.TemplateRef) && (14 === requestNodeIndex))) {
            return this._TemplateRef_14_5;
        }
        if (((token === import19.NgIf) && (14 === requestNodeIndex))) {
            return this._NgIf_14_6.context;
        }
        if (((token === import20.DefaultValueAccessor) && (23 === requestNodeIndex))) {
            return this._DefaultValueAccessor_23_3.context;
        }
        if (((token === import21.RequiredValidator) && (23 === requestNodeIndex))) {
            return this._RequiredValidator_23_4.context;
        }
        if (((token === import22.NG_VALIDATORS) && (23 === requestNodeIndex))) {
            return this._NG_VALIDATORS_23_5;
        }
        if (((token === import23.NG_VALUE_ACCESSOR) && (23 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_23_6;
        }
        if (((token === import24.NgModel) && (23 === requestNodeIndex))) {
            return this._NgModel_23_7.context;
        }
        if (((token === import25.NgControl) && (23 === requestNodeIndex))) {
            return this._NgControl_23_8;
        }
        if (((token === import26.NgControlStatus) && (23 === requestNodeIndex))) {
            return this._NgControlStatus_23_9.context;
        }
        if (((token === import20.DefaultValueAccessor) && (34 === requestNodeIndex))) {
            return this._DefaultValueAccessor_34_3.context;
        }
        if (((token === import21.RequiredValidator) && (34 === requestNodeIndex))) {
            return this._RequiredValidator_34_4.context;
        }
        if (((token === import22.NG_VALIDATORS) && (34 === requestNodeIndex))) {
            return this._NG_VALIDATORS_34_5;
        }
        if (((token === import23.NG_VALUE_ACCESSOR) && (34 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_34_6;
        }
        if (((token === import24.NgModel) && (34 === requestNodeIndex))) {
            return this._NgModel_34_7.context;
        }
        if (((token === import25.NgControl) && (34 === requestNodeIndex))) {
            return this._NgControl_34_8;
        }
        if (((token === import26.NgControlStatus) && (34 === requestNodeIndex))) {
            return this._NgControlStatus_34_9.context;
        }
        if (((token === import27.NgForm) && ((12 <= requestNodeIndex) && (requestNodeIndex <= 46)))) {
            return this._NgForm_12_3.context;
        }
        if (((token === import28.ControlContainer) && ((12 <= requestNodeIndex) && (requestNodeIndex <= 46)))) {
            return this._ControlContainer_12_4;
        }
        if (((token === import26.NgControlStatusGroup) && ((12 <= requestNodeIndex) && (requestNodeIndex <= 46)))) {
            return this._NgControlStatusGroup_12_5.context;
        }
        return notFoundResult;
    };
    View_AuthLoginComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        this._NgForm_12_3.ngDoCheck(this, this._el_12, throwOnChange);
        this._NgControlStatusGroup_12_5.ngDoCheck(this, this._el_12, throwOnChange);
        var currVal_14_0_0 = this.context.loginError;
        this._NgIf_14_6.check_ngIf(currVal_14_0_0, throwOnChange, false);
        this._NgIf_14_6.ngDoCheck(this, this._anchor_14, throwOnChange);
        this._DefaultValueAccessor_23_3.ngDoCheck(this, this._el_23, throwOnChange);
        var currVal_23_1_0 = '';
        this._RequiredValidator_23_4.check_required(currVal_23_1_0, throwOnChange, false);
        this._RequiredValidator_23_4.ngDoCheck(this, this._el_23, throwOnChange);
        var currVal_23_2_0 = 'email';
        this._NgModel_23_7.check_name(currVal_23_2_0, throwOnChange, false);
        var currVal_23_2_1 = '';
        this._NgModel_23_7.check_model(currVal_23_2_1, throwOnChange, false);
        this._NgModel_23_7.ngDoCheck(this, this._el_23, throwOnChange);
        this._NgControlStatus_23_9.ngDoCheck(this, this._el_23, throwOnChange);
        this._DefaultValueAccessor_34_3.ngDoCheck(this, this._el_34, throwOnChange);
        var currVal_34_1_0 = '';
        this._RequiredValidator_34_4.check_required(currVal_34_1_0, throwOnChange, false);
        this._RequiredValidator_34_4.ngDoCheck(this, this._el_34, throwOnChange);
        var currVal_34_2_0 = 'password';
        this._NgModel_34_7.check_name(currVal_34_2_0, throwOnChange, false);
        var currVal_34_2_1 = this.context.password;
        this._NgModel_34_7.check_model(currVal_34_2_1, throwOnChange, false);
        this._NgModel_34_7.ngDoCheck(this, this._el_34, throwOnChange);
        this._NgControlStatus_34_9.ngDoCheck(this, this._el_34, throwOnChange);
        this._vc_14.detectChangesInNestedViews(throwOnChange);
        this._NgControlStatusGroup_12_5.checkHost(this, this, this._el_12, throwOnChange);
        this._RequiredValidator_23_4.checkHost(this, this, this._el_23, throwOnChange);
        this._NgControlStatus_23_9.checkHost(this, this, this._el_23, throwOnChange);
        this._RequiredValidator_34_4.checkHost(this, this, this._el_34, throwOnChange);
        this._NgControlStatus_34_9.checkHost(this, this, this._el_34, throwOnChange);
    };
    View_AuthLoginComponent0.prototype.destroyInternal = function () {
        this._vc_14.destroyNestedViews();
        this._NgModel_23_7.ngOnDestroy();
        this._NgModel_34_7.ngOnDestroy();
        this._NgForm_12_3.ngOnDestroy();
    };
    View_AuthLoginComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 14)) {
            return new View_AuthLoginComponent1(this.viewUtils, this, 14, this._anchor_14, this._vc_14);
        }
        return null;
    };
    View_AuthLoginComponent0.prototype.handleEvent_12 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._NgForm_12_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngSubmit')) {
            var pd_sub_0 = (this.context.login(this._NgForm_12_3.context) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    View_AuthLoginComponent0.prototype.handleEvent_23 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_23_3.handleEvent(eventName, $event) && result);
        return result;
    };
    View_AuthLoginComponent0.prototype.handleEvent_34 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_34_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.context.password = $event) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_AuthLoginComponent0;
}(import1.AppView));
var View_AuthLoginComponent1 = (function (_super) {
    __extends(View_AuthLoginComponent1, _super);
    function View_AuthLoginComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_AuthLoginComponent1, renderType_AuthLoginComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_5 = import29.UNINITIALIZED;
    }
    View_AuthLoginComponent1.prototype.createInternal = function (rootSelector) {
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
    View_AuthLoginComponent1.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_5 = import3.inlineInterpolate(1, '\n                    ', this.parentView.context.loginError, '\n                ');
        if (import3.checkBinding(throwOnChange, this._expr_5, currVal_5)) {
            this.renderer.setText(this._text_3, currVal_5);
            this._expr_5 = currVal_5;
        }
    };
    View_AuthLoginComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_AuthLoginComponent1;
}(import1.AppView));
//# sourceMappingURL=auth-login.component.ngfactory.js.map