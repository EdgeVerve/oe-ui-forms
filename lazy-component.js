/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";
import { DomApi } from "@polymer/polymer/lib/legacy/polymer.dom.js";

/**
 * # lazy-component
 * The lazy component is used to dynamically fetch the component from the url and set the model data to it.
 * 
 * @customElement
 * @polymer
 * @demo demo/demo-meta-polymer.html
 */
class lazyComponent extends OECommonMixin(PolymerElement) {
  static get template() {
    return html`
		<div></div>
		`;
  }

  static get is() {
    return "lazy-component";
  }

  static get properties() {
    return {
      /**
       * url for the file to import
       */
      url: {
        type: String,
        observer: "_setUrl"
      },

      /**
       * Data to be set on the element once imported
       */
      model: {
        type: Object,
        notify: true,
        value: function () {
          return {};
        }
      },

      /**
       * Event to be emitted when content is saved on the element.
       * This property is forwarded into the element as 'emit-on-save'
       */
      emitOnSave: {
        type: String,
        observer: "_emitOnSaveChanged"
      },

      /**
       * Automatically load the element when the component is attached to the DOM.
       */
      auto: {
        type: Boolean,
        value: false
      },

      /**
       * Name of the element to be created , if element definition is not exported by the component file.
       */
      elementName: {
        type: String,
        observer: "_elementChanged"
      }
    };
  }

  static get observers() {
    return [
      "modelChanged(model.*)"
    ];
  }

  /**
   * If the url is updated , the component loads the element
   * @param {string} newUrl 
   * @param {string} oldUrl 
   */
  _setUrl(newUrl, oldUrl) { // eslint-disable-line no-unused-vars
    if (this.url) {
      this.initialised = false;
      this._loadElement();
    }
  }

  _elementChanged(newName,oldName){
    if(this.elementName){
      this.initialised = false;
      this._loadElement();
    }
  }

  created() {
    this.refreshing = false;
  }

  /**
   * When content of the binded model is changed , forwards the change to the element loaded
   * @param {Object} changed model change details
   */
  modelChanged(changed) {
    var self = this;
    if (!this.refreshing && this.element) {
      self.refreshing = true;
      if (changed.path) {
        var field = changed.path.replace('model', this.element.modelAlias||this._modelName);
        this.element.set(field, changed.value);
      } else {
        this.element.set(this._modelName, changed.value);
      }
      self.refreshing = false;
    }
  }

  /**
   * Forwards the property 'emitOnSave' to the element.
   * @param {string} oldVal 
   * @param {string} newVal 
   */
  _emitOnSaveChanged(oldVal, newVal) { // eslint-disable-line no-unused-vars
    if (this.element) {
      this.element.set('emitOnSave', this.emitOnSave);
    }
  }


  /**
   * Registers a element and adds listener on the 'model' of the property.
   * @param {HTMLElement} el Element loaded from the URL.
   */
  _registerEvent(el) {
    var self = this;
    var modelName = el.modelAlias || 'vm';
    el.addEventListener(modelName + '-changed', function (changed) {
      if (!self.refreshing) {
        self.refreshing = true;
        if (changed.detail.path) {
          var field = changed.detail.path;
          field = field.replace(modelName, 'model');
          self.set(field, changed.detail.value);
        } else {
          self.model = {};
          self.set('model', changed.detail.value);
        }
        self.refreshing = false;
      }
    });
    this.fire('lazy-component-loaded');
  }

  /**
   * Imports the element and loads the element into the DOM.
   */
  _loadElement() {
    var self = this;
    if (!self.url && !self.elementName) {
      return;
    }
    if (self.initialised) {
      return;
    }
    self.initialised = true;
    
    if(self.elementName && typeof window.customElements.get(self.elementName) === "function"){
      // if the element is already registered as custom element skip Import
      self.loaded = false;
      self.__loadComponent(self.elementName);
      return;
    }

    import(self.url).then(function (e) {
      self.loaded = false;
      var elName;
      if (typeof e.default === "function" && e.default.is) {
        elName = e.default.is;
      } else {
        elName = self.elementName;
      }
      if (!elName) {
        self.fire('oe-show-error', "Unable to identify the element name");
        return;
      }
      self.__loadComponent(elName);
    });
  }

  __loadComponent(elName){
    var el = document.createElement(elName);
    if (el.set) {
      this.element = el;
      this._modelName = el.modelAlias || 'vm';
      el.set(this._modelName, this.model);
      if (this.emitOnSave) {
        el.set('emitOnSave', this.emitOnSave);
      }
      this._registerEvent(el);
    } else {
      el.addEventListener('meta-attached', function () {
        this.element = el;
        this._modelName = el.modelAlias || 'vm';
        el.set(this._modelName, this.model);
        this._registerEvent(el);
      }.bind(this));
    }
    var pDom = new DomApi(this.root);
    if (pDom.children.length) {
      pDom.replaceChild(el, pDom.children[0]);
    } else {
      pDom.appendChild(el);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.refreshing = false;
    if (this.auto) {
      this._loadElement();
    }
  }

  /**
   * Merges defaultVM of the form with the passed parameter and sets it on the element.
   * @param {Object} overrideObj data to override on defaultVM
   */
  newRecord(overrideObj) {
    var form = this.element;
    var model = (form.defaultVM ? JSON.parse(JSON.stringify(form.defaultVM)) : {});
    model = Object.assign(model, overrideObj);
    model = JSON.parse(JSON.stringify(model));
    this.set('model', model);
  }
}

window.customElements.define(lazyComponent.is, lazyComponent);