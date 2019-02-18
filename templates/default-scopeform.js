/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 * OEUtils.FormValidationBehavior, OEUtils.ModelHandler, OEUtils.FormMessagesBehavior
 */
import { html, PolymerElement } from "/node_modules/@polymer/polymer/polymer-element.js";
import "/node_modules/oe-input/oe-json-input.js";
import "/node_modules/oe-ui-forms/meta-polymer.js";
import "/node_modules/@polymer/paper-button/paper-button.js";
import "/node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "/node_modules/@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import { OEFormValidationMixin } from "/node_modules/oe-mixins/form-mixins/oe-form-validation-mixin.js";
import { OEModelHandler } from "/node_modules/oe-mixins/form-mixins/oe-model-handler.js";
import { OEFormMessagesMixin } from "/node_modules/oe-mixins/form-mixins/oe-form-messages-mixin.js";

/**
 * @templateInformation
 *    @className defaultScopeForm
 *    @description Default form template with save functionalities and scope field
 *    @modelRequired true   
 */

 /**
 * @customElement
 * @polymer
 */
class defaultScopeForm extends OEFormMessagesMixin(OEModelHandler(OEFormValidationMixin(PolymerElement))) {
    static get template() {
        return html`
		<style include="iron-flex iron-flex-alignment">
            :host{
                display: block;
                padding: 16px;
                box-sizing: border-box;
            }
            #fields > *{
                width: calc(50% - 16px);
                padding: 0px 8px;
            }
            #grids > *{
                width: calc(100% - 16px);
                padding: 0px 8px;
            }
        </style>
        <div class="content layout vertical">
            <div class="oeform layout vertical">
                <div class="layout horizontal">
                    <h2 class="flex"><oe-i18n-msg msgid=":modelName">:modelName</oe-i18n-msg></h2>
                    <div>
                        <template is="toolbar"></template>
                        <paper-button raised primary on-tap="doSave" oe-action-model=":modelAlias"><oe-i18n-msg msgid="save">Save</oe-i18n-msg></paper-button>
                        <paper-button raised on-tap="doClear" oe-action-model=":modelAlias"><oe-i18n-msg msgid="clear">Clear</oe-i18n-msg></paper-button>
                        <template is="dom-if" if="{{:modelAlias.id}}">
                            <paper-button raised on-tap="doFetch"><oe-i18n-msg msgid="reset">Reset</oe-i18n-msg></paper-button>
                            <paper-button raised on-tap="doDelete" oe-action-model=":modelAlias"><oe-i18n-msg msgid="delete">Delete</oe-i18n-msg></paper-button>
                        </template>
                    </div>
                </div>
                <div id="fields" class="layout horizontal wrap"></div>
                <div id="grids" class="layout vertical"></div>
                <oe-json-input fieldid="scope" field-id="scope" label="scope"></oe-json-input>
            </div>
        </div>`;
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

}

window.customElements.metadefine(defaultScopeForm.is, defaultScopeForm);

export const defaultScopeFormClass = defaultScopeForm;