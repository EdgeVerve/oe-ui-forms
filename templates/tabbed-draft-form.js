/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from "/node_modules/@polymer/polymer/polymer-element.js";
import "/node_modules/oe-ui-forms/meta-polymer.js";
import "/node_modules/@polymer/iron-pages/iron-pages.js";
import "/node_modules/@polymer/iron-icon/iron-icon.js";
import "/node_modules/@polymer/iron-icons/iron-icons.js";
import "/node_modules/@polymer/paper-button/paper-button.js";
import "/node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "/node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "/node_modules/oe-ui-misc/oe-stepper.js";
import "/node_modules/oe-i18n-msg/oe-i18n-msg.js";
import { OEFormValidationMixin } from "/node_modules/oe-mixins/form-mixins/oe-form-validation-mixin.js";
import { OEFormMessagesMixin } from "/node_modules/oe-mixins/form-mixins/oe-form-messages-mixin.js";
import { OETabFormMixin } from "/node_modules/oe-mixins/form-mixins/oe-tab-form-mixin.js";
import { OEDraftFormMixin } from "/node_modules/oe-mixins/form-mixins/oe-draft-mixin.js";

/**
 * @templateInformation
 *    @className tabbedDraftForm
 *    @description Form template with paper-tab UI and draft functionality
 *    @modelRequired true   
 */

 /**
 * @customElement
 * @polymer
 */
class tabbedDraftForm extends OEDraftFormMixin(OEFormMessagesMixin(OETabFormMixin(OEFormValidationMixin(PolymerElement)))) {
    static get template() {
        return html`
        
        <style include="iron-flex iron-flex-alignment">
            :host {
                display: block;
                box-sizing: border-box;
            }

            .model-name{
                padding: 0px 16px;
            }
            .navigation-panel {
                padding: 8px;
                height: 40px;
            }

            .navigation-panel paper-button {
                border-radius: 4px;
                min-width: 80px;
            }
            .navigation-panel paper-button iron-icon{
                --iron-icon-width:20px;
                --iron-icon-height:20px;
                padding:0px 8px;
            }

            .form-container {
                padding: 0px 16px;
            }

            .dynamic-container {
                padding: 16px;
                margin-bottom: 8px;
                width: 100%;
                overflow: auto;
                display: block;
                box-sizing: border-box;
                background: #FFF;
            }

            .stepper-container {
                padding: 16px;
                box-sizing: border-box;
            }

            #stepper {
                pointer-events: none;
                --oe-stepper-circle-size: 30px;
                --oe-stepper-step-font-size: 20px;
                --oe-stepper-label-width: 130px;
                --oe-stepper-icon-bg: var(--default-primary-color);
                --oe-stepper-filling-color: var(--default-primary-color);
                --oe-stepper-data: {
                    padding-left: 8px;
                }
            }

            .left-panel-message {
                font-family: Rubik-Light;
                font-size: 20px;
                color: #000000;
                padding: 20px 0px 40px;
            }


            #tab-container.layout.vertical .form-container {
                margin-top: 4px;
                border-top: 1px solid rgba(0, 0, 0, 0.2);
                height: calc(100vh - 200px);
            }


            #tab-container.layout.horizontal .form-container {
                height: calc(100vh - 140px);
            }

            #tab-container.layout.horizontal .stepper-container {
                border-right: 1px solid rgba(0, 0, 0, 0.2);
            }
        </style>
        <div class="content layout vertical">
            <div class="oeform layout vertical">
                <h2 class="model-name">:modelName</h2>
                <div id="tab-container" class$="layout [[_getVerticalClass(isVerticalLayout)]] justified">
                    <div class="stepper-container flex-1 layout vertical">
                        <oe-stepper id="stepper" spread-value="30" class="flex" vertical={{!isVerticalLayout}} steps='[[stepperSteps]]' value=[[selectedStep]]></oe-stepper>
                    </div>
                    <div class="flex-4 form-container layout vertical justified">
                        <iron-pages id="form-pages" class="flex" selected={{selectedStep}}></iron-pages>
                        <div class="layout horizontal justified center navigation-panel">
                            <paper-button class="layout horizontal justified center" raised={{selectedStep}} on-tap="_goPrev">
                                <iron-icon icon="chevron-left"></iron-icon>
                                <oe-i18n-msg msgid="prev">Prev</oe-i18n-msg>
                            </paper-button>
                            <paper-button class="layout horizontal justified center" raised on-tap="_gotoNextorSave">
                                <oe-i18n-msg msgid="[[_computeBtnText(stepperSteps,selectedStep)]]"></oe-i18n-msg>
                                <iron-icon icon="[[_computeBtnIcon(stepperSteps,selectedStep)]]"></iron-icon>
                            </paper-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    static get is() {
        return ":componentName";
    }

    static get properties() {
        return {
            ":modelAlias": {
                type: Object,
                notify: true
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        this.set('_draftConfig', {
            'componentProps': ['selectedStep']
        });
    }
    _getVerticalClass(vertical) {
        return vertical ? "vertical" : "horizontal";
    }
    _gotoNextorSave() {
        var ironPages = this.$["form-pages"];
        var currentPage = ironPages.selectedItem;
        if (currentPage.validate) {
            currentPage.validate().then(function (status) {
                var stepErrorPath = 'stepperSteps.' + this.selectedStep + '.hasError';
                var stepCompletedPath = 'stepperSteps.' + this.selectedStep + '.isCompleted';
                this.set(stepErrorPath, !status.valid);
                this.set(stepCompletedPath, status.valid);
                if (!status.valid) {
                    this.fire('oe-show-error', currentPage.error);
                    return;
                }
                if (this.stepperSteps.length === (this.selectedStep + 1)) {
                    this.doSave();
                } else {
                    this.saveDraft(null, null, this._goNext.bind(this));
                }
            }.bind(this));
        } else {
            if (this.stepperSteps.length === (this.selectedStep + 1)) {
                this.doSave();
            } else {
                this.saveDraft(null, null, this._goNext.bind(this));
            }
        }
    }
}

window.customElements.metadefine(tabbedDraftForm.is, tabbedDraftForm);

export const tabbedDraftFormClass = tabbedDraftForm;