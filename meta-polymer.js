/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import { OEUtilityMixin } from "oe-mixins/oe-utils-mixin.js";
import { OECommonMixin } from "oe-mixins/oe-common-mixin.js";

window.OEUtils = window.OEUtils || {};
var OEUtils = window.OEUtils;
OEUtils.metadataCache = OEUtils.metadataCache || {};
OEUtils.modelDefCache = OEUtils.modelDefCache || {};
var restApiRoot = (window.OEUtils && window.OEUtils.restApiRoot) ? window.OEUtils.restApiRoot : '/api';

/**
 * Get the value from the 'obj' based on the 'path'.
 * @param {Object} obj object to navigate
 * @param {string} path path for navigation
 * @return {Any} value present in the given path of the obj.
 */
OEUtils.deepValue = function (obj, path) {
    for (var i = 0, path = path.split('.'), len = path.length; obj && i < len; i++) { // eslint-disable-line no-redeclare
        obj = obj[path[i]];
    }
    return obj;
};

/**
 * Sets specified `value` on `target` going levels down if required.
 * e.g.
 * o:{}
 * 
 * setDeepValue(o, "x",5) -> o:{x:5}
 * setDeepValue(o, "y.z",6) -> o:{x:5,y:{z:6}}
 * setDeepValue(o, "y.k",7) -> o:{x:5,y:{z:6,k:7}}
 * 
 * @param {Object} target target object to set
 * @param {string} field Path string to set
 * @param {Any} value value to set on the path
 */
OEUtils.setDeepValue = function (target, field, value) {
    if (field) {
        var fields = field.split('.');
        var leaf = fields.pop();

        var currentTarget = target;
        fields.forEach(function _forEachCb(field) {
            currentTarget[field] = currentTarget[field] || {};
            currentTarget = currentTarget[field];
        });

        if (currentTarget) {
            currentTarget[leaf] = value;
        }
    }
};

/**
 * Dynamically generates a function from the function string
 * @param {string} funcStr function string
 * @return {Function} generated function
 */
OEUtils.createFunction = function (funcStr) {
    funcStr = funcStr.trim();
    if (funcStr.startsWith('function')) {
        var head = funcStr.substr(0, funcStr.indexOf('{'));
        var body = funcStr.substring(funcStr.indexOf('{') + 1, funcStr.lastIndexOf('}'));
        var args = head.replace(/\s/g, '').replace('function(', '').replace(')', '').split(',');
        return new Function(args, body);
    } else {
        return new Function(funcStr);
    }
};

/** Start of Type Mapping settings */

var dropdownFormatter = function (value, options) {
    if (value && options.valueproperty) {
        return new Promise(function (resolve, reject) {
            var metaAjax = document.createElement('oe-ajax');
            metaAjax.contentType = 'application/json';
            metaAjax.handleAs = 'json';
            var re = new RegExp('VALUE_STRING', 'g');
            metaAjax.url = options.dataurl.replace(re, encodeURI(value));
            metaAjax.addEventListener('response', function (event) {
                resolve(event.detail.response);
            });
            metaAjax.addEventListener('error', function (event) {
                reject(OEUtils.extractErrorMessage(event));
            });
            metaAjax.generateRequest();
        });
    } else if (value && options.displayproperty) {
        return value[options.displayproperty];
    } else {
        return value;
    }
};

function getSettings(name, options, mapping) {
    var value = undefined;
    if (options && options[name] !== undefined) {
        value = options[name];
    } else if (mapping && mapping.attributes) {
        var attr = mapping.attributes.find(function (v) {
            return v.name === name;
        });
        if (attr) {
            value = attr.value;
        }
    }
    return value;
}
/*setting the uitype to TypeMappings in-case user defined then user-defined values else to default values*/
OEUtils.TypeMappings = OEUtils.TypeMappings || {};
OEUtils.TypeMappings.date = OEUtils.TypeMappings.date || {
    uiType: 'oe-date',
    formatter: function (value, options) {
        if (!value) {
            return value;
        }
        var format = getSettings('format', options, OEUtils.TypeMappings.date) || 'DD MMM YYYY';
        return OEUtils.DateUtils.format(value, format);
    }
};
OEUtils.TypeMappings.timestamp = OEUtils.TypeMappings.timestamp || {
    uiType: 'oe-datetime',
    formatter: function (value, options) {
        if (!value) {
            return value;
        }
        var format = getSettings('format', options, OEUtils.TypeMappings.timestamp) || 'DD MMM YYYY';
        return OEUtils.DateUtils.format(value, format);
    }
};
OEUtils.TypeMappings.string = OEUtils.TypeMappings.string || {
    uiType: 'oe-input'
};
OEUtils.TypeMappings.integer = OEUtils.TypeMappings.integer || {
    uiType: 'oe-input',
    attributes: [{
        name: 'type',
        value: 'number'
    }]
};
OEUtils.TypeMappings.number = OEUtils.TypeMappings.number || {
    uiType: 'oe-decimal',
    formatter: function (value, options) {
        var precision = getSettings('precision', options, OEUtils.TypeMappings.number);
        return ((value !== null && value !== undefined) && precision !== undefined) ? Number(value).toLocaleString(
            undefined, {
                minimumFractionDigits: precision,
                maximumFractionDigits: precision
            }) : value;
    }
};
OEUtils.TypeMappings.boolean = OEUtils.TypeMappings.boolean || {
    uiType: 'oe-checkbox'
};
OEUtils.TypeMappings.combo = OEUtils.TypeMappings.combo || {
    uiType: 'oe-combo',
    formatter: dropdownFormatter
};
OEUtils.TypeMappings.tags = OEUtils.TypeMappings.tags || {
    uiType: 'oe-paper-chip'
};
OEUtils.TypeMappings.list = OEUtils.TypeMappings.list || {
    uiType: 'oe-list'
};
OEUtils.TypeMappings.grid = OEUtils.TypeMappings.grid || {
    uiType: 'oe-data-table'
};
OEUtils.TypeMappings.object = OEUtils.TypeMappings.object || {
    uiType: 'oe-json-input',
    formatter: function (value, options) {
        var indent = getSettings('indent', options, OEUtils.TypeMappings.object) || 2;
        if (value && typeof value === 'object') {
            return JSON.stringify(value, null, indent);
        }
        return value;
    }
};
OEUtils.TypeMappings.model = OEUtils.TypeMappings.model || {
    uiType: 'oe-json-input',
    formatter: function (value, options) {
        var indent = getSettings('indent', options, OEUtils.TypeMappings.model) || 2;
        if (value && typeof value === 'object') {
            return JSON.stringify(value, null, indent);
        }
        return value;
    }
};
OEUtils.TypeMappings.objectid = OEUtils.TypeMappings.objectid || {
    uiType: 'oe-input'
};
OEUtils.TypeMappings.typeahead = OEUtils.TypeMappings.typeahead || {
    uiType: 'oe-typeahead',
    formatter: dropdownFormatter
};
OEUtils.TypeMappings.documentdata = OEUtils.TypeMappings.documentdata || {
    uiType: 'oe-document-data'
};
/* End of setting the uitype to TypeMappings in Case user defined else to default values */

