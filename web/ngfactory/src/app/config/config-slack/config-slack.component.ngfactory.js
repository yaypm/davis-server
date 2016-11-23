var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import * as import0 from '../../../../../src/app/config/config-slack/config-slack.component';
import * as import1 from '@angular/core/src/linker/view';
import * as import3 from '@angular/core/src/linker/view_utils';
import * as import4 from '@angular/core/src/metadata/view';
import * as import5 from '@angular/core/src/linker/view_type';
import * as import6 from '@angular/core/src/change_detection/constants';
import * as import7 from '@angular/core/src/linker/component_factory';
import * as import8 from '../../../../../src/app/config/config.service';
import * as import9 from '@angular/router/src/router';
import * as import10 from './config-slack.component.css.shim';
import * as import11 from '@angular/core/src/linker/view_container';
import * as import12 from '../../../../node_modules/@angular/common/src/directives/ng_if.ngfactory';
import * as import13 from '../../../../node_modules/@angular/forms/src/directives/ng_form.ngfactory';
import * as import14 from '../../../../node_modules/@angular/forms/src/directives/ng_control_status.ngfactory';
import * as import15 from '@angular/core/src/linker/template_ref';
import * as import16 from '@angular/common/src/directives/ng_if';
import * as import17 from '@angular/forms/src/directives/ng_form';
import * as import18 from '@angular/forms/src/directives/control_container';
import * as import19 from '@angular/forms/src/directives/ng_control_status';
import * as import20 from '../../../../node_modules/@angular/forms/src/directives/default_value_accessor.ngfactory';
import * as import21 from '../../../../node_modules/@angular/forms/src/directives/ng_model.ngfactory';
import * as import22 from '@angular/core/src/linker/element_ref';
import * as import23 from '@angular/forms/src/directives/default_value_accessor';
import * as import24 from '@angular/forms/src/directives/control_value_accessor';
import * as import25 from '@angular/forms/src/directives/ng_model';
import * as import26 from '@angular/forms/src/directives/ng_control';
import * as import27 from '@angular/core/src/change_detection/change_detection_util';
import * as import28 from '../../../../node_modules/@angular/forms/src/directives/validators.ngfactory';
import * as import29 from '@angular/forms/src/directives/validators';
import * as import30 from '@angular/forms/src/validators';
import * as import31 from '@angular/core/src/security';
export var Wrapper_ConfigSlackComponent = (function () {
    function Wrapper_ConfigSlackComponent(p0, p1) {
        this._changed = false;
        this.context = new import0.ConfigSlackComponent(p0, p1);
    }
    Wrapper_ConfigSlackComponent.prototype.ngOnDetach = function (view, componentView, el) {
    };
    Wrapper_ConfigSlackComponent.prototype.ngOnDestroy = function () {
    };
    Wrapper_ConfigSlackComponent.prototype.ngDoCheck = function (view, el, throwOnChange) {
        var changed = this._changed;
        this._changed = false;
        if (!throwOnChange) {
            if ((view.numberOfChecks === 0)) {
                this.context.ngOnInit();
            }
        }
        return changed;
    };
    Wrapper_ConfigSlackComponent.prototype.checkHost = function (view, componentView, el, throwOnChange) {
    };
    Wrapper_ConfigSlackComponent.prototype.handleEvent = function (eventName, $event) {
        var result = true;
        return result;
    };
    Wrapper_ConfigSlackComponent.prototype.subscribe = function (view, _eventHandler) {
        this._eventHandler = _eventHandler;
    };
    return Wrapper_ConfigSlackComponent;
}());
var renderType_ConfigSlackComponent_Host = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.None, [], {});
var View_ConfigSlackComponent_Host0 = (function (_super) {
    __extends(View_ConfigSlackComponent_Host0, _super);
    function View_ConfigSlackComponent_Host0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigSlackComponent_Host0, renderType_ConfigSlackComponent_Host, import5.ViewType.HOST, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_ConfigSlackComponent_Host0.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.selectOrCreateRenderHostElement(this.renderer, 'config-slack', import3.EMPTY_INLINE_ARRAY, rootSelector, null);
        this.compView_0 = new View_ConfigSlackComponent0(this.viewUtils, this, 0, this._el_0);
        this._ConfigSlackComponent_0_3 = new Wrapper_ConfigSlackComponent(this.injectorGet(import8.ConfigService, this.parentIndex), this.injectorGet(import9.Router, this.parentIndex));
        this.compView_0.create(this._ConfigSlackComponent_0_3.context);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), null);
        return new import7.ComponentRef_(0, this, this._el_0, this._ConfigSlackComponent_0_3.context);
    };
    View_ConfigSlackComponent_Host0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import0.ConfigSlackComponent) && (0 === requestNodeIndex))) {
            return this._ConfigSlackComponent_0_3.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent_Host0.prototype.detectChangesInternal = function (throwOnChange) {
        this._ConfigSlackComponent_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        this.compView_0.detectChanges(throwOnChange);
    };
    View_ConfigSlackComponent_Host0.prototype.destroyInternal = function () {
        this.compView_0.destroy();
    };
    View_ConfigSlackComponent_Host0.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent_Host0;
}(import1.AppView));
export var ConfigSlackComponentNgFactory = new import7.ComponentFactory('config-slack', View_ConfigSlackComponent_Host0, import0.ConfigSlackComponent);
var styles_ConfigSlackComponent = [import10.styles];
var renderType_ConfigSlackComponent = import3.createRenderComponentType('', 0, import4.ViewEncapsulation.Emulated, styles_ConfigSlackComponent, {});
export var View_ConfigSlackComponent0 = (function (_super) {
    __extends(View_ConfigSlackComponent0, _super);
    function View_ConfigSlackComponent0(viewUtils, parentView, parentIndex, parentElement) {
        _super.call(this, View_ConfigSlackComponent0, renderType_ConfigSlackComponent, import5.ViewType.COMPONENT, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways);
    }
    View_ConfigSlackComponent0.prototype.createInternal = function (rootSelector) {
        var parentRenderNode = this.renderer.createViewRoot(this.parentElement);
        this._el_0 = import3.createRenderElement(this.renderer, parentRenderNode, 'div', new import3.InlineArray2(2, 'class', 'page'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n    ', null);
        this._anchor_2 = this.renderer.createTemplateAnchor(this._el_0, null);
        this._vc_2 = new import11.ViewContainer(2, 0, this, this._anchor_2);
        this._TemplateRef_2_5 = new import15.TemplateRef_(this, 2, this._anchor_2);
        this._NgIf_2_6 = new import12.Wrapper_NgIf(this._vc_2.vcRef, this._TemplateRef_2_5);
        this._text_3 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'title'), null);
        this._text_5 = this.renderer.createText(this._el_4, '\n        Connect to Slack App\n    ', null);
        this._text_6 = this.renderer.createText(this._el_0, '\n    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'content'), null);
        this._text_8 = this.renderer.createText(this._el_7, '\n        ', null);
        this._el_9 = import3.createRenderElement(this.renderer, this._el_7, 'form', import3.EMPTY_INLINE_ARRAY, null);
        this._NgForm_9_3 = new import13.Wrapper_NgForm(null, null);
        this._ControlContainer_9_4 = this._NgForm_9_3.context;
        this._NgControlStatusGroup_9_5 = new import14.Wrapper_NgControlStatusGroup(this._ControlContainer_9_4);
        this._text_10 = this.renderer.createText(this._el_9, '\n            ', null);
        this._el_11 = import3.createRenderElement(this.renderer, this._el_9, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_12 = this.renderer.createText(this._el_11, '\n                ', null);
        this._el_13 = import3.createRenderElement(this.renderer, this._el_11, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_14 = this.renderer.createText(this._el_13, '\n                    ', null);
        this._el_15 = import3.createRenderElement(this.renderer, this._el_13, 'ul', import3.EMPTY_INLINE_ARRAY, null);
        this._text_16 = this.renderer.createText(this._el_15, '\n                        ', null);
        this._anchor_17 = this.renderer.createTemplateAnchor(this._el_15, null);
        this._vc_17 = new import11.ViewContainer(17, 15, this, this._anchor_17);
        this._TemplateRef_17_5 = new import15.TemplateRef_(this, 17, this._anchor_17);
        this._NgIf_17_6 = new import12.Wrapper_NgIf(this._vc_17.vcRef, this._TemplateRef_17_5);
        this._text_18 = this.renderer.createText(this._el_15, '\n                        ', null);
        this._anchor_19 = this.renderer.createTemplateAnchor(this._el_15, null);
        this._vc_19 = new import11.ViewContainer(19, 15, this, this._anchor_19);
        this._TemplateRef_19_5 = new import15.TemplateRef_(this, 19, this._anchor_19);
        this._NgIf_19_6 = new import12.Wrapper_NgIf(this._vc_19.vcRef, this._TemplateRef_19_5);
        this._text_20 = this.renderer.createText(this._el_15, '\n                        ', null);
        this._anchor_21 = this.renderer.createTemplateAnchor(this._el_15, null);
        this._vc_21 = new import11.ViewContainer(21, 15, this, this._anchor_21);
        this._TemplateRef_21_5 = new import15.TemplateRef_(this, 21, this._anchor_21);
        this._NgIf_21_6 = new import12.Wrapper_NgIf(this._vc_21.vcRef, this._TemplateRef_21_5);
        this._text_22 = this.renderer.createText(this._el_15, '\n                        ', null);
        this._anchor_23 = this.renderer.createTemplateAnchor(this._el_15, null);
        this._vc_23 = new import11.ViewContainer(23, 15, this, this._anchor_23);
        this._TemplateRef_23_5 = new import15.TemplateRef_(this, 23, this._anchor_23);
        this._NgIf_23_6 = new import12.Wrapper_NgIf(this._vc_23.vcRef, this._TemplateRef_23_5);
        this._text_24 = this.renderer.createText(this._el_15, '\n                    ', null);
        this._text_25 = this.renderer.createText(this._el_13, '\n                ', null);
        this._text_26 = this.renderer.createText(this._el_11, '\n            ', null);
        this._text_27 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_28 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_28 = new import11.ViewContainer(28, 9, this, this._anchor_28);
        this._TemplateRef_28_5 = new import15.TemplateRef_(this, 28, this._anchor_28);
        this._NgIf_28_6 = new import12.Wrapper_NgIf(this._vc_28.vcRef, this._TemplateRef_28_5);
        this._text_29 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_30 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_30 = new import11.ViewContainer(30, 9, this, this._anchor_30);
        this._TemplateRef_30_5 = new import15.TemplateRef_(this, 30, this._anchor_30);
        this._NgIf_30_6 = new import12.Wrapper_NgIf(this._vc_30.vcRef, this._TemplateRef_30_5);
        this._text_31 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_32 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_32 = new import11.ViewContainer(32, 9, this, this._anchor_32);
        this._TemplateRef_32_5 = new import15.TemplateRef_(this, 32, this._anchor_32);
        this._NgIf_32_6 = new import12.Wrapper_NgIf(this._vc_32.vcRef, this._TemplateRef_32_5);
        this._text_33 = this.renderer.createText(this._el_9, '\n             ', null);
        this._anchor_34 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_34 = new import11.ViewContainer(34, 9, this, this._anchor_34);
        this._TemplateRef_34_5 = new import15.TemplateRef_(this, 34, this._anchor_34);
        this._NgIf_34_6 = new import12.Wrapper_NgIf(this._vc_34.vcRef, this._TemplateRef_34_5);
        this._text_35 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_36 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_36 = new import11.ViewContainer(36, 9, this, this._anchor_36);
        this._TemplateRef_36_5 = new import15.TemplateRef_(this, 36, this._anchor_36);
        this._NgIf_36_6 = new import12.Wrapper_NgIf(this._vc_36.vcRef, this._TemplateRef_36_5);
        this._text_37 = this.renderer.createText(this._el_9, '\n            ', null);
        this._anchor_38 = this.renderer.createTemplateAnchor(this._el_9, null);
        this._vc_38 = new import11.ViewContainer(38, 9, this, this._anchor_38);
        this._TemplateRef_38_5 = new import15.TemplateRef_(this, 38, this._anchor_38);
        this._NgIf_38_6 = new import12.Wrapper_NgIf(this._vc_38.vcRef, this._TemplateRef_38_5);
        this._text_39 = this.renderer.createText(this._el_9, '\n        ', null);
        this._text_40 = this.renderer.createText(this._el_7, '\n    ', null);
        this._text_41 = this.renderer.createText(this._el_0, '\n', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_9, new import3.InlineArray4(4, 'submit', null, 'reset', null), this.eventHandler(this.handleEvent_9));
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
            this._anchor_17,
            this._text_18,
            this._anchor_19,
            this._text_20,
            this._anchor_21,
            this._text_22,
            this._anchor_23,
            this._text_24,
            this._text_25,
            this._text_26,
            this._text_27,
            this._anchor_28,
            this._text_29,
            this._anchor_30,
            this._text_31,
            this._anchor_32,
            this._text_33,
            this._anchor_34,
            this._text_35,
            this._anchor_36,
            this._text_37,
            this._anchor_38,
            this._text_39,
            this._text_40,
            this._text_41
        ]), [disposable_0]);
        return null;
    };
    View_ConfigSlackComponent0.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import15.TemplateRef) && (2 === requestNodeIndex))) {
            return this._TemplateRef_2_5;
        }
        if (((token === import16.NgIf) && (2 === requestNodeIndex))) {
            return this._NgIf_2_6.context;
        }
        if (((token === import15.TemplateRef) && (17 === requestNodeIndex))) {
            return this._TemplateRef_17_5;
        }
        if (((token === import16.NgIf) && (17 === requestNodeIndex))) {
            return this._NgIf_17_6.context;
        }
        if (((token === import15.TemplateRef) && (19 === requestNodeIndex))) {
            return this._TemplateRef_19_5;
        }
        if (((token === import16.NgIf) && (19 === requestNodeIndex))) {
            return this._NgIf_19_6.context;
        }
        if (((token === import15.TemplateRef) && (21 === requestNodeIndex))) {
            return this._TemplateRef_21_5;
        }
        if (((token === import16.NgIf) && (21 === requestNodeIndex))) {
            return this._NgIf_21_6.context;
        }
        if (((token === import15.TemplateRef) && (23 === requestNodeIndex))) {
            return this._TemplateRef_23_5;
        }
        if (((token === import16.NgIf) && (23 === requestNodeIndex))) {
            return this._NgIf_23_6.context;
        }
        if (((token === import15.TemplateRef) && (28 === requestNodeIndex))) {
            return this._TemplateRef_28_5;
        }
        if (((token === import16.NgIf) && (28 === requestNodeIndex))) {
            return this._NgIf_28_6.context;
        }
        if (((token === import15.TemplateRef) && (30 === requestNodeIndex))) {
            return this._TemplateRef_30_5;
        }
        if (((token === import16.NgIf) && (30 === requestNodeIndex))) {
            return this._NgIf_30_6.context;
        }
        if (((token === import15.TemplateRef) && (32 === requestNodeIndex))) {
            return this._TemplateRef_32_5;
        }
        if (((token === import16.NgIf) && (32 === requestNodeIndex))) {
            return this._NgIf_32_6.context;
        }
        if (((token === import15.TemplateRef) && (34 === requestNodeIndex))) {
            return this._TemplateRef_34_5;
        }
        if (((token === import16.NgIf) && (34 === requestNodeIndex))) {
            return this._NgIf_34_6.context;
        }
        if (((token === import15.TemplateRef) && (36 === requestNodeIndex))) {
            return this._TemplateRef_36_5;
        }
        if (((token === import16.NgIf) && (36 === requestNodeIndex))) {
            return this._NgIf_36_6.context;
        }
        if (((token === import15.TemplateRef) && (38 === requestNodeIndex))) {
            return this._TemplateRef_38_5;
        }
        if (((token === import16.NgIf) && (38 === requestNodeIndex))) {
            return this._NgIf_38_6.context;
        }
        if (((token === import17.NgForm) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 39)))) {
            return this._NgForm_9_3.context;
        }
        if (((token === import18.ControlContainer) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 39)))) {
            return this._ControlContainer_9_4;
        }
        if (((token === import19.NgControlStatusGroup) && ((9 <= requestNodeIndex) && (requestNodeIndex <= 39)))) {
            return this._NgControlStatusGroup_9_5.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent0.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_2_0_0 = this.context.configService.isWizard;
        this._NgIf_2_6.check_ngIf(currVal_2_0_0, throwOnChange, false);
        this._NgIf_2_6.ngDoCheck(this, this._anchor_2, throwOnChange);
        this._NgForm_9_3.ngDoCheck(this, this._el_9, throwOnChange);
        this._NgControlStatusGroup_9_5.ngDoCheck(this, this._el_9, throwOnChange);
        var currVal_17_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_17_6.check_ngIf(currVal_17_0_0, throwOnChange, false);
        this._NgIf_17_6.ngDoCheck(this, this._anchor_17, throwOnChange);
        var currVal_19_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_19_6.check_ngIf(currVal_19_0_0, throwOnChange, false);
        this._NgIf_19_6.ngDoCheck(this, this._anchor_19, throwOnChange);
        var currVal_21_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_21_6.check_ngIf(currVal_21_0_0, throwOnChange, false);
        this._NgIf_21_6.ngDoCheck(this, this._anchor_21, throwOnChange);
        var currVal_23_0_0 = this.context.configService.config['slack'].success;
        this._NgIf_23_6.check_ngIf(currVal_23_0_0, throwOnChange, false);
        this._NgIf_23_6.ngDoCheck(this, this._anchor_23, throwOnChange);
        var currVal_28_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_28_6.check_ngIf(currVal_28_0_0, throwOnChange, false);
        this._NgIf_28_6.ngDoCheck(this, this._anchor_28, throwOnChange);
        var currVal_30_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_30_6.check_ngIf(currVal_30_0_0, throwOnChange, false);
        this._NgIf_30_6.ngDoCheck(this, this._anchor_30, throwOnChange);
        var currVal_32_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_32_6.check_ngIf(currVal_32_0_0, throwOnChange, false);
        this._NgIf_32_6.ngDoCheck(this, this._anchor_32, throwOnChange);
        var currVal_34_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_34_6.check_ngIf(currVal_34_0_0, throwOnChange, false);
        this._NgIf_34_6.ngDoCheck(this, this._anchor_34, throwOnChange);
        var currVal_36_0_0 = this.context.configService.config['slack'].success;
        this._NgIf_36_6.check_ngIf(currVal_36_0_0, throwOnChange, false);
        this._NgIf_36_6.ngDoCheck(this, this._anchor_36, throwOnChange);
        var currVal_38_0_0 = !this.context.configService.config['slack'].success;
        this._NgIf_38_6.check_ngIf(currVal_38_0_0, throwOnChange, false);
        this._NgIf_38_6.ngDoCheck(this, this._anchor_38, throwOnChange);
        this._vc_2.detectChangesInNestedViews(throwOnChange);
        this._vc_17.detectChangesInNestedViews(throwOnChange);
        this._vc_19.detectChangesInNestedViews(throwOnChange);
        this._vc_21.detectChangesInNestedViews(throwOnChange);
        this._vc_23.detectChangesInNestedViews(throwOnChange);
        this._vc_28.detectChangesInNestedViews(throwOnChange);
        this._vc_30.detectChangesInNestedViews(throwOnChange);
        this._vc_32.detectChangesInNestedViews(throwOnChange);
        this._vc_34.detectChangesInNestedViews(throwOnChange);
        this._vc_36.detectChangesInNestedViews(throwOnChange);
        this._vc_38.detectChangesInNestedViews(throwOnChange);
        this._NgControlStatusGroup_9_5.checkHost(this, this, this._el_9, throwOnChange);
    };
    View_ConfigSlackComponent0.prototype.destroyInternal = function () {
        this._vc_2.destroyNestedViews();
        this._vc_17.destroyNestedViews();
        this._vc_19.destroyNestedViews();
        this._vc_21.destroyNestedViews();
        this._vc_23.destroyNestedViews();
        this._vc_28.destroyNestedViews();
        this._vc_30.destroyNestedViews();
        this._vc_32.destroyNestedViews();
        this._vc_34.destroyNestedViews();
        this._vc_36.destroyNestedViews();
        this._vc_38.destroyNestedViews();
        this._NgForm_9_3.ngOnDestroy();
    };
    View_ConfigSlackComponent0.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 2)) {
            return new View_ConfigSlackComponent1(this.viewUtils, this, 2, this._anchor_2, this._vc_2);
        }
        if ((nodeIndex == 17)) {
            return new View_ConfigSlackComponent2(this.viewUtils, this, 17, this._anchor_17, this._vc_17);
        }
        if ((nodeIndex == 19)) {
            return new View_ConfigSlackComponent3(this.viewUtils, this, 19, this._anchor_19, this._vc_19);
        }
        if ((nodeIndex == 21)) {
            return new View_ConfigSlackComponent4(this.viewUtils, this, 21, this._anchor_21, this._vc_21);
        }
        if ((nodeIndex == 23)) {
            return new View_ConfigSlackComponent5(this.viewUtils, this, 23, this._anchor_23, this._vc_23);
        }
        if ((nodeIndex == 28)) {
            return new View_ConfigSlackComponent6(this.viewUtils, this, 28, this._anchor_28, this._vc_28);
        }
        if ((nodeIndex == 30)) {
            return new View_ConfigSlackComponent7(this.viewUtils, this, 30, this._anchor_30, this._vc_30);
        }
        if ((nodeIndex == 32)) {
            return new View_ConfigSlackComponent10(this.viewUtils, this, 32, this._anchor_32, this._vc_32);
        }
        if ((nodeIndex == 34)) {
            return new View_ConfigSlackComponent11(this.viewUtils, this, 34, this._anchor_34, this._vc_34);
        }
        if ((nodeIndex == 36)) {
            return new View_ConfigSlackComponent12(this.viewUtils, this, 36, this._anchor_36, this._vc_36);
        }
        if ((nodeIndex == 38)) {
            return new View_ConfigSlackComponent13(this.viewUtils, this, 38, this._anchor_38, this._vc_38);
        }
        return null;
    };
    View_ConfigSlackComponent0.prototype.handleEvent_9 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._NgForm_9_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'submit')) {
            var pd_sub_0 = (this.context.doSubmit() !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ConfigSlackComponent0;
}(import1.AppView));
var View_ConfigSlackComponent1 = (function (_super) {
    __extends(View_ConfigSlackComponent1, _super);
    function View_ConfigSlackComponent1(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent1, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent1.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'div', new import3.InlineArray2(2, 'class', 'step'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n        Step 4 of 4\n    ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigSlackComponent1.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent1;
}(import1.AppView));
var View_ConfigSlackComponent2 = (function (_super) {
    __extends(View_ConfigSlackComponent2, _super);
    function View_ConfigSlackComponent2(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent2, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent2.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'li', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                            ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'button', new import3.InlineArray4(4, 'onclick', 'window.open(\'https://api.slack.com/apps\')', 'type', 'button'), null);
        this._text_3 = this.renderer.createText(this._el_2, 'Create Slack App', null);
        this._text_4 = this.renderer.createText(this._el_0, '\n                        ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._text_4
        ]), null);
        return null;
    };
    View_ConfigSlackComponent2.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent2;
}(import1.AppView));
var View_ConfigSlackComponent3 = (function (_super) {
    __extends(View_ConfigSlackComponent3, _super);
    function View_ConfigSlackComponent3(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent3, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent3.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'li', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                            Copy and paste the Client ID and Client Secret from the Basic Information page to the inputs below\n                        ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigSlackComponent3.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent3;
}(import1.AppView));
var View_ConfigSlackComponent4 = (function (_super) {
    __extends(View_ConfigSlackComponent4, _super);
    function View_ConfigSlackComponent4(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent4, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent4.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'li', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                            Copy and paste the Redirect URL and Request URL from below to the corresponding pages in your Slack App configuration\n                        ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigSlackComponent4.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent4;
}(import1.AppView));
var View_ConfigSlackComponent5 = (function (_super) {
    __extends(View_ConfigSlackComponent5, _super);
    function View_ConfigSlackComponent5(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent5, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent5.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'li', import3.EMPTY_INLINE_ARRAY, null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                            Click the Add to Slack button below and follow the steps offered on Slack\'s site to finish \n                            or access the Add to Slack button on the Davis Configuration page at anytime.\n                        ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1
        ]), null);
        return null;
    };
    View_ConfigSlackComponent5.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent5;
}(import1.AppView));
var View_ConfigSlackComponent6 = (function (_super) {
    __extends(View_ConfigSlackComponent6, _super);
    function View_ConfigSlackComponent6(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent6, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent6.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_5 = this.renderer.createText(this._el_4, 'Client ID', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_2, 'input', new import3.InlineArray8(8, 'autofocus', '', 'name', 'id', 'placeholder', '2316109355.90688238946', 'type', 'text'), null);
        this._DefaultValueAccessor_7_3 = new import20.Wrapper_DefaultValueAccessor(this.renderer, new import22.ElementRef(this._el_7));
        this._NG_VALUE_ACCESSOR_7_4 = [this._DefaultValueAccessor_7_3.context];
        this._NgModel_7_5 = new import21.Wrapper_NgModel(this.parentView._ControlContainer_9_4, null, null, this._NG_VALUE_ACCESSOR_7_4);
        this._NgControl_7_6 = this._NgModel_7_5.context;
        this._NgControlStatus_7_7 = new import14.Wrapper_NgControlStatus(this._NgControl_7_6);
        this._text_8 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_9 = this.renderer.createText(this._el_0, '\n            ', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_7, new import3.InlineArray8(8, 'ngModelChange', null, 'keyup', null, 'input', null, 'blur', null), this.eventHandler(this.handleEvent_7));
        this._NgModel_7_5.subscribe(this, this.eventHandler(this.handleEvent_7), true);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._text_9
        ]), [disposable_0]);
        return null;
    };
    View_ConfigSlackComponent6.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import23.DefaultValueAccessor) && (7 === requestNodeIndex))) {
            return this._DefaultValueAccessor_7_3.context;
        }
        if (((token === import24.NG_VALUE_ACCESSOR) && (7 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_7_4;
        }
        if (((token === import25.NgModel) && (7 === requestNodeIndex))) {
            return this._NgModel_7_5.context;
        }
        if (((token === import26.NgControl) && (7 === requestNodeIndex))) {
            return this._NgControl_7_6;
        }
        if (((token === import19.NgControlStatus) && (7 === requestNodeIndex))) {
            return this._NgControlStatus_7_7.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent6.prototype.detectChangesInternal = function (throwOnChange) {
        this._DefaultValueAccessor_7_3.ngDoCheck(this, this._el_7, throwOnChange);
        var currVal_7_1_0 = 'id';
        this._NgModel_7_5.check_name(currVal_7_1_0, throwOnChange, false);
        var currVal_7_1_1 = this.parentView.context.configService.values.slack.clientId;
        this._NgModel_7_5.check_model(currVal_7_1_1, throwOnChange, false);
        this._NgModel_7_5.ngDoCheck(this, this._el_7, throwOnChange);
        this._NgControlStatus_7_7.ngDoCheck(this, this._el_7, throwOnChange);
        this._NgControlStatus_7_7.checkHost(this, this, this._el_7, throwOnChange);
    };
    View_ConfigSlackComponent6.prototype.destroyInternal = function () {
        this._NgModel_7_5.ngOnDestroy();
    };
    View_ConfigSlackComponent6.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ConfigSlackComponent6.prototype.handleEvent_7 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_7_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.parentView.context.configService.values.slack.clientId = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'keyup')) {
            var pd_sub_1 = (this.parentView.context.validate() !== false);
            result = (pd_sub_1 && result);
        }
        return result;
    };
    return View_ConfigSlackComponent6;
}(import1.AppView));
var View_ConfigSlackComponent7 = (function (_super) {
    __extends(View_ConfigSlackComponent7, _super);
    function View_ConfigSlackComponent7(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent7, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_26 = import27.UNINITIALIZED;
        this._expr_27 = import27.UNINITIALIZED;
    }
    View_ConfigSlackComponent7.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_5 = this.renderer.createText(this._el_4, 'Client Secret', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_2, 'div', new import3.InlineArray2(2, 'class', 'input-button-wrapper'), null);
        this._text_8 = this.renderer.createText(this._el_7, '\n                        ', null);
        this._anchor_9 = this.renderer.createTemplateAnchor(this._el_7, null);
        this._vc_9 = new import11.ViewContainer(9, 7, this, this._anchor_9);
        this._TemplateRef_9_5 = new import15.TemplateRef_(this, 9, this._anchor_9);
        this._NgIf_9_6 = new import12.Wrapper_NgIf(this._vc_9.vcRef, this._TemplateRef_9_5);
        this._text_10 = this.renderer.createText(this._el_7, '\n                        ', null);
        this._anchor_11 = this.renderer.createTemplateAnchor(this._el_7, null);
        this._vc_11 = new import11.ViewContainer(11, 7, this, this._anchor_11);
        this._TemplateRef_11_5 = new import15.TemplateRef_(this, 11, this._anchor_11);
        this._NgIf_11_6 = new import12.Wrapper_NgIf(this._vc_11.vcRef, this._TemplateRef_11_5);
        this._text_12 = this.renderer.createText(this._el_7, '\n                        ', null);
        this._el_13 = import3.createRenderElement(this.renderer, this._el_7, 'div', new import3.InlineArray2(2, 'class', 'input-button-button'), null);
        this._text_14 = this.renderer.createText(this._el_13, '\n                            ', null);
        this._el_15 = import3.createRenderElement(this.renderer, this._el_13, 'img', new import3.InlineArray4(4, 'class', 'input-button-img', 'src', './src/eye.svg'), null);
        this._text_16 = this.renderer.createText(this._el_13, '\n                        ', null);
        this._text_17 = this.renderer.createText(this._el_7, '\n                    ', null);
        this._text_18 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_19 = this.renderer.createText(this._el_0, '\n            ', null);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_13, new import3.InlineArray2(2, 'click', null), this.eventHandler(this.handleEvent_13));
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._anchor_9,
            this._text_10,
            this._anchor_11,
            this._text_12,
            this._el_13,
            this._text_14,
            this._el_15,
            this._text_16,
            this._text_17,
            this._text_18,
            this._text_19
        ]), [disposable_0]);
        return null;
    };
    View_ConfigSlackComponent7.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import15.TemplateRef) && (9 === requestNodeIndex))) {
            return this._TemplateRef_9_5;
        }
        if (((token === import16.NgIf) && (9 === requestNodeIndex))) {
            return this._NgIf_9_6.context;
        }
        if (((token === import15.TemplateRef) && (11 === requestNodeIndex))) {
            return this._TemplateRef_11_5;
        }
        if (((token === import16.NgIf) && (11 === requestNodeIndex))) {
            return this._NgIf_11_6.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent7.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_9_0_0 = this.parentView.context.isPasswordMasked;
        this._NgIf_9_6.check_ngIf(currVal_9_0_0, throwOnChange, false);
        this._NgIf_9_6.ngDoCheck(this, this._anchor_9, throwOnChange);
        var currVal_11_0_0 = !this.parentView.context.isPasswordMasked;
        this._NgIf_11_6.check_ngIf(currVal_11_0_0, throwOnChange, false);
        this._NgIf_11_6.ngDoCheck(this, this._anchor_11, throwOnChange);
        this._vc_9.detectChangesInNestedViews(throwOnChange);
        this._vc_11.detectChangesInNestedViews(throwOnChange);
        var currVal_26 = this.parentView.context.isPasswordFocused;
        if (import3.checkBinding(throwOnChange, this._expr_26, currVal_26)) {
            this.renderer.setElementClass(this._el_7, 'input-button-wrapper-focus', currVal_26);
            this._expr_26 = currVal_26;
        }
        var currVal_27 = this.parentView.context.isPasswordMasked;
        if (import3.checkBinding(throwOnChange, this._expr_27, currVal_27)) {
            this.renderer.setElementClass(this._el_15, 'input-button-img-password-masked', currVal_27);
            this._expr_27 = currVal_27;
        }
    };
    View_ConfigSlackComponent7.prototype.destroyInternal = function () {
        this._vc_9.destroyNestedViews();
        this._vc_11.destroyNestedViews();
    };
    View_ConfigSlackComponent7.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ConfigSlackComponent7.prototype.createEmbeddedViewInternal = function (nodeIndex) {
        if ((nodeIndex == 9)) {
            return new View_ConfigSlackComponent8(this.viewUtils, this, 9, this._anchor_9, this._vc_9);
        }
        if ((nodeIndex == 11)) {
            return new View_ConfigSlackComponent9(this.viewUtils, this, 11, this._anchor_11, this._vc_11);
        }
        return null;
    };
    View_ConfigSlackComponent7.prototype.handleEvent_13 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        if ((eventName == 'click')) {
            var pd_sub_0 = ((this.parentView.context.isPasswordMasked = !this.parentView.context.isPasswordMasked) !== false);
            result = (pd_sub_0 && result);
        }
        return result;
    };
    return View_ConfigSlackComponent7;
}(import1.AppView));
var View_ConfigSlackComponent8 = (function (_super) {
    __extends(View_ConfigSlackComponent8, _super);
    function View_ConfigSlackComponent8(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent8, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent8.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'input', new import3.InlineArray16(10, 'class', 'input-button-input', 'name', 'secret', 'placeholder', '4c712f6d4fb2208ed389c33810a63df7', 'required', '', 'type', 'password'), null);
        this._DefaultValueAccessor_0_3 = new import20.Wrapper_DefaultValueAccessor(this.renderer, new import22.ElementRef(this._el_0));
        this._RequiredValidator_0_4 = new import28.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_0_5 = [this._RequiredValidator_0_4.context];
        this._NG_VALUE_ACCESSOR_0_6 = [this._DefaultValueAccessor_0_3.context];
        this._NgModel_0_7 = new import21.Wrapper_NgModel(this.parentView.parentView._ControlContainer_9_4, this._NG_VALIDATORS_0_5, null, this._NG_VALUE_ACCESSOR_0_6);
        this._NgControl_0_8 = this._NgModel_0_7.context;
        this._NgControlStatus_0_9 = new import14.Wrapper_NgControlStatus(this._NgControl_0_8);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_0, new import3.InlineArray16(10, 'ngModelChange', null, 'focus', null, 'blur', null, 'keyup', null, 'input', null), this.eventHandler(this.handleEvent_0));
        this._NgModel_0_7.subscribe(this, this.eventHandler(this.handleEvent_0), true);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), [disposable_0]);
        return null;
    };
    View_ConfigSlackComponent8.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import23.DefaultValueAccessor) && (0 === requestNodeIndex))) {
            return this._DefaultValueAccessor_0_3.context;
        }
        if (((token === import29.RequiredValidator) && (0 === requestNodeIndex))) {
            return this._RequiredValidator_0_4.context;
        }
        if (((token === import30.NG_VALIDATORS) && (0 === requestNodeIndex))) {
            return this._NG_VALIDATORS_0_5;
        }
        if (((token === import24.NG_VALUE_ACCESSOR) && (0 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_0_6;
        }
        if (((token === import25.NgModel) && (0 === requestNodeIndex))) {
            return this._NgModel_0_7.context;
        }
        if (((token === import26.NgControl) && (0 === requestNodeIndex))) {
            return this._NgControl_0_8;
        }
        if (((token === import19.NgControlStatus) && (0 === requestNodeIndex))) {
            return this._NgControlStatus_0_9.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent8.prototype.detectChangesInternal = function (throwOnChange) {
        this._DefaultValueAccessor_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        var currVal_0_1_0 = '';
        this._RequiredValidator_0_4.check_required(currVal_0_1_0, throwOnChange, false);
        this._RequiredValidator_0_4.ngDoCheck(this, this._el_0, throwOnChange);
        var currVal_0_2_0 = 'secret';
        this._NgModel_0_7.check_name(currVal_0_2_0, throwOnChange, false);
        var currVal_0_2_1 = this.parentView.parentView.context.configService.values.slack.clientSecret;
        this._NgModel_0_7.check_model(currVal_0_2_1, throwOnChange, false);
        this._NgModel_0_7.ngDoCheck(this, this._el_0, throwOnChange);
        this._NgControlStatus_0_9.ngDoCheck(this, this._el_0, throwOnChange);
        this._RequiredValidator_0_4.checkHost(this, this, this._el_0, throwOnChange);
        this._NgControlStatus_0_9.checkHost(this, this, this._el_0, throwOnChange);
    };
    View_ConfigSlackComponent8.prototype.destroyInternal = function () {
        this._NgModel_0_7.ngOnDestroy();
    };
    View_ConfigSlackComponent8.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ConfigSlackComponent8.prototype.handleEvent_0 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_0_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.parentView.parentView.context.configService.values.slack.clientSecret = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'focus')) {
            var pd_sub_1 = ((this.parentView.parentView.context.isPasswordFocused = true) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'blur')) {
            var pd_sub_2 = ((this.parentView.parentView.context.isPasswordFocused = false) !== false);
            result = (pd_sub_2 && result);
        }
        if ((eventName == 'keyup')) {
            var pd_sub_3 = (this.parentView.parentView.context.validate() !== false);
            result = (pd_sub_3 && result);
        }
        return result;
    };
    return View_ConfigSlackComponent8;
}(import1.AppView));
var View_ConfigSlackComponent9 = (function (_super) {
    __extends(View_ConfigSlackComponent9, _super);
    function View_ConfigSlackComponent9(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent9, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
    }
    View_ConfigSlackComponent9.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'input', new import3.InlineArray16(10, 'class', 'input-button-input', 'name', 'secretText', 'placeholder', '4c712f6d4fb2208ed389c33810a63df7', 'required', '', 'type', 'text'), null);
        this._DefaultValueAccessor_0_3 = new import20.Wrapper_DefaultValueAccessor(this.renderer, new import22.ElementRef(this._el_0));
        this._RequiredValidator_0_4 = new import28.Wrapper_RequiredValidator();
        this._NG_VALIDATORS_0_5 = [this._RequiredValidator_0_4.context];
        this._NG_VALUE_ACCESSOR_0_6 = [this._DefaultValueAccessor_0_3.context];
        this._NgModel_0_7 = new import21.Wrapper_NgModel(this.parentView.parentView._ControlContainer_9_4, this._NG_VALIDATORS_0_5, null, this._NG_VALUE_ACCESSOR_0_6);
        this._NgControl_0_8 = this._NgModel_0_7.context;
        this._NgControlStatus_0_9 = new import14.Wrapper_NgControlStatus(this._NgControl_0_8);
        var disposable_0 = import3.subscribeToRenderElement(this, this._el_0, new import3.InlineArray16(10, 'ngModelChange', null, 'focus', null, 'blur', null, 'keyup', null, 'input', null), this.eventHandler(this.handleEvent_0));
        this._NgModel_0_7.subscribe(this, this.eventHandler(this.handleEvent_0), true);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [this._el_0]), [disposable_0]);
        return null;
    };
    View_ConfigSlackComponent9.prototype.injectorGetInternal = function (token, requestNodeIndex, notFoundResult) {
        if (((token === import23.DefaultValueAccessor) && (0 === requestNodeIndex))) {
            return this._DefaultValueAccessor_0_3.context;
        }
        if (((token === import29.RequiredValidator) && (0 === requestNodeIndex))) {
            return this._RequiredValidator_0_4.context;
        }
        if (((token === import30.NG_VALIDATORS) && (0 === requestNodeIndex))) {
            return this._NG_VALIDATORS_0_5;
        }
        if (((token === import24.NG_VALUE_ACCESSOR) && (0 === requestNodeIndex))) {
            return this._NG_VALUE_ACCESSOR_0_6;
        }
        if (((token === import25.NgModel) && (0 === requestNodeIndex))) {
            return this._NgModel_0_7.context;
        }
        if (((token === import26.NgControl) && (0 === requestNodeIndex))) {
            return this._NgControl_0_8;
        }
        if (((token === import19.NgControlStatus) && (0 === requestNodeIndex))) {
            return this._NgControlStatus_0_9.context;
        }
        return notFoundResult;
    };
    View_ConfigSlackComponent9.prototype.detectChangesInternal = function (throwOnChange) {
        this._DefaultValueAccessor_0_3.ngDoCheck(this, this._el_0, throwOnChange);
        var currVal_0_1_0 = '';
        this._RequiredValidator_0_4.check_required(currVal_0_1_0, throwOnChange, false);
        this._RequiredValidator_0_4.ngDoCheck(this, this._el_0, throwOnChange);
        var currVal_0_2_0 = 'secretText';
        this._NgModel_0_7.check_name(currVal_0_2_0, throwOnChange, false);
        var currVal_0_2_1 = this.parentView.parentView.context.configService.values.slack.clientSecret;
        this._NgModel_0_7.check_model(currVal_0_2_1, throwOnChange, false);
        this._NgModel_0_7.ngDoCheck(this, this._el_0, throwOnChange);
        this._NgControlStatus_0_9.ngDoCheck(this, this._el_0, throwOnChange);
        this._RequiredValidator_0_4.checkHost(this, this, this._el_0, throwOnChange);
        this._NgControlStatus_0_9.checkHost(this, this, this._el_0, throwOnChange);
    };
    View_ConfigSlackComponent9.prototype.destroyInternal = function () {
        this._NgModel_0_7.ngOnDestroy();
    };
    View_ConfigSlackComponent9.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    View_ConfigSlackComponent9.prototype.handleEvent_0 = function (eventName, $event) {
        this.markPathToRootAsCheckOnce();
        var result = true;
        result = (this._DefaultValueAccessor_0_3.handleEvent(eventName, $event) && result);
        if ((eventName == 'ngModelChange')) {
            var pd_sub_0 = ((this.parentView.parentView.context.configService.values.slack.clientSecret = $event) !== false);
            result = (pd_sub_0 && result);
        }
        if ((eventName == 'focus')) {
            var pd_sub_1 = ((this.parentView.parentView.context.isPasswordFocused = true) !== false);
            result = (pd_sub_1 && result);
        }
        if ((eventName == 'blur')) {
            var pd_sub_2 = ((this.parentView.parentView.context.isPasswordFocused = false) !== false);
            result = (pd_sub_2 && result);
        }
        if ((eventName == 'keyup')) {
            var pd_sub_3 = (this.parentView.parentView.context.validate() !== false);
            result = (pd_sub_3 && result);
        }
        return result;
    };
    return View_ConfigSlackComponent9;
}(import1.AppView));
var View_ConfigSlackComponent10 = (function (_super) {
    __extends(View_ConfigSlackComponent10, _super);
    function View_ConfigSlackComponent10(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent10, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_11 = import27.UNINITIALIZED;
    }
    View_ConfigSlackComponent10.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_5 = this.renderer.createText(this._el_4, 'OAuth & Permissions - Redirect URL', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_2, 'div', new import3.InlineArray2(2, 'class', 'code'), null);
        this._text_8 = this.renderer.createText(this._el_7, '', null);
        this._text_9 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_10 = this.renderer.createText(this._el_0, '\n            ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._text_9,
            this._text_10
        ]), null);
        return null;
    };
    View_ConfigSlackComponent10.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_11 = import3.inlineInterpolate(1, '', this.parentView.context.myURL, '/oauth');
        if (import3.checkBinding(throwOnChange, this._expr_11, currVal_11)) {
            this.renderer.setText(this._text_8, currVal_11);
            this._expr_11 = currVal_11;
        }
    };
    View_ConfigSlackComponent10.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent10;
}(import1.AppView));
var View_ConfigSlackComponent11 = (function (_super) {
    __extends(View_ConfigSlackComponent11, _super);
    function View_ConfigSlackComponent11(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent11, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_11 = import27.UNINITIALIZED;
    }
    View_ConfigSlackComponent11.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item full-width'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'label', import3.EMPTY_INLINE_ARRAY, null);
        this._text_5 = this.renderer.createText(this._el_4, 'Interactive Messages - Request URL', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_7 = import3.createRenderElement(this.renderer, this._el_2, 'div', new import3.InlineArray2(2, 'class', 'code'), null);
        this._text_8 = this.renderer.createText(this._el_7, '', null);
        this._text_9 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_10 = this.renderer.createText(this._el_0, '\n            ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._el_7,
            this._text_8,
            this._text_9,
            this._text_10
        ]), null);
        return null;
    };
    View_ConfigSlackComponent11.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_11 = import3.inlineInterpolate(1, '', this.parentView.context.myURL, '/slack/receive');
        if (import3.checkBinding(throwOnChange, this._expr_11, currVal_11)) {
            this.renderer.setText(this._text_8, currVal_11);
            this._expr_11 = currVal_11;
        }
    };
    View_ConfigSlackComponent11.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent11;
}(import1.AppView));
var View_ConfigSlackComponent12 = (function (_super) {
    __extends(View_ConfigSlackComponent12, _super);
    function View_ConfigSlackComponent12(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent12, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_10 = import27.UNINITIALIZED;
    }
    View_ConfigSlackComponent12.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item next'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'a', import3.EMPTY_INLINE_ARRAY, null);
        this._text_5 = this.renderer.createText(this._el_4, '\n                        ', null);
        this._el_6 = import3.createRenderElement(this.renderer, this._el_4, 'img', new import3.InlineArray16(10, 'alt', 'Add to Slack', 'height', '40', 'src', 'https://platform.slack-edge.com/img/add_to_slack.png', 'srcset', 'https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x', 'width', '139'), null);
        this._text_7 = this.renderer.createText(this._el_4, '\n                    ', null);
        this._text_8 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_9 = this.renderer.createText(this._el_0, '\n            ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._el_6,
            this._text_7,
            this._text_8,
            this._text_9
        ]), null);
        return null;
    };
    View_ConfigSlackComponent12.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_10 = import3.inlineInterpolate(1, 'https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=', this.parentView.context.configService.values.slack.clientId, '');
        if (import3.checkBinding(throwOnChange, this._expr_10, currVal_10)) {
            this.renderer.setElementProperty(this._el_4, 'href', this.viewUtils.sanitizer.sanitize(import31.SecurityContext.URL, currVal_10));
            this._expr_10 = currVal_10;
        }
    };
    View_ConfigSlackComponent12.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent12;
}(import1.AppView));
var View_ConfigSlackComponent13 = (function (_super) {
    __extends(View_ConfigSlackComponent13, _super);
    function View_ConfigSlackComponent13(viewUtils, parentView, parentIndex, parentElement, declaredViewContainer) {
        _super.call(this, View_ConfigSlackComponent13, renderType_ConfigSlackComponent, import5.ViewType.EMBEDDED, viewUtils, parentView, parentIndex, parentElement, import6.ChangeDetectorStatus.CheckAlways, declaredViewContainer);
        this._expr_8 = import27.UNINITIALIZED;
        this._expr_9 = import27.UNINITIALIZED;
    }
    View_ConfigSlackComponent13.prototype.createInternal = function (rootSelector) {
        this._el_0 = import3.createRenderElement(this.renderer, null, 'section', new import3.InlineArray2(2, 'class', 'flex-container'), null);
        this._text_1 = this.renderer.createText(this._el_0, '\n                ', null);
        this._el_2 = import3.createRenderElement(this.renderer, this._el_0, 'div', new import3.InlineArray2(2, 'class', 'flex-item next'), null);
        this._text_3 = this.renderer.createText(this._el_2, '\n                    ', null);
        this._el_4 = import3.createRenderElement(this.renderer, this._el_2, 'button', new import3.InlineArray4(4, 'class', 'nextBtn', 'type', 'submit'), null);
        this._text_5 = this.renderer.createText(this._el_4, '', null);
        this._text_6 = this.renderer.createText(this._el_2, '\n                ', null);
        this._text_7 = this.renderer.createText(this._el_0, '\n            ', null);
        this.init(this._el_0, (this.renderer.directRenderer ? null : [
            this._el_0,
            this._text_1,
            this._el_2,
            this._text_3,
            this._el_4,
            this._text_5,
            this._text_6,
            this._text_7
        ]), null);
        return null;
    };
    View_ConfigSlackComponent13.prototype.detectChangesInternal = function (throwOnChange) {
        var currVal_8 = ((this.parentView.context.buttonText === 'Skip and Finish') || (this.parentView.context.buttonText === 'Skip'));
        if (import3.checkBinding(throwOnChange, this._expr_8, currVal_8)) {
            this.renderer.setElementClass(this._el_4, 'warning', currVal_8);
            this._expr_8 = currVal_8;
        }
        var currVal_9 = import3.inlineInterpolate(1, '', this.parentView.context.buttonText, '');
        if (import3.checkBinding(throwOnChange, this._expr_9, currVal_9)) {
            this.renderer.setText(this._text_5, currVal_9);
            this._expr_9 = currVal_9;
        }
    };
    View_ConfigSlackComponent13.prototype.visitRootNodesInternal = function (cb, ctx) {
        cb(this._el_0, ctx);
    };
    return View_ConfigSlackComponent13;
}(import1.AppView));
//# sourceMappingURL=config-slack.component.ngfactory.js.map