/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from '/node_modules/@polymer/polymer/polymer-element.js';
import { OECommonMixin } from "/node_modules/oe-mixins/oe-common-mixin.js";
import "/node_modules/oe-ui-forms/meta-polymer.js";

/**
 * @templateInformation
 *    @className blankElement
 *    @description Empty template with single container
 *    @modelRequired true 
 * 
 */

/**
 * @customElement
 * @polymer
 */
class blankElement extends OECommonMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        padding: 8px;
      }
      #content {
        background: #fff;
      }
    </style>
		<div class="content" id="content"></div>`;
  }

  static get is() {
    return ":componentName";
  }
}

window.customElements.metadefine(blankElement.is, blankElement);

export const blankElementClass = blankElement;