/** End of Type Mapping settings */

/* Checking for user overridden type*/
(function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            try {
                var typeMappings = JSON.parse(xhttp.responseText);
                typeMappings.forEach(function (mapping) {
                    if (OEUtils.TypeMappings[mapping.type]) {
                        Object.assign(OEUtils.TypeMappings[mapping.type], mapping);
                    } else {
                        OEUtils.TypeMappings[mapping.type] = mapping;
                    }
                });
            } catch (e) {
                console.warn('Unable to fetch TypeMappings , using default mappings');
            }
        }
    };
    var url = OEUtils.geturl(restApiRoot + '/TypeMappings');
    xhttp.open('GET', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json;charset=encoding');
    xhttp.send();
})();

(function () {
    var deepQuery = function (selector) {
        var result = this.querySelector(selector);
        if (!result) {
            var templates = this.querySelectorAll('template');
            for (var i = 0, len = templates.length; i < len; i++) {
                result = templates[i].content.deepQuery(selector);
                if (result) {
                    return result;
                }
            }
        } else {
            return result;
        }
    };
    Element.prototype.deepQuery = deepQuery;
    DocumentFragment.prototype.deepQuery = deepQuery;
    Document.prototype.deepQuery = deepQuery;
})();



/**
 * MetaMixin to store meta data of the generated element
 * 
 *  
 * @polymer
 * @mixinFunction
 */
const MetaMixin = function (BaseClass) {

    /**
     * @polymer
     * @mixinClass
     */
    return class extends OECommonMixin(BaseClass) {
        constructor() {
            super();
            this._isEVMeta = true;
            this._metaProto = window.customElements.get(this.tagName.toLowerCase());
            this.is = this._metaProto.is;

            function findKey(meta) {
                var uniqueKey = 'id';
                meta.metadata.properties && Object.keys(meta.metadata.properties).forEach(function (prop) {
                    if (meta.metadata.properties[prop].id) {
                        uniqueKey = prop;
                    }
                });
                return uniqueKey;
            }

            if (OEUtils.metadataCache[this.is]) {
                var meta = OEUtils.metadataCache[this.is];
                this.set('meta', meta);
                this.set('modelAlias', meta.modelAlias);
                meta.metadata = meta.metadata || {};
                if (!this.resturl) {
                    this.set('resturl', meta.resturl || meta.metadata.resturl);
                }
                meta.geturl && this.set('geturl', meta.geturl);
                meta.posturl && this.set('posturl', meta.posturl);
                meta.puturl && this.set('puturl', meta.puturl);
                meta.deleteurl && this.set('deleteurl', meta.deleteurl);

                if (meta.componentData) {
                    Object.keys(meta.componentData).forEach(function (key) {
                        this.set(key, meta.componentData[key]);
                    }.bind(this));
                }

                if (!this.idField || this.idField === 'id') {
                    this.set('idField', findKey(meta));
                }
                this.set('defaultVM', meta.defaultVM);

                this.set('_fieldsmeta', meta.metadata.properties);
            }
        }

        connectedCallback() {
            super.connectedCallback();
            this.fire('meta-attached', {
                is: this.is
            });
        }
    };
};

/**
 * Gets the model defition of the model for the component defined
 * @param {string} model model name
 * @param {Function} done callback function to be called. 
 */
OEUtils.getModelDefinition = function (model, done) {
    //checks in cache
    if (OEUtils.modelDefCache[model]) {
        done(null, OEUtils.modelDefCache[model]);
    } else { // send the request to ModelDefinition for model meta
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                var modelDefinition = JSON.parse(xhttp.responseText);
                //store in the cache for further use
                OEUtils.modelDefCache[model] = modelDefinition[model];
                done(null, OEUtils.modelDefCache[model]);
            }
        };
        var url = OEUtils.geturl(restApiRoot + '/ModelDefinitions/modelmeta/' + model);
        xhttp.open('GET', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=encoding');
        xhttp.send();
    }
};

/**
 * Modifies the template and prototype provided based on the ui meta
 * @param {HTMLTemplate} template 
 * @param {Object} uimeta meta data for the element
 * @param {Function} eleClass class of the element
 */
