/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import { OEFormValidationMixin } from "oe-mixins/form-mixins/oe-form-validation-mixin.js";

/**
 * # oe-block-validator
 * Provides a validation section to validate a subset of fields on form
 * 
 * ```
 * <oe-block-validator>
 *     <oe-vbox>
 *         <paper-input label="First Name"></paper-input>
 *         <paper-input label="Last Name"></paper-input>
 *         <paper-input label="City"></paper-input>
 *         <paper-input label="Zip Code"></paper-input>
 *     </oe-vbox>
 * <oe-block-validator>
 * ```
 * 
 * @customElement
 * @appliesMixin OECommonMixin
 * @appliesMixin OEFormValidationMixin
 * @polymer
 */
class oeBlockValidator extends OECommonMixin(PolymerElement) {
	static get template() {
		return html`
		<slot></slot>
		`;
	}

	static get is() {
		return "oe-block-validator";
	}

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
			 * error message/code to raise when validation fails
			 */
			error: {
				type: String,
				value: 'Fields are invalid'
			}
		};
	}

	connectedCallback() {
		super.connectedCallback();
		var self = this;
		var allControls = this.querySelectorAll('[field-id]');

		self.fieldControls = self.fieldControls || {};
		for (var i = 0; i < allControls.length; i++) {
			var control = allControls[i];
			var fieldId = control.getAttribute('field-id');
			self.fieldControls[fieldId] = self.fieldControls[fieldId] || [];

			if (self.fieldControls[fieldId].indexOf(control) < 0) {
				self.fieldControls[fieldId].push(control);
				control.set && control.set('_parent', self);
			}
		}
		this.fields = this.fields || [];
		this.fire('register-validator', this.fields);
	}

	/**
	 * Performs validation and triggers appropriate validation event.
	 */
	validate() {
		var self = this;
		return self.validateForm().then(function (state) {
			if (!state.valid) {
				self.fire('oe-validator-error', state.message || self.error);
			} else {
				self.fire('oe-validator-ok');
			}
			return state;
		});
	}
}

window.customElements.define(oeBlockValidator.is, OEFormValidationMixin(oeBlockValidator));