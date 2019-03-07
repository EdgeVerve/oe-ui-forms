/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

/**
 * # oe-ne-validator
 * `oe-ne-validator` evaluates values of two fields on the bound `model` to make sure they are *not* same.
 * 
 * 
 * @customElement
 * @appliesMixin OECommonMixin
 * @polymer
 */
class oeNeValidator extends OECommonMixin(PolymerElement) {
  static get is() {
    return "oe-ne-validator";
  }

  static get hostAttributes() {
    return {
      "hidden": true
    };
  }

  static get properties() {
    return {
      /**
       * Fields that would participate in validation
       */
      fields: {
        type: Array
      },

      /**
       * Model on which expression will be evaluated
       */
      model: {
        type: Object
      },

      /**
       * error message/code to raise when validation fails
       */
      error: {
        type: String,
        value: 'Values are same'
      }

      /**
       * Fired when validator is attached
       *
       * @event register-validator
       */

      /**
       * Fired when validation fails
       *
       * @event oe-validator-error
       */

      /**
       * Fired when validation succeeds
       *
       * @event oe-validator-ok
       */
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.fields && this.fields.length == 2) {
      this.fromField = this.fields[0];
      this.toField = this.fields[1];
    } else {
      console.warn(this.is, ' expects 2 fields');
    }
    this.fire('register-validator', this.fields);
  }

  /**
   * Performs validation and triggers appropriate validation event.
   */
  validate() {
    var from = this._deepValue(this.model, this.fromField);
    var to = this._deepValue(this.model, this.toField);
    //console.log('ne validator ', from, to);

    var valid = true;
    if (from && to && from == to) {
      this.fire('oe-validator-error', this.error);
      valid = false;
    } else {
      this.fire('oe-validator-ok');
    }
    return Promise.resolve({
      valid: valid,
      message: this.error
    });
  }
}

window.customElements.define(oeNeValidator.is, oeNeValidator);