OEUtils.Metamorph = function (template, uimeta, eleClass) {

    var templateCont = template.content;
    //Used for generating HTML elements
    var empty = document.createElement('template');
    //Map to hold elements with their fieldids
    var controlsByField = {};

    /**
     * Creates a defaultVM object for a model based on its properties
     * Recursive for properties of type 'model', gets the default value for modelproperties
     * Boolean are defaulted to false if not set by model
     * 
     * 
     * @param {string} modelName modelName to create defaultVM
     * @param {Object} models object with model key as modelName and value as their meta data.
     * @return {Object} defaultVM for the given model Name
     */
    function _getModelDefaultVM(modelName, models) {
        var defaultVM = {};
        var model = models[modelName];
        if (model) {
            model.properties && Object.keys(model.properties).forEach(function (propName) {
                var propData = model.properties[propName];
                if (propData.default !== undefined) {
                    defaultVM[propName] = propData.default;
                }
                if (propData.type === 'boolean') {
                    defaultVM[propName] = propData.default || false;
                } else if (propData.type === 'model') {
                    defaultVM[propName] = _getModelDefaultVM(propData.modeltype, models);
                }
            });
        }
        return defaultVM;
    }

    /**
     * Converts string from camel case to label (removes underscore).
     * e.g 'firstName' -> 'First Name' or '_isValid' -> 'Is Valid
     * @param {string} s camelCaseString
     * @return {string} label string
     */
    function camelCaseToLabel(s) {
        //Make the first character uppercase before split/join.
        if (s.charAt(0) === '_') {
            s = s.substr(1);
        }
        return (s.charAt(0).toUpperCase() + s.slice(1)).split(/(?=[A-Z])/).join(' ');
    }

    /**
     * Creates a HTMLElement from the tag name. Created within a template to prevent 
     * Generating a Web Component.
     * @param {string} type HTML tag name.
     * @return {HTMLElement} Element created inside a empty template.
     */
    function createNodeForElement(type) {
        var str = '<' + type + '></' + type + '>';
        empty.innerHTML = str;
        return empty.content.removeChild(empty.content.childNodes[0]);
    }

    /**
     * Generates a new HTMLElement based on the field metadata type based on typeMappings.
     * Sets the attributes from typemappings and the 'oe-field' component provided and 
     * returns a HTMLElement having the merged attributes.
     * 
     * @param {Object} fmeta field meta data object
     * @param {HTMLElement} e 'oe-field' element present in the template.
     * @return {HTMLElement} HTMLElement with merged attributes.
     */
    function createMergedNode(fmeta, e) {
        var typeMap = window.OEUtils.TypeMappings[fmeta.type] || {};
        fmeta.uitype = fmeta.uitype || typeMap.uiType || 'oe-input';
        var obj = {};
        typeMap.attributes && typeMap.attributes.forEach(function (attr) {
            obj[attr.name] = attr.value;
        });
        if (e.hasAttributes()) {
            var attrs = e.attributes;
            for (var j = attrs.length - 1; j >= 0; j--) {
                obj[attrs[j].name] = attrs[j].value;
            }
        }

        var str = '<' + fmeta.uitype + ' ';
        obj && Object.keys(obj).forEach(function (key) {
            var attrValue = obj[key];
            if (typeof attrValue === 'object') {
                str += key + "='" + JSON.stringify(attrValue) + "' ";
            } else {
                str += key + '="' + attrValue + '" ';
            }
        });
        str += '></' + fmeta.uitype + '>';
        empty.innerHTML = str;
        return empty.content.removeChild(empty.content.childNodes[0]);
    }

    /**
     * Generates a new HTMLElement based on the field metadata type based on typeMappings.
     * Sets the attributes from typemappings and returns the HTMLElement.
     * @param {Object} fmeta field meta data object
     * @return {HTMLElement} HTMLElement with typeMapping attributes.
     */
    function createNodeForMetaDefn(fmeta) {
        var typeMap = window.OEUtils.TypeMappings[fmeta.numericality || fmeta.type] || {};
        fmeta.uitype = fmeta.uitype || typeMap.uiType || 'oe-input';
        var node = createNodeForElement(fmeta.uitype);
        typeMap.attributes && typeMap.attributes.forEach(function (attr) {
            if (typeof attr.value === 'object') {
                node.setAttribute(attr.name, JSON.stringify(attr.value));
            } else {
                node.setAttribute(attr.name, attr.value);
            }
        });
        return node;
    }

    /**
     * Sets attributes on node if they are not already present.
     * 
     * @param {HTMLElement} node Element to add attributes
     * @param {Object} attributes attibutes object
     */
    function setMissingAttributes(node, attributes) {
        attributes && attributes.forEach(function (attr) {
            if (!node.getAttribute(attr.name)) {
                if (typeof attr.value === 'object') {
                    node.setAttribute(attr.name, JSON.stringify(attr.value));
                } else {
                    node.setAttribute(attr.name, attr.value);
                }
            }
        });
    }

    /**
     * Returns the Primay key property name , for the model of the form.
     * @param {Object} uimeta UIMeta data of the form.
     * @return {string} primaryKey name.
     */
    function getPrimaryKey(uimeta) {
        var primaryKey = 'id';
        if (uimeta) {
            uimeta.metadata.properties && Object.keys(uimeta.metadata.properties).forEach(function (prop) {
                if (uimeta.metadata.properties[prop].id) {
                    primaryKey = prop;
                }
            });
            return primaryKey;
        }
        return primaryKey;
    }

    /**
     * Sets attributes on the node based on fmeta and other following operations 
     * 
     *  1) Validators: Generates custom validator elements based on fmeta properties
     *              - 'in' or 'notin' generates `oe-combination-validator`
     *              - 'unique' in Boolean field generates `oe-async-validator`
     *  2) Tooltip: Generates a `paper-tooltip` based on 'tooltip' property in fmeta.
     *  3) Dynamic Binding: Generates dynamic functions when attribute value is given as binding
     *     For a form with modelAlias as 'formData' the bindings get converted as 
     *              - '{{firstName}}' => '{{formData.firstName}}
     *              - '{{@i.lastName}}' => '{{formData.lastName}}'
     *              - '{{@currentStep}}' => '{{currentStep}}'
     *     If the binding is complex that includes expression like '{{city}} =="BLR"' a function is dynamically generated to handle it.
     *  4) Data Table: For fields of type 'grid' or uitype 'oe-data-table' generates a data-table with 
     *                  auto generated editor-form-url if not provided.
     * 
     * @param {HTMLElement} node Element to set attributes based on field meta
     * @param {string} fieldId Unique fieldid 
     * @param {Object} fmeta Meta data for the field
     * @param {Object} uimeta Meta data of the form
     * @param {HTMLElement} parentNode Parent Element of the 'node' parameter
     * @param {boolean} override Flag to decide to override existing node attributes with data from fmeta.
     */
    function setAttributesOnNode(node, fieldId, fmeta, uimeta, parentNode, override) {
        var modelAlias = uimeta.modelAlias;
        parentNode = parentNode || node.parentNode;
        var expressionAttributes = ['label', 'textContent', 'value', 'class', 'required', 'disabled', 'hidden',
            'precision'
        ];
        fmeta && Object.keys(fmeta).forEach(function (attributeName) {

            if (!override && node.hasAttribute(attributeName)) {
                return;
            }

            var attributeValue = fmeta[attributeName];
            if (typeof attributeValue === 'object' ||
                Array.isArray(attributeValue)) {
                if (attributeName === 'in' || attributeName === 'notin') {
                    // Combination validator for checking presence/absence of value in array
                    var validationNode = createNodeForElement('oe-combination-validator');
                    validationNode.setAttribute('fields', '["' + fieldId + '"]');
                    validationNode.setAttribute('model', '{{' + modelAlias + '}}');
                    validationNode.setAttribute('ensure', attributeName === 'in' ? 'present' : 'absent');
                    validationNode.setAttribute('error', fieldId + '-invalid-value');
                    validationNode.setAttribute('combinations', JSON.stringify(attributeValue));
                    parentNode.appendChild(validationNode);
                }
                else if (attributeName === 'tooltip') {
                    /**
                     * Generates paper-tooltip based on 
                     * 'tooltip':{
                     *       msgid:'oe18_tooltip_id',
                     *       defaultValue:'Tooltip fallback content'
                     *   }
                     */
                    node.setAttribute('id', fieldId);
                    var tooltipNode = createNodeForElement('paper-tooltip');
                    tooltipNode.setAttribute("for", fieldId);
                    var i18nNode = createNodeForElement('oe-i18n-msg');
                    i18nNode.setAttribute('msgid', attributeValue.msgid);
                    i18nNode.innerHTML = attributeValue.defaultValue;
                    tooltipNode.appendChild(i18nNode);
                    parentNode.appendChild(tooltipNode);

                } else {
                    node.setAttribute(attributeName, JSON.stringify(attributeValue));
                }
            } else if (typeof attributeValue === 'boolean') {

                if (node.hasAttribute('oe-false-' + attributeName)) {
                    return;
                }

                if (attributeName === 'unique' && parentNode) {
                    // Async validator for checking presence/absence of value in server data
                    var validationNode = createNodeForElement('oe-async-validator'); // eslint-disable-line no-redeclare
                    validationNode.setAttribute('fields', '["' + fieldId + '"]');
                    validationNode.setAttribute('model', '{{' + modelAlias + '}}');
                    validationNode.setAttribute('ensure', 'absent');
                    validationNode.setAttribute('error', fieldId + '-not-unique');

                    var primaryKey = getPrimaryKey(uimeta);
                    var whereClause = {
                        where: {
                            and: []
                        }
                    };
                    var uniqueCondition = {};
                    uniqueCondition[fieldId] = '{{' + modelAlias + '.' + fieldId + '}}';
                    var pkCondition = {};
                    pkCondition[primaryKey] = {
                        neq: '{{' + modelAlias + '.' + primaryKey + '}}'
                    };
                    whereClause.where.and.push(uniqueCondition);
                    whereClause.where.and.push(pkCondition);
                    validationNode.setAttribute('requesturl', uimeta.metadata.resturl + '?filter=' + JSON.stringify(
                        whereClause));
                    parentNode.appendChild(validationNode);
                } else {
                    if (attributeValue) {
                        node.setAttribute(attributeName, attributeValue);
                    } else {
                        node.removeAttribute(attributeName);
                    }
                }
            } else if (['uitype', 'type', 'refcodetype', 'enum', 'enumtype', 'oetype'].indexOf(attributeName) === -1) {
                if (attributeName === 'max' && fmeta.type && (['number', 'decimal', 'integer', 'date'].indexOf(fmeta.type) === -1)) {
                    attributeName = 'maxlength';
                } else if (attributeName === 'min' && fmeta.type && (['number', 'decimal', 'integer', 'date'].indexOf(fmeta.type) ===
                    -1)) {
                    attributeName = 'minlength';
                }

                if (expressionAttributes.indexOf(attributeName) >= 0) {
                    //we may need some #identifier
                    var chunks = attributeValue.match(/{{[@]*[\w+\.]*}}/ig); //eslint-disable-line
                    //extract
                    if (chunks) {
                        var chunkDetails =
                            chunks.filter(function (v, i, a) {
                                // remove duplicates
                                return a.indexOf(v) === i;
                            })
                                .map(function (v, i) {
                                    var raw = v;
                                    var bind = v.substr(2, v.length - 4);

                                    if (bind[0] !== '@') {
                                        bind = modelAlias + '.' + bind;
                                    } else {
                                        bind = bind.replace('@i.', modelAlias + '.');
                                        //object specified explicitly e.g. {{@vm.salary}}
                                        bind = bind.replace('@', '');
                                    }
                                    var varPath = bind.split('.');
                                    var variable = varPath[varPath.length - 1] + i;
                                    return {
                                        raw: raw,
                                        variable: variable,
                                        bind: bind
                                    };
                                });

                        // remove starting and ending curly braces {{...}}

                        var bindingExpression = '';
                        if (attributeValue.substr(0, 2) === '[[' && attributeValue.substr(attributeValue.length - 2, 2) ===
                            ']]') {

                            //direct function call which is already defined as part of functions{}
                            chunkDetails.forEach(function (v) {
                                attributeValue = attributeValue.replace(new RegExp(v.raw, 'g'), v.bind);
                            });
                            bindingExpression = attributeValue;
                        } else {
                            var funcName = '_' + fmeta.fieldId.replace(new RegExp('\\.', 'g'), '_') + '_' + attributeName;
                            //expression
                            var funcArgs = chunkDetails.map(function (v) {
                                return v.variable;
                            });
                            var bindArgs = chunkDetails.map(function (v) {
                                return v.bind;
                            }).join(',');
                            bindingExpression = '[[' + funcName + '(' + bindArgs + ')]]';
                            chunkDetails.forEach(function (v) {
                                attributeValue = attributeValue.replace(new RegExp(v.raw, 'g'), v.variable);
                            });

                            //For Required attribute, 
                            //if new required value is false, 
                            //we also need to clear any previous errors.
                            var funcLogic = 'var retVal=(' + attributeValue + ');';
                            if (attributeName === 'required') {
                                funcLogic += '!retVal && this.clearFieldErrors && this.clearFieldErrors("' + fieldId + '","valueMissing");';
                            }
                            funcLogic += 'return retVal;';
                            eleClass.prototype[funcName] = new Function(funcArgs, funcLogic);
                        }

                        if (attributeName === 'value') {
                            //for value expressions we add a new property as below
                            // _fieldId_computed_value: {
                            //    computed : '_fieldId_value(....)'  //bindingExpression without {{}}
                            //    observer : '_fieldId_computed_value_observer(newVal,oldVal){vm.fieldId = newVal;};
                            //  }

                            var propName = '_' + fmeta.fieldId + '_computed_value';
                            var propConfig = {
                                computed: funcName + '(' + bindArgs + ')',
                                observer: propName + '_observer'
                            };

                            eleClass.prototype[propName + '_observer'] = new Function('newVal', 'this.set("' + modelAlias + '.' +
                                fmeta.fieldId + '",newVal);');
                            eleClass.properties = eleClass.properties || {};
                            eleClass.properties[propName] = propConfig;
                            bindingExpression = '[[' + propName + ']]';
                        }

                        attributeValue = bindingExpression;
                    }
                }
                if (attributeName === 'textContent') {
                    node.textContent = attributeValue;
                } else {
                    node.setAttribute(attributeName, attributeValue);
                }
            }
        });

        if (node.nodeName === 'OE-INFO') {
            node.setAttribute('type', fmeta.type);
        }

        if (fieldId && !fieldId.startsWith('@')) {
            if (!node.hasAttribute('field-id')) {
                node.setAttribute('field-id', fieldId);
            }
        }
        if (fmeta.type === 'documentdata') {
            if (modelAlias && fieldId && !fieldId.startsWith('@')) {
                var binding = '{{' + (fmeta.bindto || modelAlias) + '.' + fieldId + '}}';
                var binding2 = '{{' + (fmeta.bindto || modelAlias) + '.' + fmeta.relationName + '}}';
                var binding3 = uimeta.metadata.models[uimeta.modelName].resturl;
                var binding4 = '{{' + (fmeta.bindto || modelAlias) + '.id}}';
                node.setAttribute('document-id', binding);
                node.setAttribute('document', binding2);
                node.setAttribute('document-post-url', binding3);
                node.setAttribute('document-parent-attribute', modelAlias);
                node.setAttribute('parent-id', binding4);
            }
        }

        if (fmeta.type !== 'grid' || (fmeta.uitype && fmeta.uitype !== 'oe-data-table')) {

            /*if (!fmeta.class) {
                node.classList.add('evfield');
            }*/

            if (!node.hasAttribute('value')) {
                if (modelAlias && fieldId && !fieldId.startsWith('@')) {
                    var binding = '{{' + (fmeta.bindto || modelAlias) + '.' + fieldId + '}}'; // eslint-disable-line no-redeclare
                    node.setAttribute(fmeta.bindAttribute || 'value', binding);
                }
            }
        } else {
            var recordHandling = 'local';
            node.setAttribute('record-handling', recordHandling);
            //node.setAttribute('columns', '[[fields.' + fieldId + '.columns]]');
            fieldId && node.setAttribute('items', '{{' + (fmeta.bindto || modelAlias) + '.' + fieldId + '}}');

            var defaultFormUrl = fmeta['editor-form-url'];
            if(fmeta.modeltype) {
                node.setAttribute('model', fmeta.modeltype);
                
                defaultFormUrl = defaultFormUrl || (restApiRoot + '/UIComponents/component/' + fmeta.modeltype.toLowerCase() +
                    '-form.html');
            }
            defaultFormUrl && node.setAttribute('editor-form-url', defaultFormUrl);
        }

        if (fmeta.textContent) {
            node.textContent = fmeta.textContent;
        }
    }

    /**
    
     */


    /**
     * Generates a fieldMeta object based on fieldId with default settings for
     * field of 'refCode' and 'grid' type
     *  
     * @param {string} fieldId Unique field id 
     * @param {Object} modelMeta Metadata for the model containing the field
     * @param {Object} uimeta Metadata for the component.
     * @return {Object} Field meta data
     */
    function findFieldMeta(fieldId, modelMeta, uimeta) {
        var fmeta;

        if (fieldId && fieldId.indexOf('.') >= 0) {
            var path = fieldId.split('.');
            fmeta = modelMeta[path[0]] || {};
            if ((fmeta.type === 'array' && fmeta.itemtype === 'model') || (fmeta.type === 'model')) {
                modelMeta = uimeta.metadata.models[fmeta.modeltype];
                modelMeta = modelMeta && modelMeta.properties ? modelMeta.properties : {};
                path.shift();
                fieldId = path.join('.');
                fmeta = findFieldMeta(fieldId, modelMeta, uimeta);
                fmeta.label = fmeta.label || camelCaseToLabel(fieldId);
            }
        } else {
            if (fieldId && modelMeta) {
                fmeta = modelMeta[fieldId];
                if (!fmeta) {
                    fmeta = {};
                    modelMeta[fieldId] = fmeta;
                }

                fmeta.label = fmeta.label || camelCaseToLabel(fieldId);
                if (fmeta.enumtype || fmeta.refcodetype) {
                    fmeta.type = 'combo';
                    fmeta.displayproperty = 'description';
                    fmeta.valueproperty = 'code';
                    if (uimeta.metadata.models[fmeta.enumtype || fmeta.refcodetype]) {

                        /*Check if listurl property is provided in fields array
                        * In case the referenced model has additional property along with Base refcode properties
                        * They can provide the url with specific filter.
                        */
                        fmeta.listurl = fmeta.listurl || uimeta.metadata.models[fmeta.enumtype || fmeta.refcodetype].resturl;
                    }
                } else if (fmeta.in) {
                    fmeta.type = 'combo';
                    fmeta.listdata = fmeta.in;
                } else if (fmeta.type === 'array') {
                    if (fmeta.itemtype === 'model' && fmeta.modeltype) {
                        fmeta.type = 'grid';
                        if (uimeta.metadata.models[fmeta.modeltype]) {
                            fmeta.subModelMeta = uimeta.metadata.models[fmeta.modeltype].properties;
                        }
                    } else {
                        fmeta.type = 'tags';
                    }
                }
            } else {
                fmeta = {};
            }
        }
        return fmeta;
    }


    /**
     * Modifes the template content based on the meta data provided from server.
     * 
     * uimeta contains:
     *   metadata (modelMeta)
     *   fields    (prioirty fields)
     *   content   (html)
     *   container (settings to dynamically generate containers)
     *   autoInjectFields
     *         whether fields from meta
     *         should be injected in html or not
     *   excludeFields
     *        fields from modelMeta
     *        which are not to be injected
     *   elements
     *        personalized elements
     *
     * Steps involved are :
     * 1. Enrich metadata received from server
     * 2. Form controlsByField which stores mapping of filed-ids to controls
     * 3. From content (if-any) get injector container
     *      -   injector main concontainer is set to container having id as fields
     *      -   if container with id=fields is not present then template itself is taken as inect container.
     * 4. From the container generate dynamic container that can be used to place the fields.
     * 5. oe-fields is expanded to create controls for each field
     * 6. if uimeta has fields
     *    then for each field a control is created if not present
     * 7. if autoInjectFields is set then all remaining fields from modelMeta are injected.
     * 
     * Finally attributes on personalized elements are set
     * 
     * @param {Object} uimeta UIMetadata to enrich the template
     */
    function mixmeta(uimeta) {
        var defaultVM = {};
        var personalizedVM = {};
        uimeta.modelAlias = eleClass.modelAlias || uimeta.modelAlias;
        uimeta.metadata = uimeta.metadata || {};
        var modelMeta = uimeta.metadata.properties || {};
        uimeta.dynamicDefaults = uimeta.dynamicDefaults || [];
        var excludeFields = uimeta.excludeFields || [];
        var oeValidations = uimeta.oeValidations || [];
        if (!Array.isArray(excludeFields)) {
            excludeFields = [];
        }

        /**
         * If autoInjectFields is true add default values for all properties
         */
        if (uimeta.autoInjectFields) {
            modelMeta && Object.keys(modelMeta).forEach(function (fieldId) {
                var fmeta = modelMeta[fieldId] || {};
                fmeta.label = fmeta.label || camelCaseToLabel(fieldId);
                if (fmeta.type == 'model') {
                    OEUtils.setDeepValue(defaultVM, fieldId, _getModelDefaultVM(fmeta.modeltype, uimeta.metadata.models));
                } else {
                    OEUtils.setDeepValue(defaultVM, fieldId, (fmeta.type === 'boolean' && fmeta.default === undefined ? false : fmeta.default));
                }
            });
        }

        // field id in elements can be string -> fieldid
        // @something, something css selector
        if (uimeta.elements) {
            Object.keys(uimeta.elements).forEach(function (fieldId) {
                if (!fieldId.startsWith('@')) {
                    var fmeta = findFieldMeta(fieldId, modelMeta, uimeta);
                    var el = uimeta.elements[fieldId];
                    fmeta.uitype = el.uitype;
                    fmeta.container = el.container;
                    fmeta.order = el.order;
                    fmeta.default = el.default !== undefined ? el.default : fmeta.default;
                    if (fmeta.default && typeof fmeta.default.startsWith === "function" && fmeta.default.startsWith('@')) {
                        uimeta.dynamicDefaults.push({
                            field: fieldId,
                            value: fmeta.default
                        });
                    } else {
                        OEUtils.setDeepValue(personalizedVM, fieldId, fmeta.default);
                    }
                }
            });
        }

        /**
         * QuerySelectAll and collect all the fields that are pre-defined in the template.
         * controlsByField is later used to identify if field has to be auto-injected or not.
         * TODO we should not replace attributes already present
         * 
         * @param {HTMLElement} parent parent node
         * @param {HTMLElement} node node to start the seach
         * @param {string} query HTML querySelector string
         * @param {Array} results 
         */
        function walk(parent, node, query, results) {
            var nodes = node.querySelectorAll(query);
            var parentFieldId;
            if (parent.hasAttribute('field-id')) {
                parentFieldId = parent.getAttribute('field-id');
            }

            for (var j = 0; j < nodes.length; j++) {
                if (parentFieldId) {
                    nodes[j].setAttribute('parent-field-id', parentFieldId);
                }
                var metaId = nodes[j].getAttribute('field-id');
                if (parentFieldId) {
                    var fullFieldId = parentFieldId + '.{{index}}.' + metaId;
                    nodes[j].setAttribute('field-id', fullFieldId);
                    var itemName = 'item';
                    if (parent.hasAttribute('as')) {
                        itemName = parent.getAttribute('as');
                    }
                    var binding = '{{' + itemName + '.' + metaId + '}}';
                    nodes[j].setAttribute('value', binding);
                    metaId = parentFieldId + '.' + metaId;
                }
                nodes[j].setAttribute('meta-field-id', metaId);
                results.push(nodes[j]);
            }
            var templates = node.querySelectorAll('template');
            for (var i = 0; i < templates.length; i++) {
                // Children are siblings to each other
                var template = templates[i];
                // dom-repeat check to fix 2 issues.
                // Issue 1.
                // There is case when a model has a dom-repeat of submodel so field is not getting injected for parent model
                // Issue 2.
                //  attributes on sub model in dom repeat is getting set from parent model meta.
                if (template.is && template.is === 'dom-repeat') { // eslint-disable-line no-empty
                } else {
                    walk(template, templates[i].content, query, results);
                }
            }
        }

        if (templateCont) {
            var queryFields = [];

            /**
             * Sets uimeta.content into the template based on the 'oe-container' attribute of each node in content.
             */
            var defaultInject = templateCont.deepQuery('#fields') || templateCont;
            if (uimeta.content) {
                var tpl = document.createElement('template');
                tpl.innerHTML = uimeta.content;
                //IE doesn't support children
                var childrenNodes = [].filter.call(tpl.content.childNodes,function(n){
                    return n.nodeType === Node.ELEMENT_NODE;
                });
                while (childrenNodes.length > 0) {
                    var node = childrenNodes[0];
                    var containerName = node.getAttribute('oe-container');
                    var parent = null;
                    if (containerName) {
                        parent = templateCont.deepQuery('#' + containerName);
                        if (!parent) {
                            parent = document.createElement('div');
                            parent.setAttribute('id', containerName);
                            templateCont.appendChild(parent);
                        }
                    } else {
                        if (node.hasAttribute('field-id')) {
                            parent = defaultInject;
                        } else {
                            parent = templateCont;
                        }
                    }
                    parent.appendChild(node);
                    childrenNodes = [].filter.call(tpl.content.childNodes,function(n){
                        return n.nodeType === Node.ELEMENT_NODE;
                    });
                }
            }

            /**
             * Finds HTML eLements with 'field-id' attribute and enriches it based on metadata
             */
            walk(template, templateCont, '[field-id]', queryFields);
            for (var i = 0; i < queryFields.length; ++i) {
                var e = queryFields[i];
                var fieldId = e.getAttribute('meta-field-id') || e.getAttribute('field-id');
                var fmeta = findFieldMeta(fieldId, modelMeta, uimeta);
                if (e.nodeName === 'OE-FIELD') {
                    var node = createMergedNode(fmeta, e); // eslint-disable-line no-redeclare
                    setAttributesOnNode(node, fieldId, fmeta, uimeta, e.parentNode, false);
                    if (e.parentNode) {
                        e.parentNode.replaceChild(node, e);
                    }
                    e = node;
                } else {
                    var typeMap = window.OEUtils.TypeMappings[fmeta.type] || {};
                    setMissingAttributes(e, typeMap.attributes);
                    setAttributesOnNode(e, fieldId, fmeta, uimeta, e.parentNode, false);
                }
                controlsByField[fieldId] = controlsByField[fieldId] || [];
                controlsByField[fieldId].push(e);
            }

            /**
             * Select oe-fields tags with list attribute and generate element for each field.
             * <oe-fields list="firstName,lastName"></oe-fields> is translated into two elements one each for firstName and lastName.
             * 
             */
            var fldcontainers = templateCont.querySelectorAll('oe-fields[list]');
            for (i = 0; i < fldcontainers.length; ++i) {
                var e = fldcontainers[i]; // eslint-disable-line no-redeclare
                var list = e.getAttribute('list');
                list = list.split(',');
                list.forEach(function (fieldId) { // eslint-disable-line no-loop-func
                    var fmeta = findFieldMeta(fieldId, modelMeta, uimeta);
                    var node = createNodeForMetaDefn(fmeta);
                    setAttributesOnNode(node, fieldId, fmeta, uimeta, defaultInject, false);
                    var cont;
                    if (fmeta.container) {
                        cont = defaultInject.deepQuery('#' + fmeta.container);
                        if (!cont) {
                            cont = defaultInject.deepQuery(fmeta.container);
                        }
                    }
                    if (cont) {
                        cont.appendChild(node);
                    } else {
                        e.parentNode.insertBefore(node, e);
                    }
                    controlsByField[fieldId] = controlsByField[fieldId] || [];
                    controlsByField[fieldId].push(node);
                });
                e.parentNode.removeChild(e);
            }
        }

        //Create containers dynamically based on UIComponent property container
        if (uimeta.container) {
            var containerSteps = uimeta.container.steps;
            if (containerSteps && Array.isArray(containerSteps)) {
                containerSteps.forEach(function (step) {
                    var targetQuery = step.target || uimeta.container.target;
                    var targetEle = templateCont.deepQuery(targetQuery);
                    if (!targetEle) {
                        console.warn('Could not find element based on query ' + targetQuery + ' to generate containers');
                        return;
                    }
                    var nodeAttributes = step.nodeAttributes || uimeta.container.nodeAttributes;
                    var contEl = createNodeForElement(step.nodeType || uimeta.container.nodeType || 'div');
                    contEl.setAttribute('id', step.id);
                    if (nodeAttributes) {
                        Object.keys(nodeAttributes).forEach(function (attrKey) {
                            contEl.setAttribute(attrKey, nodeAttributes[attrKey]);
                        });
                    }
                    targetEle.appendChild(contEl);
                });
            }
        }

        if (uimeta.fields && Array.isArray(uimeta.fields)) {
            uimeta.fields.forEach(function (fmeta) {

                if (typeof fmeta === 'string') {
                    fmeta = {
                        fieldId: fmeta
                    };
                }

                //is it?? ok to override modelMeta object with fields attributes
                var mmeta = findFieldMeta(fmeta.fieldId, modelMeta, uimeta);
                fmeta = Object.assign(mmeta, fmeta);

                if (fmeta.default && fmeta.default.startsWith && fmeta.default.startsWith('@')) {
                    uimeta.dynamicDefaults.push({
                        field: fmeta.fieldId,
                        value: fmeta.default
                    });
                } else {
                    OEUtils.setDeepValue(defaultVM, fmeta.fieldId, fmeta.default);
                }

                var fieldId = fmeta.fieldId;

                if (fieldId && excludeFields.indexOf(fieldId) !== -1) {
                    return;
                }

                var nodes = controlsByField[fieldId];
                if (!nodes || nodes.length === 0) {
                    var node = createNodeForMetaDefn(fmeta);
                    if (!node) {
                        //console.log('node is null');
                    } else {
                        var container;
                        if (fmeta.container) {
                            container = templateCont.deepQuery('#' + fmeta.container);
                            if (!container) {
                                container = document.createElement('div');
                                container.setAttribute('id', fmeta.container);
                                templateCont.appendChild(container);
                            }
                        } else {
                            container = defaultInject;
                        }
                        container.appendChild(node);
                        controlsByField[fieldId] = controlsByField[fieldId] || [];
                        if (fieldId) {
                            controlsByField[fieldId].push(node);
                            nodes = controlsByField[fieldId];
                        } else {
                            //create temporary array for setting attributes.
                            nodes = [node];
                        }
                    }
                }
                nodes && nodes.forEach(function (node) {
                    setAttributesOnNode(node, fieldId, fmeta, uimeta, defaultInject, false);
                });
            });
        }

        if (uimeta.autoInjectFields) {
            var sortedMeta = Object.keys(modelMeta).sort(function (l, r) {
                var lmeta = modelMeta[l];
                var rmeta = modelMeta[r];
                if (lmeta.order && rmeta.order) {
                    if (lmeta.order < rmeta.order) {
                        return -1;
                    }
                    if (lmeta.order < rmeta.order) {
                        return 1;
                    }
                    return 0;
                } else if (lmeta.order) {
                    return -1;
                } else if (rmeta.order) {
                    return 1;
                }
                return 0;
            });

            sortedMeta.forEach(function (fieldId) {
                if (excludeFields.indexOf(fieldId) !== -1) {
                    return;
                }
                var fmeta = modelMeta[fieldId] || {};
                if (fmeta.deprecated) {
                    return;
                }

                if (fmeta.type === 'model') {
                    OEUtils.setDeepValue(defaultVM, fieldId, _getModelDefaultVM(fmeta.modeltype, uimeta.metadata.models));
                } else {
                    OEUtils.setDeepValue(defaultVM, fieldId, (fmeta.type === 'boolean' && fmeta.default === undefined ? false : fmeta.default));
                }

                if (controlsByField[fieldId]) {
                    return;
                }

                var nodesForField = [];
                if (fmeta.type === 'model' && !fmeta.uitype) {
                    //render a composite field as multiple controls
                    var subModelMeta = uimeta.metadata.models[fmeta.modeltype];
                    subModelMeta = subModelMeta && subModelMeta.properties ? subModelMeta.properties : {};

                    subModelMeta && Object.keys(subModelMeta).forEach(function (subField) {
                        var subFieldMeta = findFieldMeta(subField, subModelMeta, uimeta);
                        subFieldMeta.label = subFieldMeta.label || camelCaseToLabel(subField);

                        if (!subFieldMeta.uitype) {
                            if (subFieldMeta.in) {
                                subFieldMeta.type = 'combo';
                                subFieldMeta.listdata = subFieldMeta.in;
                            } else if (subFieldMeta.enumtype || subFieldMeta.refcodetype) {
                                subFieldMeta.type = 'combo';
                                subFieldMeta.displayproperty = 'description';
                                subFieldMeta.valueproperty = 'code';
                                var relatedModel = uimeta.metadata.models[subFieldMeta.enumtype || subFieldMeta.refcodetype];
                                subFieldMeta.listurl = relatedModel ? relatedModel.resturl : undefined;
                            } else if (subFieldMeta.type === 'array') {
                                if (subFieldMeta.itemtype === 'model') {
                                    subFieldMeta.type = 'grid';
                                    subFieldMeta.subModelMeta = uimeta.metadata.models[subFieldMeta.modeltype].properties;
                                } else {
                                    subFieldMeta.type = 'tags';
                                }
                            } else if (subFieldMeta.type === 'model') {
                                subFieldMeta.type = 'object';
                            }
                        }

                        var compositeFieldId = fieldId + '.' + subField;
                        if (controlsByField[compositeFieldId] && controlsByField[compositeFieldId].length > 0) {
                            //composite field was already defined as part of fields and control is already available

                        } else {
                            var node = createNodeForMetaDefn(subFieldMeta);
                            if (node) {
                                nodesForField.push({
                                    fieldId: compositeFieldId,
                                    node: node,
                                    fieldMeta: subFieldMeta
                                });
                            }
                        }
                    });
                } else {
                    var node = createNodeForMetaDefn(fmeta);
                    if (node) {
                        nodesForField.push({
                            fieldId: fieldId,
                            node: node,
                            fieldMeta: fmeta
                        });
                    }
                }

                nodesForField.forEach(function (item) {
                    var container;
                    setAttributesOnNode(item.node, item.fieldId, item.fieldMeta, uimeta, defaultInject, false);
                    if (item.fieldMeta.container) {
                        container = templateCont.deepQuery('#' + item.fieldMeta.container);
                        container = container || defaultInject;
                        // if fmeta.container not defined and node type is oe-DATA-TABLE then the grid should render in grids container of default form
                    } else if (item.node.nodeName === 'OE-DATA-TABLE') {
                        container = templateCont.deepQuery('#grids');
                        container = container || defaultInject;
                    } else {
                        container = defaultInject;
                    }
                    container.appendChild(item.node);
                    controlsByField[item.fieldId] = controlsByField[item.fieldId] || [];
                    controlsByField[item.fieldId].push(item.node);
                });
            });
        }


        //append validations
        for (i = 0; i < oeValidations.length; i++) {
            var validation = oeValidations[i];

            var validationElement = createNodeForElement(validation.type);

            validationElement.setAttribute('model', '{{' + uimeta.modelAlias + '}}');
            validationElement.setAttribute('fields', JSON.stringify(validation.fields));
            if (validation.error) {
                validationElement.setAttribute('error', validation.error);
            }
            if (validation.expression) {
                //oe-expression-validator
                validationElement.setAttribute('expression', validation.expression);
            }
            if (validation.combinations) {
                //oe-combination-validator
                validationElement.setAttribute('combinations', JSON.stringify(validation.combinations));
            }
            if (validation.requesturl) {
                //oe-async-validator
                validationElement.setAttribute('requesturl', validation.requesturl);
            }
            templateCont.appendChild(validationElement);
        }
        uimeta.defaultVM = Object.assign(defaultVM, personalizedVM);
    }

    mixmeta(uimeta);

    /**
     * Sets the modifications speicifed by 'elements' (fetched from UIElements model) of the uimeta.
     * 
     * @param {Object} uimeta Meta data for the form.
     */
    function setAttributesOnElements(uimeta) {
        uimeta.elements && Object.keys(uimeta.elements).forEach(function (fieldId) {
            var elementData = uimeta.elements[fieldId];
            elementData.fieldId = elementData.fieldId || fieldId;
            var controls = controlsByField[fieldId];
            if (!controls) {
                var query = fieldId.startsWith('@') ? fieldId.substr(1, fieldId.length) : '' + fieldId;
                controls = templateCont.querySelectorAll(query);
            }
            for (var i = 0; i < controls.length; i++) {
                setAttributesOnNode(controls[i], fieldId, elementData, uimeta, null, true);
            }
        });
    }

    if (uimeta.elements) {
        setAttributesOnElements(uimeta);
    }
};


