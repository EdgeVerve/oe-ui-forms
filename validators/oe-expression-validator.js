/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

/**
 * # oe-expression-validator
 * `oe-expression-validator` evaluates an `expression` on the bound `model` to decide the model validity.
 * 
 * 
 * @customElement
 * @appliesMixin OECommonMixin
 * @polymer
 */
class oeExpressionValidator extends OECommonMixin(PolymerElement) {
  static get is() {
    return "oe-expression-validator";
  }

  static get hostAttributes() {
    return {
      "hidden": true
    };
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

  static get properties() {
    return {
      /**
      * fields that would participate in validation
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
       * validation expression
       */
      expression: {
        type: String
      },

      /**
       * error message/code to raise when validation fails
       */
      error: {
        type: String,
        value: 'Invalid Combination'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.expression) {
      console.warn(this.is, ' expects expression');
    }
    this._evalFunc = new Function(this.fields, 'return (' + this.expression + ');');
    this.fire('register-validator', this.fields);
  }

  /**
   *  Performs validation and triggers appropriate validation event.
   */
  validate() {
    var values = [];

    for (var idx = 0; idx < this.fields.length; idx++) {
      var value = this._deepValue(this.model, this.fields[idx]);
      values.push(value);
    }

    var valid = this._evalFunc.apply(this, values);
    if (!valid) {
      this.fire('oe-validator-error', this.error);
    } else {
      this.fire('oe-validator-ok');
    }
    return Promise.resolve({
      valid: valid,
      message: this.error
    });
  }
}

window.customElements.define(oeExpressionValidator.is, oeExpressionValidator);