/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

/**
 * # oe-async-validator
 * `oe-async-validator` validates fields on the bound `model` on the server based on the provided `requesturl`.
 * 
 * 
 * @customElement
 * @appliesMixin OECommonMixin
 * @polymer
 */
class oeAsyncValidator extends OECommonMixin(PolymerElement) {
  static get is() {
    return "oe-async-validator";
  }

  static get hostAttributes() {
    return {
      "hidden": true
    };
  }

  static get properties() {
    return {
      /**
       * Array of the field ids
       */
      fields: {
        type: Array
      },

      /**
       * Model object of the fields
       */
      model: {
        type: Object
      },

      /**
       * Url to verify the validation
       */
      requesturl: {
        type: String
      },

      /**
       * String denoting whether the value should be 'present' or 'absent' in the response
       * of the url call.
       */
      ensure: {
        type: String,
        value: "present"
      },

      /**
       * Error message to display when the validation fails
       */
      error: {
        type: String,
        value: "Async validation failed."
      }
    };
  }

  /**
   * Once attached to dom sets up ajax component to perform validations and registers the validator
   */
  connectedCallback() {
    super.connectedCallback();
    var self = this;

    if (!self.requesturl) {
      console.warn(self.is, ' expects requesturl');
    }

    var ajaxCall = document.createElement('oe-ajax');
    ajaxCall.contentType = 'application/json';
    ajaxCall.handleAs = 'json';
    ajaxCall.method = 'GET';


    ajaxCall.addEventListener('response', function (event) {
      var response = event.detail.response || [];

      var valid = true;
      if (response instanceof Array) {
        valid = response.length > 0;
      } else {
        valid = response ? true : false;
      }

      valid = self.ensure == 'absent' ? !valid : valid;
      var resolved = {
        valid: valid
      };
      if (!valid) {
        resolved.message = self.error;
        self.fire('oe-validator-error', self.error);
      } else {
        self.fire('oe-validator-ok');
      }
      self.__promiseResolve && self.__promiseResolve(resolved);
    });
    ajaxCall.addEventListener('error', function (event) { // eslint-disable-line no-unused-vars
      //TODO :
      // It is observed we get error call-back on 404/record-not-found
      // So we assume the record is not found. But error could be due to invalid URL also.

      //console.warn(self.is, 'error during async validation call.');
      var resolved = {
        valid: true
      };
      if (self.ensure == 'absent') {
        self.fire('oe-validator-ok');
      } else {
        resolved.valid = false;
        resolved.message = self.error;
        self.fire('oe-validator-error', self.error);
      }
      self.__promiseResolve && self.__promiseResolve(resolved);
    });

    self.ajaxCall = ajaxCall;
    self.fire('register-validator', this.fields);
  }

  /**
   * Custom validation to check presence or absence of the value based on ajax request
   */
  validate() {
    var self = this;

    return new Promise(function (resolve, reject) { // eslint-disable-line no-unused-vars
      self.__promiseResolve = resolve;
      var requesturl = self.requesturl;
      //if URL contains [[vm.field1]] or {{vm.field2}}
      //binding will replace the values correctly anyway.
      //however if special handling is required, something
      //similar to below can be done.
      if (requesturl) {
        for (var idx = 0; idx < self.fields.length; idx++) {
          var field = self.fields[idx];
          var value = self._deepValue(self.model, field);
          requesturl = requesturl.replace(new RegExp('\\[' + field + '\\]', 'g'), value);
        }
        self.ajaxCall.url = requesturl;
        self.ajaxCall.generateRequest();
      }
      //resolve,reject called by response handlers
    });
  }
}

window.customElements.define(oeAsyncValidator.is, oeAsyncValidator);