/**
 * Updates the template and element prototype based on the meta data ,
 * and generates a custom element
 * @param {string} eleName Name of the element
 * @param {Function} eleClass A class object that defines the behaviour of the element.
 * @param {Object} options options on defining like {extend:'button'}
 */
window.customElements.metadefine = function (eleName, eleClass, options) {

    var uimeta;
    var templateClone = eleClass.template.cloneNode(true);

    // registering meta- polymer with polymer
    function registerPolymerElement() {

        var elemProperties = eleClass.prototype.properties || {};

        //adding modelAlias poperty along with the other properties
        elemProperties[uimeta.modelAlias] = elemProperties[uimeta.modelAlias] || {
            type: Object,
            notify: true
        };
        //if values are given they are set to the controls
        elemProperties[uimeta.modelAlias].value = elemProperties[uimeta.modelAlias].value || function () {
            var self = this;
            var ret = uimeta.defaultVM; //JSON.parse(JSON.stringify(uimeta.defaultVM));
            uimeta.dynamicDefaults && uimeta.dynamicDefaults.forEach(function (item) {
                if (item.value && item.value.startsWith('@w.')) {
                    var fieldValue = OEUtils.deepValue(window, item.value.substr(3));
                    OEUtils.setDeepValue(ret, item.field,
                        fieldValue ? JSON.parse(JSON.stringify(fieldValue)) : fieldValue);
                } else if (item.value && item.value.startsWith('@t.')) {
                    OEUtils.setDeepValue(ret, item.field,
                        JSON.parse(JSON.stringify(self.get(item.value.substr(3))))
                    );
                }
            });
            return JSON.parse(JSON.stringify(ret));
        };

        if (uimeta.polymerConfig) {
            // Polymer behaviors not supported as of now
            // for(var i = 0; uimeta.polymerConfig.behaviors && i < uimeta.polymerConfig.behaviors.length; i++) {
            //     prototype.behaviors.push(OEUtils.deepValue(window, uimeta.polymerConfig.behaviors[i]));
            // }

            uimeta.polymerConfig.functions && Object.keys(uimeta.polymerConfig.functions).forEach(function (funcName) {
                eleClass.prototype[funcName] = OEUtils.createFunction(uimeta.polymerConfig.functions[funcName]);
            });

            uimeta.polymerConfig.properties && Object.keys(uimeta.polymerConfig.properties).forEach(function (propName) {
                elemProperties[propName] = uimeta.polymerConfig.properties[propName];
            });

            // Listeners support is deprecated and should be handled on connectedCallback
            // uimeta.polymerConfig.listeners && Object.keys(uimeta.polymerConfig.listeners).forEach(function(eventName) {
            //     prototype.listeners = prototype.listeners || {};
            //     prototype.listeners[eventName] = uimeta.polymerConfig.listeners[eventName];
            // });
        }


        var observersList = [];
        if (typeof eleClass.prototype._clearAllErrors === "function") {
            observersList = ['_clearAllErrors(' + uimeta.modelAlias + ')'];
        }


        var tempClass = class extends OEUtilityMixin(MetaMixin(eleClass)) {

            //Incase of form validation mixin was used , add '_clearAllErrors' when main model data is set.
            static get observers() {
                return observersList;
            }

            /**
             * Returns the generated template
             */
            static get template() {
                return templateClone;
            }

            /**
             * For development purpose the modified template is cloned and saved
             */
            static get metaTemplate() {
                return templateClone.cloneNode(true);
            }

            static get properties() {
                return elemProperties;
            }

            static get is() {
                return eleName;
            }
        };

        window.customElements.define(eleName, tempClass, options);
    }
    /*Polymer is registered with MetaPolymer */



    // Populate modelDefCache
    function populateModelDefCache(uimeta) {
        if (uimeta.metadata && uimeta.metadata.models) {
            var models = uimeta.metadata.models;
            Object.keys(models).forEach(function (modelName) {
                if (!OEUtils.modelDefCache[modelName]) {
                    OEUtils.modelDefCache[modelName] = models[modelName];
                }
            });
        }
    }

    // Check if the meta data is present in the global object else fetch it from server
    if (!OEUtils.metadataCache[eleName]) {
        var url = restApiRoot + '/UIComponents/modelmeta/' + eleName;
        url = OEUtils.geturl(url);
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (xhttp.readyState === 4 && xhttp.status === 200) {
                uimeta = JSON.parse(xhttp.responseText);
                OEUtils.metadataCache[eleName] = uimeta;
                populateModelDefCache(uimeta);
                OEUtils.Metamorph(templateClone, uimeta, eleClass);
                registerPolymerElement();
            }
        };

        xhttp.open('GET', url, true);
        xhttp.setRequestHeader('Content-Type', 'application/json;charset=encoding');
        xhttp.send();
    } else {
        uimeta = OEUtils.metadataCache[eleName];
        populateModelDefCache(uimeta);
        OEUtils.Metamorph(templateClone, uimeta, eleClass);
        registerPolymerElement();
    }

};