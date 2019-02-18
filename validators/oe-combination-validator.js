/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

/**
 * # oe-combination-validator
 * `oe-combination-validator` evaluates fields on the bound `model` and ensures the combination is one of the defined `combinations`.
 * 
 * 
 * @customElement
 * @appliesMixin OECommonMixin
 * @polymer
 */
class oeCombinationValidator extends OECommonMixin(PolymerElement) {
  static get is() {
    return "oe-combination-validator";
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
       * array of valid combinations.
       */
      combinations: {
        type: Array,
        value: function () {
          return [];
        }
      },

      /**
       * String denoting to check if combination should exist
       */
      ensure: {
        type: String,
        value: 'present'
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
    this.fire('register-validator', this.fields);
  }

  /**
   * Checks if two javascript objects are equivalent. Only top level properties are checked for equivalence.
   */
  isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      // If values of same property are not equal,
      // objects are not equivalent
      if (this._deepValue(a, propName) !== this._deepValue(b, propName)) {
        return false;
      }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
  }

 /**
  * Performs validation and triggers appropriate validation event.
  */
  validate() {

    var refObject = {};

    var valid = false;
    if (this.fields && this.combinations) {

      if (this.fields.length == 1) {
        var value = this._deepValue(this.model, this.fields[0]);
        valid = (this.combinations.indexOf(value) >= 0);
      } else {
        for (var idx = 0; idx < this.fields.length; idx++) {
          var field = this.fields[idx];
          value = this._deepValue(this.model, field);
          refObject[field] = value;
        }


        valid = false;
        for (let idx = 0; idx < this.combinations.length; idx++) {
          if (this.isEquivalent(refObject, this.combinations[idx])) {
            valid = true;
            break;
          }
        }
      }
    } else {
      valid = true;
    }

    valid = this.ensure === 'absent' ? !valid : valid;
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

window.customElements.define(oeCombinationValidator.is, oeCombinationValidator);